import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/16-habitos-con-placer'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Los hábitos duraderos no se crean con disciplina. Se crean con placer. | Food·Mood Newsletter Nº 16',
  description:
    'La neurociencia del hábito: por qué la dopamina y el placer crean rutinas automáticas donde la fuerza de voluntad fracasa. Tirosina, circuito de recompensa y el bol que crea el hábito del desayuno. Newsletter Nº 16 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/habitos-con-placer' },
  openGraph: {
    title:         'Los hábitos duraderos no se crean con disciplina. Se crean con placer.',
    description:   'Dopamina, ganglios basales y el circuito de recompensa: la neurociencia que explica por qué el placer crea hábitos donde la fuerza de voluntad falla siempre.',
    url:           'https://www.food-mood.app/newsletter/habitos-con-placer',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-05-11',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Hábitos con placer, neurociencia del hábito' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Los hábitos duraderos no se crean con disciplina. Se crean con placer.',
    description: 'La dopamina refuerza el circuito que llevó al placer. Sin dopamina, sin hábito. La tirosina del yogur griego y las fresas construyen el mecanismo correcto. Newsletter Nº 16.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Los hábitos duraderos no se crean con disciplina. Se crean con placer.',
      description:      'Neurociencia del hábito alimentario: dopamina, ganglios basales, tirosina y el circuito de recompensa. Por qué el placer es el mecanismo correcto para crear rutinas que duran.',
      url:              'https://www.food-mood.app/newsletter/habitos-con-placer',
      datePublished:    '2026-05-11',
      dateModified:     '2026-05-11',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/habitos-con-placer' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Hábitos con placer', item: 'https://www.food-mood.app/newsletter/habitos-con-placer' },
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
          ← Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

