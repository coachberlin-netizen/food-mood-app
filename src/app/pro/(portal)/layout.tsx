import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProSidebar from "@/components/pro/ProSidebar"

export default async function ProPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/pro/login")
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .maybeSingle()

  if (!professional) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <ProSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
