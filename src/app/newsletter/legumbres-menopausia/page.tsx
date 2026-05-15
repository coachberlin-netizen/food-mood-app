import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/07-legumbres-menopausia'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Las legumbres y la menopausia: seis mecanismos hormonales en una raciÃ³n | FoodÂ·Mood Newsletter NÂº 07',
  description:
    'Por quÃ© las legumbres son el alimento hormonal mÃ¡s completo despuÃ©s de los 45: proteÃ­na, fibra para el estrobioma, fitoestrÃ³genos ER-Î², hierro, zinc y folato. Dal de lentejas incluido. Newsletter NÂº 07 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/legumbres-menopausia' },
  openGraph: {
    title:       'Las legumbres y la menopausia: el alimento mÃ¡s completo que existe.',
    description: 'Un solo alimento. Seis mecanismos hormonales activos. La intervenciÃ³n dietÃ©tica de mayor impacto por raciÃ³n en la menopausia.',
    url:         'https://www.food-mood.app/newsletter/legumbres-menopausia',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    publishedTime: '2026-05-11',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Las legumbres y la menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Las legumbres y la menopausia: el alimento mÃ¡s completo que existe.',
    description: 'ProteÃ­na, fibra, fitoestrÃ³genos, hierro, zinc y folato en una sola raciÃ³n. Newsletter NÂº 07 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Las legumbres y la menopausia: el alimento mÃ¡s completo que existe',
      description:      'Por quÃ© las legumbres son el alimento hormonal mÃ¡s completo despuÃ©s de los 45: proteÃ­na, fibra para el estrobioma, fitoestrÃ³genos ER-Î², hierro, zinc y folato.',
      url:              'https://www.food-mood.app/newsletter/legumbres-menopausia',
      datePublished:    '2026-05-11',
      dateModified:     '2026-05-11',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/legumbres-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

