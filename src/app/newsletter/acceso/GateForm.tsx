'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

export function GateForm() {
  const [code,   setCode]   = useState('')
  const [error,  setError]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    try {
      const r = await fetch('/api/newsletter/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code }),
      })

      if (r.ok) {
        window.location.replace('/newsletter/archivo')
        return
      }

      const data = await r.json().catch(() => ({}))
      setError(data.error ?? 'El código no es válido.')
      setStatus('idle')
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setStatus('idle')
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 w-full max-w-sm">
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Código de acceso"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
        disabled={status === 'loading'}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          backgroundColor: 'rgba(255,255,255,0.07)',
          border:          error
            ? '1px solid rgba(220,80,80,0.5)'
            : '1px solid rgba(255,255,255,0.14)',
          color:           '#F5F0E8',
          caretColor:      '#FF6B35',
          fontSize:        '16px',
        }}
        onFocus={e => { if (!error) (e.target as HTMLInputElement).style.borderColor = 'rgba(255,107,53,0.45)' }}
        onBlur={e  => { if (!error) (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.14)' }}
      />

      {error && (
        <p className="text-xs" style={{ color: 'rgba(220,80,80,0.85)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !code}
        className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        style={{ backgroundColor: '#FF6B35', color: '#0f0a0d' }}
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>Acceder <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </form>
  )
}
