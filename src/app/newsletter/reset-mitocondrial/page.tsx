import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/15-reset-mitocondrial'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3 | Food·Mood Newsletter Nº 15',
  description:
    'Por qué la fatiga crónica es un problema de bioquímica mitocondrial: CoQ10 cae un 50% entre los 20 y los 50 años, el ATP necesita magnesio para activarse, las membranas mitocondriales necesitan DHA. Receta de reset energético en 10 minutos. Newsletter Nº 15 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/reset-mitocondrial' },
  openGraph: {
    title:         'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3.',
    description:   'La fatiga crónica no es un problema de actitud. Es bioquímica mitocondrial. CoQ10, magnesio y omega-3 son los tres cofactores más frecuentemente deficientes. Y los tres se recuperan en días.',
    url:           'https://www.food-mood.app/newsletter/reset-mitocondrial',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-07-06',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Reset mitocondrial energía' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3.',
    description: 'CoQ10 cae un 50% entre los 20 y los 50 años. Sin magnesio el ATP no se activa. Sin DHA las membranas mitocondriales se vuelven rígidas. Newsletter Nº 15 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3.',
      description:      'La fatiga crónica como problema de bioquímica mitocondrial: el descenso de CoQ10 con la edad, el papel del magnesio en la activación del ATP y la importancia de las membranas ricas en DHA para la cadena respiratoria.',
      url:              'https://www.food-mood.app/newsletter/reset-mitocondrial',
      datePublished:    '2026-07-06',
      dateModified:     '2026-07-06',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/reset-mitocondrial' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
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
          ← Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

