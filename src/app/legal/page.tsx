import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transparencia y uso responsable · Food·Mood",
  description: "Cómo Food·Mood usa señales automáticas de apoyo clínico y tus derechos como usuario.",
}

export default function LegalPage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto" style={{ color: "#2d0f16" }}>
      <Link href="/" className="text-sm mb-8 block" style={{ color: "rgba(107,39,55,0.5)" }}>
        ← Inicio
      </Link>

      <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: "#6B2737" }}>
        Transparencia y uso responsable
      </h1>
      <p className="text-sm mb-10" style={{ color: "rgba(107,39,55,0.5)" }}>
        Última actualización: 1 de junio de 2026
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#6B2737" }}>Qué es Food·Mood</h2>
        <p className="text-sm leading-relaxed mb-3">
          Food·Mood es una herramienta digital de apoyo para profesionales de la salud y sus pacientes. Ayuda a registrar patrones emocionales, conductuales y de alimentación con el objetivo de enriquecer el trabajo terapéutico.
        </p>
        <p className="text-sm leading-relaxed">
          Food·Mood no es un dispositivo médico, no realiza diagnósticos y no sustituye en ningún caso la valoración de un/a profesional habilitado/a.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#6B2737" }}>Sistema de señales de atención</h2>
        <p className="text-sm leading-relaxed mb-3">
          Food·Mood incluye un sistema automático de señales de atención diseñado para uso exclusivo de los profesionales vinculados. Este sistema analiza los registros del paciente para identificar patrones que puedan merecer atención clínica.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          Las señales se generan mediante reglas deterministas (sin inteligencia artificial generativa) a partir de datos introducidos por el propio paciente. No constituyen diagnóstico, evaluación psicológica ni recomendación clínica.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          Los pacientes no tienen acceso a este sistema. Las señales son un instrumento de apoyo para el profesional, cuya interpretación y decisión de actuación le corresponde en exclusiva.
        </p>
        <p className="text-sm">
          <Link href="/legal/attention-flags-rules" className="underline font-medium" style={{ color: "#6B2737" }}>
            Consultar las reglas de detección públicas
          </Link>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#6B2737" }}>Cumplimiento normativo</h2>
        <p className="text-sm leading-relaxed mb-3">
          El sistema de señales está diseñado para cumplir el artículo 50 del Reglamento de IA de la UE (EU AI Act), que exige explicabilidad total en sistemas de apoyo a la toma de decisiones. Todas las reglas son públicas, auditables y no dependen de modelos de aprendizaje automático.
        </p>
        <p className="text-sm leading-relaxed">
          El tratamiento de datos personales se realiza conforme al RGPD. Food·Mood es una OÜ constituida en Estonia bajo legislación estonia y normativa europea aplicable.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3" style={{ color: "#6B2737" }}>Tus derechos</h2>
        <p className="text-sm leading-relaxed mb-3">
          Puedes ejercer tus derechos de acceso, rectificación, supresión, portabilidad y oposición al tratamiento en cualquier momento escribiendo a{" "}
          <a href="mailto:privacidad@food-mood.app" className="underline" style={{ color: "#6B2737" }}>
            privacidad@food-mood.app
          </a>.
        </p>
        <p className="text-sm leading-relaxed">
          Atenderemos tu solicitud en un plazo máximo de 30 días naturales.
        </p>
      </section>
    </main>
  )
}
