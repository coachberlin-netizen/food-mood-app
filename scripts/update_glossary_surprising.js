const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const items = [
  {
    name: "Té verde",
    slug: "te-verde",
    tagline: "L-teanina: Foco sin ansiedad (Ondas Alfa)",
    category: "planta",
    moods: ["activacion"],
    mind_effect: "Contiene L-teanina, un aminoácido que calma la mente sin sedar. Crea un estado de 'alerta tranquila' potenciando las ondas alfa cerebrales (estado de meditación activa).",
    longevity_effect: "Sus catequinas (EGCG) son potentes neuroprotectores que combaten el daño oxidativo neuronal.",
    science_summary: "La L-teanina genera ondas alfa en 30-40 min. En sinergia con la cafeína, mejora la atención sostenida sin los efectos secundarios del nerviosismo.",
    active_compounds: ["L-teanina", "EGCG", "Cafeína"],
    benefits: ["Foco cognitivo", "Reducción de ansiedad", "Neuroprotección"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Romero",
    slug: "romero",
    tagline: "El Nootrópico de Cocina: Memoria y Acetilcolina",
    category: "planta",
    moods: ["activacion"],
    mind_effect: "Su aroma y consumo elevan el rendimiento cognitivo. El ácido rosmarínico inhibe la degradación de la acetilcolina, el neurotransmisor del aprendizaje.",
    longevity_effect: "Potente antiinflamatorio sistémico con afinidad por el tejido nervioso.",
    science_summary: "El ácido rosmarínico bloquea la enzima acetilcolinesterasa, aumentando la disponibilidad de acetilcolina en el cerebro.",
    active_compounds: ["ácido rosmarínico", "eucaliptol"],
    benefits: ["Mejora memoria", "Atención sostenida", "Claridad mental"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Lavanda",
    slug: "lavanda",
    tagline: "Linalool: El GABA natural para la calma activa",
    category: "planta",
    moods: ["equilibrio"],
    mind_effect: "Actúa sobre los receptores GABA del cerebro, produciendo un efecto ansiolítico natural sin sedación excesiva.",
    longevity_effect: "Reduce los niveles de hormonas del estrés, protegiendo el sistema cardiovascular y neuronal.",
    science_summary: "El linalool modula los canales de calcio y los receptores de glutamato/GABA en el SNC.",
    active_compounds: ["linalool", "acetato de linalilo"],
    benefits: ["Ansiolítico natural", "Calma profunda", "Ritual de sueño"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Hibisco",
    slug: "hibisco",
    tagline: "Anti-Cortisol: El protector del sistema nervioso",
    category: "planta",
    moods: ["equilibrio"],
    mind_effect: "Sus antocianinas reducen activamente los niveles de cortisol y la presión arterial, induciendo relajación sistémica.",
    longevity_effect: "Protección cardiovascular y antienvejecimiento celular por su alta carga de bioflavonoides.",
    science_summary: "Contiene ácidos orgánicos y antocianinas que modulan la respuesta al estrés y relajan el músculo liso vascular.",
    active_compounds: ["antocianinas", "quercetina"],
    benefits: ["Reduce cortisol", "Hipotensor natural", "Antioxidante"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Ashwagandha",
    slug: "ashwagandha",
    tagline: "El Adaptógeno Rey: Resiliencia al estrés crónico",
    category: "planta",
    moods: ["equilibrio", "activacion"],
    mind_effect: "Modula el eje HPA para reducir el cortisol crónico. Mejora la energía vital sin sobreestimular el sistema nervioso.",
    longevity_effect: "Mejora la función mitocondrial y reduce el estrés oxidativo tisular.",
    science_summary: "Los withanólidos imitan la acción de los glucocorticoides pero con efecto modulador, equilibrando la respuesta al estrés.",
    active_compounds: ["withanólidos", "withaferina A"],
    benefits: ["Reduce estrés crónico", "Energía sostenida", "Equilibrio hormonal"],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Bergamota",
    slug: "bergamota",
    tagline: "Ansiolítico Mediterráneo: El Citrus de la Calma",
    category: "planta",
    moods: ["equilibrio"],
    mind_effect: "Activa el sistema nervioso parasimpático (modo reposo y digestión) a través del bergapteno y el linalool.",
    longevity_effect: "Mejora el perfil lipídico y reduce la inflamación vascular.",
    science_summary: "Su aceite esencial modula la liberación de dopamina y serotonina en el hipotálamo.",
    active_compounds: ["bergapteno", "limoneno"],
    benefits: ["Ansiolítico", "Activa el vago", "Digestivo emocional"],
    evidence_level: "medio",
    is_premium_detail: true
  },
  {
    name: "Matcha",
    slug: "matcha",
    tagline: "Concentrado de L-teanina y Catequinas",
    category: "planta",
    moods: ["activacion"],
    mind_effect: "Al ser la hoja entera molida, ofrece 3-5 veces más L-teanina que el té verde convencional.",
    longevity_effect: "Tasa de antioxidantes (ORAC) altísima para protección celular total.",
    science_summary: "Rico en clorofila y aminoácidos que potencian la claridad mental prolongada.",
    active_compounds: ["L-teanina", "catequinas"],
    benefits: ["Foco extremo", "抗氧化", "Desintoxicante"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Kefir de agua",
    slug: "kefir-de-agua",
    tagline: "Probiótico Vivo: Serotonina Intestinal",
    category: "probiotico",
    moods: ["equilibrio"],
    mind_effect: "Fabrica serotonina directamente en el intestino a través de la comunicación del eje microbioma-cerebro.",
    longevity_effect: "Refuerza el sistema inmunitario y reduce la neuroinflamación mediada por el intestino.",
    science_summary: "Consorcio de bacterias y levaduras que fermentan azúcares produciendo metabolitos neuroactivos.",
    active_compounds: ["Lactobacillus", "Bifidobacterium"],
    benefits: ["Serotonina intestinal", "Inmunidad", "Salud digestiva"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Polen de abeja",
    slug: "polen-de-abeja",
    tagline: "Multivitamínico Nootrópico Completo",
    category: "superalimento",
    moods: ["activacion"],
    mind_effect: "Contiene todos los precursores de neurotransmisores, incluyendo triptófano y vitaminas del grupo B.",
    longevity_effect: "Refuerza los capilares cerebrales a través de la rutina y protege contra la degeneración cognitiva.",
    science_summary: "Mezcla densa de 22 aminoácidos, enzimas y flavonoides bioactivos.",
    active_compounds: ["triptófano", "rutina", "vitaminas B"],
    benefits: ["Energía cerebral", "Refuerza capilares", "Foco nutricional"],
    evidence_level: "medio",
    is_premium_detail: true
  },
  {
    name: "Aspalathina",
    slug: "aspalathina",
    tagline: "Inhibidor de Cortisol Suprarrenal",
    category: "nutriente",
    moods: ["equilibrio"],
    mind_effect: "Inhibe directamente la producción de cortisol y adrenalina en las glándulas suprarrenales.",
    longevity_effect: "Protección metabólica contra el estrés crónico y control de la glucosa.",
    science_summary: "Flavonoide único del rooibos que actúa como regulador neuroendocrino.",
    active_compounds: ["aspalathina"],
    benefits: ["Reduce cortisol", "Estabiliza el ánimo", "Sin cafeína"],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Lion's Mane",
    slug: "lions-mane",
    tagline: "Melena de León: El Hongo de la Neurogénesis",
    category: "hongo",
    moods: ["activacion"],
    mind_effect: "Estimula el Factor de Crecimiento Nervioso (NGF) y el BDNF, facilitando la creación de nuevas neuronas.",
    longevity_effect: "Mejora la plasticidad cerebral y protege contra enfermedades neurodegenerativas.",
    science_summary: "Sus hericenonas y erinacinas cruzan la barrera hematoencefálica para activar la plasticidad neuronal.",
    active_compounds: ["hericenonas", "erinacinas"],
    benefits: ["Neurogénesis", "Memoria", "Plasticidad"],
    evidence_level: "clínico",
    is_premium_detail: true
  }
];

async function updateGlossary() {
  console.log('Updating expanded botanical glossary...');
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
  console.log('Glossary update finished.');
}

updateGlossary();
