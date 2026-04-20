import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Test de Estado Emocional — Food·Mood",
  description: "Descubre tu color emocional de hoy con 5 sliders. Recibe recetas personalizadas según tu estado real.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Test de Estado Emocional — Food·Mood",
    description: "Descubre tu color emocional de hoy con 5 sliders. Recibe recetas personalizadas según tu estado real.",
    url: "https://www.food-mood.app/test",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Test de estado emocional — Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test de Estado Emocional — Food·Mood",
    description: "Descubre tu color emocional de hoy con 5 sliders. Recibe recetas personalizadas según tu estado real.",
    images: ["/og-image.png"],
  },
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
