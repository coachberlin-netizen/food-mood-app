import logger from "@/lib/logger"
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getPremiumStatus } from "@/lib/premium";

export const dynamic = 'force-dynamic';

/**
 * GET /api/mi-tier
 * Returns the current user's tier: 'free' or 'premium'
 * Now leverages the centralized getPremiumStatus waterfall check.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ tier: 'free', authenticated: false, isPremium: false });
    }

    // Use the centralized waterfall check (subscriptions -> profiles -> user_profiles)
    const isPremium = await getPremiumStatus(supabase, user.id);

    return NextResponse.json({ 
      tier: isPremium ? 'premium' : 'free',
      authenticated: true,
      isPremium
    });

  } catch (error) {
    logger.error('API /api/mi-tier error:', error);
    return NextResponse.json({ tier: 'free', authenticated: false, isPremium: false });
  }
}
