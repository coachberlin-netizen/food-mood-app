import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";
import { getWeeklyHighlights } from "@/lib/supabase/newsletter";
import { WeeklyHighlights } from "@/components/dashboard/WeeklyHighlights";

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
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-aubergine-dark/10 border-t-[#C9A84C] animate-spin" />
      </div>
    }>
      <DashboardClient 
        initialIsPremium={isPremium} 
        weeklyHighlightsSlot={<WeeklyHighlights highlights={highlights} />}
      />
    </Suspense>
  );
}
