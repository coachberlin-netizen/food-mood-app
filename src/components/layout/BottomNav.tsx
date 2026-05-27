"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UtensilsCrossed, Sparkles, CalendarDays, UserCircle, LogIn, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Tab = {
  href: string
  label: string
  icon: React.ElementType
  match: (p: string) => boolean
  badge?: number
}

const BASE_AUTH_TABS: Tab[] = [
  { href: "/recetas",    label: "Recetas",  icon: UtensilsCrossed, match: p => p.startsWith("/recetas") },
  { href: "/evaluacion", label: "Evalúate", icon: Sparkles,        match: p => p.startsWith("/evaluacion") },
  { href: "/semana",     label: "Semana",   icon: CalendarDays,    match: p => p.startsWith("/semana") },
  { href: "/perfil",     label: "Perfil",   icon: UserCircle,      match: p => p.startsWith("/perfil") },
]

const GUEST_TABS: Tab[] = [
  { href: "/",           label: "Inicio",   icon: Home,            match: p => p === "/" },
  { href: "/recetas",    label: "Recetas",  icon: UtensilsCrossed, match: p => p.startsWith("/recetas") },
  { href: "/evaluacion", label: "Evalúate", icon: Sparkles,        match: p => p.startsWith("/evaluacion") },
  { href: "/auth/login", label: "Entrar",   icon: LogIn,           match: p => p.startsWith("/auth") },
]

// Pages with fixed fullscreen overlays — hide bottom nav to avoid z-index confusion
const HIDE_PREFIXES = ["/evaluacion/", "/auth/"]

const gold   = "#C9A84C"
const dimmed = "rgba(245,240,232,0.38)"

export function BottomNav() {
  const pathname = usePathname()
  const [isAuth, setIsAuth] = useState<boolean | null>(null)
  const [paramiState, setParamiState] = useState<{ hasLink: boolean; unread: number } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuth(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuth(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isAuth) { setParamiState(null); return }

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: link } = await supabase
        .from("professional_patient_links")
        .select("id")
        .eq("patient_user_id", user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle()
      if (!link) return
      const { count } = await supabase
        .from("content_prescriptions")
        .select("id", { count: "exact", head: true })
        .eq("patient_user_id", user.id)
        .is("read_at", null)
      setParamiState({ hasLink: true, unread: count ?? 0 })
    })
  }, [isAuth])

  // Don't render until auth state is known (avoids flash of guest tabs)
  if (isAuth === null) return null

  // Hide inside wizard steps and auth screens
  if (HIDE_PREFIXES.some(prefix => pathname.startsWith(prefix))) return null

  let tabs: Tab[]
  if (!isAuth) {
    tabs = GUEST_TABS
  } else {
    const paramiTab: Tab = {
      href:  "/para-mi",
      label: "Para ti",
      icon:  BookOpen,
      match: p => p.startsWith("/para-mi"),
      badge: paramiState?.unread ?? 0,
    }
    tabs = paramiState?.hasLink
      ? [...BASE_AUTH_TABS.slice(0, 3), paramiTab, BASE_AUTH_TABS[3]]
      : BASE_AUTH_TABS
  }

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
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors"
              style={{ color: active ? gold : dimmed }}
            >
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
