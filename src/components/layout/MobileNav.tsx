"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-cream"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-2xl font-bold text-cream">
                  Food<span className="text-[#D4A017]">·</span>Mood
                </span>
                <button onClick={() => setIsOpen(false)} className="p-2 text-cream/70 hover:text-cream">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/recetas" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                  Recetas
                </Link>
                <Link href="/perfil" onClick={() => setIsOpen(false)} className="text-xl font-medium text-cream hover:text-white transition-colors">
                  Perfil
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
