"use client"

import React from "react"
import { FaqSection } from "@/components/layout/FaqSection"
import { motion } from "framer-motion"

export default function SaberMasPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 bg-cream">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 mb-16"
      >
        <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/40 mb-4 block font-bold">Información</span>
        <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-tight italic">
          Saber más.<br />
          <span className="not-italic font-light opacity-60">Sobre Food·Mood y bienestar.</span>
        </h1>
      </motion.div>
      
      <FaqSection />
      
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-[#7a7974] font-light leading-relaxed italic">
          "La información es el primer paso hacia la transformación. No buscamos solo nutrir tu cuerpo, sino darte las herramientas para entenderlo."
        </p>
      </div>
    </main>
  )
}
