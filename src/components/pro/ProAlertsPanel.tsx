"use client"

import Link from "next/link"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { useProAlerts, type ProAlertType } from "@/hooks/useProAlerts"

const ALERT_META: Record<ProAlertType, {
  icon:   typeof Clock
  label:  string
  color:  string
  bg:     string
  border: string
}> = {
  no_checkin: {
    icon:   Clock,
    label:  "Sin registro",
    color:  "#92691A",
    bg:     "rgba(255,107,53,0.08)",
    border: "rgba(255,107,53,0.25)",
  },
  high_tension: {
    icon:   AlertTriangle,
    label:  "Tensión alta sostenida",
    color:  "#B91C1C",
    bg:     "rgba(185,28,28,0.06)",
    border: "rgba(185,28,28,0.2)",
  },
  first_week: {
    icon:   CheckCircle2,
    label:  "Primera semana completada",
    color:  "#15803D",
    bg:     "rgba(21,128,61,0.07)",
    border: "rgba(21,128,61,0.2)",
  },
}

export default function ProAlertsPanel() {
  const { alerts, loading } = useProAlerts()

  if (loading || alerts.length === 0) return null

  return (
    <div className="mb-8">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.45)" }}>
        Alertas activas · {alerts.length}
      </p>
      <div className="flex flex-col gap-2">
        {alerts.map(alert => {
          const meta = ALERT_META[alert.type]
          const Icon = meta.icon
          return (
            <Link
              key={alert.id}
              href={`/pro/pacientes/${alert.patientUserId}`}
              className="flex items-start gap-3 rounded-xl px-4 py-3.5 transition-all hover:scale-[1.01] hover:shadow-sm"
              style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
            >
              <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: meta.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#6B2737" }}>
                  {alert.patientName ?? "Paciente sin nombre"}
                </p>
                <p className="text-xs font-light" style={{ color: "rgba(107,39,55,0.6)" }}>
                  {alert.message}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
