"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function PhilosophySection() {
  const nodes = [
    {
      label: "El Enfoque",
      title: "Hedonismo Consciente",
      text: "¿Cansado de dietas aburridas y reglas estrictas? Creemos que la vida es demasiado corta para no disfrutar cada bocado. Olvídate de la culpa: lo que te sienta bien, ¡es lo que sabe bien!",
      color: "#FFD700", // Gold
      size: "w-[340px] h-[340px]",
      pos: "lg:-translate-x-12"
    },
    {
      label: "La Esencia",
      title: "Vive, Disfruta, Nutre",
      text: "La verdadera nutrición empieza por el placer. No se trata de prohibir, sino de potenciar tu capacidad de disfrutar mientras te cuidas.",
      color: "#E6E6FA", // Lavender
      size: "w-[300px] h-[300px]",
      pos: "lg:translate-y-20"
    },
    {
      label: "La Realidad",
      title: "Impacto del Entorno",
      text: "¿De qué sirve la nutrición si hay estrés? El cansancio y la baja calidad bloquean tu depuración natural. Es como regar una planta en un desierto.",
      color: "#FFD1DC", // Pastel Pink
      size: "w-[320px] h-[320px]",
      pos: "lg:translate-x-8 lg:-translate-y-8"
    },
    {
      label: "Calidad",
      title: "100% Real",
      text: "Alimentos donde cada ingrediente es una joya. Seleccionamos lo mejor porque tu bienestar se nota por fuera cuando te sientes bien por dentro.",
      color: "#E0FFF0", // Mint
      size: "w-[280px] h-[280px]",
      pos: "lg:-translate-x-4 lg:translate-y-12"
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-background overflow-hidden px-6 relative">
      {/* Decorative Orbs in background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-aubergine/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 md:mb-32 flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-sans tracking-[0.5em] uppercase text-aubergine-dark/30 mb-8 block font-bold"
          >
            Filosofía de Vida
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-3xl leading-[1.1]"
          >
            Donde el <span className="italic font-light text-aubergine">placer</span> <br className="hidden md:block"/>
            se encuentra con la <span className="italic font-light text-aubergine">conciencia</span>.
          </motion.h2>
        </header>

        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-0 lg:min-h-[600px]">
          {nodes.map((node, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                duration: 8 + (idx * 2), 
                repeat: Infinity, 
                ease: "easeInOut",
                opacity: { delay: idx * 0.15, duration: 1 },
                scale: { delay: idx * 0.15, duration: 1 }
              }}
              viewport={{ once: true }}
              className={`relative group flex flex-col items-center justify-center text-center p-10 rounded-full border border-aubergine-dark/5 shadow-luxury hover:shadow-2xl transition-all duration-500 bg-white/40 backdrop-blur-md ${node.size} ${node.pos}`}
            >
              {/* Inner Glow Aura */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle at center, ${node.color}20 0%, transparent 70%)`,
                  filter: 'blur(20px)'
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-gold font-bold mb-3 block opacity-80">
                  {node.label}
                </span>
                <h4 className="text-xl md:text-2xl font-serif text-aubergine-dark mb-4 leading-tight">
                  {node.title}
                </h4>
                <p className="text-[13px] md:text-[14px] text-aubergine-dark/60 font-light leading-relaxed max-w-[240px] text-balance">
                  {node.text}
                </p>
              </div>

              {/* Decorative Dot */}
              <div 
                className="absolute bottom-10 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: node.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
