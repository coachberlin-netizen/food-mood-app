"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type PrescriptionContent = {
  id: string
  title: string
  content_type: string
  duration_minutes: number | null
  tags: string[]
}

export type Prescription = {
  id: string
  prescribed_at: string
  read_at: string | null
  professional_note: string | null
  patient_protocol_id: string | null
  protocol_stage: number | null
  content_library: PrescriptionContent
  professionals: { full_name: string } | null
}

export type PrescriptionsState = {
  prescriptions: Prescription[]
  unreadCount: number
  professionalName: string | null
  loading: boolean
}

export function usePrescriptions(): PrescriptionsState {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading]             = useState(true)
  const [professionalName, setProfessionalName] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from("content_prescriptions")
        .select(`
          id,
          prescribed_at,
          read_at,
          professional_note,
          patient_protocol_id,
          protocol_stage,
          content_library (
            id,
            title,
            content_type,
            duration_minutes,
            tags
          ),
          professionals (
            full_name
          )
        `)
        .eq("patient_user_id", user.id)
        .order("prescribed_at", { ascending: false })

      const rows = (data ?? []) as unknown as Prescription[]
      setPrescriptions(rows)

      const pro = rows[0]?.professionals?.full_name ?? null
      setProfessionalName(pro)
      setLoading(false)
    })
  }, [])

  const unreadCount = prescriptions.filter(p => !p.read_at).length

  return { prescriptions, unreadCount, professionalName, loading }
}

export function useLinkedProfessional(): { hasLink: boolean; professionalName: string | null; loading: boolean } {
  const [hasLink,   setHasLink]   = useState(false)
  const [proName,   setProName]   = useState<string | null>(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from("professional_patient_links")
        .select("professionals (full_name)")
        .eq("patient_user_id", user.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle()

      if (data) {
        setHasLink(true)
        const pro = data as unknown as { professionals: { full_name: string } | null }
        setProName(pro.professionals?.full_name ?? null)
      }
      setLoading(false)
    })
  }, [])

  return { hasLink, professionalName: proName, loading }
}
