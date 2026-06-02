"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, Circle } from "lucide-react"
import { usePatientAssignments } from "@/hooks/useAssignments"
import { useActivePatientProtocol } from "@/hooks/useActivePatientProtocol"
import { motion } from "framer-motion"

const TOOL_LABELS: Record<string, string> = {
  "registro/interoceptivo": "Check-in interoceptivo",
  "registro/hambre":        "Termómetro de hambre",
  "registro/emocion":       "Registro emocional",
  "registro/comida":        "Pre/post comida",
  "registro/pensamiento":   "Diario de pensamientos",
  "setup/valores":          "Clarificación de valores",
  "setup/intenciones":      "Planes si-entonces",
}

function ProgressDots({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        i < done ? (
          <motion.span
            key={i}
            className="block w-3 h-3 rounded-full"
            style={{ background: "#C9A84C" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08, type: "spring", stiffness: 300, damping: 15 }}
          />
        ) : (
          <Circle key={i} className="w-3 h-3" style={{ color: "rgba(107,39,55,0.2)" }} />
        )
      ))}
    </div>
  )
}

export function MisAsignacionesClient() {
  const { assignments, loading } = usePatientAssignments()
  const { protocol, loading: protocolLoading } = useActivePatientProtocol()

  const total   = assignments.length
  const pending = assignments.filter(a => a.completions_this_week < a.frequency_per_week).length

  return (
    <div className="min-h-screen pb-24" style={{ background: "#F5F0E8" }}>
      <div className="max-w-lg mx-auto px-5 py-10">

        <Link href="/practicas" className="inline-flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "rgba(107,39,55,0.6)" }}>
          <ArrowLeft className="w-4 h-4" /> Mis prácticas
        </Link>

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Mis asignaciones</h1>
        <p className="text-xs mb-6" style={{ color: "rgba(107,39,55,0.5)" }}>Prácticas asignadas por tu profesional esta semana</p>

        {/* Card de protocolo activo */}
        {!protocolLoading && protocol && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl px-5 py-4 mb-6"
            style={{ border: "1px solid rgba(107,39,55,0.12)", borderLeftWidth: 3, borderLeftColor: "#6B2737" }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#6B2737" }}>
              Protocolo activo
            </p>
            <p className="text-sm font-bold mb-0.5" style={{ color: "#2d0f16" }}>
              {protocol.protocol_name} — Día {protocol.days_elapsed} de {protocol.duration_days}
            </p>
            <p className="text-xs font-light mb-3" style={{ color: "rgba(107,39,55,0.6)" }}>
              {protocol.stage_name}
            </p>

            {/* 5 stage circles */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: protocol.total_stages }, (_, i) => {
                const stageNum = i + 1
                const isDone   = stageNum < protocol.current_stage
                const isActive = stageNum === protocol.current_stage
                return (
                  <div
                    key={stageNum}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: isDone
                        ? "#16a34a"
                        : isActive
                        ? "#6B2737"
                        : "rgba(107,39,55,0.12)",
                    }}
                  >
                    <span style={{ fontSize: "8px", fontWeight: 700, color: isActive || isDone ? "#fff" : "rgba(107,39,55,0.3)" }}>
                      {stageNum}
                    </span>
                  </div>
                )
              })}
              <span className="text-[10px] ml-1" style={{ color: "rgba(107,39,55,0.45)" }}>
                Etapa {protocol.current_stage} de {protocol.total_stages}
              </span>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-2" style={{ color: "rgba(107,39,55,0.5)" }}>
              Sin asignaciones por ahora.
            </p>
            <p className="text-xs" style={{ color: "rgba(107,39,55,0.35)" }}>
              Tu profesional de salud puede asignarte prácticas específicas.
            </p>
          </div>
        ) : (
          <>
            {/* Resumen semanal */}
            <div className="bg-white rounded-2xl px-5 py-4 mb-6" style={{ border: "1px solid rgba(107,39,55,0.08)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(107,39,55,0.35)" }}>
                Esta semana
              </p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-2xl font-serif font-bold" style={{ color: pending > 0 ? "#6B2737" : "#16a34a" }}>
                    {pending > 0 ? `${pending} pendiente${pending !== 1 ? "s" : ""}` : "Todo completado"}
                  </p>
                  <p className="text-xs font-light mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>
                    de {total} asignación{total !== 1 ? "es" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de asignaciones */}
            <div className="flex flex-col gap-3">
              {assignments.map(a => {
                const done       = a.completions_this_week
                const freq       = a.frequency_per_week
                const complete   = done >= freq
                const toolHref   = `/${a.tool_slug}`
                const toolLabel  = TOOL_LABELS[a.tool_slug] ?? a.tool_slug
                return (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl px-5 py-4"
                    style={{ border: `1px solid ${complete ? "rgba(22,163,74,0.2)" : "rgba(107,39,55,0.08)"}` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "#2d0f16" }}>{a.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C9A84C" }}>
                          {toolLabel}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px]" style={{ color: "rgba(107,39,55,0.4)" }}>
                          {freq}× / semana
                        </p>
                        {a.due_date && (
                          <p className="text-[10px]" style={{ color: "#6B2737" }}>
                            Hasta {new Date(a.due_date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </div>
                    </div>

                    <p
                      className="text-xs leading-relaxed mb-3"
                      style={{ color: "rgba(107,39,55,0.65)", borderLeft: "2px solid rgba(201,168,76,0.35)", paddingLeft: "8px", lineHeight: "1.6" }}
                    >
                      {a.instruction}
                    </p>

                    <div className="flex items-center justify-between">
                      <ProgressDots done={Math.min(done, freq)} total={freq} />
                      {!complete ? (
                        <Link
                          href={toolHref}
                          className="btn-press inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full text-xs font-semibold"
                          style={{ background: "#6B2737", color: "#F5F0E8" }}
                        >
                          Hacer ahora
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>
                          Completado esta semana
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
