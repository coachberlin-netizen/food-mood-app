export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — El hábito que no necesita fuerza de voluntad</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'DM Sans', Georgia, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 620px; margin: 0 auto; background: #F5F0E8; }
  .header { background: #1E1A0E; padding: 48px 40px 40px; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: -50px; right: -30px; width: 280px; height: 280px; border-radius: 50%; background: rgba(201,168,76,0.12); }
  .header::after { content: ''; position: absolute; bottom: -20px; left: -30px; width: 180px; height: 180px; border-radius: 50%; background: rgba(107,39,55,0.10); }
  .logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; position: relative; z-index: 1; }
  .logo-text { font-family: 'DM Serif Display', Georgia, serif; font-size: 16px; color: rgba(245,240,232,0.4); letter-spacing: .04em; }
  .logo-dot { width: 4px; height: 4px; border-radius: 50%; background: #C9A84C; }
  .header-eyebrow { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #C9A84C; margin-bottom: 20px; position: relative; z-index: 1; }
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
  .cadena-arrow { font-size: 14px; color: #C9A84C; padding: 0 4px; flex-shrink: 0; }
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
  .ing-dot { width: 5px; height: 5px; border-radius: 50%; background: #C9A84C; flex-shrink: 0; margin-top: 6px; }
  .ing-opcional { color: #9e8080; font-style: italic; }
  .receta-pasos { border-top: 1px solid #f0e8e0; padding-top: 16px; margin: 16px 0; }
  .paso { display: flex; gap: 12px; margin-bottom: 12px; font-size: 13px; color: #4a3a3e; line-height: 1.55; }
  .paso-num { width: 22px; height: 22px; border-radius: 50%; background: #6B2737; color: #F5F0E8; font-size: 11px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .paso-tip { display: block; font-size: 11px; color: #9e8080; font-style: italic; margin-top: 3px; }
  .receta-nota { background: #fdf5e0; border-radius: 10px; padding: 14px 16px; font-size: 12px; color: #7a5a00; line-height: 1.65; border-left: 3px solid #C9A84C; margin-top: 4px; }
  .receta-nota strong { color: #7a5a00; }
  .cta-reto { padding: 36px 40px; background: #1E1A0E; border-bottom: 1px solid #e0d5c8; text-align: center; }
  .cta-reto-eyebrow { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: #C9A84C; margin-bottom: 16px; }
  .cta-reto-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 26px; color: #F5F0E8; font-weight: 400; margin-bottom: 12px; line-height: 1.2; }
  .cta-reto-title em { font-style: italic; color: #E8C45A; }
  .cta-reto-desc { font-size: 14px; color: rgba(245,240,232,0.65); line-height: 1.65; margin-bottom: 24px; max-width: 440px; margin-left: auto; margin-right: auto; }
  .cta-incluye { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; text-align: left; max-width: 360px; margin-left: auto; margin-right: auto; }
  .cta-incluye-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(245,240,232,0.75); }
  .cta-incluye-check { color: #C9A84C; font-weight: 700; flex-shrink: 0; }
  .cta-btn-grande { display: inline-block; background: #C9A84C; color: #1E1A0E; font-size: 15px; font-weight: 600; padding: 15px 32px; border-radius: 30px; text-decoration: none; letter-spacing: .02em; }
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

  <!-- HEADER -->
  <div class="header">
    <div class="logo-row">
      <span class="logo-text">Food·Mood</span>
      <div class="logo-dot"></div>
      <span class="logo-text">Hábitos &amp; Neurociencia</span>
    </div>
    <div class="header-eyebrow">Newsletter · Microhábitos</div>
    <div class="header-title">
      El hábito que no<br>
      <em>necesita fuerza de voluntad.</em>
    </div>
    <div class="header-subtitle">
      La razón por la que los hábitos fallan no es la falta de disciplina.
      Es que están mal diseñados desde el principio.
    </div>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p class="intro-lead">
      Has intentado cambiar un hábito. Has durado unos días. Luego la vida se ha complicado y lo has dejado. Y has concluido que el problema eres tú.
    </p>
    <div class="intro-body">
      <p>No eres tú. Es el diseño.</p>
      <p>La mayoría de los intentos de crear hábitos están construidos sobre un error fundamental: <strong>dependen de la motivación.</strong>
        La motivación es volátil. Sube cuando empiezas algo nuevo, baja cuando la novedad desaparece.
        Si el hábito necesita motivación para ocurrir, va a fallar en el momento más inoportuno — cuando más lo necesitas.</p>
      <p>Existe una alternativa. No es disciplina. No es esfuerzo. Es <strong>usar el placer como mecanismo neurológico</strong> para anclar el comportamiento antes de que el córtex prefrontal tenga tiempo de decidir si quiere hacerlo o no.</p>
      <p>Eso es lo que hace un microhábito bien diseñado.</p>
    </div>
  </div>

  <!-- PULLQUOTE -->
  <div class="pullquote">
    <p class="pullquote-text">
      La dopamina no es la recompensa.<br>
      La dopamina es <em>la anticipación del placer.</em><br>
      Ahí está la llave del hábito.
    </p>
  </div>

  <!-- SEÑALES -->
  <div class="sintomas">
    <p class="section-label">Señales de que tu estrategia de hábitos no funciona</p>
    <div class="sintomas-grid">
      <div class="sintoma-card">
        <div class="sintoma-icon">🔁</div>
        <div class="sintoma-texto">Empiezas bien y abandonas a los 10 días</div>
        <div class="sintoma-sub">Ciclo motivación–agotamiento. El hábito es demasiado grande.</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">😤</div>
        <div class="sintoma-texto">Requiere esfuerzo consciente cada vez</div>
        <div class="sintoma-sub">No ha pasado a los ganglios basales todavía — sigue en el córtex.</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">📅</div>
        <div class="sintoma-texto">Solo funciona cuando tienes tiempo</div>
        <div class="sintoma-sub">El hábito depende de condiciones externas, no de señales internas.</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">🎯</div>
        <div class="sintoma-texto">Lo haces "cuando te acuerdes"</div>
        <div class="sintoma-sub">Sin ancla de comportamiento. Sin señal. Sin asociación.</div>
      </div>
    </div>
  </div>

  <!-- CIENCIA -->
  <div class="ciencia">
    <p class="section-label">💡 Dopamina, anticipación y el bucle del hábito</p>
    <div class="dato-box">
      <div class="dato-numero">66 días</div>
      <div class="dato-label">
        Tiempo promedio para que un comportamiento se vuelva automático,<br>
        según el estudio de Lally et al. (UCL, 2010).<br>
        <strong>El mito de los 21 días es eso: un mito.</strong>
      </div>
    </div>
    <div class="ciencia-body">
      <p>En los años 90, Wolfram Schultz descubrió algo inesperado en los experimentos con primates: la dopamina no se liberaba al recibir la recompensa. Se liberaba al anticiparla. Cuando el animal aprendía que cierta señal predecía una recompensa, la dopamina disparaba al ver la señal — no al recibir el premio.</p>
      <p>Esto explica por qué los hábitos mal diseñados nunca se automatizan: <strong>si no hay anticipación placentera, no hay dopamina, no hay bucle.</strong> El comportamiento queda atrapado en el córtex prefrontal como decisión consciente, dependiente de motivación.</p>
      <p>La ancla hedónica funciona diferente. Al vincular el microhábito a algo genuinamente placentero — una bebida que te gusta, un aroma, un ritual sensorial — estás creando la señal de anticipación que el circuito dopaminérgico necesita para automatizar el comportamiento.</p>

      <div class="cadena">
        <span class="cadena-paso">Señal (ancla)</span>
        <span class="cadena-arrow">→</span>
        <span class="cadena-paso">Anticipación de placer</span>
        <span class="cadena-arrow">→</span>
        <span class="cadena-paso">Dopamina</span>
        <span class="cadena-arrow">→</span>
        <span class="cadena-paso">Comportamiento</span>
        <span class="cadena-arrow">→</span>
        <span class="cadena-paso">Recompensa real</span>
        <span class="cadena-arrow">→</span>
        <span class="cadena-paso">Bucle reforzado</span>
      </div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">🧠</div>
      <div class="mecanismo-text">
        <strong>Tiny Habits — BJ Fogg, Stanford</strong>
        Reduce el hábito hasta que sea ridículo no hacerlo. La resistencia desaparece cuando el umbral de acción está por debajo del nivel de inercia.
        <div class="mecanismo-ref">Fogg, B.J. (2019). Tiny Habits: The Small Changes That Change Everything.</div>
      </div>
    </div>
    <div class="mecanismo-row">
      <div class="mecanismo-icon">🪞</div>
      <div class="mecanismo-text">
        <strong>Identidad — James Clear, Atomic Habits</strong>
        Los hábitos que duran son los que refuerzan quién eres, no los que persiguen lo que quieres lograr. "Soy alguien que empieza el día con algo funcional" es más poderoso que "quiero ser más sana".
        <div class="mecanismo-ref">Clear, J. (2018). Atomic Habits.</div>
      </div>
    </div>
    <div class="mecanismo-row">
      <div class="mecanismo-icon">🏡</div>
      <div class="mecanismo-text">
        <strong>Diseño de entorno — Wendy Wood, USC</strong>
        El 43% de los comportamientos diarios son hábitos — ocurren en el mismo contexto, sin decisión consciente. El entorno predice el comportamiento. Cambia el entorno, cambia el hábito.
        <div class="mecanismo-ref">Wood, W. (2019). Good Habits, Bad Habits.</div>
      </div>
    </div>
  </div>

  <!-- RECETA -->
  <div class="receta-section">
    <p class="section-label">✨ Tu primera ancla hedónica</p>
    <div class="receta-card">
      <div class="receta-header">
        <div class="receta-mood">Microhábitos · Día 1 · Fase Preparar</div>
        <div class="receta-nombre">Limonada fermentada de limón, jengibre y cúrcuma</div>
        <div class="receta-meta">5 minutos · Probiótica · Antiinflamatoria</div>
      </div>
      <div class="receta-body">
        <div class="ing-label">Ingredientes</div>
        <div class="ing-item"><div class="ing-dot"></div><div>200ml de agua con gas o agua de kéfir</div></div>
        <div class="ing-item"><div class="ing-dot"></div><div>Zumo de ½ limón fresco</div></div>
        <div class="ing-item"><div class="ing-dot"></div><div>1 cdta de jengibre fresco rallado</div></div>
        <div class="ing-item"><div class="ing-dot"></div><div>¼ cdta de cúrcuma en polvo</div></div>
        <div class="ing-item"><div class="ing-dot"></div><div>Pizca de pimienta negra</div></div>
        <div class="ing-item"><div class="ing-dot"></div><div class="ing-opcional">1 cdta de miel cruda (opcional)</div></div>
        <div class="ing-item"><div class="ing-dot"></div><div class="ing-opcional">Hielo al gusto</div></div>

        <div class="receta-pasos">
          <div class="paso"><div class="paso-num">1</div><div>Exprime el limón directamente en el vaso.</div></div>
          <div class="paso"><div class="paso-num">2</div><div>Añade el jengibre rallado, la cúrcuma y la pimienta negra.</div></div>
          <div class="paso"><div class="paso-num">3</div><div>Vierte el agua con gas lentamente para conservar las burbujas.</div></div>
          <div class="paso"><div class="paso-num">4</div><div>Añade miel si lo deseas. Remueve suavemente.</div></div>
          <div class="paso"><div class="paso-num">5</div><div>
            Antes de tu primer café del día, toma un sorbo consciente. Eso es todo el hábito de hoy.
            <span class="paso-tip">Ancla el nuevo comportamiento al café — que ya existe — para que no requiera recordarlo.</span>
          </div></div>
        </div>

        <div class="receta-nota">
          <strong>Nota Food·Mood:</strong> La vitamina C del limón potencia la absorción de hierro y activa la síntesis de neurotransmisores. Los gingeroles del jengibre tienen efecto antiinflamatorio comparable al ibuprofeno en dosis bajas. La curcumina — activada por la piperina de la pimienta negra — reduce la neuroinflamación que produce niebla mental y fatiga anímica.
        </div>
      </div>
    </div>
  </div>

  <!-- CTA RETO -->
  <div class="cta-reto">
    <div class="cta-reto-eyebrow">Nuevo reto disponible</div>
    <div class="cta-reto-title">
      Microhábitos — <em>21 días</em><br>para crear hábitos sin fuerza de voluntad
    </div>
    <div class="cta-reto-desc">
      21 días de psicología del comportamiento aplicada. Cada día: un microhábito con base neurocientífica, una bebida fermentada como ancla hedónica y un audio de 3-5 minutos. Sin disciplina. Sin castigo. Con placer.
    </div>
    <div class="cta-incluye">
      <div class="cta-incluye-item"><span class="cta-incluye-check">✓</span> 21 microhábitos con base en Tiny Habits, WOOP y Atomic Habits</div>
      <div class="cta-incluye-item"><span class="cta-incluye-check">✓</span> 21 bebidas funcionales fermentadas como ancla hedónica</div>
      <div class="cta-incluye-item"><span class="cta-incluye-check">✓</span> 21 audios guiados de 3-5 minutos (descargables)</div>
      <div class="cta-incluye-item"><span class="cta-incluye-check">✓</span> Diario de reflexión mañana, tarde y noche</div>
      <div class="cta-incluye-item"><span class="cta-incluye-check">✓</span> Acceso de por vida al contenido</div>
    </div>
    <a href="https://www.food-mood.app/retos/microhabitos" class="cta-btn-grande">
      Ver el reto Microhábitos →
    </a>
    <div class="cta-precio">29€ · Pago único · Acceso inmediato</div>
  </div>

  <!-- CIERRE -->
  <div class="cierre">
    <div class="cierre-text">
      <p>La próxima vez que intentes crear un hábito, hazte esta pregunta antes de empezar: ¿hay algo genuinamente placentero en este comportamiento, o dependo de la motivación para hacerlo?</p>
      <p>Si la respuesta es "motivación", rediseña el hábito hasta que no la necesite.</p>
    </div>
    <div class="cierre-firma">
      <div class="firma-nombre">Food·Mood</div>
      <div class="firma-cargo">Nutrición emocional basada en el eje intestino-cerebro<br>food-mood.app</div>
    </div>
  </div>

  <!-- DISCLAIMER -->
  <div class="disclaimer">
    <div class="disclaimer-inner">
      <div class="disclaimer-icon">🔬</div>
      <div class="disclaimer-text">
        <strong>Nota informativa:</strong> Este contenido es divulgativo y no sustituye el consejo médico o nutricional personalizado. Las referencias a estudios científicos tienen propósito educativo. Si tienes una condición de salud, consulta con un profesional antes de realizar cambios en tu alimentación.
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-logo">Food·Mood</div>
    <div class="footer-url">food-mood.app</div>
    <div class="footer-copy">© 2026 Food·Mood · Nutrición emocional</div>
  </div>

</div>
</body>
</html>`
}
