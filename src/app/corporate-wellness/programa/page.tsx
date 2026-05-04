import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

const PASSWORD = 'FOODMOOD2026'
const COOKIE   = 'cw_programa_auth'

async function verifyPassword(formData: FormData) {
  'use server'
  const cookieStore = await cookies()
  if (formData.get('password') === PASSWORD) {
    cookieStore.set(COOKIE, 'true', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      maxAge:   60 * 60 * 24 * 7,
    })
    redirect('/corporate-wellness/programa')
  }
  redirect('/corporate-wellness/programa?error=1')
}

const DAYS = [
  {
    day: 1, title: 'Energía estable desde el primer café',
    goal: 'Evitar el pico y bajón de media mañana.',
    ciencia: 'La variabilidad glucémica, no el nivel medio, es lo que más impacta en el foco y el ánimo durante la jornada laboral. Un desayuno con fibra, proteína y grasa buena aplana esa curva y mantiene la glucosa estable durante 3-4 horas.',
    concepto: 'Variabilidad glucémica',
    am: { nombre: 'Bowl de kéfir con avena y frutos rojos', ingredientes: ['150 ml de kéfir natural', '4 cucharadas de avena en copos', '80 g de frutos rojos', '1 cdta de semillas de chía', '1 pizca de canela'], tiempo: '3 min' },
    pm: { nombre: 'Palitos de zanahoria con hummus y aceite de oliva', ingredientes: ['100 g de zanahorias baby', '3 cucharadas de hummus', '1 chorrito de aceite de oliva', '1 pizca de pimentón ahumado'], tiempo: '2 min' },
    habito: '3 respiraciones lentas antes del primer café (4-4-6). Reduce el cortisol matutino.',
    audio: 'La glucosa que no ves pero que decide tu tarde (6 min)',
    audioFile: null,
  },
  {
    day: 2, title: 'Focus limpio sin sobredosis de cafeína',
    goal: 'Claridad mental sin el crash de adenosina.',
    ciencia: 'La cafeína bloquea receptores de adenosina pero no elimina el cansancio: lo pospone. Cuando el efecto pasa, la adenosina llena todos los receptores a la vez. La L-teanina del té verde produce el mismo estado de alerta con una transición mucho más suave.',
    concepto: 'Adenosina y L-teanina',
    am: { nombre: 'Manzana con crema de almendra y canela', ingredientes: ['1 manzana mediana (con piel)', '2 cucharadas de crema de almendra 100%', '1 pizca de canela', '1 pizca de sal marina'], tiempo: '3 min' },
    pm: { nombre: 'Nueces con chocolate negro 85%', ingredientes: ['25–30 g de nueces', '2–3 onzas de chocolate negro 85%'], tiempo: '1 min' },
    habito: '25 minutos de trabajo en monotarea sin notificaciones (técnica Pomodoro con base neurocientífica).',
    audio: 'La trampa de la cafeína y cómo salir de ella (7 min)',
    audioFile: 'dia02-cafeina-focus.mp3',
  },
  {
    day: 3, title: 'Calma bajo presión de reuniones y deadlines',
    goal: 'Regular la respuesta al estrés a través del eje HPA.',
    ciencia: 'Bajo estrés agudo, el cortisol eleva la glucosa para una respuesta de emergencia que nunca llega. La dopamina cae y el cuerpo busca recompensas rápidas: azúcar, sal, ultraprocesados. Los alimentos ricos en magnesio y triptófano actúan sobre el eje HPA desde dentro.',
    concepto: 'Eje HPA y cortisol',
    am: { nombre: 'Plátano maduro con nueces y cacao', ingredientes: ['1 plátano maduro', '20 g de nueces', '1 cdta de cacao puro en polvo'], tiempo: '2 min' },
    pm: { nombre: 'Tostada de centeno con aguacate y limón', ingredientes: ['1–2 crackers de centeno', '½ aguacate maduro', 'Zumo de ½ limón', 'Sal marina y pimienta'], tiempo: '3 min' },
    habito: 'Pausa de 90 segundos antes de responder mensajes difíciles. La neurociencia muestra que una emoción dura ~90 segundos si no la alimentamos con pensamiento rumiativo.',
    audio: 'Qué le pasa a tu cerebro en un deadline (8 min)',
    audioFile: 'dia03-estres-cortisol.mp3',
  },
  {
    day: 4, title: 'El anti-bajón de las 16:00',
    goal: 'Neutralizar el trough circadiano de media tarde.',
    ciencia: 'Entre las 14:00 y las 16:00 ocurre una ventana natural de somnolencia relacionada con el ritmo circadiano — independientemente de cuánto hayas dormido. Un snack de bajo índice glucémico con proteína a las 15:30 estabiliza la glucosa y suaviza ese trough.',
    concepto: 'Trough circadiano',
    am: { nombre: 'Huevo cocido con tomate cherry y aceite de oliva', ingredientes: ['1–2 huevos cocidos', '8–10 tomates cherry', '1 cdta de aceite de oliva', 'Sal, pimienta y orégano'], tiempo: '10 min' },
    pm: { nombre: 'Kéfir bebible con canela y semillas de calabaza', ingredientes: ['150 ml de kéfir bebible', '1 cucharada de semillas de calabaza', '1 pizca de canela'], tiempo: '2 min' },
    habito: 'Caminar 5 minutos después de comer. Reduce el pico glucémico posprandial hasta un 30% y acelera el retorno al foco.',
    audio: 'Por qué las 16:00 son el enemigo y cómo ganarles (7 min)',
    audioFile: 'dia04-bajon-tarde-circadiano.mp3',
  },
  {
    day: 5, title: 'Creatividad y ánimo: el cerebro en modo flujo',
    goal: 'Favorecer el estado de flow y la flexibilidad mental.',
    ciencia: 'El estado de flujo está asociado a niveles elevados de anandamida. El cacao puro contiene inhibidores naturales de la FAAH — la enzima que degrada la anandamida — lo que prolonga el tiempo disponible de este endocannabinoide del placer y la creatividad.',
    concepto: 'Anandamida y FAAH',
    am: { nombre: 'Tostada integral con tahini y miel cruda', ingredientes: ['1 rebanada de pan integral de masa madre', '1,5 cucharadas de tahini', '1 cdta de miel cruda', '1 pizca de sal marina'], tiempo: '4 min' },
    pm: { nombre: 'Bowl de frutos rojos con semillas de calabaza y cacao', ingredientes: ['100 g de frutos rojos', '1 cucharada de semillas de calabaza', '1 cdta de cacao puro en polvo', '1 pizca de canela'], tiempo: '2 min' },
    habito: 'Escribir una idea antes de revisar el correo. El acto de generar antes de consumir activa el modo creativo del cerebro durante las horas siguientes.',
    audio: 'La química del estado de flujo en el trabajo (8 min)',
    audioFile: 'dia05-flujo-creatividad.mp3',
  },
  {
    day: 6, title: 'Recuperación: bajar la carga mental acumulada',
    goal: 'Acelerar la depuración de glutamato cognitivo.',
    ciencia: 'La fatiga cognitiva está asociada a la acumulación de glutamato en la corteza prefrontal. El movimiento suave aumenta el BDNF, y los alimentos fermentados modulan el sistema nervioso autónomo a través del nervio vago, activando el modo parasimpático de recuperación.',
    concepto: 'Fatiga de glutamato y nervio vago',
    am: { nombre: 'Smoothie verde energizante', ingredientes: ['1 puñado de espinacas baby (30 g)', '1 manzana pequeña', 'Zumo de ½ limón', '1 cm de jengibre fresco', '150 ml de agua fría o kéfir'], tiempo: '4 min' },
    pm: { nombre: 'Aceitunas con queso fresco y orégano', ingredientes: ['10–12 aceitunas negras o verdes', '60 g de queso fresco', '1 chorrito de aceite de oliva', 'Orégano y pimienta negra'], tiempo: '2 min' },
    habito: 'Cerrar el día con dos frases: "qué me drenó hoy" y "qué me dio energía hoy". Reduce la rumiación nocturna y mejora la calidad del sueño.',
    audio: 'Cómo limpiar tu cerebro sin dormir: la ciencia del descanso activo (7 min)',
    audioFile: 'dia06-recuperacion-cerebro.mp3',
  },
  {
    day: 7, title: 'Reset inteligente: detecta tus patrones',
    goal: 'Leer el índice Food·Mood e identificar el patrón personal.',
    ciencia: 'La cronobiología nutricional muestra que el mismo alimento tiene un efecto metabólico diferente según la hora en que se consume. El índice Food·Mood correlaciona alimento, momento del día, nivel de estrés y estado de ánimo. 7 días de datos son suficientes para detectar el patrón personal.',
    concepto: 'Cronobiología nutricional personal',
    am: { nombre: 'Bowl de kéfir con semillas y cacao puro', ingredientes: ['150 ml de kéfir natural', '1 cucharada de semillas de calabaza', '1 cucharada de semillas de chía', '1 cdta de cacao puro', '1 cdta de miel cruda (opcional)'], tiempo: '3 min' },
    pm: { nombre: 'Edamame o garbanzos tostados con especias', ingredientes: ['100 g de edamame descongelado o garbanzos cocidos', '1 cdta de aceite de oliva', 'Sal, comino y pimentón ahumado'], tiempo: '5 min' },
    habito: 'Revisar el índice Food·Mood de la semana: ¿qué días puntúas más alto? ¿qué tenían en común? ¿qué micro-hábito cumpliste más días?',
    audio: 'Tu protocolo personal: qué aprendiste esta semana (10 min)',
    audioFile: 'dia07-patron-personal.mp3',
  },
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const AUDIO_BASE = `${SUPABASE_URL}/storage/v1/object/public/retos-audio/audio/corporate`

const LISTA_COMPRA = {
  'Base fresca': ['Kéfir bebible o yogur natural (500 ml)', 'Frutos rojos frescos o congelados (300 g)', 'Manzanas (4–5)', 'Plátanos (3–4)', 'Zanahorias baby (200 g)', 'Pepino (1)', 'Tomates cherry (200 g)', 'Aguacate maduro (2)', 'Espinacas baby (100 g)', 'Limones (3)', 'Jengibre fresco (1 trozo)'],
  'Proteína y saciedad': ['Hummus clásico (200 g)', 'Huevos (4–6)', 'Edamame congelado o garbanzos cocidos (200 g)', 'Queso fresco o requesón (150 g)'],
  'Grasas buenas': ['Nueces (150 g)', 'Semillas de chía (100 g)', 'Semillas de calabaza (100 g)', 'Crema de almendra 100% (200 g)', 'Tahini (100 g)', 'Aceite de oliva virgen extra', 'Aceitunas (1 bote)'],
  'Energía estable': ['Avena en copos finos (250 g)', 'Crackers de centeno o arroz (1 paquete)', 'Pan integral de masa madre', 'Cacao puro sin azúcar (100 g)', 'Chocolate negro 85% (1 tableta)', 'Canela molida', 'Miel cruda (50 g)'],
}

export default async function CorporateWellnessProgramaPage() {
  const cookieStore = await cookies()
  const isAuthorized = cookieStore.get(COOKIE)?.value === 'true'

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="rounded-3xl p-10 max-w-sm w-full text-center" style={{ backgroundColor: '#F5F0E8' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#C9A84C' }}>
            Acceso privado
          </p>
          <h1 className="font-serif text-2xl font-bold mb-2" style={{ color: '#2d0f16' }}>
            Food·Mood for Work
          </h1>
          <p className="text-sm font-light mb-8" style={{ color: 'rgba(107,39,55,0.55)' }}>
            Programa completo — contenido para propuestas de empresa
          </p>
          <form action={verifyPassword} className="space-y-3">
            <input
              type="password"
              name="password"
              placeholder="Código de acceso"
              autoComplete="off"
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2"
              style={{ borderColor: 'rgba(107,39,55,0.15)', backgroundColor: 'white', color: '#2d0f16' }}
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#2d0f16' }}
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>

      {/* ── Header ── */}
      <div className="py-10 px-6 text-center border-b" style={{ backgroundColor: '#2d0f16', borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#C9A84C' }}>
          Food·Mood for Work · Documento interno
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2" style={{ color: '#F5F0E8' }}>
          7-Day Focus Snack Challenge
        </h1>
        <p className="text-sm font-light" style={{ color: 'rgba(245,240,232,0.45)' }}>
          Programa completo · Para uso en propuestas y reuniones con empresas
        </p>
      </div>

      {/* ── Lista de compra ── */}
      <section className="py-12 px-6" style={{ backgroundColor: '#2d0f16' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-8 text-center" style={{ color: '#C9A84C' }}>
            Lista de compra semanal · Para el equipo
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(LISTA_COMPRA).map(([cat, items]) => (
              <div key={cat} className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>
                  {cat}
                </p>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="text-xs font-light flex items-start gap-1.5" style={{ color: 'rgba(245,240,232,0.6)' }}>
                      <span style={{ color: '#4A7B6B' }}>·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Los 7 días al detalle ── */}
      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {DAYS.map((d) => (
            <div key={d.day} className="rounded-3xl overflow-hidden border" style={{ backgroundColor: 'white', borderColor: 'rgba(107,39,55,0.08)' }}>

              {/* Cabecera del día */}
              <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-serif text-xs font-black text-white" style={{ backgroundColor: '#4A7B6B' }}>
                    {d.day}
                  </span>
                  <p className="font-bold text-base" style={{ color: '#2d0f16' }}>{d.title}</p>
                </div>
                <p className="text-xs font-light ml-10" style={{ color: 'rgba(107,39,55,0.45)' }}>{d.goal}</p>
              </div>

              {/* Ciencia */}
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(107,39,55,0.07)', backgroundColor: '#FEFBF4' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>
                  La ciencia de hoy
                </p>
                <p className="text-sm font-light leading-relaxed mb-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
                  {d.ciencia}
                </p>
                <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(107,39,55,0.07)', color: '#6B2737' }}>
                  {d.concepto}
                </span>
              </div>

              {/* Snacks */}
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
                {[
                  { label: 'Snack AM', data: d.am, color: '#4A7B6B' },
                  { label: 'Snack PM', data: d.pm, color: '#4A7B6B' },
                ].map(({ label, data, color }) => (
                  <div key={label} className="px-6 py-4 border-t" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
                        {label}
                      </p>
                      <span className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.35)' }}>{data.tiempo}</span>
                    </div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#2d0f16' }}>{data.nombre}</p>
                    <ul className="space-y-1">
                      {data.ingredientes.map((ing) => (
                        <li key={ing} className="text-xs font-light flex gap-1.5" style={{ color: 'rgba(107,39,55,0.6)' }}>
                          <span style={{ color }}>·</span> {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Micro-hábito + audio */}
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-t" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
                <div className="px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C9A84C' }}>
                    Micro-hábito
                  </p>
                  <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.7)' }}>
                    {d.habito}
                  </p>
                </div>
                <div className="px-6 py-4 border-t sm:border-t-0" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(107,39,55,0.35)' }}>
                    Audio del día
                  </p>
                  <p className="text-xs font-light mb-3 leading-snug" style={{ color: 'rgba(107,39,55,0.6)' }}>
                    {d.audio}
                  </p>
                  {d.audioFile ? (
                    <audio
                      controls
                      preload="none"
                      src={`${AUDIO_BASE}/${d.audioFile}`}
                      className="w-full"
                      style={{ height: 36, accentColor: '#4A7B6B' }}
                    >
                      Tu navegador no soporta audio HTML5.
                    </audio>
                  ) : (
                    <p className="text-[10px] italic" style={{ color: 'rgba(107,39,55,0.3)' }}>
                      Audio próximamente disponible
                    </p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── Footer interno ── */}
      <div className="py-8 px-6 text-center border-t" style={{ borderColor: 'rgba(107,39,55,0.07)' }}>
        <p className="text-xs font-light mb-3" style={{ color: 'rgba(107,39,55,0.35)' }}>
          Documento interno Food·Mood · No distribuir públicamente
        </p>
        <a
          href="mailto:info@food-mood.app?subject=Propuesta%20Corporate%20Wellness"
          className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:opacity-80"
          style={{ color: '#4A7B6B' }}
        >
          info@food-mood.app <ArrowRight size={14} />
        </a>
      </div>

    </main>
  )
}
