"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Check } from "lucide-react"

const MOODS = [
  { id: "activacion", label: "Activación",  color: "#E8A87C" },
  { id: "calma",      label: "Calma",        color: "#7EC8C8" },
  { id: "focus",      label: "Foco",         color: "#F4E285" },
  { id: "social",     label: "Social",       color: "#F4A7B9" },
  { id: "reset",      label: "Restauración", color: "#B8A9C9" },
  { id: "confort",    label: "Confort",      color: "#D4A574" },
]

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  })
}

interface DiarioFormProps {
  onSaved?: () => void
}

export function DiarioForm({ onSaved }: DiarioFormProps) {
  const fecha = todayISO()

  const [mood_id,      setMoodId]      = useState<string | null>(null)
  const [estado_libre, setEstado]      = useState("")
  const [comida_libre, setComida]      = useState("")
  const [sueno_horas,  setSueno]       = useState<number | null>(null)
  const [ciclo_info,   setCiclo]       = useState("")
  const [nota_libre,   setNota]        = useState("")

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [hovered,  setHovered]  = useState<string | null>(null)

  // Load today's entry if it exists
  const loadToday = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/diario?date=${fecha}`)
      if (!res.ok) return
      const { entrada } = await res.json()
      if (entrada) {
        setMoodId(entrada.mood_id ?? null)
        setEstado(entrada.estado_libre ?? "")
        setComida(entrada.comida_libre ?? "")
        setSueno(entrada.sueno_horas ?? null)
        setCiclo(entrada.ciclo_info ?? "")
        setNota(entrada.nota_libre ?? "")
      }
    } finally {
      setLoading(false)
    }
  }, [fecha])

  useEffect(() => { loadToday() }, [loadToday])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch("/api/diario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha, mood_id, estado_libre: estado_libre.trim(),
          comida_libre: comida_libre.trim(),
          sueno_horas: sueno_horas,
          ciclo_info: ciclo_info.trim() || null,
          nota_libre: nota_libre.trim() || null,
        }),
      })
      setSaved(true)
      onSaved?.()
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const hasContent = mood_id || estado_libre || comida_libre || sueno_horas !== null || nota_libre

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-5 w-48 bg-[#6B2737]/8 rounded" />
        <div className="h-28 bg-[#6B2737]/5 rounded-2xl" />
        <div className="h-28 bg-[#6B2737]/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Date header */}
      <p className="font-serif text-[15px] text-[#6B2737]/50 mb-6 capitalize">
        {formatDate(fecha)}
      </p>

      <div className="flex flex-col gap-7">

        {/* ── 1 · Cómo me siento ── */}
        <div className="flex flex-col gap-3">
          <label className="text-[12px] font-semibold uppercase tracking-widest text-[#6B2737]/40">
            Cómo me siento
          </label>

          {/* Mood dots */}
          <div className="flex items-center gap-3 mb-1">
            {MOODS.map((m) => (
              <div key={m.id} className="relative" onMouseEnter={() => setHovered(m.id)} onMouseLeave={() => setHovered(null)}>
                <button
                  type="button"
                  onClick={() => setMoodId(mood_id === m.id ? null : m.id)}
                  className="w-8 h-8 rounded-full transition-transform"
                  style={{
                    backgroundColor: m.color,
                    transform: mood_id === m.id ? "scale(1.3)" : "scale(1)",
                    outline: mood_id === m.id ? `2px solid ${m.color}` : "none",
                    outlineOffset: "3px",
                  }}
                />
                <AnimatePresence>
                  {hovered === m.id && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-[#6B2737]/60 font-medium pointer-events-none"
                    >
                      {m.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <textarea
            value={estado_libre}
            onChange={e => setEstado(e.target.value)}
            placeholder="Cuéntame con tus palabras. Sin filtros."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border border-[#6B2737]/12 bg-white text-[14px] text-[#2d0f16] placeholder-[#6B2737]/25 resize-none focus:outline-none focus:ring-2 focus:ring-[#6B2737]/15 leading-relaxed"
          />
        </div>

        {/* ── 2 · Qué he comido ── */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-semibold uppercase tracking-widest text-[#6B2737]/40">
            Qué he comido
          </label>
          <textarea
            value={comida_libre}
            onChange={e => setComida(e.target.value)}
            placeholder="Sin pesar, sin medir. Solo lo que recuerdas."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl border border-[#6B2737]/12 bg-white text-[14px] text-[#2d0f16] placeholder-[#6B2737]/25 resize-none focus:outline-none focus:ring-2 focus:ring-[#6B2737]/15 leading-relaxed"
          />
        </div>

        {/* ── 3 · Sueño + 4 · Ciclo ── */}
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Sleep stepper */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[12px] font-semibold uppercase tracking-widest text-[#6B2737]/40">
              Sueño aproximado
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSueno(h => h === null ? 6 : Math.max(0, +(h - 0.5).toFixed(1)))}
                className="w-8 h-8 rounded-full border border-[#6B2737]/15 flex items-center justify-center text-[#6B2737]/50 hover:bg-[#6B2737]/5 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-[22px] font-serif text-[#2d0f16] w-16 text-center">
                {sueno_horas !== null ? `${sueno_horas}h` : "—"}
              </span>
              <button
                type="button"
                onClick={() => setSueno(h => h === null ? 6 : Math.min(12, +(h + 0.5).toFixed(1)))}
                className="w-8 h-8 rounded-full border border-[#6B2737]/15 flex items-center justify-center text-[#6B2737]/50 hover:bg-[#6B2737]/5 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Cycle */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[12px] font-semibold uppercase tracking-widest text-[#6B2737]/40">
              Ciclo <span className="normal-case font-normal opacity-60">(opcional)</span>
            </label>
            <input
              type="text"
              value={ciclo_info}
              onChange={e => setCiclo(e.target.value)}
              placeholder="Día 14, fase lútea…"
              className="px-4 py-3 rounded-2xl border border-[#6B2737]/12 bg-white text-[14px] text-[#2d0f16] placeholder-[#6B2737]/25 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/15"
            />
          </div>
        </div>

        {/* ── 5 · Nota libre ── */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-semibold uppercase tracking-widest text-[#6B2737]/40">
            Nota libre
          </label>
          <textarea
            value={nota_libre}
            onChange={e => setNota(e.target.value)}
            placeholder="Algo que quieras recordar de hoy."
            rows={2}
            className="w-full px-4 py-3 rounded-2xl border border-[#6B2737]/12 bg-white text-[14px] text-[#2d0f16] placeholder-[#6B2737]/25 resize-none focus:outline-none focus:ring-2 focus:ring-[#6B2737]/15 leading-relaxed"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasContent || saving}
            className="flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: saved ? "#4a9b6b" : "#6B2737", color: "#F5F0E8" }}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                  <Check size={14} /> Guardado
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {saving ? "Guardando…" : "Guardar"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

      </div>
    </div>
  )
}
