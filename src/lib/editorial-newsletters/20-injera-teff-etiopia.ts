export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — El pan que lleva 72 horas fermentando</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'Lato', Arial, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 680px; margin: 0 auto; background: #F5F0E8; }

  .header { background: #2d0f16; padding: 48px 44px 44px; }
  .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #6B2737; letter-spacing: .06em; display: inline-block; margin-bottom: 28px; }
  .header-numero { font-size: 10px; font-weight: 700; letter-spacing: .20em; text-transform: uppercase; color: #FF6B35; margin-bottom: 8px; }
  .header-tagline { font-size: 11px; font-weight: 300; letter-spacing: .08em; color: rgba(245,240,232,0.45); margin-bottom: 32px; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 34px; font-weight: 700; color: #F5F0E8; line-height: 1.18; margin-bottom: 0; }
  .header-title em { font-style: italic; color: #FF6B35; font-weight: 400; }

  .intro { padding: 36px 44px; border-bottom: 1px solid #e0d5c8; }
  .intro p { font-size: 15px; line-height: 1.80; color: #4a3a3e; font-weight: 300; margin-bottom: 16px; }
  .intro p:last-child { margin-bottom: 0; }

  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 18px; }

  /* TIMELINE */
  .timeline-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; background: #1e0b11; }
  .timeline-table { width: 100%; border-collapse: collapse; }
  .timeline-table td { padding: 16px 10px; vertical-align: top; border-right: 1px solid rgba(255,107,53,0.15); }
  .timeline-table td:last-child { border-right: none; }
  .timeline-hour { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #FF6B35; line-height: 1; margin-bottom: 8px; }
  .timeline-text { font-size: 11px; font-weight: 300; color: rgba(245,240,232,0.65); line-height: 1.60; }
  .timeline-note { margin-top: 16px; font-size: 11px; font-style: italic; color: rgba(255,107,53,0.60); line-height: 1.55; }
  .timeline-section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,107,53,0.55); margin-bottom: 18px; }

  /* COMPARATIVA TEFF/TRIGO */
  .comp-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .comp-table { width: 100%; border-collapse: collapse; }
  .comp-table thead tr { background: #2d0f16; }
  .comp-table thead th { padding: 10px 12px; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.55); text-align: left; }
  .comp-table tbody tr { background: #fff; border-bottom: 1px solid #ece5db; }
  .comp-table tbody tr:nth-child(even) { background: #faf7f2; }
  .comp-table tbody tr:last-child { border-bottom: none; }
  .comp-table tbody td { padding: 12px 12px; font-size: 13px; font-weight: 300; color: #4a3a3e; line-height: 1.50; vertical-align: middle; }
  .td-nutriente { font-weight: 700; color: #2a1a1e; }
  .td-valor-teff { color: #FF6B35; font-weight: 700; }
  .td-valor-trigo { color: #9e8080; }
  .comp-note { margin-top: 12px; font-size: 11px; font-style: italic; color: #9e8080; line-height: 1.55; }

  /* FERMENTOS AFRICA */
  .africa-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .africa-card { background: #2d0f16; padding: 20px 22px; margin-bottom: 0; }
  .africa-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #FF6B35; margin-bottom: 6px; line-height: 1.2; }
  .africa-origin { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,107,53,0.50); margin-bottom: 10px; }
  .africa-text { font-size: 12px; font-weight: 300; color: rgba(245,240,232,0.72); line-height: 1.65; }

  /* BLOQUES DE PUNTOS */
  .puntos-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .punto-item { margin-bottom: 28px; }
  .punto-item:last-child { margin-bottom: 0; }
  .punto-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #FF6B35; font-weight: 700; line-height: 1; margin-bottom: 6px; }
  .punto-text { font-size: 15px; font-weight: 300; color: #4a3a3e; line-height: 1.78; }
  .punto-text strong { color: #2a1a1e; font-weight: 700; }
  .punto-ref { font-size: 11px; font-style: italic; color: #9e8080; margin-top: 6px; display: block; }

  /* RECETA */
  .recipe-wrap { padding: 36px 44px; background: #2d0f16; }
  .recipe-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #FF6B35; margin-bottom: 6px; }
  .recipe-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #F5F0E8; line-height: 1.25; margin-bottom: 24px; }
  .recipe-col-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 10px; }
  .recipe-item { font-size: 14px; font-weight: 300; color: rgba(245,240,232,0.88); line-height: 1.65; margin-bottom: 6px; }
  .recipe-item:last-child { margin-bottom: 0; }
  .recipe-prep { font-size: 14px; font-weight: 300; color: rgba(245,240,232,0.80); line-height: 1.78; }
  .recipe-note-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 8px; }
  .recipe-note { font-size: 13px; font-style: italic; color: rgba(245,240,232,0.65); line-height: 1.70; }

  /* BIBLIO */
  .biblio-wrap { padding: 28px 44px; border-bottom: 1px solid #e0d5c8; background: #fafaf5; }
  .biblio-title { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 12px; }
  .biblio-item { font-size: 11px; font-weight: 300; color: #7a6a6e; line-height: 1.65; margin-bottom: 5px; }

  /* PULL QUOTE */
  .pullquote { background: #FF6B35; padding: 36px 44px; }
  .pullquote-text { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #2d0f16; line-height: 1.45; text-align: center; }

  /* CTA */
  .cta-wrap { padding: 36px 44px; text-align: center; border-bottom: 1px solid #e0d5c8; }
  .cta-btn { display: inline-block; background: #6B2737; color: #F5F0E8 !important; text-decoration: none; padding: 14px 32px; font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .06em; border-radius: 3px; }

  /* FOOTER */
  .footer { padding: 22px 44px; text-align: center; }
  .footer-text { font-size: 11px; font-weight: 300; color: #9e8080; }

  @media (max-width: 480px) {
    .wrapper { width: 100% !important; }
    .header { padding: 32px 24px 28px !important; }
    .header-title { font-size: 26px !important; }
    .intro, .timeline-wrap, .comp-wrap, .africa-wrap, .puntos-wrap,
    .recipe-wrap, .biblio-wrap, .pullquote, .cta-wrap, .footer {
      padding-left: 24px !important; padding-right: 24px !important;
    }
    .timeline-hour { font-size: 18px !important; }
  }
</style>
</head>
<body>
<div class="wrapper">

  <!-- HEADER -->
  <div class="header">
    <p class="logo-text">Food&middot;Mood</p>
    <p class="header-numero">N&ordm; 20</p>
    <p class="header-tagline">La app de body &amp; mind que estabas esperando.</p>
    <h1 class="header-title">
      El pan que lleva 72 horas fermentando.<br>
      <em>Etiopía lleva milenios comiendo para el cerebro sin saberlo.</em>
    </h1>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p>El injera no es solo el pan de Etiopía. Es una tecnología fermentativa de m&aacute;s de tres mil a&ntilde;os que transforma el teff &mdash;un cereal minúsculo e infrautilizado fuera del continente africano&mdash; en una de las fuentes más completas de fibra fermentable, hierro biodisponible y compuestos precursores de neurotransmisores que la cocina tradicional ha producido. La fermentación láctica que ocurre durante las 72 horas de reposo puede, según la investigación actual, aumentar la biodisponibilidad de minerales y generar metabolitos que el microbioma intestinal utiliza como sustrato.</p>
    <p>La ciencia de los psicobióticos &mdash;el estudio de cómo ciertos alimentos fermentados pueden influir en el eje intestino-cerebro&mdash; encuentra en el injera un caso de estudio fascinante. No porque sea un superalimento en el sentido marketiniano del término, sino porque ilustra algo que la investigación de Cryan, Dinan y otros neurocientíficos viene documentando: que las culturas que han fermentado sus alimentos durante generaciones pueden haber desarrollado, de forma intuitiva, prácticas que hoy la neurociencia empieza a comprender.</p>
  </div>

  <!-- GRÁFICO 1: TIMELINE 72H -->
  <div class="timeline-wrap">
    <p class="timeline-section-label">Gráfico 1 &mdash; El proceso de fermentaci&oacute;n del injera: 72 horas</p>
    <table class="timeline-table" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="25%">
          <p class="timeline-hour">0h</p>
          <p class="timeline-text">Mezcla de harina de teff + agua. Inicio de activaci&oacute;n microbiana espont&aacute;nea por levaduras y bacterias del entorno.</p>
        </td>
        <td width="25%">
          <p class="timeline-hour">12h</p>
          <p class="timeline-text">Primeras burbujas. Los lactobacilos empiezan a producir &aacute;cido l&aacute;ctico &mdash; el pH baja, el entorno se acidifica.</p>
        </td>
        <td width="25%">
          <p class="timeline-hour">36h</p>
          <p class="timeline-text">Fermentaci&oacute;n activa. Producci&oacute;n de CO&#8322; (esponjosidad), &aacute;cidos org&aacute;nicos y posibles precursores de GABA.</p>
        </td>
        <td width="25%">
          <p class="timeline-hour">72h</p>
          <p class="timeline-text">Masa lista. Cocci&oacute;n en plancha caliente (una cara). Los metabolitos de fermentaci&oacute;n quedan en la masa cocida.</p>
        </td>
      </tr>
    </table>
    <p class="timeline-note">La producci&oacute;n de GABA durante fermentaci&oacute;n l&aacute;ctica ha sido documentada en estudios in vitro y en algunos fermentos tradicionales. Su efecto tras digesti&oacute;n en humanos requiere m&aacute;s investigaci&oacute;n controlada. (Dhakal et al., 2012)</p>
  </div>

  <!-- GRÁFICO 2: TEFF VS TRIGO -->
  <div class="comp-wrap">
    <p class="section-label">Gr&aacute;fico 2 &mdash; Teff vs trigo integral: perfil comparado</p>
    <table class="comp-table" cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr>
          <th>Nutriente</th>
          <th>Teff (100g)</th>
          <th>Trigo integral (100g)</th>
          <th>Relevancia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td-nutriente">Prote&iacute;na</td>
          <td class="td-valor-teff">13 g</td>
          <td class="td-valor-trigo">13 g</td>
          <td>Comparable, con mejor perfil de amino&aacute;cidos en teff</td>
        </tr>
        <tr>
          <td class="td-nutriente">Hierro</td>
          <td class="td-valor-teff">7,6 mg</td>
          <td class="td-valor-trigo">3,6 mg</td>
          <td>El doble &mdash; especialmente relevante para mujeres</td>
        </tr>
        <tr>
          <td class="td-nutriente">Calcio</td>
          <td class="td-valor-teff">180 mg</td>
          <td class="td-valor-trigo">34 mg</td>
          <td>Cinco veces m&aacute;s &mdash; inusual en cereales</td>
        </tr>
        <tr>
          <td class="td-nutriente">Fibra total</td>
          <td class="td-valor-teff">8 g</td>
          <td class="td-valor-trigo">6,5 g</td>
          <td>Sustrato prebi&oacute;tico para microbiota</td>
        </tr>
        <tr>
          <td class="td-nutriente">IG estimado</td>
          <td class="td-valor-teff">57</td>
          <td class="td-valor-trigo">74</td>
          <td>Respuesta gluc&eacute;mica m&aacute;s estable</td>
        </tr>
      </tbody>
    </table>
    <p class="comp-note">Los valores nutricionales son aproximados y var&iacute;an seg&uacute;n variedad, cultivo y procesado. El &iacute;ndice gluc&eacute;mico es una medida contextual que depende tambi&eacute;n de la persona y el contexto de la comida.</p>
  </div>

  <!-- GRÁFICO 3: FERMENTOS AFRICA -->
  <div class="africa-wrap">
    <p class="section-label">Gr&aacute;fico 3 &mdash; Fermentos tradicionales de &Aacute;frica y su eje cerebral</p>
    <table width="100%" cellpadding="0" cellspacing="8" border="0">
      <tr>
        <td width="49%" valign="top" style="padding: 0 6px 10px 0;">
          <div class="africa-card">
            <p class="africa-name">Injera</p>
            <p class="africa-origin">Etiop&iacute;a / Eritrea</p>
            <p class="africa-text">Fermentaci&oacute;n de teff. Se asocia con producci&oacute;n de &aacute;cido l&aacute;ctico, precursores de GABA y alta biodisponibilidad de hierro.</p>
          </div>
        </td>
        <td width="49%" valign="top" style="padding: 0 0 10px 6px;">
          <div class="africa-card">
            <p class="africa-name">Ogi</p>
            <p class="africa-origin">Nigeria / Ghana</p>
            <p class="africa-text">Fermentaci&oacute;n de ma&iacute;z o mijo. Fuente de oligosac&aacute;ridos que pueden actuar como prebi&oacute;ticos para Bifidobacterium.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td width="49%" valign="top" style="padding: 6px 6px 0 0;">
          <div class="africa-card">
            <p class="africa-name">Dawadawa</p>
            <p class="africa-origin">&Aacute;frica Occidental</p>
            <p class="africa-text">Fermentaci&oacute;n de algarroba africana. Rica en amino&aacute;cidos libres incluyendo glutamato &mdash; precursor de GABA.</p>
          </div>
        </td>
        <td width="49%" valign="top" style="padding: 6px 0 0 6px;">
          <div class="africa-card">
            <p class="africa-name">Togwa</p>
            <p class="africa-origin">Tanzania</p>
            <p class="africa-text">Fermentaci&oacute;n de ma&iacute;z y mijo. La investigaci&oacute;n sugiere actividad probi&oacute;tica con cepas de Lactobacillus plantarum.</p>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- PUNTOS: POR QUÉ EL TEFF -->
  <div class="puntos-wrap">
    <p class="section-label">Por qu&eacute; el teff puede ser el cereal del estado de &aacute;nimo</p>
    <div class="punto-item">
      <p class="punto-num">1.</p>
      <p class="punto-text"><strong>Su hierro es diferente.</strong> El hierro del teff es de tipo no hemo pero con alta biodisponibilidad relativa, potenciada por la fermentaci&oacute;n. El d&eacute;ficit de hierro se asocia, seg&uacute;n la literatura cl&iacute;nica, con fatiga cognitiva, bajo estado de &aacute;nimo y dificultad de concentraci&oacute;n &mdash; especialmente en mujeres. <span class="punto-ref">(Haas &amp; Brownlie, 2001)</span></p>
    </div>
    <div class="punto-item">
      <p class="punto-num">2.</p>
      <p class="punto-text"><strong>Su fibra alimenta a las bacterias que producen calma.</strong> La fibra fermentable del teff puede servir como sustrato para bacterias productoras de butirato y &aacute;cido propi&oacute;nico &mdash; &aacute;cidos grasos de cadena corta cuya relaci&oacute;n con la funci&oacute;n neuronal e inmune es una de las m&aacute;s estudiadas en la ciencia del microbioma. <span class="punto-ref">(Sonnenburg &amp; B&auml;ckhed, 2016)</span></p>
    </div>
    <div class="punto-item">
      <p class="punto-num">3.</p>
      <p class="punto-text"><strong>La fermentaci&oacute;n hace el trabajo que el est&oacute;mago no puede.</strong> Durante las 72 horas de fermentaci&oacute;n, los fitatos &mdash;compuestos que bloquean la absorci&oacute;n de minerales&mdash; se reducen significativamente. Lo que comes no es solo lo que hay en el alimento: es lo que tu sistema puede extraer de &eacute;l. La fermentaci&oacute;n mejora esa extracci&oacute;n.</p>
    </div>
  </div>

  <!-- RECETA -->
  <div class="recipe-wrap">
    <p class="recipe-eyebrow">Receta Food&middot;Mood</p>
    <p class="recipe-title">Crepes de teff fermentado con tahini y miel cruda</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="45%" valign="top" style="padding-right: 24px;">
          <p class="recipe-col-label">Ingredientes (8&ndash;10 crepes)</p>
          <p class="recipe-item">&mdash; 200 g harina de teff integral</p>
          <p class="recipe-item">&mdash; 350 ml agua filtrada (temperatura ambiente)</p>
          <p class="recipe-item">&mdash; Pizca de sal marina</p>
          <p class="recipe-item">&mdash; Para servir: tahini, miel cruda, frutos rojos, semillas de s&eacute;samo</p>
        </td>
        <td width="55%" valign="top">
          <p class="recipe-col-label">Preparaci&oacute;n (proceso de 48h m&iacute;nimo)</p>
          <p class="recipe-prep"><strong style="color:#FF6B35;">D&iacute;a 1, noche.</strong> Mezcla harina de teff con agua y sal. Tapa con un pa&ntilde;o y deja fermentar a temperatura ambiente 48 horas &mdash; o 24h si hace calor. Ver&aacute;s burbujear: eso es la fermentaci&oacute;n activa.</p>
          <br>
          <p class="recipe-prep"><strong style="color:#FF6B35;">D&iacute;a 3.</strong> La masa debe tener olor ligeramente &aacute;cido y agradable. Cocina en sart&eacute;n antiadherente sin aceite, calor medio-alto, vuelta &uacute;nica (como un blini). Sirve con tahini, miel cruda y frutos rojos.</p>
        </td>
      </tr>
    </table>
    <div style="margin-top: 24px; border-top: 1px solid rgba(255,107,53,0.20); padding-top: 20px;">
      <p class="recipe-note-label">Nota Food&middot;Mood</p>
      <p class="recipe-note">La fermentaci&oacute;n espont&aacute;nea activa lactobacilos del entorno que pueden generar metabolitos de inter&eacute;s para el microbioma. El tahini aporta calcio y tript&oacute;fano. La miel cruda contiene oligosac&aacute;ridos con posible efecto prebi&oacute;tico. Un desayuno que viene de tres d&iacute;as de paciencia y sabe a algo que no hab&iacute;as probado antes.</p>
    </div>
  </div>

  <!-- BIBLIOGRAFÍA -->
  <div class="biblio-wrap">
    <p class="biblio-title">Referencias</p>
    <p class="biblio-item">Cryan, J.F. &amp; Dinan, T.G. (2012). Mind-altering microorganisms: the impact of the gut microbiota on brain and behaviour. <em>Nature Reviews Neuroscience</em>, 13, 701&ndash;712.</p>
    <p class="biblio-item">Dhakal, R. et al. (2012). Production of GABA by microorganisms: a review. <em>Biotechnology Letters</em>, 34(7), 1233&ndash;1242.</p>
    <p class="biblio-item">Haas, J.D. &amp; Brownlie, T. (2001). Iron deficiency and reduced work capacity. <em>Journal of Nutrition</em>, 131(2), 676S&ndash;690S.</p>
    <p class="biblio-item">Sonnenburg, J.L. &amp; B&auml;ckhed, F. (2016). Diet&ndash;microbiota interactions as moderators of human metabolism. <em>Nature</em>, 535, 56&ndash;64.</p>
    <p class="biblio-item">Tadesse, K. &amp; Westby, A. (2010). Fermentation of teff: microbiology and nutritional aspects. In: <em>Fermented Cereals</em>. FAO Agricultural Services Bulletin.</p>
  </div>

  <!-- PULL QUOTE -->
  <div class="pullquote">
    <p class="pullquote-text">&ldquo;Fermentar no es una tendencia.<br>Es la forma m&aacute;s antigua de cocinar para tu cerebro.&rdquo;</p>
  </div>

  <!-- CTA -->
  <div class="cta-wrap">
    <a href="https://www.food-mood.app" class="cta-btn">Descubre tu perfil de estado de &aacute;nimo en food-mood.app &rarr;</a>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p class="footer-text">Food&middot;Mood &middot; food-mood.app &middot; &copy; 2026</p>
  </div>

</div>
</body>
</html>`
}
