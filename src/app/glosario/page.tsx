import { createClient } from "@/lib/supabase/server"
import GlossaryClient from "./GlossaryClient"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Glosario Food·Mood | El poder de tus ingredientes",
  description: "Descubre la ciencia interactiva detrás de la comida real. Cómo cada especia, semilla y alimento vivo modula tu biología y tu estado de ánimo."
}

export default async function GlosarioPage() {
  const supabase = await createClient()
  const { data, error } = await(await supabase).from('glossary').select('id, name, slug, tagline, category, moods, is_premium_detail').order('name')
  
  if (error) console.error(error)

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <GlossaryClient initialData={data || []} />
    </main>
  )
}
