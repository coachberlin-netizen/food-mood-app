import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { NUDGE_GENERATION_PROMPT } from "@/lib/behavioral/prompts"
import logger from "@/lib/logger"

const MAX_NUDGE_AGE_H = 20 // no generar nuevo nudge si hay uno de menos de 20h

type Pattern =
  | { type: "hambre_emocional_alta"; hour_range: string; avg: number }
  | { type: "post_meal_collapse"; meal_count: number }
  | { type: "granularity_declining"; recent_avg: number; prev_avg: number }
  | { type: "inactivity"; days_since: number }
  | { type: "plan_success"; plan_id: string; completions: number }

async function detectPatterns(supabase: SupabaseClient<any>, userId: string): Promise<Pattern | null> {
  const since14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const since7  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString()
  const since3  = new Date(Date.now() -  3 * 24 * 60 * 60 * 1000).toISOString()

  // 1. Inactividad: sin registros en 3 días
  const [ic3, egl3, sd3] = await Promise.all([
    supabase.from("interoceptive_checkins").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("logged_at", since3),
    supabase.from("emotion_granularity_logs").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("logged_at", since3),
    supabase.from("socratic_dialogues").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("started_at", since3),
  ])
  const recentActivity = (ic3.count ?? 0) + (egl3.count ?? 0) + (sd3.count ?? 0)
  if (recentActivity === 0) {
    const { count: totalCount } = await supabase
      .from("interoceptive_checkins").select("id", { count: "exact", head: true }).eq("user_id", userId)
    if ((totalCount ?? 0) > 0) {
      return { type: "inactivity", days_since: 3 }
    }
  }

  // 2. Hambre emocional alta recurrente en franja horaria
  const { data: hungerRaw } = await supabase
    .from("hunger_thermometer_logs")
    .select("emotional_hunger, logged_at")
    .eq("user_id", userId)
    .gte("logged_at", since14)
    .gte("emotional_hunger", 7)
  const hungerLogs = (hungerRaw ?? []) as { emotional_hunger: number; logged_at: string }[]
  if (hungerLogs.length >= 3) {
    const hours = hungerLogs.map(l => new Date(l.logged_at).getUTCHours())
    const hourMap: Record<number, number> = {}
    hours.forEach(h => { hourMap[h] = (hourMap[h] ?? 0) + 1 })
    const peak = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]
    if (peak && peak[1] >= 2) {
      const h = parseInt(peak[0])
      return {
        type: "hambre_emocional_alta",
        hour_range: `${h}:00–${h + 1}:00`,
        avg: Math.round(hungerLogs.reduce((s, l) => s + l.emotional_hunger, 0) / hungerLogs.length * 10) / 10,
      }
    }
  }

  // 3. Colapso post-comida: estados dorsales en check-ins recientes
  const { data: collapseRaw } = await supabase
    .from("interoceptive_checkins")
    .select("nervous_system_state")
    .eq("user_id", userId)
    .gte("logged_at", since7)
    .in("nervous_system_state", ["dorsal_freeze", "dorsal_collapse"])
  const collapseCheckins = (collapseRaw ?? []) as { nervous_system_state: string }[]
  if (collapseCheckins.length >= 2) {
    return { type: "post_meal_collapse", meal_count: collapseCheckins.length }
  }

  // 4. Granularidad emocional descendente
  const { data: granRaw } = await supabase
    .from("emotion_granularity_logs")
    .select("granularity_score, logged_at")
    .eq("user_id", userId)
    .gte("logged_at", since14)
    .order("logged_at", { ascending: false })
    .limit(10)
  const granLogs = (granRaw ?? []) as { granularity_score: number; logged_at: string }[]
  if (granLogs.length >= 6) {
    const recent = granLogs.slice(0, 3)
    const prev   = granLogs.slice(3, 6)
    const recentAvg = recent.reduce((s, g) => s + g.granularity_score, 0) / recent.length
    const prevAvg   = prev.reduce((s, g) => s + g.granularity_score, 0) / prev.length
    if (prevAvg - recentAvg >= 1) {
      return { type: "granularity_declining", recent_avg: Math.round(recentAvg * 10) / 10, prev_avg: Math.round(prevAvg * 10) / 10 }
    }
  }

  // 5. Éxito con plan if-then
  const { data: plansRaw } = await supabase
    .from("implementation_intentions")
    .select("id, times_completed")
    .eq("user_id", userId)
    .eq("is_active", true)
    .gte("times_completed", 1)
    .order("times_completed", { ascending: false })
    .limit(1)
  const plans = (plansRaw ?? []) as { id: string; times_completed: number }[]
  if (plans.length > 0) {
    return { type: "plan_success", plan_id: plans[0].id, completions: plans[0].times_completed }
  }

  return null
}

