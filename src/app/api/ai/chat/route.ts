import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'

export const dynamic = 'force-dynamic'

const MAX_MESSAGE_LENGTH = 1000
const MAX_HISTORY_MESSAGES = 20

const SYSTEM_PROMPT =
  'You are Food·Mood, a Spanish-first wellbeing assistant focused on functional food, gut-brain nutrition, pleasure-based habit formation and emotional wellbeing. You help users choose recipes, rituals and daily habits according to how they feel. You speak warmly, clearly and practically. You do not diagnose, treat or cure disease. You do not make medical claims. You do not replace a doctor, dietitian, psychologist or healthcare professional. When a user describes severe symptoms, eating disorders, self-harm, pregnancy complications, medication questions or medical conditions, you recommend professional help and keep guidance general and safe. Your core philosophy: pleasure creates repetition, repetition creates habit, and habit creates change. Keep responses practical, short and encouraging.'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function isChatMessage(m: unknown): m is ChatMessage {
  if (m === null || typeof m !== 'object') return false
  const msg = m as Record<string, unknown>
  return (
    (msg.role === 'user' || msg.role === 'assistant') &&
    typeof msg.content === 'string' &&
    msg.content.trim().length > 0
  )
}

export async function POST(req: NextRequest) {
  // 1. Server-side authentication — JWT verified via cookie, never trusts frontend
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. Subscription check — AI is NEVER called for unpaid users
  const isPremium = await getPremiumStatus(supabase, user.id)
  if (!isPremium) {
    return NextResponse.json({ error: 'Suscripción activa requerida' }, { status: 403 })
  }

  // 3. Parse and validate body
  let body: { messages?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: 'Mensajes requeridos' }, { status: 400 })
  }

  const validMessages: ChatMessage[] = (body.messages as unknown[])
    .slice(-MAX_HISTORY_MESSAGES)
    .filter(isChatMessage)
    .map(m => ({ role: m.role, content: m.content.trim() }))

  if (validMessages.length === 0) {
    return NextResponse.json({ error: 'Sin mensajes válidos' }, { status: 400 })
  }

  const lastMsg = validMessages[validMessages.length - 1]
  if (lastMsg.role !== 'user') {
    return NextResponse.json({ error: 'El último mensaje debe ser del usuario' }, { status: 400 })
  }
  if (lastMsg.content.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 400 })
  }

  // 4. AI call — only reachable by authenticated, subscribed users
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Servicio de IA no disponible' }, { status: 503 })
  }

  try {
    const anthropic = new Anthropic({ apiKey })
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: validMessages,
    })

    const reply = response.content[0]?.type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[api/ai/chat] error:', err)
    return NextResponse.json({ error: 'Error del servicio de IA' }, { status: 502 })
  }
}
