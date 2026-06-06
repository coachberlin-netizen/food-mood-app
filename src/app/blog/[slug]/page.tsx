import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Clock, ChevronRight } from 'lucide-react'
import { getPostBySlug } from '@/lib/supabase/blog'
import { getMdxPostBySlug } from '@/lib/blog'
import { markdownToHtml } from '@/lib/markdown'
import { BlogContent } from '@/components/blog/BlogContent'
import { ProCTA } from '@/components/blog/ProCTA'
import { ArticleSchema, BreadcrumbSchema } from '@/components/blog/ArticleSchema'

const BASE_URL = 'https://www.food-mood.app'

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const previousImages = (await parent).openGraph?.images || []

  // Supabase post
  const supabasePost = await getPostBySlug(slug)
  if (supabasePost) {
    return {
      title: supabasePost.seo_title || `${supabasePost.title} | Food·Mood Pro`,
      description: supabasePost.seo_description || supabasePost.excerpt || undefined,
      keywords: supabasePost.tags?.length ? supabasePost.tags : undefined,
      alternates: { canonical: `/blog/${supabasePost.slug}` },
      openGraph: {
        title: supabasePost.title,
        description: supabasePost.excerpt || undefined,
        type: 'article',
        publishedTime: supabasePost.published_at || undefined,
        authors: [supabasePost.author_name],
        images: supabasePost.cover_image
          ? [supabasePost.cover_image, ...previousImages]
          : previousImages,
        url: `${BASE_URL}/blog/${supabasePost.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: supabasePost.title,
        description: supabasePost.excerpt || undefined,
        images: supabasePost.cover_image ? [supabasePost.cover_image] : [],
      },
    }
  }

  // MDX post
  const mdxPost = await getMdxPostBySlug(slug)
  if (mdxPost) {
    return {
      title: `${mdxPost.title} | Food·Mood Pro`,
      description: mdxPost.description,
      keywords: mdxPost.keywords.length ? mdxPost.keywords : undefined,
      alternates: { canonical: mdxPost.canonical },
      openGraph: {
        title: mdxPost.title,
        description: mdxPost.description,
        type: 'article',
        publishedTime: mdxPost.date,
        authors: [mdxPost.author],
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: mdxPost.title }],
        url: `${BASE_URL}${mdxPost.canonical}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: mdxPost.title,
        description: mdxPost.description,
        images: ['/og-image.png'],
      },
    }
  }

  return {}
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ── Supabase post ──────────────────────────────────────────────────────────
  const supabasePost = await getPostBySlug(slug)
  if (supabasePost) {
    const contentHtml = await markdownToHtml(supabasePost.content_md)
    const canonical = `/blog/${supabasePost.slug}`
    const dateStr = supabasePost.newsletter_date || supabasePost.published_at
    const displayDate = dateStr
      ? new Date(dateStr).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

    return (
      <>
        <ArticleSchema
          headline={supabasePost.title}
          description={supabasePost.seo_description || supabasePost.excerpt || ''}
          datePublished={supabasePost.published_at || supabasePost.created_at}
          dateModified={supabasePost.updated_at}
          canonical={canonical}
        />
        <BreadcrumbSchema
          items={[
            { name: 'Inicio', url: BASE_URL },
            { name: 'Blog', url: `${BASE_URL}/blog` },
            { name: supabasePost.title, url: `${BASE_URL}${canonical}` },
          ]}
        />

        <main className="min-h-screen bg-cream pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-6 mb-10">
            <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs text-aubergine-dark/40">
              <Link href="/" className="hover:text-aubergine-dark transition-colors">Inicio</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className="hover:text-aubergine-dark transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-aubergine-dark/60 line-clamp-1">{supabasePost.title}</span>
            </nav>
          </div>

          <article className="max-w-4xl mx-auto px-6">
            <header className="mb-16">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {displayDate && (
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#FF6B35]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{displayDate}</span>
                  </div>
                )}
                {supabasePost.tags && supabasePost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {supabasePost.tags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1 bg-aubergine-dark/5 text-aubergine-dark/50 text-[10px] font-bold uppercase tracking-wider rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-black text-aubergine-dark leading-tight mb-8">
                {supabasePost.title}
              </h1>

              {supabasePost.excerpt && (
                <p className="text-xl md:text-2xl text-aubergine-dark/60 font-light italic leading-relaxed">
                  {supabasePost.excerpt}
                </p>
              )}

              <div className="flex items-center gap-2 mt-6 text-sm text-aubergine-dark/50">
                <span>
                  Por{' '}
                  <Link href="/quienes-somos" className="text-aubergine-dark/70 hover:text-aubergine-dark transition-colors font-medium">
                    {supabasePost.author_name}
                  </Link>
                </span>
              </div>

              {supabasePost.cover_image && (
                <div className="mt-12 rounded-3xl overflow-hidden shadow-luxury aspect-[16/9]">
                  <img
                    src={supabasePost.cover_image}
                    alt={supabasePost.title}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </header>

            <BlogContent contentHtml={contentHtml} />

            <ProCTA />

            <footer className="mt-8 pt-8 border-t border-aubergine-dark/10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-aubergine-dark/40 hover:text-aubergine-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al blog
              </Link>
            </footer>
          </article>
        </main>
      </>
    )
  }

  // ── MDX post ───────────────────────────────────────────────────────────────
  const mdxPost = await getMdxPostBySlug(slug)
  if (!mdxPost) notFound()

  const canonical = mdxPost.canonical
  const displayDate = new Date(mdxPost.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <ArticleSchema
        headline={mdxPost.title}
        description={mdxPost.description}
        datePublished={mdxPost.date}
        canonical={canonical}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: BASE_URL },
          { name: 'Blog', url: `${BASE_URL}/blog` },
          { name: mdxPost.title, url: `${BASE_URL}${canonical}` },
        ]}
      />

      <main className="min-h-screen bg-cream pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <nav aria-label="Migas de pan" className="flex items-center gap-1.5 text-xs text-aubergine-dark/40">
            <Link href="/" className="hover:text-aubergine-dark transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-aubergine-dark transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-aubergine-dark/60 line-clamp-1">{mdxPost.title}</span>
          </nav>
        </div>

        <article className="max-w-4xl mx-auto px-6">
          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#FF6B35]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{displayDate}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-aubergine-dark/40">
                <Clock className="w-3.5 h-3.5" />
                <span>{mdxPost.readingTimeMinutes} min de lectura</span>
              </div>
              {mdxPost.keywords.slice(0, 3).map(kw => (
                <span
                  key={kw}
                  className="px-3 py-1 bg-aubergine-dark/5 text-aubergine-dark/50 text-[10px] font-bold uppercase tracking-wider rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-black text-aubergine-dark leading-tight mb-8">
              {mdxPost.title}
            </h1>

            {mdxPost.description && (
              <p className="text-xl md:text-2xl text-aubergine-dark/60 font-light italic leading-relaxed mb-8">
                {mdxPost.description}
              </p>
            )}

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-sm text-aubergine-dark/70">
                <span>Por{' '}
                  <Link
                    href="/quienes-somos"
                    className="font-medium hover:text-aubergine-dark transition-colors"
                  >
                    {mdxPost.author}
                  </Link>
                </span>
              </div>
              {mdxPost.authorCredentials && (
                <p className="text-xs text-aubergine-dark/40 font-light">
                  {mdxPost.authorCredentials}
                </p>
              )}
            </div>
          </header>

          <BlogContent contentHtml={mdxPost.contentHtml} />

          <ProCTA />

          <footer className="mt-8 pt-8 border-t border-aubergine-dark/10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-aubergine-dark/40 hover:text-aubergine-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </Link>
          </footer>
        </article>
      </main>
    </>
  )
}
