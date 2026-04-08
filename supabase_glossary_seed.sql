-- ==========================================
-- CREACIÓN DE TABLA Y CONFIGURACIÓN INICIAL
-- ==========================================

-- Tabla Base
CREATE TABLE IF NOT EXISTS public.glossary (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    tagline text,
    category text,
    subcategory text,
    moods jsonb,
    image_url text,
    mind_effect text,
    longevity_effect text,
    science_summary text,
    active_compounds jsonb,
    benefits jsonb,
    synergies jsonb,
    food_mood_recipes jsonb,
    evidence_level text,
    studies jsonb,
    nutrition_facts jsonb,
    seasonal_months jsonb,
    is_premium_detail boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_glossary_slug ON public.glossary (slug);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON public.glossary (category);
CREATE INDEX IF NOT EXISTS idx_glossary_moods ON public.glossary USING GIN (moods);

-- Row Level Security (RLS)
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'glossary' AND policyname = 'Public profiles are viewable by everyone.'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON public.glossary FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'glossary' AND policyname = 'Only service_role can modify glossary'
    ) THEN
        CREATE POLICY "Only service_role can modify glossary" ON public.glossary FOR ALL USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- ==========================================
-- INSERCIÓN DE DATOS (55+ Ingredientes)
-- ==========================================

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Cúrcuma',
    'curcuma',
    'El oro que protege tu cerebro',
    'especia',
    NULL,
    '["focus","reset","calma"]'::jsonb,
    'La curcumina atraviesa la barrera hematoencefálica y actúa directamente sobre el cerebro. Modula neurotransmisores como la serotonina y la dopamina, mejorando el estado de ánimo. Estudios sugieren efectos comparables a antidepresivos en depresión leve. Reduce la neuroinflamación asociada a la niebla mental.',
    'Potente antiinflamatorio y antioxidante. Protege contra el deterioro cognitivo asociado a la edad. Inhibe la agregación de proteínas amiloides (vinculadas al Alzheimer). Favorece la regeneración neuronal (BDNF).',
    'Contiene curcuminoides, principalmente curcumina. Su biodisponibilidad es baja por sí sola pero aumenta hasta un 2000% combinada con piperina (pimienta negra). Es un inhibidor de COX-2 y NF-κB, dos vías centrales de la inflamación crónica.',
    '["curcumina","demetoxicurcumina","bisdemetoxicurcumina"]'::jsonb,
    '["Antiinflamatorio","Neuroprotector","Antioxidante","Antidepresivo natural"]'::jsonb,
    '[{"ingredient":"pimienta-negra","reason":"La piperina aumenta la biodisponibilidad de la curcumina hasta un 2000%"},{"ingredient":"aceite-de-oliva","reason":"La curcumina es liposoluble — las grasas mejoran su absorción"},{"ingredient":"jengibre","reason":"Potencia sinérgica antiinflamatoria (ambos inhiben COX-2)"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Jengibre',
    'jengibre',
    'El fuego que despierta tu digestión',
    'especia',
    NULL,
    '["activacion","reset"]'::jsonb,
    'Activa la circulación cerebral, mejorando la alerta y la concentración. Su efecto antiemético reduce la ansiedad asociada a molestias digestivas. Contiene compuestos que modulan la serotonina intestinal — recuerda que el 90% de la serotonina se produce en el intestino.',
    'Potente antiinflamatorio — los gingeroles inhiben las mismas vías que la curcumina (COX-2, NF-κB). Protector cardiovascular: reduce LDL oxidado y mejora la circulación. Efecto termogénico que activa el metabolismo.',
    'Contiene gingeroles (frescos) y shogaoles (seco/cocido). Los shogaoles tienen mayor potencia antioxidante. Rico en terpenos que contribuyen a la protección celular contra radicales libres.',
    '["gingerol","shogaol","zingerona","terpenos"]'::jsonb,
    '["Antiinflamatorio","Digestivo","Termogénico","Antiemético"]'::jsonb,
    '[{"ingredient":"curcuma","reason":"Doble bloqueo antiinflamatorio COX-2"},{"ingredient":"limon","reason":"Vitamina C + gingeroles = absorción mutua y defensa inmune"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Canela',
    'canela',
    'Dulzura que estabiliza tu energía',
    'especia',
    NULL,
    '["confort","calma","activacion"]'::jsonb,
    'Estabiliza los niveles de glucosa en sangre, evitando los picos y bajones que afectan directamente al humor y la energía mental. Un cerebro con glucosa estable es un cerebro que piensa claro y no tiene antojos emocionales.',
    'Mejora la sensibilidad a la insulina — factor clave en el envejecimiento metabólico. Reduce marcadores inflamatorios. Los polifenoles de la canela protegen contra el estrés oxidativo celular.',
    'Rica en cinamaldehído (responsable del aroma) y polifenoles. Actúa como mimético de la insulina, facilitando la captación de glucosa. Prefiere canela de Ceilán (Cinnamomum verum) sobre cassia por menor contenido en cumarina.',
    '["cinamaldehído","polifenoles","proantocianidinas"]'::jsonb,
    '["Regulador glucémico","Antiinflamatorio","Antioxidante"]'::jsonb,
    '[{"ingredient":"avena","reason":"Canela + fibra soluble = control glucémico doble"},{"ingredient":"cacao","reason":"Polifenoles complementarios + sabor hedonista"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Pimienta negra',
    'pimienta-negra',
    'La llave que abre la puerta a los nutrientes',
    'especia',
    NULL,
    '["focus","activacion"]'::jsonb,
    'La piperina inhibe la MAO (monoamino oxidasa), la enzima que degrada serotonina y dopamina. Resultado: más neurotransmisores disponibles para el bienestar. Mejora la atención y la velocidad de procesamiento.',
    'Multiplica la biodisponibilidad de otros nutrientes (curcumina ×2000%, CoQ10, resveratrol). Estimula la termogénesis. Propiedades antioxidantes propias.',
    'Contiene piperina como compuesto estrella. Inhibe enzimas hepáticas y intestinales que degradan otros compuestos, aumentando su absorción.',
    '["piperina"]'::jsonb,
    '["Potenciador de absorción","Neuroprotector","Termogénico"]'::jsonb,
    '[{"ingredient":"curcuma","reason":"La sinergia más documentada: biodisponibilidad ×2000%"},{"ingredient":"te-verde","reason":"Aumenta absorción de catequinas (EGCG)"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Azafrán',
    'azafran',
    'El antidepresivo que nace de una flor',
    'especia',
    NULL,
    '["calma","social"]'::jsonb,
    'Múltiples ensayos clínicos confirman efecto antidepresivo comparable al fluoxetina (Prozac) en depresión leve-moderada. Actúa sobre serotonina, dopamina y GABA. Reduce la ansiedad y mejora la calidad del sueño.',
    'La crocina y crocetina son potentes antioxidantes que protegen la retina (degeneración macular) y las neuronas. Efecto cardioprotector.',
    'Contiene crocina (color), safranal (aroma) y picrocrocina (sabor). La crocina inhibe la recaptación de serotonina y dopamina de forma natural.',
    '["crocina","safranal","picrocrocina","crocetina"]'::jsonb,
    '["Antidepresivo natural","Neuroprotector","Protector ocular"]'::jsonb,
    '[{"ingredient":"arroz-integral","reason":"Plato clásico — risotto con azafrán: comfort + función"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Semillas de sésamo',
    'semillas-de-sesamo',
    'El tesoro de calcio que tu cuerpo agradece',
    'semilla',
    NULL,
    '["confort","reset"]'::jsonb,
    'Contiene tirosina, precursor de dopamina que estimula la motivación. Interviene de forma indirecta en el sustento del estado de ánimo a través de un remineralización fuerte del cerebro.',
    'Alta densidad de calcio y fitoestrógenos vegetales que protegen la densidad ósea en el envejecimiento y alivian caídas hormonales severas en menopausia. Aporta sesamina, con potencial antilipídico hepático.',
    'Una de las fuentes vegetales de calcio mejor asimiladas. La sesamina interviene en la regulación genética del hígado para quemar grasas y evitar el higado graso.',
    '["sesamina","calcio","lignanos","fitoestrógenos"]'::jsonb,
    '["Salud ósea","Equilibrio hormonal","Protección hepática"]'::jsonb,
    '[{"ingredient":"garbanzos","reason":"En hummus, mejora la absorción del hierro en la legumbre"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Semillas de girasol',
    'semillas-de-girasol',
    'Vitamina E para proteger cada célula',
    'semilla',
    NULL,
    '["focus","reset"]'::jsonb,
    'Ricas en fenilalanina, precursor natural de dopamina para el foco y la agilidad mental. Aportan dosis gigantes de vitaminas B vitales para el metabolismo neuronal rápido.',
    'Es una bomba antioxidante debido a sus altos niveles de Vitamina E, cortando de raíz la peroxidación lipídica que oxida nuestras células con los años y daña las arterias.',
    'Aportan tocoferoles lipofílicos que resguardan la barrera mucosa celular. La sinergia natural con selenio eleva drásticamente las defensas inmunológicas del tejido.',
    '["vitamina E","selenio","fenilalanina","ácido linoleico"]'::jsonb,
    '["Inmunoregulador","Protector celular lipídico","Apoyo cognitivo"]'::jsonb,
    '[{"ingredient":"aguacate","reason":"Sinergia lipídica suprema para protección antioxidante del tejido de la piel y mucosas"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Semillas de calabaza',
    'semillas-de-calabaza',
    'Crujientes guardianas de tu calma',
    'semilla',
    NULL,
    '["calma","focus","reset"]'::jsonb,
    'Fuente excepcional de triptófano, precursor directo de la serotonina (bienestar) y melatonina (sueño). El magnesio que contienen relaja el sistema nervioso — es el mineral anti-estrés por excelencia. El zinc participa en la síntesis de GABA, neurotransmisor calmante.',
    'Ricas en zinc (inmunidad, regeneración celular) y magnesio (protección cardiovascular). Fitoesteroles que reducen colesterol. Antioxidantes que protegen contra el daño celular.',
    'Aportan triptófano, magnesio, zinc, hierro, fósforo, vitaminas del grupo B y ácidos grasos insaturados. Los fitoesteroles (β-sitosterol) compiten con el colesterol por la absorción intestinal.',
    '["triptófano","magnesio","zinc","fitoesteroles","omega-6"]'::jsonb,
    '["Precursor de serotonina","Relajante muscular","Inmunidad","Sueño"]'::jsonb,
    '[{"ingredient":"cacao","reason":"Triptófano + magnesio + teobromina = relax profundo"},{"ingredient":"avena","reason":"Fibra + triptófano = liberación sostenida de serotonina"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Semillas de chía',
    'semillas-de-chia',
    'Pequeñas pero poderosas: omega-3 vegetal',
    'semilla',
    NULL,
    '["focus","reset","calma"]'::jsonb,
    'Alta concentración de omega-3 (ALA) esencial para la estructura de las membranas neuronales. Los omega-3 reducen la inflamación cerebral asociada a depresión y ansiedad. La fibra soluble (mucílagos) alimenta la microbiota, tu ''segundo cerebro''.',
    'Ricas en antioxidantes (ácido clorogénico, ácido cafeico, vitaminas C y E). Fuente de proteínas con lisina (aminoácido limitante en cereales). El calcio y zinc contribuyen a la salud ósea e inmunológica.',
    'Contienen ~20% de omega-3 (ALA), hasta 35% de fibra (mayoritariamente soluble en forma de mucílagos). Los flavonoides (ácido clorogénico y cafeico) aportan protección antioxidante adicional.',
    '["ALA (omega-3)","mucílagos","ácido clorogénico","ácido cafeico","quercetina"]'::jsonb,
    '["Omega-3 vegetal","Prebiótico","Antioxidante","Regulador glucémico"]'::jsonb,
    '[{"ingredient":"limon","reason":"Vitamina C protege los omega-3 de la oxidación"},{"ingredient":"avena","reason":"Doble fibra = microbiota feliz"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Aguacate',
    'aguacate',
    'Grasa inteligente para un cerebro brillante',
    'fruta',
    'grasa funcional',
    '["focus","calma","confort"]'::jsonb,
    'Rico en ácido oleico (70-73% de sus grasas) que forma parte de las membranas neuronales. Aporta vitamina B6, esencial para la síntesis de serotonina y dopamina. El potasio (485mg/100g) equilibra los electrolitos que regulan la señal nerviosa.',
    'Perfil lipídico excepcional: 85%+ grasas insaturadas. Antioxidantes naturales (β-caroteno, vitaminas C y E). El glutatión — el antioxidante maestro del cuerpo — está presente de forma natural. Protector cardiovascular de primer orden.',
    'Composición única entre las frutas: 21-28% lípidos, mayoritariamente monoinsaturados (ácido oleico). Contiene β-caroteno, vitaminas C, E y B6, potasio, magnesio, hierro y fósforo. 6,7g de fibra por 100g.',
    '["ácido oleico","β-caroteno","glutatión","luteína","vitamina E"]'::jsonb,
    '["Neuroprotector","Cardioprotector","Antioxidante","Saciante"]'::jsonb,
    '[{"ingredient":"limon","reason":"Vitamina C previene oxidación del aguacate + potencia absorción de hierro"},{"ingredient":"curcuma","reason":"La grasa del aguacate mejora absorción de curcumina (liposoluble)"}]'::jsonb,
    'alto',
    '[1,2,3,4,5,6,7,8,9,10,11,12]'::jsonb
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Kiwi',
    'kiwi',
    'Más vitamina C que la naranja, más fibra que una manzana',
    'fruta',
    NULL,
    '["activacion","reset"]'::jsonb,
    'Su altísimo aporte de ácido ascórbico modula el centro inflamatorio del estrés crónico, reduciendo letargo mental. Favorece la correcta síntesis de péptidos que controlan tu humor.',
    'El campeón del tránsito gastrointestinal. La actinidina desdobla proteínas pesadas, aliviando inflamación sistémica por mala digestión de carnes. Espectro antioxidante alto para proteger tu piel y telómeros.',
    'Fuente élite de fibra soluble e insoluble, y de actinidina (enzima proteolítica). La vitamina C supera con creces cítricos clásicos, apoyando el control glicémico junto a su escaso IG.',
    '["actinidina","vitamina C","fibra prebiótica","luteína"]'::jsonb,
    '["Superdigestivo natural","Refuerzo inmune C","Detox oxidativo"]'::jsonb,
    '[{"ingredient":"semillas-de-chia","reason":"Repara la mucosa gástrica mientras la actinidina trabaja proteínas gástricas"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Limón',
    'limon',
    'El activador universal de nutrientes',
    'fruta',
    'cítrico',
    '["activacion","reset"]'::jsonb,
    'El olor a aceite esencial de limón modula neuronas parasimpáticas y rebaja cortisol casi al instante. Alcaliniza la digestión desde que lo saboreas, limitando bajones anímicos por distensión abdominal.',
    'Ácido protector para el hígado y vesícula estimulando la bilis. Previene las placas seniles celulares gracias al ataque libre de radicales por su d-limoneno y vitamina C pura.',
    'El ácido cítrico en sinergia con d-limoneno penetra fácil los tejidos. Promueve neogénesis endógena de colágeno vital para capilares y mucosas. Su vitamina C secuestra radicales perjudiciales en plasma.',
    '["vitamina c","ácido cítrico","d-limoneno","hedespiridina"]'::jsonb,
    '["Depurador hepático","Catalizador del hierro","Alcalinizador metabólico"]'::jsonb,
    '[{"ingredient":"espinaca","reason":"Vitamina C que multiplica salvajemente la absorción de hierro vegetal (no hemo)"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Cereza',
    'cereza',
    'Melatonina natural para noches profundas',
    'fruta',
    NULL,
    '["calma","reset"]'::jsonb,
    'Rarísimo manantial directo de melatonina fitogénica, dictando a tu glándula pineal la orden de dormir. Ayuda masivamente al ritmo biológico post-estrés.',
    'Posee fuertes antocianinas que blindan al sistema vascular contra la presión alta y purgan ácido úrico de articulaciones limitando artritis del envejecimiento.',
    'Una de las pocas frutas con trazas fisiológicamente eficaces de melatonina y una carga colosal de cianidinas inhibidoras clave de las ciclooxigenasas que producen dolor e inflamación.',
    '["melatonina","antocianinas","cianidinas","potasio"]'::jsonb,
    '["Inductor del sueño natural","Reparador de ritmo circadiano","Analgésico leve"]'::jsonb,
    '[{"ingredient":"avena","reason":"Triptófano matutino preparativo para la asimilación nocturna de melatonina"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Fresa',
    'fresa',
    'Antocianinas rojas que protegen tu memoria',
    'fruta',
    'baya',
    '["social","activacion"]'::jsonb,
    'Su rico color delata flavonoides poderosos que cruzan hacia la corteza cerebral, enlenteciendo fallos en memoria temporal. Estabiliza el genio combatiendo picotazos de glucosa (muy bajo IG).',
    'Un biomarcador increíble: la fisetina de la fresa es un compuesto ''senolítico'': limpia activamente células muertas (zombis) ralentizando visiblemente el decaimiento de tejidos y la inflamación subyacente.',
    'Alberga ácido elágico, fisetina y antocianinas, que secuestran metales pesados en sangre y reducen agresión oxidativa en endotelio, además de destruir células senescentes acumuladas.',
    '["fisetina","ácido elágico","antocianinas","vitamina C"]'::jsonb,
    '["Senolítico estrella","Potenciador mnemotécnico","Detox neuronal"]'::jsonb,
    '[{"ingredient":"cacao","reason":"Doble aporte hedonista con epicatequinas potenciando flavonoides al sistema vascular cognitivo"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Frambuesa',
    'frambuesa',
    'Pequeña fruta, gran poder antiinflamatorio',
    'fruta',
    'baya',
    '["reset","calma"]'::jsonb,
    'Elevada en raciones de fibra y prebióticos finos, reduce los estados inflamatorios del nervio vago y previene cascadas sintomáticas depresivas nacidas en la distensión del colon.',
    'Trazas notables de resveratrol y muchísimos compuestos cetónicos ayudan a promover un metabolismo que tiende a quemar las grasas rebeldes asociadas al engrosamiento vascular por edad.',
    'Cetónas, quercetina y ácido gálico componen su perfil polifenólico, logrando intervenir en factores neurotróficos e insulino-reguladores simultáneamente con escasísimo contenido de azúcar neto.',
    '["cetonas","quercetina","ácido gálico","vitamina c"]'::jsonb,
    '["Regulador metabólico","Fibra de lujo","Protector mitocondrial"]'::jsonb,
    '[{"ingredient":"almendra","reason":"Ácidos grasos y fibra estabilizan cetónicos sin picos endógenos"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Uva',
    'uva',
    'Resveratrol: el secreto de la longevidad mediterránea',
    'fruta',
    NULL,
    '["social","confort"]'::jsonb,
    'Mejora el flujo vascular cerebral ayudando a barrer subproductos de desperdicio mientras duermes y previene las lagunas mentales por agotamiento de oxígeno en el lóbulo frontal.',
    'Su piel guarda el famoso resveratrol, compuesto clave que imita los efectos fisiológicos benéficos del ayuno calórico: hiperactivando las sirtuinas, guardianes de la edad genética, protegiendo al ADN celular.',
    'Cargada de resveratrol y proantocianidinas. Estos activadores enzimáticos promueven un efecto mimético contra la senescencia y blinden el colágeno contra los radicales libres de radiación solar.',
    '["resveratrol","proantocianidinas oligoméricas","quercetina"]'::jsonb,
    '["Activador de sirtuinas","Vaso-neuroprotector","Soporte vascular"]'::jsonb,
    '[{"ingredient":"nuez","reason":"Sinergia en polifenoles que detienen la oxidación del colesterol LDL en placa"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Piña',
    'pina',
    'Bromelina: digestión y desinflamación en cada bocado',
    'fruta',
    NULL,
    '["reset","activacion"]'::jsonb,
    'Ayuda colosal a disolver pesadeces en el estómago gracias a sus enzimas únicas, permitiendo a tu intestino no secuestrar tanta sangre de tu cerebro ni drenar tu humor después del esfuerzo.',
    'La bromelina tiene aplicaciones serias rebajando factores pro-inflamatorios post-sesiones y disolviendo tejido coagulante vascular; previene la aterosclerosis de forma muy proactiva.',
    'Posee trazas inmensas de Bromelina, un conjunto extrañamente resiliente de endopeptidasas que rompen enlaces peptídicos de proteínas y disuelven membranas alérgenas y patógenas, bajando la inmunoreacción severa.',
    '["bromelina","manganeso","vitamina C"]'::jsonb,
    '["Enzima digestiva maestra","Anti-edematoso natural","Revitalizante"]'::jsonb,
    '[{"ingredient":"jengibre","reason":"La enzima bromelina y bloqueantes COX-2 de jengibre sofocan la inflamación sistémica"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Mandarina',
    'mandarina',
    'Hesperidina para tu circulación y tu calma',
    'fruta',
    'cítrico',
    '["confort","calma"]'::jsonb,
    'Aromaterapia al instante, su aceite de corteza relaja tu hiperactividad cortisólica. Modula neurotransmisores inhibitorios por su aporte vitamínico suave sin grandes picos glucémicos.',
    'La hesperidina defiende brutalmente tus capilares de micro-roturas, asegurando un aporte sanguíneo longevo a cada rincón periférico. Retrasa la fragilidad ocular venosa.',
    'Alto en flavonoides rutinosos, especialmente hesperidina (muy cardioprotectora). Reduce marcadores circulantes reactivos estimulando la fase II de vías depurantes empáticas.',
    '["hesperidina","beta-criptoxantina","vitamina C","limoneno"]'::jsonb,
    '["Vaso-tónico natural","Relajante olfativo","Micro-protector"]'::jsonb,
    '[{"ingredient":"cacao","reason":"Hesperidina y flavanoles incrementan sinergicamente capilaridad en materia blanca"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Ciruela',
    'ciruela',
    'El tránsito intestinal es salud cerebral',
    'fruta',
    NULL,
    '["reset"]'::jsonb,
    'Un colon bloqueado recicla hormonas dañinas de estrés hacia la sangre, causando fatiga anímica (mala luna). Desatascando el circuito, revierte rápidamente depresiones sutiles en la microbiota.',
    'Inhibe sorprendentemente la pérdida de masa ósea femenina post-menopausia bajando el factor IGF desregulado. Acelera detoxificación del ácido úrico evitando desgastes.',
    'Rica en Sorbitol y ácido Clorogénico que operan con isatina induciendo un flujo de líquido endógeno muy higiénico al lúmen del colon regulando el factor Vago rápidamente.',
    '["sorbitol","ácido clorogénico","isatina","vitamina k","boro"]'::jsonb,
    '["Detoxificante digestivo","Regulador hormonal e intestinal","Osteo-salud"]'::jsonb,
    '[{"ingredient":"avena","reason":"La fusión insoluble (ciruela) y soluble (avena) repara paredes del colon"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Tomate',
    'tomate',
    'Licopeno rojo que protege tu corazón',
    'verdura',
    NULL,
    '["social","activacion"]'::jsonb,
    'Ayuda a mantener estables receptores clave mediante la reducción del daño provocado por oxidación celular cerebral crónica producto de contaminación, sosteniendo frescura decisional.',
    'El rey absoluto neutralizando oxígenos singletes gracias al potente licopeno (especialmente si cocinado). Defiende tenazmente la próstata y ralentiza des-cristalización de paredes arteriales por infarto oxidativo.',
    'Su base es licopeno y fitoeno. En combinación cálida y lipídica cambia la molécula isomerizando la versión cis, elevando el transporte a tu plasma en sangre drásticamente.',
    '["licopeno","lutéina","beta-caroteno","vitamina C"]'::jsonb,
    '["Protector prostático cardiovascular","Derivador Antioxidante extremo","Solar guardiano"]'::jsonb,
    '[{"ingredient":"aceite-de-oliva","reason":"Cocinar tomate en aceite virgen isomeriza y asimila en sangre un enorme % más de licopeno"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Zanahoria',
    'zanahoria',
    'Beta-caroteno para tus ojos y tu piel',
    'verdura',
    NULL,
    '["confort","reset"]'::jsonb,
    'Fuente rica en nutrientes precursores de hormonas retinoles, las cuales gobiernan sutilmente nuestra adaptación visual y fotoperiódica, equilibrando el bienestar y sueño estacional (SAD).',
    'La provitamina A envejece radicalmente la salud epitelial y dérmica si falla. Estimula la renovación celular de mucosas frenando arrugas prematuras y opacidad.',
    'Muy densa en beta-caroteno, poliacetilenos antifúngicos y potasio. Necesita grasas de acompañamiento dietético para convertirse a Retinol utilitario sistémico.',
    '["beta-caroteno","alfa-caroteno","luteína","poliacetilenos"]'::jsonb,
    '["Retinoprotector","Filtro Dérmico UV","Recuperador epitelial"]'::jsonb,
    '[{"ingredient":"aguacate","reason":"La provitamina A se absorbe magistralmente rodeada por grasa oleica"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Cebolla',
    'cebolla',
    'Quercetina: el antihistamínico de la naturaleza',
    'verdura',
    NULL,
    '["reset","confort"]'::jsonb,
    'Sostiene en general el control de tu sistema vagal y calma picos de asma o irritación neuro-pulmonar, reduciendo de forma empírica la ansiedad sistémica por mal control aéreo histamínico.',
    'Su altísima carga de quercetina actúa con propiedades senolíticas de larga barrera y su altísima azufre promueve puentes celulares para cartílagos fuertes disolviendo la formación aterosclerósica en sus primeras fases.',
    'Repleta de compuestos precursores órgano-azufrados y quercetina, que actúan regulando directamente el eje Mastocítico mitigando cascadas inmunitarias reactivas crónicas.',
    '["quercetina","compuestos azufrados","inulina","vitamina b6"]'::jsonb,
    '["Antihistamínico natural","Prebiótico (inulina)","Cardioprotección fitoquímica"]'::jsonb,
    '[{"ingredient":"ajo","reason":"Junto al ajo, sus puentes fito-azufrados depuran tóxicos en sangre en cascada fase 2"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Espinaca',
    'espinaca',
    'Hierro + folatos: combustible para tu mente',
    'verdura',
    NULL,
    '["focus","activacion"]'::jsonb,
    'Garantiza suficiente folato vital a los receptores neurológicos para sintetizar el cuarteto: Dopamina, Serotonina, Epinefrina y Norepinefrina previniendo la niebla mental severa.',
    'Nitratos dietéticos abren directamente vasos estenosados restaurando un riego cerebral jovial, nutriendo tu cuerpo y manteniendo perfiles neuromotores excelentes en edad tardía con su luteína para visión.',
    'Su cóctel cuenta de Altísimo nitrato asimilable inorgánico, folina libre y mucha luteína xantofílica. La ebullición saca de juego oxalatos reactivos dejándola más biodisponible.',
    '["folato","nitrato natural","luteína","zeaxantina","hierro no hemo"]'::jsonb,
    '["Dinamizador cardiovascular","Pila neuroendocrina","Óptica neuro-protección"]'::jsonb,
    '[{"ingredient":"limon","reason":"Acerva de vitamina C necesaria para transmutar su hierro a fase absorbible en el intestino"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Almendra',
    'almendra',
    'Magnesio y vitamina E en cada bocado',
    'fruto_seco',
    NULL,
    '["calma","focus"]'::jsonb,
    'El magnesio que aporta es un tapón directo al exceso de glutamato cerebral excitorio. En crisis de estrés, este fruto rebaja revoluciones neurálgicas permitiéndote estudiar o meditar bajo control.',
    'En su capa dermo-periférica anidan concentraciones insanas de antioxidantes Vit. E que cubren y amortiguan los picos de la glucemia prolongada impidiendo así acortar su ciclo telomérico vital.',
    'Combina dosis masivas de ácido linoleico y oleico junto con alfa-tocoferoles incrustados en su fibra saciante que actúa como retardante enzimático de polisacáridos.',
    '["vitamina E","magnesio","ácido oleico","fenoles cuticulares"]'::jsonb,
    '["Vaso-protector","Buffer Glucémico","Mineralizador de Calma"]'::jsonb,
    '[{"ingredient":"avena","reason":"Porridge de avena y almendras prolonga hormonas GIP de saciedad a horas del día sin rebotes"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Pistacho',
    'pistacho',
    'El snack que baja tu cortisol',
    'fruto_seco',
    NULL,
    '["calma","social"]'::jsonb,
    'Comerlos requiere de de-cáscaras manuales induciendo ''mindful eating'' y ralentiza los atracones emocionales rebajando la culpa dopaminérgica, siendo increíblemente sanador para tu relación mente-comida.',
    'Altísimo poder hipolipemiante para tu plasma debido a fitosteroles raros e isómeros de vitaminas que reestructuran a niveles de placa venosa periférica, es oro circulatorio verde.',
    'Uno de los pocos frutos con Luteína activa visual en su pigmentación y Vitamina B6 que es catalítica directa promoviendo síntesis endógena de ácido gamma-aminobutírico.',
    '["luteína","fitoesteroles","melatonina vegetal","vitamina B6"]'::jsonb,
    '["Boca-Cortisol breaker","Defensa de lipo-peroxidación","Neuroinhibidor"]'::jsonb,
    '[{"ingredient":"azafran","reason":"Ricos sabores árabes sumados al control dopaminérgico antidepresivo en postres raw"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Anacardo',
    'anacardo',
    'Zinc y magnesio: el dúo anti-ansiedad',
    'fruto_seco',
    NULL,
    '["calma","confort"]'::jsonb,
    'Su altísima proporción innata de zinc y fósforo engranan y reparan neuroredes frágiles amortiguando muy eficazmente cuadros pre-ansiedad inducidos por el agotamiento crónico.',
    'Grasas extremadamente empáticas con los niveles corporales triglicéridos e inhibidores de depósitos patógenos articulares que protegen cartílago articular perimetral en la senectud.',
    'Contiene ácidos anacárdicos y triptófano en matriz blanda (muy alta asimilación) proveyendo una subida sedosa de aminoácidos tónicos para reconfección glandular diaria.',
    '["ácido anacárdico","zinc","cobre","ácido oleico"]'::jsonb,
    '["Soporte Serotoninérgico blando","Regulante Inmunitario de Metales","Confort gástrico"]'::jsonb,
    '[{"ingredient":"cacao","reason":"Mezcla de cremosidad y cobre para asimilar polifenoles sedantes de dopamina"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Lentejas',
    'lentejas',
    'Hierro y fibra: energía sostenida sin picos',
    'legumbre',
    NULL,
    '["activacion","confort"]'::jsonb,
    'Mantiene constantes como un metrónomo los niveles de azúcar a la corteza cerebral, evitando radicalmente el ''bajón de tarde'' y estabilizando humores y reacciones irritantes periféricas.',
    'Provee la matriz de fibra fermentativa obligada para microbiomas longevos, creando Butirato en colon y blindando al huésped del efecto pro-cancerígeno alimentario actual.',
    'Alto índice de amilosa (almidón resistente bioactivo) y folato, asegurando digestión extremadamente larga proveyendo la maquinaria base genética del metabolismo de metilación ADN celular.',
    '["almidón resistente","folato (B9)","hierro","fitoestrógenos"]'::jsonb,
    '["Curva Glicémica Plana","Constructor de microbiota de butirato","Prevención de anemias neuronales"]'::jsonb,
    '[{"ingredient":"limon","reason":"Limón rociado a tus lentejas multiplica x3 la asimilación de hierro cognitivo vital"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Garbanzos',
    'garbanzos',
    'Triptófano vegetal para tu bienestar',
    'legumbre',
    NULL,
    '["calma","confort"]'::jsonb,
    'Contiene Triptófano envuelto en matrices de bajo IG que pasan intactas permitiendo su travesía perfecta al cerebro convirtiéndose a serotonina sin distracción celular competidora, aportando suma tranquilidad.',
    'Secuestra sales biliares rebajando peligrosamente el colesterol plasmático de manera diaria promoviendo limpiezas de la vesícula recurrentes, retrasando calcificaciones celulares viscerales.',
    'Cargados de oligosacáridos que promueven ácidos grasos de cadena corta inmunomoduladores y sapóninas de efecto quelante que abordan micotoxinas previniendo daños renales.',
    '["saponinas","triptófano","fibra soluble péctica","magnesio"]'::jsonb,
    '["Productor directo SCFA","Filtro quelante natural","Generador de Calidad Anímica"]'::jsonb,
    '[{"ingredient":"semillas-de-sesamo","reason":"Tahini y garbanzo potencian un cocktail de calcio, sésamo y triptófano perfecto"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Quinoa',
    'quinoa',
    'Proteína completa del mundo vegetal',
    'cereal',
    NULL,
    '["activacion","focus"]'::jsonb,
    'Aporta todos los aminoácidos del bloque central neuromotor (sobre todo Lisina) requeridos para armar receptores cerebrales a la defensiva, evitando carencias psico-emocionales crónicas vegetales.',
    'Libre por naturaleza de factores inflamatorios pesados tipo prolamina, aporta los bloquecitos base celulares que previenen atrofia de tejido conectivo en tercera edad, y regenera músculos a tope.',
    'Pseudo-cereal de inmensa bio-asimilación polipeptídica con un aminograma total endógeno, rico a su vez en riboflavina promotor celular y magnesio disipador tensional profundo.',
    '["lisina","quercetina","kaempferol","fibra amilácea"]'::jsonb,
    '["Súper Constructor Tisular","Mantenimiento anti-edad de conectivo","Reductor neuro-tensional"]'::jsonb,
    '[{"ingredient":"almendra","reason":"Quinoa con lluvia de almendras provee un muro anti-depresivo vegetal masivo y de alto octanaje para tus mediodías"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Arroz integral',
    'arroz-integral',
    'Energía limpia con todos sus minerales',
    'cereal',
    NULL,
    '["confort","reset"]'::jsonb,
    'Por su fibra integral, induce estados de saciedad sumamente limpios aportando ácido gamma-aminobutírico neuroinhibidor si fue humectado y germinado levemente reduciendo stress profundo cerebral.',
    'Retiene fitatos esenciales en rango fisiológico actuando paradójicamente como pre-quelador antioxidario anti-cáncer e impidiendo patologías del colón grave y desajustes lipídicos endotelinos en venas centrales.',
    'Mantiene intacta la inmensa capa del salvado y el embrión celular ricos en fitoesteroles funcionales y tocotrienoles altamente específicos protegiendo paredes cerebrales lipídicas frente a metales invasores.',
    '["tocotrienoles","fibra salvada","arabinoxilano","ácido fítico funcional"]'::jsonb,
    '["Neuroinhibidor Gaba natural","Depurador de tránsito pesado","Balance de energía basal"]'::jsonb,
    '[{"ingredient":"azafran","reason":"Arroz dorado de azafrán estimula serotonina sobre una cama glucémica plana y controlada"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Ghee',
    'ghee',
    'Mantequilla clarificada que potencia cada especia',
    'aceite',
    NULL,
    '["confort","focus"]'::jsonb,
    'Grasas saturadas extremadamente estables vehiculizan vitaminas K2 y A hasta las paredes endoteliales cerebrales alimentando profundamente tus zonas cognitivas y previniendo la fatiga frontal en largos focus de estudio.',
    'Aporta ácido butírico masivamente (sin tener que esperar fermentaciones bacterianas), apagando inflamaciones enterocíticas críticas que previenen envejecimiento sistémico e intestinal, sellando paredes mucosas en longevidad.',
    'Mantequilla clarificada libre por completo de caseína alérgena y lactosa láctea. Alto porcentaje de ácidos grasos de cadena corta inmunoprotectores de pared gástrica tipo MUC2.',
    '["ácido butírico","vitamina k2","ácido linoleico conjugado"]'::jsonb,
    '["Sella Mucosa Gástrica","Liposolubilidad cerebral neta","Neuro-estable"]'::jsonb,
    '[{"ingredient":"curcuma","reason":"La curcumina se absuelve majestuosamente al calor bañada de saturación lipídica de Ghee"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Vinagre de kombucha (Kombuv+H)',
    'vinagre-de-kombucha',
    'El ingrediente secreto de Food·Mood',
    'fermentado',
    NULL,
    '["reset","activacion"]'::jsonb,
    'Destruye picos glucémicos letales para tu ánimo pos-comida al interferir con enzimas amilasas, estabilizando niveles empáticos de humor sin fatigas reactivas vespertinas.',
    'Extraordinario limpiador hepático de ácido acético virgen apoyando procesos catabólicos profundos y reduciendo a marchas forzadas hiper-trigliceridemias del sedentarismo pro-senil celular.',
    'Cede ácidos orgánicos al flujo sanguíneo promoviendo fosforilación oxidativa mitocondrial limpia que quema glucosa libre impidiendo pre-diabéticas cascadas de envejecimiento neuroendocrino.',
    '["ácido acético","cepas residuales SCOBY","ácidos glucurónicos"]'::jsonb,
    '["Quemador de pico de azúcar","Purificador sistémico","Potenciador ácido gástrico"]'::jsonb,
    '[{"ingredient":"salmon","reason":"La acidez del vinagre desnaturaliza proteínas nobles del salmón crudo facilitando altísima y rapidísima absorción gástrica"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Kéfir',
    'kefir',
    'Más diversidad probiótica que cualquier yogur',
    'fermentado',
    NULL,
    '["calma","reset"]'::jsonb,
    'Si el intestino llora, el cerebro grita. Restaurar las cepas Lácticas reduce las citoquinas inflamatorias mandando por el Vago señales intensivas de calma profunda contra crisis de nervios endémicas urbanas.',
    'Coloniza el intestino grueso con una alfombra gruesa pre-probiótica bio-fuerte que inhibe cepas E. coli putrefactivas que envían neurotoxinas en el torrente prolongando salud en el tiempo real.',
    'Comunidad simbiótica densa de láctico, levaduras e inmensa variabilidad cepológica superando al simple yogur y desdoblano lactosa haciéndola híper-digerible generando biopéptidos protectores directos al SNC.',
    '["kefirán","bacterias lácticas","péptidos bioactivos"]'::jsonb,
    '["Súper diversificador SCFA","Frenador del eje pituitario de estrés","Inmuno-pared extrema"]'::jsonb,
    '[{"ingredient":"nueces","reason":"La grasa de la nuez protege las cepas en su bajada estomacal para sembrarse seguras abajo"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Miso',
    'miso',
    'Umami fermentado que nutre tu microbiota',
    'fermentado',
    NULL,
    '["calma","confort"]'::jsonb,
    'Densísimo alimento neurotransmisor aportando isoflavonas que imitan neuro-regulación tranquilizante rebajando picos de la cortisona sistémica con un caldo salino caliente de puro hedonismo neurogástrico.',
    'Un factor central anti-angiogénico e inmunomodulador que reduce los riesgos proliferativos a nivel gástrico además de proveer vitaminas K2 que limpian arterias endureciendo huesos.',
    'Fermentado proteico con Aspergillus Oryzae que corta polipéptidos de soja dejando aminoácidos bio-activos purísimos y quelando mineralidad antagónica haciéndola bio asimilable.',
    '["soy isoflavonas agliconas","enzimas aspergilus","mineralidad iónica","ácidos lácticos raros"]'::jsonb,
    '["Mineralizador bio-abierto","Neuro-saciador blando","Osteocalcin-Booster K2"]'::jsonb,
    '[{"ingredient":"cebolla","reason":"Sopas de Miso y cebolla actúan liberando quercetina soluble activando barreras Vaga de calma calurosa"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Kimchi',
    'kimchi',
    'Picante probiótico que despierta tu intestino',
    'fermentado',
    NULL,
    '["activacion","reset"]'::jsonb,
    'Estimula vigorosamente el metabolismo central desbancando endorfinas vía Capsaicina picante sumándolo al asalto pro-biótico que despierta de letargos y neuro asimilaciones pobres de apatía dietética.',
    'Frenador maestro del colesterol general hepático con altísimos valores de indol-carbinol anti-senectivos que destruyen y barren excesos fitoestrogénicos nocivos estancados.',
    'Fermentado vivo que aporta un batallón cruzado de lactic-bacteria capsaicina desintegradora lípida y azufrados aliáceos desintoxicantes a dosis concentradísimas para shock inmunoreset.',
    '["capsaicina","indol-3-carbinol","vitamina u (metilmetionina)","cepas lácticas asiáticas"]'::jsonb,
    '["Dinamizador Endorfínico Inmediato","Detox fase 2 radical","Buster anti-disbiosis"]'::jsonb,
    '[{"ingredient":"huevos","reason":"Aporta un perfil enzimático destructivo al Kimchi rompiendo membranas proteicas del huevo en asimilables libres"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Reishi',
    'reishi',
    'El hongo de la inmortalidad',
    'hongo',
    NULL,
    '["calma","reset"]'::jsonb,
    'Considerado el Shen (espíritu pacífico); tiene un efecto inigualable adaptogénico en el eje HPA regulando las hormonas corticales en agotamiento de glándulas adrenales, devolviéndote la quietud natural.',
    'Altísimo poder inmunomodulador gracias a sus triterpenos que bajan niveles severos de histamina vascular y Beta-glucanos anti-senectivos protegiendo ADN contra roturas oxidativas a un nivel genético profundo.',
    'Ganoderma lucidum. Rey absoluto micológico cargadísimo de Ácido Ganodérmico con estructura esteroidea precursora que modula señales gabaérgicas rebajando el sistema hiper-fático central de manera orgánica.',
    '["ácido ganodérmico","triterpenos adaptógenos","polisacáridos beta","germanio orgánico"]'::jsonb,
    '["Regenerador adrenal adaptogénico","Depresor natural histamínico","Escudo celular longevo"]'::jsonb,
    '[{"ingredient":"jengibre","reason":"Calienta energéticamente la asimilación fúngica fría del Reishi expandiendo sus bioactivos intestinales"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Shiitake',
    'shiitake',
    'Umami con poder inmunológico',
    'hongo',
    NULL,
    '["reset","confort"]'::jsonb,
    'Garantiza con su ingesta la dotación de glutamato de baja carga natural provocando saciedad neuro-umbilical que aplasta impulsos insanos ansiosos por carbohidratos refinados y eleva el calor de estómago.',
    'Potencia el arma inmunológica T macrófaga disolviendo biopelículas de cepas malas gracias a su lentinano en el tracto, asegurando una pared enterocítica blindada antienvejecimiento pre-patológico.',
    'Una de las inmensas fuentes naturales de Lentinano (beta-glucano clínico regulatorio) y de di-aminoácidos proactivos aportando vitaminas B e hitósteroles destructores directos del colesterol rancio en sangre.',
    '["lentinano","eritadenina","ergosterol (vit, D basal)","glutamatos naturales"]'::jsonb,
    '["Quimioprotector profundo Inmune","Aplastador LDL","Saciedad emocional gástrica"]'::jsonb,
    '[{"ingredient":"ajo","reason":"Amortigua la potencia oxidativa local y multiplica el factor purificador linfático del hongo"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Té matcha',
    'te-matcha',
    'Todo el poder del té verde, concentrado ×10',
    'bebida',
    NULL,
    '["focus","activacion"]'::jsonb,
    'Literalmente eleva tu corteza prefrontal a zonas gamma/alfa sostenidas (cero fatiga) merced a la altísima e imbatible relación de L-Teanina inhibidora sumada al alcaloide dador de estimulación fina y alerta mental sostenida radiante.',
    'Al ingerir íntegramente la hoja micrada a temperatura controlada asimilas proporciones EGCG legendarias destructoras frontales de cáncer sistémico e insulino-reseteadoras absolutas bloqueando deterioro senil.',
    'La forma definitiva botánica neuro-cognitiva sumatoria de un abrumador volumen de polifenol EGCG junto a L-Teanina cruda en matriz vegetal clorofílico impidiendo oxidación destructiva endógena cerebral diaria y constante.',
    '["EGCG hiperdenso","L-teanina pura","cafeína alcaloide de matriz","clorofila quelante"]'::jsonb,
    '["Rey Nootrópico Natural","Termogénico quemador élite","Mortero de estrés oxidativo"]'::jsonb,
    '[{"ingredient":"limon","reason":"Blindando al EGCG de la caída al ácido estomacal cuadruplica el ratio disponible en plasma circulante cerebral"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Miel cruda',
    'miel-cruda',
    'Endulzante ancestral con poder prebiótico',
    'otro',
    NULL,
    '["confort","calma"]'::jsonb,
    'Recarga instintivamente y de forma rápida al glucógeno del cerebro, promoviendo de inmediato picos triptofánicos dulces de emergencia si existen bajadas glicémicas severas paralizantes emocionales nocturnas.',
    'Altísimo poder bio-enzimático bacteriostático, frena a radicales gástricos y estimula a bacterias saprófitas amables creando mucosas enteras y evitando que virus pro-envejecimiento permeen intestino.',
    'Matriz saturada rica de glucosa y puras fructosas unidas a defensinas (péptidos de abeja antibacterianos) y enzimas invertasas sin pasteurizar con actividad enzimática brutal sobre flora y mucosas inflamadas.',
    '["defensina-1","polifenoles propólicos","fructooligosacáridos (FOS)","peróxidinas locales"]'::jsonb,
    '["Bálsamo vago-nervioso endulzado","Súper Modulador Mucose-prebiótico","Antibacteriano crudo endémico"]'::jsonb,
    '[{"ingredient":"jengibre","reason":"Cóctel analgésico inmenso promoviendo transpiración purificadora del resfriado neuronal bajando inflamaciones"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Alga nori',
    'alga-nori',
    'Yodo y minerales del océano',
    'otro',
    'alga',
    '["focus","activacion"]'::jsonb,
    'Suficiencia magistral del yodo reactivando tu glándula tiroides devolviéndole de un plumazo a tu metabolismo lento toda su fuerza frontal y clarificando brumas endémicas tiroidales ocultas en cansancio letárgico.',
    'Proteína vegetal densísima repleta de ácidos EPA sutiles apoyada en clorofílicas y taurina impidiendo roturas de placa vascular y aportando depuraciones profundísimas por quelación atómica sobre metales diarios.',
    'Portadora asimilable vegetal bio-excelente de Taurina y minerales alcalinizantes traza del mar (Yodo, Zinc) más provitamina B12 con bajísimo impacto insulínico y alto saciador neural.',
    '["yodo orgánico libre","taurina celular","epas-trazas omega3","clorofilas aminas"]'::jsonb,
    '["Metabolizador central tiroidal","Neuro-Quelante atómico","Balance hídrico-plano mineralizado"]'::jsonb,
    '[{"ingredient":"salmon","reason":"Fusión legendaria aportando matrices insaturadas grasas que empujan la bio-síntesis y yodificación marina brutalmente"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Huevos',
    'huevos',
    'Colina: el nutriente olvidado de tu cerebro',
    'proteina',
    NULL,
    '["focus","activacion","confort"]'::jsonb,
    'Dota a tu cerebro enteramente del material base constructor de fosfolípidos y acetilcolina acelerando memoria ram inmediata; evitando caídas de alerta de mediodía de forma impecablemente contundente y saciadora lipídica.',
    'Matriz proteica PDCAAS perfecta 100% frena la sarcopenia limitante degeneradora de la edad y aporta enormes lutéinas y zeaxantinas bioactivas directas a mácula visual frenando ceguera senil crónica fuertemente.',
    'Bomba absoluta generadora conteniendo Colina lipídica central constructora membranal cruzando barreras cerebrales libremente junto aminoácidos libres listos con mínima huella de toxicidad oxidativa digestiva si blandos.',
    '["colina de lecitina","luteína intra-yemial","zeaxantina","perfil amino-noble global"]'::jsonb,
    '["Memoria turbo acetilada","Músculo formador central","Lírica saciedad cortical de dopamina"]'::jsonb,
    '[{"ingredient":"espinaca","reason":"Nitratos vegetales vasodilatadores promoviendo todo ese chute de constructores a los lóbulos de la nuca y visión"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Salmón',
    'salmon',
    'DHA y EPA: los omega-3 que tu cerebro necesita',
    'proteina',
    NULL,
    '["focus","calma"]'::jsonb,
    'Constructor nato y de urgencia del 30% de la grasa del propio cerebro (DHA) revirtiendo la atrofia del campo emocional, silenciando alertas pre-depresión endémicas y lubricando sinapsis de dopamina masiva y constante real.',
    'Cortador químico de la citoquina central prostaglandina PGE2 anuladora vascular, blindando corazón al tiempo que su pigmento inyecta fuerza mitocondrial extrema para nadar contracorriente a nivel celular y telomérico de envejecimiento.',
    'Vector preconfigurado natural inyectable asimilable a venas de altísimo calibre biológico EPA marino y DHA puro junto al rey astaxantínico y vitamina D pro-hormonal resolviendo desajustes estéricos óseos neurales de plaga urbana.',
    '["dha cerebral biótico","epa cardiocentro purificador","astaxantina mitocondrial","hormona d base"]'::jsonb,
    '["Depresor inflamatorio de neurotóxicos","Anclaje Serotoninérgico Puro Constructor","Protector mitocondrial de lujo"]'::jsonb,
    '[{"ingredient":"aguacate","reason":"Soporte mono-insaturado y vitamina E para frenar cualquier oxidación del milagro marino EPA asimilante"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Sardinas',
    'sardinas',
    'Omega-3 + calcio + vitamina D en un bocado',
    'proteina',
    NULL,
    '["focus","reset"]'::jsonb,
    'Bomba nutricional densísima neuro-trófica que arrastra nutrientes críticos al cerebro y su D3 eleva potentemente estadios de ánimos postrados, regenerando vitalidad psíquica básica frente apatía depresional celular generalizada y debilidad general psicosomática por agotamiento urbano.',
    'Provee huesitos espina de altísima calcificación ionizada asimilable, vitamina D y omega directos al flujo endotelial, garantizando huesos impenetrables y venúlas suaves a edades centenarias de forma limpia de tóxicos mercuriales profundos.',
    'Pescado pelágico libre de contaminaciones densas rico altamente en calcio osteomineral, coQ10 celular dinamo, B12 reparadora de vainas mielínicas axonales en extremidades al 100% de la capacidad de biodisponibilidad y purísimo vector inflamatorio depresor profundo.',
    '["omega-3 epa/dha","calcio matriz iónica","colecalciferol D3 base libre","coenzima Q10 regeneradora"]'::jsonb,
    '["Mineralizador Oseo Total Cortical","Reparador Sistema Nervioso Periférico Mielinas B12","Líquido articular Inmune resolutivo"]'::jsonb,
    '[{"ingredient":"limon","reason":"Catalizador de cítricos para aplastar oxidación natural del pescadito y potenciar enormemente la calcina libre intestinal"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Brócoli',
    'brocoli',
    'Sulforafano: el escudo contra el envejecimiento',
    'verdura',
    'crucífera',
    '["focus","reset"]'::jsonb,
    'El sulforafano activa la vía Nrf2, el sistema de defensa antioxidante más potente del cuerpo, incluyendo el cerebro. Protege las neuronas del estrés oxidativo. Fuente de folatos esenciales para la síntesis de neurotransmisores.',
    'Los glucosinolatos se transforman en isotiocianatos que activan enzimas de detoxificación y apoptosis de células dañadas. Potente anticancerígeno (especialmente colon y mama). Rico en vitamina C, calcio y vitamina K.',
    'Crucífera rica en glucosinolatos (precursores de sulforafano), vitamina C, K, folatos, carotenoides (luteína) y fibra. Los estudios señalan efectos neuroprotectores y quimiopreventivos.',
    '["sulforafano","glucosinolatos","luteína","kaempferol","vitamina K"]'::jsonb,
    '["Neuroprotector","Anticancerígeno","Detoxificante","Antiinflamatorio"]'::jsonb,
    '[{"ingredient":"aceite-de-oliva","reason":"Absorción de vitaminas liposolubles K y A"},{"ingredient":"limon","reason":"Combina vitamina C y optimiza la formación de sulforafano"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Nuez',
    'nuez',
    'Tiene forma de cerebro por algo',
    'fruto_seco',
    NULL,
    '["focus","calma"]'::jsonb,
    'La nuez tiene forma de cerebro y lo alimenta literalmente. Rica en omega-3 (ALA), el ácido graso esencial para las membranas neuronales. La vitamina E protege las neuronas del estrés oxidativo. El triptófano contribuye a la producción de serotonina.',
    'El alimento con mayor capacidad antioxidante entre los frutos secos (ácido elágico, polifenoles). Los omega-3 reducen inflamación sistémica. Cardioprotector: mejora perfil lipídico.',
    'El único fruto seco con una cantidad significativa de ALA (Alpha-Linolenic Acid). También aporta melatonina endógena, fundamental para los ciclos circadianos y el descanso de calidad.',
    '["ALA (omega-3)","ácido elágico","polifenoles","vitamina E","melatonina"]'::jsonb,
    '["Neuroprotector","Cardioprotector","Regulador del sueño","Antioxidante"]'::jsonb,
    '[{"ingredient":"kefir","reason":"Complementa proteína láctea y potencia saciedad neurológica"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Avena',
    'avena',
    'Beta-glucanos que alimentan tu microbiota',
    'cereal',
    NULL,
    '["calma","confort","focus"]'::jsonb,
    'Los beta-glucanos de la avena son prebióticos que alimentan las bacterias beneficiosas del intestino — tu ''segundo cerebro''. Estabiliza la glucosa evitando los bajones de energía y humor. Rica en vitaminas B que participan en la síntesis de neurotransmisores.',
    'Reduce colesterol LDL (evidencia sólida). Los beta-glucanos modulan el sistema inmune. La fibra soluble mejora el tránsito y la salud del colon — factor clave en longevidad.',
    'Cereal singular con alto contenido de biomoléculas bioactivas: los β-glucanos (1-3, 1-4) que forman un gel en el intestino, y avenantramidas, polifenoles exclusivos de la avena con potente acción anti-picor, antiinflamatoria y vasodilatadora.',
    '["β-glucanos","avenantramidas","vitaminas B","hierro","magnesio"]'::jsonb,
    '["Prebiótico","Estabilizador glucémico","Cardioprotector","Antiinflamatorio"]'::jsonb,
    '[{"ingredient":"canela","reason":"La combinación maestra para aplanar la curva de glucosa cerebral"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Aceite de oliva virgen extra',
    'aceite-de-oliva',
    'Oro líquido mediterráneo',
    'aceite',
    NULL,
    '["social","confort","calma"]'::jsonb,
    'El ácido oleico mejora la fluidez de las membranas neuronales. Los polifenoles (hidroxitirosol, oleuropeína) protegen el cerebro de la neuroinflamación. Dieta mediterránea rica en AOVE se asocia con menor riesgo de depresión.',
    'Piedra angular de la dieta mediterránea y la longevidad. Esqualeno (provitamina A), fitoesteroles (β-sitosterol), vitamina E, polifenoles. Reduce LDL oxidado, protege endotelio vascular. La lecitina (en virgen sin refinar) protege hígado y sistema nervioso.',
    '55-83% ácido oleico (monoinsaturado). Porción insaponificable: esqualeno, β-sitosterol, campesterol, tocoferoles, polifenoles (hidroxitirosol, oleuropeína). El virgen extra conserva todos los compuestos; el refinado pierde antioxidantes progresivamente.',
    '["ácido oleico","hidroxitirosol","oleuropeína","esqualeno","β-sitosterol"]'::jsonb,
    '["Neuroprotector","Cardioprotector","Anti-aging celular","Inmunomodulador"]'::jsonb,
    '[{"ingredient":"tomate","reason":"El AOVE disuelve y absorbe el licopeno multiplicando su poder protector"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Kombucha',
    'kombucha',
    'Probióticos vivos para tu segundo cerebro',
    'fermentado',
    NULL,
    '["reset","activacion","focus"]'::jsonb,
    'Los probióticos de la kombucha modulan directamente el eje intestino-cerebro. Bacterias como Lactobacillus producen GABA (neurotransmisor calmante). Mejora la diversidad de la microbiota, asociada con menor ansiedad y mejor estado de ánimo.',
    'Los ácidos orgánicos (acético, glucurónico) apoyan la detoxificación hepática. Los polifenoles del té base aportan protección antioxidante. La fermentación aumenta biodisponibilidad de vitaminas B.',
    'Bebida fermentada originaria de un SCOBY. Las levaduras y bacterias oxidan los azúcares transformándolos en ácidos volátiles. Genera un microbioma secundario en el intestino que regula péptidos neuroendocrinos.',
    '["probióticos","ácido acético","ácido glucurónico","polifenoles del té"]'::jsonb,
    '["Apoyo microbiota","Detox hepático","Equilibrador nervioso","Digestivo"]'::jsonb,
    '[{"ingredient":"jengibre","reason":"Fermentar jengibre en la kombucha duplica el potencial digestivo y antiemético"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Melena de león',
    'melena-de-leon',
    'El hongo que regenera tus neuronas',
    'hongo',
    NULL,
    '["focus"]'::jsonb,
    'Contiene erinacinas y hericenonas que estimulan la producción de NGF (Factor de Crecimiento Nervioso) — literalmente ayuda a tus neuronas a crecer y repararse. Los estudios muestran mejora en memoria y concentración. Potencial en deterioro cognitivo leve.',
    'Neuroprotector por excelencia. Estimula BDNF y NGF, los factores de crecimiento neuronal. Antiinflamatorio intestinal. Prometedor en investigación de Alzheimer y Parkinson.',
    'Hongo Hericium erinaceus. Sus bioactivos cruzan la barrera hematoencefálica promoviendo la remielinización. Además actúa en el intestino gracias a sus complejos beta-glucanos que nutren la inmunidad celular.',
    '["erinacinas","hericenonas","β-glucanos","polisacáridos"]'::jsonb,
    '["Nootrópico","Regenerador neuronal","Apoyo digestivo","Memoria"]'::jsonb,
    '[{"ingredient":"te-matcha","reason":"Sinergia de focus absoluta: NGF del hongo + L-teanina del té"}]'::jsonb,
    'moderado',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Té verde',
    'te-verde',
    'L-teanina: concentración sin nervios',
    'bebida',
    NULL,
    '["focus","calma"]'::jsonb,
    'Combinación única de L-teanina + cafeína. La L-teanina aumenta ondas alfa cerebrales (estado de concentración relajada) mientras la cafeína mantiene la alerta. Resultado: focus sin ansiedad. Las catequinas (EGCG) son neuroprotectoras.',
    'Las catequinas (especialmente EGCG) son los antioxidantes más potentes del mundo vegetal. Protegen contra cáncer, cardiovascular y neurodegeneración. El proceso de preparación del té verde (sin fermentar) conserva intacto su contenido en catequinas.',
    'Bases xánticas (cafeína, teofilina, teobromina), polifenoles (catequinas: EGCG, EGC, ECG), taninos catéquicos, ácidos fenólicos (clorogénico, cafeico, gálico), L-teanina, flúor y vitaminas B, C, E.',
    '["EGCG","L-teanina","cafeína","catequinas","ácido gálico"]'::jsonb,
    '["Nivelador cognitivo","Antioxidante extremo","Quimiopreventivo","Lipotrópico"]'::jsonb,
    '[{"ingredient":"limon","reason":"El ácido ascórbico cuadruplica la biodisponibilidad de las catequinas a nivel celular"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    'Cacao puro',
    'cacao',
    'El placer que tu cerebro necesita',
    'otro',
    NULL,
    '["social","confort","calma"]'::jsonb,
    'Estimula producción de endorfinas y anandamida (''molécula de la felicidad''). La teobromina aporta energía suave sin el pico de la cafeína. Los flavonoides mejoran flujo sanguíneo cerebral, mejorando memoria y procesamiento cognitivo.',
    'Concentración de polifenoles superior al vino tinto, té verde y la mayoría de frutas. Reduce presión arterial sistólica y diastólica. Modula función plaquetaria e inflamación. Cardioprotector documentado.',
    'Rico en flavonoides (epicatequina, catequina, procianidinas). Contiene metilxantinas (teobromina, cafeína). Ácido esteárico (neutro para colesterol). El cacao crudo o >70% conserva la máxima concentración de polifenoles.',
    '["flavonoides","teobromina","anandamida","epicatequina","magnesio"]'::jsonb,
    '["Vasodilatador neuronal","Estimulante hedónico","Cardioprotector","Antioxidante"]'::jsonb,
    '[{"ingredient":"pimienta-negra","reason":"Un toque agudiza el flujo vascular cerebral propiciado por los flavonoides"}]'::jsonb,
    'alto',
    NULL
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();

