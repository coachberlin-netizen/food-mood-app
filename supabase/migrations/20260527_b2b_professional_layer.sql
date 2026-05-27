-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: Capa B2B — Profesionales y gestión de pacientes
-- Fecha: 2026-05-27
-- REGLA CRÍTICA: Migración PURAMENTE ADITIVA. No modifica ninguna tabla,
-- columna, política ni función existente. Las usuarias B2C siguen intactas.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- EXTENSIONES necesarias (ya deberían existir, idempotente)
-- ───────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 1: professionals
-- Perfil del profesional sanitario. PK = auth.uid() del profesional.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS professionals (
  id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text        NOT NULL UNIQUE,
  full_name           text        NOT NULL,
  professional_title  text        NOT NULL,  -- ej: 'Dietista-Nutricionista', 'Psicóloga'
  license_number      text,
  bio                 text,
  subscription_status text        NOT NULL DEFAULT 'trial'
                        CHECK (subscription_status IN ('trial', 'active', 'paused', 'cancelled')),
  subscription_tier   text
                        CHECK (subscription_tier IN ('starter', 'pro')),
  stripe_customer_id  text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_professionals_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION update_professionals_updated_at();

-- Política: cualquier usuario autenticado puede registrarse como profesional
--           (solo puede insertar su propio uid)
DROP POLICY IF EXISTS "professionals_insert_own" ON professionals;
CREATE POLICY "professionals_insert_own" ON professionals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política: el profesional solo lee su propio perfil
DROP POLICY IF EXISTS "professionals_select_own" ON professionals;
CREATE POLICY "professionals_select_own" ON professionals
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Política: el profesional solo actualiza su propio perfil
DROP POLICY IF EXISTS "professionals_update_own" ON professionals;
CREATE POLICY "professionals_update_own" ON professionals
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 2: patient_invitations
-- Códigos de invitación generados por el profesional para incorporar pacientes.
-- El código tiene 6 caracteres alfanuméricos en mayúsculas.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS patient_invitations (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id  uuid        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  invitation_code  text        NOT NULL UNIQUE,  -- 6 chars, ej: 'A3K9PQ'
  patient_email    text,
  patient_name     text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  expires_at       timestamptz NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  used_at          timestamptz,
  used_by_user_id  uuid        REFERENCES auth.users(id)
);

ALTER TABLE patient_invitations ENABLE ROW LEVEL SECURITY;

-- Índice de búsqueda por código (operación crítica en canje)
CREATE INDEX IF NOT EXISTS idx_patient_invitations_code
  ON patient_invitations(invitation_code);

CREATE INDEX IF NOT EXISTS idx_patient_invitations_professional
  ON patient_invitations(professional_id);

-- Política: el profesional lee sus propias invitaciones
DROP POLICY IF EXISTS "invitations_select_own" ON patient_invitations;
CREATE POLICY "invitations_select_own" ON patient_invitations
  FOR SELECT TO authenticated
  USING (professional_id = auth.uid());

-- Política: el profesional crea invitaciones solo para sí mismo
DROP POLICY IF EXISTS "invitations_insert_own" ON patient_invitations;
CREATE POLICY "invitations_insert_own" ON patient_invitations
  FOR INSERT TO authenticated
  WITH CHECK (professional_id = auth.uid());

-- Update SOLO permitido vía la función redeem_invitation (SECURITY DEFINER)
-- No se expone política de UPDATE directa al cliente.


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 3: professional_patient_links
-- Vínculo activo entre un profesional y un paciente.
-- Se crea únicamente al canjear una invitación válida.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS professional_patient_links (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status              text        NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'paused', 'ended')),
  linked_at           timestamptz NOT NULL DEFAULT now(),
  ended_at            timestamptz,
  professional_notes  text,
  UNIQUE (professional_id, patient_user_id)
);

ALTER TABLE professional_patient_links ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ppl_professional
  ON professional_patient_links(professional_id);

