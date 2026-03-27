import { useQuizStore } from "@/store/useQuizStore"

export function QuizProgress({ total }: { total: number }) {
  const currentStep = useQuizStore((state) => state.currentStep)
  const percent = ((currentStep) / total) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs font-semibold text-navy/60 uppercase tracking-widest mb-3">
        <span>Pregunta {currentStep + 1} de {total}</span>
      </div>
      <div className="h-1.5 w-full bg-navy/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-navy transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
