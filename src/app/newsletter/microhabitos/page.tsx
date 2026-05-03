import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/05-microhabitos'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

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
    publishedTime: '2026-05-25',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Microhábitos' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El hábito que no necesita fuerza de voluntad',
    description: 'La neurociencia detrás de los microhábitos: por qué los pequeños gestos ganan donde la motivación pierde. Newsletter Nº 05.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'El hábito que no necesita fuerza de voluntad',
      description:        'Por qué los microhábitos funcionan donde la disciplina falla: neurociencia del comportamiento y cómo construir rutinas que no dependen de motivación.',
      url:                'https://www.food-mood.app/newsletter/microhabitos',
      datePublished:      '2026-05-25',
      dateModified:       '2026-05-25',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/microhabitos' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Microhábitos', item: 'https://www.food-mood.app/newsletter/microhabitos' },
      ],
    },
  ],
}

export default function NewsletterMicrohabitosPage() {
  const { styles, body } = extractNewsletterParts(buildHtml())
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div style={{ padding: '12px 24px', backgroundColor: '#EDE8DF' }}>
        <Link
          href="/newsletter/archivo"
          style={{ fontSize: 12, color: 'rgba(107,39,55,0.6)', textDecoration: 'none' }}
        >
          ← Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}
