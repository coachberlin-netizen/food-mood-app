"use client";

import React from 'react';
import { MethodSection } from '@/components/layout/MethodSection';
import { MethodSection } from '@/components/layout/MethodSection';
import { motion } from 'framer-motion';

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-cream">
      
      
      <div className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[11px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/40 mb-8 font-bold text-center">
            Nuestro Método
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif text-aubergine-dark text-center leading-tight mb-16">
            La infraestructura de <br className="hidden md:block" />
            <span className="italic font-light text-aubergine">tu bienestar emocional.</span>
          </h2>
        </motion.div>
      </div>

      <MethodSection />

      <section className="py-24 bg-aubergine-dark text-cream px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h3 className="text-3xl md:text-5xl font-serif leading-tight">
            ¿Listo para empezar <span className="italic font-light">tu transformación?</span>
          </h3>
          <p className="text-cream/60 max-w-xl mx-auto font-light leading-relaxed">
            Hacer el test es el primer paso para descubrir tu paleta emocional y empezar a nutrirte de forma consciente.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <a href="/test" className="px-10 py-5 bg-gold text-aubergine-dark font-sans font-medium rounded-full hover:scale-105 transition-transform shadow-xl">
              Hacer mi test gratuito →
            </a>
            <a href="/pricing" className="px-10 py-5 bg-transparent border border-cream/20 text-cream font-sans font-medium rounded-full hover:bg-cream/5 transition-colors">
              Ver planes →
            </a>
          </div>
        </div>
      </section>


    </main>
  );
}
