"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Example typed events
export type AnalyticsEvent = 
  | { name: "quiz_started" }
  | { name: "quiz_completed"; properties: { resultMood: string } }
  | { name: "recipe_viewed"; properties: { recipeId: string } }
  | { name: "mood_tracked"; properties: { moodId: string } }
  | { name: "waitlist_signup" };

/**
 * Global function to track events. 
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (process.env.NODE_ENV !== "production") {
    // console.log("[Analytics Event]", event.name, "properties" in event ? event.properties : "");
  }
};

export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views automatically on route change if needed
    if (process.env.NODE_ENV !== "production") {
      // console.log("[Analytics Pageview]", pathname);
    }
  }, [pathname]);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
