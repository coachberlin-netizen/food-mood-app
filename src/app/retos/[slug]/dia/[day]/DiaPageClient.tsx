'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AudioPlayer      from '@/components/retos/AudioPlayer'
import PsicobioticoCard from '@/components/retos/PsicobioticoCard'
import LecturaCard      from '@/components/retos/LecturaCard'
import RegistroDiario   from '@/components/retos/RegistroDiario'

const FASE_LABELS: Record<string, string> = {
  observar:         'Observar',
  activar:          'Activar',
  integrar:         'Integrar',
  estrobioma:       'Estrobioma',
  'fitoestrógenos': 'Fitoestrógenos',
  'detoxificación': 'Detoxificación',
  'consolidación':  'Consolidación',
}

interface Challenge {
  id:            string
  slug:          string
  title:         string
  color:         string
  emoji:         string
  duration_days: number
}

interface Enrollment {
  id:             string
  current_day:    number
  completed:      boolean
  fm_index_start: number | null
  paid:           boolean
}

interface RecipeData {
  fase?:         string
  semana?:       number
  hito?:         any | null
  idea_clara?: {
    titulo:          string
    texto:           string
    concepto_clave?: string
  }
  cambio_del_dia?: {
    titulo:       string
    instruccion?: string
    descripcion?: string
    por_que:      string
    duracion?:    string
  }
  receta?: {
    titulo:       string
    descripcion?: string
    opcion_a?:    { nombre: string; habitos: string[] }
    opcion_b?:    { nombre: string; habitos: string[] }
    por_que?:     string
  }
  psicobiotico?: {
    titulo:            string
    texto:             string
    alimento_estrella: string
  }
  audio?: {
    titulo:       string
    descripcion:  string
    duracion_min: number
    tipo:         string
    archivo:      string
  }
  lectura?: {
    titulo: string
    texto:  string
  }
  registro_diario?: {
    pregunta_manana: string
    pregunta_tarde:  string
    pregunta_noche:  string
  }
  ingredientes?:    string[]
  pasos?:           string[]
  beneficio_sueno?: string
  momento?:         string
  tiempo_min?:      number
}

interface ChallengeDay {
  id:          string
  day_number:  number
  title:       string
  tip:         string | null
  audio_url:   string | null
  recipe_data: RecipeData | null
}

interface Props {
  challenge:  Challenge
  enrollment: Enrollment
  dayContent: ChallengeDay
  dayNumber:  number
}

