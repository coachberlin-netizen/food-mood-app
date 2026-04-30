import { readFileSync } from 'fs'

const env  = readFileSync('.env.local', 'utf8')
const key  = env.match(/RESEND_API_KEY="?([^"\n]+)/)?.[1]
if (!key) { console.error('No se encontró RESEND_API_KEY'); process.exit(1) }

const items = [
  ['01','Qué pasa en tu intestino cuando fermentas col con sal','y por qué importa para tu ansiedad'],
  ['02','Por qué el caldo de huesos es el ansiolítico más antiguo del mundo','y cómo hacerlo en casa'],
  ['03','La diferencia entre pan de fermentación rápida y pan de fermentación lenta','no es solo el sabor'],
  ['04','Qué es la limonada lacto-fermentada y cómo prepararla','con el suero de tu yogur casero'],
  ['05','Por qué el miso nunca se hierve','y qué pierdes cuando lo haces'],
  ['06','Cómo un overnight de avena con kéfir cambia tu cortisol de la mañana','sin que hagas nada'],
  ['07','La glicina del caldo de huesos y el sueño','lo que un estudio de 2023 encontró'],
]

const listRows = items.map(([n, t, s]) =>
  `<tr style="border-top:1px solid rgba(107,39,55,0.1)">
    <td style="padding:24px 16px 24px 0;vertical-align:top;width:48px">
      <span style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#C9A84C">${n}</span>
    </td>
    <td style="padding:24px 0">
      <p style="font-size:16px;font-weight:600;color:#1a1a1a;margin:0 0 4px">${t}</p>
      <p style="font-size:14px;font-style:italic;color:#7a6a6a;margin:0">${s}</p>
    </td>
  </tr>`
).join('\n')

