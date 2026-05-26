# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

**Food·Mood** is a Spanish-language wellness PWA that maps emotional states to functional recipes based on gut-brain science. Users take an 8-step mood quiz, get a dominant mood result from 6 possible states (Activación, Calma, Focus, Social, Reset, Confort), and receive personalized recipe recommendations.

## Commands

```bash
npm run dev          # Start Next.js dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npm run seed-recetas # Seed Supabase with recipe data
npx vitest           # Run all tests
npx vitest run path/to/file.test.ts  # Run single test file
```

## Architecture

**Stack**: Next.js 14 App Router · TypeScript (strict) · Supabase (PostgreSQL + Auth + RLS) · Zustand (persisted to localStorage) · Stripe · Anthropic Claude API · Tailwind CSS · Framer Motion

### Core Data Flow

1. User completes 8-question quiz → `useQuizStore` (Zustand) calculates mood scores → dominant mood determined
2. Mood maps to Supabase `recetas` table, filtered by mood, age, gender, and `premium_level`
3. Premium users: AI-generated recipes via `/api/recipes/generate` (Claude 3.5 Haiku → JSON recipe + image prompt → Google Generative AI for image)
4. Dashboard polls Supabase for mood history, streaks, and emotional palette snapshots

### Authentication & Premium

- Supabase Auth (email/password), server-side sessions via `@supabase/ssr`
- Client auth state in `useAuthStore` (Zustand)
- Premium status is a waterfall check: `subscriptions.status = 'active'` → `profiles.is_premium = true` → `profiles.premium_level > 0`
- Stripe checkout → webhook (`/api/stripe/webhook`) → sets `profiles.is_premium` and inserts into `subscriptions`
- Use `SUPABASE_SERVICE_ROLE_KEY` for server-side writes; `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client

### Key Directories

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js pages + API routes |
| `src/app/api/` | Server-side endpoints (chat, checkout, stripe webhook, push, recipe gen) |
| `src/components/` | Feature-grouped React components |
| `src/lib/` | Utilities, Supabase clients, AI logic, premium checks |
| `src/store/` | Zustand stores (`useAuthStore`, `useQuizStore`) |
| `src/data/` | Static mood definitions, quiz questions, fallback recipes |
| `scripts/` | DB seed + diagnostic scripts |

### Component Patterns

- **Server components**: Blog, Glossary — fetch from Supabase and render HTML
- **Client components**: Quiz, Dashboard, Diary — use Zustand + Supabase browser client
- Two Supabase client entry points: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server/API routes)

## Required Environment Variables

```
# Supabase
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RECETAS_SUPABASE_KEY

# AI
ANTHROPIC_API_KEY
GOOGLE_AI_API_KEY

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
STRIPE_PRICE_ID_QUARTERLY
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_ID_QUARTERLY

# Email
RESEND_API_KEY

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY

# Security
ENCRYPTION_SECRET      # AES-256-GCM key for sensitive field encryption (server-side only)
ANALYTICS_SALT         # Salt for irreversible user_hash in analytics_aggregated

# Admin
ADMIN_EMAIL
RESEND_FROM_EMAIL
```

## Code Style

- All user-facing text must be in **Spanish**
- Absolute imports only: `@/components/...`, `@/lib/...`
- Tailwind utility classes first; avoid custom CSS except `globals.css`
- Functional components + hooks only
- Brand language (Spanish): usar *nutrir, equilibrio, vitalidad, placer*; NUNCA usar *dieta, restricción, detox, culpa*
- Brand palette: burgundy `#6B2737`, cream `#F5F0E8`, gold `#C9A84C` — NEVER use navy
- Frontend aesthetic: luxury, hedonistic, pleasure-first, editorial dark typography
- NEVER write "Kombucha vinegar" — always "vinagre de kombucha" or "vinagre de manzana"

## Testing

Vitest for business logic. Target 80% coverage on logic in `src/lib/` and `src/store/`. UI components do not need tests.

## Rol y estándares de calidad — OBLIGATORIO

Actúa siempre como un desarrollador web senior, meticuloso y preciso. Estas reglas son no negociables:

### Nunca declarar una tarea terminada sin verificar

- NUNCA digas "listo", "funciona" o "arreglado" sin haber comprobado el resultado con herramientas (Read, Grep, lint, build).
- Si no puedes ejecutar la app para verificar visualmente, dilo explícitamente: "No puedo verificar el comportamiento en browser, confirma tú que X funciona."
- Si un cambio toca lógica de negocio, rutas o auth: ejecuta `npm run lint` y comprueba que no hay errores nuevos antes de cerrar.

### Auditoría antes de cada cambio

Antes de modificar un archivo, busca con Grep si hay otros archivos que dependen de él o que replican el mismo patrón. Un bug en un archivo suele existir en los archivos hermanos.

### Encoding y texto

- Antes de escribir o editar archivos con texto en español, verifica que el archivo destino está en UTF-8 sin BOM.
- Si detectas caracteres tipo `Ã©`, `â€"`, `Â·` en cualquier archivo, es mojibake UTF-8/cp1252 — corrígelo antes de continuar.

### Scripts auxiliares

- Los scripts de diagnóstico o fix (`.mjs`, `.ts` en raíz) deben eliminarse tras su uso. No dejar artefactos en el repo.

### Gestión de errores durante la tarea

- Si un enfoque falla dos veces, para y explica el problema antes de intentar un tercer enfoque diferente. No iterar a ciegas.
- Si revertiste cambios, confirma explícitamente qué estado quedó antes de continuar.
