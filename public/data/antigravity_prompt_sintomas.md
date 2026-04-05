# Food·Mood — Prompt: Sección /síntomas (entrada adicional)
> Proyecto existente: food-mood.app · Next.js + Supabase
> Esto es una NUEVA SECCIÓN — no sustituye el test de estado de ánimo existente

---

## CONTEXTO

Food·Mood ya tiene un flujo basado en cómo se siente el usuario (mood: Activación, Calma, Focus, Social, Reset, Confort).

Queremos añadir una SEGUNDA ENTRADA al app: la sección `/síntomas`.
En lugar de "¿cómo te sientes?", pregunta "¿qué síntoma quieres mejorar?".
Las dos entradas conviven — el usuario elige cuál prefiere.

---

## PROMPT PARA ANTIGRAVITY

```
## PROYECTO: food-mood.app (proyecto existente)

Añade una nueva sección /síntomas a Food·Mood.
Es una entrada alternativa al test de mood — NO lo reemplaza.

---

### PÁGINA DE INICIO — Añadir enlace a /síntomas

En la home (page.tsx o index), debajo del CTA principal del test de mood,
añade un texto secundario con enlace:

"¿Tienes un síntoma concreto? → Encuentra recetas para tu cuerpo"
→ Link a /síntomas

Estilo: discreto, tipografía secundaria, color dorado #C9A84C

---

### NUEVA PÁGINA: /síntomas

Copy de cabecera:
  Título: "Tu cuerpo lleva tiempo hablándote."
  Subtítulo: "Elige tu síntoma. Te devolveré las recetas que necesitas."

Muestra 6 tarjetas de síntomas en grid (2 columnas desktop, 1 columna mobile):

1. 😴 Cansancio
   Subtexto: "Sin energía aunque duermas. Tu microbiota pide hierro, B12 y adaptógenos."

2. 😰 Ansiedad
   Subtexto: "Sistema nervioso en alerta. Triptófano, magnesio y fermentados al rescate."

3. 🌙 Insomnio
   Subtexto: "El sueño empieza en el intestino. GABA, melatonina precursora y calma digestiva."

4. 🍽️ Hambre constante
   Subtexto: "No es falta de voluntad. Es tu microbiota pidiendo fibra y grasas buenas."

5. 🧠 Niebla mental
   Subtexto: "El cerebro necesita ácidos grasos omega-3 y un intestino que no inflame."

6. 🔥 Inflamación silenciosa
   Subtexto: "La raíz de casi todo. Polifenoles, cúrcuma y el poder del color en el plato."

Diseño de tarjetas: fondo crema #F5F0E8, borde suave burdeos #6B2737,
hover con sombra dorada. Misma estética que el resto de Food·Mood.

---

### FLUJO AL HACER CLIC EN UN SÍNTOMA

Al clicar una tarjeta → va a /síntomas/[slug] donde slug es:
  - cansancio
  - ansiedad
  - insomnio
  - hambre-constante
  - niebla-mental
  - inflamacion-silenciosa

---

### PÁGINA /síntomas/[slug] — Detalle del síntoma

Estructura de la página dinámica:

1. HERO DEL SÍNTOMA
   - Título grande: el nombre del síntoma (ej. "Cansancio")
   - Subtítulo científico según síntoma (ver tabla abajo)
   - Imagen o ilustración minimalista (puedes usar un emoji grande estilizado)

2. EXPLICACIÓN CORTA (3-4 líneas)
   - Texto científico accesible sobre el eje intestino-cerebro y este síntoma
   - Ver contenido por síntoma en la tabla abajo

3. RECETA GRATIS (1 receta de muestra)
   Busca en Supabase: SELECT * FROM recetas WHERE sintoma_tag = [slug] AND premium_level = 0 LIMIT 1
   Si no hay coincidencia exacta, usa mood que corresponda (ver mapping abajo)
   Muestra: nombre, ingredientes resumidos, por qué ayuda (nota gut-brain)

4. UPSELL PREMIUM
   Título: "Hay [N] recetas específicas para tu [síntoma]"
   Subtítulo: "Todas organizadas por qué nutriente actúa, cuándo tomarlas y cómo combinarlas."

   Botón principal: "Ver todas las recetas — 9€/mes"
   → Lleva a /pricing

   Texto secundario: "O accede con tu plan Trimestral — 5€/mes (15€/3 meses)"

5. SI EL USUARIO ES PREMIUM
   Muestra grid completo de recetas del síntoma (filtradas por sintoma_tag o mood mapping)
   Con el mismo componente de RecetaCard existente

---

### TABLA DE CONTENIDO POR SÍNTOMA

CANSANCIO:
  Subtítulo: "Hierro, B12 y adaptógenos para despertar tu energía celular"
  Explicación: "El cansancio crónico muchas veces empieza en el intestino: mala absorción de
  hierro y vitamina B12, inflamación de bajo grado y una microbiota poco diversa que no produce
  suficiente energía celular. Los adaptógenos como la ashwagandha, el maca y las setas shiitake
  activan el eje intestino-cerebro para restaurar tu vitalidad desde dentro."
  Mood mapping: "Activación"

ANSIEDAD:
  Subtítulo: "Triptófano, magnesio y fermentados para calmar tu sistema nervioso"
  Explicación: "El 95% de la serotonina se produce en el intestino. Cuando tu microbiota está
  desequilibrada, la señal intestino-cerebro se vuelve caótica y el sistema nervioso entra en
  alerta. El triptófano (precursor de serotonina), el magnesio y los alimentos fermentados
  reconectan ese eje y reducen la respuesta ansiosa."
  Mood mapping: "Calma"

INSOMNIO:
  Subtítulo: "GABA, melatonina precursora y digestión calmada para recuperar el sueño"
  Explicación: "El sueño se regula desde el intestino: el GABA (neurotransmisor calmante) y
  la melatonina se sintetizan con la ayuda de tu microbiota. Una cena inflamatoria o un
  intestino permeable interrumpen ese proceso. Las recetas de esta sección priorizan
  triptófano nocturno, cereales integrales y alimentos que calman la inflamación intestinal."
  Mood mapping: "Calma"

HAMBRE CONSTANTE:
  Subtítulo: "Fibra, grasas buenas y microbiota saciante para romper el ciclo"
  Explicación: "El hambre constante no siempre es psicológica. Cuando tu microbiota carece
  de diversidad, produce menos ácidos grasos de cadena corta (los que regulan la leptina y
  la grelina). Más fibra prebiótica, grasas saludables y proteína de calidad reeducan esas
  señales de hambre-saciedad."
  Mood mapping: "Reset"

NIEBLA MENTAL:
  Subtítulo: "Omega-3, colina y un intestino que no inflame para pensar con claridad"
  Explicación: "La niebla mental es con frecuencia inflamación neurológica de bajo grado,
  alimentada desde el intestino. Los omega-3 (DHA especialmente), la colina, los polifenoles
  y los fermentados protegen la barrera intestinal y reducen esa inflamación que nubla el
  pensamiento y la concentración."
  Mood mapping: "Focus"

INFLAMACION SILENCIOSA:
  Subtítulo: "Polifenoles, cúrcuma y los 7 colores de la microbiota"
  Explicación: "La inflamación silenciosa es la raíz de la mayoría de enfermedades crónicas.
  Se origina en un intestino permeable y una microbiota empobrecida. La estrategia Food·Mood:
  comer los 7 colores de polifenoles, añadir cúrcuma con pimienta negra, incorporar
  fermentados y vinagre de kombucha para restaurar la barrera intestinal."
  Mood mapping: "Reset"

---

### MAPPING DE SÍNTOMA → COLUMNA EN SUPABASE

Añade una columna opcional `sintoma_tag text` a la tabla recetas si no existe:
  ALTER TABLE public.recetas ADD COLUMN IF NOT EXISTS sintoma_tag text;

Para las recetas existentes, el filtro de fallback es por mood:
  - cansancio → mood_es = 'Activación'
  - ansiedad → mood_es = 'Calma'
  - insomnio → mood_es = 'Calma'
  - hambre-constante → mood_es = 'Reset'
  - niebla-mental → mood_es = 'Focus'
  - inflamacion-silenciosa → mood_es = 'Reset'

---

### LÓGICA DE ACCESO (igual que el resto de la app)

- Usuario FREE: ve 1 receta de muestra + upsell premium
- Usuario PREMIUM: ve todas las recetas del síntoma
- Llama a GET /api/mi-tier para saber el tier (ya existe en el proyecto)

---

### NAVEGACIÓN GLOBAL

En el menú/nav existente, añade:
  - "Síntomas" → /síntomas

Colócalo junto a (o después de) "Recetas" en la navegación principal.

---

### CUANDO TERMINES

Muéstrame:
1. Screenshot de /síntomas (las 6 tarjetas)
2. Screenshot de /síntomas/cansancio (detalle con receta + upsell)
3. Confirma que el enlace desde la home funciona
```

---

## RESUMEN DE LO QUE CREA ESTE PROMPT

- `/síntomas` → página con 6 tarjetas de síntomas
- `/síntomas/[slug]` → detalle dinámico con explicación científica + receta gratis + upsell
- Enlace discreto en la home hacia /síntomas
- "Síntomas" en el menú de navegación
- Columna opcional `sintoma_tag` en Supabase (con fallback por mood)
- Respeta el tier del usuario (free vs premium) igual que el resto de la app

---

*Food·Mood — Psicología & Food Tech · Su Ferreras · 2026*
