'use client'

interface Props {
  slug:        string
  challengeId: string
  precio:      number
  yaComprado?: boolean
}

// La compra directa de retos por el consumidor está desactivada.
// Los programas se asignan exclusivamente por el profesional desde el portal.
// Se mantiene el botón "Continuar" para quienes ya tienen acceso.
export default function BuyRetoButton({ slug, yaComprado = false }: Props) {
  if (!yaComprado) return null

  return (
    <a
      href={`/retos/${slug}/acceso`}
      className="block w-full rounded-xl text-base font-semibold text-center transition-colors"
      style={{ padding: '16px 24px', background: '#6B2737', color: '#F5F0E8', textDecoration: 'none' }}
    >
      Continuar mi programa →
    </a>
  )
}
