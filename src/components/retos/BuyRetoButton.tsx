'use client'

import { useState } from 'react'

interface Props {
  slug:        string
  challengeId: string
  precio:      number
  yaComprado?: boolean
}

export default function BuyRetoButton({ slug, challengeId, precio, yaComprado = false }: Props) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleBuy() {
    if (yaComprado) {
      window.location.href = `/retos/${slug}/lista-compra`
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('/api/retos/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ challenge_id: challengeId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al procesar el pago')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full rounded-xl text-base font-semibold transition-colors font-[inherit] border-none"
        style={{
          padding:    '16px 24px',
          background: loading ? '#9e6070' : '#6B2737',
          color:      '#F5F0E8',
          cursor:     loading ? 'not-allowed' : 'pointer',
          letterSpacing: '.01em',
        }}
      >
        {loading
          ? 'Redirigiendo…'
          : yaComprado
          ? 'Continuar mi reto →'
          : `Empezar mi reto → ${precio}€`}
      </button>

      {!yaComprado && (
        <p className="text-center mt-2 text-xs" style={{ color: '#9e8080' }}>
          Pago seguro vía Stripe · Acceso inmediato al completar
        </p>
      )}

      {error && (
        <p className="text-center mt-2 text-[13px] rounded-lg px-3 py-2"
          style={{ color: '#c0392b', background: '#fdf0ee' }}>
          {error}
        </p>
      )}
    </div>
  )
}
