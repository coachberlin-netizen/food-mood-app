import { Suspense } from "react";
import RecetasClient from "./RecetasClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recetas Funcionales — Come según cómo te sentís | Food·Mood",
  description:
    "200+ recetas de 20-30 minutos diseñadas para tu estado emocional. Ansiedad, energía, sueño, inflamación, foco. Sin dietas, sin contar calorías.",
  alternates: { canonical: "/recetas" },
  openGraph: {
    title: "Recetas Funcionales — Food·Mood",
    description:
      "200+ recetas diseñadas para tu estado emocional. Sin dietas ni restricciones.",
    url: "https://www.food-mood.app/recetas",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Recetas Funcionales Food·Mood" }],
  },
};

export default async function RecetasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  // Fetch first 9 free recipes for SSR — enough to fill the first viewport
  const { data: initialRecetas, count } = await supabase
    .from("recetas")
    .select("*", { count: "exact" })
    .eq("premium_level", 0)
    .limit(9)
    .order("nombre_es");

  const recipes = initialRecetas ?? [];
  const totalCount = count ?? 0;

  const recipeListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recetas funcionales Food·Mood",
    description: "Recetas diseñadas para tu estado emocional — ansiedad, energía, sueño, foco, inflamación.",
    url: "https://www.food-mood.app/recetas",
    numberOfItems: totalCount,
    itemListElement: recipes.map((r: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Recipe",
        "@id": `https://www.food-mood.app/recetas/${r.id}`,
        name: r.nombre_es,
        description: r.contexto_es ?? r.nota_food_mood_es ?? "",
        prepTime: r.tiempo_preparacion_min ? `PT${r.tiempo_preparacion_min}M` : undefined,
        totalTime: r.tiempo_preparacion_min ? `PT${r.tiempo_preparacion_min}M` : undefined,
        recipeCategory: r.tipo_plato ?? "",
        recipeCuisine: "Española",
        keywords: [r.mood_es, r.temporada, ...(r.tags ?? [])].filter(Boolean).join(", "),
        recipeIngredient: Array.isArray(r.ingredientes_es)
          ? r.ingredientes_es.slice(0, 5).map((ing: any) =>
              typeof ing === "string" ? ing : ing?.ingrediente ?? ""
            )
          : [],
        author: { "@type": "Organization", name: "Food·Mood" },
        url: `https://www.food-mood.app/recetas/${r.id}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeListSchema) }}
      />

      {/* Server-rendered recipe index — visible to crawlers, hidden from sighted users */}
      <div className="sr-only">
        <h1>Recetas funcionales — come según cómo te sentís</h1>
        <p>
          Más de 200 recetas de 20-30 minutos diseñadas para tu estado emocional:
          ansiedad, energía, sueño, foco, inflamación, conexión social.
        </p>
        {recipes.length > 0 && (
          <ul>
            {recipes.map((r: any) => (
              <li key={r.id}>
                <a href={`/recetas/${r.id}`}>
                  <strong>{r.nombre_es}</strong>
                  {r.mood_es && ` — para estado ${r.mood_es}`}
                  {r.tiempo_preparacion_min && ` — ${r.tiempo_preparacion_min} min`}
                  {(r.contexto_es ?? r.nota_food_mood_es) && ` — ${r.contexto_es ?? r.nota_food_mood_es}`}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Suspense
        fallback={
          <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <div className="animate-pulse text-aubergine-dark/30 font-serif text-xl">
              Cargando recetas...
            </div>
          </div>
        }
      >
        <RecetasClient
          initialIsPremium={isPremium}
          initialRecetas={recipes as any}
          initialTotal={totalCount}
        />
      </Suspense>
    </>
  );
}
