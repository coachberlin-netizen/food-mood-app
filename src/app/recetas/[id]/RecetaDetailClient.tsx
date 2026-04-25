"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Clock, Share2, ChevronDown, ChevronUp,
  Beaker, Droplets, Leaf, Check, Lock
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Mood config ─────────────────────────────────────────────── */
const MOODS: Record<string, { emoji: string; color: string; bg: string }> = {
  activacion:  { emoji: "⚡", color: "#D97706", bg: "rgba(217,119,6,0.10)" },
  calma:       { emoji: "🌿", color: "#6B8E6B", bg: "rgba(107,142,107,0.10)" },
  focus:       { emoji: "🧠", color: "#0D9488", bg: "rgba(13,148,136,0.10)" },
  social:      { emoji: "🥂", color: "#BE185D", bg: "rgba(190,24,93,0.10)" },
  reset:       { emoji: "🍋", color: "#65A30D", bg: "rgba(101,163,13,0.10)" },
  confort:     { emoji: "🫶", color: "#C2714F", bg: "rgba(194,113,79,0.10)" },
};

function getMood(moodEs: string) {
  const key = Object.keys(MOODS).find(k => moodEs?.toLowerCase().includes(k));
  return key ? { id: key, ...MOODS[key] } : { id: "activacion", ...MOODS.activacion };
}

/* ── Types ───────────────────────────────────────────────────── */
export interface Receta {
  id: string;
  nombre_es: string;
  nombre_en: string;
  mood_es: string;
  mood_en: string;
  capitulo: number;
  contexto_es: string;
  base_acida: string;
  ingredientes_es: string[];
  preparacion_es: string[];
  nota_food_mood_es: string;
  variantes_es: string[];
  qr_es: string;
  tags: string[];
  tiempo_preparacion_min: number;
  dificultad: string;
  temporada: string;
  tipo_plato: string;
  ingrediente_firma?: string;
}

export interface RelatedReceta {
  id: string;
  nombre_es: string;
  mood_es: string;
  tiempo_preparacion_min: number;
  tipo_plato: string;
  dificultad: string;
  temporada: string;
}

