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
    slug: "evaluacion-estres-hpa",
    title: "¿Cómo responde tu cuerpo al estrés? Evaluación inicial",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["cortisol", "estres", "evaluacion", "eje-hpa"],
    body_markdown: `Antes de empezar, vale la pena saber de dónde partes. Estas ocho preguntas no diagnostican nada —son una foto de cómo te sientes estos días. Las repetirás al final del protocolo para comparar.

Responde cada una pensando en las **últimas dos semanas**, del 0 al 4:

*0 = nunca · 1 = rara vez · 2 = a veces · 3 = a menudo · 4 = casi siempre*

1. Me despierto cansada aunque haya dormido suficiente.
2. Tengo más energía por la noche que por la mañana.
3. Aparecen antojos de azúcar o de salado, sobre todo por la tarde.
4. Me cuesta conciliar el sueño, o me despierto a media noche.
5. Me siento irritable o reacciono con más intensidad de la que querría.
6. Me cuesta "desconectar": esa sensación de ir siempre acelerada.
7. Mi digestión se altera en momentos de tensión.
8. Noto tensión física acumulada: mandíbula, cuello, hombros.

Suma tu puntuación (de 0 a 32). No es una nota ni un veredicto: es tu punto de partida. Tu profesional lo verá y lo tendrá en cuenta para acompañarte mejor. Dentro de cuatro semanas volverás a estas mismas preguntas, y ahí es donde se ve lo interesante: el cambio.

*Esta evaluación es una herramienta de auto-observación, no un diagnóstico. Cualquier interpretación clínica corresponde a tu profesional.*`,
  },
  {
    slug: "alimentacion-cortisol-intro",
    title: "Por qué el estrés crónico le pone freno a tu alimentación",
    content_type: "article",
    duration_minutes: 4,
    tags: ["cortisol", "estres", "nutricion", "eje-intestino-cerebro"],
    body_markdown: `Puedes tener el mejor plan nutricional del mundo y aun así sentir que algo no termina de encajar. A menudo ese "algo" tiene nombre: estrés sostenido.

El cortisol es una hormona que tu cuerpo libera para ayudarte a responder a las demandas del día. En su justa medida es tu aliado: te despierta por la mañana, te da empuje cuando lo necesitas. El problema aparece cuando el estrés no da tregua y el cortisol se queda elevado más tiempo del que debería.

Cuando eso ocurre de forma prolongada, la evidencia sugiere que pueden pasar varias cosas a la vez: aumentan los antojos —sobre todo de azúcar y de alimentos muy palatables—, se altera la sensación de hambre y saciedad, cuesta más dormir, y el cuerpo tiende a un estado de inflamación de bajo grado. Todo eso hace que el mismo plan que "debería" funcionar se vuelva mucho más difícil de sostener.

La buena noticia: el eje del estrés —lo que los profesionales llaman eje HPA— responde a cosas concretas y cotidianas. La forma en que empiezas la mañana, lo que comes en los momentos de tensión, cómo respiras, a qué hora apagas las pantallas. No hace falta revolucionar tu vida. Se trata de pequeños ajustes que, juntos, le mandan a tu sistema nervioso una señal distinta: *puedes bajar la guardia*.

Eso es exactamente lo que vas a trabajar en las próximas cuatro semanas. No es una dieta más. Es enseñarle a tu cuerpo a regularse, para que la nutrición —y todo lo demás— se ordene mejor.`,
  },
  {
    slug: "alimentos-adaptogenos",
    title: "Alimentos que acompañan la regulación del cortisol",
    content_type: "article",
    duration_minutes: 5,
    tags: ["cortisol", "adaptogenos", "antiinflamatorio", "nutricion"],
    body_markdown: `No existe un alimento mágico que "baje el cortisol". Pero sí hay nutrientes y alimentos que la evidencia asocia con una mejor respuesta al estrés, y que vale la pena tener más presentes estas semanas.

**Magnesio.** Se le llama a veces "el mineral de la calma" porque participa en la regulación del sistema nervioso. Está en las verduras de hoja verde, el cacao puro, las legumbres, los frutos secos y las semillas de calabaza.

**Omega-3.** Se asocia con un perfil más antiinflamatorio. Lo encuentras en el pescado azul (sardina, caballa, salmón), las nueces y las semillas de lino o chía.

**Vitamina C.** Las glándulas que producen cortisol la consumen con avidez en momentos de estrés. Pimiento, kiwi, cítricos, fresas, perejil.

**Proteína en el desayuno.** Empezar el día con proteína —huevo, yogur, kéfir, legumbre, tofu— ayuda a estabilizar la energía y a moderar los antojos de media tarde.

**Fermentados.** Kéfir, yogur, vinagre de manzana, verduras fermentadas. Cuidar la microbiota es cuidar también el eje intestino-cerebro, tan implicado en cómo gestionamos el estrés.

**Sobre los adaptógenos** (ashwagandha, rhodiola, maca): son plantas que tradicionalmente se asocian con la modulación del estrés, y la investigación sobre ellas crece. Pero no son inofensivos por ser "naturales": pueden interactuar con medicación y no están indicados en embarazo, lactancia ni en algunas condiciones de tiroides. **Habla siempre con tu profesional antes de incorporarlos.**

La idea no es añadir veinte cosas nuevas. Es elegir una o dos de esta lista que te apetezcan de verdad y hacerles un hueco. El placer también regula.`,
  },
  {
    slug: "antiinflamatorio-estres",
    title: "Tres ajustes para las semanas de mucho estrés",
    content_type: "exercise",
    duration_minutes: 3,
    tags: ["cortisol", "antiinflamatorio", "protocolo"],
    body_markdown: `Cuando el estrés aprieta, lo último que necesitas es un plan complicado. Aquí tienes tres ajustes sencillos para sostener estos días. Elige el que te resulte más fácil y empieza por ahí.

**1. Desayuna con proteína.** Antes que el café en ayunas y la prisa, intenta algo con proteína en la primera hora: un par de huevos, yogur o kéfir con semillas, hummus con tostada. Ayuda a que la energía no se desplome a media mañana —y a que el antojo de las cinco de la tarde llegue más suave.

**2. Suaviza el azúcar rápido.** No se trata de prohibir nada. Se trata de notar los momentos en que el azúcar entra como "parche" del estrés, y de acompañarlo con algo más estable: fruta con un puñado de frutos secos, chocolate negro en lugar de bollería. El pico y la caída de glucosa y el cortisol elevado se retroalimentan; suavizar uno ayuda con el otro.

**3. Magnesio antes de dormir.** Una cena que incluya verdura de hoja, legumbre o un poco de cacao puro. Para algunas personas, este pequeño gesto se asocia con un descanso más reparador.

No tienes que hacer los tres a la vez. Un ajuste sostenido vale más que tres abandonados en dos días.`,
  },
  {
    slug: "respiracion-vagal",
    title: "Respiración 4-7-8: cinco minutos para bajar revoluciones",
    content_type: "exercise",
    duration_minutes: 5,
    tags: ["cortisol", "nervio-vago", "regulacion", "respiracion"],
    body_markdown: `Tu respiración es uno de los pocos accesos directos que tienes al sistema nervioso. Cuando alargas la exhalación, le mandas a tu cuerpo una señal de seguridad a través del nervio vago. Es gratis, no necesitas nada, y puedes hacerlo en cualquier sitio.

**La técnica 4-7-8:**

1. Siéntate cómoda, con la espalda apoyada.
2. Suelta todo el aire por la boca, sin prisa.
3. Inhala por la nariz contando hasta **4**.
4. Retén el aire contando hasta **7**.
5. Exhala por la boca, despacio, contando hasta **8**.
6. Repite el ciclo **cuatro veces**.

Lo importante no es la precisión matemática —si 4-7-8 te marea, prueba 4-4-6. Lo que cuenta es que la exhalación sea más larga que la inhalación. Ahí está la magia.

**Cuándo usarla:** al despertar, antes de comer en un momento de tensión, o cuando notes que vas "acelerada". Si la conviertes en un microhábito de las próximas semanas, puede convertirse en tu botón de pausa.

*Si en algún momento sientes mareo o incomodidad, vuelve a tu respiración normal. No hay que forzar nada.*`,
  },
  {
    slug: "rutina-manana-cortisol",
    title: "Tus primeros 10 minutos: trabaja a favor de tu cortisol matutino",
    content_type: "exercise",
    duration_minutes: 4,
    tags: ["cortisol", "manana", "cronobiologia", "rutina"],
    body_markdown: `El cortisol tiene un pico natural al despertar —se llama *cortisol awakening response*— y está bien que lo tenga: es lo que te pone en marcha. El truco no es eliminarlo, sino acompañarlo en lugar de pelearte con él.

Estos primeros diez minutos marcan el tono del día. Una propuesta sencilla:

**Minuto 1-2: luz natural.** Antes que la pantalla, asómate a la ventana o sal un momento. La luz de la mañana ayuda a ordenar tu reloj interno y, con él, el ritmo del cortisol a lo largo del día.

**Minuto 3-5: movimiento suave.** Estiramientos, unos pasos, lo que te apetezca. No es ejercicio intenso —es decirle al cuerpo "ya estamos despiertas".

**Minuto 6-10: hidratación y proteína a la vista.** Un vaso de agua y tener pensado un desayuno con proteína. No hace falta comer ya mismo, solo no dejarlo al azar del antojo.

**Lo que conviene evitar:** abrir el móvil y entrar en el scroll antes de hacer nada de lo anterior. Empezar el día con un chute de información y notificaciones le añade leña al pico de cortisol justo cuando podrías estar canalizándolo a tu favor.

No tiene que ser perfecto ni todos los días. Pero si lo conviertes en tu ritual de estas semanas, puede que notes la diferencia en cómo llegas a la tarde.`,
  },
  {
    slug: "higiene-sueno-cortisol",
    title: "Dormir mal te hace comer peor (y no es falta de voluntad)",
    content_type: "article",
    duration_minutes: 4,
    tags: ["cortisol", "sueno", "cronobiologia", "hambre-emocional"],
    body_markdown: `Si alguna vez has notado que después de una mala noche tienes más hambre, más antojos y menos paciencia, no te lo estás inventando. Tiene una explicación.

El sueño y las hormonas del apetito están muy conectados. Cuando duermes poco o mal, la evidencia sugiere que se altera el equilibrio entre la **grelina** (la hormona que te dice "tengo hambre") y la **leptina** (la que te dice "ya estoy saciada"). El resultado: más hambre, más antojo de alimentos muy energéticos, y menos señal de freno. A eso se suma un cortisol que tiende a quedarse más alto. No es falta de fuerza de voluntad: es bioquímica.

Por eso, cuidar el sueño no es un "extra" del protocolo —es parte del trabajo nutricional.

**Cinco ajustes que se asocian con un mejor descanso:**

- **Luz tenue en la última hora.** Bajar la intensidad de las luces y reducir pantallas le indica a tu cuerpo que se acerca la hora.
- **Cena que no pese.** Ni demasiado tarde ni demasiado copiosa; algo con proteína y verdura suele sentar bien.
- **Cafeína con horario.** Para muchas personas, dejar el café a primera hora de la tarde ayuda. La cafeína tarda en irse.
- **Temperatura fresca.** El cuerpo concilia mejor el sueño en un ambiente algo más fresco.
- **Una rutina de cierre.** Repetir cada noche una pequeña secuencia (infusión, lectura, respiración) le enseña al cuerpo a desconectar.

No hace falta aplicarlos todos. Empieza por el que te resulte más fácil esta semana.`,
  },
  {
    slug: "cronobiologia-comidas",
    title: "Cronobiología: no solo importa qué comes, también cuándo",
    content_type: "article",
    duration_minutes: 4,
    tags: ["cronobiologia", "cortisol", "horarios", "metabolismo"],
    body_markdown: `Tu cuerpo no funciona igual a las nueve de la mañana que a las once de la noche. Tienes un reloj interno —ritmo circadiano— que regula la energía, las hormonas, la digestión y hasta cómo procesas lo que comes. La cronobiología estudia precisamente eso: cómo el *cuándo* influye tanto como el *qué*.

En relación con el cortisol y el metabolismo, la evidencia apunta a algunas ideas útiles:

**La mañana es buen momento para comer.** Tu cuerpo tiende a gestionar mejor la energía en las primeras horas del día, cuando el cortisol está naturalmente más alto. Un desayuno con sustancia suele acompañar bien ese ritmo.

**La noche pide ligereza.** A medida que avanza el día, el cuerpo se prepara para descansar. Cenas muy tardías o muy copiosas pueden interferir tanto con el sueño como con la regulación hormonal.

**La regularidad ayuda.** Comer a horas más o menos consistentes le da a tu reloj interno una referencia estable. No se trata de rigidez militar, sino de evitar el caos total de horarios que desorienta al cuerpo.

**La luz también cuenta.** Comer de día, con luz natural, está más alineado con tu biología que hacerlo de madrugada con luz artificial.

Nada de esto es una regla absoluta —tu vida, tu trabajo y tus circunstancias mandan. Pero si puedes mover algunas piezas hacia este patrón, puede que tu energía y tu descanso lo agradezcan.`,
  },
  {
    slug: "consolidacion-protocolo",
    title: "Semana final: ¿qué ha cambiado en estas cuatro semanas?",
    content_type: "exercise",
    duration_minutes: 5,
    tags: ["cortisol", "evaluacion", "cierre", "protocolo"],
    body_markdown: `Has llegado a la última etapa. Antes de cerrar, vale la pena mirar atrás —no para juzgarte, sino para reconocer lo que ha cambiado.

**Primero, vuelve a las ocho preguntas del inicio.** Respóndelas otra vez pensando en las últimas dos semanas, del 0 al 4:

1. Me despierto cansada aunque haya dormido suficiente.
2. Tengo más energía por la noche que por la mañana.
3. Aparecen antojos de azúcar o de salado, sobre todo por la tarde.
4. Me cuesta conciliar el sueño, o me despierto a media noche.
5. Me siento irritable o reacciono con más intensidad de la que querría.
6. Me cuesta "desconectar": esa sensación de ir siempre acelerada.
7. Mi digestión se altera en momentos de tensión.
8. Noto tensión física acumulada: mandíbula, cuello, hombros.

Suma tu puntuación y compárala con la del primer día. Tu profesional verá ambas.

**Después, una reflexión breve.** Responde con sinceridad, sin filtros:

- ¿Qué cambio notas más, aunque sea pequeño?
- ¿Qué hábito de estas semanas te ha resultado más fácil de mantener?
- ¿Cuál te ha costado más?
- ¿Qué te gustaría seguir cuidando a partir de ahora?

No importa si la puntuación bajó mucho, poco o nada. El estrés no se "arregla" en cuatro semanas —se aprende a regular, y eso es un camino. Lo que has empezado aquí puede seguir contigo. Habla con tu profesional sobre cómo continuar.`,
  },
]

async function seed() {
  console.log(`Seeding ${ITEMS.length} items into content_library (Protocolo Cortisol)…\n`)
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
