import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import RecetaDetailClient, { Receta, RelatedReceta } from "./RecetaDetailClient";

export const dynamic = "force-dynamic";

/* ── Fetch helpers ───────────────────────────────────────────── */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function fetchReceta(id: string): Promise<Receta | null> {
  const supabase = await createClient();
  // Always try exact ID match first (covers UUIDs and AS-06 / AE-01 style IDs)
  const { data: byId } = await supabase.from("recetas").select("*").eq("id", id).maybeSingle();
  if (byId) return byId as Receta;
  // Fallback: slug-style name search for human-readable URLs
  if (!UUID_RE.test(id)) {
    const searchName = id.replace(/-/g, " ").split(" ").slice(0, 3).join(" ");
    const { data } = await supabase
      .from("recetas").select("*")
      .ilike("nombre_es", `%${searchName}%`).limit(1);
    return (data?.[0] as Receta) ?? null;
  }
  return null;
}

async function fetchRelated(receta: Receta): Promise<RelatedReceta[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recetas")
    .select("id, nombre_es, mood_es, tiempo_preparacion_min, tipo_plato, dificultad, temporada")
    .eq("mood_es", receta.mood_es)
    .neq("id", receta.id)
    .limit(3);
  return (data ?? []) as RelatedReceta[];
}

/* ── Recipe JSON-LD ─────────────────────────────────────────── */

function buildRecipeSchema(receta: Receta) {
  const steps = receta.preparacion_es?.map((p, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    text: typeof p === "string" ? p : (p as any).paso ?? "",
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: receta.nombre_es,
    description: receta.contexto_es ?? receta.nota_food_mood_es ?? "",
    recipeIngredient: receta.ingredientes_es?.map(i =>
      typeof i === "string" ? i : (i as any).ingrediente ?? ""
    ),
    recipeInstructions: steps,
    prepTime: `PT${receta.tiempo_preparacion_min}M`,
    recipeCategory: receta.tipo_plato ?? "plato principal",
    recipeCuisine: "Española",
    keywords: [
      receta.mood_es,
      receta.tipo_plato,
      receta.temporada,
      ...(receta.tags ?? []),
    ].filter(Boolean).join(", "),
    author: { "@type": "Organization", name: "Food·Mood" },
    url: `https://www.food-mood.app/recetas/${receta.id}`,
  };
}

/* ── generateMetadata ───────────────────────────────────────── */

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const receta = await fetchReceta(id);
  if (!receta) return { title: "Receta no encontrada | Food·Mood" };

  const desc = [
    receta.contexto_es,
    `${receta.tiempo_preparacion_min} min.`,
    receta.nota_food_mood_es?.slice(0, 100),
  ].filter(Boolean).join(" ");

  const title = `${receta.nombre_es} — Receta ${receta.mood_es} | Food·Mood`;

  return {
    title,
    description: desc,
    alternates: { canonical: `/recetas/${receta.id}` },
    openGraph: {
      title,
      description: desc,
      url: `https://www.food-mood.app/recetas/${receta.id}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: receta.nombre_es }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: ["/og-image.png"],
    },
  };
}

/* ── Page ────────────────────────────────────────────────────── */

export default async function RecetaPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const receta = await fetchReceta(id);
  if (!receta) notFound();

  const [relacionadas, supabase] = await Promise.all([
    fetchRelated(receta),
    createClient(),
  ]);

  const { data: { user } } = await supabase.auth.getUser();
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  // Server-side gate: strip prep steps for non-premium users on premium recipes
  const isPremiumRecipe = (receta.premium_level ?? 0) > 0;
  const recetaForClient = (!isPremium && isPremiumRecipe)
    ? { ...receta, preparacion_es: receta.preparacion_es?.slice(0, 1) ?? [] }
    : receta;

  const schema = buildRecipeSchema(receta);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <RecetaDetailClient
        receta={recetaForClient}
        relacionadas={relacionadas}
        isPremium={isPremium}
      />
    </>
  );
}
