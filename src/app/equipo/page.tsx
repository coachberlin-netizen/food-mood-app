import React from 'react';
import Link from 'next/link';

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
    role: "Food Tech Aplicada",
    description: "Convierte las complejas señales nutricionales y psicofísicas en experiencias digitales de alto valor. Centrado en traducir la densidad clínica de los datos en recomendaciones fluidas, íntimas e integradas a tu teléfono móvil.",
    impact: "Transforma la teoría científica en una herramienta verdaderamente tuya: práctica, sutil, ultra-personalizada y extraordinariamente fácil de usar en tu rutina diaria."
  }
];

export default function EquipoPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="text-xs font-sans tracking-widest uppercase text-aubergine-dark/40 hover:text-aubergine-dark transition-colors mb-8 inline-block">
            ← Volver
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-tight">
            Nuestro equipo <br />
            <span className="italic font-light">interdisciplinar.</span>
          </h1>
          <p className="mt-8 text-lg text-aubergine-dark/60 font-light leading-relaxed max-w-2xl">
            Food Mood nace de la intersección entre la psicología, la ciencia de la longevidad y el desarrollo digital avanzado.
          </p>
        </header>

        <section className="space-y-24">
          {roles.map((role, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-aubergine-dark/10 pt-16 group">
              <div className="md:col-span-4">
                <h2 className="text-2xl md:text-3xl font-serif text-aubergine-dark group-hover:text-[#FF6B35] transition-colors duration-500">
                  {role.role}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-lg text-aubergine-dark/80 font-light leading-relaxed mb-6">
                  {role.description}
                </p>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-6 h-px bg-[#FF6B35] mt-2.5" />
                  <p className="text-sm font-sans tracking-wide text-aubergine-dark/60 leading-relaxed max-w-xl">
                    <span className="font-semibold text-aubergine-dark/80 uppercase mr-1">Impacto en tu viaje:</span> 
                    {role.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-32 pt-16 border-t border-aubergine-dark/10 text-center">
          <p className="text-lg md:text-xl font-serif text-aubergine-dark/60 italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;No partimos de una visión unipersonal, sino de un equipo enfocado colectivamente en que el bienestar emocional trascienda la academia.&rdquo;
          </p>
        </footer>
      </div>
    </main>
  );
}
