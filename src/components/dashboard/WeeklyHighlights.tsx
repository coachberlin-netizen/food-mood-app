import React from 'react';
import Link from 'next/link';
import { NewsletterHighlights } from '@/lib/supabase/newsletter';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function WeeklyHighlights({ highlights }: { highlights: NewsletterHighlights }) {
  const { post, recipes } = highlights;

  return (
    <section className="flex flex-col gap-8 scroll-mt-8">
      {/* Eyebrow Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
          Novedades de la semana
        </h2>
        <div className="h-px bg-[#C9A84C] flex-1 opacity-20"></div>
      </div>

      <div className="bg-cream rounded-[1.5rem] p-8 md:p-10 border border-aubergine-dark/20 shadow-sm flex flex-col min-h-[200px] overflow-hidden relative">
        {post ? (
          <div className="flex flex-col gap-8 relative z-10">
            {/* Newsletter Post Content */}
            <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between">
              <div className="flex flex-col gap-4 max-w-2xl">
                <h3 className="text-3xl md:text-4xl font-serif font-black text-aubergine-dark leading-tight">
                  {post.title}
                </h3>
                
                {/* Fallback summary resolution */}
                <p className="text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed">
                  {post.excerpt || post.seo_description || "Recetas, ideas y descubrimientos compartidos esta semana en la newsletter."}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-aubergine-dark text-white font-medium text-sm shadow-luxury hover:bg-aubergine transition-colors"
                  >
                    Ver novedades <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  {recipes && recipes.length > 0 && (
                    <Link
                      href="/para-mi"
                      className="inline-flex items-center justify-center px-6 py-3.5 border border-aubergine-dark/20 rounded-full text-aubergine-dark/80 bg-transparent hover:bg-white hover:border-[#C9A84C] transition-all text-sm font-medium"
                    >
                      Ver mis recursos
                    </Link>
                  )}
                </div>
              </div>

              {/* Cover Image or Decorational Fallback */}
              <div className="w-full md:w-64 lg:w-72 aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden shrink-0 relative bg-aubergine-dark/5 border border-aubergine-dark/10 shadow-inner flex items-center justify-center">
                {post.cover_image ? (
                  <Image 
                    src={post.cover_image} 
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1118]/5 to-[#2a1825]/5 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-[#C9A84C]/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Recipes Grid (Only visible if recipes exist) */}
            {recipes && recipes.length > 0 && (
              <div className="flex flex-col gap-5 pt-8 border-t border-aubergine-dark/10">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#C9A84C]">
                  Recetas Destacadas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recipes.map((recipe: any) => (
                    <Link href={`/recetas/${recipe.id}`} key={recipe.id} className="group">
                      <div className="flex flex-col h-full bg-white/60 p-5 rounded-2xl border border-aubergine-dark/5 hover:border-[#C9A84C]/40 hover:shadow-md transition-all gap-3 overflow-hidden cursor-pointer">
                        <div className="flex justify-between items-start gap-2">
                           <span className="text-[9px] font-bold uppercase tracking-wider text-[#C9A84C] truncate">
                             {recipe.mood_es || recipe.tipo_plato}
                           </span>
                           {(recipe.premium_level ?? 0) === 2 && (
                             <span className="shrink-0 text-[10px]">✦</span>
                           )}
                        </div>
                        <h5 className="font-serif font-bold text-aubergine-dark text-lg leading-snug group-hover:text-aubergine transition-colors line-clamp-2">
                          {recipe.nombre_es}
                        </h5>
                        <div className="mt-auto flex items-center gap-3 text-[10px] text-aubergine-dark/50 uppercase tracking-widest pt-2">
                           <span>{recipe.tiempo_preparacion_min} min</span>
                           <span>•</span>
                           <span className="truncate">{recipe.dificultad}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-8 relative z-10 w-full h-full my-auto">
            <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6 text-[#C9A84C]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-black text-aubergine-dark">
              Lo último salido de nuestra cocina editorial
            </h3>
            <p className="font-serif text-lg md:text-xl text-aubergine-dark/70 max-w-xl font-light leading-relaxed">
              Muy pronto encontrarás aquí las últimas recetas y descubrimientos compartidos en la newsletter semanal.
            </p>
            <div className="mt-4">
              <Link 
                href="/blog" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-aubergine-dark text-cream font-medium hover:bg-aubergine transition-colors tracking-wide shadow-luxury text-sm"
              >
                Ir al blog <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
        
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-[80px] pointer-events-none" />
      </div>
    </section>
  );
}
