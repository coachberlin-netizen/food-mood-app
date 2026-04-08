import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Lock, Sparkles, Zap, BatteryLow, Wind, Moon, UtensilsCrossed, Brain, Flame } from "lucide-react"

export const dynamic = 'force-dynamic'

const datos: Record<string, any> = {
  'cansancio': { icon: BatteryLow, titulo: 'Cansancio', subtitulo:'Nutrición celular para recuperar tu vitalidad profunda', explicacion:'El agotamiento prolongado suele nacer en el intestino: mala absorción de nutrientes, inflamación sutil o una microbiota empobrecida. A través de adaptógenos botánicos y micronutrientes biodisponibles, volvemos a encender tu energía desde la raíz.', mood:'Activación' },
  'ansiedad': { icon: Wind, titulo: 'Ansiedad', subtitulo:'Magnesio, triptófano y fermentados para serenar tu sistema nervioso', explicacion:'El 95% de la serotonina, nuestra hormona del bienestar, se fabrica en el intestino. Cuando este ecosistema se desequilibra, el sistema nervioso reacciona. Utilizamos ingredientes ricos en precursores neuroactivos para reconectar tu eje intestino-cerebro y devolverte la calma.', mood:'Calma & Equilibrio' },
  'insomnio': { icon: Moon, titulo: 'Insomnio', subtitulo:'Ingredientes nocturnos para inducir un descanso reparador', explicacion:'El sueño profundo se gesta en el sistema digestivo. Nutrientes clave se sintetizan gracias a tu microbiota durante la noche. Esta selección prioriza alimentos ricos en GABA y melatonina precursora para acompañar a tu cuerpo hacia un descanso ininterrumpido.', mood:'Calma & Equilibrio' },
  'hambre-constante': { icon: UtensilsCrossed, titulo: 'Hambre Constante', subtitulo:'Fibra prebiótica y grasas saludables para restaurar tu saciedad', explicacion:'Esa sensación constante de apetito rara vez es falta de voluntad. Cuando la microbiota pierde diversidad, se alteran las hormonas que regulan el hambre. Rediseñamos tu plato con macronutrientes saciantes que reeducan dulcemente estas señales biológicas.', mood:'Reset' },
  'niebla-mental': { icon: Brain, titulo: 'Niebla Mental', subtitulo:'Omega-3 vegetal, colina y antioxidantes para pensar con claridad', explicacion:'La falta de concentración suele ser el reflejo de una inflamación neurológica silenciosa. A través de ácidos grasos esenciales y botánicos funcionales, protegemos tu barrera intestinal para despejar tu mente y agudizar tu enfoque.', mood:'Focus' },
  'inflamacion-silenciosa': { icon: Flame, titulo: 'Inflamación Silenciosa', subtitulo:'El poder regenerativo de los polifenoles, especias y fermentados', explicacion:'La inflamación de bajo grado desgasta tu bienestar sin hacer ruido y tiene su origen en la permeabilidad intestinal. La estrategia de Food·Mood utiliza bioactivos funcionales, diversidad de colores y antioxidantes para calmar la inflamación en su origen.', mood:'Reset' }
}

