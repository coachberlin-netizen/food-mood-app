import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Upsert into leads table (create if not exists)
    const { error } = await supabase
      .from('leads')
      .upsert(
        { email: email.toLowerCase().trim(), source: source || 'quiz', created_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('Lead save error:', error)
      // Don't fail the request — email capture should be best-effort
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // Never block the user
  }
}
