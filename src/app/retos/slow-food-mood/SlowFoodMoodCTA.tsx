"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  challenge7dId:  string | null
  challenge21dId: string | null
  isAuthenticated: boolean
  compact?: boolean
}

export default function SlowFoodMoodCTA({ challenge7dId, challenge21dId, isAuthenticated, compact }: Props) {
  const router = useRouter()
  const [plan, setPlan] = useState<'21d' | '7d'>('21d')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/retos/slow-food-mood')
      return
    }
    const id = plan === '21d' ? challenge21dId : challenge7dId
    if (!id) {
      setError('Este reto estará disponible muy pronto. Escríbenos a hola@food-mood.app para acceso anticipado.')
      return
    }
    setError(null)
    startTransition(async () => {
      try {
        const res  = await fetch('/api/retos/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challenge_id: id }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error ?? 'Error al procesar el pago'); return }
        window.location.href = data.url
      } catch {
        setError('Error de conexión. Inténtalo de nuevo.')
      }
    })
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {error && <p className="text-sm" style={{ color: '#b04040' }}>{error}</p>}
        <button
          onClick={() => { setPlan('21d'); handleCheckout() }}
          disabled={isPending}
          className="w-full py-4 rounded-full text-base font-bold text-[#F5F0E8] transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#6B2737' }}
        >
          {isPending && plan === '21d' ? 'Procesando…' : 'Empezar 21 días — 29€ →'}
        </button>
        <button
          onClick={() => { setPlan('7d'); handleCheckout() }}
          disabled={isPending}
          className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ border: '1.5px solid #C9A84C', color: '#C9A84C', background: 'transparent' }}
        >
          {isPending && plan === '7d' ? 'Procesando…' : 'Probar 7 días — 19€'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPlan('21d')}
          className="py-4 px-5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            border: `2px solid ${plan === '21d' ? '#6B2737' : 'rgba(107,39,55,0.2)'}`,
            background: plan === '21d' ? '#6B2737' : 'transparent',
            color: plan === '21d' ? '#F5F0E8' : 'rgba(107,39,55,0.65)',
          }}
        >
          <span className="block text-xs font-light mb-1 opacity-70">Cambio de hábito</span>
          21 días · 29€
        </button>
        <button
          onClick={() => setPlan('7d')}
          className="py-4 px-5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            border: `2px solid ${plan === '7d' ? '#C9A84C' : 'rgba(201,168,76,0.25)'}`,
            background: plan === '7d' ? 'rgba(201,168,76,0.1)' : 'transparent',
            color: plan === '7d' ? '#8a6b20' : 'rgba(107,39,55,0.5)',
          }}
        >
          <span className="block text-xs font-light mb-1 opacity-70">Primer contacto</span>
          7 días · 19€
        </button>
      </div>

      {error && (
        <p className="text-sm leading-relaxed text-center" style={{ color: 'rgba(107,39,55,0.65)' }}>
          {error}
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full py-4 rounded-full text-base font-bold transition-all hover:opacity-90 disabled:opacity-50"
        style={{
          backgroundColor: plan === '21d' ? '#E8703A' : '#C9A84C',
          color: plan === '21d' ? '#fff' : '#2d0f16',
        }}
      >
        {isPending
          ? 'Procesando…'
          : plan === '21d'
          ? 'Empezar 21 días — 29€ →'
          : 'Probar 7 días — 19€ →'}
      </button>

      <p className="text-xs text-center" style={{ color: 'rgba(107,39,55,0.4)' }}>
        Pago seguro vía Stripe · Acceso inmediato · <span style={{ color: 'rgba(107,39,55,0.55)' }}>🛡️ 7 días de garantía</span>
      </p>
    </div>
  )
}
