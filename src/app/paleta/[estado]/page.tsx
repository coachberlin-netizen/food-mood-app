import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Clock, Leaf, FlaskConical } from 'lucide-react'

type Nutrient = { name: string; benefit: string; foods: string }
type Recipe   = { name: string; description: string; time: string }
type FAQ      = { q: string; a: string }

type EstadoData = {
  slug: string
  titulo: string
  color: string
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  science: string
  nutrients: Nutrient[]
  recipes: Recipe[]
  faq: FAQ[]
  related: string[]
}

const ESTADOS: Record<string, EstadoData> = {
  ansiedad: {
    slug: 'ansiedad',
    titulo: 'Ansiedad',
    color: '#7A5AAA',
    metaTitle: 'Ansiedad y alimentación: qué comer para calmar el eje intestino-cerebro | Food·Mood',
    metaDescription: 'Tu intestino siente la ansiedad antes que tu mente. Descubre los alimentos que calman el sistema nervioso y equilibran la microbiota cuando estás ansioso.',
    headline: 'Tu intestino siente la ansiedad antes que tu cabeza.',
    subheadline: 'El cortisol que activa la ansiedad altera directamente tu microbiota. Hay alimentos que interrumpen ese bucle en minutos.',
    science: 'Cuando la ansiedad se activa, tu cuerpo libera cortisol — y el cortisol inflama el revestimiento intestinal, reduce la diversidad microbiana y frena la producción de serotonina. El resultado: más ansiedad. Más cortisol. Un bucle que la mente sola no puede romper. La nutrición es la palanca más directa para interrumpirlo desde el intestino.',
    nutrients: [
      { name: 'Magnesio', benefit: 'Calma el sistema nervioso y regula el cortisol', foods: 'Semillas de calabaza, almendras, chocolate negro +70%' },
      { name: 'L-teanina', benefit: 'Aumenta las ondas alfa cerebrales sin sedación', foods: 'Té verde, matcha' },
      { name: 'Triptófano', benefit: 'Precursor directo de la serotonina intestinal', foods: 'Kéfir, plátano, pavo, huevo' },
      { name: 'Probióticos', benefit: 'Restauran la microbiota alterada por el estrés agudo', foods: 'Kéfir, yogur natural, miso, chucrut' },
    ],
    recipes: [
      { name: 'Batido de kéfir, plátano y almendras', description: 'Triptófano + magnesio + probióticos en un vaso. 3 minutos.', time: '3 min' },
      { name: 'Sopa de miso con tofu y algas wakame', description: 'Umami profundo con probióticos naturales y minerales calmantes.', time: '10 min' },
      { name: 'Infusión de ashwagandha y menta con miel cruda', description: 'Adaptógeno clásico para modular la respuesta al estrés crónico.', time: '5 min' },
    ],
    faq: [
      { q: '¿Qué alimentos empeoran la ansiedad?', a: 'El azúcar refinado, el alcohol y el exceso de cafeína disparan el cortisol y alteran la microbiota. Reducirlos — especialmente por la tarde — tiene un efecto directo y medible en los niveles de ansiedad.' },
      { q: '¿Cuánto tarda en notarse el cambio con la alimentación?', a: 'Los estudios muestran cambios en la microbiota en 72 horas con una dieta consistente en fermentados y fibra prebiótica. Cambios en el estado de ánimo: entre 3 y 7 días.' },
      { q: '¿Esto sustituye al tratamiento médico para la ansiedad?', a: 'No. La nutrición es una herramienta de bienestar complementaria, no un tratamiento. Si tienes ansiedad diagnosticada, consulta siempre a un profesional sanitario cualificado.' },
    ],
    related: ['estres', 'agotamiento'],
  },
  melancolia: {
    slug: 'melancolia',
    titulo: 'Melancolía',
    color: '#4A7AB5',
    metaTitle: 'Melancolía y alimentación: nutrición para el estado de ánimo bajo | Food·Mood',
    metaDescription: 'La melancolía tiene su propia bioquímica. Descubre los alimentos que elevan la dopamina y el omega-3 cerebral cuando el ánimo está bajo.',
    headline: 'La melancolía no es tristeza. Es información que tu cuerpo necesita.',
    subheadline: 'El omega-3 EPA reduce la inflamación neural. La vitamina D activa los receptores de serotonina. Hay alimentos que trabajan donde los pensamientos no llegan.',
    science: 'En estados melancólicos, el cerebro muestra menos actividad en el córtex prefrontal y más inflamación de bajo grado. El omega-3 EPA — presente en el pescado azul — es el compuesto natural más estudiado para reducir esa inflamación neural. La vitamina D activa directamente los genes que controlan la síntesis de serotonina y dopamina. Nutrientes que actúan donde la mente sola no puede llegar.',
    nutrients: [
      { name: 'Omega-3 EPA/DHA', benefit: 'Reduce la neuroinflamación y apoya la función sináptica', foods: 'Sardinas, caballa, salmón salvaje, semillas de chía' },
      { name: 'Vitamina D', benefit: 'Activa la síntesis de serotonina y dopamina directamente', foods: 'Exposición solar, huevo, sardinas, setas shiitake' },
      { name: 'Zinc', benefit: 'Cofactor clave en la producción de neurotransmisores', foods: 'Ostras, semillas de calabaza, legumbres, carne roja magra' },
      { name: 'Triptófano + carbohidratos complejos', benefit: 'El carbohidrato facilita el paso del triptófano al cerebro', foods: 'Avena con plátano, boniato, lentejas' },
    ],
    recipes: [
      { name: 'Ceviche de sardinas con aguacate y limón', description: 'Omega-3 + vitamina D + grasa saludable. Antiinflamatorio potente en crudo.', time: '15 min' },
      { name: 'Bol de avena con plátano, nueces y cacao puro', description: 'Triptófano + carbohidrato + magnesio. El desayuno que prepara al cerebro.', time: '8 min' },
      { name: 'Sopa de lentejas rojas con cúrcuma y jengibre', description: 'Zinc + antiinflamatorios + proteína vegetal completa.', time: '25 min' },
    ],
    faq: [
      { q: '¿Puede la alimentación mejorar el estado de ánimo bajo?', a: 'Sí — hay más de 40 ensayos clínicos que muestran que dietas ricas en omega-3, probióticos y vitaminas del grupo B reducen síntomas de estado de ánimo bajo en personas sin diagnóstico clínico.' },
      { q: '¿Qué pasa con el chocolate y la melancolía?', a: 'El chocolate negro +70% contiene flavonoides que aumentan el flujo sanguíneo cerebral y pequeñas cantidades de anandamida. El efecto es real pero modesto — y depende de comerlo fuera del pico de cortisol.' },
      { q: '¿La melancolía es lo mismo que la depresión clínica?', a: 'No. La melancolía es un estado emocional normal que responde bien a la nutrición. La depresión clínica es una condición médica que requiere atención profesional. Este contenido es solo para bienestar general.' },
    ],
    related: ['ansiedad', 'agotamiento'],
  },
  estres: {
    slug: 'estres',
    titulo: 'Estrés',
    color: '#E8703A',
    metaTitle: 'Estrés y alimentación: qué comer para regular el cortisol | Food·Mood',
    metaDescription: 'Bajo estrés crónico, hasta la ensalada más sana puede inflamar. Descubre los alimentos adaptógenos y antiinflamatorios que regulan el cortisol.',
    headline: 'Bajo estrés, tu cuerpo digiere mal incluso lo saludable.',
    subheadline: 'El cortisol crónico aumenta la permeabilidad intestinal. Los adaptógenos y los fermentados son los compuestos más estudiados para cortar ese ciclo.',
    science: 'El estrés crónico eleva el cortisol de forma sostenida, lo que aumenta la permeabilidad del intestino — el llamado "leaky gut" — permite que fragmentos bacterianos entren al torrente sanguíneo y activa una inflamación sistémica de bajo grado. Esa inflamación afecta al cerebro, reduce la claridad mental y baja el umbral del propio estrés. Es un bucle que la nutrición puede interrumpir en ambos extremos del eje.',
    nutrients: [
      { name: 'Adaptógenos', benefit: 'Modulan la respuesta del eje HPA al estrés crónico', foods: 'Ashwagandha, rhodiola, maca, reishi' },
      { name: 'Vitamina C', benefit: 'Reduce el cortisol sérico después de situaciones de estrés agudo', foods: 'Pimientos rojos, kiwi, fresas, brócoli' },
      { name: 'Magnesio', benefit: 'Antagonista natural del cortisol en el receptor NMDA', foods: 'Chocolate negro, semillas de calabaza, verduras de hoja verde' },
      { name: 'Fermentados', benefit: 'Reparan la permeabilidad intestinal inducida por el estrés', foods: 'Kéfir, kimchi, chucrut, yogur de cabra' },
    ],
    recipes: [
      { name: 'Sopa antiinflamatoria de cúrcuma y jengibre', description: 'Curcumina + gingerol: los dos antiinflamatorios más estudiados del reino vegetal.', time: '20 min' },
      { name: 'Bol de quinoa con verduras asadas y tahini', description: 'Aminoácidos completos + fibra prebiótica + grasas saludables.', time: '30 min' },
      { name: 'Smoothie verde de espinacas, kiwi y pepino', description: 'Vitamina C + magnesio + hidratación celular profunda.', time: '5 min' },
    ],
    faq: [
      { q: '¿El café aumenta el estrés?', a: 'En personas con estrés crónico, la cafeína puede elevar adicionalmente el cortisol matutino y amplificar los síntomas. Limitar a 1-2 tazas antes del mediodía tiene un efecto medible en los niveles basales de cortisol.' },
      { q: '¿Los adaptógenos realmente funcionan?', a: 'Hay evidencia sólida para ashwagandha (reducción de cortisol de hasta un 27% en ensayos controlados) y moderada para rhodiola. Son seguros en personas sanas, pero conviene consultarlos si se toman medicamentos.' },
      { q: '¿Cuánto tiempo tarda en regularse el cortisol con la dieta?', a: 'Con cambios consistentes — reducir azúcar, aumentar fermentados y adaptógenos — se observan cambios en marcadores de estrés en 4-8 semanas.' },
    ],
    related: ['ansiedad', 'agotamiento'],
  },
  agotamiento: {
    slug: 'agotamiento',
    titulo: 'Agotamiento',
    color: '#5A9B8A',
    metaTitle: 'Agotamiento y alimentación: nutrición para recuperar la energía real | Food·Mood',
    metaDescription: 'El agotamiento profundo empieza en las mitocondrias. Descubre los alimentos que recargan la energía celular y restauran la microbiota cuando estás agotado.',
    headline: 'El agotamiento profundo empieza en las mitocondrias — no en la mente.',
    subheadline: 'No es cansancio normal. Es una señal del sistema. Los nutrientes mitocondriales y los fermentados son la respuesta que el cuerpo está pidiendo.',
    science: 'El agotamiento crónico implica una disfunción mitocondrial — las células producen menos ATP — y una microbiota empobrecida que no puede sintetizar vitaminas del grupo B de forma eficiente. La remolacha, rica en nitratos dietéticos, mejora la eficiencia mitocondrial directamente. Las legumbres y el huevo aportan los aminoácidos necesarios para resintetizar los neurotransmisores agotados por el estrés sostenido.',
    nutrients: [
      { name: 'Hierro no hemo + Vitamina C', benefit: 'El hierro transporta oxígeno a las células; la vitamina C triplica su absorción', foods: 'Lentejas con pimiento, espinacas con limón, remolacha' },
      { name: 'Vitamina B12', benefit: 'Esencial para la producción de energía y la función neuronal', foods: 'Sardinas, huevo, mejillones, hígado de ternera' },
      { name: 'Nitratos dietéticos (CoQ10 vegetal)', benefit: 'Mejoran la eficiencia de la cadena respiratoria mitocondrial', foods: 'Remolacha, espinacas, rúcula, apio' },
      { name: 'Proteína completa', benefit: 'Base para reconstruir neurotransmisores y tejido muscular', foods: 'Huevo, legumbres combinadas, pescado azul, kéfir' },
    ],
    recipes: [
      { name: 'Bol de remolacha asada con huevo y espinacas', description: 'Nitratos mitocondriales + hierro + proteína completa. El bol del reset.', time: '20 min' },
      { name: 'Sardinas al limón con brócoli salteado', description: 'B12 + vitamina C + antiinflamatorio. Energía celular real, no estimulante.', time: '15 min' },
      { name: 'Batido de granada, remolacha y jengibre', description: 'Nitratos + antioxidantes + efecto antiinflamatorio. El smoothie del agotamiento.', time: '5 min' },
    ],
    faq: [
      { q: '¿La cafeína ayuda con el agotamiento?', a: 'Solo temporalmente — bloquea los receptores de adenosina (la señal de cansancio) sin resolver la causa. A largo plazo, agota las reservas de adrenalina y empeora el ciclo. En agotamiento profundo, es mejor priorizar B12, hierro y sueño de calidad.' },
      { q: '¿Cuánto tiempo se tarda en recuperar la energía con la alimentación?', a: 'Los cambios en los niveles de hierro se ven en 4-6 semanas. La microbiota responde en 72h a una dieta rica en fermentados y fibra. La energía subjetiva suele mejorar en 1-2 semanas con una nutrición consistente.' },
      { q: '¿El agotamiento es lo mismo que el síndrome de fatiga crónica?', a: 'No. El agotamiento es un estado que responde a la nutrición, el sueño y la gestión del estrés. El síndrome de fatiga crónica (ME/CFS) es una condición médica reconocida que requiere atención especializada.' },
    ],
    related: ['estres', 'melancolia'],
  },
}

