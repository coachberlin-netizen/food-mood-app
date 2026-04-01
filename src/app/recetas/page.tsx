"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ── Mood config ─────────────────────────────────────────────── */
const MOODS = [
  { id: "activacion",  label: "Activación & Energía",      emoji: "⚡", color: "#D97706", bg: "rgba(217,119,6,0.12)"  },
  { id: "calma",       label: "Calma & Equilibrio",        emoji: "🌿", color: "#6B8E6B", bg: "rgba(107,142,107,0.12)" },
  { id: "focus",       label: "Focus & Claridad Mental",   emoji: "🧠", color: "#0D9488", bg: "rgba(13,148,136,0.12)"  },
  { id: "social",      label: "Social & Placer Compartido", emoji: "🥂", color: "#BE185D", bg: "rgba(190,24,93,0.12)"  },
  { id: "reset",       label: "Reset & Ligereza",          emoji: "🍋", color: "#65A30D", bg: "rgba(101,163,13,0.12)"  },
  { id: "confort",     label: "Confort & Calidez",         emoji: "🫶", color: "#C2714F", bg: "rgba(194,113,79,0.12)"  },
] as const;

const EDADES = ["18-30", "31-44", "45-60", "60+"] as const;

/* ── Types ───────────────────────────────────────────────────── */
interface Receta {
  id: string;
  sexo: string;
  grupo_edad: string;
  nombre_es: string;
  nombre_en: string;
  mood_es: string;
  capitulo: number;
  ingredientes_es: string[];
  preparacion_es: string[];
  nota_food_mood_es: string;
  variantes_es: string[];
  tags: string[];
  tiempo_preparacion_min: number;
  dificultad: string;
  temporada: string;
  tipo_plato: string;
}

interface ApiResponse {
  recetas: Receta[];
  total: number;
  page: number;
  totalPages: number;
}

/* ── Skeleton Card ───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-cream rounded-2xl border border-aubergine-dark/10 p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-24 bg-aubergine-dark/10 rounded-full" />
        <div className="h-5 w-16 bg-aubergine-dark/10 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-aubergine-dark/10 rounded mb-3" />
      <div className="h-4 w-1/2 bg-aubergine-dark/10 rounded mb-6" />
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-aubergine-dark/5 rounded-lg" />
        <div className="h-7 w-16 bg-aubergine-dark/5 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Recipe Card ─────────────────────────────────────────────── */
