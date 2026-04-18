import { Suspense } from "react";
import PaletaClient from "./PaletaClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import { EmotionalLandscape } from "@/components/layout/EmotionalLandscape";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tus emociones | Food·Mood",
  description: "Explora tu paleta emocional y descubre qué alimentos necesita tu cuerpo hoy.",
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
