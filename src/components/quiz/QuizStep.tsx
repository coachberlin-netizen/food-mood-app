"use client"

import { motion } from "framer-motion"
import { QuizQuestion, OptionPoint } from "@/data/quiz"
import { useQuizStore } from "@/store/useQuizStore"
import { moods } from "@/data/moods"

export function QuizStep({ question }: { question: QuizQuestion }) {
  const answerQuestion = useQuizStore((state) => state.answerQuestion)

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center flex-1"
    >
      <h2 className="text-3xl md:text-6xl font-serif text-navy mb-16 text-center tracking-tight leading-[1.2]">
        {question.question}
      </h2>
      
      <div className="w-full max-w-xl flex flex-col gap-3">
        {question.options.map((option, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => answerQuestion(option.points)}
            className="w-full text-left p-6 md:p-8 rounded-xl bg-white border border-[#edeae3] shadow-luxury hover:border-navy/30 hover:shadow-luxury-hover transition-all duration-300 text-lg font-light text-navy/90 flex items-center justify-between group"
          >
            <span>{option.text}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-navy/40 font-serif text-2xl leading-none">&rarr;</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
