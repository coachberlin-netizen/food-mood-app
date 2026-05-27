import type { Metadata } from "next"
import SignupClient from "./SignupClient"

export const metadata: Metadata = {
  title: "Registro profesional | Food·Mood",
}

export default function ProSignupPage() {
  return <SignupClient />
}
