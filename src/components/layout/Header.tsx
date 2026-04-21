"use client";

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MobileNav } from "./MobileNav"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/useAuthStore"
import { LogOut, User, PieChart, CreditCard } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const [isPremium, setIsPremium] = React.useState(false)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/mi-tier')
        if (res.ok) {
          const data = await res.json()
          setIsPremium(data.isPremium)
          setIsAuthenticated(data.isAuthenticated)
        }
      } catch (err) {
        console.error("Error checking premium status in header:", err)
      }
    }
    checkStatus()
  }, [])

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
      <div className="container mx-auto px-6 h-20 md:px-12 flex items-center justify-between gap-8">
        <div className="flex items-center justify-start flex-1">
          <MobileNav isAuthenticated={isAuthenticated} isPremium={isPremium} />
          {/* Authenticated nav: full feature set */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-semibold tracking-wide text-cream/90 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/paleta" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Tus emociones
              </Link>
              <Link href="/dashboard" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Dashboard
              </Link>
              <Link href="/test" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Test
              </Link>

              <Link href="/bol" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Mi bol
              </Link>
              <Link href="/viaje" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Mi viaje
              </Link>
              <Link href="/semana" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Mi semana
              </Link>
              <Link href="/diario" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Mi Diario
              </Link>
              <Link href="/recetas" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Recetas
              </Link>
              <Link href="/glosario" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Glosario
              </Link>
              <Link href="/fermentos-del-mundo" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Fermentos
              </Link>
              <Link href="/sintomas" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Síntomas
              </Link>
              <Link href="/retos" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Retos
              </Link>
              <Link href="/blog" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Newsletter
              </Link>
              {!isPremium && (
                <Link href="/pricing" className="text-sm font-semibold tracking-wide text-[#C9A84C] hover:text-[#b8953e] transition-colors">
                  Planes
                </Link>
              )}
            </nav>
          ) : (
            /* Public nav: minimal — guide the visitor to the one key action */
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-semibold tracking-wide text-cream/90 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/paleta" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Tus emociones
              </Link>
              <Link href="/test" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Test gratuito
              </Link>
              <Link href="/recetas" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Recetas
              </Link>
              <Link href="/glosario" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Glosario
              </Link>
              <Link href="/retos" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Retos
              </Link>
              <Link href="/blog" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
                Newsletter
              </Link>
              <Link href="/pricing" className="text-sm font-semibold tracking-wide text-[#C9A84C] hover:text-[#b8953e] transition-colors">
                Planes
              </Link>
            </nav>
          )}
        </div>

        <Link href="/" className="flex-1 flex justify-center transition-transform hover:scale-[1.02] duration-300 shrink-0">
          <span className="font-serif text-2xl font-semibold tracking-tight text-cream">
            Food<span className="text-gold">·</span>Mood
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end">
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-opacity hover:opacity-80 flex items-center focus:outline-none"
            >
              <div
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(253,251,247,0.15)',
                  border: '1px solid rgba(253,251,247,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FDFBF7',
                  fontSize: 12,
                  fontFamily: 'var(--font-cormorant, serif)',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                U
              </div>
            </button>

            {isMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-3 w-56 py-2 z-50 overflow-hidden"
                style={{
                  backgroundColor: "#1A1A2E",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                }}
              >
                <div className="px-2 pb-2 mb-2 border-b border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-[#FAF9F6]/40 px-3 py-1">Usuario</p>
                </div>
                
                <Link 
                  href="/perfil" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group"
                  style={{ color: "#FAF9F6" }}
                >
                  <User className="w-4 h-4 opacity-70 group-hover:text-[#C9A84C]" />
                  <span className="group-hover:text-[#C9A84C] group-hover:bg-white/[0.08] transition-all">Mi Perfil</span>
                </Link>

                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group"
                  style={{ color: "#FAF9F6" }}
                >
                  <PieChart className="w-4 h-4 opacity-70 group-hover:text-[#C9A84C]" />
                  <span className="group-hover:text-[#C9A84C] group-hover:bg-white/[0.08] transition-all">Dashboard</span>
                </Link>

                {!isPremium && (
                  <Link 
                    href="/pricing" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group"
                    style={{ color: "#FAF9F6" }}
                  >
                    <CreditCard className="w-4 h-4 opacity-70 group-hover:text-[#C9A84C]" />
                    <span className="group-hover:text-[#C9A84C] group-hover:bg-white/[0.08] transition-all">Planes</span>
                  </Link>
                )}

                <div className="h-px bg-white/10 my-2" />

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group text-left"
                  style={{ color: "#FAF9F6" }}
                >
                  <LogOut className="w-4 h-4 opacity-70 group-hover:text-red-400" />
                  <span className="group-hover:text-red-400 group-hover:bg-white/[0.08] transition-all">Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
