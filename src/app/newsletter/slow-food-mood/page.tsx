import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Por quÃ© cocinar despacio calma la ansiedad | FoodÂ·Mood Newsletter NÂº 01',
  description:
    'La ciencia detrÃ¡s de cocinar despacio: cÃ³mo los fermentos, los caldos largos y el tiempo biolÃ³gico regulan el sistema nervioso ansioso. Newsletter NÂº 01 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/slow-food-mood' },
  openGraph: {
    title:       'Fast life. Slow FoodÂ·Mood.',
    description: 'Lo que la neurociencia sabe sobre el tiempo, los fermentos y la ansiedad. Y cÃ³mo aplicarlo en tu cocina.',
    url:         'https://www.food-mood.app/newsletter/slow-food-mood',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Slow FoodÂ·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Fast life. Slow FoodÂ·Mood.',
    description: 'Fermentos, caldos y cocina lenta para calmar el sistema nervioso. Newsletter NÂº 01 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

// â”€â”€ Tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#C9A84C'
const INK   = '#1a1a1a'
const MUTED = '#7a6a6a'

const SCIENCE_BLOCKS = [
  {
    num:   '90%',
    text:  'De la serotonina de tu cuerpo â€” el neurotransmisor del bienestar â€” se produce en el intestino, no en el cerebro. Lo que comes afecta directamente a cÃ³mo te sientes.',
    ref:   'Enders, G. â€” Gut (2014, ed. revisada)',
    bg:    BURG,
    numColor: GOLD,
    textColor: CREAM,
    refColor: 'rgba(245,240,232,0.45)',
  },
  {
    num:   '21',
    text:  'DÃ­as es lo que necesita el cerebro para consolidar un hÃ¡bito nuevo, segÃºn el Behavior Design Lab de Stanford. Pero solo si el gesto es pequeÃ±o, sensorial y se repite con regularidad.',
    ref:   'Fogg, B.J. â€” Tiny Habits (Stanford, 2019)',
    bg:    '#fff',
    numColor: BURG,
    textColor: INK,
    refColor: MUTED,
  },
  {
    num:   '5Ã—',
    text:  'MÃ¡s Lactobacillus plantarum â€” la bacteria que produce GABA, el freno natural de la ansiedad en el sistema nervioso â€” tiene el chucrut casero comparado con la col cruda.',
    ref:   'Stanton et al. â€” Journal of Functional Foods (2024)',
    bg:    BURG,
    numColor: GOLD,
    textColor: CREAM,
    refColor: 'rgba(245,240,232,0.45)',
  },
]

const APRENDE_ITEMS = [
  { n: '01', title: 'QuÃ© pasa en tu intestino cuando fermentas col con sal', sub: 'y por quÃ© importa para tu ansiedad' },
  { n: '02', title: 'Por quÃ© el caldo de huesos es el ansiolÃ­tico mÃ¡s antiguo del mundo', sub: 'y cÃ³mo hacerlo en casa' },
  { n: '03', title: 'La diferencia entre pan de fermentaciÃ³n rÃ¡pida y pan de fermentaciÃ³n lenta', sub: 'no es solo el sabor' },
  { n: '04', title: 'QuÃ© es la limonada lacto-fermentada y cÃ³mo prepararla', sub: 'con el suero de tu yogur casero' },
  { n: '05', title: 'Por quÃ© el miso nunca se hierve', sub: 'y quÃ© pierdes cuando lo haces' },
  { n: '06', title: 'CÃ³mo un overnight de avena con kÃ©fir cambia tu cortisol de la maÃ±ana', sub: 'sin que hagas nada' },
  { n: '07', title: 'La glicina del caldo de huesos y el sueÃ±o', sub: 'lo que un estudio de 2023 encontrÃ³' },
]

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'Por quÃ© cocinar despacio calma la ansiedad',
      description:        'La ciencia detrÃ¡s de cocinar despacio: cÃ³mo los fermentos, los caldos largos y el tiempo biolÃ³gico regulan el sistema nervioso ansioso.',
      url:                'https://www.food-mood.app/newsletter/slow-food-mood',
      datePublished:      '2026-04-27',
      dateModified:       '2026-04-27',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/slow-food-mood' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Slow FoodÂ·Mood', item: 'https://www.food-mood.app/newsletter/slow-food-mood' },
      ],
    },
  ],
}

