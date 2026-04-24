"use client"

import { useRef, useState, useEffect, useContext, createContext } from 'react'
import Link from 'next/link'

// ── Constants ─────────────────────────────────────────────────────────────

const TOTAL = 80
const W = 1280, H = 720
const HV = 'Helvetica Neue, Helvetica, Arial, sans-serif'
const CREAM = '#f5ede4'
const CREAM_DIM = 'rgba(245,237,228,0.5)'
const CREAM_FAINT = 'rgba(245,237,228,0.18)'

const SCENES = [
  { id: 'sueno',    bg: '#1a0825', accent: 'oklch(72% 0.22 275)', accentRgb: '142,108,230', label: 'SUEÑO',        slug: '/retos/mejora-tu-sueno' },
  { id: 'energia',  bg: '#2a1200', accent: 'oklch(78% 0.22 68)',  accentRgb: '240,168,40',  label: 'ENERGÍA',      slug: '/retos/recupera-tu-energia' },
  { id: 'hormonal', bg: '#2e0820', accent: 'oklch(72% 0.22 355)', accentRgb: '235,100,148', label: 'HORMONAL',     slug: '/retos/equilibrio-hormonal-45' },
  { id: 'inflamac', bg: '#061a0c', accent: 'oklch(74% 0.22 148)', accentRgb: '80,210,120',  label: 'INFLAMACIÓN',  slug: '/retos/reset-antiinflamatorio' },
  { id: 'mental',   bg: '#080a2e', accent: 'oklch(70% 0.22 300)', accentRgb: '175,110,240', label: 'SALUD MENTAL', slug: '/retos/food-mood-reset' },
]

// ── Easing & animate ──────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

const Easing = {
  easeOutCubic:   (t: number) => 1 - Math.pow(1 - t, 3),
  easeInCubic:    (t: number) => t * t * t,
  easeOutExpo:    (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

function makeAnimate({ from, to, start, end, ease = Easing.easeOutCubic }: {
  from: number; to: number; start: number; end: number; ease?: (t: number) => number
}) {
  return (time: number) => {
    const t = clamp((time - start) / (end - start), 0, 1)
    return from + (to - from) * ease(t)
  }
}

// ── Time & Sprite contexts ────────────────────────────────────────────────

const TimeCtx = createContext(0)
function useTime() { return useContext(TimeCtx) }

interface SpriteCtxValue { localTime: number; duration: number }
const SpriteCtx = createContext<SpriteCtxValue>({ localTime: 0, duration: 11 })
function useSprite() { return useContext(SpriteCtx) }

function Sprite({ start, end, children }: { start: number; end: number; children: React.ReactNode }) {
  const time = useTime()
  if (time < start || time >= end) return null
  return (
    <SpriteCtx.Provider value={{ localTime: time - start, duration: end - start }}>
      {children}
    </SpriteCtx.Provider>
  )
}

function useFade(entryDur = 0.7, exitDur = 0.5) {
  const { localTime, duration } = useSprite()
  const fadeIn = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1))
  const exitStart = duration - exitDur
  const fadeOut = localTime > exitStart
    ? 1 - Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1))
    : 1
  return fadeIn * fadeOut
}

// ── Botanical SVG fruit icons ─────────────────────────────────────────────

type IconFn = (stroke: string, sw: number) => React.ReactNode

