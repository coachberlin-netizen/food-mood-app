import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/13-lactobacillus-ph-vaginal'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'Estrógeno, Lactobacillus y pH vaginal. La conexión que nadie te explicó | Food·Mood Newsletter Nº 13',
  description:
    'Cómo el descenso de estrógenos altera el pH vaginal, por qué el kéfir oral coloniza la mucosa vaginal (L. reuteri RC-14, L. rhamnosus GR-1), el papel de los lignanos del lino y las proantocianidinas del arándano en la salud íntima después de los 45. Newsletter Nº 13 de Food·Mood.',
  keywords: 'pH vaginal menopausia, lactobacillus reuteri vaginal, kéfir salud íntima, microbioma vaginal alimentación, atrofia vulvovaginal dieta, lignanos lino ph vaginal, arándanos infecciones urinarias, glucógeno epitelial estrógenos, infecciones vaginales recurrentes menopausia, probióticos orales flora vaginal',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal' },
  openGraph: {
    title:         'Estrógeno, Lactobacillus y pH vaginal. La conexión que nadie te explicó.',
    description:   'El estrógeno regula el glucógeno vaginal que alimenta a Lactobacillus. Cuando baja, el pH sube y llegan las infecciones. El kéfir oral puede colonizar la mucosa vaginal. Evidencia directa.',
    url:           'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal',
    type:          'article',
    siteName:      'Food·Mood',
    publishedTime: '2026-06-22',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Lactobacillus y pH vaginal' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Estrógeno, Lactobacillus y pH vaginal. La conexión que nadie te explicó.',
    description: 'El kéfir oral coloniza la mucosa vaginal. Lignanos del lino, proantocianidinas del arándano y la cadena estrógeno→glucógeno→Lactobacillus→pH. Newsletter Nº 13.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'Estrógeno, Lactobacillus y pH vaginal. La conexión que nadie te explicó.',
      description:      'La cadena estrógenos→glucógeno epitelial→Lactobacillus→pH ácido protector, por qué la menopausia la rompe, y cómo el kéfir oral, los lignanos del lino y las proantocianidinas del arándano pueden restaurarla.',
      url:              'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal',
      datePublished:    '2026-06-22',
      dateModified:     '2026-06-22',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Lactobacillus y pH vaginal', item: 'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal' },
      ],
    },
  ],
}

export default function NewsletterLactobacillusPhPage() {
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
