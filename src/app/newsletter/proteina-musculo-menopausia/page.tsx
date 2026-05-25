import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/08-proteina-musculo'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'La menopausia se come el músculo. La proteína lo frena | Food·Mood Newsletter Nº 08',
  description:
    'Sarcopenia, resistencia anabólica y protocolo de proteína para mujeres 45+: por qué necesitas 1,4–1,8 g/kg/día, el umbral de leucina y por qué el desayuno es la toma más importante. Newsletter Nº 08 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/proteina-musculo-menopausia' },
  openGraph: {
    title:       'La menopausia se come el músculo. La proteína lo frena.',
    description: 'Resistencia anabólica, umbral de leucina y por qué el desayuno proteico es la toma más importante después de los 45.',
    url:         'https://www.food-mood.app/newsletter/proteina-musculo-menopausia',
    type:        'article',
    siteName:    'Food·Mood',
    publishedTime: '2026-05-18',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Proteína y músculo en la menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'La menopausia se come el músculo. La proteína lo frena.',
    description: 'Sarcopenia, leucina y el protocolo de proteína para mujeres 45+. Newsletter Nº 08 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'La menopausia se come el músculo. La proteína lo frena.',
      description:      'Sarcopenia, resistencia anabólica y protocolo de proteína para mujeres 45+: umbral de leucina, distribución de tomas y por qué el desayuno proteico es clave.',
      url:              'https://www.food-mood.app/newsletter/proteina-musculo-menopausia',
      datePublished:    '2026-05-18',
      dateModified:     '2026-05-18',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/proteina-musculo-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Proteína y músculo en la menopausia', item: 'https://www.food-mood.app/newsletter/proteina-musculo-menopausia' },
      ],
    },
  ],
}

export default function NewsletterProteinaMuscPage() {
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

