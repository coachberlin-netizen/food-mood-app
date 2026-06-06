import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { getPublishedPosts } from '@/lib/supabase/blog'
import { getAllMdxPosts } from '@/lib/blog'
import { BlogTabs } from '@/components/blog/BlogTabs'
import { NewsletterForm } from '@/components/layout/NewsletterForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog · Food·Mood Pro — Recursos para profesionales de psiconutrición',
  description:
    'Artículos con base científica sobre psiconutrición, seguimiento conductual y herramientas TCC para nutricionistas y psicólogos.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog · Food·Mood Pro — Recursos para profesionales de psiconutrición',
    description:
      'Psiconutrición, seguimiento conductual y herramientas clínicas para profesionales de la salud. Ciencia aplicada a la consulta.',
    url: 'https://www.food-mood.app/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Blog Food·Mood Pro' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog · Food·Mood Pro — Recursos para profesionales de psiconutrición',
    description:
      'Psiconutrición, seguimiento conductual y herramientas clínicas para profesionales de la salud.',
    images: ['/og-image.png'],
  },
}

const BLOG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog Food·Mood Pro',
  description:
    'Artículos con base científica sobre psiconutrición, seguimiento conductual y herramientas clínicas para profesionales de la salud.',
  url: 'https://www.food-mood.app/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Food·Mood Pro',
    url: 'https://www.food-mood.app',
  },
}

export default async function BlogPage() {
  const [posts, mdxPosts] = await Promise.all([
    getPublishedPosts(),
    Promise.resolve(getAllMdxPosts()),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_SCHEMA) }}
      />

      <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">

        {/* ── Hero ── */}
        <section className="px-6 mb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 block">
              Recursos para profesionales
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark mb-6 leading-tight">
              Ciencia aplicada<br />
              <span className="italic">a la consulta</span>
            </h1>
            <p className="text-lg text-aubergine-dark/60 font-light leading-relaxed max-w-2xl mx-auto">
              Psiconutrición, seguimiento conductual y herramientas TCC para profesionales de la salud —
              con evidencia científica y aplicación clínica directa.
            </p>
          </div>
        </section>

        {/* ── Artículos Pro (MDX) ── */}
        {mdxPosts.length > 0 && (
          <section className="px-6 mb-20">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-8">
                Artículos de fondo
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {mdxPosts.map(post => (
                  <article
                    key={post.slug}
                    className="group rounded-2xl border border-aubergine-dark/10 bg-cream hover:shadow-luxury transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FF6B35]">
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-aubergine-dark/35">
                          <Clock className="w-3 h-3" />
                          <span>{post.readingTimeMinutes} min</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl font-semibold text-aubergine-dark leading-snug mb-3 group-hover:text-aubergine transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-sm text-aubergine-dark/60 font-light leading-relaxed mb-6 line-clamp-3">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-aubergine-dark/40">{post.author}</span>
                        <Link
                          href={post.canonical}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-aubergine-dark/70 hover:text-aubergine-dark transition-colors group/link"
                        >
                          Leer artículo
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Newsletter / curated posts ── */}
        <section className="mb-24">
          <div className="max-w-5xl mx-auto px-6 mb-8">
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50">
              Newsletter semanal
            </h2>
          </div>
          <BlogTabs posts={posts} />
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="px-6">
          <div className="max-w-5xl mx-auto bg-aubergine-dark rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6">
                ¿Quieres recibirlo cada domingo?
              </h2>
              <p className="text-cream/60 font-light text-lg mb-10 max-w-xl mx-auto">
                Únete a la comunidad y recibe ciencia aplicada directo a tu email.
              </p>
              <div className="max-w-md mx-auto h-12 flex items-center justify-center">
                <NewsletterForm source="newsletter_footer" dark={true} />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          </div>
        </section>

      </main>
    </>
  )
}
