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
  summary:      string;
  external_url: string;
}

export async function saveNewsletterItemAction(input: NewsletterItemInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isUserAdmin(user)) {
    throw new Error('Acceso denegado: se requieren privilegios de administrador.');
  }

  const { data, error } = await supabase
    .from('curated_content')
    .insert({
      week_start:   input.week_start,
      category:     input.category,
      title:        input.title,
      summary:      input.summary || null,
      url:          input.external_url || null,
      is_active:    true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error guardando item: ${error.message}`);
  }

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
    .from('curated_content')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error eliminando item: ${error.message}`);
  }

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
    .from('curated_content')
    .select('id, category, title, summary, url, week_start, is_active')
    .eq('week_start', weekStart)
    .order('category', { ascending: true });

  if (error) {
    throw new Error(`Error cargando items: ${error.message}`);
  }

  return data ?? [];
}
