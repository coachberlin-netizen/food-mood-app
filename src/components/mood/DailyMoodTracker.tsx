"use client";

import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CalendarPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { MoodId } from "@/lib/types";

export function DailyMoodTracker() {
  const { moodHistory, addDailyMood } = useQuizStore();
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Check if user already tracked today
  const [hasTrackedToday, setHasTrackedToday] = useState(false);
  const [trackedMoodId, setTrackedMoodId] = useState<MoodId | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const todaysEntry = moodHistory.find(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0,0,0,0);
      return entryDate.getTime() === today.getTime();
    });

    if (todaysEntry) {
      setHasTrackedToday(true);
      setTrackedMoodId(todaysEntry.moodId);
    }
  }, [moodHistory]);

  const handleSelect = (moodId: MoodId) => {
    setSelectedMood(moodId);
    // Mimic API delay for the animation
    setTimeout(() => {
      addDailyMood(moodId);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedMood(null);
      }, 3000);
    }, 600);
  };

  return (
    <div className="bg-cream rounded-xl p-10 md:p-14 shadow-luxury border border-aubergine-dark/20 relative overflow-hidden transition-all duration-500">
      
      {trackedMoodId && hasTrackedToday && !selectedMood && !showSuccess && (
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-[0.08] -mr-20 -mt-20 pointer-events-none" style={{ backgroundColor: moods.find(m => m.id === trackedMoodId)?.color }} />
      )}

      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle2 className="w-16 h-16 mb-8 text-gold mx-auto drop-shadow-sm" />
            </motion.div>
            <h3 className="text-3xl font-serif text-aubergine-dark mb-4">Registro Completo</h3>
            <p className="text-aubergine-dark/60 font-light text-lg">Tu microbioma te lo agradece.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="tracker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-[var(--background)] border border-aubergine-dark/20 rounded-lg">
                <CalendarPlus className="w-5 h-5 text-aubergine-dark/40" />
              </div>
              <div>
                <h2 className="text-[11px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/50 mb-2">Check-in Diario</h2>
                <p className="font-serif text-2xl md:text-3xl text-aubergine-dark">
                  {hasTrackedToday ? "¿Ha cambiado tu estado hoy?" : "¿Cómo te sientes hoy?"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {moods.map((mood) => {
                const isSelected = selectedMood === mood.id;
                const isSavedToday = hasTrackedToday && trackedMoodId === mood.id;
                
                return (
                  <motion.button
                    key={mood.id}
                    onClick={() => handleSelect(mood.id)}
                    disabled={selectedMood !== null}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300 border ${
                      isSelected 
                        ? 'border-aubergine-dark shadow-luxury' 
                        : isSavedToday
                        ? 'border-transparent shadow-sm'
                        : 'border-aubergine-dark/20 hover:border-aubergine-dark/30 hover:shadow-luxury bg-[var(--background)]'
                    }`}
                    style={{ 
                      backgroundColor: isSelected || isSavedToday ? mood.color : undefined,
                      ['--tw-ring-color' as string]: mood.color 
                    }}
                  >
                    <span className="text-4xl md:text-5xl mb-4 block transition-transform group-hover:scale-105" style={{ opacity: isSelected || isSavedToday ? 1 : 0.8 }}>
                      {mood.emoji}
                    </span>
                    <span 
                      className={`font-serif text-lg ${isSelected || isSavedToday ? 'text-aubergine-dark' : 'text-aubergine-dark/70'}`}
                    >
                      {mood.nombre}
                    </span>
                    
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-aubergine-dark mix-blend-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.05, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
