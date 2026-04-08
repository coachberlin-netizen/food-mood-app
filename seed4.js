module.exports = [
  {
    name: "Brócoli", slug: "brocoli", tagline: "Sulforafano: el escudo contra el envejecimiento", category: "verdura", subcategory: "crucífera", moods: ["focus", "reset"],
    mind_effect: "El sulforafano activa la vía Nrf2, el sistema de defensa antioxidante más potente del cuerpo, incluyendo el cerebro. Protege las neuronas del estrés oxidativo. Fuente de folatos esenciales para la síntesis de neurotransmisores.",
    longevity_effect: "Los glucosinolatos se transforman en isotiocianatos que activan enzimas de detoxificación y apoptosis de células dañadas. Potente anticancerígeno (especialmente colon y mama). Rico en vitamina C, calcio y vitamina K.",
    science_summary: "Crucífera rica en glucosinolatos (precursores de sulforafano), vitamina C, K, folatos, carotenoides (luteína) y fibra. Los estudios señalan efectos neuroprotectores y quimiopreventivos.",
    active_compounds: ["sulforafano", "glucosinolatos", "luteína", "kaempferol", "vitamina K"],
    benefits: ["Neuroprotector", "Anticancerígeno", "Detoxificante", "Antiinflamatorio"],
    evidence_level: "alto",
    synergies: [{"ingredient": "aceite-de-oliva", "reason": "Absorción de vitaminas liposolubles K y A"}, {"ingredient": "limon", "reason": "Combina vitamina C y optimiza la formación de sulforafano"}]
  },
  {
    name: "Nuez", slug: "nuez", tagline: "Tiene forma de cerebro por algo", category: "fruto_seco", moods: ["focus", "calma"],
    mind_effect: "La nuez tiene forma de cerebro y lo alimenta literalmente. Rica en omega-3 (ALA), el ácido graso esencial para las membranas neuronales. La vitamina E protege las neuronas del estrés oxidativo. El triptófano contribuye a la producción de serotonina.",
    longevity_effect: "El alimento con mayor capacidad antioxidante entre los frutos secos (ácido elágico, polifenoles). Los omega-3 reducen inflamación sistémica. Cardioprotector: mejora perfil lipídico.",
    science_summary: "El único fruto seco con una cantidad significativa de ALA (Alpha-Linolenic Acid). También aporta melatonina endógena, fundamental para los ciclos circadianos y el descanso de calidad.",
    active_compounds: ["ALA (omega-3)", "ácido elágico", "polifenoles", "vitamina E", "melatonina"],
    benefits: ["Neuroprotector", "Cardioprotector", "Regulador del sueño", "Antioxidante"],
    synergies: [{"ingredient": "kefir", "reason": "Complementa proteína láctea y potencia saciedad neurológica"}],
    evidence_level: "alto"
  },
  {
    name: "Avena", slug: "avena", tagline: "Beta-glucanos que alimentan tu microbiota", category: "cereal", moods: ["calma", "confort", "focus"],
    mind_effect: "Los beta-glucanos de la avena son prebióticos que alimentan las bacterias beneficiosas del intestino — tu 'segundo cerebro'. Estabiliza la glucosa evitando los bajones de energía y humor. Rica en vitaminas B que participan en la síntesis de neurotransmisores.",
    longevity_effect: "Reduce colesterol LDL (evidencia sólida). Los beta-glucanos modulan el sistema inmune. La fibra soluble mejora el tránsito y la salud del colon — factor clave en longevidad.",
    science_summary: "Cereal singular con alto contenido de biomoléculas bioactivas: los β-glucanos (1-3, 1-4) que forman un gel en el intestino, y avenantramidas, polifenoles exclusivos de la avena con potente acción anti-picor, antiinflamatoria y vasodilatadora.",
    active_compounds: ["β-glucanos", "avenantramidas", "vitaminas B", "hierro", "magnesio"],
    benefits: ["Prebiótico", "Estabilizador glucémico", "Cardioprotector", "Antiinflamatorio"],
    synergies: [{"ingredient": "canela", "reason": "La combinación maestra para aplanar la curva de glucosa cerebral"}],
    evidence_level: "alto"
  },
  {
    name: "Aceite de oliva virgen extra", slug: "aceite-de-oliva", tagline: "Oro líquido mediterráneo", category: "aceite", moods: ["social", "confort", "calma"],
    mind_effect: "El ácido oleico mejora la fluidez de las membranas neuronales. Los polifenoles (hidroxitirosol, oleuropeína) protegen el cerebro de la neuroinflamación. Dieta mediterránea rica en AOVE se asocia con menor riesgo de depresión.",
    longevity_effect: "Piedra angular de la dieta mediterránea y la longevidad. Esqualeno (provitamina A), fitoesteroles (β-sitosterol), vitamina E, polifenoles. Reduce LDL oxidado, protege endotelio vascular. La lecitina (en virgen sin refinar) protege hígado y sistema nervioso.",
    science_summary: "55-83% ácido oleico (monoinsaturado). Porción insaponificable: esqualeno, β-sitosterol, campesterol, tocoferoles, polifenoles (hidroxitirosol, oleuropeína). El virgen extra conserva todos los compuestos; el refinado pierde antioxidantes progresivamente.",
    active_compounds: ["ácido oleico", "hidroxitirosol", "oleuropeína", "esqualeno", "β-sitosterol"],
    benefits: ["Neuroprotector", "Cardioprotector", "Anti-aging celular", "Inmunomodulador"],
    synergies: [{"ingredient": "tomate", "reason": "El AOVE disuelve y absorbe el licopeno multiplicando su poder protector"}],
    evidence_level: "alto"
  },
  {
    name: "Kombucha", slug: "kombucha", tagline: "Probióticos vivos para tu segundo cerebro", category: "fermentado", moods: ["reset", "activacion", "focus"],
    mind_effect: "Los probióticos de la kombucha modulan directamente el eje intestino-cerebro. Bacterias como Lactobacillus producen GABA (neurotransmisor calmante). Mejora la diversidad de la microbiota, asociada con menor ansiedad y mejor estado de ánimo.",
    longevity_effect: "Los ácidos orgánicos (acético, glucurónico) apoyan la detoxificación hepática. Los polifenoles del té base aportan protección antioxidante. La fermentación aumenta biodisponibilidad de vitaminas B.",
    science_summary: "Bebida fermentada originaria de un SCOBY. Las levaduras y bacterias oxidan los azúcares transformándolos en ácidos volátiles. Genera un microbioma secundario en el intestino que regula péptidos neuroendocrinos.",
    active_compounds: ["probióticos", "ácido acético", "ácido glucurónico", "polifenoles del té"],
    benefits: ["Apoyo microbiota", "Detox hepático", "Equilibrador nervioso", "Digestivo"],
    synergies: [{"ingredient": "jengibre", "reason": "Fermentar jengibre en la kombucha duplica el potencial digestivo y antiemético"}],
    evidence_level: "moderado"
  },
  {
    name: "Melena de león", slug: "melena-de-leon", tagline: "El hongo que regenera tus neuronas", category: "hongo", moods: ["focus"],
    mind_effect: "Contiene erinacinas y hericenonas que estimulan la producción de NGF (Factor de Crecimiento Nervioso) — literalmente ayuda a tus neuronas a crecer y repararse. Los estudios muestran mejora en memoria y concentración. Potencial en deterioro cognitivo leve.",
    longevity_effect: "Neuroprotector por excelencia. Estimula BDNF y NGF, los factores de crecimiento neuronal. Antiinflamatorio intestinal. Prometedor en investigación de Alzheimer y Parkinson.",
    science_summary: "Hongo Hericium erinaceus. Sus bioactivos cruzan la barrera hematoencefálica promoviendo la remielinización. Además actúa en el intestino gracias a sus complejos beta-glucanos que nutren la inmunidad celular.",
    active_compounds: ["erinacinas", "hericenonas", "β-glucanos", "polisacáridos"],
    benefits: ["Nootrópico", "Regenerador neuronal", "Apoyo digestivo", "Memoria"],
    synergies: [{"ingredient": "te-matcha", "reason": "Sinergia de focus absoluta: NGF del hongo + L-teanina del té"}],
    evidence_level: "moderado"
  },
  {
    name: "Té verde", slug: "te-verde", tagline: "L-teanina: concentración sin nervios", category: "bebida", moods: ["focus", "calma"],
    mind_effect: "Combinación única de L-teanina + cafeína. La L-teanina aumenta ondas alfa cerebrales (estado de concentración relajada) mientras la cafeína mantiene la alerta. Resultado: focus sin ansiedad. Las catequinas (EGCG) son neuroprotectoras.",
    longevity_effect: "Las catequinas (especialmente EGCG) son los antioxidantes más potentes del mundo vegetal. Protegen contra cáncer, cardiovascular y neurodegeneración. El proceso de preparación del té verde (sin fermentar) conserva intacto su contenido en catequinas.",
    science_summary: "Bases xánticas (cafeína, teofilina, teobromina), polifenoles (catequinas: EGCG, EGC, ECG), taninos catéquicos, ácidos fenólicos (clorogénico, cafeico, gálico), L-teanina, flúor y vitaminas B, C, E.",
    active_compounds: ["EGCG", "L-teanina", "cafeína", "catequinas", "ácido gálico"],
    benefits: ["Nivelador cognitivo", "Antioxidante extremo", "Quimiopreventivo", "Lipotrópico"],
    synergies: [{"ingredient": "limon", "reason": "El ácido ascórbico cuadruplica la biodisponibilidad de las catequinas a nivel celular"}],
    evidence_level: "alto"
  },
  {
    name: "Cacao puro", slug: "cacao", tagline: "El placer que tu cerebro necesita", category: "otro", moods: ["social", "confort", "calma"],
    mind_effect: "Estimula producción de endorfinas y anandamida ('molécula de la felicidad'). La teobromina aporta energía suave sin el pico de la cafeína. Los flavonoides mejoran flujo sanguíneo cerebral, mejorando memoria y procesamiento cognitivo.",
    longevity_effect: "Concentración de polifenoles superior al vino tinto, té verde y la mayoría de frutas. Reduce presión arterial sistólica y diastólica. Modula función plaquetaria e inflamación. Cardioprotector documentado.",
    science_summary: "Rico en flavonoides (epicatequina, catequina, procianidinas). Contiene metilxantinas (teobromina, cafeína). Ácido esteárico (neutro para colesterol). El cacao crudo o >70% conserva la máxima concentración de polifenoles.",
    active_compounds: ["flavonoides", "teobromina", "anandamida", "epicatequina", "magnesio"],
    benefits: ["Vasodilatador neuronal", "Estimulante hedónico", "Cardioprotector", "Antioxidante"],
    synergies: [{"ingredient": "pimienta-negra", "reason": "Un toque agudiza el flujo vascular cerebral propiciado por los flavonoides"}],
    evidence_level: "alto"
  }
];
