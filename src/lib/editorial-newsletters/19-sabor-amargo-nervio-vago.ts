export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Por qué el café amargo te calma</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'Lato', Arial, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 680px; margin: 0 auto; background: #F5F0E8; }

  .header { background: #2d0f16; padding: 48px 44px 44px; }
  .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #6B2737; letter-spacing: .06em; display: inline-block; margin-bottom: 28px; }
  .header-numero { font-size: 10px; font-weight: 700; letter-spacing: .20em; text-transform: uppercase; color: #C9A84C; margin-bottom: 8px; }
  .header-tagline { font-size: 11px; font-weight: 300; letter-spacing: .08em; color: rgba(245,240,232,0.45); margin-bottom: 32px; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 34px; font-weight: 700; color: #F5F0E8; line-height: 1.18; margin-bottom: 0; }
  .header-title em { font-style: italic; color: #C9A84C; font-weight: 400; }

  .intro { padding: 36px 44px; border-bottom: 1px solid #e0d5c8; }
  .intro p { font-size: 15px; line-height: 1.80; color: #4a3a3e; font-weight: 300; margin-bottom: 16px; }
  .intro p:last-child { margin-bottom: 0; }

  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 18px; }

  /* TAS2R TABLE */
  .tas2r-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .tas2r-table { width: 100%; border-collapse: collapse; }
  .tas2r-table thead tr { background: #2d0f16; }
  .tas2r-table thead th { padding: 10px 12px; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.50); text-align: left; }
  .tas2r-table tbody tr { background: #3d151f; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .tas2r-table tbody tr:last-child { border-bottom: none; }
  .tas2r-table tbody td { padding: 14px 12px; font-size: 13px; font-weight: 300; color: rgba(245,240,232,0.82); line-height: 1.50; vertical-align: top; }
  .td-zona { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: #C9A84C; white-space: nowrap; }
  .tas2r-note { margin-top: 12px; font-size: 11px; font-style: italic; color: #9e8080; line-height: 1.55; }

  /* 6 AMARGOS */
  .amargos-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .amargo-card { background: #2d0f16; padding: 18px 20px; }
  .amargo-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #C9A84C; margin-bottom: 8px; line-height: 1.2; }
  .amargo-text { font-size: 12px; font-weight: 300; color: rgba(245,240,232,0.72); line-height: 1.65; }

  /* NERVIO VAGO */
  .vago-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; background: #fafaf5; }
  .vago-num { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 700; color: #C9A84C; line-height: 1; margin-bottom: 8px; }
  .vago-text { font-size: 13px; font-weight: 300; color: #4a3a3e; line-height: 1.60; }
  .vago-note { margin-top: 16px; font-size: 11px; font-style: italic; color: #9e8080; line-height: 1.55; }

  /* REGULACIÓN */
  .reg-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .reg-item { margin-bottom: 24px; }
  .reg-item:last-child { margin-bottom: 0; }
  .reg-num { font-family: 'Playfair Display', serif; font-size: 22px; color: #C9A84C; font-weight: 700; line-height: 1; margin-bottom: 6px; }
  .reg-text { font-size: 15px; font-weight: 300; color: #4a3a3e; line-height: 1.78; }
  .reg-text strong { color: #2a1a1e; font-weight: 700; }

  /* RECETA */
  .recipe-wrap { padding: 36px 44px; background: #2d0f16; }
  .recipe-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #C9A84C; margin-bottom: 6px; }
  .recipe-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #F5F0E8; line-height: 1.25; margin-bottom: 24px; }
  .recipe-col-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 10px; }
  .recipe-item { font-size: 14px; font-weight: 300; color: rgba(245,240,232,0.88); line-height: 1.65; margin-bottom: 6px; }
  .recipe-prep { font-size: 14px; font-weight: 300; color: rgba(245,240,232,0.80); line-height: 1.78; }
  .recipe-note-label { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(245,240,232,0.45); margin-bottom: 8px; }
  .recipe-note { font-size: 13px; font-style: italic; color: rgba(245,240,232,0.65); line-height: 1.70; }

  /* BIBLIO */
  .biblio-wrap { padding: 28px 44px; border-bottom: 1px solid #e0d5c8; background: #fafaf5; }
  .biblio-title { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 12px; }
  .biblio-item { font-size: 11px; font-weight: 300; color: #7a6a6e; line-height: 1.65; margin-bottom: 5px; }

  /* PULL QUOTE */
  .pullquote { background: #C9A84C; padding: 36px 44px; }
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
    .intro, .tas2r-wrap, .amargos-wrap, .vago-wrap, .reg-wrap,
    .recipe-wrap, .biblio-wrap, .pullquote, .cta-wrap, .footer {
      padding-left: 24px !important; padding-right: 24px !important;
    }
    .vago-num { font-size: 38px !important; }
  }
</style>
</head>
<body>
<div class="wrapper">

  <!-- HEADER -->
  <div class="header">
    <p class="logo-text">Food&middot;Mood</p>
    <p class="header-numero">N&ordm; 19</p>
    <p class="header-tagline">La app de body &amp; mind que estabas esperando.</p>
    <h1 class="header-title">
      Por qu&eacute; el caf&eacute; amargo te calma.<br>
      <em>La ciencia detr&aacute;s del sabor que nadie quiere pero el cuerpo necesita.</em>
    </h1>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p>Hay un sabor que hemos aprendido a tolerar cuando &eacute;ramos peque&ntilde;os y que el cuerpo, con el tiempo, aprende a necesitar. Lo amargo no es un defecto evolutivo: la investigaci&oacute;n sugiere que los receptores TAS2R &mdash;presentes no solo en la lengua sino en el est&oacute;mago y el intestino&mdash; pueden activar el nervio vago cuando detectan compuestos amargos. La hip&oacute;tesis del marcador som&aacute;tico de Antonio Damasio apunta a que estas se&ntilde;ales corporales no son ruido: son datos que el cerebro usa para construir el estado emocional del momento.</p>
    <p>Seg&uacute;n la Teor&iacute;a de la Emoci&oacute;n Constru&iacute;da de Lisa Feldman Barrett, lo que sentimos despu&eacute;s de tomar un caf&eacute; o una infusi&oacute;n amarga no es una reacci&oacute;n autom&aacute;tica: es el cerebro interpretando se&ntilde;ales viscerales y etiquet&aacute;ndolas como &ldquo;calma&rdquo;, &ldquo;claridad&rdquo; o &ldquo;activaci&oacute;n&rdquo;, seg&uacute;n el contexto. El sabor amargo, en ese sentido, puede ser una palanca sensorial de regulaci&oacute;n emocional. No por magia, sino por bioqu&iacute;mica aprendida.</p>
  </div>

  <!-- GRÁFICO 1 — TAS2R -->
  <div class="tas2r-wrap">
    <p class="section-label">Gr&aacute;fico 1 &mdash; Mapa de receptores TAS2R: d&oacute;nde act&uacute;a lo amargo</p>
    <table class="tas2r-table">
      <thead>
        <tr>
          <th>Zona</th>
          <th>Qu&eacute; detecta</th>
          <th>Efecto asociado seg&uacute;n investigaci&oacute;n</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td-zona">Boca</td>
          <td>Compuestos amargos (polifenoles, alcaloides)</td>
          <td>Se&ntilde;al al nervio vago, inicio de secreci&oacute;n digestiva</td>
        </tr>
        <tr>
          <td class="td-zona">Est&oacute;mago</td>
          <td>Flavonoides, &aacute;cidos org&aacute;nicos</td>
          <td>Puede ralentizar el vaciado g&aacute;strico, modulando la saciedad</td>
        </tr>
        <tr>
          <td class="td-zona">Intestino</td>
          <td>Metabolitos de fermentaci&oacute;n</td>
          <td>Se asocia con liberaci&oacute;n de GLP-1 y p&eacute;ptidos de saciedad</td>
        </tr>
      </tbody>
    </table>
    <p class="tas2r-note">La activaci&oacute;n de receptores TAS2R extraorales es un &aacute;rea de investigaci&oacute;n activa. Los efectos descritos corresponden a hallazgos en estudios preclínicos y algunos ensayos en humanos; no implican efecto terap&eacute;utico garantizado. (Steinert et al., 2011; Behrens &amp; Meyerhof, 2011)</p>
  </div>

  <!-- GRÁFICO 2 — 6 AMARGOS -->
  <div class="amargos-wrap">
    <p class="section-label">Gr&aacute;fico 2 &mdash; 6 amargos que pueden apoyar tu sistema nervioso</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="49%" valign="top" style="padding: 0 6px 10px 0;">
          <div class="amargo-card">
            <p class="amargo-name">Caf&eacute;</p>
            <p class="amargo-text">&Aacute;cido clorog&eacute;nico: se asocia con activaci&oacute;n vagal y mejora del foco a corto plazo.</p>
          </div>
        </td>
        <td width="2%" style="padding: 0;"></td>
        <td width="49%" valign="top" style="padding: 0 0 10px 6px;">
          <div class="amargo-card">
            <p class="amargo-name">R&uacute;cula</p>
            <p class="amargo-text">Glucosinolatos: pueden favorecer diversidad microbiana y producci&oacute;n de metabolitos antiinflamatorios.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td valign="top" style="padding: 0 6px 10px 0;">
          <div class="amargo-card">
            <p class="amargo-name">C&uacute;rcuma</p>
            <p class="amargo-text">Curcumina: la evidencia sugiere propiedades antioxidantes y modulaci&oacute;n de la microbiota.</p>
          </div>
        </td>
        <td style="padding: 0;"></td>
        <td valign="top" style="padding: 0 0 10px 6px;">
          <div class="amargo-card">
            <p class="amargo-name">Vinagre de kombucha o de manzana</p>
            <p class="amargo-text">&Aacute;cido ac&eacute;tico: puede mejorar la respuesta gluc&eacute;mica y asociarse con mayor saciedad postprandial.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td valign="top" style="padding: 0 6px 0 0;">
          <div class="amargo-card">
            <p class="amargo-name">Achicoria</p>
            <p class="amargo-text">Inulina (fibra prebi&oacute;tica): sustrato para bacterias productoras de butirato, relacionado con el eje intestino-cerebro.</p>
          </div>
        </td>
        <td style="padding: 0;"></td>
        <td valign="top" style="padding: 0 0 0 6px;">
          <div class="amargo-card">
            <p class="amargo-name">Jengibre</p>
            <p class="amargo-text">Gingeroles: se asocian con reducci&oacute;n de n&aacute;useas y posible modulaci&oacute;n de la se&ntilde;alizaci&oacute;n vagal.</p>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- GRÁFICO 3 — NERVIO VAGO EN DATOS -->
  <div class="vago-wrap">
    <p class="section-label">Gr&aacute;fico 3 &mdash; El nervio vago en datos</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" valign="top" style="padding-right: 20px;">
          <p class="vago-num">80%</p>
          <p class="vago-text">De las se&ntilde;ales del nervio vago van del intestino al cerebro, no al rev&eacute;s (Cryan et al., 2019).</p>
        </td>
        <td width="33%" valign="top" style="padding: 0 10px;">
          <p class="vago-num">500M</p>
          <p class="vago-text">Neuronas en el sistema nervioso ent&eacute;rico &mdash; m&aacute;s que en la m&eacute;dula espinal.</p>
        </td>
        <td width="34%" valign="top" style="padding-left: 20px;">
          <p class="vago-num">0,1s</p>
          <p class="vago-text">Velocidad aproximada de transmisi&oacute;n vagal: el cuerpo informa al cerebro antes de que seas consciente de ello.</p>
        </td>
      </tr>
    </table>
    <p class="vago-note">Estos datos provienen de investigaci&oacute;n en neurociencia b&aacute;sica. La extrapolaci&oacute;n directa al comportamiento emocional humano requiere m&aacute;s estudios controlados.</p>
  </div>

  <!-- REGULACIÓN EMOCIONAL -->
  <div class="reg-wrap">
    <p class="section-label">Por qu&eacute; la amargura es regulaci&oacute;n emocional</p>
    <div class="reg-item">
      <p class="reg-num">01</p>
      <p class="reg-text"><strong>Lo amargo activa antes de que pienses.</strong> La Hip&oacute;tesis del Marcador Som&aacute;tico (Damasio, 1994) propone que las se&ntilde;ales corporales preceden y orientan la cognici&oacute;n. El sabor amargo puede generar marcadores som&aacute;ticos de &ldquo;alerta beneficiosa&rdquo; que el cerebro asocia, con el tiempo, con claridad y calma.</p>
    </div>
    <div class="reg-item">
      <p class="reg-num">02</p>
      <p class="reg-text"><strong>El contexto construye la emoci&oacute;n.</strong> Seg&uacute;n Barrett (2017), la misma activaci&oacute;n fisiol&oacute;gica puede etiquetarse como ansiedad o como concentraci&oacute;n seg&uacute;n el contexto. Tomar algo amargo en un ritual consciente &mdash;sin prisas, con presencia&mdash; puede influir en c&oacute;mo el cerebro etiqueta esa activaci&oacute;n.</p>
    </div>
    <div class="reg-item">
      <p class="reg-num">03</p>
      <p class="reg-text"><strong>Las culturas longevas lo supieron antes que la ciencia.</strong> El uso de amargos antes de comer &mdash;bitter aperitifs, infusiones digestivas, encurtidos&mdash; es transversal a las culturas mediterr&aacute;neas, asi&aacute;ticas y centroeuropeas. La etnobot&aacute;nica documenta este uso milenario; la ciencia est&aacute; empezando a entender por qu&eacute; funciona.</p>
    </div>
  </div>

  <!-- RECETA -->
  <div class="recipe-wrap">
    <p class="recipe-eyebrow">Receta de la semana</p>
    <p class="recipe-title">Ensalada de r&uacute;cula con vinagre de kombucha o de manzana y nueces</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="46%" valign="top" style="padding-right: 24px;">
          <p class="recipe-col-label">Ingredientes (2 personas)</p>
          <p class="recipe-item">&mdash; 80g r&uacute;cula fresca</p>
          <p class="recipe-item">&mdash; 1 cda vinagre de kombucha o de manzana</p>
          <p class="recipe-item">&mdash; 2 cdas aceite de oliva virgen extra</p>
          <p class="recipe-item">&mdash; 30g nueces activadas (en remojo 8h)</p>
          <p class="recipe-item">&mdash; Parmesano en lascas (opcional)</p>
          <p class="recipe-item">&mdash; Sal marina, pimienta negra reci&eacute;n molida</p>
          <p class="recipe-item">&mdash; Ralladura de lim&oacute;n</p>
        </td>
        <td width="8%" style="padding: 0;"></td>
        <td width="46%" valign="top">
          <p class="recipe-col-label">Preparaci&oacute;n</p>
          <p class="recipe-prep">Mezcla el vinagre de kombucha o de manzana con el aceite y la ralladura de lim&oacute;n. Ali&ntilde;a la r&uacute;cula. A&ntilde;ade las nueces y el parmesano. Come despacio &mdash; la masticaci&oacute;n lenta puede potenciar la se&ntilde;alizaci&oacute;n vagal.</p>
        </td>
      </tr>
    </table>
    <div style="border-top: 1px solid rgba(245,240,232,0.12); margin-top: 22px; padding-top: 18px;">
      <p class="recipe-note-label">Nota Food&middot;Mood</p>
      <p class="recipe-note">La r&uacute;cula aporta glucosinolatos amargos que activan receptores TAS2R. El vinagre de kombucha o de manzana a&ntilde;ade &aacute;cido ac&eacute;tico y metabolitos de fermentaci&oacute;n. Las nueces son fuente de ALA (precursor de omega-3), cuya relaci&oacute;n con la funci&oacute;n neuronal es una de las m&aacute;s documentadas en psiconutrici&oacute;n (Gomez-Pinilla, 2008). Un plato sencillo con una conversaci&oacute;n interna muy compleja.</p>
    </div>
  </div>

  <!-- BIBLIOGRAFÍA -->
  <div class="biblio-wrap">
    <p class="biblio-title">Referencias</p>
    <p class="biblio-item">Barrett, L.F. (2017). <em>How Emotions Are Made.</em> Houghton Mifflin Harcourt.</p>
    <p class="biblio-item">Behrens, M. &amp; Meyerhof, W. (2011). Gustatory and extragustatory functions of mammalian taste receptors. <em>Physiology &amp; Behavior,</em> 105(1), 4&ndash;13.</p>
    <p class="biblio-item">Cryan, J.F. et al. (2019). The Microbiota-Gut-Brain Axis. <em>Physiological Reviews,</em> 99(4), 1877&ndash;2013.</p>
    <p class="biblio-item">Damasio, A. (1994). <em>Descartes&rsquo; Error.</em> Putnam Publishing.</p>
    <p class="biblio-item">Gomez-Pinilla, F. (2008). Brain foods: the effects of nutrients on brain function. <em>Nature Reviews Neuroscience,</em> 9, 568&ndash;578.</p>
    <p class="biblio-item">Steinert, R.E. et al. (2011). Gut taste receptors and the gut-brain interaction. <em>Journal of Agricultural and Food Chemistry,</em> 59(10), 5122&ndash;5131.</p>
  </div>

  <!-- PULL QUOTE -->
  <div class="pullquote">
    <p class="pullquote-text">&ldquo;Lo amargo no es el enemigo.<br>Es la se&ntilde;al m&aacute;s antigua que tiene tu cuerpo<br>para decirle al cerebro: estamos bien.&rdquo;</p>
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
