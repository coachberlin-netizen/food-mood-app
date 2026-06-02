"use client"

import React, { useState, useId, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, Shield, Lock, Eye, ArrowRight, Check, X } from "lucide-react"

// ─── Tipos y constantes ───────────────────────────────────────────────────────

const PROFESSIONAL_TYPES = [
  "Psicóloga / Psicoterapeuta",
  "Nutricionista / Dietista",
  "Psiconutricionista",
  "Médica / Médico de familia",
  "Ginecóloga",
  "Enfermera / Enfermero",
  "Otro profesional de salud",
]

const FAQS = [
  {
    q: "¿Sustituye a mi software de nutrición o historia clínica?",
    a: "No. Food·Mood Pro es una capa complementaria centrada en la dimensión emocional, conductual e interoceptiva del paciente. Funciona junto a tu software de historial clínico, no en su lugar.",
  },
  {
    q: "¿Mis pacientes pagan algo?",
    a: "No. La companion app del paciente es de acceso por invitación y sin coste para ellos. Tú gestionas el acceso desde tu portal profesional y decides a quién vinculas.",
  },
  {
    q: "¿Cómo se protegen los datos de mis pacientes?",
    a: "Cumplimiento RGPD desde el diseño. Datos cifrados en tránsito y en reposo. Hosting en infraestructura europea. Nunca vendemos datos ni los usamos para entrenar modelos de terceros. La IA opera sobre datos del paciente con transparencia explícita (Art. 50 EU AI Act).",
  },
  {
    q: "¿Necesito conocimientos técnicos para usar la plataforma?",
    a: "No. El portal profesional está diseñado para que puedas ver lo que importa en menos de dos minutos antes de una sesión. Incorporación asistida incluida en acceso anticipado.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Sin permanencia, sin penalización. Si cancelas, puedes exportar todos los datos de tus pacientes antes.",
  },
]

// ─── Helpers de animación ─────────────────────────────────────────────────────

const fade = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

// ─── Mockup del dashboard profesional ────────────────────────────────────────

