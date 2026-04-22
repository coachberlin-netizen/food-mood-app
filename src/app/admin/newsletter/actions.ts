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
  if (!isUserAdmin(user)) throw new Error('Acceso denegado.');

  const { data, error } = await supabase
    .from('curated_content')
    .insert({
      week_start: input.week_start,
      category:   input.category,
      title:      input.title,
      summary:    input.summary || null,
      url:        input.external_url || null,
      is_active:  true,
      status:     'scheduled',
    })
    .select()
    .single();

  if (error) throw new Error(`Error guardando item: ${error.message}`);

  revalidatePath('/admin/newsletter');
  return data;
}

export async function deleteNewsletterItemAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isUserAdmin(user)) throw new Error('Acceso denegado.');

  // No permitir borrar ítems ya enviados
  const { data: item } = await supabase
    .from('curated_content')
    .select('status')
    .eq('id', id)
    .single();

  if (item?.status === 'sent') throw new Error('No se puede eliminar una edición ya enviada.');

  const { error } = await supabase.from('curated_content').delete().eq('id', id);
  if (error) throw new Error(`Error eliminando item: ${error.message}`);

  revalidatePath('/admin/newsletter');
  return true;
}

export async function getNewsletterItemsByWeek(weekStart: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isUserAdmin(user)) throw new Error('Acceso denegado.');

  const { data, error } = await supabase
    .from('curated_content')
    .select('id, category, title, summary, url, week_start, is_active, status, sent_at')
    .eq('week_start', weekStart)
    .order('category', { ascending: true });

  if (error) throw new Error(`Error cargando items: ${error.message}`);
  return data ?? [];
}

// Vista de cola: todas las ediciones ordenadas por semana
export async function getNewsletterQueue() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isUserAdmin(user)) throw new Error('Acceso denegado.');

  const { data, error } = await supabase
    .from('curated_content')
    .select('week_start, status, sent_at')
    .order('week_start', { ascending: true });

  if (error) throw new Error(`Error cargando cola: ${error.message}`);

  // Agrupar por week_start → una entrada por edición
  const map = new Map<string, { week_start: string; status: string; sent_at: string | null; count: number }>()
  for (const row of data ?? []) {
    if (!map.has(row.week_start)) {
      map.set(row.week_start, { week_start: row.week_start, status: row.status, sent_at: row.sent_at, count: 0 })
    }
    map.get(row.week_start)!.count++
  }

  return Array.from(map.values())
}
