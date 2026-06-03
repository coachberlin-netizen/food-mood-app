"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { useQuizStore } from "@/store/useQuizStore"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star } from "lucide-react"
import { CheckInWidget } from "@/components/dashboard/CheckInWidget"
import { ProtocolCard } from "@/components/dashboard/ProtocolCard"
import { ProfessionalBadge } from "@/components/dashboard/ProfessionalBadge"
import { PushNotificationBanner } from "@/components/dashboard/PushNotificationBanner"
import { BiomarkerPanel } from "@/components/biomarkers/BiomarkerPanel"
import { FoodMoodIndex } from "@/components/FoodMoodIndex"
import { WeekMosaic } from "@/components/diary/WeekMosaic"
import { getWeekData, getCurrentWeekStart, WeekData } from "@/lib/mood-diary"
import { useLinkedProfessional, usePrescriptions } from "@/hooks/usePrescriptions"
import { useAssignmentsBadge } from "@/hooks/useAssignments"

// ── PrescriptionsCard ─────────────────────────────────────────────────────────
function PrescriptionsCardInner({ professionalName }: { professionalName: string | null }) {
  const { unreadCount, loading } = usePrescriptions()
  if (loading || unreadCount === 0) return null
  return (
    <Link
      href="/para-mi"
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ background: "#6B2737" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
            Contenido prescrito
          </p>
          <p className="text-sm font-semibold" style={{ color: "#F5F0E8" }}>
            {unreadCount === 1 ? "1 recurso nuevo" : `${unreadCount} recursos nuevos`}
            {professionalName ? ` de ${professionalName}` : ""}
          </p>
        </div>
        <span className="text-xs font-light" style={{ color: "rgba(245,240,232,0.6)" }}>
          Ver →
        </span>
      </div>
    </Link>
  )
}

function PrescriptionsCard() {
  const { hasLink, professionalName, loading } = useLinkedProfessional()
  if (loading || !hasLink) return null
  return <PrescriptionsCardInner professionalName={professionalName} />
}

// ── AssignmentsCard ───────────────────────────────────────────────────────────
function AssignmentsCard() {
  const pending = useAssignmentsBadge()
  if (pending === 0) return null
  return (
    <Link
      href="/mis-asignaciones"
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
            Asignaciones de tu profesional
          </p>
          <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
            {pending === 1 ? "1 práctica pendiente esta semana" : `${pending} prácticas pendientes esta semana`}
          </p>
        </div>
        <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
          Ver →
        </span>
      </div>
    </Link>
  )
}

// ── NudgeCard ─────────────────────────────────────────────────────────────────
function NudgeCard() {
  const [nudge, setNudge] = useState<{ id: string; nudge_content: string; pattern_detected: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from("adaptive_nudges_log")
        .select("id, nudge_content, pattern_detected")
        .eq("user_id", user.id)
        .is("delivered_at", null)
        .gte("generated_at", since)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data) {
        setNudge(data)
        supabase.from("adaptive_nudges_log").update({ delivered_at: new Date().toISOString() }).eq("id", data.id).then(() => {})
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!nudge || dismissed) return null

  return (
    <div className="max-w-[520px] w-full mx-auto rounded-3xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(201,168,76,0.3)" }}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#C9A84C" }}>Para ti hoy</p>
          <p className="text-sm font-light leading-relaxed" style={{ color: "#2d0f16" }}>{nudge.nudge_content}</p>
        </div>
        <button
          onClick={() => {
            setDismissed(true)
            supabase.from("adaptive_nudges_log").update({ opened_at: new Date().toISOString() }).eq("id", nudge.id).then(() => {})
          }}
          className="shrink-0 mt-0.5 opacity-40 hover:opacity-70"
        >
          <span className="text-lg leading-none" style={{ color: "#6B2737" }}>×</span>
        </button>
      </div>
      <div className="mt-3">
        <Link
          href="/practicas"
          className="text-xs font-medium"
          style={{ color: "#6B2737" }}
          onClick={() => {
            supabase.from("adaptive_nudges_log").update({ action_taken: true }).eq("id", nudge.id).then(() => {})
          }}
        >
          Ir a mis prácticas →
        </Link>
      </div>
    </div>
  )
}

