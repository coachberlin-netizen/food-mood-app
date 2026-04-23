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

  const title = `${data.title} | Food·Mood`
  const description = data.subtitle ?? `Reto de ${data.duration_days} días · ${data.price_eur}€ · Nutrición emocional basada en el eje intestino-cerebro.`

  return {
    title,
    description,
    alternates: { canonical: `https://www.food-mood.app/retos/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.food-mood.app/retos/${slug}`,
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

  return (
    <Suspense fallback={null}>
      <RetoDetailClient
        challenge={challenge}
        enrollment={enrollment}
        todayContent={todayContent}
        isAuthenticated={!!user}
      />
    </Suspense>
  )
}
