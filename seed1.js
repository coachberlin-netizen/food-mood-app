module.exports = [
  {
    name: "Cúrcuma", slug: "curcuma", tagline: "El oro que protege tu cerebro", category: "especia", moods: ["focus", "reset", "calma"],
    mind_effect: "La curcumina atraviesa la barrera hematoencefálica y actúa directamente sobre el cerebro. Modula neurotransmisores como la serotonina y la dopamina, mejorando el estado de ánimo. Estudios sugieren efectos comparables a antidepresivos en depresión leve. Reduce la neuroinflamación asociada a la niebla mental.",
    longevity_effect: "Potente antiinflamatorio y antioxidante. Protege contra el deterioro cognitivo asociado a la edad. Inhibe la agregación de proteínas amiloides (vinculadas al Alzheimer). Favorece la regeneración neuronal (BDNF).",
    science_summary: "Contiene curcuminoides, principalmente curcumina. Su biodisponibilidad es baja por sí sola pero aumenta hasta un 2000% combinada con piperina (pimienta negra). Es un inhibidor de COX-2 y NF-κB, dos vías centrales de la inflamación crónica.",
    active_compounds: ["curcumina", "demetoxicurcumina", "bisdemetoxicurcumina"],
    benefits: ["Antiinflamatorio", "Neuroprotector", "Antioxidante", "Antidepresivo natural"],
    synergies: [{"ingredient": "pimienta-negra", "reason": "La piperina aumenta la biodisponibilidad de la curcumina hasta un 2000%"}, {"ingredient": "aceite-de-oliva", "reason": "La curcumina es liposoluble — las grasas mejoran su absorción"}, {"ingredient": "jengibre", "reason": "Potencia sinérgica antiinflamatoria (ambos inhiben COX-2)"}],
    evidence_level: "alto"
  },
  {
    name: "Jengibre", slug: "jengibre", tagline: "El fuego que despierta tu digestión", category: "especia", moods: ["activacion", "reset"],
    mind_effect: "Activa la circulación cerebral, mejorando la alerta y la concentración. Su efecto antiemético reduce la ansiedad asociada a molestias digestivas. Contiene compuestos que modulan la serotonina intestinal — recuerda que el 90% de la serotonina se produce en el intestino.",
    longevity_effect: "Potente antiinflamatorio — los gingeroles inhiben las mismas vías que la curcumina (COX-2, NF-κB). Protector cardiovascular: reduce LDL oxidado y mejora la circulación. Efecto termogénico que activa el metabolismo.",
    science_summary: "Contiene gingeroles (frescos) y shogaoles (seco/cocido). Los shogaoles tienen mayor potencia antioxidante. Rico en terpenos que contribuyen a la protección celular contra radicales libres.",
    active_compounds: ["gingerol", "shogaol", "zingerona", "terpenos"],
    benefits: ["Antiinflamatorio", "Digestivo", "Termogénico", "Antiemético"],
    synergies: [{"ingredient": "curcuma", "reason": "Doble bloqueo antiinflamatorio COX-2"}, {"ingredient": "limon", "reason": "Vitamina C + gingeroles = absorción mutua y defensa inmune"}],
    evidence_level: "alto"
  },
  {
    name: "Canela", slug: "canela", tagline: "Dulzura que estabiliza tu energía", category: "especia", moods: ["confort", "calma", "activacion"],
    mind_effect: "Estabiliza los niveles de glucosa en sangre, evitando los picos y bajones que afectan directamente al humor y la energía mental. Un cerebro con glucosa estable es un cerebro que piensa claro y no tiene antojos emocionales.",
    longevity_effect: "Mejora la sensibilidad a la insulina — factor clave en el envejecimiento metabólico. Reduce marcadores inflamatorios. Los polifenoles de la canela protegen contra el estrés oxidativo celular.",
    science_summary: "Rica en cinamaldehído (responsable del aroma) y polifenoles. Actúa como mimético de la insulina, facilitando la captación de glucosa. Prefiere canela de Ceilán (Cinnamomum verum) sobre cassia por menor contenido en cumarina.",
    active_compounds: ["cinamaldehído", "polifenoles", "proantocianidinas"],
    benefits: ["Regulador glucémico", "Antiinflamatorio", "Antioxidante"],
    synergies: [{"ingredient": "avena", "reason": "Canela + fibra soluble = control glucémico doble"}, {"ingredient": "cacao", "reason": "Polifenoles complementarios + sabor hedonista"}],
    evidence_level: "moderado"
  },
  {
    name: "Pimienta negra", slug: "pimienta-negra", tagline: "La llave que abre la puerta a los nutrientes", category: "especia", moods: ["focus", "activacion"],
    mind_effect: "La piperina inhibe la MAO (monoamino oxidasa), la enzima que degrada serotonina y dopamina. Resultado: más neurotransmisores disponibles para el bienestar. Mejora la atención y la velocidad de procesamiento.",
    longevity_effect: "Multiplica la biodisponibilidad de otros nutrientes (curcumina ×2000%, CoQ10, resveratrol). Estimula la termogénesis. Propiedades antioxidantes propias.",
    science_summary: "Contiene piperina como compuesto estrella. Inhibe enzimas hepáticas y intestinales que degradan otros compuestos, aumentando su absorción.",
    active_compounds: ["piperina"],
    benefits: ["Potenciador de absorción", "Neuroprotector", "Termogénico"],
    synergies: [{"ingredient": "curcuma", "reason": "La sinergia más documentada: biodisponibilidad ×2000%"}, {"ingredient": "te-verde", "reason": "Aumenta absorción de catequinas (EGCG)"}],
    evidence_level: "alto"
  },
  {
    name: "Azafrán", slug: "azafran", tagline: "El antidepresivo que nace de una flor", category: "especia", moods: ["calma", "social"],
    mind_effect: "Múltiples ensayos clínicos confirman efecto antidepresivo comparable al fluoxetina (Prozac) en depresión leve-moderada. Actúa sobre serotonina, dopamina y GABA. Reduce la ansiedad y mejora la calidad del sueño.",
    longevity_effect: "La crocina y crocetina son potentes antioxidantes que protegen la retina (degeneración macular) y las neuronas. Efecto cardioprotector.",
    science_summary: "Contiene crocina (color), safranal (aroma) y picrocrocina (sabor). La crocina inhibe la recaptación de serotonina y dopamina de forma natural.",
    active_compounds: ["crocina", "safranal", "picrocrocina", "crocetina"],
    benefits: ["Antidepresivo natural", "Neuroprotector", "Protector ocular"],
    synergies: [{"ingredient": "arroz-integral", "reason": "Plato clásico — risotto con azafrán: comfort + función"}],
    evidence_level: "alto"
  },
  {
    name: "Semillas de sésamo", slug: "semillas-de-sesamo", tagline: "El tesoro de calcio que tu cuerpo agradece", category: "semilla", moods: ["confort", "reset"],
    mind_effect: "Contiene tirosina, precursor de dopamina que estimula la motivación. Interviene de forma indirecta en el sustento del estado de ánimo a través de un remineralización fuerte del cerebro.",
    longevity_effect: "Alta densidad de calcio y fitoestrógenos vegetales que protegen la densidad ósea en el envejecimiento y alivian caídas hormonales severas en menopausia. Aporta sesamina, con potencial antilipídico hepático.",
    science_summary: "Una de las fuentes vegetales de calcio mejor asimiladas. La sesamina interviene en la regulación genética del hígado para quemar grasas y evitar el higado graso.",
    active_compounds: ["sesamina", "calcio", "lignanos", "fitoestrógenos"],
    benefits: ["Salud ósea", "Equilibrio hormonal", "Protección hepática"],
    synergies: [{"ingredient": "garbanzos", "reason": "En hummus, mejora la absorción del hierro en la legumbre"}],
    evidence_level: "alto"
  },
  {
    name: "Semillas de girasol", slug: "semillas-de-girasol", tagline: "Vitamina E para proteger cada célula", category: "semilla", moods: ["focus", "reset"],
    mind_effect: "Ricas en fenilalanina, precursor natural de dopamina para el foco y la agilidad mental. Aportan dosis gigantes de vitaminas B vitales para el metabolismo neuronal rápido.",
    longevity_effect: "Es una bomba antioxidante debido a sus altos niveles de Vitamina E, cortando de raíz la peroxidación lipídica que oxida nuestras células con los años y daña las arterias.",
    science_summary: "Aportan tocoferoles lipofílicos que resguardan la barrera mucosa celular. La sinergia natural con selenio eleva drásticamente las defensas inmunológicas del tejido.",
    active_compounds: ["vitamina E", "selenio", "fenilalanina", "ácido linoleico"],
    benefits: ["Inmunoregulador", "Protector celular lipídico", "Apoyo cognitivo"],
    synergies: [{"ingredient": "aguacate", "reason": "Sinergia lipídica suprema para protección antioxidante del tejido de la piel y mucosas"}],
    evidence_level: "moderado"
  },
  {
    name: "Semillas de calabaza", slug: "semillas-de-calabaza", tagline: "Crujientes guardianas de tu calma", category: "semilla", moods: ["calma", "focus", "reset"],
    mind_effect: "Fuente excepcional de triptófano, precursor directo de la serotonina (bienestar) y melatonina (sueño). El magnesio que contienen relaja el sistema nervioso — es el mineral anti-estrés por excelencia. El zinc participa en la síntesis de GABA, neurotransmisor calmante.",
    longevity_effect: "Ricas en zinc (inmunidad, regeneración celular) y magnesio (protección cardiovascular). Fitoesteroles que reducen colesterol. Antioxidantes que protegen contra el daño celular.",
    science_summary: "Aportan triptófano, magnesio, zinc, hierro, fósforo, vitaminas del grupo B y ácidos grasos insaturados. Los fitoesteroles (β-sitosterol) compiten con el colesterol por la absorción intestinal.",
    active_compounds: ["triptófano", "magnesio", "zinc", "fitoesteroles", "omega-6"],
    benefits: ["Precursor de serotonina", "Relajante muscular", "Inmunidad", "Sueño"],
    synergies: [{"ingredient": "cacao", "reason": "Triptófano + magnesio + teobromina = relax profundo"}, {"ingredient": "avena", "reason": "Fibra + triptófano = liberación sostenida de serotonina"}],
    evidence_level: "alto"
  },
  {
    name: "Semillas de chía", slug: "semillas-de-chia", tagline: "Pequeñas pero poderosas: omega-3 vegetal", category: "semilla", moods: ["focus", "reset", "calma"],
    mind_effect: "Alta concentración de omega-3 (ALA) esencial para la estructura de las membranas neuronales. Los omega-3 reducen la inflamación cerebral asociada a depresión y ansiedad. La fibra soluble (mucílagos) alimenta la microbiota, tu 'segundo cerebro'.",
    longevity_effect: "Ricas en antioxidantes (ácido clorogénico, ácido cafeico, vitaminas C y E). Fuente de proteínas con lisina (aminoácido limitante en cereales). El calcio y zinc contribuyen a la salud ósea e inmunológica.",
    science_summary: "Contienen ~20% de omega-3 (ALA), hasta 35% de fibra (mayoritariamente soluble en forma de mucílagos). Los flavonoides (ácido clorogénico y cafeico) aportan protección antioxidante adicional.",
    active_compounds: ["ALA (omega-3)", "mucílagos", "ácido clorogénico", "ácido cafeico", "quercetina"],
    benefits: ["Omega-3 vegetal", "Prebiótico", "Antioxidante", "Regulador glucémico"],
    synergies: [{"ingredient": "limon", "reason": "Vitamina C protege los omega-3 de la oxidación"}, {"ingredient": "avena", "reason": "Doble fibra = microbiota feliz"}],
    evidence_level: "alto"
  },
  {
    name: "Aguacate", slug: "aguacate", tagline: "Grasa inteligente para un cerebro brillante", category: "fruta", subcategory: "grasa funcional", moods: ["focus", "calma", "confort"],
    mind_effect: "Rico en ácido oleico (70-73% de sus grasas) que forma parte de las membranas neuronales. Aporta vitamina B6, esencial para la síntesis de serotonina y dopamina. El potasio (485mg/100g) equilibra los electrolitos que regulan la señal nerviosa.",
    longevity_effect: "Perfil lipídico excepcional: 85%+ grasas insaturadas. Antioxidantes naturales (β-caroteno, vitaminas C y E). El glutatión — el antioxidante maestro del cuerpo — está presente de forma natural. Protector cardiovascular de primer orden.",
    science_summary: "Composición única entre las frutas: 21-28% lípidos, mayoritariamente monoinsaturados (ácido oleico). Contiene β-caroteno, vitaminas C, E y B6, potasio, magnesio, hierro y fósforo. 6,7g de fibra por 100g.",
    active_compounds: ["ácido oleico", "β-caroteno", "glutatión", "luteína", "vitamina E"],
    benefits: ["Neuroprotector", "Cardioprotector", "Antioxidante", "Saciante"],
    synergies: [{"ingredient": "limon", "reason": "Vitamina C previene oxidación del aguacate + potencia absorción de hierro"}, {"ingredient": "curcuma", "reason": "La grasa del aguacate mejora absorción de curcumina (liposoluble)"}],
    evidence_level: "alto",
    seasonal_months: [1,2,3,4,5,6,7,8,9,10,11,12]
  },
  {
    name: "Kiwi", slug: "kiwi", tagline: "Más vitamina C que la naranja, más fibra que una manzana", category: "fruta", moods: ["activacion", "reset"],
    mind_effect: "Su altísimo aporte de ácido ascórbico modula el centro inflamatorio del estrés crónico, reduciendo letargo mental. Favorece la correcta síntesis de péptidos que controlan tu humor.",
    longevity_effect: "El campeón del tránsito gastrointestinal. La actinidina desdobla proteínas pesadas, aliviando inflamación sistémica por mala digestión de carnes. Espectro antioxidante alto para proteger tu piel y telómeros.",
    science_summary: "Fuente élite de fibra soluble e insoluble, y de actinidina (enzima proteolítica). La vitamina C supera con creces cítricos clásicos, apoyando el control glicémico junto a su escaso IG.",
    active_compounds: ["actinidina", "vitamina C", "fibra prebiótica", "luteína"],
    benefits: ["Superdigestivo natural", "Refuerzo inmune C", "Detox oxidativo"],
    synergies: [{"ingredient": "semillas-de-chia", "reason": "Repara la mucosa gástrica mientras la actinidina trabaja proteínas gástricas"}],
    evidence_level: "alto"
  },
  {
    name: "Limón", slug: "limon", tagline: "El activador universal de nutrientes", category: "fruta", subcategory: "cítrico", moods: ["activacion", "reset"],
    mind_effect: "El olor a aceite esencial de limón modula neuronas parasimpáticas y rebaja cortisol casi al instante. Alcaliniza la digestión desde que lo saboreas, limitando bajones anímicos por distensión abdominal.",
    longevity_effect: "Ácido protector para el hígado y vesícula estimulando la bilis. Previene las placas seniles celulares gracias al ataque libre de radicales por su d-limoneno y vitamina C pura.",
    science_summary: "El ácido cítrico en sinergia con d-limoneno penetra fácil los tejidos. Promueve neogénesis endógena de colágeno vital para capilares y mucosas. Su vitamina C secuestra radicales perjudiciales en plasma.",
    active_compounds: ["vitamina c", "ácido cítrico", "d-limoneno", "hedespiridina"],
    benefits: ["Depurador hepático", "Catalizador del hierro", "Alcalinizador metabólico"],
    synergies: [{"ingredient": "espinaca", "reason": "Vitamina C que multiplica salvajemente la absorción de hierro vegetal (no hemo)"}],
    evidence_level: "alto"
  },
  {
    name: "Cereza", slug: "cereza", tagline: "Melatonina natural para noches profundas", category: "fruta", moods: ["calma", "reset"],
    mind_effect: "Rarísimo manantial directo de melatonina fitogénica, dictando a tu glándula pineal la orden de dormir. Ayuda masivamente al ritmo biológico post-estrés.",
    longevity_effect: "Posee fuertes antocianinas que blindan al sistema vascular contra la presión alta y purgan ácido úrico de articulaciones limitando artritis del envejecimiento.",
    science_summary: "Una de las pocas frutas con trazas fisiológicamente eficaces de melatonina y una carga colosal de cianidinas inhibidoras clave de las ciclooxigenasas que producen dolor e inflamación.",
    active_compounds: ["melatonina", "antocianinas", "cianidinas", "potasio"],
    benefits: ["Inductor del sueño natural", "Reparador de ritmo circadiano", "Analgésico leve"],
    synergies: [{"ingredient": "avena", "reason": "Triptófano matutino preparativo para la asimilación nocturna de melatonina"}],
    evidence_level: "alto"
  },
  {
    name: "Fresa", slug: "fresa", tagline: "Antocianinas rojas que protegen tu memoria", category: "fruta", subcategory: "baya", moods: ["social", "activacion"],
    mind_effect: "Su rico color delata flavonoides poderosos que cruzan hacia la corteza cerebral, enlenteciendo fallos en memoria temporal. Estabiliza el genio combatiendo picotazos de glucosa (muy bajo IG).",
    longevity_effect: "Un biomarcador increíble: la fisetina de la fresa es un compuesto 'senolítico': limpia activamente células muertas (zombis) ralentizando visiblemente el decaimiento de tejidos y la inflamación subyacente.",
    science_summary: "Alberga ácido elágico, fisetina y antocianinas, que secuestran metales pesados en sangre y reducen agresión oxidativa en endotelio, además de destruir células senescentes acumuladas.",
    active_compounds: ["fisetina", "ácido elágico", "antocianinas", "vitamina C"],
    benefits: ["Senolítico estrella", "Potenciador mnemotécnico", "Detox neuronal"],
    synergies: [{"ingredient": "cacao", "reason": "Doble aporte hedonista con epicatequinas potenciando flavonoides al sistema vascular cognitivo"}],
    evidence_level: "moderado"
  },
  {
    name: "Frambuesa", slug: "frambuesa", tagline: "Pequeña fruta, gran poder antiinflamatorio", category: "fruta", subcategory: "baya", moods: ["reset", "calma"],
    mind_effect: "Elevada en raciones de fibra y prebióticos finos, reduce los estados inflamatorios del nervio vago y previene cascadas sintomáticas depresivas nacidas en la distensión del colon.",
    longevity_effect: "Trazas notables de resveratrol y muchísimos compuestos cetónicos ayudan a promover un metabolismo que tiende a quemar las grasas rebeldes asociadas al engrosamiento vascular por edad.",
    science_summary: "Cetónas, quercetina y ácido gálico componen su perfil polifenólico, logrando intervenir en factores neurotróficos e insulino-reguladores simultáneamente con escasísimo contenido de azúcar neto.",
    active_compounds: ["cetonas", "quercetina", "ácido gálico", "vitamina c"],
    benefits: ["Regulador metabólico", "Fibra de lujo", "Protector mitocondrial"],
    synergies: [{"ingredient": "almendra", "reason": "Ácidos grasos y fibra estabilizan cetónicos sin picos endógenos"}],
    evidence_level: "moderado"
  }
];
