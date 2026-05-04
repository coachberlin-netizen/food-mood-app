import Link from 'next/link'

export function BetaBanner() {
  return (
    <div
      style={{
        backgroundColor: '#2d0f16',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* Left: Beta pill + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            backgroundColor: 'rgba(201,168,76,0.18)',
            border: '1px solid rgba(201,168,76,0.4)',
            color: '#C9A84C',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: 4,
            flexShrink: 0,
          }}
        >
          Beta
        </span>
        <span
          style={{
            fontSize: 12,
            color: 'rgba(245,240,232,0.55)',
            lineHeight: 1.4,
          }}
        >
          Plataforma en acceso anticipado · Versión en construcción activa
        </span>
      </div>

      {/* Right: Investor CTA */}
      <Link
        href="/inversores"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#C9A84C',
          color: '#2d0f16',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          padding: '5px 14px',
          borderRadius: 20,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Pre-Seed · €140K abierto
        <span style={{ fontSize: 13 }}>→</span>
      </Link>
    </div>
  )
}
