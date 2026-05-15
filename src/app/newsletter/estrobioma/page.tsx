import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/06-estrobioma'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El estrobioma: tus bacterias gestionan el estrÃ³geno | FoodÂ·Mood Newsletter NÂº 06',
  description:
    'QuÃ© es el estrobioma, cÃ³mo la Î²-glucuronidasa regula el estrÃ³geno y quÃ© comer para equilibrarlo: lino molido, fermentados y fibra fermentable. Newsletter NÂº 06 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/estrobioma' },
  openGraph: {
    title:       'Tus bacterias intestinales gestionan el estrÃ³geno.',
    description: 'El estrobioma: el sistema que regula cuÃ¡nto estrÃ³geno circula en tu sangre. Y se alimenta en el desayuno.',
    url:         'https://www.food-mood.app/newsletter/estrobioma',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    publishedTime: '2026-05-03',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” El estrobioma' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tus bacterias intestinales gestionan el estrÃ³geno.',
    description: 'El estrobioma, la Î²-glucuronidasa y cÃ³mo el lino molido regula tus hormonas. Newsletter NÂº 06.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'Tus bacterias intestinales gestionan el estrÃ³geno',
      description:        'QuÃ© es el estrobioma, cÃ³mo la Î²-glucuronidasa regula el estrÃ³geno y quÃ© comer para equilibrarlo: lino molido, fermentados y fibra fermentable.',
      url:                'https://www.food-mood.app/newsletter/estrobioma',
      datePublished:      '2026-05-03',
      dateModified:       '2026-05-03',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/estrobioma' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'El estrobioma', item: 'https://www.food-mood.app/newsletter/estrobioma' },
      ],
    },
  ],
}

export default function NewsletterEstrobiomaPage() {
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

