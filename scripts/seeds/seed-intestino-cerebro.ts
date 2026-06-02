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
    slug: "evaluacion-digestiva-emocional",
    title: "Tu intestino y tu ánimo: el punto de partida",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["eje-intestino-cerebro", "evaluacion", "digestion", "microbiota"],
    body_markdown: `Tu intestino y tu cerebro hablan entre ellos todo el día. Antes de trabajar esa conversación, vamos a ver cómo está ahora mismo.

Responde pensando en las **últimas dos semanas**, del 0 al 4 *(0 = nunca · 4 = casi siempre)*:

1. Noto hinchazón o pesadez después de comer.
2. Mi digestión cambia cuando estoy estresada.
3. Tengo molestias digestivas (gases, irregularidad, malestar).
4. Mi estado de ánimo y mi digestión parecen ir de la mano.
5. Como pocas variedades distintas de vegetales a la semana.
6. Tomo pocos alimentos fermentados.

Y durante esta semana, registra cada día una línea: **cómo fue tu digestión** y **cómo fue tu ánimo**. No busques conclusiones todavía. Solo observa si aparece alguna relación entre los dos.

Esta foto inicial es tu referencia. Al final del protocolo volverás a ella.

*Si tienes una condición digestiva diagnosticada, coméntalo con tu profesional antes de hacer cambios: algunos de los pasos que vienen se adaptan en tu caso.*`,
  },
  {
    slug: "eje-intro",
    title: "El segundo cerebro: por qué tu barriga influye en cómo te sientes",
    content_type: "article",
    duration_minutes: 5,
    tags: ["eje-intestino-cerebro", "microbiota", "estado-animo", "ciencia"],
    body_markdown: `En tu intestino vive un ecosistema de billones de microorganismos —la microbiota— que hace muchísimo más que digerir. La investigación de las últimas dos décadas (Cryan, Dinan, Mayer y otros) ha ido revelando que ese ecosistema mantiene una conversación constante con el cerebro, en lo que se conoce como el eje intestino-cerebro.

¿Por dónde hablan? Por varias vías: el nervio vago, que conecta directamente intestino y cerebro; el sistema inmune; y un montón de sustancias que la microbiota ayuda a producir. De hecho, buena parte de la serotonina del cuerpo —un neurotransmisor muy ligado al bienestar— se produce en el intestino.

Esto no significa que "arreglar la barriga" cure el ánimo, ni que comer un yogur te ponga feliz. La evidencia es más matizada: una microbiota diversa y bien alimentada **se asocia** con mejor regulación del estado de ánimo, menos inflamación y una digestión más cómoda. Es una pieza más del puzzle, no la pieza única.

La buena noticia es que la microbiota es modificable. Cambia con lo que comes, con el estrés, con el sueño, con el movimiento. Y responde relativamente rápido. Lo que vas a hacer estas semanas es, básicamente, cuidar a tus inquilinos: darles variedad, fibra, fermentados y algo de calma. Ellos te lo devuelven.`,
  },
  {
    slug: "diversidad-fibra",
    title: "El reto de las plantas: por qué la variedad gana a la cantidad",
    content_type: "article",
    duration_minutes: 4,
    tags: ["eje-intestino-cerebro", "fibra", "diversidad", "microbiota"],
    body_markdown: `Si hay una sola idea que llevarte de todo este protocolo, es esta: a tu microbiota le importa más la **variedad** de plantas que la cantidad.

La investigación sobre microbiota (como el trabajo del American Gut Project) ha encontrado que las personas que comen una mayor diversidad de vegetales distintos tienden a tener una microbiota más diversa —y la diversidad microbiana se asocia con mejor salud digestiva y metabólica. La cifra que se suele citar como referencia orientativa es **30 tipos distintos de plantas a la semana**. Suena a mucho, pero cuenta todo: verduras, frutas, legumbres, frutos secos, semillas, hierbas y especias.

**Cómo llegar sin agobio:**

- **Cuenta lo que ya haces.** Una ensalada con cinco ingredientes son cinco plantas. Las especias cuentan. Un puñado de mezcla de semillas, varias.
- **Suma de una en una.** Añade un tipo nuevo cada pocos días en lugar de revolucionar tu compra.
- **Aprovecha lo pequeño.** Hierbas frescas, semillas, un puñado de frutos secos distintos. Suman variedad sin esfuerzo.
- **Congelados y legumbres de bote valen.** No tiene que ser gourmet ni caro.

Esta semana, simplemente cuenta cuántas plantas distintas comes. Sin cambiar nada todavía. Te va a sorprender —para bien o para tener margen de mejora.

*Si tienes SII u otra condición digestiva, la fibra se introduce de forma más gradual y selectiva. Hazlo con tu profesional.*`,
  },
  {
    slug: "fermentados-microbiota",
    title: "Fermentados: el regalo más antiguo para tu microbiota",
    content_type: "article",
    duration_minutes: 5,
    tags: ["eje-intestino-cerebro", "fermentados", "microbiota", "fermentacion"],
    body_markdown: `Mucho antes de que existieran los probióticos en cápsula, la humanidad llevaba milenios cuidando su microbiota sin saberlo: fermentando. Casi todas las culturas tienen sus fermentados, y no es casualidad.

Los alimentos fermentados aportan microorganismos vivos y compuestos que se generan durante la fermentación. La investigación sugiere que un consumo regular de fermentados puede asociarse con una microbiota más diversa y con marcadores de menor inflamación. No son una medicina —son comida con historia y con beneficios potenciales.

**El abanico para elegir:**

- **Kéfir** — más diverso en microorganismos que el yogur convencional.
- **Yogur** — el clásico, busca los que indican "fermentos vivos".
- **Verduras fermentadas** — chucrut, kimchi, encurtidos en salmuera (no en vinagre).
- **Vinagre de kombucha o de manzana** — un chorrito en aliños.
- **Miso y tempeh** — fermentados de soja, sabrosos y versátiles.

**La regla de oro: empieza poco a poco.** Si tu intestino no está acostumbrado a los fermentados, introducirlos de golpe puede dar hinchazón o gases. Empieza con una cucharada, un sorbo, una porción pequeña, y ve subiendo según tu cuerpo. La constancia importa más que la cantidad.

Elige uno que te guste de verdad —el placer también es parte del cuidado— y dale un hueco diario estas semanas.

*Si tienes SIBO, histaminosis u otra condición sensible a fermentados, consúltalo antes con tu profesional.*`,
  },
  {
    slug: "polifenoles-color",
    title: "Come colores: los polifenoles que tu microbiota adora",
    content_type: "article",
    duration_minutes: 3,
    tags: ["eje-intestino-cerebro", "polifenoles", "antioxidantes", "nutricion"],
    body_markdown: `¿Por qué los nutricionistas insisten tanto en "comer colores"? No es estética. Los colores intensos de frutas y verduras vienen de los polifenoles, unos compuestos vegetales que, además de su efecto antioxidante, sirven de alimento a las bacterias buenas de tu intestino.

La evidencia asocia una dieta rica en polifenoles con una microbiota más favorable y con efectos antiinflamatorios. Y lo bonito es que están justo en los alimentos más apetecibles:

- **Rojos y morados:** frutos del bosque, uva, remolacha, col lombarda, cebolla morada.
- **Verdes intensos:** espinaca, brócoli, té verde, aceite de oliva virgen extra.
- **Marrones aromáticos:** cacao puro, café, especias como la cúrcuma o la canela.

**Gestos sencillos para sumar polifenoles:**

- Un puñado de frutos rojos (frescos o congelados) en el desayuno.
- Cacao puro en lugar de chocolate muy azucarado.
- Aceite de oliva virgen extra en crudo para aliñar.
- Especias generosas: la cúrcuma, el orégano, la canela suman sin esfuerzo.

No es una lista de obligaciones. Es una invitación a hacer tu plato más colorido —y, de paso, más interesante para tu microbiota.`,
  },
  {
    slug: "reducir-irritantes",
    title: "Lo que conviene aligerar (sin demonizar nada)",
    content_type: "article",
    duration_minutes: 4,
    tags: ["eje-intestino-cerebro", "inflamacion", "azucar", "ultraprocesados"],
    body_markdown: `Hasta ahora hemos hablado de sumar. Pero cuidar el eje intestino-cerebro también implica, suavemente, aligerar algunas cosas que la evidencia asocia con una microbiota menos favorable y más inflamación.

Importante: esto no va de prohibir ni de demonizar alimentos. Va de notar el equilibrio.

**Lo que conviene tener más a raya:**

- **Azúcar añadido en exceso.** El azúcar rápido y frecuente se asocia con un entorno intestinal menos favorable. No se trata de eliminarlo —se trata de que no sea la base.
- **Ultraprocesados.** Los productos con largas listas de ingredientes, emulgentes y aditivos se asocian en algunos estudios con cambios desfavorables en la microbiota. Cuanto más cerca esté la comida de su forma original, mejor para tus bacterias.
- **Alcohol frecuente.** En exceso, afecta tanto a la microbiota como a la barrera intestinal.

**El enfoque amable:** no listas negras, sino proporción. Si la mayor parte de lo que comes es comida real, variada y con fermentados, el ocasional capricho no es un problema —es vida. La microbiota responde a lo que haces *la mayoría* del tiempo, no a un día suelto.

Esta semana, en vez de "eliminar", prueba a **observar**: ¿en qué momentos aparece el azúcar o el ultraprocesado como parche? Esa observación, sin juicio, ya es el principio del cambio.`,
  },
  {
    slug: "ritmo-digestivo",
    title: "No es solo qué comes: cómo comes también cuenta",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["eje-intestino-cerebro", "digestion", "mindful-eating", "nervio-vago"],
    body_markdown: `Puedes tener el plato perfecto y aun así digerirlo mal. Porque la digestión empieza antes del primer bocado, y depende mucho del estado en que comes.

Cuando comes con prisa, de pie o estresada, tu cuerpo está en modo "alerta" —el sistema nervioso simpático— y la digestión queda en segundo plano. Para digerir bien, el cuerpo necesita estar en modo "calma", donde el nervio vago hace su trabajo. De ahí que el estrés y la digestión vayan tan de la mano.

**Tres prácticas para esta semana:**

**1. Tres respiraciones antes de comer.** Antes del primer bocado, tres respiraciones lentas con la exhalación larga. Le indicas al cuerpo que es momento de digerir, no de huir.

**2. Mastica más de lo que crees necesario.** La digestión empieza en la boca. Masticar bien aligera el trabajo del resto del sistema y aumenta la saciedad. Prueba a soltar los cubiertos entre bocados.

**3. Come sin pantalla, al menos una vez al día.** Aunque sea una comida. Prestar atención a lo que comes —el sabor, la textura— mejora la digestión y la relación con la comida.

No tienes que hacer las tres en cada comida. Elige una y conviértela en hábito estas semanas. Tu intestino lo nota.`,
  },
  {
    slug: "intestino-animo",
    title: "Observa la conversación: tu intestino y tu ánimo en tiempo real",
    content_type: "article",
    duration_minutes: 3,
    tags: ["eje-intestino-cerebro", "estado-animo", "observacion", "microbiota"],
    body_markdown: `Llevas varias semanas cuidando tu intestino. Esta es la fase de empezar a notar la conversación entre tu barriga y tu ánimo —porque es bidireccional.

Por un lado, lo que comes influye en cómo te sientes: la evidencia asocia una microbiota cuidada con mejor regulación emocional. Por otro, tu estado emocional influye en tu digestión: el estrés y la ansiedad alteran el ritmo intestinal de forma directa.

**Qué observar estos días:**

- ¿Notas la digestión distinta los días de más estrés?
- ¿Hay alimentos tras los cuales te sientes más pesada o más nublada?
- ¿Hay comidas o momentos tras los que te sientes con más claridad y energía?
- ¿Cómo está tu ánimo en las semanas que has cuidado más la variedad y los fermentados?

No busques relaciones de causa-efecto perfectas —el cuerpo es complejo y muchos factores influyen a la vez. Busca *patrones*. Esa observación, registrada, es oro para ti y para tu profesional: empieza a dibujar tu mapa personal de cómo se hablan tu intestino y tu cerebro.`,
  },
  {
    slug: "eje-consolidacion",
    title: "Cierre: lo que tu intestino te ha enseñado",
    content_type: "exercise",
    duration_minutes: 5,
    tags: ["eje-intestino-cerebro", "cierre", "evaluacion", "microbiota"],
    body_markdown: `Has cuidado tu eje intestino-cerebro durante varias semanas. Vamos a recoger lo aprendido.

**Primero, vuelve a las preguntas del inicio.** Respóndelas otra vez, del 0 al 4, pensando en las últimas dos semanas:

1. Noto hinchazón o pesadez después de comer.
2. Mi digestión cambia cuando estoy estresada.
3. Tengo molestias digestivas.
4. Mi estado de ánimo y mi digestión parecen ir de la mano.
5. Como pocas variedades distintas de vegetales a la semana.
6. Tomo pocos alimentos fermentados.

Compara con tu foto inicial. Tu profesional verá ambas.

**Después, reflexiona:**

- ¿Cuántas plantas distintas comes ahora a la semana, comparado con el inicio?
- ¿Has encontrado un fermentado que te guste y que mantengas?
- ¿Notas alguna relación entre cómo comes y cómo te sientes?
- ¿Qué hábito de estos te quieres quedar para siempre?

El eje intestino-cerebro no es un proyecto de cuatro semanas —es una relación para toda la vida. Pero ahora la conoces, la entiendes y tienes herramientas para cuidarla. Lo que has sembrado estas semanas, tu microbiota lo sigue agradeciendo cada día. Habla con tu profesional sobre cómo seguir.`,
  },
]

async function seed() {
  console.log(`Seeding ${ITEMS.length} items into content_library (Protocolo Eje Intestino-Cerebro)…\n`)
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
