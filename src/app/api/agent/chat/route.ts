import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSessionClient } from '@/lib/supabase/server'
import { loadSystemPrompt } from '@/agent/load-prompt'
import { buildSystemPromptWithContext } from '@/agent/build-context'
import { retrieveForPrompt } from '@/agent/rag'
import { runSafetyChecks } from '@/agent/safety-middleware'
import type { UserHealthProfile } from '@/agent/safety-middleware'
import type { AgentRequest } from '@/agent/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL           = 'claude-haiku-4-5-20251001'
const MAX_TOKENS      = 2048
const MONTHLY_QUOTA   = 100

const EUR_PER_TOK_IN  = 0.00000025
const EUR_PER_TOK_OUT = 0.00000125

function calcCostEur(tokIn: number, tokOut: number): number {
  return tokIn * EUR_PER_TOK_IN + tokOut * EUR_PER_TOK_OUT
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const t0 = Date.now()

  // ── 1. Body ────────────────────────────────────────────────────────────────
  let body: AgentRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const moodCategoria = body.mood?.categoria ?? body.userText
  const mensaje       = body.userText
  const moodTextoLibre = body.mood?.texto_libre

  if (!mensaje) {
    return NextResponse.json({ error: 'missing_fields: userText' }, { status: 400 })
  }

  // ── 2. Autenticación ───────────────────────────────────────────────────────
  const session = await createSessionClient()
  const { data: { user }, error: authErr } = await session.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const service = serviceClient()

  // ── 3. Gate de membresía (sin LLM para no miembros) ───────────────────────
  const [{ data: profile }, { data: sub }] = await Promise.all([
    service.from('profiles').select('is_premium, premium_level').eq('id', user.id).single(),
    service.from('subscriptions').select('status').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
  ])

  const isPremium =
    sub?.status === 'active' ||
    profile?.is_premium === true ||
    (profile?.premium_level ?? 0) > 0

  if (!isPremium) {
    return NextResponse.json({ error: 'premium_required' }, { status: 402 })
  }

  // ── 4. Cupo mensual: 100 interacciones ────────────────────────────────────
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await service
    .from('agent_interactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())

  if ((count ?? 0) >= MONTHLY_QUOTA) {
    return NextResponse.json(
      { error: 'quota_exceeded', limite: MONTHLY_QUOTA },
      { status: 429 },
    )
  }

  // ── 5. Perfil de salud ────────────────────────────────────────────────────
  const { data: hp } = await service
    .from('user_health_profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const safeProfile: UserHealthProfile & {
    edad?: number; sexo?: string; pais?: string
    restricciones_dieteticas?: string[]
    objetivos_longevidad?: string[]
    habitos_ayuno?: string
  } = {
    alergias:                 hp?.alergias                 ?? [],
    intolerancias:            hp?.intolerancias            ?? [],
    medicacion:               hp?.medicacion               ?? [],
    condiciones:              hp?.condiciones              ?? [],
    embarazo_lactancia:       hp?.embarazo_lactancia       ?? false,
    edad:                     hp?.edad,
    sexo:                     hp?.sexo,
    pais:                     hp?.pais,
    restricciones_dieteticas: hp?.restricciones_dieteticas,
    objetivos_longevidad:     hp?.objetivos_longevidad,
    habitos_ayuno:            hp?.habitos_ayuno,
  }

  // ── 6. RAG ────────────────────────────────────────────────────────────────
  const { foodmood, longevidad } = await retrieveForPrompt(mensaje).catch(
    () => ({ foodmood: '', longevidad: '' }),
  )

  // ── 7. System prompt ──────────────────────────────────────────────────────
  const systemPrompt = buildSystemPromptWithContext(loadSystemPrompt(), {
    profile:              safeProfile,
    moodCategoria,
    moodTextoLibre,
    fragmentosFoodMood:   foodmood   || undefined,
    fragmentosLongevidad: longevidad || undefined,
  })

  // ── 8. Claude con reintento ───────────────────────────────────────────────
  let rawLLM: unknown
  let tokensIn  = 0
  let tokensOut = 0

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const completion = await anthropic.messages.create({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: mensaje }],
      })

      const text = completion.content[0].type === 'text' ? completion.content[0].text : ''
      tokensIn  = completion.usage.input_tokens
      tokensOut = completion.usage.output_tokens

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('no_json_in_response')
      rawLLM = JSON.parse(jsonMatch[0])
      break
    } catch {
      if (attempt === 1) {
        return NextResponse.json({ error: 'llm_unavailable' }, { status: 502 })
      }
    }
  }

  // ── 9. Safety middleware ──────────────────────────────────────────────────
  const safety = runSafetyChecks(rawLLM, safeProfile)
  if (!safety.ok) {
    return NextResponse.json({ error: safety.error }, { status: safety.statusCode ?? 500 })
  }

  // ── 10. Log ───────────────────────────────────────────────────────────────
  const modo = safety.response?.modo ?? 'unknown'
  const nivel_evidencia =
    safety.response?.modo === 'recomendacion'
      ? safety.response.microcontenido.nivel_evidencia
      : null

  await service.from('agent_interactions').insert({
    user_id:        user.id,
    tokens_in:      tokensIn,
    tokens_out:     tokensOut,
    cost_eur:       calcCostEur(tokensIn, tokensOut),
    latency_ms:     Date.now() - t0,
    model:          MODEL,
    modo,
    nivel_evidencia,
  })

  if (safety.flagged) {
    console.warn(`[agent:flag] ${safety.flagged} user=${user.id}`)
  }

  return NextResponse.json(safety.response, { status: 200 })
}
