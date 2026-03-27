"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { TrendingUp } from "lucide-react";

export function MoodTrend() {
  const { moodHistory } = useQuizStore();

  if (moodHistory.length < 2) {
    return (
      <div className="bg-white p-12 rounded-xl border border-[#edeae3] text-center shadow-luxury">
        <TrendingUp className="w-6 h-6 text-navy/20 mx-auto mb-6" />
        <h3 className="text-[11px] font-sans tracking-[0.2em] uppercase text-navy/40 mb-3">Tendencia</h3>
        <p className="text-navy/60 text-sm font-light">Registra al menos 2 días para ver tu evolución gráfica.</p>
      </div>
    );
  }

  // Last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const recentEntries = moodHistory
    .filter(e => new Date(e.timestamp) >= thirtyDaysAgo)
    .sort((a,b) => a.timestamp - b.timestamp);

  if (recentEntries.length < 2) return null;

  // Map moods to Y positions (0 to 5)
  const moodYMap = Object.fromEntries(moods.map((m, i) => [m.id, i]));
  
  // Create SVG points
  const w = 400;
  const h = 200;
  const paddingX = 20;
  const paddingY = 20;
  
  const usableW = w - (paddingX * 2);
  const usableH = h - (paddingY * 2);

  const tStart = recentEntries[0].timestamp;
  const tEnd = recentEntries[recentEntries.length - 1].timestamp;
  const tRange = tEnd - tStart || 1;

  const points = recentEntries.map((entry) => {
    const x = paddingX + ((entry.timestamp - tStart) / tRange) * usableW;
    const yIndex = moodYMap[entry.moodId] || 0;
    // inverse Y so 0 is at bottom
    const y = paddingY + usableH - ((yIndex / 5) * usableH);
    return `${x},${y}`;
  }).join(" ");

  // Tendency text (predominant this week)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const weekEntries = recentEntries.filter(e => new Date(e.timestamp) >= last7Days);
  
  let trendText = "";
  if (weekEntries.length > 0) {
    const counts = weekEntries.reduce((acc, curr) => {
      acc[curr.moodId] = (acc[curr.moodId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topId = Object.keys(counts).sort((a,b) => counts[b] - counts[a])[0];
    const topMood = moods.find(m => m.id === topId);
    if(topMood) trendText = `Esta semana predomina ${topMood.nombre}`;
  }

  return (
    <div className="bg-white p-10 rounded-xl shadow-luxury border border-[#edeae3] overflow-hidden relative">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-navy/40" />
          <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-navy">Tu Evolución</h2>
        </div>
        {trendText && (
          <span className="text-[11px] font-sans tracking-[0.1em] bg-[var(--background)] px-3 py-1.5 rounded-full text-navy/60 border border-[#edeae3]">{trendText}</span>
        )}
      </div>

      <div className="relative w-full aspect-[2/1] overflow-hidden">
        {/* Y Axis Grid lines corresponding to moods */}
        <div className="absolute inset-x-0 inset-y-5 flex flex-col justify-between z-0 pointer-events-none opacity-30">
          {[...moods].reverse().map(m => (
            <div key={m.id} className="w-full border-b border-dashed border-[#edeae3] h-0 flex items-center">
              <span className="text-[9px] font-sans tracking-wider uppercase text-navy/40 bg-white pr-3 leading-none" style={{ color: m.color }}>{m.nombre}</span>
            </div>
          ))}
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full relative z-10 overflow-visible drop-shadow-md">
          <polyline
            fill="none"
            stroke="url(#trendGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="drop-shadow-sm"
          />
          {recentEntries.map((entry, idx) => {
             const x = paddingX + ((entry.timestamp - tStart) / tRange) * usableW;
             const yIndex = moodYMap[entry.moodId] || 0;
             const y = paddingY + usableH - ((yIndex / 5) * usableH);
             const m = moods.find(x => x.id === entry.moodId);
             
             return (
               <circle 
                 key={entry.id}
                 cx={x} cy={y} r="6"
                 fill={m?.color || "#navy"}
                 stroke="#fff"
                 strokeWidth="2"
                 className="hover:r-8 transition-all cursor-crosshair"
               >
                 <title>{new Date(entry.timestamp).toLocaleDateString()}: {m?.nombre}</title>
               </circle>
             );
          })}
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#edeae3" />
              <stop offset="100%" stopColor="#b08d3e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
