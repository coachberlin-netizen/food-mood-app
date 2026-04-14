import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export default async function AdminBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Robust protection: check if user is authenticated AND in the admin whitelist
  if (!user || (!user.email && !user.phone)) {
    redirect('/ingresar');
  }

  if (!isUserAdmin(user)) {
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    console.error(`[ADMIN ACCESS DENIED] User: ${user.email}. Whitelist: ${adminEmails.join(', ')}`);
    redirect(`/dashboard?error=admin-only&email=${encodeURIComponent(user.email || 'unknown')}`);
  }

  return (
    <div className="min-h-screen bg-cream-dark/20 text-aubergine-dark">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 border-b border-aubergine-dark/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold mb-2 block">Panel de Control</span>
            <h1 className="text-4xl font-serif font-black">Blog & Newsletters</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-aubergine-dark/50 hidden md:block">
              Autenticado como: <span className="font-semibold">{user.email}</span>
            </p>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
