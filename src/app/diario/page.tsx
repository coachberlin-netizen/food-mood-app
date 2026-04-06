"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { createRecetasClient } from "@/lib/supabase/recetas";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { 
  Plus, Save, ChevronRight, ArrowLeft, 
  Sparkles, History, Calendar, Smile,
  Activity, Info, Loader2, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const MOOD_MAP: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  activacion: { label: "Activación", emoji: "⚡", color: "#d4856e", bg: "#fdf0ec" },
  calma:      { label: "Calma",      emoji: "🌿", color: "#8a80a8", bg: "#f3f0f8" },
  focus:      { label: "Focus",      emoji: "🧠", color: "#3d7a5f", bg: "#e8f5e9" },
  social:     { label: "Social",     emoji: "🥂", color: "#c9a67e", bg: "#fdf5ec" },
  reset:      { label: "Reset",      emoji: "🍋", color: "#5bb0ad", bg: "#e6f5f4" },
  familia:    { label: "Familia",    emoji: "👨‍👩‍👧", color: "#b89a52", bg: "#f5efd8" },
};

export default function DiarioPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { resultMood } = useQuizStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState("");
  const [weeklyHistory, setWeeklyHistory] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function init() {
      // Auth check
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/test");
        return;
      }
      
      await fetchHistory(session.user.id);
      setLoading(false);
    }
    init();
  }, [router]);

  async function fetchHistory(userId: string) {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    
    // Fetch last 7 days of logs
    const { data: logs } = await supabase
      .from("mood_diary")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (logs) {
      setWeeklyHistory(logs);
      const todayLog = logs.find(l => l.date === today || l.created_at.startsWith(today));
      if (todayLog) {
        setTodayRecord(todayLog);
        setSelectedMood(todayLog.mood);
        setIntensity(todayLog.intensity || 3);
        setNotes(todayLog.notes || "");
      }
    }
  }

  async function handleSave() {
    if (!selectedMood || saving) return;
    setSaving(true);
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const payload = {
      user_id: user.id,
      mood: selectedMood,
      intensity,
      notes,
      date: today
    };

    try {
      let error;
      if (todayRecord) {
        ({ error } = await supabase
          .from("mood_diary")
          .update(payload)
          .eq("id", todayRecord.id));
      } else {
        ({ error } = await supabase
          .from("mood_diary")
          .insert(payload));
      }

      if (error) throw error;

      // Fetch recommendation
      await fetchRecommendation(selectedMood);
      
      setShowSuccess(true);
      await fetchHistory(user.id);
      
      setTimeout(() => {
        const el = document.getElementById("recommendation-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 500);

    } catch (err) {
      console.error("Error saving diary:", err);
    } finally {
      setSaving(false);
    }
  }

  async function fetchRecommendation(moodId: string) {
    const { getRecipeRecommendationByMood } = await import("@/lib/daily-inspiration");
    const supabase = createClient();
    const recetasClient = createRecetasClient();
    
    // Simple mock context
    const userContext: any = { id: user?.id, tier: 'registrado free' };
    
    // Map moodId to keyword if needed
    const keyword = moodId.charAt(0).toUpperCase() + moodId.slice(1);
    
    const rec = await getRecipeRecommendationByMood(supabase, recetasClient, userContext, keyword, 'diary_log');
    setRecommendation(rec);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5C1A1A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-20">
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* Header */}
        <header className="flex flex-col gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-sm text-[#5C1A1A]/50 hover:text-[#5C1A1A] transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#5C1A1A] leading-tight">
            Diario de <span className="text-[#C9A84C]">Mood</span>
          </h1>
          <p className="text-lg text-[#5C1A1A]/70 font-light max-w-md">
            Registrar cómo te sientes es el primer paso para nutrir tu equilibrio interno.
          </p>
        </header>

        {/* Form Section */}
        <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#5C1A1A]/5 flex flex-col gap-10">
          
          {/* Mood Selector */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Smile className="w-5 h-5 text-[#C9A84C]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#5C1A1A]/80">
                ¿Cómo te sientes hoy?
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(MOOD_MAP).map(([id, info]) => (
                <button
                  key={id}
                  onClick={() => setSelectedMood(id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 border-2 ${
                    selectedMood === id 
                      ? "border-[#C9A84C] bg-[#C9A84C]/5 shadow-md scale-[1.02]" 
                      : "border-transparent bg-[#F5F0E8]/50 hover:bg-[#F5F0E8] grayscale-[0.3] opacity-70"
                  }`}
                >
                  <span className="text-2xl">{info.emoji}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-tighter ${selectedMood === id ? "text-[#5C1A1A]" : "text-[#5C1A1A]/40"}`}>
                    {info.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#5C1A1A]/80">
                  Intensidad
                </h2>
              </div>
              <span className="text-2xl font-serif text-[#C9A84C] font-bold">{intensity}</span>
            </div>
            <div className="px-2">
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#F5F0E8] rounded-full appearance-none cursor-pointer accent-[#C9A84C]"
              />
              <div className="flex justify-between mt-3 text-[10px] text-[#5C1A1A]/30 uppercase font-bold tracking-widest">
                <span>Leve</span>
                <span>Muy intensa</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#C9A84C]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#5C1A1A]/80">
                Notas (opcional)
              </h2>
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Qué ha pasado hoy? ¿Qué has comido? ¿Cómo has dormido?"
              className="w-full h-32 bg-[#F5F0E8]/30 rounded-2xl p-4 border border-[#5C1A1A]/10 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 text-[#5C1A1A] font-light text-sm resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!selectedMood || saving}
            className="w-full py-5 rounded-2xl bg-[#5C1A1A] text-white font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-[#4a1515] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#5C1A1A]/10 group"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {todayRecord ? "Actualizar registro" : "Guardar sensaciones"}
              </>
            )}
          </button>
        </section>

        {/* Recommendation Section */}
        <AnimatePresence>
          {recommendation && (
            <motion.section
              id="recommendation-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#5C1A1A]/60">
                  Ideal para tu estado actual
                </h2>
              </div>
              <div className="bg-[#5C1A1A] rounded-[2rem] p-8 text-white shadow- luxury relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-3xl opacity-50" />
                <div className="relative flex flex-col gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                    RECOMENDACIÓN INSTANTÁNEA
                  </span>
                  <h3 className="text-2xl font-serif font-bold italic">
                    {recommendation.nombre_es}
                  </h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed">
                    Basándonos en tu {selectedMood} de intensidad {intensity}, esta receta ayudará a regular tu eje intestino-cerebro.
                  </p>
                  <Link 
                    href={`/recetas/${recommendation.id}`}
                    className="flex items-center gap-2 text-sm font-semibold text-[#C9A84C] hover:text-[#d4b96a] transition-colors mt-2"
                  >
                    Ver preparación completa <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* History Section */}
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-[#C9A84C]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#5C1A1A]/60">
                Historial reciente
              </h2>
            </div>
          </div>
          
          {weeklyHistory.length > 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-[#5C1A1A]/5 shadow-sm space-y-4">
              {weeklyHistory.slice(0, 7).map((log, i) => {
                const moodInfo = MOOD_MAP[log.mood];
                const dateHeader = new Date(log.created_at).toLocaleDateString("es-ES", {
                  day: "numeric", month: "short", weekday: "short"
                });
                return (
                  <div key={log.id} className="flex items-center justify-between py-3 border-b border-[#5C1A1A]/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F0E8] text-lg">
                        {moodInfo?.emoji}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#5C1A1A] capitalize">{dateHeader}</span>
                        <span className="text-[10px] text-[#5C1A1A]/40 uppercase tracking-tighter">{moodInfo?.label} · Nivel {log.intensity}</span>
                      </div>
                    </div>
                    {log.notes && (
                      <div className="hidden sm:block text-[11px] text-[#5C1A1A]/50 italic max-w-[200px] truncate">
                        &quot;{log.notes}&quot;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/50 rounded-3xl p-12 text-center border-2 border-dashed border-[#5C1A1A]/10">
              <Calendar className="w-12 h-12 text-[#5C1A1A]/10 mx-auto mb-4" />
              <p className="text-sm font-light text-[#5C1A1A]/40">
                Aún no tienes un historial. Empieza registrando tu mood de hoy.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
