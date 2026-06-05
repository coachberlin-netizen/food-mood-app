import Link from "next/link"

const YEAR = new Date().getFullYear()

export default function ProFooter() {
  return (
    <footer className="mt-auto border-t border-[#6B2737]/10 px-6 py-5">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B2737]/40">
        <span>© {YEAR} Food·Mood Pro</span>
        <nav className="flex flex-wrap gap-4">
          <Link href="/privacidad" className="hover:text-[#6B2737] transition-colors">
            Política de Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-[#6B2737] transition-colors">
            Términos de Uso
          </Link>
          <Link href="/pro/dpa" className="hover:text-[#6B2737] transition-colors">
            DPA para profesionales
          </Link>
          <a
            href="mailto:coachberlin@gmail.com"
            className="hover:text-[#6B2737] transition-colors"
          >
            DPO: coachberlin@gmail.com
          </a>
        </nav>
      </div>
    </footer>
  )
}
