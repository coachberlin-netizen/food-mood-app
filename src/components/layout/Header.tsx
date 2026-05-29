"use client";

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { MobileNav } from "./MobileNav"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/useAuthStore"
import { LogOut, User, PieChart, ChevronDown } from "lucide-react"

interface DropdownItem { label: string; href: string }

function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isActive = items.some(i => pathname?.startsWith(i.href))

  React.useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", outside)
    return () => document.removeEventListener("mousedown", outside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 text-sm font-light tracking-wide transition-colors ${
          isActive ? "text-cream" : "text-cream/70 hover:text-cream"
        }`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-44 py-1.5 z-50"
          style={{
            backgroundColor: "#2d0f16",
            borderRadius: "10px",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {items.map(({ label: l, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-cream/75 hover:text-[#C9A84C] hover:bg-white/5 transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Nav de la companion app (usuario paciente autenticado)
const COMPANION_NAV: DropdownItem[] = [
  { label: "Dashboard",     href: "/dashboard" },
  { label: "Mis prácticas", href: "/practicas" },
  { label: "Para mí",       href: "/para-mi"   },
  { label: "Glosario",      href: "/glosario"  },
  { label: "Newsletter",    href: "/blog"      },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const router  = useRouter()
  const logout  = useAuthStore((state) => state.logout)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const [isPremium,       setIsPremium]       = React.useState(false)
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuthenticated(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setIsAuthenticated(!!session))
    return () => subscription.unsubscribe()
  }, [])

  React.useEffect(() => {
    if (isAuthenticated !== true) return
    fetch("/api/mi-tier").then(r => r.json()).then(d => setIsPremium(!!d.isPremium)).catch(() => {})
  }, [isAuthenticated])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      logout()
      setIsMenuOpen(false)
      setIsPremium(false)
      setIsAuthenticated(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-aubergine-dark/95 backdrop-blur-xl border-b border-cream/10 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 h-20 md:px-12 flex items-center justify-between gap-8">

        {/* Left nav */}
        <div className="flex items-center justify-start flex-1">
          <MobileNav isAuthenticated={isAuthenticated ?? false} isPremium={isPremium} />

          {isAuthenticated === true ? (
            /* Companion app nav (paciente autenticado) */
            <nav className="hidden md:flex items-center space-x-7">
              <Link href="/dashboard" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">Dashboard</Link>
              <NavDropdown label="Mi espacio" items={COMPANION_NAV} />
            </nav>
          ) : (
            /* Landing pública B2B */
            <nav className="hidden md:flex items-center space-x-7">
              <Link href="/" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Para profesionales
              </Link>
              <Link href="/canjear" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Para pacientes
              </Link>
              <Link
                href="/#precios"
                className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors"
              >
                Precios
              </Link>
            </nav>
          )}
        </div>

        {/* Logo centrado */}
        <Link href="/" className="flex-1 flex justify-center transition-transform hover:scale-[1.02] duration-300 shrink-0">
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-cream">
            Food<span className="text-gold">·</span>Mood
            {!isAuthenticated && (
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest ml-1.5 align-middle" style={{ color: "#C9A84C", opacity: 0.75 }}>Pro</span>
            )}
          </span>
        </Link>

        {/* Right CTAs */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {isAuthenticated === false && (
            <>
              <Link href="/pro/login" className="hidden md:inline-flex text-sm font-medium text-cream/60 hover:text-cream transition-colors">
                Entrar
              </Link>
              <Link
                href="/#acceso"
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#C9A84C", color: "#0f0a0d" }}
              >
                Solicitar acceso
              </Link>
            </>
          )}

          {/* Menú de usuario */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-opacity hover:opacity-80 flex items-center focus:outline-none"
              aria-label="Mi perfil"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
                <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "#C9A84C", opacity: 0.18 }} />
                <span className="relative rounded-full" style={{ width: 10, height: 10, backgroundColor: "#C9A84C", boxShadow: "0 0 6px 2px rgba(201,168,76,0.5)" }} />
              </div>
            </button>

            {isMenuOpen && (
              <div
                className="absolute top-full right-0 mt-3 w-56 py-2 z-50 overflow-hidden"
                style={{ backgroundColor: "#2d0f16", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}
              >
                {isAuthenticated === false ? (
                  <div className="px-2 py-1">
                    <Link href="/pro/login" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-cream/80 hover:text-[#C9A84C] hover:bg-white/5 transition-colors">
                      Entrar al portal profesional
                    </Link>
                    <Link href="/canjear" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-cream/60 hover:text-cream hover:bg-white/5 transition-colors">
                      Soy paciente — Canjear código
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="px-2 pb-2 mb-2 border-b border-[#C9A84C]/15">
                      <p className="text-[10px] uppercase tracking-widest text-cream/40 px-3 py-1">Mi cuenta</p>
                    </div>
                    <Link href="/perfil" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-cream/80 hover:text-[#C9A84C] hover:bg-white/5 transition-colors group">
                      <User className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
                      Mi Perfil
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-cream/80 hover:text-[#C9A84C] hover:bg-white/5 transition-colors group">
                      <PieChart className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
                      Dashboard
                    </Link>
                    <div className="h-px bg-cream/10 my-1.5" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cream/60 hover:text-red-400 hover:bg-white/5 transition-colors group text-left"
                    >
                      <LogOut className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
