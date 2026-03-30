import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { LogOut, Download } from 'lucide-react'
import { revalidatePath } from 'next/cache'

async function verifyPassword(formData: FormData) {
  'use server'
  const pwd = formData.get('password');
  if (pwd === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    revalidatePath('/admin/waitlist');
  }
}

async function logout() {
  'use server'
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  revalidatePath('/admin/waitlist');
}

export default async function AdminWaitlistPage() {
  const cookieStore = await cookies()
  const isAdminOrAuthorized = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAdminOrAuthorized) {
    return (
      <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6">
        <div className="bg-cream rounded-2xl p-8 max-w-sm w-full">
          <h1 className="text-2xl font-serif text-aubergine-dark font-bold text-center mb-6">Admin Login</h1>
          <form action={verifyPassword} className="space-y-4">
            <input 
              type="password" 
              name="password"
              placeholder="Admin Password"
              className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy/20"
              required 
            />
            <button type="submit" className="w-full bg-aubergine-dark text-white py-3 rounded-xl font-bold">
              Unlock
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Fetch waitlist from Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: waitlist, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error fetching waitlist: {error.message}</div>
  }

  const handleExportCSV = async () => {
     "use server"
     // Server Actions don't easily return file downloads, so we usually generate it on client.
     // For this simple admin page, I will include a small client component script or raw code for CSV export below.
  }

  // Create a CSV string for clientside download
  const csvHeader = 'email,name,source,mood_result,created_at\n';
  const csvContent = waitlist?.map(row => `${row.email},"${row.name || ''}",${row.source},${row.mood_result || ''},${row.created_at}`).join('\n');
  const csvData = encodeURIComponent(csvHeader + csvContent);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center bg-cream p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-aubergine-dark">Waitlist Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Total Signups: {waitlist?.length || 0}</p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`data:text/csv;charset=utf-8,${csvData}`} 
              download="waitlist.csv"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </a>
            <form action={logout}>
              <button type="submit" className="text-gray-500 hover:text-aubergine-dark p-2 bg-gray-100 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </header>

        <div className="bg-cream rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Mood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {waitlist?.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-900">{entry.name || '-'}</td>
                    <td className="p-4 text-gray-600">{entry.email}</td>
                    <td className="p-4 text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-500 capitalize">{entry.source}</td>
                    <td className="p-4">
                      {entry.mood_result ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {entry.mood_result}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!waitlist || waitlist.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                      Waitlist is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
