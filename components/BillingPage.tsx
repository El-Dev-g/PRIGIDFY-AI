
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
  const [error, setError] = useState<string | null>(null);

  // Mock Payment State - In a real app, this would come from the user's profile/subscription data
  const [paymentMethod, setPaymentMethod] = useState<{brand: string, last4: string, expMonth: string, expYear: string} | null>(
      user.plan !== 'starter' 
      ? { brand: 'Visa', last4: '4242', expMonth: '12', expYear: '25' }
      : null
  );

  const tiers = [
    {
      name: 'Starter',
      id: 'tier-starter',
      priceMonthly: 'GHS 0',
      description: 'Perfect for exploring your first business idea.',
      features: ['15 Business Plans', 'Basic AI Generation', 'Standard Support', 'Export to Text'],
      value: 'starter'
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      priceMonthly: 'GHS 450',
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

  const handlePaystackUpdate = () => {
      setError(null);
      const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
      
      if (!publicKey) {
          setError("Configuration Error: Paystack Public Key is missing.");
          return;
      }

      // @ts-ignore
      if (!window.PaystackPop) {
          setError("Paystack library not loaded. Please refresh the page.");
          return;
      }

      setIsSavingPayment(true);

      // @ts-ignore
      const handler = window.PaystackPop.setup({
          key: publicKey,
          email: user.email,
          amount: 100, // GHS 1.00 (100 pesewas) nominal charge for authorization
          currency: 'GHS',
          ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          metadata: {
              custom_fields: [
                  {
                      display_name: "Action",
                      variable_name: "action",
                      value: "update_payment_method"
                  }
              ]
          },
          callback: function(response: any) {
              console.log("Paystack authorization success:", response);
              
              // In a real app, you would send 'response.reference' to your backend.
              // The backend would verify the transaction using the Secret Key,
              // then fetch the authorization code and save it to the customer profile.
              // For this frontend-only demo, we'll simulate a successful update.
              
              setPaymentMethod({
                  brand: 'Paystack Card',
                  last4: 'Active',
                  expMonth: '--', 
                  expYear: '--'
              });
              
              setIsSavingPayment(false);
              setIsEditingPayment(false);
          },
          onClose: function() {
              setIsSavingPayment(false);
          }
      });

      handler.openIframe();
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
                    <div className="animate-fade-in max-w-xl">
                        <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">Secure Authorization</h4>
                            <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                To update your card, we will process a nominal charge of <strong>GHS 1.00</strong> to authorize your payment method via Paystack. This is standard industry practice.
                            </p>
                        </div>
                        
                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handlePaystackUpdate}
                                disabled={isSavingPayment}
                                className="rounded-md bg-[#0ba4db] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0a93c4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ba4db] disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSavingPayment ? (
                                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 4v10h16V8H4z" /></svg>
                                )}
                                {isSavingPayment ? 'Processing...' : 'Authorize with Paystack'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingPayment(false)}
                                disabled={isSavingPayment}
                                className="rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {!paymentMethod ? (
                             <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">No payment method on file.</p>
                                <button 
                                    onClick={() => setIsEditingPayment(true)} 
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
                                            {paymentMethod.brand} {paymentMethod.last4 !== 'Active' ? `ending in ${paymentMethod.last4}` : '(Active)'}
                                         </p>
                                         <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {paymentMethod.expMonth !== '--' ? `Expires ${paymentMethod.expMonth}/${paymentMethod.expYear}` : 'Securely connected via Paystack'}
                                         </p>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => setIsEditingPayment(true)} 
                                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                 >
                                     Update
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
