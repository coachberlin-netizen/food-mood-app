"use server";

import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/lib/supabase/blog';
import { revalidatePath } from 'next/cache';
import { isUserAdmin } from '@/lib/admin-config';

/**
 * Admin: Upsert post (Server Action)
 */
export async function upsertPostAction(post: Partial<BlogPost>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isUserAdmin(user)) {
    throw new Error('UnauthorizedAccessException: Administrator privileges required to upsert posts.');
  }
  
  // If publishing, ensure published_at is set if not already
  if (post.status === 'published' && !post.published_at) {
    post.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(post)
    .select()
    .single();

  if (error) {
    throw new Error(`Error saving post: ${error.message}`);
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath('/admin/blog');
  
  return data as BlogPost;
}

/**
 * Admin: Delete post (Server Action)
 */
export async function deletePostAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!isUserAdmin(user)) {
    throw new Error('UnauthorizedAccessException: Administrator privileges required to delete posts.');
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  
  return true;
}
