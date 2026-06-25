const EVIDENCE_CONFIG = {
  solida: {
    label: 'Evidencia sólida',
    dot:   '#2d7a4f',
    bg:    'rgba(45,122,79,0.1)',
    color: '#2d7a4f',
  },
  prometedora: {
    label: 'Evidencia prometedora',
    dot:   '#FF6B35',
    bg:    'rgba(255,107,53,0.1)',
    color: '#c4501e',
  },
  emergente: {
    label: 'Evidencia emergente',
    dot:   '#8b7355',
    bg:    'rgba(139,115,85,0.12)',
    color: '#6b5535',
  },
} as const

type EvidenceLevel = keyof typeof EVIDENCE_CONFIG

function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const cfg = EVIDENCE_CONFIG[level]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}

const PROTOCOLOS: {
  id:        string
  nombre:    string
  objetivo:  string
  evidencia: EvidenceLevel
}[] = [
  {
    id:       'ventana-alimentaria',
    nombre:   'Ventana alimentaria y ritmo circadiano',
    objetivo: 'Sincronizar la ingesta con el reloj biológico para mejorar el metabolismo y la calidad del sueño.',
    evidencia: 'solida',
  },
  {
    id:       'fermentados-microbiota',
    nombre:   'Fermentados y eje intestino-cerebro',
    objetivo: 'Modular la microbiota con alimentos fermentados para reducir inflamación y mejorar el estado de ánimo.',
    evidencia: 'prometedora',
  },
  {
    id:       'proteina-sarcopenia',
    nombre:   'Proteína distribuida y sarcopenia',
    objetivo: 'Preservar masa muscular en la perimenopause mediante distribución proteica óptima a lo largo del día.',
    evidencia: 'solida',
  },
  {
    id:       'polifenoles-cognitivo',
    nombre:   'Polifenoles y función cognitiva',
    objetivo: 'Reducir el declive cognitivo asociado a la menopausia mediante fuentes alimentarias ricas en polifenoles.',
    evidencia: 'prometedora',
  },
  {
    id:       'adaptogenos-estres',
    nombre:   'Adaptógenos alimentarios y estrés crónico',
    objetivo: 'Modular la respuesta al cortisol con hongos y especias funcionales integrados en la cocina diaria.',
    evidencia: 'emergente',
  },
  {
    id:       'ayuno-mujeres',
    nombre:   'Ayuno modificado en mujeres 40+',
    objetivo: 'Explorar ventanas de restricción calórica suave adaptadas al perfil hormonal de la perimenopause.',
    evidencia: 'emergente',
  },
]

export function ProtocolosContent() {
  return (
    <main
      className="min-h-screen"
      style={{ background: '#F5F0E8' }}
    >
      {/* Header */}
      <div style={{ background: '#2d0f16', borderBottom: '1px solid rgba(255,107,53,0.15)' }}>
        <div className="max-w-5xl mx-auto px-5 py-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(245,240,232,0.55)' }}>
            The Longevity Studio · Zona de cliente
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: '#F5F0E8' }}>
            Protocolos de cocina funcional
          </h1>
          <p className="text-sm md:text-base font-light max-w-xl" style={{ color: 'rgba(245,240,232,0.6)' }}>
            Protocolos aplicados y recetas funcionales con su nivel de evidencia científica.
            Espacio exclusivo para clientes de The Longevity Studio.
          </p>
        </div>
      </div>

      {/* Leyenda de evidencia */}
      <div className="max-w-5xl mx-auto px-5 pt-8 pb-2">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(EVIDENCE_CONFIG) as EvidenceLevel[]).map(level => (
            <EvidenceBadge key={level} level={level} />
          ))}
        </div>
      </div>

      {/* Grid de protocolos */}
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROTOCOLOS.map(p => (
            <article
              key={p.id}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: 'white', boxShadow: '0 2px 16px rgba(107,39,55,0.07)' }}
            >
              <div className="flex flex-col gap-2 flex-1">
                <EvidenceBadge level={p.evidencia} />
                <h2 className="font-serif text-base font-semibold leading-snug mt-1" style={{ color: '#2d0f16' }}>
                  {p.nombre}
                </h2>
                <p className="text-[13px] font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.65)' }}>
                  {p.objetivo}
                </p>
              </div>

              <span
                className="inline-flex items-center gap-1 text-[12px] font-semibold self-start"
                style={{ color: '#FF6B35' }}
              >
                Próximamente →
              </span>
            </article>
          ))}
        </div>

        <p className="text-center text-[12px] mt-10" style={{ color: 'rgba(107,39,55,0.35)' }}>
          El contenido completo de cada protocolo se irá publicando progresivamente.
        </p>
      </div>
    </main>
  )
}
