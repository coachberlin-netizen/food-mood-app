import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/16-habitos-con-placer'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Los hÃ¡bitos duraderos no se crean con disciplina. Se crean con placer. | FoodÂ·Mood Newsletter NÂº 16',
  description:
    'La neurociencia del hÃ¡bito: por quÃ© la dopamina y el placer crean rutinas automÃ¡ticas donde la fuerza de voluntad fracasa. Tirosina, circuito de recompensa y el bol que crea el hÃ¡bito del desayuno. Newsletter NÂº 16 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/habitos-con-placer' },
  openGraph: {
    title:         'Los hÃ¡bitos duraderos no se crean con disciplina. Se crean con placer.',
    description:   'Dopamina, ganglios basales y el circuito de recompensa: la neurociencia que explica por quÃ© el placer crea hÃ¡bitos donde la fuerza de voluntad falla siempre.',
    url:           'https://www.food-mood.app/newsletter/habitos-con-placer',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-05-11',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” HÃ¡bitos con placer, neurociencia del hÃ¡bito' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Los hÃ¡bitos duraderos no se crean con disciplina. Se crean con placer.',
    description: 'La dopamina refuerza el circuito que llevÃ³ al placer. Sin dopamina, sin hÃ¡bito. La tirosina del yogur griego y las fresas construyen el mecanismo correcto. Newsletter NÂº 16.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Los hÃ¡bitos duraderos no se crean con disciplina. Se crean con placer.',
      description:      'Neurociencia del hÃ¡bito alimentario: dopamina, ganglios basales, tirosina y el circuito de recompensa. Por quÃ© el placer es el mecanismo correcto para crear rutinas que duran.',
      url:              'https://www.food-mood.app/newsletter/habitos-con-placer',
      datePublished:    '2026-05-11',
      dateModified:     '2026-05-11',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/habitos-con-placer' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'HÃ¡bitos con placer', item: 'https://www.food-mood.app/newsletter/habitos-con-placer' },
      ],
    },
  ],
}

export default function NewsletterHabitosConPlacerPage() {
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