const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:680px;margin:0 auto;padding:0 24px 80px">

  <!-- Cabecera -->
  <div style="padding:48px 0 32px;border-bottom:1px solid rgba(107,39,55,0.12)">
    <table width="100%"><tr>
      <td><span style="font-family:Georgia,serif;font-size:20px;font-weight:700;color:#6B2737;letter-spacing:0.04em">Food·Mood</span></td>
      <td style="text-align:right">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:#C9A84C;display:block">Newsletter · Edición especial</span>
        <span style="font-size:12px;color:#7a6a6a">Mayo 2026</span>
      </td>
    </tr></table>
  </div>

  <!-- Hero -->
  <div style="padding:72px 0 64px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9A84C;margin:0 0 28px">Fast life. Slow Food·Mood.</p>
    <h1 style="font-family:Georgia,serif;font-size:38px;font-weight:400;line-height:1.15;color:#1a1a1a;margin:0 0 24px;letter-spacing:-0.01em">Tu sistema nervioso no se calma con más información.</h1>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:20px;line-height:1.5;color:#C9A84C;margin:0">Se calma con experiencia repetida. Sensorial. Que deja huella en el cuerpo.</p>
  </div>

  <!-- Separador -->
  <p style="text-align:center;color:#C9A84C;font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <!-- Sección 1 -->
  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9A84C;margin:0 0 28px">Lo que todos sabemos y nadie puede aplicar</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">Sabes que deberías ir más despacio.<br>Sabes que el estrés te está afectando.<br>Sabes que deberías dormir más, respirar mejor, desconectar.</p>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:20px;line-height:1.5;color:#6B2737;margin:0 0 24px">Lo sabes. Y aun así, no puedes.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">No es falta de fuerza de voluntad. Es que el conocimiento solo no cambia los hábitos. Nunca lo ha hecho.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">Lo que cambia los hábitos es la experiencia repetida, encarnada en el cuerpo, anclada a los sentidos.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;font-weight:600;margin:0">Y eso, exactamente, es lo que hace la cocina lenta.</p>
  </div>

  <p style="text-align:center;color:#C9A84C;font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <!-- Sección 2: Ciencia -->
  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9A84C;margin:0 0 28px">Lo que dice la ciencia</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 40px">No hace falta que lo creas porque lo digo yo.<br>Hay investigación seria detrás de esto.</p>

    <div style="background:#6B2737;border-radius:20px;padding:44px;margin-bottom:20px">
      <div style="font-family:Georgia,serif;font-size:80px;font-weight:700;color:#C9A84C;line-height:1;margin-bottom:20px">90%</div>
      <p style="font-size:17px;line-height:1.65;color:#F5F0E8;margin:0 0 14px">De la serotonina de tu cuerpo — el neurotransmisor del bienestar — se produce en el intestino, no en el cerebro. Lo que comes afecta directamente a cómo te sientes.</p>
      <p style="font-size:12px;font-style:italic;color:rgba(245,240,232,0.45);margin:0">Enders, G. — Gut (2014, ed. revisada)</p>
    </div>

    <div style="background:#fff;border-radius:20px;padding:44px;margin-bottom:20px;border:1px solid rgba(107,39,55,0.1)">
      <div style="font-family:Georgia,serif;font-size:80px;font-weight:700;color:#6B2737;line-height:1;margin-bottom:20px">21</div>
      <p style="font-size:17px;line-height:1.65;color:#1a1a1a;margin:0 0 14px">Días es lo que necesita el cerebro para consolidar un hábito nuevo, según el Behavior Design Lab de Stanford. Pero solo si el gesto es pequeño, sensorial y se repite con regularidad.</p>
      <p style="font-size:12px;font-style:italic;color:#7a6a6a;margin:0">Fogg, B.J. — Tiny Habits (Stanford, 2019)</p>
    </div>

    <div style="background:#6B2737;border-radius:20px;padding:44px;margin-bottom:40px">
      <div style="font-family:Georgia,serif;font-size:80px;font-weight:700;color:#C9A84C;line-height:1;margin-bottom:20px">5×</div>
      <p style="font-size:17px;line-height:1.65;color:#F5F0E8;margin:0 0 14px">Más Lactobacillus plantarum — la bacteria que produce GABA, el freno natural de la ansiedad en el sistema nervioso — tiene el chucrut casero comparado con la col cruda.</p>
      <p style="font-size:12px;font-style:italic;color:rgba(245,240,232,0.45);margin:0">Stanton et al. — Journal of Functional Foods (2024)</p>
    </div>

    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">El GABA es el neurotransmisor que le dice al sistema nervioso: <em style="font-family:Georgia,serif;color:#6B2737">"Para. Todo está bien. No hay peligro."</em></p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0">Y resulta que los fermentos caseros lo producen directamente. Sin pastillas. Sin suplementos. Con col, sal y tiempo.</p>
  </div>

  <p style="text-align:center;color:#C9A84C;font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <!-- Sección 3 -->
  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9A84C;margin:0 0 28px">Lo que los fermentos saben que tú has olvidado</p>
    <p style="font-family:Georgia,serif;font-size:26px;font-weight:400;color:#1a1a1a;line-height:1.3;margin:0 0 36px">Hay alimentos que no pueden mentir sobre el tiempo.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">Un fermento no se hace en una hora.<br>Una masa madre no admite prisas.<br>Un caldo de huesos necesita cuatro horas de fuego suave para liberar la glicina que calma el sistema nervioso.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">No porque nadie lo haya decidido así.<br>Sino porque la biología tiene sus propios ritmos.<br>Y llevan aquí mucho más tiempo que nosotros.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 24px">Cuando cocinas algo que necesita espera, pasa algo curioso: tú también empiezas a esperar. A quedarte cerca del fuego. A soltar el control.</p>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.6;color:#6B2737;margin:0">Y eso — sin que nadie te lo diga explícitamente — es exactamente lo que necesita el sistema nervioso ansioso.</p>
  </div>

  <p style="text-align:center;color:#C9A84C;font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <!-- Sección 4: Lista -->
  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9A84C;margin:0 0 28px">21 días. Un gesto lento al día.</p>
    <p style="font-size:17px;line-height:1.75;color:#1a1a1a;margin:0 0 40px">No es una dieta. No es un plan de bienestar genérico. Es aprender a cocinar de otra manera — y en el proceso, aprender a vivir de otra manera.</p>
    <table style="width:100%;border-collapse:collapse">
      ${listRows}
    </table>
    <div style="border-top:1px solid rgba(107,39,55,0.1)"></div>
  </div>

  <!-- CTA -->
  <div style="background:#6B2737;border-radius:24px;padding:56px 44px;margin-bottom:80px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#C9A84C;margin:0 0 20px">Empieza el reto</p>
    <h2 style="font-family:Georgia,serif;font-size:36px;font-weight:400;color:#F5F0E8;line-height:1.15;margin:0 0 24px">Fast life.<br>Slow Food·Mood.</h2>
    <p style="font-size:17px;line-height:1.7;color:rgba(245,240,232,0.8);margin:0 0 28px">Durante 21 días vas a preparar alimentos que tienen su propio ritmo biológico. Fermentos, masas, caldos, reposos. Y en ese proceso — sin que te des cuenta — tu mente empieza a soltar.</p>
    <div style="border-top:1px solid rgba(245,240,232,0.15);padding-top:24px;margin-bottom:32px">
      <p style="font-size:15px;color:rgba(245,240,232,0.7);margin:0 0 8px">· Una preparación lenta (5 a 20 minutos activos)</p>
      <p style="font-size:15px;color:rgba(245,240,232,0.7);margin:0 0 8px">· Un audio de ritual guiado antes de cocinar</p>
      <p style="font-size:15px;color:rgba(245,240,232,0.7);margin:0 0 8px">· Una pregunta para tu diario de ritmo</p>
      <p style="font-size:15px;color:rgba(245,240,232,0.7);margin:0">· Un dato científico contextualizado</p>
    </div>
    <p style="font-size:15px;line-height:1.6;color:rgba(245,240,232,0.7);margin:0 0 36px">Al día 21: tu <strong style="color:#F5F0E8">Mapa de Ritmo Mental</strong> — una visualización de cómo ha cambiado tu relación con el tiempo y la ansiedad.</p>
    <div style="text-align:center">
      <a href="https://food-mood.app/retos/slow-food-mood" style="display:inline-block;background:#C9A84C;color:#6B2737;padding:18px 48px;border-radius:999px;font-family:Georgia,serif;font-size:17px;font-weight:700;text-decoration:none">Empezar el reto · 29€</a>
    </div>
  </div>

  <!-- Frase final -->
  <div style="text-align:center;padding:0 0 80px">
    <blockquote style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#6B2737;line-height:1.45;margin:0 0 20px;font-style:italic">"No necesitas más información sobre la ansiedad.<br>Necesitas cocinar algo que no puedas hacer en diez minutos."</blockquote>
    <p style="font-size:13px;color:#7a6a6a;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;margin:0">— Food·Mood</p>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid rgba(107,39,55,0.12);padding:36px 0;text-align:center">
    <p style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#6B2737;margin:0 0 8px">Food·Mood</p>
    <p style="font-size:12px;color:#7a6a6a;margin:0">food-mood.app · © 2026</p>
  </div>

</div>
</body>
</html>`

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: 'Food·Mood <hola@food-mood.app>',
    to: 'coachberlin@gmail.com',
    subject: 'Fast life. Slow Food·Mood. 🍵',
    html,
  }),
})

const data = await res.json()
console.log(JSON.stringify(data, null, 2))
