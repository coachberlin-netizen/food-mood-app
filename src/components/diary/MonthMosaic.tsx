"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MonthMosaicProps {
  colorGrid: string[][];         // array de semanas, cada semana = 7 colores hex
  moodGrid: string[][];          // array de semanas, cada semana = 7 nombres de mood
  monthName: string;             // ejemplo: "Abril 2026"
  moodDistribution: Record<string, number>;  // { calma: 12, reset: 8, focus: 5 }
  insight?: string;              // texto de análisis mensual (opcional)
  animate: boolean;
}

const MOOD_COLOR_MAP: Record<string, string> = {
  activacion: '#E8A87C',
  calma:      '#7EC8C8',
  focus:      '#F4E285',
  social:     '#F4A7B9',
  reset:      '#B8A9C9',
  confort:    '#D4A574'
};

const MOOD_LABELS: Record<string, string> = {
  activacion: 'Activación',
  calma:      'Calma',
  focus:      'Foco',
  social:     'Social',
  reset:      'Restauración',
  confort:    'Confort'
};

export function MonthMosaic({
  colorGrid,
  moodGrid,
  monthName,
  moodDistribution,
  insight,
  animate,
}: MonthMosaicProps) {
  const [hoveredCoords, setHoveredCoords] = useState<[number, number] | null>(null);

  const totalDays = Object.values(moodDistribution).reduce((a, b) => a + b, 0);

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2, // Stagger between weeks
      },
    },
  };

  const rowVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05, // Stagger between days in a week
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto bg-white rounded-3xl p-8 shadow-sm border border-[#5C1A1A]/5">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col gap-1">
        <h2 
          style={{ 
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "24px",
            color: "#6B2D3E",
            fontWeight: 700 
          }}
        >
          Tu mes emocional
        </h2>
        <span 
          style={{ 
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "16px",
            color: "#9CA3AF" 
          }}
        >
          {monthName}
        </span>
      </div>

      {/* Grid */}
      <motion.div
        className="flex flex-col"
        style={{ gap: "6px" }}
        initial={animate ? "initial" : false}
        animate={animate ? "animate" : false}
        variants={containerVariants}
      >
        {colorGrid.slice(0, 5).map((week, weekIdx) => (
          <motion.div 
            key={weekIdx} 
            className="flex" 
            style={{ gap: "4px" }}
            variants={rowVariants}
          >
            {week.map((color, dayIdx) => {
              const moodName = moodGrid[weekIdx]?.[dayIdx] || "";
              const isEmpty = color === "#E0E0E0" || color === "#E8E8E8";
              const isHovered = hoveredCoords?.[0] === weekIdx && hoveredCoords?.[1] === dayIdx;

              return (
                <div key={dayIdx} className="relative">
                  <motion.div
                    variants={itemVariants}
                    onMouseEnter={() => setHoveredCoords([weekIdx, dayIdx])}
                    onMouseLeave={() => setHoveredCoords(null)}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "8px",
                      backgroundColor: isEmpty ? "transparent" : color,
                      border: isEmpty ? "1.5px dashed #D1D5DB" : "none",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    whileHover={{
                      y: -3,
                      boxShadow: `0 8px 16px ${color}66`,
                    }}
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && moodName && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute pointer-events-none z-10"
                        style={{
                          bottom: "calc(100% + 8px)",
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
                        {moodName}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        ))}
      </motion.div>

      {/* Distribution Bar */}
      <div className="w-full h-3 mt-[20px] rounded-[6px] flex overflow-hidden">
        {Object.entries(moodDistribution).map(([moodId, count]) => {
          if (count === 0) return null;
          const percentage = (count / totalDays) * 100;
          return (
            <div
              key={moodId}
              style={{
                width: `${percentage}%`,
                height: "100%",
                backgroundColor: MOOD_COLOR_MAP[moodId] || "#E0E0E0",
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="w-full flex flex-wrap gap-x-3 gap-y-2 mt-[8px] justify-center">
        {Object.entries(moodDistribution).map(([moodId, count]) => {
          if (count === 0) return null;
          const percentage = Math.round((count / totalDays) * 100);
          return (
            <div key={moodId} className="flex items-center gap-1.5">
              <div 
                style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: MOOD_COLOR_MAP[moodId] 
                }} 
              />
              <span 
                style={{ 
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "13px",
                  color: "#4B5563" 
                }}
              >
                {MOOD_LABELS[moodId] || moodId} {percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Insight */}
      {insight && (
        <p 
          className="mt-[16px] italic text-center leading-relaxed"
          style={{ 
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "16px",
            color: "#6B7280",
            maxWidth: "100%",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          &quot;{insight}&quot;
        </p>
      )}
    </div>
  );
}
