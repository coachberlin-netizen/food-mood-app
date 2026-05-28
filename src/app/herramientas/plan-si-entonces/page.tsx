import type { Metadata } from "next"
import PlanClient from "./PlanClient"

export const metadata: Metadata = {
  title: "Plan si-entonces | Food·Mood",
  description: "Crea planes de acción basados en situaciones concretas.",
}

export default function PlanPage() {
  return <PlanClient />
}
