import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/mi-tier
 * Returns the current user's tier: 'free' or 'premium'
 * Calls get_my_tier() RPC if available, otherwise checks user_profiles table.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ tier: 'free', authenticated: false })
    }

    // Try calling get_my_tier() RPC function
    try {
      const { data, error } = await supabase.rpc('get_my_tier')
      if (!error && data) {
        return NextResponse.json({ tier: data, authenticated: true })
      }
    } catch {
      // RPC not available, fallback to profile check
    }

    // Fallback: check user_profiles table for tier
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    const tier = profile?.tier || 'free'

    return NextResponse.json({ tier, authenticated: true })
  } catch (err) {
    console.error('API /api/mi-tier error:', err)
    return NextResponse.json({ tier: 'free', authenticated: false })
  }
}
