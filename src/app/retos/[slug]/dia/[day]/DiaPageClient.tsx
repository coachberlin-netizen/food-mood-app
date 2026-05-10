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
    titulo:        string
    descripcion?:  string
    ingredientes?: string[]
    pasos?:        string[]
    opcion_a?:     { nombre: string; habitos: string[] }
    opcion_b?:     { nombre: string; habitos: string[] }
    por_que?:      string
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
  meditacion?: {
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
  snack_am?: {
    nombre:       string
    ingredientes: string[]
    pasos:        string[]
    por_que:      string
    tiempo_min:   number
    dificultad:   string
  }
  snack_pm?: {
    nombre:       string
    ingredientes: string[]
    pasos:        string[]
    por_que:      string
    tiempo_min:   number
    dificultad:   string
  }
  micro_habito?: {
    titulo:      string
    instruccion: string
    duracion:    string
  }
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
              <ShareButtons
                titulo={dayContent.title}
                ingredientes={rd.ingredientes}
                pasos={rd.pasos}
                color={challenge.color}
              />
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

          {/* Meditación */}
          {rd?.meditacion && (
            <AudioPlayer
              titulo={rd.meditacion.titulo}
              descripcion={rd.meditacion.descripcion}
              duracion_min={rd.meditacion.duracion_min}
              tipo={rd.meditacion.tipo}
              archivo={rd.meditacion.archivo}
            />
          )}

          {/* Lectura */}
          {rd?.lectura && <LecturaCard titulo={rd.lectura.titulo} texto={rd.lectura.texto} />}

          {/* Snack AM (corporate wellness) */}
          {rd?.snack_am && (
            <SnackCard snack={rd.snack_am} label="Snack de mañana" color={challenge.color} />
          )}

          {/* Snack PM (corporate wellness) */}
          {rd?.snack_pm && (
            <SnackCard snack={rd.snack_pm} label="Snack de tarde" color={challenge.color} />
          )}

          {/* Micro-hábito (corporate wellness) */}
          {rd?.micro_habito && (
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: `${challenge.color}0d`, border: `1px solid ${challenge.color}28` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: challenge.color }}>
                Micro-hábito de hoy
              </p>
              <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>
                {rd.micro_habito.titulo}
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.75)' }}>
                {rd.micro_habito.instruccion}
              </p>
              <p className="text-[10px] font-medium" style={{ color: 'rgba(107,39,55,0.45)' }}>
                ⏱ {rd.micro_habito.duracion}
              </p>
            </div>
          )}

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

// ── ShareButtons ──────────────────────────────────────────────────────────────

function ShareButtons({
  titulo,
  ingredientes,
  pasos,
  color,
}: {
  titulo:       string
  ingredientes?: string[]
  pasos?:        string[]
  color:         string
}) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const lines: string[] = [`🍽️ *${titulo}*`, '📍 Food·Mood']
  if (ingredientes && ingredientes.length > 0) {
    lines.push('', '📋 Ingredientes:')
    ingredientes.forEach(i => lines.push(`· ${i}`))
  }
  if (pasos && pasos.length > 0) {
    lines.push('', '👨‍🍳 Preparación:')
    pasos.forEach((p, idx) => lines.push(`${idx + 1}. ${p}`))
  }
  if (url) lines.push('', url)

  const text = encodeURIComponent(lines.join('\n'))

  return (
    <div className="flex gap-2 pt-1">
      <a
        href={`https://wa.me/?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
        style={{ background: '#25D366', color: 'white' }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url || 'https://food-mood.app')}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
        style={{ background: '#229ED9', color: 'white' }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        Telegram
      </a>
    </div>
  )
}

// ── RecetaOpciones ────────────────────────────────────────────────────────────

function SnackCard({ snack, label, color }: {
  snack: NonNullable<RecipeData['snack_am']>
  label: string
  color: string
}) {
  return (
    <div className="rounded-xl bg-white border border-[#e8ddd5] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
          {label}
        </p>
        <span className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.4)' }}>
          {snack.tiempo_min} min · {snack.dificultad}
        </span>
      </div>
      <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>{snack.nombre}</p>
      <ul className="space-y-1">
        {snack.ingredientes.map((ing, i) => (
          <li key={i} className="text-sm font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
            <span style={{ color }}>·</span> {ing}
          </li>
        ))}
      </ul>
      {snack.pasos.length > 0 && (
        <ol className="space-y-1.5">
          {snack.pasos.map((paso, i) => (
            <li key={i} className="text-sm font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
              <span className="font-semibold shrink-0" style={{ color }}>{i + 1}.</span>
              {paso}
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs italic" style={{ color: 'rgba(107,39,55,0.5)' }}>
        ¿Por qué? {snack.por_que}
      </p>
      <ShareButtons
        titulo={snack.nombre}
        ingredientes={snack.ingredientes}
        pasos={snack.pasos}
        color={color}
      />
    </div>
  )
}

function RecetaOpciones({ receta, color }: { receta: NonNullable<RecipeData['receta']>; color: string }) {
  const [tab, setTab] = useState<'a' | 'b'>('a')
  const current = tab === 'a' ? receta.opcion_a : receta.opcion_b

  return (
    <div className="rounded-xl bg-white border border-[#e8ddd5] p-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
        {receta.opcion_a || receta.opcion_b ? 'Tu protocolo permanente' : 'Receta del día'}
      </p>
      <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>{receta.titulo}</p>
      {receta.descripcion && (
        <p className="text-[13px] font-light" style={{ color: 'rgba(107,39,55,0.65)' }}>
          {receta.descripcion}
        </p>
      )}
      {receta.ingredientes && receta.ingredientes.length > 0 && (
        <ul className="space-y-1">
          {receta.ingredientes.map((ing, i) => (
            <li key={i} className="text-sm font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
              <span style={{ color }}>·</span> {ing}
            </li>
          ))}
        </ul>
      )}
      {receta.pasos && receta.pasos.length > 0 && (
        <ol className="space-y-1.5">
          {receta.pasos.map((paso, i) => (
            <li key={i} className="text-sm font-light flex gap-2" style={{ color: 'rgba(107,39,55,0.75)' }}>
              <span className="font-semibold shrink-0" style={{ color }}>{i + 1}.</span> {paso}
            </li>
          ))}
        </ol>
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
      <ShareButtons
        titulo={receta.titulo}
        ingredientes={receta.ingredientes}
        pasos={receta.pasos}
        color={color}
      />
    </div>
  )
}
