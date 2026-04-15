"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Palette, ArrowRight, Zap, Wind, Sparkles, Heart, RefreshCw, Home } from 'lucide-react';
import { moods } from '@/data/moods';

const microTexts: Record<string, string> = {
  activacion: "Fuego suave, energía clara.",
  calma: "Silencio interno, pulso lento.",
  focus: "Luz limpia, mente nítida.",
  social: "Apertura cálida, risas compartidas.",
  reset: "Limpieza profunda, nuevo inicio.",
  confort: "Raíz segura, abrazo digestivo."
};

const icons: Record<string, React.ReactNode> = {
  activacion: <Zap className="w-5 h-5" />,
  calma: <Wind className="w-5 h-5" />,
  focus: <Sparkles className="w-5 h-5" />,
  social: <Heart className="w-5 h-5" />,
  reset: <RefreshCw className="w-5 h-5" />,
  confort: <Home className="w-5 h-5" />
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
    <section className="py-24 md:py-36 bg-[var(--background)] relative overflow-hidden">
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
            Tu Paisaje Interno
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-[1.1]"
          >
            Las emociones no son casillas. <br />
            <span className="italic font-light">Son un espectro de luz y color.</span>
          </motion.h3>
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
                animate="float"
                transition={{ delay: idx * 0.2 }}
                className={`flex flex-col items-center gap-6 p-6 md:p-10 rounded-[40px] transition-all hover:scale-105 group bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/80 ${
                    idx % 3 === 0 ? 'md:translate-y-12' : idx % 3 === 2 ? 'md:-translate-y-8' : ''
                }`}
              >
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: mood.color + '15', color: mood.color }}
                >
                  <motion.div 
                    animate={{ rotate: [0, 360] }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_0%,transparent_70%)]"
                  />
                  {icons[mood.id]}
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
              <div className="w-10 h-10 rounded-full bg-aubergine-dark flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Palette className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-aubergine-dark tracking-wide uppercase">Diagnóstico Visual</p>
                <p className="text-xs text-aubergine-dark/60 font-light">Traduce tu bioquímica en color.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-8 md:p-10 group hover:bg-white/50 transition-colors rounded-[40px] border-y md:border-y-0 md:border-x border-aubergine-dark/5">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-aubergine-dark tracking-wide uppercase">Nutrición de Precisión</p>
                <p className="text-xs text-aubergine-dark/60 font-light">Fitoquímicos para cada estado.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-8 md:p-10 group hover:bg-white/50 transition-colors rounded-[40px]">
              <div className="w-10 h-10 rounded-full bg-aubergine flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4" />
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
