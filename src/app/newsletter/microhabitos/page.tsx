import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'El hábito que no necesita fuerza de voluntad | Food·Mood Newsletter Nº 05',
  description:
    'Por qué los microhábitos funcionan donde la disciplina falla: neurociencia del comportamiento, automatización y cómo construir rutinas que no dependen de motivación. Newsletter Nº 05 de Food·Mood.',
  keywords: 'microhábitos alimentación, hábitos automáticos cerebro, comportamiento alimentario, rutinas sin fuerza de voluntad, neurociencia hábitos, habit stacking alimentación',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/microhabitos' },
  openGraph: {
    title:       'El hábito que no necesita fuerza de voluntad',
    description: 'Microhábitos, neurociencia del comportamiento y cómo construir rutinas que se sostienen solas. Newsletter Nº 05 de Food·Mood.',
    url:         'https://www.food-mood.app/newsletter/microhabitos',
    type:        'article',
    siteName:    'Food·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Microhábitos' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El hábito que no necesita fuerza de voluntad',
    description: 'La neurociencia detrás de los microhábitos: por qué los pequeños gestos ganan donde la motivación pierde. Newsletter Nº 05.',
    images:      ['/og-image.png'],
  },
}

export default function NewsletterMicrohabitosPage() {
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
          src="/api/newsletter/preview/microhabitos"
          title="Newsletter Nº 05 — El hábito que no necesita fuerza de voluntad"
          className="w-full border-0"
          style={{ minHeight: '100vh', display: 'block' }}
          loading="lazy"
        />
      </div>
    </>
  )
}
