import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Salsa de tomate fermentada: neuroprotecciÃ³n en tarro | FoodÂ·Mood Newsletter NÂº 03',
  description:
    'Por quÃ© el tomate fermentado 24â€“48h produce licopeno bioacesible que cruza la barrera hematoencefÃ¡lica y protege las neuronas. Receta completa paso a paso. Newsletter NÂº 03 de FoodÂ·Mood.',
  alternates: { canonical: 'https://www.food-mood.app/newsletter/salsa-de-tomate-fermentada' },
  openGraph: {
    title:       'Salsa de tomate fermentada. 24 a 48 horas.',
    description: 'No es una receta de abuela. Es neuroprotecciÃ³n en tarro. El licopeno del tomate fermentado cruza la barrera del cerebro.',
    url:         'https://www.food-mood.app/newsletter/salsa-de-tomate-fermentada',
    type:        'article',
    siteName:    'FoodÂ·Mood',
    images:      [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Newsletter FoodÂ·Mood â€” Salsa de tomate fermentada' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Salsa de tomate fermentada: neuroprotecciÃ³n en tarro',
    description: 'Licopeno bioacesible, barrera hematoencefÃ¡lica y 48h de fermentaciÃ³n. Newsletter NÂº 03 de FoodÂ·Mood.',
    images:      ['/og-image.png'],
  },
}

