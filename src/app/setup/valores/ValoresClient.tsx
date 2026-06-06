"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Check } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }
type Phase   = "disclaimer" | "dialogue" | "confirm" | "done"

const DISCLAIMER = `Esta herramienta es de reflexión guiada sobre tus valores personales. No sustituye psicoterapia ni orientación nutricional profesional. Si estás en crisis, contacta con el 024 (Línea de Atención a la Conducta Suicida, España).`

function extractValues(text: string): { values: string[]; action: string } {
  const valMatch = text.match(/Valores identificados:\s*([^.]+)\./i)
  const actMatch = text.match(/Acción comprometida:\s*([^.]+\.?)/i)
  const values = valMatch
    ? valMatch[1].split(/,|y /).map(s => s.trim()).filter(Boolean)
    : []
  const action = actMatch ? actMatch[1].trim() : ""
  return { values, action }
}

export default function ValoresClient() {
  const [phase,          setPhase]         = useState<Phase>("disclaimer")
  const [disclaimerOk,   setDisclaimerOk]  = useState(false)
  const [messages,       setMessages]      = useState<Message[]>([])
  const [input,          setInput]         = useState("")
  const [loading,        setLoading]       = useState(false)
  const [error,          setError]         = useState("")
  const [editableValues, setEditableValues] = useState<string[]>([])
  const [editableAction, setEditableAction] = useState("")
  const [newValue,       setNewValue]      = useState("")
  const [vision,         setVision]        = useState("")
  const [saving,         setSaving]        = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function startDialogue() {
    setPhase("dialogue")
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/values", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      })
      if (res.status === 429) { setError("Límite diario de IA alcanzado. Vuelve mañana."); setLoading(false); return }
      if (!res.ok) throw new Error()
      const { reply } = await res.json()
      setMessages([{ role: "assistant", content: reply }])
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: "user", content: input.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/behavioral/values", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })
      if (res.status === 429) { setError("Límite diario de IA alcanzado. Vuelve mañana."); setLoading(false); return }
      if (!res.ok) throw new Error()

      const { reply, complete } = await res.json()
      const withAi = [...updated, { role: "assistant" as const, content: reply }]
      setMessages(withAi)

      if (complete) {
        const { values, action } = extractValues(reply)
        setEditableValues(values)
        setEditableAction(action)
        setPhase("confirm")
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (editableValues.length === 0) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/values/save", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          core_values:                   editableValues.filter(Boolean),
          relationship_with_food_vision: vision.trim() || editableAction || "Sin descripción",
          narrative_vision:              vision.trim() || undefined,
          committed_actions:             editableAction.trim() ? [editableAction.trim()] : ["Sin acción definida"],
          ai_dialogue_turns:             messages,
        }),
      })
      if (!res.ok) throw new Error()
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

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Mis valores</h1>
        <p className="text-xs font-light mb-6" style={{ color: "rgba(107,39,55,0.5)" }}>Clarificación guiada con entrevista motivacional</p>

        {/* ── DISCLAIMER ── */}
        {phase === "disclaimer" && (
          <div>
            <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: "1px solid rgba(107,39,55,0.15)" }}>
              <p className="text-[11px] leading-relaxed font-light" style={{ color: "#6B2737" }}>{DISCLAIMER}</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input type="checkbox" checked={disclaimerOk} onChange={e => setDisclaimerOk(e.target.checked)} className="mt-0.5 accent-[#6B2737]" />
              <span className="text-xs" style={{ color: "#6B2737" }}>Entendido. Quiero reflexionar sobre mis valores.</span>
            </label>
            <button
              onClick={startDialogue}
              disabled={!disclaimerOk}
              className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Comenzar
            </button>
          </div>
        )}

        {/* ── DIÁLOGO ── */}
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
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#FF6B35", animationDelay: `${i * 150}ms` }} />)}
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
                onKeyDown={e => { if (e.key === "Enter") sendMessage() }}
                placeholder="Tu respuesta..."
                maxLength={800}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-full text-sm border outline-none focus:border-[#6B2737] disabled:opacity-60"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-40"
                style={{ background: "#6B2737" }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ── CONFIRMACIÓN ── */}
        {phase === "confirm" && (
          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: "#2d0f16" }}>Valores identificados en esta sesión</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {editableValues.map((v, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "#6B2737", color: "#F5F0E8" }}>
                  {v}
                  <button onClick={() => setEditableValues(prev => prev.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-5">
              <input
                type="text" value={newValue} onChange={e => setNewValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newValue.trim()) { setEditableValues(p => [...p, newValue.trim()]); setNewValue("") } }}
                placeholder="Añadir valor..." maxLength={80}
                className="flex-1 px-4 py-2.5 rounded-full text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
              <button onClick={() => { if (newValue.trim()) { setEditableValues(p => [...p, newValue.trim()]); setNewValue("") } }} className="px-4 py-2.5 rounded-full text-sm font-medium" style={{ background: "rgba(107,39,55,0.1)", color: "#6B2737" }}>
                Añadir
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                Acción comprometida esta semana
              </label>
              <input
                type="text" value={editableAction} onChange={e => setEditableAction(e.target.value)}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                Tu visión personal (opcional — tus propias palabras)
              </label>
              <textarea
                value={vision} onChange={e => setVision(e.target.value)}
                placeholder="En un año, mi relación con la alimentación..." rows={3} maxLength={1000}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737] resize-none"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving || editableValues.length === 0}
              className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              {saving ? "Guardando..." : "Guardar mis valores"}
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {phase === "done" && (
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ background: "#6B2737" }}>
              <Check className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-serif text-xl font-bold mb-3" style={{ color: "#2d0f16" }}>Valores guardados</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {editableValues.map((v, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(107,39,55,0.08)", color: "#6B2737" }}>{v}</span>
              ))}
            </div>
            {editableAction && (
              <div className="max-w-xs mb-6 px-4 py-3 rounded-xl text-sm font-light italic text-left leading-relaxed" style={{ background: "white", color: "#6B2737", borderLeft: "3px solid #FF6B35" }}>
                Esta semana: {editableAction}
              </div>
            )}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link href="/herramientas/plan-si-entonces" className="block w-full py-3 rounded-full text-sm font-medium text-center" style={{ background: "#FF6B35", color: "white" }}>
                Crear un plan si-entonces →
              </Link>
              <Link href="/practicas" className="block w-full py-3 rounded-full text-sm font-medium text-center" style={{ background: "#6B2737", color: "#F5F0E8" }}>
                Volver a mis prácticas
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
