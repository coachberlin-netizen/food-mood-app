export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Estrógeno, Lactobacillus y pH vaginal</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#1A0E1A;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-50px;right:-30px;width:260px;height:260px;border-radius:50%;background:rgba(155,142,196,0.15)}
  .header::after{content:'';position:absolute;bottom:-20px;left:-20px;width:160px;height:160px;border-radius:50%;background:rgba(255,107,53,0.08)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',serif;font-size:16px;color:rgba(245,240,232,0.4);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#FF6B35}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FF6B35;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:34px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:18px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#FF6B35}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .lead{font-family:'DM Serif Display',serif;font-size:21px;color:#6B2737;line-height:1.4;margin-bottom:18px}
  .bt{font-size:15px;line-height:1.75;color:#4a3a3e}
  .bt p{margin-bottom:14px}
  .bt p:last-child{margin-bottom:0}
  .bt strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(255,107,53,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pq-text em{color:#FF6B35;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .sl{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb strong{color:#6B2737;font-weight:500}
  .cadena{display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin:20px 0}
  .cp{background:#fff;border:1px solid #e8ddd5;border-radius:10px;padding:9px 13px;font-size:12px;font-weight:500;color:#6B2737;flex-shrink:0}
  .ca{font-size:14px;color:#FF6B35;padding:0 4px;flex-shrink:0}
  .ph-visual{display:flex;gap:0;margin:20px 0;border-radius:12px;overflow:hidden;border:1px solid #e8ddd5}
  .ph-good{flex:1;background:linear-gradient(135deg,#e8f5e8,#d8f0d8);padding:16px;text-align:center}
  .ph-bad{flex:1;background:linear-gradient(135deg,#f5eaec,#f0d8d8);padding:16px;text-align:center}
  .ph-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
  .ph-good .ph-label{color:#2d6a2d}
  .ph-bad .ph-label{color:#6B2737}
  .ph-value{font-family:'DM Serif Display',serif;font-size:28px;line-height:1;margin-bottom:4px}
  .ph-good .ph-value{color:#2d6a2d}
  .ph-bad .ph-value{color:#6B2737}
  .ph-desc{font-size:11px;color:#7a5c63;line-height:1.4}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .taboo-box{background:#9B8EC4;border-radius:14px;padding:20px 24px;margin:24px 0}
  .tb-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,0.6);margin-bottom:8px}
  .tb-text{font-size:14px;color:#fff;line-height:1.65}
  .tb-text strong{color:#fdf5e0}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#f5eaec,#fdf5e0);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#6B2737;margin-bottom:6px}
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
  .rnota{background:#f5eaec;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5c63;line-height:1.65;border-left:3px solid #6B2737;margin-top:4px}
  .rnota strong{color:#6B2737}
  .cta-reto{padding:36px 40px;background:#1A0E1A;text-align:center;border-bottom:1px solid #2a1a2a}
  .cta-ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#FF6B35;margin-bottom:16px}
  .cta-title{font-family:'DM Serif Display',serif;font-size:26px;color:#F5F0E8;font-weight:400;margin-bottom:12px;line-height:1.2}
  .cta-title em{font-style:italic;color:#FF6B35}
  .cta-desc{font-size:14px;color:rgba(245,240,232,0.65);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto}
  .cta-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left;max-width:360px;margin-left:auto;margin-right:auto}
  .cta-li{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(245,240,232,0.75)}
  .cta-check{color:#FF6B35;font-weight:700;flex-shrink:0}
  .cta-btn{display:inline-block;background:#FF6B35;color:#1A0E1A;font-size:15px;font-weight:600;padding:15px 32px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
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
  @media(max-width:480px){.header,.intro,.ciencia,.receta-section,.pullquote,.cta-reto,.cierre,.disc,.footer{padding-left:24px;padding-right:24px}.h-title{font-size:28px}.ph-visual{flex-direction:column}}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo-row"><span class="logo-text">Food·Mood</span><div class="logo-dot"></div><span class="logo-text">Equilibrio hormonal 45+</span></div>
    <div class="eyebrow">Newsletter · Salud hormonal femenina</div>
    <div class="h-title">Estrógeno,<br>Lactobacillus<br><em>y pH vaginal.</em></div>
    <div class="h-sub">Hay una conexión entre lo que comes, las bacterias de tu intestino y la salud íntima. Es directa, es real, y nadie te la enseñó.</div>
  </div>

  <div class="intro">
    <p class="lead">La sequedad, la irritación y las infecciones recurrentes después de los 45 tienen una causa bacteriana — y una solución alimentaria.</p>
    <div class="bt">
      <p>El estrógeno hacía algo silencioso pero crucial: estimulaba la producción de glucógeno en el epitelio vaginal. Ese glucógeno alimentaba a Lactobacillus crispatus y reuteri, que producían ácido láctico y mantenían el pH vaginal entre 3,8 y 4,5 — el entorno ácido que protege contra infecciones y mantiene la mucosa sana.</p>
      <p>Cuando los estrógenos bajan, el glucógeno baja, Lactobacillus pierde su sustrato y el pH sube a 5-7. <strong>Ese cambio de pH permite el crecimiento de bacterias oportunistas que en el entorno ácido no podían proliferar.</strong> Infecciones recurrentes, irritación, disconfort.</p>
      <p>Pero aquí está lo que cambia esta newsletter: los Lactobacillus reuteri y rhamnosus administrados por vía oral han demostrado colonización vaginal en estudios clínicos. Lo que comes afecta al pH vaginal. Directamente.</p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pq-text">El kéfir que tomas en el desayuno<br>puede colonizar la mucosa vaginal.<br><em>El intestino y la salud íntima hablan el mismo idioma bacteriano.</em></p>
  </div>

  <div class="ciencia">
    <p class="sl">Glucógeno epitelial, Lactobacillus y pH vaginal</p>
    <div class="ph-visual">
      <div class="ph-good">
        <div class="ph-label">Con estrógenos</div>
        <div class="ph-value">3,8–4,5</div>
        <div class="ph-desc">pH ácido protector.<br>Lactobacillus dominante.<br>Barrera bacteriana activa.</div>
      </div>
      <div class="ph-bad">
        <div class="ph-label">Sin estrógenos</div>
        <div class="ph-value">5–7</div>
        <div class="ph-desc">pH elevado permisivo.<br>Lactobacillus en minoría.<br>Bacterias oportunistas activas.</div>
      </div>
    </div>
    <div class="cadena">
      <div class="cp">Estrógenos</div><div class="ca">→</div>
      <div class="cp">Glucógeno epitelial</div><div class="ca">→</div>
      <div class="cp">L. crispatus</div><div class="ca">→</div>
      <div class="cp">Ácido láctico</div><div class="ca">→</div>
      <div class="cp">pH 3,8–4,5</div>
    </div>
    <div class="mrow"><div class="micon">🦠</div><div class="mtext"><strong>L. reuteri y rhamnosus orales → colonización vaginal</strong>Dos estudios clínicos mostraron que la administración oral de Lactobacillus reuteri RC-14 y Lactobacillus rhamnosus GR-1 produce colonización detectable en la mucosa vaginal en 4-6 semanas. Las bacterias viajan desde el tracto digestivo al tracto urogenital por vía perineal. El kéfir natural sin pasteurizar contiene ambas cepas.<div class="mref">Reid et al., 2003 · FEMS Immunol Med Microbiol · Oral use of Lactobacillus rhamnosus GR-1 and L. reuteri RC-14</div></div></div>
    <div class="mrow"><div class="micon">🌱</div><div class="mtext"><strong>Lignanos del lino → receptor ER-β epitelial vaginal</strong>Los lignanos del lino molido actúan como fitoestrógenos selectivos con actividad sobre los receptores ER-β del epitelio vaginal. Estimulan de forma suave la producción local de glucógeno — el sustrato que alimenta a Lactobacillus — sin el efecto proliferativo de los estrógenos sobre mama y útero.<div class="mref">Brooks et al., 2004 · Maturitas · Phytoestrogens and vaginal atrophy</div></div></div>
    <div class="mrow"><div class="micon">🫐</div><div class="mtext"><strong>Proantocianidinas de arándanos → anti-adherencia bacteriana</strong>Las proantocianidinas de los arándanos inhiben la adherencia de bacterias patógenas al epitelio urogenital — el mismo mecanismo por el que se usan en infecciones urinarias de repetición. Reducen la capacidad de E. coli y otras bacterias oportunistas de colonizar la mucosa cuando el pH sube.<div class="mref">Howell et al., 2005 · J Sci Food Agric · Inhibition of the adherence of P-fimbriated Escherichia coli</div></div></div>

    <div class="taboo-box">
      <div class="tb-label">Lo que nadie dice en voz alta</div>
      <div class="tb-text">La atrofia vulvovaginal afecta al <strong>50-60% de las mujeres postmenopáusicas</strong>. Solo el 25% lo comenta con su médico. No es debilidad ni vergüenza — es un síntoma con causas biológicas concretas y herramientas reales para gestionarlo. La dieta es una de ellas. Y es la que más se ignora.</div>
    </div>
  </div>

  <div class="receta-section">
    <p class="sl">Tu cambio de hoy</p>
    <div class="rc">
      <div class="rh">
        <div class="rmood">Microbioma vaginal · L. reuteri + L. rhamnosus + lignanos + proantocianidinas</div>
        <div class="rnombre">Bol de kéfir con lino molido, arándanos y miel de manuka</div>
        <div class="rmeta">5 min · Desayuno · El más directo para el microbioma vaginal</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes</div>
        <div class="ii"><div class="id"></div><span>150 ml de kéfir natural sin azúcar — 30-50 cepas incluyendo L. reuteri y L. rhamnosus</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada de semillas de lino dorado molidas en el momento — lignanos fitoestrógenos</span></div>
        <div class="ii"><div class="id"></div><span>60 g de arándanos frescos o congelados — proantocianidinas anti-adherencia</span></div>
        <div class="ii"><div class="id"></div><span>60 g de frambuesas</span></div>
        <div class="ii"><div class="id"></div><span>20 g de nueces crudas</span></div>
        <div class="ii"><div class="id"></div><span class="iop">1 cucharadita de miel de manuka — metilglioxal antimicrobiano natural, opcional</span></div>
        <div class="rpasos">
          <div class="ingl">Preparación</div>
          <div class="paso"><div class="pn">1</div><div>Muele el lino en el momento en un molinillo de café.<span class="ptip">Imprescindible molerlo en el momento — el lino molido guardado pierde los lignanos en horas.</span></div></div>
          <div class="paso"><div class="pn">2</div><div>Vierte el kéfir en bol. Añade el lino molido encima.</div></div>
          <div class="paso"><div class="pn">3</div><div>Distribuye los arándanos, las frambuesas y las nueces.</div></div>
          <div class="paso"><div class="pn">4</div><div>Miel de manuka al final si la usas — su metilglioxal tiene actividad antimicrobiana documentada que el calor destruye, por lo que siempre se añade en frío.</div></div>
        </div>
        <div class="rnota"><strong>Por qué este desayuno para el microbioma vaginal:</strong> El kéfir tiene entre 30 y 50 cepas bacterianas incluyendo L. reuteri y L. rhamnosus — las dos con mayor evidencia en colonización vaginal por vía oral. El lino añade lignanos que actúan sobre los receptores ER-β del epitelio vaginal estimulando suavemente la producción de glucógeno. Los arándanos aportan proantocianidinas que inhiben la adherencia de bacterias patógenas al epitelio. La miel de manuka añade metilglioxal con actividad antimicrobiana natural. Cuatro ingredientes. Cuatro mecanismos de protección íntima.</div>
      </div>
    </div>
  </div>

  <div class="cta-reto">
    <p class="cta-ey">Reto · 28 días · 29€</p>
    <p class="cta-title">Equilibrio hormonal<br><em>después de los 45.</em></p>
    <p class="cta-desc">El día 20 del reto está dedicado íntegramente al microbioma vaginal — con la receta, el audio y el protocolo completo de probióticos orales.</p>
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
    <p class="cierre-text">La salud íntima no es un tema secundario ni de poca importancia. Afecta a la calidad de vida, al bienestar emocional y a la autoestima de millones de mujeres en silencio. El kéfir de mañana es una intervención real. Empieza con el desayuno.</p>
    <div class="firma"><div class="fn">S. Ferreras</div><div class="fc">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div></div>
  </div>
  <div class="disc"><div class="disc-in"><div class="disc-ico">📖</div><div class="disc-txt"><strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud.</div></div></div>
  <div class="footer"><div class="flogo">Food·Mood</div><div class="furl">food-mood.app</div><div class="fcopy">© 2026 Food·Mood</div></div>
</div>
</body>
</html>`
}
