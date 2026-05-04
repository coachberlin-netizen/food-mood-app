import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Users, BarChart2, ShoppingBag, Headphones, FileText, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Programa de Bienestar Corporativo | Food·Mood for Work — Nutrición para equipos',
  description:
    'Programa de bienestar laboral de 7 días basado en neurociencia nutricional. Snacks funcionales, tracking de bienestar e informe para RRHH. Mejora el foco, la energía y el rendimiento de tu equipo desde el eje intestino-cerebro. Piloto desde 490€.',
  keywords: [
    'programa bienestar corporativo empresas',
    'corporate wellness España',
    'nutrición laboral equipos',
    'bienestar empleados productividad',
    'programa salud laboral RRHH',
    'snacks funcionales oficina foco',
    'mejorar rendimiento cognitivo trabajo',
    'reducir fatiga mental empleados',
    'eje intestino cerebro rendimiento laboral',
    'programa wellness piloto empresa',
    'bienestar laboral pyme',
    'nutrición funcional trabajo',
  ],
  openGraph: {
    title: 'Food·Mood for Work — Programa de bienestar corporativo basado en neurociencia',
    description: 'Alimenta el foco de tu equipo. 7 días de snacks funcionales, micro-hábitos y tracking de bienestar. Informe agregado para RRHH. Piloto desde 490€.',
    url: 'https://www.food-mood.app/corporate-wellness',
    type: 'website',
  },
  alternates: { canonical: 'https://www.food-mood.app/corporate-wellness' },
  robots: { index: true, follow: true },
}

const DAYS = [
  {
    day: 1, title: 'Energía estable',
    goal: 'Evitar el pico y bajón de media mañana.',
    am: 'Yogur o kéfir natural + avena + frutos rojos + chía.',
    pm: 'Hummus + zanahoria o pepino + aceite de oliva.',
    habit: '3 respiraciones lentas antes del primer café.',
  },
  {
    day: 2, title: 'Focus limpio',
    goal: 'Claridad mental sin exceso de cafeína.',
    am: 'Manzana + crema de almendra o cacahuete 100%.',
    pm: 'Nueces + chocolate negro 85%.',
    habit: '25 minutos de trabajo sin notificaciones.',
  },
  {
    day: 3, title: 'Calma bajo presión',
    goal: 'Regular la respuesta al estrés de reuniones y deadlines.',
    am: 'Plátano pequeño + nueces.',
    pm: 'Crackers integrales + aguacate + limón.',
    habit: 'Pausa de 90 segundos antes de responder mensajes difíciles.',
  },
  {
    day: 4, title: 'Anti-bajón de tarde',
    goal: 'Evitar el cansancio percibido a las 16:00.',
    am: 'Huevo cocido + tomate cherry.',
    pm: 'Kéfir bebible o yogur natural + canela.',
    habit: 'Caminar 5 minutos después de comer.',
  },
  {
    day: 5, title: 'Creatividad y ánimo',
    goal: 'Apoyar la flexibilidad mental y el estado de ánimo.',
    am: 'Tostada integral con tahini y miel.',
    pm: 'Frutos rojos + semillas de calabaza.',
    habit: 'Escribir una idea antes de mirar el móvil.',
  },
  {
    day: 6, title: 'Recuperación',
    goal: 'Bajar la carga mental acumulada de la semana.',
    am: 'Smoothie verde: espinaca, manzana, limón, jengibre.',
    pm: 'Aceitunas + queso fresco o alternativa vegetal.',
    habit: 'Cerrar el día con "qué me drenó / qué me dio energía".',
  },
  {
    day: 7, title: 'Reset inteligente',
    goal: 'Detectar patrones personales de energía y foco.',
    am: 'Bowl de yogur o kéfir + semillas + cacao puro.',
    pm: 'Edamame o garbanzos tostados.',
    habit: 'Revisar el índice Food·Mood de la semana.',
  },
]

