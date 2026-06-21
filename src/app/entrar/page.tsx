'use client'

import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function GateForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/'

  const [code, setCode]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/entrar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code }),
      })

      if (res.ok) {
        window.location.href = from
      } else {
        setError('Código incorrecto. Pídeme el código por WhatsApp.')
        setLoading(false)
      }
    } catch {
      setError('Error de conexión. Vuelve a intentarlo.')
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ background: '#F5F0E8' }}
    >
      <div className="max-w-[380px] w-full">

        {/* Logo */}
        <p className="font-serif text-2xl font-semibold text-center mb-10" style={{ color: '#2d0f16' }}>
          Food<span style={{ color: '#FF6B35' }}>·</span>Mood
        </p>

        <div
          className="rounded-3xl p-8"
          style={{ background: 'white', boxShadow: '0 2px 20px rgba(107,39,55,0.08)' }}
        >
          <h1 className="font-serif text-xl font-bold mb-1" style={{ color: '#2d0f16' }}>
            Acceso previo
          </h1>
          <p className="text-[13px] font-light mb-6" style={{ color: 'rgba(107,39,55,0.55)' }}>
            Esta versión es privada. Escríbeme por WhatsApp para obtener el código de acceso.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="code"
                className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: 'rgba(107,39,55,0.45)' }}
              >
                Código
              </label>
              <input
                id="code"
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="·  ·  ·  ·  ·  ·"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background:  '#F5F0E8',
                  border:      error ? '1.5px solid #c0392b' : '1.5px solid transparent',
                  color:       '#2d0f16',
                  letterSpacing: '0.15em',
                }}
                onFocus={e => {
                  if (!error) e.target.style.border = '1.5px solid rgba(107,39,55,0.35)'
                }}
                onBlur={e => {
                  if (!error) e.target.style.border = '1.5px solid transparent'
                }}
              />
              {error && (
                <p className="text-[11px] mt-1.5 font-medium" style={{ color: '#c0392b' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!code || loading}
              className="w-full py-3 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: !code || loading ? 'rgba(107,39,55,0.15)' : '#6B2737',
                color:      !code || loading ? 'rgba(107,39,55,0.35)' : '#F5F0E8',
                cursor:     !code || loading ? 'default' : 'pointer',
              }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-center mt-6 font-light" style={{ color: 'rgba(107,39,55,0.3)' }}>
          Versión beta privada · Food·Mood
        </p>
      </div>
    </main>
  )
}

export default function EntrarPage() {
  return (
    <Suspense>
      <GateForm />
    </Suspense>
  )
}
