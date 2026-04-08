import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Return the existing singleton if it exists in the window object (browser only)
  if (typeof window !== 'undefined' && (window as any).__supabase_client) {
    return (window as any).__supabase_client;
  }

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Save the singleton to the window object (browser only)
  if (typeof window !== 'undefined') {
    (window as any).__supabase_client = client;
  }

  return client
}
