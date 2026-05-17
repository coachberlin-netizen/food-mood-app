import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Biblioteca Científica — 172 Fragmentos | Food·Mood',
  description:
    'La base científica detrás de Food·Mood. Papers curados por Susana Ferreras sobre microbiota, cronobiología, neurogastronomía y psicología de la alimentación.',
  openGraph: {
    title: 'Biblioteca Científica — Food·Mood',
    description: '172 fragmentos científicos curados por nuestro equipo.',
    url: 'https://www.food-mood.app/biblioteca',
  },
}

type RefItem = {
  autores: string
  ano: number
  titulo: string
  revista: string
  volumen?: string
  paginas?: string
  doi?: string
  url: string
  isbn?: string
  relevancia: string
  usadoEn: string[]
}

type Seccion = {
  categoria: string
  descripcion: string
  items: RefItem[]
}

const biblioteca: Seccion[] = [
  {
    categoria: 'Eje Intestino-Cerebro',
    descripcion: 'La comunicación bidireccional entre tu microbiota y tu sistema nervioso central.',
    items: [
      {
        autores: 'Cryan, J.F., et al.',
        ano: 2019,
        titulo: 'The Microbiota-Gut-Brain Axis',
        revista: 'Physiological Reviews',
        volumen: '99(4)',
        paginas: '1877–2013',
        doi: '10.1152/physrev.00018.2018',
        url: 'https://doi.org/10.1152/physrev.00018.2018',
        relevancia: 'Review foundational sobre el eje intestino-cerebro. Explica mecanismos de señalización neural, inmune y endocrina.',
        usadoEn: ['Home', 'Paleta emocional', 'Retos'],
      },
      {
        autores: 'Yano, J.M., et al.',
        ano: 2015,
        titulo: 'Indigenous Bacteria from the Gut Microbiota Regulate Host Serotonin Biosynthesis',
        revista: 'Cell',
        volumen: '161(2)',
        paginas: '264–276',
        doi: '10.1016/j.cell.2015.02.047',
        url: 'https://doi.org/10.1016/j.cell.2015.02.047',
        relevancia: 'Demuestra que bacterias intestinales producen ~90% de la serotonina corporal. Base del claim "95% de serotonina en el intestino".',
        usadoEn: ['Home', 'Paleta emocional'],
      },
      {
        autores: 'Dinan, T.G. & Cryan, J.F.',
        ano: 2017,
        titulo: 'Gut instincts: microbiota as a key regulator of brain development, ageing and neurodegeneration',
        revista: 'Journal of Physiology',
        volumen: '595(2)',
        paginas: '489–503',
        doi: '10.1113/JP273106',
        url: 'https://doi.org/10.1113/JP273106',
        relevancia: 'Revisión del impacto de la microbiota en neurodesarrollo y envejecimiento.',
        usadoEn: ['Retos de longevidad'],
      },
      {
        autores: 'Foster, J.A., et al.',
        ano: 2017,
        titulo: 'Stress & the gut-brain axis: Regulation by the microbiome',
        revista: 'Neurobiology of Stress',
        volumen: '7',
        paginas: '124–136',
        doi: '10.1016/j.ynstr.2017.03.001',
        url: 'https://doi.org/10.1016/j.ynstr.2017.03.001',
        relevancia: 'Mecanismos específicos de cómo el estrés altera la microbiota y viceversa.',
        usadoEn: ['Reto Calma', 'Reto Ansiedad'],
      },
    ],
  },
  {
    categoria: 'Serotonina y Neurotransmisores',
    descripcion: 'Bioquímica del estado de ánimo desde el plato.',
    items: [
      {
        autores: 'Jenkins, T.A., et al.',
        ano: 2016,
        titulo: 'Influence of Tryptophan and Serotonin on Mood and Cognition',
        revista: 'Nutrition Research Reviews',
        volumen: '29(2)',
        paginas: '132–143',
        doi: '10.1017/S0954422416000088',
        url: 'https://doi.org/10.1017/S0954422416000088',
        relevancia: 'Revisión de cómo el triptófano dietético afecta la síntesis de serotonina y el estado de ánimo.',
        usadoEn: ['Recetas', 'Retos'],
      },
      {
        autores: 'Bravo, J.A., et al.',
        ano: 2011,
        titulo: 'Ingestion of Lactobacillus strain regulates emotional behavior and central GABA receptor expression via the vagus nerve',
        revista: 'PNAS',
        volumen: '108(38)',
        paginas: '16050–16055',
        doi: '10.1073/pnas.1102999108',
        url: 'https://doi.org/10.1073/pnas.1102999108',
        relevancia: 'Primer estudio en mostrar que probióticos específicos reducen ansiedad vía GABA.',
        usadoEn: ['Fermentos', 'Reto Calma'],
      },
    ],
  },
  {
    categoria: 'Cronobiología y Crononutrición',
    descripcion: 'Cuándo comes importa tanto como qué comes.',
    items: [
      {
        autores: 'Panda, S.',
        ano: 2018,
        titulo: 'The Circadian Code',
        revista: 'Rodale Books',
        isbn: '978-1635651728',
        url: 'https://www.penguinrandomhouse.com/books/557081/the-circadian-code-by-satchin-panda-phd/',
        relevancia: 'Libro de divulgación científica sobre time-restricted eating y salud metabólica.',
        usadoEn: ['Reto Circadiano', 'Home'],
      },
      {
        autores: 'Chaix, A., et al.',
        ano: 2014,
        titulo: 'Time-Restricted Feeding Is a Preventative and Therapeutic Intervention against Diverse Nutritional Challenges',
        revista: 'Cell Metabolism',
        volumen: '20(6)',
        paginas: '991–1005',
        doi: '10.1016/j.cmet.2014.11.001',
        url: 'https://doi.org/10.1016/j.cmet.2014.11.001',
        relevancia: 'Estudio pionero de Panda sobre restricción temporal de alimentación.',
        usadoEn: ['Reto Circadiano'],
      },
      {
        autores: 'St-Onge, M.P., et al.',
        ano: 2016,
        titulo: 'Meal Timing Affects Postprandial Ghrelin Levels and Subjective Hunger',
        revista: 'Obesity',
        volumen: '24(8)',
        paginas: '1705–1711',
        doi: '10.1002/oby.21579',
        url: 'https://doi.org/10.1002/oby.21579',
        relevancia: 'Relación entre timing de comidas, grelina y sensación de hambre.',
        usadoEn: ['IA de recomendaciones', 'Reto Energía'],
      },
    ],
  },
  {
    categoria: 'Teoría de las Emociones Construidas',
    descripcion: 'Las emociones no son universales: son construcciones activas del cerebro.',
    items: [
      {
        autores: 'Barrett, L.F.',
        ano: 2017,
        titulo: 'How Emotions Are Made: The Secret Life of the Brain',
        revista: 'Houghton Mifflin Harcourt',
        isbn: '978-0544133310',
        url: 'https://www.hmhbooks.com/shop/books/How-Emotions-Are-Made/9780544133310',
        relevancia: 'Base del concepto "no eres triste, eres 60% calma + 25% melancolía". Fundamento teórico de la paleta emocional.',
        usadoEn: ['Paleta emocional', 'Test', '/paleta (sección ciencia)'],
      },
      {
        autores: 'Russell, J.A.',
        ano: 2003,
        titulo: 'Core affect and the psychological construction of emotion',
        revista: 'Psychological Review',
        volumen: '110(1)',
        paginas: '145–172',
        doi: '10.1037/0033-295X.110.1.145',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16262989/',
        relevancia: 'Modelo circumplex: cualquier emoción es un punto en el espacio valencia × activación.',
        usadoEn: ['Paleta emocional', '/paleta (sección ciencia)'],
      },
      {
        autores: 'Lindquist, K.A., et al.',
        ano: 2021,
        titulo: 'Emotional granularity and emotion regulation: a systematic review',
        revista: 'PMC Open Access',
        doi: 'PMC8315101',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8315101/',
        relevancia: 'Alta granularidad emocional → menos ansiedad y depresión. Nombrar con precisión lo que se siente es una intervención de autorregulación.',
        usadoEn: ['Paleta emocional', 'Concepto general'],
      },
    ],
  },
  {
    categoria: 'Neurogastronomía',
    descripcion: 'Cómo el cerebro crea el sabor y la experiencia alimentaria.',
    items: [
      {
        autores: 'Shepherd, G.M.',
        ano: 2012,
        titulo: 'Neurogastronomy: How the Brain Creates Flavor and Why It Matters',
        revista: 'Columbia University Press',
        isbn: '978-0231159111',
        url: 'https://cup.columbia.edu/book/neurogastronomy/9780231159111',
        relevancia: 'Libro fundacional de la neurogastronomía. Explica cómo el olfato retronasal construye el sabor.',
        usadoEn: ['Concepto general', 'Recetas sensoriales'],
      },
      {
        autores: 'Spence, C.',
        ano: 2017,
        titulo: 'Gastrophysics: The New Science of Eating',
        revista: 'Viking',
        isbn: '978-0735223035',
        url: 'https://www.penguin.co.uk/books/294034/gastrophysics-by-spence-charles/9780735223042',
        relevancia: 'Multisensorialidad en la experiencia alimentaria: color, sonido, textura y contexto.',
        usadoEn: ['Presentación de recetas'],
      },
    ],
  },
  {
    categoria: 'Fermentados y Microbiota',
    descripcion: 'Alimentos vivos que modifican tu ecosistema interno.',
    items: [
      {
        autores: 'Marco, M.L., et al.',
        ano: 2017,
        titulo: 'Health benefits of fermented foods: microbiota and beyond',
        revista: 'Current Opinion in Biotechnology',
        volumen: '44',
        paginas: '94–102',
        doi: '10.1016/j.copbio.2016.11.010',
        url: 'https://doi.org/10.1016/j.copbio.2016.11.010',
        relevancia: 'Revisión de beneficios de fermentados más allá de probióticos vivos (postbióticos).',
        usadoEn: ['Fermentos del mundo', 'Retos'],
      },
      {
        autores: 'Salminen, S., et al.',
        ano: 2021,
        titulo: 'ISAPP consensus statement on the definition and scope of postbiotics',
        revista: 'Nature Reviews Gastroenterology & Hepatology',
        volumen: '18(9)',
        paginas: '649–667',
        doi: '10.1038/s41575-021-00440-6',
        url: 'https://doi.org/10.1038/s41575-021-00440-6',
        relevancia: 'Definición oficial de postbióticos (ISAPP 2021). Base del concepto en Food·Mood.',
        usadoEn: ['Postbióticos', 'Retos'],
      },
      {
        autores: 'Sumi, H., et al.',
        ano: 1987,
        titulo: 'A novel fibrinolytic enzyme (nattokinase) in the vegetable cheese Natto',
        revista: 'Experientia',
        volumen: '43(10)',
        paginas: '1110–1111',
        doi: '10.1007/BF01956052',
        url: 'https://doi.org/10.1007/BF01956052',
        relevancia: 'Descubrimiento original de la nattokinasa. Paper clásico de fermentos funcionales.',
        usadoEn: ['Fermentos', 'Natto de Garbanzos'],
      },
    ],
  },
  {
    categoria: 'Psicología de la Alimentación',
    descripcion: 'Por qué comemos lo que comemos, más allá del hambre.',
    items: [
      {
        autores: 'Macht, M.',
        ano: 2008,
        titulo: 'How emotions affect eating: A five-way model',
        revista: 'Appetite',
        volumen: '50(1)',
        paginas: '1–11',
        doi: '10.1016/j.appet.2007.07.002',
        url: 'https://doi.org/10.1016/j.appet.2007.07.002',
        relevancia: 'Modelo de 5 vías por las que las emociones afectan la ingesta. Base de la intervención emocional de Food·Mood.',
        usadoEn: ['Concepto general', 'IA emocional'],
      },
      {
        autores: 'Lally, P., et al.',
        ano: 2010,
        titulo: 'How are habits formed: Modelling habit formation in the real world',
        revista: 'European Journal of Social Psychology',
        volumen: '40(6)',
        paginas: '998–1009',
        doi: '10.1002/ejsp.674',
        url: 'https://doi.org/10.1002/ejsp.674',
        relevancia: '"66 días" (UCL). El mito de los 21 días refutado con datos reales.',
        usadoEn: ['Retos', 'Home'],
      },
      {
        autores: 'Bandura, A.',
        ano: 1977,
        titulo: 'Self-efficacy: toward a unifying theory of behavioral change',
        revista: 'Psychological Review',
        volumen: '84(2)',
        paginas: '191–215',
        doi: '10.1037/0033-295X.84.2.191',
        url: 'https://doi.org/10.1037/0033-295X.84.2.191',
        relevancia: 'Autoeficacia — predictor más potente del cambio de conducta alimentaria.',
        usadoEn: ['Retos', 'IA de coaching'],
      },
      {
        autores: 'Arroyo Fernández, A. & Lladó Jordan, G.',
        ano: 2021,
        titulo: 'Psicología de la Alimentación',
        revista: 'Formación Alcalá — Máster en Nutrición y Salud',
        url: 'https://www.formacionalcala.es',
        relevancia: 'Fuente principal de los capítulos sobre alimentación emocional, motivación y conducta alimentaria del KB.',
        usadoEn: ['KB longevidad', 'Asesor Personal'],
      },
      {
        autores: 'Redondo Illán, T.',
        ano: 2021,
        titulo: 'Coaching Nutricional',
        revista: 'Formación Alcalá — Máster en Nutrición y Salud',
        url: 'https://www.formacionalcala.es',
        relevancia: 'Modelo Prochaska-DiClemente aplicado a nutrición. Fundamento del proceso de acompañamiento del Asesor.',
        usadoEn: ['KB longevidad', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Inflamación y Nutrición',
    descripcion: 'La dieta como modulador del sistema inmune.',
    items: [
      {
        autores: 'Calder, P.C.',
        ano: 2010,
        titulo: 'Omega-3 fatty acids and inflammatory processes',
        revista: 'Nutrients',
        volumen: '2(3)',
        paginas: '355–374',
        doi: '10.3390/nu2030355',
        url: 'https://doi.org/10.3390/nu2030355',
        relevancia: 'Mecanismos antiinflamatorios de omega-3 (EPA/DHA). Base de las recetas de Activación y Reset.',
        usadoEn: ['Reto Antiinflamatorio', 'Recetas Reset'],
      },
      {
        autores: 'Aggarwal, B.B. & Harikumar, K.B.',
        ano: 2009,
        titulo: 'Potential therapeutic effects of curcumin, the anti-inflammatory agent',
        revista: 'International Journal of Biochemistry & Cell Biology',
        volumen: '41(1)',
        paginas: '40–59',
        doi: '10.1016/j.biocel.2008.06.010',
        url: 'https://doi.org/10.1016/j.biocel.2008.06.010',
        relevancia: 'Mecanismos moleculares de la cúrcuma como antiinflamatorio.',
        usadoEn: ['Reto Antiinflamatorio'],
      },
    ],
  },
  {
    categoria: 'Músculo, Huesos y Longevidad',
    descripcion: 'Nutrición estructural para la segunda mitad de la vida.',
    items: [
      {
        autores: 'Witard, O.C., et al.',
        ano: 2016,
        titulo: 'High dietary protein intake for muscle hypertrophy and maintenance',
        revista: 'Nutrition Reviews',
        volumen: '74(suppl 1)',
        paginas: '33–47',
        doi: '10.1093/nutrit/nuw010',
        url: 'https://doi.org/10.1093/nutrit/nuw010',
        relevancia: 'Umbral de leucina y resistencia anabólica en mujeres mayores de 45.',
        usadoEn: ['Reto Longevidad', 'KB longevidad'],
      },
      {
        autores: 'Hauschka, P.V., et al.',
        ano: 1989,
        titulo: 'Osteocalcin and matrix Gla protein: vitamin K-dependent proteins in bone',
        revista: 'Physiological Reviews',
        volumen: '69(3)',
        paginas: '990–1047',
        doi: '10.1152/physrev.1989.69.3.990',
        url: 'https://doi.org/10.1152/physrev.1989.69.3.990',
        relevancia: 'Base científica de la vitamina K2 para la densidad ósea posmenopáusica.',
        usadoEn: ['Reto Longevidad', 'KB longevidad'],
      },
    ],
  },
]

const totalRefs = biblioteca.reduce((acc, s) => acc + s.items.length, 0)

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Biblioteca Científica — Food·Mood',
  description:
    '172 fragmentos científicos curados sobre microbiota, cronobiología, neurogastronomía y psicología de la alimentación.',
  url: 'https://www.food-mood.app/biblioteca',
  author: {
    '@type': 'Person',
    name: 'Susana Ferreras Diez',
    jobTitle: 'Fundadora · Psicóloga · MSc Biotecnología Alimentaria · MSc Gerontología',
    affiliation: { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
  },
  about: biblioteca.map((cat) => ({ '@type': 'Thing', name: cat.categoria, description: cat.descripcion })),
}

export default function BibliotecaPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <header className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#C9A84C' }}>
            Transparencia científica
          </span>
          <h1 className="font-serif text-4xl md:text-6xl mt-4 mb-6" style={{ color: '#1A1612' }}>
            Biblioteca científica
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(26,22,18,0.65)' }}>
            Los {totalRefs} estudios y libros que fundamentan cada recomendación del Asesor Personal.
            Curados por{' '}
            <strong style={{ color: '#1A1612' }}>Susana Ferreras Diez</strong> —
            Psicóloga, MSc Biotecnología Alimentaria, MSc Gerontología y fundadora de una marca de kombucha
            (exit estratégico, 2023).
          </p>
          <p className="text-xs mt-4" style={{ color: 'rgba(26,22,18,0.35)' }}>
            {totalRefs} publicaciones · 172 fragmentos vectorizados · actualizado Mayo 2026
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-16">
          {biblioteca.map((seccion) => (
            <section key={seccion.categoria}>
              <div className="mb-8">
                <h2 className="font-serif text-2xl md:text-3xl mb-2" style={{ color: '#1A1612' }}>
                  {seccion.categoria}
                </h2>
                <p style={{ color: 'rgba(26,22,18,0.55)', fontSize: 14 }}>{seccion.descripcion}</p>
              </div>

              <div className="grid gap-4">
                {seccion.items.map((ref, i) => (
                  <article
                    key={i}
                    className="bg-white rounded-3xl p-6 md:p-8 transition-shadow hover:shadow-md"
                    style={{ border: '1px solid rgba(26,22,18,0.07)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-2 leading-snug" style={{ color: '#1A1612' }}>
                          {ref.titulo}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: 'rgba(26,22,18,0.6)' }}>
                          <span className="font-semibold">{ref.autores}</span>
                          {' '}
                          <span style={{ color: '#C9A84C', fontWeight: 600 }}>({ref.ano})</span>
                          {'. '}
                          <em>{ref.revista}</em>
                          {ref.volumen && `, ${ref.volumen}`}
                          {ref.paginas && `, pp. ${ref.paginas}`}
                          {ref.isbn && ` · ISBN ${ref.isbn}`}
                          {'.'}
                        </p>

                        {ref.doi && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs mb-3 transition-opacity hover:opacity-70"
                            style={{ color: '#6B2737' }}
                          >
                            <span
                              className="font-mono px-2 py-0.5 rounded"
                              style={{ backgroundColor: 'rgba(107,39,55,0.08)' }}
                            >
                              DOI: {ref.doi}
                            </span>
                            <span>Ver paper →</span>
                          </a>
                        )}
                        {!ref.doi && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs mb-3 underline transition-opacity hover:opacity-70"
                            style={{ color: '#6B2737' }}
                          >
                            Ver fuente →
                          </a>
                        )}

                        <div
                          className="mt-3 p-3 rounded-xl text-sm leading-relaxed"
                          style={{ backgroundColor: '#F5F0E8', color: 'rgba(26,22,18,0.75)' }}
                        >
                          <span className="font-semibold" style={{ color: '#1A1612' }}>¿Por qué lo usamos? </span>
                          {ref.relevancia}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {ref.usadoEn.map((u) => (
                            <span
                              key={u}
                              className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: 'rgba(26,22,18,0.05)', color: 'rgba(26,22,18,0.5)' }}
                            >
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hidden md:block shrink-0">
                        <span
                          className="font-serif text-5xl font-bold select-none"
                          style={{ color: 'rgba(26,22,18,0.06)' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-sm mb-6" style={{ color: 'rgba(26,22,18,0.55)' }}>
            ¿Encontraste un paper que crees que deberíamos incluir?
          </p>
          <a
            href="mailto:info@food-mood.app?subject=Sugerencia%20bibliogr%C3%A1fica"
            className="inline-block px-8 py-4 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1A1612', color: '#F5F0E8' }}
          >
            Sugerir referencia →
          </a>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-12 p-6 rounded-2xl text-center text-sm leading-relaxed"
          style={{ backgroundColor: 'rgba(26,22,18,0.04)', color: 'rgba(26,22,18,0.45)' }}
        >
          Food·Mood ofrece divulgación científica basada en evidencia. No sustituye diagnóstico, tratamiento
          ni terapia médica. Consulta a un profesional ante cualquier duda de salud.
          <br />
          <span className="mt-2 block text-xs">
            <Link href="/glosario" style={{ color: '#6B2737' }}>Glosario científico</Link>
            {' · '}
            <Link href="/asesor" style={{ color: '#6B2737' }}>Asesor Personal</Link>
            {' · '}
            <Link href="/" style={{ color: '#6B2737' }}>food-mood.app</Link>
          </span>
        </div>

      </div>
    </main>
  )
}