export default function DiaPageClient({ challenge, enrollment, dayContent, dayNumber }: Props) {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  const rd        = dayContent.recipe_data
  const fase      = rd?.fase ? (FASE_LABELS[rd.fase] ?? rd.fase) : null
  const isCurrent = dayNumber === enrollment.current_day && !enrollment.completed
  const isHito    = !!rd?.hito
  const pct       = Math.min(100, ((dayNumber - 1) / challenge.duration_days) * 100)
  const hasPrev   = dayNumber > 1
  const hasNext   = dayNumber < enrollment.current_day

  async function handleComplete() {
    startTransition(async () => {
      const res  = await fetch('/api/retos/complete-day', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ challenge_id: challenge.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setDone(true)
        setTimeout(() => {
          if (data.completed) {
            router.push(`/retos/${challenge.slug}`)
          } else {
            router.push(`/retos/${challenge.slug}/dia/${dayNumber + 1}`)
          }
        }, 1400)
      }
    })
  }

  return (
    <main className="min-h-screen" style={{ background: '#F5F0E8' }}>

      {/* ── Sticky nav ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e8ddd5]">
        <div className="max-w-[520px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/retos/${challenge.slug}`}
            className="text-[13px] font-medium no-underline flex items-center gap-1.5"
            style={{ color: challenge.color }}
          >
            ← {challenge.emoji}
          </Link>
          <span className="text-[13px] font-semibold" style={{ color: '#2d0f16' }}>
            Día {dayNumber} <span style={{ color: 'rgba(107,39,55,0.35)' }}>/ {challenge.duration_days}</span>
          </span>
          <span className="w-10" />
        </div>
        <div className="h-1 w-full" style={{ background: 'rgba(107,39,55,0.08)' }}>
          <div
            className="h-1 transition-all duration-500"
            style={{ width: `${Math.max(2, pct)}%`, background: challenge.color }}
          />
        </div>
      </div>

      {/* ── Contenido principal ── */}
      {isHito ? (

        // ════════════════════════════════════════════════════════
        // PANTALLA DE HITO — reemplaza el día normal
        // ════════════════════════════════════════════════════════
        <div className="max-w-[520px] mx-auto px-4 pt-6 pb-24 space-y-4">

          <HitoBanner
            hito={rd!.hito}
            semana={rd?.semana}
            dayNumber={dayNumber}
            durationDays={challenge.duration_days}
            color={challenge.color}
            emoji={challenge.emoji}
          />

          {rd?.registro_diario && (
            <RegistroDiario
              challengeId={challenge.id}
              dayNumber={dayNumber}
              preguntas={rd.registro_diario}
            />
          )}

          <CompleteAndNav
            isCurrent={isCurrent}
            done={done}
            isPending={isPending}
            dayNumber={dayNumber}
            durationDays={challenge.duration_days}
            currentDay={enrollment.current_day}
            slug={challenge.slug}
            color={challenge.color}
            isHito={true}
            onComplete={handleComplete}
          />

        </div>

      ) : (

        // ════════════════════════════════════════════════════════
        // DÍA NORMAL
        // ════════════════════════════════════════════════════════
        <div className="max-w-[520px] mx-auto px-4 pt-6 pb-24 space-y-4">

          {/* Fase + título */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {fase && (
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${challenge.color}18`, color: challenge.color }}
                >
                  {fase}
                </span>
              )}
              {rd?.semana && (
                <span
                  className="text-[10px] font-light uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(107,39,55,0.06)', color: 'rgba(107,39,55,0.5)' }}
                >
                  Semana {rd.semana}
                </span>
              )}
            </div>
            <h1 className="font-serif text-[22px] font-bold leading-snug" style={{ color: '#2d0f16' }}>
              {dayContent.title}
            </h1>
          </div>

          {/* Tip (fallback) */}
          {dayContent.tip && !rd?.idea_clara && (
            <div className="rounded-xl p-4 border-l-4 bg-white" style={{ borderLeftColor: challenge.color }}>
              <p className="text-sm font-light italic" style={{ color: '#2d0f16' }}>
                💡 {dayContent.tip}
              </p>
            </div>
          )}

          {/* Idea clara */}
          {rd?.idea_clara && (
            <div className="rounded-xl p-4 border-l-4 bg-white space-y-2" style={{ borderLeftColor: challenge.color }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: challenge.color }}>
                La idea de hoy
              </p>
              <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>
                {rd.idea_clara.titulo}
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.75)' }}>
                {rd.idea_clara.texto}
              </p>
              {rd.idea_clara.concepto_clave && (
                <span
                  className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(107,39,55,0.08)', color: '#6B2737' }}
                >
                  {rd.idea_clara.concepto_clave}
                </span>
              )}
            </div>
          )}

          {/* Cambio del día */}
          {rd?.cambio_del_dia && (
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: `${challenge.color}0d`, border: `1px solid ${challenge.color}28` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: challenge.color }}>
                Tu cambio de hoy
              </p>
              <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>
                {rd.cambio_del_dia.titulo}
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.75)' }}>
                {rd.cambio_del_dia.instruccion ?? rd.cambio_del_dia.descripcion}
              </p>
              <p className="text-xs font-light italic" style={{ color: 'rgba(107,39,55,0.5)' }}>
                ¿Por qué? {rd.cambio_del_dia.por_que}
              </p>
              {rd.cambio_del_dia.duracion && (
                <p className="text-[10px] font-medium" style={{ color: 'rgba(107,39,55,0.45)' }}>
                  ⏱ {rd.cambio_del_dia.duracion}
                </p>
              )}
            </div>
          )}

          {/* Receta con opciones */}
          {rd?.receta && <RecetaOpciones receta={rd.receta} color={challenge.color} />}

          {/* Receta tipo sueño */}
          {rd?.ingredientes && rd.ingredientes.length > 0 && (
            <div className="rounded-xl p-4 bg-white border border-[#e8ddd5] space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: challenge.color }}>
                Receta del día
              </p>
              {rd.momento && (
                <p className="text-xs" style={{ color: 'rgba(107,39,55,0.5)' }}>
                  {rd.momento}{rd.tiempo_min ? ` · ${rd.tiempo_min} min` : ''}
                </p>
              )}
              <ul className="space-y-1">
                {rd.ingredientes.map((ing, i) => (
                  <li key={i} className="text-sm font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
                    <span style={{ color: challenge.color }}>·</span> {ing}
                  </li>
                ))}
              </ul>
              {rd.pasos && rd.pasos.length > 0 && (
                <ol className="space-y-1.5">
                  {rd.pasos.map((paso, i) => (
                    <li key={i} className="text-sm font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
                      <span className="font-semibold shrink-0" style={{ color: challenge.color }}>{i + 1}.</span>
                      {paso}
                    </li>
                  ))}
                </ol>
              )}
              {rd.beneficio_sueno && (
                <p className="text-xs italic" style={{ color: 'rgba(107,39,55,0.5)' }}>
                  🌙 {rd.beneficio_sueno}
                </p>
              )}
            </div>
          )}

          {/* Psicobiótico */}
          {rd?.psicobiotico && (
            <PsicobioticoCard
              titulo={rd.psicobiotico.titulo}
              texto={rd.psicobiotico.texto}
              alimento_estrella={rd.psicobiotico.alimento_estrella}
            />
          )}

          {/* Audio */}
          {rd?.audio ? (
            <AudioPlayer
              titulo={rd.audio.titulo}
              descripcion={rd.audio.descripcion}
              duracion_min={rd.audio.duracion_min}
              tipo={rd.audio.tipo}
              archivo={rd.audio.archivo}
            />
          ) : dayContent.audio_url ? (
            <audio controls src={dayContent.audio_url} className="w-full rounded-lg" />
          ) : null}

          {/* Lectura */}
          {rd?.lectura && <LecturaCard titulo={rd.lectura.titulo} texto={rd.lectura.texto} />}

          {/* Registro diario */}
          {rd?.registro_diario && (
            <RegistroDiario
              challengeId={challenge.id}
              dayNumber={dayNumber}
              preguntas={rd.registro_diario}
            />
          )}

          <CompleteAndNav
            isCurrent={isCurrent}
            done={done}
            isPending={isPending}
            dayNumber={dayNumber}
            durationDays={challenge.duration_days}
            currentDay={enrollment.current_day}
            slug={challenge.slug}
            color={challenge.color}
            isHito={false}
            onComplete={handleComplete}
          />

        </div>
      )}
    </main>
  )
}

// ── HitoBanner ────────────────────────────────────────────────────────────────

function HitoBanner({
  hito, semana, dayNumber, durationDays, color, emoji,
}: {
  hito:         any
  semana?:      number
  dayNumber:    number
  durationDays: number
  color:        string
  emoji:        string
}) {
  const isFinal = dayNumber >= durationDays
  const nextSemana = semana ? semana + 1 : null

  const icon = isFinal ? '🏆' : '🎯'

  return (
    <div className="space-y-4">

      {/* Cabecera de celebración */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: `linear-gradient(160deg, ${color}18 0%, ${color}06 100%)`, border: `1px solid ${color}25` }}
      >
        <div className="text-5xl mb-3">{icon}</div>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color }}
        >
          {isFinal ? 'Reto completado' : semana ? `Semana ${semana} completada` : 'Hito alcanzado'}
        </p>
        <h2 className="font-serif text-[22px] font-bold leading-snug mb-3" style={{ color: '#2d0f16' }}>
          {hito.titulo}
        </h2>
        <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.7)' }}>
          {hito.descripcion}
        </p>
        {hito.reflexion && (
          <p className="text-sm italic mt-3" style={{ color: 'rgba(107,39,55,0.55)' }}>
            {hito.reflexion}
          </p>
        )}
      </div>

      {/* Mecanismos / logros activados */}
      {Array.isArray(hito.estadisticas?.mecanismos_activados) && (
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>
            {isFinal ? 'Lo que has activado' : 'Activado esta semana'}
          </p>
          <div className="flex flex-wrap gap-2">
            {(hito.estadisticas.mecanismos_activados as string[]).map((m: string, i: number) => (
              <span
                key={i}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                style={{ background: `${color}12`, color }}
              >
                ✓ {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Siguiente semana CTA (días intermedios) */}
      {!isFinal && nextSemana && (
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: `${color}08`, border: `1px dashed ${color}40` }}
        >
          <p className="text-[13px] font-medium" style={{ color: 'rgba(107,39,55,0.6)' }}>
            A continuación: <span className="font-semibold" style={{ color }}>Semana {nextSemana}</span>
          </p>
          <p className="text-xs font-light mt-1" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Marca el día como completado para desbloquearla
          </p>
        </div>
      )}

      {/* CTAs del informe (día final) */}
      {isFinal && hito.informe_personalizado && (
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color }}>
            {hito.informe_personalizado.titulo ?? 'Tu informe personalizado'}
          </p>
          <p className="text-[13px] font-light" style={{ color: 'rgba(107,39,55,0.65)' }}>
            {hito.informe_personalizado.descripcion}
          </p>
        </div>
      )}

    </div>
  )
}

// ── CompleteAndNav ────────────────────────────────────────────────────────────

function CompleteAndNav({
  isCurrent, done, isPending, dayNumber, durationDays,
  currentDay, slug, color, isHito, onComplete,
}: {
  isCurrent:    boolean
  done:         boolean
  isPending:    boolean
  dayNumber:    number
  durationDays: number
  currentDay:   number
  slug:         string
  color:        string
  isHito:       boolean
  onComplete:   () => void
}) {
  const hasPrev  = dayNumber > 1
  const hasNext  = dayNumber < currentDay
  const isFinal  = dayNumber >= durationDays

  const ctaLabel = done
    ? isFinal ? `🏆 Completado — volviendo al inicio…` : `✓ Completado — cargando día ${dayNumber + 1}…`
    : isHito && !isFinal
    ? `✓ Marcar completado · Empezar semana siguiente →`
    : '✓ Marcar día completado'

  return (
    <div className="space-y-3 pt-2">

      {/* Botón completado */}
      {isCurrent && (
        done ? (
          <div
            className="w-full py-3.5 rounded-xl text-[15px] font-semibold text-center"
            style={{ background: '#4A7C59', color: 'white' }}
          >
            {ctaLabel}
          </div>
        ) : (
          <button
            onClick={onComplete}
            disabled={isPending}
            className="w-full py-3.5 rounded-xl text-[15px] font-semibold transition-all hover:opacity-80 disabled:opacity-50"
            style={isHito
              ? { background: color, color: 'white' }
              : { border: `2px solid ${color}`, color }
            }
          >
            {isPending ? 'Guardando…' : ctaLabel}
          </button>
        )
      )}

      {/* Navegación ← / → */}
      <div className="flex gap-3">
        {hasPrev ? (
          <Link
            href={`/retos/${slug}/dia/${dayNumber - 1}`}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-center no-underline border border-[#e8ddd5] bg-white"
            style={{ color: 'rgba(107,39,55,0.6)' }}
          >
            ← Día {dayNumber - 1}
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {hasNext ? (
          <Link
            href={`/retos/${slug}/dia/${dayNumber + 1}`}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-center no-underline"
            style={{ background: color, color: 'white' }}
          >
            Día {dayNumber + 1} →
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>

    </div>
  )
}

// ── RecetaOpciones ────────────────────────────────────────────────────────────

function RecetaOpciones({ receta, color }: { receta: NonNullable<RecipeData['receta']>; color: string }) {
  const [tab, setTab] = useState<'a' | 'b'>('a')
  const current = tab === 'a' ? receta.opcion_a : receta.opcion_b

  return (
    <div className="rounded-xl bg-white border border-[#e8ddd5] p-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
        Tu protocolo permanente
      </p>
      <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>{receta.titulo}</p>
      {receta.descripcion && (
        <p className="text-[13px] font-light" style={{ color: 'rgba(107,39,55,0.65)' }}>
          {receta.descripcion}
        </p>
      )}
      {receta.opcion_a && receta.opcion_b && (
        <>
          <div className="flex gap-2">
            {(['a', 'b'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  background:  tab === t ? color : 'transparent',
                  borderColor: tab === t ? color : '#e8ddd5',
                  color:       tab === t ? 'white' : 'rgba(107,39,55,0.6)',
                }}
              >
                {t === 'a' ? receta.opcion_a?.nombre : receta.opcion_b?.nombre}
              </button>
            ))}
          </div>
          {current && (
            <ul className="space-y-1.5">
              {current.habitos.map((h, i) => (
                <li key={i} className="text-[13px] font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
                  <span className="font-semibold shrink-0" style={{ color }}>✓</span> {h}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {receta.por_que && (
        <p className="text-xs font-light italic" style={{ color: 'rgba(107,39,55,0.5)' }}>
          {receta.por_que}
        </p>
      )}
    </div>
  )
}
