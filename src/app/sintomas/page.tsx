"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// ── Types ─────────────────────────────────────────────────────────────────────

type SymptomKey =
  | "bloating" | "sleep" | "brain_fog" | "energy"
  | "cycle" | "anxiety" | "digestion" | "mood"

type Levels = Record<SymptomKey, number>

const EMPTY_LEVELS: Levels = {
  bloating: 0, sleep: 0, brain_fog: 0, energy: 0,
  cycle: 0, anxiety: 0, digestion: 0, mood: 0,
}

// ── SVG Illustrations ─────────────────────────────────────────────────────────

interface IlluProps { stroke: string; fill: string }

const IlluHinchazon = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <ellipse cx="32" cy="37" rx="17" ry="20" fill={fill} opacity="0.3"/>
    <ellipse cx="32" cy="37" rx="17" ry="20" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="26" cy="33" r="4" fill={fill} stroke={stroke} strokeWidth="1.2"/>
    <circle cx="36" cy="39" r="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
    <circle cx="28" cy="44" r="2" fill={fill} stroke={stroke} strokeWidth="1"/>
    <path d="M20 28 Q23 25 26 28" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M38 46 Q41 43 44 46" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M32 17 C34 17 36 19 36 21" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
)

const IlluSueno = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <path d="M40 13 C31 15 24 23 27 34 C29 43 38 48 46 46 C37 54 21 49 17 38 C13 27 20 14 31 11 C34 10 37 11 40 13Z"
      fill={fill} opacity="0.35" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="50" cy="17" r="2.5" fill={fill} stroke={stroke} strokeWidth="1.2"/>
    <circle cx="46" cy="27" r="1.5" fill={stroke} opacity="0.7"/>
    <circle cx="54" cy="29" r="1" fill={stroke} opacity="0.5"/>
    <path d="M14 19 L15.5 16 L17 19 L20 20.5 L17 22 L15.5 25 L14 22 L11 20.5 Z"
      fill={fill} stroke={stroke} strokeWidth="1" strokeLinejoin="round"/>
    <path d="M8 44 Q12 39 17 41 Q17 37 22 36 Q27 36 27 41 Q31 38 35 40 Q38 42 37 46 Q22 48 8 46 Z"
      fill={fill} opacity="0.4" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IlluNiebla = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <ellipse cx="32" cy="23" rx="12" ry="13" fill={fill} opacity="0.3" stroke={stroke} strokeWidth="1.8"/>
    <path d="M10 46 Q14 41 19 43 Q19 38 24 37 Q29 36 30 40 Q32 37 36 38 Q41 38 41 43 Q46 40 51 43 Q54 46 53 49 Q31 51 10 49 Z"
      fill={fill} opacity="0.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="22" cy="34" r="2" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.6"/>
    <circle cx="32" cy="31" r="2.5" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.5"/>
    <circle cx="42" cy="34" r="1.5" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.6"/>
    <path d="M27 21 Q30 19 33 21" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <path d="M26 26 Q29 24 32 26 Q35 24 38 26" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
  </svg>
)

const IlluEnergia = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <circle cx="32" cy="32" r="24" fill={fill} opacity="0.12"/>
    <path d="M36 8 L24 34 L33 34 L28 56 L48 28 L37 28 Z"
      fill={fill} opacity="0.6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 32 L18 32" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M46 32 L52 32" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 19 L20 24" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 45 L20 40" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M49 19 L44 24" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M49 45 L44 40" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IlluCiclo = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <circle cx="32" cy="32" r="20" fill={fill} opacity="0.15" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3"/>
    <path d="M32 12 A20 20 0 1 1 13 42" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M10 38 L13 43 L18 40" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="12" r="4" fill={fill} stroke={stroke} strokeWidth="1.3"/>
    <circle cx="32" cy="32" r="3.5" fill={fill} stroke={stroke} strokeWidth="1.3"/>
    <ellipse cx="32" cy="25.5" rx="2.5" ry="3.5" fill={fill} opacity="0.6" stroke={stroke} strokeWidth="1"/>
    <ellipse cx="38.5" cy="32" rx="3.5" ry="2.5" fill={fill} opacity="0.6" stroke={stroke} strokeWidth="1"/>
    <ellipse cx="32" cy="38.5" rx="2.5" ry="3.5" fill={fill} opacity="0.6" stroke={stroke} strokeWidth="1"/>
    <ellipse cx="25.5" cy="32" rx="3.5" ry="2.5" fill={fill} opacity="0.6" stroke={stroke} strokeWidth="1"/>
  </svg>
)

