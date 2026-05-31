"use client";

import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-aubergine-dark py-8" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-7">
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-xl font-semibold text-white">
              Food<span className="text-gold">·</span>Mood
            </span>
            <span className="text-[10px] font-light text-white/60 tracking-wide">food-mood.app · © 2026</span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-[0.16em] uppercase text-white/60">
            <Link href="/"        className="hover:text-gold transition-colors">Para profesionales</Link>
            <Link href="/canjear" className="hover:text-gold transition-colors">Para pacientes</Link>
            <Link href="/pro/login" className="hover:text-gold transition-colors">Portal Pro</Link>
            <Link href="/blog"    className="hover:text-gold transition-colors">Newsletter</Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5">
          <div className="flex flex-wrap justify-between items-start gap-y-3 mb-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-[0.16em] uppercase text-white/55">
              <Link href="/quienes-somos" className="hover:text-gold transition-colors">Equipo</Link>
              <Link href="/privacidad"   className="hover:text-gold transition-colors">Privacidad</Link>
              <Link href="/terminos"     className="hover:text-gold transition-colors">Términos</Link>
              <Link href="/aviso-legal"  className="hover:text-gold transition-colors">Legal</Link>
              <Link href="/accesibilidad" className="hover:text-gold transition-colors">Accesibilidad</Link>
            </div>
          </div>
          <p className="text-[10px] font-light text-white/40 text-center leading-relaxed max-w-xl mx-auto">
            Food·Mood Pro es una herramienta de apoyo clínico. No constituye diagnóstico, tratamiento ni dispositivo médico. La decisión clínica corresponde siempre al profesional de salud.
          </p>
        </div>

      </div>
    </footer>
  )
}
