"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { moods } from "@/data/moods"

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "conductual" | "prescripciones" | "sesiones" | "asignaciones"

type TherapeuticAssignment = {
  id: string
  tool_slug: string
  title: string
  instruction: string
  frequency_per_week: number
  due_date: string | null
  is_active: boolean
  created_at: string
  completions_this_week: number
}

type SessionPrep = {
  id: string
  created_at: string
  period_start: string
  period_end: string
  weekly_summary: string | null
}

type Prescription = {
  id: string
  prescribed_at: string
  read_at: string | null
  professional_note: string | null
  content_library: { title: string; content_type: string }[]
}

type HambreLog = {
  id: string; logged_at: string
  physical_hunger: number; emotional_hunger: number
  interoceptive_clarity: number; decided_to_eat: boolean
  context_notes: string | null
}

type MealLog = {
  id: string; logged_at: string
  emotion_before: string; intensity_before: number
  emotion_after: string; intensity_after: number
  meal_description: string | null
  post_nervous_system_state: string | null
  body_change: string | null
}

type ValuesLog = {
  id: string; created_at: string
  core_values: string[]
  relationship_with_food_vision: string
  committed_actions: string[]
}

type IntentionLog = {
  id: string; created_at: string
  trigger_situation: string; intended_action: string
  linked_value: string | null
  times_triggered: number; times_completed: number
  is_active: boolean
}

type NudgeLog = {
  id: string; generated_at: string; delivered_at: string | null
  opened_at: string | null; pattern_detected: string
  nudge_content: string; action_taken: boolean
}

type CheckIn = {
  id: string
  logged_at: string
  nervous_system_state: string
  interoceptive_clarity: number
  dominant_sensation: string | null
}

type GranularityLog = {
  id: string
  logged_at: string
  initial_emotion_word: string
  final_emotion_words: string[]
  granularity_score: number
}

type OracleCheckin = {
  id: string
  created_at: string
  primary_emotion: string
  secondary_emotion: string | null
}

type SocraticDialogue = {
  id: string
  started_at: string
  ended_at: string | null
  initial_thought: string
  final_alternative_thought: string | null
  emotion_before: string | null
  emotion_after:  string | null
  intensity_before: number | null
  intensity_after:  number | null
  conversation: { role: string; content: string }[]
}

// ── Static config ─────────────────────────────────────────────────────────────

const TAB_LABELS: Record<Tab, string> = {
  conductual:     "Herramientas conductuales",
  prescripciones: "Prescripciones",
  sesiones:       "Sesiones",
  asignaciones:   "Asignaciones",
}

const TOOL_LABELS: Record<string, string> = {
  "registro/interoceptivo": "Check-in interoceptivo",
  "registro/hambre":        "Termómetro de hambre",
  "registro/emocion":       "Registro emocional",
  "registro/comida":        "Pre/post comida",
  "registro/pensamiento":   "Diario de pensamientos",
  "setup/valores":          "Clarificación de valores",
  "setup/intenciones":      "Planes si-entonces",
}

const NSS_LABEL: Record<string, { label: string; color: string }> = {
  ventral:             { label: "Calma / conexión",        color: "#16a34a" },
  sympathetic_active:  { label: "Activación positiva",     color: "#d97706" },
  sympathetic_anxious: { label: "Alerta / ansiedad",       color: "#dc2626" },
  dorsal_freeze:       { label: "Baja energía / bloqueo",  color: "#4b5563" },
  dorsal_collapse:     { label: "Colapso / disociación",   color: "#6b7280" },
  mixed:               { label: "Estado mixto",            color: "#a855f7" },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

function computeInsight(
  checkins: CheckIn[],
  hambreLogs: HambreLog[],
  granularity: GranularityLog[],
): string | null {
  const parts: string[] = []

  if (checkins.length >= 3) {
    const recent = checkins.slice(0, 14)
    const counts: Record<string, number> = {}
    recent.forEach(c => { counts[c.nervous_system_state] = (counts[c.nervous_system_state] ?? 0) + 1 })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    if (sorted.length > 0) {
      const [topState, topCount] = sorted[0]
      const pct = Math.round((topCount / recent.length) * 100)
      parts.push(`${NSS_LABEL[topState]?.label ?? topState} en el ${pct}% de los últimos ${recent.length} check-ins`)
    }
  }

  if (hambreLogs.length >= 3) {
    const emoTotal  = hambreLogs.reduce((s, h) => s + h.emotional_hunger, 0)
    const physTotal = hambreLogs.reduce((s, h) => s + h.physical_hunger, 0)
    const pct = Math.round((emoTotal / (emoTotal + physTotal)) * 100)
    parts.push(`${pct}% de hambre emocional`)
  }

  if (granularity.length >= 3) {
    const emoCounts: Record<string, number> = {}
    granularity.flatMap(g => g.final_emotion_words).forEach(em => {
      emoCounts[em] = (emoCounts[em] ?? 0) + 1
    })
    const top = Object.entries(emoCounts).sort((a, b) => b[1] - a[1])[0]
    if (top) parts.push(`"${top[0]}" es la emoción más nombrada`)
  }

  return parts.length > 0 ? parts.join(" · ") : null
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const labels = ["","Básica","Nombrada","Doble","Triple","Rica"]
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(107,39,55,0.1)" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${(score / 5) * 100}%`, background: "#6B2737" }} />
      </div>
      <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.5)" }}>{labels[score]}</span>
    </div>
  )
}

