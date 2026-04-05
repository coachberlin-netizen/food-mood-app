"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import { useQuizStore } from "@/store/useQuizStore";
import { Clock, Leaf, Droplets, BookOpen, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

/* ── Mood colors for badges ──────────────────────────────────── */
const MOOD_COLORS: Record<string, { color: string; bg: string; emoji: string }> = {
  activacion: { color: "#D97706", bg: "rgba(217,119,6,0.10)", emoji: "⚡" },
  calma:      { color: "#6B8E6B", bg: "rgba(107,142,107,0.10)", emoji: "🌿" },
  focus:      { color: "#0D9488", bg: "rgba(13,148,136,0.10)", emoji: "🧠" },
  social:     { color: "#BE185D", bg: "rgba(190,24,93,0.10)", emoji: "🥂" },
  reset:      { color: "#65A30D", bg: "rgba(101,163,13,0.10)", emoji: "🍋" },
  familia:    { color: "#C2714F", bg: "rgba(194,113,79,0.10)", emoji: "🏠" },
};

const MOOD_MAP: Record<string, string> = {
  activacion: "Activación & Energía",
  calma: "Calma & Equilibrio",
  focus: "Focus & Claridad Mental",
  social: "Social & Placer Compartido",
  reset: "Reset & Ligereza",
  familia: "Familia & Bienestar",
};

const MOOD_LEGACY_MAP: Record<string, string> = {
  "Activación & Energía": "activacion",
  "Calma & Equilibrio": "calma",
  "Focus & Claridad Mental": "focus",
  "Social & Placer Compartido": "social",
  "Social & Confianza": "social",
  "Reset & Ligereza": "reset",
  "Familia & Bienestar": "familia",
  "familia & Calidez": "familia",
  "familia & Placer": "familia"
};

interface Receta {
  id: string;
  nombre_es: string;
  mood_es: string;
  base_acida?: string;
  ingredientes_es?: string[];
  preparacion_es?: string[];
  nota_food_mood_es?: string;
  variantes_es?: string[];
  tiempo_preparacion_min?: number;
  dificultad?: string;
  tipo_plato?: string;
  temporada?: string;
  isRestricted?: boolean;
}

/* ── Content (needs Suspense for useSearchParams) ────────────── */
function ResultadoContent() {
  const searchParams = useSearchParams();
  const urlMood = searchParams.get("mood");
  const storeMood = useQuizStore((s) => s.resultMood);
  const moodIdSource = urlMood || storeMood || "activacion";
  
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    const checkPremium = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .single();
        if (profile?.is_premium) setIsPremium(true);
      }
    };
    checkPremium();
  }, []);
  // Convert full names to slug if necessary
  const moodId = MOOD_LEGACY_MAP[moodIdSource as string] || moodIdSource;

  const [receta, setReceta] = useState<Receta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  const showResults = isSubmitted || isSkipped;

  const moodData = moods.find(m => m.id === moodId);
  const moodStyle = MOOD_COLORS[moodId] || MOOD_COLORS.activacion;
  
  // Get 3 variety moods (excluding current)
  const varietyMoods = moods.filter(m => m.id !== moodId).slice(0, 3);

  useEffect(() => {
    async function fetchReceta() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/receta-gratis?mood=${encodeURIComponent(moodId)}`);
        const data = await res.json();
        if (data.receta) setReceta(data.receta);
      } catch (err) {
        console.error("Error fetching free recipe:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReceta();
  }, [moodId]);

  if (!showResults) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-cream p-8 md:p-12 rounded-[2.5rem] shadow-luxury border border-aubergine-dark/5 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] mx-auto mb-8">
            <Droplets className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-aubergine-dark mb-4 leading-tight">
            ¿Dónde enviamos tu receta semanal personalizada?
          </h2>
          <p className="text-aubergine-dark/50 font-light mb-8 text-sm leading-relaxed">
            Guarda tu resultado y recibe cada domingo una nueva inspiración basada en tu microbioma.
          </p>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white border border-aubergine-dark/10 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 text-aubergine-dark font-light"
            />
            <button
              onClick={() => setIsSubmitted(true)}
              className="w-full py-4 rounded-xl bg-aubergine-dark text-white font-medium hover:bg-aubergine transition-all shadow-lg text-sm"
            >
              Ver mi resultado
            </button>
            <button
              onClick={() => setIsSkipped(true)}
              className="text-xs text-aubergine-dark/30 hover:text-aubergine-dark/50 transition-colors font-light uppercase tracking-widest"
            >
              Continuar sin guardar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 md:px-12">

        {/* ── Microbiome Profile Header ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl mx-auto mb-8 border border-aubergine-dark/5">
            {moodData?.emoji || moodStyle.emoji}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">
            Perfil de Microbioma
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-aubergine-dark mb-6">
            Eres una persona de <span style={{ color: moodStyle.color }}>{moodData?.nombre || MOOD_MAP[moodId] || moodId}</span>
          </h1>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-aubergine-dark/5 max-w-xl mx-auto">
            <p className="text-aubergine-dark/60 text-sm font-light leading-relaxed italic">
              "{moodData?.mecanismo}"
            </p>
          </div>
        </motion.div>

        {/* ── Free recipe section ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              🎁 Tu receta gratuita
            </span>
            <div className="flex-1 h-px bg-aubergine-dark/10" />
          </div>

          {isLoading ? (
            <div className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 animate-pulse">
              <div className="h-6 w-3/4 bg-aubergine-dark/10 rounded mb-4" />
              <div className="h-16 bg-aubergine-dark/5 rounded-xl mb-6" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-aubergine-dark/5 rounded w-full" />
                ))}
              </div>
            </div>
          ) : receta ? (
            <div className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 md:p-10">
              {/* Mood badge + meta */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ color: moodStyle.color, backgroundColor: moodStyle.bg }}
                >
                  {moodStyle.emoji} {moodId}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-aubergine-dark/45">
                  <Clock className="w-3 h-3" />
                  {receta.tiempo_preparacion_min} min
                </span>
                <span className="text-[11px] text-aubergine-dark/35 capitalize">{receta.dificultad}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-aubergine-dark leading-snug mb-2">
                {receta.nombre_es}
              </h2>
              <p className="text-sm text-aubergine-dark/40 font-light mb-8 capitalize">
                {receta.tipo_plato} · {receta.temporada}
              </p>

              {/* Base ácida */}
              {receta.base_acida && (
                <div className="bg-gradient-to-br from-[#C9A84C]/10 via-cream to-[#C9A84C]/5 rounded-xl p-5 mb-8 border border-[#C9A84C]/20 relative overflow-hidden">
                  <Droplets className="absolute top-3 right-3 w-10 h-10 text-[#C9A84C] opacity-15" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-1.5 block">
                    Ingrediente firma
                  </span>
                  <p className="text-base font-serif text-aubergine-dark font-semibold">{receta.base_acida}</p>
                </div>
              )}

              {/* Ingredientes */}
              {receta.ingredientes_es && receta.ingredientes_es.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4 flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5" /> Ingredientes
                  </h3>
                  <ol className="space-y-2">
                    {receta.ingredientes_es.map((ingRaw, i) => {
                      const ing = typeof ingRaw === 'string' ? ingRaw : (ingRaw as any).ingrediente || (ingRaw as any).nombre || JSON.stringify(ingRaw);
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-aubergine-dark/5 text-aubergine-dark/40 text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-aubergine-dark/75 font-light text-sm">{ing}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              {/* Preparación */}
              {receta.preparacion_es && receta.preparacion_es.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                    Preparación
                  </h3>
                  <ol className="space-y-4 relative">
                    {receta?.preparacion_es?.map((pasoRaw, i) => {
                      const paso = typeof pasoRaw === 'string' ? pasoRaw : (pasoRaw as any).paso || (pasoRaw as any).texto || JSON.stringify(pasoRaw);
                      return (
                        <li key={i} className={`flex items-start gap-4 bg-cream rounded-xl p-4 border border-aubergine-dark/5 transition-all ${!isPremium ? 'blur-sm opacity-50 select-none' : ''}`}>
                          <span className="shrink-0 w-8 h-8 rounded-lg bg-aubergine-dark text-cream text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <p className="text-aubergine-dark/75 font-light text-[15px] leading-relaxed pt-1">{paso}</p>
                        </li>
                      );
                    })}
                    {!isPremium && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Link href="/pricing" className="bg-aubergine-dark hover:bg-aubergine text-cream px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold transition-all hover:scale-105">
                          <Lock className="w-4 h-4 text-[#C9A84C]" />
                          Desbloquea la receta completa → Hazte Premium
                        </Link>
                      </div>
                    )}
                  </ol>
                </div>
              )}

              {/* Si está restringida */}
              {receta.isRestricted && (
                <div className="mb-8 bg-gradient-to-br from-aubergine-dark to-aubergine rounded-xl p-8 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl" />
                  <h3 className="text-xl font-serif text-cream mb-3 relative">Descubre esta receta</h3>
                  <p className="text-sm font-light text-cream/70 mb-6 relative">
                    Hazte premium para desbloquear los ingredientes, la preparación y todo el mapa Food·Mood.
                  </p>
                  <a href="/pricing" className="inline-flex relative items-center gap-2 px-8 py-3 bg-[#C9A84C] text-white rounded-full text-sm font-semibold hover:bg-[#b8953e] transition-colors">
                    Ver plan Premium
                  </a>
                </div>
              )}

              {/* Nota Food·Mood */}
              {receta.nota_food_mood_es && (
                <div className="bg-gradient-to-br from-aubergine-dark to-aubergine rounded-xl p-6 text-cream/90 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-3 block relative">
                    🧬 Nota Food·Mood
                  </span>
                  <p className="text-sm font-light leading-[1.85] text-cream/80 relative">
                    {receta.nota_food_mood_es}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-aubergine-dark/40">
              No se encontró una receta para este mood.
            </div>
          )}
        </motion.div>

        {/* ── Variety Block (Locked) ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-aubergine-dark mb-4 px-4">
              Tu sistema inmune y tu microbioma necesitan variedad
            </h2>
            <p className="text-aubergine-dark/50 font-light text-sm max-w-md mx-auto px-4 leading-relaxed">
              Cada receta activa un camino diferente en tu eje intestino-cerebro. Una sola no es suficiente para la transformación real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {varietyMoods.map((m, i) => (
              <div key={i} className="relative group rounded-2xl overflow-hidden aspect-[4/5] border border-aubergine-dark/5 bg-cream">
                <div className="absolute inset-0 bg-gradient-to-t from-aubergine-dark/80 to-transparent z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-[2px]">
                  <Lock className="w-6 h-6 text-cream/30 mb-3" />
                  <span className="text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-1">
                    Mood {m.nombre}
                  </span>
                  <div className="h-px w-8 bg-cream/20 mb-3" />
                  <p className="text-xs text-cream/60 font-light italic">
                    "{m.descripcion_corta}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Enhanced Upsell ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-aubergine-dark to-aubergine rounded-[2.5rem] p-10 md:p-14 text-center shadow-luxury relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl opacity-30" />
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 block">
              Acceso Premium
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">
              Tu perfil completo te espera
            </h2>
            <p className="text-cream/60 font-light max-w-lg mx-auto mb-10 leading-relaxed">
              Desbloquea instantáneamente las recetas de los 6 estados de ánimo, el paso a paso detallado y el diario evolutivo de tu microbiota.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch w-full max-w-md mx-auto">
              <a 
                href="/pricing?plan=quarterly" 
                className="flex-1 px-8 py-4.5 bg-[#C9A84C] text-white rounded-2xl text-sm font-semibold hover:bg-[#b8953e] transition-all shadow-lg flex flex-col gap-0.5 items-center justify-center group"
              >
                <span>Plan Trimestral</span>
                <span className="text-[10px] opacity-80 group-hover:opacity-100 uppercase tracking-wider">Sólo 5€/mes</span>
              </a>
              <a 
                href="/pricing?plan=monthly" 
                className="flex-1 px-8 py-4.5 bg-white/10 hover:bg-white/20 text-cream rounded-2xl text-sm font-semibold transition-all border border-white/10 flex flex-col gap-0.5 items-center justify-center"
              >
                <span>Plan Mensual</span>
                <span className="text-[10px] opacity-60 uppercase tracking-wider">9€/mes</span>
              </a>
            </div>
            
            <p className="text-[11px] text-cream/30 mt-6 font-light italic">
              Compromiso total con tu salud o acceso flexible mes a mes.
            </p>
          </div>
        </motion.div>

        {/* ── Scientific disclaimer ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-start gap-3 mt-16 text-aubergine-dark/30 text-xs border-t border-aubergine-dark/10 pt-8"
        >
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-light">
            Las explicaciones científicas de Food·Mood son simplificaciones divulgativas basadas en investigación publicada sobre el eje intestino-cerebro. No sustituyen consejo médico profesional.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Page export ─────────────────────────────────────────────── */
export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-aubergine-dark/10 border-t-[#C9A84C] animate-spin" />
        </div>
      }
    >
      <ResultadoContent />
    </Suspense>
  );
}
