"use client"

import Link from "next/link"
import { Users, Flame, AlertCircle } from "lucide-react"
import { useLinkedPatients, type LinkedPatient } from "@/hooks/useLinkedPatients"
import { useAttentionFlagsSummary } from "@/hooks/useAttentionFlags"

// ── SN state config ──────────────────────────────────────────────────────────

const SN_CONFIG: Record<string, { color: string; label: string }> = {
  ventral:             { color: "#10B981", label: "Calma" },
  sympathetic_active:  { color: "#F59E0B", label: "Activación" },
  sympathetic_anxious: { color: "#F59E0B", label: "Alerta" },
  dorsal_freeze:       { color: "#64748B", label: "Freeze" },
  dorsal_collapse:     { color: "#64748B", label: "Colapso" },
  mixed:               { color: "#8B5CF6", label: "Mixto" },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 1)  return "Hace menos de 1h"
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Ayer"
  return `Hace ${days}d`
}

// ── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-[2px] h-5">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: `${Math.max(2, Math.round((v / max) * 20))}px`,
            background: i === values.length - 1 ? "#C9A84C" : "rgba(107,39,55,0.2)",
          }}
        />
      ))}
    </div>
  )
}

// ── Patient card ─────────────────────────────────────────────────────────────

function PatientCard({ p, flagSeverity }: { p: LinkedPatient; flagSeverity?: "soft" | "moderate" }) {
  const sn          = p.sn_state ? SN_CONFIG[p.sn_state] : null
  const borderColor = sn?.color ?? "rgba(107,39,55,0.12)"
  const noActivity  = p.recent_checkins === 0

  return (
    <Link
      href={`/pro/pacientes/${p.patient_user_id}`}
      className="block group bg-white rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{
        border: "1px solid rgba(107,39,55,0.08)",
        borderLeftWidth: 3,
        borderLeftColor: borderColor,
      }}
    >
      <div className="p-5 flex flex-col gap-3">

        {/* Name + badges row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight truncate group-hover:text-[#6B2737] transition-colors" style={{ color: "#2d0f16" }}>
              {p.patient_name ?? <span className="italic" style={{ color: "rgba(107,39,55,0.4)" }}>Sin nombre</span>}
            </p>
            {p.patient_email && (
              <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(107,39,55,0.4)" }}>
                {p.patient_email}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {flagSeverity && (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: "#F59E0B" }}
                title="Señales de atención activas"
              />
            )}
            {p.recent_checkins > 0 && (
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold"
                style={{ background: "#6B2737", color: "#F5F0E8" }}
                title={`${p.recent_checkins} registro${p.recent_checkins !== 1 ? "s" : ""} esta semana`}
              >
                {p.recent_checkins > 9 ? "9+" : p.recent_checkins}
              </span>
            )}
            {noActivity && (
              <span title="Sin actividad esta semana">
                <AlertCircle className="w-4 h-4" style={{ color: "rgba(107,39,55,0.25)" }} />
              </span>
            )}
          </div>
        </div>

        {/* FM Index + sparkline + streak */}
        <div className="flex items-center gap-3">
          {p.fm_index_today !== null && (
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(107,39,55,0.4)" }}>FM</span>
              <span className="text-lg font-bold font-serif leading-none" style={{ color: "#6B2737" }}>
                {p.fm_index_today}
              </span>
            </div>
          )}
          {p.fm_sparkline.length > 0 && <Sparkline values={p.fm_sparkline} />}
          {p.streak > 0 && (
            <div className="flex items-center gap-0.5 ml-auto">
              <Flame className="w-3 h-3" style={{ color: "#F59E0B" }} />
              <span className="text-[11px] font-semibold" style={{ color: "#F59E0B" }}>{p.streak}</span>
            </div>
          )}
        </div>

        {/* SN state + last activity */}
        <div className="flex items-center justify-between gap-2">
          {sn ? (
            <span
              className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: sn.color + "18", color: sn.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sn.color }} />
              {sn.label}
            </span>
          ) : (
            <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.25)" }}>
              {noActivity ? "Sin actividad reciente" : "Estado SN no disponible"}
            </span>
          )}
          {p.last_checkin_at && (
            <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.35)" }}>
              {timeAgo(p.last_checkin_at)}
            </span>
          )}
        </div>

      </div>
    </Link>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-2xl p-5 animate-pulse flex flex-col gap-3"
      style={{ border: "1px solid rgba(107,39,55,0.08)", borderLeftWidth: 3, borderLeftColor: "rgba(107,39,55,0.1)" }}
    >
      <div className="h-3.5 rounded-full w-1/2" style={{ background: "rgba(107,39,55,0.07)" }} />
      <div className="h-2.5 rounded-full w-1/3" style={{ background: "rgba(107,39,55,0.05)" }} />
      <div className="h-5 rounded-full w-2/3" style={{ background: "rgba(107,39,55,0.05)" }} />
      <div className="h-2.5 rounded-full w-1/4" style={{ background: "rgba(107,39,55,0.04)" }} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PacientesClient() {
  const { patients, loading }   = useLinkedPatients()
  const { summary: flagSummary } = useAttentionFlagsSummary()

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold" style={{ color: "#6B2737" }}>Pacientes</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(107,39,55,0.55)" }}>Personas vinculadas a tu consulta.</p>
        </div>
        {!loading && patients.length > 0 && (
          <p className="text-xs font-medium" style={{ color: "rgba(107,39,55,0.4)" }}>
            {patients.length} activo{patients.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : patients.length === 0 ? (
        <div
          className="rounded-2xl p-12 flex flex-col items-center gap-4 text-center bg-white"
          style={{ border: "1px solid rgba(107,39,55,0.08)" }}
        >
          <div className="p-4 rounded-full" style={{ background: "rgba(107,39,55,0.05)" }}>
            <Users className="w-8 h-8" style={{ color: "rgba(107,39,55,0.3)" }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "#6B2737" }}>Ningún paciente vinculado todavía</p>
            <p className="text-sm mt-1" style={{ color: "rgba(107,39,55,0.5)" }}>
              Crea una invitación y comparte el código con tu paciente.
            </p>
          </div>
          <Link
            href="/pro/invitaciones"
            className="mt-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
            style={{ background: "#6B2737", color: "#F5F0E8" }}
          >
            Crear invitación
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map(p => <PatientCard key={p.id} p={p} flagSeverity={flagSummary.get(p.patient_user_id)} />)}
        </div>
      )}

    </div>
  )
}
