"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { moods } from "@/data/moods"
import { useQuizStore } from "@/store/useQuizStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import { Share2, Bookmark, ArrowRight, BookOpen } from "lucide-react"
import { WaitlistForm } from "@/components/auth/WaitlistForm"
import { saveTestResultToSupabase } from "@/lib/supabase"

export function QuizResult() {
  const router = useRouter()
  const resultMoodId = useQuizStore((state) => state.resultMood)
  const selections = useQuizStore((state) => state.selections)
  const resetQuiz = useQuizStore((state) => state.resetQuiz)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const mood = moods.find(m => m.id === resultMoodId)

  useEffect(() => {
    const timer = setTimeout(() => setShowResult(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!mood) return null;

  if (!showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] flex-1">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", type: "tween" }}
            className="w-12 h-12 rounded-full border-2 border-navy/10 border-t-gold"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xl font-serif italic text-navy/70 text-center"
        >
          Traduciendo lo que sientes...
        </motion.p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.4 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center pt-8 pb-16"
    >
      <div className="text-center mb-10 w-full">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.4, bounce: 0.6 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="text-8xl drop-shadow-sm">{mood.emoji}</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-5xl md:text-7xl font-serif text-navy" style={{ color: mood.color }}
        >
          Eres {mood.nombre}
        </motion.h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="w-full bg-white rounded-xl p-10 md:p-14 shadow-luxury border border-[#edeae3] mb-12"
      >
        <p className="text-xl md:text-2xl font-serif italic text-navy/90 text-center mb-12 leading-relaxed">
          &quot;{mood.descripcion_corta}&quot;
        </p>

        <div className="space-y-12">
          <div>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/50 mb-4">Lo que tu cuerpo pide</h3>
            <p className="text-navy/80 leading-[1.8] font-light text-base">
              {mood.descripcion || "Tu cuerpo está buscando equilibrio. Los alimentos funcionales nos ayudarán a regular tu sistema nervioso integrando nutrientes clave en este momento."}
            </p>
          </div>

          <div className="bg-[#faf9f6]/50 p-6 md:p-8 rounded-xl border border-[#edeae3] space-y-4">
            <div>
              <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/50 mb-4">La ciencia detrás</h3>
              <p className="text-navy/80 leading-[1.8] text-sm font-light">
                {mood.mecanismo}
              </p>
            </div>
            
            <div className="flex items-start gap-3 pt-6 border-t border-[#edeae3] text-navy/50 text-xs">
              <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-light">
                Las explicaciones científicas de Food·Mood son simplificaciones divulgativas. Nuestro objetivo es traducir la investigación sobre el eje intestino-cerebro a un lenguaje claro y útil — no sustituir la literatura académica ni la opinión de profesionales.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] mb-4 text-navy">
              Tus superpoderes de hoy
            </h3>
            <div className="flex flex-wrap gap-2">
              {mood.ingredientes.map(ing => (
                <span key={ing} className="px-4 py-2 rounded-lg border border-[#edeae3] text-navy shadow-sm text-xs font-sans tracking-wide">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          
          {mood.ritualSugerido && (
            <div className="pt-8 border-t border-[#edeae3]">
              <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/50 mb-4">El Ritual de Hoy</h3>
              <p className="text-navy/80 italic font-serif text-xl leading-relaxed text-center py-4">
                ✨ {mood.ritualSugerido}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full"
      >
        <button 
          className="w-full sm:flex-1 py-5 text-lg font-light rounded-xl shadow-luxury hover:shadow-luxury-hover border border-transparent flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: mood.color, color: "#fff" }}
          onClick={() => router.push(`/recetas?mood=${mood.id}`)}
        >
          Descubre tu receta
          <ArrowRight className="ml-3 w-5 h-5" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full max-w-md mx-auto"
      >
        <input 
          type="email" 
          placeholder="Tu email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 w-full py-4 px-4 text-base font-light rounded-xl border border-[#edeae3] focus:outline-none focus:border-navy/30 bg-white"
        />
        <button 
          className="py-4 px-8 text-base font-light rounded-xl bg-navy text-white hover:bg-navy/90 transition-colors flex items-center justify-center whitespace-nowrap disabled:opacity-50"
          disabled={!email || isSaving}
          onClick={async () => {
            if (!email) return;
            try {
              setIsSaving(true)
              await saveTestResultToSupabase(email, resultMoodId!, selections)
              window.location.href = `https://food-mood-eight.vercel.app/recetas?mood=${resultMoodId}`
            } catch (error) {
              console.error(error)
              alert("Error al guardar el resultado.")
              setIsSaving(false)
            }
          }}
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
      </motion.div>

      {!isAuthenticated && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="w-full bg-[#faf9f6]/80 rounded-xl p-8 md:p-12 border border-[#edeae3] mt-12 shadow-sm flex flex-col items-center"
        >
          <h3 className="text-center text-base font-sans font-light text-navy mb-8 max-w-sm">
            ¿Quieres guardar esto y descubrir más recetas que te sientan increíble?
          </h3>
          <WaitlistForm className="mx-auto" />
        </motion.div>
      )}

      <motion.button 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        onClick={resetQuiz} 
        className="mt-16 text-[11px] font-sans text-navy/40 hover:text-navy/60 transition-colors uppercase tracking-[0.2em]"
      >
        Repetir el Test
      </motion.button>
    </motion.div>
  )
}
