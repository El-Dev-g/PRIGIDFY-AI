
import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 animate-fade-in">
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About JHAIDIFY AI</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              We are on a mission to democratize entrepreneurship. We believe that everyone with a great idea deserves a professional business plan, regardless of their background or expertise.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Our Story</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Founded in 2024, JHAIDIFY AI started with a simple observation: too many brilliant business ideas fail because founders get stuck on the paperwork. Writing a business plan is often seen as a tedious hurdle rather than a strategic exercise.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We combined modern generative AI with expert business methodology to create a tool that acts as a co-founder. It asks the right questions, structures the answers, and polishes the prose, letting entrepreneurs focus on what they do best: building.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
             <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-indigo-600 mb-2">10k+</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Plans Generated</div>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">User Satisfaction</div>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">AI Availability</div>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-4xl font-bold text-indigo-600 mb-2">Global</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Community</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
