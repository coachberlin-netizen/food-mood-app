---
title: QA — Calidad de recuperación RAG
type: qa_retrieval
scope: rag_system
validated_by: S.F. (fundadora)
last_updated: 2026-05
---

# QA — Recuperación RAG: casos de prueba

Tres categorías: recuperación simple (un KB correcto), recuperación múltiple
(varios KBs relevantes), y tests de discriminación (elegir el correcto cuando
varios KBs podrían responder).

## Cómo pasar un caso

- **PASS**: el KB objetivo aparece en el top-3 de chunks recuperados
- **FAIL parcial**: el KB objetivo aparece en posición 4–6 (retrieval débil)
- **FAIL total**: el KB objetivo no aparece, o aparece un KB incorrecto en posición 1

---

## Bloque A — Recuperación simple (un KB objetivo)

### A-01 — Psicobióticos y ansiedad
**Input**: *"¿Qué probióticos me ayudan con la ansiedad?"*
**KB objetivo**: `09_eje_microbiota_intestino_cerebro` (Cryan/Dinan)
**Chunks esperados**: cepas psicobióticas (L. rhamnosus JB-1, B. longum 1714, L. helveticus R0052)
**KB que NO debe liderar**: `06_psiconeuroinmunologia` (PNI general), `05_disbiosis_sibo_sii`
**Por qué importa**: el KB #09 tiene las cepas específicas con evidencia en ansiedad humana; el #06 es más general

---

### A-02 — Síntomas perimenopausia temprana
**Input**: *"Tengo 44 años, las reglas se me han vuelto irregulares, no duermo bien y estoy muy irritable"*
**KB objetivo**: `10_perimenopausia_briden`
**Chunks esperados**: progesterona primera en caer, insomnio GABAérgico, irritabilidad perimenopausia
**KB que NO debe liderar**: `12_menopausia_moderna_haver` (es menopausia establecida, no transición)
**Por qué importa**: Briden es el marco correcto para perimenopausia activa; Haver para postmenopausia. Confundirlos da información incorrecta

---

### A-03 — Menopausia establecida con sofocos
**Input**: *"Llevo 2 años sin menstruación y tengo sofocos nocturnos que me despiertan"*
**KB objetivo**: `12_menopausia_moderna_haver`
**Chunks esperados**: sofocos nocturnos, ventana de oportunidad HRT, estriol vaginal, magnesio glicinato + salvia
**KB que NO debe liderar**: `10_perimenopausia_briden`
**Por qué importa**: la inversa del caso A-02; postmenopausia confirmada (>12 meses) necesita el marco Haver

---

### A-04 — Crononutrición y sueño
**Input**: *"¿A qué hora debería cenar si me cuesta dormirme?"*
**KB objetivo**: `07_cronodieta_ritmos_circadianos`
**Chunks esperados**: última comida 2-3h antes de dormir, melatonina y luz, ventana TRE, cortisol matutino
**KB que NO debe liderar**: `05_disbiosis_sibo_sii`, `11_cerebro_intestino_inmune_mayer`
**Por qué importa**: la pregunta es circadiana pura; no es de microbiota ni de digestión

---

### A-05 — Interocepción y hambre emocional
**Input**: *"No entiendo por qué como cuando estoy aburrida aunque no tengo hambre"*
**KB objetivo**: `08_emociones_construidas_barrett`
**Chunks esperados**: presupuesto corporal, allostasis, interoception, predicción cerebral, señales afectivas mal-atribuidas
**KB que NO debe liderar**: `06_psiconeuroinmunologia`, `09_eje_microbiota_intestino_cerebro`
**Por qué importa**: este es el caso de Barrett puro — el cerebro predictivo mal-atribuye estado corporal a hambre. No es un problema de microbiota

---

### A-06 — Hinchazón y sensibilidades digestivas
**Input**: *"Me hincho con casi todo lo que como, especialmente legumbres y lácteos"*
**KB objetivo**: `05_disbiosis_sibo_sii`
**Chunks esperados**: SIBO, hiperpermeabilidad, low-FODMAP contextualizado, disbiosis
**KB que NO debe liderar**: `11_cerebro_intestino_inmune_mayer` (marco más amplio), `09_eje_microbiota_intestino_cerebro`
**Por qué importa**: síntoma digestivo específico con patrón FODMAP — el KB #05 tiene el protocolo clínico correcto

---

### A-07 — Frozen shoulder + dolor articular
**Input**: *"Tengo el hombro izquierdo bloqueado desde hace meses y también me duelen las rodillas"*
**KB objetivo**: `12_menopausia_moderna_haver`
**Chunks esperados**: frozen shoulder como síntoma menopáusico no reconocido, artritis menopáusica
**KB que NO debe liderar**: `04_nutricion_deportiva_40plus`, `06_psiconeuroinmunologia`
**Por qué importa**: frozen shoulder es un síntoma menopáusico fuertemente asociado — el agente debe nombrarlo y orientar a ginecóloga, no solo a traumatología. Es el caso de síntoma oculto más importante del KB #12

---

