export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food&middot;Mood &mdash; Tu cuerpo tiene un reloj. Y cada vez que comes fuera de hora, lo atrasa.</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: 'Lato', Arial, sans-serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 680px; margin: 0 auto; background: #F5F0E8; }
  .header { background: #2d0f16; padding: 48px 44px 44px; }
  .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #6B2737; letter-spacing: .06em; display: inline-block; margin-bottom: 28px; }
  .header-numero { font-size: 10px; font-weight: 700; letter-spacing: .20em; text-transform: uppercase; color: #FF6B35; margin-bottom: 8px; }
  .header-tagline { font-size: 11px; font-weight: 300; letter-spacing: .08em; color: rgba(245,240,232,0.45); margin-bottom: 32px; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #F5F0E8; line-height: 1.20; }
  .header-title em { font-style: italic; color: #FF6B35; font-weight: 400; }
  .intro { padding: 36px 44px; border-bottom: 1px solid #e0d5c8; }
  .intro p { font-size: 15px; line-height: 1.82; color: #4a3a3e; font-weight: 300; margin-bottom: 18px; }
  .intro p:last-child { margin-bottom: 0; }
  .intro strong { font-weight: 700; color: #2a1a1e; }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9e8080; margin-bottom: 18px; }
  .section-label-gold { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,107,53,0.65); margin-bottom: 14px; }
  .g1-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; background: #18090e; }
  .clock-block { border-left: 3px solid #6B2737; border-radius: 0 8px 8px 0; padding: 14px 16px 14px 18px; background: #2d0f16; }
  .clock-time { font-size: 11px; font-weight: 700; letter-spacing: .14em; color: #FF6B35; margin-bottom: 4px; }
  .clock-hormone { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 700; color: #F5F0E8; margin-bottom: 6px; }
  .clock-desc { font-size: 12px; font-weight: 300; line-height: 1.60; color: rgba(245,240,232,0.65); font-style: italic; }
  .g2-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .franja-block { margin-bottom: 16px; border-radius: 8px; overflow: hidden; }
  .franja-block:last-child { margin-bottom: 0; }
  .franja-header { background: #6B2737; padding: 10px 16px; }
  .franja-time { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #FF6B35; margin-bottom: 2px; }
  .franja-macro { font-size: 13px; font-weight: 700; color: #F5F0E8; }
  .franja-body { background: #fff; border: 1px solid #e0d5c8; border-top: none; border-radius: 0 0 8px 8px; padding: 14px 16px; }
  .franja-foods { font-size: 13px; font-weight: 300; color: #4a3a3e; margin-bottom: 8px; line-height: 1.55; }
  .franja-mec { font-size: 11.5px; font-style: italic; color: rgba(255,107,53,0.70); line-height: 1.60; }
  .g3-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .cost-table { width: 100%; border-collapse: collapse; }
  .cost-cell { width: 50%; vertical-align: top; padding: 6px; }
  .cost-block { background: #2d0f16; border-radius: 10px; padding: 18px 20px; }
  .cost-indicator { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #FF6B35; margin-bottom: 8px; }
  .cost-body { font-size: 12px; font-weight: 300; line-height: 1.65; color: rgba(245,240,232,0.70); }
  .cost-cite { font-size: 10px; color: rgba(255,107,53,0.40); font-style: italic; margin-top: 6px; }
  .ajustes-wrap { padding: 32px 44px; border-bottom: 1px solid #e0d5c8; }
  .ajuste-item { margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid #e8ddd5; }
  .ajuste-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .ajuste-num { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(107,39,55,0.45); margin-bottom: 6px; }
  .ajuste-title { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; font-weight: 700; color: #6B2737; margin-bottom: 10px; line-height: 1.30; }
  .ajuste-body { font-size: 13.5px; font-weight: 300; line-height: 1.78; color: #4a3a3e; }
  .ajuste-cite { font-size: 11px; color: rgba(107,39,55,0.50); font-style: italic; margin-top: 8px; }
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
    .intro, .g2-wrap, .g3-wrap, .ajustes-wrap, .biblio-wrap, .quote-wrap, .cta-wrap, .footer { padding-left: 22px; padding-right: 22px; }
    .g1-wrap { padding: 24px 22px; }
    .receta-wrap { padding: 28px 22px; }
    .quote-text { font-size: 20px; }
    .cost-cell { display: block; width: 100%; padding: 0 0 10px 0; }
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
            <p class="header-numero">N&ordm; 23</p>
            <p class="header-tagline">La app de body &amp; mind que estabas esperando.</p>
            <h1 class="header-title">Tu cuerpo tiene un reloj.<br><em>Y cada vez que comes fuera de hora, lo atrasa.</em></h1>
          </td>
        </tr>
        <tr>
          <td class="intro">
            <p>En 2017, el Premio Nobel de Fisiolog&iacute;a o Medicina fue otorgado a Jeffrey Hall, Michael Rosbash y Michael Young por descubrir los mecanismos moleculares que controlan los ritmos circadianos. Su hallazgo central: pr&aacute;cticamente cada c&eacute;lula del cuerpo humano contiene un reloj interno sincronizado por se&ntilde;ales externas &mdash; principalmente la luz solar y el momento de la ingesta. La crononutrici&oacute;n es la disciplina que estudia precisamente esto: c&oacute;mo el <strong>cu&aacute;ndo comemos</strong> puede influir tanto o m&aacute;s que el qu&eacute; comemos en el metabolismo, el estado de &aacute;nimo y la cognici&oacute;n.</p>
            <p>Desde la neurociencia afectiva, la Teor&iacute;a de la Emoci&oacute;n Constru&iacute;da de Barrett sugiere que el cerebro usa constantemente se&ntilde;ales interoceptivas &mdash; entre ellas el estado metab&oacute;lico y hormonal &mdash; para construir la experiencia emocional del momento. Comer fuera del ritmo circadiano no solo afecta el metabolismo: desincroniza la producci&oacute;n de cortisol, serotonina y melatonina, alterando el sustrato biol&oacute;gico sobre el que el cerebro fabrica el estado de &aacute;nimo. La cronobiolog&iacute;a y la psicolog&iacute;a afectiva convergen aqu&iacute; en un punto que la nutrici&oacute;n convencional raramente menciona.</p>
          </td>
        </tr>
        <tr>
          <td class="g1-wrap">
            <p class="section-label-gold">El reloj de las hormonas del estado de &aacute;nimo</p>
            <div class="clock-block"><div class="clock-time">06:00 &ndash; 08:00</div><div class="clock-hormone">Cortisol matutino &mdash; pico fisiol&oacute;gico</div><div class="clock-desc">&ldquo;No es estr&eacute;s: es el sistema de arranque. La evidencia sugiere que este pico es necesario para la alerta, la motivaci&oacute;n y el metabolismo gluc&iacute;dico.&rdquo;</div></div>
            <div class="clock-block" style="margin-top:8px;"><div class="clock-time">08:00 &ndash; 10:00</div><div class="clock-hormone">Dopamina en ascenso</div><div class="clock-desc">&ldquo;Ventana de mayor capacidad para el foco sostenido, la toma de decisiones y el pensamiento creativo seg&uacute;n los estudios de cronobiolog&iacute;a cognitiva.&rdquo;</div></div>
            <div class="clock-block" style="margin-top:8px;"><div class="clock-time">12:00 &ndash; 15:00</div><div class="clock-hormone">Serotonina &mdash; producci&oacute;n &oacute;ptima</div><div class="clock-desc">&ldquo;La investigaci&oacute;n asocia la exposici&oacute;n solar de mediod&iacute;a con la s&iacute;ntesis de serotonina. El almuerzo en este periodo puede potenciar el efecto.&rdquo;</div></div>
            <div class="clock-block" style="margin-top:8px;"><div class="clock-time">17:00 &ndash; 19:00</div><div class="clock-hormone">Cortisol en descenso &middot; Temperatura corporal pico</div><div class="clock-desc">&ldquo;Ventana para ejercicio f&iacute;sico seg&uacute;n cronobiolog&iacute;a. Las cenas tard&iacute;as en este periodo pueden interferir con la transici&oacute;n hacia el reposo.&rdquo;</div></div>
            <div class="clock-block" style="margin-top:8px;"><div class="clock-time">21:00 &ndash; 23:00</div><div class="clock-hormone">Melatonina en ascenso</div><div class="clock-desc">&ldquo;La luz artificial y la ingesta cal&oacute;rica tard&iacute;a pueden suprimir su producci&oacute;n seg&uacute;n varios estudios de cronobiolog&iacute;a.&rdquo;</div></div>
            <div class="clock-block" style="margin-top:8px;border-left-color:rgba(107,39,55,0.40);"><div class="clock-time">03:00 &ndash; 05:00</div><div class="clock-hormone">Melatonina pico &middot; Temperatura corporal m&iacute;nima</div><div class="clock-desc">&ldquo;El sistema digestivo reduce su actividad al m&iacute;nimo. La ingesta en esta franja se asocia con mayor impacto metab&oacute;lico negativo.&rdquo;</div></div>
            <p style="margin-top:16px;font-size:10.5px;font-style:italic;color:rgba(255,107,53,0.40);line-height:1.65;">Fuente: Hall, Rosbash &amp; Young, Nobel Lecture 2017; Garaulet &amp; G&oacute;mez-Abell&aacute;n, 2014.</p>
          </td>
        </tr>
        <tr>
          <td class="g2-wrap">
            <p class="section-label">Qu&eacute; puede nutrir al cerebro en cada franja horaria</p>
            <div class="franja-block"><div class="franja-header"><div class="franja-time">Ma&ntilde;ana &mdash; 6 a 10 h</div><div class="franja-macro">Prote&iacute;na + grasa de calidad</div></div><div class="franja-body"><div class="franja-foods">Huevo, aguacate, frutos secos, yogur, semillas de c&aacute;&ntilde;amo</div><div class="franja-mec">&ldquo;Ralentiza el vaciado g&aacute;strico, estabiliza la glucosa, puede sostener el foco durante 4&ndash;5 horas seg&uacute;n estudios de saciedad.&rdquo;</div></div></div>
            <div class="franja-block"><div class="franja-header"><div class="franja-time">Mediod&iacute;a &mdash; 12 a 15 h</div><div class="franja-macro">Hidratos complejos + fermentos + prote&iacute;na</div></div><div class="franja-body"><div class="franja-foods">Legumbres, arroz integral, col fermentada, pescado azul, huevos</div><div class="franja-mec">&ldquo;Ventana de mayor sensibilidad insul&iacute;nica del d&iacute;a. La fibra fermentable en esta franja puede optimizar la producci&oacute;n de SCFA durante la tarde.&rdquo;</div></div></div>
            <div class="franja-block"><div class="franja-header"><div class="franja-time">Tarde &mdash; 15 a 19 h</div><div class="franja-macro">Magnesio + tript&oacute;fano + antioxidantes</div></div><div class="franja-body"><div class="franja-foods">Frutos secos, semillas de calabaza, frutos rojos, cacao, pl&aacute;tano</div><div class="franja-mec">&ldquo;El tript&oacute;fano consumido por la tarde puede convertirse en serotonina y posteriormente en melatonina nocturna, seg&uacute;n la cadena de s&iacute;ntesis documentada.&rdquo;</div></div></div>
            <div class="franja-block"><div class="franja-header"><div class="franja-time">Noche &mdash; despu&eacute;s de 20 h</div><div class="franja-macro">M&iacute;nimo, ligero, f&aacute;cil de digerir</div></div><div class="franja-body"><div class="franja-foods">Caldo, verduras cocidas, fruta no muy dulce, huevo poch&eacute;</div><div class="franja-mec">&ldquo;El sistema digestivo reduce su actividad metab&oacute;lica. La evidencia sugiere que cenar tarde puede asociarse con mayor variabilidad gluc&eacute;mica nocturna y peor calidad de sue&ntilde;o.&rdquo;</div></div></div>
          </td>
        </tr>
        <tr>
          <td class="g3-wrap">
            <p class="section-label">El coste circadiano de cenar tarde</p>
            <table class="cost-table" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="cost-cell" style="padding-right:5px;"><div class="cost-block"><div class="cost-indicator">Glucosa</div><div class="cost-body">Estudios con monitorizaci&oacute;n continua sugieren que la misma comida consumida a las 21h puede producir picos gluc&eacute;micos hasta un 20% mayores que a las 13h.</div><div class="cost-cite">(Jakubowicz et al., 2013)</div></div></td>
                <td class="cost-cell" style="padding-left:5px;"><div class="cost-block"><div class="cost-indicator">Cortisol</div><div class="cost-body">La ingesta cal&oacute;rica tard&iacute;a puede interferir con el descenso nocturno del cortisol, asociado en la literatura con mayor dificultad para conciliar el sue&ntilde;o y recuperaci&oacute;n m&aacute;s lenta del eje HPA.</div></div></td>
              </tr>
              <tr>
                <td class="cost-cell" style="padding-right:5px;padding-top:10px;"><div class="cost-block"><div class="cost-indicator">Microbiota</div><div class="cost-body">Los ritmos circadianos de la microbiota son reales: las especies bacterianas dominantes cambian a lo largo del d&iacute;a. Comer fuera de ritmo puede desincronizar estos ciclos microbianos.</div><div class="cost-cite">(Thaiss et al., 2014)</div></div></td>
                <td class="cost-cell" style="padding-left:5px;padding-top:10px;"><div class="cost-block"><div class="cost-indicator">Sue&ntilde;o</div><div class="cost-body">La evidencia asocia las cenas tard&iacute;as con mayor fragmentaci&oacute;n del sue&ntilde;o, reducci&oacute;n del sue&ntilde;o profundo (N3) y menor secreci&oacute;n de hormona de crecimiento nocturna.</div></div></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="ajustes-wrap">
            <p class="section-label">3 ajustes circadianos que pueden cambiar el humor en 7 d&iacute;as</p>
            <div class="ajuste-item"><div class="ajuste-num">Ajuste 01</div><div class="ajuste-title">Adelantar la primera ingesta a antes de las 9h</div><div class="ajuste-body">No necesariamente un desayuno grande: prote&iacute;na y grasa en peque&ntilde;a cantidad puede ser suficiente para activar el reloj perif&eacute;rico del h&iacute;gado e intestino, sincroniz&aacute;ndolo con el reloj central del hipot&aacute;lamo. La investigaci&oacute;n sugiere que este primer anclaje temporal influye en la cascada hormonal de las siguientes 12 horas.</div><div class="ajuste-cite">(Wehrens et al., 2017)</div></div>
            <div class="ajuste-item"><div class="ajuste-num">Ajuste 02</div><div class="ajuste-title">Concentrar el 70% de las calor&iacute;as antes de las 15h</div><div class="ajuste-body">Varios estudios de crononutrici&oacute;n, incluyendo los de Garaulet et al. (2013) con adultos espa&ntilde;oles, encontraron que quienes almorzaban antes de las 15h tuvieron mejor regulaci&oacute;n gluc&eacute;mica &mdash; independientemente de las calor&iacute;as totales. El timing puede importar tanto como la cantidad.</div><div class="ajuste-cite">(Garaulet et al., 2013)</div></div>
            <div class="ajuste-item"><div class="ajuste-num">Ajuste 03</div><div class="ajuste-title">Crear una ventana de silencio digestivo de 12h</div><div class="ajuste-body">No como restricci&oacute;n, sino como respeto al ritmo natural. Si la &uacute;ltima ingesta es a las 20h y la primera a las 8h, el sistema digestivo y el microbioma tienen su propio tiempo de reparaci&oacute;n y reorganizaci&oacute;n nocturna. La evidencia en modelos animales y algunos estudios en humanos sugiere beneficios en diversidad microbiana y sensibilidad insul&iacute;nica.</div></div>
          </td>
        </tr>
        <tr>
          <td class="receta-wrap">
            <p class="receta-label">Receta de esta edici&oacute;n</p>
            <p class="receta-title">Desayuno de prote&iacute;na circadiana:<br>huevos, aguacate y kimchi</p>
            <p class="receta-subtitle">Ingredientes &mdash; 1 persona</p>
            <ul class="receta-list">
              <li>2 huevos camperos</li>
              <li>&frac12; aguacate maduro</li>
              <li>2 cucharadas de kimchi (o chucrut)</li>
              <li>1 rebanada de pan de masa madre (opcional)</li>
              <li>Aceite de oliva virgen extra</li>
              <li>Sal marina, pimienta negra, semillas de s&eacute;samo</li>
              <li>Unas gotas de vinagre de kombucha o de manzana</li>
            </ul>
            <p class="receta-subtitle">Preparaci&oacute;n</p>
            <p class="receta-steps">Cocina los huevos al gusto &mdash; poch&eacute;, revueltos a fuego lento, o en sart&eacute;n con un hilo de aceite. Sirve con el aguacate laminado, el kimchi a temperatura ambiente &mdash; no lo calientes: protege los microorganismos vivos &mdash; y las semillas de s&eacute;samo. Termina con unas gotas de vinagre de kombucha o de manzana en hilo fino.</p>
            <div class="receta-nota">
              <p class="receta-nota-label">Nota Food&middot;Mood</p>
              <p class="receta-nota-body">La prote&iacute;na del huevo aporta todos los amino&aacute;cidos esenciales incluyendo tript&oacute;fano y tirosina &mdash; precursores de serotonina y dopamina respectivamente. La grasa del aguacate ralentiza la absorci&oacute;n y puede estabilizar la glucosa matutina durante horas. El kimchi introduce microorganismos vivos en la primera franja del d&iacute;a, cuando el tracto digestivo est&aacute; m&aacute;s receptivo seg&uacute;n la cronobiolog&iacute;a del microbioma. Un desayuno que le dice a tu cerebro qu&eacute; hora es.</p>
            </div>
          </td>
        </tr>
        <tr>
          <td class="biblio-wrap">
            <p class="biblio-title">Referencias</p>
            <ul class="biblio-list">
              <li><span class="biblio-author">Barrett, L.F.</span> (2017). <em>How Emotions Are Made.</em> Houghton Mifflin Harcourt.</li>
              <li><span class="biblio-author">Garaulet, M. et al.</span> (2013). Timing of food intake predicts weight loss effectiveness. <em>International Journal of Obesity</em>, 37, 604&ndash;611.</li>
              <li><span class="biblio-author">Garaulet, M. &amp; G&oacute;mez-Abell&aacute;n, P.</span> (2014). Timing of food intake and obesity: a novel association. <em>Physiology &amp; Behavior</em>, 134, 44&ndash;50.</li>
              <li><span class="biblio-author">Hall, J.C., Rosbash, M. &amp; Young, M.W.</span> (2017). Nobel Lecture: Molecular mechanisms controlling circadian rhythms. <em>Nobel Foundation.</em></li>
              <li><span class="biblio-author">Jakubowicz, D. et al.</span> (2013). High caloric intake at breakfast vs. dinner differentially influences weight loss. <em>Obesity</em>, 21(12), 2504&ndash;2512.</li>
              <li><span class="biblio-author">Thaiss, C.A. et al.</span> (2014). Transkingdom control of microbiota diurnal oscillations promotes metabolic homeostasis. <em>Cell</em>, 159(3), 514&ndash;529.</li>
              <li><span class="biblio-author">Wehrens, S.M.T. et al.</span> (2017). Meal timing regulates the human circadian system. <em>Current Biology</em>, 27(12), 1768&ndash;1775.</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td class="quote-wrap">
            <p class="quote-text">&ldquo;No se trata solo de qu&eacute; comes.<br><em>Se trata de cu&aacute;ndo.<br>Tu cerebro tiene horario.&rdquo;</em></p>
          </td>
        </tr>
        <tr>
          <td class="cta-wrap">
            <p class="cta-body">El test de Food&middot;Mood cruza tu perfil emocional con los alimentos y los ritmos que la investigaci&oacute;n asocia con mayor equilibrio hormonal y mejor estado de &aacute;nimo. Tu reloj interno puede resincronizarse en d&iacute;as.</p>
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
