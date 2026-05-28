"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"

type Tab = "conductual" | "prescripciones"

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
  const [expandedDialog,   setExpandedDialog]  = useState<string | null>(null)
  const [loading,          setLoading]         = useState(true)
  const [notFound,         setNotFound]        = useState(false)

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
      const [checkinsRes, granRes, diagRes, presRes] = await Promise.all([
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
      ])

      setCheckins((checkinsRes.data ?? []) as CheckIn[])
      setGranularity((granRes.data ?? []) as GranularityLog[])
      setDialogues((diagRes.data ?? []) as SocraticDialogue[])
      setPrescriptions((presRes.data ?? []) as typeof prescriptions)
      setLoading(false)
    }

    load()
  }, [patientUserId, router])

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
        <h1 className="text-xl font-serif font-bold" style={{ color: "#6B2737" }}>
          {patientName ?? <span className="italic opacity-50">Sin nombre</span>}
        </h1>
        {patientEmail && <p className="text-xs mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>{patientEmail}</p>}
        {linkedAt && <p className="text-xs mt-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>Vinculado/a desde {formatDate(linkedAt)}</p>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "rgba(107,39,55,0.07)" }}>
        {(["conductual", "prescripciones"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={{
              background: tab === t ? "#6B2737" : "transparent",
              color:      tab === t ? "#F5F0E8" : "rgba(107,39,55,0.6)",
            }}
          >
            {t === "conductual" ? "Herramientas conductuales" : "Prescripciones"}
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
