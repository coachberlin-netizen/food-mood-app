import { Suspense } from "react"
import SessionPrepClient from "./SessionPrepClient"

export const metadata = { title: "Preparación de sesión · Food·Mood Pro" }

export default async function SessionPrepPage({
  params,
}: {
  params: Promise<{ prepId: string }>
}) {
  const { prepId } = await params
  return (
    <Suspense fallback={<div className="p-8 flex items-center justify-center"><div className="w-5 h-5 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" /></div>}>
      <SessionPrepClient prepId={prepId} />
    </Suspense>
  )
}
