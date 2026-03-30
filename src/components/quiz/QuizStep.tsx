"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { QuizQuestion } from "@/data/quiz"
import { useQuizStore } from "@/store/useQuizStore"
import { moods } from "@/data/moods"

export function QuizStep({ question }: { question: QuizQuestion }) {
  const answerQuestion = useQuizStore((state) => state.answerQuestion)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center flex-1"
    >
      <h2 className="text-3xl md:text-6xl font-serif text-aubergine-dark mb-16 text-center tracking-tight leading-[1.2]">
        {question.question}
      </h2>

      <div className="w-full max-w-xl flex flex-col gap-3">
        {question.options.map((option, idx) => {
          // Determine the mood color for this option (first mood point)
          const moodId = option.points[0]?.mood
          const moodObj = moods.find(m => m.id === moodId)
          const hoverBg = moodObj?.fondo || "#f7f5f0"
          const hoverBorder = moodObj?.color || "#1a2b4a"
          const isHovered = hoveredIdx === idx

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => answerQuestion(option.points)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="w-full text-left px-8 py-6 md:py-7 rounded-xl border transition-all duration-300 text-lg font-light flex items-center justify-between group"
              style={{
                backgroundColor: isHovered ? hoverBg : "#ffffff",
                borderColor: isHovered ? hoverBorder : "#edeae3",
                color: isHovered ? hoverBorder : "rgba(26,43,74,0.9)",
                boxShadow: isHovered
                  ? "0 4px 24px rgba(0,0,0,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <span>{option.text}</span>
              <span
                className="transition-opacity font-serif text-2xl leading-none"
                style={{ opacity: isHovered ? 1 : 0 }}
              >
                →
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
