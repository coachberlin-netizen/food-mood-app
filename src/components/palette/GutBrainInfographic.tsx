"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GutBrainInfographic() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-center">
        
        {/* Serotonin Stat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-[#6B2737]/5 shadow-xl group hover:shadow-2xl transition-all h-full"
        >
          <div className="relative mb-6">
            <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#6B273733"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#6B2737"
                strokeWidth="3"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                whileInView={{ strokeDashoffset: 283 * (1 - 0.95) }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-serif italic text-[#6B2737] font-bold">95%</span>
            </div>
          </div>
          <h4 className="text-[14px] uppercase tracking-[0.2em] text-[#6B2737]/60 font-bold mb-2">Serotonina</h4>
          <p className="text-xs text-[#7a7974] font-light text-center leading-relaxed">
            Se produce en el intestino, dictando tu estado de ánimo diario.
          </p>
        </motion.div>

        {/* Dopamine Stat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-[#6B2737]/5 shadow-xl group hover:shadow-2xl transition-all h-full"
        >
          <div className="relative mb-6">
            <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#C9A84C33"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="3"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                whileInView={{ strokeDashoffset: 283 * (1 - 0.5) }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-serif italic text-[#C9A84C] font-bold">50%</span>
            </div>
          </div>
          <h4 className="text-[14px] uppercase tracking-[0.2em] text-[#C9A84C]/60 font-bold mb-2">Dopamina</h4>
          <p className="text-xs text-[#7a7974] font-light text-center leading-relaxed">
            Se sintetiza en el entorno gastrointestinal, regulando tu motivación.
          </p>
        </motion.div>

        {/* Information Flow */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center justify-center p-8 bg-[#6B2737] rounded-[2.5rem] border border-[#6B2737]/5 shadow-xl group hover:shadow-2xl transition-all h-full col-span-1 md:col-span-2 lg:col-span-1"
        >
          <div className="relative w-full aspect-square flex items-center justify-center mb-6">
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-widest font-bold">Intestino</div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-widest font-bold">Cerebro</div>
            
            {/* Flow line */}
            <svg width="60" height="140" viewBox="0 0 60 140" className="overflow-visible">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#FAF9F6" />
                </linearGradient>
              </defs>
              <motion.path
                d="M30 130 V10"
                stroke="url(#flowGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
              />
              {/* Arrowheads */}
              <motion.path 
                d="M20 30 L30 10 L40 30" 
                fill="none" 
                stroke="#FAF9F6" 
                strokeWidth="3" 
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.2 }}
              />
            </svg>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                    <span className="text-[20px] font-serif italic text-white font-bold leading-none">Bottom-Up</span>
                </div>
            </div>
          </div>
          <h4 className="text-[14px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">Flujo Energético</h4>
          <p className="text-xs text-white/40 font-light text-center leading-relaxed">
            El eje intestino-cerebro procesa más información de abajo arriba que al revés.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
