import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: { week: string } }

const CATEGORY_EMOJI: Record<string, string> = {
  neurociencia:  '🧬',
  alimentacion:  '🌿',
  psicologia:    '🧠',
  longevidad:    '🔬',
  biotecnologia: '💊',
}

const CATEGORY_LABEL: Record<string, string> = {
  neurociencia:  'Neurociencia',
  alimentacion:  'Alimentación',
  psicologia:    'Psicología',
  longevidad:    'Longevidad',
  biotecnologia: 'Biotecnología',
}

function formatWeekRange(weekStart: string): string {
  const s   = new Date(weekStart)
  const end = new Date(s)
  end.setDate(s.getDate() + 6)
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString('es-ES', opts)
  return `${fmt(s, { day: 'numeric', month: 'long' })} – ${fmt(end, { day: 'numeric', month: 'long', year: 'numeric' })}`
}

function isoWeekNumber(weekStart: string): number {
  const d    = new Date(weekStart)
  const jan4 = new Date(d.getFullYear(), 0, 4)
  return Math.ceil(((d.getTime() - jan4.getTime()) / 86_400_000 + jan4.getDay() + 1) / 7)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const weekLabel = formatWeekRange(params.week)
  const weekNum   = isoWeekNumber(params.week)
  const canonical = `https://www.food-mood.app/newsletter/${params.week}`
  return {
    title:       `Nº ${weekNum} · ${weekLabel} | Newsletter Food·Mood`,
    description: `Edición semanal Food·Mood: neurociencia, alimentación emocional y longevidad. Semana del ${weekLabel}.`,
    alternates:  { canonical },
    openGraph: {
      title:       `Newsletter Food·Mood · ${weekLabel}`,
      description: `Selección curada de ciencia sobre alimentación, emociones y longevidad.`,
      url:         canonical,
      images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  }
}

export default async function NewsletterEditionPage({ params }: Props) {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('curated_content')
    .select('id, category, title, summary, url')
    .eq('week_start', params.week)
    .eq('status', 'sent')
    .order('category', { ascending: true })

  if (!items || items.length === 0) notFound()

  const weekLabel = formatWeekRange(params.week)
  const weekNum   = isoWeekNumber(params.week)

  // Agrupar por categoría
  const byCat = new Map<string, typeof items>()
  for (const item of items) {
    if (!byCat.has(item.category)) byCat.set(item.category, [])
    byCat.get(item.category)!.push(item)
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
      { '@type': 'ListItem', position: 3, name: `Nº ${weekNum}`, item: `https://www.food-mood.app/newsletter/${params.week}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main className="min-h-screen pb-24" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-2xl mx-auto px-6 pt-12">

          {/* Back */}
          <Link href="/newsletter" className="text-sm font-light hover:underline" style={{ color: 'rgba(107,39,55,0.5)' }}>
            ← Todas las ediciones
          </Link>

          {/* Header */}
          <div className="mt-8 mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(107,39,55,0.4)' }}>
              Edición nº {weekNum}
            </p>
            <h1 className="font-serif text-3xl font-black leading-tight mb-2" style={{ color: '#2d0f16' }}>
              {weekLabel}
            </h1>
            <p className="text-sm font-light" style={{ color: 'rgba(45,15,22,0.4)' }}>
              {items.length} {items.length === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}
            </p>
          </div>

          {/* Contenido por categoría */}
          <div className="flex flex-col gap-10">
            {Array.from(byCat.entries()).map(([cat, catItems]) => (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">{CATEGORY_EMOJI[cat] ?? '●'}</span>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(107,39,55,0.5)' }}>
                    {CATEGORY_LABEL[cat] ?? cat}
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {catItems.map(item => (
                    <article key={item.id} className="bg-white rounded-2xl p-6" style={{ border: '1px solid rgba(45,15,22,0.06)' }}>
                      <h3 className="font-serif text-lg font-bold leading-snug mb-2" style={{ color: '#2d0f16' }}>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer"
                            className="hover:underline" style={{ textDecorationColor: '#C9A84C' }}>
                            {item.title}
                          </a>
                        ) : item.title}
                      </h3>
                      {item.summary && (
                        <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(45,15,22,0.6)' }}>
                          {item.summary}
                        </p>
                      )}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-3 text-[11px] font-bold hover:underline"
                          style={{ color: '#6B2737' }}>
                          Leer artículo →
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Nav ediciones */}
          <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(45,15,22,0.08)' }}>
            <Link href="/newsletter" className="text-sm font-semibold hover:underline" style={{ color: '#6B2737' }}>
              ← Ver todas las ediciones
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
