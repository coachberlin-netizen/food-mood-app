"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const benefits = [
  {
    title: "Test de estado diario",
    description: "30 segundos. 5 sliders. Tu color emocional del día y las recetas que responden a él.",
    watercolor: "/images/textures/blob-raspberry.png",
    color: "#E30B5D"
  },
  {
    title: "Bol del día",
    description: "Registro lúdico de grupos alimentarios. Sin calorías, sin gramos. Solo tocar y ver tu bol llenarse.",
    watercolor: "/images/textures/blob-lavender.png",
    color: "#E6E6FA"
  },
  {
    title: "Diario de síntomas",
    description: "Tap-based. Los patrones inconscientes se vuelven visibles a partir del día 7.",
    watercolor: "/images/textures/blob-pomelo.png",
    color: "#FF7F50"
  },
  {
    title: "Índice Food·Mood",
    description: "Tu número diario del 1 al 100. La trayectoria de 90 días documentada con datos reales.",
    watercolor: "/images/textures/blob-aubergine.png",
    color: "#4B0082"
  },
  {
    title: "Semana de datos",
    description: "Cada domingo: tus correlaciones personales + el newsletter curated de nuestro equipo.",
    watercolor: "/images/textures/blob-gold.png",
    color: "#FF6B35"
  },
  {
    title: "Retos de transformación",
    description: "7 días o 4 semanas. Un objetivo, un camino, resultados medibles con tu índice.",
    watercolor: "/images/textures/blob-yellow.png",
    color: "#FFF633"
  }
];

export function SubscriptionBenefitsSection() {
  return (
    <section className="pt-4 md:pt-8 pb-16 md:pb-24 relative overflow-hidden px-6">
      
      {/* MAPA MUNDI: Backdrop Connectors (Ultra-subtle navigation lines) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] md:opacity-[0.03]">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M200,300 Q400,100 600,300 T900,500" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100,600 Q300,800 500,600 T800,400" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M400,200 Q500,500 400,800" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section (Minimal) */}
        <div className="mb-12 md:mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[9px] font-sans tracking-[0.5em] uppercase text-aubergine-dark/30 mb-8 block font-bold"
          >
            El ecosistema
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-tight"
          >
            Todo lo que necesitas<br />
            <span className="italic font-light">en un ecosistema.</span>
          </motion.h3>
        </div>

        {/* MAPA MUNDI: Clustered arrows layout */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-8 md:gap-x-12 md:gap-y-12 max-w-4xl mx-auto">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative flex items-start gap-4 group max-w-[280px] p-2 ${
                idx % 2 === 1 ? 'md:translate-y-8' : ''
              }`}
            >
              {/* Premium Arrow (Minimalist Indicator) */}
              <div className="mt-1 flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-aubergine-dark/40 group-hover:text-gold transition-colors duration-500">
                  <path d="M17 7L6 18M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-serif text-aubergine-dark font-bold leading-tight group-hover:text-gold transition-colors duration-500 cursor-default">
                  {benefit.title}
                </h4>
                <p className="text-[11px] md:text-[12px] text-aubergine-dark/50 font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-28 rounded-3xl px-10 py-16 md:px-20 md:py-20 text-center relative overflow-hidden"
          style={{ backgroundColor: '#2d0f16' }}
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(255,107,53,0.06)' }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-5" style={{ color: '#FF6B35' }}>
              Tu viaje empieza hoy
            </span>
            <h3 className="text-3xl md:text-5xl font-serif font-black text-white mb-6 leading-tight">
              Empieza tu viaje de 90 días.
            </h3>
            <p className="font-serif italic text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'rgba(245,240,232,0.6)' }}>
              Tus hematíes, tu microbioma, tus hábitos neuronales — todo se renueva en 90 días.
              Es el ciclo biológico real del cambio. Empieza hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/test"
                className="px-10 py-4 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ backgroundColor: '#6B2737', border: '1px solid rgba(255,107,53,0.3)' }}
              >
                Hacer mi test gratuito →
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-light transition-colors hover:text-white"
                style={{ color: 'rgba(245,240,232,0.60)' }}
              >
                Desde 7€/mes — ver planes →
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
