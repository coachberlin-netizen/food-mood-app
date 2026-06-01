import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reglas de detección de señales de atención · Food·Mood",
  description: "Descripción pública y auditadle de las 7 reglas deterministas que generan señales de atención en Food·Mood.",
}

type Rule = {
  id:       number
  slug:     string
  label:    string
  window:   string
  soft:     string
  moderate: string
  source:   string
}

const RULES: Rule[] = [
  {
    id:       1,
    slug:     "guilt_language_pattern",
    label:    "Lenguaje de autocrítica intensa",
    window:   "14 días",
    soft:     "2 o más registros de pensamientos con lenguaje de autocrítica o vergüenza intensa",
    moderate: "4 o más registros",
    source:   "Diario de pensamientos (diálogos socráticos)",
  },
  {
    id:       2,
    slug:     "persistent_low_energy_state",
    label:    "Estado de baja energía persistente",
    window:   "14 días",
    soft:     "3 o más check-ins interoceptivos en estado dorsal (baja energía o colapso)",
    moderate: "5 o más check-ins",
    source:   "Check-in interoceptivo",
  },
  {
    id:       3,
    slug:     "recurring_elevated_anxiety",
    label:    "Activación ansiosa recurrente",
    window:   "14 días",
    soft:     "3 o más check-ins interoceptivos en estado simpático ansioso",
    moderate: "5 o más check-ins",
    source:   "Check-in interoceptivo",
  },
  {
    id:       4,
    slug:     "persistent_body_disconnection",
    label:    "Desconexión corporal persistente",
    window:   "14 días",
    soft:     "4 o más check-ins con claridad interoceptiva igual o inferior a 3/10",
    moderate: "6 o más check-ins",
    source:   "Check-in interoceptivo",
  },
  {
    id:       5,
    slug:     "repeated_emotional_eating_episodes",
    label:    "Episodios repetidos de alimentación emocional",
    window:   "14 días",
    soft:     "3 o más registros con hambre emocional ≥ 7/10 y decisión de comer",
    moderate: "5 o más registros",
    source:   "Termómetro de hambre",
  },
  {
    id:       6,
    slug:     "restriction_signals",
    label:    "Indicadores de restricción",
    window:   "14 días",
    soft:     "2 o más registros con notas de contexto que contienen indicadores de restricción o compensación",
    moderate: "3 o más registros",
    source:   "Termómetro de hambre (notas de contexto)",
  },
  {
    id:       7,
    slug:     "multiple_distress_indicators",
    label:    "Múltiples indicadores de dificultad",
    window:   "14 días",
    soft:     "No aplica (siempre moderada)",
    moderate: "3 o más de las señales anteriores activas simultáneamente",
    source:   "Combinación de reglas 1–6",
  },
]

export default function AttentionFlagsRulesPage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto" style={{ color: "#2d0f16" }}>
      <Link href="/legal" className="text-sm mb-8 block" style={{ color: "rgba(107,39,55,0.5)" }}>
        ← Transparencia y uso responsable
      </Link>

      <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: "#6B2737" }}>
        Reglas de detección de señales de atención
      </h1>
      <p className="text-sm mb-4" style={{ color: "rgba(107,39,55,0.5)" }}>
        Última actualización: 1 de junio de 2026
      </p>

      <div className="rounded-xl px-5 py-4 mb-10 text-sm leading-relaxed" style={{ background: "rgba(107,39,55,0.04)", border: "1px solid rgba(107,39,55,0.1)" }}>
        <p className="mb-2 font-medium" style={{ color: "#6B2737" }}>Aviso importante</p>
        <p style={{ color: "rgba(107,39,55,0.7)" }}>
          Estas señales se generan automáticamente a partir de patrones en los registros del paciente. No constituyen diagnóstico clínico ni evaluación psicológica. Son visibles exclusivamente para el profesional de salud vinculado. La interpretación y la decisión de actuación corresponden siempre al profesional.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#6B2737" }}>Principios de diseño</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside" style={{ color: "rgba(107,39,55,0.7)" }}>
          <li>Todas las reglas son deterministas: no utilizan inteligencia artificial generativa ni modelos de aprendizaje automático.</li>
          <li>Ventana de análisis fija de 14 días para todas las reglas.</li>
          <li>Cada señal incluye los datos concretos que la generaron (número de ocurrencias, fechas).</li>
          <li>El profesional puede descartar cualquier señal; tras el descarte, no se regenera durante 7 días.</li>
          <li>Los pacientes no tienen acceso a estas señales bajo ninguna circunstancia.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-6" style={{ color: "#6B2737" }}>Las 7 reglas</h2>
        <div className="space-y-5">
          {RULES.map(rule => (
            <div
              key={rule.id}
              className="rounded-xl p-5"
              style={{ background: "white", border: "1px solid rgba(107,39,55,0.08)" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: "#6B2737", color: "#F5F0E8" }}
                >
                  {rule.id}
                </span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#6B2737" }}>{rule.label}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: "rgba(107,39,55,0.4)" }}>{rule.slug}</p>
                </div>
              </div>
              <dl className="text-sm space-y-1.5" style={{ color: "rgba(107,39,55,0.7)" }}>
                <div className="flex gap-2">
                  <dt className="font-medium w-24 shrink-0" style={{ color: "#6B2737" }}>Ventana</dt>
                  <dd>{rule.window}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium w-24 shrink-0" style={{ color: "#6B2737" }}>Leve</dt>
                  <dd>{rule.soft}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium w-24 shrink-0" style={{ color: "#6B2737" }}>Moderada</dt>
                  <dd>{rule.moderate}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium w-24 shrink-0" style={{ color: "#6B2737" }}>Fuente</dt>
                  <dd>{rule.source}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#6B2737" }}>Cumplimiento normativo</h2>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(107,39,55,0.7)" }}>
          Este sistema está diseñado para cumplir el artículo 50 del Reglamento de IA de la UE (EU AI Act), que exige transparencia y explicabilidad en sistemas de apoyo a la toma de decisiones que afectan a personas. La publicación de estas reglas es parte de ese compromiso.
        </p>
      </section>

      <p className="text-xs" style={{ color: "rgba(107,39,55,0.4)" }}>
        ¿Preguntas o sugerencias sobre estas reglas?{" "}
        <a href="mailto:privacidad@food-mood.app" className="underline" style={{ color: "#6B2737" }}>
          privacidad@food-mood.app
        </a>
      </p>
    </main>
  )
}