const INCLUDES = [
  { icon: ShoppingBag,  text: 'Lista de compra semanal en PDF o dentro de la app' },
  { icon: Zap,          text: '14 snacks funcionales con preparación en menos de 5 minutos' },
  { icon: BarChart2,    text: 'Check-in diario de 30 segundos: energía, foco, estrés, ánimo' },
  { icon: Headphones,   text: 'Mini-audios de 2–3 minutos: foco, respiración, pausa consciente' },
  { icon: FileText,     text: 'Informe final agregado para la empresa, sin datos personales' },
  { icon: Users,        text: 'Página privada del reto para cada empleado participante' },
]

const PLANS = [
  {
    name: 'Pilot Team',
    price: 'desde 490€',
    desc: 'Hasta 25 empleados · 7 días · materiales digitales · lista de compra · informe básico.',
    cta: 'Solicitar piloto',
    highlight: false,
  },
  {
    name: 'Company Challenge',
    price: '12€/empleado',
    desc: 'Desde 25 empleados · tracking individual · informe agregado · personalización con logo.',
    cta: 'Solicitar presupuesto',
    highlight: true,
  },
  {
    name: 'Premium Corporate',
    price: 'desde 1.500€',
    desc: 'Reto + sesión online con Food·Mood + adaptación por tipo de equipo: creativo, ventas, dirección, alta presión.',
    cta: 'Hablar con el equipo',
    highlight: false,
  },
]

const FAQ = [
  {
    q: '¿Necesitan saber cocinar los empleados?',
    a: 'No. Todos los snacks se preparan en menos de 5 minutos con ingredientes de cualquier supermercado. No hay recetas complejas ni equipamiento especial.',
  },
  {
    q: '¿Se adapta a dietas veganas o intolerancias?',
    a: 'Sí. Cada día incluye alternativas sin gluten, sin lácteos y veganas. El reto está diseñado para funcionar con preferencias dietéticas diversas dentro de un mismo equipo.',
  },
  {
    q: '¿Cómo recibe la empresa el informe final?',
    a: 'Al terminar el reto generamos un informe agregado con datos de participación, energía percibida, adherencia y patrones de bajón de tarde. Sin datos individuales sensibles ni identificación de personas.',
  },
  {
    q: '¿Cuánto tiempo requiere al día a cada empleado?',
    a: 'Entre 5 y 10 minutos: 2 minutos de check-in matutino, los snacks durante la jornada y 2 minutos de cierre. El audio es opcional y dura entre 2 y 3 minutos.',
  },
  {
    q: '¿Hacéis factura para la empresa?',
    a: 'Sí. Emitimos factura con todos los datos fiscales necesarios para contabilizarlo como gasto de formación o bienestar laboral.',
  },
]

