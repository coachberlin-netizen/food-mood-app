"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

type Phase = "pre" | "meal" | "post" | "done"

const EMOTIONS = [
  "Calma","Ansiedad","Alegría","Tristeza","Enfado",
  "Estrés","Satisfacción","Culpa","Vacío","Energía",
]

const NSS_OPTIONS = [
  { value: "ventral",             label: "Tranquila/o, conectada/o",        color: "#16a34a" },
  { value: "sympathetic_active",  label: "Activa/o, con energía",           color: "#d97706" },
  { value: "sympathetic_anxious", label: "Nerviosa/o, acelerada/o",         color: "#dc2626" },
  { value: "dorsal_freeze",       label: "Apagada/o, sin energía",          color: "#4b5563" },
  { value: "dorsal_collapse",     label: "Bloqueada/o, lejana/o",           color: "#6b7280" },
]

function EmotionPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONS.map(em => (
        <button
          key={em}
          onClick={() => onChange(value === em ? "" : em)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            background:  value === em ? "#6B2737" : "white",
            color:       value === em ? "#F5F0E8" : "#6B2737",
            border:      "1px solid rgba(107,39,55,0.2)",
          }}
        >
          {em}
        </button>
      ))}
    </div>
  )
}

function IntensitySlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(107,39,55,0.6)" }}>
        <span>{label}</span>
        <strong style={{ color: "#6B2737" }}>{value}/10</strong>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-[#6B2737]" />
    </div>
  )
}

export default function ComidaClient() {
  const [phase,          setPhase]         = useState<Phase>("pre")
  const [emotionBefore,  setEmotionBefore]  = useState("")
  const [intensityBefore, setIntensityBefore] = useState(5)
  const [mealDescription, setMealDescription] = useState("")
  const [emotionAfter,   setEmotionAfter]   = useState("")
  const [intensityAfter,  setIntensityAfter]  = useState(5)
  const [postNss,        setPostNss]        = useState("")
  const [bodyChange,     setBodyChange]     = useState<"mejor"|"igual"|"peor"|"">("")
  const [notes,          setNotes]          = useState("")
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState("")

  const negativePost = postNss === "sympathetic_anxious" || postNss === "dorsal_freeze" || postNss === "dorsal_collapse" || bodyChange === "peor"

  async function handleSave() {
    if (!emotionBefore || !emotionAfter) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/behavioral/meal", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion_before:            emotionBefore,
          intensity_before:          intensityBefore,
          emotion_after:             emotionAfter,
          intensity_after:           intensityAfter,
          meal_description:          mealDescription.trim() || undefined,
          notes:                     notes.trim() || undefined,
          post_nervous_system_state: postNss || undefined,
          body_change:               bodyChange || undefined,
        }),
      })
      if (!res.ok) throw new Error()
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
          {negativePost && (
            <div className="mb-6 px-5 py-4 rounded-2xl text-sm text-left leading-relaxed" style={{ background: "white", borderLeft: "3px solid #C9A84C", color: "#6B2737" }}>
              <p className="font-semibold mb-1">Tu cuerpo pide algo.</p>
              <p className="font-light">Notar el cambio ya es información valiosa. Si quieres explorar qué necesitas, el check-in interoceptivo puede ayudar.</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {negativePost && (
              <Link href="/registro/interoceptivo" className="block w-full py-3 rounded-full text-sm font-medium text-center" style={{ background: "#C9A84C", color: "white" }}>
                Check-in interoceptivo →
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

        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: "#2d0f16" }}>Registro emocional pre/post comida</h1>
        <p className="text-xs font-light mb-6" style={{ color: "rgba(107,39,55,0.5)" }}>Cómo te afecta la comida en tu estado emocional y corporal</p>

        {/* ── PRE ── */}
        {phase === "pre" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Cómo te sientes antes de comer?
              </label>
              <EmotionPicker value={emotionBefore} onChange={setEmotionBefore} />
            </div>
            <IntensitySlider label="Intensidad" value={intensityBefore} onChange={setIntensityBefore} />
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Opcionalmente, haz un check-in interoceptivo ahora?
              </label>
              <Link
                href="/registro/interoceptivo"
                className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-full"
                style={{ background: "rgba(107,39,55,0.07)", color: "#6B2737" }}
              >
                Ir al check-in →
              </Link>
            </div>
            <button
              onClick={() => setPhase("meal")}
              disabled={!emotionBefore}
              className="w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              He registrado mi estado antes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── MEAL ── */}
        {phase === "meal" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Qué has comido? (opcional)
              </label>
              <input
                type="text"
                value={mealDescription}
                onChange={e => setMealDescription(e.target.value)}
                placeholder="ej. ensalada con salmón, bocadillo..."
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737]"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>
            <button
              onClick={() => setPhase("post")}
              className="w-full py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              Ya he terminado de comer <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── POST ── */}
        {phase === "post" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                ¿Cómo te sientes después?
              </label>
              <EmotionPicker value={emotionAfter} onChange={setEmotionAfter} />
            </div>
            <IntensitySlider label="Intensidad" value={intensityAfter} onChange={setIntensityAfter} />

            <div>
              <label className="text-xs font-semibold block mb-3" style={{ color: "#6B2737" }}>
                ¿Cómo notas tu cuerpo ahora?
              </label>
              <div className="flex flex-col gap-2">
                {NSS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPostNss(postNss === opt.value ? "" : opt.value)}
                    className="text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                    style={{
                      background:  postNss === opt.value ? "rgba(107,39,55,0.05)" : "white",
                      borderColor: postNss === opt.value ? opt.color : "rgba(107,39,55,0.1)",
                      color:       postNss === opt.value ? opt.color : "#2d0f16",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-3" style={{ color: "#6B2737" }}>
                Comparado con antes de comer, ¿cómo estás?
              </label>
              <div className="flex gap-3">
                {(["mejor","igual","peor"] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setBodyChange(bodyChange === v ? "" : v)}
                    className="flex-1 py-2.5 rounded-full text-sm font-medium border-2 capitalize transition-all"
                    style={{
                      background:  bodyChange === v ? "#6B2737" : "white",
                      color:       bodyChange === v ? "#F5F0E8" : "#6B2737",
                      borderColor: bodyChange === v ? "#6B2737" : "rgba(107,39,55,0.2)",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: "#6B2737" }}>
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Cualquier observación..."
                rows={2}
                maxLength={400}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#6B2737] resize-none"
                style={{ background: "white", borderColor: "rgba(107,39,55,0.2)", color: "#2d0f16" }}
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving || !emotionAfter}
              className="w-full py-3.5 rounded-full text-sm font-medium disabled:opacity-40"
              style={{ background: "#6B2737", color: "#F5F0E8" }}
            >
              {saving ? "Guardando..." : "Guardar registro"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
