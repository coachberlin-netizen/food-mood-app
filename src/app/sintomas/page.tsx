"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// ── Types ─────────────────────────────────────────────────────────────────────

type SymptomKey =
  | "bloating"
  | "sleep"
  | "brain_fog"
  | "energy"
  | "cycle"
  | "anxiety"
  | "headache"
  | "digestion"
  | "mood"

type Levels = Record<SymptomKey, number>

const EMPTY_LEVELS: Levels = {
  bloating: 0, sleep: 0, brain_fog: 0, energy: 0, cycle: 0,
  anxiety: 0, headache: 0, digestion: 0, mood: 0,
}

// ── Symptom config ────────────────────────────────────────────────────────────

interface Symptom {
  key: SymptomKey
  emoji: string
  nombre: string
  color: string
}

const SYMPTOMS: Symptom[] = [
  { key: "bloating",   emoji: "🤰", nombre: "Hinchazón",      color: "#E8703A" },
  { key: "sleep",      emoji: "😴", nombre: "Sueño",          color: "#4A7AB5" },
  { key: "brain_fog",  emoji: "🧠", nombre: "Niebla mental",  color: "#7A5AAA" },
  { key: "energy",     emoji: "⚡", nombre: "Energía",        color: "#C8902A" },
  { key: "cycle",      emoji: "🌙", nombre: "Ciclo",          color: "#C04878" },
  { key: "anxiety",    emoji: "😟", nombre: "Ansiedad",       color: "#6B2737" },
  { key: "headache",   emoji: "🤯", nombre: "Cabeza",         color: "#8B2020" },
  { key: "digestion",  emoji: "🫁", nombre: "Digestión",      color: "#5A9B8A" },
  { key: "mood",       emoji: "🌡", nombre: "Estado general", color: "#C9A84C" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("fm_session_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("fm_session_id", id)
  }
  return id
}

function computeStreak(dates: string[], today: string): number {
  const set = new Set(dates)
  let streak = 0
  const cursor = new Date(today)
  while (set.has(cursor.toISOString().split("T")[0])) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

// ── LevelDots ─────────────────────────────────────────────────────────────────

function LevelDots({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex gap-1 mt-1.5">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all duration-200"
          style={{
            backgroundColor: i <= level ? color : "rgba(0,0,0,0.1)",
            transform: i <= level ? "scale(1.15)" : "scale(1)",
          }}
        />
      ))}
    </div>
  )
}

// ── SymptomCard ───────────────────────────────────────────────────────────────

