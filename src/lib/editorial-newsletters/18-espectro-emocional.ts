export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — No sientes una emoción. Sientes varias a la vez.</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'Lato', Georgia, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 680px; margin: 0 auto; background: #F5F0E8; }

  /* HEADER */
  .header { background: #2d0f16; padding: 48px 44px 44px; }
  .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #6B2737; letter-spacing: .06em; display: inline-block; margin-bottom: 28px; }
  .header-numero { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .20em; text-transform: uppercase; color: #C9A84C; margin-bottom: 8px; }
  .header-tagline { font-size: 11px; font-weight: 300; letter-spacing: .08em; color: rgba(245,240,232,0.45); margin-bottom: 32px; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 34px; font-weight: 700; color: #F5F0E8; line-height: 1.18; margin-bottom: 16px; }
  .header-title em { font-style: italic; color: #C9A84C; font-weight: 400; }

  /* INTRO */
  .intro { padding: 36px 44px; border-bottom: 1px solid #e0d5c8; }
  .intro p { font-size: 15px; line-height: 1.80; color: #4a3a3e; font-weight: 300; margin-bottom: 16px; }
  .intro p:last-child { margin-bottom: 0; }
  .intro strong { color: #2a1a1e; font-weight: 700; }

  /* SECTION LABEL */
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 18px; }

  /* SPECTRUM TABLE */
  .spectrum-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .spectrum-table { width: 100%; border-collapse: collapse; }
  .spectrum-table thead tr { background: #2d0f16; }
  .spectrum-table thead th { padding: 10px 12px; font-family: 'Lato', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.50); text-align: left; }
  .spectrum-table tbody tr { background: #3d151f; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .spectrum-table tbody tr:last-child { border-bottom: none; }
  .spectrum-table tbody td { padding: 12px 12px; font-size: 13px; font-weight: 300; color: rgba(245,240,232,0.85); line-height: 1.4; vertical-align: top; }
  .spectrum-table .td-estado { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: #C9A84C; }
  .spectrum-table .td-neuro { font-weight: 400; color: rgba(245,240,232,0.95); }
  .spectrum-note { margin-top: 12px; font-size: 11px; font-style: italic; color: #9e8080; line-height: 1.55; }

  /* AXIS FLOW */
  .axis-wrap { padding: 32px 44px; background: #fafaf5; border-bottom: 1px solid #e0d5c8; }
  .axis-step-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  .axis-step-table td { vertical-align: top; padding: 0; }
  .axis-step { background: #F5F0E8; border: 1px solid #d4c5bc; border-radius: 0; padding: 16px 18px; }
  .axis-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #C9A84C; line-height: 1; margin-bottom: 6px; }
  .axis-heading { font-size: 12px; font-weight: 700; color: #6B2737; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
  .axis-text { font-size: 12px; font-weight: 300; color: #4a3a3e; line-height: 1.60; }
  .axis-arrow { text-align: center; vertical-align: middle; padding: 0 6px; font-size: 18px; color: #C9A84C; }
  .axis-source { margin-top: 14px; font-size: 11px; font-style: italic; color: #9e8080; line-height: 1.5; }

  /* SCIENCE CARDS */
  .cards-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .science-card { border: 1px solid #C9A84C; border-radius: 4px; padding: 20px 22px; margin-bottom: 14px; background: #F5F0E8; }
  .science-card:last-child { margin-bottom: 0; }
  .card-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #2d0f16; margin-bottom: 4px; line-height: 1.3; }
  .card-author { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #C9A84C; margin-bottom: 10px; }
  .card-text { font-size: 13px; font-weight: 300; color: #4a3a3e; line-height: 1.70; margin-bottom: 8px; }
  .card-app { font-size: 12px; font-weight: 400; color: #6B2737; line-height: 1.55; border-top: 1px solid rgba(201,168,76,0.25); padding-top: 8px; margin-top: 4px; }
  .card-app strong { font-weight: 700; }

  /* LO QUE CAMBIA */
  .cambia-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .cambia-item { margin-bottom: 22px; }
  .cambia-item:last-child { margin-bottom: 0; }
  .cambia-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #C9A84C; font-weight: 700; line-height: 1; margin-bottom: 4px; }
  .cambia-text { font-size: 15px; font-weight: 300; color: #4a3a3e; line-height: 1.78; }
  .cambia-text strong { color: #2a1a1e; font-weight: 700; }

  /* RECIPE */
  .recipe-wrap { padding: 36px 44px; background: #2d0f16; }
  .recipe-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #C9A84C; margin-bottom: 6px; }
  .recipe-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #F5F0E8; line-height: 1.25; margin-bottom: 20px; }
  .recipe-col-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 10px; }
  .recipe-item { font-size: 14px; font-weight: 300; color: rgba(245,240,232,0.88); line-height: 1.65; margin-bottom: 5px; }
  .recipe-prep { font-size: 14px; font-weight: 300; color: rgba(245,240,232,0.80); line-height: 1.78; margin-bottom: 20px; }
  .recipe-note-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 8px; }
  .recipe-note { font-size: 13px; font-style: italic; color: rgba(245,240,232,0.65); line-height: 1.70; }

  /* PULL QUOTE */
  .pullquote { background: #C9A84C; padding: 36px 44px; }
  .pullquote-text { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #2d0f16; line-height: 1.40; text-align: center; }

  /* BIBLIOGRAPHY */
  .biblio-wrap { padding: 28px 44px; border-top: 1px solid #e0d5c8; border-bottom: 1px solid #e0d5c8; background: #fafaf5; }
  .biblio-title { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 12px; }
  .biblio-item { font-size: 11px; font-weight: 300; color: #7a6a6e; line-height: 1.65; margin-bottom: 5px; }

  /* CTA */
  .cta-wrap { padding: 36px 44px; text-align: center; border-bottom: 1px solid #e0d5c8; }
  .cta-btn { display: inline-block; background: #6B2737; color: #F5F0E8 !important; text-decoration: none; padding: 14px 32px; font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .06em; border-radius: 3px; }

  /* FOOTER */
  .footer { padding: 22px 44px; text-align: center; }
  .footer-text { font-size: 11px; font-weight: 300; color: #9e8080; line-height: 1.6; }

  @media (max-width: 480px) {
    .header { padding: 36px 24px 32px; }
    .header-title { font-size: 26px; }
    .intro, .spectrum-wrap, .axis-wrap, .cards-wrap, .cambia-wrap, .recipe-wrap, .pullquote, .biblio-wrap, .cta-wrap, .footer { padding-left: 24px; padding-right: 24px; }
    .axis-arrow { display: none; }
  }
</style>
</head>
<body>
<div class="wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-text">Food·Mood</div>
    <div class="header-numero">Nº 18 — Espectro emocional</div>
    <div class="header-tagline">La app de body &amp; mind que estabas esperando.</div>
    <div class="header-title">
      No sientes una emoción.<br>
      Sientes varias a la vez.<br>
      <em>Y eso tiene una explicación.</em>
    </div>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p>Las emociones no son reacciones fijas ni universales. La neurocientífica Lisa Feldman Barrett, en su Teoría de la Emoción Construida, propone que el cerebro <strong>fabrica activamente</strong> cada emoción en el momento, usando el contexto, el cuerpo y el aprendizaje previo. Lo que llamamos "estar bien" o "estar mal" sería en realidad un espectro de señales interoceptivas que el cerebro interpreta y etiqueta. Esta granularidad emocional —la capacidad de distinguir con precisión qué sentimos— se asocia, según la investigación, con mejor regulación del estrés y mayor bienestar.</p>
    <p>Y aquí entra el intestino. La evidencia actual sugiere que más del 90% de la serotonina del cuerpo se produce en el tracto gastrointestinal, no en el cerebro. A través del nervio vago, el sistema nervioso entérico —con sus aproximadamente 500 millones de neuronas— envía señales constantes hacia el cerebro, modulando el estado de ánimo, la motivación y la respuesta al estrés. La ciencia de los psicobióticos estudia precisamente cómo ciertos alimentos pueden influir en esta conversación.</p>
  </div>

  <!-- SPECTRUM TABLE -->
  <div class="spectrum-wrap">
    <div class="section-label">Gráfico 01 — El espectro emocional Food·Mood</div>
    <table class="spectrum-table">
      <thead>
        <tr>
          <th style="width:16%">Estado</th>
          <th style="width:21%">Neurotransmisor asociado</th>
          <th style="width:22%">Alimento clave</th>
          <th style="width:41%">Teoría de referencia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td-estado">Calma</td>
          <td class="td-neuro">GABA</td>
          <td>Miso fermentado</td>
          <td>Hipótesis del Marcador Somático (Damasio)</td>
        </tr>
        <tr>
          <td class="td-estado">Energía</td>
          <td class="td-neuro">Dopamina</td>
          <td>Cacao puro</td>
          <td>Teoría Bifactorial (Schachter &amp; Singer)</td>
        </tr>
        <tr>
          <td class="td-estado">Foco</td>
          <td class="td-neuro">Acetilcolina</td>
          <td>Huevo + colina</td>
          <td>Cognición Encarnada (Varela)</td>
        </tr>
        <tr>
          <td class="td-estado">Confort</td>
          <td class="td-neuro">Serotonina</td>
          <td>Avena + triptófano</td>
          <td>Eje intestino-cerebro (investigación actual)</td>
        </tr>
        <tr>
          <td class="td-estado">Alegría</td>
          <td class="td-neuro">Endorfinas</td>
          <td>Frutos rojos + polifenoles</td>
          <td>Rueda de Plutchik</td>
        </tr>
        <tr>
          <td class="td-estado">Descanso</td>
          <td class="td-neuro">Melatonina</td>
          <td>Nueces + magnesio</td>
          <td>Neurociencia sensorial aplicada</td>
        </tr>
      </tbody>
    </table>
    <div class="spectrum-note">Las asociaciones entre alimentos y neurotransmisores reflejan mecanismos estudiados en la literatura científica; no implican relación causal directa ni efecto terapéutico garantizado.</div>
  </div>

  <!-- AXIS FLOW -->
  <div class="axis-wrap">
    <div class="section-label">Gráfico 02 — El eje intestino-cerebro en 4 pasos</div>
    <table class="axis-step-table">
      <tr>
        <td style="width:22%; padding-right:4px;">
          <div class="axis-step">
            <div class="axis-num">①</div>
            <div class="axis-heading">Alimento</div>
            <div class="axis-text">Lo que comes modifica la composición de tu microbiota en horas</div>
          </div>
        </td>
        <td class="axis-arrow" style="width:4%;">→</td>
        <td style="width:22%; padding: 0 4px;">
          <div class="axis-step">
            <div class="axis-num">②</div>
            <div class="axis-heading">Microbiota</div>
            <div class="axis-text">Las bacterias producen metabolitos que incluyen precursores de neurotransmisores</div>
          </div>
        </td>
        <td class="axis-arrow" style="width:4%;">→</td>
        <td style="width:22%; padding: 0 4px;">
          <div class="axis-step">
            <div class="axis-num">③</div>
            <div class="axis-heading">Nervio vago</div>
            <div class="axis-text">El 80% de las señales van del intestino al cerebro, no al revés</div>
          </div>
        </td>
        <td class="axis-arrow" style="width:4%;">→</td>
        <td style="width:22%; padding-left:4px;">
          <div class="axis-step">
            <div class="axis-num">④</div>
            <div class="axis-heading">Cerebro</div>
            <div class="axis-text">El estado de ánimo, el foco y la calma pueden verse influenciados por esa conversación</div>
          </div>
        </td>
      </tr>
    </table>
    <div class="axis-source">Cryan et al., 2019, Nature Reviews Neuroscience; Damasio, A. (2010). Self Comes to Mind.</div>
  </div>

  <!-- SCIENCE CARDS -->
  <div class="cards-wrap">
    <div class="section-label">Los pilares que sostienen Food·Mood</div>

    <div class="science-card">
      <div class="card-title">"Las emociones se construyen, no se reciben"</div>
      <div class="card-author">Lisa Feldman Barrett — Teoría de la Emoción Construida</div>
      <div class="card-text">El cerebro predice y fabrica cada emoción usando contexto corporal y experiencias previas. Entrenar la granularidad emocional —saber exactamente qué sientes— se asocia con mejor regulación y bienestar (Barrett, 2017).</div>
      <div class="card-app"><strong>En Food·Mood:</strong> La paleta de 6 estados entrena esa granularidad con cada uso.</div>
    </div>

    <div class="science-card">
      <div class="card-title">"El cuerpo siente antes de que pienses"</div>
      <div class="card-author">Antonio Damasio — Hipótesis del Marcador Somático</div>
      <div class="card-text">Las sensaciones corporales —tensión, plenitud, calor— actúan como señales emocionales que guían decisiones. Los alimentos que comemos en contextos de bienestar pueden generar asociaciones somáticas positivas (Damasio, 1994).</div>
      <div class="card-app"><strong>En Food·Mood:</strong> Cada receta activa marcadores somáticos: texturas que calman, aromas que activan.</div>
    </div>

    <div class="science-card">
      <div class="card-title">"Los hábitos no se rompen — se reescriben"</div>
      <div class="card-author">Conductismo aplicado — Pavlov, Skinner, Mowrer</div>
      <div class="card-text">Los hábitos son bucles estímulo-respuesta-recompensa. La investigación sugiere que solo pueden reemplazarse por nuevos hábitos con una recompensa equivalente o mayor.</div>
      <div class="card-app"><strong>En Food·Mood:</strong> Los retos crean nuevos condicionamientos: rituales placenteros como respuesta a los mismos disparadores emocionales.</div>
    </div>
  </div>

  <!-- LO QUE CAMBIA -->
  <div class="cambia-wrap">
    <div class="section-label">Lo que cambia cuando lo entiendes</div>

    <div class="cambia-item">
      <div class="cambia-num">01</div>
      <div class="cambia-text"><strong>Dejas de comer por inercia.</strong> Cuando entiendes que ciertos alimentos pueden influir en la producción de neurotransmisores, cada elección se convierte en un acto consciente — no de control, sino de cuidado.</div>
    </div>

    <div class="cambia-item">
      <div class="cambia-num">02</div>
      <div class="cambia-text"><strong>Las emociones dejan de ser el enemigo.</strong> La Rueda de Plutchik muestra que las emociones complejas son combinaciones de básicas. El agobio, por ejemplo, puede ser miedo + anticipación + ira. Nombrarlo cambia cómo lo manejas.</div>
    </div>

    <div class="cambia-item">
      <div class="cambia-num">03</div>
      <div class="cambia-text"><strong>Tu intestino deja de ser invisible.</strong> La evidencia sugiere que el estado de tu microbiota puede influir en cómo te sientes ese día. Alimentarla bien no es una dieta: es una conversación.</div>
    </div>
  </div>

  <!-- RECIPE -->
  <div class="recipe-wrap">
    <div class="recipe-eyebrow">Receta Food·Mood</div>
    <div class="recipe-title">Bowl de miso y quinoa para la calma</div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="width:48%; vertical-align:top; padding-right:20px;">
          <div class="recipe-col-label">Ingredientes (2 personas)</div>
          <div class="recipe-item">— 160 g de quinoa cocida</div>
          <div class="recipe-item">— 2 cdas de miso blanco (shiro miso)</div>
          <div class="recipe-item">— 1 cda de tahini</div>
          <div class="recipe-item">— Edamame, aguacate, pepino</div>
          <div class="recipe-item">— Semillas de sésamo negro</div>
          <div class="recipe-item">— Unas gotas de vinagre de kombucha o de manzana</div>
        </td>
        <td style="width:52%; vertical-align:top;">
          <div class="recipe-col-label">Preparación</div>
          <div class="recipe-prep">Disuelve el miso en 3 cdas de agua templada (nunca hirviendo — protege los fermentos vivos). Mezcla con tahini. Sirve sobre la quinoa con el resto de ingredientes. Termina con vinagre de kombucha o de manzana y sésamo negro.</div>
        </td>
      </tr>
    </table>

    <div class="recipe-note-label">Nota Food·Mood</div>
    <div class="recipe-note">El miso fermentado contiene metabolitos del ácido láctico que, según la investigación actual, pueden asociarse con la producción de GABA en el intestino — el neurotransmisor de la calma. La señal viaja por el nervio vago. No es magia: es bioquímica con mucho umami.</div>
  </div>

  <!-- PULL QUOTE -->
  <div class="pullquote">
    <div class="pullquote-text">"Tu intestino habla. Tu cerebro escucha. La pregunta es qué le estás dando de comer."</div>
  </div>

  <!-- BIBLIOGRAPHY -->
  <div class="biblio-wrap">
    <div class="biblio-title">Referencias</div>
    <div class="biblio-item">Barrett, L.F. (2017). <em>How Emotions Are Made.</em> Houghton Mifflin Harcourt.</div>
    <div class="biblio-item">Damasio, A. (1994). <em>Descartes' Error.</em> Putnam Publishing.</div>
    <div class="biblio-item">Cryan, J.F. et al. (2019). The Microbiota-Gut-Brain Axis. <em>Physiological Reviews.</em></div>
    <div class="biblio-item">Plutchik, R. (2001). The Nature of Emotions. <em>American Scientist,</em> 89(4), 344–350.</div>
    <div class="biblio-item">Schachter, S. &amp; Singer, J.E. (1962). Cognitive, Social, and Physiological Determinants of Emotional State. <em>Psychological Review,</em> 69(5), 379–399.</div>
    <div class="biblio-item">Sonnenburg, J. &amp; Sonnenburg, E. (2015). <em>The Good Gut.</em> Penguin Press.</div>
  </div>

  <!-- CTA -->
  <div class="cta-wrap">
    <a href="https://www.food-mood.app" class="cta-btn">Descubre tu perfil de estado de ánimo en food-mood.app →</a>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-text">Food·Mood &middot; food-mood.app &middot; &copy; 2026</div>
  </div>

</div>
</body>
</html>`
}
