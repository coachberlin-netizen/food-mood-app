export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — No es lo que comes. Es lo que hace tu microbiota con lo que comes.</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'Lato', Arial, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 680px; margin: 0 auto; background: #F5F0E8; }
  .header { background: #2d0f16; padding: 48px 44px 44px; }
  .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #6B2737; letter-spacing: .06em; display: inline-block; margin-bottom: 28px; }
  .header-numero { font-size: 10px; font-weight: 700; letter-spacing: .20em; text-transform: uppercase; color: #FF6B35; margin-bottom: 8px; }
  .header-tagline { font-size: 11px; font-weight: 300; letter-spacing: .08em; color: rgba(245,240,232,0.45); margin-bottom: 32px; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 33px; font-weight: 700; color: #F5F0E8; line-height: 1.18; }
  .header-title em { font-style: italic; color: #FF6B35; font-weight: 400; }
  .intro { padding: 36px 44px; border-bottom: 1px solid #e0d5c8; }
  .intro p { font-size: 15px; line-height: 1.82; color: #4a3a3e; font-weight: 300; margin-bottom: 18px; }
  .intro p:last-child { margin-bottom: 0; }
  .intro strong { font-weight: 700; color: #2a1a1e; }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 18px; }
  .section-label-gold { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,107,53,0.65); margin-bottom: 14px; }
  .g1-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; background: #1a0a0f; }
  .g1-table { width: 100%; border-collapse: collapse; }
  .g1-table thead tr { background: #2d0f16; }
  .g1-table thead th { padding: 12px 10px; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; text-align: left; vertical-align: bottom; }
  .th-alimento { color: rgba(245,240,232,0.45); width: 18%; }
  .th-diversa  { color: #FF6B35; width: 28%; }
  .th-pobre    { color: rgba(255,107,53,0.55); width: 27%; }
  .th-disbio   { color: rgba(255,107,53,0.40); width: 27%; }
  .g1-table tbody tr { border-bottom: 1px solid rgba(255,107,53,0.10); }
  .g1-table tbody tr:last-child { border-bottom: none; }
  .g1-table tbody td { padding: 14px 10px; font-size: 11.5px; font-weight: 300; line-height: 1.62; vertical-align: top; }
  .td-ali  { color: #FF6B35; font-weight: 700; font-size: 12px; }
  .td-div  { color: rgba(245,240,232,0.85); }
  .td-pob  { color: rgba(245,240,232,0.55); }
  .td-dis  { color: rgba(245,240,232,0.40); font-style: italic; }
  .g1-note { margin-top: 18px; font-size: 10.5px; font-style: italic; color: rgba(255,107,53,0.45); line-height: 1.65; }
  .g2-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .flow-node { background: #fff; border: 1px solid #e0d5c8; border-radius: 8px; padding: 14px 18px; margin-bottom: 4px; }
  .flow-node-title { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 700; color: #2a1a1e; margin-bottom: 4px; }
  .flow-node-sub { font-size: 11.5px; font-weight: 300; color: #9e8080; line-height: 1.55; font-style: italic; }
  .flow-node-sub strong { font-style: normal; color: #FF6B35; font-weight: 700; }
  .flow-arrow { text-align: center; padding: 4px 0; font-size: 18px; color: #6B2737; font-weight: 700; line-height: 1; }
  .flow-metabolitos { background: #2d0f16; border-radius: 8px; padding: 14px 18px; margin-bottom: 4px; }
  .flow-metabolitos-title { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,107,53,0.6); margin-bottom: 8px; }
  .flow-metabolitos-items { font-size: 12.5px; font-weight: 300; color: #FF6B35; letter-spacing: .04em; line-height: 1.8; }
  .flow-source { margin-top: 16px; font-size: 10.5px; font-style: italic; color: rgba(107,39,55,0.50); line-height: 1.60; }
  .g3-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .factor-card { background: #2d0f16; border-radius: 10px; padding: 20px 22px; margin-bottom: 12px; }
  .factor-card:last-child { margin-bottom: 0; }
  .factor-num { font-size: 9px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,107,53,0.45); margin-bottom: 6px; }
  .factor-title { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; font-weight: 700; color: #FF6B35; margin-bottom: 10px; }
  .factor-body { font-size: 12.5px; font-weight: 300; line-height: 1.70; color: rgba(245,240,232,0.75); }
  .factor-cite { font-size: 11px; color: rgba(255,107,53,0.45); font-style: italic; margin-top: 7px; }
  .cambio-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .cambio-item { margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #ece5db; }
  .cambio-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .cambio-num { display: inline-block; width: 28px; height: 28px; background: #6B2737; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700; color: #F5F0E8; margin-bottom: 10px; }
  .cambio-titulo { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; color: #2a1a1e; margin-bottom: 10px; }
  .cambio-body { font-size: 14px; font-weight: 300; line-height: 1.80; color: #4a3a3e; }
  .receta-wrap { padding: 32px 44px; background: #2d0f16; }
  .receta-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,107,53,0.55); margin-bottom: 10px; }
  .receta-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #FF6B35; line-height: 1.25; margin-bottom: 20px; }
  .receta-subtitle { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.40); margin-bottom: 10px; margin-top: 18px; }
  .receta-list { list-style: none; padding: 0; }
  .receta-list li { font-size: 13px; font-weight: 300; color: rgba(245,240,232,0.80); line-height: 1.65; padding: 3px 0 3px 14px; position: relative; }
  .receta-list li::before { content: "—"; position: absolute; left: 0; color: rgba(255,107,53,0.50); }
  .receta-steps { font-size: 13.5px; font-weight: 300; line-height: 1.80; color: rgba(245,240,232,0.75); }
  .receta-nota { margin-top: 22px; padding: 18px 20px; border: 1px solid rgba(255,107,53,0.20); border-radius: 8px; }
  .receta-nota-label { font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,107,53,0.55); margin-bottom: 8px; }
  .receta-nota-body { font-size: 12.5px; font-weight: 300; line-height: 1.72; color: rgba(245,240,232,0.65); font-style: italic; }
  .biblio-wrap { padding: 28px 44px; border-bottom: 1px solid #e0d5c8; background: #faf7f2; }
  .biblio-title { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 14px; }
  .biblio-list { list-style: none; padding: 0; }
  .biblio-list li { font-size: 11.5px; font-weight: 300; color: #7a6a6e; line-height: 1.68; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #ece5db; }
  .biblio-list li:last-child { border-bottom: none; margin-bottom: 0; }
  .biblio-author { font-weight: 700; color: #4a3a3e; }
  .quote-wrap { padding: 40px 44px; background: #FF6B35; }
  .quote-text { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; color: #2d0f16; line-height: 1.30; text-align: center; }
  .quote-text em { font-style: italic; font-weight: 400; }
  .cta-wrap { padding: 36px 44px; text-align: center; border-bottom: 1px solid #e0d5c8; }
  .cta-btn { display: inline-block; background: #6B2737; color: #F5F0E8 !important; font-family: 'Lato', Arial, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .06em; text-decoration: none; padding: 14px 30px; border-radius: 40px; }
  .footer { padding: 24px 44px; text-align: center; }
  .footer p { font-size: 11px; font-weight: 300; color: #b0a0a4; }
  @media (max-width: 480px) {
    .wrapper { width: 100% !important; }
    .header { padding: 32px 24px 28px !important; }
    .header-title { font-size: 26px !important; }
    .intro, .g2-wrap, .g3-wrap, .cambio-wrap, .biblio-wrap, .quote-wrap, .cta-wrap, .footer { padding-left: 24px !important; padding-right: 24px !important; }
    .g1-wrap { padding: 24px 12px !important; }
    .g1-table thead th, .g1-table tbody td { padding: 8px 6px !important; font-size: 10.5px !important; }
    .receta-wrap { padding: 28px 24px !important; }
    .quote-text { font-size: 21px !important; }
  }
</style>
</head>
<body>
<div class="wrapper">

  <div class="header">
    <p class="logo-text">Food&middot;Mood</p>
    <p class="header-numero">N&ordm; 22</p>
    <p class="header-tagline">La app de body &amp; mind que estabas esperando.</p>
    <h1 class="header-title">
      No es lo que comes.<br>
      <em>Es lo que hace tu microbiota<br>con lo que comes.</em>
    </h1>
  </div>

  <div class="intro">
    <p>
      Esta es la tesis central de Food&middot;Mood &mdash; y tambi&eacute;n uno de los hallazgos
      m&aacute;s disruptivos de la nutrici&oacute;n contempor&aacute;nea. El mismo alimento puede
      producir respuestas metab&oacute;licas y emocionales completamente distintas en dos personas
      diferentes. Un estudio publicado en <em>Cell</em> por Zeevi et al. (2015) demostr&oacute;
      que la respuesta gluc&eacute;mica a alimentos id&eacute;nticos var&iacute;a enormemente entre
      individuos, y que el microbioma intestinal es uno de los principales predictores de esa
      variabilidad. El pl&aacute;tano no es simplemente &ldquo;un pl&aacute;tano&rdquo;: es un
      sustrato que tu microbiota transforma en metabolitos espec&iacute;ficos seg&uacute;n qui&eacute;n
      vive en tu intestino.
    </p>
    <p>
      La Cognici&oacute;n Encarnada &mdash; marco te&oacute;rico desarrollado por Francisco Varela,
      Evan Thompson y Eleanor Rosch &mdash; propone que la mente no procesa informaci&oacute;n de
      forma aislada del cuerpo: el estado corporal co-construye la experiencia cognitiva y emocional
      en tiempo real. Aplicado a la nutrici&oacute;n, esto significa que lo que comes no solo nutre
      c&eacute;lulas: modula el sustrato biol&oacute;gico sobre el que el cerebro construye, seg&uacute;n
      Barrett, cada emoci&oacute;n. No existe separaci&oacute;n entre alimentar el cuerpo y alimentar
      la mente. La pregunta relevante no es qu&eacute; comes, sino <strong>qu&eacute; hace tu ecosistema
      interno con ello.</strong>
    </p>
  </div>

  <div class="g1-wrap">
    <p class="section-label-gold">El mismo alimento &mdash; tres respuestas distintas</p>
    <table class="g1-table" cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr>
          <th class="th-alimento">Alimento</th>
          <th class="th-diversa">Microbiota diversa</th>
          <th class="th-pobre">Microbiota empobrecida</th>
          <th class="th-disbio">Microbiota disbi&oacute;tica</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td-ali">Pl&aacute;tano maduro</td>
          <td class="td-div">Butirato + precursores de serotonina; respuesta gluc&eacute;mica que puede resultar estable</td>
          <td class="td-pob">Glucosa r&aacute;pida + posible pico insul&iacute;nico; efecto fermentativo limitado</td>
          <td class="td-dis">Fermentaci&oacute;n excesiva, gas, malestar digestivo variable</td>
        </tr>
        <tr>
          <td class="td-ali">Yogur sin az&uacute;car</td>
          <td class="td-div">Posible refuerzo de Lactobacillus existentes; producci&oacute;n de GABA documentada en modelos animales</td>
          <td class="td-pob">Tr&aacute;nsito r&aacute;pido; efecto sobre microbioma probablemente limitado</td>
          <td class="td-dis">Puede generar competencia con bacterias oportunistas seg&uacute;n contexto</td>
        </tr>
        <tr>
          <td class="td-ali">Col fermentada</td>
          <td class="td-div">Diversificaci&oacute;n microbiana + butirato + vitamina K2; efecto sin&eacute;rgico documentado</td>
          <td class="td-pob">Aporte puntual de metabolitos; impacto en composici&oacute;n probablemente transitorio</td>
          <td class="td-dis">Variable &mdash; depende de qu&eacute; cepas predominan en el ecosistema</td>
        </tr>
      </tbody>
    </table>
    <p class="g1-note">
      Esta tabla ilustra tendencias observadas en investigaci&oacute;n, no efectos individuales predecibles.
      El microbioma es din&aacute;mico y contextual. (Sonnenburg &amp; B&auml;ckhed, 2016; Zmora et al., 2018)
    </p>
  </div>

  <div class="g2-wrap">
    <p class="section-label">El proceso de biotransformaci&oacute;n</p>

    <div class="flow-node">
      <div class="flow-node-title">Alimento</div>
      <div class="flow-node-sub">Lo que introduces. La materia prima del proceso.</div>
    </div>
    <div class="flow-arrow">&#8595;</div>
    <div class="flow-node">
      <div class="flow-node-title">Enzimas microbianas</div>
      <div class="flow-node-sub"><strong>M&aacute;s de 10 millones de genes microbianos</strong> procesan lo que tus 23.000 genes humanos no pueden metabolizar por s&iacute; solos.</div>
    </div>
    <div class="flow-arrow">&#8595;</div>
    <div class="flow-metabolitos">
      <div class="flow-metabolitos-title">Metabolitos producidos</div>
      <div class="flow-metabolitos-items">Butirato &nbsp;&middot;&nbsp; SCFA (Ac. grasos de cadena corta) &nbsp;&middot;&nbsp; GABA &nbsp;&middot;&nbsp; Precursores de serotonina &nbsp;&middot;&nbsp; Urolitinas</div>
    </div>
    <div class="flow-arrow">&#8595;</div>
    <div class="flow-node">
      <div class="flow-node-title">Receptores intestinales</div>
      <div class="flow-node-sub">El intestino concentra <strong>m&aacute;s receptores sensoriales</strong> que cualquier otro &oacute;rgano del cuerpo.</div>
    </div>
    <div class="flow-arrow">&#8595;</div>
    <div class="flow-node">
      <div class="flow-node-title">Nervio vago</div>
      <div class="flow-node-sub">El <strong>80% de las se&ntilde;ales</strong> viajan en direcci&oacute;n intestino &rarr; cerebro. La conversaci&oacute;n es mayoritariamente ascendente.</div>
    </div>
    <div class="flow-arrow">&#8595;</div>
    <div class="flow-node">
      <div class="flow-node-title">Cerebro</div>
      <div class="flow-node-sub">Estado de &aacute;nimo &nbsp;&middot;&nbsp; Foco &nbsp;&middot;&nbsp; Respuesta al estr&eacute;s &nbsp;&middot;&nbsp; Motivaci&oacute;n &nbsp;&middot;&nbsp; Calidad del sue&ntilde;o</div>
    </div>
    <p class="flow-source">Fuente: Cryan, J.F. et al. (2019). The Microbiota-Gut-Brain Axis. <em>Physiological Reviews</em>, 99(4), 1877&ndash;2013.</p>
  </div>

  <div class="g3-wrap">
    <p class="section-label">5 factores que cambian c&oacute;mo procesas los alimentos</p>

    <div class="factor-card">
      <div class="factor-num">Factor 01</div>
      <div class="factor-title">Estr&eacute;s cr&oacute;nico</div>
      <div class="factor-body">El cortisol sostenido puede alterar la permeabilidad intestinal y modificar la composici&oacute;n microbiana en cuesti&oacute;n de d&iacute;as. La evidencia sugiere una reducci&oacute;n de <em>Lactobacillus</em> y <em>Bifidobacterium</em> bajo estr&eacute;s prolongado, dos g&eacute;neros asociados a la producci&oacute;n de GABA y a la regulaci&oacute;n del eje HPA.</div>
      <div class="factor-cite">(Galley et al., 2014. BMC Microbiology)</div>
    </div>
    <div class="factor-card">
      <div class="factor-num">Factor 02</div>
      <div class="factor-title">Antibi&oacute;ticos</div>
      <div class="factor-body">Un ciclo de antibi&oacute;ticos de amplio espectro puede reducir la diversidad microbiana hasta un 30% en pocas semanas. La investigaci&oacute;n apunta a que la recuperaci&oacute;n completa puede tardar meses o no producirse si no se interviene con alimentaci&oacute;n espec&iacute;fica y exposici&oacute;n a alimentos fermentados.</div>
    </div>
    <div class="factor-card">
      <div class="factor-num">Factor 03</div>
      <div class="factor-title">Calidad del sue&ntilde;o</div>
      <div class="factor-body">Estudios en humanos asocian el sue&ntilde;o fragmentado &mdash; menos de 6 horas o de mala calidad &mdash; con alteraciones en la composici&oacute;n microbiana y mayor permeabilidad intestinal al d&iacute;a siguiente. La relaci&oacute;n es bidireccional: el microbioma tambi&eacute;n influye en los ritmos circadianos.</div>
      <div class="factor-cite">(Liang et al., 2015. Cell Host &amp; Microbe)</div>
    </div>
    <div class="factor-card">
      <div class="factor-num">Factor 04</div>
      <div class="factor-title">Diversidad vegetal</div>
      <div class="factor-body">El estudio APC Microbiome Ireland y otros sugieren que consumir m&aacute;s de 30 tipos diferentes de plantas a la semana se asocia con mayor diversidad microbiana. No 30 porciones: 30 tipos distintos. Las hierbas arom&aacute;ticas, las especias y las semillas tambi&eacute;n cuentan en ese recuento.</div>
    </div>
    <div class="factor-card">
      <div class="factor-num">Factor 05</div>
      <div class="factor-title">Fermentos regulares</div>
      <div class="factor-body">Sonnenburg et al. (2021, <em>Cell</em>) demostraron que una dieta alta en alimentos fermentados aument&oacute; la diversidad microbiana y redujo marcadores inflamatorios en 10 semanas, con mayor efecto que una dieta alta en fibra sola. El tipo de fermento importa menos que la regularidad de la exposici&oacute;n.</div>
    </div>
  </div>

  <div class="cambio-wrap">
    <p class="section-label">Qu&eacute; puede cambiar cuando alimentas a la microbiota correcta</p>

    <div class="cambio-item">
      <div class="cambio-num">1</div>
      <div class="cambio-titulo">La respuesta al estr&eacute;s puede modularse.</div>
      <div class="cambio-body">La investigaci&oacute;n en psicobi&oacute;ticos &mdash; t&eacute;rmino acu&ntilde;ado por Dinan, Stanton y Cryan en 2013 &mdash; sugiere que ciertas bacterias intestinales pueden influir en el eje HPA (hipot&aacute;lamo-hip&oacute;fisis-adrenal), que regula la respuesta al cortisol. No es un efecto inmediato ni garantizado, pero la evidencia apunta a que el microbioma es una palanca relevante en la resiliencia al estr&eacute;s sostenido.</div>
    </div>
    <div class="cambio-item">
      <div class="cambio-num">2</div>
      <div class="cambio-titulo">El estado de &aacute;nimo basal puede estabilizarse.</div>
      <div class="cambio-body">El 95% de la serotonina del cuerpo se produce en el intestino. Esta serotonina ent&eacute;rica no cruza la barrera hematoencef&aacute;lica directamente, pero puede influir en el cerebro a trav&eacute;s del nervio vago y otros mecanismos indirectos. La investigaci&oacute;n sugiere que un microbioma m&aacute;s diverso se asocia con menor incidencia de s&iacute;ntomas depresivos y ansiosos, aunque la causalidad en humanos sigue siendo objeto de estudio.</div>
    </div>
    <div class="cambio-item">
      <div class="cambio-num">3</div>
      <div class="cambio-titulo">La energ&iacute;a post-comida puede ser diferente.</div>
      <div class="cambio-body">La variabilidad gluc&eacute;mica &mdash; los picos y ca&iacute;das de glucosa tras comer &mdash; est&aacute; parcialmente mediada por el microbioma. Un intestino con mayor diversidad microbiana puede, seg&uacute;n Zeevi et al. (2015), procesar los mismos carbohidratos con una respuesta gluc&eacute;mica m&aacute;s estable. Lo que se traduce en energ&iacute;a m&aacute;s sostenida y menos fatiga post-prandial. El mismo plato, distinto efecto.</div>
    </div>
  </div>

  <div class="receta-wrap">
    <p class="receta-label">Receta de esta edici&oacute;n</p>
    <p class="receta-title">Bol de boniato asado,<br>k&eacute;fir y semillas de girasol</p>
    <p class="receta-subtitle">Ingredientes &mdash; 2 personas</p>
    <ul class="receta-list">
      <li>2 boniatos medianos</li>
      <li>150 g k&eacute;fir natural sin az&uacute;car</li>
      <li>2 cucharadas de semillas de girasol (activadas en remojo 8 horas)</li>
      <li>1 cucharada de tahini</li>
      <li>Ralladura de lim&oacute;n y su zumo</li>
      <li>C&uacute;rcuma, comino, pimienta negra</li>
      <li>Hojas verdes al gusto: r&uacute;cula, espinaca</li>
      <li>Sal marina</li>
    </ul>
    <p class="receta-subtitle">Preparaci&oacute;n</p>
    <p class="receta-steps">Asa los boniatos enteros a 200&thinsp;&deg;C durante 45 minutos, hasta que est&eacute;n tiernos por dentro y caramelizados por fuera. C&oacute;rtalos longitudinalmente y &aacute;brelos. Mezcla el k&eacute;fir con el tahini, el zumo de lim&oacute;n, la ralladura, la c&uacute;rcuma, el comino y una pizca de pimienta negra. Vierte sobre el boniato. A&ntilde;ade las semillas y las hojas verdes justo antes de servir.</p>
    <div class="receta-nota">
      <p class="receta-nota-label">Nota Food&middot;Mood</p>
      <p class="receta-nota-body">El boniato aporta fibra fermentable &mdash; alm&oacute;n resistente, especialmente cuando se enfr&iacute;a ligeramente &mdash; que puede actuar como sustrato preferido para bacterias productoras de butirato. El k&eacute;fir introduce microorganismos vivos documentados en la literatura psicobi&oacute;tica. La pimienta negra mejora la biodisponibilidad de la curcumina hasta un 2.000% seg&uacute;n estudios in vitro (Shoba et al., 1998). Un bol que trabaja en tres niveles a la vez.</p>
    </div>
  </div>

  <div class="biblio-wrap">
    <p class="biblio-title">Referencias</p>
    <ul class="biblio-list">
      <li><span class="biblio-author">Barrett, L.F.</span> (2017). <em>How Emotions Are Made.</em> Houghton Mifflin Harcourt.</li>
      <li><span class="biblio-author">Cryan, J.F. et al.</span> (2019). The Microbiota-Gut-Brain Axis. <em>Physiological Reviews</em>, 99(4), 1877&ndash;2013.</li>
      <li><span class="biblio-author">Damasio, A.</span> (1994). <em>Descartes&rsquo; Error.</em> Putnam Publishing.</li>
      <li><span class="biblio-author">Dinan, T.G. et al.</span> (2013). Psychobiotics: a novel class of psychotropic. <em>Biological Psychiatry</em>, 74(10), 720&ndash;726.</li>
      <li><span class="biblio-author">Galley, J.D. et al.</span> (2014). Exposure to a social stressor disrupts the community structure of the colonic mucosa-associated microbiota. <em>BMC Microbiology</em>, 14, 189.</li>
      <li><span class="biblio-author">Liang, X. et al.</span> (2015). Gut microbiota mediates circadian clock function. <em>Cell Host &amp; Microbe</em>, 17, 605&ndash;611.</li>
      <li><span class="biblio-author">Shoba, G. et al.</span> (1998). Influence of piperine on the pharmacokinetics of curcumin. <em>Planta Medica</em>, 64(4), 353&ndash;356.</li>
      <li><span class="biblio-author">Sonnenburg, E.D. et al.</span> (2021). Gut-microbiota-targeted diets modulate human immune status. <em>Cell</em>, 184(16), 4137&ndash;4153.</li>
      <li><span class="biblio-author">Varela, F., Thompson, E. &amp; Rosch, E.</span> (1991). <em>The Embodied Mind.</em> MIT Press.</li>
      <li><span class="biblio-author">Zeevi, D. et al.</span> (2015). Personalized nutrition by prediction of glycemic responses. <em>Cell</em>, 163(5), 1079&ndash;1094.</li>
      <li><span class="biblio-author">Zmora, N. et al.</span> (2018). Personalized gut mucosal colonization resistance to empiric probiotics. <em>Cell</em>, 174(6), 1388&ndash;1405.</li>
    </ul>
  </div>

  <div class="quote-wrap">
    <p class="quote-text">&ldquo;Tu microbiota es el chef.<br><em>T&uacute; solo eres el que compra los ingredientes.&rdquo;</em></p>
  </div>

  <div class="cta-wrap">
    <a href="https://food-mood.app" class="cta-btn">Descubre tu perfil de estado de &aacute;nimo en food-mood.app &rarr;</a>
  </div>

  <div class="footer">
    <p>Food&middot;Mood &nbsp;&middot;&nbsp; food-mood.app &nbsp;&middot;&nbsp; &copy; 2026</p>
  </div>

</div>
</body>
</html>`
}
