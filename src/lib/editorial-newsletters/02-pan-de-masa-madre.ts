const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#FF6B35'
const INK   = '#1a1a1a'
const MUTED = '#7a6a6a'

const items = [
  ['01', 'El pan que digiere por ti.', 'Durante la fermentación larga, las bacterias degradan parcialmente el gluten y predigieren los almidones del trigo. ¿Resultado? Un pan mucho más fácil de digerir. Muchas personas que se llevan mal con el pan normal toleran perfectamente la masa madre. (No es lo mismo que "sin gluten" — es distinto. Y mucho más rico.)'],
  ['02', 'El índice glucémico baja. Tu energía, sube.', 'El pan de masa madre tiene un índice glucémico significativamente más bajo que el pan blanco normal. Eso significa que la glucosa llega a la sangre despacio, sin el pico-caída que te deja agotado a media mañana. La diferencia entre aguantar hasta la comida y necesitar un bollo a las 11.'],
  ['03', 'Huele así porque fermenta de verdad.', 'El aroma del pan de masa madre viene de los ácidos orgánicos que producen las bacterias — ácido láctico y ácido acético. Los mismos que hay en el yogur y en el vinagre. Por eso huele a algo vivo, complejo, casi ácido. Y por eso el pan industrial nunca va a oler igual. Aunque diga "artesano" en el packaging.'],
]

const itemRows = items.map(([n, titulo, texto]) =>
  `<tr>
    <td style="padding:0 20px 40px 0;vertical-align:top;width:56px">
      <span style="font-family:Georgia,serif;font-size:44px;font-weight:700;color:${GOLD};line-height:1">${n}</span>
    </td>
    <td style="padding:0 0 40px">
      <p style="font-size:15px;font-weight:700;color:${INK};margin:0 0 8px">${titulo}</p>
      <p style="font-size:15px;line-height:1.75;color:${MUTED};margin:0">${texto}</p>
    </td>
  </tr>`
).join('\n')

