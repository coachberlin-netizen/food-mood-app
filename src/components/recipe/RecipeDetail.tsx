"use client";

import { Recipe } from "@/data/recipes";
import { moods } from "@/data/moods";
import { motion } from "framer-motion";
import { Clock, ChefHat, Users, Bookmark, CheckCircle2, QrCode, BookOpen } from "lucide-react";
import Link from "next/link";
import { useQuizStore } from "@/store/useQuizStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const mood = moods.find(m => m.id === recipe.moodId);
  const color = mood?.color || "#e07a5f";
  
  const savedRecipes = useQuizStore(state => state.savedRecipes);
  const completedRecipes = useQuizStore(state => state.completedRecipes);
  const toggleSavedRecipe = useQuizStore(state => state.toggleSavedRecipe);
  const toggleCompletedRecipe = useQuizStore(state => state.toggleCompletedRecipe);
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  const handleToggleSaved = () => {
    if (!isAuthenticated) {
      router.push("/auth/register");
      return;
    }
    toggleSavedRecipe(recipe.id);
  };

  const handleToggleCompleted = () => {
    if (!isAuthenticated) {
      router.push("/auth/register");
      return;
    }
    toggleCompletedRecipe(recipe.id);
  };

  const saved = savedRecipes.includes(recipe.id);
  const completed = completedRecipes.includes(recipe.id);

  // Fallback to avoid crash if mood isn't found
  if (!mood) return null;

  return (
    <div className="min-h-screen pb-20">
      <div 
        className="h-64 md:h-[400px] w-full flex items-end relative overflow-hidden bg-[#6B2737] shadow-inner"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[12rem] md:text-[20rem] opacity-[0.04] select-none filter blur-sm leading-none mix-blend-overlay">{mood?.emoji}</span>
        </div>
        
        <div className="max-w-4xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col md:flex-row gap-8 justify-between items-end">
          <div>
            <Link href="/recetas">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-cream/60 hover:text-white transition-colors cursor-pointer mb-8 inline-block drop-shadow-sm">
                ← Volver a recetas
              </span>
            </Link>
            <div className="flex gap-4 mb-6">
              <span 
                className="text-[10px] font-sans uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg border border-cream/20 shadow-sm backdrop-blur-md bg-white/5 text-white flex items-center justify-center gap-2"
              >
                <span>{mood?.emoji}</span> {mood?.nombre}
              </span>
              {recipe.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-sans uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg border border-cream/20 text-cream/90 backdrop-blur-md bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] max-w-3xl drop-shadow-md font-black"
            >
              {recipe.title}
            </motion.h1>
            <p className="text-xl md:text-3xl text-cream/90 italic mt-6 font-light max-w-2xl drop-shadow-sm">&quot;{recipe.tagline}&quot;</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-16">
          
          <div className="flex items-center gap-8 py-6 border-y border-aubergine-dark/20 text-aubergine-dark/50 font-sans text-[11px] uppercase tracking-[0.1em]">
            <div className="flex items-center gap-2.5"><Clock className="w-4 h-4 text-aubergine-dark/30"/> {recipe.prepTime} min</div>
            <div className="flex items-center gap-2.5 capitalize"><ChefHat className="w-4 h-4 text-aubergine-dark/30"/> {recipe.difficulty}</div>
            <div className="flex items-center gap-2.5"><Users className="w-4 h-4 text-aubergine-dark/30"/> {recipe.servings} px</div>
          </div>

          <p className="text-lg md:text-xl text-aubergine-dark/80 leading-[2] font-light">
            {recipe.description}
          </p>

          <section>
            <h2 className="text-3xl font-serif text-aubergine-dark mb-10">El Ritual</h2>
            <div className="space-y-8">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <span className="w-10 h-10 shrink-0 rounded-full border border-aubergine-dark/20 bg-[var(--background)] flex items-center justify-center font-serif text-aubergine-dark/40 group-hover:border-aubergine-dark/30 transition-colors">
                    {idx + 1}
                  </span>
                  <p className="text-lg text-aubergine-dark/80 leading-[1.8] font-light pt-1.5">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-navy p-10 md:p-14 rounded-xl shadow-2xl border border-[#0f172a] relative overflow-hidden">
            <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] mb-6 flex items-center gap-3 text-gold">
              <span className="p-2 rounded-md border border-gold/30 bg-gold/10">✨</span> 
              El toque Food·Mood
            </h2>
            <p className="text-2xl md:text-3xl font-serif text-white leading-[1.5] italic mb-10">
              &quot;{recipe.foodMoodNote}&quot;
            </p>
            
            <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
              <div className="flex items-start gap-5">
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 text-gold shrink-0 shadow-inner">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold mb-2">Por qué te sienta tan bien</h3>
                  <p className="text-sm md:text-base text-cream opacity-100 font-light leading-relaxed">{recipe.scienceQR}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-6 border-t border-white/10 text-cream/60 text-[10px] font-sans uppercase tracking-widest leading-loose">
                <BookOpen className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                <p>
                  Las explicaciones científicas de Food·Mood son simplificaciones divulgativas. Nuestro objetivo es traducir la investigación sobre el eje intestino-cerebro a un lenguaje claro y útil.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleToggleSaved}
              className={`w-full py-4 rounded-xl text-sm font-sans tracking-wide transition-all duration-300 flex justify-center items-center gap-3 border ${
                saved ? "bg-aubergine-dark text-white border-aubergine-dark shadow-luxury" : "bg-cream border-aubergine-dark/20 text-aubergine-dark/80 hover:bg-[#faf9f6]"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "Guardado en Perfil" : "Guardar Receta"}
            </button>
            <button 
              onClick={handleToggleCompleted}
              className={`w-full py-4 rounded-xl text-sm font-sans tracking-wide transition-all duration-300 flex justify-center items-center gap-3 border ${
                completed ? "text-white shadow-luxury border-transparent" : "bg-cream border-aubergine-dark/20 text-aubergine-dark/80 hover:bg-[#faf9f6]"
              }`}
              style={{ backgroundColor: completed ? color : undefined }}
            >
              <CheckCircle2 className={`w-4 h-4 ${completed ? "text-white" : ""}`} />
              {completed ? "Ritual Completado" : "¡Lo he probado!"}
            </button>
          </div>

          <section className="bg-cream rounded-xl shadow-luxury border border-aubergine-dark/20 p-8">
            <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/40 mb-8 border-b border-aubergine-dark/20 pb-4">
              Ingredientes
            </h2>
            <ul className="space-y-5">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex justify-between items-start">
                  <div className="pr-6">
                    <span className="block font-sans text-aubergine-dark/90">{ing.name}</span>
                    {ing.note && <span className="text-[11px] text-aubergine-dark/40 uppercase tracking-widest mt-1.5 inline-block">{ing.note}</span>}
                  </div>
                  <span className="font-serif text-lg text-aubergine-dark shrink-0">{ing.quantity}</span>
                </li>
              ))}
            </ul>
          </section>
          
          <div className="bg-[#faf9f6] p-8 rounded-xl border border-aubergine-dark/20 text-center">
             <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/30 mb-4 block">El fundamento</span>
             <span className="font-serif text-xl italic text-aubergine-dark/80 leading-relaxed">{recipe.acidBase}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
