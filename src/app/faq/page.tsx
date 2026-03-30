import React from "react";

export default function FAQPage() {
  const faqs = [
    {
      q: "¿Qué es Food·Mood?",
      a: "Food·Mood es un espacio diseñado para conectar lo que sientes con lo que comes. Nuestra misión es ayudarte a nutrir tu cuerpo y mente escuchando las señales de tu intestino."
    },
    {
      q: "¿Cómo funciona el quiz?",
      a: "A través de preguntas simples sobre tu estado de ánimo, identificamos tu 'mood' actual. A partir de ello, te sugerimos alimentos que equilibran tu química interior de manera funcional."
    },
    {
      q: "¿Qué son los 6 estados?",
      a: "Son perfiles emocionales y físicos (Activación, Calma, Focus, Social, Reset y Confort). Cada uno tiene un grupo único de ingredientes recomendados para potenciar su estado ideal."
    },
    {
      q: "¿Es una dieta?",
      a: "En absoluto. Es una herramienta de autoconocimiento intuitivo. No existen restricciones ni conteo de calorías, nos enfocamos en añadir nutrición que soporte tus emociones."
    },
    {
      q: "¿Las recetas son para todos?",
      a: "Sí, están creadas para ser gentiles con el intestino y fáciles de adaptar a diferentes sensibilidades. Son opciones simples para reconectar sin importar tu nivel de habilidad en la cocina."
    },
    {
      q: "¿Cómo funciona la conexión intestino-cerebro?",
      a: "Ambos se comunican constantemente mediante el nervio vago y tu microbiota. Lo que comes influye directamente en neurotransmisores como la serotonina, impactando dramáticamente en cómo te sientes."
    },
    {
      q: "¿Guardan mis datos?",
      a: "Tu privacidad y tranquilidad son innegociables. Registramos tus tests solo para permitirte ver tu propia evolución histórica, sin ceder jamás esa información bajo ningún concepto."
    },
    {
      q: "¿Puedo cambiar mi respuesta?",
      a: "La fluidez es clave; las emociones cambian a lo largo del día. Puedes realizar el test siempre que lo desees para obtener nuevas sugerencias alineadas a tu nuevo presente."
    },
    {
      q: "¿Las recetas son rápidas?",
      a: "La practicidad es prioridad. Aunque el tiempo varía, todas las recetas indican claramente sus minutos de preparación y grado de dificultad para adaptarse a tu ritmo diario."
    },
    {
      q: "¿Sirve para problemas médicos?",
      a: "Food·Mood es una guía de bienestar holístico orientada a nutrirte integralmente, pero no diagnostica. Si presentas molestias severas, el consejo de un médico especialista es el mejor primer paso."
    },
    {
      q: "¿Cuándo tengo recetas nuevas?",
      a: "El sistema cuenta con un abanico de recetas curadas para cada mood. Cada vez que tomes el quiz experimentarás con la rotación aleatoria de nuestro repertorio estacional."
    },
    {
      q: "¿Cómo contactar con nuestro equipo?",
      a: "Nos encantaría leerte. Puedes enviarnos cualquier duda, comentario o logro personal a nuestra bandeja directa (hola@food-mood.com) para recibir apoyo de nuestro equipo de bienestar."
    }
  ];

  return (
    <div className="min-h-screen bg-aubergine">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-16 md:gap-20">
        
        {/* HEADER */}
        <header className="flex flex-col gap-4 text-center">
          <p className="font-serif text-2xl font-semibold text-aubergine-dark mb-4">
            Food<span className="text-[#D4AF37]">·</span>Mood
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-aubergine-dark leading-tight">
            Preguntas Frecuentes
          </h1>
          <p className="text-aubergine-dark/60 font-medium tracking-wide pt-4 max-w-xl mx-auto">
            Respuestas simples desde la unión de la neurociencia y la intuición.
          </p>
        </header>

        {/* FAQ LIST */}
        <section className="bg-cream rounded-[2rem] p-8 md:p-14 border border-aubergine-dark/20 shadow-sm">
          <div className="flex flex-col gap-12">
            {faqs.map((faq, idx) => (
              <article key={idx} className="flex flex-col gap-3 group">
                <div className="flex items-start gap-4">
                  <span className="font-serif text-[#D4AF37] text-xl md:text-2xl mt-0.5 min-w-[2.5rem]">
                    {(idx + 1).toString().padStart(2, '0')}.
                  </span>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-serif text-aubergine-dark group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {faq.q}
                    </h2>
                    <p className="text-lg text-aubergine-dark/80 font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
                {/* Custom separator line for all except last item */}
                {idx !== faqs.length - 1 && (
                  <div className="w-full relative h-px bg-[#edeae3] mt-8 ml-10 md:ml-14"></div>
                )}
              </article>
            ))}
          </div>
        </section>
        
        {/* Footer CTAs / Thanks */}
        <div className="text-center pt-8 border-t border-aubergine-dark/10">
          <p className="text-aubergine-dark/60 font-light italic text-xl font-serif">
            Tu intestino tiene algo que decirte. Escúchalo.
          </p>
        </div>

      </div>
    </div>
  );
}
