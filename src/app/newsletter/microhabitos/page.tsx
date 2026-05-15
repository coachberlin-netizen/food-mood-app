import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/05-microhabitos'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El hÃ¡bito que no necesita fuerza de voluntad | FoodÂ·Mood Newsletter NÂº 05',
  description:
    'Por quÃ© los microhÃ¡bitos funcionan donde la disciplina falla: neurociencia del comportamiento, automatizaciÃ³n y cÃ³mo construir rutinas que no dependen de motivaciÃ³n. Newsletter NÂº 05 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/microhabitos' },
  openGraph: {
    title:       'El hÃ¡bito que no necesita fuerza de voluntad',
    description: 'MicrohÃ¡bitos, neurociencia del comportamiento y cÃ³mo construir rutinas que se sostienen solas. Newsletter NÂº 05 de FoodÂ·Mood.',
    url:         'https://www.food-mood.app/newsletter/microhabitos',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    publishedTime: '2026-05-25',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” MicrohÃ¡bitos' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El hÃ¡bito que no necesita fuerza de voluntad',
    description: 'La neurociencia detrÃ¡s de los microhÃ¡bitos: por quÃ© los pequeÃ±os gestos ganan donde la motivaciÃ³n pierde. Newsletter NÂº 05.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'El hÃ¡bito que no necesita fuerza de voluntad',
      description:        'Por quÃ© los microhÃ¡bitos funcionan donde la disciplina falla: neurociencia del comportamiento y cÃ³mo construir rutinas que no dependen de motivaciÃ³n.',
      url:                'https://www.food-mood.app/newsletter/microhabitos',
      datePublished:      '2026-05-25',
      dateModified:       '2026-05-25',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/microhabitos' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'MicrohÃ¡bitos', item: 'https://www.food-mood.app/newsletter/microhabitos' },
      ],
    },
  ],
}

export default function NewsletterMicrohabitosPage() {
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

