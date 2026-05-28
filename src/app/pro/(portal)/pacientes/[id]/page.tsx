import type { Metadata } from "next"
import PacienteDetailClient from "./PacienteDetailClient"

export const metadata: Metadata = {
  title: "Paciente | Food·Mood Pro",
}

export default function PacienteDetailPage({ params }: { params: { id: string } }) {
  return <PacienteDetailClient patientUserId={params.id} />
}
