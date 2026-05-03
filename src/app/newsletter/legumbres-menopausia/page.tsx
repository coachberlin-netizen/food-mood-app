import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/07-legumbres-menopausia'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Las legumbres y la menopausia: seis mecanismos hormonales en una ración | Food·Mood Newsletter Nº 07',
  description:
    'Por qué las legumbres son el alimento hormonal más completo después de los 45: proteína, fibra para el estrobioma, fitoestrógenos ER-β, hierro, zinc y folato. Dal de lentejas incluido. Newsletter Nº 07 de Food·Mood.',
  keywords: 'legumbres menopausia, fitoestrógenos isoflavonas, estrobioma fibra, proteína vegetal menopausia, lentejas hormonas, legumbres perimenopausia, dal lentejas receta',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/legumbres-menopausia' },
  openGraph: {
    title:       'Las legumbres y la menopausia: el alimento más completo que existe.',
    description: 'Un solo alimento. Seis mecanismos hormonales activos. La intervención dietética de mayor impacto por ración en la menopausia.',
    url:         'https://www.food-mood.app/newsletter/legumbres-menopausia',
    type:        'article',
    siteName:    'Food·Mood',
    publishedTime: '2026-05-11',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Las legumbres y la menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Las legumbres y la menopausia: el alimento más completo que existe.',
    description: 'Proteína, fibra, fitoestrógenos, hierro, zinc y folato en una sola ración. Newsletter Nº 07 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Las legumbres y la menopausia: el alimento más completo que existe',
      description:      'Por qué las legumbres son el alimento hormonal más completo después de los 45: proteína, fibra para el estrobioma, fitoestrógenos ER-β, hierro, zinc y folato.',
      url:              'https://www.food-mood.app/newsletter/legumbres-menopausia',
      datePublished:    '2026-05-11',
      dateModified:     '2026-05-11',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/legumbres-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Las legumbres y la menopausia', item: 'https://www.food-mood.app/newsletter/legumbres-menopausia' },
      ],
    },
  ],
}

export default function NewsletterLegumbresMenopausiaPage() {
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
