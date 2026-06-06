"use client"

import { useState, useEffect, useRef } from 'react'

// Scoped CSS keyframes (sfm- prefix avoids collisions with existing globals)
const KEYFRAMES = `
  @keyframes sfm-float-up {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    5%   { opacity: var(--sfm-bub-op); }
    90%  { opacity: var(--sfm-bub-op); }
    100% { transform: translateY(-105vh) translateX(var(--sfm-drift)) scale(0.6); opacity: 0; }
  }
  @keyframes sfm-particle-drift {
    0%   { transform: translate(0, 0) rotate(0deg); opacity: 0; }
    20%  { opacity: var(--sfm-p-op); }
    80%  { opacity: var(--sfm-p-op); }
    100% { transform: translate(var(--sfm-px), var(--sfm-py)) rotate(var(--sfm-pr)); opacity: 0; }
  }
  @keyframes sfm-breathe {
    0%, 100% { opacity: 1; letter-spacing: 0.04em; }
    50%       { opacity: 0.82; letter-spacing: 0.07em; }
  }
  @keyframes sfm-breathe-title {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.008); opacity: 0.9; }
  }
  @keyframes sfm-jitter {
    0%  { transform: translate(0,0); }
    10% { transform: translate(-1px, 1px); }
    20% { transform: translate(1px, -1px); }
    30% { transform: translate(-1px, 0); }
    40% { transform: translate(2px, 1px); }
    50% { transform: translate(-1px, -1px); }
    60% { transform: translate(1px, 2px); }
    70% { transform: translate(-2px, 1px); }
    80% { transform: translate(1px, -2px); }
    90% { transform: translate(-1px, 1px); }
    100%{ transform: translate(0, 0); }
  }
  @keyframes sfm-glow {
    0%, 100% { text-shadow: none; }
    50%       { text-shadow: 0 0 28px rgba(255,107,53,0.25); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·!?.,;'

function useScramble(target: string, running: boolean) {
  const [display, setDisplay] = useState('')
  const iter = useRef(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!running) { setDisplay(target); return }
    iter.current = 0; frame.current = 0
    const id = setInterval(() => {
      frame.current++
      if (frame.current % 2 !== 0) return
      iter.current = Math.min(iter.current + 1, target.length)
      setDisplay(
        target.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < iter.current) return ch
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join('')
      )
      if (iter.current >= target.length) clearInterval(id)
    }, 28)
    return () => clearInterval(id)
  }, [target, running])

  return display
}

function useTypewriter(target: string, running: boolean) {
  const [display, setDisplay] = useState('')
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!running) { setDisplay(''); return }
    setDisplay('')
    let i = 0
    const tick = () => {
      if (i <= target.length) {
        setDisplay(target.slice(0, i++))
        t.current = setTimeout(tick, 110 + Math.random() * 60)
      }
    }
    tick()
    return () => { if (t.current) clearTimeout(t.current) }
  }, [target, running])

  return display
}

const BUBBLES = [
  { x: 8,  size: 8,  delay: 0,   dur: 12, drift: '6px',  op: 0.55 },
  { x: 18, size: 5,  delay: 2.4, dur: 16, drift: '-4px', op: 0.4  },
  { x: 30, size: 11, delay: 1,   dur: 20, drift: '10px', op: 0.45 },
  { x: 48, size: 6,  delay: 3.8, dur: 14, drift: '-8px', op: 0.5  },
  { x: 62, size: 9,  delay: 0.7, dur: 18, drift: '5px',  op: 0.4  },
  { x: 75, size: 4,  delay: 2,   dur: 22, drift: '-6px', op: 0.35 },
  { x: 84, size: 7,  delay: 4.5, dur: 15, drift: '8px',  op: 0.5  },
  { x: 92, size: 5,  delay: 1.5, dur: 19, drift: '-5px', op: 0.4  },
]

const PARTICLES = [
  { x: 15, y: 20, px: '20px',  py: '-30px', pr: '45deg',  sz: 3, delay: 0, dur: 9,  op: 0.08 },
  { x: 72, y: 35, px: '-15px', py: '25px',  pr: '-30deg', sz: 2, delay: 2, dur: 12, op: 0.06 },
  { x: 40, y: 70, px: '25px',  py: '-20px', pr: '60deg',  sz: 4, delay: 4, dur: 10, op: 0.07 },
  { x: 88, y: 55, px: '-20px', py: '-35px', pr: '-45deg', sz: 2, delay: 1, dur: 14, op: 0.06 },
  { x: 25, y: 80, px: '10px',  py: '-40px', pr: '20deg',  sz: 3, delay: 3, dur: 11, op: 0.09 },
  { x: 60, y: 15, px: '-25px', py: '30px',  pr: '-60deg', sz: 2, delay: 5, dur: 13, op: 0.05 },
]

export default function SlowFoodMoodHero() {
  // 0=scrambling fast, 1=pause, 2=typing slow, 3=breathing
  const [phase,          setPhase]          = useState(0)
  const [lineW,          setLineW]          = useState(0)
  const [slowVisible,    setSlowVisible]    = useState(false)
  const [taglineVisible, setTaglineVisible] = useState(false)
  const [breathe,        setBreathe]        = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const fastText = useScramble('Fast life.', phase === 0)
  const slowText = useTypewriter('Slow Food·Mood.', phase >= 2)

  useEffect(() => {
    function sched(fn: () => void, ms: number) {
      const id = setTimeout(fn, ms); timers.current.push(id)
    }
    function cycle() {
      timers.current.forEach(clearTimeout); timers.current = []
      setPhase(0); setLineW(0); setSlowVisible(false); setTaglineVisible(false); setBreathe(false)
      sched(() => setPhase(1), 1400)
      sched(() => { setPhase(2); setSlowVisible(true) }, 2200)
      sched(() => setLineW(100), 2400)
      sched(() => setTaglineVisible(true), 5200)
      sched(() => setBreathe(true), 5800)
      sched(cycle, 14000)
    }
    sched(cycle, 400)
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <section
        aria-label="Hero Slow Food·Mood"
        style={{
          position: 'relative',
          width: '100%',
          height: '100svh',
          minHeight: '560px',
          background: '#F5F0E8',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${p.y}%`, left: `${p.x}%`,
            width: p.sz, height: p.sz,
            borderRadius: '50%',
            background: '#6B2737',
            '--sfm-p-op':  p.op,
            '--sfm-px':    p.px,
            '--sfm-py':    p.py,
            '--sfm-pr':    p.pr,
            animation: `sfm-particle-drift ${p.dur}s ${p.delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          } as React.CSSProperties} />
        ))}

        {/* Bubbles */}
        {BUBBLES.map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: '-10%', left: `${b.x}%`,
            width: b.size, height: b.size,
            borderRadius: '50%',
            border: '1.5px solid #FF6B35',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,107,53,0.18), rgba(255,107,53,0.04))',
            '--sfm-bub-op': b.op,
            '--sfm-drift':  b.drift,
            animation: `sfm-float-up ${b.dur}s ${b.delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          } as React.CSSProperties} />
        ))}

        {/* Radial vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(107,39,55,0.06) 100%)',
        }} />

        {/* Text content */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          padding: 'clamp(1.5rem, 6vw, 4rem)',
          paddingTop: 'calc(clamp(1.5rem, 6vw, 4rem) + 80px)',
          maxWidth: '720px', width: '100%',
        }}>
          {/* "Fast life." — scramble + jitter */}
          <div
            aria-label="Fast life."
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(2.4rem, 7vw, 6rem)',
              color: '#6B2737',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              animation: phase === 0
                ? 'sfm-jitter 0.08s linear infinite'
                : breathe ? 'sfm-breathe-title 6s ease-in-out infinite' : 'none',
              willChange: 'transform',
              userSelect: 'none',
            }}
          >
            {fastText || '\u00A0'}
          </div>

          {/* "Slow Food·Mood." — typewriter */}
          <div
            aria-label="Slow Food·Mood."
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              fontSize: 'clamp(2.4rem, 7vw, 6rem)',
              color: '#1a1614',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              marginTop: '0.1em',
              opacity: slowVisible ? 1 : 0,
              transition: 'opacity 1.2s ease',
              animation: breathe ? 'sfm-breathe 8s ease-in-out infinite, sfm-glow 8s ease-in-out infinite' : 'none',
              willChange: 'opacity',
              userSelect: 'none',
            }}
          >
            {slowText || '\u00A0'}
          </div>

          {/* Gold line */}
          <div style={{
            width: '100%', maxWidth: '520px',
            height: '1px',
            background: 'rgba(255,107,53,0.22)',
            marginTop: '2.4rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              height: '100%', width: `${lineW}%`,
              background: 'linear-gradient(90deg, rgba(255,107,53,0.5), #FF6B35)',
              transition: `width ${lineW > 0 ? '3.2s' : '0s'} cubic-bezier(0.25,0.46,0.45,0.94)`,
            }} />
            <div style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              width: 5, height: 5, borderRadius: '50%', background: '#FF6B35',
              opacity: lineW >= 98 ? 1 : 0, transition: 'opacity 0.8s ease 0.2s',
            }} />
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.65rem, 1.6vw, 0.95rem)',
            color: '#6B2737',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            opacity: taglineVisible ? 0.65 : 0,
            transition: 'opacity 2s ease',
            marginTop: '2rem',
            animation: breathe ? 'sfm-breathe 10s 2s ease-in-out infinite' : 'none',
          }}>
            Un acto de resistencia lenta
          </div>
        </div>

        {/* Badge bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(1rem, 3vh, 2rem)',
          right: 'clamp(1rem, 3vw, 2.5rem)',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(0.55rem, 1.2vw, 0.75rem)',
          letterSpacing: '0.18em',
          color: '#6B2737',
          opacity: 0.35,
          textTransform: 'uppercase',
          zIndex: 3,
          userSelect: 'none',
        }}>
          Food·Mood
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(1rem, 3vh, 2rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          opacity: taglineVisible ? 0.35 : 0,
          transition: 'opacity 1.5s ease 0.5s',
          pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#6B2737', textTransform: 'uppercase' }}>
            scroll
          </span>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(107,39,55,0.5), transparent)' }} />
        </div>
      </section>
    </>
  )
}
