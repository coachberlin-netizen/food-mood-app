---
title: Tabla maestra de interacciones farmacológicas
type: safety_reference
scope: agent_middleware
last_updated: 2026-05
sources: longevidad/03, 04, 05, 06, 07, 08, 09, 10, 11, 12
---

# Tabla maestra — Interacciones fármaco-alimento/suplemento

Esta tabla consolida todas las advertencias farmacológicas de los 12 KBs.
El middleware de safety debe consultarla antes de que la respuesta del agente llegue al usuario.

## Regla de uso para el agente

Cuando el perfil de usuario incluya un fármaco de la columna **Fármaco / Clase**, el agente debe:
- **NUNCA recomendar** el suplemento/alimento marcado como `⛔ Contraindicado`
- **Avisar + derivar** ante los marcados como `⚠️ Precaución`
- **Adaptar timing** en los marcados como `🕐 Separar`

---

## 1. Anticoagulantes (warfarina, acenocumarol, apixabán, rivaroxabán)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Omega-3 >3 g/día | ⚠️ Potencia efecto anticoagulante | No recomendar dosis altas; dosis dietéticas (pescado, nueces) son seguras | 04, 12 |
| Vitamina K (crucíferas, espinacas, kale) | ⚠️ Antagoniza warfarina | Mantener consumo **regular y constante** — no errático; no suspender ni aumentar bruscamente | 03 |
| Curcumina >1 g/día (suplemento) | ⚠️ Potencia warfarina | Solo dosis culinarias (cúrcuma en recetas) | 06 |
| Psyllium dosis altas | 🕐 Altera absorción oral | Separar 2h de toma del anticoagulante | 05 |

---

## 2. Levotiroxina (Eutirox, Neotroimín)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Calcio (lácteos, suplemento) | 🕐 Reduce absorción | Separar mínimo 4h de la toma | 03, 05 |
| Hierro (suplemento o alimentos ricos) | 🕐 Reduce absorción | Separar mínimo 4h | 03 |
| Soja (bebida, tofu, edamame en cantidad) | 🕐 Puede reducir absorción | Separar 4h; consumo moderado | 03 |
| Fibra concentrada (psyllium, salvado) | 🕐 Reduce absorción | Separar 4h | 03, 05 |
| Café | 🕐 Reduce absorción | Tomar levotiroxina en ayunas antes del café | 03, 07 |
| Ashwagandha | ⚠️ Puede modular función tiroidea | Precaución; informar a endocrinóloga | 06, 10 |

---

## 3. Antidiabéticos (metformina, insulina, sulfonilureas, GLP-1)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| TRE / ayuno intermitente | ⚠️ Modifica sensibilidad insulínica | Cualquier cambio de ventana de comida requiere coordinación médica previa | 07 |
| Ejercicio físico intenso | ⚠️ Aumenta sensibilidad a insulina | Revisar dosis con médico antes de cambios bruscos en actividad | 04 |
| Berberina (suplemento) | ⚠️ Efecto aditivo con metformina — riesgo hipoglucemia | ⛔ No combinar sin supervisión médica | 10 |
| Metformina en sí | ℹ️ Modula microbiota como mecanismo propio | El agente puede esperar mayor variabilidad GI | 09 |

---

## 4. Antidepresivos ISRS / IRSN (fluoxetina, sertralina, venlafaxina, duloxetina)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Hypericum / Hierba de San Juan | ⛔ Síndrome serotoninérgico | Nunca sugerir este adaptógeno en usuarias con ISRS | 06 |
| Triptófano >500 mg (suplemento) / 5-HTP | ⚠️ Riesgo serotoninérgico a dosis altas | Solo fuentes dietéticas; no suplementos | 09 |
| Rhodiola (dosis altas) | ⚠️ Consultar — efecto serotonérgico potencial | Mención neutra; no recomendar sin consulta | 06 |
| Cambios bruscos en microbiota (probióticos altos) | ⚠️ Puede alterar motilidad GI | Introducir gradualmente; alertar si empeora GI | 11 |
| Interocepción embotada | ℹ️ ISRS, betabloqueantes, ansiolíticos, opioides y cannabis crónico pueden distorsionar señales corporales | El agente no debe asumir que el usuario "sentiría" hipoglucemia o deshidratación | 08 |

---

