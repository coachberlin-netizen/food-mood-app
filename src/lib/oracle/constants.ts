import type { MoodId } from './types'

export const NUTRITION: Record<MoodId, string[]> = {
  activacion: [
    'Hierro biodisponible (legumbres + vitamina C)',
    'Vitamina B12 (huevo, fermentos)',
    'Adaptógenos suaves (maca, shiitake)',
    'Carbohidratos complejos de absorción lenta',
  ],
  calma: [
    'Magnesio glicinato (semillas de calabaza, cacao puro)',
    'L-teanina (matcha, té verde)',
    'Triptófano (plátano, kéfir, pavo)',
    'GABA natural (fermentos, tomate cocinado lento)',
  ],
  focus: [
    'Omega-3 DHA/EPA (sardinas, caballa, chía)',
    'Colina (huevo entero)',
    'Polifenoles neuroprotectores (arándanos, cacao 85%)',
    'L-teanina + cafeína moderada (matcha ceremonial)',
  ],
  social: [
    'Fermentos vivos (kéfir, miso, kimchi)',
    'Cacao puro (precursor de oxitocina)',
    'Grasas para síntesis hormonal (aguacate, AOVE)',
    'Probióticos de amplio espectro (yogur natural)',
  ],
  reset: [
    'Fibra prebiótica (alcachofa, puerro, ajo, cebolla)',
    'Cúrcuma + pimienta negra (vía NF-κB)',
    'Almidón resistente (arroz enfriado, patata cocida fría)',
    'Enzimas digestivas naturales (jengibre, papaya, piña)',
  ],
  confort: [
    'Triptófano serotonérgico (plátano, dátiles, pan de masa madre)',
    'Fermentos cálidos (miso suave, kéfir templado)',
    'Magnesio (almendras, espinacas, semillas)',
    'Grasas saciantes y cálidas (ghee, aceite de coco)',
  ],
}

export const RECIPE_TAGS: Record<MoodId, string[]> = {
  activacion: ['energía', 'desayuno', 'hierro', 'adaptógenos'],
  calma:      ['calma', 'magnesio', 'triptófano', 'fermentado'],
  focus:      ['focus', 'omega-3', 'dha', 'antioxidante'],
  social:     ['fermentado', 'aperitivo', 'probiótico'],
  reset:      ['antiinflamatorio', 'depurador', 'prebiótico', 'fibra'],
  confort:    ['confort', 'caldo', 'masa-madre', 'serotonina'],
}

export const MOOD_DESCS: Record<MoodId, string> = {
  activacion: 'vitalidad que busca encenderse',
  calma:      'la necesidad de pausa y silencio interior',
  focus:      'la búsqueda de un centro nítido y dirección',
  social:     'el anhelo de conexión y pertenencia',
  reset:      'la necesidad de un lienzo en blanco',
  confort:    'el refugio de lo conocido y lo seguro',
}

export const NEED_CONCLUSIONS: Record<MoodId, string> = {
  calma:      'Lo que observamos en conjunto apunta a un momento de calma activa — nutrir el sistema nervioso antes que activarlo.',
  reset:      'La señal de hoy apunta a restauración profunda — dar al intestino lo que necesita para reequilibrarse.',
  activacion: 'Tu sistema parece listo para activarse — apóyalo con los cofactores correctos y el impulso llegará más limpio.',
  focus:      'Hay capacidad de foco disponible — los ácidos grasos y los adaptógenos de hoy pueden potenciarlo.',
  confort:    'Hoy tu cuerpo pide raíz y seguridad — calidez y nutrición densa que haga sentir el suelo bajo los pies.',
  social:     'La energía parece orientada hacia afuera — los fermentos vivos y las especias cálidas pueden potenciar esa apertura.',
}
