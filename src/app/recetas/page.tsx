"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Clock, ChevronLeft, ChevronRight, Lock, Crown, Sparkles, Star, ChefHat, Baby, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { moods as MOODS } from "@/data/moods";

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

/* ── Profile filter options ───────────────────────────────────── */
const ADULT_PROFILES = [
  { label: "Todos", sexo: "", edad: "", premiumLevel: "" },
  { label: "Mujeres", sexo: "mujer", edad: "", premiumLevel: "" },
  { label: "Mujeres +45", sexo: "mujer", edad: "45-60,60+", premiumLevel: "" },
  { label: "Hombres", sexo: "hombre", edad: "", premiumLevel: "" },
  { label: "Chef / Exclusivo", sexo: "", edad: "", premiumLevel: "2" },
] as const;

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

/* ── Recipe Card (standard) ──────────────────────────────────── */
function RecipeCard({ receta, locked = false }: { receta: Receta; locked?: boolean }) {
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
      {/* Mood color indicator */}
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
        <span className="text-[10px] font-sans font-medium text-aubergine-dark/50 bg-aubergine-dark/5 px-2.5 py-1 rounded-lg border border-aubergine-dark/10 capitalize">
          {receta.tipo_plato}
        </span>
        <span className="text-[10px] font-sans font-medium text-aubergine-dark/40 bg-aubergine-dark/[0.03] px-2.5 py-1 rounded-lg capitalize">
          {receta.dificultad}
        </span>
      </div>

      {/* Lock overlay for free users — Visible but gated */}
      {locked && (
        <div 
          className="absolute inset-x-0 bottom-0 top-1/4 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none"
        >
          <div className="flex flex-col items-center pointer-events-auto">
            <Lock className="w-5 h-5 text-[#C9A84C]/60 mb-2" />
            <span className="text-[10px] text-aubergine-dark/60 font-semibold uppercase tracking-wider mb-2">Contenido Premium</span>
            <Link 
              href="/pricing" 
              className="px-4 py-2 bg-[#C9A84C] text-white text-[11px] font-bold rounded-lg shadow-sm hover:bg-[#b8953e] hover:scale-105 transition-all"
            >
              Suscribirme para ver más →
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (locked) return <Link href="/pricing">{card}</Link>;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

/* ── Michelin Card ────────────────────────────────────────────── */
function ExclusivaCard({ receta, locked = false }: { receta: Receta; locked?: boolean }) {
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
      {/* Mood color indicator */}
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
          <ChefHat className="w-3 h-3" />
          {CHEF_STYLE[receta.chef_inspiracion]}
        </p>
      )}

      <div className="mt-auto pt-4 flex items-center gap-2">
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
            <Link 
              href="/pricing" 
              className="px-4 py-2 bg-[#C9A84C] text-white text-[11px] font-bold rounded-lg shadow-[0_4px_12px_rgba(201,168,76,0.3)] hover:bg-[#b8953e] hover:scale-105 transition-all"
            >
              Hacerse Premium →
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (locked) return <Link href="/pricing">{card}</Link>;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

/* ── Familia Card ────────────────────────────────────────────────── */
function FamiliaCard({ receta, locked = false }: { receta: Receta; locked?: boolean }) {
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS.find(m => m.id === receta.moodId) || MOODS[0];
  const ageEmoji = receta.grupo_edad === '3-7' ? '🧒' : receta.grupo_edad === '8-12' ? '👦' : '🧑';

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: locked ? 1.01 : 1, boxShadow: "0 12px 32px rgba(99,102,241,0.12)" }}
      transition={{ duration: 0.25 }}
      className={`relative bg-gradient-to-br from-[#f0f4ff] to-[#fdf2f8] rounded-2xl border border-indigo-200/40 p-6 md:p-7 h-full flex flex-col group overflow-hidden ${
        'cursor-pointer'
      }`}
    >
      {/* Mood color indicator */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] z-20"
        style={{ backgroundColor: mood.color }}
      />
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-200/30 to-transparent rounded-full blur-2xl" />

      <div className="flex items-center justify-between mb-4 relative mt-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200/50">
          {ageEmoji} {receta.grupo_edad} años
        </span>
        <span className="flex items-center gap-1 text-[11px] text-aubergine-dark/40 font-medium">
          <Clock className="w-3 h-3" />
          {receta.tiempo_preparacion_min} min
        </span>
      </div>

      <h3 className="text-lg font-serif font-bold text-aubergine-dark/90 leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {receta.nombre_es}
      </h3>

      <div className="mt-auto pt-4 flex items-center gap-2">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg capitalize"
          style={{ color: mood.color, backgroundColor: mood.colorLight }}
        >
          {mood.emoji} {mood.id}
        </span>
        <span className="text-[10px] bg-aubergine-dark/5 text-aubergine-dark/40 px-2.5 py-1 rounded-lg capitalize">
          {receta.tipo_plato}
        </span>
      </div>

      {locked && (
        <div 
          className="absolute inset-x-0 bottom-0 top-1/4 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-[#fdf2f8] via-[#fdf2f8]/80 to-transparent pointer-events-none"
        >
          <div className="flex flex-col items-center pointer-events-auto">
            <Lock className="w-5 h-5 text-indigo-400 mb-2" />
            <span className="text-[10px] text-indigo-600/60 font-bold uppercase tracking-widest mb-2">Plan Familiar</span>
            <Link 
              href="/pricing" 
              className="px-4 py-2 bg-indigo-600 text-white text-[11px] font-bold rounded-lg shadow-sm hover:bg-indigo-700 hover:scale-105 transition-all"
            >
              Activar Acceso →
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (locked) return <Link href="/pricing">{card}</Link>;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

/* ── Smart Card Selector ──────────────────────────────────────── */
function SmartCard({ receta, isPremium }: { receta: Receta; isPremium: boolean }) {
  const locked = !isPremium && (receta.premium_level ?? 0) > 0;

  if ((receta.premium_level ?? 0) === 2) {
    return <ExclusivaCard receta={receta} locked={locked} />;
  }
  return <RecipeCard receta={receta} locked={locked} />;
}

/* ── Pill Button ──────────────────────────────────────────────── */
function Pill({ active, isChef, onClick, children }: { active: boolean; isChef?: boolean; onClick: () => void; children: React.ReactNode }) {
  const baseClasses = "shrink-0 px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.08em] uppercase transition-all duration-150 border whitespace-nowrap";
  
  if (isChef) {
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

/* ── Main Content ────────────────────────────────────────────── */
function RecetasContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Filter state ──────────────────────────────────────────
  const [moodFilter, setMoodFilter] = useState<string>("");
  const segmento = "adulto"; // Simplified to adults only
  const [profileIdx, setProfileIdx] = useState<number>(0);
  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [page, setPage] = useState<number>(1);

  // ── Data state ──────────────────────────────────────────────
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ── User premium status ─────────────────────────────────────
  const [isPremium, setIsPremium] = useState(false);
  const [tierLoaded, setTierLoaded] = useState(false);
  const LIMIT = 24;

  // ── Fetch user tier (direct Supabase — bypasses broken server route) ──
  useEffect(() => {
    async function checkPremium() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setTierLoaded(true);
          return;
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        setIsPremium(!!profile?.is_premium);
      } catch {
        // default free
      } finally {
        setTierLoaded(true);
      }
    }
    checkPremium();
  }, []);

  // ── Build query params & fetch ──────────────────────────────
  const fetchRecetas = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      // Mood filter
      if (moodFilter) {
        const moodObj = MOODS.find(m => m.id === moodFilter);
        if (moodObj) {
          // Use the short name for ilike matching (works for both adult and kids)
          const moodShort = moodFilter.charAt(0).toUpperCase() + moodFilter.slice(1);
          params.set("mood", moodShort);
        }
      }

      // Segmento filter
      params.set("segmento", segmento);

      // Profile/age filter
      const profile = ADULT_PROFILES[profileIdx];
      if (profile.sexo) params.set("sexo", profile.sexo);
      if (profile.edad) params.set("edad", profile.edad);
      if (profile.premiumLevel) params.set("premium_level", profile.premiumLevel);

      // Text search
      if (q) params.set("q", q);

      // Pagination
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
  }, [moodFilter, profileIdx, q, page]);

  useEffect(() => { fetchRecetas(); }, [fetchRecetas]);

  // ── Handlers ───────────────────────────────────────────────
  const toggleMood = (id: string) => {
    setMoodFilter(prev => prev === id ? "" : id);
    setPage(1);
  };

  const hasFilters = moodFilter || profileIdx > 0 || q;

  const resetFilters = () => {
    setMoodFilter("");
    setProfileIdx(0);
    setQ("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Free-user banner ───────────────────────────────── */}
      {tierLoaded && !isPremium && (
        <div className="bg-gradient-to-r from-aubergine-dark to-aubergine text-cream px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <p className="text-sm font-light">
                Estás viendo una muestra. <span className="font-medium">Suscríbete</span> para acceder a todas las recetas.
              </p>
            </div>
            <Link href="/pricing" className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#b8953e] text-white text-xs font-medium rounded-lg transition-colors">
              <Sparkles className="w-3 h-3" />
              Premium — 9€/mes
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero header ────────────────────────────────────── */}
      <section className="px-6 pt-12 pb-6 md:pt-20 md:pb-8 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark mb-4 leading-[1.15]">
              Es mucho más que recetas.
            </h1>
            <p className="text-lg md:text-xl text-aubergine-dark/60 font-light max-w-2xl">
              Cada plato está diseñado para responder a tu paleta emocional. Elige tu color y descubre lo que tu cuerpo necesita.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky filters ────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-[var(--background)]/95 backdrop-blur-lg border-b border-aubergine-dark/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col gap-4">

          {/* FILA 1 — Mood pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <Pill active={!moodFilter} onClick={() => { setMoodFilter(""); setPage(1); }}>
              Todos
            </Pill>
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => toggleMood(m.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  moodFilter === m.id
                    ? "shadow-sm"
                    : "bg-cream text-aubergine-dark/70 border-aubergine-dark/10 hover:border-aubergine-dark/25"
                }`}
                style={moodFilter === m.id 
                  ? { backgroundColor: m.color, borderColor: m.color, color: '#3D1517' } 
                  : { backgroundColor: `${m.color}15`, borderColor: `${m.color}30`, color: m.color }
                }
              >
                <span className="text-sm">{m.emoji}</span>
                <span className="hidden sm:inline">{m.nombre}</span>
                <span className="sm:hidden capitalize">{m.id}</span>
              </button>
            ))}
          </div>

          {/* Row 2 — Search */}
          <div className="flex items-center gap-3 flex-wrap">
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
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Row 3 — Profile pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {ADULT_PROFILES.map((p, i) => (
              <Pill key={i} active={profileIdx === i} isChef={p.label === "Chef / Exclusivo"} onClick={() => { setProfileIdx(i); setPage(1); }}>
                {p.label}
              </Pill>
            ))}
          </div>

          {/* Counter + Clear */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-aubergine-dark/50 font-medium">
              {isLoading ? (
                <span className="animate-pulse">Buscando...</span>
              ) : (
                <>{total.toLocaleString()} receta{total !== 1 ? "s" : ""} encontrada{total !== 1 ? "s" : ""}</>
              )}
            </span>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recetas.length === 0 ? (
          /* ── Empty state (or Upsell if free + filtered) ──────────────────────────────────── */
          (!isPremium && hasFilters) ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-16"
            >
              <div className="bg-gradient-to-br from-aubergine-dark to-aubergine rounded-2xl p-8 md:p-12 max-w-3xl w-full text-center relative overflow-hidden border border-[#C9A84C]/20 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/20 mb-6">
                    <Sparkles className="w-3 h-3" /> PRÓXIMAMENTE
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-cream mb-4 leading-snug">
                    Aún no tenemos esa combinación.
                  </h2>
                  <p className="text-cream/60 font-light max-w-lg mb-10">
                    Prueba con otro estado de ánimo o amplía los filtros. Cada semana añadimos recetas nuevas.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/pricing" className="px-8 py-3.5 rounded-xl bg-[#C9A84C] text-white text-sm font-semibold hover:bg-[#b8953e] transition-colors shadow-lg">
                      Ver planes
                    </Link>
                    <button onClick={resetFilters} className="px-8 py-3.5 rounded-xl border border-cream/20 text-cream/70 text-sm font-medium hover:bg-cream/5 transition-colors">
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-aubergine-dark/5 flex items-center justify-center mb-6">
                <SearchX className="w-8 h-8 text-aubergine-dark/30" />
              </div>
              <h2 className="text-2xl font-serif text-aubergine-dark mb-3">Aún no tenemos esa combinación.</h2>
              <p className="text-aubergine-dark/50 font-light max-w-md mb-8">
                Todavía no tenemos recetas para esta combinación. Pronto añadiremos más.
              </p>
              <div className="flex items-center gap-4">
                <button onClick={resetFilters} className="px-8 py-3 rounded-xl border border-aubergine-dark/10 text-aubergine-dark/70 text-sm font-medium hover:bg-aubergine-dark/5 transition-colors">
                  Limpiar filtros
                </button>
                <Link href="/pricing" className="px-8 py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors">
                  Ver planes
                </Link>
              </div>
            </motion.div>
          )
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {recetas.map((receta) => (
                  <SmartCard key={receta.id} receta={receta} isPremium={isPremium} />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 hover:bg-aubergine-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm font-medium text-aubergine-dark/60">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 hover:bg-aubergine-dark/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

/* ── Page wrapper with Suspense ──────────────────────────────── */
export default function RecetasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse text-aubergine-dark/30 font-serif text-xl">Cargando recetas...</div>
      </div>
    }>
      <RecetasContent />
    </Suspense>
  );
}
