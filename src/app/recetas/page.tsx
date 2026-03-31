"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { recipesData } from "@/data/recipes";
import { RecipeFilter } from "@/components/recipe/RecipeFilter";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { Search, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function PaywallScreen() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-cream rounded-2xl p-12 md:p-16 shadow-luxury border border-aubergine-dark/20 text-center flex flex-col items-center gap-8"
      >
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <Lock className="w-7 h-7 text-[#C9A84C]" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif text-aubergine-dark leading-tight">
            El recetario completo es Premium
          </h1>
          <p className="text-aubergine-dark/60 font-light leading-relaxed text-base">
            Con Premium accedes a todas las recetas, recetas IA diarias sin repetición y tu historial mensual completo.
          </p>
        </div>
        <div className="w-full bg-aubergine-dark/5 rounded-xl p-6 border border-aubergine-dark/10 space-y-3">
          <div className="flex items-center gap-3 text-sm text-aubergine-dark/70 font-light">
            <Sparkles className="w-4 h-4 text-[#C9A84C] shrink-0" />
            <span>Recetas IA diarias personalizadas sin repetir</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-aubergine-dark/70 font-light">
            <Sparkles className="w-4 h-4 text-[#C9A84C] shrink-0" />
            <span>Acceso a todo el recetario (todos los moods)</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-aubergine-dark/70 font-light">
            <Sparkles className="w-4 h-4 text-[#C9A84C] shrink-0" />
            <span>Historial mensual y favoritas guardadas</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 w-full">
          <Link
            href="/dashboard"
            className="w-full py-4 rounded-xl bg-aubergine-dark text-white font-medium text-base flex items-center justify-center gap-2 hover:bg-aubergine-dark/90 transition-colors shadow-md"
          >
            Hazte Premium — 9 euros/mes
          </Link>
          <Link href="/test" className="text-sm text-aubergine-dark/50 hover:text-aubergine-dark transition-colors font-sans">
            Volver al test
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function RecipesContent() {
  const searchParams = useSearchParams();
  const initialMood = searchParams.get("mood");
  const [activeMood, setActiveMood] = useState<string | null>(initialMood);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPremium() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setIsPremium(false); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", session.user.id)
        .single();
      setIsPremium(profile?.is_premium === true);
    }
    checkPremium();
  }, []);

  if (isPremium === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-aubergine-dark/10 border-t-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return <PaywallScreen />;
  }

  const filteredRecipes = recipesData.filter((recipe) => {
    const matchesMood = activeMood ? recipe.moodId === activeMood : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.ingredients.some((i) => i.name.toLowerCase().includes(searchLower)) ||
      recipe.tags.some((t) => t.toLowerCase().includes(searchLower));
    return matchesMood && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 md:py-20 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-cream mb-6 leading-[1.2]">
            Recetas con superpoderes
          </h1>
          <p className="text-xl text-cream/70 font-light max-w-2xl">
            Encuentra lo que tu cuerpo necesita hoy. Puro placer, cero culpa.
          </p>
        </motion.div>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-10">
          <RecipeFilter activeMood={activeMood} onSelectMood={setActiveMood} />
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Buscar ingrediente o receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-cream border border-aubergine-dark/20 shadow-sm focus:outline-none focus:border-aubergine-dark/30 focus:shadow-luxury transition-all font-light text-aubergine-dark placeholder:text-aubergine-dark/40"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aubergine-dark/30 w-5 h-5" />
          </div>
        </div>
        <RecipeGrid recipes={filteredRecipes} />
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando recetas...</div>}>
      <RecipesContent />
    </Suspense>
  );
        }
