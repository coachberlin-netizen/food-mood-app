import React from 'react';
import Link from 'next/link';

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
    title: "Food tech aplicada",
    description: "Utilizamos tecnología para cruzar cómo te sientes con las propiedades de ingredientes y recetas, y así acercarte opciones que encajan contigo en cada momento.",
    outcome: "Te ayuda a decidir qué comer según tu estado interno sin tener que estudiar nutrición ni perderte entre miles de opciones."
  }
];

export default function FundamentosPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="text-xs font-sans tracking-widest uppercase text-aubergine-dark/40 hover:text-aubergine-dark transition-colors mb-8 inline-block">
            ← Volver
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-tight">
            Nuestros <br />
            <span className="italic font-light">fundamentos científicos.</span>
          </h1>
          <p className="mt-8 text-lg text-aubergine-dark/60 font-light leading-relaxed max-w-2xl">
            La base de Food Mood se asienta en tres disciplinas complementarias, estructuradas para que la ciencia más avanzada resulte accesible, cálida y aplicable en tu día a día.
          </p>
        </header>

        <section className="space-y-24">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-aubergine-dark/10 pt-16">
              <div className="md:col-span-4">
                <h2 className="text-2xl md:text-3xl font-serif text-aubergine-dark">
                  {pillar.title}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-lg text-aubergine-dark/70 font-light leading-relaxed mb-8">
                  {pillar.description}
                </p>
                <div className="flex items-start gap-4 p-6 bg-cream rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2 shrink-0" />
                  <p className="text-sm font-light text-aubergine-dark/60 leading-relaxed">
                    <span className="font-semibold text-aubergine-dark/80 uppercase mr-2 tracking-wider">De qué te sirve:</span>
                    {pillar.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-32 pt-16 border-t border-aubergine-dark/10 text-center">
          <p className="text-sm text-aubergine-dark/40 font-light italic mb-8">
            Ciencia y empatía, integradas en cada decisión que tomas.
          </p>
          <Link href="/test" className="inline-block px-10 py-4 bg-aubergine-dark text-cream rounded-xl text-sm font-semibold hover:bg-aubergine-dark/90 transition-all">
            Empezar mi test gratuito
          </Link>
        </footer>
      </div>
    </main>
  );
}
