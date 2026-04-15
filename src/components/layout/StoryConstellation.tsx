"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const concepts = [
  { id: 1, title: "Bioquímica", desc: "El origen del hambre.", x: -140, y: -80 },
  { id: 2, title: "Nervio Vago", desc: "Diálogo intestino-cerebro.", x: 140, y: -90 },
  { id: 3, title: "Glucosa", desc: "Raíz de la neblina mental.", x: -160, y: 10 },
  { id: 4, title: "Inflamación", desc: "Respuesta física al estrés.", x: 160, y: 20 },
  { id: 5, title: "Serotonina", desc: "Nace en tu intestino.", x: -130, y: 100 },
  { id: 6, title: "Eje IC", desc: "Tu segundo cerebro.", x: 130, y: 110 },
  { id: 7, title: "Dopamina", desc: "Ciclo ultraprocesado.", x: -40, y: 150 },
  { id: 8, title: "Microbiota", desc: "Equilibro de tu ánimo.", x: 40, y: -140 }
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
    <section className="py-20 md:py-28 bg-cream relative border-t border-aubergine-dark/10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-aubergine-dark/40 mb-6">El Origen</h2>
          <h3 className="text-2xl md:text-4xl font-serif text-aubergine-dark max-w-2xl mx-auto leading-tight italic">
            "Tu bioquímica dicta lo que sientes. Tu plato tiene el poder de cambiarlo."
          </h3>
        </motion.div>

        {/* Constellation Container */}
        <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center">
          
          {/* SVG Connections (Desktop) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block">
            <motion.g initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {concepts.map((concept) => (
                <motion.line
                  key={concept.id}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${concept.x}px)`}
                  y2={`calc(50% + ${concept.y}px)`}
                  stroke="rgba(201, 168, 76, 0.15)"
                  strokeWidth="1"
                  variants={lineVariants}
                />
              ))}
            </motion.g>
          </svg>

          {/* Central Origin Node */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-aubergine-dark border-4 border-gold/20 flex items-center justify-center z-20 shadow-xl"
          >
            <span className="text-gold font-serif text-xs md:text-sm italic text-center px-2">Origen</span>
          </motion.div>

          {/* Nodes - Desktop Clustered Layout */}
          <motion.div 
            className="absolute inset-0 hidden md:block"
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
                <div className="w-3 h-3 rounded-full bg-gold/40 group-hover:bg-gold transition-colors duration-300 shadow-sm" />
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-semibold text-aubergine-dark tracking-wide">{node.title}</span>
                  <span className="text-[9px] text-aubergine-dark/50 italic opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{node.desc}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Nodes - Mobile Compact Layout */}
          <motion.div 
            className="absolute inset-0 md:hidden flex flex-col items-center justify-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="grid grid-cols-2 gap-x-12 gap-y-16 w-full px-4">
              {concepts.map((node, i) => (
                <motion.div 
                  key={node.id}
                  variants={nodeVariants}
                  className={`flex flex-col ${i % 2 === 0 ? 'items-end text-right' : 'items-start text-left'} gap-2`}
                >
                  <div className={`w-2 h-2 rounded-full bg-gold/60`} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-aubergine-dark uppercase tracking-wider">{node.title}</span>
                    <span className="text-[9px] text-aubergine-dark/60 font-light italic leading-tight">{node.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-16 md:mt-24"
        >
          <p className="text-[11px] text-aubergine-dark/30 font-light italic">
            Ciencia aplicada para restaurar tu diálogo interno.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
