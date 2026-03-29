import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        
        {/* HEADER */}
        <header className="flex flex-col gap-6 mb-16 md:mb-20">
          <Link href="/" className="font-serif text-xl font-semibold text-[#1B2A49] inline-block mb-4 transition-opacity hover:opacity-70">
            Food<span className="text-[#D4AF37]">·</span>Mood
          </Link>
          <div className="h-px bg-[#D4AF37] opacity-40 w-16 mb-2"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1B2A49] leading-tight">
            Política de Privacidad
          </h1>
          <p className="text-lg text-[#1B2A49]/70 font-light leading-relaxed mt-4">
            Bienvenido a nuestro rincón seguro. En Food·Mood, valoramos y abrazamos tu tranquilidad emocional con la misma pasión con la que cuidamos de tu bienestar digestivo. Sabemos que enfrentarse a una política de privacidad puede resultar una lectura pesada y, en ocasiones, intimidante. Por eso, hemos querido redactar estas líneas con total honestidad, claridad y cercanía. Nuestro compromiso absoluto con el Reglamento General de Protección de Datos (RGPD) nos asegura que tu información te pertenece exclusiva y únicamente a ti. Aquí te explicamos, sin lenguaje robótico, cómo y por qué cuidamos de tu espacio digital.
          </p>
        </header>

        {/* SECTIONS */}
        <main className="flex flex-col gap-14 md:gap-16">
          
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A49] flex items-baseline gap-3">
              <span className="text-xl md:text-2xl text-[#D4AF37]">1.</span>
              Qué datos recogemos
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              Cuando decides interactuar con nuestro ecosistema de bienestar, ya sea realizando el quiz emocional o suscribiéndote a nuestra plataforma, recopilamos únicamente la información estrictamente necesaria y elemental para conocerte mejor: tu dirección de correo electrónico (para poder mantenernos en contacto continuo y fluido) y las respuestas que provees en nuestro cuestionario de manera voluntaria, es decir, cómo te sientes, tus ritmos de sueño o preferencias. Jamás solicitaremos historias clínicas complejas ni detalles médicos o bancarios invasivos, pues creemos en una conexión compasiva y holística, no clínica.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A49] flex items-baseline gap-3">
              <span className="text-xl md:text-2xl text-[#D4AF37]">2.</span>
              Para qué los utilizamos
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              Creemos firmemente que cada dato tuyo es una semilla con el único propósito de cultivar y hacer florecer una mejor experiencia para ti. Con tu correo, logramos enviarte tu perfil personalizado y tus recetas; y a través de tus respuestas logramos conectar los puntos, &quot;calculando&quot; las sugerencias culinarias exactas que tu cuerpo y tu psique agradecen en este instante de tu vida. De forma secundaria, los datos anonimizados internamente (es decir, en masa y sin tu nombre atado a ellos) nos ayudan a detectar errores y afinar continuamente la precisión y el mimo de esta plataforma.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A49] flex items-baseline gap-3">
              <span className="text-xl md:text-2xl text-[#D4AF37]">3.</span>
              Dónde los guardamos
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              La paz mental siempre será nuestra prioridad invisible. Por esto, hemos confiado el alojamiento y preservación de toda tu actividad a Supabase, uno de los proveedores de arquitectura en la nube con los certificados más rigurosos de resiliencia global. Para brindarte seguridad inquebrantable, hemos dispuesto que tus procesos permanezcan profundamente encriptados; lo que significa que la información viaja blindada bajo algoritmos matemáticos irrevocables en código cerrado. Ni nosotros directamente ni terceros podemos &quot;leer&quot; caprichosamente tu vida de forma manual; tus datos están a salvo del ojo público y de intrusiones no autorizadas.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A49] flex items-baseline gap-3">
              <span className="text-xl md:text-2xl text-[#D4AF37]">4.</span>
              No compartimos información
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              Este es el párrafo donde trazamos nuestro verdadero juramento de confidencialidad. Mientras que la tendencia moderna del internet fomenta comercializar digitalmente cualquier trazo del usuario, el santuario de Food·Mood no funciona así. Bajo ningún concepto manipulativo vendemos, alquilamos, distribuimos ni cedemos a ninguna empresa externa (ya sean patrocinadores, agencias publicitarias masivas o recolectores de bases de marketing) la información ligada a tu identidad o tus emociones. Jamás lucraremos con tu bienestar privado. Lo que compartes en este refugio, se queda estrictamente en este refugio.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A49] flex items-baseline gap-3">
              <span className="text-xl md:text-2xl text-[#D4AF37]">5.</span>
              Tus Derechos: Tu control soberano
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              La verdadera serenidad digital nace de poseer el dominio sobre tu propio rastro de internet. Amparado fuertemente bajo la legislación de protección de datos europea y por nuestro inquebrantable código ético y humano, ostentas pleno control de tus datos en todo momento. Tienes el derecho fundamental a pedirnos una copia transparente con la radiografía informática del perfil que guardamos de ti; tienes derecho a ordenarnos la modificación y actualización si ha existido un error en tu captura; y gozas del sagrado «derecho al olvido», obligándonos sin demora ni cuestionamiento moral a suprimir, borrar y erradicar tu correo e historial digital de nuestras bases tecnológicas de una vez y por todas.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1B2A49] flex items-baseline gap-3">
              <span className="text-xl md:text-2xl text-[#D4AF37]">6.</span>
              Cookies y rastreadores invasivos
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              Detestamos las asfixiantes persecuciones publicitarias que abundan por toda la red tanto como tú. Es por ello que en Food·Mood apenas usamos cookies (pequeños rastreadores que viven en el navegador). Únicamente hemos implementado aquellas estrictamente técnicas y vitales para asegurar que la página ruede maravillosamente rápido, manteniendo tu sesión conectada y velando para que no pierdas tu progreso si recargas. En nuestro entorno no habrá molestos mercaderes rondando en tu pantalla.
            </p>
          </section>

          <section className="flex flex-col gap-4 border-l-4 border-[#D4AF37] pl-6 py-2 mt-4 bg-[#D4AF37]/5 rounded-r-2xl">
            <h2 className="text-2xl font-serif text-[#1B2A49] mb-2">
              7. Conversemos de esto
            </h2>
            <p className="text-base md:text-lg text-[#1B2A49]/80 font-light leading-relaxed">
              Sabemos que detrás de los teclados existen ritmos cardíacos y vidas humanas. Si algún párrafo dentro de esta política genera en ti la más mínima incomodidad, confusión, o simplemente deseas ejercer tu control y dictar sin trabas tu derecho al olvido, anhelamos escucharte de cerca. Solo dirígete a nosotros mediante correo electrónico a: <a href="mailto:hello@umyko.com" className="text-[#D4AF37] font-medium hover:underline underlines-offset-4">hello@umyko.com</a>. Una persona empatizando directamente desde nuestro equipo te asistirá cálidamente en minutos.
            </p>
          </section>

        </main>

        <div className="mt-24 pt-10 border-t border-[#1B2A49]/10 text-center">
          <p className="font-serif italic text-xl text-[#1B2A49]/60">
            Tu paz digital, garantizada.
          </p>
        </div>

      </div>
    </div>
  );
}
