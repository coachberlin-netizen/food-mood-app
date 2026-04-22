"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const CONSENT_VERSION = "1.0"
const STORAGE_KEY = "fm_consent_v"
const ANALYTICS_KEY = "fm_consent_analytics"

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
    // Delay to let the page render first — less invasive
    const t = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const toggle = (key: keyof ConsentState) =>
    setConsent(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSubmit = async () => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, CONSENT_VERSION)
    localStorage.setItem(ANALYTICS_KEY, String(consent.consent_analytics))
    window.dispatchEvent(new Event("fm:consent-updated"))

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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-lg"
      style={{ filter: "drop-shadow(0 8px 32px rgba(45,15,22,0.18))" }}
    >
      <div
        className="bg-[#F5F0E8] rounded-2xl px-5 py-4 border"
        style={{ borderColor: "rgba(107,39,55,0.12)" }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#C9A84C] mb-0.5">
              Tus datos, tus reglas
            </p>
            <p className="text-sm font-medium text-[#2d0f16] leading-snug">
              ¿Qué podemos guardar?
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#6B2737" }}
          >
            {saving ? "…" : "Confirmar"}
          </button>
        </div>

        {/* Compact checkboxes */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <CompactRow
            checked
            disabled
            label="Funcionamiento esencial"
          />
          <CompactRow
            checked={consent.consent_analytics}
            onChange={() => toggle("consent_analytics")}
            label="Analítica (Vercel Analytics)"
          />
          <CompactRow
            checked={consent.consent_newsletter}
            onChange={() => toggle("consent_newsletter")}
            label="Correo dominical"
          />
          <CompactRow
            checked={consent.consent_aggregated_research}
            onChange={() => toggle("consent_aggregated_research")}
            label="Investigación anónima"
          />
        </div>

        <p className="text-[9px] text-[#6B2737]/30 mt-3 leading-relaxed">
          Esencial siempre activo · Resto opcional · Cambia preferencias en tu perfil.{" "}
          Los datos de estado emocional se tratan como datos de salud (Art. 9 GDPR).{" "}
          <Link href="/privacidad" className="underline hover:text-[#6B2737]/60 transition-colors">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}

function CompactRow({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange?: () => void
  label: string
}) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? "opacity-50" : "cursor-pointer"}`}>
      <div
        className="w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-all"
        style={{
          backgroundColor: checked ? "#6B2737" : "transparent",
          borderColor: "#6B2737",
        }}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="sr-only" />
      <span className="text-xs text-[#2d0f16]/70 font-light leading-tight">{label}</span>
    </label>
  )
}
