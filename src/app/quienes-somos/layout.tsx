import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quiénes Somos | Food·Mood — Ciencia con propósito",
  description: "Conoce al equipo de psicólogos, tecnólogos alimentarios y especialistas en longevidad detrás de Food·Mood. Ciencia del eje intestino-cerebro aplicada a tu bienestar diario.",
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
