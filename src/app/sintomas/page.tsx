"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, BatteryLow, Wind, Moon, UtensilsCrossed, Brain, Flame } from "lucide-react"

const sintomas = [
  { icon: BatteryLow, titulo: "Cansancio", subtexto: "Sin energía aunque duermas. Tu microbiota pide hierro, B12 y adaptógenos.", slug: "cansancio" },
  { icon: Wind, titulo: "Ansiedad", subtexto: "Sistema nervioso en alerta. Triptófano, magnesio y fermentados al rescate.", slug: "ansiedad" },
  { icon: Moon, titulo: "Insomnio", subtexto: "El sueño empieza en el intestino. GABA, melatonina precursora y calma digestiva.", slug: "insomnio" },
  { icon: UtensilsCrossed, titulo: "Hambre constante", subtexto: "No es falta de voluntad. Es tu microbiota pidiendo fibra y grasas buenas.", slug: "hambre-constante" },
  { icon: Brain, titulo: "Niebla mental", subtexto: "El cerebro necesita ácidos grasos omega-3 y un intestino que no inflame.", slug: "niebla-mental" },
  { icon: Flame, titulo: "Inflamación silenciosa", subtexto: "La raíz de casi todo. Polifenoles, cúrcuma y el poder del color en el plato.", slug: "inflamacion-silenciosa" }
]

export default function SintomasPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-aubergine-dark/50 hover:text-aubergine-dark transition-colors mb-12 group outline-none">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </Link>

        <div className="text-center mb-20 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-[1.15]"
          >
            Tu cuerpo lleva tiempo hablándote.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-aubergine-dark/60 font-serif italic"
          >
            Elige tu síntoma y descubre cómo restaurar tu equilibrio desde el plato.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sintomas.map((sintoma, i) => (
            <motion.div
              key={sintoma.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Link href={`/sintomas/${sintoma.slug}`} className="group block h-full outline-none">
                <div className="relative bg-transparent border border-[#6B2737]/10 p-10 md:p-12 rounded-[2rem] h-full transition-all duration-500 hover:border-[#6B2737]/25 hover:bg-[#6B2737]/[0.02] hover:-translate-y-1 hover:shadow-xl flex flex-col justify-start overflow-hidden">
                  <div className="w-14 h-14 rounded-2xl bg-[#6B2737]/[0.04] flex items-center justify-center mb-8 transform transition-all duration-500 group-hover:scale-105 group-hover:bg-[#6B2737] group-hover:shadow-md">
                    <sintoma.icon className="w-6 h-6 text-[#6B2737] group-hover:text-[#F5F0E8] transition-colors duration-500 stroke-[1.5]" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-serif text-aubergine-dark mb-4 transition-colors">
                    {sintoma.titulo}
                  </h3>
                  <p className="text-aubergine-dark/60 text-[15px] md:text-base tracking-wide font-light leading-relaxed">
                    {sintoma.subtexto}
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
