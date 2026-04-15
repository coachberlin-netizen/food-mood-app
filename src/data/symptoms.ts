import React from "react"

export interface SymptomDefinition {
  slug: string;
  titulo: string;
  subtitulo: string;
  explicacion_cientifica: string;
  mood_es: string;
  target_tags: string[]; // Strict mapping tags to hit supabase recipes
  nutritionFocus: string[]; // For UI editorial display
  recipeStyles: string[]; // Guided formats and preparations
  practical_note: string;
  icon?: React.ReactNode;
}

export const SYMPTOMS: SymptomDefinition[] = [
  {
    slug: 'ansiedad',
    titulo: 'Ansiedad Somática',
    subtitulo: 'Nutre el eje intestino-cerebro para calmar tu sistema nervioso',
    explicacion_cientifica: 'El 95% de la serotonina (neurotransmisor de la calma y el bienestar) y casi un 50% de la dopamina se producen en tu tracto digestivo. Cuando el intestino está inflamado (disbiosis), el nervio vago transmite señales de alerta persistentes al cerebro, activando el modo lucha-huida de forma crónica. Reparar esta barrera mucosa y proveer triptófano, zinc y magnesio biodisponible permite reducir significativamente el ruido neural. La fermentación y el almidón resistente alimentan específicamente las bacterias productoras de GABA, el principal neurotransmisor inhibitorio del sistema nervioso central.',
    mood_es: 'Calma',
    target_tags: ['calma', 'equilibrio', 'ansiedad', 'triptófano', 'magnesio', 'fermentado', 'confort'],
    nutritionFocus: ['Triptófano (precursor de serotonina)', 'Magnesio calmante', 'Almidón resistente (GABA)', 'Bacterias vivas (Fermentos)'],
    recipeStyles: ['Cenas templadas', 'Infusiones reconfortantes', 'Platos de cuchara densos'],
    practical_note: 'Incorpora grasas saludables y magnesio especialmente por las tardes. Un entorno vagotónico — comer despacio, sin pantallas, a temperatura ambiente — mejora hasta un 40% la asimilación del magnesio dietético.'
  },
  {
    slug: 'insomnio',
    titulo: 'Insomnio y Descanso',
    subtitulo: 'Precursores de melatonina, digestiones silenciosas y descenso del cortisol',
    explicacion_cientifica: 'Tu arquitectura del sueño depende de la conversión eficiente de triptófano en serotonina y, al caer el sol, en melatonina. Una inflamación sistémica leve compite activamente por ese triptófano, desviándolo hacia vías metabólicas proinflamatorias (kynurenina) en lugar de neuromoduladoras. Las cenas hipercalóricas, ricas en azúcares simples, elevan la temperatura core y mantienen el cortisol alto, impidiendo que el GABA —tu principal freno cerebral— pueda inducir el sueño reparador profundo. La microbiota también regula directamente el ciclo circadiano a través del nervio vago.',
    mood_es: 'Calma',
    target_tags: ['calma', 'cena', 'insomnio', 'gaba', 'relajante', 'triptófano', 'Sedante herbal', 'Antes de dormir', 'Ritual de noche'],
    nutritionFocus: ['GABA natural (Fermentos, Tomate)', 'Precursores de melatonina (Cereza, Avena)', 'Grasas neuro-estabilizadoras (Ghee, AOVE)', 'Magnesio (Semillas de calabaza, Cacao)'],
    recipeStyles: ['Cremas de noche', 'Infusiones florales calientes', 'Caldos sedantes'],
    practical_note: 'Establece una ventana de al menos dos horas entre la última ingesta y la hora de dormir. Para acelerar el descenso térmico favorecedor del sueño, apóyate en bebidas calientes de baja carga glucémica: el ritual de calentar y sostener la taza activa el sistema nervioso parasimpático.'
  },
  {
    slug: 'cansancio',
    titulo: 'Cansancio y Energía Baja',
    subtitulo: 'Restaura la producción mitocondrial de ATP desde el intestino',
    explicacion_cientifica: 'El cansancio crónico raramente es solo falta de sueño. Con frecuencia nace de una barrera intestinal comprometida que dificulta la absorción de hierro, vitamina B12 y coenzima Q10 —cofactores esenciales de la cadena de transporte de electrones mitocondrial. Una microbiota empobrecida no regula eficientemente los picos de cortisol matutinos ni los ritmos circadianos que gobiernan cuándo y cómo tus células regeneran su reserva de ATP. Los adaptógenos vegetales actúan sobre el eje HPA modulando la respuesta al estrés sin estimular el sistema nervioso simpático.',
    mood_es: 'Activación',
    target_tags: ['activación', 'energía', 'desayuno', 'cansancio', 'hierro', 'b12', 'adaptógenos', 'Despertar', 'Metabolismo'],
    nutritionFocus: ['Hierro de alta biodisponibilidad (Legumbres + Vitamina C)', 'Vitamina B12 (Fermentos, Huevo)', 'Adaptógenos (Maca, Shiitake)', 'Carbohidratos complejos de absorción lenta'],
    recipeStyles: ['Desayunos sostenidos en proteína', 'Bowls energéticos con grasas buenas', 'Snacks de rescate sin picos de glucosa'],
    practical_note: 'Evita cafeína antes de completar al menos 90 minutos desde el despertar: bloquea el adenosín acumulado durante el sueño y provoca el rebote de fatiga a media mañana. Prioriza desayunos densos en proteína limpia para sostener la dopamina y el foco a lo largo de la jornada.'
  },
  {
    slug: 'niebla-mental',
    titulo: 'Niebla Mental y Falta de Foco',
    subtitulo: 'Claridad neurocognitiva mediante ácidos grasos y reducción de la neuroinflamación',
    explicacion_cientifica: 'La dificultad para concentrarse, la lentitud ejecutiva o la sensación de opacidad cognitiva suelen tener un origen inflamatorio. Una permeabilidad intestinal elevada (leaky gut) permite el paso de lipopolisacáridos bacterianos al torrente sanguíneo; al cruzar la barrera hematoencefálica, activan la microglía —el sistema inmune del cerebro— generando neuroinflamación difusa. El DHA (omega-3) es el principal componente estructural de las membranas neuronales y regula la fluidez sináptica. La L-teanina del matcha genera ondas cerebrales alfa sin el rebote ansioso de la cafeína pura.',
    mood_es: 'Focus',
    target_tags: ['focus', 'omega-3', 'antioxidante', 'niebla-mental', 'dha', 'cognición', 'claridad', 'Densidad', 'Superalimentos'],
    nutritionFocus: ['Omega-3 DHA/EPA (Pescado azul, Chía, Lino)', 'Colina (Huevo entero)', 'L-Teanina (Matcha ceremonial)', 'Antioxidantes neuro-protectores (Arándano, Cacao)'],
    recipeStyles: ['Bowls de foco con grasas estructurales', 'Bebidas activadoras sin pico glucémico', 'Recetas ricas en pescado azul y semillas'],
    practical_note: 'El ayuno nocturno prolongado (12-14 horas) activa la autofagia cerebral y reinicia los mecanismos de limpieza glinfática. Compleméntalo con una primera ingesta alta en omega-3 y colina para maximizar la síntesis de acetilcolina, el neurotransmisor clave de la memoria de trabajo.'
  },
  {
    slug: 'hambre-constante',
    titulo: 'Antojos y Desregulación Glucémica',
    subtitulo: 'Estabiliza leptina y grelina a través de fibra, grasa y saciedad real',
    explicacion_cientifica: 'Los antojos compulsivos raramente son debilidad de voluntad: son el resultado de oscilaciones bruscas de glucosa en sangre y de un déficit en la producción de ácidos grasos de cadena corta (butirato, propionato) en el colon. Estos metabolitos comunican al hipotálamo señales de plenitud profunda vía nervio vago y péptido YY. Cuando la microbiota está empobrecida, esta señal se silencia: el cerebro percibe hambre incluso con el estómago lleno. Una dieta rica en fibra prebiótica y proteína de calidad reconstruye este circuito hormonal saciante en 3-6 semanas.',
    mood_es: 'Reset',
    target_tags: ['reset', 'saciedad', 'fibra', 'grasas-buenas', 'antojos', 'hambre', 'Crudo vibrante', 'Low-carb'],
    nutritionFocus: ['Fibra saciante de larga fermentación (Inulina, Pectina)', 'Proteína completa de digestión lenta', 'Grasas monoinsaturadas (AOVE, Aguacate)', 'Polifenoles anti-craving (Cacao, Canela)'],
    recipeStyles: ['Desayunos altos en proteína y grasa', 'Snacks con fibra soluble', 'Ensaladas de volumen con proteína'],
    practical_note: 'Invierte el orden habitual de tu plato: empieza siempre por la verdura y la fibra, continúa con la proteína y la grasa, y deja el hidrato al final. Este reordenamiento reduce los picos postprandiales de glucosa hasta un 30%, cortando de raíz el ciclo de antojo reactivo dos horas después de comer.'
  },
  {
    slug: 'inflamacion-silenciosa',
    titulo: 'Inflamación Silenciosa',
    subtitulo: 'El poder radical del color, los polifenoles y las especias maestras',
    explicacion_cientifica: 'El "inflammaging" —inflamación crónica de bajo nivel— es la antesala de la aceleración del envejecimiento celular y de la mayoría de las enfermedades crónicas modernas. Su origen más frecuente es la degradación de la barrera intestinal, que permite el paso continuo de endotoxinas bacterianas al torrente sanguíneo. Los polifenoles concentrados en pigmentos vegetales vivos (antocianinas, flavonoles, curcuminoides) bloquean las vías de señalización proinflamatoria NF-κB con una eficacia comparable a algunos antiinflamatorios, sin sus efectos secundarios. La variedad cromática en el plato es el marcador más fiel de riqueza polifenólica.',
    mood_es: 'Reset',
    target_tags: ['reset', 'antiinflamatorio', 'polifenol', 'cúrcuma', 'inflamación', 'detox', 'ayuno', 'Depurador', 'Antiinflamatorio'],
    nutritionFocus: ['Polifenoles de color (Antocianinas, Flavonoles)', 'Curcumina activa + pimienta negra', 'Glucosinolatos (Crucíferas)', 'Omega-3 anti-NF-κB'],
    recipeStyles: ['Guisos vivos con especias activas', 'Smoothies de alta densidad polifenólica', 'Caldos depurativos de raíz'],
    practical_note: 'Cuenta colores naturales, no calorías. Apunta a cinco pigmentos vegetales distintos por día: verde (clorofila), naranja (betacaroteno), rojo (licopeno), morado (antocianinas) y blanco/amarillo (quercetina, alicina). Cada color representa un mecanismo antiinflamatorio distinto.'
  },
  {
    slug: 'digestion-pesada',
    titulo: 'Digestión Pesada e Hinchazón',
    subtitulo: 'Restaurar el tránsito, calmar el intestino y eliminar la fermentación excesiva',
    explicacion_cientifica: 'La hinchazón y la pesadez postprandial no siempre indican exceso de comida: con frecuencia señalan una disfunción en el ciclo enterohepático de los ácidos biliares, un vaciado gástrico lento o una disbiosis con sobreproducción bacteriana de gas (SIBO). Las enzimas digestivas de origen vegetal —bromelina (piña), papaína (papaya)— mejoran la eficiencia proteolítica sin irritar la mucosa. La fibra soluble (pectina, psyllium) forma gel en el lumen intestinal, amortiguando la fermentación excesiva y nutriendo selectivamente las bacterias que producen butirato, el principal nutriente del epitelio colónico.',
    mood_es: 'Reset',
    target_tags: ['reset', 'digestión', 'prebiótico', 'fermentado', 'fibra', 'Bálsamo', 'Depurador', 'Ayuno', 'Calor ligero'],
    nutritionFocus: ['Enzimas digestivas naturales (Bromelina, Papaína)', 'Fibra soluble gel-formante (Psyllium, Pectina)', 'Bacterias ácido-lácticas (Kéfir, Miso suave)', 'Compuestos amargos activadores biliares (Angélica, Alcachofa)'],
    recipeStyles: ['Cremas suaves de fácil tránsito', 'Caldos de miso ligero', 'Ensaladas de raíces amargas y fermentos'],
    practical_note: 'Evita mezclar frutas de alta fermentación (melón, mango) con proteína animal en la misma comida: la diferencia en tiempos de digestión genera sobreproducción de gas. Masticar cada bocado al menos 20 veces activa la amilasa salivar y reduce a la mitad el trabajo posterior del estómago.'
  },
  {
    slug: 'irritabilidad',
    titulo: 'Irritabilidad y Estrés Reactivo',
    subtitulo: 'Modular el eje HPA y reponer los nutrientes quemados por el estrés crónico',
    explicacion_cientifica: 'El estrés crónico activa de forma sostenida el eje hipotálamo-hipófisis-adrenal (HPA), forzando una producción continua de cortisol que agota progresivamente el magnesio intracelular, el zinc y las vitaminas del grupo B —cofactores esenciales en la síntesis de serotonina, dopamina y GABA. Sin estos precursores, el umbral de reactividad emocional cae: el sistema nervioso simpático se dispara ante estímulos menores. Paralelamente, el cortisol elevado degrada la barrera intestinal, reduciendo la diversidad microbiana y amplificando la señal inflamatoria que retroalimenta el estado de alerta. Los adaptógenos regulan la sensibilidad de los receptores de glucocorticoides sin suprimir la respuesta al estrés.',
    mood_es: 'Calma',
    target_tags: ['calma', 'equilibrio', 'magnesio', 'ansiedad', 'estrés', 'triptófano', 'Bálsamo', 'Ritual de noche', 'Umami'],
    nutritionFocus: ['Magnesio glicinato (Sistema nervioso)', 'Vitaminas B6, B9 y B12 (Neurotransmisores)', 'Zinc (Cofactor GABA y serotonina)', 'Adaptógenos (Ashwagandha, L-teanina)'],
    recipeStyles: ['Caldos reconfortantes con umami profundo', 'Infusiones adaptogénicas', 'Platos cálidos de textura sedante'],
    practical_note: 'El magnesio se agota exponencialmente bajo estrés: una ingesta de 350-400mg/día a través de la dieta —vía verduras de hoja verde, semillas de calabaza, legumbres y cacao puro— es la intervención nutricional con mayor evidencia clínica para reducir la reactividad del sistema nervioso en adultos con estrés crónico.'
  }
];
