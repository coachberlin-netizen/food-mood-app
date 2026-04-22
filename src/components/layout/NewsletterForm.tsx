"use client"

import * as React from "react"

import { useState } from "react"

import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

interface NewsletterFormProps {
  source?: string;
  dark?: boolean;
}

export function NewsletterForm({ source = 'footer', dark = true }: NewsletterFormProps) {
  const [nlEmail, setNlEmail] = useState('')
  const [nlSent, setNlSent] = useState(false)
  const [nlLoading, setNlLoading] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nlEmail || !nlEmail.includes('@')) return
    setNlLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail, source }),
      })
    } catch {}
    setNlSent(true)
    setNlLoading(false)
  }

  if (nlSent) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm ${
          dark ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#1A2332]/10 border border-[#1A2332]/20 text-[#1A2332]'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>¡Suscrito con éxito!</span>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleNewsletter} method="post" className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
      <div className="flex w-full sm:w-auto gap-2">
        <div className="relative flex-1 sm:flex-initial">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${dark ? 'text-cream/30' : 'text-aubergine-dark/30'}`} />
          <input
            type="email"
            value={nlEmail}
            onChange={(e) => setNlEmail(e.target.value)}
            placeholder="tu email"
            className={`w-full sm:w-48 pl-9 pr-3 py-2.5 rounded-lg border text-xs placeholder:text-opacity-25 focus:outline-none focus:ring-1 transition-all ${
              dark 
                ? 'bg-cream/10 border-cream/15 text-white placeholder:text-cream focus:ring-[#C9A84C]/40' 
                : 'bg-aubergine-dark/5 border-aubergine-dark/10 text-aubergine-dark placeholder:text-aubergine-dark focus:ring-aubergine-dark/20'
            }`}
            required
          />
        </div>
        <button
          type="submit"
          disabled={nlLoading}
          className={`px-6 py-2.5 font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg active:scale-95 min-w-[110px] justify-center text-xs ${
            dark 
              ? 'bg-[#C9A84C] hover:bg-[#b8953e] text-white hover:shadow-[#C9A84C]/20' 
              : 'bg-aubergine-dark hover:bg-aubergine-dark/90 text-cream'
          }`}
        >
          {nlLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <>
              <Send className="w-3 h-3" />
              Suscribirse
            </>
          )}
        </button>
      </div>
    </form>
  )
}
