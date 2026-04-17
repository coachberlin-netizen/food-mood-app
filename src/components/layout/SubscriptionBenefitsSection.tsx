"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const benefits = [
  {
    title: "Recetas funcionales",
    description: "Acceso ilimitado a recetas diseñadas para cada estado emocional y necesidad de tu cuerpo.",
    watercolor: "/images/textures/blob-raspberry.png",
    color: "#E30B5D"
  },
  {
    title: "Glosario de ingredientes",
    description: "Entiende el poder de cada alimento y cómo influye en tu bienestar desde la neurociencia.",
    watercolor: "/images/textures/blob-lavender.png",
    color: "#E6E6FA"
  },
  {
    title: "Diario emocional-alimentario",
    description: "Un espacio privado para observar y mejorar tus patrones de alimentación consciente.",
    watercolor: "/images/textures/blob-pomelo.png",
    color: "#FF7F50"
  },
  {
    title: "Paleta emocional personalizada",
    description: "Tu perfil único que evoluciona contigo a medida que cambian tus necesidades.",
    watercolor: "/images/textures/blob-aubergine.png",
    color: "#4B0082"
  },
  {
    title: "Contenido científico exclusivo",
    description: "Artículos sobre el eje intestino-cerebro, microbiota y psicología de la alimentación.",
    watercolor: "/images/textures/blob-gold.png",
    color: "#C9A84C"
  },
  {
    title: "Fermentos del Mundo",
    description: "Explora nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta.",
    watercolor: "/images/textures/blob-yellow.png",
    color: "#FFF633"
  }
];

export function SubscriptionBenefitsSection() {
  return (
    <section className="pt-4 md:pt-8 pb-24 md:pb-48 relative overflow-hidden px-6">
      
      {/* MAPA MUNDI: Backdrop Connectors (Ultra-subtle navigation lines) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] md:opacity-[0.03]">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M200,300 Q400,100 600,300 T900,500" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100,600 Q300,800 500,600 T800,400" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M400,200 Q500,500 400,800" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section (Minimal) */}
        <div className="mb-16 md:mb-24 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[9px] font-sans tracking-[0.5em] uppercase text-aubergine-dark/30 mb-8 block font-bold"
          >
            Directorio Food Mood Club
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-tight"
          >
            Todo lo que necesitas para <br/>
            <span className="italic font-light">nutrir tu bienestar.</span>
          </motion.h3>
        </div>

        {/* MAPA MUNDI: Clustered arrows layout */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-12 md:gap-x-16 md:gap-y-20 max-w-4xl mx-auto">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative flex items-start gap-4 group max-w-[280px] p-2 ${
                idx % 2 === 1 ? 'md:translate-y-8' : ''
              }`}
            >
              {/* Premium Arrow (Minimalist Indicator) */}
              <div className="mt-1 flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-aubergine-dark/40 group-hover:text-gold transition-colors duration-500">
                  <path d="M17 7L6 18M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-serif text-aubergine-dark font-bold leading-tight group-hover:text-gold transition-colors duration-500 cursor-default">
                  {benefit.title}
                </h4>
                <p className="text-[11px] md:text-[12px] text-aubergine-dark/50 font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured: WhatsApp Club Access */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-36 md:mt-52 flex flex-col items-center"
        >
          <Link 
            href="https://wa.me/34660727224" 
            target="_blank"
            className="group relative flex items-center gap-6 bg-aubergine-dark text-cream px-10 py-6 md:px-14 md:py-8 rounded-full hover:scale-[1.02] transition-all duration-500 shadow-luxury overflow-hidden"
          >
             <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-5 transition-opacity" />
             
             <div className="flex flex-col items-start">
               <span className="text-[8px] font-sans tracking-[0.4em] uppercase text-gold/80 font-bold">Entrar al Club</span>
               <h3 className="text-2xl md:text-3xl font-serif leading-tight">
                 Vía <span className="italic font-light text-gold">WhatsApp</span>
               </h3>
             </div>

             <div className="w-px h-12 bg-cream/10 hidden md:block" />

             <div className="hidden md:flex flex-col text-[9px] uppercase tracking-widest text-cream/40 gap-1 font-bold">
               <span>Canal Privado</span>
               <span>1 Envío Semanal</span>
             </div>

             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-4 text-gold group-hover:translate-x-1 transition-transform">
               <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </Link>
        </motion.div>

        {/* Global Footer Note */}
        <div className="mt-32 text-center">
          <p className="text-[11px] text-aubergine-dark/20 font-light italic max-w-md mx-auto">
            Infraestructura emocional diseñada bajo evidencia científica.
          </p>
        </div>

      </div>
    </section>
  );
}
