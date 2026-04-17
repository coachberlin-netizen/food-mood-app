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
    <section className="py-24 md:py-48 bg-cream border-t border-aubergine-dark/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-24 md:mb-40">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-sans tracking-[0.5em] uppercase text-aubergine-dark/30 mb-8 block font-bold"
          >
            Ventajas Club Food Mood
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif text-aubergine-dark max-w-4xl leading-[1.05]"
          >
            Todo lo que necesitas para <br/>
            <span className="italic font-light">nutrir tu bienestar.</span>
          </motion.h3>
        </div>

        {/* Benefits Staggered List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24 md:gap-y-40">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-12 ${idx % 2 === 1 ? 'md:mt-32' : ''}`}
            >
              {/* Event of Color (Compact Watercolor Stain) */}
              <div className="relative flex-shrink-0 group">
                <motion.img 
                  src={benefit.watercolor}
                  alt=""
                  animate={{ 
                    scale: [1, 1.08, 1],
                    y: [0, -5, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 12 + idx, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-20 h-20 md:w-28 md:h-28 object-contain opacity-80 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="space-y-4 max-w-sm">
                <h4 className="text-2xl md:text-3xl font-serif text-aubergine-dark leading-snug">
                  {benefit.title}
                </h4>
                <p className="text-md md:text-lg text-aubergine-dark/60 font-light leading-relaxed text-balance">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured: WhatsApp Club Card (Premium Membership Feel) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-40 md:mt-60 relative group"
        >
          <div className="absolute inset-0 bg-aubergine-dark rounded-[40px] md:rounded-[60px] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-1000" />
          
          <div className="relative bg-aubergine-dark text-cream p-12 md:p-24 rounded-[40px] md:rounded-[60px] overflow-hidden">
            {/* Background Texture Effect */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-gold/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-gold/60 font-bold block">
                  Suscripción Premium
                </span>
                <h3 className="text-4xl md:text-6xl font-serif leading-tight">
                  food-mood Club <br/>
                  <span className="italic font-light opacity-80 text-gold">vía WhatsApp</span>
                </h3>
                <p className="text-lg md:text-xl text-cream/60 font-light leading-relaxed">
                  Acceso directo a la mini-newsletter semanal. <br className="hidden md:block"/>
                  Curada por expertos, libre de ruido.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <Link 
                    href="https://wa.me/34660727224" 
                    target="_blank"
                    className="inline-flex items-center justify-center px-10 py-5 bg-gold text-aubergine-dark text-[11px] uppercase tracking-[0.3em] font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl"
                  >
                    Entrar al Club →
                  </Link>
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Canal privado • 1 envío/semanal</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col space-y-6 opacity-40">
                 <p className="text-sm font-light italic leading-loose">
                  "No es un grupo: tu número es privado y no visible para el resto. Recibes contenido de alto valor científico y recursos curados para tu bienestar."
                 </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Footer Note */}
        <div className="mt-40 md:mt-60 pt-20 border-t border-aubergine-dark/5 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-aubergine-dark/30 font-bold mb-6">
            Infraestructura Humana
          </p>
          <p className="text-sm md:text-md text-aubergine-dark/40 font-light italic max-w-xl mx-auto leading-loose">
            Diseñado artesanalmente para asegurar que tu bioquímica y tu bienestar emocional sean los protagonistas de tu mesa.
          </p>
        </div>

      </div>
    </section>
  );
}
