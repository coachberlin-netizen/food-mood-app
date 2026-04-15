"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const concepts = [
  { id: 1, title: "Bioquímica", desc: "El origen del hambre y su influencia.", x: -180, y: -100 },
  { id: 2, title: "Nervio Vago", desc: "Diálogo intestino-cerebro.", x: 180, y: -110 },
  { id: 3, title: "Glucosa", desc: "Raíz de la neblina mental.", x: -200, y: 10 },
  { id: 4, title: "Inflamación", desc: "Respuesta física al estrés.", x: 200, y: 20 },
  { id: 5, title: "Serotonina", desc: "Producción intestinal del ánimo.", x: -160, y: 120 },
  { id: 6, title: "Eje Intestino-Cerebro", desc: "Tu segundo cerebro.", x: 160, y: 130 },
  { id: 7, title: "Dopamina", desc: "Ciclo de recompensa.", x: -50, y: 180 },
  { id: 8, title: "Microbiota", desc: "Equilibrio fundamental.", x: 50, y: -160 }
];

const pillarsDetail = [
  { title: "Bioquímica", desc: "El origen del hambre y cómo influye en ti." },
  { title: "Nervio Vago", desc: "El diálogo crucial entre intestino y cerebro." },
  { title: "Glucosa", desc: "La raíz de la neblina mental y cómo gestionarla." },
  { title: "Inflamación", desc: "La respuesta física al estrés y su impacto." },
  { title: "Serotonina", desc: "Cómo se produce en tu intestino y afecta tu ánimo." },
  { title: "Eje Intestino-Cerebro", desc: "Tu segundo cerebro y su importancia." },
  { title: "Dopamina", desc: "El ciclo de recompensa y los ultraprocesados." },
  { title: "Microbiota", desc: "El equilibrio fundamental para tu estado de ánimo." }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 } 
  }
};

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" }
  }
};

export function StoryConstellation() {
  return (
    <section className="py-20 md:py-32 bg-cream relative border-t border-aubergine-dark/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-aubergine-dark/40 mb-6 font-bold">La Esencia</h2>
          <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark max-w-5xl mx-auto leading-tight">
            La esencia de Food Mood: <br />
            <span className="italic font-light">Tu bioquímica dicta lo que sientes. Tu plato tiene el poder de cambiarlo.</span>
          </h3>
          <p className="mt-8 text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            Entendemos la profunda conexión entre tu intestino y tu cerebro. Food Mood aplica los últimos avances en neurociencia nutricional para ofrecerte una alimentación que impacta positivamente en tu estado de ánimo, energía y claridad mental. Nos enfocamos en:
          </p>
        </motion.div>

        {/* Primary Visual: The Solar System / Constellation */}
        <div className="relative h-[500px] md:h-[650px] w-full flex items-center justify-center mb-16 md:mb-24">
          
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.g initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {concepts.map((concept) => (
                <motion.line
                  key={concept.id}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${concept.x}px)`}
                  y2={`calc(50% + ${concept.y}px)`}
                  stroke="rgba(201, 168, 76, 0.2)"
                  strokeWidth="1"
                  variants={lineVariants}
                />
              ))}
            </motion.g>
          </svg>

          {/* Central Node: Bienestar */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-aubergine-dark border-4 border-gold/30 flex flex-col items-center justify-center z-20 shadow-2xl relative"
          >
            <div className="absolute inset-0 rounded-full bg-gold/5 animate-pulse" />
            <span className="text-gold font-serif text-xs md:text-sm font-medium tracking-wider text-center px-2 uppercase">Bienestar</span>
          </motion.div>

          {/* Orbiting Nodes */}
          <motion.div 
            className="absolute inset-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {concepts.map((node) => (
              <motion.div
                key={node.id}
                variants={nodeVariants}
                className="absolute flex flex-col items-center gap-2 group"
                style={{ 
                  left: `calc(50% + ${node.x}px)`, 
                  top: `calc(50% + ${node.y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Node Dot */}
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gold/30 group-hover:bg-gold transition-all duration-500 shadow-sm border border-gold/40" />
                
                {/* Node Label */}
                <div className="flex flex-col items-center max-w-[80px] md:max-w-[120px]">
                  <span className="text-[10px] md:text-[11px] font-bold text-aubergine-dark tracking-wide uppercase group-hover:text-gold transition-colors text-center leading-tight">
                    {node.title}
                  </span>
                  <span className="text-[8px] md:text-[9px] text-aubergine-dark/40 italic opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block mt-1">
                    {node.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Detailed Grid for Readability */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 text-left border-t border-aubergine-dark/10 pt-16">
          {pillarsDetail.map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-white/30 backdrop-blur-sm border border-white hover:border-gold/30 transition-all group"
            >
              <h4 className="font-serif text-lg md:text-xl text-aubergine-dark mb-2 group-hover:text-gold transition-colors">
                {pillar.title}
              </h4>
              <p className="text-xs md:text-sm text-aubergine-dark/60 leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-20 md:mt-24"
        >
          <p className="text-[11px] text-aubergine-dark/30 font-light italic">
            Ciencia aplicada para restaurar tu diálogo interno a través de una nutrición consciente.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
