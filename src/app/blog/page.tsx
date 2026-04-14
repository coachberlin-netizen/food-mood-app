import React from 'react';
import { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/supabase/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | Food·Mood — Neurociencia Nutricional y Bienestar',
  description: 'Archivo editorial de nuestras newsletters semanales. Ciencia del metabolismo, salud digestiva y recetas funcionales para tu estado emocional.',
  alternates: {
    canonical: '/blog'
  }
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">
      {/* Hero Section */}
      <section className="px-6 mb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 block">
            Archivo Semanal
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark mb-6 leading-tight">
            El Blog de <span className="italic">Food·Mood</span>
          </h1>
          <p className="text-lg text-aubergine-dark/60 font-light leading-relaxed max-w-2xl mx-auto">
            Explora nuestra colección de artículos sobre nutrición funcional, el eje intestino-cerebro y cómo lo que comes define cómo te sientes.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-6 max-w-7xl mx-auto mb-32">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-cream rounded-2xl border border-aubergine-dark/5">
            <p className="text-aubergine-dark/40 font-light italic">
              Aún no hay artículos publicados. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto bg-aubergine-dark rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6">¿Quieres recibir esto en tu email?</h2>
            <p className="text-cream/60 font-light text-lg mb-10 max-w-xl mx-auto">
              Únete a nuestra comunidad y recibe cada domingo ciencia aplicada y recetas para tu paleta emocional.
            </p>
            <div className="max-w-md mx-auto h-12 flex items-center justify-center">
              <NewsletterForm source="blog_footer" dark={true} />
            </div>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        </div>
      </section>
    </main>
  );
}
