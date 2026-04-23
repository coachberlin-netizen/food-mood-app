import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Moon, Zap, Leaf, Activity, BookOpen, Headphones, BarChart2 } from 'lucide-react'
import RetosHeroAnimation from './RetosHeroAnimation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Retos de transformación — 7 y 30 días | Food·Mood',
  description: 'Retos de nutrición emocional de 7 y 30 días. Energía, sueño, antiinflamación y salud mental. Recetas funcionales, audios y seguimiento diario. Desde 19€.',
  alternates: { canonical: 'https://www.food-mood.app/retos' },
  openGraph: {
    title: 'Retos de transformación Food·Mood',
    description: 'Un objetivo. Un tiempo. Un camino con datos reales. Retos de nutrición emocional desde 19€.',
    url: 'https://www.food-mood.app/retos',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Retos Food·Mood' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retos de transformación Food·Mood',
    description: 'Energía, sueño, antiinflamación. Desde 19€. Pago único, acceso de por vida.',
  },
}

interface Challenge {
  id:            string
  slug:          string
  title:         string
  subtitle:      string | null
  description:   string | null
  category:      string
  duration_days: number
  price_eur:     number
  color:         string
  emoji:         string
  recipe_count:  number
  audio_count:   number
}

interface Enrollment {
  challenge_id: string
  current_day:  number
  completed:    boolean
  paid:         boolean
}

const SAMPLE_RECIPES: Record<string, string[]> = {
  'recupera-tu-energia':     ['Bol de quinoa con edamame y sésamo', 'Smoothie de remolacha y jengibre', 'Sopa miso con algas wakame'],
  'mejora-tu-sueno':         ['Leche dorada con ashwagandha', 'Arroz integral con champiñones', 'Crema de boniato y nuez moscada'],
  'reset-antiinflamatorio':  ['Curry de lentejas con cúrcuma', 'Salmón al horno con limón', 'Ensalada de espinacas y nueces'],
  'equilibrio-hormonal-45':  ['Bol de linaza y frutos rojos', 'Tempeh salteado con brócoli', 'Infusión de maca y canela'],
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; dot: string }> = {
  'sueño':       { icon: <Moon     size={16} strokeWidth={1.5} />, dot: '#6B2737' },
  'energía':     { icon: <Zap      size={16} strokeWidth={1.5} />, dot: '#C9A84C' },
  'inflamación': { icon: <Leaf     size={16} strokeWidth={1.5} />, dot: '#4A7C59' },
  'hormonas':    { icon: <Activity size={16} strokeWidth={1.5} />, dot: '#8B5E83' },
}

function getCategoryConfig(category: string) {
  return CATEGORY_CONFIG[category.toLowerCase()] ?? { icon: <Leaf size={16} strokeWidth={1.5} />, dot: '#6B2737' }
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(107,39,55,0.1)' }}>
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${Math.max(2, value)}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ChallengeCard({
  challenge,
  enrollment,
}: {
  challenge: Challenge
  enrollment: Enrollment | undefined
}) {
  const pct = enrollment
    ? Math.min(100, ((enrollment.current_day - 1) / challenge.duration_days) * 100)
    : 0
  const cat = getCategoryConfig(challenge.category)

  return (
    <article
      className="bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
      style={{ borderLeftColor: challenge.color }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: challenge.color }}
        >
          {cat.icon}
          {challenge.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-black" style={{ color: '#C9A84C' }}>
            {challenge.price_eur}€
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: challenge.color }}
          >
            {challenge.duration_days === 7 ? '1 semana'
              : challenge.duration_days === 21 ? '3 semanas'
              : `${Math.round(challenge.duration_days / 7)} semanas`}
          </span>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-bold leading-snug mb-1" style={{ color: '#2d0f16' }}>
          {challenge.title}
        </h2>
        {challenge.subtitle && (
          <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.65)' }}>
            {challenge.subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: 'rgba(107,39,55,0.5)' }}>
        <span className="flex items-center gap-1"><BookOpen size={13} strokeWidth={1.5} />{challenge.recipe_count} recetas</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span className="flex items-center gap-1"><Headphones size={13} strokeWidth={1.5} />{challenge.audio_count} audios</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span className="flex items-center gap-1"><BarChart2 size={13} strokeWidth={1.5} />tracking diario</span>
      </div>

      {/* Recipe preview */}
      {SAMPLE_RECIPES[challenge.slug] && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(107,39,55,0.04)', border: '1px solid rgba(107,39,55,0.08)' }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Muestra gratuita · 3 recetas de ejemplo
          </p>
          <ul className="space-y-1">
            {SAMPLE_RECIPES[challenge.slug].map((r) => (
              <li key={r} className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(45,15,22,0.65)' }}>
                <span style={{ color: challenge.color }}>→</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {enrollment?.paid && !enrollment.completed ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: challenge.color }}>
              Día {enrollment.current_day} de {challenge.duration_days}
            </span>
            <span className="text-xs" style={{ color: 'rgba(107,39,55,0.4)' }}>
              {Math.round(pct)}%
            </span>
          </div>
          <ProgressBar value={pct} color={challenge.color} />
          <Link
            href={`/retos/${challenge.slug}`}
            className="mt-1 text-center py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: challenge.color }}
          >
            Continuar →
          </Link>
        </div>
      ) : enrollment?.completed ? (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-green-700">Reto completado</span>
          <Link href={`/retos/${challenge.slug}`} className="text-xs font-bold" style={{ color: '#6B2737' }}>
            Ver informe →
          </Link>
        </div>
      ) : (
        <Link
          href={`/retos/${challenge.slug}`}
          className="block text-center py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 mt-auto"
          style={{ backgroundColor: '#6B2737' }}
        >
          Ver contenido completo →
        </Link>
      )}
    </article>
  )
}

