import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/15-reset-mitocondrial'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3 | FoodÂ·Mood Newsletter NÂº 15',
  description:
    'Por quÃ© la fatiga crÃ³nica es un problema de bioquÃ­mica mitocondrial: CoQ10 cae un 50% entre los 20 y los 50 aÃ±os, el ATP necesita magnesio para activarse, las membranas mitocondriales necesitan DHA. Receta de reset energÃ©tico en 10 minutos. Newsletter NÂº 15 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/reset-mitocondrial' },
  openGraph: {
    title:         'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3.',
    description:   'La fatiga crÃ³nica no es un problema de actitud. Es bioquÃ­mica mitocondrial. CoQ10, magnesio y omega-3 son los tres cofactores mÃ¡s frecuentemente deficientes. Y los tres se recuperan en dÃ­as.',
    url:           'https://www.food-mood.app/newsletter/reset-mitocondrial',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-07-06',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Reset mitocondrial energÃ­a' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3.',
    description: 'CoQ10 cae un 50% entre los 20 y los 50 aÃ±os. Sin magnesio el ATP no se activa. Sin DHA las membranas mitocondriales se vuelven rÃ­gidas. Newsletter NÂº 15 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3.',
      description:      'La fatiga crÃ³nica como problema de bioquÃ­mica mitocondrial: el descenso de CoQ10 con la edad, el papel del magnesio en la activaciÃ³n del ATP y la importancia de las membranas ricas en DHA para la cadena respiratoria.',
      url:              'https://www.food-mood.app/newsletter/reset-mitocondrial',
      datePublished:    '2026-07-06',
      dateModified:     '2026-07-06',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/reset-mitocondrial' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Reset mitocondrial', item: 'https://www.food-mood.app/newsletter/reset-mitocondrial' },
      ],
    },
  ],
}

export default function NewsletterResetMitocondialPage() {
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

