import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QuÃ© es el pan de masa madre (y por quÃ© huele asÃ­ de bien) | FoodÂ·Mood Newsletter NÂº 02',
  description:
    'La historia mÃ¡s corta y mÃ¡s apetecible sobre el pan de masa madre: quÃ© es, por quÃ© fermenta, y cÃ³mo afecta a tu cuerpo y tu humor. Newsletter NÂº 02 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
  openGraph: {
    title:       'Hay pan. Y luego hay PAN.',
    description: 'Todo lo que siempre quisiste saber sobre la masa madre â€” explicado sin aburrirte.',
    url:         'https://www.food-mood.app/newsletter/pan-de-masa-madre',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Pan de Masa Madre' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Hay pan. Y luego hay PAN.',
    description: 'Por quÃ© el pan de masa madre huele asÃ­, digiere mejor y baja el Ã­ndice glucÃ©mico. Newsletter NÂº 02.',
    images:      ['/og-image.png'],
  },
}

// â”€â”€ Tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#C9A84C'
const INK   = '#1a1a1a'
const MUTED = '#7a6a6a'

const ITEMS = [
  {
    n: '01',
    titulo: 'El pan que digiere por ti.',
    texto: 'Durante la fermentaciÃ³n larga, las bacterias degradan parcialmente el gluten y predigieren los almidones del trigo. Â¿Resultado? Un pan mucho mÃ¡s fÃ¡cil de digerir. Muchas personas que se llevan mal con el pan normal toleran perfectamente la masa madre. (No es lo mismo que "sin gluten" â€” es distinto. Y mucho mÃ¡s rico.)',
  },
  {
    n: '02',
    titulo: 'El Ã­ndice glucÃ©mico baja. Tu energÃ­a, sube.',
    texto: 'El pan de masa madre tiene un Ã­ndice glucÃ©mico significativamente mÃ¡s bajo que el pan blanco normal. Eso significa que la glucosa llega a la sangre despacio, sin el pico-caÃ­da que te deja agotado a media maÃ±ana. La diferencia entre aguantar hasta la comida y necesitar un bollo a las 11.',
  },
  {
    n: '03',
    titulo: 'Huele asÃ­ porque fermenta de verdad.',
    texto: 'El aroma del pan de masa madre viene de los Ã¡cidos orgÃ¡nicos que producen las bacterias â€” Ã¡cido lÃ¡ctico y Ã¡cido acÃ©tico. Los mismos que hay en el yogur y en el vinagre. Por eso huele a algo vivo, complejo, casi Ã¡cido. Y por eso el pan industrial nunca va a oler igual. Aunque diga "artesano" en el packaging.',
  },
]

function Divider() {
  return (
    <p style={{ textAlign: 'center', color: GOLD, fontSize: 18, letterSpacing: '0.3em', margin: '0' }}>
      Â· Â· Â·
    </p>
  )
}

function Label({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.18em', color: GOLD, marginBottom: 28, marginTop: 0,
    }}>
      {children}
    </p>
  )
}

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'QuÃ© es el pan de masa madre (y por quÃ© huele asÃ­ de bien)',
      description:        'La historia mÃ¡s corta y mÃ¡s apetecible sobre el pan de masa madre: quÃ© es, por quÃ© fermenta, y cÃ³mo afecta a tu cuerpo y tu humor.',
      url:                'https://www.food-mood.app/newsletter/pan-de-masa-madre',
      datePublished:      '2026-05-04',
      dateModified:       '2026-05-04',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Pan de masa madre', item: 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
      ],
    },
  ],
}

