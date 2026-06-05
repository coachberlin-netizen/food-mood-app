import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProSidebar from "@/components/pro/ProSidebar"
import ProFooter from "@/components/pro/ProFooter"

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
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          {children}
        </main>
        <ProFooter />
      </div>
    </div>
  )
}
