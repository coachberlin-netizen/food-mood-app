"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  calculateFoodMoodIndex,
  getEmotionalScore,
  getFoodScore,
  type TestInput,
  type FoodInput,
} from "@/lib/calculate-index"
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion"

const STREAK_MILESTONES = new Set([3, 7, 14, 21, 30])

// ── Types ─────────────────────────────────────────────────────────────────────

interface TestSnapshot extends TestInput {
  id: string
  color_hex: string | null
  state_name: string | null
  subemocion_1: string | null
  subpct_1: number | null
  subemocion_2: string | null
  subpct_2: number | null
  subemocion_3: string | null
  subpct_3: number | null
}

interface FoodSnapshot extends FoodInput {
  id: string
}

interface HistoryEntry {
  log_date: string
  index_value: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SUB_COLORS: Record<string, string> = {
  "Calma":         "#5A9B8A",
  "Ansiedad leve": "#7A5AAA",
  "Energía":       "#E8703A",
  "Melancolía":    "#4A7AB5",
  "Conexión":      "#C04878",
  "Foco":          "#4A90D0",
}

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

function indexLabel(v: number): string {
  if (v >= 85) return "Excepcional"
  if (v >= 70) return "Muy bueno"
  if (v >= 55) return "Equilibrado"
  if (v >= 40) return "Mejorable"
  if (v >= 25) return "Difícil"
  return "Jornada exigente"
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return null
  return {
    r: parseInt(m[1].slice(0, 2), 16),
    g: parseInt(m[1].slice(2, 4), 16),
    b: parseInt(m[1].slice(4, 6), 16),
  }
}

function avg(arr: number[]): number {
  return arr.length === 0 ? 0 : Math.round(arr.reduce((s, v) => s + v, 0) / arr.length)
}

// ── SVG Trend Chart ───────────────────────────────────────────────────────────

function TrendChart({ data }: { data: HistoryEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center">
        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          Registra más días para ver tu tendencia
        </span>
      </div>
    )
  }

  const W = 300, H = 68, PX = 10, PY = 8
  const n = data.length

