"use client"

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

type ToastVariant = "success" | "error" | "info"

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  copyValue?: string
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
  toastCopy: (message: string, valueToCopy: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider")
  return ctx
}

function Toast({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  const [copied, setCopied] = useState(false)
  // Ref keeps the timer stable even as onRemove reference changes across renders
  const onRemoveRef = useRef(onRemove)
  useEffect(() => { onRemoveRef.current = onRemove })

  useEffect(() => {
    const t = setTimeout(() => onRemoveRef.current(), 4000)
    return () => clearTimeout(t)
  }, []) // intentionally empty — timer fires once per mount

  const handleCopy = async () => {
    if (!item.copyValue) return
    await navigator.clipboard.writeText(item.copyValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#10B981" }} />,
    error:   <XCircle    className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} />,
    info:    <Info       className="w-4 h-4 shrink-0" style={{ color: "#C9A84C" }} />,
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 8,  scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl pointer-events-auto"
      style={{
        background: "#2d0f16",
        border: "1px solid rgba(201,168,76,0.2)",
        color: "#F5F0E8",
        minWidth: 240,
        maxWidth: 340,
      }}
    >
      {icons[item.variant]}
      <p className="flex-1 text-sm leading-snug">{item.message}</p>
      {item.copyValue && (
        <button
          onClick={handleCopy}
          className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
          style={{
            background: copied ? "rgba(16,185,129,0.2)" : "rgba(201,168,76,0.15)",
            color: copied ? "#10B981" : "#C9A84C",
          }}
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      )}
      <button
        onClick={onRemove}
        className="shrink-0 p-0.5 rounded transition-opacity opacity-40 hover:opacity-70"
        style={{ color: "#F5F0E8" }}
        aria-label="Cerrar"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, variant }])
  }, [])

  const toastCopy = useCallback((message: string, valueToCopy: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, variant: "info", copyValue: valueToCopy }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toastCopy }}>
      {children}
      {/* Bottom-center mobile / top-right desktop */}
      <div className="fixed z-[9999] flex flex-col gap-2 pointer-events-none items-center bottom-20 left-0 right-0 px-4 md:bottom-auto md:top-6 md:right-6 md:left-auto md:items-end md:px-0">
        <AnimatePresence mode="sync">
          {toasts.map(item => (
            <Toast key={item.id} item={item} onRemove={() => removeToast(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