export default async function RetosPage() {
  const supabase = await createClient()

  const [{ data: challengesData }, { data: { user } }] = await Promise.all([
    supabase.from('challenges').select('*').eq('is_active', true).order('created_at'),
    supabase.auth.getUser(),
  ])

  const challenges = (challengesData ?? []) as Challenge[]

  let enrollments: Enrollment[] = []
  if (user) {
    const { data: en } = await supabase
      .from('user_challenges')
      .select('challenge_id, current_day, completed, paid')
      .eq('user_id', user.id)
    enrollments = (en ?? []) as Enrollment[]
  }

  const enrollmentMap = new Map(enrollments.map(e => [e.challenge_id, e]))

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Retos de transformación Food·Mood',
    description: 'Programas de nutrición emocional de 7 y 30 días basados en el eje intestino-cerebro.',
    url: 'https://www.food-mood.app/retos',
    numberOfItems: challenges.length,
    itemListElement: challenges.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      description: c.subtitle ?? undefined,
      url: `https://www.food-mood.app/retos/${c.slug}`,
      offers: {
        '@type': 'Offer',
        price: c.price_eur,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>

        <section aria-label="Animación de retos" className="w-full">
          <RetosHeroAnimation />
        </section>

        <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">

          <section aria-label="Presentación de retos" className="mb-16 text-center">
            <span
              className="text-[11px] font-bold uppercase tracking-[0.2em] block mb-6"
              style={{ color: 'rgba(107,39,55,0.45)' }}
            >
              Transformaciones guiadas · Con ciencia y receta
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-black mb-4 leading-tight" style={{ color: '#2d0f16' }}>
              Elige tu reto.
            </h1>
            <p className="text-lg font-light max-w-xl mx-auto" style={{ color: 'rgba(107,39,55,0.6)' }}>
              Un objetivo. Un tiempo. Un camino con datos reales.
            </p>
          </section>

          <section aria-label="Catálogo de retos" className="grid md:grid-cols-2 gap-6 mb-20">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                enrollment={enrollmentMap.get(challenge.id)}
              />
            ))}
          </section>

          <section
            aria-label="Por qué funcionan los retos"
            className="rounded-3xl p-10 md:p-16 text-center"
            style={{ backgroundColor: '#2d0f16' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Por qué funcionan
            </p>
            <p
              className="font-serif text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              Los retos son el único formato donde la intención se convierte
              en acción sostenida. Porque tienen principio, medio y fin.
            </p>
            <p className="text-sm font-light mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Inicio · Seguimiento diario con tu índice Food·Mood · Informe final
            </p>
          </section>

        </div>
      </main>
    </>
  )
}
