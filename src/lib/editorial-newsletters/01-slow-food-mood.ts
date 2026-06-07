const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#FF6B35'
const INK   = '#1a1a1a'
const MUTED = '#7a6a6a'

const items = [
  ['01', 'Qué pasa en tu intestino cuando fermentas col con sal',           'y por qué importa para tu ansiedad'],
  ['02', 'Por qué el caldo de huesos es el ansiolítico más antiguo del mundo', 'y cómo hacerlo en casa'],
  ['03', 'La diferencia entre pan de fermentación rápida y pan de fermentación lenta', 'no es solo el sabor'],
  ['04', 'Qué es la limonada lacto-fermentada y cómo prepararla',           'con el suero de tu yogur casero'],
  ['05', 'Por qué el miso nunca se hierve',                                  'y qué pierdes cuando lo haces'],
  ['06', 'Cómo un overnight de avena con kéfir cambia tu cortisol de la mañana', 'sin que hagas nada'],
  ['07', 'La glicina del caldo de huesos y el sueño',                       'lo que un estudio de 2023 encontró'],
]

const listRows = items.map(([n, t, s]) =>
  `<tr style="border-top:1px solid rgba(107,39,55,0.1)">
    <td style="padding:24px 16px 24px 0;vertical-align:top;width:48px">
      <span style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:${GOLD}">${n}</span>
    </td>
    <td style="padding:24px 0">
      <p style="font-size:16px;font-weight:600;color:${INK};margin:0 0 4px">${t}</p>
      <p style="font-size:14px;font-style:italic;color:${MUTED};margin:0">${s}</p>
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
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:${GOLD};display:block">Newsletter · Nº 01</span>
        <span style="font-size:12px;color:${MUTED}">Mayo 2026</span>
      </td>
    </tr></table>
  </div>

  <div style="padding:72px 0 64px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">Fast life. Slow Food·Mood.</p>
    <h1 style="font-family:Georgia,serif;font-size:38px;font-weight:400;line-height:1.15;color:${INK};margin:0 0 24px;letter-spacing:-0.01em">Tu sistema nervioso no se calma con más información.</h1>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:20px;line-height:1.5;color:${GOLD};margin:0">Se calma con experiencia repetida. Sensorial. Que deja huella en el cuerpo.</p>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">Lo que todos sabemos y nadie puede aplicar</p>
    <p style="font-size:17px;line-height:1.75;color:${INK};margin:0 0 24px">Sabes que deberías ir más despacio.<br>Sabes que el estrés te está afectando.<br>Sabes que deberías dormir más, respirar mejor, desconectar.</p>
    <p style="font-family:Georgia,serif;font-style:italic;font-size:20px;line-height:1.5;color:${BURG};margin:0 0 24px">Lo sabes. Y aun así, no puedes.</p>
    <p style="font-size:17px;line-height:1.75;color:${INK};margin:0 0 24px">No es falta de fuerza de voluntad. Es que el conocimiento solo no cambia los hábitos. Nunca lo ha hecho.</p>
    <p style="font-size:17px;line-height:1.75;color:${INK};margin:0 0 24px">Lo que cambia los hábitos es la experiencia repetida, encarnada en el cuerpo, anclada a los sentidos.</p>
    <p style="font-size:17px;line-height:1.75;color:${INK};font-weight:600;margin:0">Y eso, exactamente, es lo que hace la cocina lenta.</p>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">Lo que dice la ciencia</p>
    <p style="font-size:17px;line-height:1.75;color:${INK};margin:0 0 40px">No hace falta que lo creas porque lo digo yo.<br>Hay investigación seria detrás de esto.</p>

    <div style="background:${BURG};border-radius:20px;padding:44px;margin-bottom:20px">
      <div style="font-family:Georgia,serif;font-size:80px;font-weight:700;color:${GOLD};line-height:1;margin-bottom:20px">90%</div>
      <p style="font-size:17px;line-height:1.65;color:${CREAM};margin:0 0 14px">De la serotonina de tu cuerpo — el neurotransmisor del bienestar — se produce en el intestino, no en el cerebro. Lo que comes afecta directamente a cómo te sientes.</p>
      <p style="font-size:12px;font-style:italic;color:rgba(245,240,232,0.45);margin:0">Enders, G. — Gut (2014, ed. revisada)</p>
    </div>

    <div style="background:#fff;border-radius:20px;padding:44px;margin-bottom:20px;border:1px solid rgba(107,39,55,0.1)">
      <div style="font-family:Georgia,serif;font-size:80px;font-weight:700;color:${BURG};line-height:1;margin-bottom:20px">21</div>
      <p style="font-size:17px;line-height:1.65;color:${INK};margin:0 0 14px">Días es lo que necesita el cerebro para consolidar un hábito nuevo. Pero solo si el gesto es pequeño, sensorial y se repite con regularidad.</p>
      <p style="font-size:12px;font-style:italic;color:${MUTED};margin:0">Fogg, B.J. — Tiny Habits (Stanford, 2019)</p>
    </div>

    <div style="background:${BURG};border-radius:20px;padding:44px;margin-bottom:40px">
      <div style="font-family:Georgia,serif;font-size:80px;font-weight:700;color:${GOLD};line-height:1;margin-bottom:20px">5×</div>
      <p style="font-size:17px;line-height:1.65;color:${CREAM};margin:0 0 14px">Más Lactobacillus plantarum — la bacteria que produce GABA, el freno natural de la ansiedad — tiene el chucrut casero comparado con la col cruda.</p>
      <p style="font-size:12px;font-style:italic;color:rgba(245,240,232,0.45);margin:0">Stanton et al. — Journal of Functional Foods (2024)</p>
    </div>
  </div>

  <p style="text-align:center;color:${GOLD};font-size:18px;letter-spacing:0.3em;margin:8px 0">· · ·</p>

  <div style="padding:64px 0">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 28px">21 días. Un gesto lento al día.</p>
    <p style="font-size:17px;line-height:1.75;color:${INK};margin:0 0 40px">No es una dieta. No es un plan de bienestar genérico. Es aprender a cocinar de otra manera — y en el proceso, aprender a vivir de otra manera.</p>
    <table style="width:100%;border-collapse:collapse">${listRows}</table>
    <div style="border-top:1px solid rgba(107,39,55,0.1)"></div>
  </div>

  <div style="background:${BURG};border-radius:24px;padding:56px 44px;margin-bottom:80px">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin:0 0 20px">Empieza el reto</p>
    <h2 style="font-family:Georgia,serif;font-size:36px;font-weight:400;color:${CREAM};line-height:1.15;margin:0 0 24px">Fast life.<br>Slow Food·Mood.</h2>
    <p style="font-size:17px;line-height:1.7;color:rgba(245,240,232,0.8);margin:0 0 36px">Durante 21 días vas a preparar alimentos que tienen su propio ritmo biológico. Fermentos, masas, caldos, reposos.</p>
    <div style="text-align:center">

    </div>
  </div>

  <div style="text-align:center;padding:0 0 80px">
    <blockquote style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:${BURG};line-height:1.45;margin:0 0 20px;font-style:italic">"No necesitas más información sobre la ansiedad.<br>Necesitas cocinar algo que no puedas hacer en diez minutos."</blockquote>
    <p style="font-size:13px;color:${MUTED};letter-spacing:0.1em;text-transform:uppercase;font-weight:600;margin:0">— Food·Mood</p>
  </div>

  <div style="border-top:1px solid rgba(107,39,55,0.12);padding:36px 0;text-align:center">
    <p style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:${BURG};margin:0 0 8px">Food·Mood</p>
    <p style="font-size:12px;color:${MUTED};margin:0">food-mood.app · © 2026</p>
  </div>

</div>
</body>
</html>`
}
