"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { TrustBar } from "@/components/layout/TrustBar"
import { PhilosophySection } from "@/components/layout/PhilosophySection"
import { SubscriptionBenefitsSection } from "@/components/layout/SubscriptionBenefitsSection"
import { CompactMethod } from "@/components/layout/CompactMethod"
import { ConstellationBackground } from "@/components/layout/ConstellationBackground"
import { createClient } from "@/lib/supabase/client"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0, 0, 1],
    },
  },
}

const PALETA_BARS = [
  { label: "Calma matizada",      segments: [{ pct: 60, color: "#5A9B8A" }, { pct: 25, color: "#4A7AB5" }, { pct: 15, color: "#C04878" }] },
  { label: "Mañana de energía",   segments: [{ pct: 45, color: "#E8703A" }, { pct: 35, color: "#7A5AAA" }, { pct: 20, color: "#5A9B8A" }] },
  { label: "Tarde introspectiva", segments: [{ pct: 70, color: "#C8902A" }, { pct: 20, color: "#4A7AB5" }, { pct: 10, color: "#5A9B8A" }] },
]

function PaletaTeaser() {
  return (
    <section className="px-6 py-14 md:py-20" style={{ backgroundColor: "#FEFBF4" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-3 text-center">
          Tu paleta emocional
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16] text-center leading-tight mb-3">
          Las emociones no son blanco y negro.
        </h2>
        <p className="text-sm font-light text-[#6B2737]/55 text-center max-w-md mx-auto mb-10 leading-relaxed">
          Cada estado es una mezcla única. Food·Mood la traduce en colores y en recetas que responden exactamente a esa mezcla.
        </p>

        <div className="space-y-4 mb-10">
          {PALETA_BARS.map((bar, i) => (
            <div key={i}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#6B2737]/35 mb-1.5">{bar.label}</p>
              <div className="flex rounded-full overflow-hidden h-6">
                {bar.segments.map((s, j) => (
                  <div key={j} style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/paleta"
            className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ backgroundColor: "#6B2737" }}
          >
            Explorar mi paleta emocional →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setIsAuth(!!user)
    })
  }, [])

  return (
    <main className="min-h-screen bg-background overflow-hidden font-sans font-light">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative min-h-[70vh] flex flex-col justify-center items-center px-6 pt-20 md:pt-24 pb-12 bg-aubergine"
      >
        <ConstellationBackground />
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <div className="space-y-6 md:space-y-8 flex flex-col items-center">

            <motion.p variants={itemVariants} className="text-cream/60 font-sans tracking-[0.2em] uppercase font-bold text-sm md:text-base mb-2">
              Psicología · Food Tech · Eje intestino-cerebro
            </motion.p>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-[5.5rem] lg:text-[7.5rem] leading-[1.1] md:leading-[0.95] font-serif italic text-white tracking-tight text-balance mb-4">
              Recetas que te cambian el humor.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-cream/55 font-light text-base md:text-xl max-w-xl text-center leading-relaxed">
              Cada receta está diseñada para hacerte sentir mejor.<br className="hidden md:block" />
              Sin dietas raras. Sin ingredientes imposibles.<br className="hidden md:block" />
              Solo platos que apetecen y funcionan.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full mt-4">
              <Link href="/test" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-12 py-5 rounded-[8px] font-bold shadow-2xl">
                  Hacer mi test gratuito →
                </Button>
              </Link>
              <Link
                href="/paleta"
                className="text-sm text-cream/60 hover:text-[#C9A84C] transition-all underline-offset-8 hover:underline font-light tracking-wide"
              >
                Explorar mi paleta emocional →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {isAuth === false && <PaletaTeaser />}

      <PhilosophySection />
      
      {/* 2. THE FLOW / METHOD & WHATSAPP */}
      <CompactMethod />

      {/* 3. NUMBERS */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { number: "500M",    label: "hispanohablantes en el mundo"                      },
            { number: "90 días", label: "el ciclo biológico real del cambio"                },
            { number: "95%",     label: "de tu serotonina se produce en el intestino"       },
            { number: "30 seg",  label: "el test de estado diario"                          },
          ].map(({ number, label }) => (
            <div key={number} className="flex flex-col gap-2">
              <span className="font-serif text-4xl md:text-5xl font-black" style={{ color: '#C9A84C' }}>
                {number}
              </span>
              <span className="text-xs font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SUBSCRIPTION BENEFITS SECTION */}
      <SubscriptionBenefitsSection />
      
    </main>
  )
}
