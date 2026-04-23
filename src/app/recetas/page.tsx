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

  // Fetch a representative sample for SSR/SEO — full list loads in client
  const { data: initialRecetas } = await supabase
    .from("recetas")
    .select("id, nombre_es, mood_es, tipo_plato, tiempo_preparacion_min, contexto_es")
    .eq("premium_level", 0)
    .limit(24)
    .order("nombre_es");

  return (
    <>
      {/* Server-rendered recipe index for crawlers */}
      <div className="sr-only">
        <h1>Recetas funcionales — come según cómo te sentís</h1>
        <p>
          Más de 200 recetas de 20-30 minutos diseñadas para tu estado emocional:
          ansiedad, energía, sueño, foco, inflamación, conexión social.
        </p>
        {initialRecetas && initialRecetas.length > 0 && (
          <ul>
            {initialRecetas.map((r) => (
              <li key={r.id}>
                <a href={`/recetas/${r.id}`}>
                  <strong>{r.nombre_es}</strong>
                  {r.mood_es && ` — para estado ${r.mood_es}`}
                  {r.tiempo_preparacion_min && ` — ${r.tiempo_preparacion_min} min`}
                  {r.contexto_es && ` — ${r.contexto_es}`}
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
        <RecetasClient initialIsPremium={isPremium} />
      </Suspense>
    </>
  );
}
