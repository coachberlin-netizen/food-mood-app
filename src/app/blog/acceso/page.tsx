import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { GateForm } from './GateForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:  'Acceso al Journal · Food·Mood Lab',
  robots: { index: false, follow: false },
}

const PREVIEW_POSTS = [
  {
    pillar:  'Food & Mood',
    title:   'La comida no solo alimenta',
    excerpt: 'Cómo cada elección alimentaria comunica con el sistema nervioso, el estado emocional y la percepción del entorno.',
  },
  {
    pillar:  'Longevity Hospitality',
    title:   'De spa menu a longevity menu',
    excerpt: 'El salto que están dando los mejores hoteles y retiros del mundo: de la oferta saludable a la propuesta de longevidad con evidencia.',
  },
  {
    pillar:  'Evidence Notes',
    title:   'Qué puede decir un hotel sobre longevidad sin prometer medicina',
    excerpt: 'El límite entre comunicar evidencia y hacer promesas médicas. Una guía práctica para espacios de bienestar.',
  },
]

export default async function BlogAccesoPage() {
  const cookieStore = await cookies()
  if (cookieStore.get('blog_access')?.value === 'ok') {
    redirect('/blog')
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0f0a0d' }}
    >
      {/* Preview de artículos */}
      <div
        className="w-full px-6 py-14"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.42em] mb-8 text-center"
            style={{ color: 'rgba(255,107,53,0.45)' }}
          >
            Journal · Food·Mood Lab · The Longevity Studio
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {PREVIEW_POSTS.map(post => (
              <div
                key={post.title}
                className="rounded-xl px-5 py-5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border:          '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <p
                  className="text-[9px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'rgba(255,107,53,0.55)' }}
                >
                  {post.pillar}
                </p>
                <p
                  className="font-serif text-sm font-semibold leading-snug mb-2"
                  style={{ color: 'rgba(245,240,232,0.85)' }}
                >
                  {post.title}
                </p>
                <p
                  className="text-xs font-light leading-relaxed"
                  style={{ color: 'rgba(245,240,232,0.38)' }}
                >
                  {post.excerpt}
                </p>
              </div>
            ))}
          </div>

          {/* Degradado que indica que hay más */}
          <div
            aria-hidden="true"
            className="h-10 -mt-2 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent, #0f0a0d)',
            }}
          />
        </div>
      </div>

      {/* Gate form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm flex flex-col items-center text-center gap-8">
          <div>
            <h1
              className="font-serif font-semibold text-white leading-tight mb-3"
              style={{ fontSize: 'clamp(1.5rem, 4vw + 0.5rem, 2.2rem)' }}
            >
              Lee el Journal completo
            </h1>
            <p
              className="text-sm font-light leading-relaxed"
              style={{ color: 'rgba(245,240,232,0.45)', maxWidth: '32ch', margin: '0 auto' }}
            >
              Deja tu email para acceder a todos los artículos, o contacta directamente por WhatsApp.
            </p>
          </div>

          <GateForm />
        </div>
      </div>
    </main>
  )
}
