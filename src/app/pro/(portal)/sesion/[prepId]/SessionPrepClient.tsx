"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Printer, Edit3, Check, X, Loader2 } from "lucide-react"

type KeyPattern        = { pattern: string; evidence: string }
type InterventionPoint = { point: string; rationale: string }

type SessionPrep = {
  id:                    string
  created_at:            string
  patient_user_id:       string
  period_start:          string
  period_end:            string
  weekly_summary:        string | null
  key_patterns:          KeyPattern[]
  suggested_questions:   string[]
  intervention_points:   InterventionPoint[]
  professional_notes:    string | null
  model_used:            string
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

export default function SessionPrepClient({ prepId }: { prepId: string }) {
  const [prep,             setPrep]             = useState<SessionPrep | null>(null)
  const [loading,          setLoading]          = useState(true)
  const [notFound,         setNotFound]         = useState(false)
  const [editingQuestions, setEditingQuestions] = useState(false)
  const [questions,        setQuestions]        = useState<string[]>([])
  const [notes,            setNotes]            = useState("")
  const [saving,           setSaving]           = useState(false)
  const [saveError,        setSaveError]        = useState("")

  useEffect(() => {
    fetch(`/api/pro/session-prep/${prepId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.prep) { setNotFound(true); setLoading(false); return }
        setPrep(d.prep)
        setQuestions(d.prep.suggested_questions ?? [])
        setNotes(d.prep.professional_notes ?? "")
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [prepId])

  const handleSave = async () => {
    setSaving(true)
    setSaveError("")
    try {
      const res = await fetch(`/api/pro/session-prep/${prepId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ suggested_questions: questions, professional_notes: notes }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setSaveError((d as { error?: string }).error ?? "Error al guardar.")
        setSaving(false)
        return
      }
      const { prep: updated } = await res.json()
      setPrep(updated)
      setEditingQuestions(false)
    } catch {
      setSaveError("Error al conectar con el servidor.")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !prep) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm" style={{ color: "#6B2737" }}>Informe no encontrado.</p>
        <Link href="/pro/pacientes" className="text-xs underline mt-3 block" style={{ color: "rgba(107,39,55,0.5)" }}>
          Volver a pacientes
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Hide sidebar and global header when printing */}
      <style>{`@media print { aside, header, nav { display: none !important; } body { background: white !important; } }`}</style>

      {/* Print-only header */}
      <div className="hidden print:block mb-6 border-b pb-4" style={{ borderColor: "rgba(107,39,55,0.15)" }}>
        <p className="text-xl font-serif font-bold" style={{ color: "#6B2737" }}>Preparación de sesión</p>
        <p className="text-sm mt-1" style={{ color: "rgba(107,39,55,0.6)" }}>
          Período: {fmt(prep.period_start)} — {fmt(prep.period_end)}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>
          Generado el {fmt(prep.created_at)} · Uso interno exclusivo del profesional
        </p>
      </div>

      <div className="p-6 max-w-3xl mx-auto print:p-0 print:max-w-none">

        {/* Screen header */}
        <div className="mb-6 print:hidden">
          <Link
            href={`/pro/pacientes/${prep.patient_user_id}`}
            className="inline-flex items-center gap-2 text-xs mb-4"
            style={{ color: "rgba(107,39,55,0.5)" }}
          >
            <ArrowLeft className="w-4 h-4" /> Volver al paciente
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-serif font-bold" style={{ color: "#6B2737" }}>
                Preparación de sesión
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>
                {fmt(prep.period_start)} — {fmt(prep.period_end)}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all hover:brightness-95"
              style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">

          {/* Weekly summary */}
          {prep.weekly_summary && (
            <section className="bg-white rounded-2xl p-6 print:rounded-none print:p-0 print:border-none print:mb-4" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.4)" }}>
                Resumen del período
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#2d0f16" }}>
                {prep.weekly_summary}
              </p>
            </section>
          )}

          {/* Key patterns */}
          {prep.key_patterns.length > 0 && (
            <section className="bg-white rounded-2xl p-6 print:rounded-none print:p-0 print:border-none print:mb-4" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
                Patrones clave ({prep.key_patterns.length})
              </h2>
              <div className="flex flex-col gap-4">
                {prep.key_patterns.map((kp, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ background: "rgba(107,39,55,0.08)", color: "#6B2737" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-snug mb-1" style={{ color: "#2d0f16" }}>
                        {kp.pattern}
                      </p>
                      <p
                        className="text-xs font-light leading-relaxed"
                        style={{ color: "rgba(107,39,55,0.55)", borderLeft: "2px solid rgba(201,168,76,0.5)", paddingLeft: "8px" }}
                      >
                        {kp.evidence}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Suggested questions */}
          <section className="bg-white rounded-2xl p-6 print:rounded-none print:p-0 print:border-none print:mb-4" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(107,39,55,0.4)" }}>
                Preguntas para la sesión
              </h2>
              {!editingQuestions && (
                <button
                  onClick={() => setEditingQuestions(true)}
                  className="print:hidden flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:brightness-95"
                  style={{ background: "rgba(107,39,55,0.06)", color: "#6B2737" }}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
              )}
            </div>

            {editingQuestions ? (
              <div className="flex flex-col gap-2">
                {questions.map((q, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs font-bold mt-2.5 shrink-0 w-4 text-right" style={{ color: "rgba(107,39,55,0.35)" }}>
                      {i + 1}.
                    </span>
                    <textarea
                      value={q}
                      onChange={e => {
                        const updated = [...questions]
                        updated[i] = e.target.value
                        setQuestions(updated)
                      }}
                      rows={2}
                      className="flex-1 text-sm p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20"
                      style={{ background: "rgba(107,39,55,0.04)", border: "1px solid rgba(107,39,55,0.12)", color: "#2d0f16" }}
                    />
                    <button
                      onClick={() => setQuestions(questions.filter((_, j) => j !== i))}
                      className="mt-2 p-1 rounded transition-opacity hover:opacity-70"
                      style={{ color: "rgba(107,39,55,0.4)" }}
                      aria-label="Eliminar pregunta"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setQuestions([...questions, ""])}
                  className="text-xs text-left font-medium mt-1 transition-opacity hover:opacity-70"
                  style={{ color: "rgba(107,39,55,0.5)" }}
                >
                  + Añadir pregunta
                </button>
              </div>
            ) : (
              <ol className="flex flex-col gap-3 list-none">
                {questions.map((q, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="shrink-0 font-bold w-4 text-right" style={{ color: "rgba(107,39,55,0.35)" }}>{i + 1}.</span>
                    <span style={{ color: "#2d0f16" }}>{q}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Intervention points */}
          {prep.intervention_points.length > 0 && (
            <section className="bg-white rounded-2xl p-6 print:rounded-none print:p-0 print:border-none print:mb-4" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
                Puntos de intervención
              </h2>
              <div className="flex flex-col gap-4">
                {prep.intervention_points.map((ip, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ background: "#C9A84C" }} />
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: "#2d0f16" }}>{ip.point}</p>
                      <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.55)" }}>{ip.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Professional notes */}
          <section className="bg-white rounded-2xl p-6 print:rounded-none print:p-0 print:border-none" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(107,39,55,0.4)" }}>
              Notas profesionales
            </h2>
            <p className="text-[10px] mb-3 print:hidden" style={{ color: "rgba(107,39,55,0.35)" }}>
              Solo visibles para ti. No se comparten con el/la paciente.
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Observaciones, hipótesis clínicas, ajustes al plan..."
              className="w-full text-sm p-3 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 print:hidden"
              style={{ background: "rgba(107,39,55,0.04)", border: "1px solid rgba(107,39,55,0.12)", color: "#2d0f16" }}
            />
            {notes && (
              <p className="hidden print:block text-sm leading-relaxed whitespace-pre-line" style={{ color: "#2d0f16" }}>
                {notes}
              </p>
            )}
          </section>

          {/* Save */}
          {saveError && (
            <p className="text-xs text-red-600 text-center print:hidden">{saveError}</p>
          )}
          <div className="flex justify-end pb-8 print:hidden">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 transition-all hover:brightness-110"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
