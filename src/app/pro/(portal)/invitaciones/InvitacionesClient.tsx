"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, MailOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import InvitationCodeCard from "@/components/pro/InvitationCodeCard"

type Invitation = {
  id:               string
  invitation_code:  string
  patient_name:     string | null
  patient_email:    string | null
  used_by_user_id:  string | null
  created_at:       string
  expires_at:       string
}

function deriveStatus(inv: Invitation): "used" | "expired" | "pending" {
  if (inv.used_by_user_id) return "used"
  if (new Date(inv.expires_at) < new Date()) return "expired"
  return "pending"
}

export default function InvitacionesClient() {
  const [invitations,  setInvitations]  = useState<Invitation[]>([])
  const [loading,      setLoading]      = useState(true)
  const [creating,     setCreating]     = useState(false)
  const [showForm,     setShowForm]     = useState(false)
  const [newPatient,   setNewPatient]   = useState({ name: "", email: "" })
  const [formError,    setFormError]    = useState("")
  const [latestCode,   setLatestCode]   = useState<Invitation | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("patient_invitations")
      .select("*")
      .order("created_at", { ascending: false })
    setInvitations(data ?? [])
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setCreating(true)

    const res = await fetch("/api/pro/invitations", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        patient_name:  newPatient.name  || undefined,
        patient_email: newPatient.email || undefined,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setFormError(data.error || "Error al crear la invitación.")
      setCreating(false)
      return
    }

    const inv = data.invitation as Invitation
    setInvitations((prev) => [inv, ...prev])
    setLatestCode(inv)
    setNewPatient({ name: "", email: "" })
    setShowForm(false)
    setCreating(false)
  }

  const filtered = invitations.filter((i) =>
    statusFilter === "all" ? true : deriveStatus(i) === statusFilter
  )

  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    used:    "Canjeado",
    expired: "Expirado",
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    used:    "bg-green-100 text-green-700",
    expired: "bg-[#6B2737]/10 text-[#6B2737]/50",
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#6B2737]">Invitaciones</h1>
          <p className="text-sm text-[#6B2737]/60 mt-1">Códigos de acceso para pacientes.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setLatestCode(null) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6B2737] text-white rounded-xl text-sm font-medium hover:bg-[#6B2737]/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva invitación
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#6B2737]/10 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-[#6B2737] mb-4">Crear invitación</h2>
          {formError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">{formError}</p>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                  Nombre del paciente <span className="font-normal normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 text-[#6B2737]"
                  placeholder="Tu referencia interna"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                  Email <span className="font-normal normal-case">(opcional, para fase 2)</span>
                </label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 text-[#6B2737]"
                  placeholder="paciente@email.com"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B2737]/60 hover:bg-[#6B2737]/5 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6B2737] text-white rounded-xl text-sm font-medium hover:bg-[#6B2737]/90 transition-all disabled:opacity-70"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generar código"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Last created code */}
      {latestCode && (
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-3">
            Código generado
          </p>
          <InvitationCodeCard invitation={latestCode} />
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "pending", "used", "expired"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === s
                ? "bg-[#6B2737] text-white"
                : "bg-white border border-[#6B2737]/10 text-[#6B2737]/60 hover:border-[#6B2737]/30"
            }`}
          >
            {s === "all" ? "Todas" : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#6B2737]/10">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[#6B2737]/40">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-[#6B2737]/5 rounded-full">
              <MailOpen className="w-8 h-8 text-[#6B2737]/30" />
            </div>
            <p className="text-sm text-[#6B2737]/50">
              {statusFilter === "all"
                ? "Ninguna invitación creada todavía."
                : `Ninguna invitación con estado "${statusLabel[statusFilter] ?? statusFilter}".`}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#6B2737]/5">
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40">Código</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40 hidden sm:table-cell">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6B2737]/40 hidden md:table-cell">Expira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B2737]/5">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#6B2737]/2 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-[#6B2737] tracking-widest text-sm">
                      {inv.invitation_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B2737]/70 hidden sm:table-cell">
                    {inv.patient_name ?? <span className="italic text-[#6B2737]/30">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    {(() => { const s = deriveStatus(inv); return (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[s]}`}>
                        {statusLabel[s]}
                      </span>
                    )})()}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B2737]/40 hidden md:table-cell">
                    {new Date(inv.expires_at).toLocaleDateString("es-ES", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
