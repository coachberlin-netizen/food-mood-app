"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import type { CSSProperties, ReactNode } from "react"

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHALLENGES = [
  { cat: "Energía",      duration: "7 días",    title: "Recupera tu energía",      titleEm: "energía",      price: "19", blurb: "Reactiva tu metabolismo con datos reales. Sin déficits, sin fatiga.",           bg: "#F1E7D4", ink: "#231F17", inkSoft: "#231F1799", accent: "#B85A1F", numeral: "01" },
  { cat: "Inflamación",  duration: "7 días",    title: "Reset antiinflamatorio",    titleEm: "antiinflamatorio", price: "19", blurb: "Calma silenciosa. Recupera ligereza desde el primer plato.",           bg: "#E4EADE", ink: "#1B2218", inkSoft: "#1B221899", accent: "#3F5A37", numeral: "02" },
  { cat: "Longevidad",   duration: "10 días",   title: "Activa tu longevidad",      titleEm: "longevidad",   price: "19", blurb: "Hábitos respaldados por evidencia para sumar años con vida.",               bg: "#E9D9C7", ink: "#241814", inkSoft: "#24181499", accent: "#7A3A20", numeral: "03" },
  { cat: "Hábitos",      duration: "21 días",   title: "Microhábitos",              titleEm: "Microhábitos", price: "29", blurb: "Pequeños gestos diarios. Cambios que sí se sostienen.",                     bg: "#DBE0E6", ink: "#15171C", inkSoft: "#15171C99", accent: "#243A5C", numeral: "04" },
  { cat: "Ansiedad",     duration: "21 días",   title: "Slow Food·Mood",            titleEm: "Slow",         price: "29", blurb: "Comer despacio, pensar despacio. Volver a tu eje.",                         bg: "#E5DDE7", ink: "#1F1A23", inkSoft: "#1F1A2399", accent: "#5A4570", numeral: "05" },
  { cat: "Salud mental", duration: "21 días",   title: "Food·Mood Reset",           titleEm: "Reset",        price: "29", blurb: "Reescribe tu relación con la comida. 21 días, una nueva base.",             bg: "#F0DDCB", ink: "#231510", inkSoft: "#23151099", accent: "#B14F31", numeral: "06" },
  { cat: "Hormonas",     duration: "28 días",   title: "Equilibrio hormonal 45+",   titleEm: "hormonal",     price: "29", blurb: "Diseñado para tu nueva etapa. Energía, sueño y claridad.",                 bg: "#E8D4DC", ink: "#241319", inkSoft: "#24131999", accent: "#8C3F5C", numeral: "07" },
  { cat: "Sueño",        duration: "4 semanas", title: "Mejora tu sueño",           titleEm: "sueño",        price: "29", blurb: "Una rutina nocturna apoyada en cronobiología y nutrición.",                bg: "#1F2540", ink: "#F2EAD3", inkSoft: "#F2EAD3AA", accent: "#D6B26C", numeral: "08" },
]

// ─── Timeline ─────────────────────────────────────────────────────────────────
const T = { intro1: 4.5, intro2: 5.5, intro3: 5.5, feature: 6.0, outro: 6.0 }

type IntroSeg   = { kind: "intro";   which: 1|2|3; dur: number; start: number; end: number }
type FeatureSeg = { kind: "feature"; index: number; dur: number; start: number; end: number }
type OutroSeg   = { kind: "outro";   dur: number;  start: number; end: number }
type Seg = IntroSeg | FeatureSeg | OutroSeg

const RAW: Seg[] = [
  { kind: "intro", which: 1, dur: T.intro1, start: 0, end: 0 },
  { kind: "intro", which: 2, dur: T.intro2, start: 0, end: 0 },
  { kind: "intro", which: 3, dur: T.intro3, start: 0, end: 0 },
  ...CHALLENGES.map((_, i) => ({ kind: "feature" as const, index: i, dur: T.feature, start: 0, end: 0 })),
  { kind: "outro", dur: T.outro, start: 0, end: 0 },
]
let _acc = 0
RAW.forEach(s => { s.start = _acc; _acc += s.dur; s.end = _acc })
const TOTAL = _acc

