const BASE_URL = 'https://www.food-mood.app'

interface ArticleSchemaProps {
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  canonical: string
}

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  canonical,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: 'Susana Ferreras Díez',
      url: `${BASE_URL}/quienes-somos`,
      jobTitle: 'Psicóloga y Tecnóloga de alimentos',
      sameAs: [],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Food·Mood Pro',
      url: BASE_URL,
    },
    mainEntityOfPage: `${BASE_URL}${canonical}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
