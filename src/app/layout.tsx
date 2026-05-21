import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans, Source_Serif_4, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { InstallBanner } from "@/components/ui/InstallBanner";
import { ConsentModal } from "@/components/ui/ConsentModal";
import { BetaBanner } from "@/components/layout/BetaBanner";
import { PaletteProvider } from "@/contexts/PaletteContext";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const viewport: Viewport = {
  themeColor: "#6B2737",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.food-mood.app'),
  title: "Food·Mood — Acompañamiento real para la perimenopausia y la menopausia",
  description: "Para mujeres 40+ con síntomas de perimenopausia y menopausia. Un equipo de psicólogas, nutricionistas y especialistas en longevidad acompaña tu día a día con recetas funcionales, sin dietas. Empieza gratis.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
    languages: {
      'es': 'https://www.food-mood.app/',
      'x-default': 'https://www.food-mood.app/',
    },
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
    title: "Food·Mood",
    startupImage: "/icons/icon-512.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.food-mood.app/",
    title: "Food·Mood — Acompañamiento real para la perimenopausia y la menopausia",
    description: "Para mujeres 40+ que sienten que su cuerpo está cambiando. Recetas funcionales, microacciones y comprensión científica, sin dietas y sin culpa. Diseñado por un equipo de psicólogas, tecnólogas de la alimentación y especialistas en longevidad.",
    siteName: "Food·Mood",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Food·Mood — IA de nutrición emocional y eje intestino-cerebro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Food·Mood — Acompañamiento real para la perimenopausia y la menopausia",
    description: "Para mujeres 40+ que sienten que su cuerpo está cambiando. Recetas funcionales, microacciones y comprensión científica, sin dietas y sin culpa.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Food·Mood",
              url: "https://www.food-mood.app",
              description: "Acompañamiento nutricional y emocional para mujeres 40+ en perimenopausia y menopausia. Recetas funcionales, microacciones y ciencia del eje intestino-cerebro, sin dietas ni culpa.",
              applicationCategory: "HealthApplication",
              applicationSubCategory: "NutritionApplication",
              operatingSystem: "Web, iOS, Android",
              inLanguage: "es",
              offers: [
                { "@type": "Offer", name: "Plan Gratuito", price: "0", priceCurrency: "EUR" },
                { "@type": "Offer", name: "Plan Mensual", price: "9.00", priceCurrency: "EUR" },
                { "@type": "Offer", name: "Plan Trimestral", price: "21.00", priceCurrency: "EUR" },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "127",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Food·Mood",
              url: "https://www.food-mood.app",
              logo: "https://www.food-mood.app/icons/icon-512.png",
              description: "Plataforma de nutrición emocional basada en el eje intestino-cerebro.",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: "Spanish",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${sourceSerif4.variable} ${playfairDisplay.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <PaletteProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-aubergine-dark focus:text-cream focus:text-sm focus:font-semibold focus:shadow-lg"
          >
            Saltar al contenido principal
          </a>
          <AnalyticsProvider />
          <BetaBanner />
          <Header />
          <Suspense fallback={<div className="flex-1">{children}</div>}>
            <PageTransition>
              <div id="main-content" className="flex-1">
                {children}
              </div>
            </PageTransition>
          </Suspense>
          <ConsentModal />
          <InstallBanner />
          <Footer />
        </PaletteProvider>
      </body>
    </html>
  );
}
