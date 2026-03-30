import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-aubergine">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        
        {/* HEADER */}
        <header className="flex flex-col gap-6 mb-16 md:mb-20">
          <Link href="/" className="font-serif text-xl font-semibold text-aubergine-dark inline-block mb-4 transition-opacity hover:opacity-70">
            Food<span className="text-[#D4AF37]">·</span>Mood
          </Link>
          <div className="h-px bg-[#D4AF37] opacity-40 w-16 mb-2"></div>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-aubergine-dark leading-tight">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-lg text-aubergine-dark/70 font-light leading-relaxed mt-4">
            Bienvenido a Food·Mood. Nos alegra enormemente que hayas decidido embarcarte en este viaje de autodescubrimiento guiado por la intuición y la neurociencia. Antes de sumergirte en nuestras recomendaciones, te pedimos que leas detenidamente estas líneas. Aunque son un requisito legal esencial, las hemos redactado pensando en tu tranquilidad, con la misma calidez y transparencia que aplicamos a nuestro diseño. Al utilizar nuestro sitio web, aceptas acompañarnos bajo estos principios compartidos.
          </p>
        </header>

        {/* SECTIONS */}
        <main className="flex flex-col gap-14 md:gap-16">
          
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif text-aubergine-dark flex items-baseline gap-3">
              <span className="text-lg text-[#D4AF37]">I.</span>
              Naturaleza Divulgativa y Educativa
            </h2>
            <p className="text-base md:text-lg text-aubergine-dark/80 font-light leading-relaxed">
              El propósito fundamental de Food·Mood es divulgar información relacionada con el bienestar integral, la nutrición consciente y la conexión real entre tu intestino y tu cerebro. Todo el contenido que encuentres en nuestras interfaces —incluyendo los perfiles emocionales del quiz, los ingredientes y las recetas— tiene un fin estrictamente educativo. Queremos inspirarte a reconectar con tus sensaciones, pero en ningún escenario nuestro contenido debe ser interpretado como un diagnóstico clínico o un tratamiento cerrado.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif text-aubergine-dark flex items-baseline gap-3">
              <span className="text-lg text-[#D4AF37]">II.</span>
              Exención de Responsabilidad Médica
            </h2>
            <p className="text-base md:text-lg text-aubergine-dark/80 font-light leading-relaxed">
              Cada cuerpo es un universo inteligente pero distinto, con necesidades irrepetibles. Las sugerencias y menús que ofrecemos están basadas en divulgación científica pero no ponderan tu historial médico, intolerancias particulares ni cuadros clínicos en curso. Food·Mood no sustituye bajo ninguna circunstancia el consejo profesional, diagnóstico ni el tratamiento de un especialista cualificado. Si padeces problemas de salud, dolores o molestias severas, es imperativo que consultes con tu médico de confianza antes de realizar cambios drásticos en tus hábitos. Complementamos tu estilo de vida desde una óptica holística orientada al bienestar y el placer gastronómico; jamás suplantamos la atención médica experta que tu bienestar profundo requiere.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif text-aubergine-dark flex items-baseline gap-3">
              <span className="text-lg text-[#D4AF37]">III.</span>
              Cuidado y Privacidad de Datos
            </h2>
            <p className="text-base md:text-lg text-aubergine-dark/80 font-light leading-relaxed">
              La confidencialidad que nos confías es un pilar innegociable. Cuando interactúas con Food·Mood o analizas tu <span className="italic">mood</span>, la mínima información compilada se utiliza exclusivamente para esculpir una experiencia armónica y a tu medida. Nuestro compromiso inquebrantable frente a tu privacidad radica en que no vendemos, cruzamos ni cedemos tus correos electrónicos o métricas emocionales con terceros. Tu actividad de bienestar y tus reflexiones permanecen en un entorno blindado para que solo tú veas tu propia curva de impacto a lo largo de los días.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif text-aubergine-dark flex items-baseline gap-3">
              <span className="text-lg text-[#D4AF37]">IV.</span>
              Modificación de Términos
            </h2>
            <p className="text-base md:text-lg text-aubergine-dark/80 font-light leading-relaxed">
              Tanto las herramientas de bienestar holístico como el entorno digital se encuentran en continuo desarrollo, al igual que nuestra plataforma. Por este motivo, nos reservamos el derecho de adaptar, refinar e iterar estos Términos en el futuro con el afán de adecuar nuestras políticas corporativas al mayor estándar legislativo. Cualquier modificación significativa te invitará tácitamente desde tu acceso a revisarla; y si bien intentamos no abrumarte con notificaciones asfixiantes, tu continuidad de navegación representa que validas la evolución conjunta de estas normas de convivencia.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif text-aubergine-dark flex items-baseline gap-3">
              <span className="text-lg text-[#D4AF37]">V.</span>
              Buzón Abierto
            </h2>
            <p className="text-base md:text-lg text-aubergine-dark/80 font-light leading-relaxed">
              Si has invertido tiempo en leer este descargo completo, te lo agradecemos inmensamente. Para resolver dilemas legales, solicitar aclaraciones sobre cómo tratamos tus procesos digitales de bienestar o simplemente brindarnos perspectivas de valor, siempre encontrarás apoyo cálido de nuestro lado. Contáctanos sin reparo escribiendo directamente un mensaje a nuestra directora legal o al equipo de soporte a través de: <a href="mailto:hello@umyko.com" className="text-[#D4AF37] font-medium hover:underline underline-offset-4">hello@umyko.com</a>.
            </p>
          </section>

        </main>

        <div className="mt-20 pt-10 border-t border-aubergine-dark/10 text-center">
          <p className="font-serif italic text-xl text-aubergine-dark/60">
            Escucha a tu cuerpo.
          </p>
        </div>

      </div>
    </div>
  );
}
