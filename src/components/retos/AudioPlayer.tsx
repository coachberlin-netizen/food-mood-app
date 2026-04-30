'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AudioPlayerProps {
  titulo:      string
  descripcion: string
  duracion_min: number
  tipo:        string
  archivo:     string
}

const TIPO_LABELS: Record<string, string> = {
  meditacion:               'Meditación',
  educativo:                'Explicación',
  relajacion:               'Relajación',
  visualizacion:            'Visualización',
  respiracion:              'Respiración',
  reflexion_cierre:         'Reflexión',
  meditacion_terapeutica:   'Meditación',
  relajacion_nocturna:      'Ritual nocturno',
  mindful_eating:           'Mindful eating',
  enfoque:                  'Enfoque',
  journaling:               'Journaling',
  yoga_nidra:               'Yoga nidra',
  ritual_nocturno:          'Ritual nocturno',
  visualizacion_integradora:'Visualización',
  journaling_compromisos:   'Journaling',
  cierre_celebracion:       'Celebración',
  introduccion:             'Introducción',
  educativo_reflexivo:      'Reflexión',
  body_scan:                'Body scan',
  gratitud:                 'Gratitud',
}

const TIPO_COLORS: Record<string, string> = {
  meditacion:               '#4B7BAE',
  educativo:                '#6B4B8A',
  relajacion:               '#4B8A6B',
  visualizacion:            '#8A6B4B',
  respiracion:              '#4B7BAE',
  reflexion_cierre:         '#8A4B4B',
  meditacion_terapeutica:   '#4B7BAE',
  relajacion_nocturna:      '#2E3F5E',
  mindful_eating:           '#4B7B5E',
  enfoque:                  '#6B4B8A',
  journaling:               '#7B6B4B',
  yoga_nidra:               '#4B6B7B',
  ritual_nocturno:          '#2E3F5E',
  visualizacion_integradora:'#8A6B4B',
  journaling_compromisos:   '#7B6B4B',
  cierre_celebracion:       '#6B2737',
  introduccion:             '#4B7BAE',
  educativo_reflexivo:      '#6B4B8A',
  body_scan:                '#4B8A6B',
  gratitud:                 '#8A6B4B',
}

export default function AudioPlayer({ titulo, descripcion, duracion_min, tipo, archivo }: AudioPlayerProps) {
  const [isPlaying,  setIsPlaying]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [currentTime,setCurrentTime]= useState(0)
  const [duration,   setDuration]   = useState(duracion_min * 60)
  const [audioUrl,   setAudioUrl]   = useState<string | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [disponible, setDisponible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  useEffect(() => {
    checkDisponible()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archivo])

  async function checkDisponible() {
    try {
      const { data } = supabase.storage.from('retos-audio').getPublicUrl(archivo)
      const res = await fetch(data.publicUrl, { method: 'HEAD' })
      if (res.ok) {
        setAudioUrl(data.publicUrl)
        setDisponible(true)
      }
    } catch {
      setDisponible(false)
    }
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  async function togglePlay() {
    if (!disponible || !audioUrl) return
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.addEventListener('timeupdate', () => {
        if (!audioRef.current) return
        setCurrentTime(audioRef.current.currentTime)
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
      })
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) setDuration(audioRef.current.duration)
      })
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false); setProgress(0); setCurrentTime(0)
      })
    }
    if (isPlaying) {
      audioRef.current.pause(); setIsPlaying(false)
    } else {
      setLoading(true)
      await audioRef.current.play()
      setLoading(false); setIsPlaying(true)
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return
    const newTime = (Number(e.target.value) / 100) * duration
    audioRef.current.currentTime = newTime
    setProgress(Number(e.target.value))
    setCurrentTime(newTime)
  }

  const label = TIPO_LABELS[tipo] ?? tipo
  const color = TIPO_COLORS[tipo] ?? '#6B2737'

  return (
    <div className="rounded-2xl border border-[#e8ddd5] bg-white p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: color }} />

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full mb-3"
        style={{ color, backgroundColor: color + '18' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </div>

      <p className="font-serif text-[15px] font-semibold mb-1" style={{ color: '#2d0f16' }}>{titulo}</p>
      <p className="text-xs font-light leading-relaxed mb-4" style={{ color: 'rgba(107,39,55,0.6)' }}>{descripcion}</p>

      {!disponible ? (
        <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: '#f5eaec' }}>
          <span className="text-xl">🎧</span>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#6B2737' }}>Audio disponible próximamente</p>
            <p className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.5)' }}>
              {label}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Play/pause */}
          <button
            onClick={togglePlay}
            disabled={loading}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#6B2737' }}
          >
            {loading ? (
              <span className="text-white text-xs">…</span>
            ) : isPlaying ? (
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-white rounded-sm" />
                <div className="w-0.5 h-3 bg-white rounded-sm" />
              </div>
            ) : (
              <div className="ml-0.5" style={{
                width: 0, height: 0, borderStyle: 'solid',
                borderWidth: '5px 0 5px 9px',
                borderColor: 'transparent transparent transparent white',
              }} />
            )}
          </button>

          {/* Barra */}
          <div className="flex-1">
            <input
              type="range" min="0" max="100" step="0.1"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 cursor-pointer"
              style={{ accentColor: '#6B2737' }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(107,39,55,0.4)' }}>
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
