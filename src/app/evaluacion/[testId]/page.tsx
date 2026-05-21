import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { EVALUACION_TESTS } from '@/data/evaluacion-tests'
import { TestWizardClient } from './TestWizardClient'

interface Props {
  params: Promise<{ testId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params
  const test = EVALUACION_TESTS.find(t => t.id === testId)
  if (!test) return {}
  return {
    title: `${test.titulo} — Evaluación Food·Mood`,
    description: test.descripcion,
  }
}

export async function generateStaticParams() {
  return EVALUACION_TESTS.map(t => ({ testId: t.id }))
}

export default async function TestPage({ params }: Props) {
  const { testId } = await params
  const test = EVALUACION_TESTS.find(t => t.id === testId)
  if (!test) notFound()

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1A0A0E] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
        </div>
      }
    >
      <TestWizardClient test={test} />
    </Suspense>
  )
}
