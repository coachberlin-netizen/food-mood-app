"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Clock, ChevronLeft, ChevronRight, Lock, Sparkles, Star, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { moods as MOODS } from "@/data/moods";
import { PaywallModal } from "@/components/recetas/PaywallModal";

/* ── Chef → anonymous style map ── */
const CHEF_STYLE: Record<string, string> = {
  "Ferran Adrià":          "Estilo mediterráneo · técnica esferificación",
  "René Redzepi":          "Estilo nórdico · técnica fermentación",
  "Massimo Bottura":       "Estilo italiano · técnica deconstrucción",
  "Nobu Matsuhisa":        "Estilo japonés-peruano · técnica fusión",
  "Heston Blumenthal":     "Estilo británico · técnica cocina molecular",
  "Joan Roca":             "Estilo catalán · técnica destilación",
  "Andoni Aduriz":         "Estilo vasco · técnica biotecnología",
  "Alain Ducasse":         "Estilo francés · técnica alta cocina",
  "Joël Robuchon":         "Estilo francés clásico · técnica purés",
  "Anne-Sophie Pic":       "Estilo francés · técnica infusiones",
  "Yoshihiro Narisawa":    "Estilo japonés · técnica bosque-mar",
  "Virgilio Martínez":     "Estilo peruano · técnica altitudes",
  "Ana Ros":               "Estilo esloveno · técnica foraging",
  "Clare Smyth":           "Estilo británico · técnica producto local",
  "Dominique Crenn":       "Estilo franco-californiano · técnica poética",
  "Albert Adrià":          "Estilo mediterráneo · técnica pastelería",
  "Quique Dacosta":        "Estilo mediterráneo · técnica vanguardia",
  "Elena Arzak":           "Estilo vasco · técnica innovación",
  "Diego Guerrero":        "Estilo español · técnica vegetales",
  "Dabiz Muñoz":           "Estilo español · técnica street-haute",
};

const RECIPE_SCOPES = [
  { label: "Todos", premiumLevel: "" },
  { label: "Tradición + Función", premiumLevel: "2" },
] as const;

interface Receta {
  id: string;
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
  chef_inspiracion?: string;
  premium_level?: number;
  segmento?: string;
  moodId?: string;
}

interface ApiResponse {
  recetas: Receta[];
  total: number;
  page: number;
  totalPages: number;
}

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

