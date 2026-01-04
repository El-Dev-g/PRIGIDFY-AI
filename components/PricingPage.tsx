
import React from 'react';

interface PricingPageProps {
  onSelectPlan: (planId: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  const tiers = [
    {
      name: 'Starter',
      id: 'tier-starter',
      href: '#',
      priceMonthly: '$0',
      description: 'Perfect for exploring your first business idea.',
      features: ['1 Business Plan', 'Basic AI Generation', 'Standard Support', 'Export to Text'],
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      href: '#',
      priceMonthly: '$29',
      description: 'For serious entrepreneurs ready to launch.',
      features: [
        'Unlimited Business Plans',
        'Advanced AI Model (Gemini Pro)',
        'Financial Forecasting Tools',
        'Priority Support',
        'Export to PDF & Docx',
      ],
      mostPopular: true,
    },
    {
      name: 'Enterprise',
      id: 'tier-enterprise',
      href: '#',
      priceMonthly: '$99',
      description: 'Dedicated support for incubators and agencies.',
      features: [
        'Team Collaboration',
        'Custom Branding',
        'API Access',
        'Dedicated Account Manager',
        'Custom AI Training',
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Choose the right plan for your journey
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600 dark:text-slate-300">
          Whether you're just brainstorming or ready to pitch to investors, we have a plan that fits your needs.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl p-8 ring-1 ring-slate-200 dark:ring-slate-700 xl:p-10 ${
                tier.mostPopular ? 'bg-slate-50 dark:bg-slate-800 ring-2 ring-indigo-600' : 'bg-white dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={`text-lg font-semibold leading-8 ${
                      tier.mostPopular ? 'text-indigo-600' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <span className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{tier.priceMonthly}</span>
                  <span className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan(tier.id)}
                aria-describedby={tier.id}
                className={`mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-slate-800 dark:text-white dark:ring-1 dark:ring-white/10 dark:hover:bg-slate-700'
                }`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
