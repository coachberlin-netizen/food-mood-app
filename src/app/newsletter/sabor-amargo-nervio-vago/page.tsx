import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/19-sabor-amargo-nervio-vago'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Por qué el café amargo te calma. La ciencia del nervio vago y el sabor amargo. | Food·Mood Newsletter Nº 19',
  description:
    'Receptores TAS2R, nervio vago y regulación emocional: la ciencia detrás de por qué el amargor activa el sistema nervioso parasimpático y reduce el cortisol. Newsletter Nº 19 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago' },
  openGraph: {
    title:         'Por qué el café amargo te calma. La ciencia del nervio vago y el sabor amargo.',
    description:   'Receptores TAS2R, nervio vago y teoría constructivista de las emociones: cómo el amargor activa el parasimpático y mejora la regulación emocional.',
    url:           'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-05-25',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Sabor amargo y nervio vago' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Por qué el café amargo te calma. La ciencia del nervio vago y el sabor amargo.',
    description: 'TAS2R, nervio vago y regulación emocional: la ciencia detrás del café, la rúcula y el vinagre de kombucha. Newsletter Nº 19 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Por qué el café amargo te calma. La ciencia del nervio vago y el sabor amargo.',
      description:      'Receptores TAS2R, nervio vago y la teoría constructivista de las emociones: por qué el amargor activa el sistema nervioso parasimpático, reduce el cortisol y mejora la regulación emocional.',
      url:              'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago',
      datePublished:    '2026-05-25',
      dateModified:     '2026-05-25',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Sabor amargo y nervio vago', item: 'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago' },
      ],
    },
  ],
}

export default function NewsletterSaborAmargoNervioVagoPage() {
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

