import { MoodId } from "@/lib/types";

export type OptionPoint = { mood: MoodId; points: number };

export interface QuizOption {
  text: string;
  points: OptionPoint[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cómo te sientes físicamente ahora mismo?",
    options: [
      { text: "Pesado/a, con el cuerpo lento", points: [{ mood: "reset", points: 2 }, { mood: "activacion", points: 1 }] },
      { text: "Con tensión, sin poder parar", points: [{ mood: "calma", points: 2 }, { mood: "confort", points: 1 }] },
      { text: "Bien, pero sin chispa", points: [{ mood: "activacion", points: 2 }, { mood: "focus", points: 1 }] },
      { text: "Con energía, quiero hacer cosas", points: [{ mood: "focus", points: 2 }, { mood: "social", points: 1 }] },
      { text: "Necesito algo cálido y reconfortante", points: [{ mood: "confort", points: 2 }, { mood: "calma", points: 1 }] },
    ]
  },
  {
    id: 2,
    question: "¿Y emocionalmente?",
    options: [
      { text: "Ansioso/a o con ruido mental", points: [{ mood: "calma", points: 2 }] },
      { text: "Desconectado/a, sin motivación", points: [{ mood: "activacion", points: 2 }] },
      { text: "Disperso/a, me cuesta concentrarme", points: [{ mood: "focus", points: 2 }] },
      { text: "Solo/a, me apetece compañía", points: [{ mood: "social", points: 2 }] },
      { text: "Agotado/a emocionalmente", points: [{ mood: "confort", points: 2 }, { mood: "reset", points: 1 }] },
      { text: "Bien, con energía positiva", points: [{ mood: "activacion", points: 2 }] },
      { text: "Tranquilo/a y en calma", points: [{ mood: "calma", points: 2 }] },
    ]
  },
  {
    id: 3,
    question: "Si pudieras comer algo AHORA MISMO, ¿qué te apetecería?",
    options: [
      { text: "Algo ácido, fresco, que despierte", points: [{ mood: "activacion", points: 2 }, { mood: "reset", points: 1 }] },
      { text: "Algo cálido, suave, que abrace", points: [{ mood: "confort", points: 2 }, { mood: "calma", points: 1 }] },
      { text: "Algo crujiente, con textura, para picar", points: [{ mood: "social", points: 2 }] },
      { text: "Algo verde, limpio, ligero", points: [{ mood: "reset", points: 2 }, { mood: "focus", points: 1 }] },
      { text: "Un té o infusión tranquila", points: [{ mood: "calma", points: 2 }] },
      { text: "Chocolate o algo intenso", points: [{ mood: "focus", points: 2 }, { mood: "confort", points: 1 }] },
    ]
  },
  {
    id: 4,
    question: "¿Qué momento del día es para ti?",
    options: [
      { text: "Acabo de despertar", points: [{ mood: "activacion", points: 1 }] },
      { text: "Estoy en plena jornada laboral", points: [{ mood: "focus", points: 1 }] },
      { text: "Es media tarde y baja la energía", points: [{ mood: "reset", points: 1 }, { mood: "activacion", points: 1 }] },
      { text: "Estoy preparando una cena/encuentro", points: [{ mood: "social", points: 1 }] },
      { text: "Es de noche y quiero desconectar", points: [{ mood: "calma", points: 1 }, { mood: "confort", points: 1 }] },
    ]
  },
  {
    id: 5,
    question: "¿Cómo está tu digestión hoy?",
    options: [
      { text: "Normal, sin quejas", points: [] },
      { text: "Hinchado/a o con molestias", points: [{ mood: "reset", points: 2 }, { mood: "calma", points: 1 }] },
      { text: "Irregular (estreñimiento/diarrea)", points: [{ mood: "reset", points: 1 }, { mood: "confort", points: 1 }] },
      { text: "No he prestado atención", points: [{ mood: "focus", points: 1 }] },
      { text: "Bien, pero con hambre constante", points: [{ mood: "activacion", points: 1 }] },
    ]
  },
  {
    id: 6,
    question: "¿Qué tipo de energía necesitas?",
    options: [
      { text: "Despertar y activarme", points: [{ mood: "activacion", points: 2 }] },
      { text: "Calmarme y frenar", points: [{ mood: "calma", points: 2 }] },
      { text: "Concentrarme en algo importante", points: [{ mood: "focus", points: 2 }] },
      { text: "Conectar con alguien", points: [{ mood: "social", points: 2 }] },
      { text: "Volver a mi centro", points: [{ mood: "reset", points: 2 }] },
      { text: "Sentirme cuidado/a", points: [{ mood: "confort", points: 2 }] },
    ]
  },
  {
    id: 7,
    question: "¿Cuál de estas frases te resuena más?",
    options: [
      { text: "\"Necesito un empujón para arrancar\"", points: [{ mood: "activacion", points: 2 }] },
      { text: "\"Quiero parar el ruido un momento\"", points: [{ mood: "calma", points: 2 }] },
      { text: "\"Tengo que pensar con claridad\"", points: [{ mood: "focus", points: 2 }] },
      { text: "\"Echo de menos comer con alguien\"", points: [{ mood: "social", points: 2 }] },
      { text: "\"Mi cuerpo me pide un reset\"", points: [{ mood: "reset", points: 2 }] },
      { text: "\"Solo quiero algo que me haga sentir bien\"", points: [{ mood: "confort", points: 2 }] },
    ]
  },
  {
    id: 8,
    question: "Última: si tu intestino pudiera hablar, ¿qué diría?",
    options: [
      { text: "\"Despiértame, anda\"", points: [{ mood: "activacion", points: 2 }] },
      { text: "\"Shhh, silencio por favor\"", points: [{ mood: "calma", points: 2 }] },
      { text: "\"Dame combustible limpio\"", points: [{ mood: "focus", points: 2 }] },
      { text: "\"Vamos a compartir algo rico\"", points: [{ mood: "social", points: 2 }] },
      { text: "\"Necesito un respiro\"", points: [{ mood: "reset", points: 2 }] },
      { text: "\"Abrázame por dentro\"", points: [{ mood: "confort", points: 2 }] },
    ]
  }
];
