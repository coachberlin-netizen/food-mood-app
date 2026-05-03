import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsletterGate } from '@/components/newsletter/NewsletterGate'

export const metadata: Metadata = {
  title: 'Archivo de newsletters editoriales | Food·Mood',
  description:
    'Todas las newsletters editoriales de Food·Mood: neurociencia, fermentos, longevidad y microhábitos. Acceso beta exclusivo.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/archivo' },
  robots: { index: false },
}

const NEWSLETTERS = [
  {
    numero:      '01',
    slug:        'slow-food-mood',
    subject:     'Fast life. Slow Food·Mood.',
    description: 'Por qué cocinar despacio calma la ansiedad — fermentos, caldos y el sistema nervioso.',
    tag:         'Ansiedad · Fermentos',
  },
  {
    numero:      '02',
    slug:        'pan-de-masa-madre',
    subject:     'Hay pan. Y luego hay PAN.',
    description: 'La ciencia de la masa madre: fermentación lenta, GABA y el índice glucémico que nadie te contó.',
    tag:         'Fermentación · Microbioma',
  },
  {
    numero:      '03',
    slug:        'salsa-de-tomate-fermentada',
    subject:     'Neuroprotección en tarro.',
    description: 'Salsa de tomate fermentada: licopeno, polifenoles y el plato más antiinflamatorio de tu cocina.',
    tag:         'Neuroprotección · Antioxidantes',
  },
  {
    numero:      '04',
    slug:        'recupera-tu-energia',
    subject:     'El cansancio que no se va con dormir.',
    description: 'Mitocondrias, hierro y los nutrientes detrás de la fatiga crónica que el sueño no arregla.',
    tag:         'Energía · Mitocondrias',
  },
  {
    numero:      '05',
    slug:        'microhabitos',
    subject:     'El hábito que no necesita fuerza de voluntad.',
    description: 'Neurociencia del comportamiento: cómo construir rutinas automáticas sin depender de motivación.',
    tag:         'Hábitos · Neurociencia',
  },
  {
    numero:      '06',
    slug:        'estrobioma',
    subject:     'Tus bacterias gestionan el estrógeno.',
    description: 'El estrobioma, la β-glucuronidasa y cómo el lino molido y los fermentados equilibran tus hormonas.',
    tag:         'Hormonas · Estrobioma',
  },
  {
    numero:      '07',
    slug:        'legumbres-menopausia',
    subject:     'El alimento más completo para tus hormonas.',
    description: 'Legumbres y menopausia: seis mecanismos hormonales en una ración — fitoestrógenos, fibra, proteína, hierro, zinc y folato.',
    tag:         'Hormonas · Fitoestrógenos',
  },
]

function NewsletterList() {
  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-2xl mx-auto px-6 pt-16">

        {/* Back */}
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-10 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(107,39,55,0.5)' }}
        >
          ← Volver al archivo
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Archivo editorial · 5 ediciones
          </p>
          <h1 className="font-serif text-4xl font-black leading-tight mb-4" style={{ color: '#2d0f16' }}>
            Todas las<br />newsletters
          </h1>
          <p className="text-base font-light leading-relaxed max-w-lg" style={{ color: 'rgba(45,15,22,0.55)' }}>
            Neurociencia aplicada, fermentos, longevidad y hábitos. Sin ruido. Sin dietas. Solo ciencia que puedes comer.
          </p>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-4">
          {NEWSLETTERS.map(nl => (
            <Link
              key={nl.slug}
              href={`/newsletter/${nl.slug}`}
              className="group block bg-white rounded-2xl p-6 transition-all hover:shadow-md"
              style={{ border: '1px solid rgba(45,15,22,0.06)' }}
            >
              <div className="flex items-start gap-4">
                {/* Número */}
                <div
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-sm"
                  style={{ backgroundColor: 'rgba(107,39,55,0.07)', color: '#6B2737' }}
                >
                  {nl.numero}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(201,168,76,0.9)' }}>
                    {nl.tag}
                  </p>
                  <p className="text-base font-semibold mb-1.5 leading-snug group-hover:underline"
                    style={{ color: '#2d0f16', textDecorationColor: '#C9A84C' }}>
                    {nl.subject}
                  </p>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(45,15,22,0.5)' }}>
                    {nl.description}
                  </p>
                </div>

                <span className="shrink-0 mt-1 text-sm font-bold transition-transform group-hover:translate-x-0.5" style={{ color: '#C9A84C' }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 rounded-3xl p-10 text-center" style={{ backgroundColor: '#2d0f16' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>
            Cada semana
          </p>
          <p className="font-serif text-xl font-bold mb-2" style={{ color: '#F5F0E8' }}>
            Nueva edición los domingos.
          </p>
          <p className="text-sm font-light" style={{ color: 'rgba(245,240,232,0.5)' }}>
            Activa tu suscripción desde tu perfil de Food·Mood.
          </p>
        </div>

      </div>
    </main>
  )
}

export default function NewsletterArchivoPage() {
  return (
    <NewsletterGate>
      <NewsletterList />
    </NewsletterGate>
  )
}
