-- ══════════════════════════════════════════════════════════════════════════════
-- Migración: políticas SELECT del paciente para consumir contenido prescrito
-- ══════════════════════════════════════════════════════════════════════════════

-- Paciente puede leer sus propios vínculos activos
DROP POLICY IF EXISTS "ppl_select_patient" ON professional_patient_links;
CREATE POLICY "ppl_select_patient" ON professional_patient_links
  FOR SELECT TO authenticated
  USING (patient_user_id = auth.uid());

-- Paciente puede leer el perfil del profesional que lo tiene vinculado
DROP POLICY IF EXISTS "professionals_select_linked_patient" ON professionals;
CREATE POLICY "professionals_select_linked_patient" ON professionals
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT professional_id
      FROM   professional_patient_links
      WHERE  patient_user_id = auth.uid()
        AND  status          = 'active'
    )
  );
