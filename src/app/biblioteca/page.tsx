import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Biblioteca Científica | Food·Mood',
  description:
    'La base científica detrás de Food·Mood. Papers curados por Susana Ferreras sobre microbiota, cronobiología, neurogastronomía y psicología de la alimentación.',
  openGraph: {
    title: 'Biblioteca Científica — Food·Mood',
    description: '282 fragmentos científicos curados por nuestro equipo.',
    url: 'https://www.food-mood.app/biblioteca',
  },
}

type RefItem = {
  id?: string
  autores: string
  ano: number
  titulo: string
  revista: string
  volumen?: string
  paginas?: string
  doi?: string
  url: string
  isbn?: string
  relevancia: string
  usadoEn: string[]
}

type Seccion = {
  categoria: string
  descripcion: string
  items: RefItem[]
}

const biblioteca: Seccion[] = [
  {
    categoria: 'Eje Intestino-Cerebro',
    descripcion: 'La comunicación bidireccional entre tu microbiota y tu sistema nervioso central.',
    items: [
      {
        autores: 'Cryan, J.F., et al.',
        ano: 2019,
        titulo: 'The Microbiota-Gut-Brain Axis',
        revista: 'Physiological Reviews',
        volumen: '99(4)',
        paginas: '1877–2013',
        doi: '10.1152/physrev.00018.2018',
        url: 'https://doi.org/10.1152/physrev.00018.2018',
        relevancia: 'Review foundational sobre el eje intestino-cerebro. Explica mecanismos de señalización neural, inmune y endocrina.',
        usadoEn: ['Home', 'Paleta emocional', 'Retos'],
      },
      {
        id: 'yano-2015',
        autores: 'Yano, J.M., et al.',
        ano: 2015,
        titulo: 'Indigenous Bacteria from the Gut Microbiota Regulate Host Serotonin Biosynthesis',
        revista: 'Cell',
        volumen: '161(2)',
        paginas: '264–276',
        doi: '10.1016/j.cell.2015.02.047',
        url: 'https://doi.org/10.1016/j.cell.2015.02.047',
        relevancia: 'Demuestra que bacterias intestinales producen ~90% de la serotonina corporal. Base del claim "95% de serotonina en el intestino".',
        usadoEn: ['Home', 'Paleta emocional'],
      },
      {
        autores: 'Dinan, T.G. & Cryan, J.F.',
        ano: 2017,
        titulo: 'Gut instincts: microbiota as a key regulator of brain development, ageing and neurodegeneration',
        revista: 'Journal of Physiology',
        volumen: '595(2)',
        paginas: '489–503',
        doi: '10.1113/JP273106',
        url: 'https://doi.org/10.1113/JP273106',
        relevancia: 'Revisión del impacto de la microbiota en neurodesarrollo y envejecimiento.',
        usadoEn: ['Retos de longevidad'],
      },
      {
        autores: 'Foster, J.A., et al.',
        ano: 2017,
        titulo: 'Stress & the gut-brain axis: Regulation by the microbiome',
        revista: 'Neurobiology of Stress',
        volumen: '7',
        paginas: '124–136',
        doi: '10.1016/j.ynstr.2017.03.001',
        url: 'https://doi.org/10.1016/j.ynstr.2017.03.001',
        relevancia: 'Mecanismos específicos de cómo el estrés altera la microbiota y viceversa.',
        usadoEn: ['Reto Calma', 'Reto Ansiedad'],
      },
      {
        autores: 'Dinan, T.G., Stanton, C. & Cryan, J.F.',
        ano: 2013,
        titulo: 'Psychobiotics: a novel class of psychotropic',
        revista: 'Biological Psychiatry',
        volumen: '74(10)',
        paginas: '720–726',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23759244/',
        relevancia: 'Introduce el término psicobiótico: microorganismo vivo que produce beneficio mental en el huésped. Define la cepa-especificidad y los mecanismos (GABA, serotonina, eje HPA). Paper fundacional del campo.',
        usadoEn: ['KB microbiota', 'Fermentos', 'Asesor Personal'],
      },
      {
        autores: 'Allen, A.P., et al.',
        ano: 2016,
        titulo: 'Bifidobacterium longum 1714 as a translational psychobiotic: modulation of stress, electrophysiology and neurocognition in healthy volunteers',
        revista: 'Translational Psychiatry',
        volumen: '6(11)',
        paginas: 'e939',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27723742/',
        relevancia: 'Primer ensayo humano que muestra que B. longum 1714 reduce el cortisol ante estrés agudo y mejora el rendimiento cognitivo bajo estrés. Valida el concepto de psicobiótico en humanos.',
        usadoEn: ['KB microbiota', 'Reto Calma', 'Asesor Personal'],
      },
      {
        autores: 'Messaoudi, M., et al.',
        ano: 2011,
        titulo: 'Assessment of psychotropic-like properties of a probiotic formulation (Lactobacillus helveticus R0052 and Bifidobacterium longum R0175) in rats and human subjects',
        revista: 'British Journal of Nutrition',
        volumen: '105(5)',
        paginas: '755–764',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20974015/',
        relevancia: 'L. helveticus R0052 + B. longum R0175 reducen ansiedad y síntomas depresivos leves en humanos. Base de las fórmulas probióticas combinadas para mood con respaldo clínico.',
        usadoEn: ['KB microbiota', 'Reto Calma', 'Asesor Personal'],
      },
      {
        autores: 'Jacka, F.N., et al.',
        ano: 2017,
        titulo: 'A randomised controlled trial of dietary improvement for adults with major depression (the \'SMILES\' trial)',
        revista: 'BMC Medicine',
        volumen: '15(1)',
        paginas: '23',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28137247/',
        relevancia: 'Ensayo aleatorizado que demuestra que la dieta mediterránea mejora significativamente la depresión clínica. La dieta como intervención terapéutica de primera línea, no solo coadyuvante. Referencia clave de la nutrición psicobiótica integral.',
        usadoEn: ['KB microbiota', 'KB PNI', 'Asesor Personal'],
      },
      {
        autores: 'Cryan, J.F. & Dinan, T.G.',
        ano: 2020,
        titulo: 'The gut microbiome in neurological disorders',
        revista: 'The Lancet Neurology',
        volumen: '19(2)',
        paginas: '179–194',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31636439/',
        relevancia: 'Revisión del vínculo entre disbiosis y Parkinson (hipótesis Braak, alfa-sinucleína entérica), Alzheimer (LPS en placas amiloides) y esclerosis múltiple. Argumento central para la microbiota como estrategia de neuroprotección a largo plazo.',
        usadoEn: ['KB microbiota', 'Reto Longevidad', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Serotonina y Neurotransmisores',
    descripcion: 'Bioquímica del estado de ánimo desde el plato.',
    items: [
      {
        autores: 'Jenkins, T.A., et al.',
        ano: 2016,
        titulo: 'Influence of Tryptophan and Serotonin on Mood and Cognition',
        revista: 'Nutrition Research Reviews',
        volumen: '29(2)',
        paginas: '132–143',
        doi: '10.1017/S0954422416000088',
        url: 'https://doi.org/10.1017/S0954422416000088',
        relevancia: 'Revisión de cómo el triptófano dietético afecta la síntesis de serotonina y el estado de ánimo.',
        usadoEn: ['Recetas', 'Retos'],
      },
      {
        autores: 'Bravo, J.A., et al.',
        ano: 2011,
        titulo: 'Ingestion of Lactobacillus strain regulates emotional behavior and central GABA receptor expression via the vagus nerve',
        revista: 'PNAS',
        volumen: '108(38)',
        paginas: '16050–16055',
        doi: '10.1073/pnas.1102999108',
        url: 'https://doi.org/10.1073/pnas.1102999108',
        relevancia: 'Primer estudio en mostrar que probióticos específicos reducen ansiedad vía GABA.',
        usadoEn: ['Fermentos', 'Reto Calma'],
      },
    ],
  },
  {
    categoria: 'Cronobiología y Crononutrición',
    descripcion: 'Cuándo comes importa tanto como qué comes.',
    items: [
      {
        autores: 'Panda, S.',
        ano: 2018,
        titulo: 'The Circadian Code',
        revista: 'Rodale Books',
        isbn: '978-1635651728',
        url: 'https://www.penguinrandomhouse.com/books/557081/the-circadian-code-by-satchin-panda-phd/',
        relevancia: 'Libro de divulgación científica sobre time-restricted eating y salud metabólica.',
        usadoEn: ['Reto Circadiano', 'Home'],
      },
      {
        autores: 'Chaix, A., et al.',
        ano: 2014,
        titulo: 'Time-Restricted Feeding Is a Preventative and Therapeutic Intervention against Diverse Nutritional Challenges',
        revista: 'Cell Metabolism',
        volumen: '20(6)',
        paginas: '991–1005',
        doi: '10.1016/j.cmet.2014.11.001',
        url: 'https://doi.org/10.1016/j.cmet.2014.11.001',
        relevancia: 'Estudio pionero de Panda sobre restricción temporal de alimentación.',
        usadoEn: ['Reto Circadiano'],
      },
      {
        autores: 'St-Onge, M.P., et al.',
        ano: 2016,
        titulo: 'Meal Timing Affects Postprandial Ghrelin Levels and Subjective Hunger',
        revista: 'Obesity',
        volumen: '24(8)',
        paginas: '1705–1711',
        doi: '10.1002/oby.21579',
        url: 'https://doi.org/10.1002/oby.21579',
        relevancia: 'Relación entre timing de comidas, grelina y sensación de hambre.',
        usadoEn: ['IA de recomendaciones', 'Reto Energía'],
      },
      {
        autores: 'Hatori, M., et al.',
        ano: 2012,
        titulo: 'Time-Restricted Feeding without Reducing Caloric Intake Prevents Metabolic Diseases in Mice Fed a High-Fat Diet',
        revista: 'Cell Metabolism',
        volumen: '15(6)',
        paginas: '848–860',
        doi: '10.1016/j.cmet.2012.04.019',
        url: 'https://doi.org/10.1016/j.cmet.2012.04.019',
        relevancia: 'Paper seminal del lab Panda: la ventana alimentaria restringida protege contra obesidad sin reducir calorías. Base del TRF/TRE.',
        usadoEn: ['KB circadiano', 'Asesor Personal'],
      },
      {
        autores: 'Gill, S. & Panda, S.',
        ano: 2015,
        titulo: 'A Smartphone App Reveals Erratic Diurnal Eating Patterns in Humans that Can Be Modulated for Health Benefits',
        revista: 'Cell Metabolism',
        volumen: '22(5)',
        paginas: '789–798',
        doi: '10.1016/j.cmet.2015.09.005',
        url: 'https://doi.org/10.1016/j.cmet.2015.09.005',
        relevancia: 'Datos de myCircadianClock: los humanos comen durante 15h al día de media. Restringir a 10–11h mejora sueño, energía y peso sin contar calorías.',
        usadoEn: ['KB circadiano', 'Asesor Personal'],
      },
      {
        autores: 'Sutton, E.F., et al.',
        ano: 2018,
        titulo: 'Early Time-Restricted Feeding Improves Insulin Sensitivity, Blood Pressure, and Oxidative Stress Even without Weight Loss in Men with Prediabetes',
        revista: 'Cell Metabolism',
        volumen: '27(6)',
        paginas: '1212–1221',
        doi: '10.1016/j.cmet.2018.04.010',
        url: 'https://doi.org/10.1016/j.cmet.2018.04.010',
        relevancia: 'TRE temprano (8h–14h) mejora insulina, tensión y estrés oxidativo sin perder peso. Confirma que el CUÁNDO importa independientemente de las calorías.',
        usadoEn: ['KB circadiano', 'Asesor Personal'],
      },
      {
        autores: 'Thaiss, C.A., et al.',
        ano: 2014,
        titulo: 'Transkingdom Control of Microbiota Diurnal Oscillations Promotes Metabolic Homeostasis',
        revista: 'Cell',
        volumen: '159(3)',
        paginas: '514–529',
        doi: '10.1016/j.cell.2014.09.048',
        url: 'https://doi.org/10.1016/j.cell.2014.09.048',
        relevancia: 'La microbiota tiene ritmo circadiano propio. La desincronía circadiana altera la microbiota y promueve inflamación y dismetabolismo.',
        usadoEn: ['KB circadiano', 'KB microbiota', 'Asesor Personal'],
      },
      {
        autores: 'Roenneberg, T.',
        ano: 2012,
        titulo: 'Internal Time: Chronotypes, Social Jet Lag, and Why You\'re So Tired',
        revista: 'Harvard University Press',
        isbn: '978-0674065857',
        url: 'https://www.hup.harvard.edu/books/9780674065857',
        relevancia: 'Referencia definitiva sobre cronotipos y jetlag social. Base del concepto de cronotipo vespertino y sus implicaciones para el TRE.',
        usadoEn: ['KB circadiano', 'Asesor Personal'],
      },
      {
        autores: 'Walker, M.',
        ano: 2017,
        titulo: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
        revista: 'Scribner',
        isbn: '978-1501144325',
        url: 'https://www.simonandschuster.com/books/Why-We-Sleep/Matthew-Walker/9781501144325',
        relevancia: 'Síntesis rigurosa sobre arquitectura del sueño, ritmo circadiano y consecuencias del sueño insuficiente para metabolismo, inmunidad y cognición.',
        usadoEn: ['KB circadiano', 'Reto Calma', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Teoría de las Emociones Construidas',
    descripcion: 'Las emociones no son universales: son construcciones activas del cerebro.',
    items: [
      {
        autores: 'Barrett, L.F.',
        ano: 2017,
        titulo: 'How Emotions Are Made: The Secret Life of the Brain',
        revista: 'Houghton Mifflin Harcourt',
        isbn: '978-0544133310',
        url: 'https://www.hmhbooks.com/shop/books/How-Emotions-Are-Made/9780544133310',
        relevancia: 'Base del concepto "no eres triste, eres 60% calma + 25% melancolía". Fundamento teórico de la paleta emocional.',
        usadoEn: ['Paleta emocional', 'Test', '/paleta (sección ciencia)'],
      },
      {
        autores: 'Russell, J.A.',
        ano: 2003,
        titulo: 'Core affect and the psychological construction of emotion',
        revista: 'Psychological Review',
        volumen: '110(1)',
        paginas: '145–172',
        doi: '10.1037/0033-295X.110.1.145',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16262989/',
        relevancia: 'Modelo circumplex: cualquier emoción es un punto en el espacio valencia × activación.',
        usadoEn: ['Paleta emocional', '/paleta (sección ciencia)'],
      },
      {
        autores: 'Lindquist, K.A., et al.',
        ano: 2021,
        titulo: 'Emotional granularity and emotion regulation: a systematic review',
        revista: 'PMC Open Access',
        doi: 'PMC8315101',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8315101/',
        relevancia: 'Alta granularidad emocional → menos ansiedad y depresión. Nombrar con precisión lo que se siente es una intervención de autorregulación.',
        usadoEn: ['Paleta emocional', 'Concepto general'],
      },
    ],
  },
  {
    categoria: 'Neurogastronomía',
    descripcion: 'Cómo el cerebro crea el sabor y la experiencia alimentaria.',
    items: [
      {
        autores: 'Shepherd, G.M.',
        ano: 2012,
        titulo: 'Neurogastronomy: How the Brain Creates Flavor and Why It Matters',
        revista: 'Columbia University Press',
        isbn: '978-0231159111',
        url: 'https://cup.columbia.edu/book/neurogastronomy/9780231159111',
        relevancia: 'Libro fundacional de la neurogastronomía. Explica cómo el olfato retronasal construye el sabor.',
        usadoEn: ['Concepto general', 'Recetas sensoriales'],
      },
      {
        autores: 'Spence, C.',
        ano: 2017,
        titulo: 'Gastrophysics: The New Science of Eating',
        revista: 'Viking',
        isbn: '978-0735223035',
        url: 'https://www.penguin.co.uk/books/294034/gastrophysics-by-spence-charles/9780735223042',
        relevancia: 'Multisensorialidad en la experiencia alimentaria: color, sonido, textura y contexto.',
        usadoEn: ['Presentación de recetas'],
      },
    ],
  },
  {
    categoria: 'Fermentados y Microbiota',
    descripcion: 'Alimentos vivos que modifican tu ecosistema interno.',
    items: [
      {
        autores: 'Marco, M.L., et al.',
        ano: 2017,
        titulo: 'Health benefits of fermented foods: microbiota and beyond',
        revista: 'Current Opinion in Biotechnology',
        volumen: '44',
        paginas: '94–102',
        doi: '10.1016/j.copbio.2016.11.010',
        url: 'https://doi.org/10.1016/j.copbio.2016.11.010',
        relevancia: 'Revisión de beneficios de fermentados más allá de probióticos vivos (postbióticos).',
        usadoEn: ['Fermentos del mundo', 'Retos'],
      },
      {
        autores: 'Salminen, S., et al.',
        ano: 2021,
        titulo: 'ISAPP consensus statement on the definition and scope of postbiotics',
        revista: 'Nature Reviews Gastroenterology & Hepatology',
        volumen: '18(9)',
        paginas: '649–667',
        doi: '10.1038/s41575-021-00440-6',
        url: 'https://doi.org/10.1038/s41575-021-00440-6',
        relevancia: 'Definición oficial de postbióticos (ISAPP 2021). Base del concepto en Food·Mood.',
        usadoEn: ['Postbióticos', 'Retos'],
      },
      {
        autores: 'Sumi, H., et al.',
        ano: 1987,
        titulo: 'A novel fibrinolytic enzyme (nattokinase) in the vegetable cheese Natto',
        revista: 'Experientia',
        volumen: '43(10)',
        paginas: '1110–1111',
        doi: '10.1007/BF01956052',
        url: 'https://doi.org/10.1007/BF01956052',
        relevancia: 'Descubrimiento original de la nattokinasa. Paper clásico de fermentos funcionales.',
        usadoEn: ['Fermentos', 'Natto de Garbanzos'],
      },
    ],
  },
  {
    categoria: 'Psicología de la Alimentación',
    descripcion: 'Por qué comemos lo que comemos, más allá del hambre.',
    items: [
      {
        autores: 'Macht, M.',
        ano: 2008,
        titulo: 'How emotions affect eating: A five-way model',
        revista: 'Appetite',
        volumen: '50(1)',
        paginas: '1–11',
        doi: '10.1016/j.appet.2007.07.002',
        url: 'https://doi.org/10.1016/j.appet.2007.07.002',
        relevancia: 'Modelo de 5 vías por las que las emociones afectan la ingesta. Base de la intervención emocional de Food·Mood.',
        usadoEn: ['Concepto general', 'IA emocional'],
      },
      {
        autores: 'Lally, P., et al.',
        ano: 2010,
        titulo: 'How are habits formed: Modelling habit formation in the real world',
        revista: 'European Journal of Social Psychology',
        volumen: '40(6)',
        paginas: '998–1009',
        doi: '10.1002/ejsp.674',
        url: 'https://doi.org/10.1002/ejsp.674',
        relevancia: '"66 días" (UCL). El mito de los 21 días refutado con datos reales.',
        usadoEn: ['Retos', 'Home'],
      },
      {
        autores: 'Bandura, A.',
        ano: 1977,
        titulo: 'Self-efficacy: toward a unifying theory of behavioral change',
        revista: 'Psychological Review',
        volumen: '84(2)',
        paginas: '191–215',
        doi: '10.1037/0033-295X.84.2.191',
        url: 'https://doi.org/10.1037/0033-295X.84.2.191',
        relevancia: 'Autoeficacia — predictor más potente del cambio de conducta alimentaria.',
        usadoEn: ['Retos', 'IA de coaching'],
      },
      {
        autores: 'Arroyo Fernández, A. & Lladó Jordan, G.',
        ano: 2021,
        titulo: 'Psicología de la Alimentación',
        revista: 'Formación Alcalá — Máster en Nutrición y Salud',
        url: 'https://www.formacionalcala.es',
        relevancia: 'Fuente principal de los capítulos sobre alimentación emocional, motivación y conducta alimentaria del KB.',
        usadoEn: ['KB longevidad', 'Asesor Personal'],
      },
      {
        autores: 'Redondo Illán, T.',
        ano: 2021,
        titulo: 'Coaching Nutricional',
        revista: 'Formación Alcalá — Máster en Nutrición y Salud',
        url: 'https://www.formacionalcala.es',
        relevancia: 'Modelo Prochaska-DiClemente aplicado a nutrición. Fundamento del proceso de acompañamiento del Asesor.',
        usadoEn: ['KB longevidad', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Inflamación y Nutrición',
    descripcion: 'La dieta como modulador del sistema inmune.',
    items: [
      {
        autores: 'Calder, P.C.',
        ano: 2010,
        titulo: 'Omega-3 fatty acids and inflammatory processes',
        revista: 'Nutrients',
        volumen: '2(3)',
        paginas: '355–374',
        doi: '10.3390/nu2030355',
        url: 'https://doi.org/10.3390/nu2030355',
        relevancia: 'Mecanismos antiinflamatorios de omega-3 (EPA/DHA). Base de las recetas de Activación y Reset.',
        usadoEn: ['Reto Antiinflamatorio', 'Recetas Reset'],
      },
      {
        autores: 'Aggarwal, B.B. & Harikumar, K.B.',
        ano: 2009,
        titulo: 'Potential therapeutic effects of curcumin, the anti-inflammatory agent',
        revista: 'International Journal of Biochemistry & Cell Biology',
        volumen: '41(1)',
        paginas: '40–59',
        doi: '10.1016/j.biocel.2008.06.010',
        url: 'https://doi.org/10.1016/j.biocel.2008.06.010',
        relevancia: 'Mecanismos moleculares de la cúrcuma como antiinflamatorio.',
        usadoEn: ['Reto Antiinflamatorio'],
      },
    ],
  },
  {
    categoria: 'Psiconeuroinmunología e Inflammaging',
    descripcion: 'El sistema nervioso, inmune y endocrino como red única. Estrés crónico, inflamación y envejecimiento.',
    items: [
      {
        autores: 'Ader, R. & Cohen, N.',
        ano: 1975,
        titulo: 'Behaviorally conditioned immunosuppression',
        revista: 'Psychosomatic Medicine',
        volumen: '37(4)',
        paginas: '333–340',
        doi: '10.1097/00006842-197507000-00007',
        url: 'https://doi.org/10.1097/00006842-197507000-00007',
        relevancia: 'Artículo fundacional de la PNI: el sistema inmune puede ser condicionado clásicamente, demostrando conexión funcional con el sistema nervioso.',
        usadoEn: ['KB PNI', 'Asesor Personal'],
      },
      {
        autores: 'Franceschi, C., et al.',
        ano: 2000,
        titulo: 'Inflammaging: an evolutionary perspective on immunosenescence',
        revista: 'Annals of the New York Academy of Sciences',
        volumen: '908(1)',
        paginas: '244–254',
        doi: '10.1111/j.1749-6632.2000.tb06651.x',
        url: 'https://doi.org/10.1111/j.1749-6632.2000.tb06651.x',
        relevancia: 'Introduce el concepto de inflammaging: inflamación crónica de bajo grado que se acumula con la edad y acelera todas las enfermedades crónicas.',
        usadoEn: ['KB PNI', 'KB longevidad', 'Asesor Personal'],
      },
      {
        autores: 'López-Otín, C., et al.',
        ano: 2023,
        titulo: 'Hallmarks of aging: An expanding universe',
        revista: 'Cell',
        volumen: '186(2)',
        paginas: '243–278',
        doi: '10.1016/j.cell.2022.11.001',
        url: 'https://doi.org/10.1016/j.cell.2022.11.001',
        relevancia: 'Actualización de los 12 hallmarks del envejecimiento (incluye inflammaging, disbiosis, pérdida de proteostasis). Marco de referencia para el KB de longevidad.',
        usadoEn: ['KB PNI', 'KB longevidad', 'Asesor Personal'],
      },
      {
        autores: 'McEwen, B.S.',
        ano: 1998,
        titulo: 'Stress, adaptation, and disease: allostasis and allostatic load',
        revista: 'Annals of the New York Academy of Sciences',
        volumen: '840(1)',
        paginas: '33–44',
        doi: '10.1111/j.1749-6632.1998.tb09546.x',
        url: 'https://doi.org/10.1111/j.1749-6632.1998.tb09546.x',
        relevancia: 'Define la carga alostática: el desgaste acumulado del organismo ante estrés crónico. Base del marco estrés → inflammaging → enfermedad.',
        usadoEn: ['KB PNI', 'Asesor Personal'],
      },
      {
        autores: 'Serhan, C.N., et al.',
        ano: 2008,
        titulo: 'Resolving inflammation: dual anti-inflammatory and pro-resolution lipid mediators',
        revista: 'Nature Reviews Immunology',
        volumen: '8(5)',
        paginas: '349–361',
        doi: '10.1038/nri2280',
        url: 'https://doi.org/10.1038/nri2280',
        relevancia: 'Descubrimiento de resolvinas, protectinas y maresinas: los omega-3 no solo no inflaman, generan mediadores que resuelven activamente la inflamación.',
        usadoEn: ['KB PNI', 'Recetas Calma', 'Asesor Personal'],
      },
      {
        autores: 'Porges, S.W.',
        ano: 2011,
        titulo: 'The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-regulation',
        revista: 'W.W. Norton & Company',
        isbn: '978-0393707007',
        url: 'https://wwnorton.com/books/9780393707007',
        relevancia: 'Teoría polivagal: el nervio vago mielinizado ventral es la base del tono vagal, la conexión social y la regulación emocional. Base de la palanca tono_vagal.',
        usadoEn: ['KB PNI', 'Reto Calma', 'Asesor Personal'],
      },
      {
        autores: 'Sapolsky, R.M.',
        ano: 2004,
        titulo: 'Why Zebras Don\'t Get Ulcers',
        revista: 'Holt Paperbacks',
        isbn: '978-0805073690',
        url: 'https://www.robertsapolskyauthor.com/why-zebras-dont-get-ulcers',
        relevancia: 'Síntesis definitiva de la fisiología del estrés crónico y sus consecuencias sobre inmunidad, digestión, memoria y longevidad. Referencia de divulgación rigurosa.',
        usadoEn: ['KB PNI', 'Asesor Personal'],
      },
      {
        autores: 'Pert, C.B.',
        ano: 1997,
        titulo: 'Molecules of Emotion: The Science Behind Mind-Body Medicine',
        revista: 'Scribner',
        isbn: '978-0684846347',
        url: 'https://www.simonandschuster.com/books/Molecules-of-Emotion/Candace-B-Pert/9780684846347',
        relevancia: 'Los neuropéptidos como lenguaje común del sistema nervioso, inmune y digestivo. Base conceptual de la visión integrada Food·Mood.',
        usadoEn: ['KB PNI', 'Asesor Personal'],
      },
      {
        autores: 'Waldinger, R.J. & Schulz, M.S.',
        ano: 2023,
        titulo: 'The Good Life: Lessons from the World\'s Longest Scientific Study of Happiness',
        revista: 'Simon & Schuster',
        isbn: '978-1982166694',
        url: 'https://www.simonandschuster.com/books/The-Good-Life/Robert-Waldinger/9781982166694',
        relevancia: 'Harvard Study of Adult Development (80+ años): la calidad del vínculo social predice longevidad mejor que cualquier marcador biológico. Base de la categoría Social.',
        usadoEn: ['KB PNI', 'Categoría Social', 'Asesor Personal'],
      },
      {
        autores: 'Longo, V.D. & Mattson, M.P.',
        ano: 2014,
        titulo: 'Fasting: Molecular Mechanisms and Clinical Applications',
        revista: 'Cell Metabolism',
        volumen: '19(2)',
        paginas: '181–192',
        doi: '10.1016/j.cmet.2013.12.008',
        url: 'https://doi.org/10.1016/j.cmet.2013.12.008',
        relevancia: 'Mecanismos moleculares del ayuno: autofagia, AMPK, sirtuinas, reducción de IGF-1. Base del protocolo de ayuno intermitente y FMD en longevidad.',
        usadoEn: ['KB PNI', 'KB longevidad', 'Reto Reset', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Salud Digestiva — SIBO, SII y Microbiota',
    descripcion: 'Disbiosis, permeabilidad intestinal, probióticos y protocolos FODMAP con evidencia.',
    items: [
      {
        autores: 'Fasano, A.',
        ano: 2012,
        titulo: 'Leaky gut and autoimmune diseases',
        revista: 'Clinical Reviews in Allergy & Immunology',
        volumen: '42(1)',
        paginas: '71–78',
        doi: '10.1007/s12016-011-8291-x',
        url: 'https://doi.org/10.1007/s12016-011-8291-x',
        relevancia: 'Concepto de permeabilidad intestinal aumentada (leaky gut) y zonulina como regulador de las uniones estrechas. Base científica del protocolo de reparación de mucosa.',
        usadoEn: ['KB digestivo', 'Asesor Personal'],
      },
      {
        autores: 'Chedid, V., et al.',
        ano: 2014,
        titulo: 'Herbal Therapy Is Equivalent to Rifaximin for the Treatment of Small Intestinal Bacterial Overgrowth',
        revista: 'Global Advances in Health and Medicine',
        volumen: '3(3)',
        paginas: '16–24',
        doi: '10.7453/gahmj.2014.019',
        url: 'https://doi.org/10.7453/gahmj.2014.019',
        relevancia: 'Combinación herbal (berberina, neem, oreganol, allicin) equivalente a rifaximina en SIBO. Base de la alternativa no antibiótica del protocolo.',
        usadoEn: ['KB digestivo', 'Asesor Personal'],
      },
      {
        autores: 'Whorwell, P.J., et al.',
        ano: 2006,
        titulo: 'Efficacy of an encapsulated probiotic Bifidobacterium infantis 35624 in women with irritable bowel syndrome',
        revista: 'American Journal of Gastroenterology',
        volumen: '101(7)',
        paginas: '1581–1590',
        doi: '10.1111/j.1572-0241.2006.00734.x',
        url: 'https://doi.org/10.1111/j.1572-0241.2006.00734.x',
        relevancia: 'Ensayo clínico que establece Bifidobacterium infantis 35624 como el probiótico con mejor evidencia específica para SII.',
        usadoEn: ['KB digestivo', 'Asesor Personal'],
      },
      {
        autores: 'Pimentel, M., et al.',
        ano: 2020,
        titulo: 'ACG Clinical Guideline: Small Intestinal Bacterial Overgrowth',
        revista: 'American Journal of Gastroenterology',
        volumen: '115(2)',
        paginas: '165–178',
        doi: '10.14309/ajg.0000000000000501',
        url: 'https://doi.org/10.14309/ajg.0000000000000501',
        relevancia: 'Guía clínica ACG sobre SIBO: diagnóstico, subtipos (H₂, metano, H₂S), tratamiento con rifaximina y mecanismo post-infeccioso (anticuerpos antivinculina).',
        usadoEn: ['KB digestivo', 'Asesor Personal'],
      },
      {
        autores: 'Mayer, E.',
        ano: 2016,
        titulo: 'The Mind-Gut Connection: How the Hidden Conversation Within Our Bodies Impacts Our Mood, Our Choices, and Our Overall Health',
        revista: 'Harper Wave',
        isbn: '978-0062376558',
        url: 'https://dramayermd.com/book/the-mind-gut-connection/',
        relevancia: 'Síntesis clínica del eje intestino-cerebro por el investigador pionero. Base de la comprensión del SII como cuadro biopsicosocial, no solo digestivo.',
        usadoEn: ['KB digestivo', 'KB Mayer', 'Asesor Personal'],
      },
      {
        autores: 'Mayer, E.',
        ano: 2021,
        titulo: 'The Gut-Immune Connection: How Understanding the Connection Between Food and Immunity Can Help Us Regain Our Health',
        revista: 'Harper Wave',
        isbn: '978-0062996688',
        url: 'https://dramayermd.com/book/the-gut-immune-connection/',
        relevancia: 'El GALT contiene el 70% del sistema inmune. La disbiosis y la hiperpermeabilidad intestinal (LPS en circulación) son motor central del inflammaging sistémico. Cuidar el intestino es cuidar la inmunidad. Base del KB #11.',
        usadoEn: ['KB Mayer', 'KB PNI', 'Asesor Personal'],
      },
      {
        autores: 'Mayer, E.A., Tillisch, K. & Gupta, A.',
        ano: 2015,
        titulo: 'Gut/brain axis and the microbiota',
        revista: 'Journal of Clinical Investigation',
        volumen: '125(3)',
        paginas: '926–938',
        doi: '10.1172/JCI76304',
        url: 'https://doi.org/10.1172/JCI76304',
        relevancia: 'Revisión traslacional de Mayer sobre las cuatro vías de comunicación cerebro-intestino-microbiota. Resumen científico del modelo que articula ambos libros.',
        usadoEn: ['KB Mayer', 'Asesor Personal'],
      },
      {
        autores: 'Tillisch, K., Mayer, E.A., Gupta, A., et al.',
        ano: 2017,
        titulo: 'Brain Structure and Response to Emotional Stimuli as Related to Gut Microbial Profiles in Healthy Women',
        revista: 'Psychosomatic Medicine',
        volumen: '79(8)',
        paginas: '905–913',
        doi: '10.1097/PSY.0000000000000493',
        url: 'https://doi.org/10.1097/PSY.0000000000000493',
        relevancia: 'Primer estudio de neuroimagen que relaciona perfil microbiano con estructura cerebral y respuesta emocional en humanos sanos. Evidencia directa de que la microbiota modula el procesamiento emocional.',
        usadoEn: ['KB Mayer', 'KB microbiota', 'Asesor Personal'],
      },
      {
        autores: 'Cryan, J.F. & Dinan, T.G.',
        ano: 2012,
        titulo: 'Mind-altering microorganisms: the impact of the gut microbiota on brain and behaviour',
        revista: 'Nature Reviews Neuroscience',
        volumen: '13(10)',
        paginas: '701–712',
        doi: '10.1038/nrn3346',
        url: 'https://doi.org/10.1038/nrn3346',
        relevancia: 'Paper seminal de Cryan y Dinan en Nature Reviews Neuroscience: el primer mapa completo de cómo la microbiota influye en el comportamiento y la salud mental. Referencia fundacional del campo.',
        usadoEn: ['KB microbiota', 'KB Mayer', 'Asesor Personal'],
      },
      {
        autores: 'Sonnenburg, J. & Sonnenburg, E.',
        ano: 2015,
        titulo: 'The Good Gut: Taking Control of Your Weight, Your Mood, and Your Long-term Health',
        revista: 'Penguin Press',
        isbn: '978-1594206283',
        url: 'https://sonnenburglab.stanford.edu/the-good-gut.html',
        relevancia: 'Referencia divulgativa rigurosa (Stanford) sobre microbiota, diversidad, fibra y fermentados. Marco de la intervención conservadora en disbiosis sin diagnóstico.',
        usadoEn: ['KB digestivo', 'Fermentos', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Nutrición Deportiva y Músculo 40+',
    descripcion: 'Sarcopenia, proteína, creatina, VO2max y recuperación para la segunda mitad de la vida.',
    items: [
      {
        autores: 'Mandsager, K., et al.',
        ano: 2018,
        titulo: 'Association of Cardiorespiratory Fitness With Long-term Mortality Among Adults Undergoing Exercise Treadmill Testing',
        revista: 'JAMA Network Open',
        volumen: '1(6)',
        paginas: 'e183605',
        doi: '10.1001/jamanetworkopen.2018.3605',
        url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605',
        relevancia: 'VO2max es el predictor de mortalidad más fuerte, por encima de tabaco, HTA y diabetes. Subir 1 MET reduce mortalidad un 12–15%.',
        usadoEn: ['KB deportivo', 'Reto Longevidad', 'Asesor Personal'],
      },
      {
        autores: 'Mamerow, M.M., et al.',
        ano: 2014,
        titulo: 'Dietary Protein Distribution Positively Influences 24-h Muscle Protein Synthesis in Healthy Adults',
        revista: 'Journal of Nutrition',
        volumen: '144(6)',
        paginas: '876–880',
        doi: '10.3945/jn.113.185280',
        url: 'https://doi.org/10.3945/jn.113.185280',
        relevancia: 'Distribuir proteína en 4 tomas de 30–40 g supera en estímulo anabólico a una sola toma de 120 g. Base de la distribución proteica en mujeres 40+.',
        usadoEn: ['KB deportivo', 'Recetas Activación', 'Asesor Personal'],
      },
      {
        autores: 'Antonio, J., et al.',
        ano: 2021,
        titulo: 'Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show?',
        revista: 'Journal of the International Society of Sports Nutrition',
        volumen: '18(1)',
        paginas: '13',
        doi: '10.1186/s12970-021-00412-w',
        url: 'https://doi.org/10.1186/s12970-021-00412-w',
        relevancia: 'Position stand ISSN sobre creatina: seguridad renal, cognición, masa magra, estado de ánimo. Base de las recomendaciones de creatina para mujeres 40+.',
        usadoEn: ['KB deportivo', 'Asesor Personal'],
      },
      {
        autores: 'Candow, D.G., Forbes, S.C. & Chilibeck, P.D.',
        ano: 2019,
        titulo: 'Effectiveness of Progressive Resistance Training and Creatine Supplementation on Muscle Strength and Bone Mineral Density in Older Women',
        revista: 'Journal of Nutrition, Health & Aging',
        volumen: '23(9)',
        paginas: '862–869',
        doi: '10.1007/s12603-019-1261-2',
        url: 'https://doi.org/10.1007/s12603-019-1261-2',
        relevancia: 'Creatina + fuerza mejoran masa magra y densidad ósea en mujeres postmenopáusicas. Ensayo clínico clave para este grupo.',
        usadoEn: ['KB deportivo', 'Reto Longevidad', 'Asesor Personal'],
      },
      {
        autores: 'Shaw, G., et al.',
        ano: 2017,
        titulo: 'Vitamin C-enriched gelatin supplementation before intermittent activity augments collagen synthesis',
        revista: 'American Journal of Clinical Nutrition',
        volumen: '105(1)',
        paginas: '136–143',
        doi: '10.3945/ajcn.116.138594',
        url: 'https://doi.org/10.3945/ajcn.116.138594',
        relevancia: 'Colágeno hidrolizado + vitamina C 30–60 min antes de entrenar tendones aumenta la síntesis de colágeno. Base de la recomendación en recuperación.',
        usadoEn: ['KB deportivo', 'Recetas Reset', 'Asesor Personal'],
      },
      {
        autores: 'Phillips, S.M. & Van Loon, L.J.C.',
        ano: 2011,
        titulo: 'Dietary protein for athletes: From requirements to optimum adaptation',
        revista: 'Journal of Sports Sciences',
        volumen: '29(sup1)',
        paginas: 'S29–S38',
        doi: '10.1080/02640414.2011.619204',
        url: 'https://doi.org/10.1080/02640414.2011.619204',
        relevancia: 'Marco de referencia sobre proteína óptima para atletas: umbrales de leucina, síntesis proteica muscular (MPS) y resistencia anabólica.',
        usadoEn: ['KB deportivo', 'Asesor Personal'],
      },
      {
        autores: 'Tipton, K.D. & Wolfe, R.R.',
        ano: 2004,
        titulo: 'Protein and amino acids for athletes',
        revista: 'Journal of Sports Sciences',
        volumen: '22(1)',
        paginas: '65–79',
        doi: '10.1080/0264041031000140554',
        url: 'https://doi.org/10.1080/0264041031000140554',
        relevancia: 'Trabajo seminal sobre timing proteico y ventana anabólica. Base de la recomendación de proteína post-entreno 0–4h.',
        usadoEn: ['KB deportivo', 'Asesor Personal'],
      },
      {
        autores: 'Sims, S.T.',
        ano: 2016,
        titulo: 'ROAR: How to Match Your Food and Fitness to Your Unique Female Physiology',
        revista: 'Rodale Books',
        isbn: '978-1623365189',
        url: 'https://www.simsperformance.com/roar',
        relevancia: 'Referencia divulgativa rigurosa sobre fisiología femenina y deporte: ciclo menstrual, perimenopausia, hidratación, nutrición y recuperación diferencial.',
        usadoEn: ['KB deportivo', 'Asesor Personal'],
      },
      {
        autores: 'Greendale, G.A., et al.',
        ano: 2019,
        titulo: 'Changes in body composition and weight during the menopause transition (SWAN study)',
        revista: 'JCI Insight',
        volumen: '4(5)',
        paginas: 'e124312',
        doi: '10.1172/jci.insight.124312',
        url: 'https://doi.org/10.1172/jci.insight.124312',
        relevancia: 'Datos longitudinales SWAN: caída de masa magra y acumulación de grasa visceral en los 3–4 años alrededor de la menopausia, independiente del peso total.',
        usadoEn: ['KB deportivo', 'KB hormonal', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Perimenopausia — Enfoque Integrativo',
    descripcion: 'Progesterona, histamina, detox estrogénico, suplementos y la perimenopausia como segunda pubertad.',
    items: [
      {
        autores: 'Briden, L.',
        ano: 2021,
        titulo: 'Hormone Repair Manual: Every Woman\'s Guide to Healthy Hormones After 40',
        revista: 'Pan Macmillan',
        isbn: '978-1760983130',
        url: 'https://www.larabriden.com/hormone-repair-manual/',
        relevancia: 'Manual clínico sobre perimenopausia desde enfoque integrativo. Marco "segunda pubertad", rol central de la progesterona, histamina-estrógenos, suplementos con evidencia y metabolismo de estrógenos en tres fases. Referencia central del KB #10.',
        usadoEn: ['KB perimenopausia', 'Reto Hormonal', 'Asesor Personal'],
      },
      {
        autores: 'Briden, L.',
        ano: 2024,
        titulo: 'Period Repair Manual: Natural Treatment for Better Hormones and Better Periods',
        revista: 'Greenpeak Publishing',
        volumen: '4ª ed.',
        isbn: '978-0648352761',
        url: 'https://www.larabriden.com/period-repair-manual/',
        relevancia: 'Complemento del Hormone Repair Manual para mujeres en perimenopausia temprana con ciclos aún presentes. Tratamiento integrativo de síndrome premenstrual, PCOS, endometriosis y dismenorrea.',
        usadoEn: ['KB perimenopausia', 'Asesor Personal'],
      },
      {
        autores: 'Mosconi, L.',
        ano: 2020,
        titulo: 'The XX Brain: The Groundbreaking Science Empowering Women to Prevent Dementia',
        revista: 'Avery / Penguin Random House',
        isbn: '978-0525534358',
        url: 'https://www.lisamosconi.com/the-xx-brain',
        relevancia: 'Neurociencia del cerebro femenino en la transición menopáusica: el estradiol como neuroprotector, ventana de oportunidad HRT, cambios metabólicos cerebrales visibles en neuroimagen, y estrategias de reducción de riesgo Alzheimer. Base del concepto "neuroplasticidad selectiva post-menopausia".',
        usadoEn: ['KB perimenopausia', 'KB longevidad', 'Asesor Personal'],
      },
      {
        autores: 'Maintz, L. & Novak, N.',
        ano: 2007,
        titulo: 'Histamine and histamine intolerance',
        revista: 'American Journal of Clinical Nutrition',
        volumen: '85(5)',
        paginas: '1185–1196',
        doi: '10.1093/ajcn/85.5.1185',
        url: 'https://doi.org/10.1093/ajcn/85.5.1185',
        relevancia: 'Revisión exhaustiva de la intolerancia a la histamina: mecanismos DAO, fuentes alimentarias, síntomas y tratamiento. Base de la recomendación de fermentos jóvenes y DAO oral en mujeres perimenopáusicas con sospecha de intolerancia.',
        usadoEn: ['KB perimenopausia', 'Fermentos', 'Asesor Personal'],
      },
      {
        autores: 'Davis, S.R., et al.',
        ano: 2019,
        titulo: 'Global Consensus Position Statement on the Use of Testosterone Therapy for Women',
        revista: 'Journal of Clinical Endocrinology & Metabolism',
        volumen: '104(10)',
        paginas: '4660–4666',
        doi: '10.1210/jc.2019-01603',
        url: 'https://doi.org/10.1210/jc.2019-01603',
        relevancia: 'Consenso internacional sobre testosterona en mujeres: indicaciones, dosificación, evidencia de eficacia en HSDD y seguridad. Base del enfoque "el agente informa, no prescribe" sobre testosterona femenina.',
        usadoEn: ['KB perimenopausia', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Salud Hormonal Femenina y Estrobioma',
    descripcion: 'Fitoestrógenos, estrobioma, glucemia y omega-3 en perimenopausia y menopausia.',
    items: [
      {
        autores: 'Plottel, C.S. & Blaser, M.J.',
        ano: 2011,
        titulo: 'Microbiome and malignancy',
        revista: 'Cell Host & Microbe',
        volumen: '10(4)',
        paginas: '324–335',
        doi: '10.1016/j.chom.2011.10.003',
        url: 'https://doi.org/10.1016/j.chom.2011.10.003',
        relevancia: 'Introduce el concepto de estrobioma: el conjunto de microbios que metabolizan estrógenos vía β-glucuronidasa, modulando los niveles hormonales circulantes.',
        usadoEn: ['KB hormonal', 'Reto Longevidad', 'Asesor Personal'],
      },
      {
        autores: 'Chen, M.N., Lin, C.C. & Liu, C.F.',
        ano: 2015,
        titulo: 'Efficacy of phytoestrogens for menopausal symptoms: a meta-analysis and systematic review',
        revista: 'Climacteric',
        volumen: '18(2)',
        paginas: '260–269',
        doi: '10.3109/13697137.2014.966241',
        url: 'https://doi.org/10.3109/13697137.2014.966241',
        relevancia: 'Meta-análisis que muestra reducción modesta pero consistente de sofocos con isoflavonas 50–100 mg/día durante ≥12 semanas. Base de las recomendaciones de soja fermentada.',
        usadoEn: ['KB hormonal', 'Recetas Calma', 'Asesor Personal'],
      },
      {
        autores: 'Lucas, M., et al.',
        ano: 2009,
        titulo: 'Ethyl-eicosapentaenoic acid for the treatment of psychological distress and depressive symptoms in middle-aged women',
        revista: 'American Journal of Clinical Nutrition',
        volumen: '89(2)',
        paginas: '641–651',
        doi: '10.3945/ajcn.2008.26394',
        url: 'https://doi.org/10.3945/ajcn.2008.26394',
        relevancia: 'EPA ≥1g/día reduce sofocos y síntomas depresivos en mujeres de mediana edad. Evidencia B para omega-3 en perimenopausia.',
        usadoEn: ['KB hormonal', 'Recetas Focus', 'Asesor Personal'],
      },
      {
        autores: 'Johnston, C.S., Kim, C.M. & Buller, A.J.',
        ano: 2004,
        titulo: 'Vinegar improves insulin sensitivity to a high-carbohydrate meal in subjects with insulin resistance or type 2 diabetes',
        revista: 'Diabetes Care',
        volumen: '27(1)',
        paginas: '281–282',
        doi: '10.2337/diacare.27.1.281',
        url: 'https://doi.org/10.2337/diacare.27.1.281',
        relevancia: 'El ácido acético (vinagre de manzana, kombucha sin filtrar) mejora la sensibilidad a la insulina postprandial. Base del ritual "cucharada de vinagre antes de comer".',
        usadoEn: ['KB hormonal', 'Fermentos', 'Recetas Reset', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Menopausia Moderna y HRT',
    descripcion: 'La re-evaluación post-WHI, HRT bioidéntica, 30+ síntomas no reconocidos y el kit integrado para la transición.',
    items: [
      {
        autores: 'Haver, M.C.',
        ano: 2024,
        titulo: 'The New Menopause: Navigating Your Path Through Hormonal Change with Purpose, Power, and the Facts',
        revista: 'Rodale Books',
        isbn: '978-0593580844',
        url: 'https://www.maryClairehaver.com/the-new-menopause',
        relevancia: 'Manual actualizado sobre menopausia: corrección del WHI, glosario de HRT moderna, lista de 30+ síntomas no reconocidos, ventana de oportunidad, y toolkit de cinco palancas (ejercicio, nutrición, sueño, estrés, HRT considerada). Referencia central del KB #12.',
        usadoEn: ['KB menopausia', 'Reto Hormonal', 'Asesor Personal'],
      },
      {
        autores: 'Haver, M.C.',
        ano: 2023,
        titulo: 'The Galveston Diet: The Doctor-Developed, Patient-Proven Plan to Burn Fat and Tame Your Hormonal Symptoms',
        revista: 'William Morrow',
        isbn: '978-0063243316',
        url: 'https://galvestondiet.com',
        relevancia: 'TRE 14–16h + composición antiinflamatoria + proteína distribuida para mujeres en transición menopáusica. Primer plan dietético diseñado específicamente para menopausia con base en nutrición funcional.',
        usadoEn: ['KB menopausia', 'Asesor Personal'],
      },
      {
        autores: 'Manson, J.E., Aragaki, A.K., Rossouw, J.E., et al.',
        ano: 2017,
        titulo: 'Menopausal Hormone Therapy and Long-term All-Cause and Cause-Specific Mortality',
        revista: 'JAMA',
        volumen: '318(10)',
        paginas: '927–938',
        doi: '10.1001/jama.2017.11217',
        url: 'https://doi.org/10.1001/jama.2017.11217',
        relevancia: 'Re-análisis del WHI a largo plazo: en mujeres que iniciaron HRT antes de los 60 o en los 10 primeros años post-menopausia, la mortalidad por todas las causas se redujo. Base del consenso post-WHI que desmitifica la HRT.',
        usadoEn: ['KB menopausia', 'Asesor Personal'],
      },
      {
        autores: 'The Menopause Society (NAMS)',
        ano: 2022,
        titulo: '2022 Hormone Therapy Position Statement of The North American Menopause Society',
        revista: 'Menopause',
        volumen: '29(7)',
        paginas: '767–794',
        doi: '10.1097/GME.0000000000002028',
        url: 'https://doi.org/10.1097/GME.0000000000002028',
        relevancia: 'Posición oficial de la sociedad científica de referencia en menopausia: HRT es la intervención más efectiva para sofocos, protege hueso y cardiovascular en la ventana de oportunidad. Base del marco de desestigmatización.',
        usadoEn: ['KB menopausia', 'Asesor Personal'],
      },
      {
        autores: 'Gunter, J.',
        ano: 2021,
        titulo: 'The Menopause Manifesto: Own Your Health with Facts and Feminism',
        revista: 'Citadel Press',
        isbn: '978-0806540665',
        url: 'https://www.drjengunter.com/the-menopause-manifesto',
        relevancia: 'Referencia complementaria con énfasis en evidencia y desmitificación. Ginecóloga y columnista NY Times. Contrapeso riguroso a la desinformación sobre menopausia en medios y redes sociales.',
        usadoEn: ['KB menopausia', 'Asesor Personal'],
      },
    ],
  },
  {
    categoria: 'Alimentación Intuitiva y Marco Anti-Dieta',
    descripcion: 'La evidencia detrás del enfoque peso-inclusivo que fundamenta el guardrail ético del Asesor Personal.',
    items: [
      {
        autores: 'Tribole, E. y Resch, E.',
        ano: 2020,
        titulo: 'Intuitive Eating: A Revolutionary Anti-Diet Approach (4.ª ed.)',
        revista: "St. Martin's Essentials",
        isbn: '978-1250255907',
        url: 'https://www.intuitiveeating.org',
        relevancia: 'Marco clínico de referencia para la relación saludable con la comida. 10 principios respaldados por más de 125 estudios. Base del guardrail anti-dieta del agente y de todos los casos QA de conducta compensatoria.',
        usadoEn: ['Asesor Personal', 'Safety guardrail', 'KB alimentación intuitiva'],
      },
      {
        autores: 'Tylka, T.L. y Kroon Van Diest, A.M.',
        ano: 2013,
        titulo: 'The Intuitive Eating Scale–2: Item refinement and psychometric evaluation',
        revista: 'Journal of Counseling Psychology',
        volumen: '60(1)',
        paginas: '137–153',
        doi: '10.1037/a0030893',
        url: 'https://doi.org/10.1037/a0030893',
        relevancia: 'Escala validada de alimentación intuitiva. Correlaciones con imagen corporal, bienestar, y marcadores metabólicos.',
        usadoEn: ['KB alimentación intuitiva'],
      },
      {
        autores: 'Van Dyke, N. y Drinkwater, E.J.',
        ano: 2014,
        titulo: 'Relationships between intuitive eating and health indicators: literature review',
        revista: 'Public Health Nutrition',
        volumen: '17(8)',
        paginas: '1757–1766',
        doi: '10.1017/S1368980013002139',
        url: 'https://doi.org/10.1017/S1368980013002139',
        relevancia: 'Revisión sistemática: alimentación intuitiva se asocia con menor TCA, mejor imagen corporal y marcadores metabólicos más favorables que las intervenciones centradas en el peso.',
        usadoEn: ['KB alimentación intuitiva'],
      },
      {
        autores: 'Bacon, L. y Aphramor, L.',
        ano: 2011,
        titulo: 'Weight Science: Evaluating the Evidence for a Paradigm Shift',
        revista: 'Nutrition Journal',
        volumen: '10',
        paginas: '9',
        doi: '10.1186/1475-2891-10-9',
        url: 'https://doi.org/10.1186/1475-2891-10-9',
        relevancia: 'Revisión crítica de la evidencia sobre dietas de pérdida de peso. Argumenta que el modelo centrado en el peso genera más daño que beneficio. Base del marco HAES (Health at Every Size).',
        usadoEn: ['KB alimentación intuitiva', 'Safety guardrail'],
      },
    ],
  },
  {
    categoria: 'Serotonina Intestinal y Metabolismo del Triptófano',
    descripcion: 'El mecanismo molecular por el que la microbiota regula la serotonina periférica y el estado de ánimo.',
    items: [
      {
        id: 'yano-2015-cell',
        autores: 'Yano, J.M., et al.',
        ano: 2015,
        titulo: 'Indigenous Bacteria from the Gut Microbiota Regulate Host Serotonin Biosynthesis',
        revista: 'Cell',
        volumen: '161(2)',
        paginas: '264–276',
        doi: '10.1016/j.cell.2015.02.047',
        url: 'https://doi.org/10.1016/j.cell.2015.02.047',
        relevancia: 'Paper fundacional: bacterias esporuladas (Clostridia) producen SCFAs que activan Tph1 en células enterocromafines, regulando el 90-95% de la serotonina corporal. Vincula fibra fermentable → microbiota → serotonina periférica de forma causal.',
        usadoEn: ['Home', 'KB serotonina enterocromafín', 'Asesor Personal'],
      },
      {
        autores: 'Reigstad, C.S., et al.',
        ano: 2015,
        titulo: 'Gut microbes promote colonic serotonin production through an effect of short-chain fatty acids on enterochromaffin cells',
        revista: 'FASEB Journal',
        volumen: '29(4)',
        paginas: '1395–1403',
        doi: '10.1096/fj.14-259598',
        url: 'https://doi.org/10.1096/fj.14-259598',
        relevancia: 'Confirmación independiente del mecanismo SCFA → células enterocromafines → serotonina en modelo animal y humano.',
        usadoEn: ['KB serotonina enterocromafín'],
      },
      {
        autores: 'O\'Mahony, S.M., et al.',
        ano: 2015,
        titulo: 'Serotonin, tryptophan metabolism and the brain-gut-microbiome axis',
        revista: 'Behavioural Brain Research',
        volumen: '277',
        paginas: '32–48',
        doi: '10.1016/j.bbr.2014.07.027',
        url: 'https://doi.org/10.1016/j.bbr.2014.07.027',
        relevancia: 'Marco completo del metabolismo del triptófano: vía serotonina vs vía kinurenina vs vía indoles. Base del concepto "cortocircuito del triptófano" cuando hay inflamación crónica.',
        usadoEn: ['KB serotonina enterocromafín', 'Asesor Personal'],
      },
      {
        autores: 'Agus, A., Planchais, J. y Sokol, H.',
        ano: 2018,
        titulo: 'Gut Microbiota Regulation of Tryptophan Metabolism in Health and Disease',
        revista: 'Cell Host & Microbe',
        volumen: '23(6)',
        paginas: '716–724',
        doi: '10.1016/j.chom.2018.05.003',
        url: 'https://doi.org/10.1016/j.chom.2018.05.003',
        relevancia: 'Revisión mecanicista de las tres vías del triptófano (serotonina, kinurenina, indoles) y el papel de la microbiota en el equilibrio entre ellas. Marco de referencia para inflamación y depresión.',
        usadoEn: ['KB serotonina enterocromafín'],
      },
    ],
  },
  {
    categoria: 'Longevidad Clínica y Medicine 3.0',
    descripcion: 'El marco preventivo-predictivo que une ejercicio, nutrición, sueño y salud emocional en una estrategia de décadas.',
    items: [
      {
        autores: 'Attia, P. y Gifford, B.',
        ano: 2023,
        titulo: 'Outlive: The Science and Art of Longevity',
        revista: 'Harmony Books',
        isbn: '978-0593236598',
        url: 'https://peterattiamd.com/outlive',
        relevancia: 'Manual de longevidad clínica más completo de la última década. Marco Medicine 3.0, cuatro jinetes (cardiovascular, cáncer, neurodegeneración, metabólica), cinco palancas (ejercicio, nutrición, sueño, salud emocional, fármacos selectos), Centenarian Decathlon como herramienta de objetivos funcionales.',
        usadoEn: ['KB longevidad clínica', 'Asesor Personal'],
      },
      {
        autores: 'Mandsager, K., et al.',
        ano: 2018,
        titulo: 'Association of Cardiorespiratory Fitness With Long-term Mortality Among Adults Undergoing Exercise Treadmill Testing',
        revista: 'JAMA Network Open',
        volumen: '1(6)',
        paginas: 'e183605',
        doi: '10.1001/jamanetworkopen.2018.3605',
        url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605',
        relevancia: 'VO2max como predictor de mortalidad por todas las causas — el fitness cardiovascular supera en predicción al tabaquismo, diabetes e hipertensión. Base del énfasis de Attia en zona 2 y VO2max.',
        usadoEn: ['KB longevidad clínica'],
      },
      {
        autores: 'López-Otín, C., et al.',
        ano: 2023,
        titulo: 'Hallmarks of aging: an expanding universe',
        revista: 'Cell',
        volumen: '186(2)',
        paginas: '243–278',
        doi: '10.1016/j.cell.2022.11.001',
        url: 'https://doi.org/10.1016/j.cell.2022.11.001',
        relevancia: 'Marco actualizado de los hallmarks moleculares del envejecimiento: 12 palancas incluyendo inflamaging, disfunción mitocondrial, senescencia celular, disbiosis. Fundamento científico del enfoque preventivo.',
        usadoEn: ['KB longevidad clínica', 'KB palancas longevidad'],
      },
      {
        autores: 'Livingston, G., et al.',
        ano: 2024,
        titulo: 'Dementia prevention, intervention, and care: 2024 report of the Lancet standing Commission',
        revista: 'The Lancet',
        doi: '10.1016/S0140-6736(24)01296-0',
        url: 'https://doi.org/10.1016/S0140-6736(24)01296-0',
        relevancia: '14 factores de riesgo modificables de demencia, incluyendo pérdida auditiva no tratada, LDL elevado, inactividad física, depresión, aislamiento social. Evidencia de que el 45% de los casos podrían prevenirse.',
        usadoEn: ['KB longevidad clínica'],
      },
    ],
  },
  {
    categoria: 'Músculo, Huesos y Longevidad',
    descripcion: 'Nutrición estructural para la segunda mitad de la vida.',
    items: [
      {
        autores: 'Witard, O.C., et al.',
        ano: 2016,
        titulo: 'High dietary protein intake for muscle hypertrophy and maintenance',
        revista: 'Nutrition Reviews',
        volumen: '74(suppl 1)',
        paginas: '33–47',
        doi: '10.1093/nutrit/nuw010',
        url: 'https://doi.org/10.1093/nutrit/nuw010',
        relevancia: 'Umbral de leucina y resistencia anabólica en mujeres mayores de 45.',
        usadoEn: ['Reto Longevidad', 'KB longevidad'],
      },
      {
        autores: 'Hauschka, P.V., et al.',
        ano: 1989,
        titulo: 'Osteocalcin and matrix Gla protein: vitamin K-dependent proteins in bone',
        revista: 'Physiological Reviews',
        volumen: '69(3)',
        paginas: '990–1047',
        doi: '10.1152/physrev.1989.69.3.990',
        url: 'https://doi.org/10.1152/physrev.1989.69.3.990',
        relevancia: 'Base científica de la vitamina K2 para la densidad ósea posmenopáusica.',
        usadoEn: ['Reto Longevidad', 'KB longevidad'],
      },
    ],
  },
]

const totalRefs = biblioteca.reduce((acc, s) => acc + s.items.length, 0)

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Biblioteca Científica — Food·Mood',
  description:
    '282 fragmentos científicos curados sobre microbiota, cronobiología, neurogastronomía y psicología de la alimentación.',
  url: 'https://www.food-mood.app/biblioteca',
  author: {
    '@type': 'Person',
    name: 'Susana Ferreras Diez',
    jobTitle: 'Fundadora · Psicóloga · MSc Biotecnología Alimentaria · MSc Gerontología',
    affiliation: { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
  },
  about: biblioteca.map((cat) => ({ '@type': 'Thing', name: cat.categoria, description: cat.descripcion })),
}

export default function BibliotecaPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <header className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#C9A84C' }}>
            Transparencia científica
          </span>
          <h1 className="font-serif text-4xl md:text-6xl mt-4 mb-6" style={{ color: '#1A1612' }}>
            Biblioteca científica
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(26,22,18,0.65)' }}>
            Los {totalRefs} estudios y libros que fundamentan cada recomendación del Asesor Personal.
            Curados por{' '}
            <strong style={{ color: '#1A1612' }}>Susana Ferreras Diez</strong> —
            Psicóloga, MSc Biotecnología Alimentaria, MSc Gerontología y fundadora de una marca de kombucha
            (exit estratégico, 2023).
          </p>
          <p className="text-xs mt-4" style={{ color: 'rgba(26,22,18,0.35)' }}>
            {totalRefs} publicaciones · 282 fragmentos vectorizados · actualizado Mayo 2026
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-16">
          {biblioteca.map((seccion) => (
            <section key={seccion.categoria}>
              <div className="mb-8">
                <h2 className="font-serif text-2xl md:text-3xl mb-2" style={{ color: '#1A1612' }}>
                  {seccion.categoria}
                </h2>
                <p style={{ color: 'rgba(26,22,18,0.55)', fontSize: 14 }}>{seccion.descripcion}</p>
              </div>

              <div className="grid gap-4">
                {seccion.items.map((ref, i) => (
                  <article
                    key={i}
                    id={ref.id}
                    className="bg-white rounded-3xl p-6 md:p-8 transition-shadow hover:shadow-md"
                    style={{ border: '1px solid rgba(26,22,18,0.07)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-2 leading-snug" style={{ color: '#1A1612' }}>
                          {ref.titulo}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: 'rgba(26,22,18,0.6)' }}>
                          <span className="font-semibold">{ref.autores}</span>
                          {' '}
                          <span style={{ color: '#C9A84C', fontWeight: 600 }}>({ref.ano})</span>
                          {'. '}
                          <em>{ref.revista}</em>
                          {ref.volumen && `, ${ref.volumen}`}
                          {ref.paginas && `, pp. ${ref.paginas}`}
                          {ref.isbn && ` · ISBN ${ref.isbn}`}
                          {'.'}
                        </p>

                        {ref.doi && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs mb-3 transition-opacity hover:opacity-70"
                            style={{ color: '#6B2737' }}
                          >
                            <span
                              className="font-mono px-2 py-0.5 rounded"
                              style={{ backgroundColor: 'rgba(107,39,55,0.08)' }}
                            >
                              DOI: {ref.doi}
                            </span>
                            <span>Ver paper →</span>
                          </a>
                        )}
                        {!ref.doi && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs mb-3 underline transition-opacity hover:opacity-70"
                            style={{ color: '#6B2737' }}
                          >
                            Ver fuente →
                          </a>
                        )}

                        <div
                          className="mt-3 p-3 rounded-xl text-sm leading-relaxed"
                          style={{ backgroundColor: '#F5F0E8', color: 'rgba(26,22,18,0.75)' }}
                        >
                          <span className="font-semibold" style={{ color: '#1A1612' }}>¿Por qué lo usamos? </span>
                          {ref.relevancia}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {ref.usadoEn.map((u) => (
                            <span
                              key={u}
                              className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: 'rgba(26,22,18,0.05)', color: 'rgba(26,22,18,0.5)' }}
                            >
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hidden md:block shrink-0">
                        <span
                          className="font-serif text-5xl font-bold select-none"
                          style={{ color: 'rgba(26,22,18,0.06)' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-sm mb-6" style={{ color: 'rgba(26,22,18,0.55)' }}>
            ¿Encontraste un paper que crees que deberíamos incluir?
          </p>
          <a
            href="mailto:info@food-mood.app?subject=Sugerencia%20bibliogr%C3%A1fica"
            className="inline-block px-8 py-4 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1A1612', color: '#F5F0E8' }}
          >
            Sugerir referencia →
          </a>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-12 p-6 rounded-2xl text-center text-sm leading-relaxed"
          style={{ backgroundColor: 'rgba(26,22,18,0.04)', color: 'rgba(26,22,18,0.45)' }}
        >
          Food·Mood ofrece divulgación científica basada en evidencia. No sustituye diagnóstico, tratamiento
          ni terapia médica. Consulta a un profesional ante cualquier duda de salud.
          <br />
          <span className="mt-2 block text-xs">
            <Link href="/glosario" style={{ color: '#6B2737' }}>Glosario científico</Link>
            {' · '}
            <Link href="/asesor" style={{ color: '#6B2737' }}>Asesor Personal</Link>
            {' · '}
            <Link href="/" style={{ color: '#6B2737' }}>food-mood.app</Link>
          </span>
        </div>

      </div>
    </main>
  )
}
