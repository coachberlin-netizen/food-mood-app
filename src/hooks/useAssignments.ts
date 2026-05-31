"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type ActiveAssignment = {
  id: string
  title: string
  instruction: string
  professional_name: string | null
}

export type PatientAssignment = {
  id: string
  tool_slug: string
  title: string
  instruction: string
  frequency_per_week: number
  due_date: string | null
  is_active: boolean
  created_at: string
  completions_this_week: number
}

export function useActiveAssignment(toolSlug: string): {
  assignment: ActiveAssignment | null
  loading: boolean
} {
  const [assignment, setAssignment] = useState<ActiveAssignment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from("therapeutic_assignments")
        .select("id, title, instruction, professionals(full_name)")
        .eq("patient_user_id", user.id)
        .eq("tool_slug", toolSlug)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle()
      if (data) {
        const row = data as unknown as { id: string; title: string; instruction: string; professionals: { full_name: string } | null }
        setAssignment({
          id:                row.id,
          title:             row.title,
          instruction:       row.instruction,
          professional_name: row.professionals?.full_name ?? null,
        })
      }
      setLoading(false)
    })
  }, [toolSlug])

  return { assignment, loading }
}

export function useAssignmentsBadge(): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 6)
      weekStart.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from("therapeutic_assignments")
        .select("id, frequency_per_week, assignment_completions(completed_at)")
        .eq("patient_user_id", user.id)
        .eq("is_active", true)

      if (!data) return
      const rows = data as { id: string; frequency_per_week: number; assignment_completions: { completed_at: string }[] }[]
      const pending = rows.filter(r => {
        const done = r.assignment_completions.filter(c => new Date(c.completed_at) >= weekStart).length
        return done < r.frequency_per_week
      }).length
      setCount(pending)
    })
  }, [])

  return count
}

export function usePatientAssignments(): {
  assignments: PatientAssignment[]
  loading: boolean
  refresh: () => void
} {
  const [assignments, setAssignments] = useState<PatientAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 6)
      weekStart.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from("therapeutic_assignments")
        .select("id, tool_slug, title, instruction, frequency_per_week, due_date, is_active, created_at, assignment_completions(completed_at)")
        .eq("patient_user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      const rows = (data ?? []) as (Omit<PatientAssignment, "completions_this_week"> & {
        assignment_completions: { completed_at: string }[]
      })[]

      setAssignments(rows.map(r => ({
        id:                   r.id,
        tool_slug:            r.tool_slug,
        title:                r.title,
        instruction:          r.instruction,
        frequency_per_week:   r.frequency_per_week,
        due_date:             r.due_date,
        is_active:            r.is_active,
        created_at:           r.created_at,
        completions_this_week: r.assignment_completions.filter(c => new Date(c.completed_at) >= weekStart).length,
      })))
      setLoading(false)
    })
  }, [tick])

  return { assignments, loading, refresh: () => setTick(t => t + 1) }
}
