import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/17-tiroides-postmenopausia'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Tu tiroides no está rota. Quizá solo tiene frío. | Food·Mood Newsletter Nº 17',
  description:
    'Hipotiroidismo subclínico en postmenopausia: selenio, yodo, zinc, vitamina A y omega-3. Los 5 nutrientes que la tiroides necesita y los alimentos que los aportan. Newsletter Nº 17 de Food·Mood, serie Equilibrio Hormonal 45+.',
  keywords: 'hipotiroidismo subclínico mujer, tiroides postmenopausia síntomas, selenio tiroides nueces brasil, yodo T3 T4 alimentos, zinc función tiroidea, vitamina A receptores tiroideos, omega-3 inflamación hormonal, fatiga fría mujer menopausia, TSH T4 libre analítica, sardinas boniato receta tiroides',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/tiroides-postmenopausia' },
  openGraph: {
    title:         'Tu tiroides no está rota. Quizá solo tiene frío.',
    description:   'El hipotiroidismo subclínico afecta al 15-20% de las mujeres en postmenopausia. Selenio, yodo, zinc y omega-3: los nutrientes concretos que marcan una diferencia real.',
    url:           'https://www.food-mood.app/newsletter/tiroides-postmenopausia',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-05-11',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Tiroides y postmenopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tu tiroides no está rota. Quizá solo tiene frío.',
    description: '2 nueces de Brasil al día para el selenio. Sardinas para selenio + omega-3 + yodo. Semillas de calabaza para el zinc. La tiroides en postmenopausia y la nutrición que funciona. Newsletter Nº 17.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Tu tiroides no está rota. Quizá solo tiene frío.',
      description:      'Hipotiroidismo subclínico en postmenopausia: selenio, yodo, zinc, vitamina A y omega-3. Los nutrientes que la tiroides necesita y los alimentos que los aportan.',
      url:              'https://www.food-mood.app/newsletter/tiroides-postmenopausia',
      datePublished:    '2026-05-11',
      dateModified:     '2026-05-11',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/tiroides-postmenopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Tiroides y postmenopausia', item: 'https://www.food-mood.app/newsletter/tiroides-postmenopausia' },
      ],
    },
  ],
}

export default function NewsletterTiroidesPage() {
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
