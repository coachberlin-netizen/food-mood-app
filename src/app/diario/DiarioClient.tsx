"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { usePalette } from "@/contexts/PaletteContext"
import {
  analyzeWeek,
  analyzeMonth,
  type DiaryEntry,
  type WeeklyAnalysis,
  type MonthlyAnalysis,
} from "@/lib/diary-analysis"
import { WeekMosaic } from "@/components/diary/WeekMosaic"
import { MonthMosaic } from "@/components/diary/MonthMosaic"
import { DiarioForm } from "@/components/diary/DiarioForm"
import { ChevronDown, ChevronUp, Lock, Sparkles, Calendar, BookOpen, Brain } from "lucide-react"
import Link from "next/link"

const MOOD_COLORS: Record<string, string> = {
  activacion: "#E8A87C",
  calma:      "#7EC8C8",
  focus:      "#F4E285",
  social:     "#F4A7B9",
  reset:      "#B8A9C9",
  confort:    "#D4A574",
}

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"]

interface Patron {
  observacion: string
  pregunta:    string
  confianza:   string
}

export default function DiarioClient({ initialIsPremium }: { initialIsPremium: boolean }) {
  const { refreshPalette } = usePalette()
  const [isPremium,   setIsPremium]   = useState(initialIsPremium)
  const [loading,     setLoading]     = useState(true)
  const [user,        setUser]        = useState<any>(null)

  const [weekAnalysis,  setWeekAnalysis]  = useState<WeeklyAnalysis | null>(null)
  const [monthAnalysis, setMonthAnalysis] = useState<(MonthlyAnalysis & { moodGrid: string[][]; monthName: string }) | null>(null)
  const [historyMonths, setHistoryMonths] = useState<any[]>([])
  const [openMonth,     setOpenMonth]     = useState<string | null>(null)

  const [patrones,        setPatrones]        = useState<Patron[] | null>(null)
  const [patronesLoading, setPatronesLoading] = useState(false)
  const [insuficiente,    setInsuficiente]    = useState(false)

  const supabase = createClient()

  // ── Fetch palette/visualization data ──────────────────────────────────────
  const fetchData = useCallback(async (userId: string) => {
    const { data: allEntries, error } = await supabase
      .from("emotional_palettes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200)

    if (error || !allEntries) return

    const mappedEntries: DiaryEntry[] = allEntries.map(e => ({
      id:              e.id,
      created_at:      e.created_at,
      energia:         e.energia,
      calma:           e.serenidad || e.calma || 5,
      claridad:        e.claridad,
      conexion:        e.conexion,
      mood_dominante:  e.mood_dominante,
      mood_secundario: e.mood_secundario,
      color_resultado: e.color_resultado,
      nota:            e.nota,
      receta_cocinada: e.recetas_sugeridas?.[0] || null,
      dia_semana:      new Date(e.created_at).toLocaleDateString("es-ES", { weekday: "long" }),
    }))

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    setWeekAnalysis(analyzeWeek(mappedEntries.filter(e => new Date(e.created_at) >= weekStart)))

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyEntries = mappedEntries.filter(e => new Date(e.created_at) >= monthStart)
    const grouped = groupEntriesByWeek(monthlyEntries, now.getFullYear(), now.getMonth())
    setMonthAnalysis({
      ...analyzeMonth([analyzeWeek(monthlyEntries)]),
      colorGrid: grouped.colorGrid,
      moodGrid:  grouped.moodGrid,
      monthName: `${now.toLocaleString("es-ES", { month: "long" })} ${now.getFullYear()}`,
    } as any)

    const history = []
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mEntries = mappedEntries.filter(e => {
        const ed = new Date(e.created_at)
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear()
      })
      if (mEntries.length > 0) {
        const g = groupEntriesByWeek(mEntries, d.getFullYear(), d.getMonth())
        history.push({
          id:           `${d.getFullYear()}-${d.getMonth()}`,
          name:         d.toLocaleString("es-ES", { month: "long", year: "numeric" }),
          analysis:     { ...analyzeMonth([analyzeWeek(mEntries)]), ...g },
          distribution: analyzeMonth([analyzeWeek(mEntries)]).moodDistribution,
        })
      }
    }
    setHistoryMonths(history)
  }, [supabase])

  // ── Fetch AI pattern insights (premium only) ───────────────────────────────
  const fetchPatrones = useCallback(async () => {
    setPatronesLoading(true)
    try {
      const res = await fetch("/api/diario/patrones")
      if (!res.ok) return
      const data = await res.json()
      if (data.insuficiente) { setInsuficiente(true); return }
      setPatrones(data.patrones ?? [])
    } catch {
      // silent — patterns are a nice-to-have
    } finally {
      setPatronesLoading(false)
    }
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      setUser(session.user)
      setIsPremium(initialIsPremium)
      if (initialIsPremium) {
        await fetchData(session.user.id)
        fetchPatrones()
      }
      setLoading(false)
    }
    init()
  }, [supabase, fetchData, fetchPatrones, initialIsPremium])

  // Called after DiarioForm saves — refresh palette visualization
  const handleSaved = useCallback(async () => {
    await refreshPalette()
    if (user) await fetchData(user.id)
  }, [refreshPalette, fetchData, user])

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-6 w-96 bg-gray-100 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
            <div className="h-80 bg-gray-100 animate-pulse rounded-[2rem]" />
            <div className="h-80 bg-gray-100 animate-pulse rounded-[2rem]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-32">
      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col gap-20">

        {/* ── Header ── */}
        <header className="flex flex-col gap-4">
          <h1 className="font-serif text-[40px] md:text-[56px] text-[#6B2737] leading-tight font-black">
            Tu Diario
          </h1>
          <p className="font-sans text-[18px] md:text-[22px] text-[#9CA3AF] font-light max-w-2xl leading-relaxed">
            Mood, cuerpo y comida en una página al día.
            El agente lo lee todo y empieza a detectar lo que tú sola no ves.
          </p>
        </header>

        {/* ── DiarioForm — visible para todos ── */}
        <section className="bg-white rounded-[2.5rem] px-8 py-10 shadow-sm border border-[#6B2737]/5">
          <DiarioForm onSaved={handleSaved} />
        </section>

        {/* ── Insights del agente (premium) / Teaser (free) ── */}
        {!isPremium ? (
          <section className="relative">
            {/* Blurred teaser */}
            <div className="blur-sm opacity-40 pointer-events-none select-none space-y-4">
              {[
                "Tus días de Restauración coinciden con cenas pasadas las 21h en 4 de las últimas 6 semanas.",
                "Cuando anotas proteína en el almuerzo, al día siguiente aparece Foco o Activación.",
              ].map((obs, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-[#6B2737]/8">
                  <div className="flex items-start gap-3">
                    <Brain size={16} className="text-[#C9A84C] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#2d0f16] leading-relaxed">{obs}</p>
                      <p className="text-[13px] text-[#6B2737]/60 mt-2 italic">¿Te apetecería probar una semana de cenas a las 19h?</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Paywall overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md px-10 py-8 rounded-[2rem] shadow-xl border border-[#6B2737]/10 flex flex-col items-center gap-5 text-center max-w-sm">
                <div className="w-12 h-12 rounded-full bg-[#6B2737]/5 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#6B2737]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#6B2737] font-bold mb-1">Patrones del agente</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
                    Con 5 días de diario el agente empieza a detectar correlaciones que tú sola no verías.
                  </p>
                </div>
                <Link href="/pricing" className="bg-[#6B2737] text-[#F5F0E8] px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#5a2230] transition-colors">
                  Desbloquear Premium →
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-[#C9A84C]" />
              <h2 className="font-serif text-[26px] text-[#6B2737] font-bold italic">Lo que ve el agente</h2>
            </div>

            {patronesLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-[#6B2737]/8 animate-pulse">
                    <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
                    <div className="h-3 w-1/2 bg-gray-50 rounded" />
                  </div>
                ))}
              </div>
            ) : insuficiente ? (
              <div className="bg-white rounded-2xl p-8 border border-[#6B2737]/8 text-center">
                <p className="text-[15px] text-[#6B2737]/60 font-light leading-relaxed">
                  Necesito al menos 5 días de diario para detectar patrones.
                  Sigue anotando — cuanto más escribas, más preciso me vuelvo.
                </p>
              </div>
            ) : patrones && patrones.length > 0 ? (
              <div className="space-y-4">
                {patrones.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-[#6B2737]/8"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 w-2 h-2 rounded-full shrink-0"
                        style={{ background: p.confianza === "alta" ? "#C9A84C" : "#B8A9C9" }}
                      />
                      <div>
                        <p className="text-[14px] text-[#2d0f16] leading-relaxed font-medium">{p.observacion}</p>
                        <p className="text-[13px] text-[#6B2737]/55 mt-2 italic">{p.pregunta}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button
                  onClick={fetchPatrones}
                  className="text-[11px] uppercase tracking-widest text-[#6B2737]/30 hover:text-[#6B2737]/60 transition-colors mt-2"
                >
                  Actualizar análisis
                </button>
              </div>
            ) : null}
          </section>
        )}

        {/* ── Visualizaciones (premium only) ── */}
        {isPremium && (
          <div className="flex flex-col gap-24">
            {weekAnalysis && (
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-6 h-6 text-[#C9A84C]" />
                  <h2 className="font-serif text-[28px] md:text-[32px] text-[#6B2737] font-bold italic">Esta semana</h2>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#6B2737]/5">
                  <WeekMosaic
                    colors={weekAnalysis.colorSequence}
                    labels={DAY_LABELS}
                    moods={weekAnalysis.entries.map(e => e.mood_dominante)}
                    hasNota={weekAnalysis.entries.map(e => e.nota !== null)}
                    dominantMood={weekAnalysis.dominantMood}
                    dominantColor={weekAnalysis.dominantColor}
                    size="full"
                    animate={true}
                  />
                  <div className="mt-12 flex flex-col gap-4 text-center max-w-2xl mx-auto">
                    {weekAnalysis.pattern && <p className="font-sans text-[18px] text-[#6B2737] italic">&quot;{weekAnalysis.pattern}&quot;</p>}
                    <p className="font-sans text-[16px] text-[#6B7280] leading-relaxed">{weekAnalysis.recommendation}</p>
                  </div>
                </div>
              </section>
            )}

            {monthAnalysis && (
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                  <BookOpen className="w-6 h-6 text-[#C9A84C]" />
                  <h2 className="font-serif text-[28px] md:text-[32px] text-[#6B2737] font-bold italic">Este mes</h2>
                </div>
                <MonthMosaic
                  colorGrid={monthAnalysis.colorGrid}
                  moodGrid={monthAnalysis.moodGrid}
                  monthName={monthAnalysis.monthName}
                  moodDistribution={monthAnalysis.moodDistribution}
                  insight={monthAnalysis.insight}
                  animate={true}
                />
              </section>
            )}

            {historyMonths.length > 0 && (
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-[#C9A84C]" />
                  <h2 className="font-serif text-[28px] md:text-[32px] text-[#6B2737] font-bold italic">Tu historia emocional</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {historyMonths.map((m) => {
                    const isOpen = openMonth === m.id
                    return (
                      <div key={m.id} className="bg-white rounded-3xl overflow-hidden border border-[#6B2737]/5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setOpenMonth(isOpen ? null : m.id)}
                          className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-8">
                            <span className="font-sans text-lg font-bold text-[#6B2737] capitalize w-48">{m.name}</span>
                            <div className="hidden md:flex w-40 h-2 rounded-full overflow-hidden bg-gray-100">
                              {Object.entries(m.distribution).map(([mid, count]: [string, any]) => (
                                <div key={mid} style={{ width: `${(count / 30) * 100}%`, backgroundColor: MOOD_COLORS[mid] }} />
                              ))}
                            </div>
                          </div>
                          {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="border-t border-[#6B2737]/5 p-10 flex justify-center bg-gray-50/50"
                            >
                              <MonthMosaic
                                colorGrid={m.analysis.colorGrid}
                                moodGrid={m.analysis.moodGrid}
                                monthName={m.name}
                                moodDistribution={m.analysis.moodDistribution}
                                insight={m.analysis.insight}
                                animate={false}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}

      </div>
    </main>
  )
}

function groupEntriesByWeek(entries: DiaryEntry[], year: number, month: number) {
  const colorGrid: string[][] = Array(5).fill(null).map(() => Array(7).fill("#E0E0E0"))
  const moodGrid:  string[][] = Array(5).fill(null).map(() => Array(7).fill(""))
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  entries.forEach(e => {
    const d = new Date(e.created_at)
    if (d.getMonth() === month && d.getFullYear() === year) {
      const totalIndex = d.getDate() + startOffset - 1
      const weekIdx = Math.floor(totalIndex / 7)
      const dayIdx  = totalIndex % 7
      if (weekIdx < 5) {
        colorGrid[weekIdx][dayIdx] = e.color_resultado
        moodGrid[weekIdx][dayIdx]  = e.mood_dominante
      }
    }
  })
  return { colorGrid, moodGrid }
}
