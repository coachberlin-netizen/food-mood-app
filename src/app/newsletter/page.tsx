import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Archivo de newsletters | Food·Mood',
  description: 'Todas las ediciones semanales de Food·Mood: neurociencia, alimentación emocional, longevidad y psicobiología. Archivo completo.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter' },
  openGraph: {
    title: 'Archivo de newsletters | Food·Mood',
    description: 'Todas las ediciones semanales de Food·Mood. Neurociencia, alimentación emocional y longevidad.',
    url: 'https://www.food-mood.app/newsletter',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const CATEGORY_EMOJI: Record<string, string> = {
  neurociencia:  '🧬',
  alimentacion:  '🌿',
  psicologia:    '🧠',
  longevidad:    '🔬',
  biotecnologia: '💊',
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

export default async function NewsletterArchivePage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('curated_content')
    .select('week_start, category, sent_at')
    .eq('status', 'sent')
    .order('week_start', { ascending: false })

  // Agrupar por semana
  type Edition = { week_start: string; sent_at: string | null; categories: Set<string>; count: number }
  const editionMap = new Map<string, Edition>()

  for (const row of items ?? []) {
    if (!editionMap.has(row.week_start)) {
      editionMap.set(row.week_start, {
        week_start: row.week_start,
        sent_at:    row.sent_at,
        categories: new Set(),
        count:      0,
      })
    }
    const e = editionMap.get(row.week_start)!
    e.categories.add(row.category)
    e.count++
  }

  const editions = Array.from(editionMap.values())

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main className="min-h-screen pb-24" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-2xl mx-auto px-6 pt-16">

          {/* Header */}
          <div className="mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(107,39,55,0.4)' }}>
              Archivo · Todas las ediciones
            </p>
            <h1 className="font-serif text-4xl font-black leading-tight mb-4" style={{ color: '#2d0f16' }}>
              La newsletter<br />de Food·Mood
            </h1>
            <p className="text-base font-light leading-relaxed max-w-lg" style={{ color: 'rgba(45,15,22,0.55)' }}>
              Cada semana: neurociencia, alimentación emocional, longevidad y psicobiología. Sin ruido. Sin dietas. Solo ciencia que importa.
            </p>
          </div>

          {/* CTA suscripción — acceso a ediciones pasadas */}
          <div
            className="mb-10 rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center gap-6"
            style={{ background: 'linear-gradient(135deg, #2d0f16 0%, #1E1A0E 100%)', border: '1px solid rgba(255,107,53,0.15)' }}
          >
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#FF6B35' }}>
                16 ediciones · Neurociencia aplicada
              </p>
              <h2 className="font-serif text-xl font-bold leading-snug mb-2" style={{ color: '#F5F0E8' }}>
                Come con placer. Crea hábitos.<br />
                <em className="font-serif font-normal" style={{ fontStyle: 'italic', color: '#E8C45A' }}>Siéntete mejor.</em>
              </h2>
              <p className="text-sm font-light leading-relaxed max-w-sm" style={{ color: 'rgba(245,240,232,0.58)' }}>
                Suscríbete y accede a todas las ediciones: fermentos, hormonas, energía, hábitos y mucho más — sin ruido, solo ciencia que puedes comer.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: '#FF6B35', color: '#2d0f16' }}
            >
              Acceder a las 16 ediciones →
            </Link>
          </div>

          {editions.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(45,15,22,0.06)' }}>
              <p className="text-sm font-light" style={{ color: 'rgba(45,15,22,0.4)' }}>
                Las primeras ediciones estarán disponibles pronto.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {editions.map(ed => {
                const weekNum = isoWeekNumber(ed.week_start)
                const cats    = Array.from(ed.categories)
                return (
                  <Link
                    key={ed.week_start}
                    href={`/newsletter/${ed.week_start}`}
                    className="group block bg-white rounded-2xl p-6 transition-all hover:shadow-md"
                    style={{ border: '1px solid rgba(45,15,22,0.06)' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(107,39,55,0.4)' }}>
                          Nº {weekNum}
                        </p>
                        <p className="text-base font-semibold mb-2 leading-snug group-hover:underline" style={{ color: '#2d0f16', textDecorationColor: '#FF6B35' }}>
                          {formatWeekRange(ed.week_start)}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cats.map(cat => (
                            <span key={cat} className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: 'rgba(107,39,55,0.06)', color: 'rgba(107,39,55,0.7)' }}>
                              {CATEGORY_EMOJI[cat] ?? '●'} {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-black font-serif" style={{ color: '#FF6B35' }}>{ed.count}</p>
                        <p className="text-[10px] font-light" style={{ color: 'rgba(45,15,22,0.35)' }}>
                          {ed.count === 1 ? 'ítem' : 'ítems'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* CTA Archivo editorial */}
          <div
            className="mt-14 rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center gap-6"
            style={{ backgroundColor: '#6B2737' }}
          >
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,107,53,0.8)' }}>
                5 ediciones disponibles
              </p>
              <h2 className="font-serif text-xl font-bold leading-snug mb-1" style={{ color: '#F5F0E8' }}>
                Accede a todas las newsletters
              </h2>
              <p className="text-sm font-light" style={{ color: 'rgba(245,240,232,0.55)' }}>
                Fermentos, energía, microhábitos y más — con suscripción o código beta.
              </p>
            </div>
            <Link
              href="/newsletter/archivo"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: '#FF6B35', color: '#2d0f16' }}
            >
              Ver archivo →
            </Link>
          </div>

          {/* Suscripción */}
          <div className="mt-6 rounded-3xl p-10" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#FF6B35' }}>
              Únete
            </p>
            <h2 className="font-serif text-2xl font-bold mb-3 leading-tight" style={{ color: '#F5F0E8' }}>
              Recíbela cada semana.
            </h2>
            <p className="text-sm font-light mb-6 leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
              Gratis para todos los usuarios de Food·Mood. Actívala desde tu perfil.
            </p>
            <Link href="/auth/login"
              className="inline-block px-6 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FF6B35', color: '#2d0f16' }}>
              Crear cuenta gratis →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
