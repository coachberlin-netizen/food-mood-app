import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function NewsletterLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/pro/login?redirect=/newsletter")
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .maybeSingle()

  if (!professional) {
    redirect("/pro/login?message=newsletters-pro-only")
  }

  return <>{children}</>
}
