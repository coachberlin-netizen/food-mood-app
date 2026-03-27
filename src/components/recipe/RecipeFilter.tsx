"use client";

import { moods } from "@/data/moods";
import { motion } from "framer-motion";

interface RecipeFilterProps {
  activeMood: string | null;
  onSelectMood: (moodId: string | null) => void;
}

export function RecipeFilter({ activeMood, onSelectMood }: RecipeFilterProps) {
  return (
    <div className="w-full flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelectMood(null)}
        className={`px-5 py-2.5 rounded-lg text-[11px] font-sans uppercase tracking-[0.1em] transition-all ${
          activeMood === null 
            ? "bg-navy text-white shadow-luxury" 
            : "bg-[var(--background)] border border-[#edeae3] text-navy/60 hover:border-navy/30 hover:shadow-sm"
        }`}
      >
        Todos
      </button>
      
      {moods.map((mood) => {
        const isActive = activeMood === mood.id;
        return (
          <button
            key={mood.id}
            onClick={() => onSelectMood(mood.id)}
            className={`px-5 py-2.5 rounded-lg text-[11px] font-sans uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${
              isActive ? "shadow-luxury scale-[1.02]" : "hover:border-navy/30 hover:shadow-sm bg-[var(--background)] border border-[#edeae3]"
            }`}
            style={{ 
              backgroundColor: isActive ? mood.color : undefined,
              color: isActive ? "#fff" : mood.color,
              borderColor: isActive ? mood.color : undefined
            }}
          >
            <span>{mood.emoji}</span>
            {mood.nombre}
          </button>
        )
      })}
    </div>
  );
}
