
import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Testimonials data
const testimonials = [
  {
    content: "JHAIDIFY AI helped me secure my first round of funding. The structured approach and AI suggestions turned my scattered notes into a professional document.",
    author: "Alex Rivera",
    role: "Founder, TechFlow",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "I was dreaded writing a business plan, but this tool made it actually enjoyable. The financial projection breakdown was incredibly helpful.",
    author: "Sarah Jenkins",
    role: "Owner, GreenLeaf Cafe",
    image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content: "As a solopreneur, I didn't have the budget for a consultant. JHAIDIFY AI acted as my co-founder, filling in the gaps in my strategy.",
    author: "Marcus Chen",
    role: "Freelance Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // In a real app, send to backend here
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Background Gradients */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                  New v2.0
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                  <span>Just shipped</span>
                  <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              The AI Co-Founder for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Business Plan</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Transform your rough ideas into investor-ready documents. Our AI consultant guides you step-by-step, generating comprehensive financial projections, market analysis, and strategy.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={onGetStarted}
                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform hover:scale-105"
              >
                Start Building for Free
              </button>
              <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                View Sample Plan <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          
          {/* Hero Image/Mockup */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 dark:bg-white/5 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="w-[40rem] rounded-md shadow-2xl ring-1 ring-slate-900/10 bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
                   {/* Abstract Dashboard UI */}
                   <div className="flex gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <div className="space-y-4 animate-pulse">
                      <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded w-1/3"></div>
                      <div className="grid grid-cols-3 gap-4">
                          <div className="h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800"></div>
                          <div className="h-24 bg-slate-50 dark:bg-slate-700/50 rounded"></div>
                          <div className="h-24 bg-slate-50 dark:bg-slate-700/50 rounded"></div>
                      </div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-4/6"></div>
                      <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded w-full mt-4"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 border-y border-slate-100 dark:border-slate-800">
        <h2 className="text-center text-lg font-semibold leading-8 text-slate-900 dark:text-white mb-8">
          Trusted by founders from
        </h2>
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <span className="col-span-2 max-h-12 w-full flex items-center justify-center lg:col-span-1 text-2xl font-bold text-[#F26522] text-center">Y Combinator</span>
          <span className="col-span-2 max-h-12 w-full flex items-center justify-center lg:col-span-1 text-2xl font-bold text-[#33CC79] text-center">Techstars</span>
          <span className="col-span-2 max-h-12 w-full flex items-center justify-center lg:col-span-1 text-2xl font-bold text-[#2d9cdb] text-center">500 Startups</span>
          <span className="col-span-2 max-h-12 w-full flex items-center justify-center sm:col-start-2 lg:col-span-1 text-2xl font-bold text-[#00A550] dark:text-[#4ade80] text-center">Sequoia</span>
          <span className="col-span-2 max-h-12 w-full flex items-center justify-center sm:col-start-auto lg:col-span-1 text-2xl font-bold text-slate-900 dark:text-white text-center">a16z</span>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div id="features" className="bg-slate-50 dark:bg-slate-800/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              From Idea to Execution
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              We've replaced the traditional consultant with a smart, always-available AI agent.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
               {/* Feature 1 */}
               <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center mb-6">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart Validation</h3>
                  <p className="text-slate-600 dark:text-slate-400 flex-grow">
                    Don't just write a plan, validate your assumptions. Our AI challenges your inputs to ensure your business logic holds water.
                  </p>
               </div>

               {/* Feature 2 */}
               <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-6">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Financial Modeling</h3>
                  <p className="text-slate-600 dark:text-slate-400 flex-grow">
                    Generate realistic revenue forecasts, startup costs, and break-even analysis without needing a finance degree.
                  </p>
               </div>

               {/* Feature 3 */}
               <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center mb-6">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Visual Generation</h3>
                  <p className="text-slate-600 dark:text-slate-400 flex-grow">
                    Automatically generate organizational charts, product mockups, and market graphs to make your plan visually compelling.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Trusted by entrepreneurs worldwide
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.author} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-8 text-sm leading-6 border border-slate-100 dark:border-slate-700">
                    <blockquote className="text-slate-900 dark:text-slate-300 italic">
                      <p>“{testimonial.content}”</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <img className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200" src={testimonial.image} alt="" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</div>
                        <div className="text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-slate-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to launch your business?
              <br />
              Start writing your plan today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join thousands of founders who have used JHAIDIFY AI to secure funding and clarify their vision.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={onGetStarted}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started for free
              </button>
              <a href="#" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle cx={512} cy={512} r={512} fill="url(#gradient-id)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="gradient-id">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
