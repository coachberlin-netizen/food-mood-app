import { Suspense } from "react";
import ResultadoClient from "./ResultadoClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";

export const metadata = { robots: { index: false, follow: false } };

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Server Component: /resultado
 * Handles premium access verification before rendering the UI.
 */
export default async function ResultadoPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  // Extract mood from search params
  const moodParam = typeof resolvedSearchParams.mood === 'string' ? resolvedSearchParams.mood : null;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-aubergine-dark/10 border-t-[#C9A84C] animate-spin" />
        </div>
      }
    >
      <ResultadoClient 
        initialIsPremium={isPremium} 
        initialUser={user} 
        moodParam={moodParam}
      />
    </Suspense>
  );
}
