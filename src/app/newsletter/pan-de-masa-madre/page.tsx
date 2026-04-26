import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Qué es el pan de masa madre (y por qué huele así de bien) | Food·Mood',
  description:
    'La historia más corta y más apetecible sobre el pan de masa madre: qué es, por qué fermenta, y cómo afecta a tu cuerpo y tu humor.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/pan-de-masa-madre' },
  openGraph: {
    title:       'Hay pan. Y luego hay PAN.',
    description: 'Todo lo que siempre quisiste saber sobre la masa madre — explicado sin aburrirte.',
    url:         'https://www.food-mood.app/newsletter/pan-de-masa-madre',
    type:        'article',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

// ── Tokens ────────────────────────────────────────────────────────────────────
const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#C9A84C'
const INK   = '#1a1a1a'
const MUTED = '#7a6a6a'

const ITEMS = [
  {
    n: '01',
    titulo: 'El pan que digiere por ti.',
    texto: 'Durante la fermentación larga, las bacterias degradan parcialmente el gluten y predigieren los almidones del trigo. ¿Resultado? Un pan mucho más fácil de digerir. Muchas personas que se llevan mal con el pan normal toleran perfectamente la masa madre. (No es lo mismo que "sin gluten" — es distinto. Y mucho más rico.)',
  },
  {
    n: '02',
    titulo: 'El índice glucémico baja. Tu energía, sube.',
    texto: 'El pan de masa madre tiene un índice glucémico significativamente más bajo que el pan blanco normal. Eso significa que la glucosa llega a la sangre despacio, sin el pico-caída que te deja agotado a media mañana. La diferencia entre aguantar hasta la comida y necesitar un bollo a las 11.',
  },
  {
    n: '03',
    titulo: 'Huele así porque fermenta de verdad.',
    texto: 'El aroma del pan de masa madre viene de los ácidos orgánicos que producen las bacterias — ácido láctico y ácido acético. Los mismos que hay en el yogur y en el vinagre. Por eso huele a algo vivo, complejo, casi ácido. Y por eso el pan industrial nunca va a oler igual. Aunque diga "artesano" en el packaging.',
  },
]

function Divider() {
  return (
    <p style={{ textAlign: 'center', color: GOLD, fontSize: 18, letterSpacing: '0.3em', margin: '0' }}>
      · · ·
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

export default function PanDeMasaMadreNewsletter() {
  return (
    <main style={{ backgroundColor: CREAM, minHeight: '100vh' }}>
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
                Newsletter · Nº 02
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
            y por qué el pan del súper no es lo mismo.
          </p>
        </section>

        <Divider />

        {/* ── Sección 1: El gancho sensorial ────────────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Cierra los ojos un segundo.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Imagina que abres la puerta de tu casa y hueles pan recién hecho.
            No el de molde. No el de esos paquetes con fecha de caducidad en 2026.
            El otro. El que huele a algo <em style={{ fontFamily: 'Georgia, serif', color: BURG }}>vivo.</em>
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Ese olor tiene nombre.<br />
            Se llama fermentación.<br />
            Y lleva miles de años siendo lo mejor que puede pasarte al entrar a casa.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: 0 }}>
            Hoy te cuento qué es exactamente la masa madre,
            por qué ese pan huele así,
            y qué tiene de distinto al pan de siempre.{' '}
            <span style={{ color: GOLD, fontStyle: 'italic' }}>(Spoiler: bastante.)</span>
          </p>
        </section>

        <Divider />

        {/* ── Sección 2: Qué es la masa madre ──────────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <Label>La pregunta de todos</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            La masa madre es agua y harina.<br />
            Eso es todo.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Bueno — agua, harina, y millones de microorganismos vivos
            que llevan ahí fermentando desde que alguien tuvo la idea
            de no tirar la masa del día anterior.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Cuando mezclas harina con agua y lo dejas en reposo,
            ocurre algo precioso: las levaduras y bacterias
            que viven de forma natural en el ambiente
            —y en la propia harina— empiezan a comerse los azúcares.
            A respirar. A reproducirse.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 48px' }}>
            A vivir, básicamente.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 48px' }}>
            Eso que burbujea en el tarro de tu abuela no es magia.
            Es un ecosistema. Un jardín microscópico.
            Con su propio equilibrio, su propio carácter,
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
              puede vivir más de 100 años.<br />
              Hay panaderías en San Francisco<br />
              con masa madre de <span style={{ color: GOLD }}>1849.</span>&rdquo;
            </p>
            <p style={{ fontSize: 12, fontStyle: 'italic', color: MUTED, margin: 0 }}>
              Dato verificable — Boudin Bakery, SF, fundada 1849
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Sección 3: Por qué es distinto ───────────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <Label>Lo que pasa dentro (sin ponerse técnicos)</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            El pan industrial no fermenta.
            Sube rápido gracias a levadura química o levadura comercial
            que hace su trabajo en 45 minutos y se va.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 56px' }}>
            La masa madre fermenta durante horas. A veces días.
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

        {/* ── Sección 4: La parte que más nos gusta ────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <Label>El momento Food·Mood</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            ¿Sabes lo que pasa cuando haces pan en casa?
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Que tienes que esperar.
            Y esperar con algo que huele tan bien es,
            objetivamente, uno de los placeres más subestimados de la vida adulta.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            Hay estudios que dicen que el olor a pan recién hecho
            activa el sistema de recompensa dopaminérgico.
            Que literalmente te pone de mejor humor.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 56px' }}>
            Nosotros lo decimos de otra forma:
            si tienes pan en el horno, es imposible estar de mal humor.
            Es biológicamente complicado.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 56px' }}>
            Esto lo sabían los egipcios (3.000 a.C. — los primeros en fermentar pan).
            Lo sabían las abuelas (siempre).
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
              Es la cosa más antigua y más sensata del mundo.&rdquo;
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Sección 5: Cómo empezar ───────────────────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <Label>La versión honesta</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 40px' }}>
            La gente tiene miedo de la masa madre porque parece complicado.
            No lo es. Pero sí requiere una cosa que en 2026 es escasa:{' '}
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
                'Siete días de curiosidad',
              ].map(item => (
                <p key={item} style={{ fontSize: 15, lineHeight: 1.7, color: INK, margin: '0 0 8px' }}>
                  — {item}
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
                'Ningún equipo raro',
              ].map(item => (
                <p key={item} style={{ fontSize: 15, lineHeight: 1.7, color: MUTED, margin: '0 0 8px' }}>
                  — {item}
                </p>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: 0 }}>
            El primer intento quizás no salga perfecto.
            El segundo tampoco, posiblemente.
            El tercero... bueno, el tercero suele ser el momento en que entiendes
            por qué la gente se obsesiona con esto.
          </p>
        </section>

        <Divider />

        {/* ── Sección 6: Enlace natural al reto ────────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <Label>Si quieres ir más lejos</Label>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            En el reto Slow Food·Mood, el pan de masa madre
            —o la versión de fermentación lenta para principiantes—
            es uno de los protagonistas.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: INK, margin: '0 0 24px' }}>
            No porque sea el ingrediente más importante.
            Sino porque hacer pan despacio —
            esperar a que la masa doble,
            sentir la textura bajo las manos,
            escuchar el crujido cuando lo sacas del horno —
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
              21 días de cocina lenta.<br />
              Una preparación al día.<br />
              Y la ansiedad empieza a tener<br />
              otro ritmo.
            </h2>
            <p style={{
              fontSize: 16, lineHeight: 1.7,
              color: 'rgba(245,240,232,0.75)', margin: '0 0 36px',
            }}>
              Fermentos, masas, caldos, reposos.
              Y en ese proceso — sin que te des cuenta — tu mente empieza a soltar.
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
                Ver el reto Slow Food·Mood · 29€
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
                Empezar con 7 días · 19€
              </Link>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Sección 7: Cierre ─────────────────────────────────────────── */}
        <section style={{ padding: '80px 0 40px', textAlign: 'center' }}>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: INK,
            maxWidth: 480, margin: '0 auto 40px',
          }}>
            La próxima vez que pases por delante de una panadería
            y el olor te pare en seco,
            ya sabrás lo que pasa.
          </p>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: INK,
            maxWidth: 480, margin: '0 auto 40px',
          }}>
            Son las bacterias.<br />
            Son los ácidos orgánicos.<br />
            Es la fermentación.
          </p>
          <p style={{
            fontSize: 18, lineHeight: 1.8, color: INK,
            maxWidth: 480, margin: '0 auto 48px',
          }}>
            O simplemente: es que alguien se tomó el tiempo de hacer las cosas bien.
            Y eso, siempre, se nota.
          </p>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: 22, color: GOLD, margin: 0,
          }}>
            Fast life. Slow Food·Mood.
          </p>
        </section>

        {/* ── Footer ────────────────────────────────────────────────────── */}
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
              Food·Mood
            </p>
          </Link>
          <p style={{ fontSize: 12, color: MUTED, margin: '0 0 20px' }}>
            food-mood.app · © 2026
          </p>
          <p style={{ fontSize: 13, color: MUTED, maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
            Suscríbete y únete a nuestro club de WhatsApp Premium —
            contenido curado de verdad y contrastado por nuestros expertos.
          </p>
        </footer>

      </div>
    </main>
  )
}
