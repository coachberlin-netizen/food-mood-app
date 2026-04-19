"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getBowlColor } from "@/lib/bowl-color"

// ── Types ─────────────────────────────────────────────────────────────────────

type CountKey =
  | "protein_count"
  | "fish_count"
  | "vegetables_count"
  | "fruits_count"
  | "grains_count"
  | "fermented_count"
  | "nuts_count"
  | "processed_count"
  | "water_count"

type Counts = Record<CountKey, number>

const EMPTY: Counts = {
  protein_count: 0,
  fish_count: 0,
  vegetables_count: 0,
  fruits_count: 0,
  grains_count: 0,
  fermented_count: 0,
  nuts_count: 0,
  processed_count: 0,
  water_count: 0,
}

// ── Food groups config ────────────────────────────────────────────────────────

interface FoodGroup {
  key: CountKey
  emoji: string
  label: string
  color: string
}

const GROUPS: FoodGroup[] = [
  { key: "protein_count",    emoji: "🥩", label: "Proteína animal",   color: "#C04060" },
  { key: "fish_count",       emoji: "🐟", label: "Pescado",           color: "#4A7AB5" },
  { key: "vegetables_count", emoji: "🥬", label: "Vegetales",         color: "#5A9B8A" },
  { key: "fruits_count",     emoji: "🍊", label: "Frutas",            color: "#E8703A" },
  { key: "grains_count",     emoji: "🌾", label: "Granos integrales", color: "#C8902A" },
  { key: "fermented_count",  emoji: "🫙", label: "Fermentados",       color: "#7A5AAA" },
  { key: "nuts_count",       emoji: "🥜", label: "Frutos secos",      color: "#8B5A2B" },
  { key: "processed_count",  emoji: "🍪", label: "Procesados",        color: "#8B2020" },
  { key: "water_count",      emoji: "💧", label: "Agua/infusiones",   color: "#4A90D0" },
]

// ── Bowl geometry — fibonacci spiral within ellipse ───────────────────────────

const CX = 110, CY = 115, RX = 72, RY = 50
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const MAX_BOLITAS = 30

const SLOTS = Array.from({ length: MAX_BOLITAS }, (_, i) => {
  const r = Math.sqrt((i + 0.5) / MAX_BOLITAS) * 0.88
  const a = i * GOLDEN
  return { x: CX + r * RX * Math.cos(a), y: CY + r * RY * Math.sin(a) }
})

function buildBolitas(counts: Counts) {
  const out: { x: number; y: number; color: string }[] = []
  let slot = 0
  for (const g of GROUPS) {
    for (let i = 0; i < counts[g.key] && slot < MAX_BOLITAS; i++) {
      out.push({ ...SLOTS[slot], color: g.color })
      slot++
    }
  }
  return out
}

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

function computeInsights(c: Counts): string[] {
  const insights: string[] = []
  const distinct = GROUPS.filter(g => c[g.key] > 0).length
  const hasProtein = c.protein_count >= 1 || c.fish_count >= 1

  if (distinct >= 6) insights.push("Bol variado — excelente diversidad")
  if (hasProtein && c.vegetables_count >= 1 && c.fruits_count >= 1)
    insights.push("Bol equilibrado")
  if (c.fermented_count >= 1) insights.push("✓ Fermentados — microbioma activo")
  if (c.processed_count >= 3)
    insights.push("Muchos procesados hoy — añade un vegetal mañana")
  return insights
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

// ── BowlSVG ───────────────────────────────────────────────────────────────────

function BowlSVG({
  bolitas,
  fillColor,
}: {
  bolitas: { x: number; y: number; color: string }[]
  fillColor: string
}) {
  return (
    <svg viewBox="0 0 220 200" className="w-full max-w-[240px] drop-shadow-lg">
      <defs>
        <clipPath id="bowl-clip">
          <ellipse cx="110" cy="115" rx="79" ry="55" />
        </clipPath>
        <radialGradient id="rim-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e8dcc8" />
          <stop offset="100%" stopColor="#c8b89a" />
        </radialGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="110" cy="192" rx="85" ry="9" fill="rgba(0,0,0,0.12)" />

      {/* Outer rim */}
      <ellipse cx="110" cy="108" rx="100" ry="74" fill="url(#rim-grad)" />

      {/* Inner wall depth ring */}
      <ellipse cx="110" cy="112" rx="90" ry="66" fill="#c2ae90" />

      {/* Bowl interior — color transitions as food is added */}
      <ellipse
        cx="110"
        cy="115"
        rx="82"
        ry="58"
        fill={fillColor}
        style={{ transition: "fill 0.7s ease" }}
      />

      {/* Bolitas — clipped to interior */}
      <g clipPath="url(#bowl-clip)">
        {bolitas.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r="8"
            fill={b.color}
            opacity="0.88"
          />
        ))}
      </g>

      {/* Rim highlight (light reflection) */}
      <ellipse
        cx="86"
        cy="72"
        rx="26"
        ry="7"
        fill="white"
        opacity="0.22"
        transform="rotate(-18 86 72)"
      />
    </svg>
  )
}

