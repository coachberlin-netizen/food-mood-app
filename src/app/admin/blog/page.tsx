import React from 'react';
import Link from 'next/link';
import { getAllPostsAdmin } from '@/lib/supabase/blog';
export default async function AdminBlogPage() {
  const posts = await getAllPostsAdmin();

  const total = posts.length;
  const published = posts.filter(p => p.status === 'published').length;
  const drafts = total - published;

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-aubergine-dark/5 shadow-luxury flex items-center gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40">Total Posts</p>
            <p className="text-2xl font-serif font-black">{total}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-aubergine-dark/5 shadow-luxury flex items-center gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40">Publicados</p>
            <p className="text-2xl font-serif font-black">{published}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-aubergine-dark/5 shadow-luxury flex items-center gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40">Borradores</p>
            <p className="text-2xl font-serif font-black">{drafts}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-semibold">Listado de Artículos</h2>
        <Link href="/admin/blog/new" className="px-4 py-2 bg-aubergine-dark text-white rounded font-bold">
          + Nuevo Post
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-aubergine-dark/5 shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-aubergine-dark/5 text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/50">
                <th className="px-8 py-4">Título / Slug</th>
                <th className="px-8 py-4">Newsletter</th>
                <th className="px-8 py-4">Estado</th>
                <th className="px-8 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aubergine-dark/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-aubergine-dark/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-serif font-semibold text-aubergine-dark text-lg mb-1">{post.title}</div>
                    <div className="text-[11px] text-aubergine-dark/30 font-mono">/{post.slug}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-aubergine-dark/60 font-medium">
                      {post.newsletter_date ? 
                        new Date(post.newsletter_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                        : '—'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gold/15 text-gold'
                    }`}>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        target="_blank"
                        className="text-sm font-bold text-aubergine-dark/60 hover:text-aubergine-dark"
                      >
                        Ver
                      </Link>
                      <Link 
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-sm font-bold text-aubergine-dark/60 hover:text-gold"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-aubergine-dark/30 italic font-light">No hay artículos todavía.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
          </table>
        </div>
      </div>
    </div>
  );
}
