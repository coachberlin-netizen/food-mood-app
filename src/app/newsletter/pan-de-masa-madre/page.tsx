import Link from 'next/link'
import type { Metadata } from 'next'
import { buildHtml } from '@/lib/editorial-newsletters/02-pan-de-masa-madre'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Qué es el pan de masa madre (y por qué huele así de bien) | Food·Mood Newsletter Nº 02',
  description:
    'La historia más corta y más apetecible sobre el pan de masa madre: qué es, por qué fermenta, y cómo afecta a tu cuerpo y tu humor. Newsletter Nº 02 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
  openGraph: {
    title:       'Hay pan. Y luego hay PAN.',
    description: 'Todo lo que siempre quisiste saber sobre la masa madre – explicado sin aburrirte.',
    url:         'https://www.food-mood.app/newsletter/pan-de-masa-madre',
    type:        'article',
    siteName:    'Food·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood – Pan de Masa Madre' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Hay pan. Y luego hay PAN.',
    description: 'Por qué el pan de masa madre huele así, digiere mejor y baja el índice glucémico. Newsletter Nº 02.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'Qué es el pan de masa madre (y por qué huele así de bien)',
      description:        'La historia más corta y más apetecible sobre el pan de masa madre: qué es, por qué fermenta, y cómo afecta a tu cuerpo y tu humor.',
      url:                'https://www.food-mood.app/newsletter/pan-de-masa-madre',
      datePublished:      '2026-05-04',
      dateModified:       '2026-05-04',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Pan de masa madre', item: 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
      ],
    },
  ],
}

export default function PanDeMasaMadreNewsletter() {
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
