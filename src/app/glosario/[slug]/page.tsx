import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Brain, Dna, FlaskConical, Shuffle, Lock, Sparkles } from "lucide-react"
import { getPremiumStatus } from "@/lib/premium"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('glossary').select('name, tagline').eq('slug', slug).single();
  if (!data) return { title: 'Glosario | Food·Mood' };
  return { title: `${data.name} | Glosario Food·Mood`, description: data.tagline };
}

export default async function GlossaryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch glossary item
  const { data: item } = await supabase
    .from('glossary')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!item) notFound()

  // Premium Check
  const { data: { user } } = await supabase.auth.getUser()
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false

  const isLocked = !isPremium

  return (
    <main className="min-h-screen bg-[var(--background)] pb-32 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link href="/glosario" className="inline-flex items-center gap-2 text-aubergine-dark/50 hover:text-[#6B2737] transition-colors mb-12 font-medium text-sm tracking-wide">
          <ArrowLeft className="w-4 h-4" /> Volver al Glosario
        </Link>

        {/* Content Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {item.category && (
              <span className="px-3 py-1 bg-[#6B2737]/[0.05] text-[#6B2737] rounded-md text-xs font-bold uppercase tracking-widest border border-[#6B2737]/10">
                {item.category}
              </span>
            )}
            {item.moods && item.moods.map((mood: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-md text-xs font-bold uppercase tracking-widest border border-[#FF6B35]/20">
                {mood}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-aubergine-dark mb-6 leading-[1.1]">
            {item.name}
          </h1>
          {item.tagline && (
            <p className="text-2xl md:text-3xl text-aubergine-dark/60 font-serif italic max-w-3xl leading-snug">
              &ldquo;{item.tagline}&rdquo;
            </p>
          )}
        </header>


        {/* Locked State OR Full Content */}
        {isLocked ? (
          <section className="py-24 px-8 md:px-12 bg-[#6B2737] rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/20">
                <Lock className="w-3 h-3" /> Contenido Premium
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-[#F5F0E8] leading-tight">
                Descubre qué hace {item.name.toLowerCase()} en tu cuerpo y en tu ánimo
              </h2>
              <p className="text-[#F5F0E8]/70 text-lg font-light leading-[1.8]">
                Accede a la evidencia científica, las sinergias perfectas y los efectos sobre tu cuerpo y tu ánimo.
              </p>
              <div className="pt-6">
                <Link href="/pricing" className="inline-flex items-center gap-3 bg-[#FF6B35] hover:bg-[#b8953e] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#FF6B35]/20 transition-all transform hover:-translate-y-1">
                  <Sparkles className="w-5 h-5 opacity-80" />
                  Ver planes de acceso
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="space-y-12 md:space-y-16 lg:space-y-24">
            
            {/* Mind & Longevity Grid */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {item.mind_effect && (
                <div className="bg-cream rounded-[2rem] p-8 md:p-10 border border-[#6B2737]/10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-6 flex items-center gap-3">
                    <Brain className="w-5 h-5" /> Para tu mente
                  </h3>
                  <p className="text-lg text-aubergine-dark/80 leading-relaxed font-light">
                    {item.mind_effect}
                  </p>
                </div>
              )}
              {item.longevity_effect && (
                <div className="bg-cream rounded-[2rem] p-8 md:p-10 border border-[#6B2737]/10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B35] mb-6 flex items-center gap-3">
                    <Dna className="w-5 h-5" /> Para tu longevidad
                  </h3>
                  <p className="text-lg text-aubergine-dark/80 leading-relaxed font-light">
                    {item.longevity_effect}
                  </p>
                </div>
              )}
            </div>

            {/* Science Block */}
            {item.science_summary && (
              <section className="border-t border-[#6B2737]/10 pt-16">
                <div className="flex items-center gap-4 mb-8">
                  <FlaskConical className="w-6 h-6 text-[#6B2737]/50" />
                  <h3 className="text-3xl font-serif text-aubergine-dark">La ciencia</h3>
                </div>
                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20">
                  <p className="text-xl text-aubergine-dark/70 font-serif italic leading-[1.8]">
                    {item.science_summary}
                  </p>
                  <div>
                    {item.active_compounds && item.active_compounds.length > 0 && (
                      <div className="mb-10">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737] mb-4">Compuestos Activos</h4>
                        <ul className="space-y-2">
                          {item.active_compounds.map((comp: string, i: number) => (
                            <li key={i} className="text-aubergine-dark/80 bg-white/50 px-4 py-2 rounded-lg border border-[#6B2737]/5 inline-block mr-2 mb-2 font-medium text-sm">
                              {comp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.benefits && item.benefits.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35] mb-4">Propiedades</h4>
                        <ul className="space-y-3">
                          {item.benefits.map((ben: any, i: number) => {
                            const label = typeof ben === 'string' ? ben : ben?.description || ben?.title || ''
                            return (
                              <li key={i} className="text-aubergine-dark/80 font-light flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2 shrink-0" />
                                {label}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Synergies */}
            {item.synergies && item.synergies.length > 0 && (
              <section className="bg-[#6B2737]/[0.02] border border-[#6B2737]/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative">
                <div className="absolute top-0 right-16 w-32 h-1 bg-[#6B2737]/20 rounded-b-md" />
                <div className="flex items-center gap-4 mb-10">
                  <Shuffle className="w-6 h-6 text-[#6B2737]/60" />
                  <h3 className="text-3xl font-serif text-aubergine-dark">Sinergias perfectas</h3>
                </div>
                <div className="space-y-6">
                  {item.synergies.map((syn: any, i: number) => {
                    if (typeof syn === 'string') {
                      return (
                        <div key={i} className="bg-white/60 p-6 rounded-2xl border border-[#6B2737]/5 flex items-center gap-6">
                          <span className="inline-flex items-center gap-2 px-4 py-2 border border-[#6B2737]/20 rounded-full text-[#6B2737] font-bold text-xs uppercase tracking-widest">
                            {syn}
                          </span>
                        </div>
                      )
                    }
                    return (
                      <div key={i} className="bg-white/60 p-6 rounded-2xl border border-[#6B2737]/5 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="shrink-0 pt-1">
                          <Link href={`/glosario/${syn.ingredient}`} className="inline-flex items-center gap-2 px-4 py-2 border border-[#6B2737]/20 rounded-full text-[#6B2737] font-bold text-xs uppercase tracking-widest hover:bg-[#6B2737] hover:text-white transition-all">
                            {String(syn.ingredient).replace(/-/g, ' ')}
                          </Link>
                        </div>
                        <p className="text-aubergine-dark/70 font-light text-lg">
                          {syn.reason}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Related Recipes */}
            {item.food_mood_recipes && item.food_mood_recipes.length > 0 && (
              <section className="pt-8">
                <div className="flex items-center gap-4 mb-10">
                  <Sparkles className="w-6 h-6 text-[#FF6B35]" />
                  <h3 className="text-3xl font-serif text-aubergine-dark">Recetas Food·Mood</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {item.food_mood_recipes.map((recipe: any, i: number) => {
                    if (typeof recipe === 'string') {
                      return (
                        <div key={i} className="bg-cream border border-[#FF6B35]/20 p-6 rounded-2xl flex items-center justify-between">
                          <span className="text-lg font-serif italic text-aubergine-dark capitalize">
                            {recipe}
                          </span>
                        </div>
                      )
                    }
                    return (
                      <Link key={i} href={`/recetas/${recipe.id}`} className="bg-cream border border-[#FF6B35]/20 p-6 rounded-2xl hover:bg-[#FF6B35]/5 transition-colors group flex items-center justify-between">
                        <span className="text-lg font-serif italic text-aubergine-dark group-hover:text-[#6B2737] transition-colors capitalize">
                          {recipe.nombre}
                        </span>
                        <span className="text-[#FF6B35] font-mono text-xl group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  )
}
