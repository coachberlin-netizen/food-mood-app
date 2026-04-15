"use client"

import React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { SYMPTOMS } from "@/data/symptoms"

const svgMap: Record<string, React.ReactNode> = {
  'cansancio': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="16" width="28" height="16" rx="2" />
      <path d="M36 21V27" />
      <rect x="12" y="20" width="6" height="8" rx="1" className="fill-[#6B2737]/20 group-hover:fill-[#C9A84C]/20 transition-colors" />
      <path d="M10 38 Q 24 32 38 38" />
    </svg>
  ),
  'ansiedad': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 24c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8c8.837 0 16-7.163 16-16s-7.163-16-16-16" />
      <path d="M32 32c0 4.418 3.582 8 8 8" />
    </svg>
  ),
  'insomnio': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16C14 24.8366 21.1634 32 30 32C31.3915 32 32.7381 31.8227 34.0202 31.487C31.5478 35.4857 27.086 38.1667 22 38.1667C14.268 38.1667 8 31.8987 8 24.1667C8 17.6534 12.4277 12.1729 18.4357 10.5337C15.5901 11.9674 14 14.3039 14 16Z" />
      <path d="M38 10L38 14M36 12L40 12" />
      <path strokeDasharray="3 3" d="M30 6 L 31 8" />
    </svg>
  ),
  'hambre-constante': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" />
      <path d="M24 24c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 0c-4.418 0-8 3.582-8 8" />
    </svg>
  ),
  'niebla-mental': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 32C8.68629 32 6 29.3137 6 26C6 23.1113 8.0416 20.7001 10.748 20.1416C11.5204 14.4344 16.4526 10 22.4 10C27.4227 10 31.7109 13.1251 33.3917 17.5304C34.2052 17.1852 35.0805 17 36 17C40.4183 17 44 20.5817 44 25C44 29.4183 40.4183 33 36 33" />
      <path strokeDasharray="3 5" d="M14 26H34" />
      <path strokeDasharray="3 5" d="M18 30H30" />
    </svg>
  ),
  'inflamacion-silenciosa': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="4" />
      <circle cx="24" cy="24" r="10" opacity="0.6" />
      <circle cx="24" cy="24" r="16" opacity="0.3" />
    </svg>
  ),
  'digestion-pesada': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 20 Q 18 14 24 20 Q 30 26 38 20" />
      <path d="M10 28 Q 18 22 24 28 Q 30 34 38 28" />
      <path d="M24 10 C 28 10 34 14 34 20 C 34 26 28 32 24 32 C 20 32 14 38 14 38" />
    </svg>
  ),
  'irritabilidad': (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#6B2737] group-hover:stroke-[#C9A84C] transition-colors duration-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="6" />
      <path d="M24 6 L24 10" />
      <path d="M24 38 L24 42" />
      <path d="M6 24 L10 24" />
      <path d="M38 24 L42 24" />
      <path d="M11.5 11.5 L14.3 14.3" />
      <path d="M33.7 33.7 L36.5 36.5" />
      <path d="M36.5 11.5 L33.7 14.3" />
      <path d="M14.3 33.7 L11.5 36.5" />
    </svg>
  )
};

const sintomas = SYMPTOMS.map(s => ({
  ...s,
  icon: svgMap[s.slug] || null
}));

export default function SintomasPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-aubergine-dark/50 hover:text-aubergine-dark transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </Link>

        <div className="text-center mb-20 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-tight"
          >
            Tu cuerpo lleva tiempo hablándote.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-aubergine-dark/60 font-serif italic"
          >
            Elige tu síntoma. Te devolveré las recetas que necesitas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sintomas.map((sintoma, i) => (
            <motion.div
              key={sintoma.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/sintomas/${sintoma.slug}`} className="group block h-full">
                <div className="bg-[#F5F0E8] border border-[#6B2737]/20 p-10 md:p-12 rounded-2xl h-full transition-all duration-500 hover:shadow-[0_12px_40px_-8px_rgba(201,168,76,0.25)] hover:scale-[1.02] relative overflow-hidden flex flex-col justify-start">
                  <div className="mb-8 transform transition-all duration-500 origin-left">
                    {sintoma.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-aubergine-dark mb-4 group-hover:text-[#6B2737] transition-colors">
                    {sintoma.titulo}
                  </h3>
                  <p className="text-aubergine-dark/60 text-base leading-[1.8] font-light">
                    {sintoma.subtitulo}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