/* ── Toast ───────────────────────────────────────────────────── */
function Toast({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-aubergine-dark text-cream px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
        >
          <Check className="w-4 h-4 text-[#C9A84C]" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Paywall overlay ─────────────────────────────────────────── */
function PreparacionPaywall() {
  return (
    <div className="relative">
      {/* Blurred preview of dummy steps */}
      <div className="space-y-4 select-none pointer-events-none" aria-hidden="true">
        {[2, 3, 4].map(i => (
          <div key={i} className="flex items-start gap-4 bg-cream rounded-xl p-4 border border-aubergine-dark/5 blur-sm opacity-60">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-aubergine-dark text-cream text-xs font-bold flex items-center justify-center">
              {i}
            </span>
            <div className="flex-1 pt-1 space-y-2">
              <div className="h-3 bg-aubergine-dark/15 rounded w-full" />
              <div className="h-3 bg-aubergine-dark/10 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="bg-[#F5F0E8]/95 backdrop-blur-sm rounded-2xl p-7 shadow-xl border border-[#6B2737]/10 max-w-xs w-full">
          <div className="w-10 h-10 rounded-full bg-[#6B2737]/8 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-[#6B2737]/60" />
          </div>
          <p className="font-serif text-base text-[#2d0f16] leading-snug mb-1">
            Pasos de preparación
          </p>
          <p className="text-xs text-[#6B2737]/50 font-light mb-4 leading-relaxed">
            Accede a todos los pasos, 200+ recetas, canal de Telegram y comunidad WhatsApp.
          </p>
          <Link
            href="/pricing"
            className="block w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all hover:opacity-90"
            style={{ backgroundColor: "#6B2737" }}
          >
            Ver planes — desde 7€/mes
          </Link>
          <Link
            href="/test"
            className="block mt-2.5 text-xs text-[#6B2737]/40 hover:text-[#6B2737]/65 transition-colors"
          >
            Primero haz el test gratuito →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main client component ───────────────────────────────────── */
export default function RecetaDetailClient({
  receta,
  relacionadas,
  isPremium,
}: {
  receta: Receta;
  relacionadas: RelatedReceta[];
  isPremium: boolean;
}) {
  const router = useRouter();
  const [showCiencia, setShowCiencia] = useState(false);
  const [showToast,   setShowToast]   = useState(false);
  const [glossaryTerms, setGlossaryTerms] = useState<{ name: string; slug: string }[]>([]);

  // Glossary linkification (client-only enhancement)
  useEffect(() => {
    const supabase = createClient();
    supabase.from("glossary").select("name, slug").then(({ data }) => {
      if (data) setGlossaryTerms(data);
    });
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url; document.body.appendChild(t); t.select();
      document.execCommand("copy"); document.body.removeChild(t);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  }, []);

  const Linkify = ({ text }: { text: string }) => {
    if (!glossaryTerms.length || !text) return <>{text}</>;
    const sorted = [...glossaryTerms].sort((a, b) => b.name.length - a.name.length);
    const escaped = sorted.map(t => t.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => {
          const term = sorted.find(t => t.name.toLowerCase() === part.toLowerCase());
          return term
            ? <Link key={i} href={`/glosario/${term.slug}`} className="text-[#C9A84C] hover:underline font-medium">{part}</Link>
            : part;
        })}
      </>
    );
  };

  const mood = getMood(receta.mood_es);

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay },
  });

  return (
    <>
      <Toast show={showToast} message="¡Enlace copiado!" />

      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 md:px-12">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-aubergine-dark/50 hover:text-aubergine-dark transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-sm text-aubergine-dark/50 hover:text-aubergine-dark transition-colors font-medium px-4 py-2 rounded-xl border border-aubergine-dark/10 hover:border-aubergine-dark/25"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>

          {/* Mood badge + meta */}
          <motion.div {...anim(0.05)}>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ color: mood.color, backgroundColor: mood.bg }}
              >
                {mood.emoji} {receta.mood_es}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-aubergine-dark/45 font-medium">
                <Clock className="w-3 h-3" />
                {receta.tiempo_preparacion_min} min
              </span>
              <span className="text-[11px] text-aubergine-dark/35 capitalize">{receta.dificultad}</span>
              <span className="text-[11px] text-aubergine-dark/35 capitalize">{receta.temporada}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 {...anim(0.1)} className="text-3xl md:text-5xl font-serif font-bold text-aubergine-dark leading-[1.15] mb-3">
            {receta.nombre_es}
          </motion.h1>
          <motion.p {...anim(0.15)} className="text-sm text-aubergine-dark/40 font-light mb-8 capitalize">
            {receta.tipo_plato}
          </motion.p>

          {/* Contexto */}
          {receta.contexto_es && (
            <motion.p {...anim(0.18)} className="text-base text-aubergine-dark/65 font-light leading-relaxed mb-10 italic">
              {receta.contexto_es}
            </motion.p>
          )}

          {/* Ingrediente firma */}
          {(receta.ingrediente_firma || receta.base_acida) && (
            <motion.div {...anim(0.2)} className="relative bg-gradient-to-br from-[#C9A84C]/10 via-cream to-[#C9A84C]/5 rounded-2xl p-6 md:p-8 mb-10 border border-[#C9A84C]/20 overflow-hidden">
              <div className="absolute top-4 right-4 opacity-15">
                <Droplets className="w-16 h-16 text-[#C9A84C]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2 block">
                Ingrediente firma
              </span>
              <p className="text-lg md:text-xl font-serif text-aubergine-dark font-semibold leading-snug">
                {receta.ingrediente_firma || receta.base_acida}
              </p>
            </motion.div>
          )}

          {/* Ingredientes — siempre visible */}
          <motion.section {...anim(0.25)} className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-5 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" />
              Ingredientes
            </h2>
            <ol className="space-y-2.5">
              {receta.ingredientes_es?.map((ingRaw, i) => {
                const ing = typeof ingRaw === "string" ? ingRaw : (ingRaw as any).ingrediente || JSON.stringify(ingRaw);
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-aubergine-dark/5 text-aubergine-dark/40 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-aubergine-dark/80 font-light text-[15px] leading-relaxed">
                      <Linkify text={ing} />
                    </span>
                  </li>
                );
              })}
            </ol>
          </motion.section>

          {/* Mecanismo / Nota Food·Mood — siempre visible */}
          <motion.section {...anim(0.28)} className="mb-10">
            <div className="bg-gradient-to-br from-aubergine-dark to-aubergine rounded-2xl p-7 md:p-9 text-cream/90 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A84C]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cream/5 rounded-full blur-3xl" />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4 block">
                  Por qué funciona
                </span>
                <p className="text-[15px] md:text-base font-light leading-[1.85] text-cream/85">
                  <Linkify text={receta.nota_food_mood_es} />
                </p>
              </div>
            </div>
          </motion.section>

          {/* Preparación — paywall para no-premium */}
          <motion.section {...anim(0.32)} className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-5">
              Preparación
            </h2>

            {/* Primer paso — siempre visible */}
            {receta.preparacion_es?.[0] && (
              <div className="flex items-start gap-4 bg-cream rounded-xl p-4 border border-aubergine-dark/5 mb-4">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-aubergine-dark text-cream text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <p className="text-aubergine-dark/75 font-light text-[15px] leading-relaxed pt-1">
                  {typeof receta.preparacion_es[0] === "string"
                    ? receta.preparacion_es[0]
                    : (receta.preparacion_es[0] as any).paso || JSON.stringify(receta.preparacion_es[0])}
                </p>
              </div>
            )}

            {isPremium ? (
              /* Premium: todos los pasos */
              <ol className="space-y-4">
                {receta.preparacion_es?.slice(1).map((pasoRaw, i) => {
                  const paso = typeof pasoRaw === "string" ? pasoRaw : (pasoRaw as any).paso || JSON.stringify(pasoRaw);
                  return (
                    <li key={i} className="flex items-start gap-4 bg-cream rounded-xl p-4 border border-aubergine-dark/5">
                      <span className="shrink-0 w-8 h-8 rounded-lg bg-aubergine-dark text-cream text-xs font-bold flex items-center justify-center">
                        {i + 2}
                      </span>
                      <p className="text-aubergine-dark/75 font-light text-[15px] leading-relaxed pt-1">{paso}</p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <PreparacionPaywall />
            )}
          </motion.section>

          {/* Variantes */}
          {receta.variantes_es?.length > 0 && (
            <motion.section {...anim(0.38)} className="mb-10">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                Variantes
              </h2>
              <div className="flex flex-wrap gap-2">
                {receta.variantes_es.map((v, i) => (
                  <span key={i} className="text-[12px] font-light text-aubergine-dark/65 bg-cream border border-aubergine-dark/10 px-3.5 py-2 rounded-xl leading-snug">
                    {v}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Ciencia (collapsible) */}
          {receta.qr_es && (
            <motion.section {...anim(0.42)} className="mb-12">
              <button
                onClick={() => setShowCiencia(!showCiencia)}
                className="w-full flex items-center justify-between py-4 px-5 rounded-xl bg-cream border border-aubergine-dark/10 hover:border-aubergine-dark/20 transition-all text-left group"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-aubergine-dark/70 group-hover:text-aubergine-dark transition-colors">
                  <Beaker className="w-4 h-4 text-[#C9A84C]" />
                  🔬 Ciencia
                </span>
                {showCiencia ? <ChevronUp className="w-4 h-4 text-aubergine-dark/40" /> : <ChevronDown className="w-4 h-4 text-aubergine-dark/40" />}
              </button>
              <AnimatePresence>
                {showCiencia && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 px-5 pb-5 bg-cream/50 rounded-b-xl border-x border-b border-aubergine-dark/10">
                      <p className="text-[14px] text-aubergine-dark/60 font-light leading-[1.8]">{receta.qr_es}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* Tags */}
          {receta.tags?.length > 0 && (
            <motion.div {...anim(0.46)} className="flex flex-wrap gap-1.5 mb-14">
              {receta.tags.map((tag, i) => (
                <span key={i} className="text-[10px] text-aubergine-dark/30 bg-aubergine-dark/[0.03] px-2 py-1 rounded-md border border-aubergine-dark/5">
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Recetas relacionadas */}
          {relacionadas.length > 0 && (
            <motion.section {...anim(0.5)}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-5">
                Recetas relacionadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relacionadas.map(r => {
                  const rMood = getMood(r.mood_es);
                  return (
                    <Link key={r.id} href={`/recetas/${r.id}`}>
                      <div className="bg-cream rounded-xl border border-aubergine-dark/10 p-5 hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full self-start mb-3"
                          style={{ color: rMood.color, backgroundColor: rMood.bg }}
                        >
                          {rMood.emoji} {rMood.id}
                        </span>
                        <h3 className="text-sm font-serif font-semibold text-aubergine-dark leading-snug mb-auto line-clamp-2">
                          {r.nombre_es}
                        </h3>
                        <div className="flex items-center gap-2 mt-3 text-[10px] text-aubergine-dark/40">
                          <Clock className="w-3 h-3" />
                          {r.tiempo_preparacion_min} min
                          <span className="capitalize">· {r.tipo_plato}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          )}

        </div>
      </div>
    </>
  );
}
