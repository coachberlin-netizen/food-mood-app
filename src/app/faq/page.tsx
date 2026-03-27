"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 md:py-20 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <span className="text-xs font-bold uppercase tracking-widest text-navy/50 hover:text-navy cursor-pointer mb-8 inline-flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-navy/60 font-serif max-w-2xl">
            Todo lo que necesitas saber sobre Food·Mood, la ciencia detrás y cómo usamos esta información.
          </p>
        </motion.div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-navy">
              ¿La ciencia de Food·Mood es rigurosa?
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/5 shadow-sm text-navy/80 text-lg leading-relaxed">
              <p>
                Nos basamos en investigación publicada sobre el eje intestino-cerebro, microbioma y psiconutrición. Pero cada explicación en la app es una traducción simplificada pensada para que sea útil en tu día a día, no un paper académico. Si quieres profundizar, en el libro Food·Mood encontrarás las referencias completas.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-navy">
              ¿Food·Mood sustituye al médico?
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/5 shadow-sm text-navy/80 text-lg leading-relaxed">
              <p>
                No. Food·Mood te ayuda a entender cómo lo que comes afecta cómo te sientes, y te propone recetas pensadas para tu estado de ánimo. Pero no es un servicio médico ni un sustituto de atención profesional. Si tienes un problema de salud, habla con tu médico.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
