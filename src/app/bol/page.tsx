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
  protein_count: 0, fish_count: 0, vegetables_count: 0, fruits_count: 0,
  grains_count: 0, fermented_count: 0, nuts_count: 0, processed_count: 0, water_count: 0,
}

// ── Food groups ───────────────────────────────────────────────────────────────

interface FoodGroup {
  id: string
  key: CountKey
  emoji: string
  label: string
  color: string
  light: string
}

const GROUPS: FoodGroup[] = [
  { id: "protein",   key: "protein_count",    emoji: "🥩", label: "Proteína animal",   color: "#C4622D", light: "#F5E0D3" },
  { id: "fish",      key: "fish_count",        emoji: "🐟", label: "Pescado",           color: "#4A90C4", light: "#D3E8F5" },
  { id: "vegs",      key: "vegetables_count",  emoji: "🥬", label: "Vegetales",         color: "#4A9B5A", light: "#D3F0DA" },
  { id: "fruit",     key: "fruits_count",      emoji: "🍊", label: "Frutas",            color: "#E08730", light: "#FAE7CD" },
  { id: "grains",    key: "grains_count",      emoji: "🌾", label: "Granos integrales", color: "#B8973A", light: "#F5EDD0" },
  { id: "fermented", key: "fermented_count",   emoji: "🫙", label: "Fermentados",       color: "#A0724A", light: "#EFE0D0" },
  { id: "nuts",      key: "nuts_count",        emoji: "🥜", label: "Frutos secos",      color: "#7A5C38", light: "#E8DDD0" },
  { id: "processed", key: "processed_count",   emoji: "🍪", label: "Procesados",        color: "#C44A5A", light: "#F5D3D8" },
  { id: "water",     key: "water_count",       emoji: "💧", label: "Agua/infusiones",   color: "#5E9BC4", light: "#D3E8F5" },
]

