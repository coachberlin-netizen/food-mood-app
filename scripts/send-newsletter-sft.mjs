import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
const RESEND_API_KEY = env.match(/RESEND_API_KEY="?([^"\n]+)"?/)?.[1]?.trim()

if (!RESEND_API_KEY) { console.error('No RESEND_API_KEY'); process.exit(1) }

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Salsa de tomate fermentada. Neuroprotección en tarro. 🍅</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
</head>
<body style="background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;margin:0;padding:0">
<div style="max-width:620px;margin:0 auto;background:#F5F0E8">

<div style="padding:12px 20px;border-bottom:1px solid rgba(107,39,55,0.08);background:#faf6f0;text-align:center">
  <p style="font-size:13px;color:#9e8080;margin:0;font-style:italic">Nº 03 · El licopeno del tomate fermentado cruza la barrera del cerebro y protege las neuronas. Receta: 20 min activos, 24–48h de espera.</p>
</div>

<div style="background:#3D1A0E;padding:48px 40px 40px">
  <p style="font-family:'DM Serif Display',Georgia,serif;font-size:16px;color:rgba(245,240,232,0.45);letter-spacing:.04em;margin-bottom:32px">Food·Mood · Slow Food·Mood</p>
  <p style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C;margin-bottom:20px">Newsletter · Nº 03 · Fermentación lenta</p>
  <h1 style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:20px">
    Salsa de tomate<br/>fermentada.<br/>
    <em style="font-style:italic;color:#E8845A">24 a 48 horas.</em>
  </h1>
  <p style="font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;max-width:460px;margin:0">
    No es una receta de abuela. Es neuroprotección en tarro. Te explico por qué el tiempo lo cambia todo.
  </p>
</div>

<div style="padding:36px 40px 28px;border-bottom:1px solid #e0d5c8">
  <p style="font-family:'DM Serif Display',Georgia,serif;font-size:21px;font-weight:400;color:#6B2737;line-height:1.4;margin-bottom:20px">Hay cosas que solo ocurren cuando no tienes prisa.</p>
  <p style="font-size:15px;line-height:1.75;color:#4a3a3e;margin-bottom:14px">
    El tomate cocido ya tiene más licopeno biodisponible que el crudo. Pero el tomate fermentado durante 24 o 48 horas hace algo que ni el cocinado rápido ni ningún suplemento puede replicar: las bacterias lácticas transforman los carotenoides en formas más activas, más absorbibles, <strong style="color:#2a1a1e;font-weight:500">capaces de cruzar la barrera hematoencefálica y llegar directamente al tejido neuronal.</strong>
  </p>
  <p style="font-size:15px;line-height:1.75;color:#4a3a3e;margin:0">
    No necesitas ingredientes raros. No necesitas equipo especial. Necesitas tomates, sal, un tarro y tiempo. El tiempo hace el trabajo.
  </p>
</div>

<div style="padding:28px 40px;background:#6B2737">
  <p style="font-family:'DM Serif Display',Georgia,serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;margin:0">
    El licopeno del tomate fermentado no solo alimenta el cuerpo.<br/>
    Cruza la barrera del cerebro. <span style="color:#E8845A;font-style:normal">Protege las neuronas.</span><br/>
    Eso no lo hace ningún bote de salsa del supermercado.
  </p>
</div>

<div style="padding:32px 40px;border-bottom:1px solid #e0d5c8">
  <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px">💡 La idea de hoy — Licopeno y neuroprotección</p>

  <div style="background:linear-gradient(135deg,#f5eaec,#fdf5e0);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center">
    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px">3–5×</div>
    <div style="font-size:13px;color:#7a5c63;line-height:1.5">más licopeno biodisponible en el tomate cocinado que en el crudo.<br/><strong style="color:#6B2737">El fermentado lo convierte en formas aún más activas.</strong></div>
  </div>

  <p style="font-size:15px;line-height:1.75;color:#4a3a3e;margin-bottom:14px">
    El licopeno es el carotenoide más potente para la salud cerebral. A diferencia de otros antioxidantes que se quedan en el torrente sanguíneo, el licopeno <strong style="color:#6B2737;font-weight:500">cruza fácilmente la barrera hematoencefálica</strong> — la frontera que protege el cerebro y que la mayoría de moléculas no pueden atravesar.
  </p>
  <p style="font-size:15px;line-height:1.75;color:#4a3a3e;margin-bottom:20px">
    Una vez dentro, reduce la oxidación lipídica en las neuronas y tiene efecto antiapoptótico. Estudios en humanos asocian mayores niveles de licopeno plasmático con <strong style="color:#6B2737;font-weight:500">menor riesgo de depresión y deterioro cognitivo.</strong>
  </p>

  <div style="display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start">
    <div style="font-size:20px;flex-shrink:0">🍅</div>
    <div style="font-size:13px;line-height:1.6;color:#4a3a3e">
      <strong style="display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Cocinar activa el licopeno</strong>
      El calor isomeriza el licopeno a forma cis, 3–5× más biodisponible. La grasa del aceite de oliva es imprescindible — el licopeno es liposoluble.
      <div style="font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic">Shi &amp; Le Maguer, 2000 · Crit Rev Food Sci Nutr</div>
    </div>
  </div>

  <div style="display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start">
    <div style="font-size:20px;flex-shrink:0">🦠</div>
    <div style="font-size:13px;line-height:1.6;color:#4a3a3e">
      <strong style="display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Fermentar amplifica el efecto</strong>
      Las bacterias lácticas transforman los carotenoides en formas de mayor actividad biológica y producen ácidos orgánicos que mejoran la absorción intestinal del licopeno.
      <div style="font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic">Xiao et al., 2023 · Food Chem</div>
    </div>
  </div>

  <div style="display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start">
    <div style="font-size:20px;flex-shrink:0">🧠</div>
    <div style="font-size:13px;line-height:1.6;color:#4a3a3e">
      <strong style="display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Licopeno y depresión</strong>
      Un metaanálisis de 2022 encontró correlación inversa significativa entre niveles plasmáticos de licopeno y síntomas depresivos. Mecanismo: reducción de la neuroinflamación en el hipocampo.
      <div style="font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic">Wang et al., 2022 · Nutrients</div>
    </div>
  </div>
