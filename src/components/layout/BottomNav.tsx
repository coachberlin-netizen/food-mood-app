"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, BookOpen, Heart, UserCircle, LogIn, UtensilsCrossed } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAssignmentsBadge } from "@/hooks/useAssignments"
import { motion } from "framer-motion"

type Tab = {
  href: string
  label: string
  icon: React.ElementType
  match: (p: string) => boolean
  badge?: number
}

const AUTH_TABS: Tab[] = [
  { href: "/dashboard",  label: "Inicio",     icon: Home,        match: p => p.startsWith("/dashboard") },
  { href: "/eloraculo",  label: "Registros",  icon: Sparkles,    match: p => p.startsWith("/eloraculo") },
  { href: "/practicas",  label: "Prácticas",  icon: BookOpen,    match: p => p.startsWith("/practicas") },
  { href: "/para-mi",    label: "Para ti",    icon: Heart,       match: p => p.startsWith("/para-mi") },
  { href: "/configuracion", label: "Mi cuenta",  icon: UserCircle,  match: p => p.startsWith("/configuracion") },
]

const GUEST_TABS: Tab[] = [
  { href: "/",           label: "Inicio",    icon: Home,            match: p => p === "/" },
  { href: "/recetas",    label: "Recetas",   icon: UtensilsCrossed, match: p => p.startsWith("/recetas") },
  { href: "/evaluacion", label: "Evalúate",  icon: Sparkles,        match: p => p.startsWith("/evaluacion") },
  { href: "/auth/login", label: "Entrar",    icon: LogIn,           match: p => p.startsWith("/auth") },
]

const HIDE_PREFIXES = ["/evaluacion/", "/auth/"]

const gold   = "#C9A84C"
const dimmed = "rgba(245,240,232,0.38)"

export function BottomNav() {
  const pathname = usePathname()
  const [isAuth, setIsAuth] = useState<boolean | null>(null)
  const [unread,  setUnread]  = useState(0)
  const pendingAssignments = useAssignmentsBadge()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuth(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuth(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isAuth) { setUnread(0); return }
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { count } = await supabase
        .from("content_prescriptions")
        .select("id", { count: "exact", head: true })
        .eq("patient_user_id", user.id)
        .is("read_at", null)
      setUnread(count ?? 0)
    })
  }, [isAuth])

  if (isAuth === null) return null
  if (HIDE_PREFIXES.some(prefix => pathname.startsWith(prefix))) return null

  const tabs: Tab[] = !isAuth
    ? GUEST_TABS
    : AUTH_TABS.map(t => {
        if (t.href === "/para-mi")    return { ...t, badge: unread }
        if (t.href === "/practicas")  return { ...t, badge: pendingAssignments }
        return t
      })

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: "#1A0A0E",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch">
        {tabs.map(({ href, label, icon: Icon, match, badge }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors"
              style={{ color: active ? gold : dimmed }}
            >
              {/* Sliding active indicator */}
              {active && (
                <motion.span
                  layoutId="bnav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full"
                  style={{ background: gold }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  className="w-[22px] h-[22px]"
                  strokeWidth={active ? 2.2 : 1.6}
                />
                {badge != null && badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-0.5 text-[8px] font-bold text-white"
                    style={{ background: "#6B2737" }}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wide font-medium">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
