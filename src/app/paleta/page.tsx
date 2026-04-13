import { Suspense } from "react";
import PaletaClient from "./PaletaClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";

export const dynamic = 'force-dynamic';

export default async function PaletaPage() {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#6B2737]/10 border-t-[#6B2737] animate-spin" />
      </div>
    }>
      <PaletaClient initialIsPremium={isPremium} />
    </Suspense>
  );
}
