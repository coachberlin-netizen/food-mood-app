export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Tus bacterias gestionan el estrógeno</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#1A0E2E;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-50px;right:-30px;width:260px;height:260px;border-radius:50%;background:rgba(107,39,55,0.2)}
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
  .body-text{font-size:15px;line-height:1.75;color:#4a3a3e}
  .body-text p{margin-bottom:14px}
  .body-text p:last-child{margin-bottom:0}
  .body-text strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(255,107,53,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pq-text em{color:#FF6B35;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .section-label{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb strong{color:#6B2737;font-weight:500}
  .cadena{display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin:20px 0}
  .cp{background:#fff;border:1px solid #e8ddd5;border-radius:10px;padding:9px 13px;font-size:12px;font-weight:500;color:#6B2737;flex-shrink:0}
  .ca{font-size:14px;color:#FF6B35;padding:0 4px;flex-shrink:0}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .dato-box{background:linear-gradient(135deg,#f5eaec,#fdf5e0);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center}
  .dato-num{font-family:'DM Serif Display',serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px}
  .dato-label{font-size:13px;color:#7a5c63;line-height:1.5}
  .dato-label strong{color:#6B2737}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#f5eaec,#fdf5e0);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#6B2737;margin-bottom:6px}
  .rnombre{font-family:'DM Serif Display',serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px}
  .rmeta{font-size:12px;color:#9e8080}
  .rbody{padding:20px 24px}
  .ing-label{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px}
  .ii{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#4a3a3e;padding:4px 0;line-height:1.4}
  .id{width:5px;height:5px;border-radius:50%;background:#FF6B35;flex-shrink:0;margin-top:6px}
  .iop{color:#9e8080;font-style:italic}
  .rpasos{border-top:1px solid #f0e8e0;padding-top:16px;margin:16px 0}
  .paso{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#4a3a3e;line-height:1.55}
  .pn{width:22px;height:22px;border-radius:50%;background:#6B2737;color:#F5F0E8;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .ptip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:3px}
  .rnota{background:#f5eaec;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5c63;line-height:1.65;border-left:3px solid #6B2737;margin-top:4px}
  .rnota strong{color:#6B2737}
  .cta-reto{padding:36px 40px;background:#1A0E2E;border-bottom:1px solid #2a1a3e;text-align:center}
  .cta-ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#FF6B35;margin-bottom:16px}
  .cta-title{font-family:'DM Serif Display',serif;font-size:26px;color:#F5F0E8;font-weight:400;margin-bottom:12px;line-height:1.2}
  .cta-title em{font-style:italic;color:#FF6B35}
  .cta-desc{font-size:14px;color:rgba(245,240,232,0.65);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto}
  .cta-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left;max-width:360px;margin-left:auto;margin-right:auto}
  .cta-li{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(245,240,232,0.75)}
  .cta-check{color:#FF6B35;font-weight:700;flex-shrink:0}
  .cta-btn{display:inline-block;background:#FF6B35;color:#1A0E2E;font-size:15px;font-weight:600;padding:15px 32px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
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
    <div class="h-title">Tus bacterias intestinales<br>gestionan el estrógeno.<br><em>Empieza aquí.</em></div>
    <div class="h-sub">Hay un órgano que regula tus hormonas y que nadie te mencionó en la consulta. Se llama estrobioma.</div>
  </div>

  <div class="intro">
    <p class="lead">Lo que ocurre en tu intestino cada mañana influye más en tus hormonas que lo que ocurre en tus ovarios.</p>
    <div class="body-text">
      <p>No es exageración. Existe un conjunto de bacterias intestinales — el estrobioma — cuya función principal es regular cuánto estrógeno circula por tu sangre. Producen una enzima llamada β-glucuronidasa que decide si el estrógeno que el hígado ya ha procesado y enviado a eliminar se reabsorbe o se va.</p>
      <p>Cuando el estrobioma está en equilibrio, el ciclo funciona. Cuando está desequilibrado — por antibióticos, azúcar, estrés o falta de fibra — el estrógeno se reabsorbe en exceso o se elimina demasiado. <strong>Los síntomas de la perimenopausia se amplifican.</strong></p>
      <p>La buena noticia: el estrobioma responde a la dieta en 2 a 4 semanas. Las palancas más directas son el lino molido, la fibra fermentable y los fermentados. Empezamos hoy.</p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pq-text">El estrobioma no es un concepto de medicina alternativa.<br>Es el sistema que regula <em>cuánto estrógeno circula en tu sangre.</em><br>Y se alimenta en el desayuno.</p>
  </div>

  <div class="ciencia">
    <p class="section-label">💡 La idea de hoy — El estrobioma y la β-glucuronidasa</p>
    <div class="dato-box">
      <div class="dato-num">β-GUS</div>
      <div class="dato-label">La β-glucuronidasa: la enzima que decide<br><strong>si el estrógeno se reabsorbe o se elimina.</strong></div>
    </div>
    <div class="cb">
      <p>El hígado conjuga los estrógenos con ácido glucurónico para que se eliminen por la bilis hacia el intestino. En condiciones normales, se van. Pero cuando la β-glucuronidasa bacteriana es excesiva, desconjuga el estrógeno antes de que salga — y vuelve a la circulación.</p>
      <p>El resultado: <strong>dominancia estrogénica relativa</strong> — síntomas premenstruales intensos, reglas irregulares, hinchazón, cambios de humor, mayor riesgo de patología dependiente de estrógenos.</p>
      <p>En el otro extremo: cuando el estrobioma está empobrecido (poca diversidad, poca fibra), la eliminación es excesiva y los niveles caen más rápido de lo que deberían. <strong>Los síntomas de la menopausia se amplifican antes y con más intensidad.</strong></p>
    </div>
    <div class="cadena">
      <div class="cp">Hígado conjuga E2</div><div class="ca">→</div>
      <div class="cp">Bilis → intestino</div><div class="ca">→</div>
      <div class="cp">β-GUS bacteriana</div><div class="ca">→</div>
      <div class="cp">Reabsorción o eliminación</div>
    </div>
    <div class="mrow"><div class="micon">🌱</div><div class="mtext"><strong>Lino molido → lignanos → modulación β-GUS</strong>Los lignanos del lino son fitoestrógenos que actúan como moduladores selectivos de los receptores de estrógenos Y reducen la actividad de la β-glucuronidasa bacteriana. Efecto doble: menos reabsorción excesiva y actividad estrogénica suave cuando los niveles bajan.<div class="mref">Pietinen et al., 2001 · Nutr Cancer · Dietary fiber and lignans in breast cancer risk</div></div></div>
    <div class="mrow"><div class="micon">🦠</div><div class="mtext"><strong>Fermentados → Lactobacillus → β-GUS baja</strong>Las cepas Lactobacillus acidophilus y Bifidobacterium longum reducen la actividad de la β-glucuronidasa intestinal de forma directa. El kéfir y el yogur sin pasteurizar son las fuentes más accesibles.<div class="mref">Kwa et al., 2016 · JNCI · The intestinal microbiome and estrogen receptor-positive female breast cancer</div></div></div>
    <div class="mrow"><div class="micon">🫐</div><div class="mtext"><strong>Fibra fermentable → diversidad microbiana → estrobioma equilibrado</strong>Los arándanos, las frambuesas y las nueces tienen fibra soluble y polifenoles que actúan como prebióticos selectivos para las bacterias que mantienen el estrobioma en equilibrio. 25-30 g de fibra al día es el objetivo mínimo.<div class="mref">Plottel &amp; Blaser, 2011 · Sci Transl Med · Microbiome and malignancy (estrobolome concept)</div></div></div>
  </div>

  <div class="receta-section">
    <p class="section-label">🍽 Tu cambio de hoy — Desayuno de lino y frutos rojos</p>
    <div class="rc">
      <div class="rh">
        <div class="rmood">Equilibrio hormonal · Estrobioma activo</div>
        <div class="rnombre">Bol de yogur con lino molido y frutos rojos</div>
        <div class="rmeta">⏱ 5 min · Desayuno · Todos los días del reto</div>
      </div>
      <div class="rbody">
        <div class="ing-label" style="margin-bottom:10px">Ingredientes</div>
        <div class="ii"><div class="id"></div><span>150 g de yogur natural sin azúcar — o kéfir para mayor diversidad probiótica</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada sopera de semillas de lino dorado — <strong>molidas en el momento</strong></span></div>
        <div class="ii"><div class="id"></div><span>60 g de arándanos frescos o congelados</span></div>
        <div class="ii"><div class="id"></div><span>60 g de frambuesas</span></div>
        <div class="ii"><div class="id"></div><span>20 g de nueces crudas, troceadas</span></div>
        <div class="ii"><div class="id"></div><span class="iop">Té verde o infusión de rooibos — para acompañar</span></div>
        <div class="ii"><div class="id"></div><span class="iop">1 cucharadita de miel cruda — opcional</span></div>
        <div class="rpasos">
          <div class="ing-label">Preparación</div>
          <div class="paso"><div class="pn">1</div><div>Muele las semillas de lino en el momento en un molinillo de café. <span class="ptip">El lino entero pasa sin digerirse. Molido libera los lignanos. Molido y guardado los pierde en horas — siempre fresco.</span></div></div>
          <div class="paso"><div class="pn">2</div><div>Vierte el yogur o kéfir en bol. Añade el lino molido encima.</div></div>
          <div class="paso"><div class="pn">3</div><div>Distribuye los arándanos, las frambuesas y las nueces.</div></div>
          <div class="paso"><div class="pn">4</div><div>Miel cruda al final si la usas. Acompaña con té verde o rooibos sin azúcar.</div></div>
        </div>
        <div class="rnota"><strong>Por qué este desayuno:</strong> El lino molido es la fuente más concentrada de lignanos de toda la dieta humana — actúa como modulador selectivo del receptor de estrógenos y reduce la β-glucuronidasa. El yogur o kéfir aporta Lactobacillus vivos que equilibran el estrobioma directamente. Los arándanos y frambuesas tienen polifenoles prebióticos. Las nueces añaden ácido alfa-linolénico (precursor de omega-3) y fitoestrógenos adicionales. Cinco ingredientes. Cinco mecanismos hormonales.</div>
      </div>
    </div>
  </div>

  <div class="cta-reto">
    <p class="cta-ey">🌸 Reto · 28 días · 29€</p>
    <p class="cta-title">Equilibrio hormonal<br><em>después de los 45.</em></p>
    <p class="cta-desc">Estrobioma, fitoestrógenos, urolitinas, densidad ósea, sueño hormonal y protocolo permanente. 28 días de protocolo nutricional hormonal completo.</p>
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
    <p class="cierre-text">El estrobioma no aparece en las analíticas de rutina. No lo mide ningún test hormonal estándar. Pero influye en cada síntoma que sientes. Empieza a alimentarlo hoy — con el desayuno de arriba. El cuerpo responde antes de lo que crees.</p>
    <div class="firma"><div class="fn">S. Ferreras</div><div class="fc">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div></div>
  </div>

  <div class="disc"><div class="disc-in"><div class="disc-ico">📖</div><div class="disc-txt"><strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud. Las referencias incluidas corresponden a publicaciones revisadas por pares.</div></div></div>
  <div class="footer"><div class="flogo">Food·Mood</div><div class="furl">food-mood.app</div><div class="fcopy">© 2026 Food·Mood</div></div>
</div>
</body>
</html>`
}
