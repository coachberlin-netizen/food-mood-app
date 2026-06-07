export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — La menopausia se come el músculo</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#1A100E;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-50px;right:-30px;width:260px;height:260px;border-radius:50%;background:rgba(180,80,40,0.15)}
  .header::after{content:'';position:absolute;bottom:-20px;left:-20px;width:160px;height:160px;border-radius:50%;background:rgba(255,107,53,0.08)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',serif;font-size:16px;color:rgba(245,240,232,0.4);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#FF6B35}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FF6B35;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:36px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:18px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#E8A058}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .lead{font-family:'DM Serif Display',serif;font-size:21px;color:#6B2737;line-height:1.4;margin-bottom:18px}
  .bt{font-size:15px;line-height:1.75;color:#4a3a3e}
  .bt p{margin-bottom:14px}
  .bt p:last-child{margin-bottom:0}
  .bt strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(232,160,88,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pq-text em{color:#E8A058;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .sl{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb strong{color:#6B2737;font-weight:500}
  .dato-box{background:linear-gradient(135deg,#fdf5e0,#f5eaec);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center}
  .dato-num{font-family:'DM Serif Display',serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px}
  .dato-label{font-size:13px;color:#7a5c63;line-height:1.5}
  .dato-label strong{color:#6B2737}
  .protocolo-box{background:#fff;border-radius:14px;border:2px solid #6B2737;padding:20px 24px;margin:20px 0}
  .pb-title{font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:#6B2737;margin-bottom:14px}
  .pb-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0e8e0}
  .pb-row:last-child{border-bottom:none}
  .pb-label{font-size:13px;color:#4a3a3e;font-weight:500}
  .pb-value{font-size:13px;color:#6B2737;font-weight:600}
  .pb-nota{font-size:11px;color:#9e8080;margin-top:2px}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#fdf5e0,#f5eaec);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#8a5a00;margin-bottom:6px}
  .rnombre{font-family:'DM Serif Display',serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px}
  .rmeta{font-size:12px;color:#9e8080}
  .rbody{padding:20px 24px}
  .ingl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px}
  .ii{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#4a3a3e;padding:4px 0;line-height:1.4}
  .id{width:5px;height:5px;border-radius:50%;background:#FF6B35;flex-shrink:0;margin-top:6px}
  .iop{color:#9e8080;font-style:italic}
  .rpasos{border-top:1px solid #f0e8e0;padding-top:16px;margin:16px 0}
  .paso{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#4a3a3e;line-height:1.55}
  .pn{width:22px;height:22px;border-radius:50%;background:#6B2737;color:#F5F0E8;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .ptip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:3px}
  .rnota{background:#fdf5e0;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5a00;line-height:1.65;border-left:3px solid #FF6B35;margin-top:4px}
  .rnota strong{color:#7a5a00}
  .cta-reto{padding:36px 40px;background:#1A100E;text-align:center;border-bottom:1px solid #2a1a0e}
  .cta-ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#FF6B35;margin-bottom:16px}
  .cta-title{font-family:'DM Serif Display',serif;font-size:26px;color:#F5F0E8;font-weight:400;margin-bottom:12px;line-height:1.2}
  .cta-title em{font-style:italic;color:#FF6B35}
  .cta-desc{font-size:14px;color:rgba(245,240,232,0.65);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto}
  .cta-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left;max-width:360px;margin-left:auto;margin-right:auto}
  .cta-li{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(245,240,232,0.75)}
  .cta-check{color:#FF6B35;font-weight:700;flex-shrink:0}
  .cta-btn{display:inline-block;background:#FF6B35;color:#1A100E;font-size:15px;font-weight:600;padding:15px 32px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
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
  @media(max-width:480px){.header,.intro,.ciencia,.receta-section,.pullquote,.cta-reto,.cierre,.disc,.footer{padding-left:24px;padding-right:24px}.h-title{font-size:28px}}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo-row"><span class="logo-text">Food·Mood</span><div class="logo-dot"></div><span class="logo-text">Equilibrio hormonal 45+</span></div>
    <div class="eyebrow">Newsletter · Salud hormonal femenina</div>
    <div class="h-title">La menopausia se come<br>el músculo.<br><em>La proteína lo frena.</em></div>
    <div class="h-sub">Perder músculo después de los 45 no es inevitable. Pero requiere más proteína de la que probablemente estás tomando — y en el momento correcto del día.</div>
  </div>

  <div class="intro">
    <p class="lead">El músculo no es estético. Es el mayor órgano metabólico y endocrino del cuerpo.</p>
    <div class="bt">
      <p>Los músculos tienen más receptores de estrógenos y andrógenos que ningún otro tejido fuera del sistema reproductivo. Cuando los estrógenos caen, el músculo pierde su protector. La sarcopenia — pérdida de masa muscular — se acelera hasta tres veces respecto al periodo premenopáusico.</p>
      <p>Y no es solo una cuestión de fuerza. <strong>Menos músculo significa peor sensibilidad a la insulina, más grasa visceral, más riesgo cardiovascular, peor equilibrio hormonal general.</strong> El músculo regula la glucosa, produce mioquinas antiinflamatorias y actúa como reservorio de aminoácidos para la síntesis hormonal.</p>
      <p>La intervención más eficaz: más proteína. Pero no solo más — distribuida correctamente y con suficiente leucina por toma para superar la resistencia anabólica que la menopausia instala en el músculo.</p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pq-text">El músculo es el órgano que más receptores hormonales tiene.<br>Perderlo es perder <em>sensibilidad hormonal.</em><br>La proteína es la herramienta más directa para no perderlo.</p>
  </div>

  <div class="ciencia">
    <p class="sl">💡 Resistencia anabólica y umbral de leucina</p>
    <div class="dato-box">
      <div class="dato-num">50–100%</div>
      <div class="dato-label">más leucina por toma necesitan las mujeres de 45+<br><strong>para producir la misma síntesis proteica muscular que a los 25.</strong></div>
    </div>
    <div class="cb">
      <p>La resistencia anabólica es la reducción de la respuesta del músculo a la proteína de la dieta que ocurre con la caída de estrógenos. No basta con comer proteína — hay que superar un umbral de leucina más alto para que el músculo reciba la señal de sintetizar.</p>
      <p>Ese umbral está en <strong>2,5 a 3 g de leucina por toma</strong>, lo que equivale a 25-35 g de proteína de alta calidad. Con menos, el músculo no activa mTOR — el interruptor de la síntesis proteica — de forma suficiente.</p>
    </div>
    <div class="protocolo-box">
      <div class="pb-title">Protocolo de proteína para mujeres 45+</div>
      <div class="pb-row"><div><div class="pb-label">Ingesta total diaria</div><div class="pb-nota">Según peso corporal</div></div><div class="pb-value">1,4–1,8 g/kg/día</div></div>
      <div class="pb-row"><div><div class="pb-label">Por toma (mínimo)</div><div class="pb-nota">Para activar mTOR</div></div><div class="pb-value">25–35 g</div></div>
      <div class="pb-row"><div><div class="pb-label">Tomas por día</div><div class="pb-nota">Distribuidas</div></div><div class="pb-value">3–4 tomas</div></div>
      <div class="pb-row"><div><div class="pb-label">Leucina por toma</div><div class="pb-nota">El activador clave</div></div><div class="pb-value">2,5–3 g mínimo</div></div>
      <div class="pb-row"><div><div class="pb-label">Toma más importante</div><div class="pb-nota">Ventana anabólica matutina</div></div><div class="pb-value">Desayuno</div></div>
    </div>
    <div class="mrow"><div class="micon">🥚</div><div class="mtext"><strong>Huevo + salmón + legumbres = leucina completa</strong>El huevo entero tiene 0,5 g de leucina por unidad. El salmón tiene 1,8 g por 100 g. Las lentejas tienen 1,2 g por 100 g cocidas. Combinando dos o tres fuentes en la misma toma, el umbral de leucina de 2,5 g se alcanza fácilmente.<div class="mref">Witard et al., 2016 · Nutr Rev · Growing older with health and vitality: a nexus of physical activity, exercise and nutrition</div></div></div>
    <div class="mrow"><div class="micon">⏰</div><div class="mtext"><strong>El desayuno proteico es la toma más importante</strong>El ayuno nocturno activa el catabolismo muscular (degradación). La primera proteína del día detiene ese proceso. En mujeres menopáusicas, un desayuno con 25-30 g de proteína tiene un efecto anabólico muscular superior al de la misma proteína tomada a cualquier otra hora del día.<div class="mref">Areta et al., 2013 · J Physiol · Timing and distribution of protein ingestion during prolonged recovery</div></div></div>
  </div>

  <div class="receta-section">
    <p class="sl">🍽 La receta — El desayuno proteico</p>
    <div class="rc">
      <div class="rh">
        <div class="rmood">Masa muscular · 28–32 g de proteína por ración</div>
        <div class="rnombre">Huevos revueltos con salmón, espinacas y pan de centeno</div>
        <div class="rmeta">⏱ 10 min · Desayuno · La toma más importante del día</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes (1 persona)</div>
        <div class="ii"><div class="id"></div><span>3 huevos ecológicos — 18 g proteína + leucina + colina + D3</span></div>
        <div class="ii"><div class="id"></div><span>60 g de salmón ahumado — 11 g proteína + DHA + astaxantina</span></div>
        <div class="ii"><div class="id"></div><span>1 puñado de espinacas frescas — hierro + folato + magnesio</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharadita de ghee</span></div>
        <div class="ii"><div class="id"></div><span>1 rebanada de pan de centeno tostado</span></div>
        <div class="ii"><div class="id"></div><span>Eneldo fresco · cebolleta · sal marina · pimienta negra</span></div>
        <div class="rpasos">
          <div class="ingl">Preparación</div>
          <div class="paso"><div class="pn">1</div><div>Calienta el ghee a fuego medio-bajo. Añade las espinacas 1 minuto hasta que se marchiten.</div></div>
          <div class="paso"><div class="pn">2</div><div>Bate los huevos con sal y pimienta. Viértelos sobre las espinacas. Remueve muy lentamente con espátula — los huevos revueltos perfectos tardan 3-4 min a fuego suave y quedan cremosos.<span class="ptip">Si cuajan rápido, el fuego está demasiado alto. Paciencia.</span></div></div>
          <div class="paso"><div class="pn">3</div><div>Retira antes de que estén completamente cuajados — el calor residual termina la cocción.</div></div>
          <div class="paso"><div class="pn">4</div><div>Coloca el salmón ahumado encima en lonchas. Eneldo y cebolleta al final.</div></div>
          <div class="paso"><div class="pn">5</div><div>Pan de centeno tostado al lado. Este desayuno tiene 28-32 g de proteína y 2,8 g de leucina — por encima del umbral anabólico.</div></div>
        </div>
        <div class="rnota"><strong>Por qué este desayuno:</strong> La combinación huevo + salmón supera el umbral de leucina (2,5 g) necesario para activar la síntesis proteica muscular en la menopausia. El ghee aporta ácido butírico para el intestino. Las espinacas añaden folato para la metilación estrogénica. El salmón aporta DHA para las membranas celulares. Tomado antes de las 9h, capitaliza el pico de cortisol matutino — que en condiciones normales activa la síntesis muscular en lugar de degradarla.</div>
      </div>
    </div>
  </div>

  <div class="cta-reto">
    <p class="cta-ey">🌸 Reto · 28 días · 29€</p>
    <p class="cta-title">Equilibrio hormonal<br><em>después de los 45.</em></p>
    <p class="cta-desc">El reto incluye el protocolo completo de proteína distribuida, las recetas de los 28 días y el seguimiento de tu índice Food·Mood semana a semana.</p>
    <div class="cta-list">
      <div class="cta-li"><span class="cta-check">✓</span> 28 recetas hormonales — una por día</div>
      <div class="cta-li"><span class="cta-check">✓</span> 8 audios de apoyo</div>
      <div class="cta-li"><span class="cta-check">✓</span> Seguimiento semanal con tu índice Food·Mood</div>
      <div class="cta-li"><span class="cta-check">✓</span> Informe hormonal personalizado al completar</div>
      <div class="cta-li"><span class="cta-check">✓</span> Protocolo de mantenimiento post-reto</div>
    </div>

    <p class="cta-precio">29€ · Acceso inmediato · Pago seguro vía Stripe</p>
  </div>

  <div class="cierre">
    <p class="cierre-text">La pérdida de músculo en la menopausia no es un destino inevitable. Es un proceso que se frena con proteína suficiente, distribuida correctamente y tomada en el momento correcto. Empieza mañana por el desayuno.</p>
    <div class="firma"><div class="fn">S. Ferreras</div><div class="fc">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div></div>
  </div>
  <div class="disc"><div class="disc-in"><div class="disc-ico">📖</div><div class="disc-txt"><strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud.</div></div></div>
  <div class="footer"><div class="flogo">Food·Mood</div><div class="furl">food-mood.app</div><div class="fcopy">© 2026 Food·Mood</div></div>
</div>
</body>
</html>`
}
