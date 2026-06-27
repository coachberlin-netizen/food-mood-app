'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, Mail } from 'lucide-react'

// Número de WhatsApp: configura NEXT_PUBLIC_WHATSAPP_NUMBER en Vercel (sin +, ej: 34612345678)
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
const WA_TEXT   = encodeURIComponent('Hola, me gustaría acceder al Journal de Food·Mood Lab.')

export function GateForm() {
  const [email,  setEmail]  = useState('')
  const [error,  setError]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    try {
      const r = await fetch('/api/blog/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })

      if (r.ok) {
        window.location.replace('/blog')
        return
      }

      const data = await r.json().catch(() => ({}))
      setError(data.error ?? 'Algo salió mal. Inténtalo de nuevo.')
      setStatus('idle')
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setStatus('idle')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">

      {/* Email */}
      <form onSubmit={submit} className="flex flex-col gap-3 w-full">
        <div className="relative">
          <Mail
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'rgba(245,240,232,0.25)' }}
          />
          <input
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.07)',
              border:          error
                ? '1px solid rgba(220,80,80,0.5)'
                : '1px solid rgba(255,255,255,0.14)',
              color:           '#F5F0E8',
              caretColor:      '#FF6B35',
              fontSize:        '16px',
            }}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: 'rgba(220,80,80,0.85)' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: '#FF6B35', color: '#0f0a0d' }}
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Acceder con email <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      {/* Divisor */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.25)' }}>o</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* WhatsApp */}
      {WA_NUMBER ? (
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
          style={{ color: 'rgba(245,240,232,0.70)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {/* WhatsApp icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contactar por WhatsApp
        </a>
      ) : null}

      <p
        className="text-[10px] font-light text-center leading-relaxed"
        style={{ color: 'rgba(245,240,232,0.28)' }}
      >
        Sin spam. Tu email solo se usa para darte acceso y enviarte contenido del Journal.
      </p>
    </div>
  )
}
