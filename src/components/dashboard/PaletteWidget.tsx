"use client";

import React from "react";
import { usePalette } from "@/contexts/PaletteContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Palette } from "lucide-react";

export function PaletteWidget() {
  const { currentPalette, isLoading } = usePalette();

  // 1. Loading / Skeleton State
  if (isLoading) {
    return (
      <div className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-cream border border-aubergine-dark/5 shadow-sm animate-pulse">
        <div className="w-[80px] h-[80px] rounded-full bg-aubergine-dark/10" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-aubergine-dark/10 rounded" />
          <div className="h-6 w-48 bg-aubergine-dark/10 rounded" />
        </div>
      </div>
    );
  }

  // 2. Active Palette State
  if (currentPalette) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-white border border-aubergine-dark/5 shadow-sm relative overflow-hidden"
      >
        {/* Subtle background aura */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at center, ${currentPalette.colorMezclado}, transparent 70%)` 
          }}
        />

        <div className="flex items-center gap-6 z-10">
          <div 
            className="w-[80px] h-[80px] rounded-full shadow-lg border-2 border-white"
            style={{ backgroundColor: currentPalette.colorMezclado }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-1">
              Tu paleta de hoy
            </span>
            <h3 className="font-serif text-2xl text-[#6B2737] font-semibold">
              {currentPalette.colorLabelDominante} <span className="text-aubergine-dark/30 font-light text-lg italic">con un toque de</span> {currentPalette.colorLabelSecundario}
            </h3>
            <p className="text-sm text-[#7a7974] font-light mt-1">
              {currentPalette.descripcion}
            </p>
          </div>
        </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <Link href="/eloraculo" className="z-10 group">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-aubergine-dark/10 text-aubergine-dark/60 text-sm font-medium hover:bg-aubergine-dark hover:text-white transition-all">
                  <Palette className="w-4 h-4" />
                  Nueva lectura
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <Link 
                href="/diario" 
                className="text-[13px] font-sans hover:opacity-80 transition-opacity flex items-center gap-1 z-10"
                style={{ color: currentPalette.colorMezclado }}
              >
                Ver mi historial de colores →
              </Link>
            </div>
      </motion.div>
    );
  }

  // 3. Empty State (No palette in last 24h)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-cream border border-dashed border-aubergine-dark/20"
    >
      <div className="flex items-center gap-6">
        <div className="w-[80px] h-[80px] rounded-full bg-aubergine-dark/5 flex items-center justify-center border border-aubergine-dark/10">
          <Sparkles className="w-8 h-8 text-[#C9A84C] opacity-40" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-serif text-xl text-[#6B2737] font-semibold">
            Diseña tu paleta emocional
          </h3>
          <p className="text-sm text-[#7a7974] font-light mt-1">
            Mezcla tus sensaciones para descubrir tu color y recibir recetas exactas.
          </p>
        </div>
      </div>

      <Link href="/eloraculo">
        <button className="bg-[#6B2737] text-white px-8 py-3 rounded-full text-sm font-semibold shadow-luxury hover:bg-[#5a212e] transition-colors">
          Hacer mi lectura
        </button>
      </Link>
    </motion.div>
  );
}
