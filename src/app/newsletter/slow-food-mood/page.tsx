import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Por qué cocinar despacio calma la ansiedad | Food·Mood Newsletter Nº 01',
  description:
    'La ciencia detrás de cocinar despacio: cómo los fermentos, los caldos largos y el tiempo biológico regulan el sistema nervioso ansioso. Newsletter Nº 01 de Food·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/slow-food-mood' },
  openGraph: {
    title:       'Fast life. Slow Food·Mood.',
    description: 'Lo que la neurociencia sabe sobre el tiempo, los fermentos y la ansiedad. Y cómo aplicarlo en tu cocina.',
    url:         'https://www.food-mood.app/newsletter/slow-food-mood',
    type:        'article',
    siteName:    'Food·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter Food·Mood — Slow Food·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Fast life. Slow Food·Mood.',
    description: 'Fermentos, caldos y cocina lenta para calmar el sistema nervioso. Newsletter Nº 01 de Food·Mood.',
    images:      ['/og-image.png'],
  },
}

// ── Tokens ────────────────────────────────────────────────────────────────────
const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#FF6B35'
const INK   = '#1a1a1a'
const MUTED = '#7a6a6a'

const SCIENCE_BLOCKS = [
  {
    num:   '90%',
    text:  'De la serotonina de tu cuerpo — el neurotransmisor del bienestar — se produce en el intestino, no en el cerebro. Lo que comes afecta directamente a cómo te sientes.',
    ref:   'Enders, G. — Gut (2014, ed. revisada)',
    bg:    BURG,
    numColor: GOLD,
    textColor: CREAM,
    refColor: 'rgba(245,240,232,0.45)',
  },
  {
    num:   '21',
    text:  'Días es lo que necesita el cerebro para consolidar un hábito nuevo, según el Behavior Design Lab de Stanford. Pero solo si el gesto es pequeño, sensorial y se repite con regularidad.',
    ref:   'Fogg, B.J. — Tiny Habits (Stanford, 2019)',
    bg:    '#fff',
    numColor: BURG,
    textColor: INK,
    refColor: MUTED,
  },
  {
    num:   '5×',
    text:  'Más Lactobacillus plantarum — la bacteria que produce GABA, el freno natural de la ansiedad en el sistema nervioso — tiene el chucrut casero comparado con la col cruda.',
    ref:   'Stanton et al. — Journal of Functional Foods (2024)',
    bg:    BURG,
    numColor: GOLD,
    textColor: CREAM,
    refColor: 'rgba(245,240,232,0.45)',
  },
]

const APRENDE_ITEMS = [
  { n: '01', title: 'Qué pasa en tu intestino cuando fermentas col con sal', sub: 'y por qué importa para tu ansiedad' },
  { n: '02', title: 'Por qué el caldo de huesos es el ansiolítico más antiguo del mundo', sub: 'y cómo hacerlo en casa' },
  { n: '03', title: 'La diferencia entre pan de fermentación rápida y pan de fermentación lenta', sub: 'no es solo el sabor' },
  { n: '04', title: 'Qué es la limonada lacto-fermentada y cómo prepararla', sub: 'con el suero de tu yogur casero' },
  { n: '05', title: 'Por qué el miso nunca se hierve', sub: 'y qué pierdes cuando lo haces' },
  { n: '06', title: 'Cómo un overnight de avena con kéfir cambia tu cortisol de la mañana', sub: 'sin que hagas nada' },
  { n: '07', title: 'La glicina del caldo de huesos y el sueño', sub: 'lo que un estudio de 2023 encontró' },
]

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'Por qué cocinar despacio calma la ansiedad',
      description:        'La ciencia detrás de cocinar despacio: cómo los fermentos, los caldos largos y el tiempo biológico regulan el sistema nervioso ansioso.',
      url:                'https://www.food-mood.app/newsletter/slow-food-mood',
      datePublished:      '2026-04-27',
      dateModified:       '2026-04-27',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/slow-food-mood' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter Food·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Food·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Slow Food·Mood', item: 'https://www.food-mood.app/newsletter/slow-food-mood' },
      ],
    },
  ],
}

