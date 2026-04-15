import React from 'react';

export function TrustBar() {
  return (
    <div className="border-b border-aubergine-dark/5 bg-[var(--background)] py-4 md:py-5 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:gap-x-12">
        <span className="text-[10px] font-sans tracking-[0.18em] uppercase text-aubergine-dark/35 font-semibold shrink-0 hidden sm:inline">
          Base experta
        </span>
        <span className="hidden sm:block w-px h-3 bg-aubergine-dark/15" />
        <span className="font-serif text-sm md:text-[0.9rem] text-aubergine-dark/60 font-medium">
          Psicología de la alimentación
        </span>
        <span className="w-1 h-1 rounded-full bg-aubergine-dark/15 hidden sm:inline-block" />
        <span className="font-serif text-sm md:text-[0.9rem] text-aubergine-dark/60 font-medium">
          Longevidad y bienestar
        </span>
        <span className="w-1 h-1 rounded-full bg-aubergine-dark/15 hidden sm:inline-block" />
        <span className="font-serif text-sm md:text-[0.9rem] text-aubergine-dark/60 font-medium">
          Food tech aplicada
        </span>
      </div>
    </div>
  );
}
