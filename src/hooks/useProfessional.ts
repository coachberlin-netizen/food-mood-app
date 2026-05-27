"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type Professional = {
  id: string
  email: string
  full_name: string
  professional_title: string
  license_number: string | null
  bio: string | null
  subscription_status: string | null
  subscription_tier: string | null
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
