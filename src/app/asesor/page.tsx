"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Send, Loader2, Lock, Sparkles, Clock,
  AlertTriangle, Phone, ChevronDown,
  Mic, MicOff, Volume2, Square,
} from "lucide-react"
import Link from "next/link"
import { useQuizStore } from "@/store/useQuizStore"
import type { AgentResponse } from "@/agent/schema"

// Extrae el texto legible de una respuesta del agente para TTS.
// Devuelve null para derivar (sensibilidad clínica — el usuario lee a su ritmo).
function extractTTSText(r: AgentResponse): string | null {
  switch (r.modo) {
    case "respuesta_libre":
      return r.texto
    case "necesito_mas_contexto":
      return r.pregunta
    case "recomendacion":
      return `${r.microcontenido.porque} ${r.microaccion.titulo}: ${r.microaccion.descripcion}`
    case "derivar":
      return null
  }
}

// ── Mood config ───────────────────────────────────────────────────────────────

const MOODS = [
  { id: "Activación", label: "Activación" },
  { id: "Calma",      label: "Calma" },
  { id: "Focus",      label: "Foco" },
  { id: "Social",     label: "Social" },
  { id: "Reset",      label: "Restauración" },
  { id: "Confort",    label: "Confort" },
]

const MOOD_FROM_QUIZ: Record<string, string> = {
  activacion: "Activación",
  calma:      "Calma",
  focus:      "Focus",
  social:     "Social",
  reset:      "Reset",
  confort:    "Confort",
}

const MONTHLY_LIMIT = 100

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatMessage =
  | { role: "user";      content: string }
  | { role: "assistant"; agentResponse: AgentResponse }
  | { role: "error";     content: string }

type AccessState = "idle" | "loading" | "unauthenticated" | "no-subscription" | "subscribed"

// ── Atoms ─────────────────────────────────────────────────────────────────────

function EvidenceBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    A: { bg: "rgba(34,197,94,0.12)",   fg: "#16a34a" },
    B: { bg: "rgba(59,130,246,0.12)",  fg: "#2563eb" },
    C: { bg: "rgba(245,158,11,0.12)",  fg: "#d97706" },
    D: { bg: "rgba(156,163,175,0.12)", fg: "#6b7280" },
  }
  const { bg, fg } = map[level] ?? map.D
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: bg, color: fg }}
    >
      Evidencia {level}
    </span>
  )
}

function PalancaChip({ label }: { label: string }) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: "rgba(107,39,55,0.07)", color: "rgba(45,15,22,0.7)" }}
    >
      {label}
    </span>
  )
}

// ── Response cards ────────────────────────────────────────────────────────────