// ── PracticasCard ─────────────────────────────────────────────────────────────
function PracticasCard() {
  return (
    <Link
      href="/practicas"
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: "#F5F0E8", border: "1px solid rgba(107,39,55,0.12)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
            Mis prácticas
          </p>
          <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
            Check-in, emociones y pensamientos
          </p>
        </div>
        <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
          Explorar →
        </span>
      </div>
    </Link>
  )
}

// ── JourneyCard ───────────────────────────────────────────────────────────────
function JourneyCard() {
  const [day, setDay] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("user_journey")
        .select("journey_start_date")
        .eq("user_id", user.id)
        .order("journey_number", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data?.journey_start_date) {
        const today = new Date().toISOString().split("T")[0]
        const diff  = Math.floor(
          (new Date(today).getTime() - new Date(data.journey_start_date).getTime()) / 86_400_000
        )
        setDay(Math.max(1, diff + 1))
      }
    }
    load()
  }, [])

  if (day === null) return null

  const pct = Math.min(100, (day / 90) * 100)

  return (
    <Link
      href="/viaje"
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: "#2d0f16" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C9A84C" }}>
          Tu viaje
        </p>
        <span className="text-xs font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
          Ver detalle →
        </span>
      </div>
      <p className="font-serif text-2xl font-black text-white mb-3">
        Día <span style={{ color: "#C9A84C" }}>{day}</span> de 90
      </p>
      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${Math.max(2, pct)}%`, backgroundColor: "#C9A84C" }}
        />
      </div>
    </Link>
  )
}

// ── WeeklyCard ────────────────────────────────────────────────────────────────
function WeeklyCard() {
  const d      = new Date()
  const day    = d.getDay()
  const offset = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + offset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (dt: Date) =>
    dt.toLocaleDateString("es-ES", { day: "numeric", month: "short" })

  return (
    <Link
      href="/semana"
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: "#F5F0E8", border: "1px solid rgba(107,39,55,0.12)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
            Tu semana
          </p>
          <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
            {fmt(monday)} – {fmt(sunday)}
          </p>
        </div>
        <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
          Ver detalle →
        </span>
      </div>
    </Link>
  )
}

// ── DashboardClient ───────────────────────────────────────────────────────────
export default function DashboardClient({
  initialIsPremium,
  weeklyHighlightsSlot,
}: {
  initialIsPremium: boolean
  weeklyHighlightsSlot?: React.ReactNode
}) {
  const { syncFromSupabase } = useQuizStore()
  const { user, isAuthenticated } = useAuthStore()

  const [mounted,         setMounted]         = useState(false)
  const [todayFormatted,  setTodayFormatted]  = useState("")
  const [isPremium,       setIsPremium]       = useState(initialIsPremium)
  const [weekData,        setWeekData]        = useState<WeekData | null>(null)
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(true)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => { setIsPremium(initialIsPremium) }, [initialIsPremium])
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const hasSeen = localStorage.getItem('welcome_shown')
    if (isPremium && !hasSeen) setShowWelcomeModal(true)
  }, [mounted, isPremium])

  const handleCloseWelcome = () => {
    localStorage.setItem('welcome_shown', 'true')
    setShowWelcomeModal(false)
  }

  useEffect(() => {
    const today = new Date().toLocaleDateString("es-ES", {
      weekday: "long", day: "numeric", month: "long",
    })
    setTodayFormatted(today.charAt(0).toUpperCase() + today.slice(1))
  }, [])

  useEffect(() => {
    syncFromSupabase()

    async function fetchWeekData() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setIsLoadingWeekly(false); return }

      try {
        const wData = await getWeekData(supabase, session.user.id, getCurrentWeekStart())
        setWeekData(wData)
      } catch {
        // no-op — empty state handles it
      } finally {
        setIsLoadingWeekly(false)
      }
    }

    if (mounted) fetchWeekData()
  }, [syncFromSupabase, mounted])

  if (!mounted) return null

  const firstName = user?.name?.trim().split(' ')[0]

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-8">

        {/* ── Saludo ── */}
        <header className="max-w-[520px] w-full mx-auto flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-semibold" style={{ color: "#2d0f16" }}>
            {firstName ? `Hola, ${firstName}` : "Hola"}
          </h1>
          <p className="text-sm font-light" style={{ color: "rgba(45,15,22,0.45)" }}>
            {todayFormatted}
          </p>
        </header>

        {/* ── Profesional vinculado (siempre visible cuando existe) ── */}
        {isAuthenticated && <ProfessionalBadge />}

        {/* ── Check-in diario ── */}
        {isAuthenticated && <CheckInWidget />}

        {/* ── FM Index ── */}
        <div className="max-w-[520px] w-full mx-auto">
          <FoodMoodIndex />
        </div>

        {/* ── Protocolo activo ── */}
        {isAuthenticated && <ProtocolCard />}

        {/* ── Contenido prescrito sin leer ── */}
        {isAuthenticated && <PrescriptionsCard />}

        {/* ── Asignaciones pendientes ── */}
        {isAuthenticated && <AssignmentsCard />}

        {/* ── Nudge adaptativo ── */}
        {isAuthenticated && <NudgeCard />}

        {/* ── Mis prácticas ── */}
        {isAuthenticated && <PracticasCard />}

        {/* ── Viaje ── */}
        {isAuthenticated && <JourneyCard />}

        {/* ── Biomarcadores (solo premium) ── */}
        {isAuthenticated && isPremium && <BiomarkerPanel />}

        {/* ── Semana en colores ── */}
        {isAuthenticated && (
          <div className="max-w-[520px] w-full mx-auto bg-white rounded-[2rem] p-8 border border-aubergine-dark/5 shadow-sm">
            <h4 className="font-sans text-[14px] font-medium text-[#6B2737] mb-6">Tu semana en colores</h4>
            {isLoadingWeekly ? (
              <div className="flex gap-1 justify-center">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-[36px] h-[36px] rounded-[6px] bg-gray-100 animate-pulse" />
                    <div className="w-4 h-2 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : weekData ? (
              <WeekMosaic
                colors={weekData.days.map(d => d.color)}
                labels={["L", "M", "X", "J", "V", "S", "D"]}
                moods={weekData.days.map(d => d.moodName)}
                hasNota={weekData.days.map(d => d.hasNote)}
                dominantMood={weekData.dominantLabel}
                dominantColor={weekData.dominantColor}
                size="compact"
                animate={true}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <p className="text-sm font-light" style={{ color: "rgba(45,15,22,0.5)" }}>
                  Aún no hay registros esta semana.
                </p>
                <Link
                  href="/eloraculo"
                  className="text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ color: "#6B2737" }}
                >
                  Hacer mi primer check-in →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Link rápido semana ── */}
        {isAuthenticated && <WeeklyCard />}

        {/* ── Push notifications ── */}
        <PushNotificationBanner />

        {/* ── Highlights newsletter ── */}
        {weeklyHighlightsSlot}

      </div>

      {/* ── Modal bienvenida premium ── */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-aubergine-dark/80 backdrop-blur-sm"
              onClick={handleCloseWelcome}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1118] via-[#2a1825] to-[#1a1118] rounded-[2rem] p-8 md:p-12 shadow-2xl border border-[#C9A84C]/20 overflow-hidden"
            >
              <button
                type="button"
                aria-label="Cerrar"
                onClick={handleCloseWelcome}
                className="absolute top-6 right-6 text-cream/40 hover:text-cream transition-colors z-20"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C2714F]/10 rounded-full blur-[60px]" />
              <div className="relative flex flex-col items-center text-center gap-6 z-10">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20">
                  <Star className="w-4 h-4 fill-[#C9A84C]" /> Acceso activado
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-black text-cream/95 leading-tight drop-shadow-sm">
                  Aquí empieza<br />tu acompañamiento.
                </h2>
                <p className="text-cream/60 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
                  Ya tienes acceso a todas las herramientas. Empieza por tu primer check-in del día o explora las prácticas que te ha preparado tu profesional.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full mt-6 justify-center">
                  <Link
                    href="/eloraculo"
                    onClick={handleCloseWelcome}
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-white text-sm font-bold rounded-full shadow-lg hover:bg-[#b8953e] hover:scale-105 transition-all"
                  >
                    Hacer mi primer check-in →
                  </Link>
                  <Link
                    href="/practicas"
                    onClick={handleCloseWelcome}
                    className="inline-flex items-center justify-center px-8 py-4 border border-[#C9A84C]/40 text-cream text-sm font-medium rounded-full hover:bg-cream/5 transition-all"
                  >
                    Mis prácticas
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