const css = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#EDE8DF;font-family:'DM Sans',Georgia,sans-serif;color:#2a1a1e;-webkit-font-smoothing:antialiased}
  .wrapper{max-width:620px;margin:0 auto;background:#F5F0E8}
  .header{background:#3D1A0E;padding:48px 40px 40px;position:relative;overflow:hidden}
  .header::before{content:'';position:absolute;top:-60px;right:-40px;width:260px;height:260px;border-radius:50%;background:rgba(180,60,20,0.15)}
  .header::after{content:'';position:absolute;bottom:-30px;left:-20px;width:160px;height:160px;border-radius:50%;background:rgba(201,168,76,0.08)}
  .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:32px;position:relative;z-index:1}
  .logo-text{font-family:'DM Serif Display',Georgia,serif;font-size:16px;color:rgba(245,240,232,0.45);letter-spacing:.04em}
  .logo-dot{width:4px;height:4px;border-radius:50%;background:#C9A84C}
  .header-eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C;margin-bottom:20px;position:relative;z-index:1}
  .header-title{font-family:'DM Serif Display',Georgia,serif;font-size:38px;font-weight:400;color:#F5F0E8;line-height:1.1;margin-bottom:20px;position:relative;z-index:1}
  .header-title em{font-style:italic;color:#E8845A}
  .header-subtitle{font-size:15px;color:rgba(245,240,232,0.65);line-height:1.65;position:relative;z-index:1;max-width:460px}
  .slow-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.3);border-radius:20px;padding:5px 14px;margin-bottom:24px;position:relative;z-index:1}
  .slow-badge-text{font-size:11px;color:#C9A84C;font-weight:500;letter-spacing:.06em}
  .snippet{padding:12px 20px;border-bottom:1px solid rgba(107,39,55,0.08);background:#faf6f0;text-align:center}
  .snippet p{font-size:13px;color:#9e8080;margin:0;font-style:italic}
  .intro{padding:36px 40px 28px;border-bottom:1px solid #e0d5c8}
  .intro-lead{font-family:'DM Serif Display',Georgia,serif;font-size:21px;font-weight:400;color:#6B2737;line-height:1.4;margin-bottom:20px}
  .intro-body{font-size:15px;line-height:1.75;color:#4a3a3e}
  .intro-body p{margin-bottom:14px}
  .intro-body p:last-child{margin-bottom:0}
  .intro-body strong{color:#2a1a1e;font-weight:500}
  .pullquote{padding:28px 40px;background:#6B2737;position:relative}
  .pullquote::before{content:'"';font-family:'DM Serif Display',Georgia,serif;font-size:80px;color:rgba(232,132,90,0.2);position:absolute;top:0;left:30px;line-height:1}
  .pullquote-text{font-family:'DM Serif Display',Georgia,serif;font-size:19px;font-style:italic;color:#F5F0E8;line-height:1.55;position:relative;z-index:1}
  .pullquote-text em{color:#E8845A;font-style:normal}
  .ciencia{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .section-label{font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9e8080;margin-bottom:16px}
  .ciencia-body{font-size:15px;line-height:1.75;color:#4a3a3e}
  .ciencia-body p{margin-bottom:14px}
  .ciencia-body p:last-child{margin-bottom:0}
  .ciencia-body strong{color:#6B2737;font-weight:500}
  .cadena{display:flex;align-items:center;gap:0;margin:20px 0;flex-wrap:wrap}
  .cadena-paso{background:#fff;border:1px solid #e8ddd5;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:500;color:#6B2737;text-align:center;flex-shrink:0}
  .cadena-arrow{font-size:16px;color:#C9A84C;padding:0 6px;flex-shrink:0}
  .mecanismo-row{display:flex;gap:12px;background:#fff;border-radius:12px;border:1px solid #e8ddd5;padding:14px 16px;margin:14px 0;align-items:flex-start}
  .mecanismo-icon{font-size:20px;flex-shrink:0;margin-top:2px}
  .mecanismo-text{font-size:13px;line-height:1.6;color:#4a3a3e}
  .mecanismo-text strong{display:block;font-size:12px;font-weight:500;color:#6B2737;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .mecanismo-ref{font-size:11px;color:#b0a0a0;margin-top:6px;font-style:italic}
  .dato-box{background:linear-gradient(135deg,#f5eaec,#fdf5e0);border-radius:14px;border:1px solid #e8ddd5;padding:20px 24px;margin:20px 0;text-align:center}
  .dato-numero{font-family:'DM Serif Display',Georgia,serif;font-size:44px;color:#6B2737;line-height:1;margin-bottom:6px}
  .dato-label{font-size:13px;color:#7a5c63;line-height:1.5}
  .dato-label strong{color:#6B2737}
  .receta-section{padding:32px 40px;border-bottom:1px solid #e0d5c8}
  .receta-card{background:#fff;border-radius:16px;border:1px solid #e8ddd5;overflow:hidden}
  .receta-header{background:linear-gradient(135deg,#f9ede6 0%,#fdf5e0 100%);padding:20px 24px;border-bottom:1px solid #e8ddd5}
  .receta-mood{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#9E3B1A;margin-bottom:6px}
  .receta-nombre{font-family:'DM Serif Display',Georgia,serif;font-size:20px;color:#2a1a1e;font-weight:400;margin-bottom:4px}
  .receta-meta{font-size:12px;color:#9e8080}
  .receta-body{padding:20px 24px}
  .ing-label{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#9e8080;margin-bottom:10px}
  .ing-item{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#4a3a3e;padding:4px 0;line-height:1.4}
  .ing-dot{width:5px;height:5px;border-radius:50%;background:#C9A84C;flex-shrink:0;margin-top:6px}
  .ing-opcional{color:#9e8080;font-style:italic}
  .ing-seccion{font-size:11px;font-weight:500;color:#9e8080;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 6px;padding-top:12px;border-top:1px solid #f0e8e0}
  .receta-pasos{border-top:1px solid #f0e8e0;padding-top:16px;margin:16px 0}
  .paso{display:flex;gap:12px;margin-bottom:12px;font-size:13px;color:#4a3a3e;line-height:1.55}
  .paso-num{width:22px;height:22px;border-radius:50%;background:#6B2737;color:#F5F0E8;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .paso-warning{display:block;font-size:11px;color:#C9A84C;font-weight:500;margin-top:3px}
  .paso-tip{display:block;font-size:11px;color:#9e8080;font-style:italic;margin-top:3px}
  .receta-nota{background:#f5eaec;border-radius:10px;padding:14px 16px;font-size:12px;color:#7a5c63;line-height:1.65;border-left:3px solid #6B2737;margin-top:4px}
  .receta-nota strong{color:#6B2737}
  .slow-section{padding:28px 40px;background:#fafaf5;border-top:1px solid #e0d5c8;border-bottom:1px solid #e0d5c8}
  .slow-card{border-radius:14px;border:1px solid #e8ddd5;background:#fff;padding:20px 24px}
  .slow-title{font-family:'DM Serif Display',Georgia,serif;font-size:17px;color:#2a1a1e;margin-bottom:10px;font-weight:400}
  .slow-text{font-size:13px;line-height:1.7;color:#7a5c63}
  .slow-text strong{color:#6B2737}
  .cta-section{padding:32px 40px;text-align:center;border-bottom:1px solid #e0d5c8}
  .cta-texto{font-size:15px;color:#7a5c63;line-height:1.6;margin-bottom:20px}
  .cta-texto strong{color:#2a1a1e}
  .cta-btn-primary{display:inline-block;background:#6B2737;color:#F5F0E8;font-size:14px;font-weight:500;padding:13px 28px;border-radius:30px;text-decoration:none;letter-spacing:.02em}
  .cta-btn-secondary{display:block;font-size:13px;color:#9e8080;text-decoration:none;margin-top:10px}
  .cierre{padding:28px 40px;border-bottom:1px solid #e0d5c8}
  .cierre-text{font-size:14px;line-height:1.8;color:#7a5c63}
  .cierre-firma{margin-top:20px}
  .firma-nombre{font-family:'DM Serif Display',Georgia,serif;font-size:17px;color:#6B2737;font-style:italic;margin-bottom:3px}
  .firma-cargo{font-size:12px;color:#9e8080;line-height:1.5}
  .disclaimer{padding:20px 40px;background:#f5f0e8;border-bottom:1px solid #e0d5c8}
  .disclaimer-inner{background:#fff;border-radius:10px;border:1px solid #e8ddd5;padding:14px 16px;display:flex;gap:10px;align-items:flex-start}
  .disclaimer-icon{font-size:16px;flex-shrink:0;margin-top:1px}
  .disclaimer-text{font-size:11px;color:#9e8080;line-height:1.6}
  .disclaimer-text strong{color:#7a5c63;font-weight:500}
  .footer{padding:24px 40px;text-align:center}
  .footer-logo{font-family:'DM Serif Display',Georgia,serif;font-size:18px;color:#6B2737;margin-bottom:6px}
  .footer-url{font-size:12px;color:#9e8080;margin-bottom:4px}
  .footer-copy{font-size:11px;color:#b0a0a0}
  @media(max-width:480px){
    .header{padding:32px 24px 28px}
    .header-title{font-size:30px}
    .intro,.ciencia,.receta-section,.pullquote,.slow-section,.cta-section,.cierre,.disclaimer,.footer{padding-left:24px;padding-right:24px}
  }
`

const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':            'NewsArticle',
      headline:           'Salsa de tomate fermentada: neuroprotecciÃ³n en tarro',
      description:        'Por quÃ© el tomate fermentado 24-48h produce licopeno bioacesible que cruza la barrera hematoencefÃ¡lica y protege las neuronas. Receta completa.',
      url:                'https://www.food-mood.app/newsletter/salsa-de-tomate-fermentada',
      datePublished:      '2026-05-11',
      dateModified:       '2026-05-11',
      inLanguage:         'es',
      image:              'https://www.food-mood.app/og-image.png',
      author:             { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
      publisher:          { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app',
                            logo: { '@type': 'ImageObject', url: 'https://www.food-mood.app/og-image.png' } },
      mainEntityOfPage:   { '@type': 'WebPage', '@id': 'https://www.food-mood.app/newsletter/salsa-de-tomate-fermentada' },
      isPartOf:           { '@type': 'Periodical', name: 'Newsletter FoodÂ·Mood', url: 'https://www.food-mood.app/newsletter' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood',  item: 'https://www.food-mood.app' },
        { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://www.food-mood.app/newsletter' },
        { '@type': 'ListItem', position: 3, name: 'Salsa de tomate fermentada', item: 'https://www.food-mood.app/newsletter/salsa-de-tomate-fermentada' },
      ],
    },
  ],
}

export default function SalsaTomateFermentadaNewsletter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div className="wrapper">

        {/* Snippet preview */}
        <div className="snippet">
          <p>NÂº 03 Â· El licopeno del tomate fermentado cruza la barrera del cerebro y protege las neuronas. Receta: 20 min activos, 24â€“48h de espera.</p>
        </div>

        {/* HEADER */}
        <div className="header">
          <div className="logo-row">
            <span className="logo-text">FoodÂ·Mood</span>
            <div className="logo-dot" />
            <span className="logo-text">Slow FoodÂ·Mood</span>
          </div>
          <div className="slow-badge">
            <span>ðŸ…</span>
            <span className="slow-badge-text">Fast life. Slow FoodÂ·Mood.</span>
          </div>
          <div className="header-eyebrow">Newsletter Â· NÂº 03 Â· FermentaciÃ³n lenta</div>
          <div className="header-title">
            Salsa de tomate<br />fermentada.<br />
            <em>24 a 48 horas.</em>
          </div>
          <div className="header-subtitle">
            No es una receta de abuela. Es neuroprotecciÃ³n en tarro.
            Te explico por quÃ© el tiempo lo cambia todo.
          </div>
        </div>

        {/* INTRO */}
        <div className="intro">
          <p className="intro-lead">Hay cosas que solo ocurren cuando no tienes prisa.</p>
          <div className="intro-body">
            <p>
              El tomate cocido ya tiene mÃ¡s licopeno biodisponible que el crudo. Pero el tomate fermentado
              durante 24 o 48 horas hace algo que ni el cocinado rÃ¡pido ni ningÃºn suplemento puede replicar:
              las bacterias lÃ¡cticas transforman los carotenoides en formas mÃ¡s activas, mÃ¡s absorbibles,{' '}
              <strong>capaces de cruzar la barrera hematoencefÃ¡lica y llegar directamente al tejido neuronal.</strong>
            </p>
            <p>
              No necesitas ingredientes raros. No necesitas equipo especial.
              Necesitas tomates, sal, un tarro y tiempo. El tiempo hace el trabajo.
            </p>
          </div>
        </div>

        {/* PULL QUOTE */}
        <div className="pullquote">
          <p className="pullquote-text">
            El licopeno del tomate fermentado no solo alimenta el cuerpo.<br />
            Cruza la barrera del cerebro. <em>Protege las neuronas.</em><br />
            Eso no lo hace ningÃºn bote de salsa del supermercado.
          </p>
        </div>

        {/* CIENCIA */}
        <div className="ciencia">
          <p className="section-label">ðŸ’¡ La idea de hoy â€” Licopeno y neuroprotecciÃ³n</p>

          <div className="dato-box">
            <div className="dato-numero">3â€“5Ã—</div>
            <div className="dato-label">
              mÃ¡s licopeno biodisponible en el tomate cocinado que en el crudo.<br />
              <strong>El fermentado lo convierte en formas aÃºn mÃ¡s activas.</strong>
            </div>
          </div>

          <div className="ciencia-body">
            <p>
              El licopeno es el carotenoide mÃ¡s potente para la salud cerebral. A diferencia de otros
              antioxidantes que se quedan en el torrente sanguÃ­neo, el licopeno{' '}
              <strong>cruza fÃ¡cilmente la barrera hematoencefÃ¡lica</strong> â€” la frontera que protege el
              cerebro y que la mayorÃ­a de molÃ©culas no pueden atravesar.
            </p>
            <p>
              Una vez dentro, reduce la oxidaciÃ³n lipÃ­dica en las neuronas y tiene efecto antiapoptÃ³tico:
              protege las neuronas de la muerte celular programada. Estudios en humanos asocian mayores
              niveles de licopeno plasmÃ¡tico con{' '}
              <strong>menor riesgo de depresiÃ³n y deterioro cognitivo.</strong>
            </p>
          </div>

          <div className="cadena">
            <div className="cadena-paso">Licopeno</div>
            <div className="cadena-arrow">â†’</div>
            <div className="cadena-paso">Barrera hematoencefÃ¡lica</div>
            <div className="cadena-arrow">â†’</div>
            <div className="cadena-paso">NeuroprotecciÃ³n</div>
            <div className="cadena-arrow">â†’</div>
            <div className="cadena-paso">Antiapoptosis</div>
          </div>

          <div className="mecanismo-row">
            <div className="mecanismo-icon">ðŸ…</div>
            <div className="mecanismo-text">
              <strong>Cocinar activa el licopeno</strong>
              El tomate crudo tiene licopeno en forma trans, poco absorbible. El calor isomeriza
              el licopeno a forma cis, 3 a 5 veces mÃ¡s biodisponible. Por eso la salsa casera
              cocinada es mÃ¡s neuroprotectora que el tomate en ensalada.
              <div className="mecanismo-ref">Shi &amp; Le Maguer, 2000 Â· Crit Rev Food Sci Nutr Â· Lycopene bioavailability</div>
            </div>
          </div>

          <div className="mecanismo-row">
            <div className="mecanismo-icon">ðŸ¦ </div>
            <div className="mecanismo-text">
              <strong>Fermentar amplifica el efecto</strong>
              Las bacterias lÃ¡cticas durante la fermentaciÃ³n continÃºan transformando los carotenoides
              en formas de mayor actividad biolÃ³gica. AdemÃ¡s producen Ã¡cidos orgÃ¡nicos que mejoran
              la absorciÃ³n intestinal del licopeno y reducen la inflamaciÃ³n que interfiere con
              su transporte al cerebro.
              <div className="mecanismo-ref">Xiao et al., 2023 Â· Food Chem Â· Lactic acid fermentation enhances lycopene bioaccessibility</div>
            </div>
          </div>

          <div className="mecanismo-row">
            <div className="mecanismo-icon">ðŸ§ </div>
            <div className="mecanismo-text">
              <strong>Licopeno y depresiÃ³n</strong>
              Un metaanÃ¡lisis de 2022 encontrÃ³ correlaciÃ³n inversa significativa entre niveles
              plasmÃ¡ticos de licopeno y sÃ­ntomas depresivos. El mecanismo probable: reducciÃ³n
              de la neuroinflamaciÃ³n mediada por IL-6 y TNF-Î± en el hipocampo.
              <div className="mecanismo-ref">Wang et al., 2022 Â· Nutrients Â· Dietary lycopene and depression risk: meta-analysis</div>
            </div>
          </div>
        </div>

        {/* RECETA */}
        <div className="receta-section">
          <p className="section-label">ðŸ«™ La receta â€” Salsa de tomate fermentada</p>
          <div className="receta-card">
            <div className="receta-header">
              <div className="receta-mood">Slow FoodÂ·Mood Â· NeuroprotecciÃ³n &amp; Calma</div>
              <div className="receta-nombre">Salsa de tomate fermentada (24â€“48h)</div>
              <div className="receta-meta">â± 20 min activos Â· 24â€“48h fermentaciÃ³n Â· 1 tarro de 500 ml</div>
            </div>
            <div className="receta-body">

              <p className="ing-label">Ingredientes</p>
              <p className="ing-seccion">Base</p>
              <div className="ing-item"><div className="ing-dot" /><span>600 g de tomates maduros â€” cuanto mÃ¡s rojos, mÃ¡s licopeno</span></div>
              <div className="ing-item"><div className="ing-dot" /><span>1 cucharadita de sal marina sin refinar (no sal de mesa yodada â€” interfiere con la fermentaciÃ³n)</span></div>
              <div className="ing-item"><div className="ing-dot" /><span>2 dientes de ajo</span></div>
              <div className="ing-item"><div className="ing-dot" /><span>1 cucharada de aceite de oliva virgen extra</span></div>

              <p className="ing-seccion">AromÃ¡ticos</p>
              <div className="ing-item"><div className="ing-dot" /><span>4â€“5 hojas de albahaca fresca</span></div>
              <div className="ing-item"><div className="ing-dot" /><span>1 cucharadita de orÃ©gano seco</span></div>
              <div className="ing-item"><div className="ing-dot" /><span className="ing-opcional">1 pizca de pimienta negra â€” opcional, potencia la absorciÃ³n de carotenoides</span></div>

              <p className="ing-seccion">Para arrancar la fermentaciÃ³n</p>
              <div className="ing-item"><div className="ing-dot" /><span>1 cucharada de salmuera de chucrut crudo sin pasteurizar o de kÃ©fir de leche</span></div>
              <div className="ing-item"><div className="ing-dot" /><span className="ing-opcional">Alternativa si no tienes: el propio tomate fermentarÃ¡ solo con la sal â€” solo tardarÃ¡ un poco mÃ¡s</span></div>

              <div className="receta-pasos">
                <p className="ing-label">PreparaciÃ³n</p>

                <div className="paso"><div className="paso-num">1</div><div>Escalde los tomates 30 segundos en agua hirviendo. PÃ¡salos a agua frÃ­a. Pela y trocea.<span className="paso-tip">El escaldado activa la primera isomerizaciÃ³n del licopeno a forma cis.</span></div></div>
                <div className="paso"><div className="paso-num">2</div><div>Cocina los tomates a fuego suave con el ajo y el aceite de oliva durante 15 minutos. Remueve ocasionalmente. El licopeno se activa con el calor y la grasa presente.<span className="paso-tip">La grasa del aceite de oliva es imprescindible â€” el licopeno es liposoluble.</span></div></div>
                <div className="paso"><div className="paso-num">3</div><div>Retira del fuego. AÃ±ade la albahaca, el orÃ©gano y la pimienta. Tritura con batidora hasta obtener la textura deseada.</div></div>
                <div className="paso"><div className="paso-num">4</div><div><strong>Espera a que baje a temperatura ambiente.</strong><span className="paso-warning">âš  Nunca fermentar caliente â€” mata las bacterias lÃ¡cticas.</span></div></div>
                <div className="paso"><div className="paso-num">5</div><div>AÃ±ade la sal marina y la cucharada de salmuera de chucrut o kÃ©fir. Mezcla bien.<span className="paso-tip">La salmuera inocula las bacterias lÃ¡cticas que van a trabajar durante la fermentaciÃ³n.</span></div></div>
                <div className="paso"><div className="paso-num">6</div><div>Pasa la salsa a un tarro de cristal limpio. Deja 2â€“3 cm de espacio arriba â€” la fermentaciÃ³n genera gas. Cierra con tapa pero no del todo hermÃ©tico, o usa una gasa sujeta con goma.</div></div>
                <div className="paso"><div className="paso-num">7</div><div>Deja fermentar a temperatura ambiente (entre 20 y 25Â°C) durante <strong>24 horas para un sabor suave</strong> o <strong>48 horas para un perfil mÃ¡s Ã¡cido y complejo.</strong><span className="paso-tip">En verano fermenta antes. En invierno puede necesitar hasta 72h.</span></div></div>
                <div className="paso"><div className="paso-num">8</div><div>Cuando veas pequeÃ±as burbujas en la superficie o notes el aroma Ã¡cido caracterÃ­stico, la fermentaciÃ³n estÃ¡ activa. Cierra el tarro hermÃ©ticamente y refrigera. Aguanta 2â€“3 semanas en nevera.</div></div>
              </div>

              <div className="receta-nota">
                <strong>Por quÃ© este proceso importa:</strong> Cada paso suma licopeno activo.
                El escaldado inicia la isomerizaciÃ³n. El cocinado con aceite multiplica la
                biodisponibilidad por 3 a 5. La fermentaciÃ³n lÃ¡ctica continÃºa transformando
                los carotenoides durante 24â€“48 horas, produciendo ademÃ¡s Ã¡cido lÃ¡ctico que
                mejora el entorno intestinal para la absorciÃ³n. El resultado es una salsa con
                una concentraciÃ³n de licopeno bioacesible imposible de obtener de otra forma.
                Una cucharada al dÃ­a es suficiente.
              </div>
            </div>
          </div>
        </div>

        {/* SLOW PHILOSOPHY */}
        <div className="slow-section">
          <p className="section-label">ðŸŒ¿ La filosofÃ­a Slow FoodÂ·Mood</p>
          <div className="slow-card">
            <p className="slow-title">Fast life. Slow FoodÂ·Mood.</p>
            <p className="slow-text">
              Vivimos rÃ¡pido. Comemos rÃ¡pido. Nos recuperamos despacio.
              El reto Slow FoodÂ·Mood naciÃ³ de una observaciÃ³n simple:{' '}
              <strong>los procesos que mÃ¡s cuidan el sistema nervioso son los que necesitan tiempo.</strong>{' '}
              La fermentaciÃ³n, el caldo largo, la masa madre, el encurtido. No son tÃ©cnicas nostÃ¡lgicas
              â€” son bioquÃ­mica con paciencia.
              <br /><br />
              Cada semana una receta lenta. Cada semana una razÃ³n cientÃ­fica para no tener prisa.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <p className="cta-texto">
            El reto <strong>Slow FoodÂ·Mood</strong> llega pronto a la app.<br />
            7 dÃ­as o 21 dÃ­as de fermentos, caldos y masas para el sistema nervioso.<br />
            Mientras tanto, la app tiene recetas organizadas por cÃ³mo te sientes hoy.
          </p>
          <Link href="/" className="cta-btn-primary">Ver la app FoodÂ·Mood â†’</Link>
          <Link href="/quiz" className="cta-btn-secondary">Hacer el quiz de estado de Ã¡nimo</Link>
        </div>

        {/* CIERRE */}
        <div className="cierre">
          <p className="cierre-text">
            La salsa que empieces hoy estarÃ¡ lista maÃ±ana por la noche o pasado maÃ±ana.
            Ese tiempo de espera no es inactividad â€” es bioquÃ­mica ocurriendo sin que
            tengas que hacer nada. A veces cuidar el cerebro es tan simple como poner
            un tarro en la encimera y dejarlo estar.
            <br /><br />
            Dime si la haces. Me interesa saber cÃ³mo te queda.
          </p>
          <div className="cierre-firma">
            <div className="firma-nombre">S. Ferreras</div>
            <div className="firma-cargo">
              PsicÃ³loga Â· Especialista en longevidad<br />
              Experta en tecnologÃ­a de los alimentos
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="disclaimer">
          <div className="disclaimer-inner">
            <div className="disclaimer-icon">ðŸ“–</div>
            <div className="disclaimer-text">
              <strong>Contenido de divulgaciÃ³n cientÃ­fica.</strong> Este newsletter traduce evidencia
              cientÃ­fica actualizada a un lenguaje accesible para que puedas tomar decisiones
              informadas sobre tu salud y bienestar. No sustituye el diagnÃ³stico ni el tratamiento
              de ningÃºn profesional de la salud. Las referencias incluidas corresponden a
              publicaciones revisadas por pares.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-logo">FoodÂ·Mood</div>
          <div className="footer-url">food-mood.app</div>
          <div className="footer-copy">Â© 2026 FoodÂ·Mood</div>
        </div>

      </div>
    </>
  )
}

