import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recetas con Superpoderes — Food·Mood | Cocina para tu estado emocional",
  description: "Recetas funcionales diseñadas por estados emocionales: Calma, Focus, Activación, Reset, familia y Social. Para adultos, mujeres 45+, niños y longevidad.",
  alternates: { canonical: "/recetas" },
  openGraph: {
    title: "Recetas con Superpoderes — Food·Mood",
    description: "Recetas funcionales para cada estado emocional: Calma, Focus, Activación, Reset y más.",
    url: "https://www.food-mood.app/recetas",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Recetas funcionales — Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recetas con Superpoderes — Food·Mood",
    description: "Recetas funcionales para cada estado emocional: Calma, Focus, Activación, Reset y más.",
    images: ["/og-image.png"],
  },
};

export default function RecetasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
