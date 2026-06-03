import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/pro/login?redirect=/blog')
  }

  const { data: pro } = await supabase
    .from('professionals')
    .select('id')
    .maybeSingle()

  if (!pro) {
    redirect('/pro/login?redirect=/blog')
  }

  return <>{children}</>
}