const FRUIT_ICONS: Record<string, IconFn> = {
  '🍌': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 8,47 C 16,12 42,9 53,22"/>
      <circle cx="8" cy="47" r="2.5" fill={s} stroke="none"/>
      <circle cx="53" cy="22" r="2.5" fill={s} stroke="none"/>
    </g>
  ),
  '🫐': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <circle cx="30" cy="36" r="15"/>
      <path d="M 22,21 Q 30,15 38,21"/>
      <line x1="26" y1="16" x2="24" y2="11"/>
      <line x1="30" y1="15" x2="30" y2="9"/>
      <line x1="34" y1="16" x2="36" y2="11"/>
    </g>
  ),
  '🥛': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 17,50 L 21,20 L 39,20 L 43,50 Z"/>
      <path d="M 21,28 L 39,28"/>
      <path d="M 21,20 Q 30,14 39,20"/>
    </g>
  ),
  '🍊': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <circle cx="30" cy="35" r="17"/>
      <path d="M 30,18 C 26,9 34,9 30,18"/>
      <line x1="30" y1="12" x2="30" y2="18"/>
      <line x1="30" y1="15" x2="35" y2="12"/>
    </g>
  ),
  '🍋': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <ellipse cx="30" cy="30" rx="20" ry="13" transform="rotate(-12,30,30)"/>
      <path d="M 11,23 C 7,24 7,29 10,28" transform="rotate(-12,30,30)"/>
      <path d="M 49,37 C 53,36 53,31 50,32" transform="rotate(-12,30,30)"/>
    </g>
  ),
  '⚡': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 36,8 L 22,32 L 31,32 L 24,52 L 39,28 L 29,28 Z"/>
    </g>
  ),
  '🥑': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 30,8 C 40,9 44,22 44,34 C 44,44 38,52 30,52 C 22,52 16,44 16,34 C 16,22 20,9 30,8 Z"/>
      <ellipse cx="30" cy="40" rx="7" ry="9"/>
    </g>
  ),
  '🍓': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 30,50 C 14,40 12,26 20,18 C 24,14 28,15 30,20 C 32,15 36,14 40,18 C 48,26 46,40 30,50 Z"/>
      <path d="M 23,13 C 20,8 17,10 20,14"/>
      <path d="M 30,11 L 30,16"/>
      <path d="M 37,13 C 40,8 43,10 40,14"/>
      <circle cx="24" cy="29" r="1.8" fill={s} stroke="none"/>
      <circle cx="36" cy="29" r="1.8" fill={s} stroke="none"/>
      <circle cx="22" cy="37" r="1.8" fill={s} stroke="none"/>
      <circle cx="38" cy="37" r="1.8" fill={s} stroke="none"/>
      <circle cx="30" cy="42" r="1.8" fill={s} stroke="none"/>
    </g>
  ),
  '🌸': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="30" cy="19" rx="5.5" ry="11" transform={`rotate(${a},30,30)`}/>
      ))}
      <circle cx="30" cy="30" r="5.5"/>
      <circle cx="30" cy="30" r="2" fill={s} stroke="none"/>
    </g>
  ),
  '🥦': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <line x1="30" y1="52" x2="30" y2="36"/>
      <line x1="22" y1="46" x2="27" y2="38"/>
      <line x1="38" y1="46" x2="33" y2="38"/>
      <path d="M 14,30 A 9,9 0 0 1 22,22 A 9,9 0 0 1 30,15 A 9,9 0 0 1 38,22 A 9,9 0 0 1 46,30 A 8,6 0 0 1 38,35 L 22,35 A 8,6 0 0 1 14,30 Z"/>
    </g>
  ),
  '🧄': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 19,38 C 17,28 22,16 30,14 C 38,16 43,28 41,38 C 39,46 35,50 30,50 C 25,50 21,46 19,38 Z"/>
      <line x1="30" y1="14" x2="30" y2="50"/>
      <line x1="30" y1="14" x2="27" y2="8"/>
      <line x1="30" y1="14" x2="33" y2="8"/>
      <path d="M 19,34 C 14,30 14,25 18,27"/>
      <path d="M 41,34 C 46,30 46,25 42,27"/>
    </g>
  ),
  '🫚': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 30,8 L 16,35 A 14,14 0 1 0 44,35 Z"/>
    </g>
  ),
  '🌿': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 30,52 Q 29,34 30,10"/>
      <path d="M 30,38 Q 14,27 18,13"/>
      <path d="M 30,28 Q 46,17 40,7"/>
    </g>
  ),
  '🥜': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <ellipse cx="30" cy="20" rx="11" ry="14"/>
      <ellipse cx="30" cy="42" rx="11" ry="14"/>
      <line x1="19" y1="26" x2="19" y2="36"/>
      <line x1="41" y1="26" x2="41" y2="36"/>
      <line x1="24" y1="27" x2="24" y2="35"/>
      <line x1="36" y1="27" x2="36" y2="35"/>
    </g>
  ),
  '🍵': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 13,30 L 17,52 L 43,52 L 47,30 Z"/>
      <path d="M 47,35 C 55,35 55,47 47,47"/>
      <path d="M 21,22 Q 23,15 21,9"/>
      <path d="M 30,22 Q 32,15 30,9"/>
      <path d="M 39,22 Q 41,15 39,9"/>
    </g>
  ),
  '🍅': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <circle cx="30" cy="36" r="17"/>
      <path d="M 22,19 C 20,12 25,10 27,14"/>
      <path d="M 30,11 L 30,19"/>
      <path d="M 38,19 C 40,12 35,10 33,14"/>
      <path d="M 27,14 Q 30,18 33,14"/>
    </g>
  ),
  '🍇': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <circle cx="22" cy="28" r="9"/><circle cx="38" cy="28" r="9"/>
      <circle cx="30" cy="40" r="9"/>
      <path d="M 30,10 Q 36,6 40,10"/>
      <line x1="30" y1="10" x2="30" y2="19"/>
    </g>
  ),
  '🥕': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <path d="M 30,10 L 18,46 C 24,50 36,50 42,46 Z"/>
      <path d="M 26,9 Q 24,4 28,6"/>
      <path d="M 30,8 Q 30,2 33,5"/>
      <path d="M 34,10 Q 36,4 38,7"/>
    </g>
  ),
  '✨': (s, sw) => (
    <g stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round">
      <line x1="30" y1="8" x2="30" y2="52"/>
      <line x1="8" y1="30" x2="52" y2="30"/>
      <line x1="15" y1="15" x2="45" y2="45"/>
      <line x1="45" y1="15" x2="15" y2="45"/>
    </g>
  ),
}

// ── useFruitColor ─────────────────────────────────────────────────────────

function useFruitColor(time: number, phase: number) {
  const pulse = 0.5 + 0.5 * Math.sin(time * 0.7 + phase * 1.7)
  const r = Math.round(210 + 35 * pulse)
  const g = Math.round(160 + 77 * pulse)
  const b = Math.round(90 + 138 * pulse)
  return { color: `rgb(${r},${g},${b})`, opacity: 0.6 + 0.4 * pulse }
}

