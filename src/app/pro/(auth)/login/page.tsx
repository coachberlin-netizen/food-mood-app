import type { Metadata } from "next"
import ProLoginClient from "./ProLoginClient"

export const metadata: Metadata = {
  title: "Acceso profesional | Food·Mood",
}

export default function ProLoginPage() {
  return <ProLoginClient />
}
