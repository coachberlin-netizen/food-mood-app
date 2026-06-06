'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react'
import { EVALUACION_TESTS, SESSION_KEY_PREFIX } from '@/data/evaluacion-tests'

export function EvaluacionLanding() {
  const [completados, setCompletados] = useState<Set<string>>(new Set())

  useEffect(() => {
    const done = new Set<string>()
    for (const test of EVALUACION_TESTS) {
      const key = `${SESSION_KEY_PREFIX}${test.id}`
      const raw = sessionStorage.getItem(key)
      if (raw) {
        try {
          const data = JSON.parse(raw)
          if (data && Object.keys(data).length > 0) done.add(test.id)
        } catch { /* ignore */ }
      }
    }
    setCompletados(done)
  }, [])

  const totalCompletados = completados.size

  return (
    <div className="min-h-screen bg-[#1A0A0E] px-5 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-12 pb-8 text-center"
      >
        <p className="text-[#FF6B35] text-[10px] font-medium tracking-[0.3em] uppercase mb-4">
          Food·Mood · Evaluación Gratuita
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[#F5F0E8] font-light leading-tight mb-4">
          Tu perfil nutricional<br />
          <em className="italic text-[#FF6B35]">personalizado</em>
        </h1>
        <p className="text-[#F5F0E8]/55 text-sm leading-relaxed max-w-sm mx-auto">
          Completa uno o más tests y recibe una valoración orientativa generada por IA.
          Gratis. Sin compromiso.
        </p>
      </motion.div>

      {/* Progress indicator */}
      {totalCompletados > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-2xl border border-[#FF6B35]/30 bg-[#FF6B35]/8 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[#FF6B35] text-sm font-semibold">
              {totalCompletados} {totalCompletados === 1 ? 'test completado' : 'tests completados'}
            </p>
            <p className="text-[#F5F0E8]/40 text-xs mt-0.5">
              Cuantos más hagas, más completa será tu valoración
            </p>
          </div>
          <Link
            href="/evaluacion/resultado"
            className="flex items-center gap-1.5 bg-[#6B2737] text-[#F5F0E8] rounded-xl px-4 py-2.5 text-xs font-semibold hover:bg-[#5a212e] transition-all whitespace-nowrap"
          >
            Ver valoración <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      )}

      {/* Test cards */}
      <div className="space-y-3">
        {EVALUACION_TESTS.map((test, i) => {
          const isCompletado = completados.has(test.id)
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
            >
              <Link
                href={`/evaluacion/${test.id}`}
                className="block rounded-2xl p-5 border-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  borderColor: isCompletado ? test.color + '60' : 'rgba(255,255,255,0.08)',
                  background: isCompletado
                    ? `linear-gradient(135deg, ${test.color}14 0%, ${test.color}06 100%)`
                    : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                        style={{ color: test.color, backgroundColor: test.color + '18' }}
                      >
                        {test.tag}
                      </span>
                      {isCompletado && (
                        <CheckCircle2
                          className="w-4 h-4"
                          style={{ color: test.color }}
                        />
                      )}
                    </div>
                    <h2 className="text-[#F5F0E8] font-serif text-lg font-light leading-snug mb-1">
                      {test.titulo}
                    </h2>
                    <p className="text-[#F5F0E8]/40 text-xs leading-relaxed">
                      {test.descripcion}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    <div className="flex items-center gap-1 text-[#F5F0E8]/30 text-xs">
                      <Clock className="w-3 h-3" />
                      {test.duracion}
                    </div>
                    <div
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                      style={{
                        color: isCompletado ? test.color : '#F5F0E8',
                        backgroundColor: isCompletado ? test.color + '20' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {isCompletado ? 'Repetir' : 'Hacer →'}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* CTA bottom */}
      {totalCompletados === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-[#F5F0E8]/30 text-xs leading-relaxed">
            Empieza por cualquier test — no hay orden obligatorio.<br />
            La valoración IA se genera al finalizar al menos uno.
          </p>
        </motion.div>
      )}

      {totalCompletados > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <Link
            href="/evaluacion/resultado"
            className="inline-flex items-center gap-2 bg-[#6B2737] text-[#F5F0E8] rounded-[60px] px-8 py-4 text-sm font-semibold hover:bg-[#5a212e] transition-all hover:scale-105 active:scale-95"
          >
            Recibir mi valoración gratuita <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[#F5F0E8]/25 text-xs mt-3">
            Generada por IA · Orientativa · No sustituye a un profesional
          </p>
        </motion.div>
      )}
    </div>
  )
}
