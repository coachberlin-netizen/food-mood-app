"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PhilosophySection() {
  const nodes = [
    {
      label: "Serotonina",
      title: "El 95% de tu serotonina la produce tu intestino.",
      text: "No tu cerebro. Por eso lo que comes cambia cómo te sientes — antes de que lo decidas conscientemente.",
      color: "#E30B5D",
      watercolor: "/images/textures/watercolor-raspberry.png",
      size: "w-[340px] h-[340px]",
      pos: "lg:-translate-x-12"
    },
    {
      label: "Placer",
      title: "El placer no es opcional. Es el mecanismo.",
      text: "Comer algo que te gusta activa dopamina, reduce el cortisol y mejora la absorción de nutrientes. El placer es la vía, no la recompensa.",
      color: "#E6E6FA",
      watercolor: "/images/textures/watercolor-lavender.png",
      size: "w-[300px] h-[300px]",
      pos: "lg:translate-y-20"
    },
    {
      label: "Contexto",
      title: "Tu estado emocional cambia tu digestión.",
      text: "Comer con ansiedad convierte cualquier alimento en inflamación. El contexto importa tanto como el ingrediente.",
      color: "#FF7F50",
      watercolor: "/images/textures/watercolor-pomelo.png",
      size: "w-[320px] h-[320px]",
      pos: "lg:translate-x-8 lg:-translate-y-8"
    },
    {
      label: "Hábitos",
      title: "Los hábitos inconscientes son los más poderosos.",
      text: "Y los más difíciles de cambiar. Por eso Food·Mood los hace visibles — con datos, no con fuerza de voluntad.",
      color: "#00CED1",
      watercolor: "/images/textures/watercolor-turquoise.png",
      size: "w-[280px] h-[280px]",
      pos: "lg:-translate-x-4 lg:translate-y-12"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden px-6 relative">
      {/* Decorative Orbs in background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-aubergine/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-sans tracking-[0.5em] uppercase text-aubergine-dark/30 mb-8 block font-bold"
          >
            La ciencia detrás
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-4xl leading-[1.1]"
          >
            Donde la <span className="italic font-light text-aubergine">ciencia</span> <br className="hidden md:block" />
            se convierte en <span className="italic font-light text-aubergine">placer</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-aubergine-dark/50 font-light mt-4 max-w-xl"
          >
            No es nutrición. Es neurociencia aplicada a tu mesa.
          </motion.p>
        </header>

        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-0 lg:min-h-[500px]">
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
              {/* Watercolor Brushstroke Asset - Brightened & Boosted */}
              <motion.img
                src={node.watercolor}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 0.8, rotate: idx * 45 }}
                whileInView={{ opacity: 0.75 }}
                animate={{ 
                  rotate: [idx * 45, idx * 45 + 10, idx * 45],
                  scale: [1, 1.05, 1],
                  x: [0, 5, 0]
                }}
                transition={{
                  duration: 12 + idx,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-16 w-[140%] h-[140%] max-w-none object-contain pointer-events-none"
                style={{ 
                  mixBlendMode: 'multiply',
                  filter: 'saturate(1.5) brightness(1.1) contrast(1.1)'
                }}
              />

              {/* Inner Glow Aura - Much more intense */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle at center, ${node.color}60 0%, transparent 80%)`,
                  filter: 'blur(35px)'
                }}
              />

              {/* Twinkling Sparkle sync with constellation */}
              <motion.div 
                className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full blur-[1px]"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <h3 className="text-xl md:text-2xl font-serif text-aubergine-dark mb-4 leading-tight">
                  {node.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-aubergine-dark/60 font-light leading-relaxed max-w-[240px] text-balance">
                  {node.text}
                </p>
              </div>

              {/* Decorative Dot */}
              <div 
                className="absolute bottom-10 w-2 h-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                style={{ backgroundColor: node.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
