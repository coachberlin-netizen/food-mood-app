"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const sintomas = [
  { emoji: "😴", titulo: "Cansancio", subtexto: "Sin energía aunque duermas. Tu microbiota pide hierro, B12 y adaptógenos.", slug: "cansancio" },
  { emoji: "😰", titulo: "Ansiedad", subtexto: "Sistema nervioso en alerta. Triptófano, magnesio y fermentados al rescate.", slug: "ansiedad" },
  { emoji: "🌙", titulo: "Insomnio", subtexto: "El sueño empieza en el intestino. GABA, melatonina precursora y calma digestiva.", slug: "insomnio" },
  { emoji: "🍽️", titulo: "Hambre constante", subtexto: "No es falta de voluntad. Es tu microbiota pidiendo fibra y grasas buenas.", slug: "hambre-constante" },
  { emoji: "🧠", titulo: "Niebla mental", subtexto: "El cerebro necesita ácidos grasos omega-3 y un intestino que no inflame.", slug: "niebla-mental" },
  { emoji: "🔥", titulo: "Inflamación silenciosa", subtexto: "La raíz de casi todo. Polifenoles, cúrcuma y el poder del color en el plato.", slug: "inflamacion-silenciosa" }
]

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
                  <div className="text-5xl mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500 origin-left">
                    {sintoma.emoji}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-aubergine-dark mb-4 group-hover:text-[#6B2737] transition-colors">
                    {sintoma.titulo}
                  </h3>
                  <p className="text-aubergine-dark/60 text-base leading-[1.8] font-light">
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
