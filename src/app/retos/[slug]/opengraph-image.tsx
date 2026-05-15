import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PALETTE: Record<string, { bg: string; accent: string; ink: string }> = {
  'recupera-tu-energia':    { bg: '#F1E7D4', accent: '#B85A1F', ink: '#231F17' },
  'reset-antiinflamatorio': { bg: '#E4EADE', accent: '#3F5A37', ink: '#1B2218' },
  'activa-tu-longevidad':   { bg: '#E9D9C7', accent: '#7A3A20', ink: '#241814' },
  'microhabitos':           { bg: '#DBE0E6', accent: '#243A5C', ink: '#15171C' },
  'slow-food-mood':         { bg: '#E5DDE7', accent: '#5A4570', ink: '#1F1A23' },
  'food-mood-reset':        { bg: '#F0DDCB', accent: '#B14F31', ink: '#231510' },
  'equilibrio-hormonal-45': { bg: '#E8D4DC', accent: '#8C3F5C', ink: '#241319' },
  'mejora-tu-sueno':        { bg: '#1F2540', accent: '#D6B26C', ink: '#F2EAD3' },
}

const BADGES: Record<string, string> = {
  'slow-food-mood':         'NERVOUS SYSTEM CARE',
  'food-mood-reset':        'MÁS VENDIDO',
  'recupera-tu-energia':    'RECOMENDADO PARA EMPEZAR',
  'microhabitos':           'MICRO-PRÁCTICAS',
  'reset-antiinflamatorio': 'POSTBIÓTICOS',
  'equilibrio-hormonal-45': 'POSTBIÓTICOS',
  'mejora-tu-sueno':        'CIRCADIAN WELLNESS',
  'activa-tu-longevidad':   'NUEVO',
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: challenge } = await supabase
    .from('challenges')
    .select('title, subtitle, price_eur, duration_days, category')
    .eq('slug', slug)
    .maybeSingle()

  const title    = challenge?.title    ?? 'Reto Food·Mood'
  const subtitle = challenge?.subtitle ?? 'Nutrición emocional basada en el eje intestino-cerebro.'
  const price    = challenge?.price_eur ?? 19
  const days     = challenge?.duration_days ?? 7
  const category = challenge?.category ?? 'Nutrición emocional'

  const pal   = PALETTE[slug] ?? { bg: '#F5F0E8', accent: '#6B2737', ink: '#2d0f16' }
  const badge = BADGES[slug]

  const durationStr = days === 7 ? '1 semana' : days === 28 ? '4 semanas' : `${days} días`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: pal.bg,
          padding: '64px 72px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: pal.accent, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
            Food·Mood
          </span>
          {badge && (
            <span style={{
              fontSize: 12, fontWeight: 900, color: pal.accent, letterSpacing: '0.22em',
              textTransform: 'uppercase', padding: '6px 14px', borderRadius: 99,
              backgroundColor: pal.accent + '20', border: `1px solid ${pal.accent}44`,
              fontFamily: 'system-ui, sans-serif',
            }}>
              {badge}
            </span>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: pal.accent, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}>
            {category} · {durationStr}
          </div>
          <div style={{ fontSize: 62, fontWeight: 400, color: pal.ink, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            {title}
          </div>
          <div style={{ fontSize: 20, fontWeight: 300, color: pal.ink + 'aa', lineHeight: 1.4, maxWidth: 700, fontFamily: 'system-ui, sans-serif' }}>
            {subtitle}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 300, color: pal.ink + '77', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.08em' }}>
            food-mood.app · eje intestino-cerebro
          </span>
          <span style={{ fontSize: 36, fontWeight: 900, color: pal.accent, fontFamily: 'system-ui, sans-serif' }}>
            {price}€
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
