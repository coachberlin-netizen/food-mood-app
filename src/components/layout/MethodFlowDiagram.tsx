"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ear, Sparkles, Utensils, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Escucha",
    subtitle: "Tus emociones",
    icon: <Ear className="w-8 h-8 md:w-10 md:h-10" />,
    color: "#FF6B35"
  },
  {
    id: "02",
    title: "Recibe",
    subtitle: "Nuestra ciencia",
    icon: <Sparkles className="w-8 h-8 md:w-10 md:h-10" />,
    color: "#722F37"
  },
  {
    id: "03",
    title: "Nutre",
    subtitle: "Cuerpo y mente",
    icon: <Utensils className="w-8 h-8 md:w-10 md:h-10" />,
    color: "#4A1D36"
  }
];

export function MethodFlowDiagram() {
  return (
    <section className="py-24 md:py-40 bg-cream relative overflow-hidden border-t border-aubergine-dark/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 md:mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/40 mb-6 font-bold"
          >
            Cómo funciona
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-serif text-aubergine-dark max-w-5xl mx-auto leading-[1.05]"
          >
            Un flujo circular de <br className="hidden md:block" />
            <span className="italic font-light">conexión y bienestar.</span>
          </motion.h3>
        </div>

        {/* The Flow Diagram */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 py-12">
          
          {/* Connecting Path (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-aubergine-dark/5 hidden lg:block -translate-y-1/2 overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-40"
            />
          </div>

          {concepts_map()}

        </div>

        {/* Action Link */}
        <div className="mt-20 md:mt-32 text-center">
            <Link href="/como-funciona" className="group inline-flex items-center gap-4 text-aubergine-dark hover:text-gold transition-colors duration-300">
                <span className="text-sm font-sans tracking-[0.2em] uppercase font-bold">Descubre el método completo</span>
                <div className="w-12 h-12 rounded-full border border-aubergine-dark/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>

      </div>
    </section>
  );

  function concepts_map() {
    return steps.map((step, idx) => (
        <motion.div 
          key={step.id} 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.2 }}
          className="relative flex flex-col items-center group z-20"
        >
          {/* Step Number Badge */}
          <span className="absolute -top-6 text-[10px] font-sans tracking-[0.2em] text-aubergine-dark/30 font-bold mb-4">
            PASO {step.id}
          </span>

          {/* Icon Circle */}
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-white flex items-center justify-center shadow-luxury border border-white transition-all duration-500 group-hover:scale-110 relative mb-8">
             <div className="absolute inset-2 rounded-full border border-dashed border-aubergine-dark/5 group-hover:rotate-45 transition-transform duration-1000" />
             <div 
                className="text-aubergine-dark group-hover:text-gold transition-colors duration-300"
                style={{ color: step.id === "01" ? "#FF6B35" : undefined }}
             >
                {step.icon}
             </div>
          </div>

          {/* Multi-layered titles */}
          <div className="text-center">
             <h4 className="text-2xl md:text-4xl font-serif text-aubergine-dark mb-1">
                {step.title}
             </h4>
             <p className="text-[12px] md:text-[14px] font-sans tracking-[0.15em] uppercase text-aubergine-dark/40 font-semibold group-hover:text-gold transition-colors">
                {step.subtitle}
             </p>
          </div>

          {/* Vertical Connecting Line (Mobile) */}
          {idx !== steps.length - 1 && (
            <div className="w-px h-16 bg-aubergine-dark/10 mt-8 mb-4 lg:hidden" />
          )}
        </motion.div>
      ));
  }
}
