import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cómo funciona | Food·Mood",
  description: "Descubre el método de Food·Mood: test emocional, paleta de estados, recetas funcionales y seguimiento de tu bienestar. Basado en la ciencia del eje intestino-cerebro.",
  openGraph: {
    title: "Cómo funciona Food·Mood",
    description: "Del estado emocional a la receta perfecta. Nuestro método en 4 pasos basado en neurociencia y microbiota.",
    url: "https://www.food-mood.app/como-funciona",
    siteName: "Food·Mood",
    type: "website",
  },
}

export default function ComoFuncionaLayout({ children }: { children: React.ReactNode }) {
  return children
}
