import React from 'react';
import { notFound } from 'next/navigation';
import { getPostByIdAdmin } from '@/lib/supabase/blog';
import { BlogForm } from '@/components/blog/BlogForm';

interface EditPostPageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostByIdAdmin(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Editar Artículo</h2>
        <p className="text-aubergine-dark/40 text-sm font-light">
          Modificando: <span className="font-medium text-gold">{post.title}</span>
        </p>
      </div>
      
      <BlogForm initialData={post} />
    </div>
  );
}
