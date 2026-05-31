import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cómo funciona Food·Mood — El método en detalle",
  description: "Test emocional, paleta de estados y recetas funcionales adaptadas: así funciona Food·Mood para perimenopausia, microbiota y longevidad.",
  alternates: { canonical: "/como-funciona" },
  openGraph: {
    title: "Cómo funciona Food·Mood — El método en detalle",
    description: "Sin promesas vagas. Exactamente lo que pasa cuando abres la app por primera vez, y lo que ocurre cuando vuelves al día siguiente.",
    url: "https://www.food-mood.app/como-funciona",
    siteName: "Food·Mood",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cómo funciona Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo funciona Food·Mood — El método en detalle",
    description: "Sin promesas vagas. Lo que pasa cuando abres la app y cuando vuelves al día siguiente.",
    images: ["/og-image.png"],
  },
}

export default function ComoFuncionaLayout({ children }: { children: React.ReactNode }) {
  return children
}
