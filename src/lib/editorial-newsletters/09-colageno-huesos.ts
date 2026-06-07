export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — El estrógeno protege el colágeno</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#1A1510;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-50px;right:-30px;width:260px;height:260px;border-radius:50%;background:rgba(160,120,60,0.15)}
  .header::after{content:'';position:absolute;bottom:-20px;left:-20px;width:160px;height:160px;border-radius:50%;background:rgba(107,39,55,0.1)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',serif;font-size:16px;color:rgba(245,240,232,0.4);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#FF6B35}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#FF6B35;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:34px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:18px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#FF6B35}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .ventana-banner{background:#6B2737;padding:16px 40px;border-bottom:1px solid #5a1f2e}
  .vb-inner{display:flex;align-items:center;gap:12px}
  .vb-icon{font-size:24px;flex-shrink:0}
  .vb-text{font-size:13px;color:#F5F0E8;line-height:1.5}
  .vb-text strong{color:#FF6B35}
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
  .dato-box{background:linear-gradient(135deg,#fdf5e0,#f5eaec);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center}
  .dato-num{font-family:'DM Serif Display',serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px}
  .dato-label{font-size:13px;color:#7a5c63;line-height:1.5}
  .dato-label strong{color:#6B2737}
  .cofactores-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
  .cof{background:#fff;border:1px solid #e8ddd5;border-radius:12px;padding:14px}
  .cof-ico{font-size:20px;margin-bottom:6px}
  .cof-tit{font-size:12px;font-weight:500;color:#6B2737;margin-bottom:4px}
  .cof-txt{font-size:11px;color:#7a5c63;line-height:1.4}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .ventana-section{padding:28px 40px;background:#fff8f0;border-top:1px solid #e0d5c8;border-bottom:1px solid #e0d5c8}
  .vs-card{background:#6B2737;border-radius:14px;padding:20px 24px}
  .vs-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:#FF6B35;margin-bottom:10px}
  .vs-title{font-family:'DM Serif Display',serif;font-size:18px;color:#F5F0E8;margin-bottom:12px;font-weight:400}
  .vs-text{font-size:13px;color:rgba(245,240,232,0.8);line-height:1.65}
  .vs-text strong{color:#FF6B35}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#fdf5e0,#f5eaec);padding:20px 24px;border-bottom:1px solid #e8ddd5}
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
  .cta-reto{padding:36px 40px;background:#1A1510;text-align:center;border-bottom:1px solid #2a2010}
  .cta-ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#FF6B35;margin-bottom:16px}
  .cta-title{font-family:'DM Serif Display',serif;font-size:26px;color:#F5F0E8;font-weight:400;margin-bottom:12px;line-height:1.2}
  .cta-title em{font-style:italic;color:#FF6B35}
  .cta-desc{font-size:14px;color:rgba(245,240,232,0.65);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto}
  .cta-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px;text-align:left;max-width:360px;margin-left:auto;margin-right:auto}
  .cta-li{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(245,240,232,0.75)}
  .cta-check{color:#FF6B35;font-weight:700;flex-shrink:0}
  .cta-btn{display:inline-block;background:#FF6B35;color:#1A1510;font-size:15px;font-weight:600;padding:15px 32px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
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
  @media(max-width:480px){.header,.ventana-banner,.intro,.ciencia,.receta-section,.pullquote,.ventana-section,.cta-reto,.cierre,.disc,.footer{padding-left:24px;padding-right:24px}.h-title{font-size:28px}.cofactores-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo-row"><span class="logo-text">Food·Mood</span><div class="logo-dot"></div><span class="logo-text">Equilibrio hormonal 45+</span></div>
    <div class="eyebrow">Newsletter · Salud hormonal femenina</div>
    <div class="h-title">El estrógeno protege<br>el colágeno y los huesos.<br><em>Cuando baja, tú pones los cofactores.</em></div>
    <div class="h-sub">La pérdida ósea que ocurre en la perimenopausia no es irreversible. Pero hay una ventana. Y estás en ella.</div>
  </div>

  <div class="ventana-banner">
    <div class="vb-inner">
      <div class="vb-icon">⏰</div>
      <div class="vb-text"><strong>Ventana crítica: los 5 primeros años posmenopáusicos.</strong> La velocidad de pérdida ósea y de colágeno es máxima en este período. Actuar ahora puede reducir la pérdida anual a menos del 1%. Después de los 5 años, el ritmo se estabiliza — pero el daño ya está hecho.</div>
    </div>
  </div>

  <div class="intro">
    <p class="lead">Hay una ventana de intervención que la mayoría de mujeres no sabe que existe. Y está ocurriendo ahora.</p>
    <div class="bt">
      <p>El estrógeno hace dos cosas críticas para el esqueleto: estimula los osteoblastos (células que forman hueso nuevo) y frena los osteoclastos (células que reabsorben hueso). También activa la prolil-hidroxilasa, la enzima que estabiliza las fibras de colágeno tipo I.</p>
      <p>Cuando los estrógenos caen, ambos procesos se aceleran en la dirección equivocada. <strong>La pérdida puede llegar al 2-3% de densidad ósea al año en los primeros 5 años posmenopáusicos.</strong> La pérdida de colágeno también es máxima en este período.</p>
      <p>Los cofactores dietéticos correctos — vitamina C, D3+K2, magnesio, proteína, silicio y colágeno hidrolizado — pueden reducir esa pérdida a menos del 1% anual. No es un milagro. Es bioquímica de cofactores.</p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pq-text">Los primeros 5 años posmenopáusicos son<br>la ventana de mayor pérdida ósea.<br><em>Actuar ahora importa más que actuar en 3 años.</em></p>
  </div>

  <div class="ciencia">
    <p class="sl">💡 Los cofactores que el estrógeno ya no puede poner</p>
    <div class="dato-box">
      <div class="dato-num">2–3%</div>
      <div class="dato-label">de densidad ósea perdida al año en los primeros 5 años posmenopáusicos<br><strong>con los cofactores correctos: se reduce a menos del 1%.</strong></div>
    </div>
    <div class="cofactores-grid">
      <div class="cof"><div class="cof-ico">🍊</div><div class="cof-tit">Vitamina C</div><div class="cof-txt">Cofactor de la prolil-hidroxilasa — la enzima que estabiliza el colágeno tipo I. Sin vit C, el colágeno no puede formarse correctamente.</div></div>
      <div class="cof"><div class="cof-ico">☀️</div><div class="cof-tit">D3 + K2</div><div class="cof-txt">D3 activa la absorción de calcio intestinal. K2 (MK-7) dirige ese calcio hacia los huesos activando la osteocalcina. Siempre juntas.</div></div>
      <div class="cof"><div class="cof-ico">✨</div><div class="cof-tit">Magnesio</div><div class="cof-txt">Activa la D3. Sin magnesio, la D3 no puede convertirse en su forma activa en el riñón. Cofactor de la mineralización ósea.</div></div>
      <div class="cof"><div class="cof-ico">💪</div><div class="cof-tit">Proteína</div><div class="cof-txt">La matriz orgánica del hueso es 90% colágeno tipo I. Sin proteína suficiente, no hay estructura donde depositar el calcio.</div></div>
      <div class="cof"><div class="cof-ico">🪨</div><div class="cof-tit">Silicio</div><div class="cof-txt">Cofactor de la reticulación del colágeno — el proceso que da resistencia a las fibras. Fuentes: ortiga, avena integral, pimiento rojo, perejil.</div></div>
      <div class="cof"><div class="cof-ico">🍖</div><div class="cof-tit">Colágeno hidrolizado</div><div class="cof-txt">Aporta glicina, prolina e hidroxiprolina biodisponibles — los aminoácidos específicos de la matriz ósea. El caldo de huesos es la fuente alimentaria más concentrada.</div></div>
    </div>
    <div class="mrow"><div class="micon">🦴</div><div class="mtext"><strong>Prolil-hidroxilasa → colágeno estable → densidad ósea</strong>La prolil-hidroxilasa es la enzima que hidroxila los residuos de prolina en el colágeno, estabilizando su estructura helicoidal. El estrógeno activa esta enzima directamente. Cuando baja, la vitamina C se convierte en el cofactor sustituto principal. Un pimiento rojo fresco tiene 3 veces más vitamina C que una naranja — y el calor la destruye, por eso se añade siempre en crudo.<div class="mref">Natsuyama, 2013 · J Bone Miner Metab · Estrogen receptor and bone metabolism</div></div></div>
    <div class="mrow"><div class="micon">🥛</div><div class="mtext"><strong>D3+K2 → osteocalcina → calcio en hueso</strong>La vitamina K2 en su forma MK-7 activa la proteína osteocalcina, que fija el calcio a la hidroxiapatita de la matriz ósea. Sin K2, el calcio absorbido por la D3 puede depositarse en arterias en lugar de huesos. D3 y K2 son inseparables después de los 45.<div class="mref">Hauschka et al., 1989 · Physiol Rev · Osteocalcin and matrix Gla protein: vitamin K-dependent proteins in bone</div></div></div>
  </div>

  <div class="ventana-section">
    <p class="sl">⏰ Por qué actuar ahora importa más que nunca</p>
    <div class="vs-card">
      <div class="vs-label">La ventana crítica</div>
      <div class="vs-title">5 años. Después el ritmo se estabiliza — pero el daño ya está hecho.</div>
      <div class="vs-text">Los primeros 5 años posmenopáusicos son el período de mayor velocidad de pérdida ósea y de colágeno de toda la vida adulta. <strong>Actuar en esta ventana con los cofactores correctos puede reducir la pérdida anual al 1% o menos.</strong> Después de los 5 años, el ritmo de pérdida se estabiliza de forma natural — pero la densidad ósea que no se protegió en esta ventana no se recupera después. La intervención tiene una fecha de caducidad. No hay una segunda oportunidad en la misma ventana.</div>
    </div>
  </div>

  <div class="receta-section">
    <p class="sl">🍽 La receta — Todos los cofactores en un solo plato</p>
    <div class="rc">
      <div class="rh">
        <div class="rmood">Colágeno · Densidad ósea · Vitamina C + D3 + K2 + Mg + Silicio</div>
        <div class="rnombre">Sopa de caldo de huesos con pimiento rojo fresco y perejil</div>
        <div class="rmeta">⏱ 4-8h caldo lento (o 45 min olla a presión) + 15 min montaje</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes</div>
        <div class="ii"><div class="id"></div><span>500 ml de caldo de huesos (pollo o ternera) — colágeno hidrolizado + glicina + prolina</span></div>
        <div class="ii"><div class="id"></div><span>1 pimiento rojo grande, <strong>fresco</strong> — reservar para añadir al final, sin cocinar, para no perder su vitamina C + silicio</span></div>
        <div class="ii"><div class="id"></div><span>1 puñado generoso de perejil fresco — vitamina K1 + silicio + vitamina C</span></div>
        <div class="ii"><div class="id"></div><span>1 zanahoria en rodajas</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharadita de cúrcuma + pimienta negra</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada de aceite de oliva virgen extra — absorción de D3 y K2</span></div>
        <div class="ii"><div class="id"></div><span>Sal marina</span></div>
        <div class="ingl" style="margin-top:14px">Para acompañar</div>
        <div class="ii"><div class="id"></div><span>1 tostada de pan de centeno con aguacate y zumo de limón</span></div>
        <div class="rpasos">
          <div class="ingl">Preparación</div>
          <div class="paso"><div class="pn">1</div><div>Calienta el caldo de huesos a fuego suave. Añade la zanahoria, la cúrcuma y la pimienta. Cocina 10 minutos hasta que la zanahoria esté tierna.</div></div>
          <div class="paso"><div class="pn">2</div><div>Retira del fuego. Deja templar 2 minutos.</div></div>
          <div class="paso"><div class="pn">3</div><div>Añade el pimiento rojo fresco cortado en tiras finas y el perejil picado — <strong>siempre fuera del fuego, en crudo</strong>.<span class="ptip">El calor destruye la vitamina C y el silicio del pimiento y el perejil. Añadir siempre después de apagar.</span></div></div>
          <div class="paso"><div class="pn">4</div><div>Aceite de oliva en hilo fino. Rectifica de sal y sirve.</div></div>
          <div class="paso"><div class="pn">5</div><div>Acompaña con la tostada de pan de centeno con aguacate y zumo de limón — el aguacate aporta vitamina K y las grasas que maximizan la absorción de D3 y K2.</div></div>
        </div>
        <div class="rnota"><strong>Por qué este plato:</strong> El caldo de huesos largo aporta colágeno hidrolizado, glicina, prolina e hidroxiprolina — los aminoácidos de la matriz ósea en forma biodisponible directa. El pimiento rojo fresco tiene la mayor concentración de vitamina C de toda la verdura, cofactor imprescindible de la prolil-hidroxilasa — y se añade en crudo para conservarla íntegra. El perejil añade vitamina K1 y silicio. El aceite de oliva activa la absorción de todas las vitaminas liposolubles (D3, K2, A). Un solo plato con los seis cofactores de la densidad ósea.</div>
      </div>
    </div>
  </div>

  <div class="cta-reto">
    <p class="cta-ey">🌸 Reto · 28 días · 29€</p>
    <p class="cta-title">Equilibrio hormonal<br><em>después de los 45.</em></p>
    <p class="cta-desc">El reto incluye la semana 3 completa de detoxificación hormonal y protección ósea, con todas las recetas de cofactores y el protocolo permanente post-reto.</p>
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
    <p class="cierre-text">Los cofactores óseos no son suplementos exóticos. Son el pimiento rojo fresco, el perejil, el caldo de huesos, el aguacate y el sol de quince minutos. Lo que cambia es saber que los necesitas ahora — en esta ventana — y no dentro de cinco años.</p>
    <div class="firma"><div class="fn">S. Ferreras</div><div class="fc">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div></div>
  </div>
  <div class="disc"><div class="disc-in"><div class="disc-ico">📖</div><div class="disc-txt"><strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud.</div></div></div>
  <div class="footer"><div class="flogo">Food·Mood</div><div class="furl">food-mood.app</div><div class="fcopy">© 2026 Food·Mood</div></div>
</div>
</body>
</html>`
}
