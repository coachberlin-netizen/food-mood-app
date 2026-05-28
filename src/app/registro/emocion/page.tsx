import type { Metadata } from "next"
import EmocionClient from "./EmocionClient"

export const metadata: Metadata = {
  title: "Registro emocional | Food·Mood",
  description: "Expande tu vocabulario emocional con ayuda de IA.",
}

export default function EmocionPage() {
  return <EmocionClient />
}
