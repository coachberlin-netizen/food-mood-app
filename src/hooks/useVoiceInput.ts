"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any

interface UseVoiceInputOptions {
  onFinalTranscript?: (text: string) => void
  onInterimTranscript?: (text: string) => void
  onEnd?: () => void
  lang?: string
}

function getSpeechRecognition(): AnyRecognition | null {
  if (typeof window === "undefined") return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
}

export function useVoiceInput({
  onFinalTranscript,
  onInterimTranscript,
  onEnd,
  lang = "es-ES",
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [interim, setInterim] = useState("")
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<AnyRecognition>(null)
  const cbRef = useRef({ onFinalTranscript, onInterimTranscript, onEnd })
  cbRef.current = { onFinalTranscript, onInterimTranscript, onEnd }

  useEffect(() => {
    setSupported(!!getSpeechRecognition())
  }, [])

  const startListening = useCallback(() => {
    const API = getSpeechRecognition()
    if (!API) return

    recognitionRef.current?.abort()

    const rec = new API()
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (event: AnyRecognition) => {
      let interimText = ""
      let finalText = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) finalText += t
        else interimText += t
      }
      setInterim(interimText || finalText)
      if (interimText) cbRef.current.onInterimTranscript?.(interimText)
      if (finalText)   cbRef.current.onFinalTranscript?.(finalText)
    }

    rec.onend = () => {
      setIsListening(false)
      setInterim("")
      cbRef.current.onEnd?.()
    }

    rec.onerror = () => {
      setIsListening(false)
      setInterim("")
    }

    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }, [lang])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  return { isListening, interim, startListening, stopListening, supported }
}
