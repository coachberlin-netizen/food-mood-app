import path from "path"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config({ path: path.join(process.cwd(), ".env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or service key. Check .env.local")
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ITEMS = [
  {
    slug: "evaluacion-menopausia",
    title: "Menopausia: dónde estás y cómo te sientes",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["menopausia", "perimenopausia", "evaluacion", "salud-mujer"],
    body_markdown: `La menopausia no es un interruptor, es un proceso —y cada mujer lo vive distinto. Antes de empezar, situémonos.

**¿En qué momento estás?** Coméntalo con tu profesional, pero como orientación:
- **Perimenopausia:** todavía tienes reglas, aunque irregulares. Las hormonas fluctúan como en una montaña rusa.
- **Postmenopausia:** llevas 12 meses o más sin regla. El estrógeno está bajo y más estable.

**Mapea tus síntomas.** Del 0 al 4 *(0 = nunca · 4 = casi siempre)*, en las últimas dos semanas:

1. Sofocos o sudores (de día o de noche).
2. Sueño interrumpido o de mala calidad.
3. Cambios de ánimo, ansiedad o irritabilidad.
4. Niebla mental o dificultad de concentración.
5. Cambios en el cuerpo, sobre todo zona abdominal.
6. Menos fuerza o energía que antes.
7. Antojos o relación con la comida más difícil.
8. Molestias urogenitales o sequedad.

Esta foto es tu punto de partida. No es una lista de problemas a "arreglar" —es un mapa para acompañarte mejor. Al final del protocolo volverás a ella.

*Síntomas como sangrados abundantes o muy irregulares deben revisarse siempre con tu médico.*`,
  },
  {
    slug: "menopausia-intro",
    title: "Qué está pasando de verdad (y por qué no es 'cosa tuya')",
    content_type: "article",
    duration_minutes: 5,
    tags: ["menopausia", "estrogeno", "hormonas", "salud-mujer"],
    body_markdown: `Durante años, muchos síntomas de la menopausia se han minimizado o atribuido al carácter. No es cosa tuya, ni de tu actitud: es biología, y merece ser tratada con seriedad.

El protagonista es el estrógeno. En perimenopausia fluctúa de forma impredecible —de ahí la montaña rusa de síntomas—. En postmenopausia se queda bajo y estable. Y resulta que el estrógeno no solo regulaba tu ciclo: influía en la temperatura corporal, el sueño, el ánimo, la densidad de los huesos, la masa muscular, el metabolismo y hasta la microbiota. Por eso, cuando baja, se notan cambios en tantos frentes a la vez.

Lo importante: **muchos de estos cambios responden a cómo te cuidas.** La alimentación, el movimiento, el sueño y la regulación del estrés no "curan" la menopausia —es una etapa natural, no una enfermedad— pero la evidencia asocia ciertos hábitos con una transición mucho más amable.

Las próximas semanas vamos a trabajar los frentes donde más se puede influir: proteína y músculo, azúcar e insulina, huesos, microbiota, sueño y ánimo. No para "volver atrás", sino para vivir esta etapa con fuerza y bienestar.

Y una nota: la terapia hormonal sustitutiva (THS) es una opción médica válida para muchas mujeres. Si te interesa, es una conversación para tu médico. Lo que vemos aquí la complementa, no la sustituye ni la reemplaza.`,
  },
  {
    slug: "proteina-resistencia-anabolica",
    title: "Proteína y músculo: tu mejor inversión en esta etapa",
    content_type: "article",
    duration_minutes: 5,
    tags: ["menopausia", "proteina", "musculo", "fuerza"],
    body_markdown: `Si hay una sola cosa nutricional que priorizar en la menopausia, la evidencia apunta a esta: la proteína. Y no para adelgazar —para conservar tu fuerza.

Con la bajada de estrógeno aparece algo que la investigación llama **resistencia anabólica**: el músculo responde peor al estímulo de la proteína que cuando eras más joven. Traducido: necesitas cuidar más el aporte de proteína para mantener la masa muscular, que de forma natural tiende a perderse con la edad. Y el músculo no es estético: es fuerza, es metabolismo, es independencia y protección frente a caídas en el futuro.

**Cómo cuidarlo, sin obsesión y sin contar:**

- **Proteína en cada comida.** En lugar de concentrarla en la cena, repartirla a lo largo del día ayuda al músculo a aprovecharla mejor.
- **Variedad de fuentes.** Huevo, pescado, legumbres, kéfir, yogur, tofu, tempeh, frutos secos, carne si la tomas. No hace falta que sea siempre lo mismo.
- **Desayuno con proteína.** Empezar el día con proteína —y no solo con hidratos— ayuda con la energía y con los antojos.
- **Muévete con fuerza.** La proteína sola no basta: necesita el estímulo del ejercicio de fuerza para construir músculo. Caminar está bien, pero levantar peso (o tu propio cuerpo) es la pareja perfecta de la proteína en esta etapa.

Tu profesional puede orientarte sobre las cantidades concretas para tu caso. La idea de fondo: en la menopausia, comer suficiente proteína y mover el cuerpo con fuerza no es opcional —es lo que sostiene tu vitalidad.`,
  },
  {
    slug: "azucar-insulina-menopausia",
    title: "Azúcar, energía y la barriga que aparece de la nada",
    content_type: "article",
    duration_minutes: 4,
    tags: ["menopausia", "insulina", "metabolismo", "energia"],
    body_markdown: `Una queja muy común en esta etapa: "como igual que siempre y ahora se me va todo a la barriga". No te lo estás imaginando, y no es falta de disciplina.

La bajada de estrógeno se asocia con cambios en cómo el cuerpo maneja el azúcar y la insulina, y con una tendencia a acumular grasa en la zona abdominal en lugar de en caderas y muslos. Es un cambio fisiológico, no un fallo personal.

**Lo que puede ayudar (sin dietas restrictivas):**

- **Estabiliza el azúcar en sangre.** Combinar siempre los hidratos con proteína, grasa buena o fibra suaviza los picos de glucosa. Una tostada sola sube y baja rápido; una tostada con aguacate y huevo, mucho más estable.
- **Cuida el orden.** Empezar las comidas por la verdura y la proteína, dejando los hidratos para después, puede moderar el pico de glucosa.
- **Muévete después de comer.** Un paseo corto tras las comidas se asocia con un mejor manejo de la glucosa.
- **Prioriza el desayuno proteico.** Vuelve a aparecer: estabiliza la energía y los antojos del resto del día.

Importante: el objetivo no es perder peso a toda costa ni perseguir el cuerpo de los 30. Es cuidar tu energía, tu metabolismo y tu salud a largo plazo. El peso es solo un dato entre muchos, y no el más importante.`,
  },
  {
    slug: "huesos-densidad",
    title: "Tus huesos: la ventana que conviene no perder",
    content_type: "article",
    duration_minutes: 4,
    tags: ["menopausia", "huesos", "densidad-osea", "calcio"],
    body_markdown: `Este es uno de los frentes más importantes y de los que menos se habla. El estrógeno protegía tus huesos, y su descenso acelera la pérdida de densidad ósea —especialmente en los primeros años tras la menopausia, una ventana en la que la pérdida puede ser más rápida. Cuidar los huesos ahora es una inversión a largo plazo contra la osteoporosis.

**Los pilares del cuidado óseo:**

- **Calcio de la comida.** Lácteos y fermentados (kéfir, yogur, quesos), pero también sardinas con espina, almendras, tofu, hoja verde, legumbres. Variado, no solo lácteo.
- **Vitamina D.** Clave para absorber el calcio. El sol es la fuente principal; en muchos casos hace falta valorar suplementación —pero eso lo decide tu médico con una analítica, no por tu cuenta.
- **Magnesio y vitamina K.** Acompañan la salud ósea. Hoja verde, frutos secos, legumbres, fermentados.
- **Ejercicio de impacto y fuerza.** Los huesos se fortalecen cuando se les exige. Caminar, subir escaleras, levantar peso, saltar si puedes. El hueso responde al estímulo igual que el músculo.

No se trata de tomar mil suplementos —se trata de comer variado, tomar el sol con cabeza, moverte con fuerza, y revisar con tu profesional si necesitas algo más. La densidad ósea que cuides ahora te sostiene literalmente en las décadas siguientes.`,
  },
  {
    slug: "estrobioma-microbiota-menopausia",
    title: "El estroboloma: tu microbiota también cuida tus hormonas",
    content_type: "article",
    duration_minutes: 4,
    tags: ["menopausia", "estrobioma", "microbiota", "fibra"],
    body_markdown: `Aquí entra un protagonista poco conocido: el **estroboloma**, el conjunto de bacterias de tu intestino que participan en el metabolismo de los estrógenos. Sí —tu microbiota tiene un papel en cómo tu cuerpo gestiona las hormonas, también en la menopausia.

La investigación en este campo es joven pero prometedora: un estroboloma equilibrado se asocia con una mejor regulación de los estrógenos circulantes. Y como el estroboloma forma parte de tu microbiota, lo cuidas con lo mismo que cuida al resto: variedad vegetal, fibra y fermentados.

**Lo que puede ayudar:**

- **Fibra y diversidad de plantas.** Las bacterias que metabolizan estrógenos se alimentan de fibra. Más variedad de vegetales, mejor entorno.
- **Legumbres.** Además de proteína y fibra, aportan fitoestrógenos —compuestos vegetales con una débil actividad similar al estrógeno que algunas mujeres asocian con alivio de síntomas.
- **Fermentados.** Kéfir, yogur, verduras fermentadas, vinagre de kombucha o de manzana. Cuidan la microbiota en general y, con ella, el estroboloma.
- **Linaza y soja con matices.** Son ricas en fitoestrógenos. La evidencia sobre su efecto en síntomas es mixta y varía mucho entre personas.

**Una advertencia importante:** si tienes antecedentes de cáncer hormonodependiente (mama, etc.) o cualquier condición sensible a estrógenos, **consulta con tu médico antes de aumentar fitoestrógenos** (soja, linaza, suplementos). No es un "más es mejor" universal.`,
  },
  {
    slug: "sofocos-sueno-menopausia",
    title: "Sofocos y sueño: recuperar el descanso",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["menopausia", "sofocos", "sueno", "regulacion"],
    body_markdown: `Los sofocos y el sueño interrumpido son, para muchas mujeres, lo que más desgasta de esta etapa. Y están conectados: los sofocos nocturnos rompen el sueño, y el mal sueño empeora todo lo demás —ánimo, antojos, energía.

No hay una solución mágica, pero sí cosas que la evidencia asocia con cierto alivio:

**Para los sofocos:**
- **Identifica tus desencadenantes.** Para muchas mujeres, el alcohol, la cafeína, las comidas muy picantes o muy calientes y el estrés pueden disparar los sofocos. Observar tu patrón ayuda a anticiparlos.
- **Capas y frescor.** Ropa en capas, ambiente fresco, agua a mano. Gestión práctica.

**Para el sueño:**
- **Ambiente fresco de noche.** Especialmente útil si hay sudores nocturnos.
- **Rutina de cierre.** Bajar luces y pantallas la última hora, una infusión, respiración con exhalación larga.
- **Cafeína con horario.** Dejarla a primera hora de la tarde.
- **Cena que no pese y con su proteína.** Ayuda a no despertarte con hambre o con bajón de azúcar.

**Y una herramienta directa:** la respiración lenta con exhalación prolongada (inhala 4, exhala 6-8) activa la vía de la calma y algunas mujeres la encuentran útil incluso en mitad de un sofoco. Pruébala estos días.

*Si los sofocos o el insomnio afectan mucho a tu calidad de vida, habla con tu médico: hay opciones, incluida la THS, que vale la pena valorar profesionalmente.*`,
  },
  {
    slug: "animo-cognicion-menopausia",
    title: "Ánimo, ansiedad y niebla mental: no te estás volviendo loca",
    content_type: "article",
    duration_minutes: 4,
    tags: ["menopausia", "estado-animo", "cognicion", "autocompasion"],
    body_markdown: `La ansiedad que aparece de la nada, la irritabilidad, la tristeza sin motivo claro, la sensación de "niebla mental" donde antes había agilidad. Si te reconoces, escucha esto: no te estás volviendo loca, y no es debilidad de carácter.

El estrógeno influye en neurotransmisores ligados al ánimo y en funciones cognitivas. Su fluctuación (peri) y descenso (post) se asocian con cambios reales en el estado emocional y en la concentración. Es biología, otra vez —no un defecto tuyo.

**Lo que puede ayudar:**

- **Nombra lo que sientes.** Distinguir "estoy ansiosa", "estoy agotada", "estoy triste" —en lugar de un difuso "estoy mal"— es el primer paso para atenderlo. La precisión emocional regula.
- **Autocompasión activa.** Trátate como tratarías a una amiga en esta etapa. La autoexigencia y la autocrítica empeoran todo. No es autoindulgencia: es estrategia.
- **Cuida los pilares.** Sueño, proteína, movimiento, microbiota y regulación del estrés influyen directamente en el ánimo. No es casualidad que todo el protocolo apunte en la misma dirección.
- **Conexión y movimiento.** El aislamiento amplifica; la conexión social y el ejercicio se asocian con mejor estado de ánimo en esta etapa.

Y algo importante: si el ánimo bajo es persistente, profundo o interfiere con tu vida, no lo normalices como "cosa de la menopausia". Habla con tu profesional. La depresión y la ansiedad clínica merecen atención específica, en cualquier etapa de la vida.`,
  },
  {
    slug: "menopausia-consolidacion",
    title: "Cierre: la menopausia como nueva etapa, no como final",
    content_type: "exercise",
    duration_minutes: 5,
    tags: ["menopausia", "cierre", "evaluacion", "salud-mujer"],
    body_markdown: `Has dedicado varias semanas a cuidarte en esta transición. Recojamos lo aprendido.

**Vuelve al mapa de síntomas del inicio.** Puntúa otra vez, del 0 al 4, las últimas dos semanas:

1. Sofocos o sudores. 2. Sueño. 3. Ánimo/ansiedad. 4. Niebla mental. 5. Cambios corporales. 6. Fuerza/energía. 7. Relación con la comida. 8. Molestias urogenitales.

Compara con tu punto de partida. Tu profesional verá ambos.

**Y reflexiona:**

- ¿Qué frente notas más mejorado, aunque sea poco?
- ¿Conseguiste meter más proteína y algo de fuerza en tu semana?
- ¿Qué hábito te ha resultado más fácil de sostener?
- ¿Qué te gustaría seguir cuidando a partir de ahora?

La menopausia se ha contado durante demasiado tiempo como un declive. Pero es una etapa larga —puedes vivir un tercio de tu vida en ella— y puede vivirse con fuerza, claridad y bienestar. Lo que has aprendido estas semanas no caduca: son los cuidados que sostienen tu vitalidad en las décadas que vienen.

No es el final de nada. Es el inicio de una forma nueva de cuidarte. Sigue acompañándote —y deja que tu profesional te acompañe— en este camino.`,
  },
]

async function seed() {
  console.log(`Seeding ${ITEMS.length} items into content_library (Protocolo Menopausia)…\n`)
  let ok = 0, skipped = 0

  for (const item of ITEMS) {
    const { error } = await admin
      .from("content_library")
      .upsert(
        {
          slug:             item.slug,
          title:            item.title,
          content_type:     item.content_type,
          body_markdown:    item.body_markdown,
          duration_minutes: item.duration_minutes,
          tags:             item.tags,
          is_published:     true,
        },
        { onConflict: "slug" }
      )

    if (error) {
      console.error(`  ERROR [${item.slug}]: ${error.message}`)
      skipped++
    } else {
      console.log(`  OK    ${item.slug}`)
      ok++
    }
  }

  console.log(`\nDone. ${ok} upserted, ${skipped} errors.`)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
