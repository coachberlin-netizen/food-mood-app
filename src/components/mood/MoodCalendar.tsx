"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { Calendar } from "lucide-react";

export function MoodCalendar() {
  const { moodHistory } = useQuizStore();
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust to make Monday the first day of the week (0)
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-cream p-10 rounded-xl shadow-luxury border border-aubergine-dark/20">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-5 h-5 text-aubergine-dark/40" />
        <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark">Historial Mensual</h2>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-[10px] font-sans tracking-[0.15em] uppercase text-aubergine-dark/40 mb-4">
        <div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div><div>Do</div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2">
        {Array(offset).fill(null).map((_, i) => (
           <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
          const entry = moodHistory.find(e => e.date.startsWith(dateStr));
          const mood = entry ? moods.find(m => m.id === entry.moodId) : null;
          
          return (
            <div key={day} className="aspect-square flex flex-col justify-center items-center group relative">
               <div 
                 className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-transform hover:scale-[1.05] cursor-pointer ${
                   mood ? 'shadow-sm opacity-80 hover:opacity-100' : 'bg-[var(--background)] border border-aubergine-dark/20'
                 }`}
                 style={{ backgroundColor: mood?.color }}
               />
               <span className="text-[10px] text-aubergine-dark/30 font-medium mt-1">{day}</span>
               
               {mood && (
                 <div className="absolute bottom-full mb-3 bg-aubergine-dark text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-luxury font-light">
                   {mood.emoji} {mood.nombre}
                 </div>
               )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
