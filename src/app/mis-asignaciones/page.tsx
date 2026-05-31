import type { Metadata } from "next"
import { MisAsignacionesClient } from "./MisAsignacionesClient"

export const metadata: Metadata = {
  title: "Mis asignaciones | Food·Mood",
  description: "Prácticas asignadas por tu profesional de salud.",
}

export default function MisAsignacionesPage() {
  return <MisAsignacionesClient />
}
