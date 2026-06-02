"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type ActivePatientProtocol = {
  id:            string
  protocol_name: string
  duration_days: number
  current_stage: number
  total_stages:  number
  stage_name:    string
  days_elapsed:  number
  status:        string
}

type ProtocolStage = { stage: number; name: string }

export function useActivePatientProtocol(): {
  protocol: ActivePatientProtocol | null
  loading:  boolean
} {
  const [protocol, setProtocol] = useState<ActivePatientProtocol | null>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from("patient_protocols")
        .select(`
          id,
          current_stage,
          status,
          started_at,
          clinical_protocols (
            name,
            duration_days,
            stages
          )
        `)
        .eq("patient_user_id", user.id)
        .in("status", ["active", "paused"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!data) { setLoading(false); return }

      const row = data as unknown as {
        id: string
        current_stage: number
        status: string
        started_at: string
        clinical_protocols: {
          name: string
          duration_days: number
          stages: ProtocolStage[]
        } | null
      }

      const cp = row.clinical_protocols
      if (!cp) { setLoading(false); return }

      const daysElapsed = Math.max(
        1,
        Math.floor((Date.now() - new Date(row.started_at).getTime()) / (1000 * 60 * 60 * 24)) + 1
      )

      const currentStageData = cp.stages.find(s => s.stage === row.current_stage)

      setProtocol({
        id:            row.id,
        protocol_name: cp.name,
        duration_days: cp.duration_days,
        current_stage: row.current_stage,
        total_stages:  cp.stages.length,
        stage_name:    currentStageData?.name ?? `Etapa ${row.current_stage}`,
        days_elapsed:  daysElapsed,
        status:        row.status,
      })
      setLoading(false)
    })
  }, [])

  return { protocol, loading }
}
