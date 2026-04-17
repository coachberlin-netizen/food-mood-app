const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const items = [
  {
    name: "Hibisco",
    slug: "hibisco",
    tagline: "El anti-cortisol más hermoso del mundo vegetal",
    category: "planta",
    moods: ["equilibrio", "reset"],
    mind_effect: "Sus antocianinas reducen activamente los niveles de cortisol circulante y la inflamación sistémica, protegiendo las neuronas del estrés oxidativo.",
    longevity_effect: "Protección cardiovascular y regulación del azúcar en sangre a través del ácido hibísico, evitando picos emocionales.",
    science_summary: "Rico en antocianinas (delfinidina, cianidina) y quercetina. Contiene más vitamina C que una naranja, cofactor clave para la síntesis de dopamina.",
    active_compounds: ["antocianinas", "ácido hibísico", "vitamina C", "quercetina"],
    benefits: [
      "Reduce el cortisol circulante",
      "Regula la presión arterial en minutos",
      "Estabilidad emocional sin picos glucémicos"
    ],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Ashwagandha",
    slug: "ashwagandha",
    tagline: "El adaptógeno del siglo XXI (extracto KSM-66)",
    category: "planta",
    moods: ["equilibrio", "activacion", "resiliencia"],
    mind_effect: "Modula directamente el eje HPA (hipotálamo-hipófisis-suprarrenal). Reduce el cortisol sérico hasta un 27.9% y mejora la calidad del sueño profundo.",
    longevity_effect: "Efecto neuroprotector que inhibe la degeneración de neuronas colinérgicas y reduce la inflamación sistémica.",
    science_summary: "Contiene withanólidos (KSM-66 estándar: 5%) y sitoindósidos. Mejora la respuesta al estrés sin estimular el sistema nervioso.",
    active_compounds: ["withanólidos", "sitoindósidos", "alcaloides de withanía"],
    benefits: [
      "Reducción de cortisol (-27.9%)",
      "Mejora de memoria y atención en 8 semanas",
      "Aumento de resiliencia al estrés crónico"
    ],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Azafrán",
    slug: "azafran",
    tagline: "El antidepresivo natural más potente del mundo",
    category: "especia",
    moods: ["serotonina", "dopamina", "felicidad"],
    mind_effect: "Equivalente clínico a 20mg de fluoxetina (Prozac) para depresión leve-moderada. Actúa como inhibidor natural de la recaptación de serotonina y dopamina.",
    longevity_effect: "La crocina protege las neuronas del daño oxidativo y del beta-amiloide (asociado al Alzheimer).",
    science_summary: "Contiene safranal (ISRS natural), crocina (neuroprotector), picrocrocina y kaempferol (ansiolítico). Atraviesa la barrera hematoencefálica.",
    active_compounds: ["safranal", "crocina", "picrocrocina", "kaempferol"],
    benefits: [
      "Antidepresivo natural clínicamente probado",
      "Aumenta la disponibilidad de serotonina",
      "Protección neuronal profunda"
    ],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Lion's Mane",
    slug: "lions-mane",
    tagline: "El hongo que hace crecer nuevas neuronas (BDNF/NGF)",
    category: "hongo",
    moods: ["activacion", "memoria", "focus_profundo"],
    mind_effect: "Único alimento documentado que estimula la producción de NGF (Factor de Crecimiento Nervioso) y BDNF. Potencia la neuroplasticidad y claridad mental.",
    longevity_effect: "Facilita la regeneración de fibras nerviosas y protege contra enfermedades neurodegenerativas.",
    science_summary: "Contiene hericionas (cruzan la barrera hematoencefálica) y erinacinas que activan la plasticidad neuronal.",
    active_compounds: ["hericionas", "erinacinas", "beta-glucanos"],
    benefits: [
      "Estimula el crecimiento de nuevas neuronas",
      "Mejora la memoria y velocidad de procesamiento",
      "Potencia la concentración y el aprendizaje"
    ],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Reishi",
    slug: "reishi",
    tagline: "El hongo de la longevidad y la calma profunda",
    category: "hongo",
    moods: ["equilibrio", "calma_profunda", "reset"],
    mind_effect: "Adaptógeno que calma, regula y protege. Contiene adenosina que activa los receptores de calma del sistema nervioso central.",
    longevity_effect: "Considerada la 'hierba de la inmortalidad' con más de 400 moléculas bioactivas que modulan la inmunidad y reducen la inflamación.",
    science_summary: "Rico en triterpenos (ácidos ganodéricos) con efecto ansiolítico natural y beta-glucanos inmunomoduladores.",
    active_compounds: ["triterpenos", "ácidos ganodéricos", "adenosina"],
    benefits: [
      "Induce una calma mental profunda",
      "Modula la respuesta inmunitaria",
      "Protección contra el estrés oxidativo tisular"
    ],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Bergamota",
    slug: "bergamota",
    tagline: "El Citrus Ansiolítico: Amplificador bioactivo",
    category: "planta",
    moods: ["equilibrio", "parasimpatico", "calma"],
    mind_effect: "Activa el sistema nervioso parasimpático a través del bergapteno. Reduce la ansiedad y mejora el humor activando la neurogénesis en el hipocampo.",
    longevity_effect: "Inhibe la enzima CYP3A4, potenciando la absorción de otros compuestos bioactivos como azafrán o curcumina.",
    science_summary: "Contiene bergapteno, linalool (GABA-like), naringenina (antidepresivo) y nobiletina (memoria espacial).",
    active_compounds: ["bergapteno", "linalool", "naringenina", "nobiletina"],
    benefits: [
      "Activa el modo 'reposo y digestión'",
      "Ansiolítico natural de alta potencia",
      "Amplificador de otros nutrientes mood"
    ],
    evidence_level: "medio",
    is_premium_detail: true
  },
  {
    name: "Rooibos",
    slug: "rooibos",
    tagline: "El desactivador de las glándulas de estrés (Aspalathina)",
    category: "planta",
    moods: ["equilibrio", "sin_cafeina", "reset"],
    mind_effect: "Contiene aspalathina, el único flavonoide que inhibe directamente la secreción de cortisol y adrenalina en las glándulas suprarrenales.",
    longevity_effect: "Contiene Superóxido Dismutasa (SOD), una enzima antioxidante clave que protege las neuronas del daño oxidativo.",
    science_summary: "Rico en aspalathina, notofagina y crisina (GABAérgica). Sin cafeína ni teína, ideal para regular el ánimo vespertino.",
    active_compounds: ["aspalathina", "notofagina", "crisina", "SOD"],
    benefits: [
      "Inhibe la producción física de cortisol",
      "Regula el sistema nervioso sin sedación",
      "Prepara el cuerpo para un sueño reparador"
    ],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Guaraná",
    slug: "guarana",
    tagline: "Energía Sostenida: Cafeína sin bajón",
    category: "planta",
    moods: ["activacion", "energia"],
    mind_effect: "Mayor concentración de cafeína natural (guaranina) pero encapsulada en taninos que ralentizan su liberación, evitando picos de ansiedad.",
    longevity_effect: "Rico en procianidinas, antioxidantes 10-50 veces más potentes que la vitamina E para protección neuronal.",
    science_summary: "Matriz compleja de cafeína, teobromina, teofilina y taninos que proporcionan 4-6 horas de energía 'limpia'.",
    active_compounds: ["guaranina", "teobromina", "teofilina", "taninos"],
    benefits: [
      "Energía mental duradera (4-6 horas)",
      "Sin nerviosismo ni efecto rebote",
      "Aumento de la resistencia cognitiva"
    ],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Kéfir",
    slug: "kefir",
    tagline: "El probiótico vivo que fabrica serotonina intestinal",
    category: "probiotico",
    moods: ["equilibrio", "gut-brain", "serotonina"],
    mind_effect: "Comunidad de 30-56 cepas que producen serotonina (95% se fabrica en el intestino), oxitocina y GABA directamente en el tracto digestivo.",
    longevity_effect: "Reduce los niveles de cortisol sistémico y modula los receptores GABA periféricos a través del nervio vago.",
    science_summary: "Rico en Lactobacillus reuteri (serotonina + oxitocina), Bifidobacterium longum y Vitaminas del grupo B/K2.",
    active_compounds: ["L. reuteri", "L. rhamnosus", "B. longum", "Kefiran"],
    benefits: [
      "Producción directa de neurotransmisores",
      "Mejora la empatía y reduce la ansiedad social",
      "Salud total del eje intestino-cerebro"
    ],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Maca",
    slug: "maca",
    tagline: "Adaptógeno Andino: Energía y Sistema Endocannabinoide",
    category: "planta",
    moods: ["energia", "activacion", "equilibrio_hormonal"],
    mind_effect: "Modula el sistema endocannabinoide a través de macamidas únicas, generando bienestar y resistencia a la fatiga sin psicoactividad.",
    longevity_effect: "Regula el eje HPA y la función tiroidea (yodo natural), proporcionando estabilidad energética y térmica.",
    science_summary: "Contiene macamidas, macaridinas y glucosinolatos. Rica en zinc y hierro biodisponible para la síntesis de neurotransmisores.",
    active_compounds: ["macamidas", "macaridinas", "glucosinolatos", "zinc"],
    benefits: [
      "Aumenta la energía y reduce la fatiga crónica",
      "Regula el equilibrio hormonal y la libido",
      "Mejora el estado de ánimo (estudios postmenopausia)"
    ],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Cacao Raw",
    slug: "cacao-raw",
    tagline: "Anandamida: La molécula del bienestar y el amor",
    category: "superalimento",
    moods: ["placer", "serotonina", "dopamina"],
    mind_effect: "Conserva la anandamida (el endocannabinoide natural del cuerpo) y la feniletilamina (PEA), la molécula que se libera al enamorarse.",
    longevity_effect: "Fuente vegetal con mayor concentración de magnesio y flavanoles neuroprotectores para la salud vascular cerebral.",
    science_summary: "Rico en teobromina (vasodilatador), triptófano y epicatequina. 20 veces más antioxidantes que el arándano.",
    active_compounds: ["anandamida", "teobromina", "PEA", "magnesio"],
    benefits: [
      "Euforia natural y bienestar inmediato",
      "Relajación muscular y síntesis de serotonina",
      "Mejora el flujo sanguíneo cerebral"
    ],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Agua de rosas",
    slug: "agua-de-rosas",
    tagline: "Geraniol: El ansiolítico líquido ancestral",
    category: "destilado",
    moods: ["calma", "GABA", "ansiolitico"],
    mind_effect: "El geraniol se une a los receptores GABA-A del sistema nervioso central produciendo calma profunda sin sedación.",
    longevity_effect: "Reduce la hiperactividad del sistema nervioso simpático a través de terpenos como el citronelol y el nerol.",
    science_summary: "Destilado rico en geraniol, citronelol y eugenol (calma paradójica). Activo tanto por vía digestiva como olfativa.",
    active_compounds: ["geraniol", "citronelol", "nerol", "eugenol"],
    benefits: [
      "Calma instantánea del sistema nervioso",
      "Reducción de irritabilidad e insomnio",
      "Preparador del sistema nervioso para digestión"
    ],
    evidence_level: "medio",
    is_premium_detail: true
  }
];

async function updateMasterGlossary() {
  console.log('Replacing glossary with definitive high-density scientific content...');
  for (const item of items) {
    const { error } = await supabase
      .from('glossary')
      .upsert(item, { onConflict: 'slug' });
    
    if (error) {
       console.error(`Error updating ${item.name}:`, error);
    } else {
       console.log(`Success: ${item.name}`);
    }
  }
  console.log('Master Glossary upgrade finished.');
}

updateMasterGlossary();
