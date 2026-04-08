import * as React from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-aubergine-dark py-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center space-y-8">
        <span className="font-serif text-2xl font-semibold text-white">
          Food<span className="text-gold">·</span>Mood
        </span>
        <div className="flex flex-col items-center space-y-4 pt-8 border-t border-white/5 w-full max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/60 pt-px">Solo comida real</span>
          </div>
          <p className="text-[13px] font-light text-white/40 text-center leading-relaxed px-4">
            Food·Mood recomienda recetas y alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia. Ante cualquier duda de salud, consulta a un profesional.
          </p>
          <div className="flex space-x-8 text-sm font-light text-white/50 pt-4">
            <Link href="/faq" className="hover:text-white transition-colors duration-300">
              FAQ
            </Link>
            <Link href="/glosario" className="hover:text-white transition-colors duration-300">
              Glosario
            </Link>
            <Link href="/terminos" className="hover:text-white transition-colors duration-300">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors duration-300">
              Privacidad
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors duration-300">
              Planes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
