"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-aubergine/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center text-white">
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full text-center">
          <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-4">Acceso Exclusivo</h1>
          <p className="text-aubergine-dark/60 text-sm mb-8 leading-relaxed">
            La creación de perfiles públicos está temporalmente cerrada para mantener la calidad de nuestra comunidad. <br/><br/>
            <strong>Suscríbete a nuestra Newsletter</strong> para recibir consejos exclusivos y serás notificado cuando abramos nuevas plazas.
          </p>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-aubergine-dark/5 flex justify-center">
            <NewsletterForm source="auth_gate" dark={false} />
          </div>

          <p className="text-center text-aubergine-dark/40 text-[11px] mt-8 pt-6 border-t border-aubergine-dark/5">
            ¿Ya eres miembro activo? <Link href="/auth/login" className="font-bold text-aubergine-dark hover:underline">Acceder</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

