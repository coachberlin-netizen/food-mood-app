import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getPremiumStatus } from "@/lib/premium"
import GlossaryClient from "./GlossaryClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Glosario de Ingredientes Funcionales — Food·Mood",
  description:
    "Qué es la cúrcuma, el kimchi, la ashwagandha y 50+ ingredientes más: su ciencia, sus compuestos activos y cómo afectan tu estado emocional y tu microbiota.",
  alternates: {
    canonical: "/glosario",
    languages: {
      "es": "https://www.food-mood.app/glosario",
      "x-default": "https://www.food-mood.app/glosario",
    },
  },
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

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Food·Mood",
      item: "https://www.food-mood.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Glosario de ingredientes funcionales",
      item: "https://www.food-mood.app/glosario",
    },
  ],
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

  const { data: { user } } = await supabase.auth.getUser()
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false

  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glosario de ingredientes funcionales Food·Mood",
    description:
      "Más de 50 ingredientes funcionales explicados: compuestos activos, efectos en el estado emocional y en la microbiota intestinal.",
    url: "https://www.food-mood.app/glosario",
    hasDefinedTerm: terms.slice(0, 30).map((t) => ({
      "@type": "DefinedTerm",
      name: t.name,
      description: t.tagline ?? "",
      url: `https://www.food-mood.app/glosario/${t.slug}`,
      inDefinedTermSet: "https://www.food-mood.app/glosario",
    })),
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />

      {/* Server-rendered glossary for crawlers */}
      <div className="sr-only">
        <h1 aria-hidden="true">Glosario de ingredientes funcionales — Food·Mood</h1>
        <p>
          Más de 50 ingredientes explicados: qué son, qué compuestos activos tienen y cómo
          afectan tu estado emocional y tu microbiota.
        </p>
        <nav aria-label="Categorías del glosario">
          <a href="/glosario?categoria=fermentado">Fermentados</a>
          <a href="/glosario?categoria=especia">Especias</a>
          <a href="/glosario?categoria=hongo">Hongos</a>
          <a href="/glosario?categoria=semilla">Semillas</a>
          <a href="/glosario?categoria=verdura">Verduras</a>
        </nav>
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
                {Array.isArray(term.active_compounds) && term.active_compounds.length > 0 && (
                  <dd>Compuestos activos: {(term.active_compounds as string[]).join(", ")}</dd>
                )}
              </div>
            ))}
          </dl>
        )}
      </div>

      <GlossaryClient initialData={terms as any} isPremium={isPremium} />
    </main>
  )
}
