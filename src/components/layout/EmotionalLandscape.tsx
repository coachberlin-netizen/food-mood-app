"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Palette, ArrowRight, Zap, Wind, Sparkles, Heart, RefreshCw, Home } from 'lucide-react';
import { moods } from '@/data/moods';

const microTexts: Record<string, string> = {
  activacion: "Energía natural y enfoque.",
  calma: "Relajación y bienestar digestivo.",
  focus: "Claridad mental y concentración.",
  social: "Conexión y disfrute.",
  reset: "Renovación y ligereza.",
  confort: "Placer y equilibrio."
};

const icons: Record<string, React.ReactNode> = {
  activacion: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calma: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 12c5-5 15 5 20 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17c5-5 15 5 20 0" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  focus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  social: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M18 8a3 3 0 10-6 0 3 3 0 006 0zM6 15a3 3 0 100-6 3 3 0 000 6zM21 19a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  reset: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20 11a8.1 8.1 0 00-15.5-2m-.5 5v-5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13a8.1 8.1 0 0015.5 2m.5-5v5h-5" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  confort: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

// Premium Abstract Advantage Icons
const AdvantageIcons = {
  Visual: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
      <path d="M12 2v20M2 12h20" opacity="0.3" />
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
    </svg>
  ),
  Precision: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
    </svg>
  ),
  GutBrain: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 21c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17c-2.209 0-4 1.791-4 4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    </svg>
  )
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const blobVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  float: {
    opacity: 1,
    y: [0, -15, 0],
    x: [0, 10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function EmotionalLandscape() {
  return (
    <section className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-aubergine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/40 mb-6 font-bold"
          >
            Tus emociones, tu guía.
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-[1.1]"
          >
            Cada emoción es una señal. <br />
            <span className="italic font-light">Escúchalas y responde con nutrición.</span>
          </motion.h3>
          <p className="mt-8 text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Cada emoción es una señal. Aprende a interpretarlas y a responder con la nutrición adecuada. Con Food Mood, transformamos tus estados emocionales en una paleta de colores que te indica qué necesita tu cuerpo:
          </p>
        </div>

        {/* The Map / Landscape */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative min-h-[600px] md:min-h-[700px] w-full flex items-center justify-center p-4"
        >
          {/* Constellation Grid (Abstract) */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            {moods.map((mood, idx) => (
              <motion.div
                key={mood.id}
                variants={blobVariants}
                animate={["visible", "float"]}
                transition={{ delay: idx * 0.2 }}
                className={`flex flex-col items-center gap-6 p-6 md:p-10 rounded-[40px] transition-all hover:scale-105 group bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/80 ${
                    idx % 3 === 0 ? 'md:translate-y-12' : idx % 3 === 2 ? 'md:-translate-y-8' : ''
                }`}
              >
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center relative overflow-visible"
                  style={{ color: mood.color }}
                >
                  {/* ACCENT GLOW */}
                  <div 
                    className="absolute inset-0 rounded-full blur-[20px] opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                    style={{ backgroundColor: mood.color }}
                  />
                  
                  <div className="relative z-10 w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                     {icons[mood.id]}
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h4 className="font-serif text-2xl md:text-3xl text-aubergine-dark">{mood.nombre}</h4>
                  <p className="text-[13px] md:text-sm text-aubergine-dark/50 font-light leading-relaxed max-w-[150px]">
                    {microTexts[mood.id]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits / Advantages overlay styled bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-32 max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8 p-1 px-1 bg-white/30 backdrop-blur-md rounded-[50px] border border-white/50 shadow-luxury overflow-hidden">
            <div className="flex items-center gap-4 p-8 md:p-10 group hover:bg-white/50 transition-colors rounded-[40px]">
              <div className="text-aubergine-dark shrink-0 group-hover:scale-110 transition-transform">
                {AdvantageIcons.Visual}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-aubergine-dark tracking-wide uppercase">Diagnóstico Visual</p>
                <p className="text-xs text-aubergine-dark/60 font-light">Traduce tu bioquímica en color.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-8 md:p-10 group hover:bg-white/50 transition-colors rounded-[40px] border-y md:border-y-0 md:border-x border-aubergine-dark/5">
              <div className="text-gold shrink-0 group-hover:scale-110 transition-transform">
                {AdvantageIcons.Precision}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-aubergine-dark tracking-wide uppercase">Nutrición de Precisión</p>
                <p className="text-xs text-aubergine-dark/60 font-light">Fitoquímicos para cada estado.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-8 md:p-10 group hover:bg-white/50 transition-colors rounded-[40px]">
              <div className="text-aubergine-dark/60 shrink-0 group-hover:scale-110 transition-transform">
                {AdvantageIcons.GutBrain}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-aubergine-dark tracking-wide uppercase">Eje Gut-Brain</p>
                <p className="text-xs text-aubergine-dark/60 font-light">Equilibrio desde tu segundo cerebro.</p>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link href="/paleta">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-aubergine-dark text-cream rounded-[60px] px-12 py-5 font-sans text-[18px] font-medium transition-all shadow-xl hover:shadow-2xl flex items-center gap-4 mx-auto"
              >
                Explorar mi Paleta completa <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
