import * as React from "react"
import Link from "next/link"
import { Avatar } from "@/components/ui/Avatar"
import { MobileNav } from "./MobileNav"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-aubergine-dark/95 backdrop-blur-xl border-b border-cream/10 transition-all duration-300">
      <div className="container mx-auto px-6 h-20 md:px-12 flex items-center justify-between">
        <div className="flex items-center justify-start flex-1">
          <MobileNav />
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
              Dashboard
            </Link>
            <Link href="/recetas" className="text-sm font-light tracking-wide text-cream/70 hover:text-cream transition-colors">
              Recetas
            </Link>
          </nav>
        </div>

        <Link href="/" className="flex-1 flex justify-center transition-transform hover:scale-[1.02] duration-300">
          <span className="font-serif text-2xl font-semibold tracking-tight text-cream">
            Food<span className="text-gold">·</span>Mood
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="/perfil" className="transition-opacity hover:opacity-80">
            <Avatar fallback="U" size="sm" />
          </Link>
        </div>
      </div>
    </header>
  )
}
