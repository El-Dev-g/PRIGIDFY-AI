
import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 px-6 py-32 lg:px-8 animate-fade-in">
      <div className="mx-auto max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Terms of Service</h1>
        <p className="mt-6 text-xl leading-8">
          Last updated: March 15, 2026
        </p>
        <div className="mt-10 max-w-2xl">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the JHAIDIFY AI website.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p className="mt-6">
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">2. Use License</h2>
          <p className="mt-6">
             Permission is granted to temporarily download one copy of the materials (information or software) on JHAIDIFY AI's website for personal, non-commercial transitory viewing only.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">3. Disclaimer</h2>
          <p className="mt-6">
            The materials on JHAIDIFY AI's website are provided on an 'as is' basis. JHAIDIFY AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </div>
      </div>
    </div>
  );
};
