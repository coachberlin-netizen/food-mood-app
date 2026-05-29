import { Suspense } from "react";
import RecetasClient from "./RecetasClient";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recetas Funcionales — Come según cómo te sientes | Food·Mood",
  description:
    "70 recetas funcionales disponibles ahora, más de 200 en desarrollo. Diseñadas para tu estado emocional: ansiedad, energía, sueño, foco. Sin dietas, sin contar calorías.",
  alternates: { canonical: "/recetas" },
  openGraph: {
    title: "Recetas Funcionales — Food·Mood",
    description:
      "70 recetas funcionales disponibles ahora. Más de 200 en desarrollo. Sin dietas ni restricciones.",
    url: "https://www.food-mood.app/recetas",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Recetas Funcionales Food·Mood" }],
  },
};

export default async function RecetasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center" style={{ background: "#F5F0E8" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#C9A84C" }}>
          Recetas
        </p>
        <h1 className="font-serif text-2xl font-black mb-3" style={{ color: "#2d0f16" }}>
          Las recetas las prescribe tu profesional
        </h1>
        <p className="text-sm font-light max-w-sm leading-relaxed mb-8" style={{ color: "rgba(107,39,55,0.6)" }}>
          Tu profesional de salud seleccionará las recetas más adecuadas para ti. Las encontrarás en la sección Para ti.
        </p>
        <a
          href="/para-mi"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#6B2737", color: "#F5F0E8" }}
        >
          Ir a Para ti
        </a>
      </div>
    );
  }

  const isPremium = false;

  // Fetch first 9 free recipes for SSR — enough to fill the first viewport
  const { data: initialRecetas, count } = await supabase
    .from("recetas")
    .select("*", { count: "exact" })
    .eq("premium_level", 0)
    .limit(9)
    .order("nombre_es");

  const seen = new Set<string>();
  const recipes = (initialRecetas ?? []).filter((r: any) => {
    const key = r.nombre_es?.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
        image: [
          `https://www.food-mood.app/og-image.png`,
        ],
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
        <h1>Recetas funcionales — come según cómo te sientes</h1>
        <p>
          70 recetas funcionales disponibles ahora. Más de 200 en desarrollo. Diseñadas para tu estado emocional:
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
          <div className="min-h-screen bg-[var(--background)] px-4 pt-8 pb-16">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Filter bar skeleton */}
              <div className="h-10 w-48 rounded-full bg-white/60 animate-pulse" />
              {/* Cards grid skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-52 rounded-2xl bg-white/60 animate-pulse"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  />
                ))}
              </div>
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
