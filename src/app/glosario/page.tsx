import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import GlossaryClient from "./GlossaryClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Glosario de Ingredientes Funcionales — Food·Mood",
  description:
    "Qué es la cúrcuma, el kimchi, la ashwagandha y 50+ ingredientes más: su ciencia, sus compuestos activos y cómo afectan tu estado emocional y tu microbiota.",
  alternates: { canonical: "/glosario" },
  openGraph: {
    title: "Glosario de Ingredientes Funcionales — Food·Mood",
    description:
      "Qué es la cúrcuma, el kimchi, la ashwagandha y 50+ ingredientes más: ciencia real aplicada a tu bienestar.",
    url: "https://www.food-mood.app/glosario",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Glosario de ingredientes funcionales — Food·Mood",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glosario de Ingredientes Funcionales — Food·Mood",
    description:
      "Qué es la cúrcuma, el kimchi, la ashwagandha y 50+ ingredientes más: ciencia real aplicada a tu bienestar.",
    images: ["/og-image.png"],
  },
}

export default async function GlosarioPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("glossary")
    .select("id, name, slug, tagline, category, moods, is_premium_detail, active_compounds")
    .order("name")

  if (error) {
    console.error("Supabase fetch error:", error)
  }

  const terms = data || []

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Server-rendered glossary for crawlers */}
      <div className="sr-only">
        <h1>Glosario de ingredientes funcionales — Food·Mood</h1>
        <p>
          Más de 50 ingredientes explicados: qué son, qué compuestos activos tienen y cómo
          afectan tu estado emocional y tu microbiota.
        </p>
        {terms.length > 0 && (
          <dl>
            {terms.map((term) => (
              <div key={term.id}>
                <dt>
                  <a href={`/glosario/${term.slug}`}>
                    <strong>{term.name}</strong>
                    {term.category && ` (${term.category})`}
                  </a>
                </dt>
                {term.tagline && <dd>{term.tagline}</dd>}
                {term.active_compounds && (
                  <dd>Compuestos activos: {term.active_compounds}</dd>
                )}
              </div>
            ))}
          </dl>
        )}
      </div>

      <GlossaryClient initialData={terms} />
    </main>
  )
}
