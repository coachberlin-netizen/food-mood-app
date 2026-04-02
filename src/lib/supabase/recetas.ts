import { createClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client for the RECETAS database.
 * This is a separate Supabase project from auth/profiles.
 */
export function createRecetasClient() {
  const url = process.env.NEXT_PUBLIC_RECETAS_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY!
  return createClient(url, key)
}
