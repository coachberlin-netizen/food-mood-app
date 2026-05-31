import { getAllMdxPosts } from '@/lib/blog'
import { getPublishedPosts } from '@/lib/supabase/blog'

const BASE_URL = 'https://www.food-mood.app'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString()
}

export async function GET() {
  const mdxPosts = getAllMdxPosts()

  let supabasePosts: { title: string; slug: string; excerpt: string | null; published_at: string | null; author_name: string }[] = []
  try {
    supabasePosts = await getPublishedPosts()
  } catch {
    // Non-fatal: RSS still serves MDX posts if Supabase is unreachable
  }

  const mdxItems = mdxPosts.map(p => ({
    title: p.title,
    url: `${BASE_URL}${p.canonical}`,
    description: p.description,
    pubDate: p.date,
    author: p.author,
  }))

  const supabaseItems = supabasePosts
    .filter(p => p.published_at)
    .map(p => ({
      title: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      description: p.excerpt || '',
      pubDate: p.published_at!,
      author: p.author_name,
    }))

  // Merge and sort by date descending
  const allItems = [...mdxItems, ...supabaseItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )

  const itemsXml = allItems
    .map(
      item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRfc822(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${item.url}</guid>
      <author>${escapeXml(item.author)}</author>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog · Food·Mood Pro</title>
    <link>${BASE_URL}/blog</link>
    <description>Artículos con base científica sobre psiconutrición para profesionales de la salud.</description>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>hola@food-mood.app (Susana Ferreras Díez)</managingEditor>${itemsXml}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
