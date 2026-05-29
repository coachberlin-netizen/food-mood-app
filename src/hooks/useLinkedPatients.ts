"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type LinkedPatient = {
  id: string
  professional_id: string
  patient_user_id: string
  status: "active" | "paused" | "ended"
  linked_at: string
  ended_at: string | null
  professional_notes: string | null
  patient_name: string | null
  patient_email: string | null
  // Enriched metrics (null when data not yet available)
  last_checkin_at: string | null
  recent_checkins: number
  fm_index_today: number | null
  fm_sparkline: number[]
  sn_state: string | null
  streak: number
}

type CheckinRow = { user_id: string; created_at: string }
type FmRow     = { user_id: string; index_value: number; date: string }
type SnRow     = { user_id: string; nervous_system_state: string }
type StreakRow  = { user_id: string; current_streak: number }

export function useLinkedPatients() {
  const [patients, setPatients] = useState<LinkedPatient[]>([])
  const [loading,  setLoading]  = useState(true)
  const [trigger,  setTrigger]  = useState(0)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      setLoading(true)

      const [linksRes, invRes] = await Promise.all([
        supabase
          .from("professional_patient_links")
          .select("*")
          .eq("status", "active")
          .order("linked_at", { ascending: false }),
        supabase
          .from("patient_invitations")
          .select("used_by_user_id, patient_name, patient_email")
          .not("used_by_user_id", "is", null),
      ])

      const links = linksRes.data ?? []
      const invByUser = new Map(
        (invRes.data ?? []).map(i => [i.used_by_user_id as string, i])
      )

      if (links.length === 0) {
        setPatients([])
        setLoading(false)
        return
      }

      const patientIds = links.map(l => l.patient_user_id)
      const now = new Date()
      const sevenDaysAgo    = new Date(now.getTime() - 7  * 86_400_000)
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 3_600_000)
      const todayStr        = now.toISOString().slice(0, 10)
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10)

      const [checkinRes, fmRes, snRes, streakRes] = await Promise.all([
        supabase
          .from("oracle_checkins")
          .select("user_id, created_at")
          .in("user_id", patientIds)
          .gte("created_at", sevenDaysAgo.toISOString())
          .order("created_at", { ascending: false })
          .limit(patientIds.length * 20),
        supabase
          .from("fm_index_log")
          .select("user_id, index_value, date")
          .in("user_id", patientIds)
          .gte("date", sevenDaysAgoStr)
          .order("date", { ascending: false })
          .limit(patientIds.length * 8),
        supabase
          .from("interoceptive_checkins")
          .select("user_id, nervous_system_state")
          .in("user_id", patientIds)
          .gte("logged_at", fortyEightHoursAgo.toISOString())
          .order("logged_at", { ascending: false })
          .limit(patientIds.length * 3),
        supabase
          .from("user_streaks")
          .select("user_id, current_streak")
          .in("user_id", patientIds),
      ])

      // Group checkins per user (already ordered desc → first = most recent)
      const checkinsByUser = new Map<string, CheckinRow[]>()
      for (const c of (checkinRes.data ?? []) as CheckinRow[]) {
        const arr = checkinsByUser.get(c.user_id) ?? []
        arr.push(c)
        checkinsByUser.set(c.user_id, arr)
      }

      // Group FM rows per user (ordered desc → slice(0,7) = last 7 days; reverse for chart)
      const fmByUser = new Map<string, FmRow[]>()
      for (const f of (fmRes.data ?? []) as FmRow[]) {
        const arr = fmByUser.get(f.user_id) ?? []
        arr.push(f)
        fmByUser.set(f.user_id, arr)
      }

      // Latest SN state per user (first row wins — already ordered desc)
      const snByUser = new Map<string, string>()
      for (const s of (snRes.data ?? []) as SnRow[]) {
        if (!snByUser.has(s.user_id)) snByUser.set(s.user_id, s.nervous_system_state)
      }

      const streakByUser = new Map<string, number>()
      for (const s of (streakRes.data ?? []) as StreakRow[]) {
        streakByUser.set(s.user_id, s.current_streak)
      }

      const enriched: LinkedPatient[] = links.map(link => {
        const uid        = link.patient_user_id
        const userCk     = checkinsByUser.get(uid) ?? []
        const userFm     = fmByUser.get(uid) ?? []
        const sparkline  = [...userFm].slice(0, 7).map(f => f.index_value).reverse()
        const fmToday    = userFm.find(f => f.date === todayStr)?.index_value ?? null

        return {
          ...link,
          patient_name:    invByUser.get(uid)?.patient_name  ?? null,
          patient_email:   invByUser.get(uid)?.patient_email ?? null,
          last_checkin_at: userCk[0]?.created_at ?? null,
          recent_checkins: userCk.length,
          fm_index_today:  fmToday,
          fm_sparkline:    sparkline,
          sn_state:        snByUser.get(uid) ?? null,
          streak:          streakByUser.get(uid) ?? 0,
        }
      })

      // Sort: most recent checkins first (most to review), then by last activity
      enriched.sort((a, b) => {
        if (b.recent_checkins !== a.recent_checkins) return b.recent_checkins - a.recent_checkins
        if (a.last_checkin_at && b.last_checkin_at)
          return new Date(b.last_checkin_at).getTime() - new Date(a.last_checkin_at).getTime()
        if (a.last_checkin_at) return -1
        if (b.last_checkin_at) return 1
        return 0
      })

      setPatients(enriched)
      setLoading(false)
    }

    load()
  }, [trigger])

  return { patients, loading, refresh: () => setTrigger(t => t + 1) }
}
