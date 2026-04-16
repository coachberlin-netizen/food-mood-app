"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function PhilosophySection() {
  const nodes = [
    {
      label: "El Enfoque",
      title: "Hedonismo Consciente",
      text: "¿Cansado de dietas aburridas y reglas estrictas? Creemos que la vida es demasiado corta para no disfrutar cada bocado. Olvídate de la culpa: lo que te sienta bien, ¡es lo que sabe bien!",
      size: "large"
    },
    {
      label: "La Esencia",
      title: "Vive, Disfruta, Nutre",
      text: "La verdadera nutrición empieza por el placer. No se trata de prohibir, sino de potenciar tu capacidad de disfrutar mientras te cuidas.",
      size: "small"
    },
    {
      label: "La Realidad",
      title: "Impacto del Entorno",
      text: "¿De qué sirve la nutrición si hay estrés? El cansancio y la baja calidad bloquean tu depuración natural. Es como regar una planta en un desierto.",
      size: "small"
    },
    {
      label: "Calidad",
      title: "100% Real",
      text: "Alimentos donde cada ingrediente es una joya. Seleccionamos lo mejor porque tu bienestar se nota por fuera cuando te sientes bien por dentro.",
      size: "small"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--background)] px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <h2 className="text-[10px] font-sans tracking-[0.4em] uppercase text-aubergine-dark/40 mb-8 block font-bold">
            La Verdadera Nutrición Empieza Aquí
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark max-w-2xl leading-[1.1]">
            La Filosofía Food Mood: <br/>
            <span className="italic font-light opacity-80">Vive, Disfruta, Nutre</span>
          </h3>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {nodes.map((node, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className={`p-8 border border-aubergine-dark/5 bg-white/30 backdrop-blur-sm rounded-3xl flex flex-col justify-between ${
                node.size === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <div>
                <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-gold font-bold mb-4 block">
                  {node.label}
                </span>
                <h4 className="text-xl md:text-2xl font-serif text-aubergine-dark mb-4 leading-tight">
                  {node.title}
                </h4>
                <p className="text-sm md:text-md text-aubergine-dark/60 font-light leading-relaxed text-balance">
                  {node.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
