"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    setSupported(true)

    const load = () => { voicesRef.current = window.speechSynthesis.getVoices() }
    load()
    window.speechSynthesis.addEventListener("voiceschanged", load)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load)
  }, [])

  const speak = useCallback((text: string, opts?: { rate?: number; pitch?: number }) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    // Strip markdown and JSON blobs from spoken text
    const clean = text
      .replace(/\{[^}]*"mood"[^}]*\}/g, "")
      .replace(/[*_`#>[\]]/g, "")
      .trim()

    if (!clean) return

    const utt = new SpeechSynthesisUtterance(clean)
    utt.lang  = "es-ES"
    utt.rate  = opts?.rate  ?? 0.92
    utt.pitch = opts?.pitch ?? 1.05

    const voices = voicesRef.current
    const esVoice =
      voices.find(v => v.lang === "es-ES" && /female|mujer|marta|monica|paula/i.test(v.name)) ||
      voices.find(v => v.lang === "es-ES") ||
      voices.find(v => v.lang.startsWith("es"))
    if (esVoice) utt.voice = esVoice

    utt.onstart = () => setIsSpeaking(true)
    utt.onend   = () => setIsSpeaking(false)
    utt.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utt)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, supported }
}
