import { Suspense } from "react";
import DiarioClient from "./DiarioClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";

export const dynamic = 'force-dynamic';

export default async function DiarioPage() {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-6 w-96 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    }>
      <DiarioClient initialIsPremium={isPremium} />
    </Suspense>
  );
}
