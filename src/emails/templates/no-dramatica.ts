export const NEWSLETTER_NO_DRAMATICA_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Food·Mood — No eres dramática</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #EDE8DF; font-family: Georgia, serif; color: #2a1a1e; -webkit-font-smoothing: antialiased; }
  .wrapper { max-width: 620px; margin: 0 auto; background: #F5F0E8; }

  .header { background: #2a1a1e; padding: 48px 40px 40px; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 240px; height: 240px; border-radius: 50%; background: rgba(107,39,55,0.18); }
  .header::after { content: ''; position: absolute; bottom: -20px; left: -20px; width: 140px; height: 140px; border-radius: 50%; background: rgba(201,168,76,0.10); }
  .logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; position: relative; z-index: 1; }
  .logo-text { font-family: Georgia, serif; font-size: 16px; color: rgba(245,240,232,0.5); letter-spacing: .04em; }
  .logo-dot { width: 4px; height: 4px; border-radius: 50%; background: #C9A84C; display: inline-block; }
  .header-eyebrow { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #C9A84C; margin-bottom: 20px; position: relative; z-index: 1; font-family: Arial, sans-serif; }
  .header-title { font-family: Georgia, serif; font-size: 38px; font-weight: 400; color: #F5F0E8; line-height: 1.1; margin-bottom: 20px; position: relative; z-index: 1; }
  .header-title em { font-style: italic; color: #C9A84C; }
  .header-subtitle { font-size: 15px; color: rgba(245,240,232,0.7); line-height: 1.65; position: relative; z-index: 1; max-width: 440px; font-family: Arial, sans-serif; }

  .intro { padding: 36px 40px 28px; border-bottom: 1px solid #e0d5c8; }
  .intro-lead { font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #6B2737; line-height: 1.35; margin-bottom: 20px; }
  .intro-body { font-size: 15px; line-height: 1.75; color: #4a3a3e; font-family: Arial, sans-serif; }
  .intro-body p { margin-bottom: 14px; }
  .intro-body p:last-child { margin-bottom: 0; }
  .intro-body strong { color: #2a1a1e; font-weight: 500; }

  .pullquote { margin: 0; padding: 28px 40px; background: #6B2737; position: relative; }
  .pullquote-text { font-family: Georgia, serif; font-size: 20px; font-style: italic; color: #F5F0E8; line-height: 1.5; position: relative; z-index: 1; }
  .pullquote-text em { color: #C9A84C; font-style: normal; }

  .ciencia { padding: 32px 40px; border-bottom: 1px solid #e0d5c8; }
  .section-label { font-size: 10px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: #9e8080; margin-bottom: 16px; font-family: Arial, sans-serif; }
  .ciencia-body { font-size: 15px; line-height: 1.75; color: #4a3a3e; font-family: Arial, sans-serif; }
  .ciencia-body p { margin-bottom: 14px; }
  .ciencia-body p:last-child { margin-bottom: 0; }
  .ciencia-body strong { color: #6B2737; font-weight: 500; }

  .mecanismo-row { display: flex; gap: 12px; background: #fff; border-radius: 12px; border: 1px solid #e8ddd5; padding: 14px 16px; margin: 16px 0; align-items: flex-start; }
  .mecanismo-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .mecanismo-text { font-size: 13px; line-height: 1.6; color: #4a3a3e; font-family: Arial, sans-serif; }
  .mecanismo-text strong { display: block; font-size: 12px; font-weight: 500; color: #6B2737; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
  .mecanismo-ref { font-size: 11px; color: #b0a0a0; margin-top: 6px; font-style: italic; }

  .receta-section { padding: 32px 40px; border-bottom: 1px solid #e0d5c8; }
  .receta-card { background: #fff; border-radius: 16px; border: 1px solid #e8ddd5; overflow: hidden; }
  .receta-header { background: linear-gradient(135deg, #f5eaec 0%, #fdf5e0 100%); padding: 20px 24px; border-bottom: 1px solid #e8ddd5; }
  .receta-mood { font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: #6B2737; margin-bottom: 6px; font-family: Arial, sans-serif; }
  .receta-nombre { font-family: Georgia, serif; font-size: 20px; color: #2a1a1e; font-weight: 400; margin-bottom: 4px; }
  .receta-meta { font-size: 12px; color: #9e8080; font-family: Arial, sans-serif; }
  .receta-body { padding: 20px 24px; }
  .ing-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .08em; color: #9e8080; margin-bottom: 10px; font-family: Arial, sans-serif; }
  .ing-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #4a3a3e; padding: 4px 0; line-height: 1.4; font-family: Arial, sans-serif; }
  .ing-dot { width: 5px; height: 5px; border-radius: 50%; background: #C9A84C; flex-shrink: 0; margin-top: 6px; display: inline-block; }
  .ing-opcional { color: #9e8080; font-style: italic; }
  .receta-pasos { border-top: 1px solid #f0e8e0; padding-top: 16px; margin: 16px 0; }
  .paso { display: flex; gap: 12px; margin-bottom: 10px; font-size: 13px; color: #4a3a3e; line-height: 1.5; font-family: Arial, sans-serif; }
  .paso-num { width: 22px; height: 22px; border-radius: 50%; background: #6B2737; color: #F5F0E8; font-size: 11px; font-weight: 500; text-align: center; line-height: 22px; flex-shrink: 0; }
  .paso-warning { font-size: 11px; color: #C9A84C; font-weight: 500; }
  .receta-nota { background: #f5eaec; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #7a5c63; line-height: 1.6; border-left: 3px solid #6B2737; font-family: Arial, sans-serif; }
  .receta-nota strong { color: #6B2737; }

  .cta-section { padding: 32px 40px; text-align: center; border-bottom: 1px solid #e0d5c8; }
  .cta-texto { font-size: 15px; color: #7a5c63; line-height: 1.6; margin-bottom: 20px; font-family: Arial, sans-serif; }
  .cta-texto strong { color: #2a1a1e; }
  .cta-btn-primary { display: inline-block; background: #6B2737; color: #F5F0E8; font-size: 14px; font-weight: 500; padding: 13px 28px; border-radius: 30px; text-decoration: none; letter-spacing: .02em; font-family: Arial, sans-serif; }
  .cta-btn-secondary { display: block; font-size: 13px; color: #9e8080; text-decoration: none; margin-top: 10px; font-family: Arial, sans-serif; }

  .cierre { padding: 28px 40px; border-bottom: 1px solid #e0d5c8; }
  .cierre-text { font-size: 14px; line-height: 1.75; color: #7a5c63; font-family: Arial, sans-serif; }
  .cierre-firma { margin-top: 20px; }
  .firma-nombre { font-family: Georgia, serif; font-size: 17px; color: #6B2737; font-style: italic; margin-bottom: 3px; }
  .firma-cargo { font-size: 12px; color: #9e8080; line-height: 1.5; font-family: Arial, sans-serif; }

  .disclaimer { padding: 20px 40px; background: #f5f0e8; border-top: 1px solid #e0d5c8; border-bottom: 1px solid #e0d5c8; }
  .disclaimer-inner { background: #fff; border-radius: 10px; border: 1px solid #e8ddd5; padding: 14px 16px; }
  .disclaimer-text { font-size: 11px; color: #9e8080; line-height: 1.6; font-family: Arial, sans-serif; }
  .disclaimer-text strong { color: #7a5c63; font-weight: 500; }

  .footer { padding: 24px 40px; text-align: center; }
  .footer-logo { font-family: Georgia, serif; font-size: 18px; color: #6B2737; margin-bottom: 6px; }
  .footer-url { font-size: 12px; color: #9e8080; margin-bottom: 4px; font-family: Arial, sans-serif; }
  .footer-copy { font-size: 11px; color: #b0a0a0; font-family: Arial, sans-serif; }
</style>
</head>
<body>
<div class="wrapper">

  <div class="header">
    <div class="logo-row">
      <span class="logo-text">Food·Mood</span>
      <span class="logo-dot"></span>
      <span class="logo-text">Psicología &amp; Food Tech</span>
    </div>
    <div class="header-eyebrow">Newsletter · Paleta emocional</div>
    <div class="header-title">
      No eres <em>dramática</em>.<br>
      Eres una mezcla<br>que cambia cada día.
    </div>
    <div class="header-subtitle">
      Y eso, además de ser completamente normal, tiene una explicación biológica.
    </div>
  </div>

  <div class="intro">
    <p class="intro-lead">"Demasiado sensible." "Exagerada." "Que si esto, que si lo otro."</p>
    <div class="intro-body">
      <p>Cuántas veces has pensado que algo falla en ti porque un martes por la tarde sientes todo con más intensidad que el miércoles. O porque necesitas silencio cuando los demás quieren plan. O porque hay días que no sabes exactamente qué sientes, pero <strong>algo</strong> está pasando.</p>
      <p>No falla nada. Lo que ocurre es que las emociones no son estados fijos. Son señales. Y esas señales cambian constantemente porque tu biología cambia constantemente: el cortisol sube y baja, la serotonina fluctúa, el microbioma responde a lo que comes, duermes y vives.</p>
      <p>Cuando consigues ponerle nombre exacto a esa mezcla, algo cambia. <strong>Sabes si necesitas descanso, si necesitas moverte, si necesitas hablar con alguien, o si simplemente necesitas comer algo que te nutra de verdad.</strong></p>
    </div>
  </div>

  <div class="pullquote">
    <p class="pullquote-text">
      La emoción no vive solo en la mente.<br>
      Vive en el intestino, en las hormonas,<br>
      en lo que comiste esta mañana. <em>Es bioquímica en movimiento.</em>
    </p>
  </div>

  <div class="ciencia">
    <p class="section-label">Por qué el cuerpo tiene razón</p>
    <div class="ciencia-body">
      <p>El eje intestino-cerebro es una autopista de señales bidireccional. Lo que sientes influye en cómo digiere tu cuerpo. Y lo que comes influye en cómo te sientes. No es metáfora. Es fisiología.</p>
    </div>
    <div class="mecanismo-row">
      <div class="mecanismo-icon">🦠</div>
      <div class="mecanismo-text">
        <strong>Microbiota → serotonina</strong>
        La microbiota intestinal modula la síntesis y liberación de serotonina en el intestino, así como el metabolismo del triptófano y otras vías del eje intestino-cerebro, influyendo de forma indirecta en el estado de ánimo.
        <div class="mecanismo-ref">Yano et al., 2015 · Cell · Serotonin synthesis and release is modulated by gut microbiota</div>
      </div>
    </div>
    <div class="mecanismo-row">
      <div class="mecanismo-icon">🧠</div>
      <div class="mecanismo-text">
        <strong>Nervio vago → calma</strong>
        El nervio vago conecta el intestino con el cerebro. Cuando el intestino está en calma, manda señales de seguridad al sistema nervioso. Cuando está inflamado o alterado, manda señales de alerta.
      </div>
    </div>
    <div class="mecanismo-row">
      <div class="mecanismo-icon">⚗️</div>
      <div class="mecanismo-text">
        <strong>Cortisol → fluctuación emocional</strong>
        El cortisol tiene un ritmo diario propio. Cuando está crónicamente elevado por estrés, mala dieta o falta de sueño, la capacidad de regular las emociones se reduce. No eres más sensible. Tu sistema nervioso tiene menos recursos.
      </div>
    </div>
    <div class="ciencia-body" style="margin-top:16px;">
      <p>Cuando entiendes esto, dejas de juzgarte. Y empiezas a <strong>trabajar con el sistema en lugar de contra él.</strong></p>
    </div>
  </div>

  <div class="receta-section">
    <p class="section-label">🍽 La receta de esta semana — Calma</p>
    <div class="receta-card">
      <div class="receta-header">
        <div class="receta-mood">Estado de ánimo · Calma &amp; Reset</div>
        <div class="receta-nombre">Caldo dorado de miso, jengibre y ghee</div>
        <div class="receta-meta">⏱ 15 min · Tarde-noche · Para cuando necesitas parar</div>
      </div>
      <div class="receta-body">
        <p class="ing-label">Ingredientes</p>
        <div class="ing-item"><span class="ing-dot"></span><span>500 ml de agua</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span>1 cucharada de miso rojo sin pasteurizar</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span>1 cucharadita de ghee</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span>1 trozo de jengibre fresco (2 cm), rallado</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span>1/2 cucharadita de cúrcuma</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span>Pizca de pimienta negra recién molida</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span>Unas gotas de vinagre de kombucha o de manzana</span></div>
        <div class="ing-item"><span class="ing-dot"></span><span class="ing-opcional">Sésamo negro — opcional, para servir</span></div>
        <div class="receta-pasos">
          <p class="ing-label">Preparación</p>
          <div class="paso"><span class="paso-num">1</span><div>Calienta el agua hasta que humee. <span class="paso-warning">⚠ Máximo 45°C — por encima pierdes los probióticos activos del miso.</span></div></div>
          <div class="paso"><span class="paso-num">2</span><div>Disuelve el miso en el agua templada. Remueve hasta que se integre por completo.</div></div>
          <div class="paso"><span class="paso-num">3</span><div>Añade el ghee, el jengibre rallado, la cúrcuma y la pimienta negra. Mezcla.</div></div>
          <div class="paso"><span class="paso-num">4</span><div>Unas gotas de vinagre de kombucha o de manzana al final.</div></div>
          <div class="paso"><span class="paso-num">5</span><div>Sirve con sésamo negro si tienes. Tómalo sentada, con las manos alrededor del bol. Sin pantallas si puedes.</div></div>
        </div>
        <div class="receta-nota">
          <strong>Por qué calma:</strong> El miso aporta Lactobacillus vivos que producen GABA intestinal — el neurotransmisor que frena el sistema nervioso. El ghee tiene ácido butírico que refuerza la barrera intestinal. El jengibre activa el nervio vago. El vinagre de kombucha o de manzana amplifica los efectos probióticos. Mantener el agua por debajo de 45°C conserva los microorganismos activos. Este bol le dice al sistema nervioso que puede bajar la guardia.
        </div>
      </div>
    </div>
  </div>

  <div class="cta-section">
    <p class="cta-texto">
      En la app de Food·Mood tienes recetas organizadas por <strong>cómo te sientes</strong> —
      no por calorías, no por ingredientes, no por dietas.<br>
      Por tu estado de ánimo real de hoy.
    </p>
    <a href="https://www.food-mood.app" class="cta-btn-primary">Descubrir mi receta de hoy →</a>
    <a href="https://www.food-mood.app/test" class="cta-btn-secondary">Hacer el test de estado de ánimo</a>
  </div>

  <div class="cierre">
    <p class="cierre-text">
      La próxima vez que alguien te diga que eres "demasiado sensible", recuérdalo:
      tu sensibilidad es información. Tu cuerpo está procesando el mundo con toda la
      complejidad que tiene. Lo que necesitas no es apagarlo — es entenderlo.
      <br><br>
      Y a veces, lo que necesitas también es un bol de caldo con miso y ghee a las 7 de la tarde.
    </p>
    <div class="cierre-firma">
      <div class="firma-nombre">S. Ferreras</div>
      <div class="firma-cargo">Psicóloga · Especialista en longevidad<br>Experta en tecnología de los alimentos</div>
    </div>
  </div>

  <div class="disclaimer">
    <div class="disclaimer-inner">
      <div class="disclaimer-text">
        📖 <strong>Contenido de divulgación científica.</strong> Este newsletter traduce evidencia científica actualizada a un lenguaje accesible para que puedas tomar decisiones informadas sobre tu salud y bienestar. No sustituye el diagnóstico ni el tratamiento de ningún profesional de la salud. Las referencias incluidas corresponden a publicaciones revisadas por pares.
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-logo">Food·Mood</div>
    <div class="footer-url">food-mood.app</div>
    <div class="footer-copy">© 2026 Food·Mood</div>
  </div>

</div>
</body>
</html>`
