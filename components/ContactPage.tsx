
import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32 animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Contact Us</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Have questions or need assistance? We are here to help. Reach out to us using the details below.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Email */}
            <div className="relative pl-9 group">
                <dt className="inline font-semibold text-slate-900 dark:text-white">
                    <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-600">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    Email
                </dt>
                <dd className="mt-2 text-slate-600 dark:text-slate-400">
                    <a href="mailto:prigidcollection@gmail.com" className="hover:text-indigo-600 transition-colors">prigidcollection@gmail.com</a>
                </dd>
            </div>

            {/* Phone */}
            <div className="relative pl-9 group">
                <dt className="inline font-semibold text-slate-900 dark:text-white">
                    <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-600">
                         <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    Phone
                </dt>
                <dd className="mt-2 text-slate-600 dark:text-slate-400">
                    <a href="tel:+233550354548" className="hover:text-indigo-600 transition-colors">+233 55 035 4548</a>
                </dd>
            </div>

            {/* Location */}
            <div className="relative pl-9 group">
                <dt className="inline font-semibold text-slate-900 dark:text-white">
                    <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-600">
                         <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    Location
                </dt>
                <dd className="mt-2 text-slate-600 dark:text-slate-400">
                    Accra, Ghana
                </dd>
            </div>
        </div>
      </div>
    </div>
  );
};
