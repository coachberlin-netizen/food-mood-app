"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export type RecordingState = "idle" | "recording" | "transcribing"

interface UseVoiceInputOptions {
  onFinalTranscript?: (text: string) => void
  onStateChange?:     (state: RecordingState) => void
  lang?: string
}

// MediaRecorder path: works on iOS Safari, Chrome Android, Firefox
async function transcribeBlob(blob: Blob): Promise<string> {
  const fd = new FormData()
  fd.append("audio", blob, "audio.webm")
  const res  = await fetch("/api/voice/transcribe", { method: "POST", body: fd })
  const data = await res.json()
  return data.text ?? ""
}

export function useVoiceInput({
  onFinalTranscript,
  onStateChange,
  lang = "es-ES",
}: UseVoiceInputOptions = {}) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [supported, setSupported]           = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef        = useRef<BlobPart[]>([])
  const cbRef            = useRef({ onFinalTranscript, onStateChange })
  cbRef.current = { onFinalTranscript, onStateChange }

  useEffect(() => {
    setSupported(!!(navigator.mediaDevices?.getUserMedia))
  }, [])

  const setState = useCallback((s: RecordingState) => {
    setRecordingState(s)
    cbRef.current.onStateChange?.(s)
  }, [])

  const startRecording = useCallback(async () => {
    if (recordingState !== "idle") return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } })

      // Pick a supported MIME type (iOS needs audio/mp4)
      const mimeType =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" :
        MediaRecorder.isTypeSupported("audio/webm")             ? "audio/webm"             :
        MediaRecorder.isTypeSupported("audio/mp4")              ? "audio/mp4"              :
        ""

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      chunksRef.current = []

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }

      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setState("transcribing")
        try {
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" })
          const text = await transcribeBlob(blob)
          if (text) cbRef.current.onFinalTranscript?.(text)
        } finally {
          setState("idle")
        }
      }

      mr.start(250) // collect chunks every 250 ms
      mediaRecorderRef.current = mr
      setState("recording")
    } catch {
      setState("idle")
    }
  }, [recordingState, setState])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const toggle = useCallback(() => {
    if (recordingState === "idle")      startRecording()
    else if (recordingState === "recording") stopRecording()
    // transcribing: do nothing, wait
  }, [recordingState, startRecording, stopRecording])

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream?.getTracks().forEach(t => t.stop())
    }
  }, [])

  return {
    recordingState,
    isRecording:    recordingState === "recording",
    isTranscribing: recordingState === "transcribing",
    toggle,
    startRecording,
    stopRecording,
    supported,
    // Legacy alias used by asistente
    isListening: recordingState === "recording",
    startListening: startRecording,
    stopListening:  stopRecording,
    interim: "",
  }
}
