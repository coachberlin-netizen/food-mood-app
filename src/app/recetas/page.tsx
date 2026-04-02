"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Clock, ChevronLeft, ChevronRight, Lock, Crown, Sparkles, Star, ChefHat, Baby, SearchX } from "lucide-react";
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
  { label: "Mujeres 18-30", sexo: "mujer", edad: "18-30", premiumLevel: "" },
  { label: "Mujeres 31-44", sexo: "mujer", edad: "31-44", premiumLevel: "" },
  { label: "Mujeres 45-60", sexo: "mujer", edad: "45-60", premiumLevel: "" },
  { label: "Mujeres 60+",   sexo: "mujer", edad: "60+",   premiumLevel: "" },
  { label: "Hombres 18-30", sexo: "hombre", edad: "18-30", premiumLevel: "" },
  { label: "Hombres 31-44", sexo: "hombre", edad: "31-44", premiumLevel: "" },
  { label: "Hombres 45-60", sexo: "hombre", edad: "45-60", premiumLevel: "" },
  { label: "Hombres 60+",   sexo: "hombre", edad: "60+",   premiumLevel: "" },
  { label: "Chef / Michelin", sexo: "", edad: "", premiumLevel: "2" },
] as const;

const KIDS_AGES = [
  { label: "Todos", edad: "" },
  { label: "3-7 años", edad: "3-7" },
  { label: "8-12 años", edad: "8-12" },
  { label: "13-17 años", edad: "13-17" },
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
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS[0];

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={locked ? {} : { y: -4, boxShadow: "0 8px 24px rgba(63,26,34,0.08)" }}
      transition={{ duration: 0.2 }}
      className={`relative bg-cream rounded-2xl border border-aubergine-dark/10 p-6 md:p-7 transition-all duration-200 h-full flex flex-col group overflow-hidden ${
        locked ? '' : 'cursor-pointer'
      }`}
    >
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

      {/* Lock overlay for free users */}
      {locked && (
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-cream/80 backdrop-blur-[2px]">
          <Lock className="w-6 h-6 text-[#C9A84C]/50 mb-2" />
          <span className="text-[11px] text-aubergine-dark/50 font-medium mb-1">Contenido Premium</span>
          <Link href="/pricing" className="text-[11px] text-[#C9A84C] font-semibold hover:text-[#b8953e] transition-colors">
            Hazte premium →
          </Link>
        </div>
      )}
    </motion.div>
  );

  if (locked) return card;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

