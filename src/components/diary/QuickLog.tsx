"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaletteResult } from "@/contexts/PaletteContext";

interface QuickLogProps {
  onSave: (entry: { mood: string; nota?: string }) => void;
  currentPalette: PaletteResult | null;
}

const MOODS = [
  { id: 'activacion', label: 'Activación', color: '#E8A87C' },
  { id: 'calma',      label: 'Calma',      color: '#7EC8C8' },
  { id: 'focus',      label: 'Foco',         color: '#F4E285' },
  { id: 'social',     label: 'Social',       color: '#F4A7B9' },
  { id: 'reset',      label: 'Restauración', color: '#B8A9C9' },
  { id: 'confort',    label: 'Confort',    color: '#D4A574' },
];

export function QuickLog({ onSave, currentPalette }: QuickLogProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(
    currentPalette?.moodDominante || null
  );
  const [nota, setNota] = useState("");
  const [saved, setSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMoodId, setHoveredMoodId] = useState<string | null>(null);

  const handleSave = async () => {
    if ((!currentPalette && !selectedMood) || (currentPalette && nota.length === 0)) return;
    
    setIsAnimating(true);
    setSaved(true);

    // Animation scale: 1.0 -> 1.2 -> 1.0 (300ms)
    // Wait total 1.5s as per requirements for confirmation
    setTimeout(() => {
      onSave({ 
        mood: selectedMood || currentPalette?.moodDominante || "", 
        nota: nota.trim() || undefined 
      });
      setSaved(false);
      setIsAnimating(false);
    }, 1500);
  };

  const currentMoodData = MOODS.find(m => m.id === (currentPalette?.moodDominante || selectedMood));

  return (
    <div 
      className="max-w-md w-full p-6 bg-[#FDFBF7] rounded-[16px] border border-[#6B2D3E]/10 flex flex-col gap-6"
    >
      {currentPalette ? (
        /* Scenario A: Palette already exists */
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[14px] text-[#9CA3AF]">Ya tienes tu color de hoy</span>
            <div className="flex items-center gap-3">
              <motion.div
                animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                style={{ 
                  width: "16px", 
                  height: "16px", 
                  borderRadius: "50%", 
                  backgroundColor: currentPalette.colorMezclado 
                }}
              />
              <span className="font-sans text-[18px] text-[#2D1B4E] font-bold">
                {MOODS.find(m => m.id === currentPalette.moodDominante)?.label || currentPalette.moodDominante}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Scenario B: Manual Mood Selection */
        <div className="flex flex-col gap-4">
          <span className="font-sans text-[16px] text-[#2D1B4E] font-medium text-center">Tu color de hoy</span>
          <div className="flex justify-center gap-[12px] relative py-2">
            {MOODS.map((mood) => (
              <div key={mood.id} className="relative group">
                <motion.button
                  onClick={() => setSelectedMood(mood.id)}
                  onMouseEnter={() => setHoveredMoodId(mood.id)}
                  onMouseLeave={() => setHoveredMoodId(null)}
                  className="w-[40px] h-[40px] rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: mood.color,
                  }}
                  animate={
                    isAnimating && selectedMood === mood.id 
                      ? { scale: [1, 1.2, 1] } 
                      : selectedMood === mood.id 
                        ? { scale: 1.3 } 
                        : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className={`absolute inset-0 rounded-full border-2 border-[#6B2D3E] transition-opacity duration-200 ${
                      selectedMood === mood.id ? "opacity-100 scale-125" : "opacity-0"
                    }`} 
                    style={{ outline: "2px solid #6B2D3E", outlineOffset: "2px", border: "none" }}
                  />
                </motion.button>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredMoodId === mood.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      className="absolute pointer-events-none z-10"
                      style={{
                        bottom: "calc(100% + 12px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#1A1A2E",
                        color: "#FAF9F6",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {mood.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note Section - Visible if palette exists OR a mood is selected */}
      {(currentPalette || selectedMood) && (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value.slice(0, 200))}
              placeholder="¿Algo que quieras recordar de hoy?"
              rows={3}
              className="w-full p-3 border border-[#E5E0D5] rounded-lg font-sans text-[14px] text-[#2D1B4E] placeholder-[#9CA3AF] resize-none focus:outline-none focus:ring-1 focus:ring-[#6B2D3E]/30"
            />
            <span className="absolute bottom-[-18px] right-0 font-sans text-[11px] text-[#9CA3AF]">
              {nota.length}/200
            </span>
          </div>

          <div className="flex justify-between items-center mt-4">
            {saved ? (
              <span className="font-sans text-[14px] text-green-600 font-medium">✓ Guardado</span>
            ) : (
              <div />
            )}
            
            <button
              onClick={handleSave}
              disabled={(!currentPalette && !selectedMood) || (currentPalette !== null && nota.length === 0)}
              className="px-4 py-2 bg-[#6B2D3E] text-white rounded-lg font-sans text-[14px] font-medium transition-all hover:bg-[#5a2634] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPalette ? "Guardar nota" : "Guardar"}
            </button>
          </div>
        </div>
      )}

      {/* Precission Link (Scenario B only) */}
      {!currentPalette && (
        <a 
          href="/paleta" 
          className="text-center font-sans text-[13px] text-[#9CA3AF] hover:text-[#6B2D3E] transition-colors mt-2"
        >
          ¿Quieres más precisión? Haz tu paleta completa →
        </a>
      )}
    </div>
  );
}
