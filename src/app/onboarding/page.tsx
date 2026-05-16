"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreening } from "@/components/OnboardingScreening";
import { DerivationCard } from "@/components/DerivationCard";
import type { AgentResponse } from "@/agent/safety/schema";

const TCA_DERIVATION: Extract<AgentResponse, { modo: "derivar" }> = {
  modo: "derivar",
  mensaje:
    "Lo que describes merece la mirada de alguien especializado, no una receta. Hay personas formadas para acompañarte en esto — y merece la pena dar ese paso.",
  tipo_derivacion: "tca",
  recursos: [
    "FEACAB — Federación Española contra Anorexia y Bulimia: feacab.com",
    "ACAB Cataluña: 93 433 50 90",
    "ACAB chat: acab.org",
  ],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [derivar, setDerivar] = useState(false);

  if (derivar) {
    return <DerivationCard d={TCA_DERIVATION} />;
  }

  return (
    <OnboardingScreening
      onComplete={({ proceed }) => {
        if (proceed) {
          router.push("/inicio");
        } else {
          setDerivar(true);
        }
      }}
    />
  );
}
