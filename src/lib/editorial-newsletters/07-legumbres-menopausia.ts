export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Las legumbres y la menopausia</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#0E1A0E;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-50px;right:-30px;width:260px;height:260px;border-radius:50%;background:rgba(75,138,90,0.15)}
  .header::after{content:'';position:absolute;bottom:-20px;left:-20px;width:160px;height:160px;border-radius:50%;background:rgba(255,107,53,0.08)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',serif;font-size:16px;color:rgba(245,240,232,0.4);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#FF6B35}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FF6B35;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:36px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:18px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#FF6B35}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .lead{font-family:'DM Serif Display',serif;font-size:21px;color:#6B2737;line-height:1.4;margin-bottom:18px}
  .bt{font-size:15px;line-height:1.75;color:#4a3a3e}
  .bt p{margin-bottom:14px}
  .bt p:last-child{margin-bottom:0}
  .bt strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#4B8A5A;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(255,107,53,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pq-text em{color:#FF6B35;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .sl{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb strong{color:#6B2737;font-weight:500}
  .grid6{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:20px 0}
  .g6c{background:#fff;border:1px solid #e8ddd5;border-radius:12px;padding:14px;text-align:center}
  .g6ico{font-size:24px;margin-bottom:8px}
  .g6tit{font-size:12px;font-weight:500;color:#6B2737;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em}
  .g6txt{font-size:11px;color:#7a5c63;line-height:1.4}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#e8f5e8,#fdf5e0);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#2d6a2d;margin-bottom:6px}
  .rnombre{font-family:'DM Serif Display',serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px}
  .rmeta{font-size:12px;color:#9e8080}
  .rbody{padding:20px 24px}
  .ingl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px}
  .ii{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#4a3a3e;padding:4px 0;line-height:1.4}
  .id{width:5px;height:5px;border-radius:50%;background:#FF6B35;flex-shrink:0;margin-top:6px}
  .iop{color:#9e8080;font-style:italic}
  .rpasos{border-top:1px solid #f0e8e0;padding-top:16px;margin:16px 0}
  .paso{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#4a3a3e;line-height:1.55}
  .pn{width:22px;height:22px;border-radius:50%;background:#4B8A5A;color:#F5F0E8;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .ptip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:3px}
  .rnota{background:#e8f5e8;border-radius:10px;padding:14px 16px;font-size:12px;color:#2d5a2d;line-height:1.65;border-left:3px solid #4B8A5A;margin-top:4px}
  .rnota strong{color:#2d5a2d}
  .cta-reto{padding:36px 40px;background:#0E1A0E;border-bottom:1px solid #1a2a1a;text-align:center}
  .cta-ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#FF6B35;margin-bottom:16px}
  .cta-title{font-family:'DM Serif Display',serif;font-size:26px;color:#F5F0E8;font-weight:400;margin-bottom:12px;line-height:1.2}
  .cta-title em{font-style:italic;color:#FF6B35}
  .cta-desc{font-size:14px;color:rgba(245,240,232,0.65);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto}
  .cta-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left;max-width:360px;margin-left:auto;margin-right:auto}
  .cta-li{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(245,240,232,0.75)}
  .cta-check{color:#FF6B35;font-weight:700;flex-shrink:0}
  .cta-btn{display:inline-block;background:#FF6B35;color:#0E1A0E;font-size:15px;font-weight:600;padding:15px 32px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
  .cta-precio{font-size:12px;color:rgba(245,240,232,0.4);margin-top:10px}
  .cierre{padding:28px 40px;border-bottom:1px solid #e0d5c8}
  .cierre-text{font-size:14px;line-height:1.8;color:#7a5c63}
  .firma{margin-top:20px}
  .fn{font-family:'DM Serif Display',serif;font-size:17px;color:#6B2737;font-style:italic;margin-bottom:3px}
  .fc{font-size:12px;color:#9e8080;line-height:1.5}
  .disc{padding:20px 40px;background:#f5f0e8;border-bottom:1px solid #e0d5c8}
  .disc-in{background:#fff;border-radius:10px;border:1px solid #e8ddd5;padding:14px 16px;display:flex;gap:10px;align-items:flex-start}
  .disc-ico{font-size:16px;flex-shrink:0;margin-top:1px}
  .disc-txt{font-size:11px;color:#9e8080;line-height:1.6}
  .disc-txt strong{color:#7a5c63;font-weight:500}
  .footer{padding:24px 40px;text-align:center}
  .flogo{font-family:'DM Serif Display',serif;font-size:18px;color:#6B2737;margin-bottom:6px}
  .furl{font-size:12px;color:#9e8080;margin-bottom:4px}
  .fcopy{font-size:11px;color:#b0a0a0}
  @media(max-width:480px){.header,.intro,.ciencia,.receta-section,.pullquote,.cta-reto,.cierre,.disc,.footer{padding-left:24px;padding-right:24px}.h-title{font-size:28px}.grid6{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo-row"><span class="logo-text">Food·Mood</span><div class="logo-dot"></div><span class="logo-text">Equilibrio hormonal 45+</span></div>
    <div class="eyebrow">Newsletter · Salud hormonal femenina</div>
    <div class="h-title">Las legumbres y la menopausia:<br><em>el alimento más completo</em><br>que existe.</div>
    <div class="h-sub">Un solo alimento. Seis mecanismos hormonales activos. La intervención dietética de mayor impacto por ración en la menopausia.</div>
  </div>

  <div class="intro">
    <p class="lead">Si tuvieras que elegir un solo alimento para la salud hormonal después de los 45, sería una legumbre.</p>
    <div class="bt">
      <p>No el salmón. No el aguacate. No las semillas de chía. Una legumbre. Lentejas, garbanzos, alubias, guisantes, edamame. Cualquiera de ellas tiene un perfil nutricional que ningún otro grupo de alimentos puede replicar en una sola ración.</p>
      <p>Proteína vegetal completa. Fibra fermentable para el estrobioma. Fitoestrógenos que modulan los receptores. Hierro que combate la fatiga. Zinc que apoya la testosterona. Folato que es cofactor de la metilación de estrógenos en el hígado.</p>
      <p><strong>Cuatro o cinco raciones a la semana es la intervención dietética de mayor impacto hormonal por ración en la menopausia.</strong> Y la más infravalorada.</p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pq-text">Las legumbres hacen en una sola ración lo que ningún otro alimento hace:<br><em>proteína, fibra, fitoestrógenos, hierro, zinc y folato.</em><br>Todo al mismo tiempo.</p>
  </div>

  <div class="ciencia">
    <p class="sl">💡 Seis mecanismos hormonales en una sola ración</p>
    <div class="grid6">
      <div class="g6c"><div class="g6ico">💪</div><div class="g6tit">Proteína</div><div class="g6txt">Protege el músculo hormonal que los estrógenos ya no protegen</div></div>
      <div class="g6c"><div class="g6ico">🦠</div><div class="g6tit">Fibra</div><div class="g6txt">Alimenta el estrobioma que regula los estrógenos circulantes</div></div>
      <div class="g6c"><div class="g6ico">🌱</div><div class="g6tit">Fitoestrógenos</div><div class="g6txt">Modulan los receptores ER-β con efecto selectivo y seguro</div></div>
      <div class="g6c"><div class="g6ico">🩸</div><div class="g6tit">Hierro</div><div class="g6txt">Combate la fatiga crónica asociada a la perimenopausia</div></div>
      <div class="g6c"><div class="g6ico">⚡</div><div class="g6tit">Zinc</div><div class="g6txt">Cofactor de la síntesis de testosterona y de la aromatasa</div></div>
      <div class="g6c"><div class="g6ico">🧬</div><div class="g6tit">Folato</div><div class="g6txt">Cofactor de la metilación hepática de estrógenos (vía COMT)</div></div>
    </div>
    <div class="cb"><p>Ningún suplemento hormonal natural tiene este perfil. Y ningún alimento individual lo replica. Las legumbres son el único grupo alimentario que actúa simultáneamente sobre el músculo, el estrobioma, los receptores hormonales, la energía, los andrógenos y la detoxificación estrogénica.</p></div>
    <div class="mrow"><div class="micon">🫘</div><div class="mtext"><strong>Fitoestrógenos de legumbres → receptor ER-β</strong>Las isoflavonas del edamame y la soja fermentada (genisteína, daidzeína) y los cumestanos de las lentejas germinadas se unen preferentemente al receptor ER-β — el que protege huesos, cerebro y corazón — con mínimo efecto sobre ER-α en mama y útero. Es el mecanismo de los SERMs naturales.<div class="mref">Messina, 2016 · Advances in Nutrition · Soy and health update</div></div></div>
    <div class="mrow"><div class="micon">💪</div><div class="mtext"><strong>Proteína vegetal completa + leucina → músculo en menopausia</strong>Las legumbres tienen el ratio proteína/fibra más alto de todos los alimentos vegetales. La leucina — el aminoácido que activa la síntesis proteica muscular — es especialmente alta en la soja y las lentejas. Combinadas con proteína animal en la misma semana, cubren el requerimiento aumentado de la menopausia (1,4-1,8 g/kg/día).<div class="mref">Cruz-Jentoft et al., 2019 · Age &amp; Ageing · Sarcopenia: revised European consensus</div></div></div>
  </div>

  <div class="receta-section">
    <p class="sl">🍽 La receta — Dal de lentejas con coco y espinacas</p>
    <div class="rc">
      <div class="rh">
        <div class="rmood">Equilibrio hormonal · Estrobioma + músculo + fitoestrógenos</div>
        <div class="rnombre">Dal de lentejas rojas con leche de coco y espinacas</div>
        <div class="rmeta">⏱ 25 min · Comida o cena · 4-5 raciones a la semana</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes</div>
        <div class="ii"><div class="id"></div><span>150 g de lentejas rojas</span></div>
        <div class="ii"><div class="id"></div><span>400 ml de leche de coco light</span></div>
        <div class="ii"><div class="id"></div><span>200 ml de caldo de verduras</span></div>
        <div class="ii"><div class="id"></div><span>2 puñados de espinacas frescas</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharadita de cúrcuma + 1/2 cucharadita de comino + 1/2 cucharadita de coriandro</span></div>
        <div class="ii"><div class="id"></div><span>1 trozo de jengibre fresco rallado + 2 dientes de ajo + 1/2 cebolla</span></div>
        <div class="ii"><div class="id"></div><span>Zumo de 1 limón entero — <strong>imprescindible al final</strong></span></div>
        <div class="ii"><div class="id"></div><span>Aceite de coco o ghee · sal marina</span></div>
        <div class="ii"><div class="id"></div><span class="iop">Brotes de alfalfa o lentejas germinadas — optional, encima al servir</span></div>
        <div class="rpasos">
          <div class="ingl">Preparación</div>
          <div class="paso"><div class="pn">1</div><div>Sofríe la cebolla y el ajo en aceite de coco 5 minutos hasta dorar.</div></div>
          <div class="paso"><div class="pn">2</div><div>Añade jengibre, cúrcuma, comino y coriandro. Remueve 1 minuto hasta que liberen el aroma.</div></div>
          <div class="paso"><div class="pn">3</div><div>Incorpora las lentejas, el caldo y la leche de coco. Lleva a ebullición y reduce a fuego suave 15-18 minutos hasta que se deshagan.</div></div>
          <div class="paso"><div class="pn">4</div><div>Añade las espinacas los últimos 2 minutos — solo marchitar.</div></div>
          <div class="paso"><div class="pn">5</div><div>Retira del fuego. Zumo de limón entero — la vitamina C activa la absorción del hierro de las lentejas hasta 6 veces.<span class="ptip">Sin el limón, pierdes la mayor parte del hierro disponible. Añadir siempre en frío.</span></div></div>
          <div class="paso"><div class="pn">6</div><div>Sirve con brotes de alfalfa o lentejas germinadas encima si tienes — son la fuente más concentrada de cumestanos (fitoestrógenos potentes).</div></div>
        </div>
        <div class="rnota"><strong>Por qué este plato:</strong> Las lentejas rojas tienen el ratio proteína/fibra más eficiente de todas las legumbres y se digieren sin pesadez. La leche de coco aporta ácido láurico antiinflamatorio intestinal. El limón activa la absorción del hierro no hemo. La cúrcuma apoya la detoxificación hepática estrogénica. Los brotes de alfalfa tienen coumestrol — el fitoestrógeno con mayor afinidad por ER-β de toda la dieta.</div>
      </div>
    </div>
  </div>

  <div class="cta-reto">
    <p class="cta-ey">🌸 Reto · 28 días · 29€</p>
    <p class="cta-title">Equilibrio hormonal<br><em>después de los 45.</em></p>
    <p class="cta-desc">28 días trabajando el estrobioma, los fitoestrógenos, la detoxificación hepática, la densidad ósea y el sueño hormonal. Con recetas, audios y seguimiento real.</p>
    <div class="cta-list">
      <div class="cta-li"><span class="cta-check">✓</span> 28 recetas hormonales — una por día</div>
      <div class="cta-li"><span class="cta-check">✓</span> 8 audios de apoyo</div>
      <div class="cta-li"><span class="cta-check">✓</span> Seguimiento semanal con tu índice Food·Mood</div>
      <div class="cta-li"><span class="cta-check">✓</span> Informe hormonal personalizado al completar</div>
      <div class="cta-li"><span class="cta-check">✓</span> Protocolo de mantenimiento post-reto</div>
    </div>
    <a href="https://www.food-mood.app/retos/equilibrio-hormonal-45/dia/1" class="cta-btn">Empezar el reto ahora →</a>
    <p class="cta-precio">29€ · Acceso inmediato · Pago seguro vía Stripe</p>
  </div>

  <div class="cierre">
    <p class="cierre-text">Las legumbres llevan milenios en la dieta mediterránea. Lo que ha cambiado es que ahora sabemos exactamente por qué funcionan. Y por qué cuatro o cinco raciones a la semana cambian la experiencia de la menopausia más que la mayoría de suplementos hormonales naturales del mercado.</p>
    <div class="firma"><div class="fn">S. Ferreras</div><div class="fc">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div></div>
  </div>
  <div class="disc"><div class="disc-in"><div class="disc-ico">📖</div><div class="disc-txt"><strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud.</div></div></div>
  <div class="footer"><div class="flogo">Food·Mood</div><div class="furl">food-mood.app</div><div class="fcopy">© 2026 Food·Mood</div></div>
</div>
</body>
</html>`
}
