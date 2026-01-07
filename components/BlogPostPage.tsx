
import React, { useEffect, useState } from 'react';
import { db, BlogPost } from '../services/db';

interface BlogPostPageProps {
  postId: number | string;
  onBack: () => void;
  onNavigateToPost: (id: number | string) => void;
  onNavigate: (view: any) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onBack, onNavigateToPost, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [readingTime, setReadingTime] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
        const fetchedPost = await db.blogs.getById(postId);
        
        if (fetchedPost) {
            setPost(fetchedPost);

            // Calculate reading time
            const textContent = typeof fetchedPost.content === 'string' 
                ? fetchedPost.content.replace(/<[^>]*>/g, '') 
                : '';
            const words = textContent.split(/\s+/).length;
            const minutes = Math.max(1, Math.round(words / 200));
            setReadingTime(`${minutes} min read`);

            // Get related posts
            const all = await db.blogs.getAll();
            setRelatedPosts(all.filter(p => p.id !== fetchedPost.id).slice(0, 3));
        }
    };
    loadData();
  }, [postId]);

  const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  if (!post) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Loading...</h2>
            <button onClick={onBack} className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
                &larr; Back to blog
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 animate-fade-in pb-24">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <button 
                  onClick={onBack}
                  className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blog
              </button>
              
              <div className="flex gap-2">
                 <button onClick={handleCopyLink} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors" title="Copy Link">
                     {isCopied ? (
                         <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                         </svg>
                     ) : (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                         </svg>
                     )}
                 </button>
              </div>
          </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-10 text-center">
         <div className="flex items-center justify-center gap-3 mb-6">
             <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wide uppercase">
                 {post.category}
             </span>
             <span className="text-slate-400 dark:text-slate-600">•</span>
             <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{post.date}</span>
             <span className="text-slate-400 dark:text-slate-600">•</span>
             <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{readingTime}</span>
         </div>
         
         <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-8">
             {post.title}
         </h1>

         <div className="flex items-center justify-center gap-4 mb-10">
             <div className="flex items-center gap-3">
                 <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=6366f1&color=fff`} 
                    alt={post.author}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                 />
                 <div className="text-left">
                     <div className="text-sm font-bold text-slate-900 dark:text-white">{post.author}</div>
                     <div className="text-xs text-slate-500 dark:text-slate-400">Content Editor</div>
                 </div>
             </div>
         </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="aspect-w-16 aspect-h-9 relative rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
               <img 
                   src={post.image || 'https://images.unsplash.com/photo-1499750310159-52f0f83ad49d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
                   alt={post.title} 
                   className="w-full h-full object-cover"
               />
          </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <article className="prose prose-lg prose-indigo dark:prose-invert mx-auto">
            {typeof post.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
                // @ts-ignore
                <div>{post.content}</div>
            )}
        </article>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-12"></div>

        {/* CTA Section */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 md:p-10 text-center border border-slate-200 dark:border-slate-700">
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Ready to build your dream business?</h3>
             <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
                 Turn your ideas into a professional business plan in minutes with our AI-powered platform.
             </p>
             <button 
                 onClick={() => onNavigate('pricing')}
                 className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform hover:-translate-y-0.5"
             >
                 Start Your Free Plan
             </button>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Read Next</h3>
             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                 {relatedPosts.map(related => (
                     <div 
                        key={related.id} 
                        className="group cursor-pointer"
                        onClick={() => onNavigateToPost(related.id)}
                     >
                         <div className="rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 aspect-video relative">
                             <img 
                                src={related.image} 
                                alt={related.title} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                             />
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                             <span className="text-indigo-600 dark:text-indigo-400 font-medium">{related.category}</span>
                             <span>•</span>
                             <span>{related.date}</span>
                         </div>
                         <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                             {related.title}
                         </h4>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
};
