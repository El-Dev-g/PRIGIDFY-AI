
import React, { useEffect } from 'react';

interface BlogPostPageProps {
  postId: number;
  onBack: () => void;
}

// Mock data for the full blog posts
const blogPosts: Record<number, { title: string; date: string; author: string; category: string; content: React.ReactNode; image?: string }> = {
  1: {
    title: 'How to Validate Your Business Idea in 48 Hours',
    date: 'Mar 16, 2024',
    author: 'Sarah Chen',
    category: 'Startup Strategy',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: (
      <>
        <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
          Before writing a full plan, ensure your idea has legs. Here is a step-by-step guide to rapid market validation using low-code tools.
        </p>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The Myth of the "Stealth Mode"</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          Many first-time founders believe they need to protect their idea at all costs. They spend months building a product in isolation, only to launch and hear crickets. The truth is, execution is everything. Your idea is likely not as unique as you think, but your specific take on it might be. The only way to find out is to talk to people.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Step 1: The Smoke Test</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          You don't need a product to sell a product. Create a simple landing page using tools like Carrd or Webflow. Explain the value proposition clearly. Instead of a "Sign Up" button, use a "Join Waitlist" or "Pre-order" button. 
        </p>
        <ul className="list-disc pl-6 mb-6 text-slate-700 dark:text-slate-300 space-y-2">
            <li><strong>Define the problem:</strong> "Tired of tracking expenses in Excel?"</li>
            <li><strong>Offer the solution:</strong> "AI-powered bookkeeping for freelancers."</li>
            <li><strong>Call to Action:</strong> "Get early access."</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Step 2: Targeted Traffic</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          Don't just post on your personal Facebook. Spend $50 on Google Ads or Reddit Ads targeting specific keywords related to the problem you are solving. If you can't get anyone to click your ad, you either have a bad ad, or nobody is searching for a solution to that problem.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Step 3: Talk to Humans</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          When someone joins your waitlist, reach out personally. "Hey, thanks for signing up. I'm building this because I was frustrated with X. Is that why you signed up?" These conversations are gold. They will write your business plan for you.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-6 my-8">
            <p className="text-indigo-900 dark:text-indigo-200 font-medium italic">
                "Validation isn't about people saying they like your idea. It's about people trying to give you money or time to solve their problem."
            </p>
        </div>
      </>
    )
  },
  2: {
    title: 'The 5 Most Common Mistakes in Financial Projections',
    date: 'Mar 10, 2024',
    author: 'Michael Ross',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1554224155-98406856d03a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
    content: (
      <>
        <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
          Investors spot these errors instantly. Learn how to balance optimism with realism when forecasting your revenue and expenses.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. The "Hockey Stick" Curve Without Logic</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          Every founder wants to show a graph that goes up and to the right. But if your revenue jumps from $10k to $1M in month 6 without a corresponding increase in marketing spend or sales staff, investors will call your bluff. Growth is expensive.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Underestimating CAC (Customer Acquisition Cost)</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
           "Viral marketing" is not a strategy; it's a lottery ticket. You must assume you will pay for customers. Calculate your CAC conservatively. If you are selling a $20/month SaaS, can you afford to spend $100 to acquire a user? 
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Forgetting Cash Flow</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          Profit is not cash. You can be profitable on paper but go bankrupt because your clients pay you in 60 days while your employees need to be paid today. Always include a cash flow statement, not just an income statement.
        </p>
      </>
    )
  },
  3: {
    title: 'Why Storytelling Matters in Your Executive Summary',
    date: 'Feb 28, 2024',
    author: 'Jessica Lee',
    category: 'Pitching',
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    content: (
      <>
        <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
           Facts tell, but stories sell. Discover how to weave a compelling narrative that hooks investors from the very first paragraph.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The Human Brain on Stories</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          Data is important, but context is king. Investors review hundreds of decks. If your executive summary starts with "We are a generic solution for X market," they are already asleep. Start with a character. Start with a conflict.
        </p>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">The Hero's Journey</h2>
        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
          Position your customer as the hero, not your company. Your customer has a problem (the villain). Your company is the guide (Obi-Wan Kenobi) giving them the tool (the lightsaber) to win.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Structure of a Narrative Summary</h2>
        <ul className="list-decimal pl-6 mb-6 text-slate-700 dark:text-slate-300 space-y-2">
            <li><strong>The Hook:</strong> A startling statistic or a relatable anecdote.</li>
            <li><strong>The Turn:</strong> Why current solutions fail.</li>
            <li><strong>The Reveal:</strong> Your unique insight/solution.</li>
        </ul>
      </>
    )
  }
};

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onBack }) => {
  const post = blogPosts[postId];

  useEffect(() => {
    window.scrollTo(0, 0);
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
            {post.content}
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
