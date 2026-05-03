import { NextRequest, NextResponse } from 'next/server'
import { EDITORIAL_NEWSLETTERS } from '@/lib/editorial-newsletters'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const nl = EDITORIAL_NEWSLETTERS.find(n => n.slug === slug)
  if (!nl) return new NextResponse('Not found', { status: 404 })
  const html = nl.buildHtml()
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
