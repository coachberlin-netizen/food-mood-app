import type { MoodId, OracleInput } from './types'

export function buildRitual(need: MoodId, input: OracleInput): string {
  if (input.sleepQuality <= 2) {
    return 'Hoy no es el día de empezar fuerte. Un caldo ligero o un té sin cafeína como primera ingesta — entrada suave para un sistema que necesita recuperarse antes de rendir.'
  }
  if (input.primarySymptom === 'digestion-pesada') {
    return 'Espera al menos 4 horas desde la última ingesta antes de comer. Un caldo de miso suave o jengibre con limón puede abrir la digestión sin sobrecargarla.'
  }
  if (input.primarySymptom === 'ansiedad' || input.primarySymptom === 'irritabilidad') {
    return 'Come sin pantallas y sin prisa hoy. La velocidad de la comida activa el sistema nervioso simpático tanto como lo que comes — comer despacio es parte del protocolo.'
  }
  switch (need) {
    case 'calma':
      return 'Empieza el día con agua tibia y limón, luego un desayuno rico en magnesio y triptófano. No cafeína hasta al menos 90 minutos después de despertar.'
    case 'reset':
      return 'Agua tibia con limón en ayunas, luego una primera ingesta con fermentos y fibra prebiótica suave. Hoy el intestino necesita apoyo antes que estimulación.'
    case 'activacion':
      return 'Un desayuno alto en proteína en los primeros 90 minutos del día sostiene la dopamina y el foco. Evita empezar con carbohidratos simples.'
    case 'focus':
      return 'Matcha con leche de avena antes del trabajo profundo — L-teanina y cafeína juntas generan ondas alfa sin el pico ansioso del café solo.'
    case 'confort':
      return 'Algo cálido, denso y reconfortante como primera ingesta. No es debilidad — es inteligencia somática. Tu sistema nervioso necesita seguridad antes que rendimiento.'
    case 'social':
      return 'Comparte al menos una ingesta hoy. La comida compartida activa circuitos de oxitocina que ningún suplemento puede replicar.'
  }
}
