import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RetoDetailClient from './RetoDetailClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('challenges')
    .select('title, subtitle')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Reto — Food·Mood' }

  return {
    title: `${data.title} | Food·Mood`,
    description: data.subtitle ?? undefined,
    alternates: { canonical: `/retos/${params.slug}` },
  }
}

export default async function RetoDetailPage({ params }: PageProps) {
  const supabase = await createClient()

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('slug', params.slug)
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
    <RetoDetailClient
      challenge={challenge}
      enrollment={enrollment}
      todayContent={todayContent}
    />
  )
}
