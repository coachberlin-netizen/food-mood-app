"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, MailOpen, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const NAV = [
  { href: "/pro/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { href: "/pro/pacientes",     label: "Pacientes",     icon: Users },
  { href: "/pro/invitaciones",  label: "Invitaciones",  icon: MailOpen },
]

export default function ProSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/pro/login")
  }

  return (
    <aside className="w-64 min-h-screen bg-[#6B2737] flex flex-col shrink-0">
      <div className="px-6 py-8">
        <Link href="/pro/dashboard" className="block">
          <span className="text-white font-serif font-bold text-xl">Food·Mood</span>
          <span className="block text-[10px] font-sans font-normal text-white/50 uppercase tracking-widest mt-0.5">
            Portal Profesional
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
