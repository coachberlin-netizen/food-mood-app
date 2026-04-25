import { Metadata } from "next";
import PricingClient from "./PricingClient";
import { createClient } from "@/lib/supabase/server";
import { getPremiumStatus } from "@/lib/premium";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Precios — Club Premium Food·Mood | Desde 7€/mes",
  description:
    "Accede a 200+ recetas funcionales, canal privado de Telegram, comunidad WhatsApp y seguimiento personalizado. Sin compromiso — cancela cuando quieras.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Precios — Club Premium Food·Mood",
    description:
      "Accede a 200+ recetas funcionales, Telegram privado, WhatsApp y seguimiento emocional desde 7€/mes.",
    url: "https://www.food-mood.app/pricing",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Food·Mood Premium" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precios — Club Premium Food·Mood",
    description: "200+ recetas funcionales + canal Telegram privado + WhatsApp desde 7€/mes.",
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
        text: "El plan mensual cuesta 9€/mes. El plan trimestral cuesta 21€ cada 3 meses (equivale a 7€/mes). Ambos incluyen acceso completo a todas las funcionalidades premium.",
      },
    },
  ],
};

const PRICING_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Planes Food·Mood",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "Food·Mood Gratuito",
        description: "Test emocional + paleta básica, sin coste.",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "Food·Mood Premium Mensual",
        description: "200+ recetas funcionales, paleta emocional personalizada, historial de 90 días, canal privado de Telegram.",
        offers: {
          "@type": "Offer",
          price: "9.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "9.00",
            priceCurrency: "EUR",
            unitCode: "MON",
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Product",
        name: "Food·Mood Premium Trimestral",
        description: "Todo el plan mensual + ahorro del 22%. 21€ cada 3 meses (equivale a 7€/mes).",
        offers: {
          "@type": "Offer",
          price: "21.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "21.00",
            priceCurrency: "EUR",
            unitCode: "MON",
          },
        },
      },
    },
  ],
};

export default async function PricingPage() {
  let isPremium = false;
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAuthenticated = !!user;
    isPremium = user ? await getPremiumStatus(supabase, user.id) : false;
  } catch {
    // Fallback: render as unauthenticated
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_SCHEMA) }}
      />

      {/* Server-rendered pricing summary — visible to crawlers and screen readers */}
      <div className="sr-only">
        <h1>Precios — Club Premium Food·Mood</h1>
        <p>Empieza gratis. Profundiza cuando quieras. Sin letra pequeña.</p>
        <section>
          <h2>Plan Gratuito — 0€</h2>
          <p>Test emocional completo. Paleta emocional básica. 1 receta de muestra al día.</p>
        </section>
        <section>
          <h2>Plan Premium Mensual — 9€/mes</h2>
          <p>200+ recetas completas, paleta emocional personalizada, historial de 90 días, glosario científico, canal privado de Telegram. Sin compromiso, cancela cuando quieras.</p>
        </section>
        <section>
          <h2>Plan Premium Trimestral — 21€ cada 3 meses (7€/mes)</h2>
          <p>Todo lo del plan mensual más Fermentos del Mundo y descuento del 22%. Cancela cuando quieras.</p>
        </section>
      </div>

      <PricingClient initialIsPremium={isPremium} initialIsAuthenticated={isAuthenticated} />
    </>
  );
}
