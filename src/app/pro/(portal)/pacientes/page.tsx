import type { Metadata } from "next"
import PacientesClient from "./PacientesClient"

export const metadata: Metadata = {
  title: "Pacientes | Portal Profesional Food·Mood",
}

export default function PacientesPage() {
  return <PacientesClient />
}
