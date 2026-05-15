import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/04-recupera-tu-energia'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El cansancio que no se va con dormir | FoodÂ·Mood Newsletter NÂº 04',
  description:
    'Fatiga crÃ³nica, mitocondrias y nutriciÃ³n: por quÃ© el cansancio profundo no desaparece con dormir mÃ¡s, y quÃ© comer para recuperar energÃ­a de verdad. Newsletter NÂº 04 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
  openGraph: {
    title:       'El cansancio que no se va con dormir',
    description: 'Mitocondrias, hierro y los nutrientes que nadie te habÃ­a contado sobre la fatiga real. Newsletter NÂº 04 de FoodÂ·Mood.',
    url:         'https://www.food-mood.app/newsletter/recupera-tu-energia',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    publishedTime: '2026-05-18',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Recupera tu energÃ­a' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El cansancio que no se va con dormir',
    description: 'Por quÃ© dormÃ­s bien y seguÃ­s agotado, y cÃ³mo la alimentaciÃ³n puede cambiar eso. Newsletter NÂº 04.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'El cansancio que no se va con dormir',
      description:        'Fatiga crÃ³nica, mitocondrias y nutriciÃ³n: por quÃ© el cansancio profundo no desaparece con dormir mÃ¡s y quÃ© comer para recuperar energÃ­a de verdad.',
      url:                'https://www.food-mood.app/newsletter/recupera-tu-energia',
      datePublished:      '2026-05-18',
      dateModified:       '2026-05-18',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Recupera tu energÃ­a', item: 'https://www.food-mood.app/newsletter/recupera-tu-energia' },
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

