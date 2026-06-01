import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js"
import logger from "@/lib/logger"

type FlagType =
  | "guilt_language_pattern"
  | "persistent_low_energy_state"
  | "recurring_elevated_anxiety"
  | "persistent_body_disconnection"
  | "repeated_emotional_eating_episodes"
  | "restriction_signals"
  | "multiple_distress_indicators"

type DetectedFlag = {
  flag_type:  FlagType
  severity:   "soft" | "moderate"
  evidence:   Record<string, unknown>
}

// ── Detection rules ───────────────────────────────────────────────────────────

const GUILT_KEYWORDS = [
  "culpa", "culpable", "merezco", "no merezco", "vergüenza", "vergonzoso",
  "asco de mí", "soy un desastre", "soy horrible", "soy lo peor", "odio cómo",
]

const RESTRICTION_KEYWORDS = [
  "no comí", "me salté", "ayun", "compensar", "castigarm", "castigar",
  "no pud", "vomit", "purgar", "no puedo comer", "no debería haber comido",
]

async function detectGuiltLanguage(
  supabase: SupabaseClient, patientId: string, since: string,
): Promise<DetectedFlag | null> {
  const { data } = await supabase
    .from("socratic_dialogues")
    .select("id, started_at, initial_thought")
    .eq("user_id", patientId)
    .gte("started_at", since)

  const rows = (data ?? []) as { id: string; started_at: string; initial_thought: string }[]
  const matches = rows.filter(r =>
    GUILT_KEYWORDS.some(kw => r.initial_thought.toLowerCase().includes(kw))
  )
  if (matches.length < 2) return null

  return {
    flag_type: "guilt_language_pattern",
    severity:  matches.length >= 4 ? "moderate" : "soft",
    evidence:  {
      count:     matches.length,
      window_days: 14,
      sample:    matches.slice(0, 3).map(r => ({ date: r.started_at.split("T")[0], excerpt: r.initial_thought.slice(0, 80) })),
    },
  }
}

async function detectLowEnergy(
  supabase: SupabaseClient, patientId: string, since: string,
): Promise<DetectedFlag | null> {
  const { count } = await supabase
    .from("interoceptive_checkins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", patientId)
    .gte("logged_at", since)
    .in("nervous_system_state", ["dorsal_freeze", "dorsal_collapse"])

  const n = count ?? 0
  if (n < 3) return null

  return {
    flag_type: "persistent_low_energy_state",
    severity:  n >= 5 ? "moderate" : "soft",
    evidence:  { count: n, window_days: 14 },
  }
}

async function detectElevatedAnxiety(
  supabase: SupabaseClient, patientId: string, since: string,
): Promise<DetectedFlag | null> {
  const { count } = await supabase
    .from("interoceptive_checkins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", patientId)
    .gte("logged_at", since)
    .eq("nervous_system_state", "sympathetic_anxious")

  const n = count ?? 0
  if (n < 3) return null

  return {
    flag_type: "recurring_elevated_anxiety",
    severity:  n >= 5 ? "moderate" : "soft",
    evidence:  { count: n, window_days: 14 },
  }
}

async function detectBodyDisconnection(
  supabase: SupabaseClient, patientId: string, since: string,
): Promise<DetectedFlag | null> {
  const { count } = await supabase
    .from("interoceptive_checkins")
    .select("id", { count: "exact", head: true })
    .eq("user_id", patientId)
    .gte("logged_at", since)
    .lte("interoceptive_clarity", 3)

  const n = count ?? 0
  if (n < 4) return null

  return {
    flag_type: "persistent_body_disconnection",
    severity:  n >= 6 ? "moderate" : "soft",
    evidence:  { count: n, window_days: 14 },
  }
}

async function detectEmotionalEating(
  supabase: SupabaseClient, patientId: string, since: string,
): Promise<DetectedFlag | null> {
  const { count } = await supabase
    .from("hunger_thermometer_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", patientId)
    .gte("logged_at", since)
    .gte("emotional_hunger", 7)
    .eq("decided_to_eat", true)

  const n = count ?? 0
  if (n < 3) return null

  return {
    flag_type: "repeated_emotional_eating_episodes",
    severity:  n >= 5 ? "moderate" : "soft",
    evidence:  { count: n, window_days: 14 },
  }
}

async function detectRestrictionSignals(
  supabase: SupabaseClient, patientId: string, since: string,
): Promise<DetectedFlag | null> {
  const { data } = await supabase
    .from("hunger_thermometer_logs")
    .select("id, logged_at, context_notes")
    .eq("user_id", patientId)
    .gte("logged_at", since)
    .not("context_notes", "is", null)

  const rows = (data ?? []) as { id: string; logged_at: string; context_notes: string }[]
  const matches = rows.filter(r =>
    RESTRICTION_KEYWORDS.some(kw => (r.context_notes ?? "").toLowerCase().includes(kw))
  )
  if (matches.length < 2) return null

  return {
    flag_type: "restriction_signals",
    severity:  matches.length >= 3 ? "moderate" : "soft",
    evidence:  {
      count:     matches.length,
      window_days: 14,
      sample:    matches.slice(0, 3).map(r => ({ date: r.logged_at.split("T")[0] })),
    },
  }
}

