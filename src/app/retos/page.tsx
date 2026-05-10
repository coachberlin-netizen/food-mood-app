import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RetosAnimation } from '@/components/retos/RetosAnimation'

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
}

// ─── Animation palette (mirrors RetosAnimation.tsx CHALLENGES) ────────────────
const PALETTE: Record<string, { bg: string; ink: string; inkSoft: string; accent: string; numeral: string }> = {
  'recupera-tu-energia':    { bg: '#F1E7D4', ink: '#231F17', inkSoft: '#231F1799', accent: '#B85A1F', numeral: '01' },
  'reset-antiinflamatorio': { bg: '#E4EADE', ink: '#1B2218', inkSoft: '#1B221899', accent: '#3F5A37', numeral: '02' },
  'activa-tu-longevidad':   { bg: '#E9D9C7', ink: '#241814', inkSoft: '#24181499', accent: '#7A3A20', numeral: '03' },
  'microhabitos':           { bg: '#DBE0E6', ink: '#15171C', inkSoft: '#15171C99', accent: '#243A5C', numeral: '04' },
  'slow-food-mood':         { bg: '#E5DDE7', ink: '#1F1A23', inkSoft: '#1F1A2399', accent: '#5A4570', numeral: '05' },
  'food-mood-reset':        { bg: '#F0DDCB', ink: '#231510', inkSoft: '#23151099', accent: '#B14F31', numeral: '06' },
  'equilibrio-hormonal-45': { bg: '#E8D4DC', ink: '#241319', inkSoft: '#24131999', accent: '#8C3F5C', numeral: '07' },
  'mejora-tu-sueno':        { bg: '#1F2540', ink: '#F2EAD3', inkSoft: '#F2EAD3AA', accent: '#D6B26C', numeral: '08' },
}

// ─── Data types ───────────────────────────────────────────────────────────────
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

const STATIC_CHALLENGES: Challenge[] = [
  { id: 's1', slug: 'recupera-tu-energia',    title: 'Recupera tu energía',          subtitle: 'Reactiva tu metabolismo con datos reales. Sin déficits, sin fatiga.',                                                         description: null, category: 'Energía',      duration_days: 7,  price_eur: 19, color: '#B85A1F', emoji: '⚡', recipe_count: 7,  audio_count: 3  },
  { id: 's2', slug: 'reset-antiinflamatorio',  title: 'Reset antiinflamatorio',       subtitle: 'Calma silenciosa. Recupera ligereza desde el primer plato.',                                                                 description: null, category: 'Inflamación',  duration_days: 7,  price_eur: 19, color: '#3F5A37', emoji: '🌿', recipe_count: 7,  audio_count: 7  },
  { id: 's3', slug: 'activa-tu-longevidad',    title: 'Activa tu longevidad',         subtitle: 'Hábitos respaldados por evidencia para sumar años con vida.',                                                                description: null, category: 'Longevidad',   duration_days: 10, price_eur: 19, color: '#7A3A20', emoji: '🌱', recipe_count: 10, audio_count: 4  },
  { id: 's4', slug: 'microhabitos',            title: 'Microhábitos',                 subtitle: 'Pequeños gestos diarios. Cambios que sí se sostienen.',                                                                     description: null, category: 'Hábitos',      duration_days: 21, price_eur: 29, color: '#243A5C', emoji: '✨', recipe_count: 21, audio_count: 5  },
  { id: 's5', slug: 'slow-food-mood',          title: 'Slow Food·Mood',               subtitle: 'Comer despacio, pensar despacio. Volver a tu eje.',                                                                          description: null, category: 'Ansiedad',     duration_days: 21, price_eur: 29, color: '#5A4570', emoji: '🍵', recipe_count: 21, audio_count: 7  },
  { id: 's6', slug: 'food-mood-reset',         title: 'Food·Mood Reset',              subtitle: 'Reescribe tu relación con la comida. 21 días, una nueva base.',                                                             description: null, category: 'Salud mental', duration_days: 21, price_eur: 29, color: '#B14F31', emoji: '🧠', recipe_count: 21, audio_count: 21 },
  { id: 's7', slug: 'equilibrio-hormonal-45',  title: 'Equilibrio hormonal 45+',      subtitle: 'Diseñado para tu nueva etapa. Energía, sueño y claridad mental.',                                                          description: null, category: 'Hormonas',     duration_days: 28, price_eur: 29, color: '#8C3F5C', emoji: '🌸', recipe_count: 28, audio_count: 8  },
  { id: 's8', slug: 'mejora-tu-sueno',         title: 'Mejora tu sueño',              subtitle: 'Una rutina nocturna apoyada en cronobiología y nutrición.',                                                                 description: null, category: 'Sueño',        duration_days: 28, price_eur: 29, color: '#D6B26C', emoji: '🌙', recipe_count: 28, audio_count: 4  },
]

