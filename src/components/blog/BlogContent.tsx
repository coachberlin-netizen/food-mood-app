import React from 'react';

interface BlogContentProps {
  contentHtml: string;
}

export function BlogContent({ contentHtml }: BlogContentProps) {
  return (
    <div 
      className="prose prose-food-mood prose-lg max-w-none 
                 prose-headings:font-serif prose-headings:text-aubergine-dark 
                 prose-p:text-aubergine-dark/80 prose-p:leading-[1.8] prose-p:font-light
                 prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                 prose-strong:text-aubergine-dark prose-strong:font-semibold
                 prose-blockquote:border-l-gold prose-blockquote:bg-cream-dark/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                 prose-ul:text-aubergine-dark/70 prose-ol:text-aubergine-dark/70
                 prose-img:rounded-2xl prose-img:shadow-luxury
                 prose-table:border-collapse prose-table:border prose-table:border-aubergine-dark/10
                 prose-th:bg-aubergine-dark/5 prose-th:p-4 prose-th:text-aubergine-dark
                 prose-td:p-4 prose-td:border-t prose-td:border-aubergine-dark/10"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
