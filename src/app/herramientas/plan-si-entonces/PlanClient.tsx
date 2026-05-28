"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Check, X, Flame } from "lucide-react"

type Intention = {
  id: string
  trigger_situation: string
  intended_action:   string
  linked_value:      string | null
  times_triggered:   number
  times_completed:   number
  is_active:         boolean
  created_at:        string
}

export default function PlanClient() {
  const [intentions, setIntentions] = useState<Intention[]>([])
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [trigger,    setTrigger]    = useState("")
  const [action,     setAction]     = useState("")
  const [value,      setValue]      = useState("")
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState("")

  async function load() {
    setLoading(true)
    const res = await fetch("/api/behavioral/intentions")
    if (res.ok) {
      const { intentions: data } = await res.json()
      setIntentions(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate() {
    if (!trigger.trim() || !action.trim()) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/intentions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger_situation: trigger.trim(),
          intended_action:   action.trim(),
          linked_value:      value.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      setTrigger(""); setAction(""); setValue(""); setShowForm(false)
      await load()
    } catch {
      setError("Error al guardar. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  async function patchIntention(id: string, action: "toggle_active" | "trigger" | "complete") {
    await fetch(`/api/behavioral/intentions/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    await load()
  }

  async function deleteIntention(id: string) {
    await fetch(`/api/behavioral/intentions/${id}`, { method: "DELETE" })
    await load()
  }

  const active   = intentions.filter(i => i.is_active)
  const inactive = intentions.filter(i => !i.is_active)

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-lg mx-auto px-5 py-10 pb-24">
        <Link href="/practicas" className="inline-flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "rgba(107,39,55,0.6)" }}>
          <ArrowLeft className="w-4 h-4" /> Mis prácticas
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-black" style={{ color: "#2d0f16" }}>Planes si-entonces</h1>
            <p className="text-xs font-light mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>Intenciones de implementación (Gollwitzer)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: showForm ? "rgba(107,39,55,0.1)" : "#6B2737" }}
          >
            {showForm
              ? <X className="w-4 h-4" style={{ color: "#6B2737" }} />
              : <Plus className="w-4 h-4 text-white" />
            }
          </button>
        </div>

        {/* ── FORMULARIO ── */}
        {showForm && (
          <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#C9A84C" }}>Nuevo plan</p>
            <div className="mb-3">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#6B2737" }}>
                Cuando... (situación concreta)
              </label>
              <input
                type="text" value={trigger} onChange={e => setTrigger(e.target.value)}
                placeholder="ej. sienta el impulso de comer por estrés a las 18h"
                maxLength={300}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "#F5F0E8", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>
            <div className="mb-3">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#6B2737" }}>
                Yo... (acción intencional)
              </label>
              <input
                type="text" value={action} onChange={e => setAction(e.target.value)}
                placeholder="ej. haré 3 respiraciones y me preguntaré qué necesito"
                maxLength={300}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "#F5F0E8", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#6B2737" }}>
                Vinculado a mi valor de... (opcional)
              </label>
              <input
                type="text" value={value} onChange={e => setValue(e.target.value)}
                placeholder="ej. bienestar, presencia, amabilidad conmigo"
                maxLength={80}
                className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "#F5F0E8", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full text-sm border" style={{ borderColor: "rgba(107,39,55,0.2)", color: "#6B2737" }}>
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !trigger.trim() || !action.trim()}
                className="flex-1 py-2.5 rounded-full text-sm font-medium disabled:opacity-40"
                style={{ background: "#6B2737", color: "#F5F0E8" }}
              >
                {saving ? "Guardando..." : "Guardar plan"}
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── PLANES ACTIVOS ── */}
        {!loading && active.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-sm font-light" style={{ color: "rgba(107,39,55,0.4)" }}>No tienes planes activos todavía.</p>
            <button onClick={() => setShowForm(true)} className="mt-4 text-xs font-medium" style={{ color: "#6B2737" }}>
              Crea tu primer plan →
            </button>
          </div>
        )}

        {active.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.4)" }}>
              Planes activos
            </p>
            <div className="flex flex-col gap-3">
              {active.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-light mb-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>Cuando</p>
                      <p className="text-sm font-medium leading-snug" style={{ color: "#2d0f16" }}>{p.trigger_situation}</p>
                    </div>
                    <button onClick={() => deleteIntention(p.id)} className="shrink-0 opacity-30 hover:opacity-70 mt-0.5">
                      <X className="w-4 h-4" style={{ color: "#6B2737" }} />
                    </button>
                  </div>
                  <p className="text-xs font-light mb-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>Yo</p>
                  <p className="text-sm leading-snug mb-3" style={{ color: "#6B2737" }}>{p.intended_action}</p>
                  {p.linked_value && (
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#C9A84C" }}>
                      Valor: {p.linked_value}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(107,39,55,0.5)" }}>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {p.times_triggered} activado{p.times_triggered !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> {p.times_completed} completado{p.times_completed !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => patchIntention(p.id, "trigger")}
                        className="px-3 py-1 rounded-full text-[11px] font-medium"
                        style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}
                      >
                        Activé
                      </button>
                      <button
                        onClick={() => patchIntention(p.id, "complete")}
                        className="px-3 py-1 rounded-full text-[11px] font-medium"
                        style={{ background: "#6B2737", color: "#F5F0E8" }}
                      >
                        Completé
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PLANES INACTIVOS ── */}
        {inactive.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.3)" }}>
              Pausados
            </p>
            <div className="flex flex-col gap-2">
              {inactive.map(p => (
                <div key={p.id} className="bg-white/60 rounded-xl p-3 flex items-center justify-between" style={{ border: "1px solid rgba(107,39,55,0.06)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: "rgba(107,39,55,0.5)" }}>{p.trigger_situation}</p>
                    <p className="text-[11px] truncate" style={{ color: "rgba(107,39,55,0.35)" }}>{p.intended_action}</p>
                  </div>
                  <button onClick={() => patchIntention(p.id, "toggle_active")} className="ml-3 shrink-0 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}>
                    Reactivar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