// ── Particles ─────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  x: (Math.sin(i * 7.3) * 0.5 + 0.5) * W,
  y: (Math.cos(i * 5.1) * 0.5 + 0.5) * H,
  r: (Math.sin(i * 3.7) * 0.5 + 0.5) * 2 + 0.4,
  phase: i * 0.91,
  speed: 0.9 + (i % 5) * 0.35,
}))

function Particles({ accentRgb = '245,237,228', baseOpacity = 0.12 }: { accentRgb?: string; baseOpacity?: number }) {
  const time = useTime()
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {PARTICLES.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r}
          fill={`rgba(${accentRgb},${baseOpacity * (0.6 + 0.4 * Math.sin(time * s.speed + s.phase))})`} />
      ))}
    </svg>
  )
}

// ── DancingFruit ──────────────────────────────────────────────────────────

function DancingFruit({ emoji, baseX = 0, baseY = 0, phase = 0, ampY = 22, ampX = 10, freq = 1.1, rotAmp = 22, size = 52 }: {
  emoji: string; baseX?: number; baseY?: number; phase?: number
  ampY?: number; ampX?: number; freq?: number; rotAmp?: number; size?: number
}) {
  const time = useTime()
  const sf = (freq || 1.1) * 0.18
  const dy = Math.sin(time * sf * Math.PI * 2 + phase) * (ampY || 22)
  const dx = Math.cos(time * sf * Math.PI * 2 * 0.65 + phase) * (ampX || 10)
  const rot = Math.sin(time * sf * Math.PI * 2 + phase + 0.8) * rotAmp * 0.4
  const sx = 1 + Math.sin(time * sf * Math.PI * 4 + phase) * 0.04
  const sy = 1 - Math.sin(time * sf * Math.PI * 4 + phase) * 0.04
  const { color, opacity } = useFruitColor(time, phase)
  const left = (isFinite(baseX) ? baseX : 0) + dx - size / 2
  const top  = (isFinite(baseY) ? baseY : 0) + dy - size / 2
  const icon = FRUIT_ICONS[emoji]
  return (
    <div style={{
      position: 'absolute', left, top, width: size, height: size,
      transform: `rotate(${rot}deg) scaleX(${sx}) scaleY(${sy})`,
      opacity, userSelect: 'none', pointerEvents: 'none',
    }}>
      {icon
        ? <svg width={size} height={size} viewBox="0 0 60 60">{icon(color, 1.7)}</svg>
        : <span style={{ fontSize: size * 0.85, lineHeight: `${size}px`, display: 'block', textAlign: 'center' }}>{emoji}</span>
      }
    </div>
  )
}

// ── OrbitingFruit ─────────────────────────────────────────────────────────

function OrbitingFruit({ emoji, cx, cy, orbitR, speed = 0.4, phaseOff = 0, size = 40, opacity = 1 }: {
  emoji: string; cx: number; cy: number; orbitR: number
  speed?: number; phaseOff?: number; size?: number; opacity?: number
}) {
  const time = useTime()
  const angle = time * speed * Math.PI * 2 + phaseOff
  const x = cx + Math.cos(angle) * orbitR
  const y = cy + Math.sin(angle) * orbitR * 0.45
  const rot = Math.sin(time * 3 + phaseOff) * 18
  const { color, opacity: shimOp } = useFruitColor(time, phaseOff)
  const icon = FRUIT_ICONS[emoji]
  return (
    <div style={{
      position: 'absolute', left: x - size / 2, top: y - size / 2,
      width: size, height: size,
      transform: `rotate(${rot}deg)`,
      opacity: opacity * shimOp,
      userSelect: 'none', pointerEvents: 'none',
    }}>
      {icon
        ? <svg width={size} height={size} viewBox="0 0 60 60">{icon(color, 2)}</svg>
        : <span style={{ fontSize: size * 0.85, lineHeight: `${size}px`, display: 'block', textAlign: 'center' }}>{emoji}</span>
      }
    </div>
  )
}

// ── Orb & ring ────────────────────────────────────────────────────────────

function Orb({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
      <circle cx={cx} cy={cy} r={r * 1.4} fill={`rgba(${color},0.06)`} />
      <circle cx={cx} cy={cy} r={r * 1.15} fill={`rgba(${color},0.09)`} />
      <circle cx={cx} cy={cy} r={r} fill={`rgba(${color},0.18)`} stroke={`rgba(${color},0.5)`} strokeWidth={1.5} />
    </svg>
  )
}

function OrbitRing({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.45}
        fill="none" stroke={`rgba(${color},0.18)`} strokeWidth={1} strokeDasharray="4 10" />
    </svg>
  )
}

// ── MetaPill ──────────────────────────────────────────────────────────────

function MetaPill({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px',
      border: `1px solid ${color}44`,
      borderRadius: 20,
      fontFamily: HV, fontSize: 13, fontWeight: 500,
      color, letterSpacing: '0.02em',
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span> {label}
    </span>
  )
}

// ── ProductScene wrapper ──────────────────────────────────────────────────

