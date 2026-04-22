import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/supabase/blog';
import { markdownToHtml } from '@/lib/markdown';
import { BlogContent } from '@/components/blog/BlogContent';
import { ArrowLeft, Calendar, Tag, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: { slug: string };
}

/**
 * Dynamic Metadata Generation
 */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.seo_title || `${post.title} | Food·Mood`,
    description: post.seo_description || post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author_name],
      images: post.cover_image ? [post.cover_image, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content_md);

  const displayDate = post.newsletter_date 
    ? new Date(post.newsletter_date).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : post.published_at 
    ? new Date(post.published_at).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      {/* Navigation & Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-aubergine-dark/40 hover:text-gold transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al blog</span>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {displayDate && (
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#C9A84C]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{displayDate}</span>
              </div>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-aubergine-dark/5 text-aubergine-dark/50 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-black text-aubergine-dark leading-tight mb-8">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-aubergine-dark/60 font-light italic leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.cover_image && (
            <div className="mt-12 rounded-3xl overflow-hidden shadow-luxury aspect-[16/9]">
              <img
                src={post.cover_image}
                alt={post.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <BlogContent contentHtml={contentHtml} />

        {/* Footer / CTA */}
        <footer className="mt-24 pt-16 border-t border-aubergine-dark/10">
          <div className="bg-aubergine-dark rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <BookOpen className="w-8 h-8 text-gold/40 mb-6" />
              <h3 className="text-2xl md:text-3xl font-serif mb-6">¿Te ha gustado este artículo?</h3>
              <p className="text-cream/60 font-light leading-relaxed mb-10">
                En Food·Mood diseñamos tu bienestar a través de la alimentación. Haz el test de neurociencia gratuito y descubre qué recetas necesita tu cuerpo hoy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/test">
                  <Button variant="primary" size="lg" className="px-8">
                    Hacer el Test Gratis
                  </Button>
                </Link>
                <Link href="/glosario">
                  <Button variant="outline" className="border-cream/20 text-cream hover:bg-white/5 px-8">
                    Explorar Glosario
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
