interface Props {
  titulo:            string
  texto:             string
  alimento_estrella: string
  imagen_url?:       string
}

export default function PsicobioticoCard({ titulo, texto, alimento_estrella }: Props) {
  return (
    <div className="rounded-2xl border border-[#e8ddd5] bg-white overflow-hidden">
      <div className="p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #f0f9e8, #d8efb8)' }}>
          🦠
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#4A7C59' }}>
            Psicoboótico
          </p>
          <p className="font-serif text-[15px] font-semibold leading-snug" style={{ color: '#2d0f16' }}>
            {titulo}
          </p>
        </div>
      </div>

      {/* Texto */}
      <p className="text-sm font-light leading-relaxed mb-4" style={{ color: 'rgba(107,39,55,0.75)' }}>
        {texto}
      </p>

      {/* Alimento estrella */}
      <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3" style={{ backgroundColor: '#f5eaec' }}>
        <span className="text-xl shrink-0 mt-0.5">⭐</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6B2737' }}>
            Alimento estrella
          </p>
          <p className="text-[13px] font-semibold mb-2" style={{ color: '#2d0f16' }}>
            {alimento_estrella}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#fdf5e0', color: '#7a5a00' }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#FF6B35' }} />
            Prioridad esta semana
          </span>
        </div>
      </div>
      </div>
    </div>
  )
}
