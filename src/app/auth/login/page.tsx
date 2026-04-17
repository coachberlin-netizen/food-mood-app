"use client";

import Link from "next/link";
import { Suspense } from "react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

function LoginGate() {
  return (
    <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cream/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cream/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center text-white">
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full text-center">
          <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-4">Acceso Suspendido</h1>
          <p className="text-aubergine-dark/60 text-sm mb-6 leading-relaxed">
            Estamos actualizando nuestra infraestructura y el acceso a perfiles está temporalmente en mantenimiento.
          </p>
          <div className="p-4 bg-aubergine-dark/5 rounded-xl border border-aubergine-dark/10 mb-8 text-xs text-aubergine-dark/80 text-left">
            <strong>¿Eres miembro activo?</strong> Tu suscripción permanece segura. Si necesitas gestionar algo urgente, contáctanos a través del Club de WhatsApp.
          </div>

          <p className="text-aubergine-dark/60 text-sm font-semibold mb-4">
            ¿Aún no estás en la Newsletter?
          </p>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-aubergine-dark/5 mb-6 flex justify-center">
            <NewsletterForm source="login_gate" dark={false} />
          </div>

          <div className="border-t border-aubergine-dark/5 pt-6 mt-2">
            <Link href="/" className="font-bold text-aubergine-dark hover:underline text-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark" />}>
      <LoginGate />
    </Suspense>
  );
}
