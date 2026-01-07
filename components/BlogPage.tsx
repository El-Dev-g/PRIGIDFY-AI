
import React, { useEffect, useState } from 'react';
import { db, BlogPost } from '../services/db';
import { generateAutoBlogPost } from '../services/geminiService';

interface BlogPageProps {
  onNavigateToPost: (id: number | string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigateToPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    // 1. Load initial posts
    const loadPosts = async () => {
        const data = await db.blogs.getAll();
        setPosts(data);
    };
    loadPosts();

    // 2. Check automation trigger (Silent background generation)
    const checkAutomation = async () => {
        // Enforces: Max 5 per day, at least 2 hours apart
        if (db.blogs.shouldGenerateNew()) {
            try {
                // Mark generation as started to prevent race conditions
                db.blogs.recordGeneration();
                
                const newPostData = await generateAutoBlogPost();
                
                const newPost: BlogPost = {
                    id: `ai-${Date.now()}`,
                    title: newPostData.title,
                    excerpt: newPostData.excerpt,
                    content: newPostData.content,
                    category: newPostData.category,
                    author: 'PRIGIDFY', 
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    isAi: true,
                    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                };

                await db.blogs.add(newPost);
                loadPosts(); // Refresh UI with new post immediately
            } catch (e) {
                console.error("Auto-blog generation failed", e);
            }
        }
    };
    
    // Small delay to not block initial render
    const timer = setTimeout(checkAutomation, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32 animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">From the Blog</h2>
          </div>
          <p className="mt-2 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Insights, guides, and success stories for the modern entrepreneur.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden" onClick={() => onNavigateToPost(post.id)}>
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-slate-500 dark:text-slate-400">
                  {post.date}
                </time>
                <span className="relative z-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100">
                  {post.category}
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span className="absolute inset-0" />
                  {post.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {post.excerpt}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    <span className="absolute inset-0" />
                    {post.author}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
