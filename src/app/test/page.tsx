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

export default function TestPage() {
  const { currentStep, isFinished, leadingMood, calculateResult } = useQuizStore()
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

  // Se ha eliminado la redirección automática a /auth/register
  // para permitir que el usuario vea su resultado del test en pantalla.

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

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
