import React from 'react';

export function TrustBar() {
  return (
    <section className="border-b border-aubergine-dark/5 bg-[var(--background)] py-8 md:py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Eyebrow / Label */}
        <div className="shrink-0 flex items-center justify-center md:justify-start">
          <h4 className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#C9A84C] font-semibold">
            Enfoque interdisciplinar
          </h4>
        </div>
        
        {/* Separator for mobile */}
        <div className="md:hidden w-12 h-px bg-aubergine-dark/10" />

        {/* Pillars */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full md:justify-around gap-6 sm:gap-4 md:gap-0">
          <div className="text-center group cursor-default">
            <span className="font-serif text-lg md:text-xl text-aubergine-dark/80 group-hover:text-aubergine-dark transition-colors italic">
              Psicología de la alimentación
            </span>
          </div>
          
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#C9A84C]/30 mx-4 lg:mx-8" />
          
          <div className="text-center group cursor-default">
            <span className="font-serif text-lg md:text-xl text-aubergine-dark/80 group-hover:text-aubergine-dark transition-colors italic">
              Longevidad y bienestar
            </span>
          </div>
          
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#C9A84C]/30 mx-4 lg:mx-8" />
          
          <div className="text-center group cursor-default">
            <span className="font-serif text-lg md:text-xl text-aubergine-dark/80 group-hover:text-aubergine-dark transition-colors italic">
              Food tech aplicada
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
