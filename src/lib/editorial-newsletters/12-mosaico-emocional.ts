export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Tu semana tiene un color. ¿Sabes cuál es?</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#1A1510;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-50px;right:-30px;width:260px;height:260px;border-radius:50%;background:rgba(160,120,60,0.15)}
  .header::after{content:'';position:absolute;bottom:-20px;left:-20px;width:160px;height:160px;border-radius:50%;background:rgba(107,39,55,0.1)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',serif;font-size:16px;color:rgba(245,240,232,0.4);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#FF6B35}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FF6B35;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:34px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:18px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#FF6B35}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .alert-banner{background:#6B2737;padding:16px 40px;border-bottom:1px solid #5a1f2e}
  .ab-inner{display:flex;align-items:center;gap:12px}
  .ab-icon{font-size:24px;flex-shrink:0}
  .ab-text{font-size:13px;color:#F5F0E8;line-height:1.5}
  .ab-text strong{color:#FF6B35}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .lead{font-family:'DM Serif Display',serif;font-size:21px;color:#6B2737;line-height:1.4;margin-bottom:18px}
  .bt{font-size:15px;line-height:1.75;color:#4a3a3e}
  .bt p{margin-bottom:14px}
  .bt p:last-child{margin-bottom:0}
  .bt strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(255,107,53,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pq-attr{font-size:12px;color:rgba(245,240,232,0.4);margin-top:12px;letter-spacing:.04em;position:relative;z-index:1}
  .pq-text em{color:#FF6B35;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .sl{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb strong{color:#6B2737;font-weight:500}
  .dato-box{background:linear-gradient(135deg,#fdf5e0,#f5eaec);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center}
  .dato-num{font-family:'DM Serif Display',serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px}
  .dato-label{font-size:13px;color:#7a5c63;line-height:1.5}
  .dato-label strong{color:#6B2737}
  .sci-grid{display:flex;flex-direction:column;gap:12px;margin:20px 0}
  .sci-card{background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:16px 18px;border-left:3px solid #FF6B35}
  .sci-term{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#FF6B35;margin-bottom:6px}
  .sci-title{font-size:14px;font-weight:500;color:#6B2737;margin-bottom:6px}
  .sci-body{font-size:13px;color:#4a3a3e;line-height:1.65}
  .mosaic-preview{background:#2a1a1e;border-radius:14px;padding:20px;margin:20px 0}
  .mp-label{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#FF6B35;margin-bottom:12px}
  .mp-days{display:grid;grid-template-columns:52px repeat(7,1fr);gap:4px;margin-bottom:4px}
  .mp-day{font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:rgba(245,240,232,0.3);text-align:center;padding:2px 0}
  .mp-grid{display:grid;grid-template-columns:52px repeat(7,1fr);gap:4px}
  .mp-time{font-size:9px;color:rgba(245,240,232,0.3);display:flex;align-items:center;letter-spacing:.04em}
  .mp-cell{aspect-ratio:1;border-radius:5px;min-height:22px}
  .mp-cell.empty{background:rgba(245,240,232,0.05);border:1px dashed rgba(245,240,232,0.08)}
  .mp-legend{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(245,240,232,0.07)}
  .mp-leg-item{display:flex;align-items:center;gap:5px}
  .mp-leg-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
  .mp-leg-label{font-size:11px;color:rgba(245,240,232,0.55)}
  .mp-insight{background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.25);border-radius:10px;padding:14px 16px;margin-top:12px}
  .mp-insight-title{font-size:11px;font-weight:500;color:#FF6B35;margin-bottom:6px}
  .mp-insight-text{font-size:12px;color:rgba(245,240,232,0.7);line-height:1.65;font-style:italic}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .reveal-list{margin:16px 0;display:flex;flex-direction:column;gap:8px}
  .rl-item{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;background:#fff;border-radius:10px;border:1px solid #e8ddd5}
  .rl-arrow{color:#FF6B35;font-size:12px;flex-shrink:0;margin-top:1px;font-weight:500}
  .rl-text{font-size:13px;color:#4a3a3e;line-height:1.5}
  .rl-text strong{color:#2a1a1e;font-weight:500}
  .practica-section{padding:28px 40px;background:#fff8f0;border-top:1px solid #e0d5c8;border-bottom:1px solid #e0d5c8}
  .ps-card{background:#6B2737;border-radius:14px;padding:20px 24px}
  .ps-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:#FF6B35;margin-bottom:10px}
  .ps-title{font-family:'DM Serif Display',serif;font-size:18px;color:#F5F0E8;margin-bottom:12px;font-weight:400}
  .ps-step{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(245,240,232,0.08)}
  .ps-step:last-child{border-bottom:none}
  .ps-num{width:20px;height:20px;border-radius:50%;background:rgba(255,107,53,0.2);color:#FF6B35;font-size:10px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .ps-q{font-size:13px;color:#F5F0E8;line-height:1.5}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#fdf5e0,#f5eaec);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#6B2737;margin-bottom:6px}
  .rnombre{font-family:'DM Serif Display',serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px}
  .rmeta{font-size:12px;color:#9e8080}
  .rbody{padding:20px 24px}
  .ingl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px}
  .ii{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#4a3a3e;padding:4px 0;line-height:1.4}
  .id{width:5px;height:5px;border-radius:50%;background:#FF6B35;flex-shrink:0;margin-top:6px}
  .iop{color:#9e8080;font-style:italic}
  .rpasos{border-top:1px solid #f0e8e0;padding-top:16px;margin:16px 0}
  .paso{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#4a3a3e;line-height:1.55}
  .pn{width:22px;height:22px;border-radius:50%;background:#6B2737;color:#F5F0E8;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .ptip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:3px}
  .rnota{background:#f5eaec;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5c63;line-height:1.65;border-left:3px solid #6B2737;margin-top:4px}
  .rnota strong{color:#6B2737}
  .cierre{padding:32px 40px 40px;border-bottom:1px solid #e0d5c8}
  .footer{background:#1A1510;padding:32px 40px;text-align:center}
  .ft{font-size:12px;color:rgba(245,240,232,0.35);line-height:1.7}
  .ft a{color:rgba(255,107,53,0.7);text-decoration:none}
  .ft-logo{font-family:'DM Serif Display',serif;font-size:18px;color:rgba(245,240,232,0.5);margin-bottom:12px;letter-spacing:.04em}
</style>
</head>
<body>
<div class="wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-row">
      <span class="logo-text">Food·Mood</span>
      <span class="logo-dot"></span>
      <span style="font-size:10px;color:rgba(245,240,232,0.25);letter-spacing:.08em">Newsletter editorial</span>
    </div>
    <div class="eyebrow">Nº 12 · Diario emocional</div>
    <h1 class="h-title">Tu semana tiene<br>un <em>color.</em><br>¿Sabes cuál es?</h1>
    <p class="h-sub">El mosaico que revela los patrones que tu mente consciente no puede ver sola — y por qué verlos lo cambia todo.</p>
  </div>

  <!-- ALERT BANNER -->
  <div class="alert-banner">
    <div class="ab-inner">
      <div class="ab-icon">🎨</div>
      <div class="ab-text">
        Los patrones emocionales que no ves <strong>día a día</strong> se vuelven visibles cuando los acumulas <strong>semana a semana</strong> en color.
      </div>
    </div>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p class="lead">La mayoría de las herramientas de bienestar tienen su valor máximo el día 1. El diario emocional funciona al revés.</p>
    <div class="bt">
      <p>Sabemos que lo que comemos afecta a cómo nos sentimos. También sabemos — aunque cuesta más admitirlo — que cómo nos sentimos afecta a lo que comemos. El problema es que esa conexión es muy difícil de ver en tiempo real. La introspección distorsiona. El recuerdo distorsiona más.</p>
      <p>La semana 1 de un diario emocional dice algo. La semana 4 dice mucho más. El mes 3 revela cosas que no habrías visto de ninguna otra forma: <strong>cuándo empieza realmente tu estrés</strong> (antes de lo que crees), <strong>cuál es tu ventana de foco genuina</strong> (no la que idealizas), y <strong>qué comes los días de baja energía</strong> — y si eso lo perpetúa o lo rompe.</p>
      <p>Esta edición es sobre por qué necesitas datos cromáticos para entenderte emocionalmente — y qué hace la ciencia cuando los tiene.</p>
    </div>
  </div>

  <!-- PULLQUOTE: testimonial -->
  <div class="pullquote">
    <p class="pq-text">"Mi ansiedad del domingo no era ansiedad. Era <em>agitación anticipatoria</em> que empezaba el viernes por la tarde. No lo habría visto sin los datos."</p>
    <p class="pq-attr">— Usuario Food·Mood · 3 semanas de mosaico emocional</p>
  </div>

  <!-- CIENCIA -->
  <div class="ciencia">
    <p class="sl">La ciencia detrás</p>
    <div class="cb" style="margin-bottom:20px;">
      <p>Tres principios psicológicos explican por qué la visualización cromática de emociones funciona mejor que cualquier diario de texto:</p>
    </div>

    <div class="sci-grid">
      <div class="sci-card">
        <div class="sci-term">Psychological Science · EMA</div>
        <div class="sci-title">Ecological Momentary Assessment</div>
        <div class="sci-body">El registro en el momento elimina el sesgo retrospectivo. Las evaluaciones al final del día distorsionan la realidad por efecto peak-end: recordamos el momento más intenso y el final — no la media. El mosaico captura lo que realmente ocurrió, no lo que tu memoria editó.</div>
      </div>
      <div class="sci-card">
        <div class="sci-term">Metacognición</div>
        <div class="sci-title">Regulatory Knowledge</div>
        <div class="sci-body">Identificar patrones propios activa el conocimiento metacognitivo: saber cuándo, por qué y cómo cambian tus estados emocionales. Ese conocimiento no se construye con introspección pura — se construye con datos acumulados. Ver el patrón es el primer paso para poder modularlo.</div>
      </div>
      <div class="sci-card">
        <div class="sci-term">Psicología afectiva</div>
        <div class="sci-title">Curva de valor invertida</div>
        <div class="sci-body">La mayoría de herramientas de bienestar decaen: novedad alta el día 1, abandono en semana 3. El diario emocional funciona de forma inversa porque el valor es acumulativo. Semana 1 es interesante. Semana 4 es reveladora. Mes 3 es transformador. El compromiso tiene recompensa exponencial, no lineal.</div>
      </div>
    </div>

    <div class="dato-box">
      <div class="dato-num">3 sem</div>
      <div class="dato-label">Con <strong>tres semanas</strong> de datos es cuando empiezan a aparecer los patrones recurrentes — los que ningún test de personalidad puede detectar porque son específicos de tu vida, no de un arquetipo estadístico.</div>
    </div>
  </div>

  <!-- MOSAIC PREVIEW -->
  <div class="ciencia" style="padding-top:24px;">
    <p class="sl">Ejemplo de mosaico semanal</p>
    <div class="cb" style="margin-bottom:16px;">
      <p>Cada celda es un registro: estado emocional + intensidad + momento del día. Al final de la semana, tienes tu huella cromática interior.</p>
    </div>

    <div class="mosaic-preview">
      <div class="mp-label">Semana del 7 al 13 de abril · Ejemplo</div>

      <div class="mp-days">
        <div></div>
        <div class="mp-day">Lun</div>
        <div class="mp-day">Mar</div>
        <div class="mp-day">Mié</div>
        <div class="mp-day">Jue</div>
        <div class="mp-day">Vie</div>
        <div class="mp-day">Sáb</div>
        <div class="mp-day">Dom</div>
      </div>

      <div class="mp-grid">
        <div class="mp-time">Mañana</div>
        <div class="mp-cell" style="background:#4A7C59"></div>
        <div class="mp-cell" style="background:#8B3030"></div>
        <div class="mp-cell" style="background:#4A7C59;opacity:.7"></div>
        <div class="mp-cell" style="background:#3D6B8C;opacity:.7"></div>
        <div class="mp-cell" style="background:#D46A2E"></div>
        <div class="mp-cell" style="background:#3D6B8C"></div>
        <div class="mp-cell empty"></div>

        <div class="mp-time">Tarde</div>
        <div class="mp-cell" style="background:#8B3030;opacity:.6"></div>
        <div class="mp-cell" style="background:#A0522D;opacity:.7"></div>
        <div class="mp-cell" style="background:#7B5E8A;opacity:.45"></div>
        <div class="mp-cell" style="background:#4A7C59"></div>
        <div class="mp-cell" style="background:#A0522D"></div>
        <div class="mp-cell" style="background:#3D6B8C"></div>
        <div class="mp-cell empty"></div>

        <div class="mp-time">Noche</div>
        <div class="mp-cell" style="background:#A0522D"></div>
        <div class="mp-cell" style="background:#7B5E8A;opacity:.6"></div>
        <div class="mp-cell" style="background:#3D6B8C;opacity:.7"></div>
        <div class="mp-cell" style="background:#3D6B8C"></div>
        <div class="mp-cell" style="background:#D46A2E;opacity:.7"></div>
        <div class="mp-cell" style="background:#A0522D"></div>
        <div class="mp-cell empty"></div>
      </div>

      <div class="mp-legend">
        <div class="mp-leg-item"><div class="mp-leg-dot" style="background:#3D6B8C"></div><span class="mp-leg-label">Calma</span></div>
        <div class="mp-leg-item"><div class="mp-leg-dot" style="background:#4A7C59"></div><span class="mp-leg-label">Foco</span></div>
        <div class="mp-leg-item"><div class="mp-leg-dot" style="background:#A0522D"></div><span class="mp-leg-label">Confort</span></div>
        <div class="mp-leg-item"><div class="mp-leg-dot" style="background:#D46A2E"></div><span class="mp-leg-label">Energía</span></div>
        <div class="mp-leg-item"><div class="mp-leg-dot" style="background:#8B3030"></div><span class="mp-leg-label">Agitación</span></div>
        <div class="mp-leg-item"><div class="mp-leg-dot" style="background:#7B5E8A"></div><span class="mp-leg-label">Melancolía</span></div>
      </div>

      <div class="mp-insight">
        <div class="mp-insight-title">✦ Patrón detectado</div>
        <div class="mp-insight-text">"Tu foco aparece consistentemente los lunes y jueves por la mañana — y casi nunca los martes. Los martes llevan 3 semanas empezando en agitación alta. Algo ocurre los lunes por la noche."</div>
      </div>
    </div>
  </div>

  <!-- LO QUE REVELA -->
  <div class="ciencia" style="padding-top:24px;">
    <p class="sl">Lo que el mosaico te dice</p>
    <div class="reveal-list">
      <div class="rl-item">
        <div class="rl-arrow">→</div>
        <div class="rl-text"><strong>Tu ventana de foco real</strong> — no la que crees tener. La mayoría sobreestima su foco matutino y no ve que su pico real está entre las 10:00 y las 12:00, no a las 7:00.</div>
      </div>
      <div class="rl-item">
        <div class="rl-arrow">→</div>
        <div class="rl-text"><strong>Cuándo empieza realmente tu estrés</strong> — antes de lo que piensas. El estrés del lunes suele empezar el domingo por la tarde. Verlo te da margen para actuar.</div>
      </div>
      <div class="rl-item">
        <div class="rl-arrow">→</div>
        <div class="rl-text"><strong>Qué comes los días de baja energía</strong> — y si eso lo perpetúa o lo corta. La correlación entre color del mosaico y elecciones alimentarias es el núcleo de Food·Mood.</div>
      </div>
      <div class="rl-item">
        <div class="rl-arrow">→</div>
        <div class="rl-text"><strong>Tu patrón de recuperación</strong> — y qué lo acelera. ¿Te recuperas mejor con actividad o con descanso? ¿Con comida caliente o fría? El mosaico lo dice con datos, no con suposiciones.</div>
      </div>
      <div class="rl-item">
        <div class="rl-arrow">→</div>
        <div class="rl-text"><strong>Tu ciclo emocional propio</strong> — que no coincide con el de nadie más. Ningún test de personalidad puede dartelo porque es específico de tu vida, no de un arquetipo estadístico.</div>
      </div>
    </div>
  </div>

  <!-- MROWS: mecanismos -->
  <div class="ciencia" style="padding-top:8px;">
    <p class="sl">Mecanismos que explican los patrones</p>

    <div class="mrow">
      <div class="micon">🧠</div>
      <div class="mtext">
        <strong>El sesgo peak-end y por qué el recuerdo miente</strong>
        Daniel Kahneman documentó que recordamos los momentos más intensos y el final de una experiencia — no la media. Cuando le preguntas a alguien cómo le fue la semana, responde basándose en esos dos puntos, no en lo que realmente vivió. El registro en el momento (EMA) elimina ese sesgo porque captura el estado real, no la narración retrospectiva que tu cerebro construyó después.
        <span class="mref">Kahneman et al., 1993 · Stone &amp; Shiffman, 1994</span>
      </div>
    </div>

    <div class="mrow">
      <div class="micon">🔄</div>
      <div class="mtext">
        <strong>La conexión bidireccional humor-comida</strong>
        El eje intestino-cerebro funciona en las dos direcciones: lo que comes afecta a cómo te sientes, y cómo te sientes afecta a lo que comes. El mosaico emocional hace visible el segundo vector — el que suele ignorarse. Cuando ves que tres semanas seguidas los martes de agitación terminan con antojos de azúcar a las 19:00, ya no es una casualidad. Es un patrón con intervención posible.
      </div>
    </div>

    <div class="mrow">
      <div class="micon">📈</div>
      <div class="mtext">
        <strong>El conocimiento metacognitivo como palanca de cambio</strong>
        La investigación en psicología afectiva muestra que la simple capacidad de nombrar y anticipar un estado emocional reduce su intensidad — el llamado "affect labeling". Ver el patrón en el mosaico antes de que ocurra activa el córtex prefrontal y reduce la respuesta amigdalar. No necesitas voluntad. Necesitas visibilidad.
        <span class="mref">Lieberman et al., 2007 · Torre &amp; Lieberman, 2018</span>
      </div>
    </div>
  </div>

  <!-- PRÁCTICA -->
  <div class="practica-section">
    <p class="sl" style="color:rgba(107,39,55,0.5)">Cómo empezar</p>
    <div class="ps-card">
      <div class="ps-label">El protocolo mínimo viable</div>
      <div class="ps-title">Tres registros al día. Treinta segundos cada uno. Tres semanas.</div>
      <div class="ps-step">
        <div class="ps-num">1</div>
        <div class="ps-q">Al levantarte: ¿qué color tiene este inicio de día? Sin analizar — primera impresión. Agitación, calma, foco, energía, confort o melancolía.</div>
      </div>
      <div class="ps-step">
        <div class="ps-num">2</div>
        <div class="ps-q">A media tarde (16:00–17:00): ¿en qué estado estás ahora mismo? Ese suele ser el momento de mayor divergencia respecto a cómo empezó el día.</div>
      </div>
      <div class="ps-step">
        <div class="ps-num">3</div>
        <div class="ps-q">Antes de cenar: ¿cómo ha terminado la jornada? Y una sola pregunta adicional: ¿qué has comido hoy que crees que influyó en ese estado?</div>
      </div>
    </div>
  </div>

  <!-- RECETA -->
  <div class="receta-section">
    <p class="sl">Receta de la edición</p>
    <div class="cb" style="margin-bottom:16px;">
      <p>La receta de esta semana es para los martes de agitación — el patrón más común en los datos del mosaico: el día que más cuesta arrancar bien. Un desayuno que activa el GABA, estabiliza el cortisol y corta el ciclo antes de que empiece.</p>
    </div>

    <div class="rc">
      <div class="rh">
        <div class="rmood">Calma · Reset · Anti-agitación</div>
        <div class="rnombre">Bol de kéfir con avena, cacao y nueces</div>
        <div class="rmeta">Para 1 persona · 5 min · Sin cocinar · Alto en magnesio y triptófano</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes</div>

        <div class="ii"><div class="id"></div><span>150 g de kéfir natural sin azúcar <em class="iop">(40 cepas probióticas · eje intestino-cerebro)</em></span></div>
        <div class="ii"><div class="id"></div><span>40 g de copos de avena finos <em class="iop">(beta-glucano · estabilización glucémica lenta)</em></span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada colmada de cacao puro &gt;85% <em class="iop">(magnesio · teobromina · anandamida)</em></span></div>
        <div class="ii"><div class="id"></div><span>Un puñado de nueces (6–8 unidades) — <em class="iop">omega-3 ALA · membranas neuronales</em></span></div>
        <div class="ii"><div class="id"></div><span>1 cucharadita de miel cruda o sirope de dátil</span></div>
        <div class="ii"><div class="id"></div><span>½ plátano maduro en rodajas <em class="iop">(triptófano + potasio + glucosa de liberación media)</em></span></div>
        <div class="ii"><div class="id"></div><span>Una pizca de canela molida <em class="iop">(estabiliza la glucemia postprandial)</em></span></div>

        <div class="rpasos">
          <div class="ingl">Preparación</div>

          <div class="paso">
            <div class="pn">1</div>
            <div>La noche anterior (opcional pero recomendable): mezcla los copos de avena con el kéfir y guarda tapado en nevera. La avena absorbe el líquido y los lactobacilos inician una predigestión suave que mejora la biodisponibilidad del triptófano.
              <span class="ptip">Esta versión "overnight" reduce el índice glucémico otro 15–20% respecto a hacerlo al momento.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">2</div>
            <div>Por la mañana, mezcla el cacao en polvo con una cucharadita de agua caliente hasta hacer una pasta. Esto activa la anandamida y la teobromina antes de que toquen el bol frío.</div>
          </div>
          <div class="paso">
            <div class="pn">3</div>
            <div>Añade la pasta de cacao al bol de avena y kéfir. Mezcla. Incorpora la miel, el plátano y la canela.
              <span class="ptip">El plátano maduro (con manchas) tiene más triptófano libre disponible que el verde.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">4</div>
            <div>Termina con las nueces partidas por encima — siempre al final, sin calentar, para preservar sus ácidos grasos omega-3.</div>
          </div>
        </div>

        <div class="rnota">
          <strong>Por qué para días de agitación:</strong> Magnesio del cacao → regula el receptor NMDA del glutamato (menos hiperactivación neuronal). Triptófano del plátano y la avena → serotonina a lo largo de la mañana. Probióticos del kéfir → producción de GABA intestinal. Beta-glucano de la avena → glucosa estable sin pico ni valle. No es un desayuno. Es una intervención farmacológica comestible para cortar el ciclo antes de las 9:00.
        </div>
      </div>
    </div>
  </div>

  <!-- CIERRE -->
  <div class="cierre">
    <p class="sl">Para terminar</p>
    <div class="bt">
      <p>La inteligencia emocional real no es sentir más — es entender mejor lo que ya sientes. Y para entenderlo necesitas verlo. El mosaico es el espejo que no distorsiona.</p>
      <p>La próxima vez que te preguntes "¿por qué estoy así hoy?", la respuesta probablemente no está en hoy. Está en la semana pasada — o en la de antes. Los patrones no mienten. La memoria sí.</p>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="ft-logo">Food·Mood</div>
    <p class="ft">
      Neurociencia aplicada al plato. Cada domingo.<br>
      <a href="https://www.food-mood.app">food-mood.app</a> · <a href="https://www.food-mood.app/test">Descubre tu mood</a> · <a href="https://www.food-mood.app/pricing">Food·Mood Premium</a><br><br>
      Si no deseas recibir más newsletters, responde con "baja" a este email.
    </p>
  </div>

</div>
</body>
</html>`
}
