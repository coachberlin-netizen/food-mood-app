"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Zap, Flame, Battery, RefreshCw, 
  Brain, Leaf, Dumbbell, Microscope, Heart, Users 
} from "lucide-react";

/* ── Hardcoded Data ───────────────────────────────────────── */
const STATES = [
  { id: "agotado", name: "Agotado", icon: Zap, desc: "Sientes fatiga profunda y falta de claridad." },
  { id: "inflamado", name: "Inflamado", icon: Flame, desc: "Hinchazón, pesadez o malestar digestivo." },
  { id: "energia", name: "Con energía", icon: Battery, desc: "Buscas potenciar tu rendimiento actual." },
  { id: "recuperacion", name: "Recuperación", icon: RefreshCw, desc: "Tras un esfuerzo físico o mental intenso." }
];

const RECIPES_DATA = {
  agotado: {
    title: "Bowl de Remolacha y Quinoa Activadora",
    why: "La betaína de la remolacha y los nitratos naturales oxigenan la sangre, mientras que la quinoa aporta energía sostenida sin picos de insulina.",
    ingredients: ["Remolacha asada", "Quinoa real", "Pipas de calabaza", "Espinaca baby", "Aliño de jengibre"]
  },
  inflamado: {
    title: "Cúrcuma Latte con Miel Cruda y Pimienta",
    why: "La curcumina es un potente antiinflamatorio natural que se potencia con la pimienta. Calma el sistema digestivo y reduce el estrés oxidativo.",
    ingredients: ["Cúrcuma fresca", "Leche de coco", "Pimienta negra", "Miel cruda", "Canela de Ceylán"]
  },
  energia: {
    title: "Smoothie de Bayas y Semillas de Chía",
    why: "Antocianinas de las bayas protegen tus neuronas mientras que los omega-3 de la chía optimizan el foco cognitivo y la resistencia.",
    ingredients: ["Arándanos", "Semillas de chía", "Dátiles", "Agua de coco", "Polen de abeja"]
  },
  recuperacion: {
    title: "Sopa Miso con Algas y Tofu",
    why: "Probióticos vivos para restaurar la microbiota y electrolitos naturales para rehidratar el cuerpo profundamente tras el estrés.",
    ingredients: ["Miso orgánico", "Alga wakame", "Tofu sedoso", "Cebollino", "Setas shiitake"]
  }
};

const TEAM_PILLS = [
  { icon: Brain, label: "Psicología" },
  { icon: Heart, label: "Psicología de la alimentación" },
  { icon: Hourglass, label: "Longevidad" },
  { icon: Dumbbell, label: "Fitness y rendimiento" },
  { icon: Users, label: "Coaching nutricional" },
  { icon: Microscope, label: "Biotecnología alimentaria" }
];

