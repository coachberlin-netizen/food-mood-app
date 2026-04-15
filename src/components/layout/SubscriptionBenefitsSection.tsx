"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const benefits = [
  {
    title: "Recetas funcionales",
    description: "Acceso ilimitado a recetas diseñadas para cada estado emocional y necesidad de tu cuerpo."
  },
  {
    title: "Glosario de ingredientes",
    description: "Entiende el poder de cada alimento y cómo influye en tu bienestar."
  },
  {
    title: "Diario emocional-alimentario",
    description: "Un espacio privado para observar y mejorar tus patrones de alimentación consciente."
  },
  {
    title: "Paleta emocional personalizada",
    description: "Tu perfil único que evoluciona contigo a medida que cambian tus necesidades."
  },
  {
    title: "Soporte vía WhatsApp",
    description: "Consulta directa con nuestra psicóloga experta en psicología de la alimentación."
  },
  {
    title: "Contenido exclusivo",
    description: "Artículos y lecciones sobre nutrición, bienestar y el eje intestino-cerebro."
  },
  {
    title: "Fermentos del Mundo",
    description: "Acceso a nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] }
  }
};

export function SubscriptionBenefitsSection() {
  return (
    <section className="py-24 md:py-32 bg-[var(--background)] border-t border-aubergine-dark/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 lg:mb-24">
          <div className="col-span-1 lg:col-span-4">
            <h2 className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 font-semibold">
              ¿Qué incluye tu suscripción?
            </h2>
          </div>
          <div className="col-span-1 lg:col-span-8 flex flex-col items-start">
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-[1.15] max-w-2xl">
              Todo lo que necesitas para <span className="italic font-light">transformar tu relación con la comida.</span>
            </h3>
            <p className="mt-8 text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed max-w-2xl">
              Al unirte a Food Mood obtienes una infraestructura completa diseñada para que tu bienestar emocional sea la base de tu nutrición.
            </p>
          </div>
        </div>

        {/* Benefits Grid (Editorial Asymmetric Layout) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="flex flex-col gap-4 group"
            >
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                <h4 className="text-xl md:text-2xl font-serif font-medium text-aubergine-dark group-hover:text-[#C9A84C] transition-colors duration-300">
                  {benefit.title}
                </h4>
              </div>
              <p className="text-base text-aubergine-dark/70 font-light leading-relaxed pl-5 max-w-md">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action Context */}
        <div className="mt-20 md:mt-28 flex flex-col items-center">
          <div className="w-24 h-px bg-aubergine-dark/10 mb-8" />
          <p className="text-sm text-aubergine-dark/40 font-light italic text-center max-w-lg">
            Todo el contenido ha sido validado por nuestro equipo interdisciplinar para asegurar una base científica rigurosa y humana.
          </p>
        </div>

      </div>
    </section>
  );
}
