import type { Metadata } from "next"
import InteroceptivoClient from "./InteroceptivoClient"

export const metadata: Metadata = {
  title: "Check-in interoceptivo | Food·Mood",
  description: "Registra tu estado del sistema nervioso y señales corporales.",
}

export default function InteroceptivoPage() {
  return <InteroceptivoClient />
}
