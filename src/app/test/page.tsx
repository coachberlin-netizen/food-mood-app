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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (currentStep >= quizData.length && !isFinished) {
      calculateResult()
    }
  }, [currentStep, isFinished, calculateResult])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

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
          {/* Mood emoji */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: moodObj?.color + '20' }}
          >
            {moodObj?.emoji || '✨'}
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-serif text-aubergine-dark">
              Ya conoces tu estado
            </h1>
            <p className="text-lg text-aubergine-dark/50 font-light">
              Tu último resultado: <span className="font-semibold text-aubergine-dark">{moodObj?.nombre}</span>
            </p>
          </div>

          {/* Actions */}
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
