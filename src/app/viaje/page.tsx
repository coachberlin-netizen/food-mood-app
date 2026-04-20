"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Journey {
  journey_start_date: string
  journey_number: number
  completed: boolean
}

interface Correlation {
  id: string
  factor_a: string
  factor_b: string
  insight_text: string
  confidence: string
  sample_size: number
  updated_at: string
}

interface TestEntry {
  created_at: string
  color_hex: string
  animo: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split("T")[0]
}

function journeyDay(startDate: string, today: string): number {
  const diff = Math.floor(
    (new Date(today).getTime() - new Date(startDate).getTime()) / 86_400_000
  )
  return Math.max(1, diff + 1)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

function addDays(date: string, n: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().split("T")[0]
}

// ── Milestones ────────────────────────────────────────────────────────────────

const MILESTONES = [
  { day: 7,  emoji: "🌱", label: "Primera semana — los patrones empiezan a aparecer" },
  { day: 14, emoji: "🦠", label: "Dos semanas — tu microbioma ya lo nota" },
  { day: 30, emoji: "🧠", label: "Un mes — nuevos circuitos neuronales en formación" },
  { day: 60, emoji: "🩸", label: "Dos meses — tus hematíes se están renovando" },
  { day: 90, emoji: "🏆", label: "90 días — tu nueva base biológica" },
]

// ── MosaicGrid ────────────────────────────────────────────────────────────────

function MosaicGrid({
  startDate,
  today,
  colorByDate,
  isPremium,
}: {
  startDate: string
  today: string
  colorByDate: Map<string, string>
  isPremium: boolean
}) {
  const days = Array.from({ length: 90 }, (_, i) => addDays(startDate, i))

  const grid = (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
    >
      {days.map(date => {
        const color    = colorByDate.get(date)
        const isToday  = date === today
        const isFuture = date > today
        const bg       = isFuture || !color ? "#e8e0d0" : color

        return (
          <div
            key={date}
            title={date}
            className="rounded-[3px]"
            style={{
              aspectRatio: "1",
              backgroundColor: bg,
              opacity: isFuture ? 0.4 : 1,
              outline: isToday ? "2px solid #C9A84C" : "none",
              outlineOffset: "1px",
              animation: isToday ? "pulse-gold 2s ease-in-out infinite" : "none",
            }}
          />
        )
      })}
    </div>
  )

  if (!isPremium) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div style={{ filter: "blur(6px)", pointerEvents: "none" }}>{grid}</div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ backgroundColor: "rgba(245,240,232,0.82)" }}
        >
          <span className="text-2xl">🔐</span>
          <p className="text-sm font-semibold text-center" style={{ color: "#2d0f16" }}>
            Tu mosaico emocional de 90 días
          </p>
          <Link
            href="/pricing"
            className="px-5 py-2 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "#6B2737" }}
          >
            Desbloquear Premium
          </Link>
        </div>
      </div>
    )
  }

  return grid
}

// ── ConfidenceBadge ───────────────────────────────────────────────────────────

function ConfidenceBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    alta:  "#5A9B8A",
    media: "#C8902A",
    baja:  "#8B2020",
  }
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: colors[value] ?? "#6B2737" }}
    >
      {value}
    </span>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ViajePage() {
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [journey, setJourney]           = useState<Journey | null>(null)
  const [correlations, setCorrelations] = useState<Correlation[]>([])
  const [colorByDate, setColorByDate]   = useState<Map<string, string>>(new Map())
  const [isPremium, setIsPremium]       = useState(false)
  const [isAuth, setIsAuth]             = useState(false)
  const [loading, setLoading]           = useState(true)
  const [registeredDays, setRegisteredDays] = useState(0)
  const today = todayISO()

  useEffect(() => {
    async function init() {
      // Check auth + premium in parallel with journey fetch
      const [{ data: { user } }, tierRes] = await Promise.all([
        supabase.auth.getUser(),
        fetch("/api/mi-tier"),
      ])

      if (!user) { setLoading(false); return }
      setIsAuth(true)

      if (tierRes.ok) {
        const tier = await tierRes.json()
        setIsPremium(tier.isPremium ?? false)
      }

      // Load journey + test history + correlations in parallel
      const [{ data: journeyData }, { data: testsRaw }, { data: corrRaw }, { data: testCountRaw }] =
        await Promise.all([
          supabase
            .from("user_journey")
            .select("journey_start_date, journey_number, completed")
            .eq("user_id", user.id)
            .order("journey_number", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("test_results")
            .select("created_at, color_hex, animo")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true })
            .limit(90),
          supabase
            .from("correlations_cache")
            .select("id, factor_a, factor_b, insight_text, confidence, sample_size, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(4),
          supabase
            .from("test_results")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
        ])

      // Determine journey start date
      let startDate: string
      if (journeyData) {
        startDate = journeyData.journey_start_date
        setJourney(journeyData as Journey)
      } else {
        // Use earliest test result date or today
        const earliest = testsRaw?.[0]?.created_at?.split("T")[0] ?? today
        startDate = earliest

        // Create journey record
        const { data: created } = await supabase
          .from("user_journey")
          .insert({ user_id: user.id, journey_start_date: startDate, journey_number: 1 })
          .select("journey_start_date, journey_number, completed")
          .single()

        if (created) setJourney(created as Journey)
        else setJourney({ journey_start_date: startDate, journey_number: 1, completed: false })
      }

      // Build color map from test_results
      const map = new Map<string, string>()
      for (const t of testsRaw ?? []) {
        const date = t.created_at.split("T")[0]
        if (t.color_hex) map.set(date, t.color_hex)
      }
      setColorByDate(map)

      setCorrelations((corrRaw ?? []) as Correlation[])
      setRegisteredDays(testCountRaw?.length ?? 0)
      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
        <div className="max-w-[520px] mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
        </div>
      </main>
    )
  }

  if (!isAuth) {
    return (
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
        <div className="max-w-[520px] mx-auto px-4 py-16 text-center">
          <p className="font-serif text-2xl font-bold mb-4" style={{ color: "#2d0f16" }}>
            Tu viaje empieza con una cuenta
          </p>
          <p className="text-sm font-light mb-8" style={{ color: "rgba(107,39,55,0.65)" }}>
            Regístrate para iniciar tu viaje de 90 días y ver tus correlaciones personales.
          </p>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#6B2737" }}
          >
            Empezar mi viaje
          </Link>
        </div>
      </main>
    )
  }

  const startDate  = journey?.journey_start_date ?? today
  const currentDay = journeyDay(startDate, today)
  const progressPct = Math.min(100, (currentDay / 90) * 100)
  const endDate    = addDays(startDate, 89)
  const hasEnoughData = registeredDays >= 7

  return (
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      <style>{`
        @keyframes pulse-gold {
          0%, 100% { outline-color: #C9A84C; }
          50%       { outline-color: rgba(201,168,76,0.3); }
        }
      `}</style>

      <div className="max-w-[520px] mx-auto px-4 py-8 pb-28">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="font-serif text-xl font-semibold" style={{ color: "#2d0f16" }}>
            Food<span style={{ color: "#C9A84C" }}>·</span>Mood
          </Link>
          <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
            Viaje {journey?.journey_number ?? 1}
          </span>
        </div>

        {/* ── Hero del viaje ── */}
        <div
          className="rounded-3xl p-7 mb-6"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C9A84C" }}
          >
            Tu viaje de 90 días
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span
              className="font-serif font-black leading-none"
              style={{ fontSize: "clamp(64px,20vw,80px)", color: "#C9A84C" }}
            >
              {currentDay}
            </span>
            <span className="text-white font-light text-lg mb-2">de 90</span>
          </div>

          <div
            className="w-full h-2 rounded-full mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(2, progressPct)}%`, backgroundColor: "#C9A84C" }}
            />
          </div>

          <div className="flex justify-between text-[10px] mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
            <span>Inicio: {formatDate(startDate)}</span>
            <span>Meta: {formatDate(endDate)}</span>
          </div>

          <p className="text-xs font-light leading-relaxed italic" style={{ color: "rgba(255,255,255,0.55)" }}>
            Tus hematíes, tu microbioma, tus hábitos neuronales — todo se renueva en 90 días.
          </p>
        </div>

        {/* ── Mosaico emocional ── */}
        <div
          className="rounded-3xl p-5 mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "#C9A84C" }}
          >
            Tu paleta emocional
          </p>
          <p className="text-xs font-light mb-4" style={{ color: "rgba(107,39,55,0.5)" }}>
            90 días · cada celda es un test
          </p>
          <MosaicGrid
            startDate={startDate}
            today={today}
            colorByDate={colorByDate}
            isPremium={isPremium}
          />
          {isPremium && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: "#e8e0d0" }} />
                <span className="text-[9px]" style={{ color: "rgba(107,39,55,0.5)" }}>Sin dato</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-[2px]"
                  style={{ outline: "2px solid #C9A84C", outlineOffset: "1px", backgroundColor: "#e8e0d0" }}
                />
                <span className="text-[9px]" style={{ color: "rgba(107,39,55,0.5)" }}>Hoy</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Correlaciones ── */}
        <div className="mb-6">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "#6B2737" }}
          >
            Lo que tus datos dicen de ti
          </p>

          {!hasEnoughData ? (
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid rgba(201,168,76,0.35)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.6)" }}>
                Sigue registrando — las correlaciones aparecen a partir del día 7.
                Llevas {registeredDays} {registeredDays === 1 ? "registro" : "registros"}.
              </p>
            </div>
          ) : correlations.length === 0 ? (
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid rgba(201,168,76,0.35)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.6)" }}>
                Aún no hay correlaciones detectadas. Combina el test diario, el bol y los síntomas para que el motor tenga más datos.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {correlations.map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl"
                  style={{
                    backgroundColor: "white",
                    borderLeft: "4px solid #C9A84C",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: "#C9A84C" }}
                    >
                      {c.factor_a.replace(/_/g, " ")} → {c.factor_b.replace(/_/g, " ")}
                    </span>
                    <ConfidenceBadge value={c.confidence} />
                  </div>
                  <p
                    className="text-sm font-light leading-relaxed italic"
                    style={{ fontFamily: "var(--font-cormorant, serif)", color: "#2d0f16" }}
                  >
                    {c.insight_text}
                  </p>
                  <p className="text-[9px] mt-2" style={{ color: "rgba(107,39,55,0.35)" }}>
                    {c.sample_size} días de muestra
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Hitos ── */}
        <div className="mb-6">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "#6B2737" }}
          >
            Hitos del viaje
          </p>
          <div className="flex flex-col gap-2">
            {MILESTONES.map(m => {
              const unlocked = currentDay >= m.day
              return (
                <div
                  key={m.day}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    backgroundColor: unlocked ? "white" : "rgba(255,255,255,0.5)",
                    boxShadow: unlocked ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                    opacity: unlocked ? 1 : 0.5,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: unlocked ? "#F5F0E8" : "rgba(0,0,0,0.04)" }}
                  >
                    {unlocked ? m.emoji : "🔒"}
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: unlocked ? "#C9A84C" : "rgba(107,39,55,0.3)" }}
                    >
                      Día {m.day}
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: unlocked ? "#2d0f16" : "rgba(107,39,55,0.4)" }}
                    >
                      {m.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Estadísticas (Premium) ── */}
        {isPremium && registeredDays >= 7 && (
          <div className="mb-6">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "#6B2737" }}
            >
              Estadísticas del viaje
            </p>
            <div
              className="grid grid-cols-2 gap-3 p-5 rounded-3xl"
              style={{ backgroundColor: "#2d0f16" }}
            >
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Días registrados
                </p>
                <p className="font-serif text-2xl font-bold" style={{ color: "#C9A84C" }}>
                  {registeredDays}
                  <span className="text-xs font-light text-white/40"> / {Math.min(currentDay, 90)}</span>
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Consistencia
                </p>
                <p className="font-serif text-2xl font-bold" style={{ color: "#C9A84C" }}>
                  {Math.round((registeredDays / Math.max(1, currentDay)) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Correlaciones
                </p>
                <p className="font-serif text-2xl font-bold" style={{ color: "#C9A84C" }}>
                  {correlations.length}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Días restantes
                </p>
                <p className="font-serif text-2xl font-bold" style={{ color: "#C9A84C" }}>
                  {Math.max(0, 90 - currentDay)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── CTA siguiente viaje ── */}
        {currentDay >= 85 && (
          <div
            className="p-5 rounded-3xl mb-6 text-center"
            style={{ backgroundColor: "#6B2737" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
              Casi lo tienes
            </p>
            <p className="font-serif text-lg font-bold text-white mb-1">
              ¿Listo para el viaje {(journey?.journey_number ?? 1) + 1}?
            </p>
            <p className="text-xs font-light text-white/60">
              Consolida lo aprendido y empieza desde una nueva base biológica.
            </p>
          </div>
        )}

        {/* ── Accesos rápidos ── */}
        <div className="flex flex-col gap-2">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "rgba(107,39,55,0.4)" }}
          >
            Registra hoy
          </p>
          {[
            { href: "/test",     label: "🌡 Hacer el test emocional" },
            { href: "/bol",      label: "🥣 Registrar mi bol" },
            { href: "/sintomas", label: "🩺 Registrar mis síntomas" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: "white",
                color: "#2d0f16",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {item.label}
              <span style={{ color: "#C9A84C" }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
