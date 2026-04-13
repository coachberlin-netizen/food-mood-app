"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface WeekMosaicProps {
  colors: string[];      // 7 hex colors, one per day L→D. Si no hay dato: "#E0E0E0"
  moodNames: string[];   // 7 mood names, one per day (empty "" if none)
  dominantMood: string;  // Name of the most frequent mood
  dominantColor: string; // Hex of the dominant mood
  hasNote: boolean[];    // 7 booleans for saved notes
  size: "compact" | "full";
  animate?: boolean;     // Default true
}

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export function WeekMosaic({
  colors,
  moodNames,
  dominantMood,
  dominantColor,
  hasNote,
  size,
  animate = true,
}: WeekMosaicProps) {
  const isCompact = size === "compact";
  const squareSize = isCompact ? 36 : 80;
  const borderRadius = isCompact ? 6 : 10;
  const gap = isCompact ? 4 : 8;
  const labelSize = isCompact ? 10 : 14;
  const footerMargin = isCompact ? 12 : 20;
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

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        className="flex"
        style={{ gap: `${gap}px` }}
        initial={animate ? "initial" : false}
        animate={animate ? "animate" : false}
        variants={containerVariants}
      >
        {DAY_LABELS.map((label, idx) => {
          const color = colors[idx] || "#E0E0E0";
          const moodName = moodNames[idx] || "";
          const isEmpty = color === "#E0E0E0";
          const dayHasNote = hasNote[idx];

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <motion.div
                variants={itemVariants}
                className="relative group"
                style={{
                  width: `${squareSize}px`,
                  height: `${squareSize}px`,
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: isEmpty ? "transparent" : color,
                  border: isEmpty ? "2px dashed #C8C5C0" : "none",
                  cursor: isCompact ? "default" : "pointer",
                }}
                whileHover={
                  !isCompact
                    ? {
                        y: -4,
                        boxShadow: `0 8px 20px ${color}40`,
                      }
                    : {}
                }
              >
                {/* Custom Tooltip (Full version) */}
                {!isCompact && moodName && (
                  <div
                    className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-10"
                    style={{
                      bottom: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#1A1A2E",
                      color: "#FAF9F6",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {[
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                      "Domingo",
                    ][idx]}{" "}
                    — {moodName}
                  </div>
                )}

                {/* Note Indicator (Full version) */}
                {!isCompact && dayHasNote && (
                  <div
                    className="absolute"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#6B2737",
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
                  fontSize: `${labelSize}px`,
                  color: "#9a9690",
                  fontWeight: 500,
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
        style={{ marginTop: `${footerMargin}px` }}
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
            color: "#1A1A2E",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 500,
          }}
        >
          Color dominante esta semana:{" "}
          <span className="font-bold">{dominantMood}</span>
        </span>
      </div>
    </div>
  );
}
