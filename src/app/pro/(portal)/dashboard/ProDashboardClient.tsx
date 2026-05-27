"use client"

import { useEffect, useState } from "react"
import { Users, MailOpen, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useProfessional } from "@/hooks/useProfessional"
import Link from "next/link"

type RecentPatient = {
  id: string
  patient_user_id: string
  linked_at: string
  patient_name: string | null
}

type Stats = {
  activePatients: number
  pendingInvitations: number
  recentPatients: RecentPatient[]
}

export default function ProDashboardClient() {
  const { professional } = useProfessional()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const supabase = createClient()

    Promise.all([
      supabase
        .from("professional_patient_links")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("patient_invitations")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("professional_patient_links")
        .select("id, patient_user_id, linked_at")
        .eq("status", "active")
        .order("linked_at", { ascending: false })
        .limit(5),
      supabase
        .from("patient_invitations")
        .select("used_by_user_id, patient_name")
        .not("used_by_user_id", "is", null),
    ]).then(([activeRes, pendingRes, recentRes, namesRes]) => {
      const nameMap = new Map(
        (namesRes.data ?? []).map((i) => [i.used_by_user_id as string, i.patient_name as string | null])
      )
      setStats({
        activePatients:     activeRes.count ?? 0,
        pendingInvitations: pendingRes.count ?? 0,
        recentPatients: (recentRes.data ?? []).map((l) => ({
          ...l,
          patient_name: nameMap.get(l.patient_user_id) ?? null,
        })),
      })
    })
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-serif font-bold text-[#6B2737]">
          {professional ? `Hola, ${professional.full_name.split(" ")[0]}` : "Dashboard"}
        </h1>
        {professional && (
          <p className="text-sm text-[#6B2737]/60 mt-1">{professional.professional_title}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Pacientes activos"
          value={stats?.activePatients ?? "—"}
          href="/pro/pacientes"
        />
        <StatCard
          icon={<MailOpen className="w-5 h-5" />}
          label="Invitaciones pendientes"
          value={stats?.pendingInvitations ?? "—"}
          href="/pro/invitaciones"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Última vinculación"
          value={
            stats?.recentPatients[0]
              ? new Date(stats.recentPatients[0].linked_at).toLocaleDateString("es-ES", {
                  day: "numeric", month: "short",
                })
              : "—"
          }
        />
      </div>

      {/* Recent patients */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#6B2737]/10">
        <div className="px-6 py-4 border-b border-[#6B2737]/10 flex items-center justify-between">
          <h2 className="font-semibold text-[#6B2737]">Pacientes recientes</h2>
          <Link href="/pro/pacientes" className="text-xs font-medium text-[#6B2737]/60 hover:text-[#6B2737] transition-colors">
            Ver todos
          </Link>
        </div>
        {!stats ? (
          <div className="px-6 py-8 text-center text-sm text-[#6B2737]/40">Cargando...</div>
        ) : stats.recentPatients.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-[#6B2737]/40">
            Ningún paciente vinculado todavía.{" "}
            <Link href="/pro/invitaciones" className="font-medium underline">
              Crear primera invitación
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#6B2737]/5">
            {stats.recentPatients.map((p) => (
              <li key={p.id} className="px-6 py-4 flex items-center justify-between">
                <span className="font-medium text-[#6B2737]">
                  {p.patient_name ?? <span className="text-[#6B2737]/40 italic">Sin nombre</span>}
                </span>
                <span className="text-xs text-[#6B2737]/40">
                  {new Date(p.linked_at).toLocaleDateString("es-ES", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, href,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  href?: string
}) {
  const inner = (
    <div className="bg-white rounded-2xl shadow-sm border border-[#6B2737]/10 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="p-2 bg-[#6B2737]/10 rounded-xl text-[#6B2737]">{icon}</div>
      <div>
        <p className="text-xs font-medium text-[#6B2737]/50 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#6B2737]">{value}</p>
      </div>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>
}
