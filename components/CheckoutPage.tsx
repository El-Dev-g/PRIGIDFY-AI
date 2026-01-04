
import React, { useState } from 'react';
import type { PlanType } from '../types';

interface CheckoutPageProps {
  planId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ planId, onComplete, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getPlanDetails = (id: string) => {
      if (id.includes('pro')) return { name: 'Pro Plan', price: '$29.00' };
      if (id.includes('enterprise')) return { name: 'Enterprise Plan', price: '$99.00' };
      return { name: 'Unknown Plan', price: '$0.00' };
  };

  const plan = getPlanDetails(planId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
        // Allow spaces during edit but strip them for processing
        const numbers = value.replace(/\D/g, '');
        // Limit to 16 digits
        const truncated = numbers.substring(0, 16);
        // Add space every 4 digits
        formattedValue = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiry') {
        // Strip non-numbers
        const numbers = value.replace(/\D/g, '');
        // Limit to 4 digits (MMYY)
        const truncated = numbers.substring(0, 4);
        
        if (truncated.length >= 2) {
            formattedValue = `${truncated.substring(0, 2)}/${truncated.substring(2)}`;
        } else {
            formattedValue = truncated;
        }
    } else if (name === 'cvc') {
        // Only numbers, max 4 digits
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error for field
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const validateForm = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.name.trim()) {
          newErrors.name = 'Name on card is required';
      }

      const rawCard = formData.cardNumber.replace(/\s/g, '');
      if (rawCard.length !== 16) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (formData.expiry.length !== 5) {
          newErrors.expiry = 'Enter MM/YY';
      } else {
          const [monthStr, yearStr] = formData.expiry.split('/');
          const month = parseInt(monthStr, 10);
          const year = parseInt(yearStr, 10); // 2 digit year
          
          const now = new Date();
          const currentYear = parseInt(now.getFullYear().toString().substring(2));
          const currentMonth = now.getMonth() + 1;

          if (isNaN(month) || month < 1 || month > 12) {
              newErrors.expiry = 'Invalid month';
          } else if (isNaN(year) || year < currentYear || (year === currentYear && month < currentMonth)) {
              newErrors.expiry = 'Card has expired';
          }
      }

      if (formData.cvc.length < 3) {
          newErrors.cvc = 'Enter valid CVC';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsLoading(false);
            onComplete();
        }, 2000);
    }
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

         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name on Card</label>
                <div className="mt-1">
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${
                            errors.name 
                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        placeholder="John Doe" 
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Card Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input 
                        type="text" 
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md p-2 border pr-10 ${
                            errors.cardNumber 
                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500'
                        } sm:text-sm`}
                        placeholder="0000 0000 0000 0000" 
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm2 0v10h16V7H4z" opacity="0.5"/>
                           <path d="M4 11h16v2H4z" />
                        </svg>
                    </div>
                </div>
                {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Expiry</label>
                    <div className="mt-1">
                        <input 
                            type="text" 
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${
                                errors.expiry 
                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                            placeholder="MM/YY" 
                        />
                        {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">CVC</label>
                    <div className="mt-1">
                        <input 
                            type="text" 
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${
                                errors.cvc 
                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                            placeholder="123" 
                        />
                        {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </div>
                    ) : (
                        `Pay ${plan.price}`
                    )}
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
         </form>
      </div>
    </div>
  );
};