const IlluAnsiedad = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <path d="M32 32 Q39 32 39 25 Q39 16 30 16 Q21 16 21 27 Q21 40 34 40 Q47 40 47 25 Q47 10 27 10 Q10 10 10 30"
      stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="32" cy="32" r="3" fill={fill} stroke={stroke} strokeWidth="1.3"/>
    <path d="M14 52 Q19 47 24 52 Q29 57 34 52 Q39 47 44 52 Q49 57 54 52"
      stroke={stroke} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M8 45 Q11 42 14 45 Q17 48 20 45"
      stroke={stroke} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
  </svg>
)

const IlluDigestion = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <path d="M22 10 Q33 10 33 19 Q33 28 22 28 Q13 28 13 37 Q13 46 24 46 Q35 46 37 37 Q39 28 48 28 Q54 28 54 37 Q54 46 45 48 Q36 50 32 54"
      stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="27" cy="19" r="3" fill={fill} opacity="0.5"/>
    <circle cx="19" cy="35" r="2.5" fill={fill} opacity="0.5"/>
    <circle cx="50" cy="35" r="2" fill={fill} opacity="0.5"/>
    <path d="M26 22 Q29 20 32 22" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M16 38 Q19 36 22 38" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </svg>
)

const IlluEstado = ({ stroke, fill }: IlluProps) => (
  <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
    <rect x="27" y="9" width="10" height="30" rx="5" fill={fill} opacity="0.25" stroke={stroke} strokeWidth="1.8"/>
    <circle cx="32" cy="46" r="8" fill={fill} opacity="0.3" stroke={stroke} strokeWidth="1.8"/>
    <rect x="29.5" y="27" width="5" height="22" rx="2.5" fill={fill} opacity="0.7"/>
    <circle cx="32" cy="46" r="5.5" fill={stroke} opacity="0.7"/>
    <path d="M21 20 L25 20" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M21 26 L25 26" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M21 32 L25 32" stroke={stroke} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M39 14 Q48 11 50 21 Q47 18 39 20 Z" fill={fill} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" opacity="0.8"/>
    <path d="M44.5 14 Q45.5 17 44.5 20" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
  </svg>
)

// ── Symptom config ────────────────────────────────────────────────────────────

interface Symptom {
  key:    SymptomKey
  nombre: string
  sub:    string
  stroke: string
  fill:   string
  bg:     string
  Illu:   React.ComponentType<IlluProps>
}

const SYMPTOMS: Symptom[] = [
  { key: "bloating",  nombre: "Hinchazón",    sub: "abdominal",     stroke: "#E8724A", fill: "#F4956D", bg: "#FFF0EC", Illu: IlluHinchazon },
  { key: "sleep",     nombre: "Sueño",         sub: "y descanso",    stroke: "#7068C2", fill: "#9188D8", bg: "#EEF0FF", Illu: IlluSueno     },
  { key: "brain_fog", nombre: "Niebla mental", sub: "falta de concentración", stroke: "#5B8EC4", fill: "#7AABD8", bg: "#EAF1FB", Illu: IlluNiebla    },
  { key: "energy",    nombre: "Energía",        sub: "y vitalidad",   stroke: "#D4920A", fill: "#F0B63C", bg: "#FFF8E6", Illu: IlluEnergia   },
  { key: "cycle",     nombre: "Ciclo",          sub: "menstrual",     stroke: "#C4607A", fill: "#DD8FA8", bg: "#FCEEF4", Illu: IlluCiclo     },
  { key: "anxiety",   nombre: "Ansiedad",       sub: "y tensión",     stroke: "#3E9E76", fill: "#6ABD9A", bg: "#EEFAF5", Illu: IlluAnsiedad  },
  { key: "digestion", nombre: "Digestión",      sub: "y tránsito",    stroke: "#D4781A", fill: "#EEA05A", bg: "#FEF3EB", Illu: IlluDigestion },
  { key: "mood",      nombre: "Estado",         sub: "general",       stroke: "#2A8F88", fill: "#52B0AA", bg: "#EBF8F6", Illu: IlluEstado    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO() { return new Date().toISOString().split("T")[0] }

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("fm_session_id")
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("fm_session_id", id) }
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

// ── LevelButtons ─────────────────────────────────────────────────────────────

function LevelButtons({ level, stroke }: { level: number; stroke: string }) {
  if (level === 0) {
    return (
      <div className="flex gap-1 mt-1.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-1 mt-1.5 items-center">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all duration-200"
          style={{
            backgroundColor: i <= level ? stroke : "rgba(0,0,0,0.08)",
            transform: i <= level ? "scale(1.2)" : "scale(1)",
          }}
        />
      ))}
    </div>
  )
}