export default function SlowFoodMoodNewsletter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <main style={{ backgroundColor: CREAM, minHeight: '100vh' }}>
      {/* Snippet de preview â€” visible en listas de correo y buscadores */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid rgba(107,39,55,0.08)`, backgroundColor: '#faf6f0' }}>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
          NÂº 01 Â· La ciencia detrÃ¡s de cocinar despacio y por quÃ© calma el sistema nervioso ansioso mÃ¡s que cualquier tÃ©cnica de respiraciÃ³n.
        </p>
      </div>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px 120px' }}>

        {/* â”€â”€ Cabecera â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <header style={{ paddingTop: 56, paddingBottom: 48, borderBottom: `1px solid rgba(107,39,55,0.12)` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: BURG, letterSpacing: '0.04em' }}>
                FoodÂ·Mood
              </span>
            </Link>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.16em', color: GOLD, display: 'block',
              }}>
                Newsletter Â· NÂº 01
              </span>
              <span style={{ fontSize: 12, color: MUTED, marginTop: 2, display: 'block' }}>
                Mayo 2026
              </span>
            </div>
          </div>
        </header>

        {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: GOLD, marginBottom: 32,
          }}>
            Fast life. Slow FoodÂ·Mood.
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
            Tu sistema nervioso no se calma con mÃ¡s informaciÃ³n.
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

        {/* â”€â”€ Separador â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Divider />

        {/* â”€â”€ SecciÃ³n 1: El problema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>Lo que todos sabemos y nadie puede aplicar</Label>

          <Body>
            Sabes que deberÃ­as ir mÃ¡s despacio.<br />
            Sabes que el estrÃ©s te estÃ¡ afectando.<br />
            Sabes que deberÃ­as dormir mÃ¡s, respirar mejor, desconectar.
          </Body>

          <Body style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: BURG }}>
            Lo sabes. Y aun asÃ­, no puedes.
          </Body>

          <Body>
            No es falta de fuerza de voluntad. Es que el conocimiento solo no cambia los hÃ¡bitos. Nunca lo ha hecho.
          </Body>

          <Body>
            Lo que cambia los hÃ¡bitos es la experiencia repetida, encarnada en el cuerpo, anclada a los sentidos.
          </Body>

          <Body style={{ fontWeight: 600, color: INK }}>
            Y eso, exactamente, es lo que hace la cocina lenta.
          </Body>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 2: La ciencia â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>Lo que dice la ciencia</Label>

          <Body>
            No hace falta que lo creas porque lo digo yo.<br />
            Hay investigaciÃ³n seria detrÃ¡s de esto.
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
            <em style={{ fontFamily: 'Georgia, serif', color: BURG }}>&ldquo;Para. Todo estÃ¡ bien. No hay peligro.&rdquo;</em>
          </Body>

          <Body>
            Y resulta que los fermentos caseros lo producen directamente. Sin pastillas. Sin suplementos. Con col, sal y tiempo.
          </Body>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 3: El concepto central â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>Lo que los fermentos saben que tÃº has olvidado</Label>

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
            No porque nadie lo haya decidido asÃ­.<br />
            Sino porque la biologÃ­a tiene sus propios ritmos.<br />
            Y llevan aquÃ­ mucho mÃ¡s tiempo que nosotros.
          </Body>

          <Body>
            Cuando cocinas algo que necesita espera, pasa algo curioso: tÃº tambiÃ©n empiezas a esperar. A quedarte cerca del fuego. A soltar el control.
          </Body>

          <Body style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: BURG }}>
            Y eso â€” sin que nadie te lo diga explÃ­citamente â€” es exactamente lo que necesita el sistema nervioso ansioso.
          </Body>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 4: Lo que vas a aprender â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <Label>21 dÃ­as. Un gesto lento al dÃ­a.</Label>

          <Body>
            No es una dieta. No es un plan de bienestar genÃ©rico. Es aprender a cocinar de otra manera â€” y en el proceso, aprender a vivir de otra manera.
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

        {/* â”€â”€ SecciÃ³n 5: CTA principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
            Fast life.<br />Slow FoodÂ·Mood.
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(245,240,232,0.8)', marginBottom: 36 }}>
            Durante 21 dÃ­as vas a preparar alimentos que tienen su propio ritmo biolÃ³gico. Fermentos, masas, caldos, reposos. Y en ese proceso â€” sin que te des cuenta â€” tu mente empieza a soltar.
          </p>

          <div style={{
            borderTop: '1px solid rgba(245,240,232,0.15)',
            paddingTop: 32,
            marginBottom: 40,
          }}>
            {[
              'Una preparaciÃ³n lenta (5 a 20 minutos activos)',
              'Un audio de ritual guiado antes de cocinar',
              'Una pregunta para tu diario de ritmo',
              'Un dato cientÃ­fico contextualizado',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ color: GOLD, flexShrink: 0, marginTop: 2, fontSize: 14 }}>Â·</span>
                <p style={{ fontSize: 15, color: 'rgba(245,240,232,0.75)', margin: 0, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(245,240,232,0.7)', marginBottom: 40 }}>
            Al dÃ­a 21: tu <strong style={{ color: CREAM }}>Mapa de Ritmo Mental</strong> â€” una visualizaciÃ³n de cÃ³mo ha cambiado tu relaciÃ³n con el tiempo y la ansiedad a lo largo de tres semanas.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/retos/slow-food-mood" style={{
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
              Empezar el reto Â· 29â‚¬
            </Link>

            <Link href="/retos/slow-food-mood" style={{
              display: 'block',
              textAlign: 'center',
              color: GOLD,
              textDecoration: 'underline',
              textDecorationColor: GOLD,
              fontSize: 14,
              padding: '8px 0',
            }}>
              Ver todos los retos FoodÂ·Mood â†’
            </Link>
          </div>
        </section>

        {/* â”€â”€ SecciÃ³n 6: La frase final â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
            &ldquo;No necesitas mÃ¡s informaciÃ³n sobre la ansiedad.<br />
            Necesitas cocinar algo que no puedas hacer en diez minutos.&rdquo;
          </blockquote>
          <p style={{ fontSize: 13, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            â€” FoodÂ·Mood
          </p>
        </section>

        {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              FoodÂ·Mood
            </span>
          </Link>

          <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTED, maxWidth: 440, margin: 0 }}>
            SuscrÃ­bete y Ãºnete a nuestro club de WhatsApp Premium â€” contenido curado de verdad y contrastado por nuestros expertos.
          </p>

          <Link href="/auth/login" style={{
            fontSize: 13, fontWeight: 700, color: BURG,
            textDecoration: 'underline', textDecorationColor: GOLD,
          }}>
            Crear cuenta gratis â†’
          </Link>

          <div style={{ marginTop: 8 }}>
            <Link href="https://food-mood.app" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>
              food-mood.app
            </Link>
            <span style={{ fontSize: 12, color: MUTED, margin: '0 8px' }}>Â·</span>
            <span style={{ fontSize: 12, color: MUTED }}>Â© 2026</span>
          </div>
        </footer>

      </div>
    </main>
    </>
  )
}

// â”€â”€ Componentes internos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: 1, height: 1, backgroundColor: `rgba(107,39,55,0.1)` }} />
      <span style={{ color: GOLD, fontSize: 16, letterSpacing: '0.2em' }}>Â·</span>
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

