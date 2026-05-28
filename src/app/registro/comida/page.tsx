import type { Metadata } from "next"
import ComidaClient from "./ComidaClient"

export const metadata: Metadata = {
  title: "Registro emocional pre/post comida | Food·Mood",
  description: "Registra tu estado emocional antes y después de comer.",
}

export default function ComidaPage() {
  return <ComidaClient />
}
