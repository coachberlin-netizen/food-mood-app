import React from 'react';
import Link from 'next/link';

const testimonios = [
  {
    quote: "Llevaba meses con bajones de energía a media tarde. Dos semanas siguiendo las recetas de Reset y he dejado el café de las 5.",
    mood: "Reset"
  },
  {
    quote: "Nunca había conectado mis antojos con el nervio vago. Ahora tiene todo el sentido.",
    mood: "Calma"
  },
  {
    quote: "Las recetas de Focus me salvaron la semana de exámenes. Simple, rico y funcional.",
    mood: "Focus"
  },
  {
    quote: "A todos nos encantan los snacks nutritivos de la sección Confort. Su digestión y la mía han agradecido el cambio sin que sientan 'dietas' extremas.",
    mood: "Confort"
  }
];

export default function TestimoniosPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-20">
          <Link href="/" className="text-xs font-sans tracking-widest uppercase text-aubergine-dark/40 hover:text-aubergine-dark transition-colors mb-8 inline-block">
            ← Volver
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-tight">
            Historias de <br />
            <span className="italic font-light">bienestar real.</span>
          </h1>
          <p className="mt-8 text-lg text-aubergine-dark/60 font-light leading-relaxed">
            Nuestra comunidad comparte cómo Food Mood ha impactado en su relación diaria con la alimentación y sus emociones.
          </p>
        </header>

        <section className="space-y-16">
          {testimonios.map((t, i) => (
            <div key={i} className="border-l-2 border-[#FF6B35]/20 pl-8 py-2">
              <span className="text-[10px] uppercase tracking-widest text-[#FF6B35] font-semibold mb-4 block">
                {t.mood}
              </span>
              <p className="text-xl md:text-2xl font-serif text-aubergine-dark/80 leading-relaxed italic mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </section>

        <footer className="mt-32 pt-16 border-t border-aubergine-dark/10 text-center">
          <p className="text-sm text-aubergine-dark/40 font-light italic mb-8">
            Cada historia es única, como tu propia paleta emocional.
          </p>
          <Link href="/test" className="inline-block px-8 py-4 bg-aubergine-dark text-cream rounded-xl text-sm font-semibold hover:bg-aubergine-dark/90 transition-all">
            Empieza tu propia historia
          </Link>
        </footer>
      </div>
    </main>
  );
}