type FruitDef    = { e: string; bx: number; by: number; ph: number; sz?: number; ay?: number; ampX?: number }
type OrbFruitDef = { e: string; ph: number; spd?: number; sz?: number }

function ProductScene({ scene, children, fruits, orbFruits = [] }: {
  scene: typeof SCENES[0]; children: React.ReactNode
  fruits: FruitDef[]; orbFruits?: OrbFruitDef[]
}) {
  const { localTime } = useSprite()
  const f = useFade(1.0, 0.7)
  const orbCx = W * 0.73, orbCy = H / 2, orbR = 210
  const animR = makeAnimate({ from: 0, to: orbR, start: 0, end: 1.6, ease: Easing.easeOutExpo })(localTime)

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: f }}>
      <Particles accentRgb={scene.accentRgb} baseOpacity={0.08} />
      <Orb cx={orbCx} cy={orbCy} r={animR} color={scene.accentRgb} />
      <OrbitRing cx={orbCx} cy={orbCy} r={animR * 1.28} color={scene.accentRgb} />

      {orbFruits.map((fr, i) => (
        <OrbitingFruit key={i} emoji={fr.e} cx={orbCx} cy={orbCy} orbitR={animR * 1.28}
          speed={fr.spd ?? 0.12} phaseOff={fr.ph} size={fr.sz ?? 40}
          opacity={clamp((localTime - 1.4) / 0.8, 0, 1)} />
      ))}

      {fruits.map((fr, i) => (
        <DancingFruit key={i} emoji={fr.e} baseX={fr.bx} baseY={fr.by}
          phase={fr.ph} size={fr.sz ?? 50} ampY={fr.ay ?? 20} ampX={fr.ampX ?? 5} />
      ))}

      <div style={{
        position: 'absolute', left: 80, top: 72,
        fontFamily: HV, fontSize: 11, fontWeight: 600,
        color: scene.accent, letterSpacing: '0.18em', textTransform: 'uppercase' as const,
        userSelect: 'none',
      }}>{scene.label}</div>

      {children}
    </div>
  )
}

// ── INTRO ─────────────────────────────────────────────────────────────────

function IntroScene() {
  const { localTime } = useSprite()
  const f = useFade(1.2, 0.9)
  const titleY = makeAnimate({ from: 40, to: 0, start: 0, end: 1.4, ease: Easing.easeOutCubic })(localTime)
  const subOp = clamp((localTime - 1.0) / 0.9, 0, 1)
  const tagOp = clamp((localTime - 2.2) / 0.9, 0, 1)

  const fruits: FruitDef[] = [
    { e: '🍌', bx: 100, by: 180, ph: 0.0 }, { e: '🍇', bx: 1170, by: 160, ph: 1.1 },
    { e: '🥦', bx: 75,  by: 490, ph: 2.3 }, { e: '🍋', bx: 1160, by: 470, ph: 0.7 },
    { e: '🍅', bx: 240, by: 610, ph: 1.8 }, { e: '🥕', bx: 1020, by: 590, ph: 3.1 },
    { e: '🍊', bx: 630, by: 80,  ph: 2.0 }, { e: '🫐', bx: 630,  by: 640, ph: 0.4 },
    { e: '🥑', bx: 380, by: 140, ph: 1.5 }, { e: '🍓', bx: 880,  by: 140, ph: 2.7 },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: f }}>
      <Particles baseOpacity={0.1} />
      {fruits.map((fr, i) => (
        <DancingFruit key={i} emoji={fr.e} baseX={fr.bx} baseY={fr.by} phase={fr.ph} size={50} />
      ))}

      <div style={{
        position: 'absolute', top: 220 + titleY, left: 0, right: 0, textAlign: 'center',
        fontFamily: HV, fontWeight: 900, fontSize: 110, color: CREAM,
        letterSpacing: '-0.05em', lineHeight: 0.92,
      }}>
        food<br />
        <span style={{ color: 'oklch(72% 0.22 355)', fontStyle: 'italic' }}>mood</span>
      </div>

      <div style={{
        position: 'absolute', top: 472, left: 0, right: 0, textAlign: 'center',
        fontFamily: HV, fontWeight: 400, fontSize: 19, color: CREAM_DIM,
        letterSpacing: '0.24em', textTransform: 'uppercase' as const, opacity: subOp,
      }}>Retos de alimentación que transforman</div>

      <div style={{
        position: 'absolute', top: 528, left: 0, right: 0, textAlign: 'center',
        fontFamily: HV, fontSize: 14, color: CREAM_FAINT,
        letterSpacing: '0.12em', textTransform: 'uppercase' as const, opacity: tagOp,
      }}>5 programas · desde 19€</div>
    </div>
  )
}

// ── SUEÑO ─────────────────────────────────────────────────────────────────

