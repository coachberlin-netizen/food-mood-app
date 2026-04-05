# Food·Mood — Prompt Combinado: /resultado + Plan Trimestral
> Proyecto existente: food-mood.app · Next.js + Supabase + Stripe
> Ejecuta este prompt de una vez — cubre dos mejoras relacionadas

---

## PROMPT PARA ANTIGRAVITY

```
## PROYECTO: food-mood.app (proyecto existente)

Implementa dos mejoras en el flujo de conversión de Food·Mood.

---

## MEJORA 1 — Plan Trimestral en /pricing y checkout

Ya existe el plan mensual de 9€/mes (STRIPE_PRICE_ID_MONTHLY).
Ahora hay que añadir el plan Trimestral: 15€ cada 3 meses (≈5€/mes).

El STRIPE_PRICE_ID_QUARTERLY ya está en las variables de entorno de Vercel.
En .env.local añade si no está:
  STRIPE_PRICE_ID_QUARTERLY=price_1THqhMKAfsMmyDlfzjeoWoSw

### En /pricing — añadir la tercera columna "Trimestral":

La página /pricing ya tiene Free y Premium mensual.
Añade una tercera opción entre ambas (o después de Premium) con este diseño:

TRIMESTRAL — 15€/3 meses
  Badge: "⭐ Más popular — ahorra un 44%"
  Subtítulo: "Solo 5€/mes, cobrado cada 3 meses"
  Beneficios (mismos que Premium):
    ✓ 10.000 recetas adultos por mood, edad y sexo
    ✓ 1.500 recetas Kids & Adolescentes
    ✓ 200 recetas estilo Michelin-inspired
    ✓ Buscador completo con filtros
    ✓ Guarda tus favoritos
    ✓ Nueva receta personalizada cada semana
  CTA: botón "Empieza tu variedad — 15€/3 meses"
  Estilo: más prominente que el mensual (borde burdeos #6B2737, fondo crema #F5F0E8)

### API route /api/checkout — actualizar para aceptar planType:

La ruta POST /api/checkout debe aceptar un body con { planType: 'monthly' | 'quarterly' }
y usar el STRIPE_PRICE_ID correspondiente.

Si no se especifica planType, usa 'monthly' por defecto.

El botón Trimestral llama a POST /api/checkout con { planType: 'quarterly' }
El botón Mensual llama a POST /api/checkout con { planType: 'monthly' }

---

## MEJORA 2 — Página /resultado: Perfil de Microbioma + captura de email

La página /resultado muestra la receta gratis después del test de mood.
Hay que mejorarla con dos adiciones:

### 2A — "Tu Perfil de Microbioma" (antes de mostrar la receta)

Antes de mostrar la receta, añade un bloque visual llamado "Tu Perfil de Microbioma".

Diseño: tarjeta elegante con fondo burdeos oscuro #6B2737 o crema #F5F0E8
Contenido dinámico según el mood detectado en el test:

ACTIVACIÓN:
  Título: "Tu microbioma está en modo energía"
  Descripción: "Tu eje intestino-cerebro busca combustible. Necesitas hierro biodisponible,
  vitaminas del grupo B y adaptógenos que activen tus mitocondrias."
  Icono/emoji: ⚡

CALMA:
  Título: "Tu sistema nervioso pide equilibrio"
  Descripción: "El 95% de tu serotonina se produce en el intestino. Tu microbioma está
  en modo regulación: triptófano, magnesio y fermentados son tus aliados ahora."
  Icono/emoji: 🌿

FOCUS:
  Título: "Tu cerebro necesita claridad intestinal"
  Descripción: "La niebla mental empieza en el intestino. Tu perfil indica que el eje
  intestino-cerebro necesita omega-3, colina y reducción de inflamación silenciosa."
  Icono/emoji: 🧠

SOCIAL:
  Título: "Tu microbioma quiere conexión"
  Descripción: "La dopamina que regula tus ganas de conectar con otros se sintetiza con
  la ayuda de tu microbiota. Polifenoles y probióticos potencian ese eje social."
  Icono/emoji: 🤝

RESET:
  Título: "Tu cuerpo está en modo restauración"
  Descripción: "Tu microbioma detecta inflamación o agotamiento. Es momento de
  antiinflamatorios naturales, fibra prebiótica y vinagre de kombucha para restaurar."
  Icono/emoji: 🔄

CONFORT:
  Título: "Tu intestino busca calor y seguridad"
  Descripción: "El estrés eleva el cortisol y altera tu microbiota. Tu perfil indica que
  necesitas GABA, triptófano y alimentos que activen el nervio vago para calmarte."
  Icono/emoji: 🫂

### 2B — Captura de email (antes de revelar la receta completa)

Después del bloque "Tu Perfil de Microbioma" y ANTES de mostrar la receta completa,
añade un campo de captura de email:

Diseño:
  Fondo: crema #F5F0E8
  Título: "Tu receta personalizada está lista"
  Subtítulo: "Introduce tu email para verla — también recibirás una receta nueva cada semana."
  Campo: input email (placeholder: "tu@email.com")
  Botón: "Ver mi receta →" (color burdeos #6B2737)
  Texto debajo: "Sin spam. Solo recetas que tu microbioma necesita." (tipografía pequeña)

Comportamiento:
  - Si el usuario ya está logueado (Supabase auth), skip este paso — muestra la receta directamente
  - Si no está logueado: al enviar el email, guárdalo en Supabase tabla `email_captures`:
      CREATE TABLE IF NOT EXISTS public.email_captures (
        id uuid default gen_random_uuid() primary key,
        email text not null,
        mood_es text,
        grupo_edad text,
        sexo text,
        created_at timestamptz default now()
      );
  - Después de guardar el email → muestra la receta completa
  - El email capture NO requiere contraseña — es solo para la newsletter

API route: POST /api/capture-email
  Body: { email, mood_es, grupo_edad, sexo }
  Acción: inserta en email_captures usando supabaseAdmin (service_role key)
  Respuesta: { success: true }

### Orden final de /resultado:

1. "Tu Perfil de Microbioma" (bloque dinámico según mood)
2. Captura de email (si no está logueado)
3. La receta completa (nombre, ingredientes, preparación, nota gut-brain)
4. Bloque UpsellBlock (ya existe — "Lo que tu microbioma necesita sobre todo es variedad")

---

## VARIABLES DE ENTORNO NECESARIAS

En .env.local (y en Vercel → Settings → Environment Variables):
  STRIPE_PRICE_ID_MONTHLY=price_1THUGfKAfsMmyDlfym8JQTiC
  STRIPE_PRICE_ID_QUARTERLY=price_1THqhMKAfsMmyDlfzjeoWoSw

Verifica que NEXT_PUBLIC_RECETAS_SUPABASE_ANON_KEY y RECETAS_SUPABASE_KEY están configuradas.

---

## CUANDO TERMINES

Muéstrame:
1. Screenshot de /pricing con las 3 columnas (Free, Trimestral destacado, Mensual)
2. Screenshot de /resultado con el "Perfil de Microbioma" + email capture + receta
3. Confirma que POST /api/checkout acepta { planType: 'quarterly' } y redirige a Stripe
4. Confirma que la tabla email_captures existe en Supabase
```

---

## RESUMEN DE ESTE PROMPT

**Mejora 1 — Trimestral:**
- /pricing: nueva columna "Trimestral 15€/3 meses" como opción destacada ("Más popular")
- /api/checkout: acepta planType 'monthly' o 'quarterly'

**Mejora 2 — /resultado:**
- Bloque "Tu Perfil de Microbioma" antes de la receta (dinámico por mood)
- Captura de email antes de revelar la receta completa (para newsletter)
- Tabla `email_captures` en Supabase
- API POST /api/capture-email

---

*Food·Mood — Psicología & Food Tech · Su Ferreras · 2026*
