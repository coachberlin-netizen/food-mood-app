"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { quizData } from "@/data/quiz"
import { moods } from "@/data/moods"
import { useQuizStore } from "@/store/useQuizStore"
import { QuizStep } from "@/components/quiz/QuizStep"
import { QuizProgress } from "@/components/quiz/QuizProgress"
import { QuizResult } from "@/components/quiz/QuizResult"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import Link from "next/link"
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react"

export default function TestPage() {
  const { currentStep, isFinished, leadingMood, calculateResult, resultMood, resetQuiz, quizCount } = useQuizStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Email capture state
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    setMounted(true)
    // Always start fresh when entering the test page
    resetQuiz()
  }, [resetQuiz])

  useEffect(() => {
    if (currentStep >= quizData.length && !isFinished) {
      // Show email gate only once
      const leadCaptured = localStorage.getItem('fm_lead_captured')
      if (leadCaptured) {
        calculateResult()
      } else {
        setShowEmailGate(true)
      }
    }
  }, [currentStep, isFinished, calculateResult])

  // Email submission handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Introduce un email válido')
      return
    }
    setEmailSubmitting(true)
    setEmailError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'quiz' }),
      })
      const data = await res.json()
      // 23505 = unique violation (email already exists) → treat as success
      if (!res.ok && data?.code !== '23505') {
        setEmailError('Algo ha ido mal. Inténtalo de nuevo.')
        setEmailSubmitting(false)
        return
      }
    } catch {
      setEmailError('Algo ha ido mal. Inténtalo de nuevo.')
      setEmailSubmitting(false)
      return
    }

    localStorage.setItem('fm_lead_captured', 'true')
    setShowEmailGate(false)
    setEmailSubmitting(false)
    calculateResult()
  }

  // Skip email
  const handleSkipEmail = () => {
    setShowEmailGate(false)
    calculateResult()
  }

  // Prevent hydration mismatch
  if (!mounted) return null;

  // ── EMAIL CAPTURE GATE (after quiz, before result) ──────────
  if (showEmailGate) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center p-6 md:p-12 bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full flex flex-col items-center text-center"
        >
          {/* Eyebrow */}
          <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#C9A84C] font-semibold mb-6">
            Tu estado Food·Mood está listo
          </span>

          <h2 className="text-3xl md:text-4xl font-serif italic text-aubergine-dark mb-4 leading-snug">
            ¿Dónde te lo enviamos?
          </h2>
          <p className="text-base text-aubergine-dark/50 font-light mb-8 leading-relaxed max-w-sm">
            Accede a tu resultado ahora y recibe cada semana una receta funcional personalizada para tu estado de ánimo.
          </p>

          <form onSubmit={handleEmailSubmit} className="w-full max-w-sm space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-4 rounded-xl border border-aubergine-dark/15 bg-cream text-aubergine-dark text-sm placeholder:text-aubergine-dark/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C]/50 transition-all"
                autoFocus
              />
              {emailError && (
                <p className="text-xs text-red-500 text-left mt-2">{emailError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={emailSubmitting}
              className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-aubergine-dark hover:bg-aubergine-dark/90 text-cream text-sm font-semibold rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all disabled:opacity-60"
            >
              {emailSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-cream/30 border-t-cream animate-spin" />
              ) : (
                <>
                  Ver mi resultado
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-[11px] text-aubergine-dark/30 font-light">
            Sin spam. Cancela cuando quieras.
          </p>

          <button
            onClick={handleSkipEmail}
            className="mt-4 text-[11px] text-aubergine-dark/25 hover:text-aubergine-dark/40 transition-colors cursor-pointer"
          >
            Prefiero no dejar mi email →
          </button>
        </motion.div>
      </div>
    )
  }

  // ── QUIZ ALREADY COMPLETED: show return screen ──────────────
  if (quizCount > 0 && !isFinished && currentStep === 0 && resultMood) {
    const moodObj = moods.find(m => m.id === resultMood)

    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center p-6 md:p-12 bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full flex flex-col items-center text-center gap-8"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: moodObj?.color + '20' }}
          >
            {moodObj?.emoji || '✨'}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-serif text-aubergine-dark">
              Ya conoces tu estado
            </h1>
            <p className="text-lg text-aubergine-dark/50 font-light">
              Tu último resultado: <span className="font-semibold text-aubergine-dark">{moodObj?.nombre}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Link
              href="/resultado"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-aubergine-dark text-cream text-sm font-semibold rounded-xl shadow-luxury hover:shadow-luxury-hover transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Ver mi resultado y receta
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => resetQuiz()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-aubergine-dark/60 font-medium hover:text-aubergine-dark transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Repetir el test
            </button>
          </div>

          <p className="text-[11px] text-aubergine-dark/30 font-light mt-4">
            Has completado {quizCount} {quizCount === 1 ? 'test' : 'tests'}
          </p>
        </motion.div>
      </div>
    )
  }

  const activeMoodObj = leadingMood ? moods.find(m => m.id === leadingMood) : null
  const backgroundColor = activeMoodObj?.fondo || "var(--background)"

  return (
    <motion.div 
      className="min-h-[calc(100vh-80px)] w-full flex flex-col p-6 md:p-12 lg:p-16 transition-colors duration-1000 ease-in-out"
      animate={{ backgroundColor }}
      style={{ backgroundColor: "#faf9f6" }}
    >
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col pt-8 lg:pt-16">
        {!isFinished && currentStep < quizData.length ? (
          <>
            <QuizProgress total={quizData.length} />
            <div className="flex-1 flex flex-col relative w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <QuizStep key={currentStep} question={quizData[currentStep]} />
              </AnimatePresence>
            </div>
          </>
        ) : (
          <QuizResult />
        )}
      </div>
    </motion.div>
  )
}
