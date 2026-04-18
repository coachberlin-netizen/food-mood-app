import React from 'react';

export function ExpertTeamSection() {
  const roles = [
    {
      role: "Psicología de la Alimentación",
      description: "Explora la relación profunda entre emociones, hábitos, antojos y la manera en la que nos tratamos al comer. Aporta una mirada genuinamente humana, respaldada por la evidencia y alejada del sistema punitivo de las dietas restrictivas.",
      impact: "Te ayuda a entender lo que sientes antes de decidir qué comer, cultivando el autoconocimiento en lugar de la culpa y la restricción."
    },
    {
      role: "Longevidad y Bienestar",
      description: "Aporta una visión funcional a largo plazo sobre la salud, la energía y los hábitos diarios. Conecta las decisiones de nutrición de hoy con la preservación de tu bienestar futuro, demostrando una conciencia corporal integral sin caer en la obsesión o el alarmismo.",
      impact: "Te ayuda a ver más allá del síntoma inmediato (hambre, cansancio) para que puedas construir una base de cuidado que se sostenga orgánicamente en el tiempo."
    },
    {
      role: "Coaching Nutricional",
      description: "Especialistas en el acompañamiento humano para la consolidación de nuevos hábitos. Utilizamos metodologías de coaching para derribar las barreras mentales que impiden la constancia, trabajando desde la compasión y el refuerzo positivo.",
      impact: "Te aporta el 'cómo' cuando ya sabes el 'qué', asegurando que los cambios no sean una carga temporal sino una evolución natural de tu estilo de vida."
    }
  ];

  return (
    <section id="equipo" className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 lg:mb-28">
           <div className="col-span-1 lg:col-span-4">
             <h2 className="text-xs font-sans tracking-[0.2em] uppercase text-[#C9A84C] mb-6 font-semibold">
              El equipo interdisciplinar
            </h2>
          </div>
          <div className="col-span-1 lg:col-span-8 flex flex-col items-start">
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark leading-[1.15] mb-8 max-w-2xl">
              Equilibrio clínico, <br className="hidden md:block" />
              <span className="italic font-light">guiado por la empatía humana.</span>
            </h3>
            <p className="text-base md:text-[17px] text-aubergine-dark/70 font-light leading-relaxed max-w-2xl">
              Food Mood ha sido diseñado activamente desde la intersección exacta y colaborativa entre la psicología de la alimentación, la ciencia de la longevidad y el desarrollo avanzado de producto digital. No partimos de una visión unipersonal, sino de un equipo enfocado colectivamente en un solo propósito: que el bienestar emocional y la nutrición trasciendan la academia para convertirse en una brújula aplicable sobre tu mesa.
            </p>
          </div>
        </div>

        {/* Horizontal Directory Layout (Editorial Approach) */}
        <div className="flex flex-col border-t border-aubergine-dark/10">
          {roles.map((role, idx) => (
            <div 
              key={idx} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 py-12 md:py-16 border-b border-aubergine-dark/10 group"
            >
              {/* Role Title Column */}
              <div className="lg:col-span-4 flex items-start pt-1">
                <h4 className="text-xl md:text-2xl font-serif font-medium text-aubergine-dark group-hover:text-[#C9A84C] transition-colors duration-500">
                  {role.role}
                </h4>
              </div>

              {/* Role Context Column */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <p className="text-base md:text-[17px] text-aubergine-dark/80 font-light leading-relaxed max-w-2xl">
                  {role.description}
                </p>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-6 h-px bg-[#C9A84C] mt-2.5" />
                  <p className="text-sm font-sans tracking-wide text-aubergine-dark/60 leading-relaxed max-w-xl">
                    <span className="font-semibold text-aubergine-dark/80 uppercase mr-1">Cómo retransmite tu viaje:</span> 
                    {role.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Thought */}
        <div className="mt-20 md:mt-24 max-w-4xl flex flex-col items-start gap-8">
          <p className="text-lg md:text-[22px] font-serif text-aubergine-dark/60 leading-relaxed italic border-l-2 border-[#C9A84C]/40 pl-6 md:pl-10">
            &ldquo;Food Mood combina estratégicamente la sofisticación científica estructural humana con el alcance nativo de la tecnología. El resultado hace que entender la intrincada relación diaria entre tu mente, lo que sientes y lo que comes, sea infinitamente más sencillo, intuitivo y sostenible.&rdquo;
          </p>
        </div>

      </div>
    </section>
  );
}
