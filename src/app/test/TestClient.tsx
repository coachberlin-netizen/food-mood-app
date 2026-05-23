"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────

type SliderKey = "energia" | "animo" | "tension" | "conexion" | "claridad"
type SliderValues = Record<SliderKey, number>
type SaveStatus = "idle" | "saving" | "saved" | "error"
type SubEmotion = { name: string; pct: number; color: string }
type MosaicoEntry = { date: string; color_hex: string; state_name: string }

// ── Slider config ─────────────────────────────────────────────────────────

const SLIDERS: {
  key: SliderKey
  label: string
  emoji: string
  low: string
  high: string
  trackStart: string
  trackEnd: string
}[] = [
  { key: "energia",  label: "Energía",  emoji: "⚡", low: "Agotada",     high: "Vibrante",    trackStart: "#9B6DE6", trackEnd: "#FFB000" },
  { key: "animo",    label: "Ánimo",    emoji: "🌡", low: "Hundida",     high: "Radiante",    trackStart: "#4A7AB5", trackEnd: "#E8703A" },
  { key: "tension",  label: "Tensión",  emoji: "🌊", low: "Calma total", high: "Muy tensa",   trackStart: "#5A9B8A", trackEnd: "#C04878" },
  { key: "conexion", label: "Conexión", emoji: "🤍", low: "Aislada",     high: "Conectada",   trackStart: "#7A5AAA", trackEnd: "#5A9B8A" },
  { key: "claridad", label: "Claridad", emoji: "🔮", low: "Niebla",      high: "Foco total",  trackStart: "#8A8AAA", trackEnd: "#4A90D0" },
]

const SUB_COLORS: Record<string, string> = {
  "Calma":         "#5A9B8A",
  "Ansiedad leve": "#7A5AAA",
  "Energía":       "#E8703A",
  "Melancolía":    "#4A7AB5",
  "Conexión":      "#C04878",
  "Foco":          "#4A90D0",
}

// ── State → Mood mapping ──────────────────────────────────────────────────

const STATE_TO_MOOD: Record<string, string> = {
  "Calma luminosa":   "calma",
  "Bruma tranquila":  "calma",
  "Remanso quieto":   "calma",
  "Foco profundo":    "focus",
  "Luz dispersa":     "focus",
  "Chispa social":    "social",
  "Marea alta":       "activacion",
  "Viento cruzado":   "activacion",
  "Tormenta interior":"reset",
  "Niebla suave":     "reset",
}

const MOOD_PHRASES: Record<string, string> = {
  activacion: "Tu cuerpo está en marcha. Te vienen bien alimentos que sostengan esa energía sin bajón posterior.",
  calma:      "Estás en el estado ideal para absorber nutrientes. Tu digestión funciona mejor cuando estás así.",
  focus:      "Modo concentración. Hay alimentos que alimentan literalmente las neuronas — hoy los necesitas.",
  social:     "Energía de conexión. Algunos sabores potencian la oxitocina, la hormona del vínculo.",
  reset:      "Tu cuerpo pide pausa. Recetas ligeras que ayudan a tu hígado y te dejan respirar.",
  confort:    "Necesitas que algo te abrace por dentro. Existe la ciencia del confort sin culpa.",
}

// ── Math helpers ──────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function calcColor(v: SliderValues): { r: number; g: number; b: number; hex: string } {
  const { energia, animo, tension, conexion, claridad } = v
  const r = lerp(lerp(60, 220, energia / 100), lerp(40, 200, tension / 100), 0.5)
  const g = lerp(lerp(30, 180, animo / 100), lerp(80, 200, claridad / 100), 0.5)
  const b = lerp(lerp(40, 180, conexion / 100), lerp(60, 200, (100 - tension) / 100), 0.45)
  const hex = "#" + [r, g, b].map(n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0")).join("")
  return { r, g, b, hex }
}

function calcStateName(v: SliderValues): string {
  const { energia, animo, tension, conexion, claridad } = v
  if (tension < 35 && animo > 55 && energia > 45)           return "Calma luminosa"
  if (tension > 65 && animo < 45)                            return "Tormenta interior"
  if (energia < 40 && animo > 40 && tension < 40)            return "Bruma tranquila"
  if (energia > 60 && conexion > 65)                         return "Chispa social"
  if (claridad > 65 && tension < 45 && energia > 40)         return "Foco profundo"
  if (tension > 50 && energia > 55)                          return "Viento cruzado"
  if (claridad < 40 && tension < 50)                         return "Niebla suave"
  if (animo > 70 && energia > 65)                            return "Marea alta"
  if (energia < 35 && tension < 35 && animo > 35)            return "Remanso quieto"
  return "Luz dispersa"
}

