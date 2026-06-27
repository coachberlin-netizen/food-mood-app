export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food&middot;Mood &mdash; Tu ansiedad tiene 38 billones de c&oacute;mplices. Se llaman bacterias intestinales.</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'Lato', Arial, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 680px; margin: 0 auto; background: #F5F0E8; }
  .header { background: #2d0f16; padding: 48px 44px 44px; }
  .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: rgba(245,240,232,0.85); letter-spacing: .06em; display: inline-block; margin-bottom: 28px; }
  .header-numero { font-size: 10px; font-weight: 700; letter-spacing: .20em; text-transform: uppercase; color: #FF6B35; margin-bottom: 8px; }
  .header-tagline { font-size: 11px; font-weight: 300; letter-spacing: .08em; color: rgba(245,240,232,0.58); margin-bottom: 32px; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #F5F0E8; line-height: 1.20; }
  .header-title em { font-style: italic; color: #FF6B35; font-weight: 400; }
  .intro { padding: 36px 44px; border-bottom: 1px solid #e0d5c8; }
  .intro p { font-size: 15px; line-height: 1.82; color: #4a3a3e; font-weight: 300; margin-bottom: 18px; }
  .intro p:last-child { margin-bottom: 0; }
  .intro strong { font-weight: 700; color: #2a1a1e; }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 18px; }
  .section-label-gold { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,107,53,0.65); margin-bottom: 14px; }
  .g1-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; background: #18090e; }
  .g1-col-table { width: 100%; border-collapse: collapse; }
  .g1-col-calma { width: 50%; vertical-align: top; padding-right: 10px; }
  .g1-col-infla  { width: 50%; vertical-align: top; padding-left: 10px; }
  .g1-col-head-calma { background: #1a2e1a; border-radius: 6px 6px 0 0; padding: 10px 14px; }
  .g1-col-head-infla  { background: #2e1a1a; border-radius: 6px 6px 0 0; padding: 10px 14px; }
  .g1-col-head-title { font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
  .g1-col-head-title-calma { color: #7aba7a; }
  .g1-col-head-title-infla  { color: #c07070; }
  .g1-col-head-sub { font-size: 9px; font-weight: 300; color: rgba(245,240,232,0.35); margin-top: 2px; }
  .g1-bacteria-block { border-bottom: 1px solid rgba(255,107,53,0.10); padding: 14px 14px 14px; }
  .g1-bacteria-block:last-child { border-bottom: none; }
  .g1-bacteria-name { color: #FF6B35; font-weight: 700; font-size: 12px; margin-bottom: 6px; font-style: italic; }
  .g1-bacteria-body { font-size: 11px; font-weight: 300; line-height: 1.60; color: rgba(245,240,232,0.70); }
  .g1-bacteria-cite { font-size: 10px; color: rgba(255,107,53,0.45); font-style: italic; margin-top: 5px; }
  .g1-note { margin-top: 16px; font-size: 10.5px; font-style: italic; color: rgba(255,107,53,0.40); line-height: 1.65; }
  .g2-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .cycle-table { width: 100%; border-collapse: collapse; }
  .cycle-node { background: #2d0f16; border-radius: 8px; padding: 12px 16px; }
  .cycle-node-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,107,53,0.50); margin-bottom: 4px; }
  .cycle-node-text { font-size: 12.5px; font-weight: 300; line-height: 1.55; color: rgba(245,240,232,0.82); }
  .cycle-node-text strong { color: #FF6B35; font-weight: 700; }
  .cycle-arrow-td { text-align: center; padding: 5px 0; font-size: 16px; color: #6B2737; font-weight: 900; line-height: 1; }
  .cycle-close { margin-top: 16px; padding: 12px 16px; border: 1px dashed rgba(107,39,55,0.30); border-radius: 8px; text-align: center; }
  .cycle-close-text { font-size: 11px; font-style: italic; color: rgba(107,39,55,0.55); }
  .cycle-note { margin-top: 14px; font-size: 10.5px; font-style: italic; color: rgba(107,39,55,0.50); line-height: 1.65; }
  .g3-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .destroy-card { background: #2d0f16; border-radius: 10px; padding: 18px 20px; margin-bottom: 10px; }
  .destroy-card:last-child { margin-bottom: 0; }
  .destroy-title { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; color: #FF6B35; margin-bottom: 8px; }
  .destroy-body { font-size: 12.5px; font-weight: 300; line-height: 1.68; color: rgba(245,240,232,0.72); }
  .g4-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .restore-card { background: #fff; border: 1px solid #e0d5c8; border-left: 3px solid #6B2737; border-radius: 0 8px 8px 0; padding: 16px 18px; margin-bottom: 10px; }
  .restore-card:last-child { margin-bottom: 0; }
  .restore-title { font-size: 13px; font-weight: 700; color: #6B2737; margin-bottom: 6px; }
  .restore-body { font-size: 12.5px; font-weight: 300; line-height: 1.68; color: #4a3a3e; }
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
  .quote-text { font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #2d0f16; line-height: 1.38; text-align: center; }
  .quote-text em { font-style: italic; font-weight: 400; }
  .cta-wrap { padding: 36px 44px; text-align: center; border-bottom: 1px solid #e0d5c8; }
  .cta-body { font-size: 13.5px; font-weight: 300; color: #7a6a6e; line-height: 1.70; margin-bottom: 22px; }
  .cta-btn { display: inline-block; background: #6B2737; color: #F5F0E8 !important; font-family: 'Lato', Arial, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .06em; text-decoration: none; padding: 14px 30px; border-radius: 40px; }
  .footer { padding: 24px 44px; text-align: center; }
  .footer p { font-size: 11px; font-weight: 300; color: #b0a0a4; }
  @media (max-width: 600px) {
    .header { padding: 32px 22px 28px; }
    .header-title { font-size: 25px; }
    .intro, .g2-wrap, .g3-wrap, .g4-wrap, .biblio-wrap, .quote-wrap, .cta-wrap, .footer { padding-left: 22px; padding-right: 22px; }
    .g1-wrap { padding: 24px 16px; }
    .g1-col-calma, .g1-col-infla { display: block; width: 100%; padding: 0; margin-bottom: 12px; }
    .receta-wrap { padding: 28px 22px; }
    .quote-text { font-size: 20px; }
  }
</style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EDE8DF;">
  <tr>
    <td align="center" style="padding: 24px 12px;">
      <table class="wrapper" width="680" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:#F5F0E8;">

        <tr>
          <td class="header">
            <p class="logo-text">Food&middot;Mood</p>
            <p class="header-numero">N&ordm; 24</p>
            <p class="header-tagline">La app de body &amp; mind que estabas esperando.</p>
            <h1 class="header-title">
              Tu ansiedad tiene 38 billones de c&oacute;mplices.<br>
              <em>Se llaman bacterias intestinales.</em>
            </h1>
          </td>
        </tr>

        <tr>
          <td class="intro">
            <p>
              El n&uacute;mero de microorganismos que habitan el intestino humano supera al de
              c&eacute;lulas del propio cuerpo. Esta comunidad &mdash; bacterias, hongos, virus,
              arqueas &mdash; forma un ecosistema din&aacute;mico cuya relaci&oacute;n con el cerebro
              es bidireccional, constante y mucho m&aacute;s concreta de lo que se pensaba hace una
              d&eacute;cada. La investigaci&oacute;n en psicobi&oacute;ticos, t&eacute;rmino acu&ntilde;ado
              por Dinan, Stanton y Cryan en 2013, propone que ciertas bacterias intestinales pueden
              influir en el comportamiento, el estado de &aacute;nimo y la respuesta al estr&eacute;s
              a trav&eacute;s de m&uacute;ltiples v&iacute;as: el nervio vago, la producci&oacute;n de
              neurotransmisores y la modulaci&oacute;n del sistema inmune. La ansiedad, en este marco,
              <strong>no es solo un fen&oacute;meno cerebral.</strong>
            </p>
            <p>
              La Hip&oacute;tesis del Marcador Som&aacute;tico de Damasio y la Teor&iacute;a de la
              Emoci&oacute;n Constru&iacute;da de Barrett convergen aqu&iacute; en un punto relevante:
              si las emociones se construyen usando se&ntilde;ales corporales como sustrato, entonces
              el estado del microbioma &mdash; que influye en la inflamaci&oacute;n, la producci&oacute;n
              de serotonina y la se&ntilde;alizaci&oacute;n vagal &mdash; participa activamente en
              qu&eacute; emociones construye el cerebro y con qu&eacute; intensidad. La disbiosis
              intestinal no causa ansiedad directamente, pero la evidencia sugiere que puede crear un
              <strong>contexto biol&oacute;gico en el que la ansiedad se construye con m&aacute;s
              facilidad.</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td class="g1-wrap">
            <p class="section-label-gold">Bacterias que pueden calmar vs. bacterias que pueden inflamar</p>
            <table class="g1-col-table" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="g1-col-calma">
                  <div class="g1-col-head-calma">
                    <div class="g1-col-head-title g1-col-head-title-calma">Asociadas con calma</div>
                    <div class="g1-col-head-sub">seg&uacute;n investigaci&oacute;n actual</div>
                  </div>
                  <div class="g1-bacteria-block">
                    <div class="g1-bacteria-name">Lactobacillus rhamnosus</div>
                    <div class="g1-bacteria-body">Puede aumentar receptores GABA-A en hipocampo y corteza seg&uacute;n estudios en modelos animales. Se asocia con reducci&oacute;n de conductas ansiosas en entornos controlados.</div>
                    <div class="g1-bacteria-cite">(Bravo et al., 2011. PNAS)</div>
                  </div>
                  <div class="g1-bacteria-block">
                    <div class="g1-bacteria-name">Bifidobacterium longum</div>
                    <div class="g1-bacteria-body">Se asocia con reducci&oacute;n de biomarcadores de ansiedad en estudios en humanos con SII. La investigaci&oacute;n apunta a modulaci&oacute;n de la actividad del nervio vago.</div>
                    <div class="g1-bacteria-cite">(Pinto-Sanchez et al., 2017)</div>
                  </div>
                  <div class="g1-bacteria-block">
                    <div class="g1-bacteria-name">Faecalibacterium prausnitzii</div>
                    <div class="g1-bacteria-body">Principal productor de butirato intestinal. Niveles bajos se asocian con enfermedad inflamatoria intestinal y estado de &aacute;nimo m&aacute;s vulnerable.</div>
                  </div>
                </td>
                <td class="g1-col-infla">
                  <div class="g1-col-head-infla">
                    <div class="g1-col-head-title g1-col-head-title-infla">Asociadas con inflamaci&oacute;n</div>
                    <div class="g1-col-head-sub">en exceso o contexto disbi&oacute;tico</div>
                  </div>
                  <div class="g1-bacteria-block">
                    <div class="g1-bacteria-name">Proteobacteria en predominancia</div>
                    <div class="g1-bacteria-body">Se asocian con permeabilidad intestinal elevada y activaci&oacute;n del sistema inmune innato. Su presencia excesiva puede indicar desequilibrio del ecosistema.</div>
                  </div>
                  <div class="g1-bacteria-block">
                    <div class="g1-bacteria-name">Clostridium difficile</div>
                    <div class="g1-bacteria-body">Producci&oacute;n de toxinas que pueden afectar la se&ntilde;alizaci&oacute;n intestinal y el nervio vago. Su proliferaci&oacute;n es frecuente tras antibioterapia.</div>
                  </div>
                  <div class="g1-bacteria-block">
                    <div class="g1-bacteria-name">Enterobacteriaceae en exceso</div>
                    <div class="g1-bacteria-body">El LPS bacteriano puede cruzar la barrera intestinal y activar neuroinflamaci&oacute;n sist&eacute;mica. Se asocia con mayor reactividad emocional y fatiga cognitiva persistente.</div>
                  </div>
                </td>
              </tr>
            </table>
            <p class="g1-note">La investigaci&oacute;n en psicobi&oacute;ticos en humanos es prometedora pero a&uacute;n limitada en tama&ntilde;o muestral. La mayor&iacute;a de estudios mec&aacute;nicos son en modelos animales. (Cryan et al., 2019)</p>
          </td>
        </tr>

        <tr>
          <td class="g2-wrap">
            <p class="section-label">El ciclo microbioma&ndash;ansiedad</p>
            <table class="cycle-table" cellpadding="0" cellspacing="0" border="0">
              <tr><td><div class="cycle-node"><div class="cycle-node-label">Punto de entrada</div><div class="cycle-node-text"><strong>Disbiosis intestinal</strong> &mdash; desequilibrio en la composici&oacute;n o diversidad microbiana</div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8595;</td></tr>
              <tr><td><div class="cycle-node"><div class="cycle-node-text">Permeabilidad intestinal aumentada &mdash; la barrera se vuelve menos selectiva</div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8595;</td></tr>
              <tr><td><div class="cycle-node"><div class="cycle-node-text">LPS bacteriano en circulaci&oacute;n &mdash; fragmentos de pared bacteriana en sangre</div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8595;</td></tr>
              <tr><td><div class="cycle-node"><div class="cycle-node-text">Activaci&oacute;n microglial &mdash; <strong>neuroinflamaci&oacute;n</strong> que puede alterar la funci&oacute;n prefrontal</div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8595;</td></tr>
              <tr><td><div class="cycle-node"><div class="cycle-node-text">Reducci&oacute;n de BDNF + alteraci&oacute;n en disponibilidad de serotonina</div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8595;</td></tr>
              <tr><td><div class="cycle-node"><div class="cycle-node-text">Mayor reactividad emocional + <strong>ansiedad con umbral m&aacute;s bajo</strong></div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8595;</td></tr>
              <tr><td><div class="cycle-node"><div class="cycle-node-text">Cortisol elevado sostenido &mdash; que a su vez altera la motilidad y composici&oacute;n microbiana</div></div></td></tr>
              <tr><td class="cycle-arrow-td">&#8635;</td></tr>
              <tr><td><div class="cycle-close"><div class="cycle-close-text">El ciclo se retroalimenta &mdash; el estr&eacute;s perpet&uacute;a la disbiosis que amplifica el estr&eacute;s</div></div></td></tr>
            </table>
            <p class="cycle-note">Este ciclo no es inevitable ni irreversible. La evidencia sugiere que intervenciones diet&eacute;ticas sostenidas pueden interrumpirlo en m&uacute;ltiples puntos. (Dinan &amp; Cryan, 2017)</p>
          </td>
        </tr>

        <tr>
          <td class="g3-wrap">
            <p class="section-label">Lo que puede destruir el microbioma en 48&ndash;72&thinsp;h</p>
            <div class="destroy-card">
              <div class="destroy-title">Antibi&oacute;ticos de amplio espectro</div>
              <div class="destroy-body">Pueden reducir la diversidad microbiana hasta un 30% en pocos d&iacute;as. Algunas especies pueden no recuperarse sin intervenci&oacute;n activa a trav&eacute;s de la alimentaci&oacute;n. El efecto es especialmente marcado en g&eacute;neros como <em>Lactobacillus</em> y <em>Bifidobacterium</em>. (Dethlefsen &amp; Relman, 2011)</div>
            </div>
            <div class="destroy-card">
              <div class="destroy-title">Az&uacute;car refinado en exceso</div>
              <div class="destroy-body">Puede favorecer el crecimiento de <em>Candida</em> y bacterias oportunistas a expensas de bacterias productoras de butirato. El efecto es observable en 48 horas seg&uacute;n estudios de dieta controlada en humanos. La glucosa libre alimenta preferentemente a especies menos beneficiosas.</div>
            </div>
            <div class="destroy-card">
              <div class="destroy-title">Estr&eacute;s agudo intenso</div>
              <div class="destroy-body">El cortisol y la adrenalina pueden alterar la motilidad intestinal y la composici&oacute;n microbiana en horas. Galley et al. (2014) documentaron cambios en <em>Lactobacillus</em> tras exposici&oacute;n a estresores sociales agudos. La v&iacute;a es directa: el intestino tiene receptores para cortisol.</div>
            </div>
            <div class="destroy-card">
              <div class="destroy-title">Alcohol en cantidad elevada</div>
              <div class="destroy-body">Disruptor de la barrera intestinal y del equilibrio entre bacterias gram-positivas y gram-negativas. El efecto sobre la permeabilidad puede persistir d&iacute;as tras la ingesta. La investigaci&oacute;n asocia el consumo cr&oacute;nico elevado con disbiosis sostenida y mayor LPS en sangre.</div>
            </div>
            <div class="destroy-card">
              <div class="destroy-title">Sue&ntilde;o menor de 6 horas sostenido</div>
              <div class="destroy-body">Liang et al. (2015) asociaron la restricci&oacute;n cr&oacute;nica de sue&ntilde;o con alteraciones en la composici&oacute;n microbiana y mayor permeabilidad intestinal al d&iacute;a siguiente. El microbioma tiene ritmos circadianos propios que se desregulan con el sue&ntilde;o fragmentado.</div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="g4-wrap">
            <p class="section-label">Lo que puede restaurarlo en 2&ndash;4 semanas</p>
            <div class="restore-card">
              <div class="restore-title">Fermentos diarios (k&eacute;fir, miso, kimchi, chucrut)</div>
              <div class="restore-body">Sonnenburg et al. (2021, <em>Cell</em>): una dieta alta en fermentados aument&oacute; la diversidad microbiana y redujo marcadores inflamatorios en 10 semanas, con mayor efecto que una dieta alta en fibra sola en t&eacute;rminos de diversidad. El tipo de fermento importa menos que la regularidad de la exposici&oacute;n.</div>
            </div>
            <div class="restore-card">
              <div class="restore-title">Fibra diversa (30+ tipos de plantas por semana)</div>
              <div class="restore-body">El estudio American Gut Project asoci&oacute; mayor n&uacute;mero de tipos distintos de plantas consumidas con mayor diversidad microbiana, independientemente de las cantidades totales. Hierbas arom&aacute;ticas, especias y semillas tambi&eacute;n cuentan.</div>
            </div>
            <div class="restore-card">
              <div class="restore-title">Polifenoles (frutos rojos, cacao, t&eacute; verde, aceite de oliva)</div>
              <div class="restore-body">Los polifenoles act&uacute;an como prebi&oacute;ticos selectivos, favoreciendo bacterias beneficiosas. Su metabolismo por la microbiota genera urolitinas y otros metabolitos con actividad antiinflamatoria documentada. El efecto es dose-dependiente y acumulativo.</div>
            </div>
            <div class="restore-card">
              <div class="restore-title">Omega-3 (pescado azul, semillas de lino, nueces)</div>
              <div class="restore-body">Se asocia con reducci&oacute;n de marcadores inflamatorios intestinales y cerebrales. Gomez-Pinilla (2008) document&oacute; su papel en neuroplasticidad y resiliencia al estr&eacute;s. La relaci&oacute;n omega-3/omega-6 puede ser tan relevante como la cantidad absoluta.</div>
            </div>
            <div class="restore-card">
              <div class="restore-title">Sue&ntilde;o regulado + ventana digestiva nocturna</div>
              <div class="restore-body">La cronobiolog&iacute;a del microbioma sugiere que respetar ritmos circadianos de ingesta puede ser tan importante como la composici&oacute;n de la dieta para la diversidad microbiana. Cenar pronto y respetar un ayuno nocturno natural se asocia con mejor composici&oacute;n microbiana. (Thaiss et al., 2014)</div>
            </div>
          </td>
        </tr>

        <tr>
          <td class="receta-wrap">
            <p class="receta-label">Receta de esta edici&oacute;n</p>
            <p class="receta-title">Sopa de miso, alga wakame<br>y tofu sedoso</p>
            <p class="receta-subtitle">Ingredientes &mdash; 2 personas</p>
            <ul class="receta-list">
              <li>600 ml agua filtrada (nunca hirviendo al a&ntilde;adir el miso)</li>
              <li>2 cucharadas de miso blanco o rojo (shiro o aka), sin pasteurizar</li>
              <li>5 g alga wakame seca (remojar 5 min en agua fr&iacute;a)</li>
              <li>150 g tofu sedoso en dados</li>
              <li>2 cebolletas en rodajas finas</li>
              <li>1 cucharadita aceite de s&eacute;samo tostado</li>
              <li>Semillas de s&eacute;samo negro</li>
            </ul>
            <p class="receta-subtitle">Preparaci&oacute;n</p>
            <p class="receta-steps">Calienta el agua hasta que humee &mdash; aproximadamente 85&thinsp;&deg;C, sin llegar a hervir. Disuelve el miso en un poco del agua templada antes de incorporarlo al resto: as&iacute; preservas los microorganismos vivos y las enzimas activas, que mueren a partir de 70&thinsp;&deg;C. A&ntilde;ade el wakame rehidratado, el tofu y la cebolleta. Termina con aceite de s&eacute;samo y semillas. Sirve inmediatamente.</p>
            <div class="receta-nota">
              <p class="receta-nota-label">Nota Food&middot;Mood</p>
              <p class="receta-nota-body">El miso sin pasteurizar contiene cepas de <em>Lactobacillus</em> y <em>Aspergillus oryzae</em> cuya relaci&oacute;n con la producci&oacute;n de GABA intestinal ha sido documentada en estudios in vitro y en fermentos japoneses tradicionales. El alga wakame aporta fucoidan &mdash; un polisac&aacute;rido sulfatado que la investigaci&oacute;n preliminar asocia con actividad prebi&oacute;tica y antiinflamatoria. Una sopa que trabaja mientras la tomas.</p>
            </div>
          </td>
        </tr>

        <tr>
          <td class="biblio-wrap">
            <p class="biblio-title">Referencias</p>
            <ul class="biblio-list">
              <li><span class="biblio-author">Barrett, L.F.</span> (2017). <em>How Emotions Are Made.</em> Houghton Mifflin Harcourt.</li>
              <li><span class="biblio-author">Bravo, J.A. et al.</span> (2011). Ingestion of <em>Lactobacillus</em> strain regulates emotional behavior and central GABA receptor expression. <em>PNAS</em>, 108(38), 16050&ndash;16055.</li>
              <li><span class="biblio-author">Cryan, J.F. et al.</span> (2019). The Microbiota-Gut-Brain Axis. <em>Physiological Reviews</em>, 99(4), 1877&ndash;2013.</li>
              <li><span class="biblio-author">Damasio, A.</span> (1994). <em>Descartes&rsquo; Error.</em> Putnam Publishing.</li>
              <li><span class="biblio-author">Dethlefsen, L. &amp; Relman, D.A.</span> (2011). Incomplete recovery and individualized responses of the human distal gut microbiota to repeated antibiotic perturbation. <em>PNAS</em>, 108(S1), 4554&ndash;4561.</li>
              <li><span class="biblio-author">Dinan, T.G. &amp; Cryan, J.F.</span> (2017). The microbiome-gut-brain axis in health and disease. <em>Gastroenterology Clinics</em>, 46(1), 77&ndash;89.</li>
              <li><span class="biblio-author">Dinan, T.G., Stanton, C. &amp; Cryan, J.F.</span> (2013). Psychobiotics: a novel class of psychotropic. <em>Biological Psychiatry</em>, 74(10), 720&ndash;726.</li>
              <li><span class="biblio-author">Galley, J.D. et al.</span> (2014). Exposure to a social stressor disrupts the community structure of the colonic mucosa-associated microbiota. <em>BMC Microbiology</em>, 14, 189.</li>
              <li><span class="biblio-author">Gomez-Pinilla, F.</span> (2008). Brain foods: the effects of nutrients on brain function. <em>Nature Reviews Neuroscience</em>, 9, 568&ndash;578.</li>
              <li><span class="biblio-author">Liang, X. et al.</span> (2015). Gut microbiota mediates circadian clock function. <em>Cell Host &amp; Microbe</em>, 17, 605&ndash;611.</li>
              <li><span class="biblio-author">Pinto-Sanchez, M.I. et al.</span> (2017). Probiotic <em>Bifidobacterium longum</em> NCC3001 reduces depression scores and alters brain activity. <em>Gastroenterology</em>, 153(2), 448&ndash;459.</li>
              <li><span class="biblio-author">Sonnenburg, E.D. et al.</span> (2021). Gut-microbiota-targeted diets modulate human immune status. <em>Cell</em>, 184(16), 4137&ndash;4153.</li>
              <li><span class="biblio-author">Thaiss, C.A. et al.</span> (2014). Transkingdom control of microbiota diurnal oscillations. <em>Cell</em>, 159(3), 514&ndash;529.</li>
            </ul>
          </td>
        </tr>

        <tr>
          <td class="quote-wrap">
            <p class="quote-text">
              &ldquo;No tienes ansiedad.<br>
              <em>Puede que tengas un microbioma<br>
              que lleva tiempo pidiendo ayuda.<br>
              Y eso s&iacute; tiene soluci&oacute;n.&rdquo;</em>
            </p>
          </td>
        </tr>

        <tr>
          <td class="cta-wrap">
            <p class="cta-body">El test de Food&middot;Mood cruza tu perfil emocional con los alimentos que la investigaci&oacute;n asocia con mayor diversidad microbiana y menor reactividad al estr&eacute;s. Tu microbioma puede cambiar en semanas.</p>
            <a href="https://food-mood.app" class="cta-btn">Descubre tu perfil de estado de &aacute;nimo en food-mood.app &rarr;</a>
          </td>
        </tr>

        <tr>
          <td class="footer">
            <p>Food&middot;Mood &nbsp;&middot;&nbsp; food-mood.app &nbsp;&middot;&nbsp; &copy; 2026</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}
