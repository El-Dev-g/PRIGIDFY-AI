
import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { db } from '../services/db';

interface BillingPageProps {
  user: UserProfile;
  onSelectPlan: (planId: string) => void;
  onPlanUpdate: (user: UserProfile) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ user, onSelectPlan, onPlanUpdate }) => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Mock Payment State
  const [paymentMethod, setPaymentMethod] = useState<{brand: string, last4: string, expMonth: string, expYear: string} | null>(
      user.plan !== 'starter' 
      ? { brand: 'Visa', last4: '4242', expMonth: '12', expYear: '25' }
      : null
  );

  const [editForm, setEditForm] = useState({
      cardNumber: '',
      expiry: '',
      cvc: ''
  });

  const tiers = [
    {
      name: 'Starter',
      id: 'tier-starter',
      priceMonthly: '$0',
      description: 'Perfect for exploring your first business idea.',
      features: ['15 Business Plans', 'Basic AI Generation', 'Standard Support', 'Export to Text'],
      value: 'starter'
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      priceMonthly: '$29',
      description: 'For serious entrepreneurs ready to launch.',
      features: [
        'Unlimited Business Plans',
        'Advanced AI Model (Gemini Pro)',
        'Financial Forecasting Tools',
        'Priority Support',
        'Export to PDF & Docx',
      ],
      value: 'pro'
    }
  ];

  const planOrder = ['starter', 'pro'];

  const handleAction = async (tier: typeof tiers[0]) => {
      const currentPlanIndex = planOrder.indexOf(user.plan === 'enterprise' ? 'pro' : user.plan);
      const targetPlanIndex = planOrder.indexOf(tier.value);

      if (currentPlanIndex === targetPlanIndex) return;

      if (targetPlanIndex > currentPlanIndex) {
          onSelectPlan(tier.id);
      } else {
          if (window.confirm(`Are you sure you want to downgrade to ${tier.name}? You will lose access to premium features at the end of your billing cycle.`)) {
              setLoadingTier(tier.id);
              try {
                  const updated = await db.auth.updatePlan(user.id, tier.value as any);
                  if (updated) {
                      onPlanUpdate(updated);
                  }
              } catch (e) {
                  console.error(e);
                  alert("Failed to update plan");
              } finally {
                  setLoadingTier(null);
              }
          }
      }
  };

  const handleEditClick = () => {
      setEditForm({
          cardNumber: paymentMethod ? `**** **** **** ${paymentMethod.last4}` : '',
          expiry: paymentMethod ? `${paymentMethod.expMonth}/${paymentMethod.expYear}` : '',
          cvc: '***'
      });
      setIsEditingPayment(true);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSavingPayment(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic extraction of mock data
      const last4 = editForm.cardNumber.replace(/[^0-9]/g, '').slice(-4) || '8888';
      const expiryParts = editForm.expiry.split('/');
      const expMonth = expiryParts[0] || '12';
      const expYear = expiryParts[1] || '28';
      
      setPaymentMethod({
          brand: 'Visa', // We'll just default to Visa for this mock
          last4: last4,
          expMonth: expMonth,
          expYear: expYear
      });
      
      setIsSavingPayment(false);
      setIsEditingPayment(false);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                Billing & Plans
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your subscription and billing details.
            </p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
             {tiers.map((tier) => {
                 const isCurrent = user.plan === tier.value;
                 const isUpgrade = planOrder.indexOf(tier.value) > planOrder.indexOf(user.plan === 'enterprise' ? 'pro' : user.plan);
                 
                 return (
                    <div
                    key={tier.id}
                    className={`flex flex-col justify-between rounded-3xl p-8 ring-1 xl:p-10 ${
                        isCurrent 
                        ? 'bg-slate-50 dark:bg-slate-800 ring-indigo-600 ring-2' 
                        : 'bg-white dark:bg-slate-900 ring-slate-200 dark:ring-slate-700'
                    }`}
                    >
                    <div>
                        <div className="flex items-center justify-between gap-x-4">
                        <h3 className={`text-lg font-semibold leading-8 ${isCurrent ? 'text-indigo-600' : 'text-slate-900 dark:text-white'}`}>
                            {tier.name}
                        </h3>
                        {isCurrent && (
                            <span className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                            Current Plan
                            </span>
                        )}
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
                        onClick={() => handleAction(tier)}
                        disabled={isCurrent || loadingTier === tier.id}
                        className={`mt-8 block w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all ${
                        isCurrent
                            ? 'bg-slate-100 text-slate-400 cursor-default dark:bg-slate-800 dark:text-slate-500'
                            : isUpgrade
                            ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                            : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:bg-slate-800 dark:text-indigo-400 dark:ring-indigo-900'
                        }`}
                    >
                        {loadingTier === tier.id ? 'Processing...' : isCurrent ? 'Active' : isUpgrade ? 'Upgrade' : 'Downgrade'}
                    </button>
                    </div>
                 )
             })}
        </div>
        
        <div className="mt-12 bg-white dark:bg-slate-800 shadow rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                 <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Payment Method</h3>
             </div>
             <div className="p-6">
                {isEditingPayment ? (
                    <form onSubmit={handleSavePayment} className="animate-fade-in max-w-2xl">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="card-number" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Card number</label>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        name="card-number"
                                        id="card-number"
                                        autoComplete="cc-number"
                                        value={editForm.cardNumber}
                                        onChange={(e) => setEditForm({...editForm, cardNumber: e.target.value})}
                                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border pl-10"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="expiration-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Expires (MM/YY)</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="expiration-date"
                                        id="expiration-date"
                                        autoComplete="cc-exp"
                                        value={editForm.expiry}
                                        onChange={(e) => setEditForm({...editForm, expiry: e.target.value})}
                                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="MM/YY"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 dark:text-slate-300">CVC</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="cvc"
                                        id="cvc"
                                        autoComplete="csc"
                                        value={editForm.cvc}
                                        onChange={(e) => setEditForm({...editForm, cvc: e.target.value})}
                                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                        placeholder="***"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="submit"
                                disabled={isSavingPayment}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSavingPayment && (
                                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                )}
                                {isSavingPayment ? 'Saving...' : 'Save Card'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingPayment(false)}
                                className="rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {!paymentMethod ? (
                             <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">No payment method on file.</p>
                                <button 
                                    onClick={handleEditClick} 
                                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    Add Payment Method
                                </button>
                             </div>
                        ) : (
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                         <svg className="h-6 w-6 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                         </svg>
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {paymentMethod.brand} ending in {paymentMethod.last4}
                                         </p>
                                         <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                                         </p>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={handleEditClick} 
                                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                 >
                                     Edit
                                 </button>
                             </div>
                        )}
                    </>
                )}
             </div>
        </div>
    </div>
  );
};