function calcSubEmotions(v: SliderValues): SubEmotion[] {
  const { energia, animo, tension, conexion, claridad } = v
  const raw = [
    { name: "Calma",         value: (100 - tension) * 0.6 + (100 - energia) * 0.2 },
    { name: "Ansiedad leve", value: tension * 0.5 + (100 - animo) * 0.2 },
    { name: "Energía",       value: energia * 0.7 + animo * 0.1 },
    { name: "Melancolía",    value: (100 - animo) * 0.5 + (100 - conexion) * 0.2 },
    { name: "Conexión",      value: conexion * 0.6 + animo * 0.2 },
    { name: "Foco",          value: claridad * 0.7 + (100 - tension) * 0.15 },
  ]
  const top3 = [...raw].sort((a, b) => b.value - a.value).slice(0, 3)
  const total = top3.reduce((s, e) => s + e.value, 0)
  return top3.map(e => ({
    name: e.name,
    pct: total > 0 ? Math.round((e.value / total) * 100) : 0,
    color: SUB_COLORS[e.name] ?? "#888",
  }))
}

// ── Slider component ──────────────────────────────────────────────────────

function DimensionSlider({
  cfg,
  value,
  onChange,
}: {
  cfg: typeof SLIDERS[number]
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B2737]/50">
          {cfg.emoji} {cfg.label}
        </span>
        <span className="text-[11px] font-semibold text-[#6B2737]/50 tabular-nums">{value}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[#6B2737]/35 w-14 text-right shrink-0 leading-tight">{cfg.low}</span>
        <div className="relative flex-1 h-11 flex items-center">
          {/* Gradient track */}
          <div
            className="absolute w-full h-2 rounded-full"
            style={{ background: `linear-gradient(to right, ${cfg.trackStart}, ${cfg.trackEnd})` }}
          />
          {/* Dim right portion */}
          <div
            className="absolute h-2 right-0 rounded-r-full bg-white/50 transition-all duration-75"
            style={{ width: `${100 - value}%` }}
          />
          {/* Native input — 44px tall for WCAG touch target */}
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            style={{ touchAction: 'none' }}
          />
          {/* Custom thumb */}
          <div
            className="absolute w-5 h-5 rounded-full bg-white shadow-md border-2 pointer-events-none transition-all duration-75"
            style={{ left: `calc(${value}% - 10px)`, borderColor: cfg.trackEnd }}
          />
        </div>
        <span className="text-[10px] text-[#6B2737]/35 w-14 shrink-0 leading-tight">{cfg.high}</span>
      </div>
    </div>
  )
}

// ── Email gate ────────────────────────────────────────────────────────────

function EmailGate({
  onSubmit,
  onSkip,
}: {
  onSubmit: (email: string) => Promise<void>
  onSkip: () => void
}) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Escape para cerrar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onSkip])

  // Focus trap — cicla el foco dentro del diálogo
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    dialog.addEventListener('keydown', trap)
    // Foco inicial en el input
    inputRef.current?.focus()
    return () => dialog.removeEventListener('keydown', trap)
  }, [])

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Introduce un email válido")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await onSubmit(trimmed)
    } catch {
      setError("Algo ha ido mal. Inténtalo de nuevo.")
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ backgroundColor: "rgba(45,15,22,0.72)" }}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-gate-title"
        className="bg-[#F5F0E8] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-4">Tu estado está listo</p>
        <h2 id="email-gate-title" className="font-serif text-2xl text-[#2d0f16] mb-3 leading-snug">
          ¿Dónde te lo enviamos?
        </h2>
        <p className="text-sm text-[#6B2737]/55 font-light mb-6 leading-relaxed">
          Accede a tu resultado y recibe cada semana una receta personalizada para tu estado.
        </p>
        <form onSubmit={handle} className="space-y-3">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError("") }}
            placeholder="tu@email.com"
            required
            minLength={5}
            maxLength={254}
            aria-label="Tu dirección de email"
            aria-describedby={error ? "email-gate-error" : undefined}
            className="w-full px-4 py-3 rounded-xl border border-[#6B2737]/15 bg-white text-[#2d0f16] text-sm placeholder:text-[#6B2737]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
          />
          {error && (
            <p id="email-gate-error" role="alert" className="text-xs text-red-500 text-left">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ backgroundColor: "#6B2737" }}
          >
            {submitting ? "Guardando…" : "Ver mi resultado"}
          </button>
        </form>
        <button
          onClick={onSkip}
          className="mt-4 text-xs text-[#6B2737]/30 hover:text-[#6B2737]/50 transition-colors"
        >
          Prefiero no dejar mi email →
        </button>
      </div>
    </div>
  )
}

