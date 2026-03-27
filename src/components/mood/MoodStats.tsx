"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { Flame, Activity, PieChart } from "lucide-react";

export function MoodStats() {
  const { moodHistory } = useQuizStore();
  
  if (moodHistory.length === 0) return null;

  // 1. Estado más frecuente (últimos 30 días)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const recentHistory = moodHistory.filter(entry => new Date(entry.timestamp) >= last30Days);
  
  const moodCounts = recentHistory.reduce((acc, curr) => {
    acc[curr.moodId] = (acc[curr.moodId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentId = Object.keys(moodCounts).sort((a,b) => moodCounts[b] - moodCounts[a])[0];
  const mostFrequentMood = moods.find(m => m.id === mostFrequentId);

  // 2. Racha actual
  let currentStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0,0,0,0);
  
  // Create a localized array of dates for easy checking
  const historyDates = moodHistory.map(entry => {
    const d = new Date(entry.timestamp);
    d.setHours(0,0,0,0);
    return d.getTime();
  });

  // Start with today, if not tracked today, check yesterday
  if (historyDates.includes(checkDate.getTime())) {
    currentStreak++;
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      if (historyDates.includes(checkDate.getTime())) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    // maybe checked yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (historyDates.includes(checkDate.getTime())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white p-8 rounded-xl border border-[#edeae3] shadow-luxury flex flex-col items-start hover:shadow-luxury-hover transition-all duration-300">
        <Activity className="w-5 h-5 text-navy/30 mb-8" />
        <div className="flex items-center gap-2">
          {mostFrequentMood && (
             <span className="text-3xl filter drop-shadow-sm">{mostFrequentMood.emoji}</span>
          )}
          <p className="text-4xl font-serif text-navy">{mostFrequentMood?.nombre || "-"}</p>
        </div>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/50 mt-4">Mood Mensual</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-[#edeae3] shadow-luxury flex flex-col items-start hover:shadow-luxury-hover transition-all duration-300">
        <Flame className="w-5 h-5 text-navy/30 mb-8" />
        <p className="text-4xl font-serif text-navy flex items-baseline gap-2">
          {currentStreak}
          <span className="text-sm font-sans text-navy/50">días</span>
        </p>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/50 mt-4">Racha Actual</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-[#edeae3] shadow-luxury flex flex-col justify-between hover:shadow-luxury-hover transition-all duration-300">
        <PieChart className="w-5 h-5 text-navy/30 mb-6" />
        <div className="flex h-4 w-full rounded-full overflow-hidden mt-2 border border-black/5">
          {Object.entries(moodCounts).map(([id, count]) => {
             const m = moods.find(x => x.id === id);
             const width = `${(count / recentHistory.length) * 100}%`;
             return <div key={id} style={{ width, backgroundColor: m?.color }} title={`${m?.nombre}: ${count}`} />
          })}
        </div>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/50 mt-4">Distribución (30d)</p>
      </div>
    </div>
  );
}
