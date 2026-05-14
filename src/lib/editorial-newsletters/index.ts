import { buildHtml as html01 } from './01-slow-food-mood'
import { buildHtml as html02 } from './02-pan-de-masa-madre'
import { buildHtml as html03 } from './03-salsa-de-tomate-fermentada'
import { buildHtml as html04 } from './04-recupera-tu-energia'
import { buildHtml as html05 } from './05-microhabitos'
import { buildHtml as html06 } from './06-estrobioma'
import { buildHtml as html07 } from './07-legumbres-menopausia'
import { buildHtml as html08 } from './08-proteina-musculo'
import { buildHtml as html09 } from './09-colageno-huesos'
import { buildHtml as html10 } from './10-emociones-menopausia'
import { buildHtml as html11 } from './11-fermentos-del-mundo'
import { buildHtml as html12 } from './12-mosaico-emocional'
import { buildHtml as html13 } from './13-lactobacillus-ph-vaginal'
import { buildHtml as html14 } from './14-metabolismo-35'
import { buildHtml as html15 } from './15-reset-mitocondrial'
import { buildHtml as html16 } from './16-habitos-con-placer'
import { buildHtml as html17 } from './17-tiroides-postmenopausia'
import { buildHtml as html18 } from './18-espectro-emocional'
import { buildHtml as html19 } from './19-sabor-amargo-nervio-vago'
import { buildHtml as html20 } from './20-injera-teff-etiopia'
import { buildHtml as html21 } from './21-tkemali-georgia'
import { buildHtml as html22 } from './22-no-es-lo-que-comes'
import { buildHtml as html23 } from './23-ritmo-circadiano'
import { buildHtml as html24 } from './24-microbioma-ansiedad'

export interface EditorialNewsletter {
  numero:   number
  slug:     string
  subject:  string
  buildHtml: () => string
}

// Para añadir una nueva newsletter: agregar una entrada aquí e importar su buildHtml.
// El cron la enviará automáticamente el siguiente domingo.
export const EDITORIAL_NEWSLETTERS: EditorialNewsletter[] = [
  { numero: 1, slug: 'slow-food-mood',             subject: 'Fast life. Slow Food·Mood. 🍵',                             buildHtml: html01 },
  { numero: 2, slug: 'pan-de-masa-madre',          subject: 'Hay pan. Y luego hay PAN. 🍞',                             buildHtml: html02 },
  { numero: 3, slug: 'salsa-de-tomate-fermentada', subject: 'Salsa de tomate fermentada. Neuroprotección en tarro. 🍅', buildHtml: html03 },
  { numero: 4, slug: 'recupera-tu-energia',        subject: 'El cansancio que no se va con dormir ⚡',                  buildHtml: html04 },
  { numero: 5, slug: 'microhabitos',               subject: 'El hábito que no necesita fuerza de voluntad. ✨',         buildHtml: html05 },
  { numero: 6, slug: 'estrobioma',                 subject: 'Tus bacterias gestionan el estrógeno. Empieza aquí. 🌸',   buildHtml: html06 },
  { numero: 7, slug: 'legumbres-menopausia',       subject: 'El alimento más completo para tus hormonas. 🫘',             buildHtml: html07 },
  { numero: 8, slug: 'proteina-musculo-menopausia', subject: 'La menopausia se come el músculo. La proteína lo frena. 💪', buildHtml: html08 },
  { numero: 9, slug: 'colageno-huesos-menopausia', subject: 'La ventana que no se repite. Colágeno y huesos en la menopausia. 🦴', buildHtml: html09 },
  { numero: 10, slug: 'emociones-menopausia', subject: 'No es la edad. Es tu cerebro pidiendo lo que tus hormonas ya no le dan. 🧠', buildHtml: html10 },
  { numero: 11, slug: 'fermentos-del-mundo', subject: 'De Japón a Perú. Lo que seis civilizaciones aprendieron sobre el eje intestino-cerebro. 🌍', buildHtml: html11 },
  { numero: 12, slug: 'mosaico-emocional', subject: 'Tu semana tiene un color. ¿Sabes cuál es? 🎨', buildHtml: html12 },
  { numero: 13, slug: 'lactobacillus-ph-vaginal', subject: 'El kéfir del desayuno llega donde nadie te dijo que llegaba. 🌸', buildHtml: html13 },
  { numero: 14, slug: 'metabolismo-35', subject: 'Tu metabolismo ya no tiene 25. Pero tampoco necesita dieta. ⚡', buildHtml: html14 },
  { numero: 15, slug: 'reset-mitocondrial', subject: 'El cansancio que no se va con dormir. CoQ10, magnesio y omega-3. ⚡', buildHtml: html15 },
  { numero: 16, slug: 'habitos-con-placer', subject: 'Los hábitos duraderos no se crean con disciplina. Se crean con placer. ✨', buildHtml: html16 },
  { numero: 17, slug: 'tiroides-postmenopausia', subject: 'Tu tiroides no está rota. Quizá solo tiene frío. 🌡️', buildHtml: html17 },
  { numero: 18, slug: 'espectro-emocional', subject: 'No sientes una emoción. Sientes varias a la vez. Y eso tiene una explicación. 🧠', buildHtml: html18 },
  { numero: 19, slug: 'sabor-amargo-nervio-vago', subject: 'Por qué el café amargo te calma. La ciencia del nervio vago y el sabor amargo. ☕', buildHtml: html19 },
  { numero: 20, slug: 'injera-teff-etiopia', subject: 'El pan que lleva 72 horas fermentando. Etiopía lleva milenios comiendo para el cerebro sin saberlo.', buildHtml: html20 },
  { numero: 21, slug: 'tkemali-georgia',        subject: 'La salsa agria que los georgianos llevan 3.000 años usando para todo. La ciencia acaba de empezar a entender por qué.', buildHtml: html21 },
  { numero: 22, slug: 'no-es-lo-que-comes',     subject: 'No es lo que comes. Es lo que hace tu microbiota con lo que comes.',   buildHtml: html22 },
  { numero: 23, slug: 'ritmo-circadiano',       subject: 'Tu cuerpo tiene un reloj. Y cada vez que comes fuera de hora, lo atrasa.', buildHtml: html23 },
  { numero: 24, slug: 'microbioma-ansiedad',    subject: 'Tu ansiedad tiene 38 billones de cómplices. Se llaman bacterias intestinales.', buildHtml: html24 },
]
