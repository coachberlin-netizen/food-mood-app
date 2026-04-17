const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const items = [
  {
    name: "Tepache",
    slug: "tepache",
    tagline: "Fermentado Azteca: Bromelina y Probióticos",
    category: "bebida",
    moods: ["activacion", "gut-brain"],
    mind_effect: "Proporciona una efervescencia probiótica que comunica directamente con el nervio vago. La bromelina de la piña facilita la liberación de triptófano.",
    longevity_effect: "Potente antiinflamatorio intestinal y regenerador de la microbiota nativa.",
    science_summary: "Bebida fermentada silvestre rica en levaduras y bacterias lácticas. Contiene eugenol y cinamaldehído de las especias de fermentación.",
    active_compounds: ["bromelina", "lactobacillus", "eugenol"],
    benefits: ["Probiótico natural", "Digestión de proteínas", "Salud gut-brain"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Labneh",
    slug: "labneh",
    tagline: "Probiótico Levantino: Triptófano y Memoria",
    category: "probiotico",
    moods: ["focus", "equilibrio"],
    mind_effect: "Queso de yogur fermentado con alta biodisponibilidad de triptófano. Al servirse con aceite de romero, potencia la acetilcolina.",
    longevity_effect: "Aporta bacterias lácticas (L. plantarum) que refuerzan la barrera intestinal y la síntesis de neurotransmisores.",
    science_summary: "Yogur de cabra/oveja drenado, concentrando proteínas, calcio y probióticos nativos.",
    active_compounds: ["triptófano", "L. plantarum", "caseína"],
    benefits: ["Proteína biodisponible", "Salud intestinal", "Foco cognitivo"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Azahar (Neroli)",
    slug: "azahar",
    tagline: "Ansiolítico Mediterráneo: El aroma de la calma",
    category: "planta",
    moods: ["calma", "sueño"],
    mind_effect: "El linalool y el nerol de la flor de naranjo actúan sobre los receptores GABA-A induciendo una calma profunda sin sedación.",
    longevity_effect: "Reduce la hiperactividad del sistema nervioso simpático y mejora la calidad del descanso.",
    science_summary: "Destilado de la flor de Citrus aurantium rico en terpenos ansiolíticos.",
    active_compounds: ["linalool", "nerol", "geraniol"],
    benefits: ["Reduce ansiedad", "Calma profunda", "Ritual nocturno"],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Saúco",
    slug: "sauco",
    tagline: "Rutina y Quercetina: El protector nórdico",
    category: "planta",
    moods: ["calma", "reset"],
    mind_effect: "La rutina refuerza los capilares cerebrales y mejora el flujo sanguíneo. La quercetina proporciona un efecto ansiolítico suave.",
    longevity_effect: "Potente inmunomodulador y protector de la integridad del sistema cardiovascular cerebral.",
    science_summary: "Rico en flavonoides (rutina, quercetina) y ácido clorogénico con propiedades antidepresivas moderadas.",
    active_compounds: ["rutina", "quercetina", "ácido clorogénico"],
    benefits: ["Refuerza capilares cerebrales", "Antioxidante nórdico", "Ansiolítico suave"],
    evidence_level: "medio",
    is_premium_detail: true
  },
  {
    name: "Espirulina",
    slug: "espirulina",
    tagline: "Fenilalanina: Dopamina y Detox Cerebral",
    category: "alga",
    moods: ["activacion", "focus"],
    mind_effect: "Aporta fenilalanina, precursor directo de la dopamina. Su clorofila ayuda a alcalinizar el pH sanguíneo y reducir la inflamación cerebral.",
    longevity_effect: "Rica en B12 vegetal y ficocianina, un potente antioxidante que protege las células de la neurodegeneración.",
    science_summary: "Microalga cianobacteria con el perfil aminoácido más denso del mundo vegetal.",
    active_compounds: ["fenilalanina", "ficocianina", "clorofila"],
    benefits: ["Suministro de dopamina", "Detox cerebral", "Energía celular"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Pasiflora",
    slug: "pasiflora",
    tagline: "Crisina: Máxima afinidad por la calma (GABA)",
    category: "planta",
    moods: ["calma", "sueño"],
    mind_effect: "Contiene crisina, el flavonoide natural con mayor afinidad por los receptores GABA-A. Ideal para desactivar la rumiación nocturna.",
    longevity_effect: "Modula el sistema nervioso autónomo permitiendo una recuperación profunda durante el sueño.",
    science_summary: "Extracto de Passionaria incarnata rico en crisina, vitexina y maltol sedante.",
    active_compounds: ["crisina", "vitexina", "maltol"],
    benefits: ["Desactiva la ansiedad", "Apoyo al sueño profundo", "Relajante SNC"],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Tila",
    slug: "tila",
    tagline: "Farnesol: El ritual de calma universal",
    category: "planta",
    moods: ["calma", "sueño"],
    mind_effect: "Sus aceites volátiles como el farnesol producen una sedación suave del sistema nervioso central.",
    longevity_effect: "El ácido rosmarínico y sus flavonoides actúan como ansiolíticos sistémicos de largo espectro.",
    science_summary: "Infusión de Tilia europaea con propiedades antiespasmódicas y sedantes documentadas.",
    active_compounds: ["farnesol", "ácido rosmarínico", "flavonoides"],
    benefits: ["Sedación suave", "Reduce irritabilidad", "Ritual de descanso"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Apio",
    slug: "apio",
    tagline: "Apigenina: El activador de la neurogénesis",
    category: "verdura",
    moods: ["focus", "activacion"],
    mind_effect: "Contiene apigenina, que estimula el crecimiento de nuevas neuronas en el hipocampo y mejora la conectividad neuronal.",
    longevity_effect: "Potente alcalinizante y regulador de la presión arterial a través de sus ftálidas.",
    science_summary: "Vegetal rico en apigenina, sodio orgánico y fibra prebiótica.",
    active_compounds: ["apigenina", "ftálidas", "luteolina"],
    benefits: ["Estimula neurogénesis", "Claridad mental", "Hidratación celular"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Ghee",
    slug: "ghee",
    tagline: "Ácido Butírico: Nutrición para el cerebro intestinal",
    category: "grasa",
    moods: ["confort", "reset"],
    mind_effect: "Su ácido butírico es el combustible preferido por las células intestinales que fabrican el 95% de la serotonina.",
    longevity_effect: "Rico en vitaminas liposolubles (A, D, E, K2) y CLA, protector de la salud mitocondrial.",
    science_summary: "Mantequilla clarificada libre de caseína y lactosa, rica en ácidos grasos de cadena corta.",
    active_compounds: ["ácido butírico", "CLA", "Vitaminas K2/D/A"],
    benefits: ["Salud de barrera intestinal", "Absorción de nutrientes mood", "Energía estable"],
    evidence_level: "clínico",
    is_premium_detail: true
  },
  {
    name: "Sumac",
    slug: "sumac",
    tagline: "Antioxidante Levantino: Protección Cerebral",
    category: "especia",
    moods: ["focus", "activacion"],
    mind_effect: "Uno de los alimentos con mayor capacidad ORAC del mundo. Protege las funciones cognitivas del daño oxidativo.",
    longevity_effect: "Regula el azúcar en sangre y reduce la neuroinflamación sistémica.",
    science_summary: "Baya molida roja con alta concentración de ácido gálico y antocianinas.",
    active_compounds: ["ácido gálico", "antocianinas", "quercetina"],
    benefits: ["Protección neuronal", "Control glucémico", "Sabor vibrante"],
    evidence_level: "medio",
    is_premium_detail: true
  }
];

async function updateUnexploredGlossary() {
  console.log('Adding 10+ new unexplored botanical entries to glossary...');
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
  console.log('Unexplored Glossary update finished.');
}

updateUnexploredGlossary();
