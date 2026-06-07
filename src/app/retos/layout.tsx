import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retos de Transformación — Food·Mood",
  description: "Programas de 7 a 28 días con seguimiento diario, recetas funcionales y tracking del índice Food·Mood. Un objetivo, un camino, datos reales.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/retos" },
  openGraph: {
    title: "Retos de Transformación — Food·Mood",
    description: "Programas de 7 a 28 días con seguimiento diario, recetas funcionales y tracking del índice Food·Mood.",
    url: "https://www.food-mood.app/retos",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Retos Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retos de Transformación — Food·Mood",
    description: "Programas de 7 a 28 días con seguimiento diario, recetas funcionales y tracking del índice Food·Mood.",
    images: ["/og-image.png"],
  },
}

export default function RetosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
