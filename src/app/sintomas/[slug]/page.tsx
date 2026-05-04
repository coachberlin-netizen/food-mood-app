import { Metadata } from 'next'
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Lock, Sparkles, Zap } from "lucide-react"
import { getPremiumStatus } from "@/lib/premium"

export const dynamic = 'force-dynamic'

import { SYMPTOMS } from "@/data/symptoms"
import { BookOpen, AlertCircle } from "lucide-react"

// ─── Per-slug keyword map ─────────────────────────────────────────────────────
const SLUG_KEYWORDS: Record<string, string[]> = {
  'ansiedad':              ['recetas para ansiedad', 'alimentos que calman la ansiedad', 'dieta para ansiedad', 'triptófano ansiedad alimentación', 'GABA alimentos naturales', 'fermentados ansiedad microbiota', 'qué comer para calmar el sistema nervioso', 'psicobióticos ansiedad'],
  'insomnio':              ['qué comer para dormir mejor', 'alimentos para el insomnio', 'dieta para dormir bien', 'triptófano melatonina alimentos', 'magnesio sueño nocturno', 'GABA natural alimentos', 'recetas para dormir bien', 'alimentación y calidad del sueño'],
  'cansancio':             ['alimentos para el cansancio', 'qué comer cuando estás cansado', 'recetas para recuperar energía', 'dieta para fatiga crónica', 'hierro biodisponible alimentos', 'CoQ10 alimentación energía', 'adaptógenos cansancio', 'fatiga crónica nutrición'],
  'niebla-mental':         ['alimentos para la concentración', 'dieta para claridad mental', 'omega-3 cerebro foco', 'DHA alimentación cognición', 'recetas para niebla mental', 'L-teanina matcha concentración', 'qué comer para pensar mejor', 'neuroinflamación alimentación'],
  'hambre-constante':      ['alimentos saciantes', 'recetas para controlar el hambre', 'dieta anti-antojos', 'fibra saciante prebiótica', 'estabilizar glucosa antojos', 'leptina grelina alimentación', 'qué comer para no tener hambre', 'control apetito nutrición'],
  'inflamacion-silenciosa':['dieta antiinflamatoria', 'alimentos antiinflamatorios', 'recetas para inflamación', 'polifenoles inflamación', 'curcumina cúrcuma NF-kB', 'omega-3 antiinflamatorio alimentación', 'inflammaging dieta', 'inflamación crónica intestino'],
  'digestion-pesada':      ['recetas para la digestión pesada', 'alimentos para el hinchazón', 'dieta para mejorar digestión', 'enzimas digestivas naturales alimentos', 'fibra soluble intestino', 'prebióticos digestión', 'qué comer para digestión lenta', 'hinchazón abdominal alimentación'],
  'irritabilidad':         ['alimentos para el estrés', 'dieta para irritabilidad', 'recetas para calmar el estrés', 'magnesio estrés crónico', 'adaptógenos cortisol alimentación', 'vitaminas B estrés nervioso', 'qué comer cuando estás irritado', 'eje HPA alimentación estrés'],
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const info = SYMPTOMS.find(s => s.slug === slug)
  if (!info) return { title: 'Síntomas — Food·Mood' }

  const canonicalUrl = `https://www.food-mood.app/sintomas/${slug}`
  const title = `${info.titulo} y alimentación — Recetas funcionales | Food·Mood`
  const description = `${info.subtitulo}. ${info.explicacion_cientifica.slice(0, 130)}… Recetas específicas basadas en la ciencia del eje intestino-cerebro.`
  const keywords = [
    ...(SLUG_KEYWORDS[slug] ?? []),
    info.titulo.toLowerCase(),
    'nutrición emocional',
    'eje intestino cerebro',
    'recetas funcionales',
    'Food Mood',
  ].join(', ')

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Food·Mood',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${info.titulo} — Food·Mood` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default async function SymptomDetailPage({ params }: PageProps) {
  const { slug } = await params
  const info = SYMPTOMS.find(s => s.slug === slug)

  if (!info) notFound()

  const supabase = await createClient()

  // 1. Get user and premium status
  const { data: { user } } = await supabase.auth.getUser()
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false

  // 2. Fetch Free Recipe via Semantic Tag Overlap
  let { data: freeRecipe } = await supabase
    .from('recetas')
    .select('*')
    .eq('premium_level', 0)
    .overlaps('tags', info.target_tags)
    .limit(1)
    .single()

  if (!freeRecipe) {
    // Ultimate fallback if tags fail
    const { data: fallback } = await supabase
      .from('recetas')
      .select('*')
      .eq('premium_level', 0)
      .limit(1)
      .single()
    freeRecipe = fallback
  }

  // 3. Fetch all scientifically contextualized recipes via Tag Overlap
  const { data: allRecipes } = isPremium 
    ? await supabase
        .from('recetas')
        .select('*')
        .overlaps('tags', info.target_tags)
        .order('premium_level', { ascending: true })
    : { data: [] }

  const canonicalUrl = `https://www.food-mood.app/sintomas/${slug}`
  const ldJson = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: info.titulo,
      description: info.subtitulo,
      url: canonicalUrl,
      inLanguage: 'es',
      about: { '@type': 'MedicalCondition', name: info.titulo },
      audience: { '@type': 'Patient' },
      publisher: { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      mainContentOfPage: { '@type': 'WebPageElement', cssSelector: 'main' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Síntomas', item: 'https://www.food-mood.app/sintomas' },
        { '@type': 'ListItem', position: 3, name: info.titulo, item: canonicalUrl },
      ],
    },
  ]

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/sintomas" className="inline-flex items-center gap-2 text-aubergine-dark/40 hover:text-aubergine-dark transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Todos los síntomas</span>
        </Link>

        {/* Hero */}
        <div className="mb-20 text-center md:text-left mt-8">
          <h1 className="text-5xl md:text-7xl font-serif text-aubergine-dark mb-6 tracking-tight">{info.titulo}</h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#C9A84C] mb-8 leading-tight max-w-3xl">
            {info.subtitulo}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12 items-start">
            <div className="md:col-span-2 bg-cream/50 border border-aubergine-dark/10 p-8 md:p-12 rounded-2xl">
              <h3 className="flex items-center gap-2 text-xl font-serif text-aubergine-dark mb-6">
                <BookOpen className="w-5 h-5 text-gold" /> Racional Científico
              </h3>
              <p className="text-lg text-aubergine-dark/70 leading-[1.8] font-light italic">
                {info.explicacion_cientifica}
              </p>
              
              <div className="mt-8 pt-8 border-t border-aubergine-dark/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-aubergine-dark/40 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Nota Práctica
                </h4>
                <p className="text-sm text-aubergine-dark/80 font-light leading-relaxed">
                  {info.practical_note}
                </p>
              </div>
            </div>

            <div className="bg-[#1a1118] p-8 md:p-10 rounded-2xl border border-[#C9A84C]/20 shadow-xl">
              <h3 className="text-lg font-serif text-[#C9A84C] mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Activos Clave
              </h3>
              <ul className="space-y-4">
                {info.nutritionFocus.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-cream/80 font-light text-sm border-b border-[#C9A84C]/10 pb-3 last:border-0">
                    <CheckCircle className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="leading-snug">{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Free Recipe Section */}
        {freeRecipe && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-2xl font-serif text-aubergine-dark">Receta recomendada para hoy</h2>
            </div>
            
            <div className="bg-[#F5F0E8] border border-[#6B2737]/20 rounded-2xl overflow-hidden shadow-luxury">
              <div className="p-10 md:p-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 bg-white/50 text-[#6B2737] rounded-md font-bold">
                      Fórmula Gratuita
                    </span>
                    <h3 className="text-4xl md:text-5xl font-serif text-aubergine-dark">
                      {freeRecipe.nombre_es}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-aubergine-dark/40 text-sm font-sans uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4"/> {freeRecipe.dificultad}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-aubergine-dark mb-6 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gold" /> Ingredientes clave
                    </h4>
                    <ul className="space-y-4">
                      {Array.isArray(freeRecipe.ingredientes_es) ? freeRecipe.ingredientes_es.map((ing: string, i: number) => (
                        <li key={i} className="text-aubergine-dark/70 font-light flex items-center gap-3 border-b border-aubergine-dark/5 pb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                          {ing}
                        </li>
                      )) : null}
                    </ul>
                  </div>
                  <div className="bg-white/30 p-8 lg:p-10 rounded-xl border border-white/50">
                    <h4 className="text-lg font-serif font-bold text-aubergine-dark mb-4">Nota Food·Mood</h4>
                    <p className="text-sm text-aubergine-dark/60 leading-[2] font-light italic">
                      {freeRecipe.nota_food_mood_es}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Upsell Section */}
        <section className={`py-20 px-8 ${isPremium ? 'bg-aubergine-dark/5' : 'bg-aubergine-dark'} rounded-3xl text-center relative overflow-hidden transition-all duration-700`}>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className={`text-3xl md:text-5xl font-serif ${isPremium ? 'text-aubergine-dark' : 'text-cream'}`}>
              Hay más recetas específicas para tu {slug.replace('-', ' ')}
            </h2>
            
            {!isPremium ? (
              <>
                <p className="text-cream/60 text-lg font-light leading-relaxed">
                  Desbloquea el mapa completo de nutrición emocional y accede a todas las recetas diseñadas para equilibrar tu {slug.replace('-', ' ')} desde el intestino.
                </p>
                <div className="flex flex-col items-center gap-6 pt-4">
                  <Link href="/pricing" className="bg-[#C9A84C] hover:bg-[#b8953e] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-gold/20 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                    <Lock className="w-5 h-5" />
                    Ver todas las recetas — desde 7€/mes
                  </Link>
                  <p className="text-cream/40 text-sm font-light">
                    O accede con el Plan Trimestral — <span className="text-gold font-medium text-base">7€/mes</span> (21€/3 meses)
                  </p>
                </div>
              </>
            ) : (
              <p className="text-aubergine-dark/50 text-lg">
                Como usuario premium, tienes acceso ilimitado a todas las recetas funcionales.
              </p>
            )}
          </div>
        </section>

        {/* Premium Grid (Visible only for Premium Users) */}
        {isPremium && allRecipes && allRecipes.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-3 mb-12">
              <Sparkles className="w-6 h-6 text-gold" />
              <h2 className="text-3xl font-serif text-aubergine-dark">Tu Biblioteca de {info.titulo}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allRecipes.map((r: any) => (
                <Link key={r.id} href={`/recetas/${r.id}`} className="group block">
                  <div className="bg-cream border border-aubergine-dark/10 p-8 rounded-2xl hover:border-gold/50 transition-all duration-500 shadow-luxury hover:shadow-luxury-hover">
                    <h4 className="text-xl font-serif text-aubergine-dark mb-4 group-hover:text-gold transition-colors">{r.nombre_es}</h4>
                    <p className="text-sm text-aubergine-dark/50 line-clamp-2 italic font-light">{r.nota_food_mood_es}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
    </>
  )
}
