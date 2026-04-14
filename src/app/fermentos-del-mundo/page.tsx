// src/app/fermentos-del-mundo/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import FermentosClient from "./FermentosClient"
import { getPremiumStatus } from "@/lib/premium"

export default async function FermentosDelMundoPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Centralized Waterfall Check
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false;


  // 2. Fetch ferments ordered by sort_order or created_at
  const { data: ferments } = await supabase
    .from('ferments_world')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return (
    <main className="min-h-screen bg-cream">
      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 relative bg-cream">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-serif text-aubergine-dark font-black tracking-tight mb-6">
            Fermentos del Mundo
          </h1>
          <p className="text-xl md:text-2xl text-aubergine-dark/60 font-light italic leading-relaxed max-w-2xl mb-8">
            Cada cultura descubrió que fermentar alimentos cambia cómo te sientes. Ahora la ciencia explica por qué.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-aubergine-dark/15 text-aubergine-dark font-sans text-xs tracking-[0.1em] uppercase">
            16 fermentos de 12 países <span className="text-[#C9A84C]">—</span> 1 eje intestino-cerebro
          </div>
        </div>
      </section>

      {/* INTERACTIVE MAP & GRID (Client Component) */}
      <FermentosClient initialFerments={ferments || []} isPremium={isPremium} />
      
    </main>
  );
}
