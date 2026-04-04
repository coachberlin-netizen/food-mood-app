"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const MOOD_OPTIONS = [
  { id: "energia", label: "Energía", emoji: "⚡", color: "#D97706" },
  { id: "calma",   label: "Calma",   emoji: "🌿", color: "#6B8E6B" },
  { id: "focus",   label: "Focus",   emoji: "🎯", color: "#0D9488" },
  { id: "social",  label: "Social",  emoji: "🤝", color: "#BE185D" },
  { id: "reset",   label: "Reset",   emoji: "🔄", color: "#65A30D" },
  { id: "familia", label: "Familia", emoji: "👨‍👩‍👧", color: "#6366F1" },
];

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export function MoodDiary() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayMoodId, setTodayMoodId] = useState<string | null>(null);
  const [weeklyHistory, setWeeklyHistory] = useState<(string | null)[]>(new Array(7).fill(null));

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }
      
      setUser(session.user);
      await fetchDiaryData(session.user.id);
      setLoading(false);
    }
    init();
  }, []);

  async function fetchDiaryData(userId: string) {
    const supabase = createClient();
    
    // Get weekly history (last 7 days from Monday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const { data: diaryLogs } = await supabase
      .from("mood_diary")
      .select("mood, created_at")
      .eq("user_id", userId)
      .gte("created_at", monday.toISOString())
      .order("created_at", { ascending: true });

    const newHistory: (string | null)[] = new Array(7).fill(null);
    const today = new Date().toISOString().split("T")[0];

    if (diaryLogs) {
      diaryLogs.forEach((log: any) => {
        const logDate = new Date(log.created_at);
        const logDayStr = logDate.toISOString().split("T")[0];
        
        // Check if it's today
        if (logDayStr === today) {
          setTodayMoodId(log.mood);
        }
        
        // Plot in weekly grid (1=Mon...7=Sun)
        let dow = logDate.getDay();
        dow = (dow === 0) ? 6 : dow - 1; // 0=Mon...6=Sun
        if (dow >= 0 && dow < 7) {
          newHistory[dow] = log.mood;
        }
      });
    }
    setWeeklyHistory(newHistory);
  }

  async function handleMoodSelect(moodId: string) {
    if (!user || saving) return;
    setSaving(true);
    
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    try {
      // Check if entry for today exists
      const { data: existing } = await supabase
        .from("mood_diary")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", today + "T00:00:00")
        .lte("created_at", today + "T23:59:59")
        .single();

      if (existing) {
        await supabase
          .from("mood_diary")
          .update({ mood: moodId })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("mood_diary")
          .insert({ user_id: user.id, mood: moodId });
      }

      setTodayMoodId(moodId);
      await fetchDiaryData(user.id);
    } catch (err) {
      console.error("Error saving mood:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <section className="flex flex-col gap-6 opacity-60">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
            Diario de Mood
          </h2>
          <div className="h-px bg-aubergine-dark flex-1 opacity-10"></div>
        </div>
        <div className="bg-cream/50 rounded-2xl p-8 border border-aubergine-dark/10 text-center">
          <p className="text-sm font-light text-aubergine-dark/50">
            Registra tu estado cada día. Inicia sesión para activar tu diario.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
          Tu diario de mood
        </h2>
        <div className="h-px bg-[#C9A84C] flex-1 opacity-20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="md:col-span-2 bg-cream rounded-2xl p-8 border border-aubergine-dark/15 shadow-sm">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  todayMoodId === mood.id
                    ? "bg-aubergine-dark text-white border-aubergine-dark shadow-md"
                    : "bg-white text-aubergine-dark/60 border-aubergine-dark/10 hover:border-aubergine-dark/25"
                }`}
              >
                <span className="text-sm">{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
            {saving && <Loader2 className="w-4 h-4 animate-spin self-center ml-2 text-aubergine-dark/40" />}
          </div>
        </div>

        {/* History dots */}
        <div className="bg-cream rounded-2xl p-8 border border-aubergine-dark/15 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-end gap-1 px-1">
            {DAY_LABELS.map((label, i) => {
              const dayMoodId = weeklyHistory[i];
              const mood = MOOD_OPTIONS.find(m => m.id === dayMoodId);
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                      mood ? "bg-white shadow-inner border border-black/5" : "bg-aubergine-dark/5"
                    }`}
                    title={mood?.label || "Sin registro"}
                  >
                    {mood ? mood.emoji : "•"}
                  </div>
                  <span className="text-[9px] font-bold text-aubergine-dark/30 uppercase">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
