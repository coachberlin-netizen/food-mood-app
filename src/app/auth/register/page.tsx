"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Lock, Sparkles } from "lucide-react";

function RegisterGate() {
  return (
    <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cream/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center text-white">
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C9A84C]/40 via-[#C9A84C] to-[#C9A84C]/40" />
          
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20">
               <Lock className="w-6 h-6 text-[#C9A84C]" />
             </div>
          </div>

          <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-4">Acceso Exclusivo</h1>
          <p className="text-aubergine-dark/60 text-sm mb-8 leading-relaxed">
            La creación de perfiles está reservada para miembros activos del Club Food·Mood. Para configurar tu cuenta y obtener tu recetario personalizado, primero debes adquirir un plan.
          </p>

          <Link href="/pricing" className="w-full bg-[#C9A84C] text-white hover:bg-[#b8953e] py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2">
             <Sparkles className="w-4 h-4" /> Ver Planes y Suscribirse
          </Link>

          <p className="text-center text-aubergine-dark/40 text-[11px] mt-8 pt-6 border-t border-aubergine-dark/5">
            ¿Acabas de pagar y no tienes contraseña? Revisa el enlace en tu correo electrónico de bienvenida.
          </p>

          <p className="text-center text-aubergine-dark/60 text-sm mt-4">
            ¿Ya tienes cuenta? <Link href="/auth/login" className="font-bold text-aubergine-dark hover:underline">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark" />}>
      <RegisterGate />
    </Suspense>
  );
}
