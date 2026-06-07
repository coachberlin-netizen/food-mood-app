import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AccesoPage({ params }: Props) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: reto } = await supabase
    .from('challenges')
    .select('id, title')
    .eq('slug', slug)
    .maybeSingle()

  if (!reto) redirect('/retos')

  // Check access via user_challenges (professional assignment) or legacy reto_purchases (Stripe)
  const { data: enrollment } = await supabase
    .from('user_challenges')
    .select('id')
    .eq('user_id', user.id)
    .eq('challenge_id', reto.id)
    .eq('paid', true)
    .maybeSingle()

  if (!enrollment) redirect(`/retos/${slug}`)

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#F5F0E8' }}>
      <div className="bg-white rounded-2xl p-10 max-w-[440px] w-full text-center border border-[#e8ddd5]">
        <div className="text-5xl mb-4">🏆</div>
        <h1 className="font-serif text-[22px] font-normal mb-2" style={{ color: '#2a1a1e' }}>
          ¡Acceso confirmado!
        </h1>
        <p className="text-[15px] leading-relaxed mb-6" style={{ color: '#7a5c63' }}>
          {reto.title} está listo para empezar.
        </p>

        <div className="rounded-xl p-4 mb-6 text-left" style={{ background: '#f5eaec' }}>
          {[
            '7 días de protocolo mitocondrial',
            'Recetas funcionales con evidencia científica',
            'Registro diario de energía y ánimo',
            'Acceso de por vida al contenido',
            'Informe personalizado al completar',
          ].map(item => (
            <p key={item} className="text-[13px] mb-1.5 flex items-center gap-2"
              style={{ color: '#4a3a3e' }}>
              <span className="font-semibold" style={{ color: '#6B2737' }}>✓</span>
              {item}
            </p>
          ))}
        </div>

        <Link
          href={`/retos/${slug}`}
          className="block w-full py-3.5 rounded-xl text-[15px] font-semibold text-center no-underline"
          style={{ background: '#6B2737', color: '#F5F0E8' }}
        >
          Empezar el Día 1 →
        </Link>
      </div>
    </div>
  )
}
