"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const CONSENT_VERSION = "1.0"
const STORAGE_KEY = "fm_consent_v"

type ConsentState = {
  consent_analytics: boolean
  consent_newsletter: boolean
  consent_aggregated_research: boolean
}

export function ConsentModal() {
  const [visible, setVisible]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [consent, setConsent]   = useState<ConsentState>({
    consent_analytics:           false,
    consent_newsletter:          false,
    consent_aggregated_research: false,
  })
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === CONSENT_VERSION) return
    setVisible(true)
  }, [])

  const toggle = (key: keyof ConsentState) =>
    setConsent(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSubmit = async () => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, CONSENT_VERSION)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("user_consent").upsert(
        {
          user_id:                     user.id,
          consent_essential:           true,
          consent_analytics:           consent.consent_analytics,
          consent_newsletter:          consent.consent_newsletter,
          consent_aggregated_research: consent.consent_aggregated_research,
          consent_version:             CONSENT_VERSION,
          consent_date:                new Date().toISOString(),
          updated_at:                  new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
    }

    setSaving(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(45,15,22,0.65)" }}
    >
      <div className="bg-[#F5F0E8] rounded-3xl p-7 max-w-md w-full shadow-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-3">
          Tus datos, tus reglas
        </p>
        <h2 className="font-serif text-2xl text-[#2d0f16] mb-2 leading-snug">
          ¿Qué podemos hacer con tu información?
        </h2>
        <p className="text-sm text-[#6B2737]/55 font-light mb-6 leading-relaxed">
          Tus datos emocionales son tuyos. Selecciona solo lo que te parezca bien.
        </p>

        <div className="space-y-4 mb-7">
          {/* Essential — always on */}
          <ConsentRow
            checked
            disabled
            label="Funcionamiento esencial"
            description="Guardar tu estado, tus recetas y tu sesión. Imprescindible."
          />

          <ConsentRow
            checked={consent.consent_analytics}
            onChange={() => toggle("consent_analytics")}
            label="Analítica de tus patrones"
            description="Ver cómo evolucionan tus estados a lo largo del tiempo (visible solo para ti)."
          />

          <ConsentRow
            checked={consent.consent_newsletter}
            onChange={() => toggle("consent_newsletter")}
            label="Correo dominical"
            description="Una receta funcional semanal según tu estado. Sin spam. Cancela cuando quieras."
          />

          <ConsentRow
            checked={consent.consent_aggregated_research}
            onChange={() => toggle("consent_aggregated_research")}
            label="Contribuir a la investigación"
            description="Añade tus datos al dataset anónimo (sin nombre ni email) para mejorar Food·Mood para todos."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-md"
          style={{ backgroundColor: "#6B2737" }}
        >
          {saving ? "Guardando…" : "Confirmar mis preferencias"}
        </button>

        <p className="text-[10px] text-[#6B2737]/35 text-center mt-3 leading-relaxed">
          Puedes cambiar estas preferencias en cualquier momento desde tu perfil.
        </p>
      </div>
    </div>
  )
}

function ConsentRow({
  checked,
  disabled,
  onChange,
  label,
  description,
}: {
  checked: boolean
  disabled?: boolean
  onChange?: () => void
  label: string
  description: string
}) {
  return (
    <label className={`flex items-start gap-3 group ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <div className="mt-0.5 shrink-0">
        <div
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
          style={{
            backgroundColor: checked ? "#6B2737" : "transparent",
            borderColor: checked ? "#6B2737" : "#6B2737",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#2d0f16]">{label}</p>
        <p className="text-xs text-[#6B2737]/50 font-light leading-relaxed mt-0.5">{description}</p>
      </div>
    </label>
  )
}
