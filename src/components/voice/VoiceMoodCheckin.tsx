"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, ArrowLeft, Check, Mic, Square } from "lucide-react"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { useVoiceOutput } from "@/hooks/useVoiceOutput"
import Link from "next/link"

// ── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "recording" | "transcribing" | "processing" | "responding"

interface Message { role: "user" | "assistant"; content: string }

// ── Constants ─────────────────────────────────────────────────────────────────
const MOOD_LABELS: Record<string, string> = {
  activacion: "Activación", calma: "Calma", focus: "Foco",
  social: "Social", reset: "Restauración", familia: "Confort", confort: "Confort",
}
const MOOD_COLORS: Record<string, string> = {
  activacion: "#E8A87C", calma: "#7EC8C8", focus: "#F4E285",
  social: "#F4A7B9", reset: "#B8A9C9", familia: "#D4A574", confort: "#D4A574",
}
const STATUS_TEXT: Record<Phase, string> = {
  idle:         "",
  recording:    "Toca para detener",
  transcribing: "Transcribiendo…",
  processing:   "Pensando…",
  responding:   "Toca para interrumpir",
}

// ── Component ─────────────────────────────────────────────────────────────────
export function VoiceMoodCheckin() {
  const [phase,        setPhase]        = useState<Phase>("idle")
  const [messages,     setMessages]     = useState<Message[]>([])
  const [lastReply,    setLastReply]    = useState("")
  const [detectedMood, setDetectedMood] = useState<string | null>(null)
  const [ttsEnabled,   setTtsEnabled]   = useState(true)
  const [saved,        setSaved]        = useState(false)

  const { speak, stop, isSpeaking, supported: ttsSupported } = useVoiceOutput()

  // ── Send to chat agent ──────────────────────────────────────────────────────
  const sendToAgent = useCallback(async (userText: string) => {
    setPhase("processing")
    const updated: Message[] = [...messages, { role: "user", content: userText }]
    setMessages(updated)

    try {
      const res  = await fetch("/api/chat/mood", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      const reply = (data.reply as string | undefined) ?? "No he podido procesar tu mensaje."
      const mood  = (data.mood  as string | undefined)?.toLowerCase()

      if (mood) setDetectedMood(mood)
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
      setLastReply(reply)
      setPhase("responding")

      if (ttsEnabled && ttsSupported) {
        speak(reply)
      } else {
        setPhase("idle")
      }
    } catch {
      setPhase("idle")
    }
  }, [messages, ttsEnabled, ttsSupported, speak])

  // ── Voice input ─────────────────────────────────────────────────────────────
  const { toggle, supported: micSupported, recordingState } = useVoiceInput({
    onFinalTranscript: (text) => sendToAgent(text),
    onStateChange: (s) => {
      if      (s === "recording")    setPhase("recording")
      else if (s === "transcribing") setPhase("transcribing")
      // idle is set after sendToAgent resolves
    },
  })

  // When TTS finishes → back to idle
  useEffect(() => {
    if (!isSpeaking && phase === "responding") setPhase("idle")
  }, [isSpeaking, phase])

  // ── Orb click ───────────────────────────────────────────────────────────────
  const handleOrbClick = () => {
    if (phase === "processing" || phase === "transcribing") return
    if (phase === "responding") { stop(); return }
    toggle() // recording ↔ idle
  }

  // ── Save to diary ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const texto = messages.filter(m => m.role === "user").map(m => m.content).join(" ")
    if (!texto) return
    await fetch("/api/diario", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        fecha:        new Date().toISOString().split("T")[0],
        mood_id:      detectedMood ?? undefined,
        estado_libre: texto.slice(0, 500),
      }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const moodColor = detectedMood ? (MOOD_COLORS[detectedMood] ?? "#FF6B35") : "#FF6B35"
  const moodLabel = detectedMood ? (MOOD_LABELS[detectedMood] ?? detectedMood) : null

  const orbBusy      = phase === "processing" || phase === "transcribing"
  const orbAnimScale = phase === "recording"  ? [1, 1.14, 1] :
                       phase === "responding" ? [1, 1.06, 1] : [1, 1.03, 1]
  const orbAnimDur   = phase === "recording"  ? 0.65 :
                       phase === "responding" ? 1.4  : 3.5

  const displayText = (() => {
    if (phase === "idle" && messages.length === 0) return "Toca el círculo y cuéntame cómo estás hoy."
    if (phase === "idle" && lastReply)             return lastReply.replace(/\{[^}]*"mood"[^}]*\}/g, "").trim().slice(0, 280)
    if (phase === "responding" && lastReply)       return lastReply.replace(/\{[^}]*"mood"[^}]*\}/g, "").trim().slice(0, 280)
    return ""
  })()

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col select-none" style={{ minHeight: "100svh", backgroundColor: "#130608", color: "#F5F0E8" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <Link href="/diario" className="flex items-center gap-1.5 text-[13px]"
          style={{ color: "rgba(245,240,232,0.4)" }}>
          <ArrowLeft size={16} /> Diario
        </Link>

        {ttsSupported && (
          <button
            onClick={() => { setTtsEnabled(e => !e); if (isSpeaking) stop() }}
            className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full"
            style={{
              color:  ttsEnabled ? "rgba(245,240,232,0.7)" : "rgba(245,240,232,0.25)",
              border: `1px solid ${ttsEnabled ? "rgba(245,240,232,0.12)" : "rgba(245,240,232,0.05)"}`,
            }}
          >
            {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            {ttsEnabled ? "Voz" : "Mudo"}
          </button>
        )}
      </div>

      {/* Mood badge */}
      <div className="flex justify-center min-h-7 mt-1">
        <AnimatePresence>
          {moodLabel && (
            <motion.span key={moodLabel} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full"
              style={{ backgroundColor: `${moodColor}20`, color: moodColor, border: `1px solid ${moodColor}40` }}>
              {moodLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Central area ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-6">

        {/* Orb */}
        <div className="relative flex items-center justify-center">

          {/* Listening rings */}
          <AnimatePresence>
            {phase === "recording" && [1, 2].map(r => (
              <motion.div key={r} className="absolute rounded-full pointer-events-none"
                style={{ border: `1px solid ${moodColor}40` }}
                initial={{ width: 200, height: 200, opacity: 0.5 }}
                animate={{ width: 200 + r * 70, height: 200 + r * 70, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, delay: r * 0.45, ease: "easeOut" }} />
            ))}
          </AnimatePresence>

          {/* Main orb — large touch target */}
          <motion.button
            onClick={handleOrbClick}
            animate={{ scale: orbAnimScale }}
            transition={{ duration: orbAnimDur, repeat: Infinity, ease: "easeInOut" }}
            disabled={orbBusy}
            className="relative rounded-full flex items-center justify-center focus:outline-none active:brightness-110"
            style={{
              width: 200, height: 200,
              background: `radial-gradient(circle at 35% 35%, ${moodColor}40, ${moodColor}12 55%, transparent)`,
              border:     `1.5px solid ${moodColor}55`,
              boxShadow:  `0 0 60px ${moodColor}18, 0 0 120px ${moodColor}08, inset 0 1px 0 ${moodColor}25`,
            }}
          >
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }}>
                  <Mic size={44} style={{ color: moodColor }} />
                </motion.div>
              )}

              {phase === "recording" && (
                <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1.5 items-end" style={{ height: 44 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.span key={i} className="w-1.5 rounded-full" style={{ backgroundColor: moodColor }}
                      animate={{ height: ["10px", "36px", "10px"] }}
                      transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} />
                  ))}
                </motion.div>
              )}

              {(phase === "transcribing" || phase === "processing") && (
                <motion.div key="busy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: moodColor }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }} />
                  ))}
                </motion.div>
              )}

              {phase === "responding" && (
                <motion.div key="resp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Square size={32} style={{ color: moodColor }} fill={moodColor} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Status label */}
        <AnimatePresence mode="wait">
          <motion.p key={phase}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[12px] uppercase tracking-[0.18em] text-center"
            style={{ color: "rgba(245,240,232,0.35)" }}>
            {STATUS_TEXT[phase] || (messages.length === 0 ? "Toca para hablar" : "Toca para continuar")}
          </motion.p>
        </AnimatePresence>

        {/* Reply / intro text */}
        {displayText && (
          <motion.p key={displayText.slice(0, 30)}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-[15px] font-light leading-relaxed text-center max-w-sm"
            style={{ color: phase === "idle" && messages.length === 0
              ? "rgba(245,240,232,0.35)"
              : "rgba(245,240,232,0.75)" }}>
            {displayText}{lastReply.length > 280 ? "…" : ""}
          </motion.p>
        )}
      </div>

      {/* Bottom */}
      <div className="px-6 pb-8 space-y-4" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>

        {/* Post-conversation actions */}
        <AnimatePresence>
          {messages.length > 0 && phase === "idle" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-3 justify-center">
              <button onClick={handleSave}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-[13px] font-semibold transition-all"
                style={{
                  backgroundColor: saved ? "#4a9b6b" : "rgba(245,240,232,0.07)",
                  color:  saved ? "#F5F0E8" : "rgba(245,240,232,0.55)",
                  border: `1px solid ${saved ? "transparent" : "rgba(245,240,232,0.1)"}`,
                }}>
                {saved ? <><Check size={14} /> Guardado</> : "Guardar en diario"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No mic support warning */}
        {!micSupported && (
          <p className="text-center text-[12px]" style={{ color: "rgba(245,240,232,0.3)" }}>
            Activa el micrófono en los ajustes del navegador para usar el check-in de voz.
          </p>
        )}

        <p className="text-center text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(245,240,232,0.18)" }}>
          No sustituye consejo médico · Food·Mood
        </p>
      </div>
    </div>
  )
}
