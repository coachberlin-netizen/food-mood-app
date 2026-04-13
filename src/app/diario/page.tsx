"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { usePalette } from "@/contexts/PaletteContext";
import { 
  analyzeWeek, 
  analyzeMonth, 
  type DiaryEntry,
  type WeeklyAnalysis,
  type MonthlyAnalysis
} from "@/lib/diary-analysis";
import { WeekMosaic } from "@/components/diary/WeekMosaic";
import { MonthMosaic } from "@/components/diary/MonthMosaic";
import { QuickLog } from "@/components/diary/QuickLog";
import { ChevronDown, ChevronUp, Lock, Sparkles, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";

// Mood to Color Map for QuickLog logic (internal fallback)
const MOOD_COLORS: Record<string, string> = {
  activacion: '#E8A87C',
  calma:      '#7EC8C8',
  focus:      '#F4E285',
  social:     '#F4A7B9',
  reset:      '#B8A9C9',
  confort:    '#D4A574'
};

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export default function DiarioPage() {
  const { currentPalette, refreshPalette } = usePalette();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Data States
  const [weekAnalysis, setWeekAnalysis] = useState<WeeklyAnalysis | null>(null);
  const [monthAnalysis, setMonthAnalysis] = useState<(MonthlyAnalysis & { moodGrid: string[][]; monthName: string }) | null>(null);
  const [historyMonths, setHistoryMonths] = useState<any[]>([]);
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async (userId: string) => {
    // 1. Fetch data for analysis
    // We fetch last 120 days to cover past 3 months
    const { data: allEntries, error } = await supabase
      .from("emotional_palettes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Error fetching diary data:", error);
      return;
    }

    // Map DB rows to DiaryEntry type
    const mappedEntries: DiaryEntry[] = allEntries.map(e => ({
      id: e.id,
      created_at: e.created_at,
      energia: e.energia,
      calma: e.serenidad || e.calma || 5,
      claridad: e.claridad,
      conexion: e.conexion,
      mood_dominante: e.mood_dominante,
      mood_secundario: e.mood_secundario,
      color_resultado: e.color_resultado,
      nota: e.nota,
      receta_cocinada: e.recetas_sugeridas?.[0] || null,
      dia_semana: new Date(e.created_at).toLocaleDateString("es-ES", { weekday: "long" })
    }));

    // Weekly Analysis (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyEntries = mappedEntries.filter(e => new Date(e.created_at) >= weekStart);
    setWeekAnalysis(analyzeWeek(weeklyEntries));

    // Monthly Analysis (current month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEntries = mappedEntries.filter(e => new Date(e.created_at) >= monthStart);
    
    // Group monthly entries into weeks for MonthMosaic
    const groupedMonth = groupEntriesByWeek(monthlyEntries, now.getFullYear(), now.getMonth());
    const mAnalysis = analyzeMonth([analyzeWeek(monthlyEntries)]); // Simplified for standard call
    
    setMonthAnalysis({
      ...mAnalysis,
      colorGrid: groupedMonth.colorGrid,
      moodGrid: groupedMonth.moodGrid,
      monthName: `${now.toLocaleString('es-ES', { month: 'long' })} ${now.getFullYear()}`
    } as any);

    // History (Past 3 months)
    const history = [];
    for (let i = 1; i <= 3; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mEntries = mappedEntries.filter(e => {
            const ed = new Date(e.created_at);
            return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        });
        if (mEntries.length > 0) {
            const grouped = groupEntriesByWeek(mEntries, d.getFullYear(), d.getMonth());
            const analysis = analyzeMonth([analyzeWeek(mEntries)]);
            history.push({
                id: `${d.getFullYear()}-${d.getMonth()}`,
                name: d.toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
                analysis: {
                    ...analysis,
                    colorGrid: grouped.colorGrid,
                    moodGrid: grouped.moodGrid
                },
                distribution: analysis.moodDistribution
            });
        }
    }
    setHistoryMonths(history);

  }, [supabase]);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      // Premium Check Pattern
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", session.user.id)
        .single();
      
      const isPrem = !!profile?.is_premium;
      setIsPremium(isPrem);

      if (isPrem) {
        await fetchData(session.user.id);
      }
      setLoading(false);
    }
    init();
  }, [supabase, fetchData]);

  const handleSaveQuickLog = async (entry: { mood: string; nota?: string }) => {
    if (!user) return;
    
    const { error } = await supabase.from("emotional_palettes").insert({
      user_id: user.id,
      mood_dominante: entry.mood,
      mood_secundario: entry.mood,
      nota: entry.nota || null,
      energia: 5,
      serenidad: 5,
      claridad: 5,
      conexion: 5,
      color_resultado: MOOD_COLORS[entry.mood] || "#E0E0E0"
    });

    if (error) {
      console.error("Error saving quick log:", error);
    } else {
      await refreshPalette();
      await fetchData(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-6 w-96 bg-gray-100 animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                <div className="h-80 bg-gray-100 animate-pulse rounded-[2rem]" />
                <div className="h-80 bg-gray-100 animate-pulse rounded-[2rem]" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-32">
      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col gap-20">
        
        {/* SECTION 1: Header */}
        <header className="flex flex-col gap-4">
          <h1 className="font-serif text-[40px] md:text-[56px] text-[#6B2D3E] leading-tight font-black">
            Tu Diario Emocional
          </h1>
          <p className="font-sans text-[18px] md:text-[22px] text-[#9CA3AF] font-light max-w-2xl leading-relaxed">
            Cada día un color. Cada semana un patrón. 
            Cada mes una historia que solo tú puedes leer.
          </p>
        </header>

        {!isPremium ? (
          /* NON-PREMIUM STATE */
          <div className="flex flex-col gap-16">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#6B2D3E]/5 flex flex-col items-center">
              <QuickLog currentPalette={currentPalette} onSave={handleSaveQuickLog} />
            </section>

            <section className="relative group">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                 <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-[#6B2D3E]/10 max-w-lg flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#6B2D3E]/5 flex items-center justify-center text-[#6B2D3E]">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-serif text-2xl text-[#6B2D3E] font-bold">Tu semana emocional te espera</h3>
                        <p className="text-gray-500 font-light">
                            Registra tu color cada día y descubre los patrones que tu mente consciente no detecta.
                        </p>
                    </div>
                    <Link 
                        href="/pricing"
                        className="bg-[#6B2D3E] text-white px-10 py-5 rounded-[60px] font-sans text-lg font-bold shadow-luxury hover:scale-105 transition-transform"
                    >
                        Desbloquear con Premium → <span className="block text-xs opacity-60 font-normal">Desde 6.99 €/mes</span>
                    </Link>
                 </div>
              </div>
              <div className="opacity-30 blur-md pointer-events-none select-none">
                <WeekMosaic 
                  colors={['#7EC8C8','#B8A9C9','#E8A87C','#7EC8C8','#F4E285','#B8A9C9','#E8A87C']}
                  labels={DAY_LABELS}
                  moods={['Calma', 'Reset', 'Activación', 'Calma', 'Focus', 'Reset', 'Activación']}
                  hasNota={[true, false, true, true, false, true, false]}
                  dominantMood="Calma"
                  dominantColor="#7EC8C8"
                  size="full"
                  animate={false}
                />
              </div>
            </section>
          </div>
        ) : (
          /* PREMIUM STATE */
          <div className="flex flex-col gap-24">
            
            {/* SECTION 2: Registro de hoy */}
            <section className="flex flex-col items-center">
              <QuickLog currentPalette={currentPalette} onSave={handleSaveQuickLog} />
            </section>

            {/* SECTION 3: Tu semana */}
            {weekAnalysis && (
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-[#C9A84C]" />
                    <h2 className="font-serif text-[28px] md:text-[32px] text-[#6B2D3E] font-bold italic">
                        Esta semana
                    </h2>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#6B2D3E]/5">
                    <WeekMosaic 
                        colors={weekAnalysis.colorSequence}
                        labels={DAY_LABELS}
                        moods={weekAnalysis.entries.map(e => e.mood_dominante)} // Approximate, mapping done by WeekMosaic usually
                        hasNota={weekAnalysis.entries.map(e => e.nota !== null)}
                        dominantMood={weekAnalysis.dominantMood}
                        dominantColor={weekAnalysis.dominantColor}
                        size="full"
                        animate={true}
                    />
                    <div className="mt-12 flex flex-col gap-4 text-center max-w-2xl mx-auto">
                        {weekAnalysis.pattern && (
                            <p className="font-sans text-[18px] text-[#6B2D3E] italic">
                                &quot;{weekAnalysis.pattern}&quot;
                            </p>
                        )}
                        <p className="font-sans text-[16px] text-[#6B7280] leading-relaxed">
                            {weekAnalysis.recommendation}
                        </p>
                    </div>
                </div>
              </section>
            )}

            {/* SECTION 4: Tu mes */}
            {monthAnalysis && (
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                    <BookOpen className="w-6 h-6 text-[#C9A84C]" />
                    <h2 className="font-serif text-[28px] md:text-[32px] text-[#6B2D3E] font-bold italic">
                        Este mes
                    </h2>
                </div>
                <MonthMosaic 
                    colorGrid={monthAnalysis.colorGrid}
                    moodGrid={monthAnalysis.moodGrid}
                    monthName={monthAnalysis.monthName}
                    moodDistribution={monthAnalysis.moodDistribution}
                    insight={monthAnalysis.insight}
                    animate={true}
                />
              </section>
            )}

            {/* SECTION 5: Historial */}
            {historyMonths.length > 0 && (
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-[#C9A84C]" />
                    <h2 className="font-serif text-[28px] md:text-[32px] text-[#6B2D3E] font-bold italic">
                        Tu historia emocional
                    </h2>
                </div>
                <div className="flex flex-col gap-4">
                    {historyMonths.map((m) => {
                        const isOpen = openMonth === m.id;
                        return (
                            <div key={m.id} className="bg-white rounded-3xl overflow-hidden border border-[#6B2D3E]/5 shadow-sm">
                                <button 
                                    onClick={() => setOpenMonth(isOpen ? null : m.id)}
                                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-8">
                                        <span className="font-sans text-lg font-bold text-[#6B2D3E] capitalize w-48">
                                            {m.name}
                                        </span>
                                        {/* Mini distribution bar */}
                                        <div className="hidden md:flex w-40 h-2 rounded-full overflow-hidden bg-gray-100">
                                            {Object.entries(m.distribution).map(([mid, count]: [string, any]) => (
                                                <div 
                                                    key={mid} 
                                                    style={{ 
                                                        width: `${(count / 30) * 100}%`, // approx
                                                        backgroundColor: MOOD_COLORS[mid] 
                                                    }} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-[#6B2D3E]/5 p-10 flex justify-center bg-gray-50/50"
                                        >
                                            <MonthMosaic 
                                                colorGrid={m.analysis.colorGrid}
                                                moodGrid={m.analysis.moodGrid}
                                                monthName={m.name}
                                                moodDistribution={m.analysis.moodDistribution}
                                                insight={m.analysis.insight}
                                                animate={false}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
              </section>
            )}
            
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * Helper to group entries into 5 weeks for MonthMosaic
 */
function groupEntriesByWeek(entries: DiaryEntry[], year: number, month: number) {
    const colorGrid: string[][] = Array(5).fill(null).map(() => Array(7).fill("#E0E0E0"));
    const moodGrid: string[][] = Array(5).fill(null).map(() => Array(7).fill(""));

    // Find first Monday of the month (grid starts at week alignment)
    const firstDayOfMonth = new Date(year, month, 1);
    let startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // 0=Mon...6=Sun

    entries.forEach(e => {
        const d = new Date(e.created_at);
        if (d.getMonth() === month && d.getFullYear() === year) {
            const day = d.getDate();
            const totalIndex = day + startOffset - 1;
            const weekIdx = Math.floor(totalIndex / 7);
            const dayIdx = totalIndex % 7;
            
            if (weekIdx < 5) {
                colorGrid[weekIdx][dayIdx] = e.color_resultado;
                moodGrid[weekIdx][dayIdx] = e.mood_dominante;
            }
        }
    });

    return { colorGrid, moodGrid };
}
