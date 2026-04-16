"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { MessageSquare, Heart, BookOpen, Calculator, Globe, Calendar, Zap, Layout } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    title: "Recetas funcionales",
    description: "Acceso ilimitado a recetas diseñadas para cada estado emocional y necesidad de tu cuerpo.",
    icon: <Heart className="w-5 h-5" />
  },
  {
    title: "Glosario de ingredientes",
    description: "Entiende el poder de cada alimento y cómo influye en tu bienestar desde la neurociencia.",
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    title: "Diario emocional-alimentario",
    description: "Un espacio privado para observar y mejorar tus patrones de alimentación consciente.",
    icon: <Calendar className="w-5 h-5" />
  },
  {
    title: "Paleta emocional personalizada",
    description: "Tu perfil único que evoluciona contigo a medida que cambian tus necesidades.",
    icon: <Calculator className="w-5 h-5" />
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
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    title: "Contenido científico exclusivo",
    description: "Artículos sobre el eje intestino-cerebro, microbiota y psicología de la alimentación.",
    icon: <Zap className="w-5 h-5" />
  },
  {
    title: "Fermentos del Mundo",
    description: "Explora nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta.",
    icon: <Globe className="w-5 h-5" />
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

        {/* The Visual Journey (Vertical Flow) */}
        <div className="relative">
          {/* Central Line (Desktop Only) */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-aubergine-dark/10 hidden md:block" />

          <motion.div 
            className="space-y-16 md:space-y-24 relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16 group"
              >
                {/* Visual Node */}
                <div className="relative z-20 flex items-center justify-center w-20 h-20 rounded-full bg-white border border-aubergine-dark/10 shadow-luxury group-hover:border-[#C9A84C]/50 transition-all duration-500 shrink-0">
                  <div className="text-aubergine-dark group-hover:text-[#C9A84C] transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  {/* Step Number (Small) */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1a1118] text-white text-[10px] font-bold flex items-center justify-center border border-white/20">
                    {idx + 1}
                  </span>
                </div>

                {/* Content Card */}
                <div className={`flex-1 p-8 md:p-12 rounded-[24px] transition-all duration-500 ${benefit.isWhatsApp ? 'bg-[#1a1118] text-cream shadow-2xl border border-[#C9A84C]/20' : 'bg-white/50 border border-aubergine-dark/5 hover:border-aubergine-dark/10 shadow-sm'}`}>
                  <h4 className={`text-2xl md:text-3xl font-serif font-medium mb-4 ${benefit.isWhatsApp ? 'text-[#C9A84C]' : 'text-aubergine-dark'}`}>
                    {benefit.title}
                  </h4>
                  <p className={`text-lg leading-relaxed font-light max-w-2xl mb-6 ${benefit.isWhatsApp ? 'text-cream/70' : 'text-aubergine-dark/60'}`}>
                    {benefit.description}
                  </p>

                  {benefit.isWhatsApp && (
                    <div className="space-y-6 pt-4 border-t border-white/10 mt-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefit.details?.map((detail, d) => (
                          <li key={d} className="flex items-start gap-3 text-sm font-light text-cream/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0 mt-1.5" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                        <Link 
                          href={benefit.href || '#'} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-8 py-4 bg-[#C9A84C] hover:bg-[#b8953e] text-white text-sm font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-center"
                        >
                          {benefit.cta}
                        </Link>
                        <p className="text-[11px] italic font-light text-cream/40">
                          *Canal privado: nadie verá tus datos ni número.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

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
