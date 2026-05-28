import type { Metadata } from "next"
import ValoresClient from "./ValoresClient"

export const metadata: Metadata = {
  title: "Mis valores | Food·Mood",
  description: "Descubre los valores que guían tu relación con la alimentación.",
}

export default function ValoresPage() {
  return <ValoresClient />
}
