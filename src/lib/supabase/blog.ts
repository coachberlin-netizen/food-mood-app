import { createClient } from './server';
import { Database } from '@/types/supabase'; // Assuming types exist or will be generated

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  cover_image: string | null;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  author_name: string;
  newsletter_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Public: Get all published posts
 */
export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('newsletter_date', { ascending: false, nullsFirst: false })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }

  return data as BlogPost[];
}

/**
 * Public: Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }

  return data as BlogPost | null;
}

/**
 * Admin: Get all posts (drafts + published)
 */
export async function getAllPostsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts for admin:', error);
    return [];
  }

  return data as BlogPost[];
}

/**
 * Admin: Get a single post by ID (for editing)
 */
export async function getPostByIdAdmin(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching post by id for admin:', error);
    return null;
  }

  return data as BlogPost | null;
}
