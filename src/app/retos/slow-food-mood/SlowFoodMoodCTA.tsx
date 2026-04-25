"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  challengeId:     string | null
  isAuthenticated: boolean
  compact?:        boolean
}

export default function SlowFoodMoodCTA({ challengeId, isAuthenticated, compact }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/retos/slow-food-mood')
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

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="text-sm leading-relaxed text-center" style={{ color: 'rgba(107,39,55,0.65)' }}>
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full py-4 rounded-full text-base font-bold transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: '#E8703A', color: '#fff' }}
      >
        {isPending ? 'Procesando…' : 'Empezar 21 días — 29€ →'}
      </button>
      <p className="text-xs text-center" style={{ color: 'rgba(107,39,55,0.4)' }}>
        Pago seguro vía Stripe · Acceso inmediato · <span style={{ color: 'rgba(107,39,55,0.55)' }}>🛡️ 7 días de garantía</span>
      </p>
    </div>
  )
}