function OracleEmotionHeatmap({ checkins }: { checkins: OracleCheckin[] }) {
  if (checkins.length === 0) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Align grid to Monday of the week 4 weeks ago → 5 rows × 7 cols
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1   // Mon=0 … Sun=6
  const gridStart = new Date(today)
  gridStart.setDate(today.getDate() - dow - 28)

  const gridDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })

  const byDate = new Map<string, OracleCheckin>()
  checkins.forEach(c => {
    const key = new Date(c.created_at).toLocaleDateString("en-CA")
    if (!byDate.has(key)) byDate.set(key, c)
  })

  // 28-day window stats
  const windowStart = new Date(today)
  windowStart.setDate(today.getDate() - 27)
  const daysInWindow  = gridDays.filter(d => d >= windowStart && d <= today)
  const checkedInWindow = daysInWindow.filter(d => byDate.has(d.toLocaleDateString("en-CA"))).length

  // Current consecutive streak (backwards from today)
  let streak = 0
  const streakCur = new Date(today)
  while (byDate.has(streakCur.toLocaleDateString("en-CA"))) {
    streak++
    streakCur.setDate(streakCur.getDate() - 1)
  }

  // Mood counts (primary, in-window only)
  const moodCounts = new Map<string, number>()
  daysInWindow.forEach(d => {
    const c = byDate.get(d.toLocaleDateString("en-CA"))
    if (c) moodCounts.set(c.primary_emotion, (moodCounts.get(c.primary_emotion) ?? 0) + 1)
  })

  const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"]

  return (
    <div className="bg-white rounded-xl p-4 mb-4" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(107,39,55,0.4)" }}>
          Paleta emocional · 5 semanas
        </p>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <span className="text-[10px] font-semibold" style={{ color: "#C9A84C" }}>
              {streak} día{streak !== 1 ? "s" : ""} seguido{streak !== 1 ? "s" : ""}
            </span>
          )}
          <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.35)" }}>
            {checkedInWindow}/28 días
          </span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map(l => (
          <div key={l} className="text-center text-[8px] font-medium" style={{ color: "rgba(107,39,55,0.25)" }}>
            {l}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((day, i) => {
          const key     = day.toLocaleDateString("en-CA")
          const c       = byDate.get(key)
          const isFuture = day > today
          const isToday  = day.toDateString() === today.toDateString()
          const moodA   = c ? moods.find(m => m.id === c.primary_emotion) : null
          const moodB   = c?.secondary_emotion ? moods.find(m => m.id === c.secondary_emotion) : null

          const bg = isFuture
            ? "rgba(107,39,55,0.02)"
            : moodA && moodB
            ? `linear-gradient(135deg, ${moodA.color}cc 50%, ${moodB.color}cc 50%)`
            : moodA
            ? moodA.color + "cc"
            : "rgba(107,39,55,0.06)"

          const title = c
            ? `${day.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}: ${moodA?.nombre ?? c.primary_emotion}${moodB ? ` + ${moodB.nombre}` : ""}`
            : undefined

          return (
            <div
              key={i}
              className="aspect-square rounded-sm"
              title={title}
              style={{
                background:    bg,
                opacity:       isFuture ? 0.25 : 1,
                outline:       isToday ? "1.5px solid rgba(201,168,76,0.6)" : undefined,
                outlineOffset: isToday ? "2px" : undefined,
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      {moodCounts.size > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
          {moods
            .filter(m => moodCounts.has(m.id))
            .map(m => (
              <span key={m.id} className="inline-flex items-center gap-1 text-[9px]" style={{ color: "rgba(107,39,55,0.5)" }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: m.color }} />
                {m.nombre} ({moodCounts.get(m.id)})
              </span>
            ))
          }
        </div>
      )}
    </div>
  )
}

function NSSHeatmap({ checkins }: { checkins: CheckIn[] }) {
  if (checkins.length < 2) return null

  const today = new Date()
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (27 - i))
    return d
  })

  const byDate = new Map<string, CheckIn>()
  checkins.forEach(c => {
    const key = new Date(c.logged_at).toLocaleDateString("en-CA")
    if (!byDate.has(key)) byDate.set(key, c)
  })

  return (
    <div className="bg-white rounded-xl p-4 mb-4" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.4)" }}>
        NSS · últimos 28 días
      </p>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const key = day.toLocaleDateString("en-CA")
          const c   = byDate.get(key)
          const nss = c ? NSS_LABEL[c.nervous_system_state] : null
          const isToday = day.toDateString() === today.toDateString()
          return (
            <div
              key={i}
              className="aspect-square rounded-sm"
              title={c ? `${formatDate(c.logged_at)}: ${nss?.label ?? c.nervous_system_state}` : undefined}
              style={{
                background:    nss ? nss.color + "90" : "rgba(107,39,55,0.05)",
                outline:       isToday ? "1.5px solid rgba(201,168,76,0.5)" : undefined,
                outlineOffset: isToday ? "2px" : undefined,
              }}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
        {Object.entries(NSS_LABEL).map(([key, { label, color }]) => {
          const count = days.filter(d => byDate.get(d.toLocaleDateString("en-CA"))?.nervous_system_state === key).length
          if (count === 0) return null
          return (
            <span key={key} className="inline-flex items-center gap-1 text-[9px]" style={{ color: "rgba(107,39,55,0.5)" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
              {label} ({count})
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PacienteDetailClient({ patientUserId }: { patientUserId: string }) {
  const router = useRouter()
  const [tab,              setTab]              = useState<Tab>("conductual")
  const [patientName,      setPatientName]      = useState<string | null>(null)
  const [patientEmail,     setPatientEmail]     = useState<string | null>(null)
  const [linkedAt,         setLinkedAt]         = useState<string | null>(null)
  const [checkins,         setCheckins]         = useState<CheckIn[]>([])
  const [granularity,      setGranularity]      = useState<GranularityLog[]>([])
  const [dialogues,        setDialogues]        = useState<SocraticDialogue[]>([])
  const [prescriptions,    setPrescriptions]    = useState<Prescription[]>([])
  const [hambreLogs,       setHambreLogs]       = useState<HambreLog[]>([])
  const [mealLogs,         setMealLogs]         = useState<MealLog[]>([])
  const [valuesLogs,       setValuesLogs]       = useState<ValuesLog[]>([])
  const [intentions,       setIntentions]       = useState<IntentionLog[]>([])
  const [nudges,           setNudges]           = useState<NudgeLog[]>([])
  const [expandedDialog,   setExpandedDialog]   = useState<string | null>(null)
  const [loading,          setLoading]          = useState(true)
  const [notFound,         setNotFound]         = useState(false)
  const [sessionPreps,        setSessionPreps]        = useState<SessionPrep[]>([])
  const [sessionPrepsLoaded,  setSessionPrepsLoaded]  = useState(false)
  const [preparandoSesion,    setPreparandoSesion]    = useState(false)
  const [prepError,           setPrepError]           = useState("")
  const [prepMsgIdx,          setPrepMsgIdx]          = useState(0)
  const [latestPrep,          setLatestPrep]          = useState<SessionPrep | null | undefined>(undefined)
  const [prescriptionsLoaded, setPrescriptionsLoaded] = useState(false)
  const [oracleCheckins,      setOracleCheckins]      = useState<OracleCheckin[]>([])
  const [assignments,         setAssignments]         = useState<TherapeuticAssignment[]>([])
  const [assignmentsLoaded,   setAssignmentsLoaded]   = useState(false)
  const [showNewAssignment,   setShowNewAssignment]   = useState(false)
  const [asgTitle,            setAsgTitle]            = useState("")
  const [asgInstruction,      setAsgInstruction]      = useState("")
  const [asgToolSlug,         setAsgToolSlug]         = useState("registro/interoceptivo")
  const [asgFreq,             setAsgFreq]             = useState(3)
  const [asgDueDate,          setAsgDueDate]          = useState("")
  const [asgSaving,           setAsgSaving]           = useState(false)
  const [asgError,            setAsgError]            = useState("")

  // Initial data load — everything except prescriptions (lazy) and all session preps (lazy)
  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace("/pro/login"); return }

      const [linkRes, invRes] = await Promise.all([
        supabase
          .from("professional_patient_links")
          .select("linked_at")
          .eq("patient_user_id", patientUserId)
          .eq("status", "active")
          .maybeSingle(),
        supabase
          .from("patient_invitations")
          .select("patient_name, patient_email")
          .eq("used_by_user_id", patientUserId)
          .maybeSingle(),
      ])

      if (!linkRes.data) { setNotFound(true); setLoading(false); return }

      setLinkedAt(linkRes.data.linked_at)
      setPatientName(invRes.data?.patient_name ?? null)
      setPatientEmail(invRes.data?.patient_email ?? null)

      const [checkinsRes, granRes, diagRes, latestPrepRes, hambreRes, mealRes, valRes, intRes, nudgeRes, oracleRes] = await Promise.all([
        supabase
          .from("interoceptive_checkins")
          .select("id, logged_at, nervous_system_state, interoceptive_clarity, dominant_sensation")
          .eq("user_id", patientUserId)
          .order("logged_at", { ascending: false })
          .limit(20),
        supabase
          .from("emotion_granularity_logs")
          .select("id, logged_at, initial_emotion_word, final_emotion_words, granularity_score")
          .eq("user_id", patientUserId)
          .order("logged_at", { ascending: false })
          .limit(20),
        supabase
          .from("socratic_dialogues")
          .select("id, started_at, ended_at, initial_thought, final_alternative_thought, emotion_before, emotion_after, intensity_before, intensity_after, conversation")
          .eq("user_id", patientUserId)
          .order("started_at", { ascending: false })
          .limit(20),
        supabase
          .from("session_preps")
          .select("id, created_at, period_start, period_end, weekly_summary")
          .eq("patient_user_id", patientUserId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("hunger_thermometer_logs")
          .select("id, logged_at, physical_hunger, emotional_hunger, interoceptive_clarity, decided_to_eat, context_notes")
          .eq("user_id", patientUserId)
          .order("logged_at", { ascending: false })
          .limit(30),
        supabase
          .from("emotional_meal_logs")
          .select("id, logged_at, emotion_before, intensity_before, emotion_after, intensity_after, meal_description, post_nervous_system_state, body_change")
          .eq("user_id", patientUserId)
          .order("logged_at", { ascending: false })
          .limit(20),
        supabase
          .from("values_clarifications")
          .select("id, created_at, core_values, relationship_with_food_vision, committed_actions")
          .eq("user_id", patientUserId)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("implementation_intentions")
          .select("id, created_at, trigger_situation, intended_action, linked_value, times_triggered, times_completed, is_active")
          .eq("user_id", patientUserId)
          .order("created_at", { ascending: false }),
        supabase
          .from("adaptive_nudges_log")
          .select("id, generated_at, delivered_at, opened_at, pattern_detected, nudge_content, action_taken")
          .eq("user_id", patientUserId)
          .order("generated_at", { ascending: false })
          .limit(20),
        supabase
          .from("oracle_checkins")
          .select("id, created_at, primary_emotion, secondary_emotion")
          .eq("user_id", patientUserId)
          .order("created_at", { ascending: false })
          .limit(60),
      ])

      setCheckins((checkinsRes.data ?? []) as CheckIn[])
      setGranularity((granRes.data ?? []) as GranularityLog[])
      setDialogues((diagRes.data ?? []) as SocraticDialogue[])
      setLatestPrep(latestPrepRes.data ?? null)
      setHambreLogs((hambreRes.data ?? []) as HambreLog[])
      setMealLogs((mealRes.data ?? []) as MealLog[])
      setValuesLogs((valRes.data ?? []) as ValuesLog[])
      setIntentions((intRes.data ?? []) as IntentionLog[])
      setNudges((nudgeRes.data ?? []) as NudgeLog[])
      setOracleCheckins((oracleRes.data ?? []) as OracleCheckin[])
      setLoading(false)
    }

    load()
  }, [patientUserId, router])

  // Lazy-load full session prep list when Sesiones tab is first opened
  useEffect(() => {
    if (tab !== "sesiones" || sessionPrepsLoaded) return
    fetch(`/api/pro/session-prep?patient_user_id=${patientUserId}`)
      .then(r => r.json())
      .then(d => { setSessionPreps(d.preps ?? []); setSessionPrepsLoaded(true) })
      .catch(() => setSessionPrepsLoaded(true))
  }, [tab, patientUserId, sessionPrepsLoaded])

  // Lazy-load assignments when Asignaciones tab is first opened
  useEffect(() => {
    if (tab !== "asignaciones" || assignmentsLoaded) return
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setAssignmentsLoaded(true); return }
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 6)
      weekStart.setHours(0, 0, 0, 0)
      const { data } = await supabase
        .from("therapeutic_assignments")
        .select("id, tool_slug, title, instruction, frequency_per_week, due_date, is_active, created_at, assignment_completions(completed_at)")
        .eq("patient_user_id", patientUserId)
        .order("created_at", { ascending: false })
        .limit(30)
      const rows = (data ?? []) as (TherapeuticAssignment & { assignment_completions: { completed_at: string }[] })[]
      setAssignments(rows.map(r => ({
        ...r,
        completions_this_week: r.assignment_completions.filter(c => new Date(c.completed_at) >= weekStart).length,
      })))
      setAssignmentsLoaded(true)
    })
  }, [tab, patientUserId, assignmentsLoaded])

  // Lazy-load prescriptions when Prescripciones tab is first opened
  useEffect(() => {
    if (tab !== "prescripciones" || prescriptionsLoaded) return
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setPrescriptionsLoaded(true); return }
      const { data } = await supabase
        .from("content_prescriptions")
        .select("id, prescribed_at, read_at, professional_note, content_library(title, content_type)")
        .eq("patient_user_id", patientUserId)
        .order("prescribed_at", { ascending: false })
        .limit(30)
      setPrescriptions((data ?? []) as Prescription[])
      setPrescriptionsLoaded(true)
    })
  }, [tab, patientUserId, prescriptionsLoaded])

  const totalRecords = checkins.length + hambreLogs.length + mealLogs.length + granularity.length + dialogues.length

  const PREP_MESSAGES = [
    `Revisando ${totalRecords} registro${totalRecords !== 1 ? "s" : ""}…`,
    "Analizando patrones conductuales…",
    "Identificando temas clave…",
    "Preparando preguntas de sesión…",
    "Finalizando informe…",
  ]

  useEffect(() => {
    if (!preparandoSesion) { setPrepMsgIdx(0); return }
    const t = setInterval(() => setPrepMsgIdx(i => Math.min(i + 1, PREP_MESSAGES.length - 1)), 2200)
    return () => clearInterval(t)
  // PREP_MESSAGES.length is constant (5); only preparandoSesion toggles the interval
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparandoSesion])

  const handleGenerateSessionPrep = async () => {
    setPreparandoSesion(true)
    setPrepError("")
    try {
      const res = await fetch("/api/pro/session-prep", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ patient_user_id: patientUserId }),
      })
      const d = await res.json()
      if (!res.ok) { setPrepError((d as { error?: string }).error ?? "Error al generar el informe."); setPreparandoSesion(false); return }
      router.push(`/pro/sesion/${(d as { id: string }).id}`)
    } catch {
      setPrepError("Error al conectar con el servidor.")
      setPreparandoSesion(false)
    }
  }

  const handleCreateAssignment = async () => {
    if (!asgTitle.trim() || !asgInstruction.trim()) return
    setAsgSaving(true)
    setAsgError("")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setAsgError("Error de autenticación."); setAsgSaving(false); return }
    const { error } = await supabase.from("therapeutic_assignments").insert({
      professional_id:    user.id,
      patient_user_id:    patientUserId,
      tool_slug:          asgToolSlug,
      title:              asgTitle.trim(),
      instruction:        asgInstruction.trim(),
      frequency_per_week: asgFreq,
      due_date:           asgDueDate || null,
    })
    if (error) { setAsgError("Error al crear la asignación."); setAsgSaving(false); return }
    setAsgSaving(false)
    setShowNewAssignment(false)
    setAsgTitle(""); setAsgInstruction(""); setAsgFreq(3); setAsgDueDate("")
    setAssignmentsLoaded(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm" style={{ color: "#6B2737" }}>Paciente no encontrado o sin vínculo activo.</p>
        <Link href="/pro/pacientes" className="text-xs underline mt-3 block" style={{ color: "rgba(107,39,55,0.5)" }}>
          Volver a pacientes
        </Link>
      </div>
    )
  }

  const uniqueEmotions = [...new Set(granularity.flatMap(g => g.final_emotion_words))]
  const insight = computeInsight(checkins, hambreLogs, granularity)

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <Link href="/pro/pacientes" className="inline-flex items-center gap-2 text-xs mb-4" style={{ color: "rgba(107,39,55,0.5)" }}>
          <ArrowLeft className="w-4 h-4" /> Pacientes
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-serif font-bold" style={{ color: "#6B2737" }}>
              {patientName ?? <span className="italic opacity-50">Sin nombre</span>}
            </h1>
            {patientEmail && <p className="text-xs mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>{patientEmail}</p>}
            {linkedAt && <p className="text-xs mt-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>Vinculado/a desde {formatDate(linkedAt)}</p>}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={handleGenerateSessionPrep}
              disabled={preparandoSesion}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 disabled:opacity-60 transition-all hover:brightness-110"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              {preparandoSesion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {preparandoSesion ? "Generando..." : "Preparar sesión"}
            </button>
            {preparandoSesion && (
              <p className="text-[10px] text-right animate-pulse" style={{ color: "rgba(107,39,55,0.45)" }}>
                {PREP_MESSAGES[prepMsgIdx]}
              </p>
            )}
            {prepError && <p className="text-[10px] text-red-600">{prepError}</p>}
          </div>
        </div>
      </div>

      {/* ── Pattern insight ─────────────────────────────────────────────────── */}
      {insight && (
        <div className="mb-4 rounded-xl px-4 py-3" style={{ background: "rgba(107,39,55,0.04)", border: "1px solid rgba(107,39,55,0.08)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(107,39,55,0.4)" }}>
            Patrón detectado
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#2d0f16" }}>{insight}</p>
        </div>
      )}

      {/* ── Latest session prep (always visible) ───────────────────────────── */}
      {latestPrep && (
        <Link
          href={`/pro/sesion/${latestPrep.id}`}
          className="mb-5 block rounded-xl px-5 py-4 bg-white transition-all hover:shadow-sm"
          style={{ border: "1px solid rgba(107,39,55,0.08)", borderLeftWidth: 3, borderLeftColor: "#C9A84C" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#C9A84C" }}>
                Último informe de sesión
              </p>
              <p className="text-[10px] mb-1" style={{ color: "rgba(107,39,55,0.5)" }}>
                {new Date(latestPrep.period_start).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                {" — "}
                {new Date(latestPrep.period_end).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              {latestPrep.weekly_summary && (
                <p className="text-xs font-light leading-relaxed line-clamp-2" style={{ color: "rgba(107,39,55,0.6)" }}>
                  {latestPrep.weekly_summary}
                </p>
              )}
            </div>
            <span className="text-xs shrink-0 mt-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>Ver →</span>
          </div>
        </Link>
      )}

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "rgba(107,39,55,0.07)" }}>
        {(["conductual", "prescripciones", "sesiones", "asignaciones"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === t ? "#6B2737" : "transparent",
              color:      tab === t ? "#F5F0E8" : "rgba(107,39,55,0.6)",
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── TAB CONDUCTUAL ─────────────────────────────────────────────────── */}
      {tab === "conductual" && (
        <div className="flex flex-col gap-8">

          {/* Emotional palette heatmap — 5-week calendar (A3) */}
          <OracleEmotionHeatmap checkins={oracleCheckins} />

          {/* NSS heatmap — nervous system states */}
          <NSSHeatmap checkins={checkins} />

          {/* Check-ins interoceptivos */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Check-ins interoceptivos ({checkins.length})
            </h2>
            {checkins.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin registros todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {checkins.map(c => {
                  const nss = NSS_LABEL[c.nervous_system_state] ?? { label: c.nervous_system_state, color: "#6B2737" }
                  return (
                    <div key={c.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-4" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: nss.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#2d0f16" }}>{nss.label}</p>
                        {c.dominant_sensation && (
                          <p className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>{c.dominant_sensation}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(c.logged_at)}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: "#C9A84C" }}>Claridad {c.interoceptive_clarity}/10</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Granularidad emocional */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.4)" }}>
              Granularidad emocional ({granularity.length} sesiones)
            </h2>
            {granularity.length > 0 && uniqueEmotions.length > 0 && (
              <div className="bg-white rounded-xl p-4 mb-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(107,39,55,0.4)" }}>
                  Top emociones identificadas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueEmotions.slice(0, 20).map(em => (
                    <span key={em} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}>
                      {em}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {granularity.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin registros todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {granularity.map(g => (
                  <div key={g.id} className="bg-white rounded-xl px-4 py-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium" style={{ color: "#2d0f16" }}>
                        &ldquo;{g.initial_emotion_word}&rdquo; →{" "}
                        <span style={{ color: "#6B2737" }}>{g.final_emotion_words.join(", ")}</span>
                      </p>
                      <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(g.logged_at)}</span>
                    </div>
                    <ScoreBar score={g.granularity_score} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Diálogos socráticos */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Diálogos socráticos ({dialogues.length})
            </h2>
            {dialogues.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin sesiones todavía.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dialogues.map(d => (
                  <div key={d.id} className="bg-white rounded-xl" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                    <button
                      onClick={() => setExpandedDialog(expandedDialog === d.id ? null : d.id)}
                      className="w-full text-left px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug mb-1 truncate" style={{ color: "#2d0f16" }}>
                            &ldquo;{d.initial_thought}&rdquo;
                          </p>
                          {d.final_alternative_thought && (
                            <p className="text-xs font-light italic truncate" style={{ color: "#6B2737" }}>
                              → &ldquo;{d.final_alternative_thought}&rdquo;
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(d.started_at)}</p>
                          {d.intensity_before != null && d.intensity_after != null && (
                            <p className="text-xs font-semibold mt-0.5" style={{ color: d.intensity_after < d.intensity_before ? "#16a34a" : "#6B2737" }}>
                              {d.intensity_before} → {d.intensity_after}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>

                    {expandedDialog === d.id && d.conversation.length > 0 && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(107,39,55,0.06)" }}>
                        <div className="mt-3 flex flex-col gap-2 max-h-80 overflow-y-auto">
                          {d.conversation.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div
                                className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                                style={m.role === "user"
                                  ? { background: "rgba(107,39,55,0.08)", color: "#2d0f16" }
                                  : { background: "rgba(201,168,76,0.08)", color: "#2d0f16", border: "1px solid rgba(201,168,76,0.2)" }
                                }
                              >
                                {m.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Termómetro de hambre */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Termómetro de hambre ({hambreLogs.length})
            </h2>
            {hambreLogs.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin registros todavía.</p>
            ) : (
              <>
                {(() => {
                  const emoTotal  = hambreLogs.reduce((s, h) => s + h.emotional_hunger, 0)
                  const physTotal = hambreLogs.reduce((s, h) => s + h.physical_hunger, 0)
                  const pctEmo    = Math.round((emoTotal / (emoTotal + physTotal)) * 100)
                  return (
                    <div className="bg-white rounded-xl px-4 py-3 mb-3 flex items-center gap-4" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(107,39,55,0.4)" }}>% hambre emocional (últimos {hambreLogs.length})</p>
                        <div className="h-2 rounded-full w-full" style={{ background: "rgba(107,39,55,0.1)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${pctEmo}%`, background: pctEmo > 60 ? "#dc2626" : "#C9A84C" }} />
                        </div>
                      </div>
                      <span className="text-lg font-bold font-serif shrink-0" style={{ color: pctEmo > 60 ? "#dc2626" : "#6B2737" }}>{pctEmo}%</span>
                    </div>
                  )
                })()}
                <div className="flex flex-col gap-2">
                  {hambreLogs.slice(0, 10).map(h => (
                    <div key={h.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                      <div className="flex-1">
                        <div className="flex gap-3 text-xs">
                          <span style={{ color: "#16a34a" }}>F:{h.physical_hunger}</span>
                          <span style={{ color: h.emotional_hunger > 7 ? "#dc2626" : "#d97706" }}>E:{h.emotional_hunger}</span>
                          <span style={{ color: "#6b7280" }}>C:{h.interoceptive_clarity}</span>
                        </div>
                        {h.context_notes && <p className="text-[11px] font-light mt-0.5 truncate" style={{ color: "rgba(107,39,55,0.5)" }}>{h.context_notes}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(h.logged_at)}</p>
                        <p className="text-[10px] font-medium" style={{ color: h.decided_to_eat ? "#6B2737" : "#6b7280" }}>{h.decided_to_eat ? "Comió" : "No comió"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Registro pre/post comida */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Pre/post comida ({mealLogs.length})
            </h2>
            {mealLogs.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin registros todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {mealLogs.slice(0, 10).map(m => {
                  const nssColor = m.post_nervous_system_state
                    ? (NSS_LABEL[m.post_nervous_system_state]?.color ?? "#6B2737")
                    : undefined
                  return (
                    <div key={m.id} className="bg-white rounded-xl px-4 py-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span style={{ color: "#6B2737" }}>{m.emotion_before} ({m.intensity_before})</span>
                          <span style={{ color: "rgba(107,39,55,0.3)" }}>→</span>
                          <span style={{ color: "#6B2737" }}>{m.emotion_after} ({m.intensity_after})</span>
                        </div>
                        <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(m.logged_at)}</span>
                      </div>
                      {m.post_nervous_system_state && (
                        <p className="text-[11px] font-medium" style={{ color: nssColor }}>
                          NSS post: {NSS_LABEL[m.post_nervous_system_state]?.label ?? m.post_nervous_system_state}
                          {m.body_change && ` · ${m.body_change}`}
                        </p>
                      )}
                      {m.meal_description && <p className="text-[11px] font-light truncate mt-0.5" style={{ color: "rgba(107,39,55,0.45)" }}>{m.meal_description}</p>}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Valores */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Valores núcleo ({valuesLogs.length} sesión{valuesLogs.length !== 1 ? "es" : ""})
            </h2>
            {valuesLogs.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin sesiones todavía.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {valuesLogs.map(v => (
                  <div key={v.id} className="bg-white rounded-xl px-4 py-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                    <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(v.created_at)}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                      {v.core_values.map((val, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}>{val}</span>
                      ))}
                    </div>
                    {v.committed_actions[0] && (
                      <p className="text-xs italic font-light" style={{ color: "rgba(107,39,55,0.6)", borderLeft: "2px solid #C9A84C", paddingLeft: "8px" }}>
                        {v.committed_actions[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Planes si-entonces */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Planes si-entonces ({intentions.filter(i => i.is_active).length} activos)
            </h2>
            {intentions.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin planes todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {intentions.map(p => (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 flex items-start gap-3" style={{ border: "1px solid rgba(107,39,55,0.08)", opacity: p.is_active ? 1 : 0.5 }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>Cuando</p>
                      <p className="text-xs mb-1 leading-snug" style={{ color: "#2d0f16" }}>{p.trigger_situation}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>Yo</p>
                      <p className="text-xs leading-snug" style={{ color: "#6B2737" }}>{p.intended_action}</p>
                      {p.linked_value && <p className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "#C9A84C" }}>Valor: {p.linked_value}</p>}
                    </div>
                    <div className="text-right shrink-0 text-xs" style={{ color: "rgba(107,39,55,0.5)" }}>
                      <p>{p.times_triggered} activado{p.times_triggered !== 1 ? "s" : ""}</p>
                      <p style={{ color: p.times_completed > 0 ? "#16a34a" : undefined }}>{p.times_completed} completado{p.times_completed !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Nudges */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Nudges adaptativos ({nudges.length})
            </h2>
            {nudges.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin nudges generados todavía.</p>
            ) : (
              <>
                {(() => {
                  const delivered = nudges.filter(n => n.delivered_at).length
                  const opened    = nudges.filter(n => n.opened_at).length
                  const acted     = nudges.filter(n => n.action_taken).length
                  const pct = (n: number) => nudges.length > 0 ? Math.round((n / nudges.length) * 100) : 0
                  return (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[["Entregados", delivered, pct(delivered)],["Abiertos", opened, pct(opened)],["Accionados", acted, pct(acted)]].map(([label, count, p]) => (
                        <div key={label as string} className="bg-white rounded-xl p-3 text-center" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(107,39,55,0.4)" }}>{label as string}</p>
                          <p className="text-lg font-bold font-serif" style={{ color: "#6B2737" }}>{p as number}%</p>
                          <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.35)" }}>{count as number} de {nudges.length}</p>
                        </div>
                      ))}
                    </div>
                  )
                })()}
                <div className="flex flex-col gap-2">
                  {nudges.slice(0, 5).map(n => (
                    <div key={n.id} className="bg-white rounded-xl px-4 py-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C9A84C" }}>{n.pattern_detected.replace(/_/g, " ")}</p>
                        <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(n.generated_at)}</p>
                      </div>
                      <p className="text-xs font-light leading-relaxed" style={{ color: "#2d0f16" }}>{n.nudge_content}</p>
                      <div className="flex gap-3 mt-1.5 text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>
                        {n.delivered_at && <span>Entregado</span>}
                        {n.opened_at && <span>· Abierto</span>}
                        {n.action_taken && <span style={{ color: "#16a34a" }}>· Accionado</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* ── TAB SESIONES ───────────────────────────────────────────────────── */}
      {tab === "sesiones" && (
        <div>
          {!sessionPrepsLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessionPreps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm mb-2" style={{ color: "rgba(107,39,55,0.5)" }}>
                No hay informes de sesión todavía.
              </p>
              <p className="text-xs" style={{ color: "rgba(107,39,55,0.35)" }}>
                Usa el botón &ldquo;Preparar sesión&rdquo; para generar el primero.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sessionPreps.map(sp => (
                <Link
                  key={sp.id}
                  href={`/pro/sesion/${sp.id}`}
                  className="block bg-white rounded-xl px-5 py-4 transition-all hover:shadow-sm"
                  style={{ border: "1px solid rgba(107,39,55,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-1" style={{ color: "#C9A84C" }}>
                        {new Date(sp.period_start).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        {" — "}
                        {new Date(sp.period_end).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {sp.weekly_summary && (
                        <p className="text-xs font-light leading-relaxed line-clamp-2" style={{ color: "rgba(107,39,55,0.6)" }}>
                          {sp.weekly_summary}
                        </p>
                      )}
                    </div>
                    <p className="text-[10px] shrink-0 mt-0.5" style={{ color: "rgba(107,39,55,0.35)" }}>
                      {formatDate(sp.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB PRESCRIPCIONES ─────────────────────────────────────────────── */}
      {tab === "prescripciones" && (
        <div>
          {!prescriptionsLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : prescriptions.length === 0 ? (
            <p className="text-sm" style={{ color: "rgba(107,39,55,0.35)" }}>Sin prescripciones todavía.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {prescriptions.map(p => {
                const lib = p.content_library[0]
                return (
                  <div key={p.id} className="bg-white rounded-xl px-4 py-3 flex items-start gap-3" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate mb-0.5" style={{ color: "#2d0f16" }}>{lib?.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C9A84C" }}>{lib?.content_type}</p>
                      {p.professional_note && (
                        <p className="text-xs italic mt-1 font-light" style={{ color: "rgba(107,39,55,0.6)" }}>
                          {p.professional_note}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>{formatDate(p.prescribed_at)}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: p.read_at ? "#16a34a" : "rgba(107,39,55,0.4)" }}>
                        {p.read_at ? "Leído" : "Sin leer"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB ASIGNACIONES ───────────────────────────────────────────────── */}
      {tab === "asignaciones" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(107,39,55,0.4)" }}>
              Asignaciones terapéuticas
            </p>
            <button
              onClick={() => setShowNewAssignment(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              + Nueva
            </button>
          </div>

          {!assignmentsLoaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm mb-2" style={{ color: "rgba(107,39,55,0.5)" }}>Sin asignaciones todavía.</p>
              <p className="text-xs" style={{ color: "rgba(107,39,55,0.35)" }}>
                Crea una asignación para guiar el trabajo entre sesiones.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">

              {/* Resumen semanal de adherencia */}
              {assignments.filter(a => a.is_active).length > 0 && (
                <div className="bg-white rounded-xl px-4 py-3 mb-2" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(107,39,55,0.4)" }}>
                    Adherencia esta semana
                  </p>
                  {assignments.filter(a => a.is_active).map(a => {
                    const pct = Math.min(100, Math.round((a.completions_this_week / a.frequency_per_week) * 100))
                    return (
                      <div key={a.id} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span style={{ color: "#2d0f16" }}>{a.title}</span>
                          <span style={{ color: pct >= 100 ? "#16a34a" : "rgba(107,39,55,0.5)" }}>
                            {a.completions_this_week}/{a.frequency_per_week}×
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(107,39,55,0.1)" }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, background: pct >= 100 ? "#16a34a" : "#C9A84C" }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Lista completa */}
              {assignments.map(a => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl px-4 py-3"
                  style={{ border: "1px solid rgba(107,39,55,0.08)", opacity: a.is_active ? 1 : 0.55 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "#2d0f16" }}>{a.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C9A84C" }}>
                        {TOOL_LABELS[a.tool_slug] ?? a.tool_slug} · {a.frequency_per_week}×/semana
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>
                        {formatDate(a.created_at)}
                      </p>
                      {a.due_date && (
                        <p className="text-[10px] font-medium" style={{ color: "#6B2737" }}>
                          Hasta {new Date(a.due_date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                  </div>
                  <p
                    className="text-xs font-light leading-relaxed"
                    style={{ color: "rgba(107,39,55,0.6)", borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "8px" }}
                  >
                    {a.instruction}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Modal nueva asignación ─────────────────────────────────────── */}
          {showNewAssignment && (
            <div
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-6"
              style={{ background: "rgba(15,10,13,0.75)" }}
              onClick={e => { if (e.target === e.currentTarget) setShowNewAssignment(false) }}
            >
              <div className="w-full max-w-lg bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="font-serif text-lg font-bold mb-5" style={{ color: "#2d0f16" }}>
                  Nueva asignación terapéutica
                </h3>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B2737" }}>Herramienta</label>
                    <select
                      value={asgToolSlug}
                      onChange={e => setAsgToolSlug(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                      style={{ borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                    >
                      {Object.entries(TOOL_LABELS).map(([slug, label]) => (
                        <option key={slug} value={slug}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B2737" }}>Título de la asignación</label>
                    <input
                      type="text"
                      value={asgTitle}
                      onChange={e => setAsgTitle(e.target.value)}
                      placeholder="Ej: Observar la hambre antes de cenar"
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                      style={{ borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B2737" }}>Instrucción de práctica</label>
                    <textarea
                      value={asgInstruction}
                      onChange={e => setAsgInstruction(e.target.value)}
                      placeholder="Mensaje que verá al abrir la herramienta. Qué observar, qué intención llevar…"
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                      style={{ borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B2737" }}>Veces por semana</label>
                      <input
                        type="number" min={1} max={7}
                        value={asgFreq}
                        onChange={e => setAsgFreq(Math.min(7, Math.max(1, Number(e.target.value))))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                        style={{ borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B2737" }}>Fecha límite (opcional)</label>
                      <input
                        type="date"
                        value={asgDueDate}
                        onChange={e => setAsgDueDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                        style={{ borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                      />
                    </div>
                  </div>

                  {asgError && <p className="text-xs text-red-600">{asgError}</p>}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowNewAssignment(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                      style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateAssignment}
                      disabled={asgSaving || !asgTitle.trim() || !asgInstruction.trim()}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                      style={{ background: "#6B2737", color: "#F5F0E8" }}
                    >
                      {asgSaving ? "Guardando…" : "Crear asignación"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
