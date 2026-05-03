export function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — De Japón a Perú. Seis fermentos, seis civilizaciones.</title>
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
  .fermento-block{margin-bottom:20px;border-radius:14px;overflow:hidden;border:1px solid #e8ddd5}
  .fb-header{padding:12px 18px;display:flex;align-items:center;gap:10px}
  .fb-flag{font-size:20px;flex-shrink:0}
  .fb-country{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#9e8080}
  .fb-name{font-size:15px;font-weight:500;color:#6B2737;margin-top:1px}
  .fb-mood{display:inline-block;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:rgba(201,168,76,0.15);color:#C9A84C;margin-left:auto;flex-shrink:0}
  .fb-body{padding:14px 18px 16px;background:#fff;font-size:13px;color:#4a3a3e;line-height:1.7}
  .fb-body strong{color:#6B2737;font-weight:500}
  .fb-tip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:8px;padding-top:8px;border-top:1px solid #f0e8e0}
  .mrow{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .micon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mtext{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mtext strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .ritual-section{padding:28px 40px;background:#fff8f0;border-top:1px solid #e0d5c8;border-bottom:1px solid #e0d5c8}
  .rs-card{background:#6B2737;border-radius:14px;padding:20px 24px}
  .rs-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:#C9A84C;margin-bottom:10px}
  .rs-title{font-family:'DM Serif Display',serif;font-size:18px;color:#F5F0E8;margin-bottom:12px;font-weight:400}
  .rs-text{font-size:13px;color:rgba(245,240,232,0.8);line-height:1.65}
  .rs-text strong{color:#C9A84C}
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
    <div class="eyebrow">Nº 11 · Fermentos del Mundo</div>
    <h1 class="h-title">De Japón a Perú.<br><em>Lo que seis civilizaciones</em><br>aprendieron sobre el eje<br>intestino-cerebro.</h1>
    <p class="h-sub">No lo llamaban microbiota. No tenían escáneres de resonancia. Pero llevaban milenios afinando fermentos que regulan el humor, la energía y la calma. La ciencia moderna los está poniendo al día.</p>
  </div>

  <!-- ALERT BANNER -->
  <div class="alert-banner">
    <div class="ab-inner">
      <div class="ab-icon">🌍</div>
      <div class="ab-text">
        Tu intestino no necesita un probiótico. Necesita un <strong>ecosistema</strong>. Cada civilización construyó el suyo con lo que tenía en la despensa.
      </div>
    </div>
  </div>

  <!-- INTRO -->
  <div class="intro">
    <p class="lead">La fermentación no es una tendencia. Es la tecnología alimentaria más antigua de la humanidad — y cada cultura la apuntó, sin saberlo, hacia el mismo objetivo.</p>
    <div class="bt">
      <p>Bacillus subtilis en Japón. Lactobacillus plantarum en Corea. Lactobacilos en los valles del Nilo. Levaduras salvajes en los Andes. Distintas bacterias, distintos sustratos, distintos continentes — pero el mismo resultado convergente: alimentos que modulan el eje intestino-cerebro y producen metabolitos psicoactivos.</p>
      <p>No es coincidencia. Es evolución culinaria paralela. Las culturas que fermentaban vivían mejor, enfermaban menos y tenían rituales de cohesión social construidos alrededor de esos alimentos. <strong>Lo que ahora llamamos probióticos, ellos lo llamaban tradición.</strong></p>
      <p>Esta edición es un viaje por seis fermentos de seis rincones del mundo — con la ciencia que explica por qué cada uno afecta al cerebro de una forma distinta y concreta.</p>
    </div>
  </div>

  <!-- PULLQUOTE -->
  <div class="pullquote">
    <p class="pq-text">"En Japón hay lechos de fermentación con más de 100 años que se heredan de madre a hija. Cada mano que los ha tocado ha dejado su huella bacteriana. <em>Un fermento no es un alimento. Es una biblioteca viva.</em>"</p>
  </div>

  <!-- LOS 6 FERMENTOS -->
  <div class="ciencia">
    <p class="sl">Seis fermentos, seis mecanismos</p>
    <div class="cb" style="margin-bottom:20px;">
      <p>Cada fermento activa vías distintas del eje intestino-cerebro. El mood que asociamos a cada uno no es poético — es el resultado directo de los metabolitos que producen sus bacterias.</p>
    </div>

    <!-- Natto de garbanzos -->
    <div class="fermento-block">
      <div class="fb-header" style="background:#f5eaec;">
        <div class="fb-flag">🇯🇵</div>
        <div>
          <div class="fb-country">Japón</div>
          <div class="fb-name">Natto de garbanzos</div>
        </div>
        <div class="fb-mood">Focus</div>
      </div>
      <div class="fb-body">
        <strong>Bacillus subtilis</strong> fermenta cualquier legumbre cocida y produce dos metabolitos que no existen en ningún otro alimento: <strong>nattokinasa</strong> (enzima que disuelve microcoágulos en los capilares cerebrales — más flujo, más oxígeno, más claridad) y <strong>vitamina K2</strong> (que dirige el calcio a los huesos y lo extrae de las arterias). La legumbre es solo el sustrato. La bacteria hace el trabajo.
        <br><br>Con garbanzos en lugar de soja ganas: más triptófano (precursor de serotonina), sin isoflavonas estrogénicas (apto para todo el mundo), más fibra prebiótica y un sabor más suave para el paladar mediterráneo.
        <span class="fb-tip">Truco: una cucharadita de AOVE antes de inocular compensa la menor grasa del garbanzo y optimiza el crecimiento bacteriano.</span>
      </div>
    </div>

    <!-- Triángulo coreano -->
    <div class="fermento-block">
      <div class="fb-header" style="background:#f0edf5;">
        <div class="fb-flag">🇰🇷</div>
        <div>
          <div class="fb-country">Corea</div>
          <div class="fb-name">El triángulo fermentado: Kimchi · Gochujang · Doenjang</div>
        </div>
        <div class="fb-mood">Tres moods</div>
      </div>
      <div class="fb-body">
        Corea tiene tres fermentos fundamentales que cubren tres estados emocionales distintos. No es casualidad — es bioquímica ancestral.
        <br><br>
        <strong>Kimchi → Activación:</strong> Lactobacillus plantarum produce GABA (el neurotransmisor que calma la hiperactividad neuronal) mientras la capsaicina del chile libera dopamina y endorfinas. Resultado paradójico: energía sin ansiedad. El chile te despierta, el GABA te equilibra.
        <br><br>
        <strong>Gochujang → Activación intensa:</strong> Si el kimchi es el despertador, esto es el espresso doble. Pasta de chile fermentada durante meses. Más capsaicina por gramo, más endorfinas. Aspergillus oryzae predigiere las isoflavonas haciéndolas biodisponibles como antioxidantes.
        <br><br>
        <strong>Doenjang → Calma:</strong> El ácido glutámico activa receptores que envían señales de saciedad profunda al cerebro vía nervio vago. No es saciedad calórica — es saciedad neurológica. Una sopa doenjang a las ocho de la tarde es calma líquida.
        <span class="fb-tip">Los coreanos consumen los tres a diario. Tienen una de las menores tasas de cáncer digestivo del mundo.</span>
      </div>
    </div>

    <!-- Injera -->
    <div class="fermento-block">
      <div class="fb-header" style="background:#f5f0e8;">
        <div class="fb-flag">🇪🇹</div>
        <div>
          <div class="fb-country">Etiopía</div>
          <div class="fb-name">Injera</div>
        </div>
        <div class="fb-mood">Social</div>
      </div>
      <div class="fb-body">
        Pan de teff fermentado 72 horas. El teff tiene <strong>7,6 mg de hierro por 100 g</strong> — más que cualquier cereal del planeta. Pero contiene fitatos que bloquean la absorción. La fermentación de tres días los degrada, multiplicando la biodisponibilidad del hierro por tres. Sin hierro no hay oxígeno cerebral; sin oxígeno no hay concentración.
        <br><br>
        Los lactobacilos producen GABA y ácido láctico simultáneamente. Sin gluten. Pero la dimensión más documentada de la injera no es nutricional: es social. En Etiopía no existen los cubiertos individuales — el cubierto es la propia injera, compartida. <strong>Comer con las manos de un plato común activa los mismos circuitos de oxitocina que un abrazo.</strong> No es primitivismo. Es neuroquímica de 3.000 años.
      </div>
    </div>

    <!-- Borscht -->
    <div class="fermento-block">
      <div class="fb-header" style="background:#f5eaec;">
        <div class="fb-flag">🇺🇦</div>
        <div>
          <div class="fb-country">Ucrania</div>
          <div class="fb-name">Borscht con kéfir</div>
        </div>
        <div class="fb-mood">Reset</div>
      </div>
      <div class="fb-body">
        La remolacha mejora el flujo sanguíneo cerebral hasta un <strong>16%</strong>. Sus nitratos naturales se convierten en óxido nítrico — vasodilatador que ensancha los capilares cerebrales. Las betalaínas (el pigmento púrpura intenso) cruzan la barrera hematoencefálica con efecto neuroprotector directo.
        <br><br>
        El kéfir se añade frío sobre la sopa caliente justo antes de comer. No es estética — es función: el calor destruye los probióticos. Al añadirlo en frío en el último momento, las 40 cepas del kéfir llegan vivas al intestino mientras los nutrientes de la remolacha ya están biodisponibles. El resultado son las espirales rosadas más bonitas de la cocina mundial — y la combinación más inteligente de calor y cultivo vivo.
        <span class="fb-tip">Antes de los suplementos, existían los platos inteligentes.</span>
      </div>
    </div>

    <!-- Tepache + Chicha -->
    <div class="fermento-block">
      <div class="fb-header" style="background:#f0edf5;">
        <div class="fb-flag">🌎</div>
        <div>
          <div class="fb-country">México · Perú</div>
          <div class="fb-name">Tepache + Chicha Morada</div>
        </div>
        <div class="fb-mood">Social</div>
      </div>
      <div class="fb-body">
        <strong>Tepache (México):</strong> cáscaras de piña + piloncillo + canela fermentados 48 horas. Espumoso, dulce-ácido, con burbujas naturales. La bromelina reduce neuroinflamación; los ácidos orgánicos alimentan bacterias productoras de serotonina.
        <br><br>
        <strong>Chicha morada (Perú):</strong> maíz morado con piña, canela, clavo y lima. El color violeta intenso es pura antocianina — el pigmento más neuroprotector del mundo vegetal. Las antocianinas cruzan la barrera hematoencefálica y protegen las neuronas del estrés oxidativo. La fermentación multiplica su biodisponibilidad.
        <br><br>
        El elemento compartido entre ambas bebidas no es el ingrediente — es el protocolo social. Preparar juntos, esperar juntos, beber juntos. Esa secuencia activa tres vías de neurotransmisores simultáneamente: <strong>dopamina</strong> (anticipación), <strong>oxitocina</strong> (vínculo) y <strong>serotonina</strong> (bienestar). No es el fermento solo. Es el fermento compartido.
      </div>
    </div>

  </div>

  <!-- DATO -->
  <div class="ciencia" style="padding-top:24px;padding-bottom:24px;">
    <div class="dato-box">
      <div class="dato-num">×3</div>
      <div class="dato-label">La fermentación de 72h del teff en la injera etíope <strong>multiplica por 3 la biodisponibilidad del hierro</strong> al degradar los fitatos que lo bloquean. La misma lógica aplica al natto y la soja: el proceso fermentativo no solo añade — transforma lo que ya estaba.</div>
    </div>
  </div>

  <!-- MROWS: mecanismos transversales -->
  <div class="ciencia" style="padding-top:8px;">
    <p class="sl">Lo que tienen en común</p>

    <div class="mrow">
      <div class="micon">🦠</div>
      <div class="mtext">
        <strong>Convergencia microbiana a través de continentes</strong>
        Lactobacilos en Korea, Etiopía y Japón. Aspergillus en Korea y Japón. Saccharomyces en América y Europa del Este. Culturas sin ningún contacto entre sí convergieron en las mismas familias de microorganismos porque son las que mejor convierten carbohidratos complejos en metabolitos que el sistema nervioso puede usar: GABA, ácido láctico, vitaminas B, K2. La evolución culinaria y la evolución microbiana se seleccionaron mutuamente.
        <span class="mref">Marco &amp; Heeney et al., 2017 · Dimidi et al., 2019</span>
      </div>
    </div>

    <div class="mrow">
      <div class="micon">🧘</div>
      <div class="mtext">
        <strong>El nukazuke y el mindfulness involuntario</strong>
        En Japón hay nukadoko — lechos de salvado de arroz fermentado — con más de 100 años activos, heredados de generación en generación. Cada día, alguien sumerge las manos desnudas y remueve. Las bacterias de la piel se integran en el ecosistema; el nukadoko lleva la huella microbiológica de cada mano que lo tocó durante décadas. El gesto diario — sentir la textura, la temperatura, oler si los ácidos están equilibrados — es una conversación sensorial con un organismo vivo. Las verduras que salen llevan vitaminas B1 y B6 (energía cerebral, síntesis de serotonina) y GABA producido por los lactobacilos. Reset intestinal y ritual contemplativo en el mismo gesto.
      </div>
    </div>

    <div class="mrow">
      <div class="micon">🍫</div>
      <div class="mtext">
        <strong>El fermento social y la dopamina de la anticipación</strong>
        Tepache, chicha morada, kvass ruso, kombucha china. Todas son bebidas fermentadas de baja graduación diseñadas estructuralmente para compartir: requieren 24–72 horas de espera, lo que significa que alguien las preparó para que otro las bebiera. La neurociencia del regalo y la anticipación activa los mismos circuitos de dopamina que el acto de consumir. El fermento empieza a hacer su trabajo antes de que llegue a la boca.
      </div>
    </div>
  </div>

  <!-- RITUAL SECTION -->
  <div class="ritual-section">
    <p class="sl" style="color:rgba(107,39,55,0.5)">Para llevar a casa</p>
    <div class="rs-card">
      <div class="rs-label">El ecosistema mínimo viable</div>
      <div class="rs-title">No necesitas seis fermentos. Necesitas tres que cubran los tres moods básicos.</div>
      <div class="rs-text">
        <strong>Para la mañana (Activación):</strong> Kimchi o kéfir en el desayuno. Capsaicina o Lactobacillus que despiertan el eje intestino-cerebro antes que el café.<br><br>
        <strong>Para la tarde (Focus):</strong> Natto de garbanzos o miso. Nattokinasa o ácido glutámico — flujo cerebral y claridad.<br><br>
        <strong>Para la noche (Reset/Calma):</strong> Doenjang en sopa, borscht con kéfir frío, o simplemente chucrut al lado de lo que cenes. El fermento nocturno es el que más impacto tiene en la calidad del sueño.
      </div>
    </div>
  </div>

  <!-- RECETA -->
  <div class="receta-section">
    <p class="sl">Receta de la edición</p>
    <div class="cb" style="margin-bottom:16px;">
      <p>El borscht con kéfir es la receta más antiinflamatoria de esta edición. La clave técnica es una sola: el kéfir siempre frío, siempre al servir, nunca al cocinar.</p>
    </div>

    <div class="rc">
      <div class="rh">
        <div class="rmood">Reset · Neuroprotección · Microbiota</div>
        <div class="rnombre">Borscht con Kéfir</div>
        <div class="rmeta">Para 2 personas · 35 min · Sin gluten · Fácil</div>
      </div>
      <div class="rbody">
        <div class="ingl">Ingredientes</div>

        <div class="ii"><div class="id"></div><span>2 remolachas medianas crudas, peladas y ralladas (nitratos + betalaínas)</span></div>
        <div class="ii"><div class="id"></div><span>1 cebolla pequeña, picada fina</span></div>
        <div class="ii"><div class="id"></div><span>1 zanahoria mediana, rallada</span></div>
        <div class="ii"><div class="id"></div><span>1 patata mediana, en dados pequeños</span></div>
        <div class="ii"><div class="id"></div><span>750 ml de caldo de verduras o pollo (sin sal añadida)</span></div>
        <div class="ii"><div class="id"></div><span>1 cucharada de vinagre de manzana <em class="iop">(fija el color + activa nitratos)</em></span></div>
        <div class="ii"><div class="id"></div><span>AOVE, sal marina, pimienta negra</span></div>
        <div class="ii"><div class="id"></div><span>4–6 cucharadas de kéfir natural sin azúcar — <em class="iop">frío, al servir</em></span></div>
        <div class="ii"><div class="id"></div><span>Eneldo fresco picado para terminar</span></div>

        <div class="rpasos">
          <div class="ingl">Preparación</div>

          <div class="paso">
            <div class="pn">1</div>
            <div>Sofríe la cebolla con AOVE a fuego medio 5 minutos. Añade la zanahoria rallada y sofríe 3 minutos más.
              <span class="ptip">El sofrito previo desarrolla el umami base sin necesidad de caldo con sal.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">2</div>
            <div>Agrega la remolacha rallada, la patata en dados y el caldo. Lleva a ebullición, reduce el fuego y cocina 20 minutos tapado.</div>
          </div>
          <div class="paso">
            <div class="pn">3</div>
            <div>Fuera del fuego, añade el vinagre de manzana. Ajusta de sal. El vinagre fija el color púrpura intenso de las betalaínas — sin él la sopa vira a marrón.
              <span class="ptip">Las betalaínas son sensibles al calor y al pH. El ácido las estabiliza.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">4</div>
            <div>Sirve en bol. Añade 2–3 cucharadas de kéfir frío directamente sobre la sopa caliente justo en el momento de comer. Las espirales rosadas que se forman son pura función: probióticos vivos + nitratos biodisponibles en el mismo plato.
              <span class="ptip">El kéfir nunca al cocinar. El calor destruye los probióticos. Siempre frío, siempre al final.</span>
            </div>
          </div>
          <div class="paso">
            <div class="pn">5</div>
            <div>Termina con eneldo fresco y pimienta negra recién molida.</div>
          </div>
        </div>

        <div class="rnota">
          <strong>Por qué funciona:</strong> Nitratos → óxido nítrico → +16% de flujo cerebral. Betalaínas neuroprotectoras que cruzan la barrera hematoencefálica. 40 cepas probióticas del kéfir vivas en tu intestino. Todo en un bol de 35 minutos que lleva haciéndose en Ucrania desde el siglo XIX.
        </div>
      </div>
    </div>
  </div>

  <!-- CIERRE -->
  <div class="cierre">
    <p class="sl">Para terminar</p>
    <div class="bt">
      <p>La fermentación es el único proceso culinario que crea cosas que no existían en el ingrediente original: nattokinasa en un garbanzo, K2 en una soja, GABA en un repollo, betalaínas protegidas por ácido láctico en una remolacha. Es creación, no solo transformación.</p>
      <p>Cada fermento de esta edición lo descubrió alguien que no tenía laboratorio, que solo tenía tiempo, temperatura y curiosidad. Esa es la parte que nunca caduca.</p>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="ft-logo">Food·Mood</div>
    <p class="ft">
      Neurociencia aplicada al plato. Cada domingo.<br>
      <a href="https://www.food-mood.app">food-mood.app</a> · <a href="https://www.food-mood.app/fermentos-del-mundo">Fermentos del Mundo</a> · <a href="https://www.food-mood.app/glosario">Glosario científico</a><br><br>
      Si no deseas recibir más newsletters, responde con "baja" a este email.
    </p>
  </div>

</div>
</body>
</html>`
}
