"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Save, Send, ArrowLeft, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/supabase/blog';
import { upsertPostAction, deletePostAction } from '@/app/admin/blog/actions';

interface BlogFormProps {
  initialData?: BlogPost | null;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    initialData || {
      title: '',
      slug: '',
      excerpt: '',
      content_md: '',
      cover_image: '',
      tags: [],
      status: 'draft',
      author_name: 'Food·Mood',
      newsletter_date: new Date().toISOString().split('T')[0],
      seo_title: '',
      seo_description: '',
    }
  );

  const [tagInput, setTagInput] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, initialData, formData.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent, statusOverride?: 'draft' | 'published') => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSave = { 
        ...formData, 
        status: statusOverride || formData.status 
      };
      
      await upsertPostAction(dataToSave);
      router.push('/admin/blog');
      router.refresh();
    } catch (error: any) {
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !confirm('¿Estás seguro de que quieres eliminar este post?')) return;
    
    setLoading(true);
    try {
      await deletePostAction(initialData.id);
      router.push('/admin/blog');
      router.refresh();
    } catch (error: any) {
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-aubergine-dark/5 shadow-luxury">
        <Link href="/admin/blog" className="flex items-center gap-2 text-aubergine-dark/40 hover:text-aubergine-dark transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al listado</span>
        </Link>
        <div className="flex items-center gap-3">
          {initialData?.id && (
            <button 
              type="button" 
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          )}
          <Button 
            type="button" 
            variant="outline" 
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Borrador
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={loading}
            className="gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {formData.status === 'published' ? 'Actualizar' : 'Publicar Ahora'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-aubergine-dark/5 shadow-luxury space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Título del Post</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Por qué el kefir es tu mejor aliado emocional"
                className="w-full text-2xl font-serif font-bold text-aubergine-dark border-none focus:ring-0 placeholder:text-aubergine-dark/10 p-0"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2 flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> Slug (URL)
              </label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="url-amigable-del-post"
                className="w-full text-sm font-mono text-gold border-none focus:ring-0 p-0"
                required
              />
            </div>

            <hr className="border-aubergine-dark/5" />

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/40 mb-3">Newsletter Content (Markdown)</label>
              <textarea 
                name="content_md"
                value={formData.content_md}
                onChange={handleChange}
                rows={20}
                placeholder="Escribe el contenido aquí usando Markdown..."
                className="w-full font-sans text-base text-aubergine-dark/80 bg-cream/30 border-none rounded-xl focus:ring-1 focus:ring-gold/20 p-6 min-h-[500px]"
                required
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-aubergine-dark/5 shadow-luxury space-y-6">
            <h3 className="font-serif font-semibold text-lg">Optimización SEO</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Meta Title</label>
                <input 
                  type="text" 
                  name="seo_title"
                  value={formData.seo_title || ''}
                  onChange={handleChange}
                  className="w-full p-4 bg-cream/30 border-none rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Meta Description</label>
                <textarea 
                  name="seo_description"
                  value={formData.seo_description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 bg-cream/30 border-none rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-aubergine-dark/5 shadow-luxury space-y-6">
            <h3 className="font-serif font-semibold text-lg">Configuración</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Fecha Newsletter</label>
                <input 
                  type="date" 
                  name="newsletter_date"
                  value={formData.newsletter_date || ''}
                  onChange={handleChange}
                  className="w-full p-4 bg-cream/30 border-none rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Resumen (Excerpt)</label>
                <textarea 
                  name="excerpt"
                  value={formData.excerpt || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Pequeño adelanto para las tarjetas..."
                  className="w-full p-4 bg-cream/30 border-none rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Imagen de Portada (URL)</label>
                <input 
                  type="text" 
                  name="cover_image"
                  value={formData.cover_image || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full p-4 bg-cream/30 border-none rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Tags (Enter para añadir)</label>
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Ciencia, Recetas, Focus..."
                  className="w-full p-4 bg-cream/30 border-none rounded-xl text-sm"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-aubergine-dark/5 text-aubergine-dark/50 text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
