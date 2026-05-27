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
}

export function useLinkedPatients() {
  const [patients, setPatients] = useState<LinkedPatient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    Promise.all([
      supabase
        .from("professional_patient_links")
        .select("*")
        .eq("status", "active")
        .order("linked_at", { ascending: false }),
      supabase
        .from("patient_invitations")
        .select("used_by_user_id, patient_name, patient_email")
        .not("used_by_user_id", "is", null),
    ]).then(([linksRes, invRes]) => {
      const links = linksRes.data ?? []
      const invByUser = new Map(
        (invRes.data ?? []).map((i) => [i.used_by_user_id as string, i])
      )
      setPatients(
        links.map((link) => ({
          ...link,
          patient_name: invByUser.get(link.patient_user_id)?.patient_name ?? null,
          patient_email: invByUser.get(link.patient_user_id)?.patient_email ?? null,
        }))
      )
      setLoading(false)
    })
  }, [])

  return { patients, loading, refresh: () => setLoading(true) }
}