export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:680px;margin:0 auto;padding:0 24px 80px">

  <div style="padding:48px 0 32px;border-bottom:1px solid rgba(107,39,55,0.12)">
    <table width="100%"><tr>
      <td><span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:${BURG};letter-spacing:0.04em">Food·Mood</span></td>
      <td style="text-align:right">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:${GOLD};display:block">Newsletter · Nº 02</span>
        <span style="font-size:12px;color:${MUTED}">Mayo 2026</span>
      </td>
    </tr></table>
  </div>

  <div style="padding:72px 0 64px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">Esto es lo que hueles cuando alguien hace pan de verdad</p>
    <h1 style="font-family:Georgia,serif;font-size:42px;font-weight:400;line-height:1.12;color:${INK};margin:0 0 24px;letter-spacing:-0.01em">Hay pan.<br>Y luego hay <span style="color:${BURG}">PAN.</span></h1>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:20px;line-height:1.55;color:${GOLD};margin:0">Una historia corta sobre burbujas, tiempo<br>y por qué el pan del súper no es lo mismo.</p>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Cierra los ojos un segundo.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Imagina que abres la puerta de tu casa y hueles pan recién hecho. No el de molde. No el de esos paquetes con fecha de caducidad en 2026. El otro. El que huele a algo <em style="font-family:Georgia,serif;color:${BURG}">vivo.</em></p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Ese olor tiene nombre.<br>Se llama fermentación.<br>Y lleva miles de años siendo lo mejor que puede pasarte al entrar a casa.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0">Hoy te cuento qué es exactamente la masa madre, por qué ese pan huele así, y qué tiene de distinto al pan de siempre. <em style="font-family:Georgia,serif;color:${GOLD}">(Spoiler: bastante.)</em></p>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">La pregunta de todos</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">La masa madre es agua y harina.<br>Eso es todo.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Bueno — agua, harina, y millones de microorganismos vivos que llevan ahí fermentando desde que alguien tuvo la idea de no tirar la masa del día anterior.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Cuando mezclas harina con agua y lo dejas en reposo, ocurre algo precioso: las levaduras y bacterias que viven de forma natural en el ambiente —y en la propia harina— empiezan a comerse los azúcares. A respirar. A reproducirse.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 48px">A vivir, básicamente.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 48px">Eso que burbujea en el tarro de tu abuela no es magia. Es un ecosistema. Un jardín microscópico. Con su propio equilibrio, su propio carácter, su propio sabor.</p>

    <div style="background:#fff;border-radius:20px;padding:44px 40px;border:1px solid rgba(255,107,53,0.35);text-align:center">
      <p style="font-family:Georgia,serif;font-style:italic;font-size:22px;line-height:1.5;color:${BURG};margin:0 0 20px">"Una masa madre bien cuidada<br>puede vivir más de 100 años.<br>Hay panaderías en San Francisco<br>con masa madre de <span style="color:${GOLD}">1849.</span>"</p>
      <p style="font-size:12px;font-style:italic;color:${MUTED};margin:0">Dato verificable — Boudin Bakery, SF, fundada 1849</p>
    </div>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">Lo que pasa dentro (sin ponerse técnicos)</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">El pan industrial no fermenta. Sube rápido gracias a levadura química o levadura comercial que hace su trabajo en 45 minutos y se va.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 48px">La masa madre fermenta durante horas. A veces días. Y en ese tiempo, pasan cosas interesantes.</p>
    <table style="width:100%;border-collapse:collapse">${itemRows}</table>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">El momento Food·Mood</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">¿Sabes lo que pasa cuando haces pan en casa?</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Que tienes que esperar. Y esperar con algo que huele tan bien es, objetivamente, uno de los placeres más subestimados de la vida adulta.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">Hay estudios que dicen que el olor a pan recién hecho activa el sistema de recompensa dopaminérgico. Que literalmente te pone de mejor humor.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 48px">Nosotros lo decimos de otra forma: si tienes pan en el horno, es imposible estar de mal humor. Es biológicamente complicado.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 48px">Esto lo sabían los egipcios (3.000 a.C. — los primeros en fermentar pan). Lo sabían las abuelas (siempre). Y ahora lo confirma la neurociencia. <em style="font-family:Georgia,serif;color:${MUTED}">Tardamos, pero llegamos.</em></p>
    <div style="text-align:center;padding:16px 0">
      <p style="font-family:Georgia,serif;font-style:italic;font-size:24px;line-height:1.45;color:${BURG};margin:0">"Hacer pan de masa madre no es un hobby de gente rara.<br>Es la cosa más antigua y más sensata del mundo."</p>
    </div>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">La versión honesta</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 40px">La gente tiene miedo de la masa madre porque parece complicado. No lo es. Pero sí requiere una cosa que en 2026 es escasa: <strong style="color:${BURG}">paciencia.</strong></p>
    <table width="100%" style="border-collapse:collapse;margin-bottom:40px">
      <tr>
        <td style="padding:0 12px 0 0;vertical-align:top;width:50%">
          <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid rgba(107,39,55,0.1)">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${GOLD};margin:0 0 14px">Lo que necesitas</p>
            <p style="font-size:14px;line-height:1.7;color:${INK};margin:0 0 6px">— Un tarro de vidrio limpio</p>
            <p style="font-size:14px;line-height:1.7;color:${INK};margin:0 0 6px">— Harina (mejor integral)</p>
            <p style="font-size:14px;line-height:1.7;color:${INK};margin:0 0 6px">— Agua sin cloro</p>
            <p style="font-size:14px;line-height:1.7;color:${INK};margin:0">— Siete días de curiosidad</p>
          </div>
        </td>
        <td style="padding:0 0 0 12px;vertical-align:top;width:50%">
          <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid rgba(107,39,55,0.1)">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${MUTED};margin:0 0 14px">Lo que NO necesitas</p>
            <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 6px">— Yogurtera</p>
            <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 6px">— Horno especial</p>
            <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 6px">— Haber hecho pan antes</p>
            <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0">— Ningún equipo raro</p>
          </div>
        </td>
      </tr>
    </table>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0">El primer intento quizás no salga perfecto. El segundo tampoco, posiblemente. El tercero... bueno, el tercero suele ser el momento en que entiendes por qué la gente se obsesiona con esto.</p>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">Si quieres ir más lejos</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">En el reto Slow Food·Mood, el pan de masa madre —o la versión de fermentación lenta para principiantes— es uno de los protagonistas.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 24px">No porque sea el ingrediente más importante. Sino porque hacer pan despacio — esperar a que la masa doble, sentir la textura bajo las manos, escuchar el crujido cuando lo sacas del horno — es exactamente el tipo de experiencia que regula el sistema nervioso ansioso.</p>
    <p style="font-size:17px;line-height:1.8;color:${INK};margin:0 0 48px">Lo dice la ciencia. Pero sobre todo lo dice el olor. Y el olor nunca miente.</p>

    <div style="background:${BURG};border-radius:24px;padding:56px 44px">
      <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 20px">Empieza el reto</p>
      <h2 style="font-family:Georgia,serif;font-size:34px;font-weight:400;color:${CREAM};line-height:1.2;margin:0 0 24px">21 días de cocina lenta.<br>Una preparación al día.<br>Y la ansiedad empieza a tener<br>otro ritmo.</h2>
      <p style="font-size:16px;line-height:1.7;color:rgba(245,240,232,0.75);margin:0 0 36px">Fermentos, masas, caldos, reposos. Y en ese proceso — sin que te des cuenta — tu mente empieza a soltar.</p>
      <div style="text-align:center">
        <a href="https://food-mood.app/retos/slow-food-mood" style="display:inline-block;background:${GOLD};color:${BURG};padding:18px 48px;border-radius:999px;font-family:Georgia,serif;font-size:17px;font-weight:700;text-decoration:none;margin-bottom:16px">Ver el reto Slow Food·Mood · 29€</a>
        <br>
        <a href="https://food-mood.app/retos/slow-food-mood" style="font-size:14px;color:rgba(245,240,232,0.7);text-decoration:underline">Empezar con 7 días · 19€</a>
      </div>
    </div>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="text-align:center;padding:72px 0 48px">
    <p style="font-size:18px;line-height:1.8;color:${INK};margin:0 0 24px">La próxima vez que pases por delante de una panadería<br>y el olor te pare en seco,<br>ya sabrás lo que pasa.</p>
    <p style="font-size:18px;line-height:1.8;color:${INK};margin:0 0 24px">Son las bacterias.<br>Son los ácidos orgánicos.<br>Es la fermentación.</p>
    <p style="font-size:18px;line-height:1.8;color:${INK};margin:0 0 40px">O simplemente: es que alguien se tomó el tiempo de hacer las cosas bien.<br>Y eso, siempre, se nota.</p>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:22px;color:${GOLD};margin:0">Fast life. Slow Food·Mood.</p>
  </div>

  <div style="border-top:1px solid rgba(107,39,55,0.12);padding:36px 0;text-align:center">
    <p style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:${BURG};margin:0 0 8px">Food·Mood</p>
    <p style="font-size:12px;color:${MUTED};margin:0 0 16px">food-mood.app · © 2026</p>
    <p style="font-size:13px;color:${MUTED};max-width:340px;margin:0 auto;line-height:1.6">Suscríbete y únete a nuestro club de WhatsApp Premium — contenido curado de verdad y contrastado por nuestros expertos.</p>
  </div>

</div>
</body>
</html>`
}
