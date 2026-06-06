"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, Crown, ArrowRight, Sparkles } from "lucide-react";

import { useEffect, useState } from "react";

const FREE_FEATURES = [
  { text: "Orientación e inspiración por test", included: true },
  { text: "Sin acceso al paso-a-paso completo", included: false },
  { text: "Sin recetas de alta cocina ni Familia", included: false },
  { text: "Sin historial evolutivo guardado", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Recetas preparadas paso-a-paso organizadas por mood" },
  { text: "Variantes y biblioteca para toda la Familia" },
  { text: "Recetas de alta cocina exclusivas" },
  { text: "Historial de mood y favoritos ilimitados" },
  { text: "Soporte nutricional avanzado" },
];

export function UpsellBlock() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/mi-tier')
        if (res.ok) {
          const data = await res.json()
          setIsPremium(data.isPremium)
        }
      } catch (err) {
        console.error("Error checking status in UpsellBlock:", err)
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [])

  if (loading || isPremium) return null

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
          Lo que tu microbioma necesita<br />sobre todo es <em className="text-[#FF6B35] not-italic">variedad</em>
        </h2>
        <p className="text-aubergine-dark/55 font-light text-base max-w-xl mx-auto leading-relaxed">
          Una sola receta es un primer paso. La variedad real nutre tu eje intestino-cerebro.
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
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6B35]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cream/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6B35]">
                Premium
              </span>
              <span className="text-cream/40 text-sm font-light ml-auto">desde 7€/mes</span>
            </div>
            <ul className="space-y-3.5">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
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
          <button className="w-full py-4.5 px-8 bg-[#FF6B35] hover:bg-[#b8953e] text-white text-base font-medium rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5" />
            Empieza tu variedad — desde 7€/mes
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
