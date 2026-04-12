"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface EmotionalSliderProps {
  label: string;
  value: number; // 0–10
  onChange: (value: number) => void;
  colorStart?: string; // hex del extremo apagado — default "#C8C5C0"
  colorEnd: string; // hex del extremo vivo
  iconLeft: React.ReactNode;
  iconRight: React.ReactNode;
}

/**
 * Helper to interpolate between two hex colors.
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
}

export default function EmotionalSlider({
  label,
  value,
  onChange,
  colorStart = "#C8C5C0",
  colorEnd,
  iconLeft,
  iconRight,
}: EmotionalSliderProps) {
  const [hasMoved, setHasMoved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
    if (!hasMoved) setHasMoved(true);
  };

  const currentColor = interpolateColor(colorStart, colorEnd, value / 10);

  return (
    <div className="w-full py-10 flex flex-col items-center">
      {/* Label */}
      <h3 className="font-serif text-[24px] text-[#6B2737] mb-8 text-center leading-tight">
        {label}
      </h3>

      {/* Slider Container */}
      <div className="w-full relative px-2">
        {/* Track & Input */}
        <div className="relative w-full h-2 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${colorStart}, ${colorEnd})` }}>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={value}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            style={{ appearance: "none" }}
          />
          
          {/* Custom Thumb Visual */}
          <motion.div
            initial={false}
            animate={{ 
                left: `${(value / 10) * 100}%`,
                opacity: hasMoved ? 1 : 0.4,
                borderColor: currentColor
            }}
            transition={{ opacity: { duration: 0.2 }, left: { type: "spring", stiffness: 300, damping: 30 } }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[28px] h-[28px] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] border-2 z-10 pointer-events-none"
          />
        </div>

        {/* Icons Overlay */}
        <div className="flex justify-between items-center w-full px-1">
          <div 
            className="w-8 h-8 flex items-center justify-center transition-opacity duration-200"
            style={{ 
              color: "#6B2737", 
              opacity: value < 4 ? 0.9 : 0.35 
            }}
          >
            {iconLeft}
          </div>
          <div 
            className="w-8 h-8 flex items-center justify-center transition-opacity duration-200"
            style={{ 
              color: "#6B2737", 
              opacity: value > 6 ? 0.9 : 0.35 
            }}
          >
            {iconRight}
          </div>
        </div>
      </div>
    </div>
  );
}
