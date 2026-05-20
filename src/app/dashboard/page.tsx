import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import { getWeeklyHighlights } from "@/lib/supabase/newsletter";
import { WeeklyHighlights } from "@/components/dashboard/WeeklyHighlights";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="h-32 bg-gradient-to-b from-[#2d0f16]/8 to-transparent" />
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-6 -mt-4">
        {/* Mood bar */}
        <div className="h-14 rounded-2xl bg-white/60 animate-pulse" />
        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
        {/* Wide card */}
        <div className="h-40 rounded-2xl bg-white/60 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;
  
  // 3. Fetch Newsletter/Blog Highlights (Safely handles errors inside)
  const highlights = await getWeeklyHighlights();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient 
        initialIsPremium={isPremium} 
        weeklyHighlightsSlot={<WeeklyHighlights highlights={highlights} />}
      />
    </Suspense>
  );
}