export default function PanDeMasaMadreNewsletter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <main style={{ backgroundColor: CREAM, minHeight: '100vh' }}>
      {/* Snippet de preview â€” visible en listas de correo y buscadores */}
      <div style={{ padding: '12px 20px', borderBottom: `1px solid rgba(107,39,55,0.08)`, backgroundColor: '#faf6f0' }}>
        <p style={{ fontSize: 13, color: MUTED, margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
          NÂº 02 Â· Por quÃ© el pan de masa madre huele distinto, digiere diferente y baja el Ã­ndice glucÃ©mico â€” explicado sin aburrirte.
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
                Newsletter Â· NÂº 02
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
            letterSpacing: '0.18em', color: GOLD, marginBottom: 32, marginTop: 0,
          }}>
            Esto es lo que hueles cuando alguien hace pan de verdad
          </p>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 6vw, 44px)',
            fontWeight: 400, lineHeight: 1.12, color: INK,
            margin: '0 0 28px', letterSpacing: '-0.01em',
          }}>
            Hay pan.<br />Y luego hay <span style={{ color: BURG }}>PAN.</span>
          </h1>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: 'clamp(17px, 3vw, 21px)', lineHeight: 1.55,
            color: GOLD, margin: 0,
          }}>
            Una historia corta sobre burbujas, tiempo<br />
            y por quÃ© el pan del sÃºper no es lo mismo.
          </p>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 1: El gancho sensorial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '72px 0' }}>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Cierra los ojos un segundo.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Imagina que abres la puerta de tu casa y hueles pan reciÃ©n hecho.
            No el de molde. No el de esos paquetes con fecha de caducidad en 2026.
            El otro. El que huele a algo <em style={{ fontFamily: 'Georgia, serif', color: BURG }}>vivo.</em>
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Ese olor tiene nombre.<br />
            Se llama fermentaciÃ³n.<br />
            Y lleva miles de aÃ±os siendo lo mejor que puede pasarte al entrar a casa.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: 0 }}>
            Hoy te cuento quÃ© es exactamente la masa madre,
            por quÃ© ese pan huele asÃ­,
            y quÃ© tiene de distinto al pan de siempre.{' '}
            <span style={{ color: GOLD, fontStyle: 'italic' }}>(Spoiler: bastante.)</span>
          </p>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 2: QuÃ© es la masa madre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '72px 0' }}>
          <Label>La pregunta de todos</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            La masa madre es agua y harina.<br />
            Eso es todo.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Bueno â€” agua, harina, y millones de microorganismos vivos
            que llevan ahÃ­ fermentando desde que alguien tuvo la idea
            de no tirar la masa del dÃ­a anterior.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Cuando mezclas harina con agua y lo dejas en reposo,
            ocurre algo precioso: las levaduras y bacterias
            que viven de forma natural en el ambiente
            â€”y en la propia harinaâ€” empiezan a comerse los azÃºcares.
            A respirar. A reproducirse.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 48px' }}>
            A vivir, bÃ¡sicamente.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 48px' }}>
            Eso que burbujea en el tarro de tu abuela no es magia.
            Es un ecosistema. Un jardÃ­n microscÃ³pico.
            Con su propio equilibrio, su propio carÃ¡cter,
            su propio sabor.
          </p>

          {/* Card dato 1849 */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '44px 40px',
            border: `1px solid ${GOLD}55`,
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: 'clamp(19px, 3vw, 24px)', lineHeight: 1.5,
              color: BURG, margin: '0 0 20px',
            }}>
              &ldquo;Una masa madre bien cuidada<br />
              puede vivir mÃ¡s de 100 aÃ±os.<br />
              Hay panaderÃ­as en San Francisco<br />
              con masa madre de <span style={{ color: GOLD }}>1849.</span>&rdquo;
            </p>
            <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: 0 }}>
              Dato verificable â€” Boudin Bakery, SF, fundada 1849
            </p>
          </div>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 3: Por quÃ© es distinto â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '72px 0' }}>
          <Label>Lo que pasa dentro (sin ponerse tÃ©cnicos)</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            El pan industrial no fermenta.
            Sube rÃ¡pido gracias a levadura quÃ­mica o levadura comercial
            que hace su trabajo en 45 minutos y se va.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 56px' }}>
            La masa madre fermenta durante horas. A veces dÃ­as.
            Y en ese tiempo, pasan cosas interesantes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {ITEMS.map(({ n, titulo, texto }) => (
              <div key={n} style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 700,
                  color: GOLD, lineHeight: 1, flexShrink: 0, marginTop: -6,
                }}>
                  {n}
                </span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 10px' }}>
                    {titulo}
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, margin: 0 }}>
                    {texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 4: La parte que mÃ¡s nos gusta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '72px 0' }}>
          <Label>El momento FoodÂ·Mood</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Â¿Sabes lo que pasa cuando haces pan en casa?
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Que tienes que esperar.
            Y esperar con algo que huele tan bien es,
            objetivamente, uno de los placeres mÃ¡s subestimados de la vida adulta.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Hay estudios que dicen que el olor a pan reciÃ©n hecho
            activa el sistema de recompensa dopaminÃ©rgico.
            Que literalmente te pone de mejor humor.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 56px' }}>
            Nosotros lo decimos de otra forma:
            si tienes pan en el horno, es imposible estar de mal humor.
            Es biolÃ³gicamente complicado.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 56px' }}>
            Esto lo sabÃ­an los egipcios (3.000 a.C. â€” los primeros en fermentar pan).
            Lo sabÃ­an las abuelas (siempre).
            Y ahora lo confirma la neurociencia.{' '}
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: MUTED }}>
              Tardamos, pero llegamos.
            </span>
          </p>

          {/* Pull quote */}
          <div style={{ padding: '16px 0 8px', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: 'clamp(20px, 3.5vw, 26px)', lineHeight: 1.45,
              color: BURG, margin: 0,
            }}>
              &ldquo;Hacer pan de masa madre no es un hobby de gente rara.<br />
              Es la cosa mÃ¡s antigua y mÃ¡s sensata del mundo.&rdquo;
            </p>
          </div>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 5: CÃ³mo empezar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '72px 0' }}>
          <Label>La versiÃ³n honesta</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 40px' }}>
            La gente tiene miedo de la masa madre porque parece complicado.
            No lo es. Pero sÃ­ requiere una cosa que en 2026 es escasa:{' '}
            <strong style={{ color: BURG }}>paciencia.</strong>
          </p>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{
              flex: '1 1 240px',
              background: '#fff',
              borderRadius: 16,
              padding: '32px 28px',
              border: `1px solid rgba(107,39,55,0.1)`,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.14em', color: GOLD, margin: '0 0 16px',
              }}>
                Lo que necesitas
              </p>
              {[
                'Un tarro de vidrio limpio',
                'Harina (mejor integral para la primera vez)',
                'Agua sin cloro (filtrada o mineral)',
                'Siete dÃ­as de curiosidad',
              ].map(item => (
                <p key={item} style={{ fontSize: 15, lineHeight: 1.7, color: INK, margin: '0 0 8px' }}>
                  â€” {item}
                </p>
              ))}
            </div>
            <div style={{
              flex: '1 1 240px',
              background: '#fff',
              borderRadius: 16,
              padding: '32px 28px',
              border: `1px solid rgba(107,39,55,0.1)`,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.14em', color: MUTED, margin: '0 0 16px',
              }}>
                Lo que NO necesitas
              </p>
              {[
                'Yogurtera',
                'Horno especial',
                'Haber hecho pan antes',
                'NingÃºn equipo raro',
              ].map(item => (
                <p key={item} style={{ fontSize: 15, lineHeight: 1.7, color: MUTED, margin: '0 0 8px' }}>
                  â€” {item}
                </p>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: 0 }}>
            El primer intento quizÃ¡s no salga perfecto.
            El segundo tampoco, posiblemente.
            El tercero... bueno, el tercero suele ser el momento en que entiendes
            por quÃ© la gente se obsesiona con esto.
          </p>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 6: Enlace natural al reto â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '72px 0' }}>
          <Label>Si quieres ir mÃ¡s lejos</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            En el reto Slow FoodÂ·Mood, el pan de masa madre
            â€”o la versiÃ³n de fermentaciÃ³n lenta para principiantesâ€”
            es uno de los protagonistas.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            No porque sea el ingrediente mÃ¡s importante.
            Sino porque hacer pan despacio â€”
            esperar a que la masa doble,
            sentir la textura bajo las manos,
            escuchar el crujido cuando lo sacas del horno â€”
            es exactamente el tipo de experiencia que regula
            el sistema nervioso ansioso.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 64px' }}>
            Lo dice la ciencia. Pero sobre todo lo dice el olor.
            Y el olor nunca miente.
          </p>

          {/* CTA bloque */}
          <div style={{
            background: BURG,
            borderRadius: 24,
            padding: '56px 44px',
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.18em', color: GOLD, margin: '0 0 20px',
            }}>
              Empieza el reto
            </p>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 400, color: CREAM,
              lineHeight: 1.2, margin: '0 0 24px',
            }}>
              21 dÃ­as de cocina lenta.<br />
              Una preparaciÃ³n al dÃ­a.<br />
              Y la ansiedad empieza a tener<br />
              otro ritmo.
            </h2>
            <p style={{
              fontSize: 16, lineHeight: 1.7,
              color: 'rgba(245,240,232,0.75)', margin: '0 0 36px',
            }}>
              Fermentos, masas, caldos, reposos.
              Y en ese proceso â€” sin que te des cuenta â€” tu mente empieza a soltar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Link
                href="/retos/slow-food-mood"
                style={{
                  display: 'inline-block',
                  background: GOLD,
                  color: BURG,
                  padding: '18px 48px',
                  borderRadius: 999,
                  fontFamily: 'Georgia, serif',
                  fontSize: 17,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Ver el reto Slow FoodÂ·Mood Â· 29â‚¬
              </Link>
              <Link
                href="/retos/slow-food-mood"
                style={{
                  fontSize: 14,
                  color: 'rgba(245,240,232,0.7)',
                  textDecoration: 'underline',
                  textDecorationColor: GOLD,
                  textUnderlineOffset: 3,
                }}
              >
                Empezar con 7 dÃ­as Â· 19â‚¬
              </Link>
            </div>
          </div>
        </section>

        <Divider />

        {/* â”€â”€ SecciÃ³n 7: Cierre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '80px 0 40px', textAlign: 'center' }}>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: INK,
            maxWidth: 480, margin: '0 auto 40px',
          }}>
            La prÃ³xima vez que pases por delante de una panaderÃ­a
            y el olor te pare en seco,
            ya sabrÃ¡s lo que pasa.
          </p>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: INK,
            maxWidth: 480, margin: '0 auto 40px',
          }}>
            Son las bacterias.<br />
            Son los Ã¡cidos orgÃ¡nicos.<br />
            Es la fermentaciÃ³n.
          </p>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: INK,
            maxWidth: 480, margin: '0 auto 48px',
          }}>
            O simplemente: es que alguien se tomÃ³ el tiempo de hacer las cosas bien.
            Y eso, siempre, se nota.
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: 22, color: GOLD, margin: 0,
          }}>
            Fast life. Slow FoodÂ·Mood.
          </p>
        </section>

        {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <footer style={{
          borderTop: `1px solid rgba(107,39,55,0.12)`,
          paddingTop: 40,
          textAlign: 'center',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: 18,
              fontWeight: 700, color: BURG, margin: '0 0 8px',
            }}>
              FoodÂ·Mood
            </p>
          </Link>
          <p style={{ fontSize: 12, color: MUTED, margin: '0 0 20px' }}>
            food-mood.app Â· Â© 2026
          </p>
          <p style={{ fontSize: 13, color: MUTED, maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
            SuscrÃ­bete y Ãºnete a nuestro club de WhatsApp Premium â€”
            contenido curado de verdad y contrastado por nuestros expertos.
          </p>
        </footer>

      </div>
    </main>
    </>
  )
}

