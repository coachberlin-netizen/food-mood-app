"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Check, Loader2 } from "lucide-react"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { useVoiceOutput } from "@/hooks/useVoiceOutput"
import Link from "next/link"

type Phase = "idle" | "listening" | "processing" | "responding"

interface Message {
  role: "user" | "assistant"
  content: string
}

const MOOD_LABELS: Record<string, string> = {
  activacion: "Activación",
  calma:      "Calma",
  focus:      "Foco",
  social:     "Social",
  reset:      "Restauración",
  familia:    "Confort",
  confort:    "Confort",
}

const MOOD_COLORS: Record<string, string> = {
  activacion: "#E8A87C",
  calma:      "#7EC8C8",
  focus:      "#F4E285",
  social:     "#F4A7B9",
  reset:      "#B8A9C9",
  familia:    "#D4A574",
  confort:    "#D4A574",
}

export function VoiceMoodCheckin() {
  const [phase,        setPhase]        = useState<Phase>("idle")
  const [messages,     setMessages]     = useState<Message[]>([])
  const [lastReply,    setLastReply]    = useState("")
  const [detectedMood, setDetectedMood] = useState<string | null>(null)
  const [ttsEnabled,   setTtsEnabled]   = useState(true)
  const [saved,        setSaved]        = useState(false)
  const [pendingText,  setPendingText]  = useState("")

  const { speak, stop, isSpeaking, supported: ttsSupported } = useVoiceOutput()

  const sendToAgent = useCallback(async (userText: string) => {
    setPhase("processing")
    const newMessages: Message[] = [...messages, { role: "user", content: userText }]
    setMessages(newMessages)

    try {
      const res = await fetch("/api/chat/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      const reply = data.reply ?? "No he podido procesar tu mensaje."
      const mood  = data.mood as string | undefined

      if (mood) setDetectedMood(mood.toLowerCase())

      setMessages(prev => [...prev, { role: "assistant", content: reply }])
      setLastReply(reply)
      setPhase("responding")

      if (ttsEnabled && ttsSupported) {
        speak(reply)
      }
    } catch {
      setPhase("idle")
    }
  }, [messages, ttsEnabled, ttsSupported, speak])

  const { isListening, interim, startListening, stopListening, supported: sttSupported } =
    useVoiceInput({
      onFinalTranscript: (text) => {
        setPendingText(text)
        stopListening()
        sendToAgent(text)
      },
      onEnd: () => {
        if (phase === "listening") setPhase("idle")
      },
    })

  useEffect(() => {
    if (isListening) setPhase("listening")
  }, [isListening])

  useEffect(() => {
    if (!isSpeaking && phase === "responding") setPhase("idle")
  }, [isSpeaking, phase])

  const handleOrbClick = () => {
    if (phase === "processing") return
    if (phase === "listening") {
      stopListening()
      return
    }
    if (phase === "responding") {
      stop()
      return
    }
    startListening()
  }

  const handleSaveDiary = async () => {
    const userText = messages.filter(m => m.role === "user").map(m => m.content).join(" ")
    if (!userText) return

    await fetch("/api/diario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: new Date().toISOString().split("T")[0],
        mood_id: detectedMood ?? undefined,
        estado_libre: userText.slice(0, 500),
      }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const moodColor  = detectedMood ? (MOOD_COLORS[detectedMood] ?? "#C9A84C") : "#C9A84C"
  const moodLabel  = detectedMood ? (MOOD_LABELS[detectedMood] ?? detectedMood) : null

  const orbScale = phase === "listening" ? [1, 1.12, 1] : phase === "responding" ? [1, 1.06, 1] : [1, 1.04, 1]
  const orbDuration = phase === "listening" ? 0.7 : phase === "responding" ? 1.4 : 3

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100svh", backgroundColor: "#130608", color: "#F5F0E8" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-safe pt-4 pb-2">
        <Link href="/diario" className="flex items-center gap-1.5 text-[13px]" style={{ color: "rgba(245,240,232,0.4)" }}>
          <ArrowLeft size={16} />
          <span>Diario</span>
        </Link>

        <button
          onClick={() => { setTtsEnabled(e => !e); if (isSpeaking) stop() }}
          className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full transition-all"
          style={{
            color: ttsEnabled ? "rgba(245,240,232,0.7)" : "rgba(245,240,232,0.25)",
            border: `1px solid ${ttsEnabled ? "rgba(245,240,232,0.12)" : "rgba(245,240,232,0.05)"}`,
          }}
        >
          {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{ttsEnabled ? "Voz activa" : "Voz muda"}</span>
        </button>
      </div>

      {/* Mood badge */}
      <div className="flex justify-center mt-2 min-h-[28px]">
        <AnimatePresence>
          {moodLabel && (
            <motion.div
              key={moodLabel}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
              style={{ backgroundColor: `${moodColor}20`, color: moodColor, border: `1px solid ${moodColor}40` }}
            >
              {moodLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Central orb */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        <div className="relative flex items-center justify-center">
          {/* Outer rings (listening) */}
          <AnimatePresence>
            {phase === "listening" && (
              <>
                {[1, 2].map(ring => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full"
                    style={{ border: `1px solid ${moodColor}30` }}
                    initial={{ width: 180, height: 180, opacity: 0.6 }}
                    animate={{ width: 180 + ring * 60, height: 180 + ring * 60, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: ring * 0.4, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Main orb */}
          <motion.button
            onClick={handleOrbClick}
            animate={{ scale: orbScale }}
            transition={{ duration: orbDuration, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-44 h-44 rounded-full flex items-center justify-center focus:outline-none"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${moodColor}35, ${moodColor}10 60%, transparent)`,
              border: `1.5px solid ${moodColor}50`,
              boxShadow: `0 0 40px ${moodColor}20, inset 0 1px 0 ${moodColor}25`,
            }}
          >
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Mic size={36} style={{ color: moodColor }} />
                </motion.div>
              )}
              {phase === "listening" && (
                <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1.5 items-end h-9">
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.span
                      key={i}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: moodColor }}
                      animate={{ height: ["8px", "32px", "8px"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    />
                  ))}
                </motion.div>
              )}
              {phase === "processing" && (
                <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={32} className="animate-spin" style={{ color: moodColor }} />
                </motion.div>
              )}
              {phase === "responding" && (
                <motion.div key="resp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1.5 items-center h-9">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: moodColor }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Status / transcript text */}
        <div className="text-center max-w-xs min-h-[80px] flex flex-col justify-center gap-2">
          <AnimatePresence mode="wait">
            {phase === "idle" && messages.length === 0 && (
              <motion.p key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[15px] font-light leading-relaxed"
                style={{ color: "rgba(245,240,232,0.45)" }}
              >
                Toca el círculo y cuéntame<br />cómo estás hoy.
              </motion.p>
            )}
            {phase === "listening" && (
              <motion.p key="listening-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[15px] font-light leading-relaxed"
                style={{ color: "rgba(245,240,232,0.7)" }}
              >
                {interim || "Te escucho…"}
              </motion.p>
            )}
            {phase === "processing" && (
              <motion.p key="proc-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[13px] uppercase tracking-widest"
                style={{ color: "rgba(245,240,232,0.3)" }}
              >
                Procesando…
              </motion.p>
            )}
            {phase === "responding" && lastReply && (
              <motion.p key="reply" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-[14px] font-light leading-relaxed text-left"
                style={{ color: "rgba(245,240,232,0.8)" }}
              >
                {lastReply
                  .replace(/\{[^}]*"mood"[^}]*\}/g, "")
                  .trim()
                  .slice(0, 280)}
                {lastReply.length > 280 && "…"}
              </motion.p>
            )}
            {phase === "idle" && messages.length > 0 && lastReply && (
              <motion.p key="idle-reply" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[14px] font-light leading-relaxed text-left"
                style={{ color: "rgba(245,240,232,0.55)" }}
              >
                {lastReply
                  .replace(/\{[^}]*"mood"[^}]*\}/g, "")
                  .trim()
                  .slice(0, 220)}
                {lastReply.length > 220 && "…"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-safe pb-8 space-y-3">
        {!sttSupported && (
          <p className="text-center text-[12px]" style={{ color: "rgba(245,240,232,0.3)" }}>
            Tu navegador no soporta voz. Prueba con Chrome.
          </p>
        )}

        {messages.length > 0 && phase === "idle" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-center"
          >
            <button
              onClick={handleSaveDiary}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all"
              style={{
                backgroundColor: saved ? "#4a9b6b" : "rgba(245,240,232,0.08)",
                color: saved ? "#F5F0E8" : "rgba(245,240,232,0.6)",
                border: `1px solid ${saved ? "transparent" : "rgba(245,240,232,0.12)"}`,
              }}
            >
              {saved ? <><Check size={14} /> Guardado</> : "Guardar en diario"}
            </button>

            <button
              onClick={startListening}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all"
              style={{ backgroundColor: `${moodColor}20`, color: moodColor, border: `1px solid ${moodColor}40` }}
            >
              <Mic size={14} /> Seguir
            </button>
          </motion.div>
        )}

        <p className="text-center text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(245,240,232,0.2)" }}>
          {phase === "listening"
            ? "Toca para detener · No sustituye consejo médico"
            : "Toca el círculo para hablar · No sustituye consejo médico"}
        </p>
      </div>
    </div>
  )
}
