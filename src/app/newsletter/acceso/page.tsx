import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { GateForm } from './GateForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:  'Acceso al Newsletter · Food·Mood Lab',
  robots: { index: false, follow: false },
}

export default async function NewsletterAccesoPage() {
  const cookieStore = await cookies()
  if (cookieStore.get('newsletter_access')?.value === 'ok') {
    redirect('/newsletter/archivo')
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ backgroundColor: '#0f0a0d' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-8">

        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.42em] mb-5"
            style={{ color: 'rgba(255,107,53,0.55)' }}
          >
            Food·Mood Lab · Newsletter
          </p>
          <h1
            className="font-serif font-semibold text-white leading-tight mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw + 0.8rem, 2.4rem)' }}
          >
            Acceso al Journal
          </h1>
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.45)', maxWidth: '30ch', margin: '0 auto' }}
          >
            Introduce el código de acceso para leer el newsletter de longevidad aplicada.
          </p>
        </div>

        <GateForm />

      </div>
    </main>
  )
}
