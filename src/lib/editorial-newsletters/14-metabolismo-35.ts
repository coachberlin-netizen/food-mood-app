export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Sigues comiendo como con 25</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#111010;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-40px;right:-30px;width:280px;height:280px;border-radius:50%;background:rgba(201,168,76,0.1)}
  .header::after{content:'';position:absolute;bottom:-30px;left:-20px;width:180px;height:180px;border-radius:50%;background:rgba(107,39,55,0.12)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',serif;font-size:16px;color:rgba(245,240,232,0.4);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#C9A84C}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:38px;font-weight:400;color:#F5F0E8;line-height:1.08;margin-bottom:20px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#C9A84C}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .lead{font-family:'DM Serif Display',serif;font-size:22px;color:#6B2737;line-height:1.35;margin-bottom:20px}
  .bt{font-size:15px;line-height:1.75;color:#4a3a3e}
  .bt p{margin-bottom:14px}
  .bt p:last-child{margin-bottom:0}
  .bt strong{color:#2a1a1e;font-weight:500}
  .bt em{color:#6B2737;font-style:italic}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(201,168,76,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:20px;font-style:italic;color:#F5F0E8;line-height:1.5;position:relative;z-index:1}
  .pq-text em{color:#C9A84C;font-style:normal}
  .cambios{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .sl{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:20px}
  .cambio-card{background:#fff;border-radius:14px;border:1px solid #e8ddd5;padding:18px 20px;margin-bottom:12px;display:flex;gap:16px;align-items:flex-start}
  .cambio-num{font-family:'DM Serif Display',serif;font-size:32px;color:#e8ddd5;line-height:1;flex-shrink:0;width:36px}
  .cambio-title{font-size:14px;font-weight:500;color:#2a1a1e;margin-bottom:6px}
  .cambio-text{font-size:13px;color:#7a5c63;line-height:1.6}
  .cambio-text strong{color:#6B2737}
  .ciencia{padding:28px 40px;border-bottom:1px solid #e0d5c8;background:#fafaf5}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb p:last-child{margin-bottom:0}
  .cb strong{color:#6B2737;font-weight:500}
  .dato-inline{display:inline-flex;align-items:center;gap:8px;background:#f5eaec;border-radius:8px;padding:4px 12px;margin:4px 0}
  .dato-num{font-family:'DM Serif Display',serif;font-size:20px;color:#6B2737;font-weight:400}
  .dato-desc{font-size:12px;color:#7a5c63}
  .protocolo{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .proto-intro{font-size:15px;line-height:1.75;color:#4a3a3e;margin-bottom:20px}
  .proto-intro strong{color:#6B2737}
  .dia-tipo{background:#fff;border-radius:14px;border:1px solid #e8ddd5;overflow:hidden}
  .dt-header{background:linear-gradient(135deg,#fdf5e0,#f5eaec);padding:14px 20px;border-bottom:1px solid #e8ddd5}
  .dt-label{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#7a5a00;margin-bottom:4px}
  .dt-title{font-family:'DM Serif Display',serif;font-size:16px;color:#2a1a1e;font-weight:400}
  .dt-body{padding:16px 20px}
  .dt-comida{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #f5f0e8;font-size:13px;color:#4a3a3e;line-height:1.4}
  .dt-comida:last-child{border-bottom:none}
  .dt-hora{font-size:11px;color:#9e8080;min-width:52px;font-weight:500;margin-top:1px}
  .dt-proteina{font-size:11px;color:#6B2737;font-weight:500;margin-top:2px}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#fdf5e0,#f5eaec);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#7a5a00;margin-bottom:6px}
  .rnombre{font-family:'DM Serif Display',serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px}
  .rmeta{font-size:12px;color:#9e8080}
  .rbody{padding:20px 24px}
  .ingl{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px}
  .ii{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#4a3a3e;padding:4px 0;line-height:1.4}
  .id{width:5px;height:5px;border-radius:50%;background:#C9A84C;flex-shrink:0;margin-top:6px}
  .iop{color:#9e8080;font-style:italic}
  .rpasos{border-top:1px solid #f0e8e0;padding-top:16px;margin:16px 0}
  .paso{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#4a3a3e;line-height:1.55}
  .pn{width:22px;height:22px;border-radius:50%;background:#6B2737;color:#F5F0E8;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .ptip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:3px}
  .rnota{background:#fdf5e0;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5a00;line-height:1.65;border-left:3px solid #C9A84C;margin-top:4px}
  .rnota strong{color:#7a5a00}
  .cta-section{padding:36px 40px;background:#111010;border-bottom:1px solid #1a1a1a;text-align:center}
  .cta-ey{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px}
  .cta-title{font-family:'DM Serif Display',serif;font-size:26px;color:#F5F0E8;font-weight:400;margin-bottom:12px;line-height:1.2}
  .cta-title em{font-style:italic;color:#C9A84C}
  .cta-desc{font-size:14px;color:rgba(245,240,232,0.65);line-height:1.65;margin-bottom:24px;max-width:440px;margin-left:auto;margin-right:auto}
  .cta-doble{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:8px}
  .cta-btn-a{display:inline-block;background:#C9A84C;color:#111010;font-size:14px;font-weight:600;padding:13px 24px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
  .cta-btn-b{display:inline-block;background:transparent;color:#C9A84C;font-size:14px;font-weight:500;padding:13px 24px;border-radius:30px;text-decoration:none;border:1px solid rgba(201,168,76,0.4);letter-spacing:.02em}
  .cta-precio{font-size:12px;color:rgba(245,240,232,0.35);margin-top:10px}
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
  @media(max-width:480px){.header,.intro,.cambios,.ciencia,.protocolo,.receta-section,.pullquote,.cta-section,.cierre,.disc,.footer{padding-left:24px;padding-right:24px}.h-title{font-size:30px}.cta-doble{flex-direction:column;align-items:center}}
</style>
</head>
<body>
<div class="wrapper">

  <div class="header">
    <div class="logo-row">
      <span class="logo-text">Food·Mood</span>
      <div class="logo-dot"></div>
      <span class="logo-text">Energía &amp; Metabolismo</span>
    </div>
    <div class="eyebrow">Newsletter · Para mujeres de 35+</div>
    <div class="h-title">Sigues comiendo<br>como con 25.<br><em>Tu metabolismo ya no tiene 25.</em></div>
    <div class="h-sub">No es culpa tuya. Nadie te avisó de que el protocolo necesitaba actualizarse. Hoy lo hacemos.</div>
  </div>

  <div class="intro">
    <p class="lead">A los 25 podías comer de todo, moverte poco y despertar sintiéndote bien. No porque tuvieras fuerza de voluntad. Porque tenías hormonas trabajando a pleno rendimiento.</p>
    <div class="bt">
      <p>A los 35 el cuerpo empieza a cambiar. Silenciosamente. La masa muscular baja, la sensibilidad a la insulina se reduce, el cortisol sube más fácil y tarda más en bajar. Y tú sigues comiendo igual que siempre, sin entender por qué el cuerpo ya no responde igual.</p>
      <p><strong>No es que hayas fallado. Es que el protocolo caducó.</strong></p>
      <p>La buena noticia: actualizar el protocolo no significa ponerse a dieta. Significa entender qué tres cosas han cambiado en tu biología y ajustarlas con placer — no con restricción. Porque sí, se puede comer mejor a los 35 que a los 25. <em>Y disfrutarlo más.</em></p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pq-text">A los 35 el problema no es lo que comes.<br>Es que sigues comiendo para un cuerpo<br><em>que ya no existe.</em></p>
  </div>

  <div class="cambios">
    <p class="sl">Lo que cambia después de los 35</p>

    <div class="cambio-card">
      <div class="cambio-num">01</div>
      <div>
        <div class="cambio-title">El músculo ya no se protege solo</div>
        <div class="cambio-text">A partir de los 30-35, la masa muscular empieza a bajar entre un 3 y un 8% por década sin intervención activa. Menos músculo significa peor sensibilidad a la insulina, más grasa visceral y menos energía disponible. <strong>La proteína es el freno más directo.</strong></div>
      </div>
    </div>

    <div class="cambio-card">
      <div class="cambio-num">02</div>
      <div>
        <div class="cambio-title">La glucosa fluctúa más</div>
        <div class="cambio-text">La sensibilidad a la insulina disminuye progresivamente desde los 35. El mismo desayuno de carbohidrato rápido que a los 25 generaba un pico suave, ahora genera un pico más alto y un bajón más brusco. <strong>Resultado: el ataque de hambre de las 11h, el bajón de las 4.</strong></div>
      </div>
    </div>

    <div class="cambio-card">
      <div class="cambio-num">03</div>
      <div>
        <div class="cambio-title">El cortisol tarda más en bajar</div>
        <div class="cambio-text">El sistema nervioso se vuelve más reactivo al estrés crónico. El cortisol elevado de forma sostenida promueve la grasa abdominal, reduce la masa muscular y altera el sueño. <strong>No es estrés psicológico — es bioquímica que se gestiona con la dieta.</strong></div>
      </div>
    </div>
  </div>

  <div class="ciencia">
    <p class="sl">La ciencia detrás — sin ponerse seria</p>
    <div class="cb">
      <p>Tres números que lo explican todo:</p>
      <p><span class="dato-inline"><span class="dato-num">30g</span><span class="dato-desc">proteína por toma para activar la síntesis muscular</span></span> — el umbral sube después de los 35. Con 15g ya no es suficiente para activar mTOR, el interruptor que le dice al músculo que crezca.</p>
      <p><span class="dato-inline"><span class="dato-num">3–4×</span><span class="dato-desc">más impacto del desayuno proteico que de cualquier otra toma</span></span> — la ventana matutina, con el cortisol en su pico natural, es el momento en que la proteína tiene mayor efecto anabólico. Desayunar bien a los 35 es más importante que a los 25.</p>
      <p><span class="dato-inline"><span class="dato-num">10 min</span><span class="dato-desc">caminando después de comer</span></span> — reduce el pico de glucosa postprandial hasta un 30% sin necesitar nada más. La intervención más subestimada del metabolismo en la treintena.</p>
      <p>No es una dieta. <strong>Es actualizar tres hábitos que tu cuerpo de 35 necesita y que tu cuerpo de 25 no pedía.</strong></p>
    </div>
  </div>

  <div class="protocolo">
    <p class="sl">Un día de protocolo actualizado — sin restricciones</p>
    <p class="proto-intro">No es un plan estricto. Es un ejemplo de cómo se come con placer cuando el protocolo está actualizado. <strong>Sin contar calorías. Sin pasar hambre. Con cosas buenísimas.</strong></p>
    <div class="dia-tipo">
      <div class="dt-header">
        <div class="dt-label">Día tipo · Protocolo 35+</div>
        <div class="dt-title">El día que no te da bajón a las 4</div>
      </div>
      <div class="dt-body">
        <div class="dt-comida">
          <div class="dt-hora">8:00h</div>
          <div><div>Huevos revueltos con salmón ahumado, espinacas y pan de centeno</div><div class="dt-proteina">~28g proteína · activa mTOR · frena el catabolismo nocturno</div></div>
        </div>
        <div class="dt-comida">
          <div class="dt-hora">11:00h</div>
          <div><div>Yogur griego con nueces y arándanos</div><div class="dt-proteina">~15g proteína · antioxidantes · fibra para el microbioma</div></div>
        </div>
        <div class="dt-comida">
          <div class="dt-hora">13:30h</div>
          <div><div>Pollo al horno con quinoa, aguacate y ensalada verde con limón</div><div class="dt-proteina">~35g proteína · grasas buenas · carbohidrato complejo</div></div>
        </div>
        <div class="dt-comida">
          <div class="dt-hora">13:45h</div>
          <div><div>🚶 10 minutos caminando después de comer</div><div class="dt-proteina">−30% pico de glucosa · activa GLUT4 sin insulina</div></div>
        </div>
        <div class="dt-comida">
          <div class="dt-hora">19:30h</div>
          <div><div>Salmón con brócoli al vapor, arroz integral y vinagreta de cúrcuma</div><div class="dt-proteina">~30g proteína · omega-3 · antiinflamatorio nocturno</div></div>
        </div>
        <div class="dt-comida">
          <div class="dt-hora">21:00h</div>
          <div><div>Onza de chocolate negro &gt;85% con un puñado de nueces</div><div class="dt-proteina">magnesio · teobromina · sistema nervioso en modo noche</div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="receta-section">
    <p class="sl">La receta — El pollo que activa el metabolismo</p>
    <div class="rc">
      <div class="rh">
        <div class="rmood">Metabolismo 35+ · Proteína + músculo + glucosa estable</div>
        <div class="rnombre">Pollo al limón con quinoa, aguacate y hierbas frescas</div>
        <div class="rmeta">30 min · Comida · La base del protocolo actualizado</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes (2 personas)</div>
        <div class="ii"><div class="id"></div><span>2 pechugas de pollo ecológico o contramuslos deshuesados</span></div>
        <div class="ii"><div class="id"></div><span>160 g de quinoa</span></div>
        <div class="ii"><div class="id"></div><span>1 aguacate maduro</span></div>
        <div class="ii"><div class="id"></div><span>Zumo de 1 limón + ralladura</span></div>
        <div class="ii"><div class="id"></div><span>2 dientes de ajo · 2 cucharadas de aceite de oliva virgen extra</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharadita de cúrcuma + ½ cucharadita de pimienta negra</span></div>
        <div class="ii"><div class="id"></div><span>Perejil y cilantro frescos abundantes</span></div>
        <div class="ii"><div class="id"></div><span>Sal marina</span></div>
        <div class="ii"><div class="id"></div><span class="iop">1 puñado de rúcula o espinacas baby para la base</span></div>
        <div class="rpasos">
          <div class="ingl">Preparación</div>
          <div class="paso"><div class="pn">1</div><div>Cuece la quinoa según instrucciones. Reserva.<span class="ptip">La quinoa es proteína completa — todos los aminoácidos esenciales. El único cereal que lo es.</span></div></div>
          <div class="paso"><div class="pn">2</div><div>Marina el pollo con zumo de limón, ajo, aceite, cúrcuma, pimienta y sal durante 10 minutos mínimo.</div></div>
          <div class="paso"><div class="pn">3</div><div>Cocina el pollo en sartén a fuego medio-alto, 5-6 minutos por lado. Debe quedar dorado y jugoso.</div></div>
          <div class="paso"><div class="pn">4</div><div>Monta el plato: base de rúcula o espinacas, quinoa, pollo laminado, aguacate en cubos.<span class="ptip">El aguacate aporta ácido oleico que mejora la sensibilidad insulínica — el cofactor graso del protocolo.</span></div></div>
          <div class="paso"><div class="pn">5</div><div>Perejil y cilantro frescos abundantes. Ralladura de limón. Unas gotas de aceite de oliva al final.</div></div>
          <div class="paso"><div class="pn">6</div><div>Después de comer: 10 minutos caminando. La parte del protocolo que más se ignora y más impacto tiene.</div></div>
        </div>
        <div class="rnota"><strong>Por qué funciona para el metabolismo 35+:</strong> El pollo tiene leucina en cantidad suficiente para superar el umbral de activación muscular. La quinoa aporta proteína vegetal complementaria y fibra que ralentiza la absorción de glucosa. El aguacate tiene ácido oleico que activa PPAR-γ, mejorando la sensibilidad insulínica. La cúrcuma con pimienta reduce la inflamación de bajo grado que interfiere con la señalización de la insulina. Un plato. Cuatro mecanismos metabólicos.</div>
      </div>
    </div>
  </div>

  <div class="cta-section">
    <p class="cta-ey">Dos retos para ti</p>
    <p class="cta-title">Elige tu punto<br><em>de entrada.</em></p>
    <p class="cta-desc">Si el foco es la energía y el metabolismo — empieza por el reset de 7 días. Si quieres el protocolo completo de alimentación emocional — el Food·Mood Reset de 21 días.</p>
    <div class="cta-doble">
      <a href="https://www.food-mood.app/retos/recupera-tu-energia" class="cta-btn-a">Reset energético · 7 días · 19€ →</a>
      <a href="https://www.food-mood.app/retos/slow-food-mood" class="cta-btn-b">Food·Mood Reset · 21 días · Gratis</a>
    </div>
    <p class="cta-precio">Acceso inmediato · Pago seguro vía Stripe</p>
  </div>

  <div class="cierre">
    <p class="cierre-text">El cuerpo de los 35 no es peor que el de los 25. Es diferente. Y diferente tiene soluciones diferentes — no más duras, solo más inteligentes.<br><br>La próxima vez que el cuerpo no responda como esperas, antes de juzgarte, pregúntate si el protocolo está actualizado. Casi siempre, la respuesta es que no. Y casi siempre, se arregla con el desayuno de mañana.</p>
    <div class="firma">
      <div class="fn">S. Ferreras</div>
      <div class="fc">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div>
    </div>
  </div>

  <div class="disc">
    <div class="disc-in">
      <div class="disc-ico">📖</div>
      <div class="disc-txt"><strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible para que puedas tomar decisiones informadas sobre tu salud y bienestar. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud.</div>
    </div>
  </div>

  <div class="footer">
    <div class="flogo">Food·Mood</div>
    <div class="furl">food-mood.app</div>
    <div class="fcopy">© 2026 Food·Mood</div>
  </div>

</div>
</body>
</html>`
}
