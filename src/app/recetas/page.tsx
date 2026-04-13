import { Suspense } from "react";
import RecetasClient from "./RecetasClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";

export const dynamic = 'force-dynamic';

export default async function RecetasPage() {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse text-aubergine-dark/30 font-serif text-xl">Cargando recetas...</div>
      </div>
    }>
      <RecetasClient initialIsPremium={isPremium} />
    </Suspense>
  );
}
