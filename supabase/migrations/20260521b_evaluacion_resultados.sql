-- evaluacion_resultados: stores AI-generated nutritional assessments
create table if not exists public.evaluacion_resultados (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  tests_completados text[] not null default '{}',
  resultado     jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.evaluacion_resultados enable row level security;

drop policy if exists "Users see own evaluaciones" on public.evaluacion_resultados;
create policy "Users see own evaluaciones"
  on public.evaluacion_resultados for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own evaluaciones" on public.evaluacion_resultados;
create policy "Users insert own evaluaciones"
  on public.evaluacion_resultados for insert
  with check (auth.uid() = user_id);

-- Index for rate-limit query (count per user per month)
create index if not exists evaluacion_resultados_user_created
  on public.evaluacion_resultados (user_id, created_at desc);

-- Service role can insert (used by API route with service key)
grant insert, select on public.evaluacion_resultados to service_role;
