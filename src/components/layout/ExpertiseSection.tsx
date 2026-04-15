import React from 'react';

export function ExpertiseSection() {
  const pillars = [
    {
      title: "Psicología de la alimentación",
      description: "Exploramos cómo tus emociones influyen en lo que comes y cómo lo que comes influye en cómo te sientes, para que puedas entender mejor tus antojos y automatismos diarios.",
      outcome: "Te ayuda a ver tus patrones con más claridad y menos culpa, y a tomar decisiones que te cuidan de verdad."
    },
    {
      title: "Longevidad y bienestar",
      description: "Unimos ciencia de la nutrición y cuidado diario para sostener tu energía, tu ánimo y tu salud más allá del presente inmediato.",
      outcome: "Te ayuda a que cada pequeño gesto en tu cocina sume hacia una vida más larga, autónoma y placentera, sin entrar en extremos."
    },
    {
      title: "Coaching nutricional",
      description: "Te acompañamos en el proceso de cambio de hábitos mediante herramientas de coaching orientadas a la acción y la sostenibilidad, respetando tus tiempos y tu realidad individual.",
      outcome: "Te ayuda a pasar de la teoría a la práctica de forma amable, convirtiendo cada pequeño paso en un logro sólido y duradero."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          {/* Left Column: Contextual Heading */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <h2 className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 font-semibold">
              Fundamentos
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-[1.15] max-w-sm">
              La base <span className="italic font-light">científica</span> detrás de lo que sientes.
            </h3>
            <p className="mt-8 text-aubergine-dark/60 font-light text-base leading-relaxed max-w-sm">
              Nuestra aproximación se asienta en cuatro disciplinas complementarias, estructuradas de forma que la ciencia más avanzada resulte accesible, cálida y aplicable en tu cocina.
            </p>
          </div>

          {/* Right Column: Editorial Indexed List */}
          <div className="lg:col-span-7 flex flex-col">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col gap-5 py-10 ${idx === 0 ? 'pt-0 lg:pt-0 border-t-0' : 'border-t border-aubergine-dark/10'}`}
              >
                <h4 className="text-xl md:text-2xl font-serif font-medium text-aubergine-dark">
                  {pillar.title}
                </h4>
                
                <p className="text-base md:text-[1.05rem] text-aubergine-dark/70 font-light leading-relaxed max-w-xl">
                  {pillar.description}
                </p>
                
                <div className="flex items-start gap-3 mt-1">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#C9A84C]/50 mt-2 shrink-0" />
                  <p className="text-[13px] md:text-sm font-light text-aubergine-dark/60 leading-relaxed max-w-lg">
                    <span className="font-semibold text-aubergine-dark/80 tracking-wide">De qué te sirve:</span> {pillar.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
