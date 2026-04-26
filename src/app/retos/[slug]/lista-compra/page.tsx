import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ListaCompraClient from "./ListaCompraClient"

export const dynamic = "force-dynamic"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Lista de la compra — ${params.slug} | Food·Mood`,
    robots: { index: false },
  }
}

export default async function ListaCompraPage({ params }: Props) {
  const { slug } = params
  const supabase  = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirect=/retos/${slug}/lista-compra`)

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, slug, title, color, lista_compra")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()

  if (!challenge) notFound()

  const { data: enrollment } = await supabase
    .from("user_challenges")
    .select("paid")
    .eq("user_id", user.id)
    .eq("challenge_id", challenge.id)
    .maybeSingle()

  if (!enrollment?.paid) redirect(`/retos/${slug}`)

  const listaCompra = (challenge.lista_compra ?? []) as { categoria: string; items: string[] }[]

  return (
    <ListaCompraClient
      slug={slug}
      title={challenge.title}
      color={challenge.color}
      listaCompra={listaCompra}
    />
  )
}
