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
    watercolor: "/images/textures/blob-turquoise.png",
    color: "#00CED1"
  },
  {
    title: "Contenido científico exclusivo",
    description: "Artículos sobre el eje intestino-cerebro, microbiota y psicología de la alimentación.",
    watercolor: "/images/textures/blob-raspberry.png",
    color: "#E30B5D"
  },
  {
    title: "Fermentos del Mundo",
    description: "Explora nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta.",
    watercolor: "/images/textures/blob-turquoise.png",
    color: "#00CED1"
  }
];

export function SubscriptionBenefitsSection() {
  return (
    <section className="py-24 md:py-48 relative overflow-hidden px-6">
      
      {/* MAPA MUNDI: Backdrop Connectors (Subtle constellation lines) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] md:opacity-[0.05]">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M200,300 Q400,100 600,300 T900,500" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M100,600 Q300,800 500,600 T800,400" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M400,200 Q500,500 400,800" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section (Minimal & Integrated) */}
        <div className="mb-20 md:mb-32 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-sans tracking-[0.5em] uppercase text-aubergine-dark/30 mb-8 block font-bold"
          >
            Universo Food Mood Club
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-tight"
          >
            Todo lo que necesitas para <br/>
            <span className="italic font-light">nutrir tu bienestar.</span>
          </motion.h3>
        </div>

        {/* MAPA MUNDI Layout: Tight Organic Cluster */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-16 md:gap-x-20 md:gap-y-24 max-w-5xl mx-auto lg:min-h-[500px]">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              viewport={{ once: true }}
              className={`relative flex flex-col items-center group max-w-[220px] text-center ${
                idx === 1 ? 'md:-translate-y-12' : 
                idx === 2 ? 'md:translate-y-12' : 
                idx === 4 ? 'md:-translate-y-8' : ''
              }`}
            >
              {/* Node / Manchita */}
              <div className="relative mb-6">
                <motion.img 
                  src={benefit.watercolor}
                  alt=""
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, 0]
                  }}
                  transition={{ 
                    duration: 10 + idx, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-80 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-3 px-2">
                <h4 className="text-lg md:text-xl font-serif text-aubergine-dark font-bold leading-tight">
                  {benefit.title}
                </h4>
                <p className="text-[12px] md:text-[13px] text-aubergine-dark/60 font-light leading-relaxed text-balance">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured: WhatsApp Club Access (Integrated into flow) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 md:mt-48 flex flex-col items-center"
        >
          <div className="inline-block relative p-1">
            <div className="absolute inset-0 bg-gold/10 rounded-full blur-2xl animate-pulse" />
            <Link 
              href="https://wa.me/34660727224" 
              target="_blank"
              className="relative flex flex-col items-center gap-4 bg-aubergine-dark text-cream px-10 py-10 md:px-16 md:py-16 rounded-full hover:scale-105 transition-transform duration-500 shadow-luxury group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-5 transition-opacity" />
              
              <span className="text-[9px] font-sans tracking-[0.4em] uppercase text-gold/80 font-bold">
                Entrar al Club
              </span>
              <h3 className="text-3xl md:text-4xl font-serif leading-tight text-center">
                Vía <span className="italic font-light text-gold">WhatsApp</span>
              </h3>
              
              {/* Subtle Status Info */}
              <div className="flex items-center gap-2 pt-2 opacity-50 text-[9px] uppercase tracking-widest">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                <span>Canal Privado • Newsletter Semanal</span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Global Footer Note - More integrated */}
        <div className="mt-32 text-center">
          <p className="text-[11px] md:text-[12px] text-aubergine-dark/30 font-light italic max-w-lg mx-auto leading-loose">
            Diseñamos esta infraestructura para asegurar que tu bioquímica y tu bienestar emocional sean los protagonistas de cada plato.
          </p>
        </div>

      </div>
    </section>
  );
}
