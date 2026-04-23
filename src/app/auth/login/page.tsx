import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Iniciar sesión — Food·Mood",
  description: "Accede a tu cuenta Food·Mood. Test emocional, recetas personalizadas y tu índice Food·Mood.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginClient />;
}