function SuenoScene() {
  const s = SCENES[0]
  const { localTime } = useSprite()
  const t1 = clamp((localTime - 1.2) / 0.8, 0, 1)
  const t2 = clamp((localTime - 2.8) / 0.8, 0, 1)
  const t3 = clamp((localTime - 4.5) / 0.8, 0, 1)
  const t4 = clamp((localTime - 6.2) / 0.8, 0, 1)
  return (
    <ProductScene scene={s}
      fruits={[{ e:'🍌',bx:44,by:320,ph:0.3,sz:46 },{ e:'🫐',bx:48,by:500,ph:1.8,sz:44 },{ e:'🥛',bx:42,by:160,ph:3.1,sz:42 }]}
      orbFruits={[{ e:'🍌',ph:0,spd:0.09 },{ e:'🫐',ph:2.1,spd:0.09 },{ e:'🥛',ph:4.2,spd:0.09 },{ e:'✨',ph:1.0,spd:0.14,sz:28 }]}
    >
      <div style={{ position:'absolute', left:80, top:110, opacity:Easing.easeOutCubic(t1) }}>
        <div style={{ fontFamily:HV, fontSize:18, fontWeight:600, color:s.accent, letterSpacing:'0.04em', marginBottom:10 }}>😴 4 semanas</div>
        <div style={{ fontFamily:HV, fontSize:60, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1.02, maxWidth:520 }}>
          Mejora tu sueño<br />en 4 semanas
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:318, opacity:Easing.easeOutCubic(t2), maxWidth:480 }}>
        <div style={{ fontFamily:HV, fontSize:18, color:CREAM_DIM, lineHeight:1.65 }}>
          Serotonina → melatonina.<br />Magnesio, triptófano, fermentados nocturnos.
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:430, opacity:Easing.easeOutCubic(t3), display:'flex', gap:10, flexWrap:'wrap' as const }}>
        <MetaPill icon="📘" label="28 recetas" color={s.accent} />
        <MetaPill icon="🎧" label="4 audios" color={s.accent} />
        <MetaPill icon="📊" label="Tracking diario" color={s.accent} />
      </div>
      <div style={{ position:'absolute', left:80, top:510, opacity:Easing.easeOutCubic(t4), display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ fontFamily:HV, fontSize:62, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1 }}>
          29<span style={{ fontSize:24, fontWeight:400, color:CREAM_DIM, marginLeft:3 }}>€</span>
        </div>
        <Link href={s.slug} style={{ fontFamily:HV, fontSize:15, fontWeight:700, color:'#1a0010', background:s.accent, padding:'12px 28px', borderRadius:40, letterSpacing:'0.04em', textTransform:'uppercase' as const, display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          Empezar <span style={{ fontSize:18 }}>→</span>
        </Link>
      </div>
    </ProductScene>
  )
}

// ── ENERGÍA ───────────────────────────────────────────────────────────────

function EnergiaScene() {
  const s = SCENES[1]
  const { localTime } = useSprite()
  const t1 = clamp((localTime - 1.2) / 0.8, 0, 1)
  const t2 = clamp((localTime - 2.8) / 0.8, 0, 1)
  const t3 = clamp((localTime - 4.5) / 0.8, 0, 1)
  const t4 = clamp((localTime - 6.2) / 0.8, 0, 1)
  return (
    <ProductScene scene={s}
      fruits={[{ e:'🍊',bx:44,by:290,ph:0.5,sz:48 },{ e:'🍋',bx:48,by:490,ph:2.0,sz:44 },{ e:'⚡',bx:42,by:160,ph:1.2,sz:38 }]}
      orbFruits={[{ e:'🍊',ph:0,spd:0.13 },{ e:'🍋',ph:2.09,spd:0.13 },{ e:'⚡',ph:4.19,spd:0.13 },{ e:'🫚',ph:1.0,spd:0.09,sz:34 }]}
    >
      <div style={{ position:'absolute', left:80, top:110, opacity:Easing.easeOutCubic(t1) }}>
        <div style={{ fontFamily:HV, fontSize:18, fontWeight:600, color:s.accent, letterSpacing:'0.04em', marginBottom:10 }}>⚡ 1 semana</div>
        <div style={{ fontFamily:HV, fontSize:60, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1.02, maxWidth:520 }}>
          Recupera tu<br />energía en 7 días
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:348, opacity:Easing.easeOutCubic(t2), maxWidth:480 }}>
        <div style={{ fontFamily:HV, fontSize:18, color:CREAM_DIM, lineHeight:1.65 }}>
          Reset mitocondrial.<br />Resultados medibles en una semana.
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:430, opacity:Easing.easeOutCubic(t3), display:'flex', gap:10, flexWrap:'wrap' as const }}>
        <MetaPill icon="📘" label="7 recetas" color={s.accent} />
        <MetaPill icon="🎧" label="3 audios" color={s.accent} />
        <MetaPill icon="📊" label="Tracking diario" color={s.accent} />
      </div>
      <div style={{ position:'absolute', left:80, top:510, opacity:Easing.easeOutCubic(t4), display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ fontFamily:HV, fontSize:62, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1 }}>
          19<span style={{ fontSize:24, fontWeight:400, color:CREAM_DIM, marginLeft:3 }}>€</span>
        </div>
        <Link href={s.slug} style={{ fontFamily:HV, fontSize:15, fontWeight:700, color:'#1a0010', background:s.accent, padding:'12px 28px', borderRadius:40, letterSpacing:'0.04em', textTransform:'uppercase' as const, display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          Empezar <span style={{ fontSize:18 }}>→</span>
        </Link>
      </div>
    </ProductScene>
  )
}

