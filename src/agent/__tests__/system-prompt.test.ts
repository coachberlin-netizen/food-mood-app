import { describe, it, expect } from 'vitest'
import { runSafetyChecks } from '../safety-middleware'
import type { UserHealthProfile } from '../safety-middleware'

const profileVacio: UserHealthProfile = {
  alergias:           [],
  intolerancias:      [],
  medicacion:         [],
  condiciones:        [],
  embarazo_lactancia: false,
}

// ── 1. Mood check-in normal ────────────────────────────────────────────────────

describe('1. mood check-in normal — Calma sin medicación', () => {
  it('devuelve modo recomendacion con categoria Calma y palancas coherentes', () => {
    const mockLLMOutput = {
      modo: 'recomendacion',
      receta: {
        titulo:              'Kéfir con lavanda y miel',
        ingredientes:        ['kéfir', 'lavanda seca', 'miel cruda', 'agua'],
        pasos:               ['Calienta el kéfir suavemente.', 'Añade lavanda y deja reposar 3 min.', 'Endulza con miel.'],
        categoria_food_mood: 'Calma',
        tiempo_min:          5,
      },
      microaccion: {
        titulo:       'Respiración 4-7-8',
        descripcion:  'Inhala 4 s, aguanta 7 s, exhala 8 s. Repite 4 veces.',
        duracion_min: 3,
      },
      microcontenido: {
        titulo:              'Fermentos y tono vagal',
        porque:              'El kéfir activa el nervio vago vía eje intestino-cerebro, reduciendo el cortisol basal.',
        palancas_longevidad: ['tono_vagal', 'microbiota'],
        nivel_evidencia:     'B',
        fuentes:             ['Food·Mood cap.3: fermentación y calma emocional'],
      },
      advertencias: [],
    }

    const result = runSafetyChecks(mockLLMOutput, profileVacio)
    expect(result.ok).toBe(true)
    expect(result.response?.modo).toBe('recomendacion')
    if (result.response?.modo !== 'recomendacion') return
    expect(result.response.receta.categoria_food_mood).toBe('Calma')
    expect(result.response.microcontenido.palancas_longevidad).toContain('tono_vagal')
    expect(result.response.microcontenido.palancas_longevidad).toContain('microbiota')
    expect(result.response.microcontenido.nivel_evidencia).toBe('B')
  })
})

// ── 2. Alergia a frutos secos ─────────────────────────────────────────────────

describe('2. alergia a frutos secos — mood Focus', () => {
  it('bloquea output con ingredientes alérgenos con statusCode 400', () => {
    const mockLLMOutput = {
      modo: 'recomendacion',
      receta: {
        titulo:              'Batido de focus con almendras',
        ingredientes:        ['almendras', 'cacao puro', 'plátano', 'leche de avena'],
        pasos:               ['Tritura todo.'],
        categoria_food_mood: 'Focus',
        tiempo_min:          5,
      },
      microaccion: {
        titulo: 'Paseo al sol', descripcion: '10 min antes del trabajo.', duracion_min: 10,
      },
      microcontenido: {
        titulo:              'Omega-3 y BDNF',
        porque:              'Los frutos secos aportan alfa-linolénico que el cerebro convierte en DHA.',
        palancas_longevidad: ['BDNF', 'NAD+'],
        nivel_evidencia:     'B',
        fuentes:             ['KB longevidad: omega-3 y función cognitiva'],
      },
      advertencias: [],
    }

    const result = runSafetyChecks(mockLLMOutput, {
      ...profileVacio,
      alergias: ['almendras', 'frutos secos'],
    })
    expect(result.ok).toBe(false)
    expect(result.statusCode).toBe(400)
    expect(result.error).toContain('alergia_detectada')
    expect(result.error).toContain('almendras')
  })
})

// ── 3. Warfarina + té verde ───────────────────────────────────────────────────

describe('3. warfarina en perfil + té verde en receta', () => {
  it('no bloquea pero añade advertencia de anticoagulante', () => {
    const mockLLMOutput = {
      modo: 'recomendacion',
      receta: {
        titulo:              'Matcha reset con espermidina',
        ingredientes:        ['té verde matcha', 'agua caliente', 'germen de trigo'],
        pasos:               ['Bate el matcha.', 'Añade germen de trigo.'],
        categoria_food_mood: 'Reset',
        tiempo_min:          5,
      },
      microaccion: {
        titulo: 'Ventana de ayuno 16h', descripcion: 'Cena a las 20h, desayuna a las 12h.', duracion_min: 0,
      },
      microcontenido: {
        titulo:              'EGCG y autofagia',
        porque:              'El EGCG activa AMPK e inhibe mTOR, favoreciendo la autofagia.',
        palancas_longevidad: ['autofagia', 'AMPK', 'espermidina'],
        nivel_evidencia:     'B',
        fuentes:             ['KB longevidad: EGCG y autofagia — Antioxidants 2022'],
      },
      advertencias: [],
    }

    const result = runSafetyChecks(mockLLMOutput, {
      ...profileVacio,
      medicacion: ['warfarina'],
    })
    expect(result.ok).toBe(true)
    if (result.response?.modo !== 'recomendacion') return
    const advertencias = result.response.advertencias.join(' ').toLowerCase()
    expect(
      advertencias.includes('anticoagulante') || advertencias.includes('médico')
    ).toBe(true)
  })
})

