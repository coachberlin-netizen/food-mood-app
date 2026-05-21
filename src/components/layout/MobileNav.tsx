"use client"
import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface MobileNavProps {
  isAuthenticated?: boolean
  isPremium?: boolean
}

export function MobileNav({ isAuthenticated, isPremium }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const close = () => setIsOpen(false)

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.65)',
            }}
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            id="mobile-nav-menu"
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '75%', maxWidth: '320px',
              zIndex: 9999,
              background: '#F5F0E8',
              borderRight: '1px solid rgba(107,39,55,0.15)',
              boxShadow: '4px 0 40px rgba(0,0,0,0.25)',
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#3F1A22' }}>
                Food<span style={{ color: '#C9A84C' }}>·</span>Mood
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú"
                style={{ padding: '8px', color: 'rgba(107,39,55,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {isAuthenticated ? (
                <>
                  <NavLink href="/"             label="Home"          close={close} />
                  <NavLink href="/eloraculo"        label="Mi lectura" close={close} />
                  <NavLink href="/dashboard"     label="Dashboard"     close={close} />
                  <NavLink href="/test"          label="Test"          close={close} />
                  <NavLink href="/bol"           label="Mi bol"        close={close} />
                  <NavLink href="/viaje"         label="Mi viaje"      close={close} />
                  <NavLink href="/semana"        label="Mi semana"     close={close} />
                  <NavLink href="/recetas"       label="Recetas"       close={close} />
                  <NavLink href="/enciclopedia" label="Enciclopedia"  close={close} />
                  <NavLink href="/servicios"    label="Sesiones 1:1"  close={close} />
                  <NavLink href="/glosario"      label="Glosario"      close={close} />
                  <NavLink href="/sintomas"      label="Síntomas"      close={close} />
                  <NavLink href="/retos"         label="Retos"         close={close} />
                  <NavLink href="/blog"          label="Newsletter"    close={close} />
                  {!isPremium && <NavLink href="/pricing" label="Planes" close={close} gold />}
                  <div style={{ height: '1px', background: 'rgba(107,39,55,0.12)', margin: '12px 0' }} />
                  <NavLink href="/perfil"        label="Mi Perfil"     close={close} />
                </>
              ) : (
                <>
                  <NavLink href="/"              label="Inicio"        close={close} />
                  <NavLink href="/recetas"       label="Recetas"       close={close} />
                  <NavLink href="/como-funciona" label="Cómo funciona" close={close} />
                  <NavLink href="/sintomas"      label="Síntomas"      close={close} />
                  <NavLink href="/glosario"      label="Glosario"      close={close} />
                  <NavLink href="/blog"          label="Newsletter"    close={close} />
                  <NavLink href="/pricing"       label="Planes"        close={close} gold />
                </>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <div className="md:hidden">
      {/* Hamburger */}
      <button
        type="button"
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

      {/* Portal: renders directly in <body>, escaping all stacking contexts */}
      {mounted && createPortal(panel, document.body)}
    </div>
  )
}

function NavLink({ href, label, close, gold }: { href: string; label: string; close: () => void; gold?: boolean }) {
  return (
    <Link
      href={href}
      onClick={close}
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '44px',
        padding: '10px 8px',
        fontSize: '17px',
        fontWeight: gold ? 700 : 500,
        color: gold ? '#C9A84C' : '#3F1A22',
        textDecoration: 'none',
        borderRadius: '8px',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(107,39,55,0.06)' }}
      onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent' }}
    >
      {label}
    </Link>
  )
}
