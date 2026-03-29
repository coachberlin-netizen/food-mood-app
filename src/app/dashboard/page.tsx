"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { recipesData } from "@/data/recipes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { resultMood, quizCount, syncFromSupabase } = useQuizStore();
  const [mounted, setMounted] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState<typeof recipesData[0] | null>(null);

  useEffect(() => {
    setMounted(true);
    syncFromSupabase();
    
    // Select random recipe based on current mood
    const currentMoodId = resultMood || "social";
    const moodRecipes = recipesData.filter((r) => r.moodId === currentMoodId);
    
    if (moodRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * moodRecipes.length);
      setRandomRecipe(moodRecipes[randomIndex]);
    } else {
      setRandomRecipe(recipesData[0]);
    }
  }, [syncFromSupabase, resultMood]);

  if (!mounted) return null;

  // 1. DATA PREPARATION
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1);

  const currentMoodId = resultMood || "social";
  const currentMood = moods.find((m) => m.id === currentMoodId) || moods[0];

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

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-24">
        
        {/* 1. HEADER */}
        <header className="flex flex-col gap-4">
          <p className="font-serif text-2xl font-semibold text-[#1B2A49]">
            Food<span className="text-[#D4AF37]">·</span>Mood
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-[#1B2A49] leading-[1.15]">
            Hola. Tu intestino tiene algo que decirte.
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px bg-[#D4AF37] opacity-40 w-16"></div>
            <p className="text-[#1B2A49]/60 font-serif italic tracking-wide">
              {todayFormatted}
            </p>
          </div>
        </header>

        {/* 2. MOOD ACTUAL */}
        <section className="flex flex-col gap-8">
          <div
            className="rounded-[1.5rem] p-10 md:p-14 shadow-sm transition-all duration-300 relative overflow-hidden border-l-[12px] border-[#D4AF37]"
            style={{ backgroundColor: `${currentMood.color}15` }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 z-10 relative">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-px bg-[#D4AF37]"></div>
                  <h2 className="text-xs font-semibold text-[#1B2A49]/60 uppercase tracking-[0.2em]">
                    Tu mood de hoy
                  </h2>
                </div>
                <h3 className="text-5xl font-serif text-[#1B2A49] mb-4">
                  {currentMood.nombre}
                </h3>
                <p className="text-xl text-[#1B2A49]/80 font-light leading-relaxed">
                  {currentMood.descripcion_corta}
                </p>
              </div>
              <Link
                href="/test"
                className="inline-flex items-center justify-center px-10 py-4 border border-[#1B2A49]/20 rounded-full text-[#1B2A49] bg-white/50 transition-all hover:bg-white hover:border-[#D4AF37] font-light text-base tracking-widest uppercase whitespace-nowrap backdrop-blur-sm shadow-sm"
              >
                Volver a evaluar
              </Link>
            </div>
          </div>
        </section>

        {/* 3. RECETA DEL DÍA */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-semibold text-[#1B2A49]/40 uppercase tracking-[0.2em]">
              Nutrición recomendada
            </h2>
            <div className="h-px bg-[#D4AF37] flex-1 opacity-20"></div>
          </div>
          <div className="bg-white rounded-[1.5rem] p-10 border border-[#edeae3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl font-serif text-[#1B2A49] group-hover:text-[#D4AF37] transition-colors">
                {randomRecipe?.title || "Receta no disponible"}
              </h3>
              <div className="flex items-center gap-6 text-sm text-[#1B2A49]/60 font-light mt-2 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#D4AF37]"></span>
                  {randomRecipe?.prepTime || "0 min"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#D4AF37]"></span>
                  {randomRecipe?.difficulty || "Fácil"}
                </span>
              </div>
            </div>
            <Link
              href={randomRecipe ? `/recetas/${randomRecipe.id}` : "#"}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#D4AF37]/50 text-[#1B2A49] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-all font-light text-sm tracking-wide whitespace-nowrap shadow-sm"
            >
              Ver menú completo
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
          {/* 4. HISTORIAL */}
          <section className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-semibold text-[#1B2A49]/40 uppercase tracking-[0.2em]">
                Balance Semanal
              </h2>
            </div>
            <div className="bg-white rounded-[1.5rem] p-10 border border-[#edeae3] shadow-sm flex flex-col justify-center h-full gap-10">
              <div className="flex justify-between items-center w-full px-2">
                {historyDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-5">
                    <div 
                      className={`w-3 h-12 rounded-full transition-all ${!day.hasData ? "opacity-20" : "shadow-inner border border-black/5"}`}
                      style={{ backgroundColor: day.hasData ? day.color : "#d1d5db" }}
                    />
                    <span className="text-[10px] text-[#1B2A49]/40 font-medium uppercase tracking-widest">
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
              <h2 className="text-xs font-semibold text-[#1B2A49]/40 uppercase tracking-[0.2em]">
                Métricas
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-white rounded-[1.5rem] p-8 border border-[#edeae3] shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-[#1B2A49]/50 font-medium tracking-[0.2em] uppercase">Evaluaciones</span>
                <span className="text-4xl font-serif text-[#D4AF37] mt-6">{quizCount || 3}</span>
              </div>
              <div className="bg-white rounded-[1.5rem] p-8 border border-[#edeae3] shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-[#1B2A49]/50 font-medium tracking-[0.2em] uppercase">Tendencia</span>
                <span className="text-2xl font-serif text-[#1B2A49] mt-6 italic">Focus</span>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
