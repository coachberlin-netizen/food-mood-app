export function buildHtml(): string {
  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — Tu tiroides no está rota. Quizá solo tiene frío.</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --burgundy: #6B2737;
    --cream: #F5F0E8;
    --gold: #C9A84C;
    --dark: #2C1810;
    --muted: #8B7355;
    --teal: #4A7C7E;
    --sage: #7A9E7E;
    --warm: #C4845C;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background-color: #E3DDD3;
    font-family: 'Jost', sans-serif;
    color: var(--dark);
  }

  .email-wrapper {
    max-width: 620px;
    margin: 40px auto;
    background: var(--cream);
  }

  /* HEADER */
  .header {
    background: var(--teal);
    padding: 30px 48px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    color: var(--cream);
    letter-spacing: 4px;
    text-transform: uppercase;
  }
  .logo span { color: var(--gold); }

  .header-meta { text-align: right; }
  .header-meta .label {
    font-size: 9px; font-weight: 500; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--gold); display: block;
  }
  .header-meta .date {
    font-size: 10px; font-weight: 300;
    color: rgba(245,240,232,0.45); letter-spacing: 1px;
  }

  /* HERO */
  .hero {
    position: relative;
    background: #3D6668;
    padding: 58px 48px 50px;
    overflow: hidden;
  }

  .hero::after {
    content: 'tiroides';
    position: absolute;
    bottom: -28px; right: -14px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 120px;
    font-weight: 600;
    font-style: italic;
    color: rgba(245,240,232,0.04);
    pointer-events: none;
    line-height: 1;
  }

  .kicker {
    display: inline-block;
    font-size: 9px; font-weight: 500;
    letter-spacing: 3.5px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 18px;
  }

  .hero h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 46px; font-weight: 300;
    line-height: 1.12; color: var(--cream);
    margin-bottom: 22px; letter-spacing: -0.5px;
  }

  .hero h1 em {
    font-style: italic; color: var(--gold); display: block;
  }

  .hero-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(245,240,232,0.62);
    line-height: 1.8; max-width: 440px;
    border-left: 2px solid rgba(201,168,76,0.6);
    padding-left: 18px;
  }

  /* BODY */
  .body { padding: 48px 48px 0; }

  .intro-drop {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; font-style: italic;
    color: var(--teal); line-height: 1.55;
    margin-bottom: 24px; padding-bottom: 24px;
    border-bottom: 1px solid rgba(74,124,126,0.2);
  }

  .body p {
    font-size: 15px; font-weight: 300;
    line-height: 1.85; color: #3A2A1E; margin-bottom: 18px;
  }
  .body p strong { font-weight: 500; color: var(--teal); }

  /* WHAT IS IT BOX */
  .what-box {
    border: 1px solid rgba(74,124,126,0.25);
    padding: 26px 28px; margin: 28px 0;
    background: rgba(74,124,126,0.05);
    position: relative;
  }
  .what-box::before {
    content: 'QUÉ ES EXACTAMENTE';
    position: absolute; top: -9px; left: 20px;
    background: var(--teal); color: var(--cream);
    font-size: 8.5px; font-weight: 500;
    letter-spacing: 2.5px; padding: 2px 10px;
  }
  .what-box h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400;
    color: var(--teal); margin-bottom: 10px;
  }
  .what-box p { font-size: 14px; margin-bottom: 0; line-height: 1.75; }
  .what-box p strong { color: var(--teal); }

  /* SÍNTOMAS */
  .sintomas-block {
    background: var(--dark);
    margin: 0 -48px; padding: 44px 48px;
  }

  .sintomas-block .kicker { margin-bottom: 16px; }

  .sintomas-block h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 300;
    color: var(--cream); line-height: 1.2; margin-bottom: 16px;
  }
  .sintomas-block h2 em { font-style: italic; color: var(--gold); }

  .sintomas-block .intro-text {
    font-size: 14px; font-weight: 300;
    color: rgba(245,240,232,0.62);
    line-height: 1.8; margin-bottom: 28px;
  }

  .sintoma-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2px; margin-bottom: 28px;
  }

  .sintoma-tile {
    background: rgba(245,240,232,0.05);
    padding: 16px 14px;
    text-align: center;
  }

  .sintoma-tile .s-icon {
    font-size: 22px; margin-bottom: 8px; display: block;
  }

  .sintoma-tile .s-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-style: italic;
    color: var(--cream); margin-bottom: 4px;
  }

  .sintoma-tile .s-note {
    font-size: 10.5px; font-weight: 300;
    color: rgba(245,240,232,0.4);
    line-height: 1.4; font-style: italic;
  }

  .sintomas-block .disclaimer {
    border-left: 2px solid var(--gold);
    padding: 14px 18px;
    background: rgba(201,168,76,0.07);
  }
  .sintomas-block .disclaimer p {
    font-size: 13px; font-weight: 300;
    color: rgba(245,240,232,0.7);
    line-height: 1.75; margin-bottom: 0;
  }
  .sintomas-block .disclaimer p strong {
    color: var(--gold); font-weight: 500;
  }

  /* SECTION TITLE */
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 300;
    color: var(--teal); margin: 40px 0 6px; line-height: 1.2;
  }
  .section-title em { font-style: italic; }
  .teal-rule { width: 40px; height: 1.5px; background: var(--teal); margin-bottom: 22px; }

  /* NUTRIENT CARDS */
  .nutrient-item {
    display: flex; gap: 20px;
    margin-bottom: 26px; padding-bottom: 26px;
    border-bottom: 1px solid rgba(74,124,126,0.12);
    align-items: flex-start;
  }
  .nutrient-item:last-child { border-bottom: none; margin-bottom: 0; }

  .nutrient-mineral {
    background: var(--teal);
    color: var(--cream);
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 1px; text-transform: uppercase;
    padding: 8px 10px; text-align: center;
    min-width: 68px; line-height: 1.3;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 3px;
  }

  .nutrient-content h3 {
    font-size: 13px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--teal); margin-bottom: 5px;
  }

  .nutrient-content p {
    margin-bottom: 6px; font-size: 14px;
  }

  .food-chips {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;
  }

  .food-chip {
    background: rgba(74,124,126,0.1);
    border: 1px solid rgba(74,124,126,0.25);
    color: var(--teal);
    font-size: 11px; font-weight: 400;
    padding: 3px 10px; letter-spacing: 0.3px;
  }

  /* PULL QUOTE */
  .pull-quote {
    text-align: center;
    padding: 34px 0;
    border-top: 1px solid rgba(74,124,126,0.15);
    border-bottom: 1px solid rgba(74,124,126,0.15);
    margin: 36px 0;
  }
  .pull-quote blockquote {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 300; font-style: italic;
    color: var(--teal); line-height: 1.4; margin-bottom: 12px;
  }
  .pull-quote cite {
    font-size: 9.5px; font-weight: 400;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--gold); font-style: normal;
  }

  /* LO QUE EVITAR */
  .evitar-block {
    background: rgba(74,124,126,0.07);
    border: 1px solid rgba(74,124,126,0.18);
    padding: 28px 30px; margin: 28px 0;
    position: relative;
  }
  .evitar-block::before {
    content: 'CON MODERACIÓN';
    position: absolute; top: -9px; left: 20px;
    background: var(--warm); color: var(--cream);
    font-size: 8.5px; font-weight: 500;
    letter-spacing: 2.5px; padding: 2px 10px;
  }
  .evitar-block h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400;
    color: var(--dark); margin-bottom: 12px;
  }
  .evitar-list { list-style: none; }
  .evitar-list li {
    font-size: 14px; font-weight: 300;
    color: #3A2A1E; padding: 8px 0;
    border-bottom: 1px solid rgba(74,124,126,0.1);
    line-height: 1.6; padding-left: 14px;
    position: relative;
  }
  .evitar-list li:last-child { border-bottom: none; }
  .evitar-list li::before { content: '—'; position: absolute; left: 0; color: var(--warm); }
  .evitar-list li strong { color: var(--dark); font-weight: 500; }

  /* RECIPE */
  .recipe-block {
    background: #3D6668;
    padding: 44px 48px;
  }

  .recipe-label {
    font-size: 9px; font-weight: 500;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px; display: block;
  }

  .recipe-block h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 300;
    color: var(--cream); margin-bottom: 6px; line-height: 1.2;
  }

  .mood-tag {
    display: inline-block;
    font-size: 9.5px; font-weight: 500;
    letter-spacing: 1.5px; text-transform: uppercase;
    background: var(--gold); color: var(--dark);
    padding: 3px 10px; margin-bottom: 18px;
  }

  .recipe-block .recipe-intro {
    font-size: 14px; font-weight: 300;
    font-style: italic; color: rgba(245,240,232,0.65);
    line-height: 1.75; margin-bottom: 22px;
    border-left: 2px solid rgba(201,168,76,0.5);
    padding-left: 16px;
  }

  .recipe-ingredients {
    list-style: none; display: flex;
    flex-wrap: wrap; gap: 8px; margin-bottom: 22px;
  }
  .recipe-ingredients li {
    background: rgba(245,240,232,0.1);
    border: 1px solid rgba(245,240,232,0.2);
    font-size: 12px; color: rgba(245,240,232,0.8);
    padding: 4px 12px; letter-spacing: 0.3px;
  }

  .recipe-block .recipe-why {
    font-size: 13px; font-weight: 300;
    color: rgba(245,240,232,0.6); line-height: 1.8;
    padding-top: 18px;
    border-top: 1px solid rgba(245,240,232,0.12);
  }
  .recipe-block .recipe-why strong {
    color: var(--gold); font-weight: 500;
  }

  /* ACTITUD */
  .actitud-block {
    background: var(--burgundy);
    padding: 44px 48px;
  }
  .actitud-block .kicker { margin-bottom: 16px; }
  .actitud-block h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 300;
    color: var(--cream); margin-bottom: 18px; line-height: 1.3;
  }
  .actitud-block h2 em { font-style: italic; color: var(--gold); }
  .actitud-block p {
    font-size: 14px; font-weight: 300;
    color: rgba(245,240,232,0.7); line-height: 1.8; margin-bottom: 14px;
  }
  .actitud-block p strong { color: var(--gold); font-weight: 500; }

  /* DISCLAIMER */
  .medical-disclaimer {
    background: rgba(107,39,55,0.07);
    border-left: 3px solid var(--gold);
    padding: 18px 22px; margin: 32px 0;
    font-size: 12px; font-weight: 300;
    color: var(--muted); line-height: 1.7;
    font-style: italic;
  }

  /* CTA */
  .cta-section {
    text-align: center; padding: 46px 48px 40px;
  }
  .cta-section h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 23px; font-weight: 300;
    color: var(--teal); margin-bottom: 14px; font-style: italic;
  }
  .cta-section p {
    font-size: 14px; line-height: 1.8;
    color: var(--dark); margin-bottom: 24px; font-weight: 300;
  }
  .cta-btn {
    display: inline-block;
    background: var(--teal); color: var(--cream);
    text-decoration: none;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    padding: 14px 34px;
  }
  .cta-sub {
    display: block; font-size: 12px;
    color: var(--muted); letter-spacing: 0.3px;
    margin-top: 16px; line-height: 1.6; font-weight: 300;
    max-width: 380px; margin-left: auto; margin-right: auto;
  }

  /* FOOTER */
  .footer {
    background: var(--dark); padding: 22px 48px; text-align: center;
  }
  .footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 300; color: var(--cream);
    letter-spacing: 3px; text-transform: uppercase; margin-bottom: 3px;
  }
  .footer-logo span { color: var(--gold); }
  .footer-url { font-size: 10px; color: rgba(245,240,232,0.3); letter-spacing: 1px; }
  .footer-copy { margin-top: 8px; font-size: 10px; color: rgba(245,240,232,0.15); }

  @media (max-width: 480px) {
    .header, .hero, .body, .recipe-block, .actitud-block, .cta-section, .footer { padding-left: 24px; padding-right: 24px; }
    .sintomas-block { margin: 0 -24px; padding: 36px 24px; }
    .hero h1 { font-size: 34px; }
    .sintoma-grid { grid-template-columns: 1fr 1fr; }
    .pull-quote blockquote { font-size: 20px; }
  }
