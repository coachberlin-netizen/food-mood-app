"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"

type Tab = "conductual" | "prescripciones" | "sesiones"

type SessionPrep = {
  id: string
  created_at: string
  period_start: string
  period_end: string
  weekly_summary: string | null
}

const TAB_LABELS: Record<Tab, string> = {
  conductual:     "Herramientas conductuales",
  prescripciones: "Prescripciones",
  sesiones:       "Sesiones",
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

const NSS_LABEL: Record<string, { label: string; color: string }> = {
  ventral:             { label: "Calma / conexión",        color: "#16a34a" },
  sympathetic_active:  { label: "Activación positiva",     color: "#d97706" },
  sympathetic_anxious: { label: "Alerta / ansiedad",       color: "#dc2626" },
  dorsal_freeze:       { label: "Baja energía / bloqueo",  color: "#4b5563" },
  dorsal_collapse:     { label: "Colapso / disociación",   color: "#6b7280" },
  mixed:               { label: "Estado mixto",            color: "#a855f7" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

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

export default function PacienteDetailClient({ patientUserId }: { patientUserId: string }) {
  const router = useRouter()
  const [tab,              setTab]             = useState<Tab>("conductual")
  const [patientName,      setPatientName]     = useState<string | null>(null)
  const [patientEmail,     setPatientEmail]    = useState<string | null>(null)
  const [linkedAt,         setLinkedAt]        = useState<string | null>(null)
  const [checkins,         setCheckins]        = useState<CheckIn[]>([])
  const [granularity,      setGranularity]     = useState<GranularityLog[]>([])
  const [dialogues,        setDialogues]       = useState<SocraticDialogue[]>([])
  const [prescriptions,    setPrescriptions]   = useState<{ id: string; prescribed_at: string; read_at: string | null; professional_note: string | null; content_library: { title: string; content_type: string }[] }[]>([])
  const [hambreLogs,       setHambreLogs]      = useState<HambreLog[]>([])
  const [mealLogs,         setMealLogs]        = useState<MealLog[]>([])
  const [valuesLogs,       setValuesLogs]      = useState<ValuesLog[]>([])
  const [intentions,       setIntentions]      = useState<IntentionLog[]>([])
  const [nudges,           setNudges]          = useState<NudgeLog[]>([])
  const [expandedDialog,   setExpandedDialog]  = useState<string | null>(null)
  const [loading,          setLoading]         = useState(true)
  const [notFound,         setNotFound]        = useState(false)
  const [sessionPreps,       setSessionPreps]       = useState<SessionPrep[]>([])
  const [sessionPrepsLoaded, setSessionPrepsLoaded] = useState(false)
  const [preparandoSesion,   setPreparandoSesion]   = useState(false)
  const [prepError,          setPrepError]          = useState("")
  const [prepMsgIdx,         setPrepMsgIdx]         = useState(0)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace("/pro/login"); return }

      // Verify link exists (professional can only see linked patients)
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

      // Fetch behavioral data in parallel
      const [checkinsRes, granRes, diagRes, presRes, hambreRes, mealRes, valRes, intRes, nudgeRes] = await Promise.all([
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
          .from("content_prescriptions")
          .select("id, prescribed_at, read_at, professional_note, content_library(title, content_type)")
          .eq("patient_user_id", patientUserId)
          .order("prescribed_at", { ascending: false })
          .limit(30),
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
      ])

      setCheckins((checkinsRes.data ?? []) as CheckIn[])
      setGranularity((granRes.data ?? []) as GranularityLog[])
      setDialogues((diagRes.data ?? []) as SocraticDialogue[])
      setPrescriptions((presRes.data ?? []) as typeof prescriptions)
      setHambreLogs((hambreRes.data ?? []) as HambreLog[])
      setMealLogs((mealRes.data ?? []) as MealLog[])
      setValuesLogs((valRes.data ?? []) as ValuesLog[])
      setIntentions((intRes.data ?? []) as IntentionLog[])
      setNudges((nudgeRes.data ?? []) as NudgeLog[])
      setLoading(false)
    }

    load()
  }, [patientUserId, router])

  // Lazy-load session preps when the Sesiones tab is first opened
  useEffect(() => {
    if (tab !== "sesiones" || sessionPrepsLoaded) return
    fetch(`/api/pro/session-prep?patient_user_id=${patientUserId}`)
      .then(r => r.json())
      .then(d => { setSessionPreps(d.preps ?? []); setSessionPrepsLoaded(true) })
      .catch(() => setSessionPrepsLoaded(true))
  }, [tab, patientUserId, sessionPrepsLoaded])

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

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
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

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "rgba(107,39,55,0.07)" }}>
        {(["conductual", "prescripciones", "sesiones"] as Tab[]).map(t => (
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

          {/* Plans if-then */}
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
          {prescriptions.length === 0 ? (
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
    </div>
  )
}
