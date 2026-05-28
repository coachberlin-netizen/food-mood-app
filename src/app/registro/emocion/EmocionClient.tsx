"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Check } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }
type Phase   = "input" | "dialogue" | "confirm" | "done"

const BASIC_EMOTIONS = [
  "Bien","Mal","Ansiosa/o","Triste","Enfadada/o",
  "Cansada/o","Confusa/o","Alegre","Asustada/o","Vacía/o",
]

function extractFinalEmotions(text: string): string[] {
  const match = text.match(/Has identificado:\s*([^.]+)\./i)
  if (!match) return []
  return match[1]
    .split(/,|y /)
    .map(s => s.trim())
    .filter(Boolean)
}

function GranularityBar({ score }: { score: number }) {
  const labels = ["","Básica","Nombrada","Doble","Triple","Rica"]
  return (
    <div className="mt-4">
      <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "rgba(107,39,55,0.5)" }}>
        <span>Granularidad</span>
        <span>{labels[score]}</span>
      </div>
      <div className="h-2 rounded-full w-full" style={{ background: "rgba(107,39,55,0.1)" }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${(score / 5) * 100}%`, background: "#6B2737" }}
        />
      </div>
    </div>
  )
}

export default function EmocionClient() {
  const [phase,          setPhase]         = useState<Phase>("input")
  const [initial,        setInitial]       = useState("")
  const [context,        setContext]       = useState("")
  const [messages,       setMessages]      = useState<Message[]>([])
  const [input,          setInput]         = useState("")
  const [finalEmotions,  setFinalEmotions] = useState<string[]>([])
  const [editableEm,     setEditableEm]    = useState<string[]>([])
  const [newEm,          setNewEm]         = useState("")
  const [score,          setScore]         = useState(0)
  const [loading,        setLoading]       = useState(false)
  const [error,          setError]         = useState("")
  const [saving,         setSaving]        = useState(false)
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

    try {
      const res = await fetch("/api/behavioral/granularity", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:        updated,
          initial_emotion: initial,
          context:         context.trim() || undefined,
        }),
      })
      if (res.status === 429) { setError("Límite diario de IA alcanzado. Vuelve mañana."); setLoading(false); return }
      if (!res.ok) throw new Error()

      const { reply, complete } = await res.json()
      const aiMsg: Message = { role: "assistant", content: reply }
      const withAi = [...updated, aiMsg]
      setMessages(withAi)

      if (complete) {
        const found = extractFinalEmotions(reply)
        setFinalEmotions(found)
        setEditableEm(found)
        setPhase("confirm")
      }
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
      const res = await fetch("/api/behavioral/granularity/save", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initial_emotion_word: initial,
          final_emotion_words:  editableEm.filter(Boolean),
          context:              context.trim() || undefined,
          ai_dialogue_turns:    messages,
        }),
      })
      if (!res.ok) throw new Error()
      const { granularity_score } = await res.json()
      setScore(granularity_score)
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

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Registro emocional</h1>
        <p className="text-xs font-light mb-1" style={{ color: "rgba(107,39,55,0.5)" }}>Granularidad emocional asistida por IA</p>
        <p className="text-[10px] mb-6 italic" style={{ color: "rgba(107,39,55,0.35)" }}>
          Herramienta de auto-reflexión. No sustituye atención psicológica profesional.
        </p>

        {/* ── FASE INPUT ─────────────────────────────────────────────── */}
        {phase === "input" && (
          <div>
            <p className="text-sm font-medium mb-4" style={{ color: "#2d0f16" }}>¿Cómo te sientes ahora?</p>
            <input
              type="text"
              value={initial}
              onChange={e => setInitial(e.target.value)}
              placeholder="Escribe una emoción o estado..."
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737] mb-4"
              style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
            />
            <div className="flex flex-wrap gap-2 mb-5">
              {BASIC_EMOTIONS.map(em => (
                <button
                  key={em}
                  onClick={() => setInitial(em)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background:  initial === em ? "#6B2737" : "white",
                    color:       initial === em ? "#F5F0E8" : "#6B2737",
                    border:      "1px solid rgba(107,39,55,0.2)",
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Contexto opcional (ej. después del trabajo...)"
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737] mb-6"
              style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
            />
            <button
              onClick={() => { setPhase("dialogue"); sendMessage(initial, true) }}
              disabled={!initial.trim()}
              className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Explorar esta emoción
            </button>
          </div>
        )}

        {/* ── FASE DIÁLOGO ───────────────────────────────────────────── */}
        {phase === "dialogue" && (
          <div className="flex flex-col flex-1">
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
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#C9A84C", animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {error && <p className="text-xs text-red-600 text-center">{error}</p>}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && input.trim() && !loading) sendMessage(input) }}
                placeholder="Tu respuesta..."
                maxLength={500}
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
          </div>
        )}

        {/* ── FASE CONFIRMACIÓN ──────────────────────────────────────── */}
        {phase === "confirm" && (
          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: "#2d0f16" }}>Emociones identificadas en esta sesión</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {editableEm.map((em, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ background: "#6B2737", color: "#F5F0E8" }}
                >
                  {em}
                  <button onClick={() => setEditableEm(prev => prev.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newEm}
                onChange={e => setNewEm(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newEm.trim()) { setEditableEm(p => [...p, newEm.trim()]); setNewEm("") } }}
                placeholder="Añadir emoción..."
                maxLength={80}
                className="flex-1 px-4 py-2.5 rounded-full text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
              <button
                onClick={() => { if (newEm.trim()) { setEditableEm(p => [...p, newEm.trim()]); setNewEm("") } }}
                className="px-4 py-2.5 rounded-full text-sm font-medium"
                style={{ background: "rgba(107,39,55,0.1)", color: "#6B2737" }}
              >
                Añadir
              </button>
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving || editableEm.length === 0}
              className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              {saving ? "Guardando..." : "Guardar registro"}
            </button>
          </div>
        )}

        {/* ── FASE DONE ──────────────────────────────────────────────── */}
        {phase === "done" && (
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ background: "#6B2737" }}>
              <Check className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-serif text-xl font-bold mb-2" style={{ color: "#2d0f16" }}>
              Has discriminado {editableEm.length} emocion{editableEm.length !== 1 ? "es" : ""} distintas.
            </h2>
            <p className="text-sm font-light mb-4" style={{ color: "rgba(107,39,55,0.6)" }}>
              Tu vocabulario emocional se está expandiendo.
            </p>
            <div className="w-full max-w-xs mb-8">
              <GranularityBar score={score} />
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link
                href="/practicas"
                className="block w-full py-3 rounded-full text-sm font-medium text-white text-center"
                style={{ background: "#6B2737" }}
              >
                Volver a mis prácticas
              </Link>
              <button
                onClick={() => { setPhase("input"); setInitial(""); setContext(""); setMessages([]); setFinalEmotions([]); setEditableEm([]) }}
                className="text-xs py-2"
                style={{ color: "rgba(107,39,55,0.5)" }}
              >
                Nuevo registro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
