import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/19-sabor-amargo-nervio-vago'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Por quÃ© el cafÃ© amargo te calma. La ciencia del nervio vago y el sabor amargo. | FoodÂ·Mood Newsletter NÂº 19',
  description:
    'Receptores TAS2R, nervio vago y regulaciÃ³n emocional: la ciencia detrÃ¡s de por quÃ© el amargor activa el sistema nervioso parasimpÃ¡tico y reduce el cortisol. Newsletter NÂº 19 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago' },
  openGraph: {
    title:         'Por quÃ© el cafÃ© amargo te calma. La ciencia del nervio vago y el sabor amargo.',
    description:   'Receptores TAS2R, nervio vago y teorÃ­a constructivista de las emociones: cÃ³mo el amargor activa el parasimpÃ¡tico y mejora la regulaciÃ³n emocional.',
    url:           'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-05-25',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Sabor amargo y nervio vago' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Por quÃ© el cafÃ© amargo te calma. La ciencia del nervio vago y el sabor amargo.',
    description: 'TAS2R, nervio vago y regulaciÃ³n emocional: la ciencia detrÃ¡s del cafÃ©, la rÃºcula y el vinagre de kombucha. Newsletter NÂº 19 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Por quÃ© el cafÃ© amargo te calma. La ciencia del nervio vago y el sabor amargo.',
      description:      'Receptores TAS2R, nervio vago y la teorÃ­a constructivista de las emociones: por quÃ© el amargor activa el sistema nervioso parasimpÃ¡tico, reduce el cortisol y mejora la regulaciÃ³n emocional.',
      url:              'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago',
      datePublished:    '2026-05-25',
      dateModified:     '2026-05-25',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/sabor-amargo-nervio-vago' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

