"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const processedRef = React.useRef(false);

  useEffect(() => {
    async function verifyAndExchange() {
      if (processedRef.current) return;
      processedRef.current = true;

      // Check current session first
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      // If we already have a recovery session, we might be good
      if (existingSession) {
        setIsVerifying(false);
        return;
      }

      // Try to get code from URL or hash (Supabase can use both)
      const code = searchParams.get('code');
      
      // Also check hash fragment just in case (Implicit flow fallback)
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = hashParams.get('access_token');

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Critical Exchange Error:", exchangeError);
          setError(`El enlace es inválido o ha caducado. (Error: ${exchangeError.message})`);
        }
      } else if (accessToken) {
        // If it was an implicit flow, Supabase Browser Client might have already picked it up
        // but we verify session one last time
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("No se pudo establecer la sesión de recuperación. Intenta solicitar un nuevo enlace.");
        }
      } else {
        setError("No se encontró un código de acceso válido en el enlace.");
      }
      
      setIsVerifying(false);
    }

    verifyAndExchange();
  }, [searchParams, supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        
        // Delay redirect to show success state
        setTimeout(() => {
          router.push("/auth/login?message=Contraseña actualizada. Inicia sesión con tu nueva contraseña.");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al actualizar la contraseña.");
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 text-white">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-serif italic opacity-60">Verificando enlace de seguridad...</p>
      </div>
    );
  }

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
