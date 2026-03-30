import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-aubergine-dark py-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center space-y-8">
        <span className="font-serif text-2xl font-semibold text-white">
          Food<span className="text-gold">·</span>Mood
        </span>
        <div className="flex flex-col items-center space-y-4 pt-8 border-t border-white/5 w-full max-w-3xl">
          <p className="text-[13px] font-light text-white/40 text-center leading-relaxed px-4">
            Food·Mood recomienda recetas y alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia. Ante cualquier duda de salud, consulta a un profesional.
          </p>
          <div className="flex space-x-8 text-sm font-light text-white/50 pt-4">
            <Link href="/faq" className="hover:text-white transition-colors duration-300">
              FAQ
            </Link>
            <Link href="/terminos" className="hover:text-white transition-colors duration-300">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors duration-300">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
