import { Suspense } from "react";
import PaletaClient from "./PaletaClient";
import { PaletaIntroSection } from "./PaletaIntroSection";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import { EmotionalLandscape } from "@/components/layout/EmotionalLandscape";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paleta Emocional — Descubre tu Espectro Emocional | Food·Mood",
  description: "Descubre tu mezcla emocional exacta en porcentajes y recibe recetas funcionales para ese estado. Basado en la ciencia del eje microbiota-intestino-cerebro. Gratis.",
  alternates: { canonical: "https://www.food-mood.app/paleta" },
  openGraph: {
    title: "Paleta Emocional — Tu espectro de hoy en porcentajes | Food·Mood",
    description: "No eres 'triste'. Eres un 60% calma, 25% melancolía, 15% curiosidad. Descubre tu mezcla real y las recetas que le responden.",
    url: "https://www.food-mood.app/paleta",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Paleta Emocional — Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paleta Emocional — Tu espectro de hoy | Food·Mood",
    description: "No eres 'triste'. Eres una mezcla única. Descúbrela en 30 segundos.",
    images: ["/og-image.png"],
  },
};

const WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Paleta Emocional — Descubre tu Espectro | Food·Mood",
  "description": "Herramienta de bienestar que mapea tu estado emocional en porcentajes y te recomienda recetas funcionales basadas en el eje microbiota-intestino-cerebro.",
  "url": "https://www.food-mood.app/paleta",
  "inLanguage": "es",
  "isPartOf": { "@type": "WebSite", "url": "https://www.food-mood.app", "name": "Food·Mood" },
  "about": { "@type": "Thing", "name": "Nutrición emocional y eje intestino-cerebro" },
  "author": { "@type": "Organization", "name": "Food·Mood", "url": "https://www.food-mood.app" },
  "disclaimer": "El contenido tiene carácter exclusivamente divulgativo y no constituye diagnóstico médico, tratamiento terapéutico ni asesoramiento nutricional personalizado. Ante cualquier duda de salud consulte a un profesional sanitario.",
  "mentions": [
    { "@type": "Person", "name": "Lisa Feldman Barrett", "jobTitle": "Neurocientífica, Northeastern University" },
    { "@type": "Person", "name": "Matthew Lieberman", "jobTitle": "Psicólogo, UCLA" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es la paleta emocional de Food·Mood?",
      "acceptedAnswer": { "@type": "Answer", "text": "La paleta emocional es una representación visual de tu estado emocional en porcentajes — no una etiqueta única, sino una mezcla. Por ejemplo: 60% calma, 25% melancolía, 15% sin nombre. Basado en la teoría de la granularidad emocional de Lisa Feldman Barrett." }
    },
    {
      "@type": "Question",
      "name": "¿Por qué la comida afecta a las emociones?",
      "acceptedAnswer": { "@type": "Answer", "text": "El 95% de la serotonina — la hormona del bienestar — se produce en el intestino, no en el cerebro. El eje microbiota-intestino-cerebro regula el estado de ánimo, la energía y la concentración. Lo que comes hoy influye directamente en cómo te sientes mañana." }
    },
    {
      "@type": "Question",
      "name": "¿Cómo funciona el test de paleta emocional?",
      "acceptedAnswer": { "@type": "Answer", "text": "Son 4 sliders que miden energía, serenidad, claridad y conexión. En menos de 30 segundos el sistema calcula tu mezcla emocional del día y te sugiere recetas funcionales específicas para ese estado." }
    },
    {
      "@type": "Question",
      "name": "¿Es la paleta emocional un diagnóstico médico?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. Es una herramienta de bienestar y autoconocimiento basada en divulgación científica. No constituye diagnóstico médico, tratamiento terapéutico ni asesoramiento nutricional personalizado. Ante cualquier duda de salud, consulte a un profesional sanitario." }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta acceder a la paleta emocional?",
      "acceptedAnswer": { "@type": "Answer", "text": "El test y el resultado básico de tu paleta emocional son gratuitos. Las recetas completas personalizadas y el historial de paletas están disponibles en el plan Premium desde 5€/mes." }
    },
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cómo descubrir tu paleta emocional con Food·Mood",
  "description": "Un test de 4 indicadores que mapea tu estado emocional del día y genera recetas funcionales basadas en la ciencia del eje intestino-cerebro.",
  "totalTime": "PT2M",
  "tool": [{ "@type": "HowToTool", "name": "Food·Mood (app gratuita)" }],
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Ajusta tu nivel de energía", "text": "Mueve el primer slider para indicar tu impulso de moverte y actuar hoy — de bajo a alto." },
    { "@type": "HowToStep", "position": 2, "name": "Indica tu serenidad", "text": "Expresa tu necesidad de quietud y silencio en este momento." },
    { "@type": "HowToStep", "position": 3, "name": "Evalúa tu claridad mental", "text": "Indica qué tan enfocado o disperso te sientes — tu búsqueda de dirección y nitidez." },
    { "@type": "HowToStep", "position": 4, "name": "Refleja tu conexión social", "text": "Expresa tu deseo de conexión y pertenencia en este momento del día." },
    { "@type": "HowToStep", "position": 5, "name": "Obtén tu paleta y recetas del día", "text": "Food·Mood calcula tu mezcla emocional en porcentajes y te sugiere recetas funcionales diseñadas para ese estado específico." },
  ],
};

export const dynamic = 'force-dynamic';

export default async function PaletaPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string }>;
}) {
  const supabase = await createClient();
  const { test } = await searchParams;

  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  return (
    <div className="min-h-screen bg-[#FFE135]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <PaletaIntroSection />
      <Suspense fallback={
        <div className="min-h-[100dvh] bg-[#FFE135] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-aubergine/10 border-t-aubergine animate-spin" />
        </div>
      }>
        <PaletaClient initialIsPremium={isPremium} initialScreen={test === '1' ? 'sliders' : 'intro'} />
      </Suspense>

      {/* Tus emociones section moved from Home */}
      <EmotionalLandscape />
    </div>
  );
}
