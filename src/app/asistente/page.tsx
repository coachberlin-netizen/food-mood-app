"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, Loader2, Lock, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { useVoiceOutput } from "@/hooks/useVoiceOutput"

type AccessState = "idle" | "loading" | "unauthenticated" | "no-subscription" | "subscribed"

const DAILY_LIMIT = 20

interface Message {
  role: "assistant" | "user"
  content: string
}

export default function AsistentePage() {
  const [accessState, setAccessState] = useState<AccessState>("idle")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null)
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const scrollRef       = useRef<HTMLDivElement>(null)
  const inputRef        = useRef<HTMLInputElement>(null)
  const lastMsgRef      = useRef<HTMLDivElement>(null)
  const bottomRef       = useRef<HTMLDivElement>(null)

  const { speak, stop, isSpeaking, supported: ttsSupported } = useVoiceOutput()

  const { isListening, interim, startListening, stopListening, supported: sttSupported } = useVoiceInput({
    onFinalTranscript: (text) => {
      setInput(prev => prev ? `${prev} ${text}` : text)
      stopListening()
    },
    onInterimTranscript: (text) => {
      setInput(text)
    },
  })

  // Entitlement check on mount
  useEffect(() => {
    setAccessState("loading")
    fetch("/api/ai/entitlement")
      .then(async res => {
        if (res.status === 401) { setAccessState("unauthenticated"); return }
        const data = await res.json()
        if (data.canUseAI) {
          setAccessState("subscribed")
          setMessagesRemaining(data.messagesRemaining ?? DAILY_LIMIT)
        } else {
          setAccessState("no-subscription")
        }
      })
      .catch(() => setAccessState("unauthenticated"))
  }, [])


  // Cuando carga → scroll al fondo (muestra el indicador de escritura)
  useEffect(() => {
    if (loading) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [loading])

  // Cuando llega respuesta del asistente → scroll al INICIO del mensaje
  useEffect(() => {
    if (!loading && messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [messages, loading])

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading || accessState !== "subscribed") return
    if (messagesRemaining !== null && messagesRemaining <= 0) return

    const userMsg = input.trim()
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    inputRef.current?.focus()

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (res.status === 401) { setAccessState("unauthenticated"); return }
      if (res.status === 403) { setAccessState("no-subscription"); return }

      if (res.status === 429) {
        setMessagesRemaining(0)
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Has alcanzado tu límite de 20 mensajes diarios. Vuelve mañana para continuar. 🌙",
        }])
        return
      }

      const data = await res.json()
      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Ha habido un problema técnico. Por favor, inténtalo de nuevo en unos momentos.",
        }])
        return
      }
      if (typeof data.messagesRemaining === "number") setMessagesRemaining(data.messagesRemaining)
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
        if (ttsEnabled && ttsSupported) speak(data.reply)
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Ha habido un problema de conexión. Por favor, inténtalo de nuevo.",
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, accessState, messages, messagesRemaining, ttsEnabled, ttsSupported, speak])

  const limitReached = messagesRemaining !== null && messagesRemaining <= 0

  /* ── Loading ── */
  if (accessState === "loading" || accessState === "idle") {
    return (
      <div className="min-h-[calc(100svh-80px)] flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "rgba(107,39,55,0.25)" }} />
      </div>
    )
  }

  /* ── Unauthenticated ── */
  if (accessState === "unauthenticated") {
    return (
      <div className="min-h-[calc(100svh-80px)] flex items-center justify-center p-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: "rgba(107,39,55,0.06)" }}>
            <Lock className="w-7 h-7" style={{ color: "rgba(107,39,55,0.3)" }} />
          </div>
          <div className="space-y-3">
            <h1 className="font-serif text-2xl font-black" style={{ color: "#2d0f16" }}>
              Entra para usar tu asistente Food·Mood
            </h1>
            <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.55)" }}>
              Crea tu cuenta o inicia sesión para acceder a tu espacio Food·Mood.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:brightness-105"
            style={{ backgroundColor: "#2d0f16", color: "#F5F0E8" }}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  /* ── No subscription ── */
  if (accessState === "no-subscription") {
    return (
      <div className="min-h-[calc(100svh-80px)] flex items-center justify-center p-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border" style={{ backgroundColor: "rgba(201,168,76,0.08)", borderColor: "rgba(201,168,76,0.25)" }}>
            <Sparkles className="w-7 h-7" style={{ color: "#C9A84C" }} />
          </div>
          <div className="space-y-3">
            <h1 className="font-serif text-2xl font-black" style={{ color: "#2d0f16" }}>
              Desbloquea tu asistente Food·Mood
            </h1>
            <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.55)" }}>
              El asistente IA está incluido en la suscripción Food·Mood. Suscríbete para recibir orientación personalizada sobre recetas, hábitos y bienestar emocional.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:brightness-105"
            style={{ backgroundColor: "#C9A84C", color: "#2d0f16" }}
          >
            Suscribirme
          </Link>
        </div>
      </div>
    )
  }

  /* ── Subscribed: full chat ── */
  return (
    <div className="flex flex-col" style={{ height: "calc(100svh - 80px)", backgroundColor: "#F5F0E8" }}>

      {/* Page header */}
      <div className="shrink-0 border-b px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#2d0f16", borderColor: "rgba(201,168,76,0.15)" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center border shrink-0" style={{ backgroundColor: "rgba(201,168,76,0.15)", borderColor: "rgba(201,168,76,0.3)" }}>
          <Sparkles className="w-4 h-4" style={{ color: "#C9A84C" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold" style={{ color: "#F5F0E8" }}>Asistente Food·Mood</h1>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(245,240,232,0.4)" }}>
            IA especializada · gut-brain nutrition
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {ttsSupported && (
            <button
              onClick={() => { setTtsEnabled(e => !e); if (isSpeaking) stop() }}
              title={ttsEnabled ? "Silenciar voz" : "Activar voz"}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: ttsEnabled ? "rgba(201,168,76,0.15)" : "rgba(245,240,232,0.06)",
                color: ttsEnabled ? "#C9A84C" : "rgba(245,240,232,0.3)",
              }}
            >
              {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          )}
          {messagesRemaining !== null && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{
              backgroundColor: limitReached ? "rgba(201,168,76,0.15)" : "rgba(245,240,232,0.08)",
              color: limitReached ? "#C9A84C" : "rgba(245,240,232,0.7)",
              border: `1px solid ${limitReached ? "rgba(201,168,76,0.3)" : "rgba(245,240,232,0.12)"}`,
            }}>
              {limitReached ? "Límite alcanzado" : `${messagesRemaining}/${DAILY_LIMIT} hoy`}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Empty state */}
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full pt-16 pb-8 text-center px-6 space-y-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <Sparkles className="w-6 h-6" style={{ color: "#C9A84C" }} />
              </div>
              <div className="space-y-2 max-w-xs">
                <p className="font-serif text-lg font-semibold" style={{ color: "#2d0f16" }}>FOOD-MOOD Guide</p>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.5)" }}>
                  Cuéntame cómo te encuentras hoy — energía, ánimo, lo que has comido, lo que te preocupa. Te oriento desde la psicología alimentaria y la ciencia del comportamiento.
                </p>
              </div>
              {[
                "Últimamente como por ansiedad y no sé cómo parar.",
                "Me siento sin energía aunque duermo bien.",
                "Quiero mejorar mi microbiota, ¿por dónde empiezo?",
              ].map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="block w-full max-w-xs text-left text-sm px-4 py-3 rounded-2xl transition-all hover:shadow-sm"
                  style={{ backgroundColor: "#fff", border: "1px solid rgba(107,39,55,0.1)", color: "rgba(45,15,22,0.65)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} ref={i === messages.length - 1 ? lastMsgRef : undefined} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 font-serif text-[10px] font-black" style={{ backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C" }}>
                  FM
                </div>
              )}
              <div
                className="max-w-[80%] rounded-2xl px-5 py-3.5 text-sm font-light leading-relaxed whitespace-pre-wrap"
                style={msg.role === "user"
                  ? { backgroundColor: "#6B2737", color: "#F5F0E8", borderRadius: "18px 18px 4px 18px" }
                  : { backgroundColor: "#fff", color: "rgba(45,15,22,0.82)", border: "1px solid rgba(45,15,22,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderRadius: "18px 18px 18px 4px" }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 font-serif text-[10px] font-black" style={{ backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C" }}>
                FM
              </div>
              <div className="rounded-2xl px-5 py-3.5" style={{ backgroundColor: "#fff", border: "1px solid rgba(45,15,22,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="flex gap-1 items-center h-5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "rgba(107,39,55,0.25)", animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t px-4 py-4" style={{ backgroundColor: "#fff", borderColor: "rgba(45,15,22,0.08)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end">
            {sttSupported && (
              <button
                type="button"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                disabled={limitReached}
                title="Mantén pulsado para hablar"
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                style={{
                  backgroundColor: isListening ? "#6B2737" : "rgba(107,39,55,0.08)",
                  color: isListening ? "#F5F0E8" : "rgba(107,39,55,0.5)",
                  border: "1px solid rgba(107,39,55,0.12)",
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder={
                isListening
                  ? (interim || "Escuchando…")
                  : limitReached
                  ? "Límite diario alcanzado — vuelve mañana"
                  : "¿Cómo te encuentras hoy?"
              }
              className="flex-1 px-4 py-3 rounded-2xl text-sm font-light focus:outline-none transition-all disabled:opacity-40"
              style={{
                backgroundColor: isListening ? "rgba(107,39,55,0.04)" : "#F5F0E8",
                border: `1px solid ${isListening ? "rgba(107,39,55,0.25)" : "rgba(107,39,55,0.12)"}`,
                color: "#2d0f16",
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              maxLength={1000}
              disabled={limitReached}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || limitReached}
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all hover:brightness-110 disabled:opacity-30"
              style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[9px] text-center mt-2.5 uppercase tracking-[0.15em]" style={{ color: "rgba(45,15,22,0.25)" }}>
            {limitReached
              ? `Límite de ${DAILY_LIMIT} mensajes diarios alcanzado`
              : "Asistente IA · Food·Mood · No sustituye consejo médico"}
          </p>
        </div>
      </div>

    </div>
  )
}
