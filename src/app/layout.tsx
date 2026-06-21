import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans, Source_Serif_4, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { InstallBanner } from "@/components/ui/InstallBanner";
import { ConsentModal } from "@/components/ui/ConsentModal";
import { PaletteProvider } from "@/contexts/PaletteContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AccessibilityWidget } from "@/components/ui/AccessibilityWidget";
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
  // No maximumScale — blocking pinch-to-zoom violates WCAG 1.4.4 (Resize Text)
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.food-mood.app'),
  title: "Food·Mood Lab — Comida, emoción y longevidad aplicada",
  description: "Espacio editorial de The Longevity Studio sobre nutrición, psicología, estrés, hábitos y longevidad. Contenido basado en evidencia para profesionales, hoteles y clínicas.",
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
    title: "Food·Mood Lab",
    startupImage: "/icons/icon-512.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.food-mood.app/",
    title: "Food·Mood Lab — Comida, emoción y longevidad aplicada",
    description: "Espacio editorial de The Longevity Studio sobre nutrición, psicología, estrés, hábitos y longevidad. Evidencia aplicable para profesionales, hoteles y clínicas.",
    siteName: "Food·Mood Lab",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Food·Mood Lab — Espacio editorial de The Longevity Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Food·Mood Lab — Comida, emoción y longevidad aplicada",
    description: "Espacio editorial de The Longevity Studio sobre nutrición, psicología, estrés, hábitos y longevidad.",
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
        <link rel="alternate" type="application/rss+xml" title="Blog · Food·Mood Pro" href="https://www.food-mood.app/rss.xml" />
        {/* Anti-FOUC: restore accessibility preferences before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=document.documentElement;var t=localStorage.getItem('fm-theme');var f=localStorage.getItem('fm-font-size');var c=localStorage.getItem('fm-contrast');if(t==='dark')h.setAttribute('data-theme','dark');if(f==='large')h.setAttribute('data-font-size','large');if(c==='high')h.setAttribute('data-contrast','high');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Food·Mood Lab",
              url: "https://www.food-mood.app",
              description: "Espacio editorial de The Longevity Studio sobre nutrición, psicología, estrés, hábitos y longevidad. Contenido basado en evidencia para profesionales de salud, hoteles y clínicas.",
              inLanguage: "es",
              publisher: {
                "@type": "Organization",
                name: "The Longevity Studio",
                url: "https://www.food-mood.app",
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
              name: "Food·Mood Lab / The Longevity Studio",
              url: "https://www.food-mood.app",
              logo: "https://www.food-mood.app/icons/icon-512.png",
              description: "Espacio editorial y consultoría de longevidad aplicada. Nutrición, psicología, estrés, hábitos y longevidad para profesionales de salud, hoteles y clínicas.",
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
        <ToastProvider>
        <PaletteProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-aubergine-dark focus:text-cream focus:text-sm focus:font-semibold focus:shadow-lg"
          >
            Saltar al contenido principal
          </a>
          <AnalyticsProvider />
          <Header />
          <Suspense fallback={<div className="flex-1">{children}</div>}>
            <PageTransition>
              <div id="main-content" className="flex-1">
                {children}
              </div>
            </PageTransition>
          </Suspense>
          <ConsentModal />
          <AccessibilityWidget />
          <InstallBanner />
          {/* pb-16 on mobile prevents footer content from hiding behind BottomNav */}
          <div className="pb-16 md:pb-0">
            <Footer />
          </div>
          <BottomNav />
        </PaletteProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
