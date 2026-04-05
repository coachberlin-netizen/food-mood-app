import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Lock, Sparkles, Zap } from "lucide-react"

const datos: Record<string, any> = {
  'cansancio': { emoji:'😴', titulo: 'Cansancio', subtitulo:'Hierro, B12 y adaptógenos para despertar tu energía celular', explicacion:'El cansancio crónico empieza en el intestino: mala absorción de hierro y vitamina B12, inflamación de bajo grado y microbiota poco diversa. Los adaptógenos como ashwagandha y shiitake activan el eje intestino-cerebro para restaurar tu vitalidad.', mood:'Activacion' },
  'ansiedad': { emoji:'😰', titulo: 'Ansiedad', subtitulo:'Triptófano, magnesio y fermentados para calmar tu sistema nervioso', explicacion:'El 95% de la serotonina se produce en el intestino. Cuando tu microbiota está desequilibrada, el sistema nervioso entra en alerta. El triptófano, el magnesio y los fermentados reconectan ese eje y reducen la respuesta ansiosa.', mood:'Calma & Equilibrio' },
  'insomnio': { emoji:'🌙', titulo: 'Insomnio', subtitulo:'GABA, melatonina precursora y digestión calmada para recuperar el sueño', explicacion:'El sueño se regula desde el intestino: el GABA y la melatonina se sintetizan con ayuda de tu microbiota. Una cena inflamatoria o un intestino permeable interrumpen ese proceso. Esta sección prioriza triptófano nocturno y alimentos calmantes.', mood:'Calma & Equilibrio' },
  'hambre-constante': { emoji:'🍽️', titulo: 'Hambre constante', subtitulo:'Fibra, grasas buenas y microbiota saciante para romper el ciclo', explicacion:'El hambre constante no es siempre psicológica. Cuando tu microbiota carece de diversidad, produce menos ácidos grasos de cadena corta que regulan leptina y grelina. Más fibra prebiótica y proteína de calidad reeducan esas señales.', mood:'Reset' },
  'niebla-mental': { emoji:'🧠', titulo: 'Niebla mental', subtitulo:'Omega-3, colina y un intestino que no inflame para pensar con claridad', explicacion:'La niebla mental es frecuentemente inflamación neurológica de bajo grado, alimentada desde el intestino. Los omega-3 (DHA), la colina y los fermentados protegen la barrera intestinal y reducen esa inflamación que nubla el pensamiento.', mood:'Focus' },
  'inflamacion-silenciosa': { emoji:'🔥', titulo: 'Inflamación silenciosa', subtitulo:'Polifenoles, cúrcuma y los 7 colores de la microbiota', explicacion:'La inflamación silenciosa es la raíz de la mayoría de enfermedades crónicas. Se origina en un intestino permeable y microbiota empobrecida. Estrategia Food·Mood: los 7 colores de polifenoles, cúrcuma con pimienta y fermentados para restaurar la barrera intestinal.', mood:'Reset' }
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
        <Link href="/sintomas" className="inline-flex items-center gap-2 text-aubergine-dark/40 hover:text-aubergine-dark transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Todos los síntomas</span>
        </Link>

        {/* Hero */}
        <div className="mb-20 text-center md:text-left">
          <div className="text-7xl mb-8">{info.emoji}</div>
          <h1 className="text-5xl md:text-7xl font-serif text-aubergine-dark mb-6">{info.titulo}</h1>
          <p className="text-xl md:text-2xl font-serif italic text-[#C9A84C] mb-8 leading-tight max-w-3xl">
            {info.subtitulo}
          </p>
          <div className="bg-cream/50 border border-aubergine-dark/10 p-8 md:p-12 rounded-2xl">
            <p className="text-lg text-aubergine-dark/70 leading-[1.8] font-light max-w-4xl italic">
              {info.explicacion}
            </p>
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
                      <CheckCircle2 className="w-5 h-5 text-gold" /> Ingredientes clave
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
          {!isPremium && <div className="absolute inset-0 bg-[url('/images/texture-noise.png')] opacity-20 pointer-events-none" />}
          
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
                    Ver todas las recetas — 9€/mes
                  </Link>
                  <p className="text-cream/40 text-sm font-light">
                    O accede con el Plan Trimestral — <span className="text-gold font-medium text-base">5€/mes</span> (15€/3 meses)
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
  )
}