// ── Mosaico emocional ─────────────────────────────────────────────────────

const PLACEHOLDER_COLORS = [
  "#5A9B8A","#E8703A","#4A7AB5","#C04878","#C8902A",
  "#7A5AAA","#4A90D0","#5A9B8A","#E8703A","#4A7AB5",
]

function MosaicoEmocional({ isSubscriber }: { isSubscriber: boolean }) {
  const [entries, setEntries] = useState<MosaicoEntry[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!isSubscriber) return
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("test_results")
        .select("created_at, color_hex, state_name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(28)
      if (data) {
        setEntries(data.map(d => ({
          date: (d.created_at as string).split("T")[0],
          color_hex: d.color_hex as string,
          state_name: d.state_name as string,
        })))
      }
    }
    load()
  }, [isSubscriber])

  const today = new Date().toISOString().split("T")[0]

  const cells = Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const entry = entries.find(e => e.date === dateStr)
    return { date: dateStr, entry, isToday: dateStr === today }
  })

  return (
    <section className="mt-12 pt-10 border-t border-[#6B2737]/8">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-1">Diario emocional</p>
        <h2 className="font-serif text-2xl text-[#2d0f16]">Tu mosaico emocional</h2>
        <p className="text-xs text-[#6B2737]/40 font-light mt-1">28 días · un color por día</p>
      </div>

      <div className="relative">
        {/* Grid */}
        <div className={`grid grid-cols-7 gap-1.5 ${!isSubscriber ? "blur-sm pointer-events-none select-none" : ""}`}>
          {isSubscriber
            ? cells.map((cell, i) => (
                <div
                  key={i}
                  title={cell.entry ? `${cell.date} · ${cell.entry.state_name}` : cell.date}
                  className="aspect-square rounded-lg transition-all"
                  style={{
                    backgroundColor: cell.entry ? cell.entry.color_hex : "#E4DDD6",
                    outline: cell.isToday ? "2px solid #6B2737" : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))
            : Array.from({ length: 28 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg"
                  style={{ backgroundColor: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] }}
                />
              ))
          }
        </div>

        {/* Lock overlay */}
        {!isSubscriber && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-2xl mb-3">🔐</span>
            <p className="font-serif text-base text-[#2d0f16] leading-snug mb-1">
              Tu historial emocional completo
            </p>
            <p className="text-xs text-[#2d0f16]/50 mb-4">Disponible en el plan premium</p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 shadow-md mb-3"
              style={{ backgroundColor: "#6B2737" }}
            >
              Ver planes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="flex gap-2 justify-center">
              <a
                href="https://t.me/foodmoodapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#229ED9" }}
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram gratis
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbCEhFoCsU9LDcPX362R"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp gratis
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Result modal ─────────────────────────────────────────────────────────

function ResultModal({
  color,
  stateName,
  subEmotions,
  onClose,
}: {
  color: { r: number; g: number; b: number; hex: string }
  stateName: string
  subEmotions: SubEmotion[]
  onClose: () => void
}) {
  const { r, g, b, hex } = color
  const light   = `rgb(${Math.min(255, Math.round(r + 45))},${Math.min(255, Math.round(g + 45))},${Math.min(255, Math.round(b + 45))})`
  const dark    = `rgb(${Math.max(0, Math.round(r - 25))},${Math.max(0, Math.round(g - 25))},${Math.max(0, Math.round(b - 25))})`
  const moodId  = STATE_TO_MOOD[stateName] ?? "calma"
  const phrase  = MOOD_PHRASES[moodId]

  const cardRef   = useRef<HTMLDivElement>(null)
  const closeRef  = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)

  // Animate in
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Focus first button on open
  useEffect(() => { closeRef.current?.focus() }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{
        backgroundColor: "rgba(45,15,22,0.72)",
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={cardRef}
        className="bg-[#F5F0E8] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        style={{
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "transform 300ms ease-out",
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-5">
          Tu estado de hoy
        </p>

        {/* Color orb */}
        <div className="flex justify-center mb-4">
          <div
            className="w-24 h-24 rounded-full shadow-xl"
            style={{ background: `radial-gradient(circle at 35% 35%, ${light}, ${hex} 52%, ${dark})` }}
          />
        </div>

        <h2 id="result-modal-title" className="font-serif text-2xl text-[#2d0f16] italic mb-1">
          {stateName}
        </h2>
        <p className="text-[10px] font-mono text-[#6B2737]/30 uppercase tracking-widest mb-4">{hex}</p>

        {/* Mechanism phrase */}
        <p className="text-sm text-[#6B2737]/60 font-light leading-relaxed mb-5 px-1">{phrase}</p>

        {/* Sub-emotions */}
        <div className="space-y-2 mb-7">
          {subEmotions.map(sub => (
            <div key={sub.name} className="flex items-center gap-2">
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4ddd6" }}>
                <div className="h-full rounded-full" style={{ width: `${sub.pct}%`, backgroundColor: sub.color }} />
              </div>
              <span className="text-[10px] text-[#6B2737]/50 w-20 text-right shrink-0">{sub.pct}% {sub.name}</span>
            </div>
          ))}
        </div>

        <Link
          href={`/recetas?mood=${moodId}`}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white mb-3 transition-all hover:scale-[1.02] shadow-md"
          style={{ backgroundColor: "#6B2737" }}
        >
          Ver mis recetas para hoy <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          ref={closeRef}
          onClick={onClose}
          className="text-xs text-[#6B2737]/35 hover:text-[#6B2737]/55 transition-colors"
        >
          Ver mi mosaico de 28 días
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

const INITIAL: SliderValues = { energia: 50, animo: 50, tension: 50, conexion: 50, claridad: 50 }

export default function TestClient() {
  const [values, setValues]           = useState<SliderValues>(INITIAL)
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>("idle")
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [showResult, setShowResult]   = useState(false)
  const [isSubscriber, setIsSubscriber]  = useState(false)
  const [mounted, setMounted]         = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    async function checkSub() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single()
      if (data?.is_premium) setIsSubscriber(true)
    }
    checkSub()
  }, [])

  const color       = useMemo(() => calcColor(values), [values])
  const stateName   = useMemo(() => calcStateName(values), [values])
  const subEmotions = useMemo(() => calcSubEmotions(values), [values])

  const handleChange = (key: SliderKey, v: number) => {
    setValues(prev => ({ ...prev, [key]: v }))
    if (saveStatus === "saved") setSaveStatus("idle")
  }

  const doInsert = async (sessionId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    const top = subEmotions
    const { error } = await supabase.from("test_results").insert({
      user_id:     user?.id ?? null,
      session_id:  sessionId,
      ...values,
      color_hex:   color.hex,
      state_name:  stateName,
      subemocion_1: top[0]?.name ?? null,
      subpct_1:     top[0]?.pct  ?? null,
      subemocion_2: top[1]?.name ?? null,
      subpct_2:     top[1]?.pct  ?? null,
      subemocion_3: top[2]?.name ?? null,
      subpct_3:     top[2]?.pct  ?? null,
    })
    if (error) throw error
    if (user?.id) fetch("/api/correlations", { method: "POST" }).catch(() => {})
  }

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const sessionId = crypto.randomUUID()

    if (user || localStorage.getItem("fm_lead_captured")) {
      setSaveStatus("saving")
      try {
        await doInsert(sessionId)
        setSaveStatus("saved")
        setShowResult(true)
      } catch {
        setSaveStatus("error")
      }
    } else {
      setShowEmailGate(true)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    const sessionId = crypto.randomUUID()
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "test-color" }),
    })
    localStorage.setItem("fm_lead_captured", "true")
    setShowEmailGate(false)
    setSaveStatus("saving")
    try {
      await doInsert(sessionId)
      setSaveStatus("saved")
      setShowResult(true)
    } catch {
      setSaveStatus("error")
    }
  }

  const handleSkipEmail = async () => {
    const sessionId = crypto.randomUUID()
    setShowEmailGate(false)
    setSaveStatus("saving")
    try {
      await doInsert(sessionId)
      setSaveStatus("saved")
      setShowResult(true)
    } catch {
      setSaveStatus("error")
    }
  }

  const reset = () => {
    setValues(INITIAL)
    setSaveStatus("idle")
    setShowResult(false)
  }

  // Orb colours — lighter top-left, darker bottom-right for 3D effect
  const { r, g, b, hex } = color
  const light = `rgb(${Math.min(255, Math.round(r + 45))},${Math.min(255, Math.round(g + 45))},${Math.min(255, Math.round(b + 45))})`
  const dark  = `rgb(${Math.max(0,   Math.round(r - 25))},${Math.max(0,   Math.round(g - 25))},${Math.max(0,   Math.round(b - 25))})`

  if (!mounted) return null

  return (
    <>
      {showEmailGate && (
        <EmailGate onSubmit={handleEmailSubmit} onSkip={handleSkipEmail} />
      )}
      {showResult && (
        <ResultModal
          color={color}
          stateName={stateName}
          subEmotions={subEmotions}
          onClose={() => setShowResult(false)}
        />
      )}

      <div className="min-h-[calc(100vh-80px)] bg-[#F5F0E8] py-10 px-5">
        <div className="max-w-[520px] mx-auto">

          {/* Header */}
          <header className="text-center mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C] mb-3">
              Test de estado
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[#2d0f16] leading-tight">
              ¿De qué color es tu hoy?
            </h1>
            <p className="text-sm text-[#6B2737]/45 font-light mt-2">
              Mueve los 5 sliders — tu color aparece en tiempo real.
            </p>
          </header>

          {/* Orb */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-44 h-44 md:w-52 md:h-52 rounded-full shadow-2xl"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${light}, ${hex} 52%, ${dark})`,
                transition: "background 0.15s ease",
              }}
            />
            <div className="mt-5 text-center">
              <p className="font-serif text-xl text-[#2d0f16] italic">{stateName}</p>
              <p className="text-[10px] text-[#6B2737]/35 font-mono mt-1 uppercase tracking-widest">{hex}</p>
            </div>
          </div>

          {/* Granularity bars */}
          <div className="mb-8 bg-white rounded-2xl p-5 border border-[#6B2737]/8 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737]/35 mb-1">
              Tu espectro emocional
            </p>
            {subEmotions.map(sub => (
              <div key={sub.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-[#2d0f16]">{sub.name}</span>
                  <span className="text-xs text-[#6B2737]/45 tabular-nums">{sub.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F5F0E8" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${sub.pct}%`,
                      backgroundColor: sub.color,
                      transition: "width 0.15s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sliders */}
          <p className="text-sm text-[#6B2737]/45 font-light text-center mb-6 leading-relaxed">
            Mueve cada slider hasta donde sientas que estás ahora mismo.
            Sin pensarlo mucho — la primera respuesta es la más honesta.
            Al terminar verás tu color emocional del día.
          </p>
          <div className="space-y-7 mb-9">
            {SLIDERS.map(cfg => (
              <DimensionSlider
                key={cfg.key}
                cfg={cfg}
                value={values[cfg.key]}
                onChange={v => handleChange(cfg.key, v)}
              />
            ))}
          </div>

          {/* Save button */}
          <div className="flex flex-col gap-3">
            {saveStatus === "saved" ? (
              <div
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold"
                style={{ color: "#5A9B8A", backgroundColor: "#5A9B8A18" }}
              >
                <Check className="w-4 h-4" /> Estado guardado
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-lg"
                style={{ backgroundColor: "#6B2737" }}
              >
                {saveStatus === "saving"
                  ? "Guardando…"
                  : saveStatus === "error"
                  ? "Error — inténtalo de nuevo"
                  : "Guardar mi estado"}
              </button>
            )}
            <button
              onClick={reset}
              className="text-xs text-[#6B2737]/30 hover:text-[#6B2737]/50 transition-colors py-1"
            >
              ↺ Empezar de nuevo
            </button>
          </div>

          {/* Mosaico emocional */}
          <MosaicoEmocional isSubscriber={isSubscriber} />

        </div>
      </div>
    </>
  )
}
