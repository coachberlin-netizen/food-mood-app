import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'El cansancio que no se va con dormir | Food·Mood Newsletter Nº 04',
  description:
    'Fatiga crónica, mitocondrias y nutrición: por qué el cansancio profundo no desaparece con dormir más, y qué comer para recuperar energía de verdad. Newsletter Nº 04 de Food·Mood.',
  keywords: 'fatiga crónica alimentación, mitocondrias nutrición, energía cansancio crónico, coenzima Q10 alimentos, hierro fatiga, tiroides cansancio, nutrición energía',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
  openGraph: {
    title:       'El cansancio que no se va con dormir',
    description: 'Mitocondrias, hierro y los nutrientes que nadie te había contado sobre la fatiga real. Newsletter Nº 04 de Food·Mood.',
    url:         'https://www.food-mood.app/newsletter/recupera-tu-energia',
    type:        'article',
    siteName:    'Food·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Recupera tu energía' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El cansancio que no se va con dormir',
    description: 'Por qué dormís bien y seguís agotado, y cómo la alimentación puede cambiar eso. Newsletter Nº 04.',
    images:      ['/og-image.png'],
  },
}

export default function NewsletterRecuperaTuEnergiaPage() {
  return (
    <>
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
          src="/api/newsletter/preview/recupera-tu-energia"
          title="Newsletter Nº 04 — El cansancio que no se va con dormir"
          className="w-full border-0"
          style={{ minHeight: '100vh', display: 'block' }}
          loading="lazy"
        />
      </div>
    </>
  )
}
