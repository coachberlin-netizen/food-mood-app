"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ear, Sparkles, Utensils, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "Entender",
    desc: "Escucha activa",
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
    title: "Traducir",
    desc: "Ciencia funcional",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
    color: "#00D1FF"
  },
  {
    title: "Integrar",
    desc: "Nutrición emocional",
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
    title: "Acompañar",
    desc: "Consulta WhatsApp",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-7.6 8.38 8.38 0 013.8.9L22 4l-2.1 4.7z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    color: "#25D366",
    isAction: true,
    link: "https://wa.me/34600000000?text=Hola.%20Vengo%20de%20la%20web%20de%20Food%20Mood%20y%20me%20gustar%C3%ADa%20recibir%20orientaci%C3%B3n%20psicol%C3%B3gica%20sobre%20mi%20relaci%C3%B3n%20con%20la%20comida."
  }
];

export function CompactMethod() {
  return (
    <section className="pt-20 md:pt-32 pb-8 md:pb-12 relative overflow-hidden px-6">
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[9px] font-sans tracking-[0.4em] uppercase text-aubergine-dark/30 mb-6 font-bold"
          >
            Nuestra Metodología
          </motion.h2>
          <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-tight">
            Un flujo circular <br className="md:hidden" />
            <span className="italic font-light">de bienestar real.</span>
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

        {/* Global Footer Navigation */}
        <div className="mt-16 md:mt-24 text-center">
          <Link href="/como-funciona" className="inline-flex items-center gap-4 group">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/30 group-hover:text-gold transition-colors font-bold">
               Explorar el método completo
            </span>
            <div className="w-6 h-px bg-aubergine-dark/10 group-hover:bg-gold group-hover:w-10 transition-all duration-500" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-aubergine-dark/30 group-hover:text-gold transition-colors">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
