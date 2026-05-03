"use client"

import { useState, useEffect, type ReactNode } from 'react'
import { Mail, KeyRound, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'

const STORAGE_KEY = 'fm_newsletter_access'
const VALID_CODE   = 'FOODMOOD2026'

type Tab = 'subscribe' | 'code'

export function NewsletterGate({ children }: { children: ReactNode }) {
  const [granted, setGranted]   = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [tab, setTab]           = useState<Tab>('subscribe')

  // Email flow
  const [email, setEmail]       = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  // Code flow
  const [code, setCode]         = useState('')
  const [codeError, setCodeError] = useState('')
  const [codeOk, setCodeOk]     = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1') {
      setGranted(true)
    }
  }, [])

  function grant() {
    localStorage.setItem(STORAGE_KEY, '1')
    setGranted(true)
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setEmailLoading(true)
    try {
      await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, source: 'newsletter_archive_gate' }),
      })
    } catch {}
    setEmailLoading(false)
    setEmailSent(true)
    setTimeout(grant, 1200)
  }

  function handleCode(e: React.FormEvent) {
    e.preventDefault()
    const normalized = code.replace(/[^a-z0-9]/gi, '').toUpperCase()
    if (normalized === VALID_CODE) {
      setCodeError('')
      setCodeOk(true)
      setTimeout(grant, 900)
    } else {
      setCodeError('Código incorrecto. Prueba con FOODMOOD2026.')
    }
  }

  // While hydrating: avoid flash
  if (!mounted) return null

  if (granted) return <>{children}</>

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none" style={{ filter: 'blur(6px)', opacity: 0.35 }}>
        {children}
      </div>

      {/* Gate overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ backgroundColor: 'rgba(29,10,15,0.85)', backdropFilter: 'blur(4px)' }}
      >
        <div
          className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#F5F0E8' }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#C9A84C' }}>
              Archivo exclusivo
            </p>
            <h2 className="font-serif text-2xl font-bold leading-tight mb-2" style={{ color: '#F5F0E8' }}>
              Accede a todas las<br />newsletters
            </h2>
            <p className="text-sm font-light" style={{ color: 'rgba(245,240,232,0.6)' }}>
              5 ediciones · Neurociencia, fermentos y longevidad
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'rgba(107,39,55,0.1)' }}>
            <button
              onClick={() => setTab('subscribe')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                tab === 'subscribe' ? 'border-b-2' : ''
              }`}
              style={{
                color:       tab === 'subscribe' ? '#6B2737' : 'rgba(107,39,55,0.35)',
                borderColor: tab === 'subscribe' ? '#6B2737' : 'transparent',
              }}
            >
              Suscribirme
            </button>
            <button
              onClick={() => setTab('code')}
              className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                tab === 'code' ? 'border-b-2' : ''
              }`}
              style={{
                color:       tab === 'code' ? '#6B2737' : 'rgba(107,39,55,0.35)',
                borderColor: tab === 'code' ? '#6B2737' : 'transparent',
              }}
            >
              Tengo un código
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            {tab === 'subscribe' && (
              <>
                {emailSent ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <CheckCircle2 className="w-10 h-10" style={{ color: '#6B2737' }} />
                    <p className="text-sm font-semibold text-center" style={{ color: '#2d0f16' }}>
                      ¡Bienvenida! Abriendo el archivo…
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEmail} className="flex flex-col gap-3">
                    <p className="text-sm font-light leading-relaxed mb-1" style={{ color: 'rgba(45,15,22,0.55)' }}>
                      Suscríbete gratis y accede al archivo completo. Cada semana, ciencia que importa — sin ruido.
                    </p>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'rgba(107,39,55,0.35)' }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                        style={{
                          backgroundColor: 'rgba(107,39,55,0.04)',
                          border:          '1.5px solid rgba(107,39,55,0.15)',
                          color:           '#2d0f16',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#6B2737')}
                        onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(107,39,55,0.15)')}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
                      style={{ backgroundColor: '#6B2737', color: '#F5F0E8' }}
                    >
                      {emailLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Acceder al archivo <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center" style={{ color: 'rgba(45,15,22,0.35)' }}>
                      Sin spam. Cancelas cuando quieras.
                    </p>
                  </form>
                )}
              </>
            )}

            {tab === 'code' && (
              <>
                {codeOk ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <CheckCircle2 className="w-10 h-10" style={{ color: '#C9A84C' }} />
                    <p className="text-sm font-semibold text-center" style={{ color: '#2d0f16' }}>
                      Código válido. Abriendo el archivo…
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCode} className="flex flex-col gap-3">
                    <p className="text-sm font-light leading-relaxed mb-1" style={{ color: 'rgba(45,15,22,0.55)' }}>
                      Introduce tu código de acceso beta para desbloquear el archivo completo.
                    </p>
                    <div className="relative">
                      <KeyRound
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'rgba(107,39,55,0.35)' }}
                      />
                      <input
                        type="text"
                        value={code}
                        onChange={e => { setCode(e.target.value); setCodeError('') }}
                        placeholder="FOODMOOD2026"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono outline-none tracking-widest uppercase transition-all"
                        style={{
                          backgroundColor: 'rgba(107,39,55,0.04)',
                          border:          codeError
                            ? '1.5px solid #C9A84C'
                            : '1.5px solid rgba(107,39,55,0.15)',
                          color: '#2d0f16',
                        }}
                        onFocus={e => !codeError && (e.currentTarget.style.borderColor = '#6B2737')}
                        onBlur={e  => !codeError && (e.currentTarget.style.borderColor = 'rgba(107,39,55,0.15)')}
                      />
                    </div>
                    {codeError && (
                      <p className="text-xs" style={{ color: '#C9A84C' }}>{codeError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity"
                      style={{ backgroundColor: '#C9A84C', color: '#2d0f16' }}
                    >
                      Canjear código <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
