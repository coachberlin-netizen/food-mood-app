"use client"

import { useState } from "react"
import { Copy, Check, Clock } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"

type Invitation = {
  invitation_code: string
  patient_name:   string | null
  expires_at:     string
}

export default function InvitationCodeCard({ invitation }: { invitation: Invitation }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const expiresDate = new Date(invitation.expires_at).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  })

  const shareMessage = `Hola${invitation.patient_name ? `, ${invitation.patient_name}` : ""}. Te comparto tu código de acceso a Food·Mood para vincular nuestra consulta: ${invitation.invitation_code}. Entra en https://food-mood.app/canjear e introdúcelo. Válido hasta el ${expiresDate}.`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage)
      setCopied(true)
      toast("Mensaje de invitación copiado")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast("No se pudo copiar. Selecciona el código manualmente.", "error")
    }
  }

  return (
    <div className="bg-[#6B2737]/5 border border-[#6B2737]/20 rounded-2xl p-6">
      {invitation.patient_name && (
        <p className="text-xs font-bold uppercase tracking-widest text-[#6B2737]/60 mb-3">
          {invitation.patient_name}
        </p>
      )}
      <div className="font-mono text-3xl font-bold tracking-[0.2em] text-[#6B2737] text-center py-4">
        {invitation.invitation_code}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#6B2737]/50 justify-center mb-4">
        <Clock className="w-3 h-3" />
        Válido hasta el {expiresDate}
      </div>
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6B2737] text-white text-sm font-medium hover:bg-[#6B2737]/90 transition-all"
      >
        {copied ? (
          <><Check className="w-4 h-4" /> Mensaje copiado</>
        ) : (
          <><Copy className="w-4 h-4" /> Copiar mensaje para compartir</>
        )}
      </button>
    </div>
  )
}