function RecipeCard({ receta }: { receta: Receta }) {
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS[0];

  return (
    <Link href={`/recetas/${receta.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(63,26,34,0.08)" }}
        transition={{ duration: 0.2 }}
        className="bg-cream rounded-2xl border border-aubergine-dark/10 p-6 md:p-7 cursor-pointer transition-all duration-200 h-full flex flex-col group"
      >
        {/* Mood badge + Tiempo */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ color: mood.color, backgroundColor: mood.bg }}
          >
            {mood.emoji} {mood.id}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-aubergine-dark/50 font-medium">
            <Clock className="w-3 h-3" />
            {receta.tiempo_preparacion_min} min
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-serif font-bold text-aubergine-dark leading-snug mb-2 group-hover:text-aubergine transition-colors line-clamp-2">
          {receta.nombre_es}
        </h3>

        {/* Tipo plato + Dificultad */}
        <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-sans font-medium text-aubergine-dark/50 bg-aubergine-dark/5 px-2.5 py-1 rounded-lg border border-aubergine-dark/10 capitalize">
            {receta.tipo_plato}
          </span>
          <span className="text-[10px] font-sans font-medium text-aubergine-dark/40 bg-aubergine-dark/[0.03] px-2.5 py-1 rounded-lg capitalize">
            {receta.dificultad}
          </span>
          {receta.temporada && receta.temporada !== "todo el año" && (
            <span className="text-[10px] font-sans text-aubergine-dark/40 px-2.5 py-1 rounded-lg capitalize">
              {receta.temporada}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

/* ── Main Content ────────────────────────────────────────────── */
function RecetasContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── State from URL ──────────────────────────────────────────
  const [sexo, setSexo] = useState<string>(searchParams.get("sexo") || "");
  const [edad, setEdad] = useState<string>(searchParams.get("edad") || "");
  const [mood, setMood] = useState<string>(searchParams.get("mood") || "");
  const [tiempo, setTiempo] = useState<number>(parseInt(searchParams.get("tiempo") || "40", 10));
  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [page, setPage] = useState<number>(parseInt(searchParams.get("page") || "1", 10));

  // ── Data state ──────────────────────────────────────────────
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const LIMIT = 24;

  // ── Sync filters → URL ─────────────────────────────────────
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (sexo) params.set("sexo", sexo);
    if (edad) params.set("edad", edad);
    if (mood) params.set("mood", mood);
    if (tiempo < 40) params.set("tiempo", String(tiempo));
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [sexo, edad, mood, tiempo, q, page, pathname, router]);

  // ── Fetch recetas from API ─────────────────────────────────
  const fetchRecetas = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sexo) params.set("sexo", sexo);
      if (edad) params.set("edad", edad);
      if (mood) {
        const moodObj = MOODS.find(m => m.id === mood);
        if (moodObj) params.set("mood", moodObj.label);
      }
      if (tiempo < 40) params.set("tiempo", String(tiempo));
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("limit", String(LIMIT));

      const res = await fetch(`/api/recetas?${params.toString()}`);
      const data: ApiResponse = await res.json();

      setRecetas(data.recetas || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching recetas:", err);
      setRecetas([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [sexo, edad, mood, tiempo, q, page]);

  useEffect(() => { fetchRecetas(); }, [fetchRecetas]);
  useEffect(() => { updateURL(); }, [updateURL]);

  // ── Handlers ───────────────────────────────────────────────
  const resetFilters = () => {
    setSexo(""); setEdad(""); setMood(""); setTiempo(40); setQ(""); setPage(1);
  };

  const toggleSexo = (val: string) => {
    setSexo(prev => prev === val ? "" : val);
    setPage(1);
  };

  const toggleEdad = (val: string) => {
    setEdad(prev => prev === val ? "" : val);
    setPage(1);
  };

  const toggleMood = (val: string) => {
    setMood(prev => prev === val ? "" : val);
    setPage(1);
  };

  const hasFilters = sexo || edad || mood || tiempo < 40 || q;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Hero header ────────────────────────────────────── */}
      <section className="px-6 pt-12 pb-6 md:pt-20 md:pb-8 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark mb-4 leading-[1.15]">
              Recetas con superpoderes
            </h1>
            <p className="text-lg md:text-xl text-aubergine-dark/60 font-light max-w-2xl">
              10.000 combinaciones diseñadas para lo que sientes. Filtra, explora, disfruta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky filters ─────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-[var(--background)]/95 backdrop-blur-lg border-b border-aubergine-dark/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col gap-4">
          {/* Row 1: Sexo + Edad + Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sexo toggle */}
            <div className="flex rounded-xl overflow-hidden border border-aubergine-dark/15">
              {(["mujer", "hombre"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => toggleSexo(s)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-200 ${
                    sexo === s
                      ? "bg-aubergine-dark text-cream"
                      : "bg-cream text-aubergine-dark/60 hover:bg-aubergine-dark/5"
                  }`}
                >
                  {s === "mujer" ? "Mujer" : "Hombre"}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-aubergine-dark/10 hidden md:block" />

            {/* Edad chips */}
            <div className="flex gap-1.5">
              {EDADES.map(e => (
                <button
                  key={e}
                  onClick={() => toggleEdad(e)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    edad === e
                      ? "bg-aubergine-dark text-cream border-aubergine-dark"
                      : "bg-cream text-aubergine-dark/60 border-aubergine-dark/15 hover:border-aubergine-dark/30"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-aubergine-dark/10 hidden md:block" />

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aubergine-dark/30" />
              <input
                type="text"
                placeholder="Buscar por nombre o tipo de plato..."
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream border border-aubergine-dark/15 text-sm font-light text-aubergine-dark placeholder:text-aubergine-dark/35 focus:outline-none focus:border-[#C9A84C]/50 focus:shadow-luxury transition-all"
              />
              {q && (
                <button
                  onClick={() => { setQ(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-aubergine-dark/30 hover:text-aubergine-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Moods */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => toggleMood(m.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  mood === m.id
                    ? "text-white shadow-sm"
                    : "bg-cream text-aubergine-dark/70 border-aubergine-dark/10 hover:border-aubergine-dark/25"
                }`}
                style={mood === m.id ? { backgroundColor: m.color, borderColor: m.color } : {}}
              >
                <span className="text-sm">{m.emoji}</span>
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden capitalize">{m.id}</span>
              </button>
            ))}
          </div>

          {/* Row 3: Tiempo slider + Counter + Clear */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 shrink-0">
              <Clock className="w-3.5 h-3.5 text-aubergine-dark/40" />
              <span className="text-[11px] text-aubergine-dark/50 font-medium uppercase tracking-wider whitespace-nowrap">
                Máx {tiempo} min
              </span>
              <input
                type="range"
                min={5}
                max={40}
                value={tiempo}
                onChange={e => { setTiempo(parseInt(e.target.value, 10)); setPage(1); }}
                className="w-28 h-1 accent-[#C9A84C] cursor-pointer"
              />
            </div>

            <div className="h-4 w-px bg-aubergine-dark/10" />

            {/* Counter */}
            <span className="text-xs text-aubergine-dark/50 font-medium">
              {isLoading ? (
                <span className="animate-pulse">Buscando...</span>
              ) : (
                <>{total.toLocaleString()} receta{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}</>
              )}
            </span>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-aubergine-dark/40 hover:text-aubergine-dark transition-colors uppercase tracking-widest"
              >
                <X className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Recipe Grid ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-10">
        {isLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recetas.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-aubergine-dark/5 flex items-center justify-center text-4xl mb-6">
              🍽
            </div>
            <h2 className="text-2xl font-serif text-aubergine-dark mb-3">
              Sin resultados
            </h2>
            <p className="text-aubergine-dark/50 font-light max-w-md mb-8">
              No encontramos recetas con estos filtros. Prueba a cambiar algún criterio o limpia los filtros.
            </p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          /* Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {recetas.map((receta) => (
                  <RecipeCard key={receta.id} receta={receta} />
                ))}
              </AnimatePresence>
            </div>

            {/* ── Pagination ─────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2.5 rounded-xl border border-aubergine-dark/10 bg-cream text-aubergine-dark/60 hover:bg-aubergine-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {(() => {
                  const pages: number[] = [];
                  const start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, page + 2);
                  for (let i = start; i <= end; i++) pages.push(i);
                  return pages.map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                        p === page
                          ? "bg-aubergine-dark text-cream shadow-luxury"
                          : "bg-cream border border-aubergine-dark/10 text-aubergine-dark/60 hover:bg-aubergine-dark/5"
                      }`}
                    >
                      {p}
                    </button>
                  ));
                })()}

                {page + 2 < totalPages && (
                  <span className="text-aubergine-dark/30 px-1">…</span>
                )}

                {page + 2 < totalPages && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-10 h-10 rounded-xl text-sm font-medium bg-cream border border-aubergine-dark/10 text-aubergine-dark/60 hover:bg-aubergine-dark/5 transition-colors"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2.5 rounded-xl border border-aubergine-dark/10 bg-cream text-aubergine-dark/60 hover:bg-aubergine-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* ── Page export (with Suspense for useSearchParams) ──────────── */
export default function RecetasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-aubergine-dark/10 border-t-[#C9A84C] animate-spin" />
        </div>
      }
    >
      <RecetasContent />
    </Suspense>
  );
}
