-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Protocolo Cortisol — clinical_protocols + patient_protocols
-- Fecha: 2026-06-02
-- Aditiva: nuevas tablas + columnas opcionales en tablas existentes
-- ═══════════════════════════════════════════════════════════════════════════

-- ── clinical_protocols ────────────────────────────────────────────────────
-- Plantillas de protocolo reutilizables (seed inicial: Protocolo Cortisol)

CREATE TABLE IF NOT EXISTS public.clinical_protocols (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  slug         text        NOT NULL UNIQUE,
  description  text,
  duration_days int        NOT NULL DEFAULT 28,
  stages       jsonb       NOT NULL DEFAULT '[]',
  is_active    boolean     NOT NULL DEFAULT true,
  created_by   text        NOT NULL DEFAULT 'foodmood',
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clinical_protocols ENABLE ROW LEVEL SECURITY;

-- Cualquier profesional autenticado puede leer plantillas activas
DROP POLICY IF EXISTS "professionals_read_protocols" ON public.clinical_protocols;
CREATE POLICY "professionals_read_protocols"
  ON public.clinical_protocols
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_clinical_protocols_slug
  ON public.clinical_protocols(slug);

-- ── patient_protocols ─────────────────────────────────────────────────────
-- Instancias de un protocolo asignadas a un paciente concreto

CREATE TABLE IF NOT EXISTS public.patient_protocols (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  patient_user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id         uuid        NOT NULL REFERENCES public.clinical_protocols(id),
  started_at          timestamptz NOT NULL DEFAULT now(),
  current_stage       int         NOT NULL DEFAULT 1,
  status              text        NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  completed_at        timestamptz,
  professional_notes  text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_protocols ENABLE ROW LEVEL SECURITY;

-- Profesional: gestión completa de sus protocolos
DROP POLICY IF EXISTS "professional_manage_patient_protocols" ON public.patient_protocols;
CREATE POLICY "professional_manage_patient_protocols"
  ON public.patient_protocols
  FOR ALL
  TO authenticated
  USING  (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- Paciente: solo lectura de los suyos
DROP POLICY IF EXISTS "patient_read_own_protocol" ON public.patient_protocols;
CREATE POLICY "patient_read_own_protocol"
  ON public.patient_protocols
  FOR SELECT
  TO authenticated
  USING (patient_user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_patient_protocols_patient
  ON public.patient_protocols(patient_user_id, status);

CREATE INDEX IF NOT EXISTS idx_patient_protocols_professional
  ON public.patient_protocols(professional_id, patient_user_id);

-- ── Columnas de protocolo en therapeutic_assignments ─────────────────────
-- Nullable: los assignments manuales no tienen protocolo asociado

ALTER TABLE public.therapeutic_assignments
  ADD COLUMN IF NOT EXISTS patient_protocol_id uuid
    REFERENCES public.patient_protocols(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS protocol_stage int;

CREATE INDEX IF NOT EXISTS idx_assignments_protocol
  ON public.therapeutic_assignments(patient_protocol_id, protocol_stage)
  WHERE patient_protocol_id IS NOT NULL;

-- ── Columnas de protocolo en content_prescriptions ───────────────────────
ALTER TABLE public.content_prescriptions
  ADD COLUMN IF NOT EXISTS patient_protocol_id uuid
    REFERENCES public.patient_protocols(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS protocol_stage int;

CREATE INDEX IF NOT EXISTS idx_prescriptions_protocol
  ON public.content_prescriptions(patient_protocol_id, protocol_stage)
  WHERE patient_protocol_id IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: Protocolo Cortisol
-- Las herramientas usan los slugs canónicos del sistema de asignaciones
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.clinical_protocols (
  id,
  name,
  slug,
  description,
  duration_days,
  stages,
  is_active,
  created_by
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Protocolo Cortisol',
  'protocolo-cortisol',
  'Módulo clínico de 28 días que convierte el cortisol en una variable accionable dentro del flujo de consulta. Integra evaluación del eje HPA, nutrición adaptógena, rutinas de regulación, higiene del sueño y seguimiento con IA.',
  28,
  '[
    {
      "stage": 1,
      "name": "Evaluación del eje HPA",
      "days": "1-7",
      "day_end": 7,
      "tools": ["registro/interoceptivo", "registro/hambre"],
      "content_slugs": ["evaluacion-estres-hpa", "alimentacion-cortisol-intro"],
      "description": "Identificar el estado actual de activación del sistema nervioso y los patrones de estrés"
    },
    {
      "stage": 2,
      "name": "Nutrición adaptógena",
      "days": "8-14",
      "day_end": 14,
      "tools": ["registro/comida", "registro/hambre"],
      "content_slugs": ["alimentos-adaptogenos", "antiinflamatorio-estres"],
      "description": "Incorporar alimentos que modulan la respuesta al estrés"
    },
    {
      "stage": 3,
      "name": "Rutinas de regulación",
      "days": "15-19",
      "day_end": 19,
      "tools": ["registro/interoceptivo", "setup/intenciones"],
      "content_slugs": ["respiracion-vagal", "rutina-manana-cortisol"],
      "description": "Establecer microhábitos de regulación del sistema nervioso"
    },
    {
      "stage": 4,
      "name": "Higiene de sueño y cronobiología",
      "days": "20-24",
      "day_end": 24,
      "tools": ["registro/interoceptivo", "registro/pensamiento"],
      "content_slugs": ["higiene-sueno-cortisol", "cronobiologia-comidas"],
      "description": "Alinear alimentación, sueño y ritmos circadianos"
    },
    {
      "stage": 5,
      "name": "Seguimiento y ajuste con IA",
      "days": "25-28",
      "day_end": 28,
      "tools": ["registro/emocion", "setup/valores"],
      "content_slugs": ["consolidacion-protocolo"],
      "description": "Evaluar cambios, consolidar hábitos y planificar siguientes pasos"
    }
  ]'::jsonb,
  true,
  'foodmood'
)
ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  description   = EXCLUDED.description,
  duration_days = EXCLUDED.duration_days,
  stages        = EXCLUDED.stages,
  is_active     = EXCLUDED.is_active;