## 5. Tamoxifeno / Inhibidores de aromatasa (letrozol, anastrozol, exemestano)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Isoflavonas en dosis altas (suplemento) | ⚠️ Puede interferir con terapia anti-estrogénica | Solo consumo dietético habitual; no suplementos de fitoestrógenos | 03, 12 |
| DIM (suplemento) | ⚠️ Precaución — metabolismo estrogénico | Decisión oncológica; el agente no recomienda | 12 |
| Vitex (agnocasto) | ⚠️ Actividad dopaminérgica / potencial modulación hormonal | No recomendar sin consulta oncológica | 12 |

---

## 6. Inmunosupresores (tacrolimus, ciclosporina, metotrexato, corticoides crónicos)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Fermentos vivos (kéfir, chucrut, kombucha viva) | ⚠️ Riesgo infeccioso en inmunosupresión severa | No recomendar fermentos vivos; fermentos pasteurizados son más seguros | 11 |
| Ashwagandha | ⚠️ Potencial modulación inmune | No recomendar sin consulta | 06, 10 |
| Curcumina a dosis altas | ⚠️ Efecto inmunomodulador | Solo dosis culinarias | 06 |

---

## 7. Inhibidores de bomba de protones — IBP (omeprazol, pantoprazol, esomeprazol)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Los IBP en sí | ℹ️ Aumentan riesgo de disbiosis y SIBO | El agente lo considera como factor de riesgo de microbiota alterada | 05, 09, 11 |
| Retirada abrupta de IBP | ⛔ No retirar sin supervisión médica | El agente nunca sugiere suspender IBP | 05, 11 |

---

## 8. Antihipertensivos (IECA, ARA-II, diuréticos, betabloqueantes)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Diuréticos + ejercicio intenso + deshidratación | ⚠️ Desequilibrio electrolítico | Recordar hidratación y electrolitos; no recomendar TRE estricto sin coordinación médica | 04 |
| Betabloqueantes | ℹ️ Embotan interocepción cardíaca y térmica | Ver punto interocepción (KB 08) | 08 |

---

## 9. Antibióticos (cualquier clase)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Probióticos / fermentos durante el tratamiento | ✅ Recomendable | Sugerir Saccharomyces boulardii durante el curso y reconstrucción posterior con fibra fermentable | 05, 09, 11 |
| Magnesio (suplemento) con quinolonas | 🕐 Reduce absorción del antibiótico | Separar 2 horas | 10 |

---

## 10. Anticonceptivos orales combinados

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| DIM (suplemento) | ⚠️ Puede acelerar metabolismo de estrógenos exógenos | No recomendar DIM a usuarias con ACO sin consulta | 10 |
| Vitex (agnocasto) | ⚠️ Precaución — actividad dopaminérgica | No recomendar | 10 |

---

## 11. Benzodiacepinas / sedantes (diazepam, lorazepam, clonazepam, zolpidem)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Adaptógenos sedantes (ashwagandha, valeriana, pasiflora) | ⚠️ Efecto aditivo | No apilar sin consulta | 06 |
| Alcohol | ⚠️ Potenciación — fuera del scope del agente | No relevante para recomendaciones culinarias | — |
| Interocepción embotada | ℹ️ Ver KB 08 | Igual que ISRS | 08 |

---

## 12. Antipsicóticos (risperidona, quetiapina, olanzapina, aripiprazol)

| Sustancia | Interacción | Acción del agente | Fuente KB |
|-----------|-------------|-------------------|-----------|
| Vitex (agnocasto) | ⛔ Antagonismo dopaminérgico potencial | No recomendar bajo ninguna circunstancia en usuarias con antipsicóticos | 10 |

---

## Señales de alerta que obligan a modo `derivar` independientemente del fármaco

Estas condiciones deben activar derivación aunque no aparezca fármaco explícito en el perfil:

- Sangrado vaginal postmenopáusico (>12 meses sin menstruación)
- Sangrado abundante en perimenopausia sin evaluar
- Dolor torácico, disnea o palpitaciones sostenidas
- Fractura por traumatismo mínimo
- Depresión moderada-severa o ideación de daño
- Signos de autoinmunidad no diagnosticada
- Bulto mamario, secreción anómala, cambio cutáneo
- Pérdida de peso involuntaria + fiebre + síntomas digestivos

---

## Notas de mantenimiento

- Este fichero es la **fuente única de verdad** para interacciones farmacológicas del agente.
- Cuando se ingeste un nuevo KB, añadir sus interacciones aquí antes de activarlo en producción.
- Revisión clínica recomendada: cada 6 meses o ante cambio regulatorio EMA/AEMPS.
