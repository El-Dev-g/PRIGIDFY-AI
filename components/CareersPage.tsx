
import React from 'react';

const positions = [
  {
    id: 1,
    role: 'Senior Frontend Engineer',
    type: 'Full-time',
    location: 'Remote',
    department: 'Engineering',
  },
  {
    id: 2,
    role: 'AI Research Scientist',
    type: 'Full-time',
    location: 'San Francisco, CA',
    department: 'Data Science',
  },
  {
    id: 3,
    role: 'Growth Marketing Manager',
    type: 'Full-time',
    location: 'Remote',
    department: 'Marketing',
  },
];

export const CareersPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 animate-fade-in">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Join our team
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
          We’re a remote-first team building the future of business planning. If you are passionate about AI, startups, and design, we want to hear from you.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        <div className="grid gap-4">
            {positions.map((job) => (
                <div key={job.id} className="group relative flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                    <div>
                        <h3 className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                            {job.role}
                        </h3>
                        <div className="mt-1 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span>{job.department}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                        </div>
                    </div>
                    <div className="flex-none">
                        <button className="rounded-full bg-white dark:bg-slate-700 px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
                            Apply <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
