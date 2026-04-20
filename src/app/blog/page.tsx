import React from 'react';
import { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/supabase/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Newsletter | Food·Mood — Neurociencia, Alimentación y Bienestar',
  description: 'Contenido curado cada semana: neurociencia, psicología, alimentación funcional, longevidad y biotecnología. Ciencia real aplicada a tu bienestar.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Newsletter Food·Mood — Ciencia aplicada a tu bienestar',
    description: 'Cada semana: neurociencia, alimentación funcional y longevidad. Sin ruido. Solo lo que funciona.',
    url: 'https://www.food-mood.app/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter Food·Mood — Ciencia aplicada a tu bienestar',
    description: 'Cada semana: neurociencia, alimentación funcional y longevidad. Sin ruido. Solo lo que funciona.',
    images: ['/og-image.png'],
  },
};

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string }> = {
  neurociencia:  { emoji: '🧬', label: 'Neurociencia',  color: '#7A5AAA' },
  alimentacion:  { emoji: '🌿', label: 'Alimentación',  color: '#5A9B8A' },
  psicologia:    { emoji: '🧠', label: 'Psicología',    color: '#4A7AB5' },
  longevidad:    { emoji: '🔬', label: 'Longevidad',    color: '#C8902A' },
  biotecnologia: { emoji: '💊', label: 'Biotecnología', color: '#C04878' },
};

function weekLabel(weekStart: string | null, newsletterDate: string | null): string {
  const raw = weekStart ?? newsletterDate;
  if (!raw) return 'Archivo';
  const d = new Date(raw);
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  const fmt = (dt: Date) => dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return `${fmt(d)} – ${fmt(end)}`;
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  // Group by week_start (or newsletter_date for old posts)
  const grouped = new Map<string, typeof posts>();
  for (const post of posts) {
    const key = post.week_start ?? post.newsletter_date ?? '__archivo__';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(post);
  }

  // Sort keys descending (newest first), archivo at end
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    if (a === '__archivo__') return 1;
    if (b === '__archivo__') return -1;
    return b.localeCompare(a);
  });

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">

      {/* ── Hero ── */}
      <section className="px-6 mb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 block">
            📩 Newsletter Semanal
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark mb-6 leading-tight">
            Lo que importa saber<br />
            <span className="italic">esta semana</span>
          </h1>
          <p className="text-lg text-aubergine-dark/60 font-light leading-relaxed max-w-2xl mx-auto">
            Neurociencia, alimentación, psicología, longevidad y biotecnología —
            curado por el equipo Food·Mood cada domingo.
          </p>
        </div>
      </section>

      {/* ── Contenido agrupado por semana ── */}
      <section className="px-6 max-w-5xl mx-auto mb-32 space-y-20">
        {sortedKeys.length === 0 ? (
          <div className="text-center py-20 bg-cream rounded-2xl border border-aubergine-dark/5">
            <p className="text-aubergine-dark/40 font-light italic">
              Vuelve el próximo domingo — el equipo está preparando el contenido.
            </p>
          </div>
        ) : (
          sortedKeys.map(key => {
            const weekPosts = grouped.get(key)!;
            const firstPost = weekPosts[0];
            const label = key === '__archivo__'
              ? 'Archivo'
              : weekLabel(firstPost.week_start, firstPost.newsletter_date);

            // Separate curated items (have category) from regular blog posts
            const curated = weekPosts.filter(p => p.category);
            const regular = weekPosts.filter(p => !p.category);

            return (
              <div key={key}>
                {/* Week header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px bg-[#C9A84C] opacity-30 flex-1" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B2737] whitespace-nowrap">
                    {label}
                  </span>
                  <div className="h-px bg-[#C9A84C] opacity-30 flex-1" />
                </div>

                {/* Curated newsletter items */}
                {curated.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {curated.map(post => {
                      const meta = CATEGORY_META[post.category ?? ''] ?? { emoji: '📌', label: post.category ?? '', color: '#6B2737' };
                      return (
                        <div
                          key={post.id}
                          className="bg-white rounded-2xl p-6 border border-aubergine-dark/6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                              style={{ backgroundColor: meta.color }}
                            >
                              {meta.emoji} {meta.label}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-semibold text-aubergine-dark mb-2 leading-snug">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-aubergine-dark/60 font-light leading-relaxed mb-4">
                              {post.excerpt}
                            </p>
                          )}
                          {post.external_url ? (
                            <a
                              href={post.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-[#6B2737] hover:underline"
                            >
                              Leer más →
                            </a>
                          ) : (
                            <a href={`/blog/${post.slug}`} className="text-xs font-bold text-[#6B2737] hover:underline">
                              Leer más →
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Regular blog posts */}
                {regular.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regular.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
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
  );
}
