"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Clock, Share2, ChevronDown, ChevronUp,
  Beaker, Droplets, Leaf, Check
} from "lucide-react";

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
  const normalizedMood = moodEs?.toLowerCase() || "";
  const key = Object.keys(MOODS).find(k => normalizedMood.includes(k));
  return key ? { id: key, ...MOODS[key] } : { id: "activacion", ...MOODS.activacion };
}

/* ── UUID Helper ────────────────────────────────────────────── */
function isValidUUID(str: string): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/* ── Types ───────────────────────────────────────────────────── */
interface Receta {
  id: string;
  sexo: string;
  grupo_edad: string;
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
}

interface RelatedReceta {
  id: string;
  nombre_es: string;
  mood_es: string;
  tiempo_preparacion_min: number;
  tipo_plato: string;
  dificultad: string;
  temporada: string;
}

/* ── Skeleton ────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 md:px-12 lg:px-24 animate-pulse">
      <div className="max-w-3xl mx-auto">
        <div className="h-5 w-28 bg-aubergine-dark/10 rounded mb-10" />
        <div className="h-10 w-3/4 bg-aubergine-dark/10 rounded mb-4" />
        <div className="h-6 w-48 bg-aubergine-dark/10 rounded mb-8" />
        <div className="h-24 bg-aubergine-dark/5 rounded-2xl mb-10" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-aubergine-dark/5 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
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

import { createRecetasClient } from "@/lib/supabase/recetas";

/* ── Main Page ───────────────────────────────────────────────── */
export default function RecetaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id as string;
  const isUUID = isValidUUID(rawId);

  const [receta, setReceta] = useState<Receta | null>(null);
  const [relacionadas, setRelacionadas] = useState<RelatedReceta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showCiencia, setShowCiencia] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Fetch recipe directly from Supabase
  useEffect(() => {
    async function load() {
      if (!rawId) {
        console.error("No recipe ID provided");
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setNotFound(false);
      
      try {
        const supabase = createRecetasClient();
        let recetaData: Receta | null = null;
        let fetchError: any = null;

        /* ── UUID vs Slug/Name lookup logic ─────────────────── */
        if (isUUID) {
          const result = await supabase
            .from('recetas')
            .select('*')
            .eq('id', rawId)
            .single();
          
          recetaData = result.data as Receta | null;
          fetchError = result.error;
        } else {
          // Optimized name search (skip 'slug' column which fails 400)
          const possibleName = rawId.replace(/-/g, ' ');
          // We use only the first 2 words to be more flexible with punctuation
          const searchName = possibleName.split(' ').slice(0, 2).join(' '); 
          
          const { data: fallbackList, error: fallbackError } = await supabase
            .from('recetas')
            .select('*')
            .ilike('nombre_es', `%${searchName}%`)
            .limit(1);

          if (fallbackError) {
            fetchError = fallbackError;
          } else if (fallbackList && fallbackList.length > 0) {
            recetaData = fallbackList[0] as Receta;
          }
        }

        if (!recetaData) {
          console.log("Recipe not found, redirecting to /recetas");
          router.push('/recetas');
          return;
        }
        setReceta(recetaData);

        // Fetch related recipes
        const { data: related } = await supabase
          .from('recetas')
          .select('id, nombre_es, mood_es, tiempo_preparacion_min, tipo_plato, dificultad, temporada')
          .eq('mood_es', recetaData.mood_es)
          .neq('id', recetaData.id)
          .limit(3);
        setRelacionadas(related || []);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [rawId, isUUID, router]);

  // Share
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
      const t = document.createElement("textarea");
      t.value = url; document.body.appendChild(t); t.select();
      document.execCommand("copy"); document.body.removeChild(t);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  }, []);

  // Back with filters
  const goBack = () => {
    if (typeof window !== "undefined" && document.referrer.includes("/recetas")) {
      router.back();
    } else {
      router.push("/recetas");
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (notFound || !receta) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🍽</div>
          <h1 className="text-2xl font-serif text-aubergine-dark mb-2">Receta no encontrada</h1>
          <p className="text-aubergine-dark/50 font-light mb-6">La receta que buscas no existe o ha sido eliminada.</p>
          <Link href="/recetas" className="px-8 py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors">
            Explorar recetas
          </Link>
        </div>
      </div>
    );
  }

  const mood = getMood(receta.mood_es);

  return (
    <>
      <Toast show={showToast} message="¡Enlace copiado!" />

      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 md:px-12">

          {/* ── Top bar ──────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={goBack}
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

          {/* ── Mood badge + meta ────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
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

          {/* ── Title ────────────────────────────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif font-bold text-aubergine-dark leading-[1.15] mb-3"
          >
            {receta.nombre_es}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-aubergine-dark/40 font-light mb-10 capitalize"
          >
            {receta.tipo_plato} · {receta.sexo}, {receta.grupo_edad}
          </motion.p>

          {/* ── Base ácida (hero ingredient) ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-br from-[#C9A84C]/10 via-cream to-[#C9A84C]/5 rounded-2xl p-6 md:p-8 mb-10 border border-[#C9A84C]/20 overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-15">
              <Droplets className="w-16 h-16 text-[#C9A84C]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2 block">
              Ingrediente firma
            </span>
            <p className="text-lg md:text-xl font-serif text-aubergine-dark font-semibold leading-snug">
              {receta.base_acida}
            </p>
          </motion.div>

          {/* ── Ingredientes ─────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-10"
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-5 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" />
              Ingredientes
            </h2>
            <ol className="space-y-2.5">
              {receta?.ingredientes_es?.map((ingRaw, i) => {
                const ing = typeof ingRaw === 'string' ? ingRaw : (ingRaw as any).ingrediente || (ingRaw as any).nombre || JSON.stringify(ingRaw);
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-aubergine-dark/5 text-aubergine-dark/40 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-aubergine-dark/80 font-light text-[15px] leading-relaxed">{ing}</span>
                  </li>
                );
              })}
            </ol>
          </motion.section>

          {/* ── Preparación ───────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-5">
              Preparación
            </h2>
            <ol className="space-y-4">
              {receta?.preparacion_es?.map((pasoRaw, i) => {
                const paso = typeof pasoRaw === 'string' ? pasoRaw : (pasoRaw as any).paso || (pasoRaw as any).texto || JSON.stringify(pasoRaw);
                return (
                  <li key={i} className="flex items-start gap-4 bg-cream rounded-xl p-4 border border-aubergine-dark/5">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-aubergine-dark text-cream text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-aubergine-dark/75 font-light text-[15px] leading-relaxed pt-1">{paso}</p>
                  </li>
                );
              })}
            </ol>
          </motion.section>

          {/* ── Nota Food·Mood (corazón científico) ────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <div className="bg-gradient-to-br from-aubergine-dark to-aubergine rounded-2xl p-7 md:p-9 text-cream/90 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A84C]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cream/5 rounded-full blur-3xl" />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4 block">
                  🧬 Nota Food·Mood
                </span>
                <p className="text-[15px] md:text-base font-light leading-[1.85] text-cream/85">
                  {receta.nota_food_mood_es}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Variantes ─────────────────────────────────────── */}
          {receta.variantes_es && receta.variantes_es.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                Variantes
              </h2>
              <div className="flex flex-wrap gap-2">
                {receta.variantes_es.map((v, i) => (
                  <span
                    key={i}
                    className="text-[12px] font-light text-aubergine-dark/65 bg-cream border border-aubergine-dark/10 px-3.5 py-2 rounded-xl leading-snug"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── Ciencia (collapsible QR) ──────────────────────── */}
          {receta.qr_es && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-12"
            >
              <button
                onClick={() => setShowCiencia(!showCiencia)}
                className="w-full flex items-center justify-between py-4 px-5 rounded-xl bg-cream border border-aubergine-dark/10 hover:border-aubergine-dark/20 transition-all text-left group"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-aubergine-dark/70 group-hover:text-aubergine-dark transition-colors">
                  <Beaker className="w-4 h-4 text-[#C9A84C]" />
                  🔬 Ciencia
                </span>
                {showCiencia ? (
                  <ChevronUp className="w-4 h-4 text-aubergine-dark/40" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-aubergine-dark/40" />
                )}
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
                      <p className="text-[14px] text-aubergine-dark/60 font-light leading-[1.8]">
                        {receta.qr_es}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* ── Tags ──────────────────────────────────────────── */}
          {receta.tags && receta.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-1.5 mb-14"
            >
              {receta.tags.map((tag, i) => (
                <span key={i} className="text-[10px] text-aubergine-dark/30 bg-aubergine-dark/[0.03] px-2 py-1 rounded-md border border-aubergine-dark/5">
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* ── Recetas relacionadas ──────────────────────────── */}
          {relacionadas.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-5">
                Recetas relacionadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relacionadas.map((r) => {
                  const rMood = getMood(r.mood_es);
                  return (
                    <Link key={r.id} href={`/recetas/${r.id}`}>
                      <div className="bg-cream rounded-xl border border-aubergine-dark/10 p-5 hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col">
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
