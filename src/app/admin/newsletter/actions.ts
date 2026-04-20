"use server";

import { createClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/admin-config';
import { revalidatePath } from 'next/cache';

const CATEGORIES = ['neurociencia', 'alimentacion', 'psicologia', 'longevidad', 'biotecnologia'] as const;
type Category = typeof CATEGORIES[number];

export interface NewsletterItemInput {
  week_start:   string;
  category:     Category;
  title:        string;
  excerpt:      string;
  external_url: string;
}

export async function saveNewsletterItemAction(input: NewsletterItemInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isUserAdmin(user)) {
    throw new Error('Acceso denegado: se requieren privilegios de administrador.');
  }

  const slug = `newsletter-${input.week_start}-${input.category}-${Date.now()}`;

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug,
      title:        input.title,
      excerpt:      input.excerpt || null,
      content_md:   '',
      tags:         [],
      status:       'published',
      published_at: new Date().toISOString(),
      author_name:  user!.email ?? 'Admin',
      category:     input.category,
      week_start:   input.week_start,
      external_url: input.external_url || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error guardando item: ${error.message}`);
  }

  revalidatePath('/blog');
  revalidatePath('/semana');
  revalidatePath('/admin/newsletter');

  return data;
}

export async function deleteNewsletterItemAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isUserAdmin(user)) {
    throw new Error('Acceso denegado: se requieren privilegios de administrador.');
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error eliminando item: ${error.message}`);
  }

  revalidatePath('/blog');
  revalidatePath('/semana');
  revalidatePath('/admin/newsletter');

  return true;
}

export async function getNewsletterItemsByWeek(weekStart: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isUserAdmin(user)) {
    throw new Error('Acceso denegado.');
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, category, title, excerpt, external_url, week_start')
    .eq('week_start', weekStart)
    .not('category', 'is', null)
    .order('category', { ascending: true });

  if (error) {
    throw new Error(`Error cargando items: ${error.message}`);
  }

  return data ?? [];
}