export default function SlowFoodMoodNewsletter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <main style={{ backgroundColor: CREAM, minHeight: '100vh' }}>
      {/* Snippet de preview — visible en listas de correo y buscadores */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid rgba(107,39,55,0.08)`, backgroundColor: '#faf6f0' }}>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
          Nº 01 · La ciencia detrás de cocinar despacio y por qué calma el sistema nervioso ansioso más que cualquier técnica de respiración.
        </p>
      </div>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px 120px' }}>

        {/* ── Cabecera ──────────────────────────────────────────────────── */}
        <header style={{ paddingTop: 56, paddingBottom: 48, borderBottom: `1px solid rgba(107,39,55,0.12)` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: BURG, letterSpacing: '0.04em' }}>
                Food·Mood
              </span>
            </Link>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.16em', color: GOLD, display: 'block',
              }}>
                Newsletter · Nº 01
              </span>
              <span style={{ fontSize: 12, color: MUTED, marginTop: 2, display: 'block' }}>
                Mayo 2026
              </span>
            </div>
          </div>
        </header>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: GOLD, marginBottom: 32,
          }}>
            Fast life. Slow Food·Mood.
          </p>

          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: INK,
            marginBottom: 28,
            letterSpacing: '-0.01em',
          }}>
            Tu sistema nervioso no se calma con más información.
          </h1>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 3vw, 22px)',
            lineHeight: 1.5,
            color: GOLD,
            marginBottom: 0,
          }}>
            Se calma con experiencia repetida. Sensorial. Que deja huella en el cuerpo.
          </p>
        </section>

        {/* ── Separador ─────────────────────────────────────────────────── */}
        <Divider />

        {/* ── Sección 1: El problema ────────────────────────────────────── */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>Lo que todos sabemos y nadie puede aplicar</Label>

          <Body>
            Sabes que deberías ir más despacio.<br />
            Sabes que el estrés te está afectando.<br />
            Sabes que deberías dormir más, respirar mejor, desconectar.
          </Body>

          <Body style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: BURG }}>
            Lo sabes. Y aun así, no puedes.
          </Body>

          <Body>
            No es falta de fuerza de voluntad. Es que el conocimiento solo no cambia los hábitos. Nunca lo ha hecho.
          </Body>

          <Body>
            Lo que cambia los hábitos es la experiencia repetida, encarnada en el cuerpo, anclada a los sentidos.
          </Body>

          <Body style={{ fontWeight: 600, color: INK }}>
            Y eso, exactamente, es lo que hace la cocina lenta.
          </Body>
        </section>

        <Divider />

        {/* ── Sección 2: La ciencia ─────────────────────────────────────── */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>Lo que dice la ciencia</Label>

          <Body>
            No hace falta que lo creas porque lo digo yo.<br />
            Hay investigación seria detrás de esto.
          </Body>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 48, marginBottom: 48 }}>
            {SCIENCE_BLOCKS.map((b) => (
              <div key={b.num} style={{
                backgroundColor: b.bg,
                borderRadius: 20,
                padding: 'clamp(32px, 5vw, 48px)',
                border: b.bg === '#fff' ? `1px solid rgba(107,39,55,0.1)` : 'none',
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(64px, 12vw, 96px)',
                  fontWeight: 700,
                  color: b.numColor,
                  lineHeight: 1,
                  marginBottom: 20,
                  letterSpacing: '-0.03em',
                }}>
                  {b.num}
                </div>
                <p style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: b.textColor,
                  margin: '0 0 16px',
                  fontWeight: 400,
                }}>
                  {b.text}
                </p>
                <p style={{
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: b.refColor,
                  margin: 0,
                }}>
                  {b.ref}
                </p>
              </div>
            ))}
          </div>

          <Body>
            El GABA es el neurotransmisor que le dice al sistema nervioso:{' '}
            <em style={{ fontFamily: 'Georgia, serif', color: BURG }}>&ldquo;Para. Todo está bien. No hay peligro.&rdquo;</em>
          </Body>

          <Body>
            Y resulta que los fermentos caseros lo producen directamente. Sin pastillas. Sin suplementos. Con col, sal y tiempo.
          </Body>
        </section>

        <Divider />

        {/* ── Sección 3: El concepto central ───────────────────────────── */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>Lo que los fermentos saben que tú has olvidado</Label>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 400,
            color: INK,
            lineHeight: 1.3,
            marginBottom: 40,
          }}>
            Hay alimentos que no pueden mentir sobre el tiempo.
          </p>

          <Body>
            Un fermento no se hace en una hora.<br />
            Una masa madre no admite prisas.<br />
            Un caldo de huesos necesita cuatro horas de fuego suave para liberar la glicina que calma el sistema nervioso.
          </Body>

          <Body>
            No porque nadie lo haya decidido así.<br />
            Sino porque la biología tiene sus propios ritmos.<br />
            Y llevan aquí mucho más tiempo que nosotros.
          </Body>

          <Body>
            Cuando cocinas algo que necesita espera, pasa algo curioso: tú también empiezas a esperar. A quedarte cerca del fuego. A soltar el control.
          </Body>

          <Body style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: BURG }}>
            Y eso — sin que nadie te lo diga explícitamente — es exactamente lo que necesita el sistema nervioso ansioso.
          </Body>
        </section>

        <Divider />

        {/* ── Sección 4: Lo que vas a aprender ─────────────────────────── */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>21 días. Un gesto lento al día.</Label>

          <Body>
            No es una dieta. No es un plan de bienestar genérico. Es aprender a cocinar de otra manera — y en el proceso, aprender a vivir de otra manera.
          </Body>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {APRENDE_ITEMS.map((item, i) => (
              <div key={item.n} style={{
                display: 'flex',
                gap: 24,
                alignItems: 'flex-start',
                padding: '28px 0',
                borderTop: i === 0 ? `1px solid rgba(107,39,55,0.1)` : `1px solid rgba(107,39,55,0.1)`,
              }}>
                <span style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(22px, 4vw, 28px)',
                  fontWeight: 700,
                  color: GOLD,
                  lineHeight: 1,
                  minWidth: 40,
                  paddingTop: 4,
                  flexShrink: 0,
                }}>
                  {item.n}
                </span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: INK, margin: '0 0 4px', lineHeight: 1.4 }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 14, color: MUTED, margin: 0, fontStyle: 'italic' }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
            <div style={{ borderBottom: `1px solid rgba(107,39,55,0.1)` }} />
          </div>
        </section>

        {/* ── Sección 5: CTA principal ──────────────────────────────────── */}
        <section style={{
          backgroundColor: BURG,
          borderRadius: 24,
          padding: 'clamp(48px, 8vw, 72px) clamp(28px, 6vw, 56px)',
          marginBottom: 80,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: GOLD, marginBottom: 24,
          }}>
            Empieza el reto
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 400,
            color: CREAM,
            lineHeight: 1.15,
            marginBottom: 32,
            letterSpacing: '-0.01em',
          }}>
            Fast life.<br />Slow Food·Mood.
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(245,240,232,0.8)', marginBottom: 36 }}>
            Durante 21 días vas a preparar alimentos que tienen su propio ritmo biológico. Fermentos, masas, caldos, reposos. Y en ese proceso — sin que te des cuenta — tu mente empieza a soltar.
          </p>

          <div style={{
            borderTop: '1px solid rgba(245,240,232,0.15)',
            paddingTop: 32,
            marginBottom: 40,
          }}>
            {[
              'Una preparación lenta (5 a 20 minutos activos)',
              'Un audio de ritual guiado antes de cocinar',
              'Una pregunta para tu diario de ritmo',
              'Un dato científico contextualizado',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ color: GOLD, flexShrink: 0, marginTop: 2, fontSize: 14 }}>·</span>
                <p style={{ fontSize: 15, color: 'rgba(245,240,232,0.75)', margin: 0, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(245,240,232,0.7)', marginBottom: 40 }}>
            Al día 21: tu <strong style={{ color: CREAM }}>Mapa de Ritmo Mental</strong> — una visualización de cómo ha cambiado tu relación con el tiempo y la ansiedad a lo largo de tres semanas.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/auth/login" style={{
              display: 'block',
              backgroundColor: GOLD,
              color: BURG,
              textAlign: 'center',
              padding: '18px 32px',
              borderRadius: 999,
              fontFamily: 'Georgia, serif',
              fontSize: 17,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'opacity 0.2s',
            }}>
              Acceder a Food·Mood
            </Link>
          </div>
        </section>

        {/* ── Sección 6: La frase final ─────────────────────────────────── */}
        <section style={{ paddingTop: 20, paddingBottom: 100, textAlign: 'center' }}>
          <blockquote style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: 400,
            color: BURG,
            lineHeight: 1.45,
            margin: '0 0 24px',
            fontStyle: 'italic',
          }}>
            &ldquo;No necesitas más información sobre la ansiedad.<br />
            Necesitas cocinar algo que no puedas hacer en diez minutos.&rdquo;
          </blockquote>
          <p style={{ fontSize: 13, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            — Food·Mood
          </p>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer style={{
          borderTop: `1px solid rgba(107,39,55,0.12)`,
          paddingTop: 40,
          paddingBottom: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: BURG }}>
              Food·Mood
            </span>
          </Link>

          <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED, maxWidth: 440, margin: 0 }}>
            Suscríbete y únete a nuestro club de WhatsApp Premium — contenido curado de verdad y contrastado por nuestros expertos.
          </p>

          <Link href="/auth/login" style={{
            fontSize: 13, fontWeight: 700, color: BURG,
            textDecoration: 'underline', textDecorationColor: GOLD,
          }}>
            Crear cuenta gratis →
          </Link>

          <div style={{ marginTop: 8 }}>
            <Link href="https://food-mood.app" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>
              food-mood.app
            </Link>
            <span style={{ fontSize: 12, color: MUTED, margin: '0 8px' }}>·</span>
            <span style={{ fontSize: 12, color: MUTED }}>© 2026</span>
          </div>
        </footer>

      </div>
    </main>
    </>
  )
}

// ── Componentes internos ──────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1, height: 1, backgroundColor: `rgba(107,39,55,0.1)` }} />
      <span style={{ color: GOLD, fontSize: 16, letterSpacing: '0.2em' }}>·</span>
      <div style={{ flex: 1, height: 1, backgroundColor: `rgba(107,39,55,0.1)` }} />
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const,
      letterSpacing: '0.18em', color: GOLD, marginBottom: 32,
    }}>
      {children}
    </p>
  )
}

function Body({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      fontSize: 17,
      lineHeight: 1.75,
      color: INK,
      marginBottom: 28,
      ...style,
    }}>
      {children}
    </p>
  )
}

