export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — El cansancio que no se va con dormir</title>
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
      <span class="logo-text">Energía &amp; Mitocondrias</span>
    </div>
    <div class="header-eyebrow">Newsletter · Reset energético</div>
    <div class="header-title">
      El cansancio que<br>
      <em>no se va con dormir.</em>
    </div>
    <div class="header-subtitle">
      Si descansas y sigues agotada, el problema no es el sueño.
      Es lo que está ocurriendo dentro de tus células.
    </div>
  </div>

  <div class="intro">
    <p class="intro-lead">
      Duermes ocho horas. Te levantas cansada. Tomas café. Funciona un rato. Y a las cuatro de la tarde, el cuerpo dice basta.
    </p>
    <div class="intro-body">
      <p>
        Eso no es pereza. No es estrés mal gestionado. No es que necesites vacaciones.
        Es que <strong>tus mitocondrias no están recibiendo lo que necesitan para producir energía de forma eficiente.</strong>
      </p>
      <p>
        Las mitocondrias son las centrales energéticas de cada célula. Convierten lo que comes en ATP —
        la molécula de energía que usa todo el cuerpo, desde el músculo hasta el cerebro.
        Cuando ese proceso falla, la fatiga aparece antes de que nada más lo haga.
      </p>
      <p>
        La buena noticia: las mitocondrias responden rápido. Con los cofactores correctos,
        la producción de ATP mejora en días. <strong>No en meses. En días.</strong>
      </p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pullquote-text">
      La fatiga crónica no es un problema de actitud.<br>
      Es un problema de <em>bioquímica mitocondrial.</em><br>
      Y la bioquímica se cambia con lo que comes.
    </p>
  </div>

  <div class="sintomas">
    <p class="section-label">¿Te suena alguno de estos?</p>
    <div class="sintomas-grid">
      <div class="sintoma-card">
        <div class="sintoma-icon">😴</div>
        <div class="sintoma-texto">Cansancio que no mejora al descansar</div>
        <div class="sintoma-sub">El más típico de disfunción mitocondrial</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">🌫</div>
        <div class="sintoma-texto">Niebla mental de fondo</div>
        <div class="sintoma-sub">El cerebro necesita el 20% del ATP total</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">📉</div>
        <div class="sintoma-texto">Energía irregular con bajones bruscos</div>
        <div class="sintoma-sub">Picos de glucosa + mitocondrias lentas</div>
      </div>
      <div class="sintoma-card">
        <div class="sintoma-icon">🥶</div>
        <div class="sintoma-texto">Frío constante, intolerancia al frío</div>
        <div class="sintoma-sub">Señal clásica de bajo rendimiento mitocondrial</div>
      </div>
    </div>
  </div>

  <div class="ciencia">
    <p class="section-label">💡 La idea de hoy — CoQ10 y la cadena respiratoria</p>

    <div class="dato-box">
      <div class="dato-numero">50%</div>
      <div class="dato-label">
        de caída en la producción de CoQ10 entre los 20 y los 50 años.<br>
        <strong>Sin CoQ10, la cadena de transporte electrónico se ralentiza y el ATP cae.</strong>
      </div>
    </div>

    <div class="ciencia-body">
      <p>
        La Coenzima Q10 — CoQ10, ubiquinona — es la molécula central de la cadena de transporte
        electrónico mitocondrial. Actúa como lanzadera de electrones entre los complejos I-II y III,
        el proceso que convierte los nutrientes en ATP.
      </p>
      <p>
        Sin CoQ10 suficiente, la cadena respiratoria pierde eficiencia: se produce menos ATP
        y más radicales libres. El resultado es exactamente lo que sientes —
        <strong>energía que no llega, cansancio que no mejora con descanso,
        niebla mental de fondo.</strong>
      </p>
    </div>

    <div class="cadena">
      <div class="cadena-paso">Nutrientes</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">CoQ10</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">Cadena respiratoria</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">ATP</div>
      <div class="cadena-arrow">→</div>
      <div class="cadena-paso">Energía real</div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">⚡</div>
      <div class="mecanismo-text">
        <strong>CoQ10 → ATP mitocondrial</strong>
        El CoQ10 es el único transportador de electrones que puede moverse entre los complejos
        de la cadena respiratoria. Sin él, el proceso se detiene. Las sardinas, la caballa y
        las semillas de calabaza son las fuentes más concentradas de CoQ10 biodisponible
        de la dieta cotidiana.
        <div class="mecanismo-ref">Crane, 2001 · Mitochondrion · Coenzyme Q10, the enzyme and vitamin</div>
      </div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">🔋</div>
      <div class="mecanismo-text">
        <strong>Magnesio → ATP activo</strong>
        El ATP no puede usarse solo. Necesita unirse a un ion de magnesio para formar el
        complejo ATP-Mg²⁺, que es la forma funcionalmente activa. Sin magnesio suficiente,
        el ATP producido no se puede usar. Tienes energía en teoría pero no en la práctica.
        <div class="mecanismo-ref">Altura &amp; Altura, 1995 · Sci Am · Magnesium: forgotten nutrient</div>
      </div>
    </div>

    <div class="mecanismo-row">
      <div class="mecanismo-icon">🐟</div>
      <div class="mecanismo-text">
        <strong>Omega-3 → membranas mitocondriales fluidas</strong>
        Las mitocondrias están rodeadas por una doble membrana lipídica. Cuando esa membrana
        es rica en DHA, es más fluida y la cadena de transporte electrónico funciona con
        más eficiencia. Las membranas rígidas por déficit de omega-3 ralentizan la producción
        de ATP de forma directa.
        <div class="mecanismo-ref">Ikon &amp; Thomas, 2016 · Adv Nutr · Omega-3 and mitochondrial function</div>
      </div>
    </div>

    <div class="ciencia-body" style="margin-top:16px;">
      <p>
        Estos tres cofactores — CoQ10, magnesio y omega-3 — son los más frecuentemente
        deficientes en personas con fatiga crónica. Y los tres se pueden recuperar
        <strong>en días, no en meses, cuando se aportan desde la alimentación.</strong>
      </p>
    </div>
  </div>

  <div class="receta-section">
    <p class="section-label">🍽 La receta — Energía celular en un bol</p>
    <div class="receta-card">
      <div class="receta-header">
        <div class="receta-mood">Reset energético · CoQ10 + Magnesio + Omega-3</div>
        <div class="receta-nombre">Bol de sardinas, aguacate y semillas de calabaza</div>
        <div class="receta-meta">⏱ 10 min · Comida · Primer plato del reset mitocondrial</div>
      </div>
      <div class="receta-body">
        <div class="receta-ingredientes">
          <p class="ing-label">Ingredientes</p>
          <div class="ing-item"><div class="ing-dot"></div><span>1 lata de sardinas en aceite de oliva — conserva el aceite de la lata si es de oliva</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>1/2 aguacate maduro</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>2 cucharadas de semillas de calabaza tostadas</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>1 puñado de rúcula o espinacas baby</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>Zumo de 1/2 limón</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>1 cucharada de aceite de oliva virgen extra</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span>Sal marina y pimienta negra</span></div>
          <div class="ing-item"><div class="ing-dot"></div><span class="ing-opcional">Unas gotas de vinagre de kombucha o de manzana — opcional</span></div>
        </div>
        <div class="receta-pasos">
          <p class="ing-label">Preparación</p>
          <div class="paso">
            <div class="paso-num">1</div>
            <div>
              Extiende la rúcula o espinacas en el bol.
              <span class="paso-tip">Las espinacas aportan magnesio adicional — el cofactor del ATP activo.</span>
            </div>
          </div>
          <div class="paso">
            <div class="paso-num">2</div>
            <div>
              Desmenuza las sardinas encima. Si el aceite de la lata es de oliva, viértelo también.
              <span class="paso-tip">El aceite de la lata tiene CoQ10 disuelto — no lo tires.</span>
            </div>
          </div>
          <div class="paso">
            <div class="paso-num">3</div>
            <div>Lamina el aguacate y colócalo al lado.</div>
          </div>
          <div class="paso">
            <div class="paso-num">4</div>
            <div>Esparce las semillas de calabaza generosamente.</div>
          </div>
          <div class="paso">
            <div class="paso-num">5</div>
            <div>
              Aliña con zumo de limón, aceite de oliva, sal y pimienta.
              Unas gotas de vinagre de manzana al final si tienes.
            </div>
          </div>
        </div>
        <div class="receta-nota">
          <strong>Por qué activa la energía:</strong>
          Las sardinas son la fuente más concentrada de CoQ10 biodisponible y DHA de
          la dieta cotidiana — más que el salmón de piscifactoría y más económicas.
          El aguacate aporta CoQ10 vegetal y glutatión, el antioxidante que protege
          las mitocondrias del daño oxidativo generado durante la síntesis de ATP.
          Las semillas de calabaza tienen magnesio, zinc y triptófano — los tres
          cofactores mitocondriales más deficientes en fatiga crónica. Todo en 10 minutos.
        </div>
      </div>
    </div>
  </div>


  <div class="cierre">
    <p class="cierre-text">
      La fatiga que llevas meses normalizando no es tu nueva normalidad.
      Es tu cuerpo pidiendo tres cosas muy concretas: CoQ10, magnesio y omega-3.
      Cuando los aportas, las mitocondrias responden. Rápido.
      <br><br>
      El reto te guía día a día. La receta de arriba es el día 1.
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