// ── HORMONAL ──────────────────────────────────────────────────────────────

function HormonalScene() {
  const s = SCENES[2]
  const { localTime } = useSprite()
  const t1 = clamp((localTime - 1.2) / 0.8, 0, 1)
  const t2 = clamp((localTime - 2.8) / 0.8, 0, 1)
  const t3 = clamp((localTime - 4.5) / 0.8, 0, 1)
  const t4 = clamp((localTime - 6.2) / 0.8, 0, 1)
  return (
    <ProductScene scene={s}
      fruits={[{ e:'🥑',bx:44,by:310,ph:0.6,sz:46 },{ e:'🍓',bx:48,by:490,ph:1.9,sz:44 },{ e:'🌸',bx:42,by:165,ph:2.8,sz:42 }]}
      orbFruits={[{ e:'🥑',ph:0,spd:0.10 },{ e:'🍓',ph:2.09,spd:0.10 },{ e:'🌸',ph:4.19,spd:0.10 },{ e:'🫐',ph:1.05,spd:0.07,sz:32 }]}
    >
      <div style={{ position:'absolute', left:80, top:110, opacity:Easing.easeOutCubic(t1) }}>
        <div style={{ fontFamily:HV, fontSize:18, fontWeight:600, color:s.accent, letterSpacing:'0.04em', marginBottom:10 }}>🌸 4 semanas · hormonal</div>
        <div style={{ fontFamily:HV, fontSize:54, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1.04, maxWidth:540 }}>
          Equilibrio hormonal<br />después de los 45
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:320, opacity:Easing.easeOutCubic(t2), maxWidth:490 }}>
        <div style={{ fontFamily:HV, fontSize:18, color:CREAM_DIM, lineHeight:1.65 }}>
          Protocolo de 28 días para la perimenopausia.<br />Basado en bioquímica hormonal real.
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:430, opacity:Easing.easeOutCubic(t3), display:'flex', gap:10, flexWrap:'wrap' as const }}>
        <MetaPill icon="📘" label="28 recetas" color={s.accent} />
        <MetaPill icon="🎧" label="4 audios" color={s.accent} />
        <MetaPill icon="📊" label="Tracking diario" color={s.accent} />
      </div>
      <div style={{ position:'absolute', left:80, top:510, opacity:Easing.easeOutCubic(t4), display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ fontFamily:HV, fontSize:62, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1 }}>
          39<span style={{ fontSize:24, fontWeight:400, color:CREAM_DIM, marginLeft:3 }}>€</span>
        </div>
        <Link href={s.slug} style={{ fontFamily:HV, fontSize:15, fontWeight:700, color:'#1a0010', background:s.accent, padding:'12px 28px', borderRadius:40, letterSpacing:'0.04em', textTransform:'uppercase' as const, display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          Empezar <span style={{ fontSize:18 }}>→</span>
        </Link>
      </div>
    </ProductScene>
  )
}

// ── INFLAMACIÓN ───────────────────────────────────────────────────────────

function InflamacionScene() {
  const s = SCENES[3]
  const { localTime } = useSprite()
  const t1 = clamp((localTime - 1.2) / 0.8, 0, 1)
  const t2 = clamp((localTime - 2.8) / 0.8, 0, 1)
  const t3 = clamp((localTime - 4.5) / 0.8, 0, 1)
  const t4 = clamp((localTime - 6.2) / 0.8, 0, 1)
  return (
    <ProductScene scene={s}
      fruits={[{ e:'🥦',bx:44,by:300,ph:0.2,sz:48 },{ e:'🧄',bx:48,by:490,ph:2.2,sz:42 },{ e:'🫚',bx:42,by:158,ph:1.5,sz:40 }]}
      orbFruits={[{ e:'🥦',ph:0,spd:0.11 },{ e:'🧄',ph:2.09,spd:0.11 },{ e:'🫚',ph:4.19,spd:0.11 },{ e:'🌿',ph:1.05,spd:0.08,sz:30 }]}
    >
      <div style={{ position:'absolute', left:80, top:110, opacity:Easing.easeOutCubic(t1) }}>
        <div style={{ fontFamily:HV, fontSize:18, fontWeight:600, color:s.accent, letterSpacing:'0.04em', marginBottom:10 }}>🌿 1 semana · inflamación</div>
        <div style={{ fontFamily:HV, fontSize:60, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1.02, maxWidth:520 }}>
          Reset<br />antiinflamatorio
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:316, opacity:Easing.easeOutCubic(t2), maxWidth:480 }}>
        <div style={{ fontFamily:HV, fontSize:18, color:CREAM_DIM, lineHeight:1.65 }}>
          Cúrcuma, omega-3, fermentados.<br />Reset completo en una semana.
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:430, opacity:Easing.easeOutCubic(t3), display:'flex', gap:10, flexWrap:'wrap' as const }}>
        <MetaPill icon="📘" label="7 recetas" color={s.accent} />
        <MetaPill icon="🎧" label="7 audios" color={s.accent} />
        <MetaPill icon="📊" label="Tracking diario" color={s.accent} />
      </div>
      <div style={{ position:'absolute', left:80, top:510, opacity:Easing.easeOutCubic(t4), display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ fontFamily:HV, fontSize:62, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1 }}>
          19<span style={{ fontSize:24, fontWeight:400, color:CREAM_DIM, marginLeft:3 }}>€</span>
        </div>
        <Link href={s.slug} style={{ fontFamily:HV, fontSize:15, fontWeight:700, color:'#1a0010', background:s.accent, padding:'12px 28px', borderRadius:40, letterSpacing:'0.04em', textTransform:'uppercase' as const, display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          Empezar <span style={{ fontSize:18 }}>→</span>
        </Link>
      </div>
    </ProductScene>
  )
}

