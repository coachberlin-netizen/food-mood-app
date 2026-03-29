import { useQuizStore } from "@/store/useQuizStore"

export function QuizProgress({ total }: { total: number }) {
  const currentStep = useQuizStore((state) => state.currentStep)
  const percent = (currentStep / total) * 100

  return (
    <div className="w-full mb-8">
      <div className="relative h-3 w-full bg-navy/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(to right, #1a2b4a, #c9a84c)",
          }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-sans uppercase tracking-[0.15em] text-navy/60 mix-blend-multiply"
        >
          {currentStep + 1} de {total}
        </span>
      </div>
    </div>
  )
}
