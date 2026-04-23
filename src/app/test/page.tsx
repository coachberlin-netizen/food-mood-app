import { Metadata } from "next";
import { Suspense } from "react";
import TestClient from "./TestClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Test de Estado Emocional — Descubre tu paleta | Food·Mood",
  description:
    "Test gratuito de 30 segundos. 5 sliders. Tu mezcla emocional en porcentajes y las recetas que le corresponden. Sin registro obligatorio.",
  alternates: { canonical: "/test" },
  openGraph: {
    title: "Test de Estado Emocional — Food·Mood",
    description:
      "Descubre tu paleta emocional en 30 segundos. Gratis. Sin registro.",
    url: "https://www.food-mood.app/test",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Test de Estado Emocional — Food·Mood" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test de Estado Emocional — Food·Mood",
    description: "5 sliders. Tu mezcla emocional real, no una etiqueta.",
    images: ["/og-image.png"],
  },
};

export default function TestPage() {
  return (
    <>
      {/* SEO shell — visible to crawlers before JS hydrates */}
      <div className="sr-only">
        <h1>Test de Estado Emocional — ¿Cómo te sentís hoy?</h1>
        <p>
          Test gratuito. 5 dimensiones emocionales: energía, ánimo, tensión,
          conexión y claridad. Tu mezcla en porcentajes y las recetas
          funcionales que responden exactamente a ese estado.
        </p>
        <p>Gratis. Sin registro obligatorio. Resultado inmediato.</p>
      </div>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          </div>
        }
      >
        <TestClient />
      </Suspense>
    </>
  );
}
