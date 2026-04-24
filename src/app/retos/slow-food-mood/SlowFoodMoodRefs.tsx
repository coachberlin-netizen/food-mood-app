"use client"

import { useState } from 'react'

const REFERENCES = [
  {
    author: 'Fogg, B.J. (2019)',
    title: 'Tiny Habits: The Small Changes That Change Everything',
    source: 'Stanford Behavior Design Lab',
    insight: 'Los hábitos reales se forman con gestos pequeños, sensoriales y repetidos — no con fuerza de voluntad.',
    url: null,
  },
  {
    author: 'Kabat-Zinn, J. (1990/2013)',
    title: 'Full Catastrophe Living',
    source: 'University of Massachusetts Medical School',
    insight: 'El protocolo MBSR demuestra que la atención plena en actividades cotidianas reduce el estrés crónico con efectos duraderos años después del entrenamiento.',
    url: null,
  },
  {
    author: 'Pollan, M. (2013)',
    title: 'Cooked: A Natural History of Transformation',
    source: 'Penguin Press',
    insight: 'La fermentación como proceso alquímico que conecta al ser humano con sus ciclos biológicos naturales.',
    url: null,
  },
  {
    author: 'Enders, G. (2014/2024)',
    title: "Gut: The Inside Story of Our Body's Most Underrated Organ",
    source: 'Greystone Books',
    insight: 'Los psicobióticos — microorganismos con efectos psicológicos directos — pueden influir en el estrés a través del eje intestino-cerebro.',
    url: null,
  },
  {
    author: 'Stanton et al. (2024)',
    title: 'Fermented foods: Harnessing their potential to modulate the microbiota-gut-brain axis',
    source: 'Journal of Functional Foods',
    insight: 'Los alimentos fermentados modulan el eje microbiota-intestino-cerebro con efectos directos sobre la ansiedad y el comportamiento.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38278378',
  },
  {
    author: 'Moser et al. (2018)',
    title: 'Fermented foods, the gut and mental health: a mechanistic overview',
    source: 'Nutritional Neuroscience',
    insight: 'La ansiedad y la depresión se relacionan bidireccionalmente con el intestino a través del eje HPA, la permeabilidad intestinal y el microbioma.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30415609',
  },
]

export default function SlowFoodMoodRefs() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y" style={{ borderColor: 'rgba(107,39,55,0.08)' }}>
      {REFERENCES.map((ref, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full text-left py-4 flex items-start justify-between gap-4 group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#6B2737' }}>
                {ref.author}
              </p>
              <p className="text-sm font-medium leading-snug" style={{ color: '#2d0f16' }}>
                {ref.title}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform duration-200 mt-0.5"
              style={{
                backgroundColor: '#6B2737',
                transform: open === i ? 'rotate(45deg)' : 'none',
              }}
            >
              +
            </span>
          </button>

          {open === i && (
            <div className="pb-5 space-y-2 pr-10">
              <p className="text-xs font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
                {ref.source}
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.7)' }}>
                → {ref.insight}
              </p>
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium mt-1"
                  style={{ color: '#6B2737', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Ver en PubMed →
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
