import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || (!user.email && !user.phone)) {
    redirect('/login');
  }

  if (!isUserAdmin(user)) {
    redirect(`/dashboard?error=admin-only&email=${encodeURIComponent(user.email || 'unknown')}`);
  }

  return (
    <div className="min-h-screen bg-cream-dark/20 text-aubergine-dark">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12 border-b border-aubergine-dark/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold mb-2 block">Panel de Control</span>
            <h1 className="text-4xl font-serif font-black">Newsletter Curated</h1>
          </div>
          <p className="text-sm text-aubergine-dark/50 hidden md:block">
            Autenticado como: <span className="font-semibold">{user.email}</span>
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
