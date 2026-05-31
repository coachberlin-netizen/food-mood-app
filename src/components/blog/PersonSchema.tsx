export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Susana Ferreras Díez',
    jobTitle: 'Psicóloga · Tecnóloga de alimentos',
    url: 'https://www.food-mood.app/quienes-somos',
    worksFor: {
      '@type': 'Organization',
      name: 'Food·Mood Pro',
      url: 'https://www.food-mood.app',
    },
    knowsAbout: [
      'Psiconutrición',
      'Alimentación emocional',
      'Tecnología de alimentos',
      'Psicología clínica',
      'Fermentación',
      'Eje intestino-cerebro',
      'Longevidad saludable',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
