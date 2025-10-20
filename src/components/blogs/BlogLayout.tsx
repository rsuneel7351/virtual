// src/components/blog/BlogLayout.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BlogLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ title, description, children }) => {
  return (
    <>
      <Helmet>
        <title>{`${title} | LoveAI Blog`}</title>
        <meta name="description" content={description} />
        {/* You can add more meta tags here, like Open Graph tags for social media */}
      </Helmet>
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <article className="max-w-4xl mx-auto space-y-6 leading-relaxed">
          {children}
        </article>
      </div>
    </>
  );
};

export default BlogLayout;