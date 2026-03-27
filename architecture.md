# Architecture: Food Mood

## Project Structure
-   `src/app/`: Next.js App Router structure.
-   `src/components/ui/`, `src/components/layout/`, `src/components/mood/`, `src/components/recipe/`, `src/components/quiz/`: UI and feature components.
-   `src/lib/`: Utilities, constants, types, Supabase client.
-   `src/data/`: Mock data (moods, recipes, quiz questions).

## Stack
-   Next.js 14 (App Router)
-   TypeScript
-   Tailwind CSS (with `@tailwindcss/typography`)
-   Framer Motion (animations)
-   Zustand (state management)
-   Supabase (backend)
-   Vitest (testing)

## Mood States (6)
1.  **Ansioso/Estresado** (Anxious/Stressed)
2.  **Triste/Apagado** (Sad/Low)
3.  **Fatigado/Sin Energía** (Fatigued/Low Energy)
4.  **Desconcentrado/Neblina Mental** (Unfocused/Brain Fog)
5.  **Irritable/Mal Humor** (Irritable)
6.  **Equilibrado/Buscando Mantenimiento** (Balanced/Maintenance)
