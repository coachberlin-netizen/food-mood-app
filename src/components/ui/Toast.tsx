import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string;
  message: string;
  type?: "default" | "success" | "error";
  onClose: (id: string) => void;
}

export function Toast({ id, message, type = "default", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const colors = {
    default: "bg-aubergine-dark text-cream dark:bg-cream dark:text-aubergine-dark",
    success: "bg-sage text-aubergine-dark",
    error: "bg-coral text-aubergine-dark",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={cn("pointer-events-auto flex items-center justify-between space-x-4 rounded-full px-6 py-3 shadow-lg", colors[type])}
    >
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => onClose(id)} className="opacity-70 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}