</div>

<div style="padding:32px 40px;border-bottom:1px solid #e0d5c8">
  <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px">🫙 La receta — Salsa de tomate fermentada (24–48h)</p>
  <div style="background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden">
    <div style="background:linear-gradient(135deg,#f9ede6 0%,#fdf5e0 100%);padding:20px 24px;border-bottom:1px solid #e8ddd5">
      <div style="font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#9E3B1A;margin-bottom:6px">Slow Food·Mood · Neuroprotección &amp; Calma</div>
      <div style="font-family:'DM Serif Display',Georgia,serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px">Salsa de tomate fermentada (24–48h)</div>
      <div style="font-size:12px;color:#9e8080">⏱ 20 min activos · 24–48h fermentación · 1 tarro de 500 ml</div>
    </div>
    <div style="padding:20px 24px">
      <p style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px">Ingredientes</p>

      <p style="font-size:11px;font-weight:500;color:#9e8080;text-transform:uppercase;letter-spacing:.08em;margin:10px 0 6px">Base</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 600 g de tomates maduros — cuanto más rojos, más licopeno</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 1 cucharadita de sal marina sin refinar (no sal yodada)</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 2 dientes de ajo</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 1 cucharada de aceite de oliva virgen extra</p>

      <p style="font-size:11px;font-weight:500;color:#9e8080;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 6px;padding-top:12px;border-top:1px solid #f0e8e0">Aromáticos</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 4–5 hojas de albahaca fresca</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 1 cucharadita de orégano seco</p>
      <p style="font-size:13px;color:#9e8080;font-style:italic;line-height:1.6;margin:0 0 4px">· 1 pizca de pimienta negra (opcional, potencia la absorción de carotenoides)</p>

      <p style="font-size:11px;font-weight:500;color:#9e8080;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 6px;padding-top:12px;border-top:1px solid #f0e8e0">Para arrancar la fermentación</p>
      <p style="font-size:13px;color:#4a3a3e;line-height:1.6;margin:0 0 4px">· 1 cucharada de salmuera de chucrut crudo o de kéfir de leche</p>
      <p style="font-size:13px;color:#9e8080;font-style:italic;line-height:1.6;margin:0">· Si no tienes: el tomate fermentará solo con la sal — tardará un poco más</p>

      <div style="border-top:1px solid #f0e8e0;padding-top:16px;margin-top:16px">
        <p style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:12px">Preparación</p>

        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">1.</strong> Escalde los tomates 30 seg en agua hirviendo. Agua fría. Pela y trocea. <em style="color:#9e8080;font-size:12px">El escaldado inicia la isomerización del licopeno.</em></p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">2.</strong> Cocina a fuego suave con ajo y aceite 15 min. El licopeno se activa con el calor y la grasa. <em style="color:#9e8080;font-size:12px">La grasa es imprescindible — el licopeno es liposoluble.</em></p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">3.</strong> Retira del fuego. Añade albahaca, orégano y pimienta. Tritura.</p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">4.</strong> Espera a que baje a temperatura ambiente. <strong style="color:#C9A84C">⚠ Nunca fermentar caliente — mata las bacterias lácticas.</strong></p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">5.</strong> Añade la sal marina y la salmuera de chucrut o kéfir. Mezcla bien.</p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">6.</strong> Pasa al tarro. Deja 2–3 cm de espacio. Cierra sin sellar del todo para que escape el gas.</p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:10px"><strong style="color:#6B2737">7.</strong> Fermenta a 20–25°C: <strong>24h sabor suave</strong> o <strong>48h perfil ácido y complejo.</strong> <em style="color:#9e8080;font-size:12px">En invierno puede necesitar 72h.</em></p>
        <p style="font-size:13px;color:#4a3a3e;line-height:1.55;margin-bottom:0"><strong style="color:#6B2737">8.</strong> Cuando veas burbujas o notes el aroma ácido, fermenta bien. Cierra herméticamente y refrigera. Dura 2–3 semanas.</p>
      </div>

      <div style="background:#f5eaec;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5c63;line-height:1.65;border-left:3px solid #6B2737;margin-top:16px">
        <strong style="color:#6B2737">Por qué este proceso importa:</strong> El escaldado inicia la isomerización. El cocinado con aceite multiplica la biodisponibilidad por 3–5. La fermentación láctica continúa transformando los carotenoides 24–48h, produciendo ácido láctico que mejora el entorno intestinal. Una cucharada al día es suficiente.
      </div>
    </div>
  </div>
