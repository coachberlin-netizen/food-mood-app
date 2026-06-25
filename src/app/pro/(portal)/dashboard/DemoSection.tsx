'use client'

// ─── Datos de demostración ────────────────────────────────────────────────────
// Hardcoded mock data para reuniones comerciales.
// Este bloque desaparece automáticamente en cuanto hay huéspedes reales vinculados.

const DEMO_STATS = [
  { label: 'Huéspedes activos',  value: '24',    sub: 'en dos propiedades' },
  { label: 'Protocolos en curso', value: '3',     sub: 'esta semana' },
  { label: 'Adherencia media',    value: '78 %',  sub: 'últimos 7 días' },
  { label: 'Satisfacción',        value: '4.7/5', sub: 'escala de bienestar' },
]

const DEMO_PROTOCOLS = [
  {
    name:      'Descanso Profundo',
    category:  'Sueño',
    guests:    14,
    evidence:  'solida' as const,
    color:     '#2d7a4f',
    adherence: 82,
  },
  {
    name:      'Calma Activa',
    category:  'Estrés',
    guests:    7,
    evidence:  'prometedora' as const,
    color:     '#FF6B35',
    adherence: 76,
  },
  {
    name:      'Ritual Lento',
    category:  'Slow Food·Mood',
    guests:    3,
    evidence:  'prometedora' as const,
    color:     '#A07BBE',
    adherence: 91,
  },
]

const DEMO_RECIPES = [
  { title: 'Caldo de kombu y jengibre',  tag: 'Antiinflamatorio' },
  { title: 'Desayuno de energía estable', tag: 'Vitalidad' },
  { title: 'Infusión de cierre',          tag: 'Sueño' },
  { title: 'Bolo de adaptógenos',         tag: 'Estrés' },
]

// Evolución del huésped #1042 — estrés percibido (días 1-7, escala 1-10)
const STRESS_POINTS = [8, 7.5, 7, 6.5, 6, 5.5, 5]
const SLEEP_POINTS  = [5, 5.5, 6, 6.5, 7, 7, 7.5]

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const EVIDENCE_LABELS: Record<'solida' | 'prometedora', { label: string; bg: string; color: string; dot: string }> = {
  solida:      { label: 'Evidencia sólida',      bg: 'rgba(45,122,79,0.1)',   color: '#2d7a4f', dot: '#2d7a4f' },
  prometedora: { label: 'Evidencia prometedora', bg: 'rgba(255,107,53,0.1)',  color: '#c4501e', dot: '#FF6B35' },
}

