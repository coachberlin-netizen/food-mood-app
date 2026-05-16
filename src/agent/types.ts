export type Mood = "Activación" | "Calma" | "Focus" | "Social" | "Reset" | "Confort";

export type AgentRequest = {
  userId: string;
  userText: string;
  mood?: { categoria: Mood; texto_libre?: string };
  profile: {
    country: string;
    edad: number;
    sexo: "F" | "M" | "X";
    allergies: string[];
    medications: string[];
    conditions: string[];
    objetivos: string[];
  };
  biomarkers?: { hrv?: number; sueno_h?: number; glucosa_media?: number };
};
