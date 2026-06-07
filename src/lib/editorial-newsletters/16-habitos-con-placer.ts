export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Los hábitos duraderos no se crean con disciplina</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'DM Sans', Georgia, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 620px; margin: 0 auto; background: #F5F0E8; }

  .header { background: #1E1A0E; padding: 48px 40px 40px; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: -50px; right: -30px; width: 280px; height: 280px; border-radius: 50%; background: rgba(201,140,20,0.12); }
  .header::after { content: ''; position: absolute; bottom: -20px; left: -30px; width: 180px; height: 180px; border-radius: 50%; background: rgba(107,39,55,0.10); }
  .logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; position: relative; z-index: 1; }
  .logo-text { font-family: 'DM Serif Display', Georgia, serif; font-size: 16px; color: rgba(245,240,232,0.4); letter-spacing: .04em; }
  .logo-dot { width: 4px; height: 4px; border-radius: 50%; background: #FF6B35; }
  .header-eyebrow { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #FF6B35; margin-bottom: 20px; position: relative; z-index: 1; }
  .header-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 38px; font-weight: 400; color: #F5F0E8; line-height: 1.1; margin-bottom: 20px; position: relative; z-index: 1; }
  .header-title em { font-style: italic; color: #E8C45A; }
  .header-subtitle { font-size: 15px; color: rgba(245,240,232,0.65); line-height: 1.65; position: relative; z-index: 1; max-width: 460px; }

  .intro { padding: 36px 40px 28px; border-bottom: 1px solid #e0d5c8; }
  .intro-lead { font-family: 'DM Serif Display', Georgia, serif; font-size: 21px; font-weight: 400; color: #6B2737; line-height: 1.4; margin-bottom: 20px; }
  .intro-body { font-size: 15px; line-height: 1.75; color: #4a3a3e; }
  .intro-body p { margin-bottom: 14px; }
  .intro-body p:last-child { margin-bottom: 0; }
  .intro-body strong { color: #2a1a1e; font-weight: 500; }

  .pullquote { padding: 28px 40px; background: #6B2737; position: relative; }
  .pullquote::before { content: '"'; font-family: 'DM Serif Display', Georgia, serif; font-size: 80px; color: rgba(232,196,90,0.2); position: absolute; top: 0; left: 30px; line-height: 1; }
  .pullquote-text { font-family: 'DM Serif Display', Georgia, serif; font-size: 19px; font-style: italic; color: #F5F0E8; line-height: 1.55; position: relative; z-index: 1; }
  .pullquote-text em { color: #E8C45A; font-style: normal; }

  .ciencia { padding: 32px 40px; border-bottom: 1px solid #e0d5c8; }
  .section-label { font-size: 10px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: #9e8080; margin-bottom: 16px; }
  .ciencia-body { font-size: 15px; line-height: 1.75; color: #4a3a3e; }
  .ciencia-body p { margin-bottom: 14px; }
  .ciencia-body p:last-child { margin-bottom: 0; }
  .ciencia-body strong { color: #6B2737; font-weight: 500; }

  .cadena { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin: 20px 0; }
  .cadena-paso { background: #fff; border: 1px solid #e8ddd5; border-radius: 10px; padding: 9px 13px; font-size: 12px; font-weight: 500; color: #6B2737; flex-shrink: 0; }
  .cadena-arrow { font-size: 14px; color: #FF6B35; padding: 0 4px; flex-shrink: 0; }

  .mecanismo-row { display: flex; gap: 12px; background: #fff; border-radius: 12px; border: 1px solid #e8ddd5; padding: 14px 16px; margin: 14px 0; align-items: flex-start; }
  .mecanismo-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .mecanismo-text { font-size: 13px; line-height: 1.6; color: #4a3a3e; }
  .mecanismo-text strong { display: block; font-size: 12px; font-weight: 500; color: #6B2737; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
  .mecanismo-ref { font-size: 11px; color: #b0a0a0; margin-top: 6px; font-style: italic; }

  .dato-box { background: linear-gradient(135deg, #fdf5e0, #f5eaec); border-radius: 14px; border: 1px solid #e8ddd5; padding: 20px 24px; margin: 20px 0; text-align: center; }
  .dato-numero { font-family: 'DM Serif Display', Georgia, serif; font-size: 44px; color: #6B2737; line-height: 1; margin-bottom: 6px; }
  .dato-label { font-size: 13px; color: #7a5c63; line-height: 1.5; }
  .dato-label strong { color: #6B2737; }

  .sintomas { padding: 28px 40px; background: #fafaf5; border-bottom: 1px solid #e0d5c8; }
  .sintomas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
  .sintoma-card { background: #fff; border-radius: 12px; border: 1px solid #e8ddd5; padding: 14px 16px; }
  .sintoma-icon { font-size: 20px; margin-bottom: 6px; }
  .sintoma-texto { font-size: 13px; color: #4a3a3e; line-height: 1.4; font-weight: 500; }
  .sintoma-sub { font-size: 11px; color: #9e8080; margin-top: 3px; line-height: 1.4; }

  .receta-section { padding: 32px 40px; border-bottom: 1px solid #e0d5c8; }
  .receta-card { background: #fff; border-radius: 16px; border: 1px solid #e8ddd5; overflow: hidden; }
  .receta-header { background: linear-gradient(135deg, #fdf5e0 0%, #f5eaec 100%); padding: 20px 24px; border-bottom: 1px solid #e8ddd5; }
  .receta-mood { font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: #7a5a00; margin-bottom: 6px; }
  .receta-nombre { font-family: 'DM Serif Display', Georgia, serif; font-size: 20px; color: #2a1a1e; font-weight: 400; margin-bottom: 4px; }
  .receta-meta { font-size: 12px; color: #9e8080; }
  .receta-body { padding: 20px 24px; }
  .ing-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .08em; color: #9e8080; margin-bottom: 10px; }
  .ing-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #4a3a3e; padding: 4px 0; line-height: 1.4; }
  .ing-dot { width: 5px; height: 5px; border-radius: 50%; background: #FF6B35; flex-shrink: 0; margin-top: 6px; }
  .ing-opcional { color: #9e8080; font-style: italic; }
  .receta-pasos { border-top: 1px solid #f0e8e0; padding-top: 16px; margin: 16px 0; }
  .paso { display: flex; gap: 12px; margin-bottom: 12px; font-size: 13px; color: #4a3a3e; line-height: 1.55; }
  .paso-num { width: 22px; height: 22px; border-radius: 50%; background: #6B2737; color: #F5F0E8; font-size: 11px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .paso-tip { display: block; font-size: 11px; color: #9e8080; font-style: italic; margin-top: 3px; }
  .receta-nota { background: #fdf5e0; border-radius: 10px; padding: 14px 16px; font-size: 12px; color: #7a5a00; line-height: 1.65; border-left: 3px solid #FF6B35; margin-top: 4px; }
  .receta-nota strong { color: #7a5a00; }

  .cta-reto { padding: 36px 40px; background: #1E1A0E; border-bottom: 1px solid #e0d5c8; text-align: center; }
  .cta-reto-eyebrow { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: #FF6B35; margin-bottom: 16px; }
  .cta-reto-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 26px; color: #F5F0E8; font-weight: 400; margin-bottom: 12px; line-height: 1.2; }
  .cta-reto-title em { font-style: italic; color: #E8C45A; }
  .cta-reto-desc { font-size: 14px; color: rgba(245,240,232,0.65); line-height: 1.65; margin-bottom: 24px; max-width: 440px; margin-left: auto; margin-right: auto; }
  .cta-incluye { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; text-align: left; max-width: 360px; margin-left: auto; margin-right: auto; }
  .cta-incluye-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(245,240,232,0.75); }
  .cta-incluye-check { color: #FF6B35; font-weight: 700; flex-shrink: 0; }
  .cta-btn-grande { display: inline-block; background: #FF6B35; color: #1E1A0E; font-size: 15px; font-weight: 600; padding: 15px 32px; border-radius: 30px; text-decoration: none; letter-spacing: .02em; }
  .cta-precio { font-size: 12px; color: rgba(245,240,232,0.4); margin-top: 10px; }

  .cierre { padding: 28px 40px; border-bottom: 1px solid #e0d5c8; }
  .cierre-text { font-size: 14px; line-height: 1.8; color: #7a5c63; }
  .cierre-firma { margin-top: 20px; }
  .firma-nombre { font-family: 'DM Serif Display', Georgia, serif; font-size: 17px; color: #6B2737; font-style: italic; margin-bottom: 3px; }
  .firma-cargo { font-size: 12px; color: #9e8080; line-height: 1.5; }

  .disclaimer { padding: 20px 40px; background: #f5f0e8; border-bottom: 1px solid #e0d5c8; }
  .disclaimer-inner { background: #fff; border-radius: 10px; border: 1px solid #e8ddd5; padding: 14px 16px; display: flex; gap: 10px; align-items: flex-start; }
  .disclaimer-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .disclaimer-text { font-size: 11px; color: #9e8080; line-height: 1.6; }
  .disclaimer-text strong { color: #7a5c63; font-weight: 500; }

  .footer { padding: 24px 40px; text-align: center; }
  .footer-logo { font-family: 'DM Serif Display', Georgia, serif; font-size: 18px; color: #6B2737; margin-bottom: 6px; }
  .footer-url { font-size: 12px; color: #9e8080; margin-bottom: 4px; }
  .footer-copy { font-size: 11px; color: #b0a0a0; }

  @media (max-width: 480px) {
    .header { padding: 32px 24px 28px; }
    .header-title { font-size: 30px; }
    .intro, .ciencia, .receta-section, .pullquote, .sintomas,
    .cta-reto, .cierre, .disclaimer, .footer { padding-left: 24px; padding-right: 24px; }
    .sintomas-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="wrapper">

  <div class="header">
    <div class="logo-row">
      <span class="logo-text">Food·Mood</span>
      <div class="logo-dot"></div>
      <span class="logo-text">Hábitos &amp; Placer</span>
    </div>
    <div class="header-eyebrow">Newsletter · Neurociencia del hábito</div>
    <div class="header-title">
      Los hábitos duraderos no<br>
      <em>se crean con disciplina.</em>
    </div>
    <div class="header-subtitle">
      Se crean con dopamina. Y la dopamina responde al placer,
      no al esfuerzo. La ciencia lleva décadas diciéndolo.
    </div>
  </div>

  <div class="intro">
    <p class="intro-lead">
      Has probado la disciplina. Te has prometido comer mejor cien veces. Y cien veces, en algún momento, te has rendido. No porque seas débil. Porque estabas usando el mecanismo equivocado.
    </p>
    <div class="intro-body">
      <p>
        La disciplina usa la corteza prefrontal — la parte más nueva del cerebro, la que gestiona la fuerza de voluntad.
        El problema es que la corteza prefrontal <strong>se agota.</strong> Funciona bien el lunes.
        Falla el viernes. Es biología, no carácter.
      </p>
      <p>
        Los hábitos reales se forman en los ganglios basales — una región más antigua y más potente
        que no necesita fuerza de voluntad porque opera en modo automático.
        Para que un comportamiento llegue ahí, tiene que pasar por el circuito de recompensa.
        Y el circuito de recompensa responde a una sola cosa: <strong>el placer.</strong>
      </p>
      <p>
        Cuando comes algo que te gusta de verdad, y esa comida además nutre tu cerebro,
        no estás cediendo. Estás construyendo el hábito más sólido que existe.
        La neurociencia lo lleva confirmando desde los años noventa.
      </p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pullquote-text">
      El cerebro no aprende por esfuerzo.<br>
      Aprende por <em>repetición placentera.</em><br>
      Cada comida que disfrutas de verdad es una instrucción<br>
      que le das a tus ganglios basales.
    </p>
  </div>

  <div class="sintomas">
    <p class="section-label">¿Te suena alguno de estos?</p>
    <div class="sintomas-grid">
      <div class="sintoma-card">
        <div class="sintoma-icon">📅</div>
        <div class="sintoma-texto">Propósitos que duran dos semanas</div>
        <div class="sintoma-sub">Corteza prefrontal vs. ganglios basales — siempre gana la segunda</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">😔</div>
        <div class="sintoma-texto">Comer "bien" como castigo, "mal" como premio</div>
        <div class="sintoma-sub">El circuito de recompensa invertido</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">⚡</div>
        <div class="sintoma-texto">Motivación que funciona lunes y falla el jueves</div>
        <div class="sintoma-sub">Agotamiento de la fuerza de voluntad (ego depletion)</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">🔄</div>
        <div class="sintoma-texto">Ciclo restricción–exceso que se repite</div>
        <div class="sintoma-sub">El rebote dopaminérgico de la privación</div>
      </div>
    </div>
  </div>

  <div class="ciencia">
    <p class="section-label">💡 La idea de hoy — Dopamina, hábito y el circuito de recompensa</p>

    <div class="dato-box">
      <div class="dato-numero">66 días</div>
      <div class="dato-label">
        es la media real para que un hábito se automatice (Lally et al., 2010).<br>
        <strong>Los hábitos formados desde el placer tardan significativamente menos.</strong>
      </div>
    </div>

    <div class="ciencia-body">
      <p>
        El mito de los 21 días viene de un libro de cirugía plástica de los años sesenta.
        La realidad, según el University College London, es que la automatización tarda entre
        18 y 254 días según la complejidad del comportamiento — con una media de 66.
      </p>
      <p>
        Pero hay un factor que acelera radicalmente ese proceso:
        <strong>el placer genuino durante la ejecución del hábito.</strong>
        Cuando una conducta produce dopamina, las conexiones sinápticas que la
        generaron se fortalecen. El cerebro aprende que vale la pena repetirla.
        Sin dopamina, sin aprendizaje.
      </p>
    </div>

    <div class="cadena">
      <div class="cadena-paso">Placer real</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">Dopamina</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">Núcleo accumbens</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">Ganglios basales</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">Hábito automático</div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">🧠</div>
      <div class="mecanismo-text">
        <strong>Dopamina → Aprendizaje por recompensa</strong>
        La dopamina no es la molécula del placer en sí — es la molécula de la
        señal de recompensa. Cada vez que una acción produce placer, las neuronas
        dopaminérgicas del área tegmental ventral disparan y refuerzan el circuito
        que llevó a ese placer. La próxima vez, el comportamiento se activa con
        menos esfuerzo consciente.
        <div class="mecanismo-ref">Schultz, 1997 · Science · Predictive reward signal of dopamine neurons</div>
      </div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">🥚</div>
      <div class="mecanismo-text">
        <strong>Tirosina → Síntesis de dopamina</strong>
        La dopamina se fabrica desde el aminoácido tirosina, con vitamina B6, hierro
        y folato como cofactores. Una dieta pobre en tirosina biodisponible reduce la
        capacidad del cerebro de sentir recompensa — y sin recompensa, los hábitos
        no se forman. Las fuentes más concentradas: huevos enteros, legumbres,
        semillas de girasol, queso curado con moderación.
        <div class="mecanismo-ref">Young, 2007 · Neuropsychopharmacology · How to increase serotonin in human brain without drugs</div>
      </div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">🍓</div>
      <div class="mecanismo-text">
        <strong>Placer anticipatorio → Dopamina antes del primer bocado</strong>
        El cerebro empieza a liberar dopamina en la anticipación, no solo en el consumo.
        Un plato visualmente atractivo, un aroma agradable, una presentación cuidada
        activan el mismo circuito que el placer mismo. Esto no es superficial —
        es biología del aprendizaje. Comer bien presentado es literalmente más saludable
        para la formación de hábitos.
        <div class="mecanismo-ref">Berridge &amp; Robinson, 1998 · Brain Research Reviews · What is the role of dopamine in wanting and liking?</div>
      </div>
    </div>

    <div class="ciencia-body" style="margin-top:16px;">
      <p>
        Estos tres mecanismos explican por qué Food·Mood funciona donde los planes de
        "comer sano" fracasan: <strong>placer primero, nutrición integrada.</strong>
        No se trata de tolerar la comida saludable. Se trata de que la comida
        saludable active los mismos circuitos de recompensa que lo que más te gusta.
      </p>
    </div>
  </div>

  <div class="receta-section">
    <p class="section-label">🍽 La receta — Dopamina en el desayuno</p>
    <div class="receta-card">
      <div class="receta-header">
        <div class="receta-mood">Placer consciente · Tirosina + Vitamina C + Flavonoides</div>
        <div class="receta-nombre">Bol de yogur griego con fresas, chocolate negro y semillas de girasol</div>
        <div class="receta-meta">⏱ 5 min · Desayuno o merienda · El bol que crea el hábito del desayuno</div>
      </div>
      <div class="receta-body">
        <div class="receta-ingredientes">
          <p class="ing-label">Ingredientes</p>
          <div class="ing-item"><div class="ing-dot"></div><span>150 g de yogur griego entero — cuanto más cremoso, mejor</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>100 g de fresas frescas cortadas en cuartos</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>20 g de chocolate negro 70%+ rallado o en trozos pequeños</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>2 cucharadas de semillas de girasol tostadas</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>1 cucharadita de miel cruda o de dátil — al gusto</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span class="ing-opcional">Unas hojas de menta fresca — opcional, pero transforma la experiencia</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span class="ing-opcional">Una pizca de canela de Ceilán — opcional</span></div>
        </div>
        <div class="receta-pasos">
          <p class="ing-label">Preparación</p>
          <div class="paso">
            <div class="paso-num">1</div>
            <div>
              Vierte el yogur en un bol bonito. La presentación importa — activa la dopamina anticipatoria.
              <span class="paso-tip">Usa tu bol favorito. No es vanidad: es neurociencia del placer.</span>
            </div>
          </div>
          <div class="paso">
            <div class="paso-num">2</div>
            <div>Coloca las fresas de forma generosa. Que se vean, que ocupen espacio.</div>
          </div>
          <div class="paso">
            <div class="paso-num">3</div>
            <div>
              Esparce el chocolate negro rallado y las semillas de girasol.
              <span class="paso-tip">El crujido de las semillas es parte del placer — no lo escatimes.</span>
            </div>
          </div>
          <div class="paso">
            <div class="paso-num">4</div>
            <div>Termina con la miel, la menta si la tienes, y una pizca de canela.</div>
          </div>
          <div class="paso">
            <div class="paso-num">5</div>
            <div>
              Come despacio. Un minuto sin pantallas. Solo el bol.
              <span class="paso-tip">La atención al placer refuerza la señal dopaminérgica — esto es literal.</span>
            </div>
          </div>
        </div>
        <div class="receta-nota">
          <strong>Por qué crea el hábito:</strong>
          El yogur griego es de las fuentes más concentradas de tirosina
          biodisponible — el precursor directo de la dopamina.
          Las fresas aportan vitamina C, cofactor esencial en la síntesis de dopamina y norepinefrina.
          El chocolate negro contiene feniletilamina y flavonoides que potencian la señal dopaminérgica.
          Las semillas de girasol suman zinc y vitamina B6, los dos cofactores más frecuentemente
          deficientes en personas con baja motivación. Todo en cinco minutos.
          Todo placentero. Todo por diseño.
        </div>
      </div>
    </div>
  </div>


  <div class="cierre">
    <p class="cierre-text">
      La próxima vez que te digas "necesito más disciplina" para comer mejor,
      recuerda esto: la disciplina se agota. El placer, no.
      <br><br>
      Los hábitos duraderos se construyen desde lo que disfrutas, no desde lo que aguantas.
      La receta de arriba no es un premio por portarte bien.
      Es el mecanismo correcto desde el principio.
    </p>
    <div class="cierre-firma">
      <div class="firma-nombre">S. Ferreras</div>
      <div class="firma-cargo">
        Psicóloga · Especialista en longevidad<br>
        Experta en tecnología de los alimentos
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <div class="disclaimer-inner">
      <div class="disclaimer-icon">📖</div>
      <div class="disclaimer-text">
        <strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia
        científica actualizada a un lenguaje accesible para que puedas tomar decisiones
        informadas sobre tu salud y bienestar. No sustituye el diagnóstico ni el tratamiento
        de ningún profesional de la salud. Las referencias incluidas corresponden a
        publicaciones revisadas por pares.
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-logo">Food·Mood</div>
    <div class="footer-url">food-mood.app</div>
    <div class="footer-copy">© 2026 Food·Mood</div>
  </div>

</div>
</body>
</html>`
}
