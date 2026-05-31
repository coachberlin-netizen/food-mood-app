import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Susana Ferreras Díez — Psicóloga y Tecnóloga de alimentos | Food·Mood Pro",
  description:
    "Susana Ferreras Díez: psicóloga, tecnóloga de alimentos y fundadora de Food·Mood Pro. Autora de Food·Mood: Síntomas & Soluciones. Especialista en psiconutrición y eje intestino-cerebro.",
  alternates: {
    canonical: "/quienes-somos",
  },
  openGraph: {
    title: "Susana Ferreras Díez — Fundadora de Food·Mood Pro",
    description:
      "Psicóloga, tecnóloga de alimentos y especialista en psiconutrición. Fundadora de Food·Mood Pro, la plataforma de seguimiento emocional entre sesiones para profesionales de la salud.",
    url: "https://www.food-mood.app/quienes-somos",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Susana Ferreras Díez — Food·Mood Pro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Susana Ferreras Díez — Fundadora de Food·Mood Pro",
    description: "Psicóloga, tecnóloga de alimentos, autora y psiconutricionista. Fundadora de Food·Mood Pro.",
    images: ["/og-image.png"],
  },
}

export default function QuienesSomosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
