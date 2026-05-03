import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'El estrobioma: tus bacterias gestionan el estrógeno | Food·Mood Newsletter Nº 06',
  description:
    'Qué es el estrobioma, cómo la β-glucuronidasa regula el estrógeno y qué comer para equilibrarlo: lino molido, fermentados y fibra fermentable. Newsletter Nº 06 de Food·Mood.',
  keywords: 'estrobioma, β-glucuronidasa, estrógeno microbioma, perimenopausia alimentación, lino molido lignanos, fermentados hormonas, equilibrio hormonal dieta',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/estrobioma' },
  openGraph: {
    title:       'Tus bacterias intestinales gestionan el estrógeno.',
    description: 'El estrobioma: el sistema que regula cuánto estrógeno circula en tu sangre. Y se alimenta en el desayuno.',
    url:         'https://www.food-mood.app/newsletter/estrobioma',
    type:        'article',
    siteName:    'Food·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — El estrobioma' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tus bacterias intestinales gestionan el estrógeno.',
    description: 'El estrobioma, la β-glucuronidasa y cómo el lino molido regula tus hormonas. Newsletter Nº 06.',
    images:      ['/og-image.png'],
  },
}

export default function NewsletterEstrobiomaPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EDE8DF' }}>
      {/* Back nav */}
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-2">
        <Link
          href="/newsletter/archivo"
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: 'rgba(107,39,55,0.6)' }}
        >
          ← Archivo de newsletters
        </Link>
      </div>

      {/* iframe newsletter */}
      <iframe
        src="/api/newsletter/preview/estrobioma"
        title="Newsletter Nº 06 — Tus bacterias gestionan el estrógeno"
        className="w-full border-0"
        style={{ minHeight: '100vh', display: 'block' }}
        loading="lazy"
      />
    </div>
  )
}
