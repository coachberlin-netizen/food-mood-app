import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/12-mosaico-emocional'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Tu semana tiene un color. El mosaico emocional que revela patrones que la introspecciÃ³n no puede ver | FoodÂ·Mood Newsletter NÂº 12',
  description:
    'QuÃ© es el Ecological Momentary Assessment, por quÃ© el recuerdo distorsiona las emociones (efecto peak-end), quÃ© revela el mosaico cromÃ¡tico semanal y cÃ³mo un desayuno anti-agitaciÃ³n puede cortar el ciclo antes de las 9:00. Newsletter NÂº 12 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/mosaico-emocional' },
  openGraph: {
    title:         'Tu semana tiene un color. Â¿Sabes cuÃ¡l es?',
    description:   'El mosaico emocional cromÃ¡tico, la ciencia del EMA, el efecto peak-end y por quÃ© ver tus patrones emocionales en color revela lo que la introspecciÃ³n no puede.',
    url:           'https://www.food-mood.app/newsletter/mosaico-emocional',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-06-15',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Mosaico emocional' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tu semana tiene un color. Â¿Sabes cuÃ¡l es?',
    description: 'EMA, efecto peak-end y el mosaico emocional que revela los patrones que tu memoria edita. Newsletter NÂº 12 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Tu semana tiene un color. El mosaico emocional que revela patrones que la introspecciÃ³n no puede ver.',
      description:      'Ecological Momentary Assessment, sesgo peak-end, conocimiento metacognitivo y cÃ³mo el registro cromÃ¡tico de emociones revela la conexiÃ³n bidireccional entre humor y alimentaciÃ³n.',
      url:              'https://www.food-mood.app/newsletter/mosaico-emocional',
      datePublished:    '2026-06-15',
      dateModified:     '2026-06-15',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/mosaico-emocional' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Mosaico emocional', item: 'https://www.food-mood.app/newsletter/mosaico-emocional' },
      ],
    },
  ],
}

export default function NewsletterMosaicoEmocionalPage() {
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

