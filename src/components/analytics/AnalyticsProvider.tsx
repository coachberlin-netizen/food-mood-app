"use client"

import { useEffect, useState } from "react"
import { Analytics, track } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google"

const CONSENT_KEY    = "fm_consent_v"
const ANALYTICS_KEY  = "fm_consent_analytics"
const CONSENT_VERSION = "1.0"

const GA4_ID       = process.env.NEXT_PUBLIC_GA4_ID       ?? ""
const CLARITY_ID   = process.env.NEXT_PUBLIC_CLARITY_ID   ?? ""

// ── Event catalogue ─────────────────────────────────────────────────────────
export type AnalyticsEvent =
  | { name: "quiz_started" }
  | { name: "quiz_completed";    properties: { resultMood: string } }
  | { name: "quiz_step";         properties: { step: number } }
  | { name: "recipe_viewed";     properties: { recipeId: string; recipeName?: string } }
  | { name: "mood_tracked";      properties: { moodId: string } }
  | { name: "checkout_started";  properties: { plan: "monthly" | "quarterly" } }
  | { name: "checkout_success" }
  | { name: "register_started" }
  | { name: "login_success" }
  | { name: "reto_viewed";       properties: { slug: string } }
  | { name: "newsletter_signup"; properties: { source: string } }
  | { name: "demo_step";         properties: { step: number; mood?: string } }
  | { name: "servicios_cta";     properties: { service: "sesion" | "protocolo" } }

// ── Single tracking call — fires only when consent is given ──────────────────
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return

  const consented  = localStorage.getItem(CONSENT_KEY)   === CONSENT_VERSION
  const allowed    = localStorage.getItem(ANALYTICS_KEY) === "true"
  if (!consented || !allowed) return

  const { name, ...rest } = event as any
  const properties = rest.properties ?? {}

  // Vercel Analytics
  track(name, properties)

  // GA4 via gtag (injected by GoogleAnalytics component)
  if (GA4_ID && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", name, properties)
  }
}

// ── Provider component ──────────────────────────────────────────────────────
export function AnalyticsProvider() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    const check = () => {
      const consented = localStorage.getItem(CONSENT_KEY)   === CONSENT_VERSION
      const allowed   = localStorage.getItem(ANALYTICS_KEY) === "true"
      setAnalyticsAllowed(consented && allowed)
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
      {GA4_ID     && <GoogleAnalytics gaId={GA4_ID} />}
      {CLARITY_ID && <MicrosoftClarity id={CLARITY_ID} />}
    </>
  )
}

// ── Microsoft Clarity (no official Next.js package — thin script loader) ────
function MicrosoftClarity({ id }: { id: string }) {
  useEffect(() => {
    if (document.getElementById("ms-clarity")) return
    const s = document.createElement("script")
    s.id   = "ms-clarity"
    s.type = "text/javascript"
    s.async = true
    s.innerHTML = `(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","${id}");`
    document.head.appendChild(s)
    return () => { document.getElementById("ms-clarity")?.remove() }
  }, [id])
  return null
}
