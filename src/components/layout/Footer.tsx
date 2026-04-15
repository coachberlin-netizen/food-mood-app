"use client";

import * as React from "react"
import Link from "next/link"
import { NewsletterForm } from "./NewsletterForm"

export function Footer() {
  const [isPremium, setIsPremium] = React.useState(false)

  React.useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/mi-tier')
        if (res.ok) {
          const data = await res.json()
          setIsPremium(data.isPremium)
        }
      } catch (err) {
        console.error("Error checking status in footer:", err)
      }
    }
    checkStatus()
  }, [])

  return (
    <footer className="w-full bg-aubergine-dark py-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center space-y-8">
        <span className="font-serif text-2xl font-semibold text-white">
          Food<span className="text-gold">·</span>Mood
        </span>
        <div className="w-full flex flex-col items-center space-y-4 mb-8">
          <p className="text-sm font-light text-white/60">Únete al Newsletter para un consejo semanal</p>
          <NewsletterForm source="footer" dark={true} />
        </div>
        <div className="flex flex-col items-center space-y-4 pt-8 border-t border-white/5 w-full max-w-3xl">
          <p className="text-[13px] font-light text-white/40 text-center leading-relaxed px-4">
            Food·Mood recomienda recetas y alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia. Ante cualquier duda de salud, consulta a un profesional.
          </p>
          <p className="text-[11px] font-light text-white/30 text-center leading-relaxed px-4 mt-2 max-w-2xl">
            Protegemos tus datos mediante medidas técnicas y organizativas razonables. Aun así, ningún sistema digital es completamente invulnerable. En caso de incidente de seguridad que afecte a datos personales, actuaremos conforme a la normativa aplicable en materia de protección de datos.
          </p>
          
          <div className="pt-8 pb-4 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/testimonios" className="text-[11px] tracking-widest uppercase text-white/40 hover:text-gold transition-colors duration-300">
              Historias de bienestar real <span className="mx-2 opacity-30">·</span> Leer testimonios
            </Link>
            <Link href="/fundamentos" className="text-[11px] tracking-widest uppercase text-white/40 hover:text-gold transition-colors duration-300">
              Ciencia aplicada <span className="mx-2 opacity-30">·</span> Fundamentos
            </Link>
            <Link href="/equipo" className="text-[11px] tracking-widest uppercase text-white/40 hover:text-gold transition-colors duration-300">
              Equipo interdisciplinar <span className="mx-2 opacity-30">·</span> Quiénes somos
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-light text-white/50 pt-4 px-4">
            <Link href="/fermentos-del-mundo" className="hover:text-white transition-colors duration-300 whitespace-nowrap">
              Fermentos del Mundo
            </Link>
            <Link href="/quienes-somos" className="hover:text-white transition-colors duration-300">
              Quiénes somos
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-300">
              Blog
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors duration-300">
              FAQ
            </Link>
            <Link href="/terminos" className="hover:text-white transition-colors duration-300">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors duration-300">
              Privacidad
            </Link>
            {!isPremium && (
              <Link href="/pricing" className="hover:text-white transition-colors duration-300">
                Planes
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
