"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useActiveAssignment } from "@/hooks/useAssignments"
import { AssignmentInstructionBanner } from "@/components/assignments/AssignmentInstructionBanner"
import { createAssignmentCompletion } from "@/lib/assignments-client"

type Phase = "sliders" | "decision" | "done"

const EMOTIONS = [
  "Ansiedad","Aburrimiento","Tristeza","Estrés","Soledad",
  "Alegría","Celebración","Cansancio","Enfado","Vacío",
]

function Slider({
  label, sublabel, value, onChange,
}: { label: string; sublabel: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-semibold" style={{ color: "#2d0f16" }}>{label}</span>
        <span className="text-xl font-serif font-bold" style={{ color: "#6B2737" }}>{value}</span>
      </div>
      <p className="text-[11px] font-light mb-3" style={{ color: "rgba(107,39,55,0.5)" }}>{sublabel}</p>
      <input
        type="range" min={0} max={10} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#6B2737]"
      />
      <div className="flex justify-between text-[10px] mt-1" style={{ color: "rgba(107,39,55,0.35)" }}>
        <span>0 — nada</span>
        <span>10 — máxima</span>
      </div>
    </div>
  )
}

export default function HambreClient() {
  const { assignment } = useActiveAssignment("registro/hambre")
  const [phase,     setPhase]    = useState<Phase>("sliders")
  const [physical,  setPhysical]  = useState(5)
  const [emotional, setEmotional] = useState(5)
  const [clarity,   setClarity]   = useState(5)
  const [toEat,     setToEat]     = useState<boolean | null>(null)
  const [emotion,   setEmotion]   = useState("")
  const [need,      setNeed]      = useState("")
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState("")

  const emotionalDominates = emotional > physical + 2

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/hambre", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          physical_hunger:       physical,
          emotional_hunger:      emotional,
          interoceptive_clarity: clarity,
          decided_to_eat:        toEat ?? false,
          context_notes:         toEat
            ? (emotion ? `Emoción presente: ${emotion}` : undefined)
            : (need ? `Necesidad real: ${need}` : undefined),
        }),
      })
      if (!res.ok) throw new Error()
      if (assignment?.id) createAssignmentCompletion(assignment.id).catch(() => {})
      setPhase("done")
    } catch {
      setError("Error al guardar. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12" style={{ background: "#F5F0E8" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#6B2737] flex items-center justify-center mx-auto mb-6">
            <Check className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#2d0f16" }}>Registro guardado</h2>
          {emotionalDominates && (
            <div className="mb-6 px-5 py-4 rounded-2xl text-sm text-left leading-relaxed" style={{ background: "white", borderLeft: "3px solid #FF6B35", color: "#6B2737" }}>
              <p className="font-semibold mb-1">El hambre emocional era predominante.</p>
              <p className="font-light">Notar la diferencia ya es un acto de inteligencia interoceptiva. Si quieres explorar la emoción presente, el registro emocional puede ayudar.</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {emotionalDominates && (
              <Link href="/registro/emocion" className="block w-full py-3 rounded-full text-sm font-medium text-center" style={{ background: "#FF6B35", color: "white" }}>
                Explorar la emoción →
              </Link>
            )}
            <Link href="/practicas" className="block w-full py-3 rounded-full text-sm font-medium text-center" style={{ background: "#6B2737", color: "#F5F0E8" }}>
              Volver a mis prácticas
            </Link>
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

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Termómetro de hambre</h1>
        <p className="text-xs font-light mb-6" style={{ color: "rgba(107,39,55,0.5)" }}>Distingue hambre física, emocional y claridad interoceptiva</p>

        {phase === "sliders" && <AssignmentInstructionBanner assignment={assignment} />}

        {phase === "sliders" && (
          <div className="flex flex-col gap-4">
            <Slider
              label="Hambre física"
              sublabel="Sensaciones corporales: vacío en el estómago, energía baja, dificultad de concentración"
              value={physical}
              onChange={setPhysical}
            />
            <Slider
              label="Hambre emocional"
              sublabel="Deseo de comer vinculado a emociones, situación o estímulos externos"
              value={emotional}
              onChange={setEmotional}
            />
            <Slider
              label="Claridad interoceptiva"
              sublabel="¿Con qué claridad distingues entre las dos hambres ahora mismo?"
              value={clarity}
              onChange={setClarity}
            />

            {emotionalDominates && (
              <div className="px-4 py-3 rounded-xl text-xs leading-relaxed" style={{ background: "rgba(255,107,53,0.1)", color: "#6B2737", borderLeft: "3px solid #FF6B35" }}>
                El hambre emocional supera a la física. Puede ser útil hacer una pausa de 5 minutos antes de decidir.
              </div>
            )}

            <button
              onClick={() => setPhase("decision")}
              className="mt-2 w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {phase === "decision" && (
          <div>
            <p className="text-sm font-semibold mb-5" style={{ color: "#2d0f16" }}>¿Vas a comer ahora?</p>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setToEat(true)}
                className="flex-1 py-3.5 rounded-full text-sm font-medium border-2 transition-all"
                style={{
                  background:  toEat === true ? "#6B2737" : "white",
                  color:       toEat === true ? "#F5F0E8" : "#6B2737",
                  borderColor: toEat === true ? "#6B2737" : "rgba(107,39,55,0.2)",
                }}
              >
                Sí
              </button>
              <button
                onClick={() => setToEat(false)}
                className="flex-1 py-3.5 rounded-full text-sm font-medium border-2 transition-all"
                style={{
                  background:  toEat === false ? "#6B2737" : "white",
                  color:       toEat === false ? "#F5F0E8" : "#6B2737",
                  borderColor: toEat === false ? "#6B2737" : "rgba(107,39,55,0.2)",
                }}
              >
                No
              </button>
            </div>

            {toEat === true && (
              <div className="mb-6">
                <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                  ¿Qué emoción está presente? (opcional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {EMOTIONS.map(em => (
                    <button
                      key={em}
                      onClick={() => setEmotion(emotion === em ? "" : em)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                      style={{
                        background:  emotion === em ? "#6B2737" : "white",
                        color:       emotion === em ? "#F5F0E8" : "#6B2737",
                        border:      "1px solid rgba(107,39,55,0.2)",
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] italic mt-1" style={{ color: "rgba(107,39,55,0.4)" }}>
                  Si quieres explorarla más, usa el Registro emocional después.
                </p>
              </div>
            )}

            {toEat === false && (
              <div className="mb-6">
                <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                  ¿Qué necesitas en realidad? (opcional)
                </label>
                <input
                  type="text"
                  value={need}
                  onChange={e => setNeed(e.target.value)}
                  placeholder="ej. descanso, contacto social, movimiento..."
                  maxLength={150}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                  style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
                />
              </div>
            )}

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            {toEat !== null && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
                style={{ background: "#6B2737", color: "#F5F0E8" }}
              >
                {saving ? "Guardando..." : "Guardar registro"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
