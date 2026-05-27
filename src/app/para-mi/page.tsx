import type { Metadata } from "next"
import ParaMiClient from "./ParaMiClient"

export const metadata: Metadata = {
  title: "Para ti | Food·Mood",
  description: "Contenido prescrito por tu profesional de salud.",
}

export default function ParaMiPage() {
  return <ParaMiClient />
}
