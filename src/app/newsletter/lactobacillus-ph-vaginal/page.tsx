import type { Metadata } from 'next'
import Link from 'next/link'
import { buildHtml } from '@/lib/editorial-newsletters/13-lactobacillus-ph-vaginal'
import { extractNewsletterParts } from '@/lib/editorial-newsletters/extract-html'

export const metadata: Metadata = {
  title: 'EstrÃ³geno, Lactobacillus y pH vaginal. La conexiÃ³n que nadie te explicÃ³ | FoodÂ·Mood Newsletter NÂº 13',
  description:
    'CÃ³mo el descenso de estrÃ³genos altera el pH vaginal, por quÃ© el kÃ©fir oral coloniza la mucosa vaginal (L. reuteri RC-14, L. rhamnosus GR-1), el papel de los lignanos del lino y las proantocianidinas del arÃ¡ndano en la salud Ã­ntima despuÃ©s de los 45. Newsletter NÂº 13 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal' },
  openGraph: {
    title:         'EstrÃ³geno, Lactobacillus y pH vaginal. La conexiÃ³n que nadie te explicÃ³.',
    description:   'El estrÃ³geno regula el glucÃ³geno vaginal que alimenta a Lactobacillus. Cuando baja, el pH sube y llegan las infecciones. El kÃ©fir oral puede colonizar la mucosa vaginal. Evidencia directa.',
    url:           'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal',
    type:          'article',
    siteName:      'FoodÂ·Mood',
    publishedTime: '2026-06-22',
    images:        [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Lactobacillus y pH vaginal' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'EstrÃ³geno, Lactobacillus y pH vaginal. La conexiÃ³n que nadie te explicÃ³.',
    description: 'El kÃ©fir oral coloniza la mucosa vaginal. Lignanos del lino, proantocianidinas del arÃ¡ndano y la cadena estrÃ³genoâ†’glucÃ³genoâ†’Lactobacillusâ†’pH. Newsletter NÂº 13.',
    images:      ['/og-image.png'],
  },
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':          'NewsArticle',
      headline:         'EstrÃ³geno, Lactobacillus y pH vaginal. La conexiÃ³n que nadie te explicÃ³.',
      description:      'La cadena estrÃ³genosâ†’glucÃ³geno epitelialâ†’Lactobacillusâ†’pH Ã¡cido protector, por quÃ© la menopausia la rompe, y cÃ³mo el kÃ©fir oral, los lignanos del lino y las proantocianidinas del arÃ¡ndano pueden restaurarla.',
      url:              'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal',
      datePublished:    '2026-06-22',
      dateModified:     '2026-06-22',
      inLanguage:       'es',
      image:            'https://www.food-mood.app/og-image.png',
      author:           { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:        { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                          logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/lactobacillus-ph-vaginal' },
      isPartOf:         { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
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
          â† Archivo de newsletters
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

