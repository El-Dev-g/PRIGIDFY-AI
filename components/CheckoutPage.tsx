
import React, { useState } from 'react';
import type { PlanType } from '../types';

interface CheckoutPageProps {
  planId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ planId, onComplete, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  const getPlanDetails = (id: string) => {
      // Use env var for plan code, default to a placeholder if not set
      const proPlanCode = process.env.VITE_PAYSTACK_PLAN_PRO || 'PLN_PRO_MONTHLY';

      if (id.includes('pro')) return { name: 'Pro Plan', price: '$29.00', currency: 'USD', amount: 2900, planCode: proPlanCode };
      return { name: 'Unknown Plan', price: '$0.00', currency: 'USD', amount: 0, planCode: '' };
  };

  const plan = getPlanDetails(planId);

  const handlePayment = (provider: 'paystack' | 'flutterwave') => {
    if (!customerEmail || !customerName) {
        alert("Please enter your name and email to proceed.");
        return;
    }

    setIsLoading(true);

    if (provider === 'paystack') {
        // @ts-ignore
        if (typeof window.PaystackPop !== 'undefined') {
            // Use env var for public key
            const paystackKey = process.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; 
            
            // @ts-ignore
            const handler = window.PaystackPop.setup({
                key: paystackKey,
                email: customerEmail,
                amount: plan.amount, // Amount in lowest currency unit (cents).
                currency: plan.currency, 
                // Passing 'plan' is what enables Recurring billing on Paystack.
                // You must create a Plan on Paystack dashboard and use that Code here.
                plan: plan.planCode, 
                ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a unique reference number
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: customerName
                        }
                    ]
                },
                callback: function(response: any) {
                    console.log('Paystack success:', response);
                    // In production, verify the transaction reference on your backend
                    onComplete();
                    setIsLoading(false);
                },
                onClose: function() {
                    // alert('Transaction was not completed, window closed.');
                    setIsLoading(false);
                }
            });
            handler.openIframe();
            return;
        }
    }

    // Simulation of a Gateway Popup (Fallback if script fails or just for Demo)
    setTimeout(() => {
        const isRecurring = provider === 'paystack';
        const msg = isRecurring 
            ? `[Mock Paystack Popup]\n\nProcessing RECURRING subscription for ${plan.name} (${plan.price}/mo)...\n\nPlan Code: ${plan.planCode}\n\nClick OK to simulate Success, Cancel to simulate Failure.`
            : `[Mock Flutterwave Popup]\n\nProcessing payment for ${plan.name}...\n\nClick OK to simulate Success, Cancel to simulate Failure.`;

        const success = window.confirm(msg);
        
        setIsLoading(false);
        
        if (success) {
            onComplete();
        }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
         <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Secure Checkout</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Upgrade to {plan.name}</p>
         </div>

         <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex justify-between items-center border border-indigo-100 dark:border-indigo-800">
            <div>
                <p className="font-semibold text-slate-900 dark:text-white">{plan.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Subscription</p>
            </div>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{plan.price}</p>
         </div>

         <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="mt-1">
                    <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="John Doe" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="mt-1">
                    <input 
                        type="email" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="john@example.com" 
                    />
                </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
                <button
                    onClick={() => handlePayment('paystack')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-md border border-transparent bg-[#0ba4db] py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-[#0a93c4] focus:outline-none focus:ring-2 focus:ring-[#0ba4db] focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <>
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 4v10h16V8H4z" /></svg>
                         Subscribe with Paystack
                        </>
                    )}
                </button>
                
                <button
                    onClick={() => handlePayment('flutterwave')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-md border border-[#FB9129] bg-[#FB9129]/10 py-3 px-4 text-sm font-bold text-[#FB9129] hover:bg-[#FB9129]/20 focus:outline-none focus:ring-2 focus:ring-[#FB9129] focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                    Pay with Flutterwave
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full flex justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                    Cancel
                </button>
            </div>
            
            <p className="text-xs text-center text-slate-400 mt-4">
                Payments are secured by industry standard encryption. We do not store your card details.
            </p>
         </div>
      </div>
    </div>
  );
};