### A-08 — Estrobioma
**Input**: *"¿Qué es el estrobioma y cómo afecta a mis hormonas?"*
**KB objetivo**: `03_protocolos_hormonales` (sección estrobioma)
**Chunks esperados**: estrobioma, beta-glucuronidasa, recirculación de estrógenos, crucíferas, DIM
**KB secundario aceptable**: `10_perimenopausia_briden` (también lo trata)
**Por qué importa**: término específico que aparece en dos KBs; el #03 tiene la explicación mecanicista más completa

---

## Bloque B — Recuperación múltiple (2+ KBs deben estar en top-5)

### B-01 — Perfil complejo perimenopausia + ansiedad digestiva
**Input**: *"Tengo 51 años, creo que estoy en perimenopausia, tengo mucha ansiedad y el estómago siempre revuelto"*
**KBs objetivo** (todos en top-5):
- `10_perimenopausia_briden` — marco hormonal
- `09_eje_microbiota_intestino_cerebro` — ansiedad + microbiota
- `11_cerebro_intestino_inmune_mayer` — estómago revuelto + eje cerebro-intestino
**Por qué importa**: el agente debe integrar los tres marcos, no elegir uno

---

### B-02 — Estrés crónico + libido baja
**Input**: *"Llevo meses muy estresada, no tengo libido y me noto apagada"*
**KBs objetivo**:
- `06_psiconeuroinmunologia` — eje estrés-inmune, cortisol crónico
- `03_protocolos_hormonales` — testosterona, progesterona, DHEA, tiroides
**Por qué importa**: libido baja tiene doble lectura — PNI (cortisol apaga líbido) y hormonal (testosterona, progesterona). El agente debe activar los dos

---

### B-03 — Antiinflamación + salud cardiovascular
**Input**: *"Quiero reducir la inflamación, tengo colesterol alto y quiero cuidar el corazón"*
**KBs objetivo**:
- `01_palancas_longevidad` — inflammaging, senescencia
- `04_nutricion_deportiva_40plus` — omega-3, ejercicio, VO2max
- `12_menopausia_moderna_haver` — si hay contexto de menopausia (cardiovascular es primera causa de mortalidad femenina)
**Por qué importa**: cardiovascular es un tema multi-KB; retrieval parcial da respuesta incompleta

---

## Bloque C — Discriminación (evitar recuperación incorrecta)

### C-01 — Receta simple sin contexto especializado
**Input**: *"¿Tienes una receta de lentejas con cúrcuma para esta noche?"*
**KB correcto**: `foodmood/02_recetas_por_mood` — recetas funcionales por mood
**KBs que NO deben aparecer en top-3**: ningún KB longevidad especialista
**Por qué importa**: una pregunta de receta simple no debe activar el retrieval de protocolos clínicos. Si aparece el KB de perimenopausia o SII ante esta consulta, el sistema tiene ruido en los embeddings

---

### C-02 — Modo Calma sin síntoma
**Input**: *"Quiero algo reconfortante para cenar, modo Calma"*
**KB correcto**: `foodmood/01_eje_intestino_cerebro` o `foodmood/02_recetas_por_mood`
**KBs que NO deben liderar**: `10_perimenopausia_briden`, `12_menopausia_moderna_haver`, `05_disbiosis_sibo_sii`
**Por qué importa**: mood sin síntoma no debe activar protocolo clínico

---

### C-03 — HRT — distinguir Briden vs Haver
**Input**: *"¿La terapia hormonal sustitutiva es segura? Me da miedo por el WHI"*
**KB primario**: `12_menopausia_moderna_haver` (tiene toda la corrección post-WHI: Manson JAMA 2017, ventana de oportunidad)
**KB secundario aceptable**: `10_perimenopausia_briden`
**KB que NO debe liderar**: `03_protocolos_hormonales` (tiene HRT pero más escueto que el #12)
**Por qué importa**: la pregunta del WHI tiene su mejor respuesta en Haver; si recupera el #03 primero, la respuesta es incompleta

---

### C-04 — Ashwagandha con medicación
**Input**: *"¿Puedo tomar ashwagandha si estoy tomando levotiroxina?"*
**KB objetivo**: tabla de interacciones farmacológicas (pharma_interactions_master) + `10_perimenopausia_briden` + `06_psiconeuroinmunologia`
**Comportamiento esperado**: el agente consulta la tabla de safety antes de responder y activa `⚠️ Precaución — informar a endocrinóloga`
**Fallo**: el agente responde directamente desde el KB sin activar el lookup de interacciones

---

## Notas de ejecución

- Correr contra el endpoint RAG real con los mismos parámetros de producción (top_k, threshold de similitud)
- Registrar la posición real de cada KB objetivo en el ranking de chunks
- Los casos C-01 y C-02 son los más útiles para detectar ruido: si hay falsos positivos de KBs clínicos ante consultas simples, ajustar threshold o añadir metadata de filtro por `kb` field
- El caso C-04 verifica la integración entre RAG y middleware de safety — son dos sistemas distintos y deben coordinarse
- Revisión recomendada: tras cada ingesta de nuevo KB (riesgo de drift en embeddings)
