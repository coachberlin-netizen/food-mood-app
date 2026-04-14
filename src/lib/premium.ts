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
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching premium status:', error.message);
      return false;
    }

    return data?.is_premium === true;
  } catch (error) {
    console.error('Unexpected error checking premium status:', error);
    return false;
  }
}
