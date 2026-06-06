'use client'

import { useState, useEffect, useRef } from 'react'

interface Informe {
  titulo:             string
  resumen_ejecutivo:  string
  evolucion_energia: {
    inicio:      number | null
    mitad:       number | null
    final:       number | null
    descripcion: string
  }
  logros_principales: string[]
  patron_observado:   string
  siguiente_paso: {
    recomendacion: string
    razon:         string
  }
  mensaje_cierre: string
}

interface Props {
  challengeId:       string
  slug:              string
  informeExistente?: Informe | null
}

// ── SVG Evolution Chart ────────────────────────────────────────────────────

function EvolucionChart({ inicio, mitad, final: fin }: {
  inicio: number | null
  mitad:  number | null
  final:  number | null
}) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(t)
  }, [])

  const W = 320, H = 140
  const PAD_L = 36, PAD_R = 16, PAD_T = 20, PAD_B = 32
  const chartW = W - PAD_L - PAD_R
  const chartH = H - PAD_T - PAD_B
  const MAX = 5

  const points = [
    { label: 'Día 1', val: inicio, x: PAD_L },
    { label: 'Día 4', val: mitad,  x: PAD_L + chartW / 2 },
    { label: 'Día 7', val: fin,    x: PAD_L + chartW },
  ]

  const yFor = (v: number | null) =>
    v == null ? null : PAD_T + chartH - (v / MAX) * chartH

  const validPts = points.filter(p => p.val != null) as { label: string; val: number; x: number }[]

  const polyline = validPts
    .map(p => `${p.x},${yFor(p.val)!}`)
    .join(' ')

  const BAR_W = 28

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="Gráfica de evolución de energía"
    >
      {/* Y-axis grid lines */}
      {[1, 2, 3, 4, 5].map(v => {
        const y = PAD_T + chartH - (v / MAX) * chartH
        return (
          <g key={v}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y}
              stroke="rgba(107,39,55,0.08)" strokeWidth={1} strokeDasharray="3 4" />
            <text x={PAD_L - 6} y={y + 4} textAnchor="end"
              fontSize={9} fill="rgba(107,39,55,0.35)" fontFamily="inherit">{v}</text>
          </g>
        )
      })}

      {/* Bars */}
      {points.map((p, i) => {
        if (p.val == null) return null
        const barH = animated ? (p.val / MAX) * chartH : 0
        const y = PAD_T + chartH - barH
        const colors = ['#e8ddd5', '#FF6B35', '#6B2737']
        return (
          <rect key={i}
            x={p.x - BAR_W / 2} y={y} width={BAR_W} height={barH}
            rx={4} fill={colors[i]} opacity={0.55}
            style={{ transition: 'height 0.7s cubic-bezier(.22,1,.36,1), y 0.7s cubic-bezier(.22,1,.36,1)' }}
          />
        )
      })}

      {/* Connection line */}
      {validPts.length > 1 && (
        <polyline
          points={polyline}
          fill="none"
          stroke="#6B2737"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={animated ? 1 : 0}
          style={{ transition: 'opacity 0.4s ease 0.5s' }}
        />
      )}

      {/* Dots + value labels */}
      {points.map((p, i) => {
        const y = yFor(p.val)
        if (y == null) return null
        const colors = ['#a08070', '#FF6B35', '#6B2737']
        return (
          <g key={i} opacity={animated ? 1 : 0} style={{ transition: `opacity 0.3s ease ${0.3 + i * 0.1}s` }}>
            <circle cx={p.x} cy={y} r={5} fill={colors[i]} />
            <text x={p.x} y={y - 9} textAnchor="middle"
              fontSize={11} fontWeight="700" fill={colors[i]} fontFamily="inherit">
              {p.val}
            </text>
          </g>
        )
      })}

      {/* X-axis labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={H - 4} textAnchor="middle"
          fontSize={10} fill="rgba(107,39,55,0.5)" fontFamily="inherit">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

// ── PDF via print popup ────────────────────────────────────────────────────

function descargarPDF(informe: Informe) {
  const ev = informe.evolucion_energia
  const mejora = ev.inicio != null && ev.final != null ? ev.final - ev.inicio : null

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>${informe.titulo} — Food·Mood</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; color:#2d0f16; background:#fff; padding:40px; max-width:680px; margin:0 auto; font-size:13px; line-height:1.6; }
  h1 { font-size:22px; font-weight:700; margin-bottom:6px; color:#6B2737; }
  h2 { font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:.12em; color:#9e8080; margin-bottom:12px; margin-top:24px; }
  .subtitle { color:#7a5c63; margin-bottom:28px; font-size:14px; }
  .card { border:1px solid #e8ddd5; border-radius:12px; padding:16px; margin-bottom:14px; }
  .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:12px; }
  .dot { text-align:center; border-radius:8px; padding:10px 6px; border:2px solid; }
  .dot-num { font-size:20px; font-weight:700; }
  .dot-lbl { font-size:10px; color:#9e8080; }
  .mejora { border-radius:8px; padding:8px 12px; margin-bottom:10px; font-weight:500; }
  .logro { display:flex; gap:10px; margin-bottom:8px; align-items:flex-start; }
  .logro-num { background:#f5eaec; color:#6B2737; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; }
  .patron { border-left:4px solid #FF6B35; padding:12px 16px; background:#fafaf5; border-radius:0 8px 8px 0; margin-bottom:14px; }
  .siguiente { background:#f5eaec; border-radius:8px; padding:12px; }
  .cierre { background:#6B2737; color:#F5F0E8; border-radius:12px; padding:20px; text-align:center; margin-top:24px; font-style:italic; font-size:15px; line-height:1.7; }
  .logo { color:#FF6B35; font-weight:700; font-size:13px; margin-bottom:4px; letter-spacing:.1em; }
  @media print { body { padding:24px; } }
</style>
</head>
<body>
<div class="logo">FOOD·MOOD</div>
<h1>${informe.titulo}</h1>
<p class="subtitle">${informe.resumen_ejecutivo}</p>

<h2>Evolución de energía</h2>
<div class="card">
  <div class="grid3">
    <div class="dot" style="border-color:#e8ddd5">
      <div class="dot-num" style="color:#a08070">${ev.inicio ?? '—'}</div>
      <div class="dot-lbl">Día 1</div>
    </div>
    <div class="dot" style="border-color:#FF6B35">
      <div class="dot-num" style="color:#FF6B35">${ev.mitad ?? '—'}</div>
      <div class="dot-lbl">Día 4</div>
    </div>
    <div class="dot" style="border-color:#6B2737">
      <div class="dot-num" style="color:#6B2737">${ev.final ?? '—'}</div>
      <div class="dot-lbl">Día 7</div>
    </div>
  </div>
  ${mejora !== null ? `<div class="mejora" style="background:${mejora > 0 ? '#f0f9e8' : '#fdf5e0'};color:${mejora > 0 ? '#2d6a2d' : '#7a5a00'}">
    ${mejora > 0 ? `📈 +${mejora} puntos en 7 días` : mejora === 0 ? '➡️ Energía estable' : `📊 ${mejora} puntos`}
  </div>` : ''}
  <p>${ev.descripcion}</p>
</div>

<h2>Logros de la semana</h2>
<div class="card">
  ${informe.logros_principales.map((l, i) => `
  <div class="logro">
    <div class="logro-num">${i + 1}</div>
    <p>${l}</p>
  </div>`).join('')}
</div>

<h2>Patrón observado</h2>
<div class="patron">💡 ${informe.patron_observado}</div>

<h2>Siguiente reto recomendado</h2>
<div class="siguiente">
  <p style="font-weight:700;color:#6B2737;margin-bottom:4px">${informe.siguiente_paso.recomendacion}</p>
  <p style="color:#7a5c63">${informe.siguiente_paso.razon}</p>
</div>

<div class="cierre">&ldquo;${informe.mensaje_cierre}&rdquo;</div>

<script>window.onload = function(){ window.print(); setTimeout(window.close, 500); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=720,height=900')
  if (!win) return
  win.document.write(html)
  win.document.close()
}

// ── Main component ─────────────────────────────────────────────────────────

export default function InformePersonalizado({ challengeId, slug, informeExistente }: Props) {
  const [informe,  setInforme]  = useState<Informe | null>(informeExistente ?? null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (!informe) generarInforme()
  }, []) // eslint-disable-line

  async function generarInforme() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/retos/generar-informe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ challengeId, slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInforme(data.informe)
    } catch (e: any) {
      setError(e.message || 'Error generando el informe')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="text-center py-12 text-sm" style={{ color: '#7a5c63' }}>
      <div className="text-3xl mb-3">🔬</div>
      Analizando tus registros de la semana...
    </div>
  )

  if (error) return (
    <div className="rounded-xl p-4 text-center text-[13px]"
      style={{ background: '#fdf0ee', color: '#c0392b' }}>
      {error}
      <button
        onClick={generarInforme}
        className="block mx-auto mt-2.5 rounded-lg px-4 py-2 text-xs font-semibold text-white cursor-pointer"
        style={{ background: '#6B2737', border: 'none', fontFamily: 'inherit' }}
      >
        Reintentar
      </button>
    </div>
  )

  if (!informe) return null

  const ev     = informe.evolucion_energia
  const mejora = ev.inicio != null && ev.final != null ? ev.final - ev.inicio : null

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="rounded-2xl p-6 text-center" style={{ background: '#6B2737', color: '#F5F0E8' }}>
        <div className="text-4xl mb-2">📋</div>
        <h2 className="font-serif text-lg font-normal mb-2.5">{informe.titulo}</h2>
        <p className="text-[13px] leading-relaxed" style={{ opacity: 0.85 }}>
          {informe.resumen_ejecutivo}
        </p>
      </div>

      {/* Evolución — gráfica + tarjetas */}
      <div className="rounded-2xl border border-[#e8ddd5] bg-white p-5">
        <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#9e8080' }}>
          Evolución de energía
        </p>

        <div className="mb-4">
          <EvolucionChart inicio={ev.inicio} mitad={ev.mitad} final={ev.final} />
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          {[
            { label: 'Día 1', valor: ev.inicio, color: '#a08070', border: '#e8ddd5' },
            { label: 'Día 4', valor: ev.mitad,  color: '#FF6B35', border: '#FF6B35' },
            { label: 'Día 7', valor: ev.final,  color: '#6B2737', border: '#6B2737' },
          ].map(({ label, valor, color, border }) => (
            <div key={label} className="text-center rounded-xl py-3"
              style={{ background: '#fafaf8', border: `2px solid ${border}` }}>
              <p className="text-2xl font-bold mb-0.5" style={{ color }}>
                {valor ?? '—'}
              </p>
              <p className="text-[11px]" style={{ color: '#9e8080' }}>{label}</p>
            </div>
          ))}
        </div>

        {mejora !== null && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-2.5"
            style={{ background: mejora > 0 ? '#f0f9e8' : '#fdf5e0' }}>
            <span className="text-base">
              {mejora > 0 ? '📈' : mejora === 0 ? '➡️' : '📊'}
            </span>
            <p className="text-[13px] font-medium"
              style={{ color: mejora > 0 ? '#2d6a2d' : '#7a5a00' }}>
              {mejora > 0
                ? `+${mejora} puntos en 7 días`
                : mejora === 0
                ? 'Energía estable — la base está construida'
                : `${mejora} puntos — el cuerpo necesita más tiempo`}
            </p>
          </div>
        )}

        <p className="text-[13px] leading-relaxed" style={{ color: '#7a5c63' }}>
          {ev.descripcion}
        </p>
      </div>

      {/* Logros */}
      <div className="rounded-2xl border border-[#e8ddd5] bg-white p-5">
        <p className="text-[11px] font-medium uppercase tracking-widest mb-3.5" style={{ color: '#9e8080' }}>
          Logros de la semana
        </p>
        {informe.logros_principales.map((logro, i) => (
          <div key={i} className="flex items-start gap-2.5 mb-2.5 last:mb-0">
            <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
              style={{ background: '#f5eaec', color: '#6B2737' }}>
              {i + 1}
            </div>
            <p className="text-[13px] leading-snug" style={{ color: '#4a3a3e' }}>{logro}</p>
          </div>
        ))}
      </div>

      {/* Patrón observado */}
      <div className="rounded-2xl p-5"
        style={{ background: '#fafaf5', border: '1px solid #e8ddd5', borderLeft: '4px solid #FF6B35' }}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-base">💡</span>
          <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: '#7a5a00' }}>
            Patrón observado
          </p>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: '#4a3a3e' }}>
          {informe.patron_observado}
        </p>
      </div>

      {/* Siguiente paso */}
      <div className="rounded-2xl border border-[#e8ddd5] bg-white p-5">
        <p className="text-[11px] font-medium uppercase tracking-widest mb-3.5" style={{ color: '#9e8080' }}>
          Siguiente reto recomendado
        </p>
        <div className="rounded-xl p-3.5" style={{ background: '#f5eaec' }}>
          <p className="font-serif text-[15px] font-semibold mb-1.5" style={{ color: '#6B2737' }}>
            {informe.siguiente_paso.recomendacion}
          </p>
          <p className="text-[13px] leading-snug" style={{ color: '#7a5c63' }}>
            {informe.siguiente_paso.razon}
          </p>
        </div>
      </div>

      {/* Cierre */}
      <div className="rounded-2xl p-5 text-center" style={{ background: '#6B2737' }}>
        <p className="font-serif text-[15px] italic leading-relaxed" style={{ color: '#F5F0E8' }}>
          &ldquo;{informe.mensaje_cierre}&rdquo;
        </p>
      </div>

      {/* PDF download */}
      <button
        onClick={() => descargarPDF(informe)}
        className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ background: '#F5F0E8', color: '#6B2737', border: '1.5px solid #e8ddd5', fontFamily: 'inherit', cursor: 'pointer' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Descargar informe PDF
      </button>

    </div>
  )
}
