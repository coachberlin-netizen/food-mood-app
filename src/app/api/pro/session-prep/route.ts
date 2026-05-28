import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import logger from "@/lib/logger"
import { buildSystemPrompt, buildUserMessage, type SessionPrepOutput } from "@/lib/pro/session-prep-prompt"

const GenerateSchema = z.object({
  patient_user_id: z.string().uuid(),
})

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 })
  }

  const parsed = GenerateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos." }, { status: 400 })
  const { patient_user_id } = parsed.data

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .maybeSingle()
  if (!professional) return NextResponse.json({ error: "Perfil profesional no encontrado." }, { status: 403 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
    logger.error("session-prep: SUPABASE_SERVICE_ROLE_KEY no configurada")
    return NextResponse.json({ error: "Error de configuración del servidor." }, { status: 500 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Verify patient is linked to this professional
  const { data: link } = await admin
    .from("professional_patient_links")
    .select("linked_at")
    .eq("professional_id", professional.id)
    .eq("patient_user_id", patient_user_id)
    .eq("status", "active")
    .maybeSingle()
  if (!link) return NextResponse.json({ error: "Paciente no vinculado." }, { status: 403 })

  // Period: last 14 days
  const now = new Date()
  const periodEnd   = now.toISOString().split("T")[0]
  const since       = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const periodStart = since.split("T")[0]

  // Gather patient data in parallel (admin bypasses patient-only RLS)
  const [
    checkinsRes, granRes, diagRes, hambreRes, mealRes, intRes, nudgeRes, valRes,
  ] = await Promise.all([
    admin.from("interoceptive_checkins")
      .select("logged_at, nervous_system_state, interoceptive_clarity, dominant_sensation")
      .eq("user_id", patient_user_id).gte("logged_at", since).order("logged_at", { ascending: false }),
    admin.from("emotion_granularity_logs")
      .select("logged_at, initial_emotion_word, final_emotion_words, granularity_score")
      .eq("user_id", patient_user_id).gte("logged_at", since).order("logged_at", { ascending: false }),
    admin.from("socratic_dialogues")
      .select("started_at, initial_thought, final_alternative_thought, emotion_before, emotion_after, intensity_before, intensity_after")
      .eq("user_id", patient_user_id).gte("started_at", since).order("started_at", { ascending: false }),
    admin.from("hunger_thermometer_logs")
      .select("logged_at, physical_hunger, emotional_hunger, interoceptive_clarity, decided_to_eat, context_notes")
      .eq("user_id", patient_user_id).gte("logged_at", since).order("logged_at", { ascending: false }),
    admin.from("emotional_meal_logs")
      .select("logged_at, emotion_before, intensity_before, emotion_after, intensity_after, meal_description, post_nervous_system_state")
      .eq("user_id", patient_user_id).gte("logged_at", since).order("logged_at", { ascending: false }),
    admin.from("implementation_intentions")
      .select("trigger_situation, intended_action, linked_value, times_triggered, times_completed")
      .eq("user_id", patient_user_id).eq("is_active", true),
    admin.from("adaptive_nudges_log")
      .select("generated_at, pattern_detected, action_taken")
      .eq("user_id", patient_user_id).gte("generated_at", since).order("generated_at", { ascending: false }),
    admin.from("values_clarifications")
      .select("core_values, relationship_with_food_vision, committed_actions")
      .eq("user_id", patient_user_id).order("created_at", { ascending: false }).limit(1),
  ])

  const patientData = {
    checkins:    (checkinsRes.data  ?? []) as { logged_at: string; nervous_system_state: string; interoceptive_clarity: number; dominant_sensation: string | null }[],
    granularity: (granRes.data      ?? []) as { logged_at: string; initial_emotion_word: string; final_emotion_words: string[]; granularity_score: number }[],
    dialogues:   (diagRes.data      ?? []) as { started_at: string; initial_thought: string; final_alternative_thought: string | null; emotion_before: string | null; emotion_after: string | null; intensity_before: number | null; intensity_after: number | null }[],
    hambre:      (hambreRes.data    ?? []) as { logged_at: string; physical_hunger: number; emotional_hunger: number; interoceptive_clarity: number; decided_to_eat: boolean; context_notes: string | null }[],
    meals:       (mealRes.data      ?? []) as { logged_at: string; emotion_before: string; intensity_before: number; emotion_after: string; intensity_after: number; meal_description: string | null; post_nervous_system_state: string | null }[],
    intentions:  (intRes.data       ?? []) as { trigger_situation: string; intended_action: string; linked_value: string | null; times_triggered: number; times_completed: number }[],
    nudges:      (nudgeRes.data     ?? []) as { generated_at: string; pattern_detected: string; action_taken: boolean }[],
    values:      (valRes.data       ?? []) as { core_values: string[]; relationship_with_food_vision: string; committed_actions: string[] }[],
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Error de configuración del servidor." }, { status: 500 })
  }

  const anthropic   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const systemPrompt = buildSystemPrompt()
  const userMessage  = buildUserMessage(patientData, periodStart, periodEnd)

  const startMs = Date.now()
  let claudeRes: Awaited<ReturnType<typeof anthropic.messages.create>>
  try {
    claudeRes = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 1500,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userMessage }],
    })
  } catch (err) {
    logger.error({ err }, "session-prep: error llamando a Claude")
    return NextResponse.json({ error: "Error al generar el informe." }, { status: 502 })
  }
  const latencyMs = Date.now() - startMs

  const rawText = claudeRes.content[0].type === "text" ? claudeRes.content[0].text.trim() : ""
  // Strip possible markdown code fences that Claude sometimes adds despite instructions
  const jsonText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  let output: SessionPrepOutput
  try {
    output = JSON.parse(jsonText) as SessionPrepOutput
  } catch {
    logger.error({ rawText }, "session-prep: Claude devolvió JSON inválido")
    return NextResponse.json({ error: "Error al procesar el informe. Inténtalo de nuevo." }, { status: 502 })
  }

  // Log AI usage (non-blocking)
  const tokensIn  = claudeRes.usage.input_tokens
  const tokensOut = claudeRes.usage.output_tokens
  const costEur   = Math.round((tokensIn * 0.000003 + tokensOut * 0.000015) * 0.92 * 100000) / 100000
  Promise.resolve(
    admin.from("agent_interactions").insert({
      user_id:         user.id,
      tokens_in:       tokensIn,
      tokens_out:      tokensOut,
      cost_eur:        costEur,
      latency_ms:      latencyMs,
      model:           "claude-sonnet-4-6",
      modo:            "session_prep",
      nivel_evidencia: null,
    })
  ).catch(() => {})

  const { data: prep, error: insertErr } = await admin
    .from("session_preps")
    .insert({
      professional_id:     professional.id,
      patient_user_id,
      period_start:        periodStart,
      period_end:          periodEnd,
      weekly_summary:      output.weekly_summary      ?? "",
      key_patterns:        output.key_patterns        ?? [],
      suggested_questions: output.suggested_questions ?? [],
      intervention_points: output.intervention_points ?? [],
      model_used:          "claude-sonnet-4-6",
    })
    .select()
    .single()

  if (insertErr) {
    logger.error({ err: insertErr }, "session-prep: error guardando el informe")
    return NextResponse.json({ error: "Error al guardar el informe." }, { status: 500 })
  }

  return NextResponse.json({ id: prep.id, ...output })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patient_user_id = searchParams.get("patient_user_id")
  if (!patient_user_id) return NextResponse.json({ error: "patient_user_id requerido." }, { status: 400 })

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  const { data: preps, error } = await supabase
    .from("session_preps")
    .select("id, created_at, period_start, period_end, weekly_summary")
    .eq("patient_user_id", patient_user_id)
    .order("created_at", { ascending: false })

  if (error) {
    logger.error({ err: error }, "session-prep GET: error cargando historial")
    return NextResponse.json({ error: "Error al cargar el historial." }, { status: 500 })
  }

  return NextResponse.json({ preps: preps ?? [] })
}
