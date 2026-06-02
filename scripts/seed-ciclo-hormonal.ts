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
    slug: "evaluacion-ciclo-mapeo",
    title: "Mapea tu ciclo: el punto de partida",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["ciclo-hormonal", "evaluacion", "mapeo", "salud-mujer"],
    body_markdown: `Tu ciclo no es solo "la regla". Es un ritmo de cuatro fases que influye en tu energía, tu estado de ánimo, tu hambre y hasta en cómo rinde tu cuerpo. Antes de trabajar con él, vale la pena conocerlo.

Durante esta primera semana, registra cada día tres cosas sencillas:

- **Dónde estás en tu ciclo** (día desde la última menstruación).
- **Tu energía** (de 0 a 10).
- **Tu estado de ánimo** en una palabra.

Y responde estas preguntas para tener una foto de partida:

1. ¿Tu ciclo es regular y conoces más o menos su duración?
2. ¿Notas cambios de energía a lo largo del mes?
3. ¿Aparecen antojos en momentos concretos del ciclo?
4. ¿Tu estado de ánimo cambia con las fases?
5. ¿Hay días del ciclo en que cuesta más sostener tus hábitos?

No busques respuestas perfectas. La gracia de las próximas semanas es justamente descubrir tu patrón, que es único.

*Si usas anticoncepción hormonal, tienes ciclos irregulares o estás en perimenopausia, coméntalo con tu profesional: el patrón será distinto y conviene adaptarlo.*`,
  },
  {
    slug: "ciclo-intro",
    title: "Por qué no comes igual toda la semana (y está bien)",
    content_type: "article",
    duration_minutes: 4,
    tags: ["ciclo-hormonal", "nutricion", "energia", "salud-mujer"],
    body_markdown: `¿Alguna vez te has sentido imparable una semana y, dos semanas después, agotada haciendo exactamente lo mismo? No es falta de constancia. Es tu ciclo.

A lo largo del mes, las hormonas —principalmente estrógeno y progesterona— suben y bajan en un patrón predecible que la evidencia asocia con cambios en la energía, el apetito, el estado de ánimo y el rendimiento físico. Dicho simple: tu cuerpo no está en el mismo lugar el día 7 que el día 24, y tratar ambos días igual es ir contra tu biología.

El ciclo tiene cuatro fases:

- **Menstrual** (los días de regla): energía baja, momento de recuperación.
- **Folicular** (después de la regla): el estrógeno sube, la energía también. Suele ser la fase de más empuje.
- **Ovulatoria** (mitad del ciclo): pico de energía y de conexión social.
- **Lútea** (antes de la siguiente regla): la progesterona domina; pueden aparecer antojos, más hambre y cambios de ánimo.

La idea de las próximas semanas no es "controlar" tu ciclo, sino trabajar *con* él. Comer, moverte y exigirte de forma distinta según la fase puede hacer que todo te resulte más fácil —y más amable contigo misma.

*Cada cuerpo es distinto. Estos patrones son tendencias, no reglas. Tu experiencia manda.*`,
  },
  {
    slug: "fase-folicular",
    title: "Fase folicular: tu semana de empuje",
    content_type: "article",
    duration_minutes: 3,
    tags: ["ciclo-hormonal", "fase-folicular", "energia", "nutricion"],
    body_markdown: `Después de la regla, el estrógeno empieza a subir y, con él, normalmente la energía, el ánimo y las ganas de hacer cosas. Es, para muchas personas, la fase de mayor empuje del ciclo.

**Cómo aprovecharla:**

- **Energía para lo exigente.** Si vas a abordar algo que requiere esfuerzo —un proyecto, un cambio de hábito, entrenamiento más intenso— esta suele ser la ventana donde el cuerpo lo agradece más.
- **El cuerpo tolera bien la variedad.** Es buen momento para platos con más estructura, más verdura, más experimentación. Sueles tener apetito estable y digestión cómoda.
- **Aprovecha para preparar.** Como la energía acompaña, es buena fase para cocinar con antelación o dejar cosas listas para las semanas en que apetezca menos.

No fuerces nada: si tu folicular no se siente así, perfecto, tu patrón es el tuyo. Pero si reconoces ese empuje, vale la pena no desperdiciarlo en piloto automático.`,
  },
  {
    slug: "fase-ovulatoria",
    title: "Ovulación: el pico (y cómo no quemarlo todo)",
    content_type: "article",
    duration_minutes: 3,
    tags: ["ciclo-hormonal", "ovulacion", "energia", "salud-mujer"],
    body_markdown: `Hacia la mitad del ciclo llega la ovulación, y con ella suele venir un pico de energía, de sociabilidad y de buen ánimo. El estrógeno está en su punto más alto. Te sientes capaz de todo.

Justo por eso conviene una pequeña advertencia amable: es la fase en la que es fácil sobrecargarse —decir que sí a todo, exigirse de más— y luego pagarlo en la fase siguiente.

**Para vivirla bien:**

- **Disfrútala, sin vaciarte.** Aprovecha la energía social y el buen humor, pero recuerda que después viene la lútea, donde el cuerpo pide otra cosa.
- **Hidratación y comidas regulares.** Con tanta actividad es fácil saltarse comidas. Mantener el ritmo evita el bajón.
- **Es una fase corta.** Dura poco, así que tampoco hace falta optimizarla obsesivamente. Simplemente, nótala.

Pensar en la ovulación como un pico que prepara la transición —y no como el estándar que deberías mantener todo el mes— te ahorra mucha frustración.`,
  },
  {
    slug: "fase-lutea-antojos",
    title: "Fase lútea: los antojos tienen sentido (no son un fallo)",
    content_type: "article",
    duration_minutes: 5,
    tags: ["ciclo-hormonal", "fase-lutea", "antojos", "hambre-emocional"],
    body_markdown: `Esta es la fase que más culpa genera —y la que menos lo merece. En los días previos a la regla, la progesterona domina, el metabolismo basal puede aumentar ligeramente, y es muy común que aparezcan más hambre, antojos (sobre todo de dulce o de carbohidratos) y cambios de ánimo.

Lo primero, y lo más importante: **no es falta de voluntad.** La evidencia asocia la fase lútea con un aumento real del apetito y con antojos específicos. Tu cuerpo está pidiendo, en parte, más energía. Pelearte con eso suele acabar en el ciclo culpa-restricción-atracón que tanto desgasta.

**Una forma más amable de vivirla:**

- **Come suficiente.** Restringir en lútea es contraproducente: el hambre real no atendida empuja al atracón. Comer regularmente y con sustancia suele calmar el descontrol.
- **Dale espacio al antojo, con compañía.** En vez de "prohibido el dulce", prueba el dulce acompañado de algo más estable —fruta con chocolate negro, yogur con un poco de miel y nueces—. Disfrutas y la energía no se desploma.
- **Magnesio y cuidado.** Algunas personas asocian el magnesio (cacao puro, frutos secos, hoja verde) con un alivio de la tensión premenstrual. No es mágico, pero puede acompañar.
- **Baja la autoexigencia.** Si esta semana cuesta más sostener los hábitos, no es retroceso. Es la fase. Trátate como tratarías a una amiga.

Entender la lútea cambia la relación con ella: de "la semana en que lo arruino todo" a "la semana en que mi cuerpo necesita otra cosa".`,
  },
  {
    slug: "fase-menstrual",
    title: "Menstruación: permiso para descansar",
    content_type: "article",
    duration_minutes: 3,
    tags: ["ciclo-hormonal", "menstruacion", "recuperacion", "hierro"],
    body_markdown: `Llega la regla y con ella, normalmente, el punto más bajo de energía del ciclo. El cuerpo está haciendo un trabajo interno importante. No es momento de exigirte como en la folicular —y reconocerlo no es debilidad, es inteligencia cíclica.

**Cómo acompañar estos días:**

- **Descanso sin culpa.** Si el cuerpo pide bajar el ritmo, bajarlo. El movimiento suave (caminar, estiramientos) suele sentar mejor que el entrenamiento intenso.
- **Hierro a la vista.** Con la pérdida de sangre, vale la pena cuidar las fuentes de hierro: legumbres, hoja verde, carne si la tomas. Acompañarlas de vitamina C (un cítrico, pimiento) puede ayudar a su absorción. Si sospechas déficit, coméntalo con tu profesional —no te suplementes por tu cuenta.
- **Comida que reconforte de verdad.** Caldos, guisos, platos calientes. La menstruación es buena ocasión para una alimentación que abraza, no que castiga.
- **Calor y amabilidad.** Una bolsa de calor, una infusión, descanso. Cuidarte estos días marca el tono del ciclo siguiente.

Pensar la menstruación como una fase de recuperación —no como un estorbo a superar— cambia por completo cómo la vives.`,
  },
  {
    slug: "ciclo-sincronizar-energia",
    title: "Sincroniza tu energía con tu ciclo",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["ciclo-hormonal", "energia", "movimiento", "planificacion"],
    body_markdown: `Ahora que conoces las cuatro fases, el ejercicio de esta etapa es práctico: empezar a planificar *con* tu ciclo en lugar de contra él.

Mira tu semana o tu mes y pregúntate, según la fase en la que estés:

- **Folicular / ovulatoria** (más energía): ¿qué cosa exigente puedo poner aquí? ¿Entrenamiento más fuerte, una tarea difícil, un compromiso social importante?
- **Lútea** (energía descendente): ¿qué puedo aligerar? ¿Dónde me doy más margen, más comida reconfortante, menos autoexigencia?
- **Menstrual** (energía baja): ¿dónde meto descanso real? ¿Qué puedo dejar preparado de antemano para no exigirme?

No se trata de organizar tu vida entera alrededor del ciclo —eso sería otra forma de rigidez—. Se trata de dejar de sorprenderte cada mes por algo que es predecible, y de tratarte de forma distinta según lo que tu cuerpo necesita en cada momento.

Esta semana, elige solo **una** cosa que vas a ajustar según tu fase actual. Una. Y obsérvala.`,
  },
  {
    slug: "ciclo-estado-animo",
    title: "Tu ánimo también es cíclico",
    content_type: "article",
    duration_minutes: 3,
    tags: ["ciclo-hormonal", "estado-animo", "emocional", "salud-mujer"],
    body_markdown: `No solo cambia tu energía a lo largo del mes. Tu estado de ánimo, tu sensibilidad, tu paciencia y tu forma de relacionarte con la comida también siguen el ritmo hormonal.

Muchas personas notan que en la fase lútea son más sensibles, más irritables o más propensas a comer emocionalmente. Y al saberlo, algo cambia: cuando reconoces que "hoy estoy más reactiva porque estoy en lútea", dejas de interpretar ese estado como un problema de tu carácter y empiezas a tratarlo como lo que es —una fase pasajera.

**Lo útil de observarlo:**

- **Anticipas en lugar de reaccionar.** Si sabes que se acercan los días más sensibles, puedes prepararte: bajar compromisos, cuidar el sueño, tener a mano tus herramientas de regulación.
- **Separas la emoción del juicio.** "Me siento desbordada" en lútea no significa que tu vida sea un desastre. Significa que es lútea.
- **Comunicas mejor.** Saber dónde estás te ayuda a explicarte —a ti misma y a quien te rodea.

Registrar tu ánimo junto con tu fase, durante un par de ciclos, te da un mapa personal valiosísimo. Y a tu profesional, un dato clínico que casi nunca se recoge.`,
  },
  {
    slug: "ciclo-consolidacion",
    title: "Cierre: tu mapa cíclico personal",
    content_type: "exercise",
    duration_minutes: 5,
    tags: ["ciclo-hormonal", "cierre", "evaluacion", "salud-mujer"],
    body_markdown: `Has recorrido un ciclo completo prestándole atención. Antes de cerrar, vamos a recoger lo aprendido —porque este mapa es tuyo y te va a servir mes a mes.

**Responde con lo que hayas observado:**

- ¿En qué fase tienes más energía? ¿Y menos?
- ¿Cuándo aparecen tus antojos más fuertes?
- ¿En qué fase te cuesta más sostener tus hábitos?
- ¿Qué fase vives mejor cuando te das permiso para descansar?
- ¿Qué ajuste de los que probaste te funcionó mejor?

**Y la pregunta que más importa:**

¿Ha cambiado algo en cómo te tratas a lo largo del mes? Pasar de "¿por qué no puedo ser constante?" a "mi cuerpo necesita cosas distintas según la fase" es, probablemente, el mayor logro de estas semanas.

El ciclo no se "domina" —se acompaña. Y ahora tienes un mapa para hacerlo. Compártelo con tu profesional para seguir afinándolo.

*Recuerda: cada cuerpo es distinto y estos patrones son tendencias, no reglas. Si algo no encaja con tu experiencia, tu experiencia tiene razón.*`,
  },
]

async function seed() {
  console.log(`Seeding ${ITEMS.length} items into content_library (Protocolo Ciclo Hormonal)…\n`)
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