function EvidenceBadge({ level }: { level: 'solida' | 'prometedora' }) {
  const cfg = EVIDENCE_LABELS[level]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

function MiniChart() {
  const W = 220; const H = 60; const PAD = 6
  const toX = (i: number) => PAD + (i / 6) * (W - PAD * 2)
  const toY = (v: number, min = 4, max = 9) => PAD + ((max - v) / (max - min)) * (H - PAD * 2)

  const polyline = (pts: number[]) =>
    pts.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: 220, height: 60 }} aria-hidden="true">
      {/* Grid lines */}
      {[5, 7, 9].map(v => (
        <line key={v} x1={PAD} y1={toY(v)} x2={W - PAD} y2={toY(v)}
          stroke="rgba(107,39,55,0.07)" strokeWidth="1" />
      ))}
      {/* Sleep line (teal) */}
      <polyline points={polyline(SLEEP_POINTS)} fill="none"
        stroke="rgba(90,155,138,0.5)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Stress line (burgundy) */}
      <polyline points={polyline(STRESS_POINTS)} fill="none"
        stroke="#6B2737" strokeWidth="2" strokeLinejoin="round" />
      {/* Last dot stress */}
      <circle cx={toX(6)} cy={toY(STRESS_POINTS[6])} r="3" fill="#6B2737" />
      <circle cx={toX(6)} cy={toY(SLEEP_POINTS[6])}  r="3" fill="rgba(90,155,138,0.7)" />
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DemoSection() {
  return (
    <div className="mt-10 space-y-8">

      {/* Banner de demo */}
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl"
        style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)' }}
      >
        <span
          className="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shrink-0"
          style={{ background: 'rgba(255,107,53,0.12)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.25)' }}
        >
          Vista de demostración
        </span>
        <p className="text-xs font-light" style={{ color: 'rgba(107,39,55,0.55)' }}>
          Datos de ejemplo para ilustrar cómo se vería la plataforma con un hotel activo.
          Se reemplazarán por datos reales cuando se incorpore el primer cliente.
        </p>
      </div>

      {/* KPIs de demo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_STATS.map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{ background: 'white', border: '1px solid rgba(107,39,55,0.08)', boxShadow: '0 1px 8px rgba(107,39,55,0.05)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(107,39,55,0.4)' }}>
              {s.label}
            </p>
            <p className="text-2xl font-bold font-serif" style={{ color: '#2d0f16' }}>{s.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(107,39,55,0.35)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Protocolos activos */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(107,39,55,0.4)' }}>
          Protocolos activos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DEMO_PROTOCOLS.map(p => (
            <div
              key={p.name}
              className="rounded-2xl p-5"
              style={{ background: 'white', border: '1px solid rgba(107,39,55,0.08)', boxShadow: '0 1px 8px rgba(107,39,55,0.05)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <EvidenceBadge level={p.evidence} />
                <span className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.4)' }}>
                  {p.guests} huéspedes
                </span>
              </div>
              <p className="font-serif text-base font-semibold leading-snug mb-0.5" style={{ color: '#2d0f16' }}>
                {p.name}
              </p>
              <p className="text-[11px] mb-4" style={{ color: 'rgba(107,39,55,0.5)' }}>{p.category}</p>
              {/* Barra de adherencia */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(107,39,55,0.35)' }}>Adherencia</span>
                  <span className="text-[9px] font-bold" style={{ color: p.color }}>{p.adherence}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(107,39,55,0.07)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${p.adherence}%`, background: p.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seguimiento de huésped */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: 'white', border: '1px solid rgba(107,39,55,0.08)', boxShadow: '0 1px 8px rgba(107,39,55,0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(107,39,55,0.4)' }}>
                Evolución · 7 días
              </p>
              <p className="font-serif text-base font-semibold" style={{ color: '#2d0f16' }}>Huésped #1042</p>
            </div>
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: 'rgba(90,155,138,0.1)', color: '#2d7a4f' }}
            >
              Adherencia 85%
            </span>
          </div>
          <MiniChart />
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-[9px]" style={{ color: 'rgba(107,39,55,0.5)' }}>
              <span className="inline-block w-3 h-0.5 rounded" style={{ background: '#6B2737' }} />
              Estrés percibido
            </span>
            <span className="flex items-center gap-1 text-[9px]" style={{ color: 'rgba(90,155,138,0.7)' }}>
              <span className="inline-block w-3 h-0.5 rounded" style={{ background: 'rgba(90,155,138,0.7)' }} />
              Calidad de sueño
            </span>
          </div>
          <p className="text-[9px] mt-3 font-light" style={{ color: 'rgba(107,39,55,0.3)' }}>
            Datos de demostración · no corresponden a ningún huésped real.
          </p>
        </div>

        {/* Catálogo de recetas */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'white', border: '1px solid rgba(107,39,55,0.08)', boxShadow: '0 1px 8px rgba(107,39,55,0.05)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Recetas funcionales · muestra del catálogo
          </p>
          <ul className="space-y-3">
            {DEMO_RECIPES.map(r => (
              <li key={r.title} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(107,39,55,0.05)' }}>
                <span className="text-sm font-light" style={{ color: '#2d0f16' }}>{r.title}</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ml-3"
                  style={{ background: 'rgba(107,39,55,0.06)', color: '#6B2737' }}
                >
                  {r.tag}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[9px] mt-3 font-light" style={{ color: 'rgba(107,39,55,0.3)' }}>
            Biblioteca completa disponible en la zona de cliente.
          </p>
        </div>
      </div>

    </div>
  )
}