function RecipeCard({ receta, locked = false, isFree = false, onLockedClick }: { receta: Receta; locked?: boolean; isFree?: boolean; onLockedClick?: () => void }) {
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS.find(m => m.id === receta.moodId) || MOODS[0];

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -4, scale: locked ? 1.01 : 1, boxShadow: "0 8px 24px rgba(63,26,34,0.08)" }}
      transition={{ duration: 0.2 }}
      className={`relative bg-cream rounded-2xl border border-aubergine-dark/10 p-6 md:p-7 transition-all duration-200 h-full flex flex-col group overflow-hidden ${
        'cursor-pointer'
      }`}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] z-20"
        style={{ backgroundColor: mood.color }}
      />

      <div className="flex items-center justify-between mb-4 mt-1">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
          style={{ color: mood.color, backgroundColor: mood.colorLight }}
        >
          {mood.emoji} {mood.id}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-aubergine-dark/50 font-medium">
          <Clock className="w-3 h-3" />
          {receta.tiempo_preparacion_min} min
        </span>
      </div>

      <h3 className="text-lg font-serif font-bold text-aubergine-dark leading-snug mb-2 group-hover:text-aubergine transition-colors line-clamp-2">
        {receta.nombre_es}
      </h3>

      <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
        {isFree && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2.5 py-1 rounded-lg">
            Gratis
          </span>
        )}
        <span className="text-[10px] font-sans font-medium text-aubergine-dark/50 bg-aubergine-dark/5 px-2.5 py-1 rounded-lg border border-aubergine-dark/10 capitalize">
          {receta.tipo_plato}
        </span>
        <span className="text-[10px] font-sans font-medium text-aubergine-dark/40 bg-aubergine-dark/[0.03] px-2.5 py-1 rounded-lg capitalize">
          {receta.dificultad}
        </span>
      </div>

      {locked && (
        <div
          className="absolute inset-x-0 bottom-0 top-1/4 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none"
        >
          <div className="flex flex-col items-center pointer-events-auto">
            <Lock className="w-5 h-5 text-[#C9A84C]/60 mb-2" />
            <span className="text-[10px] text-aubergine-dark/60 font-semibold uppercase tracking-wider mb-2">Contenido Premium</span>
            <button
              onClick={e => { e.preventDefault(); onLockedClick?.(); }}
              className="px-4 py-2 bg-[#C9A84C] text-white text-[11px] font-bold rounded-lg shadow-sm hover:bg-[#b8953e] hover:scale-105 transition-all"
            >
              Desbloquear — desde 7€/mes
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (locked) return <button className="text-left w-full h-full" onClick={onLockedClick}>{card}</button>;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

function ExclusivaCard({ receta, locked = false, isFree = false, onLockedClick }: { receta: Receta; locked?: boolean; isFree?: boolean; onLockedClick?: () => void }) {
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS.find(m => m.id === receta.moodId) || MOODS[0];

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: locked ? 1.01 : 1, boxShadow: "0 12px 32px rgba(201,168,76,0.15)" }}
      transition={{ duration: 0.25 }}
      className={`relative bg-gradient-to-br from-[#1a1118] to-[#2a1825] rounded-2xl border border-[#C9A84C]/20 p-6 md:p-7 h-full flex flex-col group overflow-hidden ${
        'cursor-pointer'
      }`}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] z-20"
        style={{ backgroundColor: mood.color }}
      />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl" />
      <div className="flex items-center justify-between mb-4 relative mt-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20">
          <Star className="w-3 h-3" /> Exclusiva
        </span>
        <span className="flex items-center gap-1 text-[11px] text-cream/40 font-medium">
          <Clock className="w-3 h-3" />
          {receta.tiempo_preparacion_min} min
        </span>
      </div>
      <h3 className="text-lg font-serif font-bold text-cream/90 leading-snug mb-1.5 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
        {receta.nombre_es}
      </h3>
      {receta.chef_inspiracion && CHEF_STYLE[receta.chef_inspiracion] && (
        <p className="flex items-center gap-1.5 text-[11px] text-[#C9A84C]/70 font-light mb-3">
          <span className="text-[10px]">✦</span>
          Tradición + Función · {CHEF_STYLE[receta.chef_inspiracion]}
        </p>
      )}
      <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
        {isFree && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-2.5 py-1 rounded-lg">
            Gratis
          </span>
        )}
        <span
          className="text-[10px] font-medium px-2.5 py-1 rounded-lg border capitalize"
          style={{ color: mood.color, backgroundColor: mood.colorLight, borderColor: `${mood.color}25` }}
        >
          {mood.emoji} {mood.id}
        </span>
        <span className="text-[10px] text-cream/30 px-2.5 py-1 rounded-lg capitalize">
          {receta.dificultad}
        </span>
      </div>
      {locked && (
        <div
          className="absolute inset-x-0 bottom-0 top-1/4 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-[#2a1825] via-[#2a1825]/80 to-transparent pointer-events-none"
        >
          <div className="flex flex-col items-center pointer-events-auto">
            <Lock className="w-5 h-5 text-[#C9A84C]/70 mb-2" />
            <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest mb-2">Acceso Exclusivo</span>
            <button
              onClick={e => { e.preventDefault(); onLockedClick?.(); }}
              className="px-4 py-2 bg-[#C9A84C] text-white text-[11px] font-bold rounded-lg shadow-[0_4px_12px_rgba(201,168,76,0.3)] hover:bg-[#b8953e] hover:scale-105 transition-all"
            >
              Desbloquear — desde 7€/mes
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (locked) return <button className="text-left w-full h-full" onClick={onLockedClick}>{card}</button>;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

function SmartCard({ receta, isPremium, freeQuota = false, onLockedClick }: { receta: Receta; isPremium: boolean; freeQuota?: boolean; onLockedClick: (r: Receta) => void }) {
  const locked = !isPremium && !freeQuota && (receta.premium_level ?? 0) > 0;
  const isFree = (receta.premium_level ?? 0) === 0 || freeQuota;
  const handleLocked = locked ? () => onLockedClick(receta) : undefined;
  if ((receta.premium_level ?? 0) === 2) {
    return <ExclusivaCard receta={receta} locked={locked} isFree={isFree} onLockedClick={handleLocked} />;
  }
  return <RecipeCard receta={receta} locked={locked} isFree={isFree} onLockedClick={handleLocked} />;
}

function Pill({ active, isDestacado, onClick, children }: { active: boolean; isDestacado?: boolean; onClick: () => void; children: React.ReactNode }) {
  const baseClasses = "shrink-0 px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.08em] uppercase transition-all duration-150 border whitespace-nowrap";
  if (isDestacado) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${
          active
            ? "bg-[#C9A84C] text-[#1a1118] border-transparent"
            : "bg-[#FAF8F4] text-[#C9A84C] border-[#C9A84C] hover:bg-[#C9A84C]/10"
        }`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        active
          ? "bg-aubergine-dark text-white border-transparent"
          : "bg-[#FAF8F4] text-aubergine-dark/70 border-aubergine-dark/20 hover:border-aubergine-dark hover:text-aubergine-dark"
      }`}
    >
      {children}
    </button>
  );
}

