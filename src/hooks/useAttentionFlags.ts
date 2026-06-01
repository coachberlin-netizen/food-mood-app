"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export type AttentionFlag = {
  id:              string
  flag_type:       string
  severity:        "soft" | "moderate"
  evidence:        Record<string, unknown>
  detected_at:     string
  reviewed_at:     string | null
  dismissed_at:    string | null
}

const FLAG_LABELS: Record<string, string> = {
  guilt_language_pattern:              "Lenguaje de autocrítica intensa",
  persistent_low_energy_state:         "Estado de baja energía persistente",
  recurring_elevated_anxiety:          "Activación ansiosa recurrente",
  persistent_body_disconnection:       "Desconexión corporal persistente",
  repeated_emotional_eating_episodes:  "Episodios repetidos de alimentación emocional",
  restriction_signals:                 "Indicadores de restricción",
  multiple_distress_indicators:        "Múltiples indicadores de dificultad",
}

export function getFlagLabel(flagType: string): string {
  return FLAG_LABELS[flagType] ?? flagType
}

// ── Hook for patient detail page ──────────────────────────────────────────────

export function usePatientAttentionFlags(patientUserId: string): {
  flags:   AttentionFlag[]
  loading: boolean
  review:  (flagId: string) => Promise<void>
  dismiss: (flagId: string) => Promise<void>
  refresh: () => void
} {
  const [flags,   setFlags]   = useState<AttentionFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [tick,    setTick]    = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("professional_attention_flags")
      .select("id, flag_type, severity, evidence, detected_at, reviewed_at, dismissed_at")
      .eq("patient_user_id", patientUserId)
      .eq("is_active", true)
      .order("detected_at", { ascending: false })
      .then(({ data }) => {
        setFlags((data ?? []) as AttentionFlag[])
        setLoading(false)
      })
  }, [patientUserId, tick])

  const review = useCallback(async (flagId: string) => {
    const supabase = createClient()
    await supabase
      .from("professional_attention_flags")
      .update({ reviewed_at: new Date().toISOString() })
      .eq("id", flagId)
    setTick(t => t + 1)
  }, [])

  const dismiss = useCallback(async (flagId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase
      .from("professional_attention_flags")
      .update({ dismissed_at: new Date().toISOString(), dismissed_by: user?.id, is_active: false })
      .eq("id", flagId)
    setFlags(prev => prev.filter(f => f.id !== flagId))
  }, [])

  return { flags, loading, review, dismiss, refresh: () => setTick(t => t + 1) }
}

// ── Hook for patient list + dashboard (summary per patient) ───────────────────

export function useAttentionFlagsSummary(): {
  summary:          Map<string, "soft" | "moderate">
  patientsWithFlags: number
  loading:          boolean
} {
  const [summary, setSummary] = useState<Map<string, "soft" | "moderate">>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("professional_attention_flags")
      .select("patient_user_id, severity")
      .eq("is_active", true)
      .then(({ data }) => {
        const rows = (data ?? []) as { patient_user_id: string; severity: "soft" | "moderate" }[]
        const map = new Map<string, "soft" | "moderate">()
        for (const { patient_user_id, severity } of rows) {
          const current = map.get(patient_user_id)
          if (!current || severity === "moderate") map.set(patient_user_id, severity)
        }
        setSummary(map)
        setLoading(false)
      })
  }, [])

  return { summary, patientsWithFlags: summary.size, loading }
}
