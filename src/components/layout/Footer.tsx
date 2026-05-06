"use client";

import Link from "next/link"
import { NewsletterForm } from "./NewsletterForm"

export function Footer() {
  return (
    <footer className="w-full bg-aubergine-dark py-8">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        {/* Brand + Newsletter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-7">
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-xl font-semibold text-white">
              Food<span className="text-gold">·</span>Mood
            </span>
            <span className="text-[10px] font-light text-white/60 tracking-wide">food-mood.app · © 2026</span>
          </div>
          <div className="flex flex-col gap-2 w-full md:max-w-xs">
            <p className="text-xs font-light text-white/75">Un consejo semanal — sin spam</p>
            <NewsletterForm source="footer" dark={true} />
          </div>
        </div>

        {/* Divider + links */}
        <div className="border-t border-white/10 pt-5">
          <div className="flex flex-wrap justify-between items-start gap-y-3 mb-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-[0.16em] uppercase text-white/70">
              <Link href="/quienes-somos" className="hover:text-gold transition-colors">Quiénes somos</Link>
              <Link href="/servicios" className="hover:text-gold transition-colors">Sesiones</Link>
              <Link href="/como-funciona" className="hover:text-gold transition-colors">Método</Link>
              <Link href="/blog" className="hover:text-gold transition-colors">Newsletter</Link>
              <Link href="/saber-mas" className="hover:text-gold transition-colors">Saber más</Link>
              <Link href="/fermentos-del-mundo" className="hover:text-gold transition-colors">Fermentos</Link>
            </div>
            <div className="flex gap-x-5 text-[11px] tracking-[0.16em] uppercase text-white/45">
              <Link href="/terminos" className="hover:text-gold transition-colors">Términos</Link>
              <Link href="/privacidad" className="hover:text-gold transition-colors">Privacidad</Link>
              <Link href="/aviso-legal" className="hover:text-gold transition-colors">Legal</Link>
            </div>
          </div>
          <p className="text-[10px] font-light text-white/50 text-center leading-relaxed max-w-2xl mx-auto">
            Food·Mood ofrece divulgación científica. No es diagnóstico, tratamiento ni terapia. Consulta a un profesional ante cualquier duda de salud.
          </p>
        </div>

      </div>
    </footer>
  )
}
