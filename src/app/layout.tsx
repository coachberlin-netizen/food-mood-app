import type { Metadata, Viewport } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { InstallBanner } from "@/components/ui/InstallBanner";
import { ServiceWorkerRegistration } from "@/components/ui/ServiceWorkerRegistration";
// import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
});

export const viewport: Viewport = {
  themeColor: "#1a2332",
};

export const metadata: Metadata = {
  title: "Food·Mood — Descubre qué comer según cómo te sientes | Test gratis",
  description: "Test de neurociencia nutricional en 2 minutos. Recetas diseñadas para tu estado emocional: energía, calma, foco y bienestar. Sin dietas. Sin restricciones.",
  keywords: "recetas según estado de ánimo, neurociencia nutricional, psicobióticos, microbiota intestinal, alimentación emocional, recetas funcionales, eje intestino cerebro, bienestar emocional, longevidad alimentación",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.food-mood.app/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Food·Mood",
  },
  openGraph: {
    type: "website",
    url: "https://www.food-mood.app/",
    title: "Food·Mood — Come según cómo te sientes",
    description: "Test de neurociencia nutricional en 2 minutos. Recetas funcionales para tu estado emocional.",
    siteName: "Food·Mood",
    locale: "es_ES",
    images: [
      {
        url: "https://www.food-mood.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Food·Mood — Neurociencia nutricional para tu estado emocional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Food·Mood — Come según cómo te sientes",
    description: "Test de neurociencia nutricional en 2 minutos. Recetas funcionales para tu estado emocional.",
    images: ["https://www.food-mood.app/og-image.jpg"],
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
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
              "@type": "WebApplication",
              name: "Food\u00b7Mood",
              url: "https://www.food-mood.app",
              description: "Aplicaci\u00f3n de neurociencia nutricional que personaliza recetas seg\u00fan el estado emocional del usuario.",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              inLanguage: "es",
              offers: [
                { "@type": "Offer", name: "Plan Gratuito", price: "0", priceCurrency: "EUR" },
                { "@type": "Offer", name: "Plan Mensual", price: "9.00", priceCurrency: "EUR" },
                { "@type": "Offer", name: "Plan Trimestral", price: "15.00", priceCurrency: "EUR" },
              ],
              audience: {
                "@type": "Audience",
                geographicArea: { "@type": "AdministrativeArea", name: "Hispanohablante" },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${sourceSerif4.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <AnalyticsProvider />
        <ServiceWorkerRegistration />
        <Header />
        <PageTransition>
          <div className="flex-1">
            {children}
          </div>
        </PageTransition>
        <InstallBanner />
        {/* <ChatWidget /> */}
        <Footer />
      </body>
    </html>
  );
}
