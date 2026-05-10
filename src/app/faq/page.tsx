"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FAQS = [
  { q: "¿Necesito saber cocinar?", a: "No. Las recetas son de 20-30 minutos, 5-7 ingredientes, y se adaptan a tu nivel de energía del día. Si puedes hervir agua, puedes hacer cualquier receta de Food·Mood." },
  { q: "¿Y si tengo intolerancias o sigo una dieta vegana?", a: "Cada receta tiene alternativas sin gluten, sin lácteos y veganas claramente marcadas. El test inicial lo tiene en cuenta para personalizarte mejor." },
  { q: "¿Qué incluye exactamente un reto?", a: "Recetas diarias diseñadas para tu objetivo, audios de contexto científico, tracking de tu índice Food·Mood, y un informe final con tus correlaciones personales." },
  { q: "¿Cuánto cuesta y hay suscripción oculta?", a: "Los retos son pago único: 19€ (7 días) o 29€ (4 semanas). Acceso de por vida al contenido, sin renovación automática. El plan premium mensual/trimestral sí es suscripción — cancelas cuando quieras desde tu perfil." },
  { q: "¿Cuándo empiezo a notar cambios?", a: "La mayoría nota algo diferente entre el día 3 y el día 4. El cambio real — el que se sostiene — aparece en la segunda o tercera semana, cuando el microbioma empieza a reorganizarse." },
  { q: "¿Sustituye a la atención médica o psicológica?", a: "No. Food·Mood es una herramienta de bienestar basada en evidencia nutricional, no un tratamiento médico. Si tienes un diagnóstico, consúltalo siempre con tu profesional." },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <main className="min-h-screen pt-32 pb-24 px-6" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>Preguntas frecuentes</p>
          <h1 className="font-serif text-3xl md:text-4xl" style={{ color: "#2d0f16" }}>Las dudas habituales.</h1>
        </div>
        <div>
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b" style={{ borderColor: "rgba(107,39,55,0.1)" }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left gap-6">
                <span className="font-serif text-lg" style={{ color: "#2d0f16" }}>{faq.q}</span>
                <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-300" style={{ color: "rgba(107,39,55,0.4)", transform: open === i ? "rotate(180deg)" : undefined }} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
                    <p className="pb-5 font-light leading-relaxed text-[15px]" style={{ color: "rgba(107,39,55,0.65)" }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
