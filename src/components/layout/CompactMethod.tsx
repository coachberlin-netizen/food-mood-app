"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ear, Sparkles, Utensils, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: "Entender",
    desc: "Escucha activa",
    icon: <Ear className="w-5 h-5" />,
    color: "#C9A84C"
  },
  {
    title: "Traducir",
    desc: "Ciencia funcional",
    icon: <Sparkles className="w-5 h-5" />,
    color: "#722F37"
  },
  {
    title: "Integrar",
    desc: "Nutrición emocional",
    icon: <Utensils className="w-5 h-5" />,
    color: "#4A1D36"
  },
  {
    title: "Acompañar",
    desc: "Consulta WhatsApp",
    icon: <MessageCircle className="w-5 h-5" />,
    color: "#25D366",
    isAction: true,
    link: "https://wa.me/34600000000?text=Hola.%20Vengo%20de%20la%20web%20de%20Food%20Mood%20y%20me%20gustar%C3%ADa%20recibir%20orientaci%C3%B3n%20psicol%C3%B3gica%20sobre%20mi%20relaci%C3%B3n%20con%20la%20comida."
  }
];

export function CompactMethod() {
  return (
    <section className="py-16 md:py-24 bg-cream border-t border-aubergine-dark/5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-[10px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/40 mb-4 font-bold">
            El Método
          </h2>
          <h3 className="text-2xl md:text-3xl font-serif text-aubergine-dark italic">
            Un flujo circular de bienestar.
          </h3>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          {/* Horizontal Line (Desktop) */}
          <div className="absolute top-[26px] left-[10%] right-[10%] h-[1px] bg-aubergine-dark/10 hidden md:block" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col items-center flex-1"
            >
              {/* Node */}
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-white/50 ${step.isAction ? 'bg-aubergine-dark text-white hover:scale-110 mb-4' : 'bg-white text-aubergine-dark mb-4'}`}
                style={!step.isAction ? { borderTop: `2px solid ${step.color}` } : {}}
              >
                {step.link ? (
                  <Link href={step.link} target="_blank" rel="noopener noreferrer">
                    {step.icon}
                  </Link>
                ) : (
                  step.icon
                )}
              </div>

              {/* Text */}
              <div className="text-center">
                <h4 className="text-[13px] font-serif font-bold text-aubergine-dark mb-0.5">{step.title}</h4>
                <p className="text-[10px] font-sans uppercase tracking-widest text-aubergine-dark/40 font-medium">
                  {step.desc}
                </p>
              </div>

              {/* Vertical Line (Mobile) */}
              {idx < steps.length - 1 && (
                <div className="w-[1px] h-8 bg-aubergine-dark/10 mt-4 md:hidden" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/como-funciona" className="text-[10px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/30 hover:text-gold transition-colors font-bold flex items-center justify-center gap-2">
            Ver método completo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