export default function RecetasClient({
  initialIsPremium,
  initialRecetas = [],
  initialTotal = 0,
}: {
  initialIsPremium: boolean;
  initialRecetas?: Receta[];
  initialTotal?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [moodFilter, setMoodFilter] = useState<string>(searchParams.get("mood") || "");
  const segmento = "adulto";
  const [profileIdx, setProfileIdx] = useState<number>(0);
  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [page, setPage] = useState<number>(1);

  const [recetas, setRecetas] = useState<Receta[]>(initialRecetas);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(0);
  // Skip skeleton on first render if we already have server-side data
  const [isLoading, setIsLoading] = useState(initialRecetas.length === 0);
  const [error, setError] = useState<string | null>(null);
  // Track first fetch so we don't flash skeleton when server data already shown
  const suppressFirstSkeleton = useRef(initialRecetas.length > 0);

  // State for premium status, initialized from server-side prop
  const [isPremium, setIsPremium] = useState(initialIsPremium);
  const [lockedReceta, setLockedReceta] = useState<Receta | null>(null);
  const LIMIT = 24;

  // Re-verify premium status on client side to handle caching/stale props
  useEffect(() => {
    async function checkAgain() {
      // Re-check even if initial was false, especially for recent subscribers
      try {
        const res = await fetch('/api/mi-tier');
        const data = await res.json();
        if (data.isPremium) {
          setIsPremium(true);
        }
      } catch (err) {
        console.error("Error re-verifying premium status:", err);
      }
    }
    checkAgain();
  }, [initialIsPremium]);

  const fetchRecetas = useCallback(async () => {
    // Don't flash skeleton on first fetch if server already sent initial recipes
    const silent = suppressFirstSkeleton.current;
    suppressFirstSkeleton.current = false;
    if (!silent) setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (moodFilter) {
        const moodObj = MOODS.find(m => m.id === moodFilter);
        if (moodObj) {
          // Fix: Use the correct accented name from the data object
          // instead of manual title-case conversion which breaks accent sensitivity
          params.set("mood", moodObj.nombre);
        }
      }
      params.set("segmento", segmento);
      const profile = RECIPE_SCOPES[profileIdx];
      if (profile.premiumLevel) params.set("premium_level", profile.premiumLevel);
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("limit", String(LIMIT));

      const res = await fetch(`/api/recetas?${params.toString()}`);
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al cargar las recetas");
      }

      const data: ApiResponse = await res.json();
      const seen = new Set<string>();
      const unique = (data.recetas || []).filter(r => {
        const key = r.nombre_es?.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setRecetas(unique);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching recetas:", err);
      setRecetas([]);
      setError(err.message || "No se pudieron cargar las recetas");
    } finally {
      setIsLoading(false);
    }
  }, [moodFilter, profileIdx, q, page, suppressFirstSkeleton]);

  useEffect(() => { fetchRecetas(); }, [fetchRecetas]);

  const toggleMood = (id: string) => {
    const next = moodFilter === id ? "" : id;
    setMoodFilter(next);
    setPage(1);
    router.replace(next ? `/recetas?mood=${next}` : "/recetas", { scroll: false });
  };
  const hasFilters = moodFilter || profileIdx > 0 || q;
  const resetFilters = () => {
    setMoodFilter("");
    setProfileIdx(0);
    setQ("");
    setPage(1);
    router.replace("/recetas", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="px-6 pt-12 pb-6 md:pt-20 md:pb-8 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark mb-4 leading-[1.15]">
              Es mucho más que recetas.
            </h1>
            <p className="text-lg md:text-xl text-aubergine-dark/60 font-light max-w-2xl mb-2">
              Cada plato está diseñado para responder a tu paleta emocional. Elige tu color y descubre lo que tu cuerpo necesita.
            </p>
            <p className="text-sm text-aubergine-dark/40 font-light">
              {total > 0 ? total : ""} recetas diseñadas para tu estado emocional. Las 3 primeras de cada color, siempre gratis.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-20 z-30 bg-[var(--background)]/95 backdrop-blur-lg border-b border-aubergine-dark/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <Pill active={!moodFilter} onClick={() => { setMoodFilter(""); setPage(1); router.replace("/recetas", { scroll: false }); }}>Todos</Pill>
            {MOODS.map(m => (
              <Link
                key={m.id}
                href={`/recetas?mood=${m.id}`}
                onClick={e => { e.preventDefault(); toggleMood(m.id); }}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  moodFilter === m.id ? "shadow-sm" : "bg-cream text-aubergine-dark/70 border-aubergine-dark/10 hover:border-aubergine-dark/25"
                }`}
                style={moodFilter === m.id
                  ? { backgroundColor: m.color, borderColor: m.color, color: '#3D1517' }
                  : { backgroundColor: `${m.color}15`, borderColor: `${m.color}30`, color: m.color }
                }
              >
                <span className="text-sm">{m.emoji}</span>
                <span className="hidden sm:inline">{m.nombre}</span>
                <span className="sm:hidden capitalize">{m.id}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <form
              action="/recetas"
              method="GET"
              onSubmit={e => e.preventDefault()}
              className="relative flex-1 min-w-[200px]"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aubergine-dark/30" />
              <input
                type="text"
                name="q"
                placeholder="Buscar por nombre o tipo de plato..."
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream border border-aubergine-dark/15 text-sm font-light text-aubergine-dark placeholder:text-aubergine-dark/35 focus:outline-none focus:border-[#C9A84C]/50 focus:shadow-luxury transition-all"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => { setQ(""); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-aubergine-dark/30 hover:text-aubergine-dark transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {RECIPE_SCOPES.map((p, i) => (
              <Pill key={i} active={profileIdx === i} isDestacado={p.label === "Tradición + Función"} onClick={() => { setProfileIdx(i); setPage(1); }}>
                {p.label}
              </Pill>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-aubergine-dark/50 font-medium">
              {isLoading ? <span className="animate-pulse">Buscando...</span> : <>{total.toLocaleString()} receta{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}</>}
            </span>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-aubergine-dark/40 hover:text-aubergine-dark transition-colors uppercase tracking-widest"
              >
                <X className="w-3 h-3" /> Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-aubergine-dark mb-3">Error de servidor</h2>
            <p className="text-aubergine-dark/50 font-light max-w-md mb-8">{error}</p>
            <button onClick={fetchRecetas} className="px-8 py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors">
              Reintentar
            </button>
          </motion.div>
        ) : recetas.length === 0 ? (
          (!isPremium && hasFilters) ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16">
              <div className="bg-gradient-to-br from-aubergine-dark to-aubergine rounded-2xl p-8 md:p-12 max-w-3xl w-full text-center relative overflow-hidden border border-[#C9A84C]/20 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20 mb-6">
                    <Sparkles className="w-3 h-3" /> PRÓXIMAMENTE
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-cream mb-4 leading-snug">Aún no tenemos esa combinación.</h2>
                  <p className="text-cream/60 font-light max-w-lg mb-10">Prueba con otro estado de ánimo o amplía los filtros. Cada semana añadimos recetas nuevas.</p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {!isPremium && <Link href="/pricing" className="px-8 py-3.5 rounded-xl bg-[#C9A84C] text-white text-sm font-semibold hover:bg-[#b8953e] transition-colors shadow-lg">Ver planes</Link>}
                    <button onClick={resetFilters} className="px-8 py-3.5 rounded-xl border border-cream/20 text-cream/70 text-sm font-medium hover:bg-cream/5 transition-colors">Limpiar filtros</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-aubergine-dark/5 flex items-center justify-center mb-6"><SearchX className="w-8 h-8 text-aubergine-dark/30" /></div>
              <h2 className="text-2xl font-serif text-aubergine-dark mb-3">Aún no tenemos esa combinación.</h2>
              <p className="text-aubergine-dark/50 font-light max-w-md mb-8">Todavía no tenemos recetas para esta combinación. Pronto añadiremos más.</p>
              <div className="flex items-center gap-4">
                <button onClick={resetFilters} className="px-8 py-3 rounded-xl border border-aubergine-dark/10 text-aubergine-dark/70 text-sm font-medium hover:bg-aubergine-dark/5 transition-colors">Limpiar filtros</button>
                {!isPremium && <Link href="/pricing" className="px-8 py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors">Ver planes</Link>}
              </div>
            </motion.div>
          )
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {(() => {
                  const freeQuotaIds = new Set<string>();
                  if (!isPremium) {
                    const countByMood: Record<string, number> = {};
                    for (const r of recetas) {
                      if ((r.premium_level ?? 0) > 0) {
                        const moodId = MOODS.find(m => r.mood_es?.toLowerCase().includes(m.id))?.id ?? r.moodId ?? 'unknown';
                        countByMood[moodId] = (countByMood[moodId] ?? 0) + 1;
                        if (countByMood[moodId] <= 3) freeQuotaIds.add(r.id);
                      }
                    }
                  }
                  return recetas.map((receta) => (
                    <SmartCard
                      key={receta.id}
                      receta={receta}
                      isPremium={isPremium}
                      freeQuota={freeQuotaIds.has(receta.id)}
                      onLockedClick={setLockedReceta}
                    />
                  ));
                })()}
              </AnimatePresence>
            </div>

            {/* Upgrade CTA — visible to non-premium users after the grid */}
            {!isPremium && total > 9 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 rounded-2xl bg-gradient-to-br from-aubergine-dark to-[#2d0f16] p-8 md:p-10 text-center"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-3">
                  Club Premium
                </p>
                <p className="text-xl md:text-2xl font-serif text-cream mb-2 leading-snug">
                  Viste {Math.min(recetas.length, 9)} de {total} recetas.
                </p>
                <p className="text-cream/60 font-light text-sm mb-6 max-w-md mx-auto">
                  Desbloquea el catálogo completo — cada receta diseñada para tu paleta emocional exacta.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block px-8 py-3.5 rounded-full bg-[#C9A84C] text-aubergine-dark text-sm font-bold hover:bg-[#b8953e] transition-all hover:scale-105"
                >
                  Ver planes — desde 7€/mes
                </Link>
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-12">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 hover:bg-aubergine-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-medium text-aubergine-dark/60">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 hover:bg-aubergine-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </>
        )}
      </section>

      <PaywallModal receta={lockedReceta} onClose={() => setLockedReceta(null)} />
    </div>
  );
}
