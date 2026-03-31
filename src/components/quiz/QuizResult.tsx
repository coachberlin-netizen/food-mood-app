"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { moods } from "@/data/moods"
import { useQuizStore } from "@/store/useQuizStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Share2, Bookmark, ArrowRight, BookOpen, Loader2, Sparkles } from "lucide-react"
import { WaitlistForm } from "@/components/auth/WaitlistForm"
import { saveTestResultToSupabase } from "@/lib/supabase"
import { createClient } from "@/lib/supabase/client"

export function QuizResult() {
  const router = useRouter()
  const resultMoodId = useQuizStore((state) => state.resultMood)
  const selections = useQuizStore((state) => state.selections)
  const resetQuiz = useQuizStore((state) => state.resetQuiz)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiRecipe, setAiRecipe] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const mood = moods.find(m => m.id === resultMoodId)

  useEffect(() => {
    const timer = setTimeout(() => setShowResult(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto-save test result to test_results table if user is authenticated
    if (isAuthenticated && showResult && user?.email && mood?.id) {
      const saveToDb = async () => {
        try {
          // get true supabase user id instead of store mock id
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await saveTestResultToSupabase(session.user.id, user.email, mood.id, selections);
          }
        } catch (error) {
          console.error("Failed to implicitly save to test_results", error);
        }
      };
      saveToDb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, showResult]);

  if (!mood) return null;

  if (!showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] flex-1">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", type: "tween" }}
            className="w-12 h-12 rounded-full border-2 border-aubergine-dark/10 border-t-gold"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xl font-serif italic text-aubergine-dark/70 text-center"
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
          <div className="w-24 h-24 rounded-full bg-aubergine/10 flex items-center justify-center text-5xl font-serif text-aubergine-dark drop-shadow-sm border border-aubergine-dark/10">
            {mood.emoji}
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-5xl md:text-7xl font-serif text-aubergine-dark" style={{ color: mood.color }}
        >
          Eres {mood.nombre}
        </motion.h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="w-full bg-cream rounded-xl p-10 md:p-14 shadow-luxury border border-aubergine-dark/20 mb-12"
      >
        <p className="text-xl md:text-2xl font-serif italic text-aubergine-dark/90 text-center mb-12 leading-relaxed">
          &quot;{mood.descripcion_corta}&quot;
        </p>

        <div className="space-y-12">
          <div>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/50 mb-4">Lo que tu cuerpo pide</h3>
            <p className="text-aubergine-dark/80 leading-[1.8] font-light text-base">
              {mood.descripcion || "Tu cuerpo está buscando equilibrio. Los alimentos funcionales nos ayudarán a regular tu sistema nervioso integrando nutrientes clave en este momento."}
            </p>
          </div>

          <div className="bg-[#faf9f6]/50 p-6 md:p-8 rounded-xl border border-aubergine-dark/20 space-y-4">
            <div>
              <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/50 mb-4">La ciencia detrás</h3>
              <p className="text-aubergine-dark/80 leading-[1.8] text-sm font-light">
                {mood.mecanismo}
              </p>
            </div>
            
            <div className="flex items-start gap-3 pt-6 border-t border-aubergine-dark/20 text-aubergine-dark/50 text-xs">
              <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-light">
                Las explicaciones científicas de Food·Mood son simplificaciones divulgativas. Nuestro objetivo es traducir la investigación sobre el eje intestino-cerebro a un lenguaje claro y útil — no sustituir la literatura académica ni la opinión de profesionales.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] mb-4 text-aubergine-dark">
              Tus superpoderes de hoy
            </h3>
            <div className="flex flex-wrap gap-2">
              {mood.ingredientes.map(ing => (
                <span key={ing} className="px-4 py-2 rounded-lg border border-aubergine-dark/20 text-aubergine-dark shadow-sm text-xs font-sans tracking-wide">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          
          {mood.ritualSugerido && (
            <div className="pt-8 border-t border-aubergine-dark/20">
              <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/50 mb-4">El Ritual de Hoy</h3>
              <p className="text-aubergine-dark/80 italic font-serif text-xl leading-relaxed text-center py-4">
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
          Explorar recetario
          <ArrowRight className="ml-3 w-5 h-5" />
        </button>
        <div className="w-full sm:flex-1 flex flex-col items-center">
          {!aiRecipe && (
          <button 
            className="w-full py-5 text-lg font-light rounded-xl shadow-sm hover:shadow-md border border-[#D4AF37]/50 bg-cream text-aubergine-dark flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isAuthenticated || isGenerating}
          onClick={async () => {
            try {
              setIsGenerating(true)
              const res = await fetch('/api/recipe/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moodId: mood.id, moodName: mood.nombre, userEmail: user?.email })
              })
              const data = await res.json()
              if (!res.ok) throw new Error(data.error)
              setAiRecipe(data)
              setIsFavorite(false)
            } catch (err: any) {
              setAiError('Error conectando con Claude. Intenta de nuevo.')
              console.error(err)
            } finally {
              setIsGenerating(false)
            }
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-3 w-5 h-5 animate-spin text-[#D4AF37]" />
              Creando alquimia...
            </>
          ) : (
            <>
              IA entrenada por el equipo Food·Mood
              <Sparkles className="ml-3 w-5 h-5 text-[#D4AF37]" />
            </>
          )}
          </button>
          )}
          {aiError && (
          <div className="w-full mt-3 p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center gap-3">
            <p className="text-sm text-red-700 text-center font-light">⚠️ {aiError}</p>
            <button
              onClick={() => { setAiError(null) }}
              className="text-xs font-sans text-red-600 hover:text-red-800 underline transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
        {!isAuthenticated && !aiRecipe && (
            <Link href="/auth/register" className="text-xs text-aubergine-dark/60 mt-3 font-sans hover:text-aubergine-dark transition-colors text-center w-full">
              Crea cuenta para recetas sin repetir cada día →
            </Link>
          )}
        </div>
      </motion.div>

      {/* Renderizado de la receta IA generada */}
      {aiRecipe && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="w-full bg-cream rounded-xl p-8 md:p-10 border border-[#D4AF37]/30 mt-8 shadow-sm text-left overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">Generada por Claude ✨</span>
          </div>
          <h2 className="text-3xl font-serif text-gray-900 mb-2 pr-16">{aiRecipe.title}</h2>
          <p className="text-sm font-light italic text-gray-700 mb-6">&quot;{aiRecipe.tagline}&quot;</p>
          
          <div className="flex gap-4 mb-8 text-xs font-sans tracking-wide uppercase text-gray-800 flex-wrap">
            <span className="bg-aubergine px-3 py-1 rounded-full border border-gray-200">⏱ {aiRecipe.prepTime} min</span>
            <span className="bg-aubergine px-3 py-1 rounded-full border border-gray-200">📈 {aiRecipe.difficulty}</span>
            <span className="bg-aubergine px-3 py-1 rounded-full border border-gray-200">🍽 {aiRecipe.servings} px</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-gray-900 mb-4 border-b border-gray-200 pb-2">Ingredientes</h3>
              <ul className="space-y-2 text-gray-800 font-light text-sm">
                {aiRecipe.ingredients?.map((ing: any, i: number) => (
                  <li key={i} className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-900">{ing.name}</span>
                    <span className="font-medium text-gray-700">{ing.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-sans uppercase tracking-[0.2em] text-gray-900 mb-4 border-b border-gray-200 pb-2">Preparación</h3>
              <ol className="space-y-4 text-gray-800 font-light text-sm list-decimal list-outside pl-4">
                {aiRecipe.steps?.map((step: string, i: number) => (
                  <li key={i} className="leading-relaxed pl-2 text-gray-800">{step}</li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="mt-8 bg-[#D4AF37]/5 p-5 rounded-xl text-sm font-light text-gray-800 italic border-l-2 border-[#D4AF37]">
            🧠 {aiRecipe.foodMoodNote}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={isFavorite}
              onClick={async () => {
                const supabase = createClient()
                const { error } = await supabase
                  .from('recipe_history')
                  .update({ is_favorite: true })
                  .eq('recipe_id', aiRecipe.id)
                  
                if (!error) setIsFavorite(true)
              }}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-2
                disabled:opacity-100 disabled:bg-[#D4AF37]/10 disabled:border-[#D4AF37] disabled:text-[#D4AF37]
                hover:bg-cream hover:border-[#D4AF37] text-aubergine-dark border-aubergine-dark/20"
            >
               {isFavorite ? "❤️ Guardada en favoritas" : "🤍 Guardar como favorita"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Redirección silenciosa si de alguna manera llegaron al result (sin Auth - ya protegido por TestPage, fallback opcional) */}
      {!isAuthenticated && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="w-full bg-[#faf9f6]/80 rounded-xl p-8 md:p-12 border border-aubergine-dark/20 mt-12 shadow-sm flex flex-col items-center"
        >
          <h3 className="text-center text-base font-sans font-light text-aubergine-dark mb-4 max-w-sm">
            Para ver tu resultado completo y guardar tu estado actual:
          </h3>
          <Link href="/auth/register">
             <button className="py-4 px-8 text-base font-light rounded-xl bg-aubergine-dark text-white hover:bg-aubergine-dark/90 transition-colors">
               Crear cuenta gratuita
             </button>
          </Link>
        </motion.div>
      )}



      <motion.button 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        onClick={resetQuiz} 
        className="mt-16 text-[11px] font-sans text-aubergine-dark/40 hover:text-aubergine-dark/60 transition-colors uppercase tracking-[0.2em]"
      >
        Repetir el Test
      </motion.button>
    </motion.div>
  )
}
