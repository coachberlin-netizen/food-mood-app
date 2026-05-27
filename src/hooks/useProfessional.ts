"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type Professional = {
  id: string
  user_id: string
  full_name: string
  professional_title: string
  license_number: string | null
  bio: string | null
  is_verified: boolean
  plan: "free" | "starter" | "pro"
  created_at: string
}

export function useProfessional() {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("professionals")
      .select("*")
      .maybeSingle()
      .then(({ data }) => {
        setProfessional(data)
        setLoading(false)
      })
  }, [])

  return { professional, loading }
}
