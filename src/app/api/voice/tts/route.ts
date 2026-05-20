import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM'
const MAX_CHARS = 600

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'TTS not configured' }, { status: 500 })

  // Premium check
  const [{ data: profile }, { data: sub }] = await Promise.all([
    supabase.from('profiles').select('is_premium, premium_level').eq('id', user.id).single(),
    supabase.from('subscriptions').select('status').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
  ])
  const isPremium = sub?.status === 'active' || profile?.is_premium || (profile?.premium_level ?? 0) > 0
  if (!isPremium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  const body = await req.json()
  const text: string = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_CHARS) : ''
  if (!text) return NextResponse.json({ error: 'No text' }, { status: 400 })

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.80,
          style: 0.10,
        },
      }),
    },
  )

  if (!upstream.ok) {
    const err = await upstream.text().catch(() => upstream.status.toString())
    console.error('[TTS] ElevenLabs error:', err)
    return NextResponse.json({ error: 'TTS upstream failed' }, { status: 502 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
