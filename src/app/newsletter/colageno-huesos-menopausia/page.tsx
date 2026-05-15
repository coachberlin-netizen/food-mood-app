import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/09-colageno-huesos'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'El estrÃ³geno protege el colÃ¡geno y los huesos. La ventana que no se repite | FoodÂ·Mood Newsletter NÂº 09',
  description:
    'CÃ³mo el descenso de estrÃ³genos acelera la pÃ©rdida de colÃ¡geno y masa Ã³sea en la menopausia: la ventana crÃ­tica de 5 aÃ±os, cofactores esenciales (vitamina C, silicio, magnesio) y la receta de salmÃ³n con pimiento fresco para proteger huesos y piel. Newsletter NÂº 09 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/colageno-huesos-menopausia' },
  openGraph: {
    title:         'El estrÃ³geno protege el colÃ¡geno y los huesos. La ventana que no se repite.',
    description:   'La ventana crÃ­tica de 5 aÃ±os, los cofactores que necesita el colÃ¡geno y cÃ³mo la alimentaciÃ³n puede frenar la pÃ©rdida Ã³sea y de piel en la menopausia.',
    url:           'https://www.food-mood.app/newsletter/colageno-huesos-menopausia',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-05-25',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” ColÃ¡geno y huesos en la menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'El estrÃ³geno protege el colÃ¡geno y los huesos. La ventana que no se repite.',
    description: 'Ventana crÃ­tica de 5 aÃ±os, cofactores del colÃ¡geno y protocolo nutricional para huesos y piel en la menopausia. Newsletter NÂº 09 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'El estrÃ³geno protege el colÃ¡geno y los huesos. La ventana que no se repite.',
      description:      'CÃ³mo el descenso de estrÃ³genos acelera la pÃ©rdida de colÃ¡geno y masa Ã³sea, la ventana crÃ­tica de 5 aÃ±os y los cofactores nutricionales que frenan este proceso en la menopausia.',
      url:              'https://www.food-mood.app/newsletter/colageno-huesos-menopausia',
      datePublished:    '2026-05-25',
      dateModified:     '2026-05-25',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/colageno-huesos-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'ColÃ¡geno y huesos en la menopausia', item: 'https://www.food-mood.app/newsletter/colageno-huesos-menopausia' },
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

