import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quiénes Somos | Food·Mood — Ciencia con propósito",
  description: "El equipo detrás de Food·Mood: psicólogos, nutricionistas y tecnólogos. Ciencia del eje intestino-cerebro aplicada al bienestar real.",
  alternates: {
    canonical: "/quienes-somos",
  },
}

export default function QuienesSomosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
