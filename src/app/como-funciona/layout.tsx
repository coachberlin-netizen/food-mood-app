import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cómo funciona Food·Mood — El método en detalle",
  description: "Cómo funciona la nutrición neuroactiva de Food·Mood, paso a paso. Test inicial, paleta emocional, recetas funcionales personalizadas y seguimiento día a día. Diseñado para perimenopausia, microbiota y longevidad.",
  openGraph: {
    title: "Cómo funciona Food·Mood — El método en detalle",
    description: "Sin promesas vagas. Exactamente lo que pasa cuando abres la app por primera vez, y lo que pasa cuando vuelves al día siguiente.",
    url: "https://www.food-mood.app/como-funciona",
    siteName: "Food·Mood",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo funciona Food·Mood — El método en detalle",
    description: "Sin promesas vagas. Exactamente lo que pasa cuando abres la app por primera vez.",
  },
}

export default function ComoFuncionaLayout({ children }: { children: React.ReactNode }) {
  return children
}