// ── Keyframes injected once ───────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes bol-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bol-blobIn {
    0%   { transform: scale(0) translateY(20px); opacity: 0; }
    60%  { transform: scale(1.15) translateY(-3px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes bol-floatUp {
    0%   { transform: translateY(0) scale(1); opacity: 0.9; }
    100% { transform: translateY(-70px) scale(0.3); opacity: 0; }
  }
  @keyframes bol-shimmer {
    0%, 100% { opacity: 0.75; }
    50%       { opacity: 1; }
  }
  @keyframes bol-chipPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(0.91); }
    70%  { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
  @keyframes bol-saveSuccess {
    0%   { transform: scale(0.96); }
    50%  { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
`

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO() { return new Date().toISOString().split("T")[0] }

function getOrCreateSessionId() {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("fm_session_id")
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("fm_session_id", id) }
  return id
}

function computeInsights(c: Counts) {
  const insights: string[] = []
  const distinct = GROUPS.filter(g => c[g.key] > 0).length
  const hasProtein = c.protein_count >= 1 || c.fish_count >= 1
  if (distinct >= 6) insights.push("Bol variado — excelente diversidad")
  if (hasProtein && c.vegetables_count >= 1 && c.fruits_count >= 1) insights.push("Bol equilibrado")
  if (c.fermented_count >= 1) insights.push("✓ Fermentados — microbioma activo")
  if (c.processed_count >= 1) insights.push("Procesados registrados — añade un vegetal mañana")
  return insights
}

function computeStreak(dates: string[], today: string) {
  const set = new Set(dates)
  let streak = 0
  const cursor = new Date(today)
  while (set.has(cursor.toISOString().split("T")[0])) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function getMessage(count: number) {
  if (count === 0) return "Tu bol está vacío — empieza a llenarlo"
  if (count === 1) return "¡Buen comienzo! Sigue añadiendo..."
  if (count <= 3) return "Vas bien. Diversifica un poco más."
  if (count <= 6) return "¡Qué variedad! Tu microbioma te lo agradece."
  return "¡Bol completo! Hoy has comido de maravilla 🎉"
}

// ── BowlViz — liquid layers ───────────────────────────────────────────────────

function BowlViz({ selected }: { selected: Set<string> }) {
  const total = GROUPS.length
  const count = selected.size
  const fillPct = count / total
  const layers = GROUPS.filter(f => selected.has(f.id))

  return (
    <div style={{ position: "relative", width: 240, height: 220, margin: "0 auto" }}>
      <svg viewBox="0 0 240 220" width="240" height="220" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id="bol-bowlClip">
            <path d="M 28 70 Q 20 160 120 195 Q 220 160 212 70 Z" />
          </clipPath>
          <filter id="bol-bowlShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#00000018" />
          </filter>
          <filter id="bol-softBlur"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>

        {fillPct > 0.5 && (
          <ellipse cx="120" cy="150" rx="80" ry="30"
            fill={layers[Math.floor(layers.length / 2)]?.color || "#C4622D"}
            opacity={0.12 * fillPct}
            filter="url(#bol-softBlur)"
            style={{ transition: "all 0.6s ease" }}
          />
        )}

        {/* Bowl interior */}
        <path d="M 28 70 Q 20 160 120 195 Q 220 160 212 70 Z"
          fill="#F7F0E8" filter="url(#bol-bowlShadow)" />

        {/* Liquid layers */}
        <g clipPath="url(#bol-bowlClip)">
          {layers.map((food, i) => {
            const layerH = 125 / total
            const yBottom = 195
            const yTop = yBottom - (i + 1) * layerH
            const amp = 5
            return (
              <g key={food.id}>
                <path
                  d={`M 20 ${yBottom} L 20 ${yTop + amp}
                    Q 70 ${yTop - amp} 120 ${yTop}
                    Q 170 ${yTop + amp} 220 ${yTop - amp}
                    L 220 ${yBottom} Z`}
                  fill={food.color}
                  opacity={0.82}
                  style={{
                    transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                    animation: `bol-shimmer ${2 + i * 0.3}s ease-in-out infinite`,
                  }}
                />
                <path
                  d={`M 20 ${yTop + amp} Q 70 ${yTop - amp} 120 ${yTop} Q 170 ${yTop + amp} 220 ${yTop - amp}`}
                  fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
                  style={{ transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}
                />
              </g>
            )
          })}

          {/* Floating emojis */}
          {layers.map((food, i) => {
            const x = 55 + (i % 4) * 42 + (i % 2) * 10
            const y = 190 - (i + 0.5) * (125 / total) + 8
            return (
              <foreignObject key={food.id} x={x - 12} y={y - 12} width="24" height="24"
                style={{ animation: "bol-blobIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <div style={{ fontSize: 16, lineHeight: "24px", textAlign: "center", userSelect: "none" }}>
                  {food.emoji}
                </div>
              </foreignObject>
            )
          })}
        </g>

        {/* Bowl rim */}
        <path d="M 20 72 Q 120 48 220 72" fill="none" stroke="#E8DDD0" strokeWidth="6" strokeLinecap="round" />
        <path d="M 20 72 Q 120 48 220 72" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M 28 70 Q 20 160 120 195 Q 220 160 212 70" fill="none" stroke="#D9CEBF" strokeWidth="2" />
        <ellipse cx="120" cy="197" rx="48" ry="6" fill="#00000012" filter="url(#bol-softBlur)" />

        {/* Empty state */}
        {count === 0 && (
          <text x="120" y="148" textAnchor="middle" fontFamily="system-ui" fontSize="11"
            fill="#A09080" letterSpacing="0.02em"
            style={{ animation: "bol-shimmer 2s ease-in-out infinite" }}>
            tu bol está vacío
          </text>
        )}

        {/* Count badge */}
        {count > 0 && (
          <g style={{ animation: "bol-fadeUp 0.3s ease both" }}>
            <circle cx="192" cy="52" r="18" fill={layers[layers.length - 1]?.color || "#C4622D"} />
            <text x="192" y="57" textAnchor="middle" fontFamily="system-ui" fontWeight="700" fontSize="13" fill="white">
              {count}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

// ── Particles ─────────────────────────────────────────────────────────────────

function Particles({ trigger, color }: { trigger: number; color: string }) {
  const [particles, setParticles] = useState<{ id: number; angle: number; dist: number }[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    if (!trigger) return
    const next = Array.from({ length: 7 }, (_, i) => ({
      id: ++idRef.current,
      angle: (i / 7) * 360,
      dist: 28 + Math.random() * 22,
    }))
    setParticles(p => [...p, ...next])
    const t = setTimeout(() => setParticles(p => p.filter(x => !next.find(n => n.id === x.id))), 700)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "50%", left: "50%",
          width: 6, height: 6, borderRadius: "50%", background: color,
          transform: "translate(-50%,-50%)",
          animation: "bol-floatUp 0.7s ease-out forwards",
          marginLeft: Math.cos((p.angle * Math.PI) / 180) * p.dist,
          marginTop: Math.sin((p.angle * Math.PI) / 180) * p.dist,
        }} />
      ))}
    </div>
  )
}

// ── FoodChip ──────────────────────────────────────────────────────────────────

function FoodChip({ food, isSelected, onToggle }: { food: FoodGroup; isSelected: boolean; onToggle: (id: string) => void }) {
  const [burst, setBurst] = useState(0)
  const [popping, setPopping] = useState(false)

  const handleClick = () => {
    onToggle(food.id)
    setBurst(b => b + 1)
    setPopping(true)
    setTimeout(() => setPopping(false), 350)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "10px 16px", borderRadius: 100,
        border: `2px solid ${isSelected ? food.color : "transparent"}`,
        background: isSelected ? food.color : food.light,
        color: isSelected ? "#fff" : food.color,
        fontFamily: "system-ui, sans-serif",
        fontSize: 13, fontWeight: 500,
        cursor: "pointer",
        animation: popping ? "bol-chipPop 0.35s ease both" : undefined,
        transform: isSelected ? "translateY(-1px)" : undefined,
        boxShadow: isSelected ? `0 4px 16px ${food.color}44` : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <Particles trigger={burst} color={food.color} />
      <span style={{ fontSize: 18, lineHeight: 1 }}>{food.emoji}</span>
      <span>{food.label}</span>
      {isSelected && (
        <span style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700,
          animation: "bol-blobIn 0.3s ease both",
        }}>✓</span>
      )}
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BolPage() {
  const supabase = useRef(createClient()).current

  // selected = Set of food IDs that the user has toggled ON today
  const [selected, setSelected]   = useState<Set<string>>(new Set())
  const [counts,   setCounts]     = useState<Counts>({ ...EMPTY })
  const [userId,   setUserId]     = useState<string | null>(null)
  const [streak,   setStreak]     = useState(0)
  const [dayNumber,setDayNumber]  = useState(0)
  const [saved,    setSaved]      = useState(false)
  const [saving,   setSaving]     = useState(false)
  const [toast,    setToast]      = useState("")
  const isNewTodayRef = useRef(true)
  const today = todayISO()

  const totalSelected = selected.size
  const fillPct = totalSelected / GROUPS.length
  const progressPct = Math.min(100, (dayNumber / 90) * 100)
  const insights = computeInsights(counts)

  // Sync selected Set → counts (each selected food = count 1)
  const selectedToCounts = useCallback((sel: Set<string>): Counts => {
    const c = { ...EMPTY }
    for (const g of GROUPS) {
      if (sel.has(g.id)) c[g.key] = 1
    }
    return c
  }, [])

  // Load on mount
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      const uid = user?.id ?? null
      setUserId(uid)

      if (uid) {
        const { data: log } = await supabase
          .from("food_log").select("*")
          .eq("user_id", uid).eq("log_date", today).maybeSingle()

        if (log) {
          const c: Counts = {
            protein_count:    log.protein_count    ?? 0,
            fish_count:       log.fish_count       ?? 0,
            vegetables_count: log.vegetables_count ?? 0,
            fruits_count:     log.fruits_count     ?? 0,
            grains_count:     log.grains_count     ?? 0,
            fermented_count:  log.fermented_count  ?? 0,
            nuts_count:       log.nuts_count       ?? 0,
            processed_count:  log.processed_count  ?? 0,
            water_count:      log.water_count      ?? 0,
          }
          setCounts(c)
          // Restore selected from counts
          const sel = new Set(GROUPS.filter(g => c[g.key] > 0).map(g => g.id))
          setSelected(sel)
          setSaved(true)
          isNewTodayRef.current = false
        }

        const { data: logs } = await supabase
          .from("food_log").select("log_date")
          .eq("user_id", uid).order("log_date", { ascending: false }).limit(90)

        if (logs?.length) {
          setDayNumber(logs.length)
          setStreak(computeStreak(logs.map((l: { log_date: string }) => l.log_date), today))
        }
      } else {
        const stored = localStorage.getItem(`fm_bol_${today}`)
        if (stored) {
          try {
            const c = JSON.parse(stored) as Counts
            setCounts(c)
            setSelected(new Set(GROUPS.filter(g => c[g.key] > 0).map(g => g.id)))
            setSaved(true)
            isNewTodayRef.current = false
          } catch { /* ignore */ }
        }
      }
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback((id: string) => {
    setSaved(false)
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      const c = selectedToCounts(next)
      setCounts(c)
      if (!userId) localStorage.setItem(`fm_bol_${today}`, JSON.stringify(c))
      return next
    })
  }, [userId, today, selectedToCounts])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500) }

  const refreshStreak = async (uid: string) => {
    const { data: logs } = await supabase
      .from("food_log").select("log_date")
      .eq("user_id", uid).order("log_date", { ascending: false }).limit(90)
    if (logs) {
      setDayNumber(logs.length)
      setStreak(computeStreak(logs.map((l: { log_date: string }) => l.log_date), today))
    }
  }

  const handleSave = async () => {
    if (totalSelected === 0) return
    setSaving(true)
    const color = getBowlColor(counts)

    if (userId) {
      const { error } = await supabase.from("food_log").upsert(
        { user_id: userId, log_date: today, ...counts, bowl_color_hex: color, updated_at: new Date().toISOString() },
        { onConflict: "user_id,log_date" }
      )
      if (error) { showToast("Error al guardar. Inténtalo de nuevo.") }
      else {
        setSaved(true)
        const wasNew = isNewTodayRef.current
        isNewTodayRef.current = false
        showToast("¡Bol guardado! 🥣")
        if (wasNew) await refreshStreak(userId)
        fetch("/api/correlations", { method: "POST" }).catch(() => {})
      }
    } else {
      const sessionId = getOrCreateSessionId()
      localStorage.setItem(`fm_bol_${today}`, JSON.stringify(counts))
      await supabase.from("food_log").insert({
        user_id: null, session_id: sessionId, log_date: today,
        ...counts, bowl_color_hex: color,
      })
      setSaved(true)
      isNewTodayRef.current = false
      showToast("¡Guardado! Regístrate para ver tu historial. 🥣")
    }
    setSaving(false)
  }

  return (
    <main style={{ backgroundColor: "#FDFAF5", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px 80px", animation: "bol-fadeUp 0.5s ease both" }}>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 10px" }}>
          <Link href="/" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#6B2737", letterSpacing: "-0.02em", textDecoration: "none" }}>
            Food·Mood
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {streak > 0 && (
              <span style={{ fontSize: 12, color: "#6B2737", fontWeight: 600, background: "rgba(107,39,55,0.08)", padding: "4px 12px", borderRadius: 100 }}>
                🔥 {streak} {streak === 1 ? "día" : "días"}
              </span>
            )}
            <span style={{ fontSize: 12, color: "#A09080", fontWeight: 500, background: "#F0E8DE", padding: "4px 12px", borderRadius: 100 }}>
              Día {Math.max(1, dayNumber)} · 90
            </span>
          </div>
        </nav>

        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: 28, paddingBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#6B2737", textTransform: "uppercase", marginBottom: 12, opacity: 0.7 }}>
            Sin escribir · Sin contar · Sin calorías
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: 700, lineHeight: 1.2, color: "#1A1208", marginBottom: 10 }}>
            ¿Qué has puesto en tu bol hoy?
          </h1>
          <p style={{ fontSize: 14, color: "#7A6E5F", lineHeight: 1.6 }}>
            Toca los grupos que has comido. Cada tap llena tu bol.
          </p>
        </div>

        {/* Progress bar + Bowl */}
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <svg width="100%" height="20" style={{ display: "block", marginBottom: 4 }}>
            <rect x="0" y="7" width="100%" height="6" rx="3" fill="#EFE8DE" />
            <rect x="0" y="7" width={`${fillPct * 100}%`} height="6" rx="3"
              fill={fillPct > 0.7 ? "#4A9B5A" : "#6B2737"}
              style={{ transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
            />
          </svg>
          <BowlViz selected={selected} />
        </div>

        {/* Dynamic message */}
        <p style={{ fontSize: 13, color: "#7A6E5F", fontWeight: 500, textAlign: "center", marginBottom: 28, minHeight: 22, transition: "all 0.3s ease" }}>
          {getMessage(totalSelected)}
        </p>

        {/* Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {GROUPS.map((food, i) => (
            <div key={food.id} style={{ animation: `bol-fadeUp 0.4s ${0.04 * i}s ease both` }}>
              <FoodChip food={food} isSelected={selected.has(food.id)} onToggle={toggle} />
            </div>
          ))}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div style={{
            background: "white", borderRadius: 20, padding: "16px 20px",
            borderLeft: "4px solid #C9A84C",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 8 }}>
              Tu análisis
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {insights.map((ins, i) => (
                <li key={i} style={{ fontSize: 13, fontWeight: 500, color: "#1A1208", marginBottom: i < insights.length - 1 ? 6 : 0 }}>
                  {ins}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Journey card */}
        <div style={{ background: "white", borderRadius: 20, padding: "20px 24px", boxShadow: "0 2px 24px rgba(0,0,0,0.06)", marginBottom: 20, border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1208" }}>Tu viaje</span>
            <span style={{ fontSize: 12, color: "#6B2737", fontWeight: 600 }}>Día {Math.max(1, dayNumber)} de 90</span>
          </div>
          <div style={{ background: "#F0E8DE", borderRadius: 6, height: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 6,
              background: "linear-gradient(90deg, #6B2737, #C9A84C)",
              width: `${Math.max(1.5, progressPct)}%`,
              transition: "width 1s ease",
            }} />
          </div>
          <p style={{ fontSize: 12, color: "#A09080", marginTop: 10, lineHeight: 1.6 }}>
            Tus hábitos, tus hematíes, tu microbioma — todo se renueva en 90 días.
          </p>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || totalSelected === 0}
          style={{
            width: "100%", padding: "16px 24px", borderRadius: 16, border: "none",
            background: saved
              ? "linear-gradient(135deg, #4A9B5A, #5BA86A)"
              : totalSelected > 0
              ? "linear-gradient(135deg, #6B2737, #C9A84C)"
              : "#EFE8DE",
            color: totalSelected > 0 ? "#fff" : "#C0B0A0",
            fontFamily: "system-ui, sans-serif", fontSize: 15, fontWeight: 600,
            cursor: totalSelected > 0 ? "pointer" : "default",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: totalSelected > 0
              ? saved ? "0 6px 24px rgba(74,155,90,0.35)" : "0 6px 24px rgba(107,39,55,0.3)"
              : "none",
            animation: saved ? "bol-saveSuccess 0.4s ease both" : undefined,
          }}
        >
          {saving ? "Guardando…" : saved ? "✓ Bol guardado — ¡Hasta mañana!" : totalSelected > 0 ? "Guardar mi bol del día →" : "Añade alimentos para guardar"}
        </button>

        {totalSelected > 0 && !saved && (
          <p style={{ fontSize: 11, color: "#B0A090", marginTop: 8, textAlign: "center" }}>
            Puedes seguir editando hasta las 23:59
          </p>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          padding: "12px 20px", borderRadius: 16, background: "#2d0f16",
          color: "white", fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 50, whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </main>
  )
}