</div>

<div style="padding:28px 40px;background:#fafaf5;border-bottom:1px solid #e0d5c8">
  <p style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px">🌿 La filosofía Slow Food·Mood</p>
  <div style="border-radius:14px;border:1px solid #e8ddd5;background:#fff;padding:20px 24px">
    <p style="font-family:'DM Serif Display',Georgia,serif;font-size:17px;color:#2a1a1e;margin-bottom:10px;font-weight:400">Fast life. Slow Food·Mood.</p>
    <p style="font-size:13px;line-height:1.7;color:#7a5c63;margin:0">
      Vivimos rápido. Comemos rápido. Nos recuperamos despacio. <strong style="color:#6B2737">Los procesos que más cuidan el sistema nervioso son los que necesitan tiempo.</strong> La fermentación, el caldo largo, la masa madre. No son técnicas nostálgicas — son bioquímica con paciencia.<br/><br/>Cada semana una receta lenta. Cada semana una razón científica para no tener prisa.
    </p>
  </div>
</div>

<div style="padding:32px 40px;text-align:center;border-bottom:1px solid #e0d5c8">
  <p style="font-size:15px;color:#7a5c63;line-height:1.6;margin-bottom:20px">
    El reto <strong style="color:#2a1a1e">Slow Food·Mood</strong> llega pronto a la app.<br/>
    7 días o 21 días de fermentos, caldos y masas para el sistema nervioso.<br/>
    Mientras tanto, la app tiene recetas organizadas por cómo te sientes hoy.
  </p>
  <a href="https://www.food-mood.app" style="display:inline-block;background:#6B2737;color:#F5F0E8;font-size:14px;font-weight:500;padding:13px 28px;border-radius:30px;text-decoration:none;letter-spacing:.02em">Ver la app Food·Mood →</a>
  <a href="https://www.food-mood.app/quiz" style="display:block;font-size:13px;color:#9e8080;text-decoration:none;margin-top:10px">Hacer el quiz de estado de ánimo</a>
</div>

<div style="padding:28px 40px;border-bottom:1px solid #e0d5c8">
  <p style="font-size:14px;line-height:1.8;color:#7a5c63;margin:0 0 20px">
    La salsa que empieces hoy estará lista mañana por la noche o pasado mañana. Ese tiempo de espera no es inactividad — es bioquímica ocurriendo sin que tengas que hacer nada. A veces cuidar el cerebro es tan simple como poner un tarro en la encimera y dejarlo estar.<br/><br/>Dime si la haces. Me interesa saber cómo te queda.
  </p>
  <div style="font-family:'DM Serif Display',Georgia,serif;font-size:17px;color:#6B2737;font-style:italic;margin-bottom:3px">S. Ferreras</div>
  <div style="font-size:12px;color:#9e8080;line-height:1.5">Psicóloga · Especialista en longevidad<br/>Experta en tecnología de los alimentos</div>
</div>

<div style="padding:20px 40px;background:#f5f0e8;border-bottom:1px solid #e0d5c8">
  <p style="font-size:11px;color:#9e8080;line-height:1.6;margin:0"><strong style="color:#7a5c63;font-weight:500">Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud.</p>
</div>

<div style="padding:24px 40px;text-align:center">
  <div style="font-family:'DM Serif Display',Georgia,serif;font-size:18px;color:#6B2737;margin-bottom:6px">Food·Mood</div>
  <div style="font-size:12px;color:#9e8080;margin-bottom:4px">food-mood.app</div>
  <div style="font-size:11px;color:#b0a0a0">© 2026 Food·Mood</div>
</div>

</div>
</body>
</html>`

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from:    'Food·Mood <hola@food-mood.app>',
    to:      'coachberlin@gmail.com',
    subject: 'Salsa de tomate fermentada. Neuroprotección en tarro. 🍅',
    html,
  }),
})

const data = await res.json()
if (!res.ok) { console.error('Error:', data); process.exit(1) }
console.log('✅ Enviada! ID:', data.id)
