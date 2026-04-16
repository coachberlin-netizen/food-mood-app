import { SupabaseClient } from '@supabase/supabase-js'

/**
 * getPremiumStatus
 * 
 * Centralized logic to determine if a user has premium access.
 * Performs a "Waterfall Check" across all known subscription tables and fields.
 * If ANY source confirms premium status, the function returns true.
 * 
 * Priority/Reliability Order:
 * 1. subscriptions table (status = 'active')
 * 2. profiles table (is_premium = true)
 * 3. profiles table (premium_level > 0)
 * 4. user_profiles table (tier = 'premium')
 * 
 * @param supabase - The Supabase client (should be server-side for security)
 * @param userId - The UUID of the user to check
 * @returns Promise<boolean> - True if the user is premium
 */
export async function getPremiumStatus(supabase: SupabaseClient, userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    // 1. Check subscriptions table (Stripe/Marketplace)
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (subData) return true;

    // 2. Check profiles table (Direct flag or level)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('is_premium, premium_level')
      .eq('id', userId)
      .maybeSingle();

    if (profileData?.is_premium === true || (profileData?.premium_level ?? 0) > 0) {
      return true;
    }

    // 3. Fallback check for user_profiles (Legacy or alternative mapping)
    const { data: userProfileData } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('id', userId)
      .maybeSingle();

    if (userProfileData?.tier === 'premium') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Unexpected error checking premium status:', error);
    return false;
  }
}
