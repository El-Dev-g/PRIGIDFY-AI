
import React from 'react';

interface BlogPageProps {
  onNavigateToPost: (id: number) => void;
}

const posts = [
  {
    id: 1,
    title: 'How to Validate Your Business Idea in 48 Hours',
    excerpt: 'Before writing a full plan, ensure your idea has legs. Here is a step-by-step guide to rapid market validation using low-code tools.',
    date: 'Mar 16, 2024',
    category: 'Startup Strategy',
    author: 'Sarah Chen',
  },
  {
    id: 2,
    title: 'The 5 Most Common Mistakes in Financial Projections',
    excerpt: 'Investors spot these errors instantly. Learn how to balance optimism with realism when forecasting your revenue and expenses.',
    date: 'Mar 10, 2024',
    category: 'Finance',
    author: 'Michael Ross',
  },
  {
    id: 3,
    title: 'Why Storytelling Matters in Your Executive Summary',
    excerpt: 'Facts tell, but stories sell. Discover how to weave a compelling narrative that hooks investors from the very first paragraph.',
    date: 'Feb 28, 2024',
    category: 'Pitching',
    author: 'Jessica Lee',
  },
];

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigateToPost }) => {
  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32 animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">From the Blog</h2>
          <p className="mt-2 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Insights, guides, and success stories for the modern entrepreneur.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigateToPost(post.id)}>
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
