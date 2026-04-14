import React from 'react';

export function MethodSection() {
  const steps = [
    {
      num: "01",
      title: "Escuchamos cómo te sientes",
      description: "Todo empieza por tu sensibilidad inmediata. Antes de hablar sobre nutrientes o recetas, registramos orgánicamente las señales y el estado de tu cuerpo en este preciso momento."
    },
    {
      num: "02",
      title: "Traducimos tu información",
      description: "Food Mood cruza responsablemente tus emociones y contexto actual con principios de neurociencia nutricional, descifrando lo que tu biología nos está intentando comunicar silenciosamente."
    },
    {
      num: "03",
      title: "Te proponemos alternativas reales",
      description: "Extraer el sentido nos permite ofrecerte una orientación fina. Te presentamos recetas seleccionadas, herramientas o decisiones inmediatas que conectan terapéuticamente con los que tu sistema digestivo y nervioso reclaman."
    },
    {
      num: "04",
      title: "Cultivamos patrones con perspectiva",
      description: "El objetivo aquí no es controlar milimétricamente lo que comes. Nuestra estructura está diseñada sencillamente para que aprendas a entenderte mejor, permitiéndote tomar decisiones libres y dotadas de una claridad renovada que sumen a tu bienestar."
    }
  ];

  return (
    <section id="metodo" className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Contextual Description */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 self-start">
            <h2 className="text-xs font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 font-semibold">
              Nuestro Método
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-[1.15] mb-8">
              Una estructura para <span className="italic font-light">entenderte a fondo.</span>
            </h3>
            <p className="text-[17px] text-aubergine-dark/70 font-light leading-relaxed max-w-sm mb-6">
              El proceso de cuidar transversalmente tus emociones y tu forma de alimentarte requiere constancia y, sobre todo, orden. 
            </p>
            <p className="text-[17px] text-aubergine-dark/70 font-light leading-relaxed max-w-sm">
              Hemos destilado el acompañamiento interdisciplinar tradicional en 4 etapas nítidas lideradas por la empatía, transformando de forma simple datos en sabiduría culinaria sin necesidad de pesajees, dietas ni métricas de desgaste.
            </p>
          </div>

          {/* Right Column: Steps Timeline */}
          <div className="lg:col-span-7 flex flex-col pt-8 lg:pt-0">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col gap-3 pb-12 ${idx !== steps.length - 1 ? 'border-b border-aubergine-dark/10 mb-12' : ''}`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[11px] font-sans tracking-[0.3em] font-semibold text-[#C9A84C] uppercase">
                    Etapa {step.num}
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
