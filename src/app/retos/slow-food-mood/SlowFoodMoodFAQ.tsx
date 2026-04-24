"use client"

import { useState } from 'react'

const FAQS = [
  {
    q: '¿Necesito experiencia cocinando?',
    a: 'No. Las preparaciones están diseñadas para que cualquier persona pueda hacerlas, independientemente de su nivel en la cocina. El kéfir, la masa madre y los caldos largos son procesos lentos, no técnicos. Lo único que necesitas es tiempo y presencia.',
  },
  {
    q: '¿Cuánto tiempo al día necesito dedicar?',
    a: 'Entre 20 y 40 minutos activos al día. El resto es tiempo de espera: el fermento fermenta solo, la masa madre crece sola, el caldo hierve solo. Esa espera es parte del protocolo.',
  },
  {
    q: '¿Las recetas son vegetarianas o veganas?',
    a: 'La mayoría sí. Algunas incluyen caldo de huesos o pescado. En el reto de 21 días tienes opciones alternativas para cada preparación si sigues una dieta vegetariana o vegana.',
  },
  {
    q: '¿Qué pasa si me salto un día?',
    a: 'Continúas al día siguiente. No existe el "empezar de cero". El objetivo es construir el hábito de la cocina lenta, y los hábitos se construyen con consistencia imperfecta, no con perfección.',
  },
  {
    q: '¿Cómo accedo al contenido después de pagar?',
    a: 'Inmediatamente. Al completar el pago recibes acceso directo en tu cuenta de Food·Mood. Cada día aparece la preparación correspondiente, el audio de ritual y el espacio de diario.',
  },
  {
    q: '¿Hay garantía de devolución?',
    a: 'Sí. Si en los primeros 7 días sientes que el reto no es para ti, te devolvemos el 100% del importe. Sin preguntas. Escríbenos a hola@food-mood.app.',
  },
  {
    q: '¿Es compatible con el Food·Mood Reset?',
    a: 'Son retos complementarios, no simultáneos. El Reset se centra en qué comes. El Slow Food·Mood se centra en cómo cocinas y el efecto que tiene eso sobre tu sistema nervioso. Muchas personas hacen primero el Reset y después el Slow Food·Mood.',
  },
]

export default function SlowFoodMoodFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y" style={{ borderColor: 'rgba(107,39,55,0.08)' }}>
      {FAQS.map((faq, i) => {
        const id = `sfm-faq-${i}`
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={id}
              className="w-full text-left py-4 flex items-start justify-between gap-4"
            >
              <span className="text-sm font-medium leading-snug" style={{ color: '#2d0f16' }}>
                {faq.q}
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform duration-200 mt-0.5"
                style={{
                  backgroundColor: '#6B2737',
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                }}
              >
                +
              </span>
            </button>
            <div
              id={id}
              role="region"
              hidden={!isOpen}
              className="pb-5 pr-10"
            >
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.7)' }}>
                {faq.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
