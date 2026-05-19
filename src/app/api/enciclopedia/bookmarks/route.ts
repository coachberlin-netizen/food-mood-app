import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const slug = req.nextUrl.searchParams.get('slug')
  const query = supabase
    .from('kb_bookmarks')
    .select('id, kb_slug, section_anchor, section_title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (slug) query.eq('kb_slug', slug)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { kb_slug, section_anchor, section_title } = await req.json()
  if (!kb_slug || !section_anchor || !section_title) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('kb_bookmarks')
    .upsert({ user_id: user.id, kb_slug, section_anchor, section_title }, {
      onConflict: 'user_id,kb_slug,section_anchor',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { kb_slug, section_anchor } = await req.json()
  const { error } = await supabase
    .from('kb_bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('kb_slug', kb_slug)
    .eq('section_anchor', section_anchor)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
