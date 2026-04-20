import { Suspense } from "react";
import PaletaClient from "./PaletaClient";
import { PaletaIntroSection } from "./PaletaIntroSection";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import { EmotionalLandscape } from "@/components/layout/EmotionalLandscape";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paleta Emocional — Descubre tu Espectro | Food·Mood",
  description: "Explora tu paleta emocional y descubre qué alimentos necesita tu cuerpo hoy.",
  alternates: { canonical: "/paleta" },
  openGraph: {
    title: "Paleta Emocional — Descubre tu Espectro | Food·Mood",
    description: "Las emociones no son blanco y negro. Descubre tu mezcla exacta y las recetas que responden a ella.",
    url: "https://www.food-mood.app/paleta",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Paleta Emocional — Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paleta Emocional — Descubre tu Espectro | Food·Mood",
    description: "Las emociones no son blanco y negro. Descubre tu mezcla exacta y las recetas que responden a ella.",
    images: ["/og-image.png"],
  },
};

export const dynamic = 'force-dynamic';

export default async function PaletaPage() {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  return (
    <div className="min-h-screen bg-[#FFE135]">
      <PaletaIntroSection />
      <Suspense fallback={
        <div className="min-h-[100dvh] bg-[#FFE135] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-aubergine/10 border-t-aubergine animate-spin" />
        </div>
      }>
        <PaletaClient initialIsPremium={isPremium} />
      </Suspense>

      {/* Tus emociones section moved from Home */}
      <EmotionalLandscape />
    </div>
  );
}