// ── SALUD MENTAL ──────────────────────────────────────────────────────────

function MentalScene() {
  const s = SCENES[4]
  const { localTime } = useSprite()
  const t1 = clamp((localTime - 1.2) / 0.8, 0, 1)
  const t2 = clamp((localTime - 2.8) / 0.8, 0, 1)
  const t3 = clamp((localTime - 4.5) / 0.8, 0, 1)
  const t4 = clamp((localTime - 6.2) / 0.8, 0, 1)
  return (
    <ProductScene scene={s}
      fruits={[{ e:'🫐',bx:44,by:300,ph:0.4,sz:48 },{ e:'🥜',bx:48,by:490,ph:2.1,sz:42 },{ e:'🍵',bx:42,by:160,ph:3.0,sz:40 }]}
      orbFruits={[{ e:'🫐',ph:0,spd:0.10 },{ e:'🥜',ph:2.09,spd:0.10 },{ e:'🍵',ph:4.19,spd:0.10 },{ e:'✨',ph:1.05,spd:0.16,sz:26 }]}
    >
      <div style={{ position:'absolute', left:80, top:110, opacity:Easing.easeOutCubic(t1) }}>
        <div style={{ fontFamily:HV, fontSize:18, fontWeight:600, color:s.accent, letterSpacing:'0.04em', marginBottom:10 }}>🧠 21 días · salud mental</div>
        <div style={{ fontFamily:HV, fontSize:54, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1.04, maxWidth:530 }}>
          21 días para resetear<br />tu mente a través<br />de la alimentación
        </div>
      </div>
      <div style={{ position:'absolute', left:80, top:380, opacity:Easing.easeOutCubic(t2), maxWidth:460 }}>
        <div style={{ fontFamily:HV, fontSize:20, fontWeight:700, color:CREAM, letterSpacing:'-0.01em' }}>Food·Mood Reset</div>
      </div>
      <div style={{ position:'absolute', left:80, top:428, opacity:Easing.easeOutCubic(t3), display:'flex', gap:10, flexWrap:'wrap' as const }}>
        <MetaPill icon="📘" label="21 recetas" color={s.accent} />
        <MetaPill icon="🎧" label="21 audios" color={s.accent} />
        <MetaPill icon="📊" label="Tracking diario" color={s.accent} />
      </div>
      <div style={{ position:'absolute', left:80, top:506, opacity:Easing.easeOutCubic(t4), display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ fontFamily:HV, fontSize:62, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1 }}>
          29<span style={{ fontSize:24, fontWeight:400, color:CREAM_DIM, marginLeft:3 }}>€</span>
        </div>
        <Link href={s.slug} style={{ fontFamily:HV, fontSize:15, fontWeight:700, color:'#1a0010', background:s.accent, padding:'12px 28px', borderRadius:40, letterSpacing:'0.04em', textTransform:'uppercase' as const, display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          Empezar <span style={{ fontSize:18 }}>→</span>
        </Link>
      </div>
    </ProductScene>
  )
}

// ── OUTRO ─────────────────────────────────────────────────────────────────

function OutroScene() {
  const { localTime } = useSprite()
  const f = useFade(1.0, 0.5)
  const t1 = clamp((localTime - 0.8) / 1.0, 0, 1)
  const t2 = clamp((localTime - 2.8) / 0.8, 0, 1)

  const allFruits: FruitDef[] = [
    { e:'🍌',bx:90,  by:170,ph:0.0 },{ e:'🍊',bx:1165,by:155,ph:1.1 },
    { e:'🥦',bx:72,  by:480,ph:2.3 },{ e:'🫐',bx:1155,by:460,ph:0.7 },
    { e:'🍅',bx:230, by:605,ph:1.8 },{ e:'🥕', bx:1010,by:590,ph:3.1 },
    { e:'🥑',bx:360, by:130,ph:1.5 },{ e:'🍓',bx:890, by:130,ph:2.7 },
    { e:'🧄',bx:200, by:340,ph:0.9 },{ e:'🍋',bx:1080,by:330,ph:2.0 },
  ]

  return (
    <div style={{ position:'absolute', inset:0, opacity:f }}>
      <Particles baseOpacity={0.12} />
      {allFruits.map((fr, i) => (
        <DancingFruit key={i} emoji={fr.e} baseX={fr.bx} baseY={fr.by} phase={fr.ph} size={46} />
      ))}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
        <div style={{ fontFamily:HV, fontSize:14, fontWeight:500, color:CREAM_FAINT, letterSpacing:'0.22em', textTransform:'uppercase' as const, marginBottom:24, opacity:Easing.easeOutCubic(t1) }}>
          Por qué funcionan
        </div>
        <div style={{ fontFamily:HV, fontSize:52, fontWeight:900, color:CREAM, letterSpacing:'-0.04em', lineHeight:1.05, maxWidth:680, opacity:Easing.easeOutCubic(t1) }}>
          Los retos son el único<br />formato donde la intención<br />
          <span style={{ color:'oklch(72% 0.22 355)', fontStyle:'italic' }}>se convierte en acción.</span>
        </div>
        <div style={{ fontFamily:HV, fontSize:18, color:CREAM_DIM, marginTop:28, maxWidth:520, lineHeight:1.65, opacity:Easing.easeOutCubic(t2) }}>
          Porque tienen principio, medio y fin.
        </div>
        <div style={{ fontFamily:HV, fontSize:28, fontWeight:700, color:CREAM, marginTop:36, letterSpacing:'-0.02em', opacity:Easing.easeOutCubic(t2) }}>
          food·mood
        </div>
      </div>
    </div>
  )
}

// ── BgLayer ───────────────────────────────────────────────────────────────

function BgLayer() {
  const time = useTime()
  const bgs: [number, number, string][] = [
    [0,  9,  '#2a060f'],
    [9,  20, SCENES[0].bg],
    [20, 31, SCENES[1].bg],
    [31, 42, SCENES[2].bg],
    [42, 53, SCENES[3].bg],
    [53, 65, SCENES[4].bg],
    [65, TOTAL, '#1a040b'],
  ]
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {bgs.map(([s, e, c], i) => {
        const localT = time - s
        const dur = e - s
        const fadeIn  = Easing.easeInOutCubic(clamp(localT / 1.5, 0, 1))
        const fadeOut = 1 - Easing.easeInOutCubic(clamp((localT - (dur - 1.5)) / 1.5, 0, 1))
        return <div key={i} style={{ position:'absolute', inset:0, background:c, opacity:fadeIn * fadeOut }} />
      })}
    </div>
  )
}

// ── Scene label ───────────────────────────────────────────────────────────

function SceneLabel() {
  const time = useTime()
  const labels: [number, number, string][] = [
    [0,  9,  ''],
    [9,  20, '01 — SUEÑO'],
    [20, 31, '02 — ENERGÍA'],
    [31, 42, '03 — HORMONAL'],
    [42, 53, '04 — INFLAMACIÓN'],
    [53, 65, '05 — SALUD MENTAL'],
    [65, TOTAL, 'FOOD·MOOD'],
  ]
  const cur = labels.find(([s, e]) => time >= s && time < e)
  return (
    <div style={{
      position: 'absolute', bottom: 20, right: 28, zIndex: 99,
      fontFamily: HV, fontSize: 11, fontWeight: 500,
      color: CREAM_FAINT, letterSpacing: '0.16em', textTransform: 'uppercase' as const,
      userSelect: 'none', pointerEvents: 'none',
    }}>{cur ? cur[2] : ''}</div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────

export default function RetosHeroAnimation() {
  const [time, setTime] = useState(0)
  const startRef   = useRef<number | null>(null)
  const rafRef     = useRef<number>(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale,      setScale]      = useState(1)
  const [portrait,   setPortrait]   = useState(false)
  const [wrapHeight, setWrapHeight] = useState<string>('100svh')

  useEffect(() => {
    function tick(now: number) {
      if (!startRef.current) startRef.current = now
      setTime(((now - startRef.current) / 1000) % TOTAL)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (!wrapperRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      // Portrait = mobile (height > width): use contain so text stays visible
      const isPortrait = height > width * 1.1
      setPortrait(isPortrait)
      if (isPortrait) {
        // Fit full canvas width — height auto (aspect ratio)
        setScale(width / W)
        setWrapHeight(`${Math.round((width * H) / W)}px`)
      } else {
        // Desktop/landscape: cover fill
        setScale(Math.max(width / W, height / H))
        setWrapHeight('100svh')
      }
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: wrapHeight, position: 'relative', overflow: 'hidden', background: '#2a060f' }}>
      <TimeCtx.Provider value={time}>
        <div style={{
          position: 'absolute',
          top: portrait ? '0' : '50%',
          left: portrait ? '0' : '50%',
          width: W, height: H,
          transformOrigin: portrait ? 'top left' : 'center center',
          transform: portrait ? `scale(${scale})` : `translate(-50%, -50%) scale(${scale})`,
          background: '#2a060f',
          overflow: 'hidden',
        }}>
          <BgLayer />
          <Sprite start={0}  end={9}>  <IntroScene /></Sprite>
          <Sprite start={9}  end={20}> <SuenoScene /></Sprite>
          <Sprite start={20} end={31}> <EnergiaScene /></Sprite>
          <Sprite start={31} end={42}> <HormonalScene /></Sprite>
          <Sprite start={42} end={53}> <InflamacionScene /></Sprite>
          <Sprite start={53} end={65}> <MentalScene /></Sprite>
          <Sprite start={65} end={TOTAL}><OutroScene /></Sprite>
          <SceneLabel />
        </div>
      </TimeCtx.Provider>
    </div>
  )
}
