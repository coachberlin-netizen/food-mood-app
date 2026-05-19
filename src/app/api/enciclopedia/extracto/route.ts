import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllKbsMeta, getKbBySlug, getDailyExtractSeed } from '@/lib/enciclopedia'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const kbs = getAllKbsMeta()
  const { kbIndex, sectionIndex } = getDailyExtractSeed(user.id)
  const kb = kbs[kbIndex % kbs.length]

  const doc = await getKbBySlug(kb.slug)
  if (!doc || doc.sections.length === 0) {
    return NextResponse.json({ error: 'No sections found' }, { status: 404 })
  }

  const section = doc.sections[sectionIndex % doc.sections.length]

  return NextResponse.json({
    kb: { slug: kb.slug, title: kb.title, nivel_evidencia_general: kb.nivel_evidencia_general },
    section: { anchor: section.anchor, heading: section.heading, html: section.html },
  })
}
