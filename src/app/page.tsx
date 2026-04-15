"use client"

import React, { useRef, useState } from "react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"
import { TrustBar } from "@/components/layout/TrustBar"
import { ExpertiseSection } from "@/components/layout/ExpertiseSection"
import { SubscriptionBenefitsSection } from "@/components/layout/SubscriptionBenefitsSection"
import { CompactMethod } from "@/components/layout/CompactMethod"
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
            
            <div className="space-y-6">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-[5rem] lg:text-[6.5rem] leading-[1.1] md:leading-[1] font-serif italic text-white tracking-tight text-balance">
                Descubre qué comer<br className="hidden md:block" />
                <motion.span variants={itemVariants} className="italic font-light text-cream/80"> para sentirte mejor.</motion.span>
              </motion.h1>
            </div>
            
            <motion.p variants={itemVariants} className="text-base text-cream/70 max-w-2xl mx-auto text-center leading-[1.8] font-sans">
              Aplica los últimos avances en neurociencia nutricional para ofrecerte una alimentación que impacta positivamente en tu estado de ánimo, energía y claridad mental.
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
      
      {/* 2. THE FLOW / METHOD & WHATSAPP */}
      <CompactMethod />

      {/* 3. SUBSCRIPTION BENEFITS SECTION */}
      <SubscriptionBenefitsSection />
      
    </main>
  )
}
