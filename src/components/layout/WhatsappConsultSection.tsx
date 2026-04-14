import React from 'react';
import Link from 'next/link';

interface WhatsappConsultSectionProps {
  whatsappNumber?: string;
  prefilledMessage?: string;
}

export function WhatsappConsultSection({
  whatsappNumber = "34600000000",
  prefilledMessage = "Hola. Vengo de la web de Food Mood y me gustaría recibir orientación psicológica sobre mi relación con la comida."
}: WhatsappConsultSectionProps) {
  
  const encodedMessage = encodeURIComponent(prefilledMessage);
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <section className="py-24 md:py-32 bg-[var(--background)] border-t border-aubergine-dark/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* Left Column: Heading and Context */}
          <div className="flex flex-col">
            <h2 className="text-xs font-sans tracking-[0.2em] uppercase text-[#C9A84C] font-semibold mb-6">
              Acompañamiento
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-aubergine-dark leading-[1.15] mb-6 max-w-lg">
              Cuando la comida habla de algo más, <span className="italic font-light">podemos escucharlo juntas.</span>
            </h3>
            <p className="text-base text-aubergine-dark/70 font-light leading-relaxed max-w-md">
              Escribe por WhatsApp a nuestra psicóloga experta en psicología de la alimentación. Un canal cercano y discreto para pedir orientación puntual sobre tus patrones, el hambre emocional y la relación profunda que mantienes con lo que comes.
            </p>
          </div>

          {/* Right Column: Bullets and Action Box */}
          <div className="flex flex-col bg-cream rounded-3xl p-8 md:p-12 border border-aubergine-dark/5 shadow-sm relative overflow-hidden">
            {/* Subtle aesthetic accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

            <ul className="flex flex-col gap-6 mb-10 relative z-10">
              {[
                "Espacio seguro para hablar en confianza de tu relación con la comida y tus emociones.",
                "Orientación especializada en psicología de la alimentación, libre de juicios y enfocada en tu bienestar.",
                "Canal cercano por escrito con tiempos de respuesta claros, pausados y realistas."
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 mt-2 shrink-0" />
                  <p className="text-[15px] leading-relaxed text-aubergine-dark/80 font-light">
                    {bullet}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-5 relative z-10 mt-auto pt-4">
              <Link
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4.5 bg-aubergine-dark hover:bg-aubergine text-cream text-[15px] font-medium rounded-full transition-all text-center w-full shadow-luxury tracking-wide"
              >
                Consultar por WhatsApp
              </Link>

              <div className="pt-6 mt-2 border-t border-aubergine-dark/10">
                <p className="text-[11px] text-aubergine-dark/50 font-light leading-relaxed">
                  Este espacio no sustituye atención psicológica urgente ni tratamiento clínico. Si estás en una situación de emergencia, contacta de inmediato con los servicios de emergencias de salud de tu zona.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