export default async function SymptomDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const info = datos[slug]

  if (!info) notFound()

  const supabase = await createClient()

  // 1. Get user and premium status
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('premium_level').eq('id', user.id).single() : { data: null }
  const isPremium = (profile?.premium_level ?? 0) > 0

  // 2. Fetch Free Recipe (with fallback)
  let { data: freeRecipe } = await supabase
    .from('recetas')
    .select('*')
    .eq('sintoma_tag', slug)
    .eq('premium_level', 0)
    .limit(1)
    .single()

  if (!freeRecipe) {
    const { data: fallback } = await supabase
      .from('recetas')
      .select('*')
      .eq('mood_es', info.mood)
      .eq('premium_level', 0)
      .limit(1)
      .single()
    freeRecipe = fallback
  }

  // 3. Fetch all recipes for symptom if premium
  const { data: allRecipes } = isPremium 
    ? await supabase.from('recetas').select('*').eq('sintoma_tag', slug).order('premium_level', { ascending: true })
    : { data: [] }

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/sintomas" className="inline-flex items-center gap-2 text-[#6B2737]/50 hover:text-[#6B2737] transition-colors mb-16 group outline-none">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium tracking-wide">Todos los síntomas</span>
        </Link>

        {/* Hero */}
        <div className="mb-24">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-[#6B2737]/[0.04] flex items-center justify-center mb-10 border border-[#6B2737]/10 shadow-sm">
            <info.icon className="w-10 h-10 text-[#6B2737] stroke-[1.5]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-aubergine-dark mb-6 leading-[1.1]">{info.titulo}</h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#C9A84C] mb-10 leading-relaxed max-w-3xl">
            {info.subtitulo}
          </p>
          <div className="bg-transparent border-l-[3px] border-[#6B2737]/20 pl-8 md:pl-10 max-w-4xl py-2">
            <p className="text-lg md:text-xl text-aubergine-dark/70 leading-[1.9] font-light">
              {info.explicacion}
            </p>
          </div>
        </div>

        {/* Free Recipe Section */}
        {freeRecipe && (
          <section className="mb-32">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
              <h2 className="text-2xl font-serif text-aubergine-dark">Receta recomendada para hoy</h2>
            </div>
            
            <div className="bg-transparent border border-[#6B2737]/10 rounded-[2.5rem] overflow-hidden">
              <div className="p-10 md:p-14 lg:p-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 bg-[#6B2737]/[0.04] border border-[#6B2737]/10 text-[#6B2737] rounded-md font-bold">
                      Fórmula Gratuita
                    </span>
                    <h3 className="text-4xl md:text-5xl font-serif text-aubergine-dark pt-2">
                      {freeRecipe.nombre_es}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-aubergine-dark/40 text-sm font-sans uppercase tracking-widest mt-2">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4"/> {freeRecipe.dificultad}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
                  <div>
                    <h4 className="text-base uppercase tracking-[0.15em] font-bold text-aubergine-dark mb-8 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#6B2737]" /> Ingredientes clave
                    </h4>
                    <ul className="space-y-5">
                      {Array.isArray(freeRecipe.ingredientes_es) ? freeRecipe.ingredientes_es.map((ing: string, i: number) => (
                        <li key={i} className="text-aubergine-dark/80 font-light flex items-center gap-4 px-2">
                          <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                          {ing}
                        </li>
                      )) : null}
                    </ul>
                  </div>
                  <div className="bg-[#6B2737]/[0.03] p-10 lg:p-12 rounded-[2rem] border border-[#6B2737]/10 relative h-full">
                    <div className="absolute top-0 right-10 w-16 h-1 bg-[#C9A84C]/40 rounded-b-md" />
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#6B2737] mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#C9A84C]/50" /> Nota Food·Mood
                    </h4>
                    <p className="text-[17px] text-aubergine-dark/80 leading-[2.2] font-serif italic">
                      "{freeRecipe.nota_food_mood_es}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Upsell Section */}
        <section className={`py-24 px-8 md:px-12 ${isPremium ? 'bg-[#6B2737]/[0.02] border border-[#6B2737]/10' : 'bg-[#6B2737]'} rounded-[2.5rem] text-center relative overflow-hidden transition-all duration-700`}>
          {!isPremium && <div className="absolute inset-0 bg-[url('/images/texture-noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />}
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className={`text-3xl md:text-5xl font-serif ${isPremium ? 'text-aubergine-dark' : 'text-[#F5F0E8]'} leading-tight`}>
              Aún hay más recetas para aliviar tu {slug.replace('-', ' ')}
            </h2>
            
            {!isPremium ? (
              <>
                <p className="text-[#F5F0E8]/70 text-lg font-light leading-[1.8]">
                  Únete a Food·Mood Premium y descubre la colección completa de recetas diseñadas para restaurar tu equilibrio desde el intestino.
                </p>
                <div className="flex flex-col items-center gap-8 pt-6">
                  <Link href="/pricing" className="bg-[#C9A84C] hover:bg-[#b8953e] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#C9A84C]/20 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                    <Lock className="w-5 h-5 opacity-80" />
                    Ver planes de acceso
                  </Link>
                  <p className="text-[#F5F0E8]/50 text-[13px] tracking-wide font-light">
                    Opciones mensuales y trimestrales disponibles.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-aubergine-dark/50 text-lg font-light">
                Disfruta de acceso ilimitado a todas las recetas funcionales como miembro Premium.
              </p>
            )}
          </div>
        </section>

        {/* Premium Grid (Visible only for Premium Users) */}
        {isPremium && allRecipes && allRecipes.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center gap-3 mb-12">
              <Sparkles className="w-6 h-6 text-[#C9A84C]" />
              <h2 className="text-3xl font-serif text-aubergine-dark">Tu Biblioteca de {info.titulo}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allRecipes.map((r: any) => (
                <Link key={r.id} href={`/recetas/${r.id}`} className="group block outline-none">
                  <div className="bg-transparent border border-[#6B2737]/10 p-10 rounded-[2rem] hover:border-[#6B2737]/25 hover:bg-[#6B2737]/[0.02] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <h4 className="text-xl md:text-2xl font-serif text-aubergine-dark mb-4 group-hover:text-[#6B2737] transition-colors">{r.nombre_es}</h4>
                    <p className="text-[15px] text-aubergine-dark/60 line-clamp-2 italic font-light leading-relaxed">{r.nota_food_mood_es}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
