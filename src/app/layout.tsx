import type { Metadata, Viewport } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { InstallBanner } from "@/components/ui/InstallBanner";
import { ServiceWorkerRegistration } from "@/components/ui/ServiceWorkerRegistration";
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
  title: "Food Mood — Tu intestino tiene algo que decirte",
  description: "Descubre tu estado Food Mood y qué comer para sentirte mejor. Ciencia del eje intestino-cerebro, sin dietas, solo placer.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Food·Mood",
  },
  openGraph: {
    title: "Food Mood — Tu intestino tiene algo que decirte",
    description: "Ciencia del eje intestino-cerebro, sin dietas, solo placer.",
    url: "https://food-mood.app",
    siteName: "Food Mood",
    images: [
      {
        url: "https://food-mood.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Food Mood Cover",
      },
    ],
    locale: "es_ES",
    type: "website",
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
        <link rel="apple-touch-startup-image" href="/icons/icon-512.png" />
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
        <Footer />
      </body>
    </html>
  );
}
