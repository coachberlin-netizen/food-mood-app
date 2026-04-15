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
          
          <div className="pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-b border-white/5">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Preguntas Frecuentes</span>
              <Link href="/faq" className="text-sm text-white/60 hover:text-gold transition-colors">
                Visita nuestra sección de FAQ (abierta a todos)
              </Link>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Fermentos del Mundo</span>
              <Link href="/fermentos-del-mundo" className="text-sm text-white/60 hover:text-gold transition-colors">
                Explora nuestro mapa interactivo
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[11px] tracking-[0.2em] uppercase text-white/40 pt-8 px-4">
            <Link href="/quienes-somos" className="hover:text-gold transition-colors duration-300">
              Quiénes somos
            </Link>
            <span className="opacity-10 hidden sm:inline">|</span>
            <Link href="/blog" className="hover:text-gold transition-colors duration-300">
              Blog
            </Link>
            <span className="opacity-10 hidden sm:inline">|</span>
            <Link href="/terminos" className="hover:text-gold transition-colors duration-300">
              Términos
            </Link>
            <span className="opacity-10 hidden sm:inline">|</span>
            <Link href="/privacidad" className="hover:text-gold transition-colors duration-300">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
