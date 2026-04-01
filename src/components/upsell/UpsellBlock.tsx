"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, Crown, ArrowRight, Sparkles } from "lucide-react";

const FREE_FEATURES = [
  { text: "1 receta personalizada por test", included: true },
  { text: "Sin acceso al buscador completo", included: false },
  { text: "Sin recetas Michelin-inspired", included: false },
  { text: "Sin favoritos", included: false },
];

const PREMIUM_FEATURES = [
  { text: "10,000 recetas organizadas por mood, edad y sexo" },
  { text: "Buscador completo con filtros" },
  { text: "200 recetas Michelin-inspired exclusivas" },
  { text: "Guarda tus favoritos" },
  { text: "Nueva receta personalizada cada semana" },
];

export function UpsellBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="w-full max-w-3xl mx-auto mt-16"
    >
      {/* Headline */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-aubergine-dark leading-snug mb-4">
          Lo que tu microbioma necesita<br />sobre todo es <em className="text-[#C9A84C] not-italic">variedad</em>
        </h2>
        <p className="text-aubergine-dark/55 font-light text-base max-w-xl mx-auto leading-relaxed">
          Una sola receta es un primer paso. La variedad real transforma tu eje intestino-cerebro.
        </p>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* FREE column */}
        <div className="bg-cream rounded-2xl border border-aubergine-dark/10 p-7">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 bg-aubergine-dark/5 px-3 py-1.5 rounded-full">
              Gratis
            </span>
            <span className="text-[11px] text-aubergine-dark/30 font-light">Lo que tienes ahora</span>
          </div>
          <ul className="space-y-3.5">
            {FREE_FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                {f.included ? (
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <X className="w-4 h-4 text-aubergine-dark/25 shrink-0 mt-0.5" />
                )}
                <span className={`text-sm font-light ${f.included ? "text-aubergine-dark/70" : "text-aubergine-dark/35"}`}>
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* PREMIUM column */}
        <div className="relative bg-gradient-to-br from-aubergine-dark to-aubergine rounded-2xl p-7 shadow-luxury overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A84C]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cream/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                Premium
              </span>
              <span className="text-cream/40 text-sm font-light ml-auto">9€/mes</span>
            </div>
            <ul className="space-y-3.5">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-sm font-light text-cream/80">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4">
        <Link href="/pricing" className="w-full max-w-md">
          <button className="w-full py-4.5 px-8 bg-[#C9A84C] hover:bg-[#b8953e] text-white text-base font-medium rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5" />
            Empieza tu variedad — 9€/mes
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <Link
          href="/recetas"
          className="text-[11px] font-light text-aubergine-dark/40 hover:text-aubergine-dark/60 uppercase tracking-[0.15em] transition-colors"
        >
          Quizás más tarde →
        </Link>
      </div>
    </motion.section>
  );
}
