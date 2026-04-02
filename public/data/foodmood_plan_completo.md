# Food·Mood — Plan Completo de Lanzamiento
*Actualizado: Abril 2026 · Su Ferreras*

---

## ESTADO ACTUAL ✅

- [x] 10.000 recetas generadas e importadas en Supabase
- [x] 200 recetas Michelin-inspired (premium_level=2) importadas
- [x] 1.500 recetas Kids & Adolescentes (premium_level=1) generadas
- [x] Tabla `subscriptions` + función `get_my_tier()` creadas
- [x] Stripe integrado (modo test) con checkout de €9/mes
- [x] Página `/pricing` con comparativa Free vs Premium
- [x] Banner de gating en `/recetas` para usuarios free
- [x] Nombres de chefs reemplazados por estilos culinarios (sin riesgo legal)

---

## FASE 1 — Cerrar lo técnico (esta semana)

### 1.1 Supabase — 10 minutos
- [ ] Ejecutar en SQL Editor:
  ```sql
  GRANT EXECUTE ON FUNCTION public.get_my_tier() TO anon, authenticated;
  ```
  → Esto soluciona el "0 recetas" en producción

### 1.2 Antigravity — Importar recetas Kids
- [ ] Dar prompt de importación de `food_mood_kids_1500.json` al agente
- [ ] Verificar: `select count(*) from recetas where segmento = 'kids';` → 1500

### 1.3 Reimportar recetas Michelin actualizadas
- [ ] Dar prompt de reimportación de `food_mood_michelin_200.json` (con estilos en lugar de nombres de chefs)

### 1.4 Stripe — Configurar webhook real
- [ ] En Stripe Dashboard → Developers → Webhooks → Add endpoint
- [ ] URL: `https://food-mood.app/api/stripe/webhook`
- [ ] Eventos: `checkout.session.completed`, `customer.subscription.deleted`
- [ ] Copiar el `whsec_...` generado → añadir a `.env.local` y a variables de Vercel

### 1.5 Deploy a producción (Vercel)
- [ ] Añadir en Vercel → Settings → Environment Variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] Hacer deploy desde Antigravity (`git push` o botón de deploy)

### 1.6 Probar el flujo completo en producción
- [ ] Ir a `food-mood.app/pricing`
- [ ] Clic en "Empieza tu variedad — 9€/mes"
- [ ] Pagar con tarjeta test: `4242 4242 4242 4242` · fecha `12/29` · CVC `123`
- [ ] Verificar que `/recetas` se desbloquea tras el pago
- [ ] Verificar en Supabase: `select * from subscriptions;` → debe aparecer el registro

---

## FASE 2 — Empresa (semanas 1-4, en paralelo)

### 2.1 E-Residency Estonia
- [ ] Solicitar en [e-resident.gov.ee](https://e-resident.gov.ee) (~€100-120)
- [ ] Tiempo de espera: 3-4 semanas (recogida en embajada o punto de recogida)
- [ ] Documentos: pasaporte + foto + justificación de uso

### 2.2 Crear empresa estonia (con la tarjeta de e-Residency en mano)
Proveedores recomendados (gestionan todo online):
- **Xolo** → [xolo.io](https://xolo.io) — ~€79/mes con contabilidad incluida
- **Leapin Digital** → [leapin.eu](https://leapin.eu) — más barato, ~€49/mes
- **1Office** → [1office.eu](https://1office.eu) — opción completa

Incluye: IBAN europeo, IVA UE, contabilidad, dirección legal en Estonia

### 2.3 Cuentas de desarrollador (cuando tengas la empresa)
- [ ] **Apple Developer Program**: $99/año → [developer.apple.com](https://developer.apple.com)
- [ ] **Google Play Console**: $25 único → [play.google.com/console](https://play.google.com/console)

---

## FASE 3 — App móvil (semanas 4-8)

### 3.1 Preparar app con Capacitor
Dar este prompt a Antigravity:
```
## PROYECTO: food-mood.app (proyecto existente)

Convierte la app Next.js en app móvil usando Capacitor.

1. Instala: npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
2. Inicializa: npx cap init "Food Mood" "app.foodmood.food"
3. Build: npm run build
4. Añade plataformas: npx cap add ios && npx cap add android
5. Sync: npx cap sync

Para iOS: configura EAS Build (Expo) para compilar sin Mac
Para Android: genera el APK desde Android Studio en Windows

Asegúrate de que el manifest de Android incluye:
- permisos de internet
- deep links para food-mood.app

Cuando termines: muéstrame la estructura generada.
```

### 3.2 Compilar iOS sin Mac — EAS Build
- [ ] Instalar: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configurar: `eas build:configure`
- [ ] Compilar: `eas build --platform ios` (compila en la nube, sin Mac)
- [ ] Resultado: archivo `.ipa` listo para subir al App Store

### 3.3 Compilar Android en Windows
- [ ] Instalar Android Studio en Windows
- [ ] Abrir carpeta `android/` generada por Capacitor
- [ ] Build → Generate Signed Bundle/APK
- [ ] Subir a Google Play Console

### 3.4 Importante — Pagos en apps
Para evitar el 30% de comisión de Apple/Google:
- En la app mostrar: *"Para suscribirte visita food-mood.app"*
- El botón de suscripción en la app abre el navegador a `/pricing`
- El usuario paga en web → vuelve a la app → acceso desbloqueado

---

## FASE 4 — Crecer (mes 2+)

### Contenido & SEO
- [ ] Blog con artículos sobre gut-brain, microbioma, mood food
- [ ] Cada receta con URL propia y metadatos SEO
- [ ] Schema markup de recetas para Google

### Marketing
- [ ] Página de aterrizaje para anuncios → `/landing`
- [ ] Flujo: anuncio → test → receta gratis → upsell Premium
- [ ] Audiencias: mujeres 35-55 (principal), padres con hijos (kids)

### Producto
- [ ] Notificaciones push: "Tu receta de la semana está lista"
- [ ] Favoritos guardados por usuario
- [ ] Histórico de recetas recibidas
- [ ] Modo offline (PWA cache)

---

## RESUMEN DEL MODELO DE NEGOCIO

```
FREE
└── 1 receta después del test
└── Vista limitada de /recetas (blur)

PREMIUM €9/mes (Stripe)
└── 10.000 recetas adultos por mood, edad y sexo
└── 1.500 recetas Kids & Adolescentes
└── 200 recetas estilo Michelin-inspired
└── Buscador completo con filtros
└── Favoritos
└── Receta personalizada semanal
```

---

## PRÓXIMA ACCIÓN INMEDIATA

👉 **Ejecutar el GRANT en Supabase** para que aparezcan las recetas en producción.
Luego dar el prompt de Kids a Antigravity.

---

*Food·Mood — Psicología & Food Tech · Su Ferreras · 2026*
