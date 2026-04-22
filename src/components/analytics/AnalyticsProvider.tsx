"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const CONSENT_KEY = "fm_consent_v"
const ANALYTICS_KEY = "fm_consent_analytics"
const CONSENT_VERSION = "1.0"

export type AnalyticsEvent =
  | { name: "quiz_started" }
  | { name: "quiz_completed"; properties: { resultMood: string } }
  | { name: "recipe_viewed"; properties: { recipeId: string } }
  | { name: "mood_tracked"; properties: { moodId: string } }
  | { name: "waitlist_signup" }

export const trackEvent = (_event: AnalyticsEvent) => {}

export function AnalyticsProvider() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    const check = () => {
      const consented = localStorage.getItem(CONSENT_KEY) === CONSENT_VERSION
      const analyticsOn = localStorage.getItem(ANALYTICS_KEY) === "true"
      setAnalyticsAllowed(consented && analyticsOn)
    }
    check()
    window.addEventListener("fm:consent-updated", check)
    return () => window.removeEventListener("fm:consent-updated", check)
  }, [])

  if (!analyticsAllowed) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