export function generateStaticParams() {
  return Object.keys(ESTADOS).map((estado) => ({ estado }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ estado: string }>
}): Promise<Metadata> {
  const { estado } = await params
  const data = ESTADOS[estado]
  if (!data) return {}
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `https://www.food-mood.app/paleta/${estado}` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://www.food-mood.app/paleta/${estado}`,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${data.titulo} y alimentación — Food·Mood` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
    },
  }
}

export default async function EstadoPage({
  params,
}: {
  params: Promise<{ estado: string }>
}) {
  const { estado } = await params
  const data = ESTADOS[estado]
  if (!data) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.metaTitle,
    description: data.metaDescription,
    url: `https://www.food-mood.app/paleta/${estado}`,
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', url: 'https://www.food-mood.app', name: 'Food·Mood' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Paleta emocional', item: 'https://www.food-mood.app/paleta' },
        { '@type': 'ListItem', position: 3, name: data.titulo, item: `https://www.food-mood.app/paleta/${estado}` },
      ],
    },
    disclaimer: 'Contenido divulgativo. No constituye diagnóstico médico ni asesoramiento nutricional personalizado.',
  }

  const relatedEstados = data.related.map((s) => ESTADOS[s]).filter(Boolean)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <main className="min-h-screen bg-[#F5F0E8]">

        {/* Breadcrumb */}
        <nav aria-label="Migas de pan" className="max-w-4xl mx-auto px-6 pt-8 pb-0">
          <ol className="flex items-center gap-2 text-xs font-light" style={{ color: "rgba(107,39,55,0.4)" }}>
            <li><Link href="/" className="hover:opacity-70 transition-opacity">Food·Mood</Link></li>
            <li aria-hidden="true" className="opacity-30">/</li>
            <li><Link href="/paleta" className="hover:opacity-70 transition-opacity">Paleta emocional</Link></li>
            <li aria-hidden="true" className="opacity-30">/</li>
            <li className="font-medium" style={{ color: data.color }}>{data.titulo}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section aria-label={`${data.titulo} y alimentación`} className="max-w-4xl mx-auto px-6 pt-16 pb-20">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-8"
            style={{ backgroundColor: data.color }}
          >
            {data.titulo}
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-[#2d0f16] leading-[1.1] mb-6">
            {data.headline}
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10" style={{ color: "rgba(107,39,55,0.7)" }}>
            {data.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/paleta?test=1"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: data.color, color: '#fff' }}
            >
              Descubrir mi paleta hoy <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/paleta"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border-2 transition-all hover:bg-[#6B2737]/5"
              style={{ borderColor: "rgba(107,39,55,0.2)", color: "rgba(107,39,55,0.7)" }}
            >
              Ver todos los estados →
            </Link>
          </div>
        </section>

        {/* La ciencia */}
        <section aria-label="La ciencia detrás de este estado" className="bg-[#2d0f16] py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "#FF6B35" }}>
              La ciencia
            </p>
            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.8)" }}>
              {data.science}
            </p>
          </div>
        </section>

        {/* Nutrientes clave */}
        <section aria-label="Nutrientes clave para este estado" className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#FF6B35" }}>
              Nutrientes clave
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16] mb-12 leading-tight">
              Lo que tu cuerpo está pidiendo en este estado.
            </h2>
            <dl className="grid md:grid-cols-2 gap-6">
              {data.nutrients.map((n) => (
                <div
                  key={n.name}
                  className="rounded-2xl p-6 border"
                  style={{ borderColor: "rgba(107,39,55,0.08)", backgroundColor: "#FEFBF4" }}
                >
                  <dt className="flex items-center gap-2 mb-3">
                    <Leaf className="w-4 h-4 shrink-0" style={{ color: data.color }} />
                    <span className="font-semibold text-[#2d0f16] text-base">{n.name}</span>
                  </dt>
                  <dd className="text-sm font-light leading-relaxed mb-2" style={{ color: "rgba(107,39,55,0.7)" }}>
                    {n.benefit}
                  </dd>
                  <dd className="text-xs font-medium" style={{ color: data.color }}>
                    {n.foods}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Recetas sugeridas */}
        <section aria-label="Recetas sugeridas para este estado" className="py-20 px-6" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#FF6B35" }}>
              Recetas para este estado
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16] mb-12 leading-tight">
              Tres platos con mecanismo bioquímico explicado.
            </h2>
            <div className="space-y-4 mb-10">
              {data.recipes.map((r) => (
                <div
                  key={r.name}
                  className="bg-white rounded-2xl p-6 border flex items-start gap-5"
                  style={{ borderColor: "rgba(107,39,55,0.08)" }}
                >
                  <FlaskConical className="w-5 h-5 mt-0.5 shrink-0" style={{ color: data.color }} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-serif text-lg font-semibold text-[#2d0f16] leading-snug">
                        {r.name}
                      </h3>
                      <span className="flex items-center gap-1 text-[10px] font-light shrink-0" style={{ color: "rgba(107,39,55,0.4)" }}>
                        <Clock className="w-3 h-3" />{r.time}
                      </span>
                    </div>
                    <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>
                      {r.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#2d0f16", color: "#F5F0E8" }}
            >
              Ver las recetas completas en Premium <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Preguntas frecuentes" className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "rgba(107,39,55,0.4)" }}>
              Preguntas frecuentes
            </p>
            <h2 className="font-serif text-3xl text-[#2d0f16] mb-10">Las dudas habituales.</h2>
            <dl className="space-y-8">
              {data.faq.map(({ q, a }) => (
                <div key={q} className="border-b pb-8" style={{ borderColor: "rgba(107,39,55,0.08)" }}>
                  <dt className="font-serif text-xl text-[#2d0f16] mb-3">{q}</dt>
                  <dd className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>{a}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs font-light mt-8 p-4 rounded-xl" style={{ color: "rgba(107,39,55,0.45)", backgroundColor: "rgba(107,39,55,0.04)" }}>
              Este contenido tiene carácter exclusivamente divulgativo. No constituye diagnóstico médico, tratamiento terapéutico ni asesoramiento nutricional personalizado. Ante cualquier duda de salud, consulte a un profesional sanitario cualificado.
            </p>
          </div>
        </section>

        {/* CTA principal + estados relacionados */}
        <section aria-label="Descubre tu paleta completa" className="py-20 px-6" style={{ backgroundColor: "#2d0f16" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "#FF6B35" }}>
              Tu mezcla real
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6">
              No eres solo {data.titulo.toLowerCase()}.{" "}
              <span className="italic font-light">Eres una mezcla única.</span>
            </h2>
            <p className="text-base font-light max-w-xl mx-auto mb-10" style={{ color: "rgba(245,240,232,0.55)" }}>
              El test de paleta emocional te muestra tu espectro real en porcentajes — y las recetas que le corresponden.
            </p>
            <Link
              href="/paleta?test=1"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-xl mb-16"
              style={{ backgroundColor: "#FF6B35", color: "#2d0f16" }}
            >
              Descubrir mi paleta — es gratis <ArrowRight className="w-4 h-4" />
            </Link>

            {relatedEstados.length > 0 && (
              <div className="border-t pt-10" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(245,240,232,0.3)" }}>
                  Estados relacionados
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {relatedEstados.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/paleta/${r.slug}`}
                      className="px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40` }}
                    >
                      {r.titulo} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </>
  )
}
