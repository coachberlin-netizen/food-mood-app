import type { Metadata } from "next"
import InvitacionesClient from "./InvitacionesClient"

export const metadata: Metadata = {
  title: "Invitaciones | Portal Profesional Food·Mood",
}

export default function InvitacionesPage() {
  return <InvitacionesClient />
}
