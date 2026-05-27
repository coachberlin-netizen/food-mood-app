import type { Metadata } from "next"
import CanjearClient from "./CanjearClient"

export const metadata: Metadata = {
  title: "Canjear código de consulta | Food·Mood",
  description: "Introduce el código que te ha facilitado tu profesional de salud para vincularte a su consulta.",
}

export default function CanjearPage() {
  return <CanjearClient />
}
