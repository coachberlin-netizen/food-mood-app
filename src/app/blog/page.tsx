import React from 'react';
import { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/supabase/blog';
import { BlogTabs } from '@/components/blog/BlogTabs';
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


export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">

      {/* ── Hero ── */}
      <section className="px-6 mb-12 text-center">
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

      {/* ── Pestañas ── */}
      <section className="mb-24">
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
  );
}
