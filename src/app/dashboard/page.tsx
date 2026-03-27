"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { recipesData } from "@/data/recipes";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Activity, CheckCircle2, Calendar, Lightbulb, ChefHat, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DailyMoodTracker } from "@/components/mood/DailyMoodTracker";
import { MoodStats } from "@/components/mood/MoodStats";
import { useAuthStore } from "@/store/useAuthStore";
import dynamic from "next/dynamic";

const MoodCalendar = dynamic(() => import("@/components/mood/MoodCalendar").then(mod => mod.MoodCalendar), { 
  ssr: false, 
  loading: () => <div className="h-64 bg-navy/5 animate-pulse rounded-3xl" /> 
});
const MoodTrend = dynamic(() => import("@/components/mood/MoodTrend").then(mod => mod.MoodTrend), { 
  ssr: false,
  loading: () => <div className="h-64 bg-navy/5 animate-pulse rounded-3xl" /> 
});

const DID_YOU_KNOW = [
  "El 90% de la serotonina humana se produce en tu intestino.",
  "Los fermentos vivos aumentan de inmediato la diversidad de tu microbioma.",
  "Los alimentos de sabor amargo activan enzimas hepáticas de desintoxicación.",
  "Comer acompañado eleva la producción de oxitocina, calmando la digestión.",
  "El nervio vago es la autopista directa bi-direccional entre tu cerebro y tu sistema digestivo."
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { moodHistory, resultMood, savedRecipes, completedRecipes, quizCount, syncFromSupabase } = useQuizStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    syncFromSupabase();
  }, [syncFromSupabase]);

  if (!mounted) return null;

  const currentMoodId = resultMood || (moodHistory.length > 0 ? moodHistory[moodHistory.length - 1].moodId : null);
  const currentMoodObj = moods.find(m => m.id === currentMoodId);
  
  // Recommend a recipe based on mood
  const moodRecipes = currentMoodId ? recipesData.filter(r => r.moodId === currentMoodId) : recipesData;
  const recommendedRecipe = moodRecipes[Math.floor(Math.random() * moodRecipes.length)];
  
  const savedRecipesList = recipesData.filter(r => savedRecipes.includes(r.id));
  
  // Formatting today's date
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const mostFrequentMoodId = moodHistory.length > 0 
    ? [...moodHistory].sort((a,b) => 
        moodHistory.filter(v => v.moodId===a.moodId).length - moodHistory.filter(v => v.moodId===b.moodId).length
      ).pop()?.moodId 
    : null;
  const frequentMoodObj = moods.find(m => m.id === mostFrequentMoodId);

  const randomFact = DID_YOU_KNOW[Math.floor(Math.random() * DID_YOU_KNOW.length)];

  return (
    <AuthGuard>
      <div className="min-h-screen p-6 md:p-12 lg:p-24 transition-colors duration-1000 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* 1. SALUDO PERSONALIZADO */}
        <header>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-navy/40 mb-4 capitalize">{today}</p>
            <h1 className="text-4xl md:text-6xl font-serif text-navy leading-[1.2]">
              Hola, {user?.name || "Viajero"}. <br className="hidden md:block"/>
              <span className="text-navy/60 italic font-light">¿Cómo anda tu intestino hoy?</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Current Mood & Stats */}
          <div className="lg:col-span-5 space-y-8 flex flex-col">
            
            {/* 2. DAILY MOOD TRACKING SYSTEM */}
            <DailyMoodTracker />

            {/* 6. ESTADISTICAS SIMPLES */}
            <MoodStats />

          </div>

          {/* RIGHT COLUMN: Recipe, History, Saved */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 3. RECETA DEL DIA */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-serif text-navy">Tu receta para hoy</h2>
                  <p className="text-navy/60 text-sm font-light mt-2">Puro placer para tu cuerpo.</p>
                </div>
                <Link href="/recetas">
                  <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-navy/50 hover:text-navy transition-colors flex items-center gap-1">
                    Descubrir más <ArrowRight className="w-3 h-3"/>
                  </span>
                </Link>
              </div>
              {recommendedRecipe ? (
                 <div className="h-full">
                    <RecipeCard recipe={recommendedRecipe} />
                 </div>
              ) : (
                <div className="bg-white p-12 rounded-xl border border-[#edeae3] shadow-luxury text-center text-navy/50 font-light">
                  Completa tu perfil o quiz para recibir recomendaciones
                </div>
              )}
            </section>

            {/* 4. HISTORIAL MOOD (HEATMAP & TREND) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <MoodTrend />
               <MoodCalendar />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 5. RECETAS GUARDADAS */}
              <section className="bg-white p-10 rounded-xl border border-[#edeae3] shadow-luxury">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-navy/40" />
                    <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-navy">Tus recetas favoritas</h2>
                  </div>
                </div>
                
                {savedRecipesList.length > 0 ? (
                  <div className="space-y-4">
                    {savedRecipesList.slice(0, 3).map(recipe => {
                      const m = moods.find(md => md.id === recipe.moodId);
                      return (
                        <Link href={`/recetas/${recipe.id}`} key={recipe.id}>
                          <div className="flex items-center gap-6 p-4 rounded-lg bg-[var(--background)] hover:bg-[#edeae3] transition-colors group cursor-pointer border border-[#edeae3]/50">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 opacity-80" style={{ backgroundColor: `${m?.color}15`, color: m?.color }}>
                              {m?.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-lg text-navy truncate group-hover:text-amber-800 transition-colors">{recipe.title}</p>
                              <p className="text-xs text-navy/50 truncate flex items-center gap-1.5 font-light"><Clock className="w-3 h-3"/> {recipe.prepTime} min</p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                    {savedRecipesList.length > 3 && (
                      <Link href="/recetas">
                         <p className="text-[11px] font-sans tracking-[0.2em] text-center text-navy/40 mt-6 uppercase hover:text-navy cursor-pointer transition-colors">Ver {savedRecipesList.length - 3} más</p>
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="text-navy/40 text-sm text-center py-4">No has guardado recetas aún.</p>
                )}
              </section>

              {/* 7. SECCION "SABIAS QUE..." */}
              <section className="bg-navy text-white p-12 md:p-14 rounded-2xl shadow-luxury relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-[0.02] rounded-bl-full pointer-events-none" />
                <Lightbulb className="w-6 h-6 text-gold/80 mb-8" />
                <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/50 mb-4">¿Sabías que...?</h2>
                <p className="text-2xl font-serif italic leading-[1.6] text-cream">
                  &quot;{randomFact}&quot;
                </p>
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
