import type { Metadata } from "next"
import HambreClient from "./HambreClient"

export const metadata: Metadata = {
  title: "Termómetro de hambre | Food·Mood",
  description: "Distingue entre hambre física y emocional con claridad interoceptiva.",
}

export default function HambrePage() {
  return <HambreClient />
}