function patternToContext(p: Pattern): string {
  switch (p.type) {
    case "hambre_emocional_alta":
      return `Patrón: hambre emocional alta recurrente. Franja horaria: ${p.hour_range}. Promedio intensidad: ${p.avg}/10. Contexto: la persona registra hambre emocional alta en esa franja de forma repetida en los últimos 14 días.`
    case "post_meal_collapse":
      return `Patrón: estado de baja energía o colapso (dorsal freeze/collapse) en los últimos 7 días, detectado ${p.meal_count} veces en los check-ins interoceptivos.`
    case "granularity_declining":
      return `Patrón: granularidad emocional descendente. Promedio reciente: ${p.recent_avg}/5. Promedio anterior: ${p.prev_avg}/5. La persona estaba discriminando mejor sus emociones hace unos días.`
    case "inactivity":
      return `Patrón: la persona no ha hecho ningún registro en los últimos ${p.days_since} días, aunque anteriormente usaba las herramientas.`
    case "plan_success":
      return `Patrón: la persona ha completado con éxito su plan if-then ${p.completions} vece${p.completions !== 1 ? "s" : ""}. Merece reconocimiento positivo.`
  }
}

async function generateNudge(pattern: Pattern): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return ""

  const anthropic = new Anthropic({ apiKey })
  const context = patternToContext(pattern)

  const response = await anthropic.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 120,
    system: NUDGE_GENERATION_PROMPT,
    messages: [{ role: "user", content: context }],
  })

  return response.content[0]?.type === "text" ? response.content[0].text.trim() : ""
}

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase: SupabaseClient<any> = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get users with activity in the last 14 days
  const since14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const { data: activeUsers } = await supabase
    .from("interoceptive_checkins")
    .select("user_id")
    .gte("logged_at", since14)

  const uniqueUserIds = [...new Set((activeUsers ?? []).map(r => r.user_id))]

  let generated = 0
  let skipped   = 0

  for (const userId of uniqueUserIds) {
    try {
      // Skip if recent nudge already exists
      const recentCutoff = new Date(Date.now() - MAX_NUDGE_AGE_H * 60 * 60 * 1000).toISOString()
      const { count: recentCount } = await supabase
        .from("adaptive_nudges_log")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("generated_at", recentCutoff)

      if ((recentCount ?? 0) > 0) { skipped++; continue }

      const pattern = await detectPatterns(supabase, userId)
      if (!pattern) { skipped++; continue }

      const nudgeContent = await generateNudge(pattern)
      if (!nudgeContent) { skipped++; continue }

      await supabase.from("adaptive_nudges_log").insert({
        user_id:          userId,
        pattern_detected: pattern.type,
        nudge_type:       "dashboard_card",
        nudge_content:    nudgeContent,
      })

      generated++
    } catch (err) {
      logger.error({ err, userId }, "cron/nudges: error procesando usuario")
    }
  }

  logger.info({ generated, skipped, total: uniqueUserIds.length }, "cron/nudges: completado")
  return NextResponse.json({ ok: true, generated, skipped, total: uniqueUserIds.length })
}
