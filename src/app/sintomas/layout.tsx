import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Síntomas | Recetas según cómo te sientes — Food·Mood",
  description: "Descubre las recetas y alimentos funcionales que tu cuerpo necesita según tus síntomas actuales.",
}

export default function SintomasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
