import React from 'react';
import { BlogForm } from '@/components/blog/BlogForm';

export default function NewBlogPostPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Crear Nuevo Artículo</h2>
        <p className="text-aubergine-dark/40 text-sm font-light">
          Rellena los campos para publicar tu newsletter en el blog.
        </p>
      </div>
      
      <BlogForm />
    </div>
  );
}