const SAMPLE_RECIPES: Record<string, string[]> = {
  'recupera-tu-energia':    ['Bol de quinoa con edamame y sésamo', 'Smoothie de remolacha y jengibre', 'Sopa miso con algas wakame'],
  'mejora-tu-sueno':        ['Leche dorada con ashwagandha', 'Arroz integral con champiñones', 'Crema de boniato y nuez moscada'],
  'reset-antiinflamatorio': ['Curry de lentejas con cúrcuma', 'Salmón al horno con limón', 'Ensalada de espinacas y nueces'],
  'equilibrio-hormonal-45': ['Desayuno de lino y frutos rojos', 'Tempeh salteado con brócoli y sésamo', 'Caldo de kombu con shiitake y miso'],
  'food-mood-reset':        ['Caldo de huesos con verduras fermentadas', 'Bol de kéfir con nueces y cacao puro', 'Lentejas rojas con cúrcuma y espinacas'],
  'slow-food-mood':         ['Agua viva de pepino, menta y jengibre', 'Yogur artesano (fermentación 10h)', 'Pan de espelta con levado lento'],
}

function durationLabel(days: number) {
  if (days === 7)  return '1 semana'
  if (days === 10) return '10 días'
  if (days === 21) return '21 días'
  if (days === 28) return '4 semanas'
  return `${days} días`
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function ChallengeCard({ challenge, enrollment }: { challenge: Challenge; enrollment: Enrollment | undefined }) {
  const pal = PALETTE[challenge.slug] ?? { bg: '#F1E7D4', ink: '#231F17', inkSoft: '#231F1799', accent: '#B85A1F', numeral: '—' }
  const pct = enrollment ? Math.min(100, ((enrollment.current_day - 1) / challenge.duration_days) * 100) : 0

  return (
    <article
      className="relative overflow-hidden rounded-2xl flex flex-col"
      style={{ backgroundColor: pal.bg, color: pal.ink }}
    >
      {/* Numeral watermark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-4 top-1/2 -translate-y-1/2 leading-none"
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontStyle: 'italic',
          fontSize: 'clamp(80px, 18vw, 160px)',
          color: pal.accent,
          opacity: 0.08,
          lineHeight: 1,
        }}
      >
        {pal.numeral}
      </span>

      <div className="relative flex flex-col gap-5 p-7 flex-1">
        {/* Tag row */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.32em]"
            style={{ color: pal.accent }}
          >
            {challenge.category} · {durationLabel(challenge.duration_days)}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: pal.accent + '18', color: pal.accent }}
          >
            {challenge.price_eur}€
          </span>
        </div>

        {/* Title */}
        <h2
          className="leading-[0.95] tracking-tight"
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: pal.ink,
          }}
        >
          {challenge.title}
        </h2>

        {/* Subtitle */}
        {challenge.subtitle && (
          <p className="text-sm font-light leading-relaxed" style={{ color: pal.inkSoft }}>
            {challenge.subtitle}
          </p>
        )}

        {/* Recipe samples */}
        {SAMPLE_RECIPES[challenge.slug] && (
          <div className="flex flex-col gap-1.5">
            <p
              className="text-[9px] font-bold uppercase tracking-[0.28em] mb-0.5"
              style={{ color: pal.accent + 'cc' }}
            >
              Muestra de recetas
            </p>
            {SAMPLE_RECIPES[challenge.slug].map(r => (
              <span key={r} className="flex items-center gap-2 text-[11px] font-light" style={{ color: pal.inkSoft }}>
                <span style={{ color: pal.accent, fontSize: 10 }}>→</span>
                {r}
              </span>
            ))}
          </div>
        )}

        {/* Progress / CTA */}
        <div className="mt-auto pt-2">
          {enrollment?.paid && !enrollment.completed ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs" style={{ color: pal.inkSoft }}>
                <span style={{ color: pal.accent }}>Día {enrollment.current_day} de {challenge.duration_days}</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="w-full h-px rounded-full" style={{ backgroundColor: pal.accent + '25' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pal.accent }} />
              </div>
              <Link
                href={`/retos/${challenge.slug}`}
                className="text-center py-3 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
                style={{ backgroundColor: pal.accent, color: pal.bg }}
              >
                Continuar →
              </Link>
            </div>
          ) : enrollment?.completed ? (
            <div className="flex items-center">
              <span className="text-xs font-semibold" style={{ color: pal.accent }}>Completado ✓</span>
            </div>
          ) : (
            <Link
              href={`/retos/${challenge.slug}`}
              className="block text-center py-3 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: pal.accent, color: pal.bg }}
            >
              Ver el reto completo →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function RetosPage() {
  const supabase = await createClient()

  const [{ data: challengesData }, { data: { user } }] = await Promise.all([
    supabase.from('challenges').select('*').eq('is_active', true).order('created_at'),
    supabase.auth.getUser(),
  ])

  const challenges = ((challengesData ?? []) as Challenge[]).length > 0
    ? (challengesData as Challenge[])
    : STATIC_CHALLENGES

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
    description: 'Programas de nutrición emocional de 7 a 28 días basados en el eje intestino-cerebro.',
    url: 'https://www.food-mood.app/retos',
    numberOfItems: challenges.length,
    itemListElement: challenges.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      description: c.subtitle ?? undefined,
      url: `https://www.food-mood.app/retos/${c.slug}`,
      offers: { '@type': 'Offer', price: c.price_eur, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <main style={{ backgroundColor: '#0b0b0a', minHeight: '100vh' }}>

        {/* ── Animation hero ── */}
        <RetosAnimation />

        {/* ── Header editorial ── */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-4">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.38em] mb-5"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter Tight", sans-serif' }}
          >
            Elige tu reto
          </p>
          <h1
            className="leading-[0.94] tracking-tight mb-6"
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontWeight: 400,
              fontSize: 'clamp(40px, 6vw, 72px)',
              color: '#F2EAD3',
            }}
          >
            Un objetivo.<br />
            <em style={{ color: '#C9A84C' }}>Un punto de partida.</em>
          </h1>
          <p
            className="text-base font-light max-w-lg"
            style={{ color: 'rgba(242,234,211,0.45)', fontFamily: '"Inter Tight", sans-serif' }}
          >
            8 caminos guiados. Datos reales. Pago único desde 19€ — sin renovación automática.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-4">
            {challenges.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                enrollment={enrollmentMap.get(c.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div
          className="border-t py-10 text-center"
          style={{ borderColor: 'rgba(242,234,211,0.06)' }}
        >
          <p
            className="text-[11px] font-light tracking-widest uppercase"
            style={{ color: 'rgba(242,234,211,0.25)', fontFamily: '"Inter Tight", sans-serif' }}
          >
            food·mood · retos de transformación · desde 19€ · pago único · sin renovación automática
          </p>
        </div>

      </main>
    </>
  )
}
