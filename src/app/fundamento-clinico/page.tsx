import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Fundamento clínico — Food·Mood Pro",
  description: "Los marcos teóricos que sustentan Food·Mood Pro: Teoría Polivagal, ACT, Interocepción, Emociones Construidas, Autocompasión, Entrevista Motivacional y el eje intestino–cerebro.",
  robots: { index: false, follow: false },
}

const BURGUNDY = "#6B2737"
const DARK     = "#2d0f16"
const CREAM    = "#F5F0E8"

const FRAMEWORKS = [
  {
    autor:    "Lisa Feldman Barrett",
    titulo:   "Teoría de las emociones construidas",
    conceptos: ["Granularidad emocional", "Construcción predictiva del afecto", "Interoceptive predictions"],
    relevancia: "El paciente no recibe emociones pasivamente — las construye. La granularidad emocional determina la precisión con que puede regular su estado interno. Food·Mood Pro trabaja esta capacidad a través del registro estructurado de estados afectivos.",
  },
  {
    autor:    "Stephen Porges",
    titulo:   "Teoría polivagal",
    conceptos: ["Sistema nervioso autónomo", "Jerarquía de respuesta defensiva", "Co-regulación"],
    relevancia: "El estado del sistema nervioso autónomo condiciona la capacidad de elección alimentaria y la conducta en consulta. Los registros de Food·Mood Pro incorporan señales de activación / desactivación que sitúan al clínico en el contexto neurofisiológico del paciente.",
  },
  {
    autor:    "A.D. Craig / Sahib Khalsa",
    titulo:   "Interocepción",
    conceptos: ["Señales corporales internas", "Precisión interoceptiva", "Conciencia interoceptiva"],
    relevancia: "La capacidad de detectar e interpretar señales corporales predice la autorregulación emocional y la toma de decisiones. Food·Mood Pro entrena la interocepción como habilidad clínica en el contexto de la conducta alimentaria.",
  },
  {
    autor:    "Steven Hayes",
    titulo:   "Terapia de Aceptación y Compromiso (ACT)",
    conceptos: ["Defusión cognitiva", "Aceptación", "Flexibilidad psicológica", "Valores"],
    relevancia: "La inflexibilidad psicológica es uno de los predictores más robustos de la conducta alimentaria disfuncional. Food·Mood Pro estructura los registros en torno a la orientación a valores, no a la corrección de conductas.",
  },
  {
    autor:    "Kristin Neff",
    titulo:   "Autocompasión",
    conceptos: ["Autocompasión", "Mindful self-compassion", "Compasión hacia una misma"],
    relevancia: "La vergüenza asociada a la conducta alimentaria actúa como mantenedor del ciclo restrictivo-compensatorio. Food·Mood Pro utiliza un lenguaje y un diseño que activan la autocompasión como mecanismo de cambio, no la culpa.",
  },
  {
    autor:    "Miller & Rollnick",
    titulo:   "Entrevista motivacional",
    conceptos: ["Ambivalencia al cambio", "Discrepancia", "Autonomía", "Estadios de cambio"],
    relevancia: "El panel del profesional en Food·Mood Pro está diseñado para evidenciar la ambivalencia y el movimiento a través de los estadios de cambio, facilitando la entrevista motivacional con datos longitudinales del paciente.",
  },
  {
    autor:    "Eje intestino–cerebro",
    titulo:   "Microbiota y comunicación bidireccional",
    conceptos: ["Eje microbiota–intestino–cerebro", "Nervio vago", "Postbióticos", "Neuroinflamación"],
    relevancia: "El estado emocional y la conducta alimentaria son bidireccionales con la microbiota intestinal. Food·Mood Pro integra esta dimensión en las sugerencias nutricionales y en la lectura de patrones del paciente.",
  },
]

export default function FundamentoClinicoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        <Link
          href="/"
          className="inline-block text-sm font-medium mb-10 transition-opacity hover:opacity-60"
          style={{ color: `${DARK}99` }}
        >
          ← Inicio
        </Link>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: `${BURGUNDY}60` }}>
          Food·Mood Pro
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4" style={{ color: DARK }}>
          Fundamento clínico
        </h1>
        <p className="text-base font-light leading-relaxed mb-16" style={{ color: `${DARK}80` }}>
          Marcos clínicos que ya usas. Integrados en el flujo de trabajo.
        </p>

        <div className="space-y-0 divide-y" style={{ borderColor: `${BURGUNDY}12` }}>
          {FRAMEWORKS.map(({ autor, titulo, conceptos, relevancia }) => (
            <div key={autor} className="py-10 first:pt-0 last:pb-0">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
                style={{ color: `${BURGUNDY}55` }}
              >
                {autor}
              </p>
              <h2 className="font-serif text-xl font-bold mb-3" style={{ color: DARK }}>
                {titulo}
              </h2>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {conceptos.map(c => (
                  <span
                    key={c}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${BURGUNDY}10`, color: BURGUNDY }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-sm font-light leading-relaxed" style={{ color: `${DARK}75` }}>
                {relevancia}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-16 rounded-2xl px-8 py-8"
          style={{ background: `${BURGUNDY}08`, border: `1px solid ${BURGUNDY}15` }}
        >
          <p className="text-sm font-light leading-relaxed text-center" style={{ color: `${DARK}70` }}>
            Food·Mood Pro no propone un marco teórico nuevo. Utiliza los que ya forman parte de tu práctica clínica y les añade la dimensión conductual e interoceptiva del vínculo emociones–alimentación.
          </p>
        </div>

      </div>
    </div>
  )
}
