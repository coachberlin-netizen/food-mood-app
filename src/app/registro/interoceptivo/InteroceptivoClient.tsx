"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useActiveAssignment } from "@/hooks/useAssignments"
import { AssignmentInstructionBanner } from "@/components/assignments/AssignmentInstructionBanner"
import { createAssignmentCompletion } from "@/lib/assignments-client"

type NSSState =
  | "ventral" | "sympathetic_active" | "sympathetic_anxious"
  | "dorsal_freeze" | "dorsal_collapse" | "mixed"

type SecondaryState = Exclude<NSSState, "mixed">

type BodyQuality = "apretado" | "hueco" | "calor" | "frío" | "hormigueo" | "pesado" | "ligero" | "neutro"

type BodyLocation = { zone: string; intensity: number; quality: BodyQuality | "" }

const NSS_OPTIONS: { state: NSSState; label: string; detail: string; color: string; bg: string }[] = [
  { state: "ventral",             label: "Conectada/o, presente, en calma", detail: "El cuerpo se siente seguro y abierto",                  color: "#16a34a", bg: "#f0fdf4" },
  { state: "sympathetic_active",  label: "Activa/o, enérgica/o, motivada/o", detail: "Energía disponible, lista/o para la acción",          color: "#d97706", bg: "#fffbeb" },
  { state: "sympathetic_anxious", label: "Acelerada/o, nerviosa/o, en alerta", detail: "El sistema está disparado, difícil bajar el ritmo", color: "#dc2626", bg: "#fef2f2" },
  { state: "dorsal_freeze",       label: "Apagada/o, sin energía, gris",      detail: "Baja activación, sensación de pesadez o entumecimiento", color: "#4b5563", bg: "#f9fafb" },
  { state: "dorsal_collapse",     label: "Bloqueada/o, distante, como flotando", detail: "Desconexión, sensación de irrealidad o lejanía",  color: "#6b7280", bg: "#f3f4f6" },
]

const BODY_ZONES = [
  "Cabeza", "Cuello / garganta", "Pecho", "Espalda",
  "Abdomen alto", "Abdomen bajo", "Pelvis", "Brazos", "Piernas",
]

const QUALITIES: BodyQuality[] = ["apretado","hueco","calor","frío","hormigueo","pesado","ligero","neutro"]

const POST_REGULATION_STATES: NSSState[] = ["sympathetic_anxious","dorsal_freeze","dorsal_collapse"]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-colors"
          style={{ background: i < current ? "#6B2737" : "rgba(107,39,55,0.15)" }}
        />
      ))}
    </div>
  )
}

