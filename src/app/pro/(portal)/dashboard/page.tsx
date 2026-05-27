import type { Metadata } from "next"
import ProDashboardClient from "./ProDashboardClient"

export const metadata: Metadata = {
  title: "Dashboard | Portal Profesional Food·Mood",
}

export default function ProDashboardPage() {
  return <ProDashboardClient />
}
