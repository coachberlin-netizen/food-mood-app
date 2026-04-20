import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Test de Estado Emocional — Food·Mood",
  description: "Descubre tu color emocional de hoy con 5 sliders. Recibe recetas personalizadas según tu estado real.",
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