export default function InteroceptivoClient() {
  const router         = useRouter()
  const prefersReduced = useReducedMotion()
  const { assignment } = useActiveAssignment("registro/interoceptivo")
  const [step,         setStep]         = useState<1 | 2 | 3>(1)
  const [nss,          setNss]          = useState<NSSState | null>(null)
  const [secondary,    setSecondary]    = useState<SecondaryState | null>(null)
  const [showSecondary, setShowSecondary] = useState(false)
  const [locations,    setLocations]    = useState<BodyLocation[]>([])
  const [clarity,      setClarity]      = useState(5)
  const [dominant,     setDominant]     = useState("")
  const [saving,       setSaving]       = useState(false)
  const [done,         setDone]         = useState(false)
  const [error,        setError]        = useState("")

  const [scannedZones, setScannedZones] = useState<Set<string>>(new Set())

  function toggleZone(zone: string) {
    setScannedZones(prev => {
      const next = new Set(prev)
      if (next.has(zone)) {
        next.delete(zone)
        setLocations(locs => locs.filter(l => l.zone !== zone))
      } else {
        next.add(zone)
      }
      return next
    })
  }

  function updateLocation(zone: string, field: "intensity" | "quality", value: number | string) {
    setLocations(prev =>
      prev.map(l => l.zone === zone ? { ...l, [field]: value } : l)
    )
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/checkin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nervous_system_state:  nss,
          secondary_state:       secondary ?? undefined,
          body_locations:        locations,
          interoceptive_clarity: clarity,
          dominant_sensation:    dominant.trim() || undefined,
          pre_meal:              false,
        }),
      })
      if (!res.ok) throw new Error()
      if (assignment?.id) createAssignmentCompletion(assignment.id).catch(() => {})
      setDone(true)
    } catch {
      setError("Error al guardar. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const needsRegulation = nss !== null && POST_REGULATION_STATES.includes(nss)

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12" style={{ background: "#F5F0E8" }}>
        <div className="max-w-md w-full text-center">
          <div className="relative w-14 h-14 mx-auto mb-6">
            {/* Ripple ring */}
            {!prefersReduced && (
              <span
                className="ripple-ring absolute inset-0 rounded-full"
                style={{ background: "rgba(107,39,55,0.3)" }}
              />
            )}
            {/* Confirmation circle */}
            <motion.div
              className="w-14 h-14 rounded-full bg-[#6B2737] flex items-center justify-center"
              initial={prefersReduced ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M4 12 L9 17 L20 6"
                  initial={prefersReduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: prefersReduced ? 0 : 0.2 }}
                />
              </motion.svg>
            </motion.div>
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#2d0f16" }}>
            Check-in guardado
          </h2>
          {needsRegulation && (
            <div className="mb-6 px-5 py-4 rounded-2xl text-sm text-left leading-relaxed" style={{ background: "white", borderLeft: "3px solid #FF6B35", color: "#6B2737" }}>
              <p className="font-semibold mb-1">Tu sistema nervioso está activado.</p>
              <p className="font-light">Cuando estés lista/o, una respiración lenta puede ayudar a recuperar el equilibrio. Inhala 4 segundos, mantén 2, exhala 6.</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Link
              href="/practicas"
              className="block w-full py-3 rounded-full text-sm font-medium text-white text-center"
              style={{ background: "#6B2737" }}
            >
              Volver a mis prácticas
            </Link>
            <button
              onClick={() => { setDone(false); setStep(1); setNss(null); setSecondary(null); setLocations([]); setClarity(5); setDominant("") }}
              className="text-xs py-2"
              style={{ color: "rgba(107,39,55,0.5)" }}
            >
              Hacer otro check-in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-lg mx-auto px-5 py-10 pb-24">

        <Link href="/practicas" className="inline-flex items-center gap-2 text-xs font-medium mb-6" style={{ color: "rgba(107,39,55,0.6)" }}>
          <ArrowLeft className="w-4 h-4" /> Mis prácticas
        </Link>

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Check-in interoceptivo</h1>
        <p className="text-xs mb-6" style={{ color: "rgba(107,39,55,0.5)" }}>60–90 segundos · 3 pasos</p>

        {step === 1 && <AssignmentInstructionBanner assignment={assignment} />}

        <StepIndicator current={step} total={3} />

        {/* ── PASO 1: Estado polivagal ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 className="text-sm font-semibold mb-5" style={{ color: "#2d0f16" }}>¿Cómo notas tu sistema nervioso ahora mismo?</h2>
            <div className="flex flex-col gap-3">
              {NSS_OPTIONS.map(opt => (
                <button
                  key={opt.state}
                  onClick={() => { setNss(opt.state); setShowSecondary(false); setSecondary(null) }}
                  className="text-left px-4 py-3.5 rounded-2xl border-2 transition-all"
                  style={{
                    background:   nss === opt.state ? opt.bg : "white",
                    borderColor:  nss === opt.state ? opt.color : "rgba(107,39,55,0.1)",
                  }}
                >
                  <p className="text-sm font-semibold leading-snug" style={{ color: nss === opt.state ? opt.color : "#2d0f16" }}>
                    {opt.label}
                  </p>
                  <p className="text-[11px] mt-0.5 font-light" style={{ color: "rgba(107,39,55,0.5)" }}>{opt.detail}</p>
                </button>
              ))}
              <button
                onClick={() => { setNss("mixed"); setShowSecondary(true) }}
                className="text-left px-4 py-3.5 rounded-2xl border-2 transition-all"
                style={{
                  background:  nss === "mixed" ? "#faf5ff" : "white",
                  borderColor: nss === "mixed" ? "#a855f7" : "rgba(107,39,55,0.1)",
                }}
              >
                <p className="text-sm font-semibold" style={{ color: nss === "mixed" ? "#a855f7" : "#2d0f16" }}>Una mezcla</p>
                <p className="text-[11px] font-light mt-0.5" style={{ color: "rgba(107,39,55,0.5)" }}>Siento dos estados a la vez</p>
              </button>
            </div>

            {showSecondary && (
              <div className="mt-4">
                <p className="text-xs font-semibold mb-3" style={{ color: "#6B2737" }}>¿Qué segundo estado está presente?</p>
                <div className="flex flex-col gap-2">
                  {NSS_OPTIONS.map(opt => (
                    <button
                      key={opt.state}
                      onClick={() => setSecondary(opt.state as SecondaryState)}
                      className="text-left px-3 py-2.5 rounded-xl border transition-all text-sm"
                      style={{
                        background:  secondary === opt.state ? opt.bg : "white",
                        borderColor: secondary === opt.state ? opt.color : "rgba(107,39,55,0.1)",
                        color:       secondary === opt.state ? opt.color : "#2d0f16",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!nss || (nss === "mixed" && !secondary)}
              className="btn-press mt-8 w-full py-3.5 min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── PASO 2: Body scan ────────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 className="text-sm font-semibold mb-1" style={{ color: "#2d0f16" }}>Escaneo corporal</h2>
            <p className="text-xs mb-5" style={{ color: "rgba(107,39,55,0.5)", lineHeight: "1.6" }}>
              Recorre cada zona de arriba abajo, relajándola. Márcala al pasar. Si notas algo en alguna, puedes añadir el detalle.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              {BODY_ZONES.map(zone => {
                const scanned  = scannedZones.has(zone)
                const hasSensation = locations.some(l => l.zone === zone)
                const loc      = locations.find(l => l.zone === zone)
                return (
                  <div key={zone}>
                    <button
                      onClick={() => toggleZone(zone)}
                      className="w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all flex items-center gap-3"
                      style={{
                        background:  scanned ? "rgba(107,39,55,0.06)" : "white",
                        borderColor: scanned ? "#6B2737"              : "rgba(107,39,55,0.15)",
                        color:       "#2d0f16",
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[11px] font-bold transition-all"
                        style={{
                          background:  scanned ? "#6B2737" : "transparent",
                          borderColor: scanned ? "#6B2737" : "rgba(107,39,55,0.3)",
                          color:       "#F5F0E8",
                        }}
                      >
                        {scanned ? "✓" : ""}
                      </span>
                      <span>{zone}</span>
                    </button>

                    {scanned && (
                      <div className="mt-1 ml-4 pl-4" style={{ borderLeft: "2px solid rgba(107,39,55,0.12)" }}>
                        {!hasSensation ? (
                          <button
                            onClick={() => setLocations(prev => [...prev, { zone, intensity: 5, quality: "" }])}
                            className="text-[11px] py-1.5 px-0"
                            style={{ color: "rgba(107,39,55,0.45)" }}
                          >
                            + ¿Notas algo aquí?
                          </button>
                        ) : (
                          <div className="py-3 pr-2">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[11px] font-semibold" style={{ color: "#6B2737" }}>
                                Intensidad: <strong>{loc!.intensity}</strong>/10
                              </p>
                              <button
                                onClick={() => setLocations(prev => prev.filter(l => l.zone !== zone))}
                                className="text-[10px]"
                                style={{ color: "rgba(107,39,55,0.35)" }}
                              >
                                Quitar
                              </button>
                            </div>
                            <input
                              type="range" min={0} max={10} value={loc!.intensity}
                              onChange={e => updateLocation(zone, "intensity", Number(e.target.value))}
                              className="w-full accent-[#6B2737] mb-3"
                            />
                            <div className="flex flex-wrap gap-1.5">
                              {QUALITIES.map(q => (
                                <button
                                  key={q}
                                  onClick={() => updateLocation(zone, "quality", loc!.quality === q ? "" : q)}
                                  className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors"
                                  style={{
                                    background: loc!.quality === q ? "#FF6B35" : "rgba(255,107,53,0.1)",
                                    color:      loc!.quality === q ? "white"   : "#6B2737",
                                  }}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-full text-sm font-medium border"
                style={{ borderColor: "rgba(107,39,55,0.2)", color: "#6B2737" }}
              >
                Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: "#6B2737", color: "#F5F0E8" }}
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: Claridad interoceptiva ───────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 className="text-sm font-semibold mb-1" style={{ color: "#2d0f16" }}>Claridad interoceptiva</h2>
            <p className="text-xs mb-6" style={{ color: "rgba(107,39,55,0.5)", lineHeight: "1.6" }}>
              ¿Con qué claridad distingues lo que sientes en el cuerpo ahora mismo?
            </p>

            <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
              <div className="flex justify-between text-[10px] mb-2" style={{ color: "rgba(107,39,55,0.4)" }}>
                <span>Muy confuso/a</span>
                <span>Muy claro/a</span>
              </div>
              <input
                type="range" min={0} max={10} value={clarity}
                onChange={e => setClarity(Number(e.target.value))}
                className="w-full accent-[#6B2737] mb-2"
              />
              <p className="text-center text-2xl font-serif font-bold" style={{ color: "#6B2737" }}>{clarity}</p>
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium block mb-2" style={{ color: "#6B2737" }}>
                Sensación dominante (opcional — una palabra)
              </label>
              <input
                type="text"
                value={dominant}
                onChange={e => setDominant(e.target.value)}
                placeholder="ej. tensión, vacío, calor..."
                maxLength={60}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-full text-sm font-medium border"
                style={{ borderColor: "rgba(107,39,55,0.2)", color: "#6B2737" }}
              >
                Atrás
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-press py-3.5 min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: "#6B2737", color: "#F5F0E8" }}
              >
                {saving ? "Guardando..." : "Guardar check-in"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