function RecomendacionCard({ r }: { r: Extract<AgentResponse, { modo: "recomendacion" }> }) {
  const [showIng,  setShowIng]  = useState(false)
  const [showWarn, setShowWarn] = useState(false)

  const warnings = r.advertencias.filter(a => !a.startsWith("Este contenido es orientativo"))

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: "#fff",
        borderColor: "rgba(45,15,22,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Cabecera receta */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-serif font-black text-base leading-snug"
            style={{ color: "#2d0f16" }}
          >
            {r.receta.titulo}
          </h3>
          <span
            className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(201,168,76,0.12)",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            {r.receta.categoria_food_mood}
          </span>
        </div>
        <p className="mt-1.5 text-[11px]" style={{ color: "rgba(45,15,22,0.4)" }}>
          <Clock className="inline w-3 h-3 mr-1 -mt-px" />
          {r.receta.tiempo_min} min
        </p>
      </div>

      {/* Ingredientes (colapsables) */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setShowIng(v => !v)}
          className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: "#6B2737" }}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showIng ? "rotate-180" : ""}`} />
          {showIng ? "Ocultar ingredientes" : `Ingredientes (${r.receta.ingredientes.length})`}
        </button>
        {showIng && (
          <ul className="mt-2 space-y-1">
            {r.receta.ingredientes.map((ing, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm font-light"
                style={{ color: "rgba(45,15,22,0.75)" }}
              >
                <span
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                {ing}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pasos */}
      <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(45,15,22,0.06)" }}>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mt-4 mb-2.5"
          style={{ color: "rgba(45,15,22,0.35)" }}
        >
          Preparación
        </p>
        <ol className="space-y-2.5">
          {r.receta.pasos.map((paso, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm font-light leading-relaxed"
              style={{ color: "rgba(45,15,22,0.75)" }}
            >
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ backgroundColor: "rgba(107,39,55,0.08)", color: "#6B2737" }}
              >
                {i + 1}
              </span>
              {paso}
            </li>
          ))}
        </ol>
      </div>

      {/* Microacción */}
      <div
        className="px-5 py-4 border-t"
        style={{ backgroundColor: "rgba(201,168,76,0.04)", borderColor: "rgba(201,168,76,0.15)" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{ color: "#C9A84C" }}
        >
          Microacción
        </p>
        <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
          {r.microaccion.titulo}
        </p>
        <p
          className="text-sm font-light mt-1 leading-relaxed"
          style={{ color: "rgba(45,15,22,0.65)" }}
        >
          {r.microaccion.descripcion}
        </p>
        {r.microaccion.duracion_min > 0 && (
          <p className="text-[11px] mt-1.5 font-medium" style={{ color: "rgba(45,15,22,0.4)" }}>
            {r.microaccion.duracion_min} min
          </p>
        )}
      </div>

      {/* Ciencia */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(45,15,22,0.06)" }}>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{ color: "rgba(45,15,22,0.35)" }}
        >
          Ciencia
        </p>
        <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
          {r.microcontenido.titulo}
        </p>
        <p
          className="text-sm font-light mt-1.5 leading-relaxed"
          style={{ color: "rgba(45,15,22,0.65)" }}
        >
          {r.microcontenido.porque}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {r.microcontenido.palancas_longevidad.map(p => (
            <PalancaChip key={p} label={p} />
          ))}
          <EvidenceBadge level={r.microcontenido.nivel_evidencia} />
        </div>
      </div>

      {/* Avisos fármaco/alergia (si los hay) */}
      {warnings.length > 0 && (
        <div
          className="px-5 py-3.5 border-t"
          style={{
            backgroundColor: "rgba(245,158,11,0.04)",
            borderColor: "rgba(245,158,11,0.15)",
          }}
        >
          <button
            onClick={() => setShowWarn(v => !v)}
            className="text-[11px] flex items-center gap-1.5 font-semibold"
            style={{ color: "#d97706" }}
          >
            <AlertTriangle className="w-3 h-3" />
            {warnings.length} aviso{warnings.length > 1 ? "s" : ""}
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showWarn ? "rotate-180" : ""}`}
            />
          </button>
          {showWarn && (
            <ul className="mt-2 space-y-1.5">
              {warnings.map((w, i) => (
                <li
                  key={i}
                  className="text-xs font-light leading-relaxed"
                  style={{ color: "rgba(45,15,22,0.7)" }}
                >
                  {w}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function DerivarCard({ r }: { r: Extract<AgentResponse, { modo: "derivar" }> }) {
  const isCrisis = r.tipo_derivacion === "crisis_emocional"
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: "#fff",
        borderColor: isCrisis ? "rgba(239,68,68,0.18)" : "rgba(245,158,11,0.2)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-5 py-4"
        style={{
          backgroundColor: isCrisis ? "rgba(239,68,68,0.04)" : "rgba(245,158,11,0.04)",
        }}
      >
        <p className="text-sm font-light leading-relaxed" style={{ color: "#2d0f16" }}>
          {r.mensaje}
        </p>
      </div>
      <div className="px-5 py-4 space-y-2.5">
        {r.recursos.map((recurso, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 text-sm font-light"
            style={{ color: "rgba(45,15,22,0.75)" }}
          >
            <Phone
              className="w-3.5 h-3.5 shrink-0 mt-0.5"
              style={{ color: isCrisis ? "#ef4444" : "#d97706" }}
            />
            {recurso}
          </div>
        ))}
      </div>
    </div>
  )
}

function NecesitoMasContextoCard({
  r,
  onSelect,
}: {
  r: Extract<AgentResponse, { modo: "necesito_mas_contexto" }>
  onSelect: (opt: string) => void
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4 border"
      style={{
        backgroundColor: "#fff",
        borderColor: "rgba(45,15,22,0.07)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <p className="text-sm font-semibold mb-3" style={{ color: "#2d0f16" }}>
        {r.pregunta}
      </p>
      <div className="flex flex-wrap gap-2">
        {r.opciones.map(opt => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="px-3.5 py-2 rounded-xl text-sm font-light transition-all hover:shadow-sm active:scale-95"
            style={{
              backgroundColor: "#F5F0E8",
              border: "1px solid rgba(107,39,55,0.12)",
              color: "rgba(45,15,22,0.7)",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function RespuestaLibreCard({ r }: { r: Extract<AgentResponse, { modo: "respuesta_libre" }> }) {
  return (
    <div>
      <p
        className="text-sm font-light leading-relaxed whitespace-pre-wrap"
        style={{ color: "rgba(45,15,22,0.82)" }}
      >
        {r.texto}
      </p>
      {r.advertencias.length > 0 && (
        <p className="mt-3 text-xs italic" style={{ color: "rgba(45,15,22,0.4)" }}>
          {r.advertencias[0]}
        </p>
      )}
    </div>
  )
}

function AgentMessageRenderer({
  agentResponse,
  onOptionSelect,
}: {
  agentResponse: AgentResponse
  onOptionSelect: (opt: string) => void
}) {
  switch (agentResponse.modo) {
    case "recomendacion":
      return <RecomendacionCard r={agentResponse} />
    case "derivar":
      return <DerivarCard r={agentResponse} />
    case "necesito_mas_contexto":
      return <NecesitoMasContextoCard r={agentResponse} onSelect={onOptionSelect} />
    case "respuesta_libre":
      return <RespuestaLibreCard r={agentResponse} />
  }
}

// ── Pantallas de acceso ───────────────────────────────────────────────────────

function GateScreen({
  icon,
  title,
  description,
  href,
  label,
  gold,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  label: string
  gold?: boolean
}) {
  return (
    <div
      className="min-h-[calc(100svh-80px)] flex items-center justify-center p-6"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-sm w-full text-center space-y-6">
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border"
          style={{
            backgroundColor: gold ? "rgba(201,168,76,0.08)" : "rgba(107,39,55,0.06)",
            borderColor: gold ? "rgba(201,168,76,0.25)" : "transparent",
          }}
        >
          {icon}
        </div>
        <div className="space-y-3">
          <h1 className="font-serif text-2xl font-black" style={{ color: "#2d0f16" }}>
            {title}
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.55)" }}>
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:brightness-105"
          style={{
            backgroundColor: gold ? "#C9A84C" : "#2d0f16",
            color: gold ? "#2d0f16" : "#F5F0E8",
          }}
        >
          {label}
        </Link>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function AsesorPage() {
  const [accessState, setAccessState]   = useState<AccessState>("idle")
  const [messages,    setMessages]      = useState<ChatMessage[]>([])
  const [input,       setInput]         = useState("")
  const [loading,     setLoading]       = useState(false)
  const [selectedMood,setSelectedMood]  = useState<string | null>(null)
  const [used,        setUsed]          = useState(0)

  const { resultMood } = useQuizStore()
  const inputRef        = useRef<HTMLInputElement>(null)
  const bottomRef       = useRef<HTMLDivElement>(null)

  // ── Voz: grabación (STT) ──────────────────────────────────────────────────
  const [recording,       setRecording]       = useState(false)
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null)
  const chunksRef         = useRef<Blob[]>([])

  // ── Voz: reproducción (TTS) ───────────────────────────────────────────────
  const [playingIdx,  setPlayingIdx]  = useState<number | null>(null)
  const audioRef      = useRef<HTMLAudioElement | null>(null)

  const remaining   = MONTHLY_LIMIT - used
  const limitReached = used >= MONTHLY_LIMIT

  // Entitlement check al montar
  useEffect(() => {
    setAccessState("loading")
    fetch("/api/ai/entitlement")
      .then(async res => {
        if (res.status === 401) { setAccessState("unauthenticated"); return }
        const data = await res.json()
        setAccessState(data.canUseAI ? "subscribed" : "no-subscription")
      })
      .catch(() => setAccessState("unauthenticated"))
  }, [])

  // Pre-seleccionar mood del quiz si existe
  useEffect(() => {
    if (resultMood && !selectedMood) {
      const cat = MOOD_FROM_QUIZ[resultMood as string]
      if (cat) setSelectedMood(cat)
    }
  }, [resultMood, selectedMood])

  // Auto-scroll al fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedMood || !text.trim() || loading || limitReached) return

      const userText = text.trim()
      setMessages(prev => [...prev, { role: "user", content: userText }])
      setInput("")
      setLoading(true)

      try {
        const res = await fetch("/api/agent/chat", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ userText, mood: { categoria: selectedMood } }),
        })

        if (res.status === 401) { setAccessState("unauthenticated"); return }
        if (res.status === 403) { setAccessState("no-subscription"); return }

        if (res.status === 429) {
          setUsed(MONTHLY_LIMIT)
          setMessages(prev => [
            ...prev,
            { role: "error", content: "Has alcanzado el límite de 100 mensajes este mes. Vuelve el próximo mes." },
          ])
          return
        }

        const data = await res.json()

        if (!res.ok) {
          setMessages(prev => [
            ...prev,
            { role: "error", content: "Ha habido un problema técnico. Por favor, inténtalo de nuevo." },
          ])
          return
        }

        setUsed(prev => prev + 1)
        setMessages(prev => [...prev, { role: "assistant", agentResponse: data }])
      } catch {
        setMessages(prev => [
          ...prev,
          { role: "error", content: "Error de conexión. Comprueba tu red e inténtalo de nuevo." },
        ])
      } finally {
        setLoading(false)
        inputRef.current?.focus()
      }
    },
    [selectedMood, loading, limitReached],
  )

  const handleSend         = () => sendMessage(input)
  const handleOptionSelect = (opt: string) => sendMessage(opt)

  // ── toggleRecording ───────────────────────────────────────────────────────
  const toggleRecording = useCallback(async () => {
    if (recording) {
      mediaRecorderRef.current?.stop()
      return
    }
    if (typeof MediaRecorder === "undefined") return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const CANDIDATES = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ]
      const mimeType = CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) ?? ""

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setRecording(false)
        const actualMime = recorder.mimeType || mimeType || "audio/webm"
        const ext = actualMime.includes("mp4") ? "mp4" : actualMime.includes("ogg") ? "ogg" : "webm"
        const blob = new Blob(chunksRef.current, { type: actualMime })
        const form = new FormData()
        form.append("audio", blob, `voice.${ext}`)
        try {
          const res  = await fetch("/api/voice/transcribe", { method: "POST", body: form })
          const data = await res.json()
          if (data.text) sendMessage(data.text)
        } catch {}
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)

      // Auto-stop tras 30 s
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop()
        }
      }, 30_000)
    } catch {
      // Permiso denegado o no soportado
    }
  }, [recording, sendMessage])

  // ── playTTS ───────────────────────────────────────────────────────────────
  const playTTS = useCallback(async (text: string, idx: number) => {
    // Detener si ya suena este mensaje
    if (playingIdx === idx) {
      audioRef.current?.pause()
      setPlayingIdx(null)
      return
    }
    audioRef.current?.pause()
    setPlayingIdx(idx)

    // Create Audio synchronously within the user gesture (iOS requirement)
    const audio = new Audio()
    audioRef.current = audio

    try {
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) { setPlayingIdx(null); return }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      audio.src = url
      audio.onended = () => { setPlayingIdx(null); URL.revokeObjectURL(url) }
      audio.onerror = () => { setPlayingIdx(null); URL.revokeObjectURL(url) }
      await audio.play()
    } catch {
      setPlayingIdx(null)
    }
  }, [playingIdx])

  // ── Pantallas de acceso ───────────────────────────────────────────────────

  if (accessState === "loading" || accessState === "idle") {
    return (
      <div
        className="min-h-[calc(100svh-80px)] flex items-center justify-center"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "rgba(107,39,55,0.25)" }} />
      </div>
    )
  }

  if (accessState === "unauthenticated") {
    return (
      <GateScreen
        icon={<Lock className="w-7 h-7" style={{ color: "rgba(107,39,55,0.3)" }} />}
        title="Tu Asesor Digital Personal"
        description="Inicia sesión para acceder a tu asesor Food·Mood personalizado."
        href="/login"
        label="Iniciar sesión"
      />
    )
  }

  if (accessState === "no-subscription") {
    return (
      <GateScreen
        gold
        icon={<Sparkles className="w-7 h-7" style={{ color: "#C9A84C" }} />}
        title="Tu Asesor Digital Personal"
        description="Entrenado por nuestro equipo de expertos en nutrición, psicología alimentaria y longevidad. Incluido en la membresía Food·Mood Premium."
        href="/pricing"
        label="Ver membresía"
      />
    )
  }

  // ── Chat principal ────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100svh - 80px)", backgroundColor: "#F5F0E8" }}
    >
      {/* Header */}
      <div
        className="shrink-0 border-b px-5 py-3.5 flex items-center gap-3"
        style={{ backgroundColor: "#2d0f16", borderColor: "rgba(201,168,76,0.15)" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center border shrink-0"
          style={{
            backgroundColor: "rgba(201,168,76,0.15)",
            borderColor: "rgba(201,168,76,0.3)",
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: "#C9A84C" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "#F5F0E8" }}>
            Tu Asesor Digital Personal
          </p>
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "rgba(245,240,232,0.4)" }}
          >
            Entrenado por nuestro equipo · Food·Mood
          </p>
        </div>
        {accessState === "subscribed" && (
          <span
            className="text-[10px] font-semibold shrink-0 px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: limitReached
                ? "rgba(201,168,76,0.15)"
                : "rgba(245,240,232,0.08)",
              color: limitReached ? "#C9A84C" : "rgba(245,240,232,0.45)",
              border: `1px solid ${limitReached ? "rgba(201,168,76,0.3)" : "rgba(245,240,232,0.1)"}`,
            }}
          >
            {limitReached ? "Límite alcanzado" : `${remaining}/${MONTHLY_LIMIT}`}
          </span>
        )}
      </div>

      {/* Selector de mood — expandido si no hay ninguno seleccionado */}
      {!selectedMood ? (
        <div
          className="shrink-0 px-4 py-5 border-b"
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
            borderColor: "rgba(45,15,22,0.07)",
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest text-center mb-3"
            style={{ color: "rgba(45,15,22,0.38)" }}
          >
            ¿Cómo te encuentras ahora?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className="px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:shadow-sm active:scale-95"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(107,39,55,0.12)",
                  color: "rgba(45,15,22,0.72)",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Chip compacto cuando hay mood seleccionado */
        <div
          className="shrink-0 px-4 py-2 flex items-center gap-2 border-b"
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
            borderColor: "rgba(45,15,22,0.07)",
          }}
        >
          <span
            className="text-[10px] font-medium uppercase tracking-widest"
            style={{ color: "rgba(45,15,22,0.38)" }}
          >
            Mood:
          </span>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(107,39,55,0.09)", color: "#6B2737" }}
          >
            {selectedMood}
          </span>
          <button
            onClick={() => setSelectedMood(null)}
            className="text-[10px] font-medium ml-auto transition-opacity hover:opacity-60"
            style={{ color: "rgba(45,15,22,0.35)" }}
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Área de mensajes */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Estado vacío: sin mood */}
          {messages.length === 0 && !loading && !selectedMood && (
            <div className="flex flex-col items-center py-16 text-center space-y-3">
              <p
                className="font-serif text-xl font-black"
                style={{ color: "#2d0f16" }}
              >
                Tu Asesor Digital Personal
              </p>
              <p
                className="text-sm font-light max-w-xs"
                style={{ color: "rgba(45,15,22,0.45)" }}
              >
                Selecciona tu estado de ánimo para empezar.
              </p>
            </div>
          )}

          {/* Estado vacío: mood seleccionado pero sin mensajes */}
          {messages.length === 0 && !loading && selectedMood && (
            <div className="flex flex-col items-center py-10 text-center space-y-4 px-4">
              <p
                className="text-sm font-light leading-relaxed max-w-xs"
                style={{ color: "rgba(45,15,22,0.45)" }}
              >
                Cuéntame cómo te encuentras — energía, ánimo, lo que has comido, lo que te preocupa.
              </p>
              {[
                "¿Qué receta me recomiendas para mi mood de hoy?",
                "Últimamente como por ansiedad y no sé cómo parar.",
                "Me siento sin energía aunque duermo bien.",
              ].map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus() }}
                  className="block w-full max-w-xs text-left text-sm px-4 py-3 rounded-2xl transition-all hover:shadow-sm"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(107,39,55,0.1)",
                    color: "rgba(45,15,22,0.65)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Mensajes */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "user" && (
                <div
                  className="max-w-[80%] px-5 py-3.5 text-sm font-light leading-relaxed"
                  style={{
                    backgroundColor: "#6B2737",
                    color: "#F5F0E8",
                    borderRadius: "18px 18px 4px 18px",
                  }}
                >
                  {msg.content}
                </div>
              )}

              {msg.role === "assistant" && (() => {
                const ttsText = extractTTSText(msg.agentResponse)
                return (
                  <div className="w-full max-w-[94%]">
                    <AgentMessageRenderer
                      agentResponse={msg.agentResponse}
                      onOptionSelect={handleOptionSelect}
                    />
                    {ttsText && (
                      <button
                        onClick={() => playTTS(ttsText, i)}
                        className="mt-2 ml-0.5 flex items-center gap-1.5 transition-opacity hover:opacity-80"
                        style={{ color: playingIdx === i ? "#6B2737" : "rgba(45,15,22,0.28)" }}
                        aria-label={playingIdx === i ? "Detener audio" : "Escuchar respuesta"}
                      >
                        {playingIdx === i ? (
                          <>
                            <Square className="w-3 h-3" fill="currentColor" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">Detener</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Escuchar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )
              })()}

              {msg.role === "error" && (
                <div
                  className="max-w-[80%] px-5 py-3.5 rounded-2xl text-sm font-light"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.05)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    color: "rgba(45,15,22,0.6)",
                  }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {/* Indicador de carga */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-5 py-3.5"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(45,15,22,0.07)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex gap-1 items-center h-5">
                  {[0, 1, 2].map(j => (
                    <span
                      key={j}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "rgba(107,39,55,0.25)",
                        animationDelay: `${j * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Barra de input */}
      <div
        className="shrink-0 border-t px-4 py-4"
        style={{ backgroundColor: "#fff", borderColor: "rgba(45,15,22,0.08)" }}
      >
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          {/* Botón de micrófono */}
          <button
            onClick={toggleRecording}
            disabled={!selectedMood || limitReached || loading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
            style={{
              backgroundColor: recording ? "rgba(239,68,68,0.08)" : "rgba(107,39,55,0.07)",
              border: recording ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(107,39,55,0.12)",
              color: recording ? "#ef4444" : "#6B2737",
              animation: recording ? "pulse 1.2s ease-in-out infinite" : "none",
            }}
            aria-label={recording ? "Detener grabación" : "Dictar mensaje"}
          >
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder={
              recording
                ? "Escuchando…"
                : !selectedMood
                  ? "Selecciona tu mood para empezar"
                  : limitReached
                    ? "Límite mensual alcanzado"
                    : "¿Cómo te encuentras? Cuéntame..."
            }
            className="flex-1 px-4 py-3 rounded-2xl text-sm font-light focus:outline-none transition-all disabled:opacity-40"
            style={{
              backgroundColor: "#F5F0E8",
              border: "1px solid rgba(107,39,55,0.12)",
              color: "#2d0f16",
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            maxLength={1000}
            disabled={!selectedMood || limitReached || recording}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || !selectedMood || limitReached}
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all hover:brightness-110 disabled:opacity-30"
            style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
        <p
          className="text-[9px] text-center mt-2.5 uppercase tracking-[0.15em]"
          style={{ color: "rgba(45,15,22,0.22)" }}
        >
          No sustituye consejo médico o nutricional personalizado · 100 mensajes/mes
        </p>
      </div>
    </div>
  )
}