function currentSegment(t: number): Seg & { local: number } {
  for (const s of RAW) {
    if (t >= s.start && t < s.end) return { ...s, local: t - s.start }
  }
  const last = RAW[RAW.length - 1]
  return { ...last, local: last.dur }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useLoopTime(total: number) {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = () => {
      setT(((performance.now() - start) / 1000) % total)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [total])
  return t
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function RevealLine({ children, state, delay = 0, dur = 900 }: { children: ReactNode; state: string; delay?: number; dur?: number }) {
  return (
    <span className={"ra-rl " + state} style={{ "--rdelay": delay + "ms", "--rd": dur + "ms" } as CSSProperties}>
      <span className="ra-rl-inner">{children}</span>
    </span>
  )
}

function Fade({ children, state, delay = 0 }: { children: ReactNode; state: string; delay?: number }) {
  return (
    <span className={"ra-fade " + state} style={{ "--rdelay": delay + "ms" } as CSSProperties}>
      {children}
    </span>
  )
}

// ─── Intro scenes ─────────────────────────────────────────────────────────────
function Intro1({ local, dur }: { local: number; dur: number }) {
  const s = local > 0.05 ? (local > dur - 0.5 ? "out" : "in") : ""
  const f = local > 0.4  ? (local > dur - 0.5 ? "out" : "in") : ""
  return (
    <div className="ra-scene ra-intro">
      <span className="ra-eyebrow">
        <Fade state={f}><span className="ra-rule" /></Fade>
        <Fade state={f} delay={120}>food·mood · transformación</Fade>
        <Fade state={f} delay={240}><span className="ra-rule" /></Fade>
      </span>
      <h1 className="ra-display">
        <RevealLine state={s} delay={120}>Retos de</RevealLine>{" "}
        <RevealLine state={s} delay={320}><em>transformación</em></RevealLine>
      </h1>
      <p className="ra-sub">
        <Fade state={f} delay={900}>8 caminos guiados. Datos reales. Un punto de partida claro.</Fade>
      </p>
    </div>
  )
}

function Intro2({ local, dur }: { local: number; dur: number }) {
  const s = local > 0.05 ? (local > dur - 0.5 ? "out" : "in") : ""
  return (
    <div className="ra-scene ra-intro">
      <span className="ra-eyebrow">
        <Fade state={s}><span className="ra-rule" /></Fade>
        <Fade state={s} delay={120}>la idea</Fade>
        <Fade state={s} delay={240}><span className="ra-rule" /></Fade>
      </span>
      <h2 className="ra-display" style={{ fontSize: "6.8cqw" }}>
        <RevealLine state={s} delay={80}>No necesitas otro</RevealLine>{" "}
        <RevealLine state={s} delay={220}><em>plan de comidas.</em></RevealLine>
        <br />
        <RevealLine state={s} delay={520}>Necesitas un</RevealLine>{" "}
        <RevealLine state={s} delay={680}><em>punto de partida.</em></RevealLine>
      </h2>
      <p className="ra-sub" />
    </div>
  )
}

function Intro3({ local, dur }: { local: number; dur: number }) {
  const s = local > 0.05 ? (local > dur - 0.5 ? "out" : "in") : ""
  return (
    <div className="ra-scene ra-intro">
      <span className="ra-eyebrow">
        <Fade state={s}><span className="ra-rule" /></Fade>
        <Fade state={s} delay={120}>el método</Fade>
        <Fade state={s} delay={240}><span className="ra-rule" /></Fade>
      </span>
      <h2 className="ra-display" style={{ fontSize: "7.6cqw", lineHeight: 1.04 }}>
        <RevealLine state={s} delay={80}><em>Un objetivo.</em></RevealLine>
        <br />
        <RevealLine state={s} delay={320}><em>Un tiempo.</em></RevealLine>
        <br />
        <RevealLine state={s} delay={560}>Un camino con <em>datos reales.</em></RevealLine>
      </h2>
      <p className="ra-sub" />
    </div>
  )
}

// ─── Feature title (wraps em word, splits into two lines) ─────────────────────
function FeatureTitle({ title, em, state }: { title: string; em: string; state: string }) {
  const words = title.split(" ")
  const half  = Math.ceil(words.length / 2)
  const lineA = words.slice(0, half).join(" ")
  const lineB = words.slice(half).join(" ")

  const render = (text: string, delay: number) => {
    const idx = text.toLowerCase().indexOf(em.toLowerCase())
    if (idx < 0) return <RevealLine state={state} delay={delay} dur={1100}>{text}</RevealLine>
    return (
      <RevealLine state={state} delay={delay} dur={1100}>
        {text.slice(0, idx)}<em>{text.slice(idx, idx + em.length)}</em>{text.slice(idx + em.length)}
      </RevealLine>
    )
  }

  if (words.length < 3) return render(title, 200)
  return (
    <>
      {render(lineA, 200)}
      <br />
      {render(lineB, 360)}
    </>
  )
}

// ─── Feature (per-reto scene) ─────────────────────────────────────────────────
function Feature({ data, local, dur }: { data: typeof CHALLENGES[0]; local: number; dur: number }) {
  const s  = local > 0.10 ? (local > dur - 0.55 ? "out" : "in") : ""
  const sl = local > 0.25 ? (local > dur - 0.55 ? "out" : "in") : ""

  return (
    <div className="ra-scene ra-feature">
      <div className={"ra-glyph " + (s ? "ra-glyph-" + s : "")}>{data.numeral}</div>
      <div className="ra-rule-v" />

      <span className="ra-tag">
        <Fade state={s} delay={80}><span className="ra-bullet" /></Fade>
        <Fade state={s} delay={140}>{data.cat}</Fade>
        <Fade state={s} delay={220}><span className="ra-dur">· {data.duration}</span></Fade>
      </span>

      <h2 className="ra-title">
        <FeatureTitle title={data.title} em={data.titleEm} state={s} />
      </h2>

      <div className="ra-meta">
        <p className="ra-blurb"><Fade state={sl} delay={520}>{data.blurb}</Fade></p>
        <span className="ra-price">
          <Fade state={sl} delay={680}>
            <span className="ra-amount">{data.price}</span>
            <span className="ra-euro">€</span>
            <small>iva incluido</small>
          </Fade>
        </span>
      </div>

      <span className="ra-caption">
        <Fade state={s} delay={300}><span className="ra-cap-dot" /></Fade>
        <Fade state={s} delay={380}>reto · {data.numeral} de 08</Fade>
      </span>
    </div>
  )
}

// ─── Outro ────────────────────────────────────────────────────────────────────
function Outro({ local, dur }: { local: number; dur: number }) {
  const s = local > 0.05 ? (local > dur - 0.5 ? "out" : "in") : ""
  return (
    <div className="ra-scene ra-outro">
      <span className="ra-eyebrow">
        <Fade state={s}><span className="ra-rule" /></Fade>
        <Fade state={s} delay={120}>tu camino te espera</Fade>
        <Fade state={s} delay={240}><span className="ra-rule" /></Fade>
      </span>
      <h2 className="ra-display">
        <RevealLine state={s} delay={120}>8 retos.</RevealLine>{" "}
        <RevealLine state={s} delay={300}>1 punto de</RevealLine>{" "}
        <RevealLine state={s} delay={500}><em>partida.</em></RevealLine>
      </h2>
      <span className="ra-cta-outro">
        <Fade state={s} delay={1000}>empieza en food-mood.app</Fade>
        <Fade state={s} delay={1180}><span className="ra-arrow" /></Fade>
      </span>
    </div>
  )
}

// ─── Root animation component ─────────────────────────────────────────────────
export function RetosAnimation() {
  const t   = useLoopTime(TOTAL)
  const seg = currentSegment(t)

  const theme = useMemo(() => {
    if (seg.kind === "feature") return CHALLENGES[(seg as FeatureSeg).index]
    if (seg.kind === "outro")   return CHALLENGES[CHALLENGES.length - 1]
    return { bg: "#F1ECE1", ink: "#15140F", inkSoft: "#15140F99", accent: "#B85A1F" }
  }, [seg.kind, seg.kind === "feature" ? (seg as FeatureSeg).index : -1])

  const [washKey, setWashKey] = useState(0)
  const lastId = useRef<string | null>(null)
  useEffect(() => {
    const id = seg.kind === "feature" ? `f-${(seg as FeatureSeg).index}`
             : seg.kind === "intro"   ? `i-${(seg as IntroSeg).which}`
             : "outro"
    if (lastId.current !== null && lastId.current !== id) setWashKey(k => k + 1)
    lastId.current = id
  }, [seg.kind, seg.kind === "feature" ? (seg as FeatureSeg).index : seg.kind === "intro" ? (seg as IntroSeg).which : 0])

  const counter = useMemo(() => {
    if (seg.kind === "feature") return { num: String((seg as FeatureSeg).index + 1).padStart(2, "0"), total: "08" }
    if (seg.kind === "outro")   return { num: "08", total: "08" }
    return { num: "00", total: "08" }
  }, [seg.kind, seg.kind === "feature" ? (seg as FeatureSeg).index : -1])

  const featureIndex    = seg.kind === "feature" ? (seg as FeatureSeg).index : seg.kind === "outro" ? 7 : -1
  const featureProgress = seg.kind === "feature" ? seg.local / seg.dur : 0

  return (
    <>
      <style>{RA_CSS}</style>
      <div className="ra-host">
        <div
          className="ra-stage"
          style={{
            "--bg": theme.bg,
            "--ink": theme.ink,
            "--ink-soft": theme.inkSoft,
            "--accent": theme.accent,
            background: theme.bg,
            color: theme.ink,
          } as CSSProperties}
        >
          <div className="ra-frame" />

          {/* Persistent chrome */}
          <div className="ra-chrome">
            <div className="ra-chrome-row ra-chrome-top">
              <span className="ra-brand">
                <span className="ra-brand-dot" />
                <span className="ra-brand-name">food·mood</span>
              </span>
              <span style={{ opacity: 0.55, letterSpacing: "0.28em", fontSize: "0.85cqw" }}>retos de transformación</span>
              <span className="ra-counter">
                <span className="ra-counter-num">{counter.num}</span>
                <span className="ra-slash">/</span>
                <span className="ra-total">{counter.total}</span>
              </span>
            </div>
            <div className="ra-chrome-row ra-chrome-bottom">
              <span style={{ opacity: 0.4 }}>food-mood.app</span>
            </div>
          </div>

          {/* Progress strip */}
          <div className="ra-progress">
            {CHALLENGES.map((_, i) => {
              const cls = i < featureIndex ? "done" : i === featureIndex ? "active" : ""
              const p   = i === featureIndex ? featureProgress : 0
              return <div key={i} className={"ra-pcell " + cls} style={{ "--p": p } as CSSProperties} />
            })}
          </div>

          {/* Category rail */}
          <div className="ra-cat-rail">
            {CHALLENGES.map((c, i) => {
              const cls = i < featureIndex ? "done" : i === featureIndex ? "active" : ""
              return <span key={i} className={cls}>{c.cat}</span>
            })}
          </div>

          {/* Scenes */}
          {seg.kind === "intro"   && (seg as IntroSeg).which === 1   && <Intro1   local={seg.local} dur={seg.dur} />}
          {seg.kind === "intro"   && (seg as IntroSeg).which === 2   && <Intro2   local={seg.local} dur={seg.dur} />}
          {seg.kind === "intro"   && (seg as IntroSeg).which === 3   && <Intro3   local={seg.local} dur={seg.dur} />}
          {seg.kind === "feature" && <Feature data={CHALLENGES[(seg as FeatureSeg).index]} local={seg.local} dur={seg.dur} />}
          {seg.kind === "outro"   && <Outro   local={seg.local} dur={seg.dur} />}

          {/* Sweep wash */}
          <div key={washKey} className="ra-wash" style={{ background: theme.accent } as CSSProperties} />
        </div>
      </div>
    </>
  )
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const RA_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  .ra-host {
    width: 100%;
    aspect-ratio: 16 / 9;
    position: relative;
    overflow: hidden;
    background: #0b0b0a;
  }

  .ra-stage {
    position: absolute;
    inset: 0;
    container-type: inline-size;
    overflow: hidden;
    transition:
      background-color 1100ms cubic-bezier(.6,.05,.2,1),
      color            1100ms cubic-bezier(.6,.05,.2,1);
    font-family: "Inter Tight", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Frame ── */
  .ra-frame {
    position: absolute; inset: 2.4cqw 3.2cqw;
    border: 1px solid currentColor; opacity: .08;
    pointer-events: none; z-index: 8;
  }

  /* ── Chrome ── */
  .ra-chrome {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 10;
  }
  .ra-chrome-row {
    position: absolute; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: center;
    padding: 2.4cqw 3.2cqw;
    font-size: .95cqw; letter-spacing: .18em; text-transform: uppercase; font-weight: 500;
    color: var(--ink-soft, #00000099);
    transition: color 1100ms cubic-bezier(.6,.05,.2,1);
  }
  .ra-chrome-top    { top: 0; }
  .ra-chrome-bottom { bottom: 0; }

  .ra-brand { display: inline-flex; align-items: center; gap: .6cqw; }
  .ra-brand-dot {
    width: .55cqw; height: .55cqw; border-radius: 999px;
    background: currentColor; display: inline-block;
  }
  .ra-brand-name { font-feature-settings: "ss01" 1; letter-spacing: .22em; }

  .ra-counter {
    display: inline-flex; align-items: baseline; gap: .4cqw;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    letter-spacing: .04em;
  }
  .ra-counter-num { font-size: 1.05cqw; font-variant-numeric: tabular-nums; }
  .ra-slash  { opacity: .35; }
  .ra-total  { opacity: .5; }

  /* ── Progress strip ── */
  .ra-progress {
    position: absolute; left: 3.2cqw; right: 3.2cqw; bottom: 5.6cqw;
    display: grid; grid-auto-flow: column; grid-auto-columns: 1fr;
    gap: .6cqw; pointer-events: none; z-index: 9;
  }
  .ra-pcell {
    height: .18cqw; background: currentColor; opacity: .14;
    border-radius: 999px; overflow: hidden; position: relative;
  }
  .ra-pcell::after {
    content: ""; position: absolute; inset: 0;
    background: currentColor;
    transform: scaleX(var(--p, 0));
    transform-origin: left center;
    transition: transform 200ms linear;
  }
  .ra-pcell.active { opacity: .9; }
  .ra-pcell.done   { opacity: .5; }
  .ra-pcell.done::after { transform: scaleX(1); }

  /* ── Category rail ── */
  .ra-cat-rail {
    position: absolute; left: 3.2cqw; right: 3.2cqw; bottom: 3cqw;
    display: grid; grid-auto-flow: column; grid-auto-columns: 1fr;
    gap: .6cqw;
    font-size: .72cqw; letter-spacing: .22em; text-transform: uppercase; font-weight: 500;
    z-index: 9; pointer-events: none;
  }
  .ra-cat-rail span {
    color: var(--ink-soft, #00000066);
    transition: color 600ms ease, opacity 600ms ease, transform 600ms cubic-bezier(.6,.05,.2,1);
    opacity: .55; text-align: center; transform: translateY(0);
  }
  .ra-cat-rail span.active { color: var(--ink); opacity: 1; transform: translateY(-.2cqw); }
  .ra-cat-rail span.done   { opacity: .85; }

  /* ── Scenes ── */
  .ra-scene {
    position: absolute; inset: 0;
    display: grid; z-index: 5;
  }

  /* Intro layout */
  .ra-intro {
    grid-template-rows: 1fr auto 1fr;
    padding: 0 8cqw;
    text-align: center;
    place-items: center;
  }
  .ra-eyebrow {
    grid-row: 1; align-self: end;
    text-transform: uppercase; letter-spacing: .42em; font-size: .95cqw; font-weight: 500;
    color: var(--ink-soft, #00000099);
    margin-bottom: 2.2cqw;
    display: inline-flex; align-items: center; gap: 1.2cqw;
  }
  .ra-rule {
    width: 4cqw; height: 1px; background: currentColor; opacity: .55; display: block;
  }
  .ra-display {
    grid-row: 2;
    font-family: "Instrument Serif", "Times New Roman", serif;
    font-weight: 400; font-size: 9.6cqw; line-height: .94; letter-spacing: -.02em;
    text-wrap: balance; margin: 0;
  }
  .ra-display em { font-style: italic; color: var(--accent, currentColor); }
  .ra-sub {
    grid-row: 3; align-self: start; margin-top: 2.4cqw;
    font-size: 1.45cqw; line-height: 1.45; max-width: 60cqw;
    color: var(--ink-soft, #000000aa); text-wrap: balance; font-weight: 400;
  }

  /* Feature layout */
  .ra-feature {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto auto 1fr;
    padding: 0 6cqw; place-items: start; align-content: center;
  }
  .ra-tag {
    grid-row: 2;
    display: inline-flex; align-items: center; gap: 1cqw;
    font-size: .92cqw; letter-spacing: .34em; text-transform: uppercase;
    color: var(--accent); font-weight: 500;
  }
  .ra-dur   { color: var(--ink-soft, #00000088); letter-spacing: .22em; }
  .ra-bullet {
    width: .42cqw; height: .42cqw; background: currentColor;
    border-radius: 999px; display: inline-block; opacity: .8;
  }
  .ra-title {
    grid-row: 3;
    font-family: "Instrument Serif", serif; font-weight: 400;
    font-size: 11.6cqw; line-height: .94; letter-spacing: -.025em;
    margin: 1.4cqw 0 0; text-wrap: balance; max-width: 86cqw;
  }
  .ra-title em { font-style: italic; color: var(--accent); }
  .ra-meta {
    grid-row: 4; margin-top: 2.4cqw;
    display: flex; align-items: baseline; justify-content: space-between;
    width: 100%; gap: 2cqw;
  }
  .ra-blurb {
    font-size: 1.15cqw; line-height: 1.45; max-width: 32cqw;
    color: var(--ink-soft, #000000aa); text-wrap: pretty; margin: 0;
  }
  .ra-price {
    font-family: "Instrument Serif", serif; font-size: 4.8cqw; line-height: 1;
    letter-spacing: -.02em; color: var(--ink);
    display: inline-flex; align-items: baseline; gap: .4cqw; white-space: nowrap;
  }
  .ra-euro  { font-size: 2.2cqw; color: var(--ink-soft, #00000088); }
  .ra-price small {
    font-family: "Inter Tight", sans-serif; font-size: .9cqw;
    letter-spacing: .22em; text-transform: uppercase;
    color: var(--ink-soft, #00000088); margin-left: 1.2cqw; align-self: center;
  }

  /* Big numeral watermark */
  .ra-glyph {
    position: absolute; right: 4cqw; top: 0; bottom: 0;
    display: grid; place-items: center;
    font-family: "Instrument Serif", serif; font-style: italic;
    font-size: 60cqw; line-height: 1;
    color: var(--accent); opacity: 0;
    user-select: none; pointer-events: none;
    transform: translateX(8cqw);
    transition: transform 1200ms cubic-bezier(.22,.95,.28,1), opacity 900ms ease;
    z-index: 1;
  }
  .ra-glyph-in  { transform: translateX(0);    opacity: .085; }
  .ra-glyph-out { transform: translateX(-4cqw); opacity: 0;
                  transition: transform 600ms ease, opacity 400ms ease; }

  /* Vertical rule in feature */
  .ra-rule-v {
    position: absolute; top: 9cqw; bottom: 9cqw; left: 6cqw;
    width: 1px; background: currentColor; opacity: .12; z-index: 4;
  }

  /* Caption bottom-left in feature */
  .ra-caption {
    position: absolute; left: 6cqw; bottom: 9cqw;
    font-size: .78cqw; letter-spacing: .32em; text-transform: uppercase;
    color: var(--ink-soft, #00000088); z-index: 6;
    display: inline-flex; align-items: center; gap: .8cqw;
  }
  .ra-cap-dot {
    width: .42cqw; height: .42cqw; background: var(--accent);
    border-radius: 999px; display: inline-block;
  }

  /* Outro layout */
  .ra-outro {
    grid-template-rows: 1fr auto 1fr;
    place-items: center; text-align: center; padding: 0 8cqw;
  }
  .ra-cta-outro {
    grid-row: 3; align-self: start; margin-top: 2.8cqw;
    font-size: 1cqw; letter-spacing: .32em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 1.2cqw;
    color: var(--ink-soft, #000000aa);
  }
  .ra-arrow {
    width: 4cqw; height: 1px; background: currentColor; position: relative; display: block;
  }
  .ra-arrow::after {
    content: ""; position: absolute; right: 0; top: -3px;
    width: 8px; height: 8px;
    border-right: 1px solid currentColor; border-top: 1px solid currentColor;
    transform: rotate(45deg);
  }

  /* ── Line-reveal animation ── */
  .ra-rl {
    display: block; overflow: hidden;
  }
  .ra-rl-inner {
    display: block;
    transform: translateY(110%);
    transition: transform var(--rd, 900ms) cubic-bezier(.22,.95,.28,1) var(--rdelay, 0ms);
    will-change: transform;
  }
  .ra-rl.in  > .ra-rl-inner { transform: translateY(0); }
  .ra-rl.out > .ra-rl-inner {
    transform: translateY(-110%);
    transition: transform 700ms cubic-bezier(.6,.05,.2,1) var(--rdelay, 0ms);
  }

  /* ── Fade animation ── */
  .ra-fade {
    opacity: 0; transform: translateY(.6cqw);
    transition: opacity 700ms ease, transform 900ms cubic-bezier(.22,.95,.28,1);
    transition-delay: var(--rdelay, 0ms);
    display: inline-block;
  }
  .ra-fade.in  { opacity: 1; transform: translateY(0); }
  .ra-fade.out { opacity: 0; transform: translateY(-.4cqw);
                 transition: opacity 500ms ease, transform 500ms ease; }

  /* ── Wash sweep transition ── */
  .ra-wash {
    position: absolute; inset: 0;
    transform: scaleY(0); transform-origin: bottom center;
    z-index: 7; pointer-events: none; opacity: .96;
    animation: ra-washIn 1100ms cubic-bezier(.7,.05,.2,1) forwards;
  }
  @keyframes ra-washIn {
    0%     { transform: scaleY(0); transform-origin: bottom center; }
    50%    { transform: scaleY(1); transform-origin: bottom center; }
    50.01% { transform: scaleY(1); transform-origin: top center; }
    100%   { transform: scaleY(0); transform-origin: top center; }
  }
`
