"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const FAQs = [
  {
    question: "¿Qué es exactamente Food Mood?",
    answer: "Es una herramienta de autoconocimiento en la intersección de tus emociones y tu alimentación. Traduce cómo te sientes en recetas funcionales para cuidar de ti y de tu microbioma, sin regímenes estrictos ni culpas."
  },
  {
    question: "¿Food Mood sustituye terapia o atención médica?",
    answer: "No. Food Mood está diseñada para favorecer la reflexión personal y ofrecerte recursos nutricionales basados en evidencia para tu bienestar general, pero no reemplaza la atención psicológica o el tratamiento médico profesional."
  },
  {
    question: "¿Qué incluye exactamente la experiencia premium?",
    answer: "Acceso ilimitado a nuestro catálogo completo de recetas emocionales (sin bloqueos de contenido), el mapa interactivo profundo de 'Fermentos del Mundo', detalle de ingredientes funcionales y un canal directo vía WhatsApp."
  },
  {
    question: "¿Cómo funciona la consulta por WhatsApp?",
    answer: "Como suscriptor premium, dispones de una línea de WhatsApp como canal de soporte directo. Puedes escribir para consultar sobre sustitución de ingredientes, entender mejor un fermento, o resolver dudas sobre tu perfil nutricional."
  },
  {
    question: "¿Necesito conocimientos previos de nutrición?",
    answer: "Para nada. Todo está diseñado para ser intuitivo y estar al alcance de cualquiera. Solo tienes que identificar tu estado emocional actual, y nosotros nos encargamos de darte la respuesta culinaria exacta."
  },
  {
    question: "¿Me ayudará a mejorar mi relación con la comida?",
    answer: "Ese es su principal objetivo. En lugar de juzgar tus antojos, aprenderás a leer qué te pide tu sistema nervioso (calma, enfoque o energía) y cómo darle a tu biología y paladar lo que realmente necesitan."
  }
];

function FaqItem({ faq, isOpen, onClick }: { faq: typeof FAQs[0], isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-aubergine-dark/10">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-xl font-serif text-aubergine-dark/90 group-hover:text-aubergine transition-colors pr-8">
          {faq.question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-aubergine-dark/40 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? "rotate-180 text-[#C9A84C]" : "group-hover:text-aubergine-dark"}`} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-aubergine-dark/60 font-light leading-[1.8] text-[15px] sm:pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Saber más</h2>
          <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark">Transparencia para tu bienestar.</h3>
        </div>

        <div className="max-w-3xl mx-auto">
          {FAQs.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
