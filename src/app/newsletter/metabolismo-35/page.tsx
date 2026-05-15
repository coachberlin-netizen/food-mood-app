import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/14-metabolismo-35'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Tu metabolismo ya no tiene 25. Pero tampoco necesita dieta. | FoodÂ·Mood Newsletter NÂº 14',
  description:
    'Por quÃ© el metabolismo cambia a partir de los 35: pÃ©rdida de mÃºsculo, resistencia a la insulina y cortisol elevado. El protocolo basado en evidencia: 30 g de proteÃ­na por toma, desayuno proteico y 10 minutos caminando tras comer. Newsletter NÂº 14 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/metabolismo-35' },
  openGraph: {
    title:         'Tu metabolismo ya no tiene 25. Pero tampoco necesita dieta.',
    description:   'MÃºsculo, glucosa y cortisol: los tres cambios metabÃ³licos que ocurren a partir de los 35 y el protocolo con evidencia para revertirlos sin restricciÃ³n.',
    url:           'https://www.food-mood.app/newsletter/metabolismo-35',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-06-29',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Metabolismo y energÃ­a despuÃ©s de los 35' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tu metabolismo ya no tiene 25. Pero tampoco necesita dieta.',
    description: '30 g de proteÃ­na por toma activan mTOR. 10 minutos caminando reducen la glucosa postprandial un 30%. El desayuno proteico multiplica por 3-4 la termogÃ©nesis. Newsletter NÂº 14.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Tu metabolismo ya no tiene 25. Pero tampoco necesita dieta.',
      description:      'Los tres cambios metabÃ³licos que ocurren a partir de los 35 (mÃºsculo, glucosa, cortisol) y el protocolo basado en evidencia para gestionarlos: 30 g de proteÃ­na por toma, desayuno proteico y movimiento postprandial.',
      url:              'https://www.food-mood.app/newsletter/metabolismo-35',
      datePublished:    '2026-06-29',
      dateModified:     '2026-06-29',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/metabolismo-35' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Metabolismo despuÃ©s de los 35', item: 'https://www.food-mood.app/newsletter/metabolismo-35' },
      ],
    },
  ],
}

export default function NewsletterMetabolismo35Page() {
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

