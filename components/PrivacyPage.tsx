
import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 px-6 py-32 lg:px-8 animate-fade-in">
      <div className="mx-auto max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-6 text-xl leading-8">
          Last updated: August 25, 2024
        </p>
        <div className="mt-10 max-w-2xl">
          <p>
            At JHAIDIFY AI, we respect your privacy and are committed to protecting it through our compliance with this policy.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p className="mt-6">
            We collect several types of information from and about users of our Website, including information by which you may be personally identified, such as name, postal address, e-mail address, and telephone number.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p className="mt-6">
            We use information that we collect about you or that you provide to us, including any personal information:
          </p>
          <ul role="list" className="mt-8 max-w-xl space-y-8 text-slate-600 dark:text-slate-400 list-disc pl-5">
            <li>To present our Website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
          </ul>
           <h2 className="mt-16 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">3. Data Security</h2>
          <p className="mt-6">
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
          </p>
        </div>
      </div>
    </div>
  );
};
