
import React, { useState, useEffect, useRef } from 'react';
import { StepWrapper } from './StepWrapper';

interface InputStepProps {
  name: string;
  title: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder: string;
  tips?: string[];
  example?: string;
  enableSuggestions?: boolean;
  onGetSuggestions?: (keyword: string) => Promise<string[]>;
}

// Helper to safely parse JSON or return null
const safeParse = (str: string) => {
    try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === 'object') return parsed;
    } catch(e) {}
    return null;
};

// Collapsible Card Component
const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden mb-4">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{title}</span>
                <svg className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

export const InputStep: React.FC<InputStepProps> = ({ 
  name,
  title, 
  description, 
  value, 
  onChange, 
  placeholder,
  tips,
  example,
  enableSuggestions = false,
  onGetSuggestions
}) => {
  const [showTips, setShowTips] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const debouncedSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize structured state based on raw string value (if JSON)
  const [structuredData, setStructuredData] = useState<Record<string, any>>(() => safeParse(value) || {});

  // Update structured data and propagate to parent as JSON string
  const handleStructuredChange = (key: string, val: any) => {
      const newState = { ...structuredData, [key]: val };
      setStructuredData(newState);
      
      // Create synthetic event
      const event = {
          target: {
              name: name,
              value: JSON.stringify(newState)
          }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(event);
  };

  useEffect(() => {
    if (!enableSuggestions || !onGetSuggestions) return;
    if (name !== 'businessName') return; // Only suggest for names for now

    if (value.length > 2 && !value.startsWith('{')) { // Don't suggest if it looks like JSON
      if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);

      debouncedSearchRef.current = setTimeout(async () => {
        setIsSuggesting(true);
        try {
          const results = await onGetSuggestions(value);
          setSuggestions(results);
        } catch (e) {
          console.error("Error fetching suggestions", e);
        } finally {
          setIsSuggesting(false);
        }
      }, 1000);
    } else {
        setSuggestions([]);
    }

    return () => {
        if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
    }
  }, [value, enableSuggestions, onGetSuggestions, name]);

  const handleSuggestionClick = (suggestion: string) => {
    const event = {
      target: { value: suggestion, name: '' }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    setSuggestions([]);
  };

  // Render Logic based on Field Name
  const isStructuredField = ['targetAudience', 'marketingSales', 'operations', 'financials'].includes(name);

  const renderStructuredInputs = () => {
      if (name === 'targetAudience') {
          return (
              <div className="space-y-2">
                 <CollapsibleCard title="Primary Audience" defaultOpen={true}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Who are your ideal customers?</label>
                    <textarea
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        rows={4}
                        placeholder="e.g., Busy urban professionals..."
                        value={structuredData.description || ''}
                        onChange={(e) => handleStructuredChange('description', e.target.value)}
                    />
                 </CollapsibleCard>

                 <CollapsibleCard title="Demographics">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select all that apply</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Boomers (57+)', 'Male', 'Female', 'Urban', 'Suburban', 'High Income', 'Budget Conscious'].map(opt => (
                            <label key={opt} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={(structuredData.demographics || []).includes(opt)}
                                    onChange={(e) => {
                                        const current = structuredData.demographics || [];
                                        const updated = e.target.checked ? [...current, opt] : current.filter((x: string) => x !== opt);
                                        handleStructuredChange('demographics', updated);
                                    }}
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
                            </label>
                        ))}
                    </div>
                 </CollapsibleCard>

                 <CollapsibleCard title="Pain Points">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What problems do they face?</label>
                    <textarea
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        rows={3}
                        placeholder="e.g., Lack of time, expensive alternatives..."
                        value={structuredData.painPoints || ''}
                        onChange={(e) => handleStructuredChange('painPoints', e.target.value)}
                    />
                 </CollapsibleCard>
              </div>
          );
      }

      if (name === 'marketingSales') {
          return (
              <div className="space-y-2">
                 <CollapsibleCard title="Marketing Channels" defaultOpen={true}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">How will you reach customers?</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Social Media', 'SEO / Content', 'Paid Ads', 'Email Marketing', 'Influencers', 'Events', 'Cold Outreach', 'Referrals'].map(opt => (
                            <label key={opt} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={(structuredData.channels || []).includes(opt)}
                                    onChange={(e) => {
                                        const current = structuredData.channels || [];
                                        const updated = e.target.checked ? [...current, opt] : current.filter((x: string) => x !== opt);
                                        handleStructuredChange('channels', updated);
                                    }}
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
                            </label>
                        ))}
                    </div>
                 </CollapsibleCard>

                 <CollapsibleCard title="Sales Strategy">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How will you convert leads?</label>
                    <textarea
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        rows={3}
                        placeholder="e.g., Free trial, Direct sales team, Online checkout..."
                        value={structuredData.salesStrategy || ''}
                        onChange={(e) => handleStructuredChange('salesStrategy', e.target.value)}
                    />
                 </CollapsibleCard>

                 <CollapsibleCard title="Pricing Model">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What is your pricing structure?</label>
                    <input
                        type="text"
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        placeholder="e.g., $29/month subscription"
                        value={structuredData.pricing || ''}
                        onChange={(e) => handleStructuredChange('pricing', e.target.value)}
                    />
                 </CollapsibleCard>
              </div>
          );
      }

      if (name === 'operations') {
          return (
              <div className="space-y-2">
                 <CollapsibleCard title="Key Activities" defaultOpen={true}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What are your day-to-day processes?</label>
                    <textarea
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        rows={4}
                        placeholder="e.g., Product development, customer support..."
                        value={structuredData.activities || ''}
                        onChange={(e) => handleStructuredChange('activities', e.target.value)}
                    />
                 </CollapsibleCard>
                 
                 <CollapsibleCard title="Suppliers & Tools">
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key partners or software?</label>
                     <input
                        type="text"
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        placeholder="e.g., AWS, Stripe, Local Wholesaler"
                        value={structuredData.suppliers || ''}
                        onChange={(e) => handleStructuredChange('suppliers', e.target.value)}
                    />
                 </CollapsibleCard>

                 <CollapsibleCard title="Team & Staffing">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Who is running the business?</label>
                    <textarea
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        rows={2}
                        placeholder="e.g., 2 Co-founders, 1 Developer..."
                        value={structuredData.team || ''}
                        onChange={(e) => handleStructuredChange('team', e.target.value)}
                    />
                 </CollapsibleCard>
              </div>
          );
      }

      if (name === 'financials') {
          return (
              <div className="space-y-2">
                 <CollapsibleCard title="Revenue Model" defaultOpen={true}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How do you make money?</label>
                    <select
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        value={structuredData.revenueModel || ''}
                        onChange={(e) => handleStructuredChange('revenueModel', e.target.value)}
                    >
                        <option value="">Select a model...</option>
                        <option value="One-time Purchase">One-time Purchase</option>
                        <option value="Subscription / SaaS">Subscription / SaaS</option>
                        <option value="Freemium">Freemium</option>
                        <option value="Advertising">Advertising</option>
                        <option value="Commission">Commission / Marketplace</option>
                        <option value="Service Fee">Service Fee</option>
                    </select>
                 </CollapsibleCard>

                 <CollapsibleCard title="Costs & Expenses">
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Major cost drivers?</label>
                     <textarea
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        rows={3}
                        placeholder="e.g., Server costs, office rent, salaries..."
                        value={structuredData.expenses || ''}
                        onChange={(e) => handleStructuredChange('expenses', e.target.value)}
                    />
                 </CollapsibleCard>

                 <CollapsibleCard title="Funding">
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Capital requirements?</label>
                     <input
                        type="text"
                        className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 shadow-sm focus:ring-indigo-500"
                        placeholder="e.g., Bootstrapped, Seeking $500k Seed"
                        value={structuredData.funding || ''}
                        onChange={(e) => handleStructuredChange('funding', e.target.value)}
                    />
                 </CollapsibleCard>
              </div>
          );
      }
      return null;
  };

  const isShortInput = name === 'businessName'; 

  return (
    <StepWrapper>
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 min-h-[500px]">
        {/* Left Column: Input */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
          </div>
          
          <div className="relative flex-grow flex flex-col group">
            {/* Background Glow for Text Areas */}
            {!isStructuredField && (
                 <div className={`
                    absolute inset-0 rounded-2xl transition duration-300 pointer-events-none
                    ${isShortInput ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10' : 'bg-transparent'}
                `}></div>
            )}

            {isStructuredField ? (
                // Structured Form Rendering
                <div className="relative z-10">
                    {renderStructuredInputs()}
                </div>
            ) : isShortInput ? (
                // Simple Short Input (Name)
                <div className="relative">
                     <input
                        type="text"
                        className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-xl p-6 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoFocus
                    />
                    {isSuggesting && (
                         <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                         </div>
                    )}
                </div>
            ) : (
                // Standard Text Area Fallback (Business Idea, etc.)
                <textarea
                  rows={14}
                  className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-lg leading-relaxed p-6 resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                ></textarea>
            )}
            
            {/* Character Count (Only for simple text) */}
            {!isStructuredField && (
                <div className="mt-2 flex justify-end">
                     <span className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${value.length > 0 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400'}`}>
                        {value.length} characters
                     </span>
                </div>
            )}

            {/* Suggestions Area */}
            {enableSuggestions && suggestions.length > 0 && (
               <div className="mt-4 animate-fade-in p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 bg-indigo-100 dark:bg-indigo-800 rounded">
                         <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold uppercase text-indigo-900 dark:text-indigo-300 tracking-wider">
                        AI Suggestions
                      </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, idx) => (
                          <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="group relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                          >
                              {suggestion}
                          </button>
                      ))}
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Guidance */}
        <div className="hidden lg:block lg:col-span-4 mt-8 lg:mt-0">
          <div className="sticky top-6">
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  AI Tips
                </h3>
                
                {tips && tips.length > 0 && (
                  <ul className="space-y-4 mb-8">
                    {tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                         <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {example && (
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">Example Answer</h4>
                    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed border border-slate-100 dark:border-slate-800 shadow-sm">
                      "{example}"
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>

        {/* Mobile Toggle for Tips */}
        <div className="lg:hidden mt-8">
           <button 
             onClick={() => setShowTips(!showTips)}
             className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
           >
             <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Tips & Examples
             </span>
             <svg className={`w-5 h-5 text-slate-500 transition-transform ${showTips ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
             </svg>
           </button>
           
           {showTips && (
             <div className="mt-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
                <ul className="space-y-3 mb-4">
                  {tips?.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-500">•</span> {tip}
                    </li>
                  ))}
                </ul>
                {example && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 mb-1">EXAMPLE</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        "{example}"
                    </p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </StepWrapper>
  );
};