// ── SymptomCard ───────────────────────────────────────────────────────────────

function SymptomCard({ symptom, level, onTap }: { symptom: Symptom; level: number; onTap: () => void }) {
  const [pressing, setPressing] = useState(false)
  const active = level > 0

  return (
    <button
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => { setPressing(false); onTap() }}
      onPointerLeave={() => setPressing(false)}
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-4 select-none w-full"
      style={{
        backgroundColor: active ? symptom.bg : "white",
        border: `2px solid ${active ? symptom.stroke + "80" : "transparent"}`,
        boxShadow: active
          ? `0 4px 16px ${symptom.stroke}28`
          : "0 1px 4px rgba(0,0,0,0.07)",
        transform: pressing ? "scale(0.93)" : "scale(1)",
        transition: "transform 0.1s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        touchAction: "manipulation",
        minHeight: "108px",
        WebkitUserSelect: "none",
      }}
    >
      {/* Level badge when active */}
      {active && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: symptom.stroke }}
        >
          <span className="text-white font-bold" style={{ fontSize: 9 }}>{level}</span>
        </div>
      )}

      {/* Illustration */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 52, height: 52,
          background: active ? `${symptom.fill}30` : `${symptom.fill}18`,
          borderRadius: "50%",
          padding: 8,
          transition: "background 0.2s",
        }}
      >
        <symptom.Illu stroke={symptom.stroke} fill={symptom.fill} />
      </div>

      {/* Label */}
      <div className="text-center">
        <div
          className="text-[12px] font-medium leading-tight"
          style={{ color: active ? symptom.stroke : "#2d0f16" }}
        >
          {symptom.nombre}
        </div>
        <div className="text-[10px] font-light" style={{ color: active ? symptom.stroke + "99" : "rgba(107,39,55,0.4)" }}>
          {symptom.sub}
        </div>
      </div>

      <LevelButtons level={level} stroke={symptom.stroke} />
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
  const progressPct = Math.min(100, (dayNumber / 90) * 100)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      const uid = user?.id ?? null
      setUserId(uid)

      if (uid) {
        const [{ data: log }, { data: logs }] = await Promise.all([
          supabase.from("symptom_log").select("*").eq("user_id", uid).eq("log_date", today).maybeSingle(),
          supabase.from("symptom_log").select("log_date").eq("user_id", uid).order("log_date", { ascending: false }).limit(90),
        ])

        if (log) {
          setLevels({
            bloating:  log.bloating_level  ?? 0,
            sleep:     log.sleep_level     ?? 0,
            brain_fog: log.brain_fog_level ?? 0,
            energy:    log.energy_level    ?? 0,
            cycle:     log.cycle_level     ?? 0,
            anxiety:   log.anxiety_level   ?? 0,
            digestion: log.digestion_level ?? 0,
            mood:      log.mood_level      ?? 0,
          })
          setNotes(log.notes ?? "")
          setSaved(true)
        }

        if (logs?.length) {
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
            setLevels({ ...EMPTY_LEVELS, ...parsed.levels })
            setNotes(parsed.notes ?? "")
            setSaved(true)
          } catch { /* ignore */ }
        }
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tap = useCallback((key: SymptomKey) => {
    setLevels(prev => {
      const next = { ...prev, [key]: (prev[key] + 1) % 4 }
      if (!userId) localStorage.setItem(`fm_sintomas_${today}`, JSON.stringify({ levels: next, notes }))
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
        levels: { ...levels, headache: 0 },
        notes: notes.trim() || null,
        session_id: getOrCreateSessionId(),
        log_date: today,
      }),
    })

    if (!res.ok) {
      showToast("Error al guardar. Inténtalo de nuevo.")
    } else {
      setSaved(true)
      if (!userId) localStorage.setItem(`fm_sintomas_${today}`, JSON.stringify({ levels, notes }))
      showToast("Síntomas guardados")
      if (userId) fetch("/api/correlations", { method: "POST" }).catch(() => {})
    }
    setSaving(false)
  }

  return (
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      <div className="max-w-[520px] mx-auto px-4 py-8 pb-28">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="font-serif text-xl font-semibold" style={{ color: "#2d0f16" }}>
            Food<span style={{ color: "#C9A84C" }}>·</span>Mood
          </Link>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#6B2737" }}>
                <span className="text-sm leading-none">🔥</span>
                <span className="text-xs font-bold text-white">{streak} {streak === 1 ? "día" : "días"}</span>
              </div>
            )}
            <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
              {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>

        {/* ── Intro ── */}
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
            30 segundos · Sin escribir · Cada día
          </p>
          <h1 className="font-serif text-3xl font-bold leading-tight mb-3" style={{ color: "#2d0f16" }}>
            ¿Cómo está tu cuerpo hoy?
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>
            Toca cada síntoma para indicar su intensidad. Toca de nuevo para subir el nivel.
          </p>
        </div>

        {/* ── Leyenda de intensidad (una sola vez) ── */}
        <div
          className="flex items-center gap-0 mb-5 rounded-xl overflow-hidden text-center"
          style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.07)" }}
        >
          {[
            { n: "1", label: "Poco",    bg: "#F9F5F0" },
            { n: "2", label: "Medio",   bg: "#F4EDE4" },
            { n: "3", label: "Mucho",   bg: "#EBE0D5" },
          ].map((item, i) => (
            <div
              key={item.n}
              className="flex-1 py-2.5 flex flex-col items-center gap-0.5"
              style={{
                backgroundColor: item.bg,
                borderLeft: i > 0 ? "1px solid rgba(107,39,55,0.07)" : undefined,
              }}
            >
              <span className="text-sm font-bold font-serif" style={{ color: "#6B2737" }}>{item.n}</span>
              <span className="text-[10px] font-light" style={{ color: "rgba(107,39,55,0.5)" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── Grid de síntomas ── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SYMPTOMS.map(s => (
            <SymptomCard key={s.key} symptom={s} level={levels[s.key]} onTap={() => tap(s.key)} />
          ))}
        </div>

        {/* ── Nota opcional ── */}
        <div className="mb-6">
          <textarea
            value={notes}
            onChange={e => { setNotes(e.target.value.slice(0, 280)); setSaved(false) }}
            placeholder="Algo que quieras recordar de hoy..."
            rows={3}
            className="w-full rounded-2xl px-4 py-3 text-sm font-light resize-none focus:outline-none"
            style={{
              backgroundColor: "white",
              color: "#2d0f16",
              border: "2px solid rgba(107,39,55,0.1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          />
          <p className="text-right text-[10px] mt-1" style={{ color: "rgba(107,39,55,0.35)" }}>
            {notes.length}/280
          </p>
        </div>

        {/* ── Patrón detectado ── */}
        {logCount >= 7 && (
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "white", borderLeft: "4px solid #C9A84C" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
              Patrón detectado
            </p>
            <p className="text-sm font-medium" style={{ color: "#2d0f16" }}>
              {pattern ?? "Sigue registrando — los patrones aparecen a partir del día 7."}
            </p>
          </div>
        )}

        {logCount > 0 && logCount < 7 && (
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "white", borderLeft: "4px solid rgba(201,168,76,0.35)" }}>
            <p className="text-sm" style={{ color: "rgba(107,39,55,0.6)" }}>
              Llevas {logCount} {logCount === 1 ? "día" : "días"}. Los patrones aparecen a partir del día 7 — sigue registrando.
            </p>
          </div>
        )}

        {/* ── Journey 90 días ── */}
        <div className="mb-8 p-5 rounded-3xl" style={{ backgroundColor: "#2d0f16" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>Tu viaje</p>
          <p className="font-serif text-xl font-semibold text-white mb-3">Día {Math.max(1, dayNumber)} de 90</p>
          <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <div className="h-2 rounded-full" style={{ width: `${Math.max(2, progressPct)}%`, backgroundColor: "#C9A84C", transition: "width 0.8s ease" }} />
          </div>
          <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Para entenderte mejor y encontrar soluciones holísticas. 90 días es el ciclo biológico real del cambio.
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
            transition: "background-color 0.4s ease",
          }}
        >
          {saving ? "Guardando…" : saved ? "✓ Síntomas guardados" : "Guardar síntomas de hoy →"}
        </button>

        <p className="text-center text-[10px] mt-2" style={{ color: "rgba(107,39,55,0.4)" }}>
          Puedes seguir editando hasta las 23:59
        </p>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-xl z-50 whitespace-nowrap"
          style={{ backgroundColor: "#2d0f16" }}>
          {toast}
        </div>
      )}
    </main>
  )
}
