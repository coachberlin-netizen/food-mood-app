import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión — Food·Mood",
  description: "Accede a tu cuenta Food·Mood.",
  robots: { index: false, follow: true },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; returnTo?: string };
}) {
  const dest = searchParams.redirect || searchParams.returnTo || "/dashboard";
  redirect(`/auth/login?redirect=${encodeURIComponent(dest)}`);
}
