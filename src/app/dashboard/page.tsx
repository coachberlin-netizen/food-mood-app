"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { moods } from "@/data/moods";
import { recipesData } from "@/data/recipes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, Heart, Lock } from "lucide-react";

export default function DashboardPage() {
  const { resultMood, quizCount, syncFromSupabase, resetQuiz } = useQuizStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [monthlyRecipe, setMonthlyRecipe] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [todayFormatted, setTodayFormatted] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setTodayFormatted(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  useEffect(() => {
    setMounted(true);
    syncFromSupabase();
    
    // Fetch last recipe generated this month
    async function fetchMonthlyRecipe() {
      if (!user?.email) {
        setIsLoadingHistory(false);
        return;
      }
      
      const supabase = createClient();
      const now = new Date();
      const monthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;
      
      const { data } = await supabase
        .from('recipe_history')
        .select('*')
        .eq('user_email', user.email)
        .eq('month_year', monthYear)
        .order('generated_date', { ascending: false })
        .limit(1);
        
      if (data && data.length > 0) {
        setMonthlyRecipe(data[0].recipe_content);
        setIsFavorite(data[0].is_favorite);
      }
      setIsLoadingHistory(false);
    }
    
    fetchMonthlyRecipe();
  }, [syncFromSupabase, user]);

  const handleGenerateTodayRecipe = async () => {
    if (!isAuthenticated || !user?.email) return;
    
    try {
      setIsGenerating(true);
      const moodId = resultMood || "social";
      const moodName = moods.find(m => m.id === moodId)?.nombre || "Social";
      
      const res = await fetch('/api/recipe/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodId, moodName, userEmail: user.email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMonthlyRecipe(data);
      setIsFavorite(false);
    } catch (err) {
      alert("Error conectando con la IA de Food·Mood.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!monthlyRecipe || !user?.email) return;
    const supabase = createClient();
    const { error } = await supabase
      .from('recipe_history')
      .update({ is_favorite: !isFavorite })
      .eq('recipe_id', monthlyRecipe.id);
      
    if (!error) setIsFavorite(!isFavorite);
  };

  if (!mounted) return null;

  // 1. DATA PREPARATION

  const currentMoodId = resultMood || "social";
  const currentMood = moods.find((m) => m.id === currentMoodId) || moods[0];

  const taglines: Record<string, string> = {
    activacion: "Despierta a tu ritmo y cómete el día.",
    calma: "Baja las revoluciones y ponte muy cómodo.",
    focus: "Afila la mente, no la ansiedad.",
    social: "Todo sabe mejor con alguien enfrente.",
    reset: "Dale al botón de reinicio y empecemos de cero.",
    confort: "Mantita, calor y mucho placer reconfortante."
  };

  // Mock History Data (últimos 7 días)
  const historyDays = [
    { label: "Lu", color: "#e67e5a", hasData: true }, // Activacion
    { label: "Ma", color: "#e5e7eb", hasData: false }, // Empty
    { label: "Mi", color: "#6b8e9b", hasData: true }, // Focus
    { label: "Ju", color: "#e5e7eb", hasData: false }, // Empty
    { label: "Vi", color: "#6b8e9b", hasData: true }, // Focus
    { label: "Sá", color: "#c9a84c", hasData: true }, // Social
    { label: "Do", color: currentMood.color, hasData: true }, // Today
  ];

  const isPremium = false; // Mock data for now

  const michelinRecipes = [
    {
      id: "michelin-1",
      title: "Tartar de remolacha con kombucha y trufa negra",
      image: "https://images.unsplash.com/photo-1544025162-83155708cb8e?q=80&w=800&auto=format&fit=crop",
      moodMatch: currentMood.nombre,
      functionalBenefit: "Lion's Mane · Claridad mental"
    },
    {
      id: "michelin-2",
      title: "Consomé cristalino de hongos fermentados",
      image: "https://images.unsplash.com/photo-1548943487-a2e4b43b584d?q=80&w=800&auto=format&fit=crop",
      moodMatch: currentMood.nombre,
      functionalBenefit: "Reishi · Modulación del estrés"
    },
    {
      id: "michelin-3",
      title: "Milhojas de tupinambo asado con emulsión de azafrán",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop",
      moodMatch: currentMood.nombre,
      functionalBenefit: "Prebióticos · Equilibrio microbiota"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-24">
        
        {/* 1. HEADER */}
        <header className="flex flex-col gap-4">
          <p className="font-serif text-2xl font-bold text-aubergine">
            Food<span className="text-[#C9A84C]">·</span>Mood
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-aubergine-dark leading-[1.15]">
            {isAuthenticated && user?.name
              ? <>Hola, {user.name.split(' ')[0]}. ¿Qué te apetece hoy?</>
              : <>Hola. ¿Qué te apetece hoy?</>}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px bg-[#C9A84C] opacity-40 w-16"></div>
            <p className="text-aubergine/80 font-serif font-light italic tracking-wide">
              {todayFormatted}
            </p>
          </div>
        </header>

        {/* 2. MOOD ACTUAL */}
        <section className="flex flex-col gap-8">
          <div
            className="rounded-[1.5rem] p-10 md:p-14 shadow-sm transition-all duration-300 relative overflow-hidden border-l-[12px] border-[#C9A84C]"
            style={{ backgroundColor: `${currentMood.color}15` }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 z-10 relative">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-px bg-[#C9A84C]"></div>
                  <h2 className="text-[10px] font-bold text-aubergine-dark/60 uppercase tracking-[0.2em]">
                    Tus sensaciones de hoy
                  </h2>
                </div>
                <h3 className="text-5xl md:text-6xl font-serif font-black text-aubergine-dark mb-4 drop-shadow-sm">
                  {currentMood.nombre}
                </h3>
                <p className="text-xl md:text-2xl text-aubergine-dark/80 font-light leading-[1.6]">
                  {taglines[currentMood.id] || currentMood.descripcion_corta}
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <button
                  onClick={() => {
                    if (monthlyRecipe) {
                      document.getElementById('receta-del-dia')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handleGenerateTodayRecipe();
                    }
                  }}
                  disabled={isGenerating || !isAuthenticated}
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-aubergine-dark text-white font-medium text-sm tracking-wide shadow-luxury hover:bg-aubergine transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 text-[#C9A84C]" /> Receta del día</>
                  )}
                </button>
                <Link
                  href="/test"
                  onClick={() => resetQuiz()}
                  className="inline-flex items-center justify-center px-10 py-3 border border-aubergine-dark/20 rounded-full text-aubergine-dark/70 bg-transparent hover:bg-cream hover:border-[#C9A84C] hover:text-aubergine-dark font-light text-xs tracking-wide transition-all"
                >
                  ¿Cambió tu mood?
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 MICHELIN RECIPES */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest">
                {!isPremium && <Lock className="w-3 h-3" />}
                Premium
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-aubergine-dark">
              Alta cocina funcional
            </h2>
            <p className="text-aubergine-dark/60 font-light text-sm md:text-base">
              Recetas inspiradas en estrellas Michelin, diseñadas para tu mood
            </p>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 md:px-0 md:mx-0 scrollbar-hide">
              {michelinRecipes.map((recipe, idx) => (
                <div key={idx} className="relative shrink-0 w-[85vw] md:w-[340px] snap-center">
                  <div className={`flex flex-col h-full bg-cream rounded-[1.5rem] border border-aubergine-dark/10 shadow-sm overflow-hidden transition-all ${!isPremium ? 'blur-sm opacity-90 select-none' : 'hover:shadow-md cursor-pointer'}`}>
                    <div className="h-48 relative overflow-hidden">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-aubergine-dark text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                          {recipe.moodMatch}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1 gap-6">
                      <span className="self-start text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] flex items-center gap-1.5 border-b border-[#C9A84C]/30 pb-1">
                        <Sparkles className="w-3 h-3" /> Técnica Michelin
                      </span>
                      <h3 className="text-xl font-serif font-bold text-aubergine-dark leading-[1.3] min-h-[52px]">
                        {recipe.title}
                      </h3>
                      <div className="mt-auto pt-6 border-t border-aubergine-dark/10">
                        <span className="text-[11px] font-sans font-medium text-aubergine-dark/60 bg-aubergine-dark/5 px-3 py-1.5 rounded-lg border border-aubergine-dark/10 inline-block">
                          {recipe.functionalBenefit}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle blur overlay – no per-card button */}
                  {!isPremium && (
                    <div className="absolute inset-0 z-10 bg-cream/10 backdrop-blur-[2px] rounded-[1.5rem]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Single CTA below the carousel */}
          {!isPremium && (
            <div className="flex flex-col items-center gap-3 pt-2">
              <button className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-aubergine-dark text-white font-medium text-sm tracking-wide shadow-luxury hover:bg-aubergine transition-colors border border-white/10">
                <Lock className="w-4 h-4 text-[#C9A84C]" />
                Desbloquea Premium · $4.99 / mes
              </button>
              <p className="text-xs text-aubergine-dark/40 font-sans tracking-wide">Alta cocina funcional, sin límites</p>
            </div>
          )}
        </section>

        {/* 3. RECETA DEL DÍA / IA */}
        <section id="receta-del-dia" className="flex flex-col gap-8 scroll-mt-8">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
              Tu antojo para hoy
            </h2>
            <div className="h-px bg-[#C9A84C] flex-1 opacity-20"></div>
          </div>
          
          <div className="bg-cream rounded-[1.5rem] p-10 border border-aubergine-dark/20 shadow-sm flex flex-col justify-center min-h-[200px]">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-full text-aubergine-dark/50">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : monthlyRecipe ? (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Generada por tu IA Food·Mood
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif font-black text-gray-900">
                      {monthlyRecipe.title}
                    </h3>
                    {monthlyRecipe.tagline && (
                      <p className="text-aubergine-dark/60 italic font-light text-base">&quot;{monthlyRecipe.tagline}&quot;</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-700 font-light mt-2 uppercase tracking-wider">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                        {monthlyRecipe.prepTime} min
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                        {monthlyRecipe.difficulty}
                      </span>
                      {monthlyRecipe.servings && (
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                          {monthlyRecipe.servings} px
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className={`inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-sans font-medium transition-colors shrink-0 ${isFavorite ? 'text-red-500' : 'text-aubergine-dark/50 hover:text-aubergine-dark'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Favorita' : 'Guardar'}
                  </button>
                </div>

                {/* Ingredientes + Pasos */}
                {(monthlyRecipe.ingredients || monthlyRecipe.steps) && (
                  <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-aubergine-dark/10">
                    {monthlyRecipe.ingredients && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/50 mb-4">Ingredientes</h4>
                        <ul className="space-y-2">
                          {monthlyRecipe.ingredients.map((ing: any, i: number) => (
                            <li key={i} className="flex justify-between border-b border-aubergine-dark/10 pb-2 text-sm font-light text-aubergine-dark/80">
                              <span>{ing.name}</span>
                              <span className="font-medium text-aubergine-dark">{ing.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {monthlyRecipe.steps && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/50 mb-4">Preparación</h4>
                        <ol className="space-y-3 list-decimal list-outside pl-4">
                          {monthlyRecipe.steps.map((step: string, i: number) => (
                            <li key={i} className="text-sm font-light text-aubergine-dark/80 leading-relaxed pl-1">{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Food·Mood Note */}
                {monthlyRecipe.foodMoodNote && (
                  <div className="bg-[#C9A84C]/5 p-5 rounded-xl border-l-2 border-[#C9A84C] text-sm font-light text-aubergine-dark/80 italic">
                    🧠 {monthlyRecipe.foodMoodNote}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-6">
                <p className="font-serif text-xl md:text-2xl text-aubergine-dark/80 max-w-lg font-light leading-[1.6]">
                  Aún no le has dado un capricho a tus sentidos hoy.<br/>¿Preparamos algo especial?
                </p>
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleGenerateTodayRecipe}
                    disabled={!isAuthenticated || isGenerating}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-aubergine-dark text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-aubergine transition-colors tracking-wide"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Hacer magia ahora mismo
                        <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                      </>
                    )}
                  </button>
                  {!isAuthenticated && (
                    <Link href="/auth/register" className="text-xs text-aubergine-dark/50 hover:text-aubergine-dark font-sans tracking-wide mt-2">
                      Crea cuenta para no perderte ni una receta →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
          {/* 4. HISTORIAL */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-semibold text-aubergine-dark/40 uppercase tracking-[0.2em]">
                Balance Semanal
              </h2>
            </div>
            <div className="bg-cream rounded-[1.5rem] p-10 border border-aubergine-dark/20 shadow-sm flex flex-col justify-center h-full gap-10">
              <div className="flex justify-between items-center w-full px-2">
                {historyDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-5">
                    <div 
                      className={`w-3 h-12 rounded-full transition-all ${!day.hasData ? "opacity-20" : "shadow-inner border border-black/5"}`}
                      style={{ backgroundColor: day.hasData ? day.color : "#d1d5db" }}
                    />
                    <span className="text-[10px] text-aubergine-dark/40 font-medium uppercase tracking-widest">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. ESTADÍSTICAS */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-semibold text-aubergine-dark/40 uppercase tracking-[0.2em]">
                Métricas
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-aubergine-dark/50 font-medium tracking-[0.2em] uppercase">Evaluaciones</span>
                <span className="text-4xl font-serif text-[#C9A84C] mt-6">{quizCount || 3}</span>
              </div>
              <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/20 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-aubergine-dark/50 font-medium tracking-[0.2em] uppercase">Tendencia</span>
                <span className="text-2xl font-serif text-aubergine-dark mt-6 italic">Focus</span>
              </div>
            </div>
          </section>
        </div>

        {/* 6. INFO IA */}
        <section className="mt-8 flex justify-center">
          <div className="bg-aubergine-dark/5 rounded-[1.5rem] p-8 md:p-10 shadow-sm border border-aubergine-dark/10 max-w-2xl text-center">
            <p className="font-serif italic text-aubergine-dark/90 text-lg md:text-xl font-light leading-[1.6]">
              &quot;No contamos calorías, contamos momentos. Food·Mood escucha lo que te pide el cuerpo para crear combinaciones únicas, vibrantes y pensadas para disfrutar cada bocado.&quot;
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