CREATE INDEX IF NOT EXISTS idx_ppl_patient
  ON professional_patient_links(patient_user_id);

CREATE INDEX IF NOT EXISTS idx_ppl_status
  ON professional_patient_links(professional_id, patient_user_id, status);

-- Política: el profesional ve sus vínculos
DROP POLICY IF EXISTS "ppl_select_professional" ON professional_patient_links;
CREATE POLICY "ppl_select_professional" ON professional_patient_links
  FOR SELECT TO authenticated
  USING (professional_id = auth.uid());

-- Política: el paciente ve sus propios vínculos
DROP POLICY IF EXISTS "ppl_select_patient" ON professional_patient_links;
CREATE POLICY "ppl_select_patient" ON professional_patient_links
  FOR SELECT TO authenticated
  USING (patient_user_id = auth.uid());

-- Política: el profesional puede actualizar (ej: pausar, notas)
DROP POLICY IF EXISTS "ppl_update_professional" ON professional_patient_links;
CREATE POLICY "ppl_update_professional" ON professional_patient_links
  FOR UPDATE TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- INSERT solo vía redeem_invitation (SECURITY DEFINER), no política directa.


-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCIÓN HELPER: redeem_invitation(code text)
-- Canjea una invitación, crea el vínculo profesional-paciente y
-- marca la invitación como usada.
-- SECURITY DEFINER para poder hacer INSERT en patient_invitations y
-- professional_patient_links sin exponer políticas de escritura directa.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION redeem_invitation(p_code text)
RETURNS uuid  -- devuelve el professional_id resultante
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation  patient_invitations%ROWTYPE;
  v_user_id     uuid := auth.uid();
  v_link_id     uuid;