export default function PerformancePage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleCheckout = () => {
    // We use the same monthly price ID as per requirement
    const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY || "price_1THUGfKAfsMmyDlfym8JQTiC";
    
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: monthlyPriceId, planType: "monthly" }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.url) window.location.href = data.url;
    })
    .catch(err => console.error("Checkout error:", err));
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] font-sans selection:bg-[#C9A84C]/30 scroll-smooth">
      
      {/* 1. Nav fijo */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#4A1A26]/90 backdrop-blur-md border-b border-[#F5F0E8]/10 text-[#F5F0E8]">
        <div className="text-xl md:text-2xl font-playfair font-bold tracking-tight">Food·Mood</div>
        <Link href="/" className="text-xs md:text-sm font-medium hover:text-[#C9A84C] transition-colors flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </Link>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-[#4A1A26] to-[#F5F0E8] min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-8 leading-tight">
            ¿Cómo está tu cuerpo ahora mismo?
          </h1>
          <p className="text-[#F5F0E8]/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Identifica tu estado físico dominante para recibir una orientación nutricional funcional basada en la ciencia.
          </p>
        </motion.div>
      </section>

      {/* 3. Grid de Estados */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATES.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state.id)}
              className={`p-6 md:p-10 rounded-2xl border-2 transition-all duration-300 text-left flex flex-col gap-4 group ${
                selectedState === state.id 
                ? "bg-[#6B2737] border-[#C9A84C] text-[#F5F0E8] shadow-2xl scale-[1.02]" 
                : "bg-white border-[#4A1A26]/5 text-[#4A1A26] hover:border-[#C9A84C]/30 hover:shadow-xl"
              }`}
            >
              <state.icon className={`w-8 h-8 transition-colors ${
                selectedState === state.id ? "text-[#C9A84C]" : "text-[#4A1A26]/40 group-hover:text-[#4A1A26]"
              }`} />
              <div>
                <h3 className="text-xl font-bold mb-2">{state.name}</h3>
                <p className={`text-xs leading-relaxed ${
                  selectedState === state.id ? "text-[#F5F0E8]/60" : "text-[#4A1A26]/50"
                }`}>
                  {state.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Result Card */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <AnimatePresence mode="wait">
          {selectedState ? (
            <motion.div
              key={selectedState}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-[#4A1A26]/5 shadow-luxury"
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4 block">
                      Recomendación Funcional
                    </span>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#4A1A26] leading-tight">
                      {RECIPES_DATA[selectedState as keyof typeof RECIPES_DATA].title}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A1A26]/40">¿Por qué funciona?</h4>
                    <p className="text-sm font-light leading-relaxed text-[#4A1A26]/70">
                      {RECIPES_DATA[selectedState as keyof typeof RECIPES_DATA].why}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F5F0E8]/50 rounded-3xl p-8 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A1A26]/40">Ingredientes Clave</h4>
                  <ul className="space-y-4">
                    {RECIPES_DATA[selectedState as keyof typeof RECIPES_DATA].ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium text-[#4A1A26]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-[#4A1A26]/10 rounded-[2.5rem]">
               <p className="text-[#4A1A26]/30 font-serif italic text-lg">Selecciona un estado arriba para ver tu mapa nutricional</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 5. Sección de Equipo */}
      <section className="bg-white py-32 border-y border-[#4A1A26]/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4A1A26]/40 mb-12">
            Metodología diseñada por expertos en:
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TEAM_PILLS.map((pill, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#F5F0E8] border border-[#4A1A26]/5 hover:border-[#C9A84C]/30 transition-colors"
              >
                <pill.icon className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-xs font-semibold text-[#4A1A26]/70">{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Box */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#4A1A26] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-50" />
            <div className="relative z-10 space-y-10">
              <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white leading-tight">
                Accede a todo el mapa <br className="hidden md:block"/> de nutrición emocional
              </h3>
              <p className="text-[#F5F0E8]/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Desbloquea cientos de recetas, protocolos de suplementación y el historial completo de tu evolución.
              </p>
              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={handleCheckout}
                  className="bg-[#C9A84C] hover:bg-[#b8953e] text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-3"
                >
                  Empieza 7 días gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-white/30 text-xs font-medium">Solo 9€/mes después · Cancela cuando quieras</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Link Secundario */}
      <section className="pb-32 text-center px-6">
        <Link 
          href="/test" 
          className="text-[#4A1A26]/60 hover:text-[#4A1A26] font-medium text-sm transition-all group flex items-center justify-center gap-2"
        >
          ¿Quieres tu mapa emocional completo? 
          <span className="text-[#C9A84C] group-hover:underline">Hacer el quiz principal →</span>
        </Link>
      </section>

      {/* 8. Disclaimer Legal */}
      <footer className="py-12 bg-[#F5F0E8] border-t border-[#4A1A26]/10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] text-[#4A1A26]/30 leading-relaxed uppercase tracking-widest">
            Food·Mood recomienda alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia médica. Consulta con tu especialista antes de realizar cambios significativos en tu dieta.
          </p>
        </div>
      </footer>

      {/* Estilos adicionales para Playfair */}
      <style jsx global>{`
        .font-playfair {
          font-family: var(--font-playfair-display), serif;
        }
      `}</style>

    </main>
  );
}
