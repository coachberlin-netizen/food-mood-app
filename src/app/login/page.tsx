"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function LoginRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const redirect = searchParams.get("redirect") || "/dashboard";
    // Pass the redirect parameter to the actual auth login page
    router.replace(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <p className="text-aubergine-dark/60 font-light">Redirigiendo al login...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <LoginRedirect />
    </Suspense>
  );
}
