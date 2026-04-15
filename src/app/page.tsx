"use client"

import React, { useRef, useState } from "react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
// NewsletterForm removed from hero — relocated to footer area
import { TrustBar } from "@/components/layout/TrustBar"
import { ExpertiseSection } from "@/components/layout/ExpertiseSection"
import { WhatsappConsultSection } from "@/components/layout/WhatsappConsultSection"
import { ExpertTeamSection } from "@/components/layout/ExpertTeamSection"
import { SubscriptionBenefitsSection } from "@/components/layout/SubscriptionBenefitsSection"
import { StoryConstellation } from "@/components/layout/StoryConstellation"
import { MethodSection } from "@/components/layout/MethodSection"
import { FaqSection } from "@/components/layout/FaqSection"
import { EmotionalLandscape } from "@/components/layout/EmotionalLandscape"
import { ArrowRight, FlaskConical } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.45, 0.32, 0.9]
    }
  }
}

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] overflow-hidden font-sans font-light">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative min-h-[88vh] flex flex-col justify-center items-center px-6 pt-24 md:pt-32 pb-16 bg-aubergine"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <div className="space-y-7 md:space-y-10 flex flex-col items-center">
            <motion.div variants={itemVariants} className="text-[11px] font-sans tracking-[0.2em] uppercase text-gold">
              PSICOLOGÍA DE LA ALIMENTACIÓN
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-[5rem] lg:text-[6.5rem] leading-[1.1] md:leading-[1] font-serif italic text-white tracking-tight">
                Descubre qué comer<br className="hidden md:block" />
                <motion.span variants={itemVariants} className="italic font-light text-cream/80">según cómo te sientes.</motion.span>
              </motion.h1>
            </div>
            
            <motion.p variants={itemVariants} className="text-base text-cream/70 max-w-lg mx-auto text-center leading-[1.8] font-sans">
              Tu estado emocional determina lo que tu cuerpo necesita. Food Mood traduce cómo te sientes en recetas que realmente te cuidan.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
              <Link href="/test" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-10 py-4 rounded-[8px] font-semibold">
                  Hacer mi test gratuito
                </Button>
              </Link>
              <Link
                href="/paleta"
                className="text-sm text-cream/50 hover:text-cream/80 transition-colors underline-offset-4 hover:underline font-light"
              >
                o explorar la Paleta →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <TrustBar />
      
      {/* 2. METHODOLOGY (Moved Up) */}
      <MethodSection />

      {/* 2. STORY SECTION: CONSTELLATION */}
      <StoryConstellation />


      {/* 3. EMOTIONAL LANDSCAPE MAP */}
      <EmotionalLandscape />






      {/* 4.8 SUBSCRIPTION BENEFITS SECTION */}
      <SubscriptionBenefitsSection />

      {/* 4.85 TEASER FERMENTOS DEL MUNDO */}
      <section className="py-24 md:py-32 px-6 bg-aubergine-dark border-t border-cream/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5" />
        <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 border border-gold/30 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-gold"></span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gold">
              Contenido Premium
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-black text-cream leading-[1.1] mb-6">
            Fermentos del <span className="italic font-light">Mundo</span>
          </h2>
          
          <p className="text-lg md:text-xl text-cream/70 font-light leading-relaxed max-w-2xl mb-12">
            Explora nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta. De la Nattokinasa japonesa al ácido láctico etíope — la ciencia detrás del eje intestino-cerebro mundial.
          </p>
          
          <Link href="/pricing">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white px-8 py-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl">
              Descubrir con suscripción Premium <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. PRICING SUMMARY */}
      <section className="py-24 md:py-32 px-6 bg-[var(--background)] border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Planes</h2>
            <h3 className="text-3xl md:text-5xl font-serif italic text-aubergine-dark">Empieza gratis. <span className="not-italic font-semibold">Profundiza cuando quieras.</span></h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Free */}
            <div className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 flex flex-col items-start">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35 mb-2">Gratuito</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-3">0€</span>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Test de mood + Paleta Emocional (resultado sin recetas)</p>
              <Link href="/test" className="mt-auto w-full py-3 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-medium text-center hover:bg-aubergine-dark/5 transition-colors">
                Hacer mi test →
              </Link>
            </div>

            {/* Monthly */}
            <div className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 flex flex-col items-start">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35 mb-2">Mensual</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-3">9€<span className="text-base font-light text-aubergine-dark/40">/mes</span></span>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Acceso completo a todas las recetas, el glosario científico, Fermentos del Mundo y tu paleta emocional personalizada.</p>
              <Link href="/pricing" className="mt-auto w-full py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium text-center hover:bg-aubergine-dark/90 transition-colors">
                Suscribirme →
              </Link>
            </div>

            {/* Quarterly — highlighted */}
            <div className="relative bg-cream rounded-2xl border-2 border-[#C9A84C]/40 p-8 flex flex-col items-start shadow-luxury">
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">Más popular</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2">Trimestral</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-1">15€<span className="text-base font-light text-aubergine-dark/40">/ 3 meses</span></span>
              <p className="text-sm text-[#C9A84C] font-semibold mb-1">Solo 5€/mes</p>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Tu paleta emocional completa. Recetas que responden a cada color. Ahorrando un 44%.</p>
              <Link href="/pricing" className="mt-auto w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] text-white text-sm font-semibold text-center shadow-lg hover:shadow-xl transition-all">
                7 días gratis →
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-aubergine-dark/35 font-light">
              Sin permanencia · Cancela cuando quieras · Pago seguro
            </p>
          </div>
        </div>
      </section>

      {/* 5.5 WHATSAPP CONSULT */}
      <WhatsappConsultSection />

      {/* 6. FAQ SECTION */}
      <FaqSection />
      
    </main>
  )
}
