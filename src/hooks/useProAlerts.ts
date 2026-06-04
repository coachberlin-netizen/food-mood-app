"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type ProAlertType = "no_checkin" | "high_tension" | "first_week"

export type ProAlert = {
  id:             string
  type:           ProAlertType
  patientUserId:  string
  patientName:    string | null
  message:        string
}

const HIGH_TENSION     = new Set(["sympathetic_anxious", "dorsal_freeze", "dorsal_collapse"])
const THREE_DAYS_MS    = 3  * 24 * 60 * 60 * 1000
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000
const TWO_DAYS_MS      = 2  * 24 * 60 * 60 * 1000

export function useProAlerts() {
  const [alerts,  setAlerts]  = useState<ProAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const now = Date.now()

      const [patientsRes, namesRes, oracleRes, interoRes] = await Promise.all([
        supabase
          .from("professional_patient_links")
          .select("patient_user_id, linked_at")
          .eq("status", "active"),
        supabase
          .from("patient_invitations")
          .select("used_by_user_id, patient_name")
          .not("used_by_user_id", "is", null),
        supabase
          .from("oracle_checkins")
          .select("user_id, created_at")
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("interoceptive_checkins")
          .select("user_id, created_at, nervous_system_state")
          .order("created_at", { ascending: false })
          .limit(300),
      ])

      const patients = patientsRes.data ?? []
      const names    = namesRes.data    ?? []
      const oracle   = oracleRes.data   ?? []
      const intero   = interoRes.data   ?? []

      // patient name lookup
      const nameMap = new Map<string, string | null>(
        names.map(n => [n.used_by_user_id as string, n.patient_name as string | null])
      )

      // group oracle checkins by patient (already ordered DESC by created_at)
      const oracleByPatient = new Map<string, string[]>()
      for (const row of oracle) {
        const arr = oracleByPatient.get(row.user_id) ?? []
        arr.push(row.created_at)
        oracleByPatient.set(row.user_id, arr)
      }

      // group intero checkins by patient (already ordered DESC)
      const interoByPatient = new Map<string, { created_at: string; nervous_system_state: string }[]>()
      for (const row of intero) {
        const arr = interoByPatient.get(row.user_id) ?? []
        arr.push({ created_at: row.created_at, nervous_system_state: row.nervous_system_state })
        interoByPatient.set(row.user_id, arr)
      }

      const result: ProAlert[] = []

      for (const { patient_user_id, linked_at } of patients) {
        const patientName  = nameMap.get(patient_user_id) ?? null
        const checkins     = oracleByPatient.get(patient_user_id)  ?? []
        const interoChecks = interoByPatient.get(patient_user_id)  ?? []

        // ── Alert 1: Sin registro en 3+ días ─────────────────────────
        const lastOracleMs = checkins[0] ? new Date(checkins[0]).getTime() : null
        const linkedMs     = new Date(linked_at).getTime()
        const noCheckin    = lastOracleMs == null
          ? now - linkedMs     > THREE_DAYS_MS
          : now - lastOracleMs > THREE_DAYS_MS
        if (noCheckin) {
          const daysSince = lastOracleMs
            ? Math.floor((now - lastOracleMs) / (24 * 60 * 60 * 1000))
            : null
          result.push({
            id:            `no_checkin_${patient_user_id}`,
            type:          "no_checkin",
            patientUserId: patient_user_id,
            patientName,
            message:       daysSince != null
              ? `Sin registro desde hace ${daysSince} ${daysSince === 1 ? "día" : "días"}`
              : "Aún no ha hecho su primer registro",
          })
        }

        // ── Alert 2: Tensión alta sostenida ──────────────────────────
        if (interoChecks.length >= 3) {
          const lastThree = interoChecks.slice(0, 3)
          if (lastThree.every(r => HIGH_TENSION.has(r.nervous_system_state))) {
            result.push({
              id:            `high_tension_${patient_user_id}`,
              type:          "high_tension",
              patientUserId: patient_user_id,
              patientName,
              message:       "Tensión alta en los 3 últimos registros corporales",
            })
          }
        }

        // ── Alert 3: Primera semana completada ───────────────────────
        if (checkins.length >= 7) {
          const sortedAsc   = [...checkins].sort()
          const firstMs     = new Date(sortedAsc[0]).getTime()
          const seventhMs   = new Date(sortedAsc[6]).getTime()
          if (
            now - firstMs   <= FOURTEEN_DAYS_MS &&
            now - seventhMs <= TWO_DAYS_MS
          ) {
            result.push({
              id:            `first_week_${patient_user_id}`,
              type:          "first_week",
              patientUserId: patient_user_id,
              patientName,
              message:       "Ha completado su primera semana de registros",
            })
          }
        }
      }

      setAlerts(result)
      setLoading(false)
    }

    load()
  }, [])

  return { alerts, loading }
}
