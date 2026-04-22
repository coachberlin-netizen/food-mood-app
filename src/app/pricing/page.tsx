import { Suspense } from "react";
import { Metadata } from "next";
import PricingClient from "./PricingClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Precios — Club Premium Food·Mood | Desde 5€/mes",
  description: "Accede a 200+ recetas funcionales, canal privado de Telegram, comunidad WhatsApp y seguimiento personalizado. Sin compromiso — cancela cuando quieras.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Precios — Club Premium Food·Mood",
    description: "Accede a 200+ recetas funcionales, Telegram privado, WhatsApp y seguimiento emocional desde 5€/mes.",
    url: "https://www.food-mood.app/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Food·Mood Premium" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precios — Club Premium Food·Mood",
    description: "200+ recetas funcionales + canal Telegram privado + WhatsApp desde 5€/mes.",
    images: ["/og-image.png"],
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿El test es totalmente gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Puedes usar el Test visual o charlar libremente con nuestra IA sin coste alguno.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué incluye exactamente el plan Premium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Desbloquea instantáneamente el mapa Food·Mood al 100%: recetas completas con pasos de preparación, glosario de ingredientes funcionales, Fermentos del Mundo e historial emocional de 28 días.",
      },
    },
    {
      "@type": "Question",
      name: "¿Las recetas sirven para todos en casa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Totalmente. Las recetas están diseñadas con ingredientes accesibles y preparaciones que toda la familia puede disfrutar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es seguro el pago y puedo cancelar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Operamos con pasarela encriptada Stripe y puedes cancelar en 1 solo clic desde tu perfil, en cualquier momento.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el plan Premium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El plan mensual está disponible desde 5€/mes. También ofrecemos un plan trimestral con descuento.",
      },
    },
  ],
};

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <Suspense fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-aubergine-dark/10 border-t-aubergine-dark animate-spin" />
        </div>
      }>
        <PricingClient initialIsPremium={isPremium} initialIsAuthenticated={!!user} />
      </Suspense>
    </>
  );
}