export default function CorporateWellnessPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>

      {/* ── Hero ── */}
      <section className="py-24 md:py-32 px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6" style={{ color: '#C9A84C' }}>
            Food·Mood for Work · Corporate Wellness
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: '#F5F0E8' }}>
            Alimenta el foco<br />
            <span className="italic font-light">de tu equipo.</span>
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(245,240,232,0.65)' }}>
            Un reto de 7 días con snacks funcionales, listas de compra y micro-hábitos
            para ayudar a tu equipo a trabajar con más claridad, energía estable y bienestar emocional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@food-mood.app?subject=Piloto%20Corporate%20Wellness"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A84C', color: '#2d0f16' }}
            >
              Solicitar piloto para empresa <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#programa"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold border-2 transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(245,240,232,0.2)', color: 'rgba(245,240,232,0.7)' }}
            >
              Ver el programa
            </a>
          </div>
          <p className="mt-8 text-xs font-light" style={{ color: 'rgba(245,240,232,0.3)' }}>
            Sin cocina complicada · Sin ingredientes raros · Sin promesas médicas
          </p>
        </div>
      </section>

      {/* ── Propuesta de valor ── */}
      <section className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
                Por qué funciona
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: '#2d0f16' }}>
                No es una dieta corporativa.<br />
                <span className="italic font-light">Es nutrición aplicada al día laboral.</span>
              </h2>
              <p className="text-base font-light leading-relaxed mb-4" style={{ color: 'rgba(107,39,55,0.6)' }}>
                La mayoría de los programas de bienestar hablan de estrés, sueño o productividad.
                Food·Mood empieza antes: en lo que tu equipo come a las 10:30, a las 16:00 y entre reuniones.
              </p>
              <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.6)' }}>
                El eje intestino-cerebro regula el foco, el ánimo y la energía disponible. Intervenir
                ahí — con snacks reales, no suplementos — es la palanca más directa y sostenible.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                '7 días · 14 snacks · 7 micro-hábitos',
                'Tracking diario con índice Food·Mood',
                'Informe final agregado para RRHH',
                'Adaptable a toda la plantilla',
                'Sin cocina. Supermercado normal.',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl px-5 py-4 border"
                  style={{ borderColor: 'rgba(107,39,55,0.08)', backgroundColor: '#FEFBF4' }}
                >
                  <Check className="w-4 h-4 shrink-0" style={{ color: '#C9A84C' }} />
                  <span className="text-sm font-medium" style={{ color: '#2d0f16' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Activos propietarios / Moat ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#FEFBF4' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Por qué no existe en ningún otro sitio
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#2d0f16' }}>
              Dos activos que no tiene<br />
              <span className="italic font-light">ningún competidor genérico.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Audio library */}
            <div
              className="rounded-2xl p-8 flex flex-col gap-4"
              style={{ backgroundColor: 'white', border: '1px solid rgba(107,39,55,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 shrink-0" style={{ color: '#C9A84C' }} strokeWidth={1.5} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C9A84C' }}>
                  Biblioteca de audio propietaria
                </p>
              </div>
              <h3 className="font-serif text-xl font-bold leading-tight" style={{ color: '#2d0f16' }}>
                7 audios de neurociencia aplicada al contexto laboral
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.6)' }}>
                No son podcasts genéricos de meditación. Son protocolos sonoros diseñados específicamente
                para el día de trabajo: foco entre reuniones, respiración bajo presión, reset de media tarde.
                Contenido propietario que no existe en ningún programa de corporate wellness del mercado.
              </p>
              <div
                className="mt-auto rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-center"
                style={{ backgroundColor: 'rgba(201,168,76,0.08)', color: 'rgba(107,39,55,0.5)' }}
              >
                IP defensible · Barrera de entrada real
              </div>
            </div>

            {/* Food·Mood Index */}
            <div
              className="rounded-2xl p-8 flex flex-col gap-4"
              style={{ backgroundColor: 'white', border: '1px solid rgba(107,39,55,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <BarChart2 className="w-5 h-5 shrink-0" style={{ color: '#C9A84C' }} strokeWidth={1.5} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C9A84C' }}>
                  Índice Food·Mood
                </p>
              </div>
              <h3 className="font-serif text-xl font-bold leading-tight" style={{ color: '#2d0f16' }}>
                7 días de datos generan un patrón personal único
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.6)' }}>
                Cada check-in diario correlaciona lo que comió el empleado, el momento del día,
                el nivel de estrés y el estado de ánimo. Al terminar el reto, cada persona tiene
                su propio mapa de energía y foco. A escala, esto permite personalización predictiva
                que ninguna app de recetas genérica puede ofrecer.
              </p>
              <div
                className="mt-auto rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-center"
                style={{ backgroundColor: 'rgba(201,168,76,0.08)', color: 'rgba(107,39,55,0.5)' }}
              >
                Dataset propietario · Motor de recomendación futuro
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Qué incluye ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Contenido del reto
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#2d0f16' }}>
              7 días. 14 snacks. 1 índice de bienestar.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {INCLUDES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: 'white', borderColor: 'rgba(107,39,55,0.08)' }}
              >
                <Icon className="w-5 h-5 mb-3" style={{ color: '#C9A84C' }} strokeWidth={1.5} />
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.7)' }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impacto medible ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Impacto medible
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#F5F0E8' }}>
              Nutrición que se nota<br />
              <span className="italic font-light">en los números.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                metric: '66%',
                label: 'Más probabilidad de pérdida de productividad en empleados con dieta de bajo valor nutricional',
                source: 'WHO / British Journal of Nutrition',
              },
              {
                metric: '2.500€',
                label: 'Coste anual medio por empleado de absentismo relacionado con fatiga y burnout',
                source: 'EU-OSHA, 2022',
              },
              {
                metric: '↓23%',
                label: 'Reducción de errores cognitivos al estabilizar la glucemia postprandial con snacks de bajo IG',
                source: 'Nutrition Reviews, 2021',
              },
              {
                metric: '3:1',
                label: 'ROI medio por cada euro invertido en programas de nutrición y bienestar corporativo',
                source: 'Harvard Business Review, 2019',
              },
            ].map((stat) => (
              <div
                key={stat.metric}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                <p className="font-serif text-4xl font-black" style={{ color: '#C9A84C' }}>
                  {stat.metric}
                </p>
                <p className="text-sm font-light leading-relaxed flex-1" style={{ color: 'rgba(245,240,232,0.7)' }}>
                  {stat.label}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.25)' }}>
                  {stat.source}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-light mt-10 max-w-xl mx-auto" style={{ color: 'rgba(245,240,232,0.3)' }}>
            No prometemos resultados médicos. Sí un programa diseñado con evidencia para crear hábitos que mejoran la energía, el foco y el bienestar percibido durante la jornada laboral.
          </p>
        </div>
      </section>

      {/* ── Los 7 días ── */}
      <section id="programa" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Programa día a día
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#2d0f16' }}>
              Diseñado para oficinas reales.
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
            {DAYS.map((d) => (
              <div key={d.day} className="flex items-center gap-4 py-4">
                <span
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-black text-white"
                  style={{ backgroundColor: '#4A7B6B' }}
                >
                  {d.day}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>
                    {d.title}
                  </p>
                  <p className="text-xs font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
                    {d.goal}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="mailto:info@food-mood.app?subject=Solicito%20programa%20completo%20Corporate%20Wellness"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: '#4A7B6B', color: 'white' }}
            >
              Solicitar programa completo <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-3 text-xs font-light" style={{ color: 'rgba(107,39,55,0.35)' }}>
              El detalle de recetas, audios y materiales se envía con la propuesta para empresa.
            </p>
          </div>
        </div>
      </section>

      {/* ── Lista de compra ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Lista de compra semanal
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#F5F0E8' }}>
              Todo en un supermercado normal.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Base fresca',
                items: ['Kéfir o yogur natural', 'Frutos rojos', 'Manzanas, plátanos', 'Zanahoria, pepino', 'Tomates cherry', 'Aguacate', 'Espinaca, limón, jengibre'],
              },
              {
                label: 'Proteína / saciedad',
                items: ['Hummus', 'Huevos', 'Edamame o garbanzos', 'Queso fresco o alternativa vegetal'],
              },
              {
                label: 'Grasas buenas',
                items: ['Nueces', 'Semillas de chía y calabaza', 'Crema de almendra 100%', 'Tahini', 'Aceite de oliva'],
              },
              {
                label: 'Energía estable',
                items: ['Avena', 'Crackers integrales', 'Pan integral', 'Cacao puro', 'Chocolate negro 85%', 'Canela'],
              },
            ].map((cat) => (
              <div key={cat.label} className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>
                  {cat.label}
                </p>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="text-xs font-light flex items-start gap-1.5" style={{ color: 'rgba(245,240,232,0.6)' }}>
                      <span style={{ color: '#C9A84C' }}>·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Precios ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#FEFBF4' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              Planes
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#2d0f16' }}>
              Elige el formato que encaja<br />
              <span className="italic font-light">con tu equipo.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-7 border flex flex-col"
                style={{
                  backgroundColor: plan.highlight ? '#2d0f16' : 'white',
                  borderColor: plan.highlight ? 'transparent' : 'rgba(107,39,55,0.1)',
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: plan.highlight ? '#C9A84C' : 'rgba(107,39,55,0.4)' }}
                >
                  {plan.name}
                </p>
                <p
                  className="font-serif text-3xl font-black mb-4"
                  style={{ color: plan.highlight ? '#F5F0E8' : '#2d0f16' }}
                >
                  {plan.price}
                </p>
                <p
                  className="text-sm font-light leading-relaxed mb-8 flex-1"
                  style={{ color: plan.highlight ? 'rgba(245,240,232,0.55)' : 'rgba(107,39,55,0.55)' }}
                >
                  {plan.desc}
                </p>
                <a
                  href={`mailto:info@food-mood.app?subject=${encodeURIComponent(plan.cta + ' — ' + plan.name)}`}
                  className="block w-full py-3 rounded-full text-sm font-bold text-center transition-all hover:opacity-90"
                  style={{
                    backgroundColor: plan.highlight ? '#C9A84C' : 'transparent',
                    color: plan.highlight ? '#2d0f16' : '#2d0f16',
                    border: plan.highlight ? 'none' : '2px solid rgba(107,39,55,0.2)',
                  }}
                >
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-light mt-8" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Emitimos factura. Coste deducible como gasto de formación o bienestar laboral.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-8 text-center" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Preguntas frecuentes
          </p>
          <div className="divide-y" style={{ borderColor: 'rgba(107,39,55,0.08)' }}>
            {FAQ.map((faq) => (
              <div key={faq.q} className="py-5">
                <p className="text-sm font-semibold mb-2" style={{ color: '#2d0f16' }}>{faq.q}</p>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.6)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>
            Empieza con un piloto
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6" style={{ color: '#F5F0E8' }}>
            Tu equipo merece<br />
            <span className="italic font-light">más que fruta en la oficina.</span>
          </h2>
          <p className="text-base font-light mb-10" style={{ color: 'rgba(245,240,232,0.5)' }}>
            Escríbenos y preparamos una propuesta adaptada a tu equipo en 48 horas.
          </p>
          <a
            href="mailto:info@food-mood.app?subject=Quiero%20un%20piloto%20Food·Mood%20for%20Work"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: '#C9A84C', color: '#2d0f16' }}
          >
            Quiero un piloto para mi empresa <ArrowRight className="w-4 h-4" />
          </a>
          <p className="mt-6 text-xs font-light" style={{ color: 'rgba(245,240,232,0.25)' }}>
            No es una dieta. No es un tratamiento. Es nutrición emocional aplicada al trabajo.
          </p>
        </div>
      </section>

      {/* ── Breadcrumb back ── */}
      <div className="py-6 px-6 text-center" style={{ backgroundColor: '#F5F0E8' }}>
        <Link href="/" className="text-xs font-light underline" style={{ color: 'rgba(107,39,55,0.4)' }}>
          ← Volver a Food·Mood
        </Link>
      </div>

      {/* ── Structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Food·Mood for Work — Programa de Bienestar Corporativo',
              description: 'Programa de bienestar laboral de 7 días basado en neurociencia nutricional para equipos de empresa. Snacks funcionales, micro-hábitos, tracking de bienestar e informe agregado para RRHH.',
              provider: {
                '@type': 'Organization',
                name: 'Food·Mood',
                url: 'https://www.food-mood.app',
                email: 'info@food-mood.app',
              },
              serviceType: 'Corporate Wellness',
              areaServed: { '@type': 'Country', name: 'Spain' },
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Pilot Team',
                  price: '490',
                  priceCurrency: 'EUR',
                  description: 'Hasta 25 empleados · 7 días · materiales digitales · lista de compra · informe básico',
                },
                {
                  '@type': 'Offer',
                  name: 'Company Challenge',
                  price: '12',
                  priceCurrency: 'EUR',
                  description: 'Desde 25 empleados · 12€/empleado · tracking individual · informe agregado · personalización con logo',
                  priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: '12',
                    priceCurrency: 'EUR',
                    unitText: 'empleado',
                  },
                },
                {
                  '@type': 'Offer',
                  name: 'Premium Corporate',
                  price: '1500',
                  priceCurrency: 'EUR',
                  description: 'Reto completo + sesión online con Food·Mood + adaptación por tipo de equipo: creativo, ventas, dirección, alta presión',
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            },
          ]),
        }}
      />

    </main>
  )
}
