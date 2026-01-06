
import React, { useEffect, useState } from 'react';
import { db, BlogPost } from '../services/db';

interface BlogPostPageProps {
  postId: number | string;
  onBack: () => void;
}

// Fallback content for static posts logic is now moved to db.ts, 
// this component now just fetches by ID.

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<BlogPost | undefined>(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchedPost = db.blogs.getById(postId);
    setPost(fetchedPost);
  }, [postId]);

  if (!post) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Post not found</h2>
            <button onClick={onBack} className="mt-4 text-indigo-600 hover:text-indigo-500">Back to blog</button>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 animate-fade-in pb-24">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50 z-10"></div>
        <img 
            src={post.image || 'https://images.unsplash.com/photo-1499750310159-52f0f83ad49d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
            alt={post.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 max-w-7xl mx-auto w-full">
            <button 
                onClick={onBack}
                className="self-start mb-6 flex items-center text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm text-sm"
            >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
            </button>
            <div className="flex items-center gap-x-4 text-sm text-white/90 mb-4">
                <time dateTime={post.date}>{post.date}</time>
                <span className="w-1 h-1 rounded-full bg-white/50"></span>
                <span className="font-medium bg-indigo-500/80 px-2 py-0.5 rounded text-xs">{post.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white max-w-3xl leading-tight">
                {post.title}
            </h1>
            <p className="mt-2 text-white/80 font-medium">By {post.author}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-12">
        <article className="prose prose-lg prose-slate dark:prose-invert mx-auto">
            {/* 
               If content is a string (HTML from AI), use dangerouslySetInnerHTML.
               If it's ReactNode (Static posts), render directly. 
               However, to unify, we updated db.ts static posts to string HTML too for simplicity.
               If legacy format remains, we handle it.
            */}
            {typeof post.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
                // @ts-ignore - Handle legacy ReactNode if any
                <div>{post.content}</div>
            )}
        </article>

        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 flex justify-between items-center">
             <div className="text-sm text-slate-500 dark:text-slate-400">
                Posted in <span className="font-medium text-indigo-600 dark:text-indigo-400">{post.category}</span>
             </div>
             <div className="flex gap-4">
                 <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                     <span className="sr-only">Share on Twitter</span>
                     <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                 </button>
                 <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                     <span className="sr-only">Share on Facebook</span>
                     <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};
