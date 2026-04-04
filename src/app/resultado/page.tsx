"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import { useQuizStore } from "@/store/useQuizStore";
import { Clock, Leaf, Droplets, BookOpen } from "lucide-react";
import { UpsellBlock } from "@/components/upsell/UpsellBlock";

/* ── Mood colors for badges ──────────────────────────────────── */
const MOOD_COLORS: Record<string, { color: string; bg: string; emoji: string }> = {
  activacion: { color: "#D97706", bg: "rgba(217,119,6,0.10)", emoji: "⚡" },
  calma:      { color: "#6B8E6B", bg: "rgba(107,142,107,0.10)", emoji: "🌿" },
  focus:      { color: "#0D9488", bg: "rgba(13,148,136,0.10)", emoji: "🧠" },
  social:     { color: "#BE185D", bg: "rgba(190,24,93,0.10)", emoji: "🥂" },
  reset:      { color: "#65A30D", bg: "rgba(101,163,13,0.10)", emoji: "🍋" },
  confort:    { color: "#C2714F", bg: "rgba(194,113,79,0.10)", emoji: "🫶" },
};

const MOOD_MAP: Record<string, string> = {
  activacion: "Activación & Energía",
  calma: "Calma & Equilibrio",
  focus: "Focus & Claridad Mental",
  social: "Social & Placer Compartido",
  reset: "Reset & Ligereza",
  confort: "Confort & Calidez",
};

const MOOD_LEGACY_MAP: Record<string, string> = {
  "Activación & Energía": "activacion",
  "Calma & Equilibrio": "calma",
  "Focus & Claridad Mental": "focus",
  "Social & Placer Compartido": "social",
  "Social & Confianza": "social",
  "Reset & Ligereza": "reset",
  "Confort & Calidez": "confort",
  "Confort & Placer": "confort"
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
  // Convert full names to slug if necessary
  const moodId = MOOD_LEGACY_MAP[moodIdSource as string] || moodIdSource;

  const [receta, setReceta] = useState<Receta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const moodData = moods.find(m => m.id === moodId);
  const moodStyle = MOOD_COLORS[moodId] || MOOD_COLORS.activacion;

  useEffect(() => {
    async function fetchReceta() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/receta-gratis?mood=${moodId}`);
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 md:px-12">

        {/* ── Mood result header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-aubergine/10 flex items-center justify-center text-4xl mx-auto mb-6 border border-aubergine-dark/10">
            {moodData?.emoji || moodStyle.emoji}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-3">
            Tu estado actual
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-3" style={{ color: moodStyle.color }}>
            Eres {moodData?.nombre || MOOD_MAP[moodId] || moodId}
          </h1>
          <p className="text-aubergine-dark/55 font-light max-w-md mx-auto">
            {moodData?.descripcion_corta}
          </p>
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
                    {receta?.ingredientes_es?.map((ing, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-aubergine-dark/5 text-aubergine-dark/40 text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-aubergine-dark/75 font-light text-sm">{ing}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Preparación */}
              {receta.preparacion_es && receta.preparacion_es.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                    Preparación
                  </h3>
                  <ol className="space-y-3">
                    {receta?.preparacion_es?.map((paso, i) => (
                      <li key={i} className="flex items-start gap-3 bg-[var(--background)] rounded-lg p-3 border border-aubergine-dark/5">
                        <span className="shrink-0 w-7 h-7 rounded-lg bg-aubergine-dark text-cream text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <p className="text-aubergine-dark/70 font-light text-sm leading-relaxed pt-0.5">{paso}</p>
                      </li>
                    ))}
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

        {/* ── Upsell Block ───────────────────────────────────── */}
        <UpsellBlock />

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
