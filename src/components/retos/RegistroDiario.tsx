'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  challengeId: string
  dayNumber:   number
  preguntas: {
    pregunta_manana: string
    pregunta_tarde:  string
    pregunta_noche:  string
  }
}

type Tiempo = 'manana' | 'tarde' | 'noche'

const TIEMPOS: Record<Tiempo, { label: string; emoji: string; color: string }> = {
  manana: { label: 'Mañana', emoji: '🌅', color: '#F5A623' },
  tarde:  { label: 'Tarde',  emoji: '🌤',  color: '#E8835A' },
  noche:  { label: 'Noche',  emoji: '🌙',  color: '#6B2737' },
}

const MAX = 300

export default function RegistroDiario({ challengeId, dayNumber, preguntas }: Props) {
  const [tiempo,     setTiempo]     = useState<Tiempo>('manana')
  const [respuestas, setRespuestas] = useState<Record<Tiempo, string>>({ manana: '', tarde: '', noche: '' })
  const [energia,    setEnergia]    = useState(0)
  const [animo,      setAnimo]      = useState(0)
  const [guardando,  setGuardando]  = useState(false)
  const [guardado,   setGuardado]   = useState(false)
  const [yaExiste,   setYaExiste]   = useState(false)
  const supabase = createClient()

  useEffect(() => { cargar() }, [challengeId, dayNumber]) // eslint-disable-line

  async function cargar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('challenge_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .eq('day_number', dayNumber)
      .single()
    if (data) {
      setYaExiste(true)
      setRespuestas({
        manana: data.pregunta_manana ?? '',
        tarde:  data.pregunta_tarde  ?? '',
        noche:  data.pregunta_noche  ?? '',
      })
      if (data.energia_score) setEnergia(data.energia_score)
      if (data.animo_score)   setAnimo(data.animo_score)
    }
  }

  async function guardar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setGuardando(true)
    const payload = {
      user_id:         user.id,
      challenge_id:    challengeId,
      day_number:      dayNumber,
      pregunta_manana: respuestas.manana,
      pregunta_tarde:  respuestas.tarde,
      pregunta_noche:  respuestas.noche,
      energia_score:   energia || null,
      animo_score:     animo   || null,
      updated_at:      new Date().toISOString(),
    }
    if (yaExiste) {
      await supabase.from('challenge_logs').update(payload)
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .eq('day_number', dayNumber)
    } else {
      await supabase.from('challenge_logs').insert(payload)
      setYaExiste(true)
    }
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  const pregunta = tiempo === 'manana'
    ? preguntas.pregunta_manana
    : tiempo === 'tarde'
    ? preguntas.pregunta_tarde
    : preguntas.pregunta_noche

  const { color: tiempoColor } = TIEMPOS[tiempo]
  const respuesta = respuestas[tiempo]

  return (
    <div className="rounded-2xl border border-[#e8ddd5] bg-white p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: '#f5eaec' }}>📓</div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>
            Registro del día {dayNumber}
          </p>
          <p className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.5)' }}>
            Observación sin juicio
          </p>
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-2 mb-4">
        {([
          { label: 'Energía al levantarte',    val: energia, set: setEnergia },
          { label: 'Estado de ánimo general',  val: animo,   set: setAnimo   },
        ] as const).map(({ label, val, set }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[11px] font-light w-36 shrink-0" style={{ color: 'rgba(107,39,55,0.65)' }}>
              {label}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => set(n === val ? 0 : n)}
                  className="w-6 h-6 rounded-full text-[11px] font-semibold border transition-all"
                  style={{
                    backgroundColor: n <= val ? '#6B2737' : 'transparent',
                    borderColor:      n <= val ? '#6B2737' : '#e8ddd5',
                    color:            n <= val ? '#fff'    : 'rgba(107,39,55,0.4)',
                  }}
                >{n}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-3">
        {(Object.keys(TIEMPOS) as Tiempo[]).map(t => {
          const { label, emoji } = TIEMPOS[t]
          const active = t === tiempo
          return (
            <button
              key={t}
              onClick={() => setTiempo(t)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                backgroundColor: active ? '#6B2737' : 'transparent',
                borderColor:      active ? '#6B2737' : '#e8ddd5',
                color:            active ? '#fff'    : 'rgba(107,39,55,0.6)',
              }}
            >
              <span>{emoji}</span>
              {label}
            </button>
          )
        })}
      </div>

      {/* Pregunta */}
      <p className="text-xs font-medium leading-relaxed mb-2" style={{ color: 'rgba(107,39,55,0.65)' }}>
        {pregunta}
      </p>

      {/* Textarea */}
      <textarea
        value={respuesta}
        onChange={e => {
          if (e.target.value.length <= MAX) {
            setRespuestas(prev => ({ ...prev, [tiempo]: e.target.value }))
            setGuardado(false)
          }
        }}
        placeholder="Escribe lo que observas, sin filtros..."
        rows={3}
        className="w-full rounded-xl px-3 py-2.5 text-[13px] leading-relaxed resize-none outline-none transition-colors font-[inherit]"
        style={{
          border: `1px solid ${respuesta ? tiempoColor + '55' : '#e8ddd5'}`,
          backgroundColor: '#fafaf8',
          color: '#2d0f16',
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[11px]" style={{ color: 'rgba(107,39,55,0.3)' }}>
          {respuesta.length} / {MAX}
        </span>
        <button
          onClick={guardar}
          disabled={guardando}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white border-none transition-colors disabled:opacity-60 font-[inherit]"
          style={{ backgroundColor: guardado ? '#4A7C59' : '#6B2737' }}
        >
          {guardando ? 'Guardando…' : guardado ? '✓ Guardado' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
