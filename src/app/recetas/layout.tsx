import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recetas con Superpoderes — Food·Mood | Cocina para tu estado emocional",
  description: "Recetas funcionales diseñadas por estados emocionales: Calma, Focus, Activación, Reset, Confort y Social. Para adultos, mujeres 45+, niños y longevidad.",
  alternates: {
    canonical: "https://www.food-mood.app/recetas",
  },
  openGraph: {
    title: "Recetas con Superpoderes — Food·Mood",
    description: "Recetas funcionales diseñadas por estados emocionales: Calma, Focus, Activación, Reset, Confort y Social.",
    url: "https://www.food-mood.app/recetas",
  },
};

export default function RecetasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
