import React from "react"

export interface SymptomDefinition {
  slug: string;
  titulo: string;
  subtitulo: string;
  explicacion_cientifica: string;
  mood_es: string;
  target_tags: string[]; // Strict mapping tags to hit supabase recipes
  key_ingredients: string[]; // For UI editorial display
  practical_note: string;
  icon?: React.ReactNode; // Store SVG icon here to centralize visually across grid/hero
}

export const SYMPTOMS: SymptomDefinition[] = [
  {
    slug: 'cansancio',
    titulo: 'Cansancio Crónico',
    subtitulo: 'Despierta tu energía celular desde el intestino',
    explicacion_cientifica: 'El cansancio crónico frecuentemente empieza con una barrera intestinal comprometida, dificultando la síntesis y absorción de hierro, magnesio y vitamina B12. A nivel endócrino, una microbiota poco diversa no regula eficientemente tus ritmos circadianos ni tus picos de cortisol. Restaurar el ATP (la moneda de energía celular) requiere reequilibrar este microbioma con prebióticos y adaptógenos que mitiguen el estrés del sistema nervioso.',
    mood_es: 'Activación',
    target_tags: ['activación', 'energía', 'desayuno', 'cansancio', 'hierro', 'b12', 'adaptógenos'],
    key_ingredients: ['Hierro', 'Vitamina B12', 'Micelio de Shiitake', 'Maca', 'Avena integral'],
    practical_note: 'Prioriza desayunos y comidas ricos en proteína limpia y carbohidratos complejos, evitando picos glucémicos que provocan caída rápida de energía a media tarde.'
  },
  {
    slug: 'ansiedad',
    titulo: 'Ansiedad Somática',
    subtitulo: 'Nutre el eje intestino-cerebro para calmar tu sistema nervioso',
    explicacion_cientifica: 'El 95% de la serotonina (neurotransmisor de la calma y el bienestar) y casi un 50% de la dopamina se producen en tu tracto digestivo. Cuando el intestino está inflamado (disbiosis), el nervio vago transmite señales de alerta persistentes al cerebro, activando el modo lucha-huida. Reparar esta barrera y proveer triptófano, zinc y magnesio permite reducir significativamente el ruido neural.',
    mood_es: 'Calma',
    target_tags: ['calma', 'equilibrio', 'ansiedad', 'triptófano', 'magnesio', 'fermentado', 'confort'],
    key_ingredients: ['Cacao crudo', 'Semillas de calabaza', 'Plátano verde (almidón resistente)', 'Kéfir o Kombucha', 'Almendras'],
    practical_note: 'Busca incorporar grasas saludables y magnesio especialmente por las tardes. Un ambiente vagotónico (comer despacio, sin pantallas) mejora un 40% la asimilación del magnesio.'
  },
  {
    slug: 'insomnio',
    titulo: 'Insomnio y Descanso',
    subtitulo: 'Precursores de melatonina y digestiones silenciosas',
    explicacion_cientifica: 'Tu arquitectura del sueño depende de la conversión eficiente de triptófano en serotonina, y posteriomente en melatonina al caer el sol. Una inflamación sistémica leve compite por este triptófano y lo desvía hacia vías metabólicas neurotóxicas. Cenas hipercalóricas o carentes de fitonutrientes no logran descender el cortisol ni activar el GABA (tu neurotransmisor freno cerebral).',
    mood_es: 'Calma',
    target_tags: ['calma', 'cena', 'insomnio', 'gaba', 'relajante', 'triptófano'],
    key_ingredients: ['Pavo o pollo criollo', 'Avena', 'Cerezas', 'Espinaca hervida', 'Nueces'],
    practical_note: 'Aleja tu cena mínimo 2 horas de la hora de dormir. Apóyate en protocolos cálidos como infusiones para reducir la temperatura basal y propiciar la inducción natural del sueño.'
  },
  {
    slug: 'hambre-constante',
    titulo: 'Hambre Constante',
    subtitulo: 'Regula leptina y grelina a través de grasa, fibra y saciedad',
    explicacion_cientifica: 'Las ansias de comer continuamente (craving) no siempre responden a factores psicológicos, sino a fluctuaciones bruscas de glucosa y a una deficiencia en la producción de ácidos grasos de cadena corta (como el butirato) en el colon. Estos ácidos le comunican al cerebro señales de plenitud profunda. Alimentar a las colonias bacterianas correctas restablece esta cascada hormonal saciante.',
    mood_es: 'Reset',
    target_tags: ['reset', 'saciedad', 'fibra', 'grasas-buenas', 'antojos', 'hambre'],
    key_ingredients: ['Aguacate', 'Proteína magra de alto valor', 'Semillas de chía', 'Psyllium', 'Aceite de oliva virgen extra'],
    practical_note: 'Empieza siempre tus comidas por la verdura o la fibra, seguido de proteínas/grasas, dejando el hidrato al final. Este simple cambio reduce los picos de glucosa responsables del hambre reactiva.'
  },
  {
    slug: 'niebla-mental',
    titulo: 'Niebla Mental',
    subtitulo: 'Claridad neurocognitiva mediante ácidos grasos y neuro-protección',
    explicacion_cientifica: 'La dificultad para concentrarse, la pérdida de memoria a corto plazo o la sensación de "nube espacial" puede ser directamente neuroinflamación. Una excesiva permeabilidad intestinal (leaky gut) permite el paso de endotoxinas, que penetrando al torrente sanguíneo, llegan hasta el cerebro irritando la microglía (el sistema inmune del cerebro). Reforzar la permeabilidad cura indirectamente esa niebla.',
    mood_es: 'Focus',
    target_tags: ['focus', 'omega-3', 'antioxidante', 'niebla-mental', 'dha', 'cognición', 'claridad'],
    key_ingredients: ['Pescados azules pequeños (DHA)', 'Huevo (Colina)', 'Nueces pacanas', 'Té verde Matcha (L-Teanina)', 'Mantequilla Ghee'],
    practical_note: 'El ayuno intermitente nocturno prolongado (12-14 horas) combinado con altos índices de omegas en tus primeras ingestas es vital para la neuro-restauración.'
  },
  {
    slug: 'inflamacion-silenciosa',
    titulo: 'Inflamación Silenciosa',
    subtitulo: 'El poder radical del color, polifenoles y especias maestras',
    explicacion_cientifica: 'El "inflammaging" (inflamación crónica de bajo nivel) es la antesala de la aceleración del envejecimiento. Nace frecuentemente del ataque a tu muro intestinal. En Food Mood recurrimos a densidades extraordinarias de polifenoles encontrados en espectros biológicos vivos: amarillos, púrpuras y verdes intensos fungen como antioxidantes potentes, neutralizando radicales libres antes de que inflamen tu tejido sistémico.',
    mood_es: 'Reset',
    target_tags: ['reset', 'antiinflamatorio', 'polifenol', 'cúrcuma', 'inflamación', 'detox', 'ayuno'],
    key_ingredients: ['Cúrcuma fresca con pimienta negra', 'Jengibre', 'Arándanos oscuros', 'Granada', 'Verduras de hoja oscura'],
    practical_note: 'Apuéstalo todo al arcoíris. Trata de contar colores naturales en lugar de contar calorías. A más variedad de pigmentos de la huerta, mayor escudo antiinflamatorio.'
  }
];
