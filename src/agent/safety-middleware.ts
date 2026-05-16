import { AgentResponse, AgentResponseSchema, Recomendacion } from './schema'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserHealthProfile {
  alergias:           string[]
  intolerancias:      string[]
  medicacion:         string[]
  condiciones:        string[]
  embarazo_lactancia: boolean
}

export interface SafetyResult {
  ok:          boolean
  response?:   AgentResponse
  error?:      string
  statusCode?: number
  flagged?:    'derivar_crisis' | 'derivar_tca' | 'derivar_medico'
}

// ── Interacciones fármaco-alimento ────────────────────────────────────────────
// Cada entrada: { meds: palabras clave en medicación, ingredients: palabras en
// ingredientes, advertencia: texto a añadir en advertencias[] }

const DRUG_FOOD_RULES: Array<{
  meds:        string[]
  ingredients: string[]
  advertencia: string
}> = [
  {
    meds:        ['warfarin', 'warfarina', 'acenocumarol', 'sintrom'],
    ingredients: ['té verde', 'green tea', 'matcha'],
    advertencia: 'El té verde puede potenciar el efecto de los anticoagulantes. Consulta con tu médico antes de tomarlo.',
  },
  {
    meds:        ['imao', 'tranilcipromina', 'fenelzina', 'isocarboxazida'],
    ingredients: ['fermento', 'fermentado', 'kimchi', 'kombucha', 'kéfir', 'miso', 'tempeh', 'sauerkraut', 'chucrut'],
    advertencia: 'Los alimentos fermentados ricos en tiramina pueden causar crisis hipertensiva con IMAOs. Consulta con tu psiquiatra o médico.',
  },
  {
    meds:        ['estatina', 'simvastatina', 'atorvastatina', 'lovastatina', 'fluvastatina'],
    ingredients: ['pomelo', 'grapefruit'],
    advertencia: 'El pomelo inhibe el metabolismo de las estatinas y puede aumentar su concentración en sangre. Evita combinarlo.',
  },
  {
    meds:        ['warfarin', 'warfarina', 'acenocumarol', 'sintrom'],
    ingredients: ['vitamina k', 'col rizada', 'kale', 'espinacas', 'brócoli'],
    advertencia: 'Los alimentos ricos en vitamina K pueden reducir el efecto de los anticoagulantes orales. Mantén un consumo estable y consulta con tu médico.',
  },
  {
    meds:        ['sertralina', 'fluoxetina', 'paroxetina', 'escitalopram', 'venlafaxina', 'antidepresivo'],
    ingredients: ['tiramina', 'queso curado', 'embutido curado', 'salami', 'pepperoni'],
    advertencia: 'Algunos antidepresivos pueden interactuar con alimentos ricos en tiramina. Consulta con tu médico o farmacéutico.',
  },
]

// ── Reglas embarazo/lactancia ─────────────────────────────────────────────────

const EMBARAZO_RULES: Array<{ ingredients: string[]; advertencia: string }> = [
  {
    ingredients: ['kombucha', 'kéfir sin pasteurizar', 'fermentado no pasteurizado'],
    advertencia: 'Durante el embarazo o lactancia, opta por fermentos pasteurizados. Consulta con tu matrona o ginecólogo.',
  },
  {
    ingredients: ['ashwagandha', 'maca', 'rhodiola', 'adaptógeno', 'ginseng'],
    advertencia: 'Evita los adaptógenos en dosis altas durante el embarazo y lactancia sin supervisión médica.',
  },
  {
    ingredients: ['regaliz', 'licorice'],
    advertencia: 'El regaliz está contraindicado durante el embarazo.',
  },
]

// ── Función principal ─────────────────────────────────────────────────────────

export function runSafetyChecks(
  raw:     unknown,
  profile: UserHealthProfile,
): SafetyResult {

  // 1. Validar schema JSON
  const parsed = AgentResponseSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'invalid_schema', statusCode: 422 }
  }

  const response = parsed.data

  // 2. Modo derivar → pasar limpio, registrar flag para logging prioritario
  if (response.modo === 'derivar') {
    const flagMap = {
      crisis_emocional:       'derivar_crisis',
      tca:                    'derivar_tca',
      condicion_medica_activa: 'derivar_medico',
    } as const
    return {
      ok:       true,
      response,
      flagged:  flagMap[response.tipo_derivacion],
    }
  }

  // 3. nivel_evidencia obligatorio en recomendacion
  if (
    response.modo === 'recomendacion' &&
    !response.microcontenido.nivel_evidencia
  ) {
    return { ok: false, error: 'missing_nivel_evidencia', statusCode: 422 }
  }

  // 4. Cruce de alergias e intolerancias
  if (response.modo === 'recomendacion') {
    const ingredientesText = response.receta.ingredientes
      .join(' ')
      .toLowerCase()

    const alertas = [...profile.alergias, ...profile.intolerancias]
    for (const alerta of alertas) {
      if (ingredientesText.includes(alerta.toLowerCase())) {
        return {
          ok:         false,
          error:      `alergia_detectada:${alerta}`,
          statusCode: 400,
        }
      }
    }
  }

  // 5. Interacciones fármaco-alimento (añade advertencias, no bloquea)
  if (response.modo === 'recomendacion') {
    const ingredientesText = response.receta.ingredientes
      .join(' ')
      .toLowerCase()
    const medText = profile.medicacion.join(' ').toLowerCase()

    for (const rule of DRUG_FOOD_RULES) {
      const medMatch = rule.meds.some(m => medText.includes(m))
      const ingMatch = rule.ingredients.some(i => ingredientesText.includes(i))
      if (medMatch && ingMatch) {
        response.advertencias.push(rule.advertencia)
      }
    }
  }

  // 6. Restricciones embarazo/lactancia
  if (profile.embarazo_lactancia && response.modo === 'recomendacion') {
    const ingredientesText = response.receta.ingredientes
      .join(' ')
      .toLowerCase()
    for (const rule of EMBARAZO_RULES) {
      if (rule.ingredients.some(i => ingredientesText.includes(i))) {
        response.advertencias.push(rule.advertencia)
      }
    }
  }

  // 7. Disclaimer sanitario permanente en recomendacion
  if (response.modo === 'recomendacion') {
    const disclaimer =
      'Este contenido es orientativo y no sustituye el criterio de un profesional sanitario. Para condiciones activas, consulta con tu nutricionista o médico antes de implementar cambios.'
    if (!response.advertencias.includes(disclaimer)) {
      response.advertencias.push(disclaimer)
    }
  }

  return { ok: true, response }
}

// ── Helper: construir advertencias de fármaco-alimento para el prompt ─────────

export function buildDrugFoodWarnings(medicacion: string[]): string {
  if (medicacion.length === 0) return ''
  const medText = medicacion.join(' ').toLowerCase()
  const warnings: string[] = []

  for (const rule of DRUG_FOOD_RULES) {
    if (rule.meds.some(m => medText.includes(m))) {
      warnings.push(`- ${rule.advertencia}`)
    }
  }

  return warnings.length > 0
    ? `Interacciones fármaco-alimento activas para este perfil:\n${warnings.join('\n')}`
    : ''
}
