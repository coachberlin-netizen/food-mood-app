import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { isUserAdmin } from '@/lib/admin-config'
import { getPremiumStatus } from '@/lib/premium'
import RetoDetailClient from './RetoDetailClient'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }>; searchParams?: unknown }

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

  const SLUG_KEYWORDS: Record<string, string[]> = {
    'reset-antiinflamatorio':  ['reset antiinflamatorio', 'dieta antiinflamatoria', 'NF-kB alimentación', 'cúrcuma omega-3', 'fermentados antiinflamación'],
    'mejora-tu-sueno':         ['mejorar sueño alimentación', 'serotonina melatonina dieta', 'triptófano alimentos', 'insomnio nutrición', 'magnesio sueño'],
    'recupera-tu-energia':     ['recuperar energía sin cafeína', 'fatiga crónica alimentación', 'energía mitocondrial', 'hierro transporte energía'],
    'equilibrio-hormonal-45':  ['equilibrio hormonal perimenopausia', 'alimentación SOP', 'fitoestrógenos dieta', 'estrobioma hormonal', 'tiroides nutrición'],
    'food-mood-reset':         ['reset intestino cerebro', 'microbioma salud mental', 'psicobióticos', 'serotonina intestinal', 'food mood reset'],
  }
  const slugKeywords = SLUG_KEYWORDS[slug] ?? []

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
      ...slugKeywords,
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

export default async function RetoDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp = await (searchParams as unknown as Promise<Record<string, string>>)
  const shouldRestart = sp?.restart === 'true'
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
  let isPremium = false

  if (user) {
    const { data: en } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge.id)
      .maybeSingle()

    enrollment = en

    // Admin and premium/influencer users get free access — auto-grant paid enrollment
    if (!enrollment?.paid) {
      const hasFreeAccess = isUserAdmin(user) || await getPremiumStatus(supabase, user.id)
      isPremium = hasFreeAccess
      if (hasFreeAccess) {
        const today = new Date().toISOString().split('T')[0]
        await supabase
          .from('user_challenges')
          .upsert(
            {
              user_id:     user.id,
              challenge_id: challenge.id,
              start_date:  today,
              paid:        true,
              current_day: enrollment?.current_day ?? 1,
            },
            { onConflict: 'user_id,challenge_id' }
          )
        enrollment = {
          ...(enrollment ?? { id: '', completed: false, completed_at: null, fm_index_start: null, fm_index_end: null }),
          paid:        true,
          current_day: enrollment?.current_day ?? 1,
        } as typeof enrollment
      }
    } else {
      isPremium = true  // already paid = already has access
    }

    // Server-side restart: ?restart=true resets the enrollment directly, bypassing client AJAX
    if (shouldRestart && enrollment?.paid && enrollment.completed) {
      const admin = createAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
      const { error: restartErr } = await admin
        .from('user_challenges')
        .update({ current_day: 1, completed: false, completed_at: null, fm_index_end: null })
        .eq('id', (enrollment as any).id)
      if (!restartErr) {
        enrollment = { ...enrollment, current_day: 1, completed: false, completed_at: null, fm_index_end: null } as typeof enrollment
      } else {
        console.error('[page restart] error:', restartErr)
      }
    }

    if (enrollment?.paid && !enrollment.completed) {
      const { data: day } = await supabase
        .from('challenge_days')
        .select('*')
        .eq('challenge_id', challenge.id)
        .eq('day_number', enrollment.current_day)
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
          isPremium={isPremium}
        />
      </Suspense>
    </>
  )
}
