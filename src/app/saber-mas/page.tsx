import { FaqSection } from "@/components/layout/FaqSection";


export const metadata = {
  title: "Saber más | Food·Mood",
  description: "Dudas, transparencia y bienestar. Todo lo que necesitas saber sobre Food Mood.",
};

export default function SaberMasPage() {
  return (
    <div className="min-h-screen bg-cream">
      <main className="pt-20">
        <FaqSection />
      </main>
    </div>
  );
}
