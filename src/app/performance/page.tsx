'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type Estado = 'agotado' | 'inflamado' | 'energia' | 'recuperacion'

const recipes: Record<Estado, { category: string; title: string; why: string; ingredients: string[] }> = {
  agotado: {
    category: 'Recuperacion energetica',
    title: 'Caldo mineral con adaptogenos y proteina de colageno',
    why: 'El ejercicio intenso agota el glucogeno y eleva el cortisol. Este caldo repone minerales perdidos por el sudor, el colageno repara tejido conectivo y la ashwagandha regula la respuesta al estres fisico.',
    ingredients: ['Caldo de huesos (500ml)', 'Ashwagandha en polvo (1 cdta)', 'Jengibre fresco rallado', 'Curcuma con pimienta negra', 'Colageno hidrolizado (15g)', 'Sal del Himalaya'],
  },
  inflamado: {
    category: 'Anti-inflamacion activa',
    title: 'Salmon con salsa de curcuma y semillas antiinflamatorias',
    why: 'Los omega-3 del salmon inhiben las prostaglandinas proinflamatorias. La curcuma con piperina bloquea el NF-kB. Las semillas aportan zinc y magnesio para la recuperacion muscular.',
    ingredients: ['Salmon salvaje (150g)', 'Curcuma fresca o en polvo', 'Pimienta negra', 'Semillas de canamo (2 cdas)', 'Aguacate medio', 'Aceite de oliva virgen extra', 'Rucula fresca'],
  },
  energia: {
    category: 'Activacion y rendimiento',
    title: 'Batido verde de adaptogenos con carbohidratos inteligentes',
    why: 'El platano aporta potasio y glucosa de liberacion media. La maca eleva la resistencia fisica y reduce la fatiga. La espirulina aporta hierro biodisponible y B12 para energia celular.',
    ingredients: ['Platano maduro (1)', 'Espinacas baby (punado)', 'Maca en polvo (1 cdta)', 'Espirulina (media cdta)', 'Leche de avena sin azucar', 'Datiles Medjool (2)', 'Cacao puro (1 cdta)'],
  },
  recuperacion: {
    category: 'Descanso reparador',
    title: 'Bowl de kefir con proteina suave, magnesio y fermentados',
    why: 'El magnesio activa mas de 300 reacciones enzimaticas de recuperacion. El kefir aporta probioticos que reducen la inflamacion intestinal post-ejercicio.',
    ingredients: ['Kefir natural (200ml)', 'Semillas de calabaza (magnesio)', 'Proteina de canamo (20g)', 'Platano en rodajas', 'Canela de Ceilan', 'Miel cruda (1 cdta)', 'Nueces (punado)'],
  },
}

const estados = [
  { key: 'agotado' as Estado, label: 'Agotado', desc: 'Sin energia despues de entrenar' },
  { key: 'inflamado' as Estado, label: 'Inflamado', desc: 'Musculos pesados, articulaciones que protestan' },
  { key: 'energia' as Estado, label: 'Con energia', desc: 'Quiero mas. Lista para darlo todo' },
  { key: 'recuperacion' as Estado, label: 'Recuperacion', desc: 'Dia de descanso activo' },
]

const disciplines = ['Psicologia', 'Psicologia de la alimentacion', 'Longevidad', 'Fitness y rendimiento', 'Coaching nutricional', 'Biotecnologia alimentaria']

