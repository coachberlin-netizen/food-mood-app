"use client";

import { usePathname } from "next/navigation";
import { EmotionalConstellation } from "./EmotionalConstellation";

export function HomeAnimationWrapper() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <div className="bg-aubergine-dark py-12">
      <EmotionalConstellation />
    </div>
  );
}
