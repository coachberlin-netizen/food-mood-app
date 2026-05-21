export type TipoPregunta = 'single' | 'multi' | 'scale' | 'text'

export interface Opcion {
  valor: string
  label: string
  desc?: string
}

export interface TestPregunta {
  id: string
  texto: string
  tipo: TipoPregunta
  opciones?: Opcion[]
  escala?: { min: number; max: number; minLabel: string; maxLabel: string }
  opcional?: boolean
}

export interface EvaluacionTest {
  id: string
  titulo: string
  subtitulo: string
  descripcion: string
  duracion: string
  color: string
  tag: string
  preguntas: TestPregunta[]
}

export const EVALUACION_TESTS: EvaluacionTest[] = [
  {
    id: 'perfil-nutricional',
    titulo: 'Perfil Nutricional',
    subtitulo: 'Tus hábitos alimentarios actuales',
    descripcion: 'Mapea tus patrones de alimentación, preferencias y restricciones para recibir orientación personalizada.',
    duracion: '4 min',
    color: '#C9A84C',
    tag: 'Fundamentos',
    preguntas: [
      {
        id: 'patron',
        texto: '¿Cómo describirías tu patrón alimentario actual?',
        tipo: 'single',
        opciones: [
          { valor: 'muy_irregular', label: 'Muy irregular', desc: 'Como cuando puedo, sin horarios' },
          { valor: 'bastante_irregular', label: 'Bastante irregular', desc: 'Intento tener horarios pero no siempre lo logro' },
          { valor: 'relativamente_ordenado', label: 'Relativamente ordenado', desc: 'Tengo más o menos rutina' },
          { valor: 'muy_ordenado', label: 'Muy ordenado', desc: 'Horarios y hábitos bastante estables' },
        ],
      },
      {
        id: 'frecuencia_comidas',
        texto: '¿Cuántas veces al día comes habitualmente?',
        tipo: 'single',
        opciones: [
          { valor: '1-2', label: '1–2 veces', desc: 'Como poco o salteo comidas' },
          { valor: '3', label: '3 veces', desc: 'Desayuno, comida y cena' },
          { valor: '4-5', label: '4–5 veces', desc: 'Incluyo tentempiés' },
          { valor: 'mas5', label: 'Más de 5 veces', desc: 'Pico frecuentemente' },
        ],
      },
      {
        id: 'restricciones',
        texto: '¿Tienes alguna restricción o preferencia alimentaria?',
        tipo: 'multi',
        opciones: [
          { valor: 'vegetariana', label: 'Vegetariana' },
          { valor: 'vegana', label: 'Vegana' },
          { valor: 'sin_gluten', label: 'Sin gluten' },
          { valor: 'sin_lacteos', label: 'Sin lácteos' },
          { valor: 'sin_azucar', label: 'Sin azúcar añadido' },
          { valor: 'omnivora', label: 'Sin restricciones' },
        ],
      },
      {
        id: 'verduras',
        texto: '¿Con qué frecuencia consumes verduras y hortalizas?',
        tipo: 'single',
        opciones: [
          { valor: 'casi_nunca', label: 'Casi nunca' },
          { valor: '1-2_semana', label: '1–2 veces a la semana' },
          { valor: '3-5_semana', label: '3–5 veces a la semana' },
          { valor: 'todos_dias', label: 'Todos los días' },
          { valor: 'varias_dia', label: 'Varias veces al día' },
        ],
      },
      {
        id: 'proteina',
        texto: '¿Cómo valoras tu ingesta habitual de proteína?',
        tipo: 'scale',
        escala: { min: 1, max: 5, minLabel: 'Muy baja', maxLabel: 'Muy alta' },
      },
      {
        id: 'ultraprocesados',
        texto: '¿Con qué frecuencia consumes alimentos ultraprocesados?',
        tipo: 'single',
        opciones: [
          { valor: 'muy_frecuente', label: 'Muy frecuentemente', desc: 'A diario o casi' },
          { valor: 'frecuente', label: 'Varias veces a la semana' },
          { valor: 'ocasional', label: 'Ocasionalmente' },
          { valor: 'raramente', label: 'Raramente' },
          { valor: 'nunca', label: 'Prácticamente nunca' },
        ],
      },
      {
        id: 'hidratacion',
        texto: '¿Cómo valoras tu hidratación diaria?',
        tipo: 'single',
        opciones: [
          { valor: 'muy_baja', label: 'Muy baja', desc: 'Bebo poca agua' },
          { valor: 'moderada', label: 'Moderada', desc: 'Podría beber más' },
          { valor: 'buena', label: 'Buena', desc: 'Bebo suficiente' },
          { valor: 'excelente', label: 'Excelente', desc: 'Hidratación constante' },
        ],
      },
    ],
  },
  {
    id: 'psiconutricional',
    titulo: 'Test Psiconutricional',
    subtitulo: 'Tu relación emocional con la comida',
    descripcion: 'Explora cómo tus emociones y creencias influyen en tu alimentación — sin juicios, con curiosidad.',
    duracion: '5 min',
    color: '#B55B7A',
    tag: 'Mente y comida',
    preguntas: [
      {
        id: 'comer_emocional',
        texto: '¿Con qué frecuencia comes en respuesta a emociones (estrés, tristeza, aburrimiento…)?',
        tipo: 'single',
        opciones: [
          { valor: 'muy_raramente', label: 'Muy raramente' },
          { valor: 'a_veces', label: 'A veces' },
          { valor: 'frecuentemente', label: 'Con frecuencia' },
          { valor: 'muy_frecuentemente', label: 'Muy frecuentemente' },
        ],
      },
      {
        id: 'hambre_emocional',
        texto: '¿Puedes distinguir entre hambre física y hambre emocional?',
        tipo: 'single',
        opciones: [
          { valor: 'casi_siempre', label: 'Casi siempre', desc: 'Lo noto con claridad' },
          { valor: 'a_veces', label: 'A veces', desc: 'Depende del momento' },
          { valor: 'con_dificultad', label: 'Con dificultad', desc: 'Me cuesta distinguirlos' },
          { valor: 'casi_nunca', label: 'Casi nunca', desc: 'No suelo saberlo' },
        ],
      },
      {
        id: 'alimentos_prohibidos',
        texto: '¿Hay alimentos que consideras "malos" o que intentas evitar por principio?',
        tipo: 'single',
        opciones: [
          { valor: 'no', label: 'No, como de todo con libertad' },
          { valor: 'algunos', label: 'Algunos sí' },
          { valor: 'bastantes', label: 'Bastantes' },
          { valor: 'muchos', label: 'Muchos, tengo una lista larga' },
        ],
      },
      {
        id: 'culpa',
        texto: '¿Experimentas culpa o vergüenza después de comer ciertos alimentos?',
        tipo: 'single',
        opciones: [
          { valor: 'nunca', label: 'Nunca' },
          { valor: 'raramente', label: 'Raramente' },
          { valor: 'a_veces', label: 'A veces' },
          { valor: 'frecuentemente', label: 'Frecuentemente' },
        ],
      },
      {
        id: 'placer',
        texto: '¿El placer y el disfrute forman parte de tu experiencia con la comida?',
        tipo: 'scale',
        escala: { min: 1, max: 5, minLabel: 'Casi nada', maxLabel: 'Completamente' },
      },
      {
        id: 'consciencia',
        texto: '¿Comes de forma consciente — sin pantallas, saboreando, presente?',
        tipo: 'single',
        opciones: [
          { valor: 'siempre', label: 'Siempre o casi siempre' },
          { valor: 'frecuentemente', label: 'Frecuentemente' },
          { valor: 'a_veces', label: 'A veces' },
          { valor: 'raramente', label: 'Raramente' },
        ],
      },
      {
        id: 'relacion_comida',
        texto: 'La comida es para ti principalmente…',
        tipo: 'single',
        opciones: [
          { valor: 'placer_nutricion', label: 'Placer y nutrición', desc: 'Un espacio de disfrute y cuidado' },
          { valor: 'mezcla', label: 'Una mezcla', desc: 'Depende del momento' },
          { valor: 'obligacion', label: 'Obligación', desc: 'Algo que hay que resolver' },
          { valor: 'control', label: 'Control', desc: 'Un campo de batalla constante' },
        ],
      },
      {
        id: 'rituales',
        texto: '¿Tienes rituales o momentos especiales alrededor de la comida (mesa bonita, cocinar con calma…)?',
        tipo: 'single',
        opciones: [
          { valor: 'muchos', label: 'Sí, muchos', desc: 'La mesa es un espacio sagrado' },
          { valor: 'algunos', label: 'Algunos' },
          { valor: 'pocos', label: 'Muy pocos' },
          { valor: 'ninguno', label: 'Ninguno' },
        ],
      },
    ],
  },
  {
    id: 'sintomas-hormonales',
    titulo: 'Síntomas Hormonales',
    subtitulo: 'Señales de tu cuerpo por fase',
    descripcion: 'Identifica cómo tu ciclo hormonal influye en tu energía, digestión, antojos y estado de ánimo.',
    duracion: '4 min',
    color: '#E8621C',
    tag: 'Salud hormonal',
    preguntas: [
      {
        id: 'etapa_hormonal',
        texto: '¿En qué etapa hormonal te encuentras?',
        tipo: 'single',
        opciones: [
          { valor: 'ciclo_regular', label: 'Ciclo menstrual regular' },
          { valor: 'perimenopausia', label: 'Perimenopausia', desc: 'Ciclos irregulares, síntomas variados' },
          { valor: 'menopausia', label: 'Menopausia', desc: 'Sin regla desde hace 12+ meses' },
          { valor: 'postmenopausia', label: 'Postmenopausia' },
          { valor: 'no_se', label: 'No lo sé con seguridad' },
        ],
      },
      {
        id: 'fatiga',
        texto: '¿Con qué frecuencia experimentas fatiga intensa o falta de energía notable?',
        tipo: 'single',
        opciones: [
          { valor: 'raramente', label: 'Raramente' },
          { valor: '1-2_mes', label: '1–2 veces al mes' },
          { valor: 'semanalmente', label: 'Semanalmente' },
          { valor: 'casi_todos_dias', label: 'Casi todos los días' },
        ],
      },
      {
        id: 'antojos',
        texto: '¿Tienes antojos específicos relacionados con tu ciclo u etapa hormonal?',
        tipo: 'multi',
        opciones: [
          { valor: 'dulce', label: 'Dulce' },
          { valor: 'salado', label: 'Salado' },
          { valor: 'carbohidratos', label: 'Pan / carbohidratos' },
          { valor: 'proteina', label: 'Proteína' },
          { valor: 'chocolate', label: 'Chocolate' },
          { valor: 'sin_antojos', label: 'Sin antojos específicos' },
        ],
      },
      {
        id: 'digestion',
        texto: '¿Experimentas digestión lenta, hinchazón o malestar digestivo?',
        tipo: 'single',
        opciones: [
          { valor: 'raramente', label: 'Raramente' },
          { valor: 'ocasionalmente', label: 'Ocasionalmente' },
          { valor: 'frecuentemente', label: 'Frecuentemente' },
          { valor: 'muy_frecuentemente', label: 'Muy frecuentemente, es incómodo' },
        ],
      },
      {
        id: 'animo',
        texto: '¿Cómo son tus cambios de ánimo a lo largo del mes?',
        tipo: 'single',
        opciones: [
          { valor: 'estables', label: 'Bastante estables' },
          { valor: 'leves', label: 'Leves variaciones' },
          { valor: 'notables', label: 'Cambios notables' },
          { valor: 'intensos', label: 'Cambios intensos que afectan mi día' },
        ],
      },
      {
        id: 'sueno_hormonal',
        texto: '¿Tienes problemas de sueño relacionados con tu ciclo o etapa hormonal?',
        tipo: 'single',
        opciones: [
          { valor: 'no', label: 'No, duermo bien' },
          { valor: 'raramente', label: 'Raramente' },
          { valor: 'a_veces', label: 'A veces (sofocos, insomnio, despertar nocturno)' },
          { valor: 'frecuentemente', label: 'Frecuentemente' },
        ],
      },
      {
        id: 'variacion_energia',
        texto: '¿Tu energía varía mucho a lo largo del mes según tu ciclo o síntomas?',
        tipo: 'scale',
        escala: { min: 1, max: 5, minLabel: 'Muy estable', maxLabel: 'Muy variable' },
      },
    ],
  },
  {
    id: 'cronotype',
    titulo: 'Cronotipo y Ritmo',
    subtitulo: 'Tu reloj biológico natural',
    descripcion: 'Descubre tu ritmo circadiano y cómo sincronizar tus comidas con tu biología para más vitalidad.',
    duracion: '3 min',
    color: '#5B8FA8',
    tag: 'Ritmo circadiano',
    preguntas: [
      {
        id: 'despertar_natural',
        texto: 'Sin alarma, ¿a qué hora te despiertas naturalmente?',
        tipo: 'single',
        opciones: [
          { valor: 'antes_6', label: 'Antes de las 6h', desc: 'Me levanto sola muy temprano' },
          { valor: '6-7', label: 'Entre 6h y 7h' },
          { valor: '7-8', label: 'Entre 7h y 8h' },
          { valor: '8-9', label: 'Entre 8h y 9h' },
          { valor: 'despues_9', label: 'Después de las 9h', desc: 'Soy de dormir hasta tarde' },
        ],
      },
      {
        id: 'pico_energia',
        texto: '¿En qué momento del día sientes tu mayor energía y claridad mental?',
        tipo: 'single',
        opciones: [
          { valor: 'manana_temprano', label: 'Mañana temprano', desc: 'Antes de las 9h' },
          { valor: 'media_manana', label: 'Media mañana', desc: 'Entre 9h y 12h' },
          { valor: 'mediodia', label: 'Al mediodía', desc: 'Entre 12h y 14h' },
          { valor: 'tarde', label: 'Por la tarde', desc: 'Entre 16h y 19h' },
          { valor: 'noche', label: 'Por la noche', desc: 'Después de las 20h' },
        ],
      },
      {
        id: 'hambre_primera',
        texto: '¿Cuándo sientes hambre por primera vez en el día?',
        tipo: 'single',
        opciones: [
          { valor: 'inmediato', label: 'Al levantarme, inmediatamente' },
          { valor: 'primera_hora', label: 'Dentro de la primera hora' },
          { valor: 'media_manana', label: 'A media mañana' },
          { valor: 'mediodia', label: 'Al mediodía o después' },
          { valor: 'sin_hambre', label: 'No suelo tener hambre matutina' },
        ],
      },
      {
        id: 'hora_dormir',
        texto: '¿A qué hora sueles irte a dormir?',
        tipo: 'single',
        opciones: [
          { valor: 'antes_22', label: 'Antes de las 22h' },
          { valor: '22-23', label: 'Entre 22h y 23h' },
          { valor: '23-00', label: 'Entre 23h y 00h' },
          { valor: 'despues_00', label: 'Después de la medianoche' },
        ],
      },
      {
        id: 'horas_sueno',
        texto: '¿Cuántas horas duermes de media?',
        tipo: 'single',
        opciones: [
          { valor: 'menos_5', label: 'Menos de 5 horas' },
          { valor: '5-6', label: '5–6 horas' },
          { valor: '6-7', label: '6–7 horas' },
          { valor: '7-8', label: '7–8 horas' },
          { valor: 'mas_8', label: 'Más de 8 horas' },
        ],
      },
      {
        id: 'madrugar',
        texto: '¿Cómo te sientes cuando tienes que madrugar mucho?',
        tipo: 'single',
        opciones: [
          { valor: 'sin_problema', label: 'Sin problema, me adapto bien' },
          { valor: 'algo_dificil', label: 'Algo difícil pero lo manejo' },
          { valor: 'muy_dificil', label: 'Muy difícil, me cuesta todo el día' },
          { valor: 'imposible', label: 'Imposible sin consecuencias importantes' },
        ],
      },
    ],
  },
  {
    id: 'objetivos',
    titulo: 'Objetivos y Motivación',
    subtitulo: '¿Qué quieres conseguir?',
    descripcion: 'Define tus metas, identifica tus obstáculos y encuentra el punto de partida perfecto para ti.',
    duracion: '3 min',
    color: '#7FB069',
    tag: 'Mi camino',
    preguntas: [
      {
        id: 'objetivo_principal',
        texto: '¿Cuál es tu principal objetivo en este momento? (puedes elegir varios)',
        tipo: 'multi',
        opciones: [
          { valor: 'mas_energia', label: 'Más energía' },
          { valor: 'mejor_digestion', label: 'Mejor digestión' },
          { valor: 'equilibrio_hormonal', label: 'Equilibrio hormonal' },
          { valor: 'peso', label: 'Gestionar el peso' },
          { valor: 'inflamacion', label: 'Reducir inflamación' },
          { valor: 'sueno', label: 'Mejorar el sueño' },
          { valor: 'estres', label: 'Reducir el estrés' },
          { valor: 'placer', label: 'Recuperar el placer con la comida' },
        ],
      },
      {
        id: 'tiempo_buscando',
        texto: '¿Cuánto tiempo llevas buscando mejorar tu bienestar a través de la alimentación?',
        tipo: 'single',
        opciones: [
          { valor: 'empezando', label: 'Estoy empezando ahora' },
          { valor: 'menos_6m', label: 'Menos de 6 meses' },
          { valor: '6m_2a', label: 'Entre 6 meses y 2 años' },
          { valor: 'mas_2a', label: 'Más de 2 años' },
          { valor: 'anos_sin_resultado', label: 'Llevo años pero sin resultados claros' },
        ],
      },
      {
        id: 'obstaculo',
        texto: '¿Cuál es tu mayor obstáculo actualmente?',
        tipo: 'single',
        opciones: [
          { valor: 'tiempo', label: 'Falta de tiempo' },
          { valor: 'informacion', label: 'Demasiada información contradictoria' },
          { valor: 'motivacion', label: 'Poca motivación sostenida' },
          { valor: 'social', label: 'Presión social o familiar' },
          { valor: 'por_donde', label: 'No sé por dónde empezar' },
          { valor: 'sin_resultado', label: 'He probado muchas cosas sin resultado' },
        ],
      },
      {
        id: 'apoyo',
        texto: '¿Qué tipo de apoyo te resulta más útil?',
        tipo: 'single',
        opciones: [
          { valor: 'recetas', label: 'Recetas prácticas y sencillas' },
          { valor: 'ciencia', label: 'Información científica clara' },
          { valor: 'emocional', label: 'Apoyo emocional y acompañamiento' },
          { valor: 'seguimiento', label: 'Seguimiento personalizado' },
          { valor: 'comunidad', label: 'Comunidad y conexión con otras' },
        ],
      },
      {
        id: 'motivacion_hoy',
        texto: 'Del 1 al 10, ¿cuánta energía y motivación tienes hoy para cuidar tu alimentación?',
        tipo: 'scale',
        escala: { min: 1, max: 10, minLabel: 'Sin motivación', maxLabel: 'Muy motivada' },
      },
      {
        id: 'experiencias_previas',
        texto: '¿Hay algo que hayas intentado antes y quieras compartir? (opcional)',
        tipo: 'text',
        opcional: true,
      },
    ],
  },
]

export function getTest(id: string): EvaluacionTest | undefined {
  return EVALUACION_TESTS.find(t => t.id === id)
}

export const SESSION_KEY_PREFIX = 'fm_eval_'

export function getSessionKey(testId: string) {
  return `${SESSION_KEY_PREFIX}${testId}`
}

export type RespuestasTest = Record<string, string | string[] | number>
