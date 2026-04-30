'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  challengeId:     string | null
  isAuthenticated: boolean
  compact?:        boolean
}

export default function ResetHedonicoCTA({ challengeId, isAuthenticated, compact }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/retos/reset-hedonico')
      return
    }
    if (!challengeId) {
      setError('Este reto estará disponible muy pronto. Escríbenos a hola@food-mood.app para acceso anticipado.')
      return
    }
    setError(null)
    startTransition(async () => {
      try {
        const res  = await fetch('/api/retos/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challenge_id: challengeId }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error ?? 'Error al procesar el pago'); return }
        window.location.href = data.url
      } catch {
        setError('Error de conexión. Inténtalo de nuevo.')
      }
    })
  }

  const bg     = compact ? '#C9A84C' : '#C9A84C'
  const textCl = compact ? 'rgba(245,240,232,0.35)' : 'rgba(107,39,55,0.4)'

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="text-sm leading-relaxed text-center" style={{ color: compact ? 'rgba(245,240,232,0.65)' : 'rgba(107,39,55,0.65)' }}>
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full py-4 rounded-full text-base font-bold transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: bg, color: '#2d0f16' }}
      >
        {isPending ? 'Procesando…' : 'Empezar el Reset — 29€ →'}
      </button>
      <p className="text-xs text-center" style={{ color: textCl }}>
        Pago seguro vía Stripe · Acceso inmediato · 21 días de placer real
      </p>
    </div>
  )
}