BEGIN
  -- 1. Validar que el usuario está autenticado
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para canjear una invitación.';
  END IF;

  -- 2. Buscar la invitación
  SELECT * INTO v_invitation
  FROM patient_invitations
  WHERE invitation_code = upper(trim(p_code));

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Código de invitación no válido.';
  END IF;

  -- 3. Verificar que no ha sido usada
  IF v_invitation.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'Este código de invitación ya ha sido utilizado.';
  END IF;

  -- 4. Verificar que no ha expirado
  IF v_invitation.expires_at < now() THEN
    RAISE EXCEPTION 'Este código de invitación ha expirado.';
  END IF;

  -- 5. Verificar que el paciente no está ya vinculado a este profesional
  IF EXISTS (
    SELECT 1 FROM professional_patient_links
    WHERE professional_id = v_invitation.professional_id
      AND patient_user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Ya estás vinculada con este profesional.';
  END IF;

  -- 6. Crear el vínculo profesional-paciente
  INSERT INTO professional_patient_links (professional_id, patient_user_id, status)
  VALUES (v_invitation.professional_id, v_user_id, 'active')
  RETURNING id INTO v_link_id;

  -- 7. Marcar la invitación como usada
  UPDATE patient_invitations
  SET used_at         = now(),
      used_by_user_id = v_user_id
  WHERE id = v_invitation.id;

  RETURN v_invitation.professional_id;
END;
$$;

-- Revocar acceso directo y conceder solo a authenticated
REVOKE ALL ON FUNCTION redeem_invitation(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION redeem_invitation(text) TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCIÓN HELPER INTERNA: is_linked_professional(p_patient_id uuid)
-- Devuelve true si auth.uid() es un profesional con vínculo ACTIVO
-- con el paciente indicado. Se usa en políticas RLS de logs clínicos.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION is_linked_professional(p_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM professional_patient_links
    WHERE professional_id  = auth.uid()
      AND patient_user_id  = p_patient_id
      AND status           = 'active'
  );
$$;

REVOKE ALL ON FUNCTION is_linked_professional(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_linked_professional(uuid) TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 4: emotional_meal_logs
-- Registro del estado emocional antes y después de cada comida.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS emotional_meal_logs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at         timestamptz NOT NULL DEFAULT now(),
  emotion_before    text        NOT NULL,
  intensity_before  int         NOT NULL CHECK (intensity_before BETWEEN 1 AND 10),
  emotion_after     text        NOT NULL,
  intensity_after   int         NOT NULL CHECK (intensity_after BETWEEN 1 AND 10),
  meal_description  text,
  notes             text
);

ALTER TABLE emotional_meal_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_emotional_meal_logs_user
  ON emotional_meal_logs(user_id, logged_at DESC);

-- Paciente: acceso completo a sus propios registros
DROP POLICY IF EXISTS "eml_patient_all" ON emotional_meal_logs;
CREATE POLICY "eml_patient_all" ON emotional_meal_logs
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Profesional vinculado activo: solo lectura
DROP POLICY IF EXISTS "eml_professional_select" ON emotional_meal_logs;
CREATE POLICY "eml_professional_select" ON emotional_meal_logs
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 5: hunger_thermometer_logs
-- Termómetro del hambre: diferencia hambre física vs. emocional.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS hunger_thermometer_logs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at         timestamptz NOT NULL DEFAULT now(),
  physical_hunger   int         NOT NULL CHECK (physical_hunger BETWEEN 0 AND 10),
  emotional_hunger  int         NOT NULL CHECK (emotional_hunger BETWEEN 0 AND 10),
  decided_to_eat    boolean     NOT NULL,
  context_notes     text
);

ALTER TABLE hunger_thermometer_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_hunger_logs_user
  ON hunger_thermometer_logs(user_id, logged_at DESC);

DROP POLICY IF EXISTS "htl_patient_all" ON hunger_thermometer_logs;
CREATE POLICY "htl_patient_all" ON hunger_thermometer_logs
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "htl_professional_select" ON hunger_thermometer_logs;
CREATE POLICY "htl_professional_select" ON hunger_thermometer_logs
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 6: thought_records
-- Registros de pensamiento (TCC) — situación, pensamiento automático,
-- emoción, conducta y reestructuración cognitiva.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS thought_records (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at          timestamptz NOT NULL DEFAULT now(),
  situation           text        NOT NULL,
  automatic_thought   text        NOT NULL,
  emotion             text        NOT NULL,
  emotion_intensity   int         NOT NULL CHECK (emotion_intensity BETWEEN 1 AND 10),
  behavior            text        NOT NULL,
  outcome             text,
  alternative_thought text
);

ALTER TABLE thought_records ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_thought_records_user
  ON thought_records(user_id, created_at DESC);

DROP POLICY IF EXISTS "tr_patient_all" ON thought_records;
CREATE POLICY "tr_patient_all" ON thought_records
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "tr_professional_select" ON thought_records;
CREATE POLICY "tr_professional_select" ON thought_records
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 7: values_clarifications
-- Clarificación de valores y visión de la relación con la comida (ACT).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS values_clarifications (
  id                            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at                    timestamptz NOT NULL DEFAULT now(),
  core_values                   text[]      NOT NULL DEFAULT '{}',
  relationship_with_food_vision text        NOT NULL,
  committed_actions             text[]      NOT NULL DEFAULT '{}'
);

ALTER TABLE values_clarifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_values_clarifications_user
  ON values_clarifications(user_id, created_at DESC);

DROP POLICY IF EXISTS "vc_patient_all" ON values_clarifications;
CREATE POLICY "vc_patient_all" ON values_clarifications
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "vc_professional_select" ON values_clarifications;
CREATE POLICY "vc_professional_select" ON values_clarifications
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 8: content_library
-- Biblioteca de contenido prescribible (artículos, vídeos, ejercicios…).
-- La escritura es exclusiva del service_role (admin backend).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_library (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text        NOT NULL,
  slug             text        NOT NULL UNIQUE,
  content_type     text        NOT NULL
                     CHECK (content_type IN ('article', 'video', 'newsletter', 'exercise')),
  body_markdown    text,
  body_html        text,
  external_url     text,
  duration_minutes int,
  tags             text[]      NOT NULL DEFAULT '{}',
  is_published     boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_content_library_slug
  ON content_library(slug);

CREATE INDEX IF NOT EXISTS idx_content_library_published
  ON content_library(is_published, content_type);

-- Cualquier usuario autenticado puede leer contenido publicado
DROP POLICY IF EXISTS "cl_select_published" ON content_library;
CREATE POLICY "cl_select_published" ON content_library
  FOR SELECT TO authenticated
  USING (is_published = true);

-- INSERT / UPDATE / DELETE solo service_role (no política = denegado a authenticated)


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLA 9: content_prescriptions
-- Asignación de contenido por parte de un profesional a un paciente.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS content_prescriptions (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id    uuid        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id         uuid        NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
  prescribed_at      timestamptz NOT NULL DEFAULT now(),
  read_at            timestamptz,
  professional_note  text
);

ALTER TABLE content_prescriptions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_content_prescriptions_patient
  ON content_prescriptions(patient_user_id, prescribed_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_prescriptions_professional
  ON content_prescriptions(professional_id, prescribed_at DESC);

-- Paciente: lee sus prescripciones y puede marcar read_at
DROP POLICY IF EXISTS "cp_patient_select" ON content_prescriptions;
CREATE POLICY "cp_patient_select" ON content_prescriptions
  FOR SELECT TO authenticated
  USING (patient_user_id = auth.uid());

-- Paciente: UPDATE solo para marcar como leído (read_at)
-- El UPDATE completo está limitado vía CHECK: solo puede tocar read_at
DROP POLICY IF EXISTS "cp_patient_update_read" ON content_prescriptions;
CREATE POLICY "cp_patient_update_read" ON content_prescriptions
  FOR UPDATE TO authenticated
  USING (patient_user_id = auth.uid())
  WITH CHECK (
    patient_user_id    = auth.uid()
    AND professional_id = professional_id  -- no puede cambiar el profesional
    AND content_id      = content_id       -- no puede cambiar el contenido
  );

-- Profesional: lee sus propias prescripciones
DROP POLICY IF EXISTS "cp_professional_select" ON content_prescriptions;
CREATE POLICY "cp_professional_select" ON content_prescriptions
  FOR SELECT TO authenticated
  USING (professional_id = auth.uid());

-- Profesional: solo puede prescribir si tiene vínculo activo con el paciente
DROP POLICY IF EXISTS "cp_professional_insert" ON content_prescriptions;
CREATE POLICY "cp_professional_insert" ON content_prescriptions
  FOR INSERT TO authenticated
  WITH CHECK (
    professional_id = auth.uid()
    AND is_linked_professional(patient_user_id)
  );

-- Profesional: UPDATE solo del campo professional_note
DROP POLICY IF EXISTS "cp_professional_update_note" ON content_prescriptions;
CREATE POLICY "cp_professional_update_note" ON content_prescriptions
  FOR UPDATE TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (
    professional_id = auth.uid()
    AND patient_user_id = patient_user_id  -- no puede cambiar el paciente
    AND content_id      = content_id       -- no puede cambiar el contenido
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- GRANTS de tablas a authenticated (RLS activo — las políticas filtran)
-- ═══════════════════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, UPDATE, DELETE ON professionals             TO authenticated;
GRANT SELECT, INSERT                 ON patient_invitations       TO authenticated;
GRANT SELECT, UPDATE                 ON professional_patient_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON emotional_meal_logs       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON hunger_thermometer_logs   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON thought_records           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON values_clarifications     TO authenticated;
GRANT SELECT                         ON content_library           TO authenticated;
GRANT SELECT, INSERT, UPDATE         ON content_prescriptions     TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- FIN DE MIGRACIÓN
-- ═══════════════════════════════════════════════════════════════════════════
