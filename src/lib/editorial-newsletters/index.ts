import { buildHtml as html01 } from './01-slow-food-mood'
import { buildHtml as html02 } from './02-pan-de-masa-madre'
import { buildHtml as html03 } from './03-salsa-de-tomate-fermentada'

export interface EditorialNewsletter {
  numero:   number
  slug:     string
  subject:  string
  buildHtml: () => string
}

// Para añadir una nueva newsletter: agregar una entrada aquí e importar su buildHtml.
// El cron la enviará automáticamente el siguiente domingo.
export const EDITORIAL_NEWSLETTERS: EditorialNewsletter[] = [
  { numero: 1, slug: 'slow-food-mood',    subject: 'Fast life. Slow Food·Mood. 🍵', buildHtml: html01 },
  { numero: 2, slug: 'pan-de-masa-madre',              subject: 'Hay pan. Y luego hay PAN. 🍞',                             buildHtml: html02 },
  { numero: 3, slug: 'salsa-de-tomate-fermentada',    subject: 'Salsa de tomate fermentada. Neuroprotección en tarro. 🍅', buildHtml: html03 },
]
