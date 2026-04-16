"use client"

import React, { useRef, useState } from "react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { TrustBar } from "@/components/layout/TrustBar"
import { ExpertiseSection } from "@/components/layout/ExpertiseSection"
import { SubscriptionBenefitsSection } from "@/components/layout/SubscriptionBenefitsSection"
import { CompactMethod } from "@/components/layout/CompactMethod"
import { EmotionalConstellation } from "@/components/layout/EmotionalConstellation"

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
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-[5rem] lg:text-[7.5rem] leading-[1.1] md:leading-[0.95] font-serif italic text-white tracking-tight text-balance mb-4">
                Descubre qué comer<br className="hidden md:block" />
                <motion.span variants={itemVariants} className="italic font-light text-cream/80"> para sentirte mejor.</motion.span>
            </motion.h1>

            {/* NEW: VISUAL CONSTELLATION */}
            <motion.div variants={itemVariants} className="w-full py-4 md:py-0">
              <EmotionalConstellation />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full mt-8">
              <Link href="/test" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-12 py-5 rounded-[8px] font-bold shadow-2xl">
                  Hacer mi test gratuito
                </Button>
              </Link>
              <Link
                href="/paleta"
                className="text-sm text-cream/60 hover:text-[#C9A84C] transition-all underline-offset-8 hover:underline font-light tracking-wide"
              >
                o explorar la Paleta →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <ExpertiseSection />
      
      {/* 2. THE FLOW / METHOD & WHATSAPP */}
      <CompactMethod />

      {/* 3. SUBSCRIPTION BENEFITS SECTION */}
      <SubscriptionBenefitsSection />
      
    </main>
  )
}