/* ── Michelin Card ────────────────────────────────────────────── */
function MichelinCard({ receta, locked = false }: { receta: Receta; locked?: boolean }) {
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS[0];

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={locked ? {} : { y: -4, boxShadow: "0 12px 32px rgba(201,168,76,0.15)" }}
      transition={{ duration: 0.25 }}
      className={`relative bg-gradient-to-br from-[#1a1118] to-[#2a1825] rounded-2xl border border-[#C9A84C]/20 p-6 md:p-7 h-full flex flex-col group overflow-hidden ${
        locked ? '' : 'cursor-pointer'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl" />

      <div className="flex items-center justify-between mb-4 relative">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20">
          <Star className="w-3 h-3" /> Michelin
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
          style={{ color: mood.color, backgroundColor: `${mood.color}15`, borderColor: `${mood.color}25` }}
        >
          {mood.emoji} {mood.id}
        </span>
        <span className="text-[10px] text-cream/30 px-2.5 py-1 rounded-lg capitalize">
          {receta.dificultad}
        </span>
      </div>

      {locked && (
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-[#1a1118]/80 backdrop-blur-[2px]">
          <Lock className="w-6 h-6 text-[#C9A84C]/50 mb-2" />
          <span className="text-[11px] text-[#C9A84C]/60 font-medium mb-1">Contenido Premium</span>
          <Link href="/pricing" className="text-[11px] text-[#C9A84C] font-semibold hover:text-[#b8953e] transition-colors">
            Hazte premium →
          </Link>
        </div>
      )}
    </motion.div>
  );

  if (locked) return card;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

/* ── Kids Card ────────────────────────────────────────────────── */
function KidsCard({ receta, locked = false }: { receta: Receta; locked?: boolean }) {
  const mood = MOODS.find(m => receta.mood_es?.toLowerCase().includes(m.id)) || MOODS[0];
  const ageEmoji = receta.grupo_edad === '3-7' ? '🧒' : receta.grupo_edad === '8-12' ? '👦' : '🧑';

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={locked ? {} : { y: -4, boxShadow: "0 12px 32px rgba(99,102,241,0.12)" }}
      transition={{ duration: 0.25 }}
      className={`relative bg-gradient-to-br from-[#f0f4ff] to-[#fdf2f8] rounded-2xl border border-indigo-200/40 p-6 md:p-7 h-full flex flex-col group overflow-hidden ${
        locked ? '' : 'cursor-pointer'
      }`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-200/30 to-transparent rounded-full blur-2xl" />

      <div className="flex items-center justify-between mb-4 relative">
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
          style={{ color: mood.color, backgroundColor: mood.bg }}
        >
          {mood.emoji} {mood.id}
        </span>
        <span className="text-[10px] bg-aubergine-dark/5 text-aubergine-dark/40 px-2.5 py-1 rounded-lg capitalize">
          {receta.tipo_plato}
        </span>
      </div>

      {locked && (
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <Lock className="w-6 h-6 text-indigo-400/50 mb-2" />
          <span className="text-[11px] text-indigo-500/60 font-medium mb-1">Contenido Premium</span>
          <Link href="/pricing" className="text-[11px] text-[#C9A84C] font-semibold hover:text-[#b8953e] transition-colors">
            Hazte premium →
          </Link>
        </div>
      )}
    </motion.div>
  );

  if (locked) return card;
  return <Link href={`/recetas/${receta.id}`}>{card}</Link>;
}

/* ── Smart Card Selector ──────────────────────────────────────── */
function SmartCard({ receta, isPremium }: { receta: Receta; isPremium: boolean }) {
  const locked = !isPremium && (receta.premium_level ?? 0) > 0;

  if ((receta.premium_level ?? 0) === 2) {
    return <MichelinCard receta={receta} locked={locked} />;
  }
  if (receta.segmento === 'kids') {
    return <KidsCard receta={receta} locked={locked} />;
  }
  return <RecipeCard receta={receta} locked={locked} />;
}

/* ── Pill Button ──────────────────────────────────────────────── */
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
        active
          ? "bg-aubergine-dark text-cream border-aubergine-dark"
          : "bg-cream text-aubergine-dark/60 border-aubergine-dark/10 hover:border-aubergine-dark/25"
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
  const [segmento, setSegmento] = useState<string>("adulto");
  const [profileIdx, setProfileIdx] = useState<number>(0);
  const [kidsAgeIdx, setKidsAgeIdx] = useState<number>(0);
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
      if (segmento === "adulto") {
        const profile = ADULT_PROFILES[profileIdx];
        if (profile.sexo) params.set("sexo", profile.sexo);
        if (profile.edad) params.set("edad", profile.edad);
        if (profile.premiumLevel) params.set("premium_level", profile.premiumLevel);
      } else {
        const kidsAge = KIDS_AGES[kidsAgeIdx];
        if (kidsAge.edad) params.set("edad", kidsAge.edad);
      }

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
  }, [moodFilter, segmento, profileIdx, kidsAgeIdx, q, page]);

  useEffect(() => { fetchRecetas(); }, [fetchRecetas]);

  // ── Handlers ───────────────────────────────────────────────
  const toggleMood = (id: string) => {
    setMoodFilter(prev => prev === id ? "" : id);
    setPage(1);
  };

  const changeSegmento = (seg: string) => {
    setSegmento(seg);
    setProfileIdx(0);
    setKidsAgeIdx(0);
    setPage(1);
  };

  const hasFilters = moodFilter || profileIdx > 0 || kidsAgeIdx > 0 || q;

  const resetFilters = () => {
    setMoodFilter("");
    setProfileIdx(0);
    setKidsAgeIdx(0);
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
                Estás viendo una muestra. <span className="font-medium">Suscríbete</span> para acceder a las 10,000 recetas.
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
              Recetas con superpoderes
            </h1>
            <p className="text-lg md:text-xl text-aubergine-dark/60 font-light max-w-2xl">
              10.000 combinaciones diseñadas para lo que sientes. Filtra, explora, disfruta.
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
                    ? "text-white shadow-sm"
                    : "bg-cream text-aubergine-dark/70 border-aubergine-dark/10 hover:border-aubergine-dark/25"
                }`}
                style={moodFilter === m.id ? { backgroundColor: m.color, borderColor: m.color } : {}}
              >
                <span className="text-sm">{m.emoji}</span>
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden capitalize">{m.id}</span>
              </button>
            ))}
          </div>

          {/* FILA 2 — Segmento + Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-xl overflow-hidden border border-aubergine-dark/15">
              <button
                onClick={() => changeSegmento("adulto")}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-200 ${
                  segmento === "adulto"
                    ? "bg-aubergine-dark text-cream"
                    : "bg-cream text-aubergine-dark/60 hover:bg-aubergine-dark/5"
                }`}
              >
                Adultos
              </button>
              <button
                onClick={() => changeSegmento("kids")}
                className={`px-4 py-2 text-xs font-medium tracking-widest transition-all duration-200 flex items-center gap-1.5 ${
                  segmento === "kids"
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                    : "bg-cream text-aubergine-dark/60 hover:text-indigo-500/70"
                }`}
              >
                <Baby className="w-3 h-3" /> Kids
              </button>
            </div>

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

          {/* FILA 3 — Profile pills (conditional) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={segmento}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {segmento === "adulto" ? (
                  ADULT_PROFILES.map((p, i) => (
                    <Pill key={i} active={profileIdx === i} onClick={() => { setProfileIdx(i); setPage(1); }}>
                      {p.label}
                    </Pill>
                  ))
                ) : (
                  KIDS_AGES.map((a, i) => (
                    <Pill key={i} active={kidsAgeIdx === i} onClick={() => { setKidsAgeIdx(i); setPage(1); }}>
                      {a.label}
                    </Pill>
                  ))
                )}
              </div>
            </motion.div>
          </AnimatePresence>

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
          /* ── Empty state ──────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-aubergine-dark/5 flex items-center justify-center mb-6">
              <SearchX className="w-8 h-8 text-aubergine-dark/30" />
            </div>
            <h2 className="text-2xl font-serif text-aubergine-dark mb-3">Sin resultados</h2>
            <p className="text-aubergine-dark/50 font-light max-w-md mb-8">
              Todavía no tenemos recetas para esta combinación. Pronto añadiremos más.
            </p>
            <button onClick={resetFilters} className="px-8 py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium hover:bg-aubergine transition-colors">
              Limpiar filtros
            </button>
          </motion.div>
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
