import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes Food·Mood — Empieza gratis | Suscripción desde 5 €/mes",
  description: "Accede a todas las recetas funcionales de Food·Mood. Plan gratuito disponible. Suscripción mensual 9 €/mes o trimestral 15 €/3 meses. Cancela cuando quieras.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Planes Food·Mood — Empieza gratis",
    description: "Plan gratuito disponible. Suscripción desde 5 €/mes. Cancela cuando quieras.",
    url: "https://www.food-mood.app/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Planes Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planes Food·Mood — Empieza gratis",
    description: "Plan gratuito disponible. Suscripción desde 5 €/mes. Cancela cuando quieras.",
    images: ["/og-image.png"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
