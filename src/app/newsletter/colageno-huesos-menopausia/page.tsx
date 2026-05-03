import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/09-colageno-huesos'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El estrógeno protege el colágeno y los huesos. La ventana que no se repite | Food·Mood Newsletter Nº 09',
  description:
    'Cómo el descenso de estrógenos acelera la pérdida de colágeno y masa ósea en la menopausia: la ventana crítica de 5 años, cofactores esenciales (vitamina C, silicio, magnesio) y la receta de salmón con pimiento fresco para proteger huesos y piel. Newsletter Nº 09 de Food·Mood.',
  keywords: 'colágeno menopausia, huesos menopausia, estrógenos colágeno, pérdida ósea menopausia, vitamina C colágeno, silicio colágeno, osteoporosis menopausia, ventana crítica menopausia, proteína colágeno menopausia',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/colageno-huesos-menopausia' },
  openGraph: {
    title:         'El estrógeno protege el colágeno y los huesos. La ventana que no se repite.',
    description:   'La ventana crítica de 5 años, los cofactores que necesita el colágeno y cómo la alimentación puede frenar la pérdida ósea y de piel en la menopausia.',
    url:           'https://www.food-mood.app/newsletter/colageno-huesos-menopausia',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-05-25',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Colágeno y huesos en la menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El estrógeno protege el colágeno y los huesos. La ventana que no se repite.',
    description: 'Ventana crítica de 5 años, cofactores del colágeno y protocolo nutricional para huesos y piel en la menopausia. Newsletter Nº 09 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'El estrógeno protege el colágeno y los huesos. La ventana que no se repite.',
      description:      'Cómo el descenso de estrógenos acelera la pérdida de colágeno y masa ósea, la ventana crítica de 5 años y los cofactores nutricionales que frenan este proceso en la menopausia.',
      url:              'https://www.food-mood.app/newsletter/colageno-huesos-menopausia',
      datePublished:    '2026-05-25',
      dateModified:     '2026-05-25',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/colageno-huesos-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Colágeno y huesos en la menopausia', item: 'https://www.food-mood.app/newsletter/colageno-huesos-menopausia' },
      ],
    },
  ],
}

export default function NewsletterColagenHuesosPage() {
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