// ── 4. Señal TCA ──────────────────────────────────────────────────────────────

describe('4. señal TCA en texto libre', () => {
  it('modo derivar con tipo_derivacion tca y sin receta', () => {
    const mockLLMOutput = {
      modo:            'derivar',
      mensaje:         'Lo que describes suena a una relación con la comida que merece atención especializada. No estás sola.',
      tipo_derivacion: 'tca',
      recursos:        [
        'Asociación contra la Anorexia y la Bulimia (ACAB): 93 412 36 22',
        'ACAB chat: acab.org',
      ],
    }

    const result = runSafetyChecks(mockLLMOutput, profileVacio)
    expect(result.ok).toBe(true)
    expect(result.response?.modo).toBe('derivar')
    if (result.response?.modo !== 'derivar') return
    expect(result.response.tipo_derivacion).toBe('tca')
    expect('receta' in result.response).toBe(false)
    expect(result.flagged).toBe('derivar_tca')
  })
})

// ── 5. Crisis emocional ───────────────────────────────────────────────────────

describe('5. crisis emocional aguda', () => {
  it('modo derivar con tipo crisis_emocional, sin receta, recursos de España', () => {
    const mockLLMOutput = {
      modo:            'derivar',
      mensaje:         'Lo que sientes importa. Hay personas preparadas para acompañarte ahora mismo, sin juzgarte.',
      tipo_derivacion: 'crisis_emocional',
      recursos:        [
        'Teléfono de la Esperanza: 717 003 717',
        'Línea de atención a la conducta suicida: 024',
      ],
    }

    const result = runSafetyChecks(mockLLMOutput, profileVacio)
    expect(result.ok).toBe(true)
    expect(result.response?.modo).toBe('derivar')
    if (result.response?.modo !== 'derivar') return
    expect(result.response.tipo_derivacion).toBe('crisis_emocional')
    expect('receta' in result.response).toBe(false)
    expect(result.flagged).toBe('derivar_crisis')
    // Recursos deben estar presentes
    expect(result.response.recursos.length).toBeGreaterThan(0)
  })
})

// ── 6. Pregunta libre de chat ─────────────────────────────────────────────────

describe('6. pregunta libre — shrub con sertralina', () => {
  it('modo respuesta_libre con advertencia sobre interacciones', () => {
    const mockLLMOutput = {
      modo: 'respuesta_libre',
      texto:
        'El shrub de manzana es un vinagre aromatizado con bajo contenido en tiramina. Con sertralina, las precauciones principales son alimentos con tiramina elevada como quesos muy curados o embutidos añejados. En cantidades moderadas, el shrub de manzana sin filtrar no presenta interacciones documentadas relevantes. Aun así, si tienes dudas, consulta con tu médico o farmacéutico.',
      advertencias: [
        'Con antidepresivos tipo ISRS como la sertralina, modera el consumo de alimentos muy ricos en tiramina. El shrub en cantidades normales no está contraindicado.',
      ],
    }

    const result = runSafetyChecks(mockLLMOutput, {
      ...profileVacio,
      medicacion: ['sertralina'],
    })
    expect(result.ok).toBe(true)
    expect(result.response?.modo).toBe('respuesta_libre')
    if (result.response?.modo !== 'respuesta_libre') return
    expect(result.response.advertencias.length).toBeGreaterThan(0)
  })
})

// ── 7. Contexto insuficiente ──────────────────────────────────────────────────

describe('7. contexto insuficiente — perfil mínimo, mood vacío', () => {
  it('modo necesito_mas_contexto con opciones de mood', () => {
    const mockLLMOutput = {
      modo:     'necesito_mas_contexto',
      pregunta: '¿Cómo te sientes ahora mismo? Elige el estado que más se acerca.',
      opciones: [
        'Activada y con energía',
        'Tranquila y presente',
        'Con ganas de concentrarme',
        'Sociable',
        'Necesito resetear',
        'Busco confort',
      ],
    }

    const result = runSafetyChecks(mockLLMOutput, profileVacio)
    expect(result.ok).toBe(true)
    expect(result.response?.modo).toBe('necesito_mas_contexto')
    if (result.response?.modo !== 'necesito_mas_contexto') return
    expect(result.response.opciones.length).toBe(6)
  })
})
