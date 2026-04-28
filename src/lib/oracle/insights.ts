import type { OracleInput } from './types'

export const PATTERN_INSIGHTS: Array<{ match: (i: OracleInput) => boolean; text: string }> = [
  {
    match: i => i.sleepQuality <= 2 && i.energyLevel <= 4,
    text:  'El cansancio de hoy parece más de recuperación que de déficit nutricional — el sistema nervioso necesita recargar antes que activarse.',
  },
  {
    match: i => (i.cravingState === 'dulce') && (i.primarySymptom === 'ansiedad' || i.primarySymptom === 'irritabilidad'),
    text:  'El antojo de dulce junto con el estado emocional apunta a cortisol elevado — no es hambre real, es una señal del eje HPA buscando glucosa rápida.',
  },
  {
    match: i => i.cravingState === 'estimulante' && i.energyLevel <= 4,
    text:  'Buscar estimulación con energía baja suele ser una señal de adenosín acumulado — el cuerpo pide café pero necesita recuperación real.',
  },
  {
    match: i => i.primarySymptom === 'niebla-mental' && i.sleepQuality <= 2,
    text:  'La niebla mental combinada con mal descanso apunta a limpieza glinfática incompleta — el cerebro necesita sueño profundo para depurarse, no solo nutrientes.',
  },
  {
    match: i => i.primarySymptom === 'digestion-pesada' && i.cravingState === 'calor',
    text:  'La digestión pesada junto con el antojo de calor señala un intestino que pide bálsamo — fermentos suaves y caldos antes que fibra dura o cruda.',
  },
  {
    match: i => i.emotions.includes('reset') && i.energyLevel <= 3,
    text:  'Tu cuerpo y tu mente apuntan en la misma dirección hoy — restauración. No es el momento de rendir, sino de nutrir.',
  },
  {
    match: i => i.primarySymptom === 'hambre-constante' && i.energyLevel <= 5,
    text:  'El hambre constante con energía baja puede apuntar a un déficit de ácidos grasos de cadena corta (butirato) — el intestino no está enviando señales de saciedad al hipotálamo.',
  },
  {
    match: i => i.cyclePhase === 'lutea' && (i.primarySymptom === 'irritabilidad' || i.cravingState === 'dulce'),
    text:  'En fase lútea el estrógeno cae y la progesterona sube — el craving de dulce y la irritabilidad son señales hormonales, no falta de voluntad. El magnesio y el triptófano son prioritarios.',
  },
]