function DashboardMock() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: "#0f0a0d", border: "1px solid rgba(201,168,76,0.18)", fontFamily: "monospace" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#140c10" }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold" style={{ color: "#C9A84C" }}>Food·Mood Pro</span>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>· Portal profesional</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>En línea</span>
        </div>
      </div>

      {/* Paciente header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-white">María T. · 46 años</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(90,155,138,0.2)", color: "#5A9B8A" }}>Sesión 12</span>
        </div>
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>Última entrada hace 2h · 18 registros esta semana</span>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
        {[
          { label: "SN dominante", value: "Ventral", color: "#5A9B8A", sub: "últimas 48h" },
          { label: "Hambre emocional", value: "7.2 / 10", color: "#C9A84C", sub: "↑ desde el lunes" },
          { label: "Granularidad", value: "↗ mejora", color: "#A07BBE", sub: "3 sesiones" },
        ].map((m) => (
          <div key={m.label} className="px-3 py-3" style={{ backgroundColor: "#0f0a0d" }}>
            <p className="text-[8px] mb-1" style={{ color: "rgba(255,255,255,0.32)" }}>{m.label}</p>
            <p className="text-xs font-semibold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Patrón detectado */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(201,168,76,0.55)" }}>Patrón detectado esta semana</p>
        <div className="flex items-start gap-2.5">
          <div className="w-1 h-full rounded-full shrink-0 mt-0.5" style={{ backgroundColor: "#C9A84C", minHeight: 28 }} />
          <p className="text-[10px] font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.75)" }}>
            Hambre emocional alta (≥7) en franja 18:00–19:00h tres días consecutivos. Coincide con registros de estrés laboral.
          </p>
        </div>
      </div>

      {/* Preparación de sesión */}
      <div className="px-4 py-3">
        <p className="text-[8px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>Preparación de sesión · 3 preguntas sugeridas</p>
        {[
          "¿Qué ocurre en tu cuerpo a las 18h que identifies como hambre?",
          "¿Qué has intentado para manejar ese momento? ¿Qué funciona?",
          "¿Qué necesitarías tener a mano en esa franja para sentirte más segura?",
        ].map((q, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5">
            <span className="text-[8px] font-mono shrink-0 mt-0.5" style={{ color: "rgba(201,168,76,0.45)" }}>0{i + 1}</span>
            <p className="text-[9px] font-light" style={{ color: "rgba(245,240,232,0.5)" }}>{q}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Formulario de acceso anticipado ─────────────────────────────────────────

function EarlyAccessForm({ onClose }: { onClose?: () => void }) {
  const id = useId()
  const [form, setForm]     = useState({ name: "", email: "", professional_type: "", patient_count: "", current_tool: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.professional_type) return
    setStatus("loading")
    try {
      const r = await fetch("/api/early-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      setStatus(r.ok ? "ok" : "error")
    } catch {
      setStatus("error")
    }
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm font-light outline-none focus:ring-2 transition-all"
  const inputStyle = { backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#F5F0E8", caretColor: "#C9A84C" }

  if (status === "ok") {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(90,155,138,0.18)", border: "1px solid rgba(90,155,138,0.35)" }}>
          <Check className="w-7 h-7" style={{ color: "#5A9B8A" }} />
        </div>
        <h3 className="font-serif text-xl font-semibold text-white mb-3">Solicitud recibida</h3>
        <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.65)" }}>
          Nos pondremos en contacto en las próximas 48 horas para concretar el acceso y la incorporación. Gracias por confiar en Food·Mood Pro.
        </p>
        {onClose && (
          <button onClick={onClose} className="mt-6 text-sm font-light underline" style={{ color: "rgba(245,240,232,0.4)" }}>Cerrar</button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${id}-name`} className="block text-xs font-medium mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>Nombre *</label>
          <input id={`${id}-name`} value={form.name} onChange={set("name")} required placeholder="Tu nombre" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="block text-xs font-medium mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>Email profesional *</label>
          <input id={`${id}-email`} type="email" value={form.email} onChange={set("email")} required placeholder="tu@consulta.com" className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-type`} className="block text-xs font-medium mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>Tipo de profesional *</label>
        <select id={`${id}-type`} value={form.professional_type} onChange={set("professional_type")} required className={inputClass} style={{ ...inputStyle, backgroundImage: "none" }}>
          <option value="">Selecciona…</option>
          {PROFESSIONAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${id}-patients`} className="block text-xs font-medium mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>Pacientes aprox.</label>
          <input id={`${id}-patients`} value={form.patient_count} onChange={set("patient_count")} placeholder="Ej. 20–40 por mes" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label htmlFor={`${id}-tool`} className="block text-xs font-medium mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>¿Qué herramienta usas hoy?</label>
          <input id={`${id}-tool`} value={form.current_tool} onChange={set("current_tool")} placeholder="Ej. Nutrium, Google Sheets…" className={inputClass} style={inputStyle} />
        </div>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 text-center">Algo salió mal. Inténtalo de nuevo o escríbenos directamente.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        style={{ backgroundColor: "#C9A84C", color: "#0f0a0d" }}
      >
        {status === "loading" ? "Enviando…" : "Solicitar acceso anticipado →"}
      </button>
      <p className="text-[10px] text-center font-light" style={{ color: "rgba(245,240,232,0.3)" }}>
        Sin compromiso. Nos pondremos en contacto en 24–48 h.
      </p>
    </form>
  )
}

// ─── Modal de acceso anticipado ───────────────────────────────────────────────

function EarlyAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-full max-w-xl rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#1a0d14", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#C9A84C" }}>Acceso anticipado</p>
                <h2 className="font-serif text-lg font-semibold text-white leading-snug">Solicita tu acceso — te respondemos en 48h</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" aria-label="Cerrar">
                <X className="w-4 h-4" style={{ color: "rgba(245,240,232,0.45)" }} />
              </button>
            </div>
            <div className="px-6 py-5">
              <EarlyAccessForm onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Formulario inline (hero + CTA final) ────────────────────────────────────

function HeroForm() {
  const id = useId()
  const [form, setForm]     = useState({ name: "", email: "", professional_type: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.professional_type) return
    setStatus("loading")
    try {
      const r = await fetch("/api/early-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      setStatus(r.ok ? "ok" : "error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "ok") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-2xl px-5 py-4"
        style={{ backgroundColor: "rgba(90,155,138,0.12)", border: "1px solid rgba(90,155,138,0.28)" }}
      >
        <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#5A9B8A" }} />
        <div>
          <p className="text-sm font-semibold text-white">Solicitud recibida</p>
          <p className="text-xs font-light mt-0.5" style={{ color: "rgba(245,240,232,0.6)" }}>
            Te contactamos en menos de 48h para concretar la demo. Gracias.
          </p>
        </div>
      </motion.div>
    )
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
  const inputSt  = { backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#F5F0E8", caretColor: "#C9A84C" }
  const labelSt  = { color: "rgba(245,240,232,0.5)" }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 w-full">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-n`} className="block text-[11px] font-medium mb-1.5" style={labelSt}>Nombre *</label>
          <input id={`${id}-n`} value={form.name} onChange={set("name")} required placeholder="Tu nombre" className={inputCls} style={inputSt} />
        </div>
        <div>
          <label htmlFor={`${id}-e`} className="block text-[11px] font-medium mb-1.5" style={labelSt}>Email profesional *</label>
          <input id={`${id}-e`} type="email" value={form.email} onChange={set("email")} required placeholder="tu@consulta.com" className={inputCls} style={inputSt} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-t`} className="block text-[11px] font-medium mb-1.5" style={labelSt}>Especialidad *</label>
        <select id={`${id}-t`} value={form.professional_type} onChange={set("professional_type")} required className={inputCls} style={{ ...inputSt, backgroundImage: "none" }}>
          <option value="">Selecciona…</option>
          {PROFESSIONAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {status === "error" && <p className="text-xs text-red-400">Algo salió mal. Inténtalo de nuevo.</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        style={{ backgroundColor: "#C9A84C", color: "#0f0a0d", boxShadow: "0 0 28px rgba(201,168,76,0.32), 0 4px 14px rgba(0,0,0,0.4)" }}
      >
        {status === "loading" ? "Enviando…" : "Solicitar demo de 15 min →"}
      </button>
      <p className="text-[11px] text-center" style={{ color: "rgba(245,240,232,0.32)" }}>
        Te contactamos en menos de 48h · Sin compromiso · Sin tarjeta
      </p>
    </form>
  )
}

// ─── App Preview ─────────────────────────────────────────────────────────────

const APP_SCREENS = [
  {
    id: "checkin",
    label: "Check-in del paciente",
    desc: "60 segundos al día. El paciente registra hambre, cuerpo, pensamiento y emoción sin necesidad de app ni cuenta.",
    color: "#5A9B8A",
    screen: () => (
      <div className="flex flex-col h-full" style={{ backgroundColor: "#F5F0E8" }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1">
          <span className="text-[9px] font-semibold" style={{ color: "#2d0f16" }}>18:42</span>
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5">{[1,2,3,4].map(i=><div key={i} className="w-0.5 rounded-full" style={{ height: 4+i*1.5, backgroundColor: "#2d0f16", opacity: 0.5 }} />)}</div>
            <div className="w-3 h-1.5 rounded-sm border ml-1" style={{ borderColor: "rgba(45,15,22,0.4)" }}><div className="w-2/3 h-full rounded-sm" style={{ backgroundColor: "#2d0f16", opacity: 0.5 }} /></div>
          </div>
        </div>

        <div className="flex-1 px-5 py-3 flex flex-col gap-3 overflow-hidden">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#5A9B8A" }}>Check-in · hoy</p>
            <p className="text-sm font-serif font-semibold leading-snug" style={{ color: "#2d0f16" }}>¿Cómo está tu cuerpo ahora mismo?</p>
          </div>

          {/* Hambre física */}
          <div className="rounded-xl px-3.5 py-3" style={{ backgroundColor: "white", border: "1px solid rgba(90,155,138,0.18)" }}>
            <p className="text-[9px] font-semibold mb-2" style={{ color: "rgba(45,15,22,0.55)" }}>Hambre física</p>
            <div className="flex gap-1 items-center">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} className="flex-1 rounded-full transition-all" style={{ height: 6, backgroundColor: n <= 3 ? "#5A9B8A" : "rgba(90,155,138,0.15)" }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px]" style={{ color: "rgba(45,15,22,0.3)" }}>Nada</span>
              <span className="text-[8px] font-medium" style={{ color: "#5A9B8A" }}>3 · Leve</span>
              <span className="text-[8px]" style={{ color: "rgba(45,15,22,0.3)" }}>Mucha</span>
            </div>
          </div>

          {/* Estado nervioso */}
          <div className="rounded-xl px-3.5 py-3" style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.1)" }}>
            <p className="text-[9px] font-semibold mb-2" style={{ color: "rgba(45,15,22,0.55)" }}>Estado del sistema nervioso</p>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { l: "Tranquila", c: "#5A9B8A", on: false },
                { l: "Activada", c: "#C9A84C", on: true },
                { l: "Ansiosa", c: "#6B2737", on: false },
                { l: "Agotada", c: "#A07BBE", on: false },
              ].map(({ l, c, on }) => (
                <span key={l} className="text-[8px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: on ? c + "22" : "rgba(45,15,22,0.05)", color: on ? c : "rgba(45,15,22,0.4)", border: `1px solid ${on ? c + "45" : "transparent"}` }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Pensamiento */}
          <div className="rounded-xl px-3.5 py-3" style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.1)" }}>
            <p className="text-[9px] font-semibold mb-1.5" style={{ color: "rgba(45,15,22,0.55)" }}>Pensamiento dominante ahora</p>
            <p className="text-[10px] font-light" style={{ color: "rgba(45,15,22,0.45)" }}>"Necesito comer algo antes de esa reunión"</p>
          </div>

          <button className="w-full py-2.5 rounded-xl text-[11px] font-bold mt-auto" style={{ backgroundColor: "#5A9B8A", color: "white" }}>
            Guardar registro →
          </button>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2"><div className="w-10 h-1 rounded-full" style={{ backgroundColor: "rgba(45,15,22,0.18)" }} /></div>
      </div>
    ),
  },
  {
    id: "panel",
    label: "Panel profesional",
    desc: "Antes de cada sesión, el profesional llega con el contexto de la semana: patrones, señales y tres preguntas listas.",
    color: "#C9A84C",
    screen: () => (
      <div className="flex flex-col h-full" style={{ backgroundColor: "#0f0a0d" }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1">
          <span className="text-[9px] font-semibold text-white opacity-60">9:15</span>
          <div className="flex gap-0.5 items-center">
            {[1,2,3,4].map(i=><div key={i} className="w-0.5 rounded-full bg-white opacity-50" style={{ height: 4+i*1.5 }} />)}
          </div>
        </div>

        <div className="flex-1 px-4 py-2 flex flex-col gap-2.5 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(201,168,76,0.5)" }}>Preparación de sesión</p>
              <p className="text-xs font-semibold text-white mt-0.5">Ana M. · Sesión 7</p>
            </div>
            <span className="text-[8px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(90,155,138,0.2)", color: "#5A9B8A" }}>14 registros</span>
          </div>

          {/* Patrón */}
          <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(201,168,76,0.55)" }}>Patrón esta semana</p>
            <div className="flex items-start gap-2">
              <div className="w-0.5 rounded-full shrink-0 mt-0.5" style={{ minHeight: 24, backgroundColor: "#C9A84C" }} />
              <p className="text-[9px] font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.7)" }}>
                Hambre emocional ≥7 en franja 18–19h, 4 de 5 días laborables. Coincide con pensamiento dominante de estrés laboral.
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { l: "Adherencia", v: "87%", c: "#5A9B8A" },
              { l: "H. emocional", v: "6.8", c: "#C9A84C" },
              { l: "Estado SN", v: "Ventral", c: "#A07BBE" },
            ].map(m => (
              <div key={m.l} className="rounded-lg px-2 py-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <p className="text-[7px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{m.l}</p>
                <p className="text-[10px] font-semibold" style={{ color: m.c }}>{m.v}</p>
              </div>
            ))}
          </div>

          {/* Preguntas */}
          <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>3 preguntas sugeridas</p>
            {[
              "¿Qué sientes en el cuerpo a las 18h que identificas como hambre?",
              "¿Qué has probado para manejar ese momento?",
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-1.5 mb-1.5">
                <span className="text-[7px] font-mono shrink-0 mt-0.5" style={{ color: "rgba(201,168,76,0.4)" }}>0{i+1}</span>
                <p className="text-[8px] font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.45)" }}>{q}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pb-2"><div className="w-10 h-1 rounded-full bg-white opacity-10" /></div>
      </div>
    ),
  },
  {
    id: "herramienta",
    label: "Herramienta de psicología",
    desc: "El profesional asigna ejercicios guiados de TCC o ACT. El paciente los recibe y completa entre sesiones.",
    color: "#A07BBE",
    screen: () => (
      <div className="flex flex-col h-full" style={{ backgroundColor: "#F5F0E8" }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-3 pb-1">
          <span className="text-[9px] font-semibold" style={{ color: "#2d0f16" }}>20:05</span>
          <div className="flex gap-0.5 items-center">
            {[1,2,3,4].map(i=><div key={i} className="w-0.5 rounded-full" style={{ height: 4+i*1.5, backgroundColor: "#2d0f16", opacity: 0.5 }} />)}
          </div>
        </div>

        <div className="flex-1 px-5 py-2 flex flex-col gap-3 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(160,123,190,0.18)", border: "1px solid rgba(160,123,190,0.3)" }}>
              <span className="text-[8px]" style={{ color: "#A07BBE" }}>✦</span>
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "#A07BBE" }}>Asignación · Diario socrático</p>
              <p className="text-[9px]" style={{ color: "rgba(45,15,22,0.4)" }}>Asignada por tu profesional</p>
            </div>
          </div>

          {/* Pregunta principal */}
          <div className="rounded-xl px-4 py-3.5" style={{ backgroundColor: "white", border: "1px solid rgba(160,123,190,0.2)" }}>
            <p className="text-[10px] font-semibold leading-snug" style={{ color: "#2d0f16" }}>
              Cuando sientes esa urgencia de comer por la tarde… ¿qué pensamiento aparece justo antes?
            </p>
          </div>

          {/* Respuesta */}
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "white", border: "1px solid rgba(45,15,22,0.1)", flex: 1 }}>
            <p className="text-[9px] font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.55)" }}>
              "Si no como algo ahora no voy a poder rendir en la reunión. Y luego me arrepiento porque…"
            </p>
            <span className="inline-block w-0.5 h-3 ml-0.5 animate-pulse" style={{ backgroundColor: "#A07BBE", verticalAlign: "middle" }} />
          </div>

          {/* Progreso */}
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-[8px]" style={{ color: "rgba(45,15,22,0.4)" }}>Paso 2 de 4</p>
              <p className="text-[8px] font-medium" style={{ color: "#A07BBE" }}>50%</p>
            </div>
            <div className="w-full rounded-full h-1" style={{ backgroundColor: "rgba(160,123,190,0.15)" }}>
              <div className="h-1 rounded-full w-1/2" style={{ backgroundColor: "#A07BBE" }} />
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl text-[11px] font-bold" style={{ backgroundColor: "#A07BBE", color: "white" }}>
            Continuar →
          </button>
        </div>

        <div className="flex justify-center pb-2"><div className="w-10 h-1 rounded-full" style={{ backgroundColor: "rgba(45,15,22,0.18)" }} /></div>
      </div>
    ),
  },
]

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: 220,
        height: 440,
        borderRadius: 36,
        backgroundColor: "#1a0d14",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.8) inset",
        padding: 2,
      }}
    >
      {/* Inner screen */}
      <div className="w-full h-full rounded-[34px] overflow-hidden relative" style={{ backgroundColor: "#F5F0E8" }}>
        {/* Dynamic island */}
        <div
          className="absolute top-2.5 left-1/2 z-20 -translate-x-1/2"
          style={{ width: 72, height: 9, borderRadius: 10, backgroundColor: "#0f0a0d" }}
        />
        {children}
      </div>

      {/* Side buttons */}
      <div className="absolute -left-[3px] top-20 w-1 h-7 rounded-l-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute -left-[3px] top-32 w-1 h-10 rounded-l-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute -right-[3px] top-24 w-1 h-14 rounded-r-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
    </div>
  )
}

function AppPreviewSection() {
  const [active, setActive] = useState(0)
  const [dir, setDir]       = useState(1)

  const go = useCallback((next: number) => {
    setDir(next > active ? 1 : -1)
    setActive(next)
  }, [active])

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1)
      setActive(prev => (prev + 1) % APP_SCREENS.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const Screen = APP_SCREENS[active].screen

  return (
    <section aria-label="Cómo funciona en la práctica" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0f0a0d" }}>
      <div className="max-w-5xl mx-auto">

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
            En la práctica
          </motion.p>
          <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
            Así funciona{" "}
            <em className="font-light italic" style={{ color: "#C9A84C" }}>el ciclo completo.</em>
          </motion.h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Teléfono */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="shrink-0"
          >
            <PhoneFrame>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -30 }}
                  transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <Screen />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
              {APP_SCREENS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => go(i)}
                  aria-label={s.label}
                  className="rounded-full transition-all"
                  style={{
                    width: i === active ? 20 : 6,
                    height: 6,
                    backgroundColor: i === active ? APP_SCREENS[i].color : "rgba(255,255,255,0.18)",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Texto + pasos */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3">
              {APP_SCREENS.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => go(i)}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="text-left rounded-2xl px-5 py-4 transition-all w-full"
                  style={{
                    backgroundColor: i === active ? "rgba(255,255,255,0.07)" : "transparent",
                    border: `1px solid ${i === active ? s.color + "40" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold font-mono"
                      style={{ backgroundColor: s.color + (i === active ? "28" : "14"), color: s.color }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold" style={{ color: i === active ? "white" : "rgba(245,240,232,0.5)" }}>
                      {s.label}
                    </p>
                  </div>
                  <AnimatePresence>
                    {i === active && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm font-light leading-relaxed pl-8 overflow-hidden"
                        style={{ color: "rgba(245,240,232,0.55)" }}
                      >
                        {s.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xs font-light mt-6 pl-1"
              style={{ color: "rgba(245,240,232,0.28)" }}
            >
              El paciente usa su navegador — sin instalar nada. El profesional accede desde el portal web.
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  )
}

function FaqItem({ faq, isOpen, onToggle }: { faq: (typeof FAQS)[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(107,39,55,0.1)" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between py-5 text-left group" aria-expanded={isOpen}>
        <span className="text-base md:text-lg font-serif pr-8 group-hover:text-[#6B2737] transition-colors" style={{ color: "#2d0f16" }}>{faq.q}</span>
        <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-300" style={{ color: isOpen ? "#C9A84C" : "rgba(107,39,55,0.35)", transform: isOpen ? "rotate(180deg)" : undefined }} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }} className="overflow-hidden">
            <p className="pb-5 text-sm font-light leading-relaxed sm:pr-10" style={{ color: "rgba(107,39,55,0.65)" }}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Onboarding steps ────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
  {
    n: 1,
    title: "Solicitas acceso",
    desc: "Rellenas el formulario en 2 minutos. Nos ponemos en contacto en menos de 48h para concretar la incorporación y resolver cualquier duda.",
    time: "2 min de tu tiempo",
    color: "#C9A84C",
  },
  {
    n: 2,
    title: "Configuras tu perfil",
    desc: "Defines tu especialidad y flujo de trabajo en el portal profesional. Incorporación asistida incluida. Sin curva de aprendizaje.",
    time: "5 min de configuración",
    color: "#5A9B8A",
  },
  {
    n: 3,
    title: "Invitas a tu primer paciente",
    desc: "Generas un código desde tu portal y lo compartes. Tu paciente empieza a registrar desde el primer día. Sin app store, desde el navegador.",
    time: "30 segundos de invitación",
    color: "#A07BBE",
  },
]

function OnboardingSteps({ onRequestAccess }: { onRequestAccess: () => void }) {
  return (
    <section aria-label="Cómo empezar" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0f0a0d" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
            Empieza en menos de 10 minutos
          </motion.p>
          <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
            ¿Qué ocurre después{" "}
            <em className="font-light italic" style={{ color: "#C9A84C" }}>de clicar?</em>
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {ONBOARDING_STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="rounded-2xl p-7"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${step.color}25` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: step.color + "18", border: `1px solid ${step.color}38` }}
              >
                <span className="text-sm font-bold font-mono" style={{ color: step.color }}>{step.n}</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-white mb-3 leading-snug">{step.title}</h3>
              <p className="text-sm font-light leading-relaxed mb-5" style={{ color: "rgba(245,240,232,0.55)" }}>{step.desc}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color + "80" }}>{step.time}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onClick={onRequestAccess}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#C9A84C", color: "#0f0a0d", boxShadow: "0 0 28px rgba(201,168,76,0.3), 0 4px 16px rgba(0,0,0,0.35)" }}
          >
            Solicitar acceso — respuesta en 48h
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// ─── Toggle precio ────────────────────────────────────────────────────────────

type Plan = {
  name: string
  monthly: number | null
  description: string
  patients: string
  features: string[]
  highlight: boolean
  cta: string
}

function PricingSection({ onRequestAccess }: { onRequestAccess: () => void }) {
  const [annual, setAnnual] = useState(false)

  const plans: Plan[] = [
    {
      name: "Profesional",
      monthly: 39,
      description: "Para profesionales independientes con consulta propia.",
      patients: "Hasta 40 pacientes",
      features: ["Portal profesional completo", "Companion app para cada paciente", "Resumen semanal de sesión", "Patrones y alertas adaptativas", "Soporte por email"],
      highlight: false,
      cta: "Solicitar acceso →",
    },
    {
      name: "Clínica",
      monthly: 99,
      description: "Para equipos multiprofesionales y centros de salud.",
      patients: "Pacientes ilimitados",
      features: ["Todo lo de Profesional", "Hasta 5 profesionales", "Panel de equipo compartido", "Exportación de datos", "Soporte prioritario + incorporación"],
      highlight: true,
      cta: "Solicitar acceso →",
    },
    {
      name: "Institución",
      monthly: null,
      description: "Para hospitales, clínicas universitarias y redes de salud.",
      patients: "Escala personalizada",
      features: ["Todo lo de Clínica", "Profesionales ilimitados", "Integración con HIS / EMR", "SLA dedicado", "Formación presencial del equipo", "Precio a medida"],
      highlight: false,
      cta: "Hablemos →",
    },
  ]

  return (
    <section id="precios" aria-label="Precios" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>Precios</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }} className="font-serif text-3xl md:text-4xl leading-tight mb-6" style={{ color: "#2d0f16" }}>
            Precios de referencia.{" "}
            <em className="font-light italic" style={{ color: "#6B2737" }}>En esta fase, acceso por solicitud.</em>
          </motion.h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full" style={{ backgroundColor: "rgba(107,39,55,0.07)", border: "1px solid rgba(107,39,55,0.1)" }}>
            <button onClick={() => setAnnual(false)} className="px-4 py-2 rounded-full text-xs font-semibold transition-all" style={{ backgroundColor: !annual ? "white" : "transparent", color: !annual ? "#2d0f16" : "rgba(107,39,55,0.5)", boxShadow: !annual ? "0 1px 4px rgba(0,0,0,0.12)" : undefined }}>Mensual</button>
            <button onClick={() => setAnnual(true)}  className="px-4 py-2 rounded-full text-xs font-semibold transition-all" style={{ backgroundColor: annual ? "white" : "transparent", color: annual ? "#2d0f16" : "rgba(107,39,55,0.5)", boxShadow: annual ? "0 1px 4px rgba(0,0,0,0.12)" : undefined }}>
              Anual <span className="ml-1 text-[10px] font-bold" style={{ color: "#5A9B8A" }}>–2 meses</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {plans.map((plan) => {
            const price = plan.monthly !== null
              ? (annual ? Math.round(plan.monthly * 10 / 12) : plan.monthly)
              : null
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-2xl p-7 flex flex-col relative overflow-hidden"
                style={{
                  backgroundColor: plan.highlight ? "#2d0f16" : "white",
                  border: plan.highlight ? "1px solid rgba(201,168,76,0.3)" : "1px solid rgba(107,39,55,0.1)",
                }}
              >
                {plan.highlight && (
                  <span className="absolute top-5 right-5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
                    Más popular
                  </span>
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: plan.highlight ? "rgba(201,168,76,0.6)" : "rgba(107,39,55,0.4)" }}>{plan.name}</p>
                <div className="flex items-end gap-1.5 mb-1">
                  {price !== null ? (
                    <>
                      <span className="font-serif font-bold leading-none" style={{ fontSize: "2.4rem", color: plan.highlight ? "#F5F0E8" : "#2d0f16" }}>{price}€</span>
                      <span className="text-xs font-light mb-2" style={{ color: plan.highlight ? "rgba(245,240,232,0.4)" : "rgba(107,39,55,0.4)" }}>/mes</span>
                    </>
                  ) : (
                    <span className="font-serif font-bold leading-none" style={{ fontSize: "1.9rem", color: "#2d0f16" }}>A medida</span>
                  )}
                </div>
                {annual && plan.monthly !== null && <p className="text-[10px] mb-1" style={{ color: plan.highlight ? "rgba(245,240,232,0.35)" : "rgba(107,39,55,0.35)" }}>Facturado anualmente ({plan.monthly * 10}€/año)</p>}
                <p className="text-xs font-light mb-1.5" style={{ color: plan.highlight ? "rgba(245,240,232,0.55)" : "rgba(107,39,55,0.55)" }}>{plan.description}</p>
                <p className="text-xs font-semibold mb-5 pb-5" style={{ color: plan.highlight ? "#C9A84C" : "#6B2737", borderBottom: `1px solid ${plan.highlight ? "rgba(201,168,76,0.12)" : "rgba(107,39,55,0.08)"}` }}>{plan.patients}</p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm font-light">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: plan.highlight ? "#5A9B8A" : "#6B2737" }} />
                      <span style={{ color: plan.highlight ? "rgba(245,240,232,0.75)" : "rgba(45,15,22,0.7)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                {/* TODO Institución: reemplazar onRequestAccess por flujo de demo/contacto enterprise cuando esté listo */}
                <button
                  onClick={onRequestAccess}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    backgroundColor: plan.highlight ? "#C9A84C" : "rgba(107,39,55,0.08)",
                    color: plan.highlight ? "#0f0a0d" : "#6B2737",
                    border: plan.highlight ? undefined : "1px solid rgba(107,39,55,0.18)",
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            )
          })}
        </div>

        <p className="text-xs text-center font-light" style={{ color: "rgba(107,39,55,0.4)" }}>
          Las plazas de acceso anticipado incluyen condiciones especiales a cambio de feedback. Sin compromiso de permanencia.
        </p>
      </div>
    </section>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ProLanding() {
  const [modalOpen, setModalOpen] = useState(false)
  const [openFaqs, setOpenFaqs]   = useState<Set<number>>(new Set())
  const toggleFaq = (i: number) => setOpenFaqs(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })

  const open = () => setModalOpen(true)

  return (
    <main className="min-h-screen overflow-hidden font-sans font-light" style={{ backgroundColor: "#F5F0E8" }}>
      <EarlyAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ── 1. HERO ───────────────────────────────────────────────────────────── */}
      <section aria-label="Hero" className="relative overflow-hidden" style={{ backgroundColor: "#0f0a0d" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 110% 70% at 65% 25%, rgba(107,39,55,0.32) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 95% 90%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

            {/* Copy */}
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.28em]" style={{ color: "#C9A84C" }}>
                  Acceso anticipado<span className="hidden sm:inline"> · Plazas limitadas</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium mb-4 tracking-wide" style={{ color: "rgba(245,240,232,0.6)" }}>
                Psicología práctica para consultas nutricionales
              </p>

              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6" style={{ letterSpacing: "-0.02em" }}>
                La capa psicológica que le faltaba{" "}
                <em className="font-light italic" style={{ color: "#C9A84C" }}>al software nutricional.</em>
              </h1>

              <p className="text-base md:text-lg font-light leading-relaxed mb-10" style={{ color: "rgba(245,240,232,0.65)", maxWidth: "52ch" }}>
                Food·Mood Pro es una plataforma profesional que integra psicología práctica, IA y seguimiento entre sesiones para ayudarte a trabajar adherencia, hambre emocional, pensamientos, señales corporales y cambio de conducta con datos reales antes de cada consulta.
              </p>

              <HeroForm />

              {/* Trust signals + scroll link */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                {["RGPD por diseño", "Sin coste para pacientes", "No es dispositivo médico", "EU AI Act"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-[10px] font-light" style={{ color: "rgba(245,240,232,0.35)" }}>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(245,240,232,0.22)" }} />
                    {t}
                  </span>
                ))}
                <button
                  onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-1 text-[10px] font-light transition-opacity hover:opacity-70 bg-transparent border-none cursor-pointer ml-auto"
                  style={{ color: "rgba(245,240,232,0.38)" }}
                >
                  Ver cómo funciona <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(201,168,76,0.4)" }}>Vista profesional · Preparación de sesión</p>
              <DashboardMock />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.07)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-0">
          {[
            { text: "Psicólogas · Nutricionistas · Psiconutricionistas" },
            { text: "Datos cifrados · Hosting EU" },
            { text: "IA transparente · Art. 50 EU AI Act" },
            { text: "Sin coste para el paciente" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-5 md:border-r last:border-r-0" style={{ borderColor: "rgba(107,39,55,0.1)" }}>
              <span className="text-xs font-medium" style={{ color: "rgba(107,39,55,0.68)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. EL PROBLEMA ────────────────────────────────────────────────────── */}
      <section id="como-funciona" aria-label="El problema" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "rgba(107,39,55,0.4)" }}>El problema</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl leading-tight mb-6" style={{ color: "#2d0f16", maxWidth: "22ch" }}>
              El software nutricional cubre lo que se mide.
            </motion.h2>
            <motion.p variants={fade} className="text-base md:text-lg font-light leading-relaxed mb-14" style={{ color: "rgba(107,39,55,0.65)", maxWidth: "60ch" }}>
              La psicología del cambio ocurre donde nadie tiene visibilidad.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {/* Lo que ya tienes */}
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl p-7" style={{ backgroundColor: "rgba(90,155,138,0.07)", border: "1px solid rgba(90,155,138,0.18)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: "#5A9B8A" }}>Lo que ya tienes cubierto</p>
              {["Plan nutricional", "Macros y micronutrientes", "Antropometría", "Agenda de citas", "Historia clínica"].map(item => (
                <div key={item} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(90,155,138,0.1)" }}>
                  <Check className="w-4 h-4 shrink-0" style={{ color: "#5A9B8A" }} />
                  <span className="text-sm font-light" style={{ color: "rgba(45,15,22,0.7)" }}>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Lo que no ves */}
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl p-7" style={{ backgroundColor: "rgba(107,39,55,0.04)", border: "1px solid rgba(107,39,55,0.14)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: "#6B2737" }}>Lo que pasa entre sesiones</p>
              {["El atracón del martes a las 7 pm", "La ansiedad antes de comer", "La desconexión corporal", "Los patrones de pensamiento alrededor de la comida", "La adherencia real (no la declarada)"].map(item => (
                <div key={item} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(107,39,55,0.07)" }}>
                  <span className="text-xs font-mono shrink-0" style={{ color: "rgba(107,39,55,0.3)" }}>?</span>
                  <span className="text-sm font-light" style={{ color: "rgba(107,39,55,0.65)" }}>{item}</span>
                </div>
              ))}
              <div className="mt-5 rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(107,39,55,0.07)" }}>
                <p className="text-xs font-light italic" style={{ color: "rgba(107,39,55,0.55)" }}>Vive en WhatsApp, en la memoria y en notas sueltas.</p>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl px-8 py-8 text-center" style={{ backgroundColor: "#2d0f16" }}>
            <p className="font-serif text-xl md:text-2xl text-white leading-relaxed">
              Tus pacientes no fallan por falta de información.{" "}
              <em className="font-light italic" style={{ color: "#C9A84C" }}>Fallan por lo que sienten, repiten y no consiguen ver.</em>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 3. LA SOLUCIÓN ───────────────────────────────────────────────────── */}
      <section aria-label="La solución" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0f0a0d" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>La solución</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Tres resultados.{" "}
              <em className="font-light italic" style={{ color: "#C9A84C" }}>Un flujo integrado.</em>
            </motion.h2>
          </motion.div>

          {/* 3 beneficios */}
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              {
                num: "01",
                label: "Mejora la adherencia",
                body: "Detecta qué ocurre entre sesiones: bloqueos, pensamientos repetidos, hambre emocional, momentos críticos y señales tempranas de abandono. Sin depender de lo que el paciente recuerda contarte.",
                color: "#5A9B8A",
              },
              {
                num: "02",
                label: "Prepara mejores consultas",
                body: "Llega a sesión con resumen semanal automático, tres patrones relevantes de la semana y preguntas sugeridas listas para usar. En menos de dos minutos.",
                color: "#C9A84C",
              },
              {
                num: "03",
                label: "Aplica psicología sin complicar tu flujo",
                body: "Usa herramientas guiadas basadas en diario socrático, defusión cognitiva, autocompasión, valores y entrevista motivacional. La IA facilita el proceso; tú supervisas y decides.",
                color: "#A07BBE",
              },
            ].map((b, i) => (
              <motion.div
                key={b.num}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="rounded-2xl p-7"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: `1px solid ${b.color}35` }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: b.color + "22", border: `1px solid ${b.color}45` }}>
                  <span className="text-xs font-bold font-mono" style={{ color: b.color }}>{b.num}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3 leading-snug">{b.label}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.55)" }}>{b.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                num: "01",
                title: "Check-in conductual del paciente",
                desc: "El paciente registra diariamente: hambre física y emocional, estado del sistema nervioso, pensamiento dominante y contexto. 60–90 segundos. Sin fricción. Sin app store.",
                color: "#5A9B8A",
                tags: ["Hambre", "Cuerpo", "Pensamiento", "Conducta", "Adherencia"],
              },
              {
                num: "02",
                title: "Panel profesional de patrones",
                desc: "Evolución temporal, patrones conductuales detectados por IA, alertas suaves y una vista consolidada de todos tus pacientes ordenada por actividad reciente.",
                color: "#C9A84C",
                tags: ["Patrones", "Bloqueos", "Evolución", "Señales de cambio"],
              },
              {
                num: "03",
                title: "Herramientas de psicología práctica",
                desc: "Diario socrático, defusión cognitiva, granularidad emocional, autocompasión y clarificación de valores. La IA facilita el ejercicio; el profesional supervisa el proceso.",
                color: "#A07BBE",
                tags: ["TCC", "ACT", "Autocompasión", "Valores", "EM"],
              },
              {
                num: "04",
                title: "Preparación automática de sesión",
                desc: "Antes de cada sesión: resumen semanal, tres patrones detectados, tres preguntas sugeridas y puntos de intervención priorizados. En menos de dos minutos.",
                color: "#6B2737",
                tags: ["Resumen", "Patrones", "Preguntas", "Intervención"],
              },
              {
                num: "05",
                title: "Asignaciones terapéuticas",
                desc: "Asigna herramientas específicas entre sesiones con instrucción personalizada. El paciente las recibe en su app. Tú ves la adherencia y los resultados antes de la siguiente consulta.",
                color: "#5A9B8A",
                tags: ["Guía activa", "Adherencia", "Seguimiento", "Conducta"],
              },
            ].map((mod, i) => (
              <motion.div
                key={mod.num}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.5 }}
                className="rounded-2xl p-7"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: `1px solid ${mod.color}32` }}
              >
                <div className="flex flex-col gap-2 mb-5">
                  <span className="font-mono text-[10px]" style={{ color: `${mod.color}80` }}>{mod.num}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tags.map(t => (
                      <span key={t} className="text-[8px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>{t}</span>
                    ))}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-white leading-snug">{mod.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.55)" }}>{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3.5. APP PREVIEW ─────────────────────────────────────────────────── */}
      <AppPreviewSection />

      {/* ── 4. BASES CIENTÍFICAS ──────────────────────────────────────────────── */}
      <section aria-label="Bases científicas" className="py-20 md:py-24 px-6" style={{ backgroundColor: "#f7f4ef" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>Fundamento clínico</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl leading-tight" style={{ color: "#2d0f16" }}>
              Marcos clínicos que ya usas.{" "}
              <em className="font-light italic" style={{ color: "#6B2737" }}>Integrados en el flujo de trabajo.</em>
            </motion.h2>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {[
              { name: "Lisa Feldman Barrett", area: "Teoría de las emociones construidas · Granularidad emocional" },
              { name: "Stephen Porges", area: "Teoría polivagal · Sistema nervioso autónomo" },
              { name: "A.D. Craig / Sahib Khalsa", area: "Interocepción · Señales corporales" },
              { name: "Steven Hayes", area: "ACT · Defusión cognitiva · Valores" },
              { name: "Kristin Neff", area: "Autocompasión · Compasión hacia una misma" },
              { name: "Miller & Rollnick", area: "Entrevista motivacional" },
              { name: "Eje intestino–cerebro", area: "Microbiota · Comunicación bidireccional" },
            ].map((ref, i) => (
              <motion.div
                key={ref.name}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-xl px-5 py-4"
                style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.09)" }}
              >
                <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>{ref.name}</p>
                <p className="text-[10px] font-light mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>{ref.area}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CUMPLIMIENTO EUROPEO ───────────────────────────────────────────── */}
      <section aria-label="Cumplimiento europeo" className="py-20 md:py-24 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>Confianza y cumplimiento</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl leading-tight" style={{ color: "#2d0f16" }}>
              Diseñado para cumplir.{" "}
              <em className="font-light italic" style={{ color: "#6B2737" }}>No para aparentarlo.</em>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: Shield, title: "No es dispositivo médico", body: "Fuera del alto riesgo EU AI Act. Herramienta de apoyo clínico, no de diagnóstico automatizado." },
              { Icon: Eye, title: "Transparencia Art. 50", body: "El paciente sabe en todo momento que interactúa con IA. Sin opacidad, sin sorpresas." },
              { Icon: Lock, title: "RGPD por diseño", body: "Datos cifrados. Hosting europeo. Nunca entrenamos modelos de terceros con datos de pacientes." },
              { Icon: Shield, title: "Profesional siempre en el centro", body: "La IA facilita, sugiere y detecta. La decisión clínica es siempre tuya." },
            ].map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl p-5"
                style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.08)" }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(107,39,55,0.07)" }}>
                  <Icon className="w-4 h-4" style={{ color: "#6B2737" }} />
                </div>
                <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: "#2d0f16" }}>{title}</h3>
                <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.55)" }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. POR QUÉ DIFERENCIARTE ─────────────────────────────────────────── */}
      <section aria-label="Por qué diferenciarte" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>Tu diferencial</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-white leading-tight">
              El mercado de nutrición está saturado.{" "}
              <em className="font-light italic" style={{ color: "#C9A84C" }}>Lo que te diferencia no es lo que recetas — es lo que ves y aplicas entre sesiones.</em>
            </motion.h2>
          </motion.div>

          <div className="flex flex-col gap-0">
            {[
              { label: "Diferenciación", body: "Ofreces algo que muy pocos profesionales tienen: visibilidad real de lo que ocurre entre sesiones." },
              { label: "Adherencia", body: "Pacientes que entienden sus patrones conductuales y corporales mantienen los cambios. No porque tengan más fuerza de voluntad, sino porque tienen más información." },
              { label: "Sesiones más profundas", body: "Llegas a la sesión con datos de la semana. Sin depender de lo que el paciente recuerda —o quiere contar." },
              { label: "Retención", body: "Pacientes que sienten que su profesional los ve entre sesiones no se van. La herramienta crea un vínculo continuo." },
              { label: "Guía activa", body: "No solo ves lo que pasa entre sesiones. Puedes guiarlo. Las asignaciones terapéuticas llevan tu criterio clínico al momento exacto en que el paciente lo necesita." },
              { label: "Resultados sostenibles", body: "La adherencia a largo plazo viene de la comprensión, no de la restricción. Tu consulta trabaja con la psicología del cambio, no contra ella." },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="flex flex-col sm:flex-row gap-1 sm:gap-7 py-7 sm:py-8"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="font-serif text-sm font-semibold sm:shrink-0 sm:w-28 sm:pt-0.5" style={{ color: "#C9A84C" }}>{item.label}</span>
                <p className="text-base font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.65)" }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ONBOARDING STEPS ─────────────────────────────────────────────── */}
      <OnboardingSteps onRequestAccess={open} />

      {/* ── 8. PRECIOS ──────────────────────────────────────────────────────── */}
      <PricingSection onRequestAccess={open} />

      {/* ── 8.5. PROTOCOLO CORTISOL ──────────────────────────────────────────── */}
      <section aria-label="Protocolo Cortisol" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Protocolo clínico · 28 días
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl leading-tight" style={{ color: "#2d0f16" }}>
              Sin regular el estrés, la nutrición{" "}
              <em className="font-light italic" style={{ color: "#6B2737" }}>se queda a medias.</em>
            </motion.h2>
            <motion.p variants={fade} className="mt-5 text-lg font-light leading-relaxed max-w-2xl" style={{ color: "rgba(45,15,22,0.65)" }}>
              Food·Mood Pro convierte el cortisol en una variable clínica accionable dentro del flujo de consulta.
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-base font-light leading-relaxed max-w-3xl mb-14"
            style={{ color: "rgba(45,15,22,0.6)" }}
          >
            La mayoría de los planes nutricionales ignoran el impacto del estrés crónico sobre la adherencia, el hambre emocional y el metabolismo. Food·Mood Pro integra evaluación del eje HPA, nutrición adaptógena, rutinas de regulación, higiene del sueño y seguimiento con IA en un protocolo clínico de 28 días que el profesional activa en segundos.
          </motion.p>

          {/* Efecto dominó */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-14">
            {[
              { num: "01", label: "Cortisol elevado", body: "Antojos e impulsos alimentarios" },
              { num: "02", label: "HPA activado",     body: "Digestión comprometida" },
              { num: "03", label: "Sueño alterado",   body: "Ghrelina / leptina desreguladas" },
              { num: "04", label: "Estrés crónico",   body: "Inflamación silenciosa" },
              { num: "05", label: "Desconexión",      body: "Adherencia imposible" },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl px-4 py-5"
                style={{ background: "white", border: "1px solid rgba(107,39,55,0.1)" }}
              >
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>{item.num}</p>
                <p className="text-sm font-semibold mb-1 leading-tight" style={{ color: "#6B2737" }}>{item.label}</p>
                <p className="text-xs font-light leading-snug" style={{ color: "rgba(45,15,22,0.55)" }}>{item.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl px-8 py-8 mb-10"
            style={{ background: "#2d0f16", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>Incluido en Food·Mood Pro</p>
                <h3 className="font-serif text-2xl font-bold text-white mb-3">Protocolo Cortisol</h3>
                <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "rgba(245,240,232,0.6)" }}>
                  Cuestionario de estrés · Nutrición adaptógena · Rutinas de relajación · Higiene de sueño · Seguimiento adaptativo con IA.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["28 días", "5 etapas", "Activa en un clic"].map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-60">
                {[
                  { stage: 1, name: "Evaluación del eje HPA",          days: "1-7" },
                  { stage: 2, name: "Nutrición adaptógena",            days: "8-14" },
                  { stage: 3, name: "Rutinas de regulación",           days: "15-19" },
                  { stage: 4, name: "Higiene de sueño y cronobiología", days: "20-24" },
                  { stage: 5, name: "Seguimiento y ajuste con IA",     days: "25-28" },
                ].map(s => (
                  <div key={s.stage} className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(201,168,76,0.15)", fontSize: "8px", fontWeight: 700, color: "#C9A84C" }}
                    >
                      {s.stage}
                    </span>
                    <p className="text-[10px] font-light" style={{ color: "rgba(245,240,232,0.55)" }}>
                      <span className="font-medium" style={{ color: "rgba(245,240,232,0.8)" }}>{s.name}</span>
                      {" · "}días {s.days}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Para nutricionistas */}
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              "No solo diseñes dietas. Diseña regulación.",
              "Incluye estrés, sueño y carga emocional en el mismo protocolo clínico.",
            ].map((quote, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="flex-1 rounded-xl px-5 py-4"
                style={{ background: "white", border: "1px solid rgba(107,39,55,0.1)", borderLeft: "3px solid #C9A84C" }}
              >
                <p className="text-sm font-light leading-relaxed italic" style={{ color: "#6B2737" }}>
                  &ldquo;{quote}&rdquo;
                </p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. TESTIMONIOS PLACEHOLDER ───────────────────────────────────────── */}
      <section aria-label="Lo que dicen los primeros usuarios" className="py-14 px-6" style={{ backgroundColor: "#f7f4ef", borderTop: "1px solid rgba(107,39,55,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-8 text-center" style={{ color: "rgba(107,39,55,0.35)" }}>Primeras voces</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: "Por primera vez tengo datos de lo que pasa entre sesiones, no solo lo que el paciente recuerda el día de la cita.", role: "Psiconutricionista, Madrid" },
              { quote: "La prep de sesión me ahorra 15 minutos de revisión y me lleva directamente a los patrones relevantes de la semana.", role: "Psicóloga clínica, Barcelona" },
              { quote: "Mis pacientes se sienten acompañadas entre visitas. Eso cambia la relación terapéutica.", role: "Nutricionista, Bilbao" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.08)" }}
              >
                <p className="text-sm font-light leading-relaxed italic mb-5" style={{ color: "rgba(107,39,55,0.7)" }}>&ldquo;{t.quote}&rdquo;</p>
                <p className="text-[10px] font-medium" style={{ color: "rgba(107,39,55,0.4)" }}>{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ───────────────────────────────────────────────────────────── */}
      <section aria-label="Preguntas frecuentes" className="py-20 md:py-28 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>Preguntas frecuentes</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl leading-tight" style={{ color: "#2d0f16" }}>Las dudas habituales.</motion.h2>
          </motion.div>
          {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} isOpen={openFaqs.has(i)} onToggle={() => toggleFaq(i)} />)}
        </div>
      </section>

      {/* ── 11. PULL QUOTE ───────────────────────────────────────────────────── */}
      <section aria-label="Propuesta de valor" className="py-16 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-3xl mx-auto">
          <motion.blockquote
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl px-8 py-10"
            style={{ borderTop: "1px solid rgba(107,39,55,0.12)", borderRight: "1px solid rgba(107,39,55,0.12)", borderBottom: "1px solid rgba(107,39,55,0.12)", borderLeft: "5px solid #6B2737", boxShadow: "0 4px 24px rgba(107,39,55,0.08)" }}
          >
            <p className="font-serif text-xl md:text-2xl leading-relaxed" style={{ color: "#6B2737" }}>
              Food·Mood Pro no sustituye tu criterio profesional. Te da la capa psicológica y conductual que normalmente se pierde entre una consulta y la siguiente.
            </p>
          </motion.blockquote>
        </div>
      </section>

      {/* ── 12. CTA FINAL ────────────────────────────────────────────────────── */}
      <section id="acceso" aria-label="Solicitar acceso" className="py-24 md:py-32 px-6" style={{ backgroundColor: "#0f0a0d" }}>
        <div className="max-w-xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.2em] text-center" style={{ color: "rgba(201,168,76,0.45)" }}>Acceso anticipado</motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight text-center" style={{ letterSpacing: "-0.02em" }}>
              La capa psicológica que le faltaba.{" "}
              <em className="font-light italic" style={{ color: "#C9A84C" }}>Ahora con plazas abiertas.</em>
            </motion.h2>
            <motion.p variants={fade} className="text-sm font-light text-center" style={{ color: "rgba(245,240,232,0.5)" }}>
              Demo de 15 min personalizada · Incorporación asistida · Sin permanencia
            </motion.p>
            <motion.div variants={fade}>
              <HeroForm />
            </motion.div>
            <motion.div variants={fade} className="text-center">
              <Link href="/pro/login" className="text-xs font-light transition-opacity hover:opacity-60" style={{ color: "rgba(245,240,232,0.3)" }}>
                Ya tengo acceso → Entrar al portal
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
