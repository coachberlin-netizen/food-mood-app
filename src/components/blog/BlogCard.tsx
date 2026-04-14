import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { BlogPost } from '@/lib/supabase/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Use newsletter_date as primary, fallback to published_at
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
    : 'Próximamente';

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-cream rounded-2xl border border-aubergine-dark/10 overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
      {post.cover_image && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-aubergine-dark/40">
            <Calendar className="w-3 h-3" />
            <span>{displayDate}</span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
              <Tag className="w-3 h-3" />
              <span>{post.tags[0]}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-serif font-semibold text-aubergine-dark mb-4 group-hover:text-gold transition-colors leading-tight">
          {post.title}
        </h3>
        
        {post.excerpt && (
          <p className="text-aubergine-dark/60 text-sm leading-relaxed font-light line-clamp-3 mb-6">
            {post.excerpt}
          </p>
        )}
        
        <div className="mt-auto flex items-center gap-2 text-aubergine-dark font-medium text-sm group-hover:translate-x-1 transition-transform">
          <span>Leer artículo</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
