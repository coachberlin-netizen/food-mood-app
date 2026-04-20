"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ear, Sparkles, Utensils, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "Escuchar",
    desc: "Tu espectro emocional real",
    body: "El test de estado lee tu espectro emocional real. No una etiqueta — porcentajes.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2a5 5 0 00-5 5v3" strokeLinecap="round" />
        <path d="M19 10v-3a7 7 0 00-14 0v3" strokeLinecap="round" />
        <path d="M12 22a5 5 0 005-5v-1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    color: "#FFB000"
  },
  {
    title: "Correlacionar",
    desc: "Patrones que emergen solos",
    body: "Cruzamos tu estado con tus alimentos y síntomas. Los patrones aparecen solos.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
    color: "#00D1FF"
  },
  {
    title: "Recomendar",
    desc: "La receta de hoy",
    body: "Recetas diseñadas para tu estado de hoy. Con el mecanismo explicado.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2v20M2 12h20" strokeLinecap="round" opacity="0.3" />
        <rect x="6" y="6" width="12" height="12" rx="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    color: "#FF2D55"
  },
  {
    title: "Transformar",
    desc: "90 días de datos reales",
    body: "90 días de datos = tu nueva base biológica documentada.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-7.6 8.38 8.38 0 013.8.9L22 4l-2.1 4.7z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    color: "#C9A84C",
    isAction: true,
    link: "/viaje"
  }
];

export function CompactMethod() {
  return (
    <section className="pt-12 md:pt-16 pb-8 relative overflow-hidden px-6">
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[9px] font-sans tracking-[0.4em] uppercase text-aubergine-dark/30 mb-6 font-bold"
          >
            Nuestra metodología
          </motion.h2>
          <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-tight">
            Un sistema circular que <br className="md:hidden" />
            <span className="italic font-light">se retroalimenta con tus datos.</span>
          </h3>
        </div>

        <div className="relative flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 max-w-4xl mx-auto">
          {/* Subtle Connection Line (Desktop) */}
          <div className="absolute top-[32px] left-[10%] right-[10%] h-[1px] bg-aubergine-dark/5 hidden md:block" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col items-center flex-1 group"
            >
              {/* Icon Marker (Minimalist) */}
              <div 
                className={`w-16 h-16 flex items-center justify-center transition-all duration-500 mb-6 rounded-full ${step.isAction ? 'bg-aubergine-dark text-gold shadow-luxury scale-110' : 'bg-transparent text-aubergine-dark/40 group-hover:text-aubergine-dark group-hover:scale-105'}`}
              >
                {step.link ? (
                  <Link href={step.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    {step.icon}
                  </Link>
                ) : (
                  <div className="flex items-center justify-center relative">
                    {step.icon}
                    {/* Subtle glow for non-action icons */}
                    <div className="absolute inset-0 bg-aubergine-dark/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2">
                <h4 className="text-sm md:text-base font-serif font-bold text-aubergine-dark tracking-wide">
                  {step.title}
                </h4>
                <p className="text-[10px] md:text-[11px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/40 font-medium whitespace-nowrap">
                  {step.desc}
                </p>
              </div>

              {/* Vertical Connector (Mobile) */}
              {idx < steps.length - 1 && (
                <div className="w-[1px] h-10 bg-aubergine-dark/5 mt-6 md:hidden" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Global Footer Navigation - New Cheerful Yellow Accent */}
        <div className="mt-12 md:mt-16 text-center">
          <Link 
            href="/como-funciona" 
            className="inline-flex items-center gap-6 group relative"
          >
            {/* Soft Luminous Glow Background */}
            <div className="absolute inset-x-[-15px] inset-y-[-10px] bg-gold/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative flex items-center gap-4 bg-gold/5 group-hover:bg-gold py-3 px-8 rounded-full border border-gold/20 group-hover:border-gold transition-all duration-500 shadow-sm group-hover:shadow-luxury">
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-aubergine-dark group-hover:text-white transition-colors font-bold">
                 Explorar el método completo
              </span>
              <div className="w-8 h-px bg-aubergine-dark/20 group-hover:bg-white/50 transition-all duration-500" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-aubergine-dark group-hover:text-white transition-all group-hover:translate-x-1">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Small animating sparkle dot */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full blur-[1px]" 
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
