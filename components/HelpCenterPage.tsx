
import React from 'react';
import { View } from '../App';

interface HelpCenterPageProps {
    onNavigate?: (view: View) => void;
}

const faqs = [
  {
    question: "How detailed are the generated business plans?",
    answer: "Our plans are comprehensive, typically ranging from 10-15 pages depending on the complexity of your inputs. They cover all standard sections required by banks and investors, including market analysis, operational plans, and financial overviews.",
  },
  {
    question: "Can I edit the plan after generation?",
    answer: "Yes! While the current version provides a copy-paste ready format, we recommend exporting it to a document editor like Google Docs or Microsoft Word to make final tweaks and add your specific branding.",
  },
  {
    question: "Is my business data secure?",
    answer: "Absolutely. We do not share your specific business ideas or data with third parties. Your inputs are used solely to generate your plan.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for our Pro and Enterprise plans if you are not satisfied with the quality of the generated output.",
  },
];

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32 animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Support</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How can we help you?
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Find answers to common questions about JHAIDIFY AI features, pricing, and security.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl divide-y divide-slate-900/10 dark:divide-white/10">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-8">
                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </dd>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
             <p className="text-base font-semibold text-slate-900 dark:text-white">Still have questions?</p>
             {onNavigate ? (
                 <button onClick={() => onNavigate('contact')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
                    Contact Support &rarr;
                 </button>
             ) : (
                 <a href="/contact" className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">Contact Support &rarr;</a>
             )}
        </div>
      </div>
    </div>
  );
};
