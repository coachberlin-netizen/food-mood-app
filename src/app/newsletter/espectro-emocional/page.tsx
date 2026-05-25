import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/18-espectro-emocional'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'No sientes una emoción. Sientes varias a la vez. Y eso tiene una explicación. | Food·Mood Newsletter Nº 18',
  description:
    'El espectro emocional y el eje intestino-cerebro: por qué las emociones se solapan, qué papel juega la interocepción y cómo la alimentación amplía el rango emocional. Newsletter Nº 18 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/espectro-emocional' },
  openGraph: {
    title:         'No sientes una emoción. Sientes varias a la vez. Y eso tiene una explicación.',
    description:   'La granularidad emocional, la interocepción y el eje intestino-cerebro: cómo la alimentación amplía el rango de lo que puedes sentir — y nombrar.',
    url:           'https://www.food-mood.app/newsletter/espectro-emocional',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-05-18',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Espectro emocional' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'No sientes una emoción. Sientes varias a la vez. Y eso tiene una explicación.',
    description: 'Granularidad emocional, interocepción y gut-brain axis. La ciencia detrás de sentir varias cosas a la vez — y por qué el kéfir importa más de lo que crees. Newsletter Nº 18.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'No sientes una emoción. Sientes varias a la vez. Y eso tiene una explicación.',
      description:      'El espectro emocional, la interocepción y el eje intestino-cerebro: cómo la alimentación amplía el rango emocional y la granularidad con la que procesas lo que sientes.',
      url:              'https://www.food-mood.app/newsletter/espectro-emocional',
      datePublished:    '2026-05-18',
      dateModified:     '2026-05-18',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/espectro-emocional' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Espectro emocional', item: 'https://www.food-mood.app/newsletter/espectro-emocional' },
      ],
    },
  ],
}

export default function NewsletterEspectroEmocionalPage() {
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

