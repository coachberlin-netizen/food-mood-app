import type { Metadata } from "next"
import PensamientoClient from "./PensamientoClient"

export const metadata: Metadata = {
  title: "Diario de pensamientos | Food·Mood",
  description: "Explora y reencuadra un pensamiento perturbador con ayuda de IA.",
}

export default function PensamientoPage() {
  return <PensamientoClient />
}
