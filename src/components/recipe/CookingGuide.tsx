"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { useVoiceOutput } from "@/hooks/useVoiceOutput"
import type { Receta } from "@/app/recetas/[id]/RecetaDetailClient"

function normalizeStep(raw: unknown): string {
  if (typeof raw === "string") return raw
  if (raw && typeof raw === "object" && "paso" in raw) return String((raw as { paso: unknown }).paso)
  return JSON.stringify(raw)
}

interface Props {
  receta: Receta
  onClose: () => void
}

export function CookingGuide({ receta, onClose }: Props) {
  const steps = receta.preparacion_es.map(normalizeStep)
  const ingredients = receta.ingredientes_es.map(raw =>
    typeof raw === "string" ? raw : (raw && typeof raw === "object" && "ingrediente" in raw ? String((raw as {ingrediente: unknown}).ingrediente) : "")
  ).filter(Boolean)

  const [stepIndex, setStepIndex]     = useState(0)
  const [ttsEnabled, setTtsEnabled]   = useState(true)
  const [aiAnswer, setAiAnswer]       = useState<string | null>(null)
  const [aiLoading, setAiLoading]     = useState(false)
  const [dir, setDir]                 = useState(1)
  const hasAutoSpokenRef              = useRef(false)

  const { speak, stop, isSpeaking, supported: ttsSupported } = useVoiceOutput()

  const { recordingState, toggle: toggleMic, supported: micSupported } = useVoiceInput({
    onFinalTranscript: useCallback(async (text: string) => {
      if (!text.trim()) return
      setAiLoading(true)
      setAiAnswer(null)
      try {
        const res = await fetch("/api/ai/cooking-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: text,
            recipeName: receta.nombre_es,
            ingredients,
            currentStep: steps[stepIndex],
            currentStepIndex: stepIndex,
            totalSteps: steps.length,
          }),
        })
        const data = await res.json()
        if (data.answer) {
          setAiAnswer(data.answer)
          if (ttsEnabled && ttsSupported) speak(data.answer)
        }
      } catch {
        setAiAnswer("No pude procesar la pregunta. Inténtalo de nuevo.")
      } finally {
        setAiLoading(false)
      }
    }, [receta.nombre_es, ingredients, steps, stepIndex, ttsEnabled, ttsSupported, speak]),
  })

  // Auto-speak each step when entering it
  useEffect(() => {
    if (!ttsEnabled || !ttsSupported) return
    if (hasAutoSpokenRef.current) return
    hasAutoSpokenRef.current = true
    const t = setTimeout(() => speak(steps[stepIndex], { rate: 0.88 }), 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  const goTo = (next: number) => {
    stop()
    setAiAnswer(null)
    setDir(next > stepIndex ? 1 : -1)
    hasAutoSpokenRef.current = false
    setStepIndex(next)
  }

  const progress = ((stepIndex + 1) / steps.length) * 100
  const isRecording = recordingState === "recording"
  const isTranscribing = recordingState === "transcribing"

  return (
    <div className="fixed inset-0 z-50 bg-[#1A0A0E] flex flex-col select-none">

      {/* Header */}
      <div className="px-5 pt-5 pb-3 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => { stop(); onClose() }}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "rgba(245,240,232,0.06)" }}
            aria-label="Cerrar guía"
          >
            <X className="w-4 h-4 text-[#F5F0E8]/50" />
          </button>

          <div className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C9A84C]">
              Guía de cocina
            </p>
            <p className="text-[#F5F0E8]/35 text-[10px] mt-0.5">
              Paso {stepIndex + 1} de {steps.length}
            </p>
          </div>

          <button
            onClick={() => {
              const next = !ttsEnabled
              setTtsEnabled(next)
              if (!next) stop()
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "rgba(245,240,232,0.06)" }}
            aria-label={ttsEnabled ? "Silenciar voz" : "Activar voz"}
          >
            {ttsEnabled
              ? <Volume2 className="w-4 h-4 text-[#C9A84C]" />
              : <VolumeX className="w-4 h-4 text-[#F5F0E8]/30" />
            }
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#C9A84C]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={stepIndex}
            custom={dir}
            initial={{ x: dir > 0 ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? -40 : 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {/* Step number badge */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-5 text-sm font-bold"
              style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
            >
              {stepIndex + 1}
            </div>

            {/* Step text */}
            <p className="font-serif text-2xl text-[#F5F0E8] font-light leading-snug">
              {steps[stepIndex]}
            </p>

            {/* AI answer */}
            <AnimatePresence>
              {(aiLoading || aiAnswer) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-2xl px-4 py-3"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                >
                  {aiLoading
                    ? <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 text-[#C9A84C] animate-spin" />
                        <span className="text-[#F5F0E8]/40 text-sm">Consultando…</span>
                      </div>
                    : <p className="text-[#F5F0E8]/75 text-sm leading-relaxed">{aiAnswer}</p>
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-5 pb-8 pt-4 max-w-md mx-auto w-full" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}>

        {/* Mic button */}
        <div className="flex justify-center mb-5">
          {micSupported ? (
            <button
              onClick={toggleMic}
              disabled={aiLoading}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium transition-all disabled:opacity-40"
              style={
                isRecording
                  ? { background: "rgba(201,168,76,0.2)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.5)" }
                  : { background: "rgba(245,240,232,0.06)", color: "rgba(245,240,232,0.5)", border: "1px solid rgba(245,240,232,0.1)" }
              }
              aria-label={isRecording ? "Dejar de grabar" : "Hacer una pregunta por voz"}
            >
              {isTranscribing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : isRecording
                  ? <MicOff className="w-4 h-4" />
                  : <Mic className="w-4 h-4" />
              }
              {isTranscribing ? "Procesando…" : isRecording ? "Escuchando…" : "Pregunta por voz"}
            </button>
          ) : (
            <p className="text-[#F5F0E8]/20 text-xs">Micrófono no disponible en este dispositivo</p>
          )}
        </div>

        {/* Prev / Next */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition-all disabled:opacity-20"
            style={{ background: "rgba(245,240,232,0.06)", color: "#F5F0E8" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            onClick={() => {
              if (stepIndex < steps.length - 1) {
                goTo(stepIndex + 1)
              } else {
                stop()
                onClose()
              }
            }}
            className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition-all"
            style={{ background: "#6B2737", color: "#F5F0E8" }}
          >
            {stepIndex === steps.length - 1 ? "¡Lista! ✓" : <>Siguiente <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
