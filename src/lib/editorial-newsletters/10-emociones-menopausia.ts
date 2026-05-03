export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — No es la edad. Es tu cerebro.</title>
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
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#C9A84C}
  .eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C;margin-bottom:20px;position:relative;z-index:1}
  .h-title{font-family:'DM Serif Display',serif;font-size:34px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:18px;position:relative;z-index:1}
  .h-title em{font-style:italic;color:#C9A84C}
  .h-sub{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .alert-banner{background:#6B2737;padding:16px 40px;border-bottom:1px solid #5a1f2e}
  .ab-inner{display:flex;align-items:center;gap:12px}
  .ab-icon{font-size:24px;flex-shrink:0}
  .ab-text{font-size:13px;color:#F5F0E8;line-height:1.5}
  .ab-text strong{color:#C9A84C}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .lead{font-family:'DM Serif Display',serif;font-size:21px;color:#6B2737;line-height:1.4;margin-bottom:18px}
  .bt{font-size:15px;line-height:1.75;color:#4a3a3e}
  .bt p{margin-bottom:14px}
  .bt p:last-child{margin-bottom:0}
  .bt strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',serif;font-size:80px;color:rgba(201,168,76,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pq-text{font-family:'DM Serif Display',serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pq-text em{color:#C9A84C;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .sl{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .cb{font-size:15px;line-height:1.75;color:#4a3a3e}
  .cb p{margin-bottom:14px}
  .cb strong{color:#6B2737;font-weight:500}
  .dato-box{background:linear-gradient(135deg,#fdf5e0,#f5eaec);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center}
  .dato-num{font-family:'DM Serif Display',serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px}
  .dato-label{font-size:13px;color:#7a5c63;line-height:1.5}
  .dato-label strong{color:#6B2737}
  .nut-list{margin:20px 0;display:flex;flex-direction:column;gap:0}
  .nut{display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid #f0e8e0}
  .nut:last-child{border-bottom:none}
  .nut-ico{font-size:22px;flex-shrink:0;width:30px;text-align:center;margin-top:1px}
  .nut-info{flex:1}
  .nut-name{font-size:13px;font-weight:500;color:#6B2737;margin-bottom:3px}
  .nut-desc{font-size:12px;color:#7a5c63;line-height:1.5}
  .nut-src{font-size:11px;color:#b0a0a0;font-style:italic;margin-top:2px}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .cacao-section{padding:28px 40px;background:#fff8f0;border-top:1px solid #e0d5c8;border-bottom:1px solid #e0d5c8}
  .patron-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .patron-card{background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:16px 18px;margin-bottom:12px}
  .patron-card:last-child{margin-bottom:0}
  .patron-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .patron-emoji{font-size:18px}
  .patron-name{font-size:13px;font-weight:500;color:#6B2737}
  .patron-body{font-size:13px;color:#4a3a3e;line-height:1.6;margin-bottom:8px}
  .patron-alt{font-size:12px;color:#C9A84C;font-style:italic;line-height:1.5;padding-top:8px;border-top:1px solid #f0e8e0}
  .pregunta-section{padding:28px 40px;background:#6B2737;border-bottom:1px solid #5a1f2e}
  .preg-title{font-family:'DM Serif Display',serif;font-size:19px;color:#F5F0E8;margin-bottom:16px;line-height:1.35}
  .preg-step{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(245,240,232,0.08)}
  .preg-step:last-child{border-bottom:none}
  .preg-num{width:22px;height:22px;border-radius:50%;background:rgba(201,168,76,0.25);color:#C9A84C;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .preg-q{font-size:13px;color:#F5F0E8;font-weight:500;line-height:1.4}
  .preg-hint{font-size:12px;color:rgba(245,240,232,0.5);margin-top:3px;font-style:italic;line-height:1.4}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .rc{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .rh{background:linear-gradient(135deg,#fdf5e0,#f5eaec);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .rmood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#6B2737;margin-bottom:6px}
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
  .rnota{background:#f5eaec;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5c63;line-height:1.65;border-left:3px solid #6B2737;margin-top:4px}
  .rnota strong{color:#6B2737}
  .cierre{padding:32px 40px 40px;border-bottom:1px solid #e0d5c8}
  .footer{background:#1A1510;padding:32px 40px;text-align:center}
  .ft{font-size:12px;color:rgba(245,240,232,0.35);line-height:1.7}
  .ft a{color:rgba(201,168,76,0.7);text-decoration:none}
  .ft-logo{font-family:'DM Serif Display',serif;font-size:18px;color:rgba(245,240,232,0.5);margin-bottom:12px;letter-spacing:.04em}
</style>
</head>
<body>
<div class="wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-row">
      <span class="logo-text">Food·Mood</span>
      <span class="logo-dot"></span>
      <span style="font-size:10px;color:rgba(245,240,232,0.25);letter-spacing:.08em">Newsletter editorial</span>
    </div>
    <div class="eyebrow">Nº 10 · Menopausia &amp; emociones</div>
    <h1 class="h-title">No es la edad.<br><em>Es tu cerebro</em><br>pidiendo lo que tus<br>hormonas ya no le dan.</h1>
    <p class="h-sub">Cuando bajan los estrógenos, tu cerebro pierde sus tres herramientas para regular el humor. Esto es lo que puedes hacer con el plato.</p>
  </div>

  <!-- ALERT BANNER -->
  <div class="alert-banner">
    <div class="ab-inner">
      <div class="ab-icon">🧠</div>
      <div class="ab-text">
        Los antojos de azúcar, la irritabilidad y la niebla mental no son <strong>"cosas de la edad"</strong>. Son señales de un sistema nervioso que pide recursos concretos.
      </div>
    </div>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p class="lead">¿Tienes más de 45 y todo te sabe distinto? No estás exagerando. Hay una explicación bioquímica muy concreta.</p>
    <div class="bt">
      <p>El estrógeno no solo regula el ciclo. Regula la producción de <strong>serotonina</strong> (el neurotransmisor del bienestar), <strong>dopamina</strong> (la motivación) y <strong>GABA</strong> (la calma). Cuando sus niveles caen en la perimenopausia, tu cerebro pierde simultáneamente sus tres herramientas principales para gestionar el estado de ánimo.</p>
      <p>El resultado es predecible: <strong>irritabilidad que parece venir de la nada</strong>, antojos de azúcar a las 17:00, insomnio a las 3:00 AM, y esa niebla mental que hace que leer un párrafo tres veces no sea suficiente.</p>
      <p>Ninguno de esos síntomas es un fallo de carácter. Son señales de déficit nutricional con dirección conocida. Y la alimentación puede hacer mucho más de lo que te han dicho.</p>
    </div>
  </div>

  <!-- PULLQUOTE -->
  <div class="pullquote">
    <p class="pq-text">"El estrógeno regula la serotonina. Cuando baja el estrógeno, no es que tengas <em>menos paciencia</em>. Es que tienes literalmente <em>menos serotonina</em>."</p>
  </div>

  <!-- CIENCIA: Los 6 nutrientes -->
  <div class="ciencia">
    <p class="sl">Los 6 nutrientes clave</p>
    <p class="cb"><strong>Los 6 nutrientes que tu cerebro pide después de los 45</strong></p>
    <div class="cb" style="margin-bottom:8px;margin-top:8px;">
      <p>No es una lista genérica de "come sano". Son los compuestos con mecanismo de acción directo sobre el sistema nervioso en la menopausia:</p>
    </div>

    <div class="nut-list">
      <div class="nut">
        <div class="nut-ico">🌙</div>
        <div class="nut-info">
          <div class="nut-name">Triptófano → Serotonina</div>
          <div class="nut-desc">Precursor directo de serotonina. Sin triptófano suficiente, no hay serotonina que sintetizar.</div>
          <div class="nut-src">Calabaza, garbanzos, cacao puro, avena, semillas de chía</div>
        </div>
      </div>
      <div class="nut">
        <div class="nut-ico">🧠</div>
        <div class="nut-info">
          <div class="nut-name">Omega-3 DHA → Membranas neuronales</div>
          <div class="nut-desc">El 60% del cerebro es grasa. El DHA mantiene la fluidez de las membranas neuronales y reduce la neuroinflamación.</div>
          <div class="nut-src">Salmón, sardinas, nueces, semillas de chía y lino</div>
        </div>
      </div>
      <div class="nut">
        <div class="nut-ico">🦴</div>
        <div class="nut-info">
          <div class="nut-name">Calcio + Vitamina D → Huesos y humor</div>
          <div class="nut-desc">La vitamina D actúa como neurohormona. Receptores de vitamina D están presentes en el hipocampo y la corteza prefrontal.</div>
          <div class="nut-src">Sardinas con espina, brócoli, sésamo tostado, sol 20 min/día</div>
        </div>
      </div>
      <div class="nut">
        <div class="nut-ico">✨</div>
        <div class="nut-info">
          <div class="nut-name">Magnesio → Anti-estrés, anti-insomnio</div>
          <div class="nut-desc">Cofactor en más de 300 reacciones enzimáticas. Regula el receptor NMDA del glutamato: menos glutamato hiperactivo, menos ansiedad y mejor sueño.</div>
          <div class="nut-src">Cacao puro &gt;85%, almendras, espinacas, aguacate, pipas de calabaza</div>
        </div>
      </div>
      <div class="nut">
        <div class="nut-ico">🌿</div>
        <div class="nut-info">
          <div class="nut-name">Fitoestrógenos → Moduladores suaves</div>
          <div class="nut-desc">Las isoflavonas de la soja y los lignanos del lino se unen al receptor de estrógeno beta con una potencia ~1.000 veces menor que el estradiol. Un apoyo suave, no una sustitución.</div>
          <div class="nut-src">Miso, tempeh, tofu, edamame, lino molido</div>
        </div>
      </div>
      <div class="nut">
        <div class="nut-ico">🛡️</div>
        <div class="nut-info">
          <div class="nut-name">Antioxidantes → Regeneración y neuroprotección</div>
          <div class="nut-desc">El estrés oxidativo aumenta en la perimenopausia. Los polifenoles de frutas rojas y el oleocantal del AOVE reducen la neuroinflamación crónica de bajo grado.</div>
          <div class="nut-src">Arándanos, granada, cúrcuma con pimienta negra, AOVE virgen extra</div>
        </div>
      </div>
    </div>

    <div class="dato-box">
      <div class="dato-num">×20</div>
      <div class="dato-label">La absorción de curcumina aumenta hasta <strong>×20</strong> cuando se combina con pimienta negra (piperina). No es opcional añadirla.</div>
    </div>
  </div>

  <!-- MROWS: mecanismos -->
  <div class="ciencia" style="padding-top:24px;">
    <p class="sl">Mecanismos documentados</p>

    <div class="mrow">
      <div class="micon">🍫</div>
      <div class="mtext">
        <strong>Cacao &gt;85%: no es un capricho, es farmacología</strong>
        Un cuadrado de chocolate negro puro concentra tres compuestos que tu sistema nervioso necesita después de los 45: <em>magnesio</em> (relajante muscular y nervioso, mineral anti-insomnio), <em>teobromina</em> (estimulante suave sin el pico de la cafeína — energía tranquila sin ansiedad) y <em>anandamida</em> (la "molécula de la felicidad", activa los mismos receptores CB1 que los endocannabinoides endógenos). Elige &gt;85% cacao. Come despacio. Sin pantallas.
        <span class="mref">Berk et al., 2008 · Smit &amp; Rogers, 2002</span>
      </div>
    </div>

    <div class="mrow">
      <div class="micon">🌅</div>
      <div class="mtext">
        <strong>El desayuno proteico como ancla hormonal</strong>
        El patrón más común en mujeres en perimenopausia es: control todo el día + explosión de antojos de 20:00 en adelante. La causa casi siempre es la misma: glucosa inestable desde la mañana. Un desayuno con 25–30 g de proteína (huevos, yogur griego, kéfir, salmón ahumado) estabiliza el péptido YY y el GLP-1, reduce el cortisol matutino y literalmente hace desaparecer el atracón nocturno. Tu biología siempre gana a la fuerza de voluntad. Construye el desayuno adecuado y no necesitarás voluntad.
        <span class="mref">Leidy et al., 2013</span>
      </div>
    </div>

    <div class="mrow">
      <div class="micon">🦠</div>
      <div class="mtext">
        <strong>El eje intestino-cerebro y el humor en la menopausia</strong>
        El 90–95% de la serotonina se produce en el intestino, no en el cerebro. Las bacterias del estrobioma regulan la conversión de triptófano en serotonina. Con la caída de estrógenos, la diversidad microbiana tiende a reducirse — lo que cierra aún más el grifo de serotonina intestinal. Los alimentos fermentados (kéfir, miso, kimchi, chucrut) y la fibra prebiótica (puerro, ajo, alcachofa, plátano maduro) son la intervención más directa.
        <span class="mref">Cryan &amp; Dinan, 2012 · Qi et al., 2021</span>
      </div>
    </div>
  </div>

  <!-- PATRONES EMOCIONALES -->
  <div class="patron-section">
    <p class="sl">Los 4 patrones emocionales</p>
    <div class="cb" style="margin-bottom:16px;">
      <p>La próxima vez que abras la nevera sin hambre real, para y observa en cuál de estos patrones estás. No para juzgarte. Para entender qué necesita tu sistema nervioso en ese momento.</p>
    </div>

    <div class="patron-card">
      <div class="patron-header">
        <div class="patron-emoji">🏆</div>
        <div class="patron-name">El Compensador</div>
      </div>
      <div class="patron-body">"Me lo merezco." Comes como recompensa después de un día duro. El alivio dura 15 minutos. La culpa dura horas. El ciclo se repite.</div>
      <div class="patron-alt">→ Alternativa: cacao ceremonial con reishi. Endorfinas + teobromina sin culpa. El ritual importa tanto como el ingrediente.</div>
    </div>

    <div class="patron-card">
      <div class="patron-header">
        <div class="patron-emoji">⚡</div>
        <div class="patron-name">El Ansioso</div>
      </div>
      <div class="patron-body">Comes rápido, sin saborear. Algo crujiente, algo salado. Tu cuerpo ha descubierto un hack: masticar activa el nervio vago y reduce el estrés. Es un mecanismo real, solo que el vehículo no es el óptimo.</div>
      <div class="patron-alt">→ Alternativa: pipas de calabaza tostadas + un cuadrado de chocolate negro. Crujiente + magnesio + serotonina. El hack funciona igual con mejores ingredientes.</div>
    </div>

    <div class="patron-card">
      <div class="patron-header">
        <div class="patron-emoji">🕳️</div>
        <div class="patron-name">El Vacío</div>
      </div>
      <div class="patron-body">No es hambre física — es hambre emocional. Aburrimiento, soledad, falta de estímulo. Miras el paquete vacío y no recuerdas haberlo abierto.</div>
      <div class="patron-alt">→ Antes de abrir la nevera: pregúntate si el hambre está en el estómago o en la cabeza. Si es en la cabeza, haz algo con las manos 10 minutos — cocina un té, corta fruta. El acto de crear rompe el piloto automático.</div>
    </div>

    <div class="patron-card">
      <div class="patron-header">
        <div class="patron-emoji">💥</div>
        <div class="patron-name">El Restrictivo-Explosivo</div>
      </div>
      <div class="patron-body">Control absoluto todo el día. Explosión a las 20:00. Culpa. Promesas. Repetir. Tu biología siempre gana a tu fuerza de voluntad. Siempre.</div>
      <div class="patron-alt">→ La solución no está en más control. Está en un desayuno con proteína + grasa + fibra que estabilice la glucosa desde el minuto cero. El atracón nocturno desaparece cuando el día empieza bien.</div>
    </div>
  </div>

  <!-- LA PREGUNTA -->
  <div class="pregunta-section">
    <p class="preg-title">La próxima vez que sientas un antojo, para 30 segundos. Hazte estas tres preguntas:</p>

    <div class="preg-step">
      <div class="preg-num">1</div>
      <div>
        <div class="preg-q">¿Qué acaba de pasar?</div>
        <div class="preg-hint">Un email, una discusión, una noticia, aburrimiento puro</div>
      </div>
    </div>
    <div class="preg-step">
      <div class="preg-num">2</div>
      <div>
        <div class="preg-q">¿Qué siento en el cuerpo?</div>
        <div class="preg-hint">Mandíbula tensa, nudo en el estómago, pecho cerrado</div>
      </div>
    </div>
    <div class="preg-step">
      <div class="preg-num">3</div>
      <div>
        <div class="preg-q">¿Qué busco realmente?</div>
        <div class="preg-hint">Alivio, placer, distracción, confort, estímulo</div>
      </div>
    </div>

    <div style="margin-top:20px;padding:16px;background:rgba(201,168,76,0.12);border-radius:10px;border-left:3px solid #C9A84C;">
      <p style="font-size:13px;color:#F5F0E8;line-height:1.65;">No es un ejercicio de fuerza de voluntad. Es neuroquímica. El estrés sube el cortisol, el cortisol baja la serotonina, y tu cerebro busca azúcar porque sabe que funciona rápido y sin esfuerzo. Entender el mecanismo no lo elimina — pero te da 30 segundos de distancia. Esos 30 segundos son suficientes para elegir el vehículo correcto.</p>
    </div>
  </div>

  <!-- RECETA -->
  <div class="receta-section">
    <p class="sl">Receta de la edición</p>
    <div class="cb" style="margin-bottom:16px;">
      <p>Un bol que no es una ensalada. Es un plan de acción para tu cerebro: cada ingrediente tiene un mecanismo de acción documentado sobre el sistema nervioso en la menopausia.</p>
    </div>

    <div class="rc">
      <div class="rh">
        <div class="rmood">Focus · Calma · Neuroprotección</div>
        <div class="rnombre">El Bol de los 6 Nutrientes</div>
        <div class="rmeta">Para 1 persona · 20 min · Sin gluten · Alto en proteína</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes</div>

        <div class="ii"><div class="id"></div><span>80 g de quinoa cocida (proteína completa + magnesio)</span></div>
        <div class="ii"><div class="id"></div><span>120 g de salmón al vapor o plancha baja — <em class="iop">omega-3 DHA + vitamina D</em></span></div>
        <div class="ii"><div class="id"></div><span>½ aguacate maduro (ácido oleico + potasio + folatos)</span></div>
        <div class="ii"><div class="id"></div><span>Un puñado generoso de espinacas frescas (hierro + folatos + magnesio)</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada de pipas de calabaza — <em class="iop">triptófano + zinc</em></span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada de semillas de sésamo (calcio biodisponible)</span></div>
        <div class="ii"><div class="id"></div><span>AOVE virgen extra al gusto (polifenoles antiinflamatorios)</span></div>
        <div class="ii"><div class="id"></div><span>½ cucharadita de cúrcuma + pimienta negra recién molida <em class="iop">(×20 biodisponibilidad)</em></span></div>
        <div class="ii"><div class="id"></div><span>Limón exprimido al momento + sal marina</span></div>

        <div class="rpasos">
          <div class="ingl">Preparación</div>

          <div class="paso">
            <div class="pn">1</div>
            <div>Cocina la quinoa en agua o caldo de verduras (doble volumen de agua). Deja reposar 5 min tapada y esponja con un tenedor.
              <span class="ptip">La quinoa es proteína completa — contiene los 9 aminoácidos esenciales incluyendo triptófano.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">2</div>
            <div>Cocina el salmón al vapor, plancha baja o horno a 180°C 12 minutos. La temperatura moderada preserva mejor el DHA que el calor intenso.
              <span class="ptip">Si usas lata de sardinas con espina, mejor aún: añades calcio + vitamina D + omega-3 en una sola fuente.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">3</div>
            <div>Monta el bol: quinoa de base, salmón encima, aguacate en láminas, espinacas frescas (sin cocinar para preservar folatos).
            </div>
          </div>
          <div class="paso">
            <div class="pn">4</div>
            <div>Aliña con AOVE, limón, cúrcuma y pimienta negra. Termina con las pipas de calabaza y el sésamo — siempre en crudo para preservar sus ácidos grasos y el triptófano.
              <span class="ptip">El AOVE + pimienta negra sobre la cúrcuma multiplica la absorción de curcumina hasta ×20. Nunca separes estos tres ingredientes.</span>
            </div>
          </div>
        </div>

        <div class="rnota">
          <strong>Por qué este bol funciona:</strong> Omega-3 para las membranas neuronales, triptófano → serotonina, magnesio para el sueño y el estrés, calcio + vit D para huesos y humor, fitoestrógenos si añades edamame, y polifenoles que reducen la neuroinflamación. No es una ensalada. Es neurología aplicada al plato.
        </div>
      </div>
    </div>
  </div>

  <!-- CIERRE -->
  <div class="cierre">
    <p class="sl">Para terminar</p>
    <div class="bt">
      <p>La nutrición emocional no es comer según las emociones. Es entender tus emociones para comer mejor. Hay una diferencia enorme entre los dos.</p>
      <p>El primer paso no es cambiar lo que comes. Es hacerte una pregunta antes de abrir la nevera: <strong>"¿Tengo hambre en el estómago o hambre en la cabeza?"</strong></p>
      <p>Esa sola pregunta — 30 segundos — rompe el piloto automático más veces de lo que te imaginas. Lo demás viene solo.</p>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="ft-logo">Food·Mood</div>
    <p class="ft">
      Neurociencia aplicada al plato. Cada domingo.<br>
      <a href="https://www.food-mood.app">food-mood.app</a> · <a href="https://www.food-mood.app/test">Descubre tu mood</a> · <a href="https://www.food-mood.app/glosario">Glosario científico</a><br><br>
      Si no deseas recibir más newsletters, responde con "baja" a este email.
    </p>
  </div>

</div>
</body>
</html>`
}
