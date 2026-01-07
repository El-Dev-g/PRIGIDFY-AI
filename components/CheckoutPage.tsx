
import React, { useState, useEffect } from 'react';
import type { PlanType } from '../types';

interface CheckoutPageProps {
  planId: string;
  onComplete: (details?: { name: string; email: string; payment?: any }) => void;
  onCancel: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ planId, onComplete, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Debugging environment variables
  useEffect(() => {
    console.log("Paystack Config Check:", {
        hasKey: !!process.env.PAYSTACK_PUBLIC_KEY,
        planCode: process.env.PAYSTACK_PLAN_PRO || 'Not Set'
    });
  }, []);

  const getPlanDetails = (id: string) => {
      // Use non-prefixed env var as requested
      const envPlanCode = process.env.PAYSTACK_PLAN_PRO;
      
      // Clean the plan code (remove quotes, whitespace) if it exists
      let cleanPlanCode = envPlanCode ? envPlanCode.replace(/['"]/g, '').trim() : '';

      if (id.includes('pro')) {
          return { 
              name: 'Pro Plan', 
              price: 'GHS 450.00', 
              currency: 'GHS', 
              amount: 450, 
              planCode: cleanPlanCode 
          };
      }
      // Fallback for enterprise or unknown
      return { 
          name: 'Enterprise Plan', 
          price: 'GHS 1,500.00', 
          currency: 'GHS', 
          amount: 1500, 
          planCode: '' 
      };
  };

  const plan = getPlanDetails(planId);

  const handlePayment = (provider: 'paystack' | 'flutterwave') => {
    setError(null);
    if (!customerEmail || !customerName) {
        setError("Please enter your name and email to proceed.");
        return;
    }

    setIsLoading(true);

    if (provider === 'paystack') {
        const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
        
        if (!publicKey) {
            setError("Configuration Error: Paystack Public Key (PAYSTACK_PUBLIC_KEY) is missing.");
            setIsLoading(false);
            return;
        }

        // @ts-ignore
        if (!window.PaystackPop) {
            setError("Paystack library not loaded. Please refresh the page.");
            setIsLoading(false);
            return;
        }

        // Construct Paystack Options
        const paystackConfig: any = {
            key: publicKey,
            email: customerEmail,
            currency: 'GHS',
            ref: '' + Math.floor((Math.random() * 1000000000) + 1),
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
                console.log("Payment complete", response);
                // Success! Proceed to signup/upgrade with payment record
                onComplete({ 
                    name: customerName, 
                    email: customerEmail,
                    payment: {
                        reference: response.reference,
                        status: response.status || 'success',
                        amount: plan.amount,
                        currency: 'GHS',
                        planId: planId
                    }
                });
            },
            onClose: function() {
                setIsLoading(false);
            }
        };

        // DYNAMIC PRICING LOGIC:
        // If a plan code is configured, pass it to Paystack and OMIT the amount.
        // This forces Paystack to charge the amount currently set in the Dashboard for that Plan Code.
        if (plan.planCode) {
            paystackConfig.plan = plan.planCode;
        } else {
            // Fallback: Use the static amount defined in code if no plan code is found.
            paystackConfig.amount = plan.amount * 100; // Amount in pesewas
        }

        // @ts-ignore
        const handler = window.PaystackPop.setup(paystackConfig);
        handler.openIframe();
        return;
    }

    // Fallback/Mock for Flutterwave or Demo
    setTimeout(() => {
        const msg = `[Mock Flutterwave Popup]\n\nProcessing payment for ${plan.name}...\n\nClick OK to simulate Success, Cancel to simulate Failure.`;
        const success = window.confirm(msg);
        
        setIsLoading(false);
        
        if (success) {
            onComplete({ 
                name: customerName, 
                email: customerEmail,
                payment: {
                    reference: 'mock-' + Date.now(),
                    status: 'success',
                    amount: plan.amount,
                    currency: 'GHS',
                    planId: planId
                }
            });
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

         {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
            </div>
         )}

         <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="mt-1">
                    <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        disabled={isLoading}
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:opacity-50"
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
                        disabled={isLoading}
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:opacity-50"
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
