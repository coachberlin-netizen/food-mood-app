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
import { ArrowRight, RefreshCw, Sparkles, Mail, Shield } from "lucide-react"

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
  }, [])

  useEffect(() => {
    if (currentStep >= quizData.length && !isFinished) {
      // Instead of immediately showing result, show email gate
      const emailCaptured = localStorage.getItem('food-mood-email-captured')
      if (emailCaptured) {
        calculateResult()
      } else {
        setShowEmailGate(true)
      }
    }
  }, [currentStep, isFinished, calculateResult])

  // Email submission handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setEmailError('Introduce un email válido')
      return
    }
    setEmailSubmitting(true)
    setEmailError('')

    try {
      // Save to Supabase via API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'quiz_completion' }),
      })
    } catch {
      // Continue even if save fails
    }

    localStorage.setItem('food-mood-email-captured', 'true')
    localStorage.setItem('food-mood-email', email)
    setShowEmailGate(false)
    setEmailSubmitting(false)
    calculateResult()
  }

  // Skip email (but still allow quiz result)
  const handleSkipEmail = () => {
    localStorage.setItem('food-mood-email-captured', 'skipped')
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
          {/* Animated pulse icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 flex items-center justify-center mb-8"
          >
            <Sparkles className="w-8 h-8 text-[#C9A84C]" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-serif text-aubergine-dark mb-3 leading-snug">
            Tu estado Food·Mood<br />está listo.
          </h1>
          <p className="text-base text-aubergine-dark/50 font-light mb-8">
            Antes de revelártelo: ¿dónde te lo enviamos?
          </p>

          <form onSubmit={handleEmailSubmit} className="w-full max-w-sm space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aubergine-dark/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                placeholder="Tu email"
                className="w-full pl-11 pr-4 py-4 rounded-xl border border-aubergine-dark/15 bg-cream text-aubergine-dark text-sm placeholder:text-aubergine-dark/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C]/50 transition-all"
                autoFocus
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-500 text-left">{emailError}</p>
            )}
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

          <div className="flex items-center gap-2 mt-6 text-[11px] text-aubergine-dark/30 font-light">
            <Shield className="w-3 h-3" />
            Acceso inmediato. Sin spam. Cancela cuando quieras.
          </div>

          <button
            onClick={handleSkipEmail}
            className="mt-4 text-[11px] text-aubergine-dark/25 hover:text-aubergine-dark/40 transition-colors underline"
          >
            Continuar sin email
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