export default function PerformancePage() {
  const [selected, setSelected] = useState<Estado | null>(null)
  const recipe = selected ? recipes[selected] : null

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4" style={{ background: '#4A1A26' }}>
        <Link href="/" style={{ color: '#F5F0E8', fontFamily: 'serif', fontSize: 20 }}>
          Food<span style={{ color: '#C9A84C' }}>.</span>Mood
        </Link>
        <Link href="/" style={{ color: '#F5F0E8', fontSize: 14, opacity: 0.7 }}>Volver</Link>
      </nav>

      <section className="pt-36 pb-20 px-10 text-center" style={{ background: 'linear-gradient(180deg, #4A1A26 0%, #6B2737 55%, #F5F0E8 100%)' }}>
        <p style={{ color: '#C9A84C', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>Food Mood Performance</p>
        <h1 style={{ color: '#F5F0E8', fontFamily: 'serif', fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.1, marginBottom: 20 }}>
          Como esta tu cuerpo ahora mismo?
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.75)', fontSize: 17, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Una pregunta. Una receta disenada exactamente para lo que necesitas.
        </p>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '20px 40px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B5560', marginBottom: 28 }}>Elige tu estado</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {estados.map((e) => (
            <button
              key={e.key}
              onClick={() => setSelected(e.key)}
              style={{
                background: selected === e.key ? '#6B2737' : '#FDFAF5',
                border: selected === e.key ? '2px solid #C9A84C' : '2px solid transparent',
                borderRadius: 16, padding: '28px 20px 24px', textAlign: 'center', cursor: 'pointer',
                transform: selected === e.key ? 'translateY(-6px)' : 'translateY(0)', transition: 'all 0.25s',
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: selected === e.key ? 'rgba(245,240,232,0.12)' : 'rgba(107,39,55,0.08)', color: selected === e.key ? '#C9A84C' : '#6B2737', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {e.key === 'agotado' && <><circle cx="14" cy="14" r="6"/><path d="M14 4v4M14 20v4M4 14h4M20 14h4"/></>}
                  {e.key === 'inflamado' && <path d="M14 5c0 0-6 4.5-6 9.5a6 6 0 0 0 12 0c0-2.5-1.5-4.5-1.5-4.5s-1 2.5-2.5 3.5c0 0 1-4-2-8.5z"/>}
                  {e.key === 'energia' && <path d="M15.5 5L9.5 15.5h5.5l-2.5 7.5 10-13h-6.5L15.5 5z"/>}
                  {e.key === 'recuperacion' && <><path d="M21 14.5A7 7 0 1 1 14 7"/><path d="M14 7l3 3-3 3"/></>}
                </svg>
              </div>
              <span style={{ display: 'block', fontFamily: 'serif', fontSize: 17, color: selected === e.key ? '#F5F0E8' : '#6B2737', marginBottom: 6 }}>{e.label}</span>
              <span style={{ fontSize: 12, color: selected === e.key ? 'rgba(245,240,232,0.7)' : '#6B5560' }}>{e.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {recipe && (
          <motion.section key={selected} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.4 }} style={{ maxWidth: 780, margin: '0 auto', padding: '0 40px 40px' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: '#FDFAF5' }}>
              <div style={{ background: '#6B2737', padding: '32px 36px 28px' }}>
                <p style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{recipe.category}</p>
                <h3 style={{ color: '#F5F0E8', fontFamily: 'serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 400 }}>{recipe.title}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '32px 36px' }}>
                <div>
                  <h4 style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Por que funciona</h4>
                  <p style={{ fontSize: 14, color: '#6B5560', lineHeight: 1.7 }}>{recipe.why}</p>
                </div>
                <div>
                  <h4 style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Lo que necesitas</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < recipe.ingredients.length - 1 ? '0.5px solid #EAE3D5' : 'none', fontSize: 14, color: '#2C1A20' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />{ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ maxWidth: 780, margin: '0 auto', padding: '0 40px 40px' }}>
            <div style={{ background: '#EAE3D5', borderRadius: 20, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#6B5560', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Quien hay detras</p>
              <h3 style={{ color: '#4A1A26', fontFamily: 'serif', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400, marginBottom: 14 }}>No es una app de recetas. Es un equipo de expertos.</h3>
              <p style={{ fontSize: 14, color: '#6B5560', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>Cada receta validada por un equipo multidisciplinar con una obsesion: que lo que comes cambie como te sientes.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
                {disciplines.map((d) => (
                  <span key={d} style={{ background: '#FDFAF5', border: '1px solid rgba(107,39,55,0.15)', borderRadius: 50, padding: '8px 18px', fontSize: 13, color: '#6B2737', fontWeight: 500 }}>{d}</span>
                ))}
              </div>
              <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: 15, color: '#6B2737', opacity: 0.75 }}>La nutricion funcional no va de contar calorias. Va de entender lo que tu cuerpo te esta diciendo.</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ maxWidth: 780, margin: '0 auto', padding: '0 40px 80px' }}>
            <div style={{ background: '#4A1A26', borderRadius: 20, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#C9A84C', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>40 recetas - 4 estados - Acceso inmediato</p>
              <h2 style={{ color: '#F5F0E8', fontFamily: 'serif', fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 400, marginBottom: 12 }}>Tu cuerpo entrena cada dia. Tu nutricion tambien deberia.</h2>
              <p style={{ color: 'rgba(245,240,232,0.65)', fontSize: 14, maxWidth: 420, margin: '0 auto 32px' }}>Accede a todas las recetas de recuperacion, energia, anti-inflamacion y descanso.</p>
              <Link href="/pricing" style={{ display: 'inline-block', background: '#C9A84C', color: '#4A1A26', padding: '16px 40px', borderRadius: 50, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                Empieza 7 dias gratis
              </Link>
              <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: 12, marginTop: 16 }}>Despues 9 EUR/mes - Sin permanencia - Cancela cuando quieras</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <p style={{ textAlign: 'center', padding: '0 40px 40px', fontSize: 11, color: '#9A8A8F', maxWidth: 600, margin: '0 auto' }}>
        Food Mood es una herramienta de conocimiento personal y nutricion funcional. No ofrece diagnostico, tratamiento ni terapia.
      </p>
    </div>
  )
}
