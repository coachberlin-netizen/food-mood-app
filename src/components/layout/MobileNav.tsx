"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface MobileNavProps {
  isAuthenticated?: boolean;
  isPremium?: boolean;
}

export function MobileNav({ isAuthenticated, isPremium }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Status is now passed from Header to avoid redundant fetches
  React.useEffect(() => {
    if (isOpen) {
      // Optional: keep fetch if needed for some reason, but prop is better
    }
  }, [isOpen])
  
  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-cream"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-aubergine-dark border-r border-cream/10 shadow-2xl p-6"
              id="mobile-nav-menu"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-2xl font-bold text-cream">
                  Food<span className="text-[#D4A017]">·</span>Mood
                </span>
                <button onClick={() => setIsOpen(false)} className="p-2 text-cream/70 hover:text-cream" aria-label="Cerrar menú">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                {isAuthenticated ? (
                  <>
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Home
                    </Link>
                    <Link href="/paleta" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Tus emociones
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/test" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Test
                    </Link>

                    <Link href="/bol" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Mi bol
                    </Link>
                    <Link href="/viaje" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Mi viaje
                    </Link>
                    <Link href="/semana" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Mi semana
                    </Link>
                    <Link href="/diario" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Mi Diario
                    </Link>
                    <Link href="/recetas" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Recetas
                    </Link>
                    <Link href="/glosario" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Glosario
                    </Link>
                    <Link href="/sintomas" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Síntomas
                    </Link>
                    <Link href="/retos" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Retos
                    </Link>
                    {!isPremium && (
                      <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-xl font-medium text-[#C9A84C] hover:text-white transition-colors font-bold">
                        Planes
                      </Link>
                    )}
                    <Link href="/perfil" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors border-t border-cream/10 pt-6 mt-2">
                      Perfil
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Home
                    </Link>
                    <Link href="/paleta" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Tus emociones
                    </Link>
                    <Link href="/test" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Test gratuito
                    </Link>
                    <Link href="/recetas" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Recetas
                    </Link>
                    <Link href="/glosario" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Glosario
                    </Link>
                    <Link href="/retos" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Retos
                    </Link>
                    <Link href="/blog" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                      Newsletter
                    </Link>
                    <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-xl font-medium text-[#C9A84C] hover:text-white transition-colors font-bold">
                      Planes
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