// ── Upsert / deactivate logic ─────────────────────────────────────────────────

async function upsertFlag(
  supabase:       SupabaseClient,
  professionalId: string,
  patientId:      string,
  flag:           DetectedFlag,
): Promise<void> {
  // Check for recently dismissed flag (skip for 7 days after dismissal)
  const cooloffCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: recentDismiss } = await supabase
    .from("professional_attention_flags")
    .select("id")
    .eq("professional_id", professionalId)
    .eq("patient_user_id", patientId)
    .eq("flag_type", flag.flag_type)
    .eq("is_active", false)
    .not("dismissed_at", "is", null)
    .gte("dismissed_at", cooloffCutoff)
    .limit(1)
    .maybeSingle()

  if (recentDismiss) return

  // Check if active flag exists
  const { data: existing } = await supabase
    .from("professional_attention_flags")
    .select("id")
    .eq("professional_id", professionalId)
    .eq("patient_user_id", patientId)
    .eq("flag_type", flag.flag_type)
    .eq("is_active", true)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("professional_attention_flags")
      .update({ severity: flag.severity, evidence: flag.evidence, detected_at: new Date().toISOString() })
      .eq("id", existing.id)
  } else {
    await supabase
      .from("professional_attention_flags")
      .insert({
        professional_id: professionalId,
        patient_user_id: patientId,
        flag_type:       flag.flag_type,
        severity:        flag.severity,
        evidence:        flag.evidence,
      })
  }
}

async function deactivateFlag(
  supabase:       SupabaseClient,
  professionalId: string,
  patientId:      string,
  flagType:       FlagType,
): Promise<void> {
  await supabase
    .from("professional_attention_flags")
    .update({ is_active: false })
    .eq("professional_id", professionalId)
    .eq("patient_user_id", patientId)
    .eq("flag_type", flagType)
    .eq("is_active", true)
    .is("dismissed_at", null)
}

// ── Process one patient link ──────────────────────────────────────────────────

const RULE_TYPES: FlagType[] = [
  "guilt_language_pattern",
  "persistent_low_energy_state",
  "recurring_elevated_anxiety",
  "persistent_body_disconnection",
  "repeated_emotional_eating_episodes",
  "restriction_signals",
]

async function processPatient(
  supabase:       SupabaseClient,
  professionalId: string,
  patientId:      string,
): Promise<void> {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const [r1, r2, r3, r4, r5, r6] = await Promise.all([
    detectGuiltLanguage(supabase, patientId, since),
    detectLowEnergy(supabase, patientId, since),
    detectElevatedAnxiety(supabase, patientId, since),
    detectBodyDisconnection(supabase, patientId, since),
    detectEmotionalEating(supabase, patientId, since),
    detectRestrictionSignals(supabase, patientId, since),
  ])

  const results = [r1, r2, r3, r4, r5, r6]
  const triggered = results.filter(Boolean) as DetectedFlag[]

  // Rule 7: three or more distress indicators active simultaneously
  const multipleFlag: DetectedFlag | null = triggered.length >= 3
    ? {
        flag_type: "multiple_distress_indicators",
        severity:  "moderate",
        evidence:  {
          active_types:  triggered.map(f => f.flag_type),
          window_days:   14,
        },
      }
    : null

  // Upsert triggered flags, deactivate cleared ones
  await Promise.all(
    RULE_TYPES.map(async (ft, i) => {
      const flag = results[i]
      if (flag) {
        await upsertFlag(supabase, professionalId, patientId, flag)
      } else {
        await deactivateFlag(supabase, professionalId, patientId, ft)
      }
    }),
  )

  if (multipleFlag) {
    await upsertFlag(supabase, professionalId, patientId, multipleFlag)
  } else {
    await deactivateFlag(supabase, professionalId, patientId, "multiple_distress_indicators")
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase: SupabaseClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: links } = await supabase
    .from("professional_patient_links")
    .select("professional_id, patient_user_id")
    .eq("status", "active")

  const rows = (links ?? []) as { professional_id: string; patient_user_id: string }[]

  let processed = 0
  let errors    = 0

  for (const { professional_id, patient_user_id } of rows) {
    try {
      await processPatient(supabase, professional_id, patient_user_id)
      processed++
    } catch (err) {
      errors++
      logger.error({ err, patient_user_id }, "cron/attention-flags: error procesando paciente")
    }
  }

  logger.info({ processed, errors, total: rows.length }, "cron/attention-flags: completado")
  return NextResponse.json({ ok: true, processed, errors, total: rows.length })
}