</style>
</head>
<body>
<div class="email-wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">Food<span>·</span>Mood</div>
    <div class="header-meta">
      <span class="label">Equilibrio Hormonal 45+</span>
      <span class="date">Mayo 2026</span>
    </div>
  </div>

  <!-- HERO -->
  <div class="hero">
    <div class="kicker">Tiroides · Postmenopausia · Energía</div>
    <h1>Tu tiroides no está rota.<br><em>Quizá solo<br>tiene frío.</em></h1>
    <p class="hero-sub">El hipotiroidismo subclínico afecta a una de cada cinco mujeres en postmenopausia. La mayoría lo vive como "cosas de la edad". Pero hay nutrientes concretos que pueden marcar una diferencia real.</p>
  </div>

  <!-- BODY -->
  <div class="body">

    <p class="intro-drop">El cansancio que no cede. El frío que nunca termina. El peso que no responde. A veces no es la edad. A veces es la tiroides.</p>

    <p>La tiroides es una glándula pequeña con un trabajo enorme: regula el metabolismo, la temperatura corporal, el estado de ánimo, la energía, el peso, el ciclo del sueño y la claridad mental. Cuando funciona por debajo de su capacidad —aunque sea levemente— el cuerpo entero lo nota, aunque los análisis no siempre lo reflejen con claridad.</p>

    <p>Y esto tiene una relación directa con la postmenopausia: <strong>la caída de estrógenos puede afectar la sensibilidad de los receptores tiroideos</strong>, lo que hace que la glándula necesite trabajar más para producir el mismo efecto. El resultado es ese estado difuso que muchas mujeres describen como "estoy bien, pero no del todo".</p>

    <div class="what-box">
      <h4>Hipotiroidismo subclínico — ¿qué significa exactamente?</h4>
      <p>Es cuando la TSH (la hormona que le pide a la tiroides que trabaje) está ligeramente elevada, pero la T4 libre todavía es normal. El sistema funciona, pero con más esfuerzo del necesario. <strong>Se estima que puede afectar al 15-20% de las mujeres en postmenopausia</strong>, aunque muchas no reciben diagnóstico formal. No siempre requiere medicación, pero sí merece atención — especialmente nutricional. Siempre con supervisión médica.</p>
    </div>

  </div>

  <!-- SÍNTOMAS -->
  <div class="sintomas-block">
    <span class="kicker">Señales que quizá estás ignorando</span>
    <h2>"Cosas de la edad"<br>que <em>puede</em> que no lo sean</h2>
    <p class="intro-text">Estos síntomas son inespecíficos — pueden tener muchas causas. Pero si reconoces varios a la vez, vale la pena comentarlo con tu médico y pedir analítica de TSH.</p>

    <div class="sintoma-grid">
      <div class="sintoma-tile">
        <span class="s-icon">🌡️</span>
        <div class="s-name">Frío constante</div>
        <div class="s-note">manos, pies, sensación de no calentarse</div>
      </div>
      <div class="sintoma-tile">
        <span class="s-icon">🧠</span>
        <div class="s-name">Bruma mental</div>
        <div class="s-note">memoria, concentración, lentitud cognitiva</div>
      </div>
      <div class="sintoma-tile">
        <span class="s-icon">⚡</span>
        <div class="s-name">Fatiga</div>
        <div class="s-note">que no mejora con el descanso</div>
      </div>
      <div class="sintoma-tile">
        <span class="s-icon">⚖️</span>
        <div class="s-name">Peso resistente</div>
        <div class="s-note">que no responde aunque comas bien</div>
      </div>
      <div class="sintoma-tile">
        <span class="s-icon">💇</span>
        <div class="s-name">Cabello frágil</div>
        <div class="s-note">caída, pérdida de densidad</div>
      </div>
      <div class="sintoma-tile">
        <span class="s-icon">🌙</span>
        <div class="s-name">Sueño pesado</div>
        <div class="s-note">dormir mucho y levantarse agotada</div>
      </div>
    </div>

    <div class="disclaimer">
      <p><strong>Importante:</strong> estos síntomas se solapan con los de la menopausia, el déficit de hierro, el estrés crónico y otros procesos. No se pueden interpretar de forma aislada. Un análisis de sangre —TSH, T4 libre, anticuerpos antitiroideos— es el único punto de partida real. Lo que sigue aquí es apoyo nutricional, no tratamiento.</p>
    </div>
  </div>

  <!-- NUTRIENTES -->
  <div class="body" style="padding-top: 44px;">

    <div class="section-title">Los nutrientes que<br><em>la tiroides necesita</em></div>
    <div class="teal-rule"></div>

    <p>La tiroides depende de una cadena de micronutrientes para fabricar y convertir sus hormonas. Cuando alguno escasea, la maquinaria se ralentiza. La buena noticia es que muchos de estos nutrientes están en alimentos que ya conoces — y que están buenos.</p>

    <div class="nutrient-item">
      <div class="nutrient-mineral">Sele<br>nio</div>
      <div class="nutrient-content">
        <h3>El más crítico para la conversión hormonal</h3>
        <p>La tiroides es el órgano con mayor concentración de selenio del cuerpo. Este mineral puede ayudar a convertir la T4 —la hormona inactiva— en T3, la que el cuerpo realmente usa. Un déficit se asocia con mayor riesgo de alteración tiroidea. <strong>Dos nueces de Brasil al día cubren la necesidad estimada</strong> — y con eso basta, más no es mejor.</p>
        <div class="food-chips">
          <span class="food-chip">Nueces de Brasil (2-3/día)</span>
          <span class="food-chip">Sardinas</span>
          <span class="food-chip">Huevo entero</span>
          <span class="food-chip">Gambas</span>
          <span class="food-chip">Cereales integrales</span>
        </div>
      </div>
    </div>

    <div class="nutrient-item">
      <div class="nutrient-mineral">Yodo</div>
      <div class="nutrient-content">
        <h3>El componente esencial de las hormonas tiroideas</h3>
        <p>Sin yodo no hay T3 ni T4. Pero aquí hay matiz importante: <strong>tanto el déficit como el exceso pueden ser problemáticos</strong>. Los suplementos de yodo sin supervisión no son recomendables, especialmente si hay posible Hashimoto de fondo. A través de la alimentación variada, el equilibrio suele encontrarse solo.</p>
        <div class="food-chips">
          <span class="food-chip">Pescado azul</span>
          <span class="food-chip">Mariscos</span>
          <span class="food-chip">Huevos</span>
          <span class="food-chip">Algas (con moderación)</span>
          <span class="food-chip">Sal yodada</span>
        </div>
      </div>
    </div>

    <div class="nutrient-item">
      <div class="nutrient-mineral">Zinc</div>
      <div class="nutrient-content">
        <h3>Para la síntesis y la señalización hormonal</h3>
        <p>El zinc participa en la síntesis de hormonas tiroideas y en la sensibilidad de los receptores celulares a la T3. Su déficit se asocia con menor función tiroidea. En la postmenopausia, la absorción de zinc puede verse comprometida — más razón para priorizar fuentes alimentarias de calidad.</p>
        <div class="food-chips">
          <span class="food-chip">Carne de vacuno (poca)</span>
          <span class="food-chip">Semillas de calabaza</span>
          <span class="food-chip">Legumbres</span>
          <span class="food-chip">Marisco</span>
          <span class="food-chip">Germen de trigo</span>
        </div>
      </div>
    </div>

    <div class="nutrient-item">
      <div class="nutrient-mineral">Vita<br>mina A</div>
      <div class="nutrient-content">
        <h3>Para los receptores tiroideos</h3>
        <p>La vitamina A puede apoyar la expresión de receptores de hormona tiroidea en las células. No en suplemento — en forma de betacaroteno desde el alimento, que el cuerpo convierte según necesidad. La zanahoria asada con AOVE, el boniato, la calabaza. Colores que trabajan.</p>
        <div class="food-chips">
          <span class="food-chip">Zanahoria</span>
          <span class="food-chip">Boniato</span>
          <span class="food-chip">Calabaza</span>
          <span class="food-chip">Espinacas</span>
          <span class="food-chip">Mango</span>
        </div>
      </div>
    </div>

    <div class="nutrient-item">
      <div class="nutrient-mineral">Ome<br>ga-3</div>
      <div class="nutrient-content">
        <h3>Anti-inflamatorio del eje hormonal</h3>
        <p>La inflamación de bajo grado —frecuente en postmenopausia— puede interferir en la señalización tiroidea. Los omega-3 del pescado azul pueden ayudar a reducir esa carga inflamatoria de fondo. No es específico de tiroides, pero el contexto importa.</p>
        <div class="food-chips">
          <span class="food-chip">Sardinas</span>
          <span class="food-chip">Salmón salvaje</span>
          <span class="food-chip">Semillas de lino</span>
          <span class="food-chip">Nueces</span>
          <span class="food-chip">Chía</span>
        </div>
      </div>
    </div>

    <div class="evitar-block">
      <h4>Alimentos que merecen moderación</h4>
      <ul class="evitar-list">
        <li><strong>Crucíferas crudas en exceso</strong> — brócoli, coliflor, col, kale. Cocinadas pierden en gran medida su efecto bociógeno. No hay que eliminarlas, solo no comerlas crudas en grandes cantidades a diario si hay tiroides comprometida.</li>
        <li><strong>Soja en grandes cantidades</strong> — los isoflavonas pueden interferir con la conversión T4→T3 en algunos casos. El miso y el tempeh fermentados tienen menor efecto que la soja aislada o los suplementos.</li>
        <li><strong>Ultraprocesados y azúcares refinados</strong> — generan inflamación de fondo que puede agravar la señalización hormonal.</li>
        <li><strong>Algas en exceso</strong> — fuente de yodo, pero algunas variedades tienen concentraciones muy altas. Más no es mejor cuando hablamos de tiroides.</li>
      </ul>
    </div>

    <div class="pull-quote">
      <blockquote>"La tiroides no necesita dietas especiales. Necesita variedad real, micronutrientes concretos y menos inflamación de fondo. Eso lo puede hacer el placer de comer bien."</blockquote>
      <cite>— Food·Mood, Equilibrio Hormonal 45+</cite>
    </div>

  </div>

  <!-- RECIPE -->
  <div class="recipe-block">
    <span class="recipe-label">Receta del número</span>
    <h3>Sardinas al AOVE con boniato asado, semillas de calabaza y vinagre de kombucha</h3>
    <span class="mood-tag">Energía · Tiroides · Confort</span>
    <p class="recipe-intro">Un plato que concentra selenio, omega-3, yodo, zinc, betacarotenos y ácido acético en una sola fuente. No es un protocolo. Es un almuerzo de martes que sabe a verano.</p>
    <ul class="recipe-ingredients">
      <li>Sardinas en AOVE de calidad</li>
      <li>Boniato asado</li>
      <li>Semillas de calabaza tostadas</li>
      <li>Rúcula</li>
      <li>Vinagre de kombucha o de manzana</li>
      <li>AOVE</li>
      <li>Pizca de sal marina yodada</li>
      <li>Limón</li>
    </ul>
    <p class="recipe-why">Las sardinas aportan <strong>selenio + omega-3 + yodo natural</strong> en una sola fuente. El boniato, <strong>betacarotenos</strong> para los receptores tiroideos. Las semillas de calabaza, <strong>zinc biodisponible</strong>. El vinagre de kombucha o de manzana puede apoyar la microbiota intestinal, donde se produce parte de la conversión T4→T3. El AOVE y el limón cierran el círculo antiinflamatorio. Todo en un plato que cabe en 15 minutos.</p>
  </div>

  <!-- ACTITUD -->
  <div class="actitud-block">
    <span class="kicker">Alimentos &amp; Actitud</span>
    <h2>La fatiga tiroidea<br>no es <em>tu carácter.<br>Es química.</em></h2>
    <p>Muchas mujeres en postmenopausia llevan años pensando que se han "vuelto vagas", que "les falta motivación", que "son así". A veces es la tiroides trabajando por debajo de sus posibilidades con los recursos que tiene disponibles.</p>
    <p><strong>Esto no es excusa ni diagnóstico.</strong> Es información. Y la actitud Food·Mood con esa información es siempre la misma: comer con placer, con variedad, con atención. No seguir protocolos de privación — comer sardinas con limón en la terraza, boniato asado que huele a miel, nueces de Brasil como ritual de media tarde.</p>
    <p>El cuerpo que se cuida con placer se infama menos, absorbe mejor, convierte con más eficiencia. No es magia. Es bioquímica encarnada.</p>
  </div>

  <!-- DISCLAIMER MÉDICO -->
  <div class="body">
    <div class="medical-disclaimer">
      Food·Mood es una herramienta de autoconocimiento emocional a través de la alimentación funcional. El contenido de este newsletter es divulgativo y no sustituye ninguna valoración médica, diagnóstico ni tratamiento profesional. Si sospechas de alteración tiroidea, consulta con tu médico y solicita analítica específica.
    </div>
  </div>

  <!-- CTA -->
  <div class="cta-section">
    <h3>¿Tu energía está en modo tiroides?</h3>
    <p>El quiz de Food·Mood identifica si tu patrón de síntomas se parece más a fatiga tiroidea, déficit de activación o bajón hormonal — y te propone recetas diseñadas para ese estado específico.</p>
    <a href="https://food-mood.app" class="cta-btn">Descubre tu estado hoy</a>
    <span class="cta-sub">Suscríbete y únete a nuestro club de WhatsApp Premium — contenido curado de verdad y contrastado por nuestros expertos.</span>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-logo">Food<span>·</span>Mood</div>
    <div class="footer-url">food-mood.app</div>
    <div class="footer-copy">© 2026 Food·Mood</div>
  </div>

</div>
</body>
</html>`
}