  const pts = data.map((d, i) => ({
    x: PX + (n === 1 ? (W - PX * 2) / 2 : (i / (n - 1)) * (W - PX * 2)),
    y: PY + ((100 - d.index_value) / 100) * (H - PY * 2),
  }))

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ")
  const areaPath =
    n >= 2
      ? `${linePath} L${pts[n - 1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`
      : ""

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "68px" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="fmi-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      {areaPath && <path d={areaPath} fill="url(#fmi-grad)" />}
      {n >= 2 && (
        <path
          d={linePath}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {/* Last point dot */}
      <circle
        cx={pts[n - 1].x}
        cy={pts[n - 1].y}
        r="3.5"
        fill="#C9A84C"
      />
    </svg>
  )
}

// ── Color orb sub-component ───────────────────────────────────────────────────

function ColorCard({ test }: { test: TestSnapshot }) {
  const hex = test.color_hex ?? "#888"
  const rgb = hexToRgb(hex)
  const light = rgb
    ? `rgb(${Math.min(255, rgb.r + 45)},${Math.min(255, rgb.g + 45)},${Math.min(255, rgb.b + 45)})`
    : hex
  const dark = rgb
    ? `rgb(${Math.max(0, rgb.r - 25)},${Math.max(0, rgb.g - 25)},${Math.max(0, rgb.b - 25)})`
    : hex

  const subs = [
    { name: test.subemocion_1, pct: test.subpct_1 },
    { name: test.subemocion_2, pct: test.subpct_2 },
    { name: test.subemocion_3, pct: test.subpct_3 },
  ].filter((s): s is { name: string; pct: number } => !!s.name && s.pct != null)

  return (
    <div
      className="rounded-3xl p-5"
      style={{
        backgroundColor: "white",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-4"
        style={{ color: "#C9A84C" }}
      >
        Tu color de hoy
      </p>

      <div className="flex items-center gap-4 mb-4">
        {/* Orb */}
        <div
          className="shrink-0 w-14 h-14 rounded-full shadow-md"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${light}, ${hex} 55%, ${dark})`,
          }}
        />
        <div>
          <p
            className="font-serif text-lg font-semibold leading-tight"
            style={{ color: "#2d0f16" }}
          >
            {test.state_name ?? "Estado desconocido"}
          </p>
          <p className="text-xs font-light mt-0.5" style={{ color: "rgba(107,39,55,0.55)" }}>
            Estado emocional del día
          </p>
        </div>
      </div>

      {/* Sub-emotions */}
      {subs.length > 0 && (
        <div className="space-y-2">
          {subs.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${s.pct}%`,
                    backgroundColor: SUB_COLORS[s.name] ?? "#888",
                  }}
                />
              </div>
              <span
                className="text-[10px] font-medium w-24 shrink-0"
                style={{ color: "#2d0f16" }}
              >
                {s.name} {s.pct}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FoodMoodIndex() {
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [loading, setLoading]               = useState(true)
  const [userId, setUserId]                 = useState<string | null>(null)
  const [indexValue, setIndexValue]         = useState<number | null>(null)
  const [yesterday, setYesterday]           = useState<number | null>(null)
  const [streak, setStreak]                 = useState(0)
  const [history, setHistory]               = useState<HistoryEntry[]>([])
  const [todayTest, setTodayTest]           = useState<TestSnapshot | null>(null)
  const [todayBol, setTodayBol]             = useState<FoodSnapshot | null>(null)
  const [todaySymptoms, setTodaySymptoms]   = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const today = todayISO()

      // Fetch today's test + bol + symptoms in parallel
      const [{ data: testRaw }, { data: bolRaw }, { data: sympRaw }] = await Promise.all([
        supabase
          .from("test_results")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", `${today}T00:00:00`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("food_log")
          .select("*")
          .eq("user_id", user.id)
          .eq("log_date", today)
          .maybeSingle(),
        supabase
          .from("symptom_log")
          .select("id")
          .eq("user_id", user.id)
          .eq("log_date", today)
          .maybeSingle(),
      ])
      setTodaySymptoms(!!sympRaw)

      const test = testRaw as TestSnapshot | null
      const bol  = bolRaw  as FoodSnapshot | null
      setTodayTest(test)
      setTodayBol(bol)

      // Calculate + upsert if either data point exists
      if (test || bol) {
        const idx = calculateFoodMoodIndex(test, bol)
        setIndexValue(idx)

        await supabase.from("fm_index_log").upsert(
          {
            user_id:         user.id,
            log_date:        today,
            index_value:     idx,
            emotional_score: test ? getEmotionalScore(test) : null,
            food_score:      bol  ? getFoodScore(bol)        : null,
            test_result_id:  test?.id ?? null,
            food_log_id:     bol?.id  ?? null,
          },
          { onConflict: "user_id,log_date" }
        )
      }

      // Fetch history + streak + yesterday in parallel
      const [{ data: histRaw }, { data: streakRaw }, { data: yestRaw }] = await Promise.all([
        supabase
          .from("fm_index_log")
          .select("log_date, index_value")
          .eq("user_id", user.id)
          .order("log_date", { ascending: true })
          .limit(30),
        supabase
          .from("user_streaks")
          .select("current_streak")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("fm_index_log")
          .select("index_value")
          .eq("user_id", user.id)
          .lt("log_date", today)
          .order("log_date", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      if (histRaw)   setHistory(histRaw as HistoryEntry[])
      if (streakRaw) setStreak(streakRaw.current_streak ?? 0)
      if (yestRaw)   setYesterday(yestRaw.index_value)

      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Animations ───────────────────────────────────────────────────────────

  const prefersReduced = useReducedMotion()
  const count          = useMotionValue(0)
  const displayCount   = useTransform(count, Math.round)
  const [showTrend, setShowTrend] = useState(false)

  useEffect(() => {
    if (indexValue == null) return
    setShowTrend(false)
    if (prefersReduced) { count.set(indexValue); setShowTrend(true); return }
    const controls = animate(count, indexValue, {
      duration:   0.6,
      ease:       "easeOut",
      onComplete: () => setShowTrend(true),
    })
    return controls.stop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexValue, prefersReduced])

  // ── Derived stats ────────────────────────────────────────────────────────

  const vals30 = history.map(d => d.index_value)
  const vals7  = history.slice(-7).map(d => d.index_value)
  const avg7d  = vals7.length  > 0 ? avg(vals7)  : null
  const avg30d = vals30.length > 0 ? avg(vals30) : null
  const best   = vals30.length > 0 ? Math.max(...vals30) : null
  const trend  =
    indexValue != null && yesterday != null ? indexValue - yesterday : null

  // ── Loading skeleton ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="mb-6 space-y-4">
        <div
          className="rounded-3xl p-6 animate-pulse"
          style={{ backgroundColor: "#1a0a0f", height: "240px" }}
        />
      </div>
    )
  }

  // Not authenticated — render nothing (header handles nav)
  if (!userId) return null

  const hasData = indexValue != null

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mb-6 space-y-4">

      {/* ── Main index card ── */}
      <div className="rounded-3xl p-6 overflow-hidden" style={{ backgroundColor: "#1a0a0f" }}>

        {/* Top row: eyebrow + streak */}
        <div className="flex items-center justify-between mb-5">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "rgba(201,168,76,0.7)" }}
          >
            Tu índice hoy
          </p>
          {streak > 0 ? (
            <motion.div
              key={streak}
              className="relative flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ backgroundColor: "#6B2737" }}
              initial={{ scale: 1 }}
              animate={prefersReduced ? {} : { scale: [1, 1.15, 1] }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            >
              {/* Milestone gold pulse ring */}
              {STREAK_MILESTONES.has(streak) && !prefersReduced && (
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ border: "2px solid #C9A84C" }}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}
              <span className="text-xs">🔥</span>
              <span className="text-xs font-bold text-white">
                {streak} {streak === 1 ? "día" : "días"}
              </span>
            </motion.div>
          ) : (
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Empieza hoy tu racha
            </span>
          )}
        </div>

        {/* Big number — count-up animation */}
        <div className="flex flex-col items-center mb-5">
          <motion.p
            className="font-serif leading-none"
            style={{
              fontSize: "clamp(64px, 18vw, 96px)",
              color: hasData ? "#C9A84C" : "rgba(201,168,76,0.25)",
              fontWeight: 700,
            }}
          >
            {hasData ? displayCount : "—"}
          </motion.p>
          <p
            className="text-base font-medium mt-1"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {hasData ? indexLabel(indexValue!) : "Sin datos de hoy"}
          </p>

          {/* Trend — fades in after count-up */}
          {trend != null && showTrend && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold mt-1"
              style={{
                color: trend > 0 ? "#5A9B8A" : trend < 0 ? "#C04060" : "rgba(255,255,255,0.4)",
              }}
            >
              {trend > 0 ? `↑ ${trend}` : trend < 0 ? `↓ ${Math.abs(trend)}` : "—"}{" "}
              {trend !== 0 && "puntos vs ayer"}
            </motion.p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Ø 7 días",  value: avg7d },
            { label: "Ø 30 días", value: avg30d },
            { label: "Mejor mes", value: best },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-2xl p-3 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <p
                className="text-xl font-serif font-bold"
                style={{ color: s.value != null ? "#C9A84C" : "rgba(201,168,76,0.25)" }}
              >
                {s.value ?? "—"}
              </p>
              <p
                className="text-[10px] mt-0.5 font-medium"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <TrendChart data={history} />

        {/* Month axis labels */}
        {history.length >= 2 && (
          <div className="flex justify-between mt-1">
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              {history[0].log_date.slice(5)}
            </span>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              hoy
            </span>
          </div>
        )}
      </div>

      {/* ── Color del día (if test done today) ── */}
      {todayTest && <ColorCard test={todayTest} />}

      {/* ── Quick-action CTAs ── */}
      {(!todayTest || !todayBol || !todaySymptoms) && (
        <div
          className="rounded-3xl p-5"
          style={{
            backgroundColor: "#F5F0E8",
            border: "1px solid rgba(107,39,55,0.1)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "#6B2737" }}
          >
            Completa tu día
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            {!todayTest && (
              <Link
                href="/test"
                className="flex-1 py-3 rounded-2xl text-center text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#6B2737" }}
              >
                Hacer el test →
              </Link>
            )}
            {!todayBol && (
              <Link
                href="/bol"
                className="flex-1 py-3 rounded-2xl text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "white",
                  border: "2px solid #6B2737",
                  color: "#6B2737",
                }}
              >
                🥣 Registrar mi bol
              </Link>
            )}
            {!todaySymptoms && (
              <Link
                href="/sintomas"
                className="flex-1 py-3 rounded-2xl text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "white",
                  border: "2px solid #6B2737",
                  color: "#6B2737",
                }}
              >
                🩺 Mis síntomas
              </Link>
            )}
          </div>
          {hasData && (
            <p
              className="text-[10px] mt-2 text-center"
              style={{ color: "rgba(107,39,55,0.45)" }}
            >
              {!todayTest && !todayBol
                ? "El índice se calculará cuando completes alguna de las dos"
                : "Completa la otra actividad para afinar tu índice"}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
