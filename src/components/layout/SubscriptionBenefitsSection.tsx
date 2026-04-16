"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

const benefits = [
  {
    title: "Recetas funcionales",
    description: "Acceso ilimitado a recetas diseñadas para cada estado emocional y necesidad de tu cuerpo.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Glosario de ingredientes",
    description: "Entiende el poder de cada alimento y cómo influye en tu bienestar desde la neurociencia.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" />
        <path d="M8 7h8M8 11h8M8 15h4" strokeLinecap="round" opacity="0.4" />
      </svg>
    )
  },
  {
    title: "Diario emocional-alimentario",
    description: "Un espacio privado para observar y mejorar tus patrones de alimentación consciente.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" />
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        <circle cx="8" cy="14" r="1" fill="currentColor" />
        <circle cx="12" cy="14" r="1" fill="currentColor" opacity="0.4" />
        <circle cx="16" cy="14" r="1" fill="currentColor" opacity="0.2" />
      </svg>
    )
  },
  {
    title: "Paleta emocional personalizada",
    description: "Tu perfil único que evoluciona contigo a medida que cambian tus necesidades.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="4" strokeLinecap="round" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" opacity="0.4" />
      </svg>
    )
  },
  {
    title: "food-mood Club en WhatsApp",
    isWhatsApp: true,
    description: "Canal privado (no grupo) con nuestra mini-newsletter semanal. Novedades científicas y recursos curados por expertos.",
    details: [
      "No es un grupo: tu número es privado y no visible para el resto.",
      "Contenido curado: sin promos pagadas ni marketing agresivo.",
      "Frecuencia amable: solo un envío semanal de alto valor."
    ],
    cta: "Recibir la mini-newsletter en WhatsApp",
    href: "https://wa.me/34660727224",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-7.6 8.38 8.38 0 013.8.9L22 4l-2.1 4.7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Contenido científico exclusivo",
    description: "Artículos sobre el eje intestino-cerebro, microbiota y psicología de la alimentación.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Fermentos del Mundo",
    description: "Explora nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" opacity="0.4" />
      </svg>
    )
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }
  }
};


export function SubscriptionBenefitsSection() {
  return (
    <section className="py-24 md:py-40 bg-cream border-t border-aubergine-dark/10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-32 space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/40 font-bold"
          >
            Ventajas de la Suscripción
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-3xl mx-auto leading-tight"
          >
            Todo lo que necesitas para <span className="italic font-light">nutrir tu bienestar.</span>
          </motion.h3>
        </div>

        {/* Benefits Grid (Visual-First Layout) */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className={`relative h-48 md:h-56 p-6 rounded-[24px] transition-all duration-500 flex flex-col items-center justify-center text-center group cursor-default overflow-hidden ${benefit.isWhatsApp ? 'bg-[#1a1118] border border-[#C9A84C]/30' : 'bg-white/50 border border-aubergine-dark/5 hover:bg-white hover:border-aubergine-dark/15'}`}
            >
              <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${benefit.isWhatsApp ? 'bg-[#C9A84C] text-white' : 'bg-aubergine-dark/5 text-aubergine-dark group-hover:bg-aubergine-dark group-hover:text-white'}`}>
                {benefit.icon}
              </div>
              <h4 className={`text-sm md:text-base font-serif font-bold transition-all duration-500 line-clamp-2 px-2 ${benefit.isWhatsApp ? 'text-[#C9A84C]' : 'text-aubergine-dark group-hover:text-gold'}`}>
                {benefit.title}
              </h4>

              {/* Hover Reveal Description */}
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                whileHover={{ opacity: 1, backdropFilter: "blur(4px)" }}
                className="absolute inset-0 bg-[#1a1118]/90 flex items-center justify-center p-6 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto"
              >
                <div className="space-y-4">
                  <p className="text-[12px] md:text-[13px] text-cream/80 font-light leading-relaxed">
                    {benefit.description}
                  </p>
                  {benefit.isWhatsApp && (
                    <Link 
                      href={benefit.href || '#'} 
                      target="_blank"
                      className="inline-block px-4 py-2 bg-[#C9A84C] text-white text-[10px] uppercase tracking-widest font-bold rounded-lg"
                    >
                      Entrar →
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Global Footer Note */}
        <div className="mt-32 pt-16 border-t border-aubergine-dark/5 text-center">
          <p className="text-sm text-aubergine-dark/30 font-light italic max-w-xl mx-auto leading-loose">
            Toda la infraestructura de Food·Mood ha sido diseñada por expertos interdisciplinares para asegurar que tu bioquímica y tu bienestar emocional sean los protagonistas.
          </p>
        </div>

      </div>
    </section>
  );
}
