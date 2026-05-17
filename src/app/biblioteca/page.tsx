import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Biblioteca científica · Food·Mood',
  description:
    'Referencias, estudios y libros que forman la base de conocimiento del Asesor Personal de Food·Mood. 30+ publicaciones científicas sobre eje intestino-cerebro, salud hormonal femenina, neurociencia afectiva y cambio de hábitos.',
}

type Ref = {
  authors: string
  year: string
  title: string
  journal?: string
  doi?: string
  note?: string
}

type Section = {
  id: string
  color: string
  label: string
  heading: string
  refs: Ref[]
}

const SECTIONS: Section[] = [
  {
    id: 'neurociencia',
    color: '#A07BBE',
    label: 'Neurociencia afectiva',
    heading: 'Emociones y espectro emocional',
    refs: [
      {
        authors: 'Barrett, L.F.',
        year: '2017',
        title: 'How Emotions Are Made: The Secret Life of the Brain',
        journal: 'Houghton Mifflin Harcourt',
        note: 'Teoría de la Emoción Construida — fundamento del sistema de paleta emocional de Food·Mood',
      },
      {
        authors: 'Russell, J.A.',
        year: '2003',
        title: 'Core affect and the psychological construction of emotion',
        journal: 'Psychological Review, 110(1), 145–172',
        doi: 'https://pubmed.ncbi.nlm.nih.gov/16262989/',
        note: 'Modelo circumplex — base del espectro continuo de estados afectivos',
      },
      {
        authors: 'Lindquist, K.A. et al.',
        year: '2021',
        title: 'Emotional granularity and emotion regulation: a systematic review',
        journal: 'PMC Open Access',
        doi: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8315101/',
        note: 'Granularidad emocional como intervención de autorregulación',
      },
      {
        authors: 'Damasio, A.',
        year: '1994',
        title: "Descartes' Error: Emotion, Reason, and the Human Brain",
        journal: 'Putnam',
        note: 'Hipótesis del marcador somático — cuerpo y emoción son inseparables',
      },
    ],
  },
  {
    id: 'intestino-cerebro',
    color: '#6B2737',
    label: 'Eje intestino-cerebro',
    heading: 'Microbiota, psicobióticos y salud mental',
    refs: [
      {
        authors: 'Cryan, J.F. et al.',
        year: '2019',
        title: 'The microbiota-gut-brain axis',
        journal: 'Physiological Reviews, 99(4), 1877–2013',
        doi: 'https://doi.org/10.1152/physrev.00018.2018',
      },
      {
        authors: 'Cryan, J.F. & Dinan, T.G.',
        year: '2012',
        title: 'Mind-altering microorganisms: the impact of the gut microbiota on brain and behaviour',
        journal: 'Nature Reviews Neuroscience, 13(10), 701–712',
      },
      {
        authors: 'Yano, J.M. et al.',
        year: '2015',
        title: 'Indigenous bacteria from the gut microbiota regulate host serotonin biosynthesis',
        journal: 'Cell, 161(2), 264–276',
        doi: 'https://doi.org/10.1016/j.cell.2015.02.047',
        note: '95% de la serotonina corporal se produce en el intestino',
      },
      {
        authors: 'Bravo, J.A. et al.',
        year: '2011',
        title: 'Ingestion of Lactobacillus strain regulates emotional behavior and central GABA receptor expression via the vagus nerve',
        journal: 'PNAS, 108(38), 16050–16055',
      },
      {
        authors: 'Allen, A.P. et al.',
        year: '2016',
        title: 'Bifidobacterium longum 1714 as a translational psychobiotic: modulation of stress, electrophysiology and neurocognition',
        journal: 'Translational Psychiatry, 6(11), e939',
      },
      {
        authors: 'Stanton, C. et al.',
        year: '2024',
        title: 'Psychobiotics and the gut-brain axis: recent advances',
        journal: 'Journal of Functional Foods',
      },
      {
        authors: 'Dinan, T.G. & Cryan, J.F.',
        year: '2013',
        title: 'Melancholic microbes: a link between gut microbiota and depression',
        journal: 'Neurogastroenterology & Motility',
        note: 'Artículo que acuñó el término "psicobiótico"',
      },
    ],
  },
  {
    id: 'hormonal',
    color: '#C04878',
    label: 'Salud hormonal femenina',
    heading: 'Estrobioma, menopausia y microbioma vaginal',
    refs: [
      {
        authors: 'Reid, G. et al.',
        year: '2003',
        title: 'Oral use of Lactobacillus rhamnosus GR-1 and L. reuteri RC-14 significantly alters vaginal flora',
        journal: 'FEMS Immunology & Medical Microbiology, 35(2), 131–134',
      },
      {
        authors: 'Howell, A.B. et al.',
        year: '2005',
        title: 'Inhibition of the adherence of P-fimbriated Escherichia coli to uroepithelial-cell surfaces by proanthocyanidin extracts from cranberries',
        journal: 'Journal of the Science of Food and Agriculture, 85(10), 1700–1706',
      },
      {
        authors: 'Qi, X. et al.',
        year: '2021',
        title: 'Gut microbiota composition changes in menopausal women: a systematic review and meta-analysis',
        journal: 'Nutrients',
      },
      {
        authors: 'Messina, M.',
        year: '2016',
        title: 'Soy and health update: evaluation of the clinical and epidemiologic literature',
        journal: 'Advances in Nutrition',
      },
    ],
  },
  {
    id: 'metabolismo',
    color: '#C9A84C',
    label: 'Mitocondrias y energía',
    heading: 'Metabolismo celular y cofactores mitocondriales',
    refs: [
      {
        authors: 'Crane, F.L.',
        year: '2001',
        title: 'Biochemical functions of coenzyme Q10',
        journal: 'Mitochondrion, 1(3), 255–266',
      },
      {
        authors: 'Altura, B.M. & Altura, B.T.',
        year: '1995',
        title: 'Magnesium: forgotten mineral in cardiovascular biology, hypertension and atherogenesis',
        journal: 'Scientific American',
      },
      {
        authors: 'Ikon, N. & Thomas, R.H.',
        year: '2016',
        title: 'Cardiolipin and mitochondrial function in health and disease',
        journal: 'Advances in Nutrition, 7(5), 963–973',
      },
    ],
  },
  {
    id: 'musculo',
    color: '#4A7AB5',
    label: 'Músculo y longevidad',
    heading: 'Proteína, sarcopenia y densidad ósea',
    refs: [
      {
        authors: 'Witard, O.C. et al.',
        year: '2016',
        title: 'High dietary protein intake for muscle hypertrophy and maintenance',
        journal: 'Nutrition Reviews, 74(suppl 1), 33–47',
      },
      {
        authors: 'Areta, J.L. et al.',
        year: '2013',
        title: 'Timing and distribution of protein ingestion during prolonged recovery from resistance exercise alters myofibrillar protein synthesis',
        journal: 'Journal of Physiology, 591(9), 2319–2331',
      },
      {
        authors: 'Leidy, H.J. et al.',
        year: '2013',
        title: 'Beneficial effects of a higher-protein breakfast on appetite-regulating hormonal and neural signals',
        journal: 'American Journal of Clinical Nutrition',
      },
      {
        authors: 'Hauschka, P.V. et al.',
        year: '1989',
        title: 'Osteocalcin and matrix Gla protein: vitamin K-dependent proteins in bone',
        journal: 'Physiological Reviews, 69(3), 990–1047',
      },
      {
        authors: 'Natsuyama, R.',
        year: '2013',
        title: 'Estrogen receptor signaling and bone metabolism',
        journal: 'Journal of Bone and Mineral Metabolism, 31(1), 1–8',
      },
    ],
  },
  {
    id: 'bioactivos',
    color: '#5A9B8A',
    label: 'Nutrición funcional',
    heading: 'Compuestos bioactivos y fermentados',
    refs: [
      {
        authors: 'Zeevi, D. et al.',
        year: '2015',
        title: 'Personalized nutrition by prediction of glycemic responses',
        journal: 'Cell, 163(5), 1079–1094',
        note: 'La respuesta glucémica varía individualmente — el microbioma es predictor clave',
      },
      {
        authors: 'Johnston, C.S. et al.',
        year: '2004',
        title: 'Vinegar improves insulin sensitivity to a high-carbohydrate meal in subjects with insulin resistance or type 2 diabetes',
        journal: 'Journal of the American Dietetic Association',
      },
      {
        authors: 'Wang, Y. et al.',
        year: '2022',
        title: 'Dietary lycopene and depression risk: a meta-analysis',
        journal: 'Nutrients, 14(3), 513',
      },
      {
        authors: 'Xiao, Y. et al.',
        year: '2023',
        title: 'Lactic acid fermentation enhances lycopene bioaccessibility in tomato pulp',
        journal: 'Food Chemistry, 410, 135397',
      },
      {
        authors: 'Shi, J. & Le Maguer, M.',
        year: '2000',
        title: 'Lycopene in tomatoes: chemical and physical properties affected by food processing',
        journal: 'Critical Reviews in Food Science and Nutrition, 40(1), 1–42',
      },
    ],
  },
  {
    id: 'cronobiologia',
    color: '#D4845A',
    label: 'Crononutrición',
    heading: 'Ritmo circadiano y timing nutricional',
    refs: [
      {
        authors: 'Hall, J.C., Rosbash, M. & Young, M.W.',
        year: '2017',
        title: 'Molecular mechanisms controlling circadian rhythm',
        journal: 'Nobel Prize Lecture in Physiology or Medicine',
        note: 'Premio Nobel 2017 — base científica de la crononutrición',
      },
      {
        authors: 'Garaulet, M. & Gómez-Abellán, P.',
        year: '2014',
        title: 'Timing of food intake and obesity: a novel association',
        journal: 'Physiology & Behavior, 134, 44–50',
      },
      {
        authors: 'Panda, S.',
        year: '2016',
        title: 'Circadian physiology of metabolism',
        journal: 'Science, 354(6315), 1008–1015',
        note: 'Salk Institute — base científica del ayuno intermitente y la ventana de alimentación',
      },
    ],
  },
  {
    id: 'conducta',
    color: '#7B9E6B',
    label: 'Cambio de hábitos',
    heading: 'Psicología del comportamiento alimentario',
    refs: [
      {
        authors: 'Lally, P. et al.',
        year: '2010',
        title: 'How are habits formed: Modelling habit formation in the real world',
        journal: 'European Journal of Social Psychology, 40(6), 998–1009',
        note: '"66 días" — UCL. El mito de los 21 días refutado con evidencia.',
      },
      {
        authors: 'Bandura, A.',
        year: '1977',
        title: 'Self-efficacy: toward a unifying theory of behavioral change',
        journal: 'Psychological Review, 84(2), 191–215',
        note: 'Autoeficacia — el predictor más potente del cambio de conducta',
      },
      {
        authors: 'Prochaska, J.O. & DiClemente, C.C.',
        year: '1983',
        title: 'Stages and processes of self-change of smoking: toward an integrative model of change',
        journal: 'Journal of Consulting and Clinical Psychology',
        note: 'Modelo Transteórico del Cambio — 5 etapas de cambio de conducta',
      },
      {
        authors: 'Macht, M.',
        year: '2007',
        title: 'How emotions affect eating: a five-way model',
        journal: 'Appetite, 50(1), 1–11',
      },
      {
        authors: 'Anderberg, R.H.',
        year: '2016',
        title: 'The stomach-derived hormone ghrelin increases impulsive behavior',
        journal: 'Neuropsychopharmacology, 41(5), 1199–1209',
        note: 'El ayuno prolongado aumenta la impulsividad emocional',
      },
      {
        authors: 'Kullmann, S. et al.',
        year: '2015',
        title: 'Resting state network functional connectivity in obese subjects vs. controls',
        journal: 'Human Brain Mapping',
      },
      {
        authors: 'Arroyo Fernández, A. & Lladó Jordan, G.',
        year: '2021',
        title: 'Psicología de la Alimentación',
        journal: 'Formación Alcalá — Máster en Nutrición y Salud',
      },
      {
        authors: 'Redondo Illán, T.',
        year: '2021',
        title: 'Coaching Nutricional',
        journal: 'Formación Alcalá — Máster en Nutrición y Salud',
      },
      {
        authors: 'Fogg, B.J.',
        year: '2019',
        title: 'Tiny Habits',
        journal: 'Houghton Mifflin Harcourt. ISBN 978-0358003328',
      },
      {
        authors: 'Clear, J.',
        year: '2018',
        title: 'Atomic Habits',
        journal: 'Avery. ISBN 978-0735211292',
      },
      {
        authors: 'Wood, W.',
        year: '2019',
        title: 'Good Habits, Bad Habits',
        journal: 'Farrar, Straus and Giroux. ISBN 978-1250159076',
      },
      {
        authors: 'Enders, G.',
        year: '2014',
        title: 'Gut: The Inside Story of Our Body\'s Most Underrated Organ',
        journal: 'Greystone Books. ISBN 978-1771641494',
      },
    ],
  },
]

