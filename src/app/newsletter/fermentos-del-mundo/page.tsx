import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/11-fermentos-del-mundo'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'De Japón a Perú. Lo que seis civilizaciones aprendieron sobre el eje intestino-cerebro | Food·Mood Newsletter Nº 11',
  description:
    'Natto de garbanzos, el triángulo coreano (kimchi, gochujang, doenjang), injera etíope, borscht con kéfir, tepache, chicha morada y nukazuke: la ciencia del eje intestino-cerebro en seis fermentos de seis civilizaciones. Newsletter Nº 11 de Food·Mood.',
  keywords: 'fermentos del mundo, natto garbanzos nattokinasa, kimchi GABA dopamina, doenjang calma, injera teff hierro, borscht kefir remolacha, tepache bromelina, chicha morada antocianinas, nukazuke mindfulness, fermentación intestino cerebro',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/fermentos-del-mundo' },
  openGraph: {
    title:         'De Japón a Perú. Lo que seis civilizaciones aprendieron sobre el eje intestino-cerebro.',
    description:   'Natto, kimchi, injera, borscht, tepache, nukazuke: seis fermentos ancestrales y la neurociencia que explica por qué cada uno afecta al cerebro de forma distinta.',
    url:           'https://www.food-mood.app/newsletter/fermentos-del-mundo',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-06-08',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Fermentos del Mundo' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'De Japón a Perú. Lo que seis civilizaciones aprendieron sobre el eje intestino-cerebro.',
    description: 'Natto, kimchi, injera, borscht, tepache y nukazuke: la ciencia del eje intestino-cerebro en seis fermentos ancestrales. Newsletter Nº 11 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'De Japón a Perú. Lo que seis civilizaciones aprendieron sobre el eje intestino-cerebro.',
      description:      'Natto de garbanzos, el triángulo coreano, injera etíope, borscht con kéfir, tepache, chicha morada y nukazuke: la convergencia microbiana de seis culturas y su impacto en el cerebro.',
      url:              'https://www.food-mood.app/newsletter/fermentos-del-mundo',
      datePublished:    '2026-06-08',
      dateModified:     '2026-06-08',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/fermentos-del-mundo' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Fermentos del Mundo', item: 'https://www.food-mood.app/newsletter/fermentos-del-mundo' },
      ],
    },
  ],
}

export default function NewsletterFermentosDelMundoPage() {
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
