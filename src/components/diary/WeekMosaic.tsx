"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeekMosaicProps {
  colors: string[];          // 7 colores hex, índice 0=lunes ... 6=domingo
  labels: string[];          // ["L","M","X","J","V","S","D"]
  moods: string[];           // nombre del mood por día (para el tooltip)
  hasNota: boolean[];        // true si ese día tiene nota del usuario
  dominantMood: string;
  dominantColor: string;     // hex del color dominante
  size: "compact" | "full";
  animate: boolean;
}

export function WeekMosaic({
  colors,
  labels,
  moods,
  hasNota,
  dominantMood,
  dominantColor,
  size,
  animate,
}: WeekMosaicProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const isCompact = size === "compact";
  const squareSize = isCompact ? 36 : 80;
  const borderRadius = isCompact ? 6 : 10;
  const gap = isCompact ? 4 : 8;
  const labelFontSize = isCompact ? 10 : 14;
  const footerFontSize = isCompact ? 14 : 18;

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: isCompact ? 0.1 : 0.12,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  };

  const dayNames = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        className="flex"
        style={{ gap: `${gap}px` }}
        initial={animate ? "initial" : false}
        animate={animate ? "animate" : false}
        variants={containerVariants}
      >
        {labels.map((label, idx) => {
          const color = colors[idx] || "#E0E0E0";
          const mood = moods[idx] || "";
          const isEmpty = color === "#E0E0E0";
          const hasNote = hasNota[idx];

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => !isCompact && setHoveredIdx(idx)}
                onMouseLeave={() => !isCompact && setHoveredIdx(null)}
                style={{
                  width: `${squareSize}px`,
                  height: `${squareSize}px`,
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: isEmpty ? "transparent" : color,
                  border: isEmpty ? "1.5px dashed #D1D5DB" : "none",
                  cursor: isCompact ? "default" : "pointer",
                }}
                whileHover={
                  !isCompact
                    ? {
                        y: -4,
                        boxShadow: `0 8px 24px ${color}66`,
                      }
                    : {}
                }
              >
                {/* Custom Tooltip (Full version with State) */}
                <AnimatePresence>
                  {!isCompact && hoveredIdx === idx && mood && (
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
                      {dayNames[idx]} — {mood}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Note Indicator (Full version) */}
                {!isCompact && hasNote && (
                  <div
                    className="absolute"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#6B2D3E",
                      borderRadius: "50%",
                      bottom: "6px",
                      right: "6px",
                    }}
                  />
                )}
              </motion.div>

              {/* Day Label */}
              <span
                style={{
                  fontSize: `${labelFontSize}px`,
                  color: "#9CA3AF",
                  fontWeight: 500,
                  textAlign: "center"
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Footer Summary */}
      <div
        className="flex items-center gap-2"
        style={{ marginTop: isCompact ? "12px" : "20px" }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: dominantColor,
          }}
        />
        <span
          style={{
            fontSize: `${footerFontSize}px`,
            color: "#4B5563",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 500,
          }}
        >
          Color dominante: <span className="font-bold">{dominantMood}</span>
        </span>
      </div>
    </div>
  );
}
