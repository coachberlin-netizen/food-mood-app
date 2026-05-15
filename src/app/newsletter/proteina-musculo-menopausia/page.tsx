import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/08-proteina-musculo'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'La menopausia se come el mÃºsculo. La proteÃ­na lo frena | FoodÂ·Mood Newsletter NÂº 08',
  description:
    'Sarcopenia, resistencia anabÃ³lica y protocolo de proteÃ­na para mujeres 45+: por quÃ© necesitas 1,4â€“1,8 g/kg/dÃ­a, el umbral de leucina y por quÃ© el desayuno es la toma mÃ¡s importante. Newsletter NÂº 08 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/proteina-musculo-menopausia' },
  openGraph: {
    title:       'La menopausia se come el mÃºsculo. La proteÃ­na lo frena.',
    description: 'Resistencia anabÃ³lica, umbral de leucina y por quÃ© el desayuno proteico es la toma mÃ¡s importante despuÃ©s de los 45.',
    url:         'https://www.food-mood.app/newsletter/proteina-musculo-menopausia',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    publishedTime: '2026-05-18',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” ProteÃ­na y mÃºsculo en la menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'La menopausia se come el mÃºsculo. La proteÃ­na lo frena.',
    description: 'Sarcopenia, leucina y el protocolo de proteÃ­na para mujeres 45+. Newsletter NÂº 08 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'La menopausia se come el mÃºsculo. La proteÃ­na lo frena.',
      description:      'Sarcopenia, resistencia anabÃ³lica y protocolo de proteÃ­na para mujeres 45+: umbral de leucina, distribuciÃ³n de tomas y por quÃ© el desayuno proteico es clave.',
      url:              'https://www.food-mood.app/newsletter/proteina-musculo-menopausia',
      datePublished:    '2026-05-18',
      dateModified:     '2026-05-18',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/proteina-musculo-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'ProteÃ­na y mÃºsculo en la menopausia', item: 'https://www.food-mood.app/newsletter/proteina-musculo-menopausia' },
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

