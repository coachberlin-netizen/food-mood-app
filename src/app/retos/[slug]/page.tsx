import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RetoDetailClient from './RetoDetailClient'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('challenges')
    .select('title, subtitle, description, price_eur, duration_days')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Reto — Food·Mood' }

  const title = `${data.title} — Reto ${data.duration_days} días | Food·Mood`
  const rawDesc = data.subtitle ?? ''
  const description = rawDesc.toLowerCase().includes('reto')
    ? rawDesc
    : `Reto de ${data.duration_days} días · ${data.price_eur}€ · ${rawDesc || 'Nutrición emocional basada en el eje intestino-cerebro.'}`
  const canonicalUrl = `https://www.food-mood.app/retos/${slug}`

  return {
    title,
    description,
    keywords: [
      data.title,
      `reto ${data.duration_days} días`,
      'reto nutricional',
      'nutrición emocional',
      'eje intestino-cerebro',
      'Food Mood',
      'bienestar',
      'recetas funcionales',
    ].filter(Boolean).join(', '),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function RetoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!challenge) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let enrollment = null
  let todayContent = null

  if (user) {
    const { data: en } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge.id)
      .maybeSingle()

    enrollment = en

    if (en?.paid && !en.completed) {
      const { data: day } = await supabase
        .from('challenge_days')
        .select('*')
        .eq('challenge_id', challenge.id)
        .eq('day_number', en.current_day)
        .maybeSingle()

      todayContent = day
    }
  }

  const canonicalUrl = `https://www.food-mood.app/retos/${slug}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: challenge.title,
    description: challenge.subtitle ?? `Reto de ${challenge.duration_days} días de nutrición emocional basada en el eje intestino-cerebro.`,
    url: canonicalUrl,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'Food·Mood' },
    offers: {
      '@type': 'Offer',
      price: challenge.price_eur ?? 19,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
      seller: { '@type': 'Organization', name: 'Food·Mood' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: challenge.title, item: canonicalUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="sr-only">
        <nav aria-label="Ruta de navegación">
          <a href="/retos">Retos</a> › <span>{challenge.title}</span>
        </nav>
        <h1>{challenge.title}</h1>
        {challenge.subtitle && <p>{challenge.subtitle}</p>}
        <p>Duración: {challenge.duration_days} días · Precio: {challenge.price_eur ?? 19}€ pago único</p>
      </div>
      <Suspense fallback={null}>
        <RetoDetailClient
          challenge={challenge}
          enrollment={enrollment}
          todayContent={todayContent}
          isAuthenticated={!!user}
        />
      </Suspense>
    </>
  )
}
