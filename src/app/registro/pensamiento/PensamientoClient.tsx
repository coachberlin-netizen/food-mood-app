"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Check, ArrowRight } from "lucide-react"
import { useActiveAssignment } from "@/hooks/useAssignments"
import { AssignmentInstructionBanner } from "@/components/assignments/AssignmentInstructionBanner"
import { createAssignmentCompletion } from "@/lib/assignments-client"

type Message = { role: "user" | "assistant"; content: string }
type Phase = "disclaimer" | "setup" | "dialogue" | "closing" | "done"

const DISCLAIMER = `Esta herramienta es de auto-reflexión guiada. No sustituye psicoterapia ni atención psicológica o psiquiátrica profesional. Si estás en crisis, contacta con el 024 (Línea de Atención a la Conducta Suicida, España) o tu profesional de salud mental.`

const EMOTIONS = [
  "Ansiedad","Tristeza","Enfado","Vergüenza","Culpa",
  "Miedo","Frustración","Soledad","Agobio","Confusión",
]

function IntensitySlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(107,39,55,0.6)" }}>
        <span>{label}</span>
        <strong style={{ color: "#6B2737" }}>{value}/10</strong>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#6B2737]"
      />
    </div>
  )
}

export default function PensamientoClient() {
  const { assignment } = useActiveAssignment("registro/pensamiento")
  const [phase,         setPhase]        = useState<Phase>("disclaimer")
  const [disclaimerOk,  setDisclaimerOk] = useState(false)
  const [thought,       setThought]      = useState("")
  const [emotionBefore, setEmotionBefore] = useState("")
  const [intensityBefore, setIntensityBefore] = useState(5)
  const [messages,      setMessages]     = useState<Message[]>([])
  const [input,         setInput]        = useState("")
  const [loading,       setLoading]      = useState(false)
  const [error,         setError]        = useState("")
  const [alternative,   setAlternative]  = useState("")
  const [emotionAfter,  setEmotionAfter] = useState("")
  const [intensityAfter, setIntensityAfter] = useState(5)
  const [saving,        setSaving]       = useState(false)
  const [turnCount,     setTurnCount]    = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage(userText: string, isFirst = false) {
    const userMsg: Message = { role: "user", content: userText }
    const updated = isFirst ? [userMsg] : [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setLoading(true)
    setError("")
    const nextTurn = turnCount + 1
    setTurnCount(nextTurn)

    try {
      const res = await fetch("/api/behavioral/socratic", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:         updated,
          initial_thought:  thought,
          emotion_before:   emotionBefore || undefined,
          intensity_before: intensityBefore,
        }),
      })
      if (res.status === 429) { setError("Límite diario de IA alcanzado. Vuelve mañana."); setLoading(false); return }
      if (!res.ok) throw new Error()

      const { reply, complete } = await res.json()
      const aiMsg: Message = { role: "assistant", content: reply }
      setMessages(prev => [...prev, aiMsg])

      if (complete) setPhase("closing")
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/socratic/save", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initial_thought:           thought,
          conversation:              messages,
          final_alternative_thought: alternative.trim() || undefined,
          emotion_before:            emotionBefore || undefined,
          emotion_after:             emotionAfter || undefined,
          intensity_before:          intensityBefore,
          intensity_after:           intensityAfter,
          techniques_used:           [],
        }),
      })
      if (!res.ok) throw new Error()
      if (assignment?.id) createAssignmentCompletion(assignment.id).catch(() => {})
      setPhase("done")
    } catch {
      setError("Error al guardar. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      <div className="max-w-lg mx-auto w-full px-5 py-10 pb-24 flex flex-col flex-1">

        <Link href="/practicas" className="inline-flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "rgba(107,39,55,0.6)" }}>
          <ArrowLeft className="w-4 h-4" /> Mis prácticas
        </Link>

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Diario de pensamientos</h1>
        <p className="text-xs font-light mb-6" style={{ color: "rgba(107,39,55,0.5)" }}>Diálogo socrático asistido por IA — TCC · ACT · Autocompasión</p>

        {phase === "setup" && <AssignmentInstructionBanner assignment={assignment} />}

        {/* ── DISCLAIMER ─────────────────────────────────────────────── */}
        {phase === "disclaimer" && (
          <div>
            <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: "1px solid rgba(107,39,55,0.15)" }}>
              <p className="text-[11px] leading-relaxed font-light" style={{ color: "#6B2737" }}>
                {DISCLAIMER}
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={disclaimerOk}
                onChange={e => setDisclaimerOk(e.target.checked)}
                className="mt-0.5 accent-[#6B2737]"
              />
              <span className="text-xs" style={{ color: "#6B2737" }}>
                Entendido. Quiero usar esta herramienta de auto-reflexión.
              </span>
            </label>
            <button
              onClick={() => setPhase("setup")}
              disabled={!disclaimerOk}
              className="w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── SETUP ──────────────────────────────────────────────────── */}
        {phase === "setup" && (
          <div>
            <div className="mb-5">
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Qué pensamiento está perturbándote?
              </label>
              <textarea
                value={thought}
                onChange={e => setThought(e.target.value)}
                placeholder="Escribe el pensamiento tal como aparece en tu mente..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737] resize-none"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Qué emoción acompaña a ese pensamiento? (opcional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EMOTIONS.map(em => (
                  <button
                    key={em}
                    onClick={() => setEmotionBefore(emotionBefore === em ? "" : em)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      background:  emotionBefore === em ? "#6B2737" : "white",
                      color:       emotionBefore === em ? "#F5F0E8" : "#6B2737",
                      border:      "1px solid rgba(107,39,55,0.2)",
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <IntensitySlider
                label="Intensidad de malestar ahora"
                value={intensityBefore}
                onChange={setIntensityBefore}
              />
            </div>

            <button
              onClick={() => { setPhase("dialogue"); sendMessage(thought, true) }}
              disabled={!thought.trim()}
              className="w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Comenzar el diálogo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── DIÁLOGO ────────────────────────────────────────────────── */}
        {(phase === "dialogue" || phase === "closing") && (
          <div className="flex flex-col flex-1">
            <div className="text-[10px] text-center mb-3 font-medium" style={{ color: "rgba(107,39,55,0.4)" }}>
              Turno {turnCount} de 8
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={m.role === "user"
                      ? { background: "#6B2737", color: "#F5F0E8" }
                      : { background: "white", color: "#2d0f16", border: "1px solid rgba(107,39,55,0.1)" }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-white" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#FF6B35", animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {error && <p className="text-xs text-red-600 text-center">{error}</p>}
              <div ref={bottomRef} />
            </div>

            {phase === "dialogue" && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && input.trim() && !loading) sendMessage(input) }}
                  placeholder="Tu respuesta..."
                  maxLength={800}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-full text-sm border outline-none focus:border-[#6B2737] disabled:opacity-60"
                  style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                />
                <button
                  onClick={() => { if (input.trim() && !loading) sendMessage(input) }}
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-40"
                  style={{ background: "#6B2737" }}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {phase === "closing" && (
              <button
                onClick={() => setPhase("closing")}
                className="w-full py-3.5 rounded-full text-sm font-medium"
                style={{ background: "rgba(107,39,55,0.1)", color: "#6B2737" }}
                disabled
              >
                Continúa abajo para cerrar la sesión
              </button>
            )}
          </div>
        )}

        {/* ── CIERRE ─────────────────────────────────────────────────── */}
        {phase === "closing" && (
          <div className="mt-6 border-t pt-6" style={{ borderColor: "rgba(107,39,55,0.1)" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "#2d0f16" }}>Cierra tu sesión</p>

            <div className="mb-4">
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Cómo reformularías ese pensamiento inicial ahora, con tus propias palabras?
              </label>
              <textarea
                value={alternative}
                onChange={e => setAlternative(e.target.value)}
                placeholder="Mi pensamiento alternativo es..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737] resize-none"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Qué emoción sientes ahora? (opcional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {EMOTIONS.map(em => (
                  <button
                    key={em}
                    onClick={() => setEmotionAfter(emotionAfter === em ? "" : em)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      background:  emotionAfter === em ? "#6B2737" : "white",
                      color:       emotionAfter === em ? "#F5F0E8" : "#6B2737",
                      border:      "1px solid rgba(107,39,55,0.2)",
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <IntensitySlider
                label="Intensidad de malestar ahora"
                value={intensityAfter}
                onChange={setIntensityAfter}
              />
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              {saving ? "Guardando..." : "Guardar sesión"}
            </button>
          </div>
        )}

        {/* ── DONE ───────────────────────────────────────────────────── */}
        {phase === "done" && (
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ background: "#6B2737" }}>
              <Check className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-serif text-xl font-bold mb-2" style={{ color: "#2d0f16" }}>Sesión guardada</h2>
            {alternative && (
              <div className="max-w-xs mb-4 px-4 py-3 rounded-xl text-sm font-light italic text-left leading-relaxed" style={{ background: "white", color: "#6B2737", borderLeft: "3px solid #FF6B35" }}>
                {alternative}
              </div>
            )}
            {intensityBefore > 0 && intensityAfter > 0 && (
              <p className="text-sm mb-6" style={{ color: "rgba(107,39,55,0.6)" }}>
                Intensidad: {intensityBefore} → {intensityAfter}
                {intensityAfter < intensityBefore ? " — algo se ha movido." : " — el proceso lleva su tiempo."}
              </p>
            )}
            <Link
              href="/practicas"
              className="block w-full max-w-xs py-3 rounded-full text-sm font-medium text-white text-center"
              style={{ background: "#6B2737" }}
            >
              Volver a mis prácticas
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
