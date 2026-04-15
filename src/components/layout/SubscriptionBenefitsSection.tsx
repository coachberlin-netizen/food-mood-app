"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

const benefits = [
  {
    title: "Recetas funcionales",
    description: "Acceso completo a recetas organizadas por estado emocional y síntoma, diseñadas para nutrir tu bioquímica."
  },
  {
    title: "Glosario científico",
    description: "Una biblioteca detallada de ingredientes, nutrientes y fermentos para entender el 'porqué' detrás de cada bocado."
  },
  {
    title: "Diario emocional-alimentario",
    description: "Espacio privado para registrar y observar tus patrones, conectando lo que comes con cómo te sientes."
  },
  {
    title: "Paleta emocional personalizada",
    description: "Tu perfil metabólico-afectivo traducido a un espectro de color único que evoluciona contigo."
  },
  {
    title: "Consulta por WhatsApp",
    description: "Contacto directo con nuestra psicóloga experta para resolver dudas sobre psicología de la alimentación."
  },
  {
    title: "Contenido educativo",
    description: "Lecciones y artículos actualizados sobre el eje intestino-cerebro, longevidad y tecnología alimentaria."
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
              ¿Qué incluye exactamente?
            </h2>
          </div>
          <div className="col-span-1 lg:col-span-8 flex flex-col items-start">
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-[1.15] max-w-2xl">
              Lo que obtienes al <span className="italic font-light">suscribirte a Food Mood.</span>
            </h3>
            <p className="mt-8 text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed max-w-2xl">
              Nuestra suscripción no es solo un acceso; es una infraestructura diseñada para que la ciencia de la alimentación y tu bienestar emocional hablen el mismo idioma.
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