const totalRefs = SECTIONS.reduce((acc, s) => acc + s.refs.length, 0)

export default function BibliotecaPage() {
  return (
    <main style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ backgroundColor: '#1A1612', padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: 16 }}>
            Base de conocimiento · Mayo 2026
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 5vw, 48px)', color: '#F5F0E8', fontWeight: 400, lineHeight: 1.15, marginBottom: 20 }}>
            Biblioteca científica<br />
            <em style={{ color: '#C9A84C', fontStyle: 'italic', fontWeight: 300 }}>del Asesor Personal</em>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.55)', lineHeight: 1.7, maxWidth: 620, marginBottom: 32 }}>
            Cada recomendación del Asesor Personal de Food·Mood está fundamentada en investigación revisada por pares. Esta página lista las {totalRefs} publicaciones que forman la base de conocimiento activa (172 fragmentos vectorizados, Mayo 2026).
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { n: totalRefs.toString(), label: 'publicaciones' },
              { n: '172', label: 'fragmentos indexados' },
              { n: SECTIONS.length.toString(), label: 'áreas temáticas' },
              { n: '2024–1977', label: 'rango temporal' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#C9A84C', fontWeight: 700, lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 10, color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Download */}
          <a
            href="/food-mood-referencias-cientificas.txt"
            download="Food-Mood-Referencias-Cientificas.txt"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)',
              color: '#C9A84C', fontSize: 12, fontWeight: 700, padding: '10px 20px',
              borderRadius: 8, textDecoration: 'none', letterSpacing: '0.03em',
            }}
          >
            ↓ Descargar bibliografía completa (.txt)
          </a>
        </div>
      </div>

      {/* Curator note */}
      <div style={{ backgroundColor: '#EDE8DC', borderBottom: '1px solid #DDD7C8', padding: '20px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#5A4E48', lineHeight: 1.7 }}>
            <strong style={{ color: '#1A1612' }}>Criterios de selección:</strong>{' '}
            Publicaciones en revistas con revisión por pares (PubMed, Nature, Cell, Science, Physiological Reviews) o libros de referencia establecidos en cada disciplina.
            La selección y curación fue realizada por{' '}
            <strong style={{ color: '#1A1612' }}>Susana Ferreras Diez</strong> — Psicóloga colegiada, MSc Biotecnología Alimentaria, MSc Gerontología.
            Las fuentes se actualizan con cada versión del knowledge base.
          </p>
        </div>
      </div>

      {/* Jump nav */}
      <div style={{ backgroundColor: '#F5F0E8', borderBottom: '1px solid #E0D9C8', padding: '16px 40px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#9A8E88', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginRight: 4 }}>Ir a:</span>
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{ fontSize: 10, color: s.color, textDecoration: 'none', fontWeight: 600, padding: '3px 10px', borderRadius: 20, backgroundColor: `${s.color}12`, border: `1px solid ${s.color}25`, whiteSpace: 'nowrap' }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px 80px' }}>
        {SECTIONS.map((section, si) => (
          <section key={section.id} id={section.id} style={{ marginBottom: 56 }}>

            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${section.color}22` }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: section.color, fontWeight: 700, opacity: 0.6 }}>
                0{si + 1}
              </span>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: section.color, marginBottom: 2 }}>
                  {section.label}
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1612', fontWeight: 400 }}>
                  {section.heading}
                </h2>
              </div>
            </div>

            {/* Refs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {section.refs.map((ref, ri) => (
                <div
                  key={ri}
                  style={{
                    backgroundColor: '#fff', borderRadius: 12, padding: '16px 20px',
                    border: '1px solid #E8E2D8',
                  }}
                >
                  <p style={{ fontSize: 12, color: '#1A1612', lineHeight: 1.55, marginBottom: ref.note || ref.doi ? 6 : 0 }}>
                    <span style={{ fontWeight: 700, color: '#3D2E2E' }}>{ref.authors}</span>
                    {' '}
                    <span style={{ color: section.color, fontWeight: 600 }}>({ref.year})</span>
                    {'. '}
                    <em>{ref.title}.</em>
                    {ref.journal && (
                      <span style={{ color: '#6B5E58' }}>{' '}{ref.journal}.</span>
                    )}
                  </p>
                  {ref.doi && (
                    <a
                      href={ref.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 10, color: section.color, textDecoration: 'underline', display: 'block', marginBottom: ref.note ? 4 : 0, opacity: 0.8 }}
                    >
                      {ref.doi}
                    </a>
                  )}
                  {ref.note && (
                    <p style={{ fontSize: 10, color: '#9A8E88', fontStyle: 'italic', lineHeight: 1.5 }}>
                      → {ref.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Footer note */}
        <div style={{ borderTop: '1px solid #DDD7C8', paddingTop: 32, marginTop: 16 }}>
          <p style={{ fontSize: 11, color: '#9A8E88', lineHeight: 1.7 }}>
            Esta lista no es exhaustiva de toda la evidencia existente en cada campo — representa las fuentes directamente incorporadas en el knowledge base activo del Asesor Personal (Mayo 2026).
            Algunas publicaciones aparecen referenciadas de forma indirecta a través de los libros de síntesis incluidos.
            Para consultas sobre metodología o fuentes adicionales:{' '}
            <a href="mailto:info@food-mood.app" style={{ color: '#6B2737' }}>info@food-mood.app</a>
          </p>
          <p style={{ fontSize: 10, color: '#B8AEA8', marginTop: 12 }}>
            <Link href="/" style={{ color: '#B8AEA8', textDecoration: 'underline' }}>food-mood.app</Link>
            {' · '}
            <Link href="/glosario" style={{ color: '#B8AEA8', textDecoration: 'underline' }}>Glosario científico</Link>
            {' · '}
            <Link href="/asesor" style={{ color: '#B8AEA8', textDecoration: 'underline' }}>Asesor Personal</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
