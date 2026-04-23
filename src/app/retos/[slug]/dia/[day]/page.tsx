import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DiaPageClient from './DiaPageClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string; day: string }>
}

export default async function DiaPage({ params }: Props) {
  const { slug, day } = await params
  const dayNumber = parseInt(day, 10)
  if (isNaN(dayNumber) || dayNumber < 1) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id, slug, title, color, emoji, duration_days')
    .eq('slug', slug)
    .maybeSingle()

  if (!challenge) notFound()

  const { data: enrollment } = await supabase
    .from('user_challenges')
    .select('id, current_day, completed, fm_index_start, paid')
    .eq('user_id', user.id)
    .eq('challenge_id', challenge.id)
    .maybeSingle()

  if (!enrollment?.paid) redirect(`/retos/${slug}`)

  const currentDay = enrollment.current_day as number

  if (dayNumber > currentDay) {
    redirect(`/retos/${slug}/dia/${currentDay}`)
  }

  const { data: dayContent } = await supabase
    .from('challenge_days')
    .select('*')
    .eq('challenge_id', challenge.id)
    .eq('day_number', dayNumber)
    .maybeSingle()

  if (!dayContent) notFound()

  return (
    <DiaPageClient
      challenge={challenge as any}
      enrollment={enrollment as any}
      dayContent={dayContent as any}
      dayNumber={dayNumber}
    />
  )
}
