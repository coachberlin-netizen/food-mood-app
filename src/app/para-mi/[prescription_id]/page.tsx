import type { Metadata } from "next"
import VisorClient from "./VisorClient"

export const metadata: Metadata = {
  title: "Para ti | Food·Mood",
  description: "Contenido prescrito por tu profesional de salud.",
}

export default function VisorPage({ params }: { params: { prescription_id: string } }) {
  return <VisorClient prescriptionId={params.prescription_id} />
}
