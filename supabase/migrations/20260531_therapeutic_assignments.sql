-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Asignaciones terapéuticas
-- Fecha: 2026-05-31
-- Aditiva: nuevas tablas, no modifica nada existente.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── therapeutic_assignments ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.therapeutic_assignments (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  patient_user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug           text        NOT NULL,
  title               text        NOT NULL,
  instruction         text        NOT NULL,
  frequency_per_week  int         NOT NULL DEFAULT 3 CHECK (frequency_per_week BETWEEN 1 AND 7),
  due_date            date,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.therapeutic_assignments ENABLE ROW LEVEL SECURITY;

-- Professional: full access to their own assignments (professional_id = auth.uid() because professionals.id = auth.uid())
DROP POLICY IF EXISTS "professional_manage_assignments" ON public.therapeutic_assignments;
CREATE POLICY "professional_manage_assignments"
  ON public.therapeutic_assignments
  FOR ALL
  TO authenticated
  USING  (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- Patient: read their active assignments
DROP POLICY IF EXISTS "patient_read_assignments" ON public.therapeutic_assignments;
CREATE POLICY "patient_read_assignments"
  ON public.therapeutic_assignments
  FOR SELECT
  TO authenticated
  USING (patient_user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_therapeutic_assignments_patient
  ON public.therapeutic_assignments(patient_user_id, is_active, tool_slug);

CREATE INDEX IF NOT EXISTS idx_therapeutic_assignments_professional
  ON public.therapeutic_assignments(professional_id, patient_user_id);

-- ── assignment_completions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assignment_completions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   uuid        NOT NULL REFERENCES public.therapeutic_assignments(id) ON DELETE CASCADE,
  patient_user_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_record_id  uuid,
  notes           text,
  completed_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assignment_completions ENABLE ROW LEVEL SECURITY;

-- Patient: insert and read their own completions
DROP POLICY IF EXISTS "patient_manage_completions" ON public.assignment_completions;
CREATE POLICY "patient_manage_completions"
  ON public.assignment_completions
  FOR ALL
  TO authenticated
  USING  (patient_user_id = auth.uid())
  WITH CHECK (patient_user_id = auth.uid());

-- Professional: read completions for their assignments
DROP POLICY IF EXISTS "professional_read_completions" ON public.assignment_completions;
CREATE POLICY "professional_read_completions"
  ON public.assignment_completions
  FOR SELECT
  TO authenticated
  USING (
    assignment_id IN (
      SELECT id FROM public.therapeutic_assignments WHERE professional_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_assignment_completions_assignment
  ON public.assignment_completions(assignment_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_assignment_completions_patient
  ON public.assignment_completions(patient_user_id, completed_at DESC);
