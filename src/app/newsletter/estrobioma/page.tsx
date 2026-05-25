import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/06-estrobioma'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El estrobioma: tus bacterias gestionan el estrógeno | Food·Mood Newsletter Nº 06',
  description:
    'Qué es el estrobioma, cómo la β-glucuronidasa regula el estrógeno y qué comer para equilibrarlo: lino molido, fermentados y fibra fermentable. Newsletter Nº 06 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/estrobioma' },
  openGraph: {
    title:       'Tus bacterias intestinales gestionan el estrógeno.',
    description: 'El estrobioma: el sistema que regula cuánto estrógeno circula en tu sangre. Y se alimenta en el desayuno.',
    url:         'https://www.food-mood.app/newsletter/estrobioma',
    type:        'article',
    siteName:    'Food·Mood',
    publishedTime: '2026-05-03',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — El estrobioma' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tus bacterias intestinales gestionan el estrógeno.',
    description: 'El estrobioma, la β-glucuronidasa y cómo el lino molido regula tus hormonas. Newsletter Nº 06.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'Tus bacterias intestinales gestionan el estrógeno',
      description:        'Qué es el estrobioma, cómo la β-glucuronidasa regula el estrógeno y qué comer para equilibrarlo: lino molido, fermentados y fibra fermentable.',
      url:                'https://www.food-mood.app/newsletter/estrobioma',
      datePublished:      '2026-05-03',
      dateModified:       '2026-05-03',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/estrobioma' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
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
          ← Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

