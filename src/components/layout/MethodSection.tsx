import React from 'react';

export function MethodSection() {
  const steps = [
    {
      num: "01",
      title: "Escucha tus emociones",
      description: "Registra cómo te sientes en cada momento. Todo empieza por tu sensibilidad inmediata."
    },
    {
      num: "02",
      title: "Recibe recomendaciones personalizadas",
      description: "Nuestra ciencia traduce tus emociones en sugerencias de recetas y alimentos diseñados para tu bioquímica."
    },
    {
      num: "03",
      title: "Nutre tu cuerpo y mente",
      description: "Disfruta de platos deliciosos que te ayudan a equilibrar tu estado de ánimo y energía sin restricciones."
    }
  ];

  return (
    <section id="metodo" className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Contextual Description */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 self-start">
            <h2 className="text-xs font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 font-semibold">
              ¿Qué es Food Mood?
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-[1.15] mb-8">
              Alimenta tu bienestar, <span className="italic font-light">desde dentro.</span>
            </h3>
            <p className="text-[17px] text-aubergine-dark/70 font-light leading-relaxed max-w-sm mb-6">
              Food Mood es la herramienta que te ayuda a conectar tus emociones con tu alimentación. 
            </p>
            <p className="text-[17px] text-aubergine-dark/70 font-light leading-relaxed max-w-sm">
              Olvídate de dietas restrictivas y aprende a escuchar a tu cuerpo para elegir los alimentos que realmente te benefician.
            </p>
          </div>

          {/* Right Column: Steps Timeline */}
          <div className="lg:col-span-7 flex flex-col pt-8 lg:pt-0">
            <div className="mb-12">
               <h4 className="text-xs font-sans tracking-[0.2em] uppercase text-gold font-bold mb-8">¿Cómo funciona?</h4>
            </div>
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col gap-3 pb-12 ${idx !== steps.length - 1 ? 'border-b border-aubergine-dark/10 mb-12' : ''}`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[11px] font-sans tracking-[0.3em] font-semibold text-[#FF6B35] uppercase">
                    Paso {step.num}
                  </span>
                </div>
                <h4 className="text-2xl md:text-3xl font-serif font-medium text-aubergine-dark">
                  {step.title}
                </h4>
                <p className="text-[16px] md:text-[18px] text-aubergine-dark/70 font-light leading-[1.7] max-w-xl mt-3">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
