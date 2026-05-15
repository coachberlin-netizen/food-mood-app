import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/10-emociones-menopausia'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'No es la edad. Es tu cerebro pidiendo lo que tus hormonas ya no le dan | FoodÂ·Mood Newsletter NÂº 10',
  description:
    'Cuando bajan los estrÃ³genos, tu cerebro pierde serotonina, dopamina y GABA. Los 6 nutrientes clave despuÃ©s de los 45, los 4 patrones de comer emocional y la tÃ©cnica de los 30 segundos para romper el piloto automÃ¡tico. Newsletter NÂº 10 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/emociones-menopausia' },
  openGraph: {
    title:         'No es la edad. Es tu cerebro pidiendo lo que tus hormonas ya no le dan.',
    description:   'EstrÃ³genos, serotonina y los 6 nutrientes que tu cerebro necesita despuÃ©s de los 45. MÃ¡s: los 4 patrones de comer emocional y cÃ³mo romper el piloto automÃ¡tico.',
    url:           'https://www.food-mood.app/newsletter/emociones-menopausia',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-06-01',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Emociones y menopausia' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'No es la edad. Es tu cerebro pidiendo lo que tus hormonas ya no le dan.',
    description: 'Los 6 nutrientes clave, los 4 patrones emocionales alimentarios y la tÃ©cnica de los 30 segundos. Newsletter NÂº 10 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'No es la edad. Es tu cerebro pidiendo lo que tus hormonas ya no le dan.',
      description:      'CÃ³mo el descenso de estrÃ³genos afecta serotonina, dopamina y GABA. Los 6 nutrientes clave despuÃ©s de los 45, los 4 patrones de comer emocional y la tÃ©cnica de los 30 segundos.',
      url:              'https://www.food-mood.app/newsletter/emociones-menopausia',
      datePublished:    '2026-06-01',
      dateModified:     '2026-06-01',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/emociones-menopausia' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Emociones y menopausia', item: 'https://www.food-mood.app/newsletter/emociones-menopausia' },
      ],
    },
  ],
}

export default function NewsletterEmocionesMenopausiaPage() {
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

