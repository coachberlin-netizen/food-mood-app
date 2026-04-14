import { getPublishedPosts, BlogPost } from './blog';

export interface NewsletterHighlights {
  post: BlogPost | null;
  recipes: any[]; // Kept for UI compatibility, but will be empty until real schema supports it
}

export async function getWeeklyHighlights(): Promise<NewsletterHighlights> {
  try {
    // 1. Get published posts
    const posts = await getPublishedPosts();
    if (!posts || posts.length === 0) {
      return { post: null, recipes: [] };
    }

    // Latest published post
    const latestPost = posts[0];

    // 2. No explicit typed recipe linkage in the BlogPost schema yet.
    // Shipping newsletter-only mode.
    return {
      post: latestPost,
      recipes: []
    };
  } catch (error) {
    console.error('Safe fallback: Error in getWeeklyHighlights:', error);
    return { post: null, recipes: [] };
  }
}

