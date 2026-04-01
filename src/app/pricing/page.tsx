"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowRight, Zap, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { text: "10,000 recetas organizadas por mood, edad y sexo", highlight: true },
  { text: "Buscador completo con filtros avanzados", highlight: false },
  { text: "200 recetas Michelin-inspired exclusivas", highlight: true },
  { text: "Guarda tus favoritos ilimitados", highlight: false },
  { text: "Nueva receta personalizada cada semana", highlight: false },
  { text: "Acceso a la ciencia detrás de cada receta", highlight: false },
];

const FREE_FEATURES = [
  "1 receta personalizada por test",
  "Resultado de tu mood actual",
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago. Inténtalo de nuevo.");
        setIsLoading(false);
      }
    } catch {
      alert("Error de conexión. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 md:px-12">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.15em] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Tu eje intestino-cerebro merece variedad
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-[1.1] mb-5">
            Elige tu plan
          </h1>
          <p className="text-lg text-aubergine-dark/50 font-light max-w-xl mx-auto leading-relaxed">
            Una sola receta es un primer paso. La transformación real viene con la diversidad microbiana.
          </p>
        </motion.div>

        {/* ── Plans grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">

          {/* FREE plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 md:p-10 flex flex-col"
          >
            <div className="mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35">
                Gratis
              </span>
              <div className="flex items-end gap-1 mt-3 mb-2">
                <span className="text-5xl font-serif text-aubergine-dark">0€</span>
                <span className="text-aubergine-dark/40 font-light text-sm mb-2">/siempre</span>
              </div>
              <p className="text-sm text-aubergine-dark/45 font-light">
                Prueba lo que Food·Mood puede hacer por ti.
              </p>
            </div>

            <ul className="space-y-3.5 mb-10 flex-1">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-aubergine-dark/30 shrink-0 mt-0.5" />
                  <span className="text-sm font-light text-aubergine-dark/50">{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/test">
              <button className="w-full py-3.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-medium hover:bg-aubergine-dark/5 transition-colors">
                Hacer el test gratis
              </button>
            </Link>
          </motion.div>

          {/* PREMIUM plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-br from-aubergine-dark via-aubergine to-aubergine-dark rounded-2xl p-8 md:p-10 flex flex-col overflow-hidden shadow-luxury"
          >
            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cream/5 rounded-full blur-3xl" />

            {/* Badge */}
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                Popular
              </span>
            </div>

            <div className="relative mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                  Premium
                </span>
              </div>
              <div className="flex items-end gap-1 mt-3 mb-2">
                <span className="text-5xl font-serif text-cream">9€</span>
                <span className="text-cream/40 font-light text-sm mb-2">/mes</span>
              </div>
              <p className="text-sm text-cream/50 font-light">
                Acceso completo al ecosistema Food·Mood.
              </p>
            </div>

            <ul className="space-y-3.5 mb-10 flex-1 relative">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className={`w-4 h-4 shrink-0 mt-0.5 ${f.highlight ? "text-[#C9A84C]" : "text-cream/40"}`} />
                  <span className={`text-sm font-light ${f.highlight ? "text-cream/90" : "text-cream/60"}`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="relative w-full py-4 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirigiendo a pago seguro…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Empieza tu variedad — 9€/mes
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-cream/30 mt-4 font-light">
              Cancela cuando quieras · Sin permanencia
            </p>
          </motion.div>
        </div>

        {/* ── FAQ / trust ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aubergine-dark/30 text-center mb-8">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "¿Puedo cancelar cuando quiera?",
                a: "Sí, sin permanencia. Cancela desde tu perfil en cualquier momento y seguirás teniendo acceso hasta el final del periodo pagado.",
              },
              {
                q: "¿Las recetas son realmente diferentes?",
                a: "Cada receta está diseñada para un cruce específico de mood, sexo y grupo de edad. Con 10,000 combinaciones, nunca te faltará variedad.",
              },
              {
                q: "¿Qué son las recetas Michelin-inspired?",
                a: "200 recetas diseñadas con técnicas de 20 chefs con estrella Michelin. El mismo rigor científico Food·Mood, con técnicas de alta cocina.",
              },
              {
                q: "¿Es seguro el pago?",
                a: "Utilizamos Stripe, el procesador de pagos líder mundial. Tus datos financieros nunca pasan por nuestros servidores.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-aubergine-dark/8 pb-6">
                <h3 className="text-base font-medium text-aubergine-dark mb-2">{faq.q}</h3>
                <p className="text-sm text-aubergine-dark/50 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Disclaimer ─────────────────────────────────────── */}
        <div className="flex items-start gap-3 mt-16 text-aubergine-dark/25 text-xs max-w-2xl mx-auto">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-light">
            Food·Mood recomienda recetas y alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia.
          </p>
        </div>
      </div>
    </div>
  );
}
