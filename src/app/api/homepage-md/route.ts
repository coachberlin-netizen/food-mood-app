import { NextResponse } from 'next/server'

const MARKDOWN = `# Food·Mood

**El hábito más fácil de crear: comer rico y sentirte mejor.**

Comida funcional para el eje intestino-cerebro. Cada receta nutre y actúa — sobre tu energía, tu estado de ánimo y tus hábitos. Sin esfuerzo. Solo placer.

## ¿Qué es Food·Mood?

Food·Mood es una plataforma de nutrición emocional basada en la ciencia del eje intestino-cerebro. Te ayuda a crear hábitos alimentarios sostenibles a través del placer, no de la restricción.

## Cómo funciona

1. **Test de 30 segundos** — Dinos cómo te sientes hoy. Tu mezcla real en porcentajes, no una etiqueta.
2. **Tu paleta emocional** — Tu espectro emocional del día: 60% calma, 25% melancolía, 15% curiosidad.
3. **Receta del día** — Diseñada para tu estado emocional, con el mecanismo bioquímico explicado.
4. **Tu índice Food·Mood** — Ves en datos cómo evolucionas. 90 días de trayectoria documentada.

## Planes

- **Gratuito (0€)** — Test emocional completo, paleta emocional básica, 1 receta de muestra al día.
- **Premium mensual (9€/mes)** — 200+ recetas completas, paleta personalizada, historial de 90 días, glosario científico, canal privado de Telegram.
- **Premium trimestral (7€/mes · 21€ cada 3 meses)** — Todo el plan mensual + ahorro del 22%.

## Corporate Wellness

**Food·Mood for Work** — Programa corporativo de 7 días: snacks funcionales, micro-hábitos y tracking para mejorar el foco, la energía y el bienestar en la jornada laboral. Incluye check-in diario, audios de pausa consciente e informe agregado para RRHH. Desde 490€.

Más información: /corporate-wellness

## Newsletter editorial

17 ediciones publicadas sobre neurociencia aplicada, fermentos, longevidad y hábitos. Sin ruido. Sin dietas. Solo ciencia que puedes comer.

Temas publicados:
- Tiroides y postmenopausia — selenio, yodo, zinc, omega-3
- Hábitos duraderos: neurociencia del placer y la dopamina
- Reset mitocondrial — CoQ10, magnesio y omega-3
- Metabolismo después de los 35
- Lactobacillus y pH vaginal
- Estrobioma: tus bacterias y el estrógeno
- Fermentos del mundo — 6 civilizaciones
- Legumbres y menopausia
- Colágeno y huesos en la menopausia
- Emociones y menopausia — serotonina y nutrientes
- Mosaico emocional — patrones cromáticos
- Proteína y músculo en la menopausia
- Microhábitos sin fuerza de voluntad
- Slow Food·Mood — fermentos y sistema nervioso
- Masa madre: fermentación lenta y microbioma

Archivo completo: /newsletter/archivo

## Receta de muestra: Curry suave de garbanzos con espinacas y cúrcuma

**Anti-ansiedad · 20 min · fácil**

Los garbanzos son una de las fuentes vegetales más ricas en triptófano, el aminoácido precursor de la serotonina. La curcumina de la cúrcuma inhibe la enzima IDO — la misma que el estrés crónico activa para desviar el triptófano hacia la ruta de la quinurenina, alejándolo de la serotonina.

**Ingredientes:** 400 g garbanzos cocidos · 100 g espinacas · 1 lata leche de coco · cebolla · ajo · jengibre · cúrcuma · comino · pimienta negra · AOVE · arroz integral.

## Información

- Web: https://www.food-mood.app
- Email: info@food-mood.app
- Newsletter: /newsletter
- Sobre nosotros: /sobre-nosotros
- Términos y privacidad: /terminos · /privacidad
- API catalog: /.well-known/api-catalog
`

export function GET() {
  const tokens = Math.ceil(MARKDOWN.length / 4)
  return new NextResponse(MARKDOWN, {
    headers: {
      'Content-Type':      'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokens),
      'Cache-Control':     'public, max-age=3600',
    },
  })
}
