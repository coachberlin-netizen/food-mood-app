import type { Metadata } from "next"
import Link from "next/link"
import { Brain, BookOpen, MessageSquare, Thermometer, Utensils, Heart, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Mis prácticas | Food·Mood",
  description: "Herramientas conductuales para tu bienestar.",
}

const TOOLS = [
  {
    href:        "/registro/interoceptivo",
    icon:        Brain,
    title:       "Check-in interoceptivo",
    description: "Registra tu estado del sistema nervioso y las señales de tu cuerpo. 60-90 segundos.",
    badge:       "Polivagal · Interocepción",
  },
  {
    href:        "/registro/hambre",
    icon:        Thermometer,
    title:       "Termómetro de hambre",
    description: "Distingue hambre física, emocional y claridad interoceptiva antes de comer.",
    badge:       "Interocepción · Alimentación consciente",
  },
  {
    href:        "/registro/emocion",
    icon:        BookOpen,
    title:       "Registro emocional",
    description: "Expande tu vocabulario emocional con un diálogo guiado por IA. 4 turnos.",
    badge:       "Granularidad emocional",
  },
  {
    href:        "/registro/comida",
    icon:        Utensils,
    title:       "Pre/post comida",
    description: "Cómo tu estado emocional y corporal cambia alrededor de las comidas.",
    badge:       "Alimentación · Estado polivagal",
  },
  {
    href:        "/registro/pensamiento",
    icon:        MessageSquare,
    title:       "Diario de pensamientos",
    description: "Explora un pensamiento perturbador con cuestionamiento socrático, ACT y autocompasión.",
    badge:       "TCC · ACT · Autocompasión",
  },
  {
    href:        "/setup/valores",
    icon:        Heart,
    title:       "Mis valores",
    description: "Clarifica los valores que guían tu relación con la alimentación y el cuerpo. 6 turnos.",
    badge:       "Entrevista motivacional",
  },
  {
    href:        "/herramientas/plan-si-entonces",
    icon:        Target,
    title:       "Planes si-entonces",
    description: "Crea intenciones de implementación concretas y registra su uso.",
    badge:       "Gollwitzer · ACT",
  },
]

export default function PracticasPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-5 py-10 pb-28">

        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
            Herramientas
          </p>
          <h1 className="font-serif text-3xl font-black" style={{ color: "#2d0f16" }}>Mis prácticas</h1>
          <p className="text-sm font-light mt-1" style={{ color: "rgba(107,39,55,0.5)" }}>
            Prácticas diarias basadas en neurociencia afectiva y conducta.
          </p>
        </header>

        <ul className="flex flex-col gap-4">
          {TOOLS.map(({ href, icon: Icon, title, description, badge }) => (
            <li key={href}>
              <Link
                href={href}
                className="block bg-white rounded-2xl p-6 transition-all hover:scale-[1.01]"
                style={{ border: "1px solid rgba(107,39,55,0.1)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(107,39,55,0.07)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#6B2737" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#C9A84C" }}>
                      {badge}
                    </span>
                    <h2 className="font-serif text-base font-bold mb-1" style={{ color: "#2d0f16" }}>{title}</h2>
                    <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>{description}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-[10px] text-center mt-10 font-light italic" style={{ color: "rgba(107,39,55,0.35)" }}>
          Estas herramientas son de auto-reflexión guiada. No sustituyen atención psicológica profesional.
          En crisis: 024 (España).
        </p>
      </div>
    </div>
  )
}