// ── GroupCard ─────────────────────────────────────────────────────────────────

function GroupCard({
  group,
  count,
  onIncrement,
  onDecrement,
}: {
  group: FoodGroup
  count: number
  onIncrement: () => void
  onDecrement: () => void
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longFiredRef = useRef(false)
  const [pressing, setPressing] = useState(false)

  const onDown = useCallback(() => {
    longFiredRef.current = false
    setPressing(true)
    timerRef.current = setTimeout(() => {
      longFiredRef.current = true
      setPressing(false)
      onDecrement()
    }, 600)
  }, [onDecrement])

  const onUp = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPressing(false)
    if (!longFiredRef.current) onIncrement()
  }, [onIncrement])

  const onCancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    longFiredRef.current = true // prevent increment on pointer-leave then up
    setPressing(false)
  }, [])

  const selected = count > 0

  return (
    <button
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onCancel}
      onTouchStart={(e) => { e.preventDefault(); onDown() }}
      onTouchEnd={(e) => { e.preventDefault(); onUp() }}
      onContextMenu={(e) => { e.preventDefault(); onDecrement() }}
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 select-none"
      style={{
        backgroundColor: selected ? "#F5F0E8" : "white",
        border: `2px solid ${selected ? group.color : "transparent"}`,
        boxShadow: pressing
          ? "inset 0 2px 6px rgba(0,0,0,0.12)"
          : "0 1px 4px rgba(0,0,0,0.07)",
        transform: pressing ? "scale(0.94)" : "scale(1)",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "manipulation",
        minHeight: "76px",
      }}
    >
      <span className="text-2xl leading-none">{group.emoji}</span>
      <span
        className="text-[10px] font-medium text-center leading-tight"
        style={{ color: "#2d0f16" }}
      >
        {group.label}
      </span>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
          style={{ backgroundColor: group.color }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BolPage() {
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [counts, setCounts] = useState<Counts>({ ...EMPTY })
  const [userId, setUserId] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [dayNumber, setDayNumber] = useState(0)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")
  const isNewTodayRef = useRef(true)
  const today = todayISO()

  // Derived state
  const bolitas = buildBolitas(counts)
  const fillColor = getBowlColor(counts)
  const totalGroups = GROUPS.filter(g => counts[g.key] > 0).length
  const activeGroups = GROUPS.filter(g => counts[g.key] > 0)
  const insights = computeInsights(counts)
  const progressPct = Math.min(100, (dayNumber / 90) * 100)

  // Load today's log + streak on mount
  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const uid = user?.id ?? null
      setUserId(uid)

      if (uid) {
        // Restore today's log if it exists
        const { data: log } = await supabase
          .from("food_log")
          .select("*")
          .eq("user_id", uid)
          .eq("log_date", today)
          .maybeSingle()

        if (log) {
          setCounts({
            protein_count:    log.protein_count    ?? 0,
            fish_count:       log.fish_count       ?? 0,
            vegetables_count: log.vegetables_count ?? 0,
            fruits_count:     log.fruits_count     ?? 0,
            grains_count:     log.grains_count     ?? 0,
            fermented_count:  log.fermented_count  ?? 0,
            nuts_count:       log.nuts_count       ?? 0,
            processed_count:  log.processed_count  ?? 0,
            water_count:      log.water_count      ?? 0,
          })
          setSaved(true)
          isNewTodayRef.current = false
        }

        // Load dates for streak + day number
        const { data: logs } = await supabase
          .from("food_log")
          .select("log_date")
          .eq("user_id", uid)
          .order("log_date", { ascending: false })
          .limit(90)

        if (logs && logs.length > 0) {
          setDayNumber(logs.length)
          const dates = logs.map((l: { log_date: string }) => l.log_date)
          setStreak(computeStreak(dates, today))
        }
      } else {
        // Anonymous: restore from localStorage
        const stored = localStorage.getItem(`fm_bol_${today}`)
        if (stored) {
          try {
            setCounts(JSON.parse(stored))
            setSaved(true)
            isNewTodayRef.current = false
          } catch {
            // ignore corrupt data
          }
        }
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const increment = useCallback(
    (key: CountKey) => {
      setCounts(prev => {
        const next = { ...prev, [key]: prev[key] + 1 }
        if (!userId) localStorage.setItem(`fm_bol_${today}`, JSON.stringify(next))
        return next
      })
      setSaved(false)
    },
    [userId, today]
  )

  const decrement = useCallback(
    (key: CountKey) => {
      setCounts(prev => {
        const next = { ...prev, [key]: Math.max(0, prev[key] - 1) }
        if (!userId) localStorage.setItem(`fm_bol_${today}`, JSON.stringify(next))
        return next
      })
      setSaved(false)
    },
    [userId, today]
  )

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }, [])

  const refreshStreak = useCallback(
    async (uid: string) => {
      const { data: logs } = await supabase
        .from("food_log")
        .select("log_date")
        .eq("user_id", uid)
        .order("log_date", { ascending: false })
        .limit(90)

      if (logs) {
        setDayNumber(logs.length)
        const dates = logs.map((l: { log_date: string }) => l.log_date)
        setStreak(computeStreak(dates, today))
      }
    },
    [supabase, today]
  )

  const handleSave = async () => {
    if (totalGroups === 0) return
    setSaving(true)

    const color = getBowlColor(counts)

    if (userId) {
      const { error } = await supabase.from("food_log").upsert(
        {
          user_id:          userId,
          log_date:         today,
          ...counts,
          bowl_color_hex:   color,
          updated_at:       new Date().toISOString(),
        },
        { onConflict: "user_id,log_date" }
      )

      if (error) {
        showToast("Error al guardar. Inténtalo de nuevo.")
      } else {
        setSaved(true)
        const wasNew = isNewTodayRef.current
        isNewTodayRef.current = false
        showToast("¡Bol guardado! 🥣")
        if (wasNew) await refreshStreak(userId)
      }
    } else {
      // Anonymous: insert with session_id + persist locally
      const sessionId = getOrCreateSessionId()
      localStorage.setItem(`fm_bol_${today}`, JSON.stringify(counts))
      await supabase.from("food_log").insert({
        user_id:        null,
        session_id:     sessionId,
        log_date:       today,
        ...counts,
        bowl_color_hex: color,
      })
      setSaved(true)
      isNewTodayRef.current = false
      showToast("¡Guardado! Regístrate para ver tu historial. 🥣")
    }

    setSaving(false)
  }

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
        </div>

        {/* ── Intro ── */}
        <div className="mb-7">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C9A84C" }}
          >
            Sin escribir · Sin contar · Sin calorías
          </p>
          <h1
            className="font-serif text-3xl font-bold leading-tight mb-2"
            style={{ color: "#2d0f16" }}
          >
            ¿Qué has puesto en tu bol hoy?
          </h1>
          <p className="text-sm font-light" style={{ color: "rgba(107,39,55,0.65)" }}>
            Toca los grupos que has comido. Cada tap llena tu bol.
          </p>
        </div>

        {/* ── Bowl SVG ── */}
        <div className="flex flex-col items-center mb-7">
          <BowlSVG bolitas={bolitas} fillColor={fillColor} />
          <p
            className="mt-3 text-sm font-medium"
            style={{ color: "#6B2737" }}
          >
            {totalGroups === 0
              ? "Tu bol está vacío — empieza a llenarlo"
              : `${totalGroups} grupo${totalGroups !== 1 ? "s" : ""} alimentario${totalGroups !== 1 ? "s" : ""} hoy`}
          </p>
        </div>

        {/* ── Grid de grupos ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {GROUPS.map(g => (
            <GroupCard
              key={g.key}
              group={g}
              count={counts[g.key]}
              onIncrement={() => increment(g.key)}
              onDecrement={() => decrement(g.key)}
            />
          ))}
        </div>

        {/* ── Counter strip ── */}
        {activeGroups.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 mb-6"
            style={{ scrollbarWidth: "none" }}
          >
            {activeGroups.map(g => (
              <div
                key={g.key}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full shrink-0 text-white text-xs font-semibold"
                style={{ backgroundColor: g.color }}
              >
                <span>{g.emoji}</span>
                <span>{counts[g.key]}×</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Insight card ── */}
        {insights.length > 0 && (
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
              Tu análisis
            </p>
            <ul className="space-y-1.5">
              {insights.map((ins, i) => (
                <li
                  key={i}
                  className="text-sm font-medium"
                  style={{ color: "#2d0f16" }}
                >
                  {ins}
                </li>
              ))}
            </ul>
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
            Tus hábitos, tus hematíes, tu microbioma — todo se renueva en 90
            días. Es el ciclo biológico real del cambio.
          </p>
        </div>

        {/* ── Save button ── */}
        <button
          onClick={handleSave}
          disabled={saving || totalGroups === 0}
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
            ? "✓ Bol guardado"
            : "Guardar mi bol del día →"}
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
