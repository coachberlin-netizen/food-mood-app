import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/04-recupera-tu-energia'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El cansancio que no se va con dormir | Food·Mood Newsletter Nº 04',
  description:
    'Fatiga crónica, mitocondrias y nutrición: por qué el cansancio profundo no desaparece con dormir más, y qué comer para recuperar energía de verdad. Newsletter Nº 04 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
  openGraph: {
    title:       'El cansancio que no se va con dormir',
    description: 'Mitocondrias, hierro y los nutrientes que nadie te había contado sobre la fatiga real. Newsletter Nº 04 de Food·Mood.',
    url:         'https://www.food-mood.app/newsletter/recupera-tu-energia',
    type:        'article',
    siteName:    'Food·Mood',
    publishedTime: '2026-05-18',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Recupera tu energía' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El cansancio que no se va con dormir',
    description: 'Por qué dormís bien y seguís agotado, y cómo la alimentación puede cambiar eso. Newsletter Nº 04.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'El cansancio que no se va con dormir',
      description:        'Fatiga crónica, mitocondrias y nutrición: por qué el cansancio profundo no desaparece con dormir más y qué comer para recuperar energía de verdad.',
      url:                'https://www.food-mood.app/newsletter/recupera-tu-energia',
      datePublished:      '2026-05-18',
      dateModified:       '2026-05-18',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Recupera tu energía', item: 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
      ],
    },
  ],
}

export default function NewsletterRecuperaTuEnergiaPage() {
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

