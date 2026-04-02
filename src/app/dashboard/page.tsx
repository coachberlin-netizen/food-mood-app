"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { createRecetasClient } from "@/lib/supabase/recetas";
import { moods } from "@/data/moods";
// recipesData import removed — using Supabase API directly
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { resultMood, quizCount, syncFromSupabase, resetQuiz } = useQuizStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [todayRecipe, setTodayRecipe] = useState<any>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [todayFormatted, setTodayFormatted] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [weeklyMoods, setWeeklyMoods] = useState<Record<number, string>>({}); // dayOfWeek (1=Mon) -> moodId
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  // Mood keyword map for Supabase ilike query
  const MOOD_KEYWORD: Record<string, string> = {
    activacion: 'Activaci', calma: 'Calma', focus: 'Focus',
    social: 'Social', reset: 'Reset', confort: 'Confort',
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setTodayFormatted(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  // Single useEffect: fetch premium status + weekly quiz history
  useEffect(() => {
    setMounted(true);
    syncFromSupabase();

    async function fetchUserData() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // 1. Fetch premium status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', session.user.id)
        .single();
      if (profile) setIsPremium(!!profile.is_premium);

      // 2. Fetch quiz_results for this week (Monday-Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('result_mood, created_at')
        .eq('user_id', session.user.id)
        .gte('created_at', monday.toISOString())
        .lte('created_at', sunday.toISOString())
        .order('created_at', { ascending: true });

      if (quizResults && quizResults.length > 0) {
        const moodsByDay: Record<number, string> = {};
        for (const qr of quizResults) {
          const d = new Date(qr.created_at);
          const dow = d.getDay() === 0 ? 7 : d.getDay(); // 1=Mon...7=Sun
          moodsByDay[dow] = qr.result_mood; // latest wins if multiple per day
        }
        setWeeklyMoods(moodsByDay);
      }
    }

    fetchUserData();
  }, [syncFromSupabase]);

  // "Receta del día" — random recipe matching user's mood (direct Supabase query)
  const handleRecetaDelDia = async () => {
    setIsLoadingRecipe(true);
    try {
      const supabase = createRecetasClient();
      const moodId = resultMood || 'social';
      const keyword = MOOD_KEYWORD[moodId] || 'Social';

      // First try: mood-matching free recipe
      let { data, count } = await supabase
        .from('recetas')
        .select('*', { count: 'exact' })
        .ilike('mood_es', `%${keyword}%`)
        .eq('segmento', 'adulto')
        .eq('premium_level', 0)
        .limit(1);

      // Pick random offset if there are results
      if (count && count > 1) {
        const randomOffset = Math.floor(Math.random() * Math.min(count, 200));
        const { data: randomData } = await supabase
          .from('recetas')
          .select('*')
          .ilike('mood_es', `%${keyword}%`)
          .eq('segmento', 'adulto')
          .eq('premium_level', 0)
          .range(randomOffset, randomOffset);
        if (randomData?.length) data = randomData;
      }

      if (data?.length) {
        setTodayRecipe(data[0]);
      } else {
        // Fallback: any free recipe
        const { data: fallback } = await supabase
          .from('recetas')
          .select('*')
          .eq('premium_level', 0)
          .limit(1);
        if (fallback?.length) setTodayRecipe(fallback[0]);
      }
    } catch (err) {
      console.error('Error fetching receta del día:', err);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  // "Hacer magia" — random Michelin recipe (premium_level=2), fallback to any
  const handleHacerMagia = async () => {
    setIsLoadingRecipe(true);
    try {
      const supabase = createRecetasClient();

      // Try Michelin first
      const { count } = await supabase
        .from('recetas')
        .select('id', { count: 'exact', head: true })
        .eq('premium_level', 2);

      if (count && count > 0) {
        const randomOffset = Math.floor(Math.random() * Math.min(count, 100));
        const { data } = await supabase
          .from('recetas')
          .select('*')
          .eq('premium_level', 2)
          .range(randomOffset, randomOffset);
        if (data?.length) {
          setTodayRecipe(data[0]);
          return;
        }
      }

      // Fallback: any recipe
      const { count: totalCount } = await supabase
        .from('recetas')
        .select('id', { count: 'exact', head: true });
      const offset = Math.floor(Math.random() * Math.min(totalCount || 100, 500));
      const { data: fallback } = await supabase
        .from('recetas')
        .select('*')
        .range(offset, offset);
      if (fallback?.length) setTodayRecipe(fallback[0]);
    } catch (err) {
      console.error('Error fetching magia recipe:', err);
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  if (!mounted) return null;

  // 1. DATA PREPARATION

  const currentMoodId = resultMood || "social";
  const currentMood = moods.find((m) => m.id === currentMoodId) || moods[0];

  const taglines: Record<string, string> = {
    activacion: "Despierta a tu ritmo y cómete el día.",
    calma: "Baja las revoluciones y ponte muy cómodo.",
    focus: "Afila la mente, no la ansiedad.",
    social: "Todo sabe mejor con alguien enfrente.",
    reset: "Dale al botón de reinicio y empecemos de cero.",
    confort: "Mantita, calor y mucho placer reconfortante."
  };

  // Weekly balance — build from real data
  const DAY_LABELS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
  const moodColors: Record<string, string> = {};
  moods.forEach(m => { moodColors[m.id] = m.color; });

  const historyDays = DAY_LABELS.map((label, i) => {
    const dayNum = i + 1; // 1=Mon...7=Sun
    const moodId = weeklyMoods[dayNum];
    const hasData = !!moodId;
    const color = hasData ? (moodColors[moodId] || "#C9A84C") : "#d1d5db";
    return { label, color, hasData };
  });

  
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-24">
        
        {/* SUCCESS BANNER after payment */}
        {showSuccess && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-800 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-medium">
              ¡Bienvenida a Food·Mood Premium! Ya tienes acceso a todas las recetas.
            </p>
          </div>
        )}

        {/* 1. HEADER */}
        <header className="flex flex-col gap-4">
          <p className="font-serif text-2xl font-bold text-aubergine">
            Food<span className="text-[#C9A84C]">·</span>Mood
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-aubergine-dark leading-[1.15]">
            {isAuthenticated && user?.name && user.name.trim().length > 2
              ? <>Hola, {user.name.trim().split(' ')[0]}. ¿Qué te apetece hoy?</>
              : <>Hola. ¿Qué te apetece hoy?</>}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px bg-[#C9A84C] opacity-40 w-16"></div>
            <p className="text-aubergine/80 font-serif font-light italic tracking-wide">
              {todayFormatted}
            </p>
          </div>
        </header>

        {/* 2. MOOD ACTUAL */}
        <section className="flex flex-col gap-8">
          <div
            className="rounded-[1.5rem] p-10 md:p-14 shadow-sm transition-all duration-300 relative overflow-hidden border-l-[12px] border-[#C9A84C]"
            style={{ backgroundColor: `${currentMood.color}15` }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 z-10 relative">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-px bg-[#C9A84C]"></div>
                  <h2 className="text-[10px] font-bold text-aubergine-dark/60 uppercase tracking-[0.2em]">
                    Tus sensaciones de hoy
                  </h2>
                </div>
                <h3 className="text-5xl md:text-6xl font-serif font-black text-aubergine-dark mb-4 drop-shadow-sm">
                  {currentMood.nombre}
                </h3>
                <p className="text-xl md:text-2xl text-aubergine-dark/80 font-light leading-[1.6]">
                  {taglines[currentMood.id] || currentMood.descripcion_corta}
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <button
                  onClick={() => {
                    if (todayRecipe) {
                      document.getElementById('receta-del-dia')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handleRecetaDelDia();
                    }
                  }}
                  disabled={isLoadingRecipe}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-aubergine-dark text-white font-medium text-sm tracking-wide shadow-luxury hover:bg-aubergine transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingRecipe ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 text-[#C9A84C]" /> Receta del día</>
                  )}
                </button>
                <Link
                  href="/test"
                  onClick={() => resetQuiz()}
                  className="inline-flex items-center justify-center px-10 py-3 border border-aubergine-dark/20 rounded-full text-aubergine-dark/70 bg-transparent hover:bg-cream hover:border-[#C9A84C] hover:text-aubergine-dark font-light text-xs tracking-wide transition-all"
                >
                  ¿Cambió tu mood?
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 SUBSCRIPTION / CTA */}
        {!isAuthenticated ? (
          /* Not logged in → simple CTA to take test */
          <section className="flex flex-col gap-8">
            <div className="bg-gradient-to-br from-aubergine-dark via-aubergine to-aubergine-dark rounded-[1.5rem] p-10 md:p-12 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/8 rounded-full blur-3xl" />
              <div className="relative flex flex-col items-center gap-6">
                <h3 className="text-2xl font-serif font-bold text-cream/90">Descubre tu Food·Mood</h3>
                <p className="text-cream/45 font-light text-sm max-w-md">
                  Un test de 2 minutos basado en neurociencia nutricional. Sin dietas, sin restricciones.
                </p>
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#C9A84C] hover:bg-[#b8953e] text-white font-semibold text-sm tracking-wide shadow-lg transition-all"
                >
                  Empieza tu prueba gratis
                </Link>
              </div>
            </div>
          </section>
        ) : !isPremium ? (
          /* Authenticated + free → show premium upsell */
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
                Tu plan Food·Mood
              </h2>
              <div className="h-px bg-[#C9A84C] flex-1 opacity-20"></div>
            </div>

            <div className="bg-gradient-to-br from-aubergine-dark via-aubergine to-aubergine-dark rounded-[1.5rem] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/8 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cream/3 rounded-full blur-3xl" />

              <div className="relative flex flex-col gap-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20 mb-4">
                    <Sparkles className="w-3 h-3" /> Premium
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-cream/90 leading-snug mb-2">
                    Un plan adecuado y variado para ti
                  </h3>
                  <p className="text-cream/40 font-light text-sm max-w-lg">
                    Cada día una combinación nueva. Sin repeticiones, siempre adaptada a lo que tu cuerpo necesita.
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "🍽", text: "10.000 recetas sin repetirse", detail: "Variedad real para tu microbiota" },
                    { icon: "⭐", text: "200 recetas Michelin-inspired", detail: "Alta cocina funcional exclusiva" },
                    { icon: "🔬", text: "Filtros por mood, edad y sexo", detail: "Ciencia personalizada" },
                    { icon: "❤️", text: "Favoritos ilimitados", detail: "Guarda las que más te gusten" },
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3.5 bg-cream/5 rounded-xl p-4 border border-cream/8">
                      <span className="text-lg shrink-0 mt-0.5">{benefit.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-cream/80">{benefit.text}</p>
                        <p className="text-[11px] text-cream/35 font-light mt-0.5">{benefit.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col items-start gap-3">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full bg-[#C9A84C] hover:bg-[#b8953e] text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    Suscríbete — 9€/mes
                  </Link>
                  <p className="text-[11px] text-cream/25 font-light">
                    Cancela cuando quieras · Sin permanencia
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null /* Premium user → hide block entirely */}

        {/* 3. RECETA DEL DÍA */}
        <section id="receta-del-dia" className="flex flex-col gap-8 scroll-mt-8">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
              Tu antojo para hoy
            </h2>
            <div className="h-px bg-[#C9A84C] flex-1 opacity-20"></div>
          </div>
          
          <div className="bg-cream rounded-[1.5rem] p-10 border border-aubergine-dark/20 shadow-sm flex flex-col justify-center min-h-[200px]">
            {todayRecipe ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                        {todayRecipe.mood_es}
                      </span>
                      {(todayRecipe.premium_level ?? 0) === 2 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[9px] font-bold uppercase tracking-wider border border-[#C9A84C]/20">
                          ✦ Michelin
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-black text-aubergine-dark">
                      {todayRecipe.nombre_es}
                    </h3>
                    {todayRecipe.contexto_es && (
                      <p className="text-aubergine-dark/55 font-light text-sm leading-relaxed max-w-lg">{todayRecipe.contexto_es}</p>
                    )}
                    <div className="flex items-center gap-5 text-xs text-aubergine-dark/45 font-light mt-2 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                        {todayRecipe.tiempo_preparacion_min} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                        {todayRecipe.dificultad}
                      </span>
                      <span className="flex items-center gap-1.5 capitalize">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                        {todayRecipe.tipo_plato}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/recetas/${todayRecipe.id}`}
                    className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors"
                  >
                    Ver receta completa →
                  </Link>
                </div>

                {/* Nota Food·Mood */}
                {todayRecipe.nota_food_mood_es && (
                  <div className="bg-[#C9A84C]/5 p-5 rounded-xl border-l-2 border-[#C9A84C] text-sm font-light text-aubergine-dark/80 italic">
                    🧬 {todayRecipe.nota_food_mood_es}
                  </div>
                )}

                {/* Refresh button */}
                <button
                  onClick={handleRecetaDelDia}
                  disabled={isLoadingRecipe}
                  className="self-center text-[11px] text-aubergine-dark/35 hover:text-aubergine-dark/60 transition-colors cursor-pointer"
                >
                  Otra receta →
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-6">
                <p className="font-serif text-xl md:text-2xl text-aubergine-dark/80 max-w-lg font-light leading-[1.6]">
                  Aún no le has dado un capricho a tus sentidos hoy.<br/>¿Preparamos algo especial?
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={handleHacerMagia}
                    disabled={isLoadingRecipe}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-aubergine-dark text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-aubergine transition-colors tracking-wide"
                  >
                    {isLoadingRecipe ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Hacer magia ahora mismo
                        <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                      </>
                    )}
                  </button>
                  {!resultMood && (
                    <Link href="/test" className="text-xs text-aubergine-dark/50 hover:text-aubergine-dark font-sans tracking-wide">
                      Haz el test para recetas personalizadas →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
          {/* 4. HISTORIAL */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-semibold text-aubergine-dark/40 uppercase tracking-[0.2em]">
                Balance Semanal
              </h2>
            </div>
            <div className="bg-cream rounded-[1.5rem] p-10 border border-aubergine-dark/20 shadow-sm flex flex-col justify-center h-full gap-10">
              <div className="flex justify-between items-center w-full px-2">
                {historyDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-5">
                    <div 
                      className={`w-3 h-12 rounded-full transition-all ${!day.hasData ? "opacity-20" : "shadow-inner border border-black/5"}`}
                      style={{ backgroundColor: day.hasData ? day.color : "#d1d5db" }}
                    />
                    <span className="text-[10px] text-aubergine-dark/40 font-medium uppercase tracking-widest">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. ESTADÍSTICAS */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-semibold text-aubergine-dark/40 uppercase tracking-[0.2em]">
                Métricas
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-aubergine-dark/50 font-medium tracking-[0.2em] uppercase">Evaluaciones</span>
                <span className="text-4xl font-serif text-[#C9A84C] mt-6">{quizCount || 3}</span>
              </div>
              <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-aubergine-dark/50 font-medium tracking-[0.2em] uppercase">Tendencia</span>
                <span className="text-2xl font-serif text-aubergine-dark mt-6 italic">Focus</span>
              </div>
            </div>
          </section>
        </div>

        {/* 6. INFO IA */}
        <section className="mt-8 flex justify-center">
          <div className="bg-aubergine-dark/5 rounded-[1.5rem] p-8 md:p-10 shadow-sm border border-aubergine-dark/10 max-w-2xl text-center">
            <p className="font-serif italic text-aubergine-dark/90 text-lg md:text-xl font-light leading-[1.6]">
              &quot;No contamos calorías, contamos momentos. Food·Mood escucha lo que te pide el cuerpo para crear combinaciones únicas, vibrantes y pensadas para disfrutar cada bocado.&quot;
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
