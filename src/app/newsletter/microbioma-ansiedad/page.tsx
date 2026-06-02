import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/24-microbioma-ansiedad'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Tu ansiedad tiene 38 billones de cómplices | Food·Mood Newsletter Nº 24',
  description:
    'Cómo el microbioma intestinal regula el eje intestino-cerebro, el cortisol y la ansiedad. Qué comer para cuidar a tus bacterias y cómo afecta a tu estado de ánimo. Newsletter Nº 24 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/microbioma-ansiedad' },
  openGraph: {
    title:       'Tu ansiedad tiene 38 billones de cómplices. Se llaman bacterias intestinales.',
    description: 'El microbioma regula el eje intestino-cerebro, el cortisol y la ansiedad. Newsletter Nº 24 de Food·Mood.',
    url:         'https://www.food-mood.app/newsletter/microbioma-ansiedad',
    type:        'article',
    siteName:    'Food·Mood',
    publishedTime: '2026-05-24',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Microbioma y ansiedad' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tu ansiedad tiene 38 billones de cómplices. Se llaman bacterias intestinales.',
    description: 'El microbioma, el eje intestino-cerebro y la ansiedad. Newsletter Nº 24.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Tu ansiedad tiene 38 billones de cómplices. Se llaman bacterias intestinales.',
      description:      'Cómo el microbioma intestinal regula el eje intestino-cerebro, el cortisol y la ansiedad. Qué comer para cuidar a tus bacterias.',
      url:              'https://www.food-mood.app/newsletter/microbioma-ansiedad',
      datePublished:    '2026-05-24',
      dateModified:     '2026-05-24',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/microbioma-ansiedad' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',    item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter',   item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Microbioma y ansiedad', item: 'https://www.food-mood.app/newsletter/microbioma-ansiedad' },
      ],
    },
  ],
}

export default function NewsletterMicrobiomaAnsiedadPage() {
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