function SymptomCard({
  symptom,
  level,
  onTap,
}: {
  symptom: Symptom
  level: number
  onTap: () => void
}) {
  const [pressing, setPressing] = useState(false)

  const bgAlpha     = level === 0 ? 0 : level === 1 ? 0.06 : level === 2 ? 0.13 : 0.22
  const borderAlpha = level === 0 ? 0 : level === 1 ? 0.28 : level === 2 ? 0.55 : 1

  return (
    <button
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => { setPressing(false); onTap() }}
      onPointerLeave={() => setPressing(false)}
      className="relative flex flex-col items-center justify-center gap-1 rounded-2xl p-4 select-none w-full"
      style={{
        backgroundColor: level > 0
          ? `rgba(${hexToRgb(symptom.color)}, ${bgAlpha})`
          : "white",
        border: `2px solid ${level > 0
          ? `rgba(${hexToRgb(symptom.color)}, ${borderAlpha})`
          : "transparent"}`,
        boxShadow: pressing
          ? "inset 0 2px 6px rgba(0,0,0,0.1)"
          : "0 1px 4px rgba(0,0,0,0.07)",
        transform: pressing ? "scale(0.93)" : "scale(1)",
        transition: "transform 0.1s ease, background-color 0.2s ease, border-color 0.2s ease",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        minHeight: "96px",
      }}
    >
      <span className="text-2xl leading-none">{symptom.emoji}</span>
      <span
        className="text-[11px] font-medium text-center leading-tight"
        style={{ color: level > 0 ? symptom.color : "#2d0f16" }}
      >
        {symptom.nombre}
      </span>
      <LevelDots level={level} color={symptom.color} />
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SintomasPage() {
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [levels, setLevels]       = useState<Levels>({ ...EMPTY_LEVELS })
  const [notes, setNotes]         = useState("")
  const [userId, setUserId]       = useState<string | null>(null)
  const [streak, setStreak]       = useState(0)
  const [dayNumber, setDayNumber] = useState(0)
  const [logCount, setLogCount]   = useState(0)
  const [saved, setSaved]         = useState(false)
  const [saving, setSaving]       = useState(false)
  const [toast, setToast]         = useState("")
  const [pattern, setPattern]     = useState<string | null>(null)
  const today = todayISO()

  const totalActive = Object.values(levels).filter(v => v > 0).length

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      const uid = user?.id ?? null
      setUserId(uid)

      if (uid) {
        const [{ data: log }, { data: logs }] = await Promise.all([
          supabase
            .from("symptom_log")
            .select("*")
            .eq("user_id", uid)
            .eq("log_date", today)
            .maybeSingle(),
          supabase
            .from("symptom_log")
            .select("log_date")
            .eq("user_id", uid)
            .order("log_date", { ascending: false })
            .limit(90),
        ])

        if (log) {
          setLevels({
            bloating:  log.bloating_level  ?? 0,
            sleep:     log.sleep_level     ?? 0,
            brain_fog: log.brain_fog_level ?? 0,
            energy:    log.energy_level    ?? 0,
            cycle:     log.cycle_level     ?? 0,
            anxiety:   log.anxiety_level   ?? 0,
            headache:  log.headache_level  ?? 0,
            digestion: log.digestion_level ?? 0,
            mood:      log.mood_level      ?? 0,
          })
          setNotes(log.notes ?? "")
          setSaved(true)
        }

        if (logs && logs.length > 0) {
          const count = logs.length
          setLogCount(count)
          setDayNumber(count)
          const dates = logs.map((l: { log_date: string }) => l.log_date)
          setStreak(computeStreak(dates, today))

          if (count >= 7) {
            const { data: p } = await supabase
              .from("pattern_insights")
              .select("pattern_text")
              .eq("user_id", uid)
              .eq("is_active", true)
              .order("detected_at", { ascending: false })
              .limit(1)
              .maybeSingle()
            if (p) setPattern(p.pattern_text)
          }
        }
      } else {
        const stored = localStorage.getItem(`fm_sintomas_${today}`)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            setLevels(parsed.levels ?? EMPTY_LEVELS)
            setNotes(parsed.notes ?? "")
            setSaved(true)
          } catch { /* ignore corrupt data */ }
        }
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tap = useCallback((key: SymptomKey) => {
    setLevels(prev => {
      const next = { ...prev, [key]: (prev[key] + 1) % 4 }
      if (!userId) {
        localStorage.setItem(`fm_sintomas_${today}`, JSON.stringify({ levels: next, notes }))
      }
      return next
    })
    setSaved(false)
  }, [userId, today, notes])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }, [])

  const handleSave = async () => {
    if (totalActive === 0) return
    setSaving(true)

    const res = await fetch("/api/sintomas/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        levels,
        notes: notes.trim() || null,
        session_id: getOrCreateSessionId(),
        log_date: today,
      }),
    })

    if (!res.ok) {
      showToast("Error al guardar. Inténtalo de nuevo.")
    } else {
      setSaved(true)
      if (!userId) {
        localStorage.setItem(`fm_sintomas_${today}`, JSON.stringify({ levels, notes }))
      }
      showToast("¡Síntomas guardados! 🩺")
      if (userId) fetch("/api/correlations", { method: "POST" }).catch(() => {})
    }
    setSaving(false)
  }

  const progressPct = Math.min(100, (dayNumber / 90) * 100)

  return (
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      <div className="max-w-[520px] mx-auto px-4 py-8 pb-28">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="font-serif text-xl font-semibold"
            style={{ color: "#2d0f16" }}
          >
            Food<span style={{ color: "#C9A84C" }}>·</span>Mood
          </Link>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "#6B2737" }}
              >
                <span className="text-sm">🔥</span>
                <span className="text-xs font-bold text-white">
                  {streak} {streak === 1 ? "día" : "días"}
                </span>
              </div>
            )}
            <span
              className="text-xs font-light"
              style={{ color: "rgba(107,39,55,0.5)" }}
            >
              {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>

        {/* ── Intro ── */}
        <div className="mb-7">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C9A84C" }}
          >
            30 segundos · Sin escribir · Cada día
          </p>
          <h1
            className="font-serif text-3xl font-bold leading-tight mb-3"
            style={{ color: "#2d0f16" }}
          >
            ¿Cómo está tu cuerpo hoy?
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>
            La mayoría de tus hábitos son inconscientes — por eso son tan difíciles de cambiar.
            Al registrarlos se vuelven visibles. Al ser visibles, se pueden cambiar.
          </p>
        </div>

        {/* ── Grid de síntomas ── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SYMPTOMS.map(s => (
            <SymptomCard
              key={s.key}
              symptom={s}
              level={levels[s.key]}
              onTap={() => tap(s.key)}
            />
          ))}
        </div>

        {/* ── Nota opcional ── */}
        <div className="mb-6">
          <textarea
            value={notes}
            onChange={e => {
              setNotes(e.target.value.slice(0, 280))
              setSaved(false)
            }}
            placeholder="Algo que quieras recordar de hoy..."
            rows={3}
            className="w-full rounded-2xl px-4 py-3 text-sm font-light resize-none focus:outline-none"
            style={{
              backgroundColor: "white",
              color: "#2d0f16",
              border: "2px solid rgba(107,39,55,0.1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              transition: "border-color 0.2s ease",
            }}
          />
          <p
            className="text-right text-[10px] mt-1"
            style={{ color: "rgba(107,39,55,0.35)" }}
          >
            {notes.length}/280
          </p>
        </div>

        {/* ── Patrón detectado ── */}
        {logCount >= 7 && (
          <div
            className="mb-6 p-4 rounded-2xl"
            style={{
              backgroundColor: "white",
              borderLeft: "4px solid #C9A84C",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "#C9A84C" }}
            >
              Patrón detectado
            </p>
            <p className="text-sm font-medium" style={{ color: "#2d0f16" }}>
              {pattern ?? "Sigue registrando — los patrones aparecen a partir del día 7."}
            </p>
          </div>
        )}

        {logCount > 0 && logCount < 7 && (
          <div
            className="mb-6 p-4 rounded-2xl"
            style={{
              backgroundColor: "white",
              borderLeft: "4px solid rgba(201,168,76,0.35)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            <p className="text-sm" style={{ color: "rgba(107,39,55,0.6)" }}>
              Llevas {logCount} {logCount === 1 ? "día" : "días"}. Los patrones
              aparecen a partir del día 7 — sigue registrando.
            </p>
          </div>
        )}

        {/* ── Journey 90 días ── */}
        <div
          className="mb-8 p-5 rounded-3xl"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "#C9A84C" }}
          >
            Tu viaje
          </p>
          <p className="font-serif text-xl font-semibold text-white mb-3">
            Día {Math.max(1, dayNumber)} de 90
          </p>
          <div
            className="w-full h-2 rounded-full mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.max(2, progressPct)}%`,
                backgroundColor: "#C9A84C",
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <p
            className="text-xs font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Para entenderte mejor y encontrar soluciones holísticas.
            90 días es el ciclo biológico real del cambio.
          </p>
        </div>

        {/* ── Botón guardar ── */}
        <button
          onClick={handleSave}
          disabled={saving || totalActive === 0}
          className="w-full py-4 rounded-2xl font-semibold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          style={{
            backgroundColor: saved ? "#5A9B8A" : "#6B2737",
            boxShadow: "0 4px 14px rgba(107,39,55,0.22)",
            transition: "background-color 0.4s ease, opacity 0.2s ease",
          }}
        >
          {saving
            ? "Guardando…"
            : saved
            ? "✓ Síntomas guardados"
            : "Guardar síntomas de hoy →"}
        </button>

        <p
          className="text-center text-[10px] mt-2"
          style={{ color: "rgba(107,39,55,0.4)" }}
        >
          Puedes seguir editando hasta las 23:59
        </p>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-xl z-50 whitespace-nowrap"
          style={{ backgroundColor: "#2d0f16" }}
        >
          {toast}
        </div>
      )}
    </main>
  )
}
