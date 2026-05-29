"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { moods } from "@/data/moods";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Sparkles, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodDiary } from "@/components/dashboard/MoodDiary";
import { InspirationSection } from "@/components/dashboard/InspirationSection";
import { PushNotificationBanner } from "@/components/dashboard/PushNotificationBanner";
import { PaletteWidget } from "@/components/dashboard/PaletteWidget";
import { OracleWidget } from "@/components/dashboard/OracleWidget";
import { WeekMosaic } from "@/components/diary/WeekMosaic";
import { getWeekData, getCurrentWeekStart, WeekData } from "@/lib/mood-diary";
import { FoodMoodIndex } from "@/components/FoodMoodIndex";
import { BiomarkerPanel } from "@/components/biomarkers/BiomarkerPanel"
import { useLinkedProfessional, usePrescriptions } from "@/hooks/usePrescriptions";

// ── PrescriptionsCard — shown only when patient has unread prescribed content ──
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

// ── JourneyCard — compact dashboard widget ────────────────────────────────────
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
          🧭 Tu viaje
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

// ── RetosCard — compact dashboard widget ──────────────────────────────────────
function RetosCard() {
  const [activeReto, setActiveReto] = useState<{
    slug: string; title: string; emoji: string; color: string;
    current_day: number; duration_days: number
  } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoaded(true); return }

      const { data: enrollments } = await supabase
        .from('user_challenges')
        .select('challenge_id, current_day, paid, completed')
        .eq('user_id', user.id)
        .eq('paid', true)
        .eq('completed', false)
        .limit(1)
        .maybeSingle()

      if (enrollments) {
        const { data: ch } = await supabase
          .from('challenges')
          .select('slug, title, emoji, color, duration_days')
          .eq('id', enrollments.challenge_id)
          .single()
        if (ch) {
          setActiveReto({
            slug:         ch.slug,
            title:        ch.title,
            emoji:        ch.emoji,
            color:        ch.color,
            duration_days: ch.duration_days,
            current_day:  enrollments.current_day,
          })
        }
      }
      setLoaded(true)
    }
    load()
  }, [])

  if (!loaded) return null

  if (!activeReto) {
    return (
      <Link
        href="/retos"
        className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.1)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
              🎯 Retos
            </p>
            <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
              Elige tu próxima transformación
            </p>
          </div>
          <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
            Ver retos →
          </span>
        </div>
      </Link>
    )
  }

  const pct = Math.min(100, ((activeReto.current_day - 1) / activeReto.duration_days) * 100)

  return (
    <Link
      href={`/retos/${activeReto.slug}`}
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: activeReto.color + '18', border: `1px solid ${activeReto.color}33` }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: activeReto.color }}>
          🎯 Tu reto activo
        </p>
        <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
          Continuar →
        </span>
      </div>
      <p className="font-serif text-lg font-bold mb-1" style={{ color: "#2d0f16" }}>
        {activeReto.emoji} {activeReto.title}
      </p>
      <p className="text-xs font-medium mb-3" style={{ color: activeReto.color }}>
        Día {activeReto.current_day} de {activeReto.duration_days}
      </p>
      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "rgba(107,39,55,0.1)" }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${Math.max(2, pct)}%`, backgroundColor: activeReto.color }}
        />
      </div>
    </Link>
  )
}

// ── NudgeCard — muestra el último nudge adaptativo no leído ──────────────────
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
        // Mark delivered
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

// ── WeeklyCard — compact dashboard widget ─────────────────────────────────────
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

function WeeklyCard() {
  const d   = new Date()
  const day = d.getDay()
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
            📊 Tu semana
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

export default function DashboardClient({ initialIsPremium, weeklyHighlightsSlot }: { initialIsPremium: boolean; weeklyHighlightsSlot?: React.ReactNode }) {
  const { resultMood, quizCount, syncFromSupabase, resetQuiz } = useQuizStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [todayFormatted, setTodayFormatted] = useState("");
  const [isPremium, setIsPremium] = useState(initialIsPremium);
  const [weeklyMoods, setWeeklyMoods] = useState<Record<number, string>>({});
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(true);
  const searchParams = useSearchParams();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    setIsPremium(initialIsPremium);
  }, [initialIsPremium]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hasSeen = localStorage.getItem('welcome_shown');
    if (isPremium && !hasSeen) {
      setShowWelcomeModal(true);
    }
  }, [mounted, isPremium]);

  const handleCloseWelcome = () => {
    localStorage.setItem('welcome_shown', 'true');
    setShowWelcomeModal(false);
  };

  const MOOD_KEYWORD: Record<string, string> = {
    activacion: 'Activaci', calma: 'Calma', focus: 'Focus',
    social: 'Social', reset: 'Reset', familia: 'familia',
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setTodayFormatted(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  useEffect(() => {
    syncFromSupabase();

    async function fetchUserData() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const now = new Date();
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const { data: diaryResults } = await supabase
        .from('mood_diary')
        .select('mood, created_at')
        .eq('user_id', session.user.id)
        .gte('created_at', monday.toISOString())
        .lte('created_at', sunday.toISOString())
        .order('created_at', { ascending: true });

      if (diaryResults && diaryResults.length > 0) {
        const moodsByDay: Record<number, string> = {};
        for (const dr of diaryResults) {
          const d = new Date(dr.created_at);
          const dow = d.getDay() === 0 ? 7 : d.getDay();
          moodsByDay[dow] = dr.mood;
        }
        setWeeklyMoods(moodsByDay);
      }

      try {
        const wData = await getWeekData(supabase, session.user.id, getCurrentWeekStart());
        setWeekData(wData);
      } catch (err) {
        console.error('Error fetching weekly data:', err);
      } finally {
        setIsLoadingWeekly(false);
      }
    }

    if (mounted) fetchUserData();
  }, [syncFromSupabase, mounted]);

  if (!mounted) return null;

  const currentMoodId = resultMood || "social";
  const currentMood = moods.find((m) => m.id === currentMoodId) || moods[0];

  const taglines: Record<string, string> = {
    activacion: "Despierta a tu ritmo y cómete el día.",
    calma: "Baja las revoluciones y ponte muy cómodo.",
    focus: "Afila la mente, no la ansiedad.",
    social: "Todo sabe mejor con alguien enfrente.",
    reset: "Dale al botón de reinicio y empecemos de cero.",
    familia: "Mantita, calor y mucho placer reFamiliaante."
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-24">

        {/* ── Índice Food·Mood ── */}
        <div className="max-w-[520px] w-full mx-auto">
          <FoodMoodIndex />
        </div>

        {/* ── Paleta emocional ── */}
        <PaletteWidget />

        {/* ── Oracle widget ── */}
        {isAuthenticated && <OracleWidget />}

        {/* ── Biomarcadores (solo premium) ── */}
        {isAuthenticated && isPremium && <BiomarkerPanel />}

        {/* ── Nudge card (adaptive JITAI nudge, max 1 per 24h) ── */}
        {isAuthenticated && <NudgeCard />}

        {/* ── Prescriptions card (patients with active professional link) ── */}
        {isAuthenticated && <PrescriptionsCard />}

        {/* ── Prácticas card ── */}
        {isAuthenticated && <PracticasCard />}

        {/* ── Journey card ── */}
        {isAuthenticated && <JourneyCard />}

        {/* ── Retos card ── */}
        {isAuthenticated && <RetosCard />}

        {/* ── Weekly card ── */}
        {isAuthenticated && <WeeklyCard />}

        <div className="flex flex-col gap-6">
          {isAuthenticated && (
            <div className="bg-white rounded-[2rem] p-8 border border-aubergine-dark/5 shadow-sm">
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
              ) : isPremium && weekData ? (
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
                <div className="flex flex-col items-center gap-4 py-2">
                  <p className="text-sm font-light text-aubergine-dark/60 text-center">
                    No hay datos suficientes para esta semana.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <header className="flex flex-col gap-4">
          <p className="font-serif text-2xl font-bold text-aubergine">Food<span className="text-[#C9A84C]">·</span>Mood</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-aubergine-dark leading-[1.15]">
            {isAuthenticated && user?.name && user.name.trim().length > 2
              ? <>Hola, {user.name.trim().split(' ')[0]}. ¿Qué te apetece hoy?</>
              : <>Hola. ¿Qué te apetece hoy?</>}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px bg-[#C9A84C] opacity-40 w-16"></div>
            <p className="text-aubergine/80 font-serif font-light italic tracking-wide">{todayFormatted}</p>
          </div>
        </header>

        <section className="flex flex-col gap-8">
          <div className="rounded-[1.5rem] p-10 md:p-14 shadow-sm transition-all duration-300 relative overflow-hidden border-l-[12px] border-[#C9A84C]" style={{ backgroundColor: `${currentMood.color}15` }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 z-10 relative">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-px bg-[#C9A84C]"></div>
                  <h2 className="text-[10px] font-bold text-aubergine-dark/60 uppercase tracking-[0.2em]">Tus sensaciones de hoy</h2>
                </div>
                <h3 className="text-5xl md:text-6xl font-serif font-black text-aubergine-dark mb-4 drop-shadow-sm">{currentMood.nombre}</h3>
                <p className="text-xl md:text-2xl text-aubergine-dark/80 font-light leading-[1.6]">{taglines[currentMood.id] || currentMood.descripcion_corta}</p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Link href="/recetas" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-aubergine-dark text-white font-medium text-sm tracking-wide shadow-luxury hover:bg-aubergine transition-colors">
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Déjate inspirar
                </Link>
                <Link href="/test" onClick={() => resetQuiz()} className="inline-flex items-center justify-center px-10 py-3 border border-aubergine-dark/20 rounded-full text-aubergine-dark/70 bg-transparent hover:bg-cream hover:border-[#C9A84C] hover:text-aubergine-dark font-light text-xs tracking-wide transition-all">¿Cambió tu mood?</Link>
              </div>
            </div>
          </div>
        </section>

        <InspirationSection currentMoodId={currentMoodId} />
        <MoodDiary />

        {!isAuthenticated ? (
          <section className="flex flex-col gap-8">
            <div className="bg-gradient-to-br from-aubergine-dark via-aubergine to-aubergine-dark rounded-[1.5rem] p-10 md:p-12 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/8 rounded-full blur-3xl" />
              <div className="relative flex flex-col items-center gap-6">
                <h3 className="text-2xl font-serif font-bold text-cream/90">Descubre tu Food·Mood</h3>
                <p className="text-cream/70 font-light text-sm max-w-md">Un test de 2 minutos basado en neurociencia nutricional. Sin dietas, sin restricciones.</p>
                <Link href="/test" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#C9A84C] hover:bg-[#b8953e] text-white font-semibold text-sm tracking-wide shadow-lg transition-all">Empieza tu prueba gratis</Link>
              </div>
            </div>
          </section>
        ) : null}
        {isPremium && (
          <section className="flex flex-col gap-8">
            <div className="bg-gradient-to-br from-[#1a1118] via-[#2a1825] to-[#1a1118] rounded-[1.5rem] p-10 md:p-14 relative overflow-hidden border border-[#C9A84C]/20 shadow-luxury">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C2714F]/10 rounded-full blur-[60px]" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="flex flex-col gap-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20"><Star className="w-3.5 h-3.5 fill-[#C9A84C]" /> Food·Mood Premium</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-black text-cream/95 leading-tight max-w-xl drop-shadow-sm">Aquí empieza tu viaje hacia un verdadero conocimiento de ti mismo.</h3>
                  <p className="text-cream/60 font-light text-base max-w-lg leading-relaxed mt-2">Tienes acceso total a todas las exclusivas. Escucha a tu cuerpo, elige recetas específicas para tu mood y descubre el impacto real de cada ingrediente en tu bienestar. Déjate inspirar.</p>
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1], y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="hidden md:flex shrink-0 w-28 h-28 items-center justify-center bg-gradient-to-br from-cream/10 to-cream/5 rounded-full border border-cream/20 shadow-[0_0_30px_rgba(201,168,76,0.15)] relative">
                  <div className="absolute inset-0 bg-[#C9A84C]/5 rounded-full blur-xl animate-pulse" />
                  <Sparkles className="w-12 h-12 text-[#C9A84C] drop-shadow-[0_0_10px_rgba(201,168,76,0.4)]" strokeWidth={1.5} />
                </motion.div>
              </div>
            </div>
          </section>
        )}
        {weeklyHighlightsSlot}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4"><h2 className="text-xs font-semibold text-aubergine-dark/40 uppercase tracking-[0.2em]">Métricas</h2></div>
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/20 shadow-sm flex flex-col justify-between"><span className="text-[10px] text-aubergine-dark/50 font-medium tracking-[0.2em] uppercase">Evaluaciones</span><span className="text-4xl font-serif text-[#C9A84C] mt-6">{quizCount || 3}</span></div>
              <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/20 shadow-sm flex flex-col justify-between"><span className="text-[10px] text-aubergine-dark/50 font-medium tracking-[0.2em] uppercase">Tendencia</span><span className="text-2xl font-serif text-aubergine-dark mt-6 italic">Focus</span></div>
            </div>
          </section>
        </div>

        <section className="mt-8 flex justify-center">
          <div className="bg-aubergine-dark/5 rounded-[1.5rem] p-8 md:p-10 shadow-sm border border-aubergine-dark/10 max-w-2xl text-center"><p className="font-serif italic text-aubergine-dark/90 text-lg md:text-xl font-light leading-[1.6]">&quot;No contamos calorías, contamos momentos. Food·Mood escucha lo que te pide el cuerpo para crear combinaciones únicas, vibrantes y pensadas para disfrutar cada bocado.&quot;</p></div>
        </section>
        <PushNotificationBanner />
      </div>

      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-aubergine-dark/80 backdrop-blur-sm" onClick={handleCloseWelcome} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1118] via-[#2a1825] to-[#1a1118] rounded-[2rem] p-8 md:p-12 shadow-2xl border border-[#C9A84C]/20 overflow-hidden">
              <button type="button" aria-label="Cerrar bienvenida" onClick={handleCloseWelcome} className="absolute top-6 right-6 text-cream/40 hover:text-cream transition-colors z-20"><X className="w-6 h-6" aria-hidden="true" /></button>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C2714F]/10 rounded-full blur-[60px]" />
              <div className="relative flex flex-col items-center text-center gap-6 z-10">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20"><Star className="w-4 h-4 fill-[#C9A84C]" /> Premium Activado</span>
                <h2 className="text-3xl md:text-5xl font-serif font-black text-cream/95 leading-tight drop-shadow-sm">Enhorabuena.<br/>Aquí empieza tu viaje.</h2>
                <p className="text-cream/60 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed">Estás a un paso de un verdadero conocimiento de ti mismo a través de la neurociencia nutricional. Descubre cómo tu alimentación puede transformar tu mente.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full mt-6 justify-center">
                  <Link href="/test" onClick={handleCloseWelcome} className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-white text-sm font-bold rounded-full shadow-lg hover:bg-[#b8953e] hover:scale-105 transition-all">Hacer mi primer test →</Link>
                  <Link href="/recetas" onClick={handleCloseWelcome} className="inline-flex items-center justify-center px-8 py-4 border border-[#C9A84C]/40 text-cream text-sm font-medium rounded-full hover:bg-cream/5 transition-all">Explorar mis recetas</Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
