
import React, { useState, useEffect, useRef } from 'react';
import { StepWrapper } from './StepWrapper';

interface InputStepProps {
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

export const InputStep: React.FC<InputStepProps> = ({ 
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

  useEffect(() => {
    // Logic for autosuggest
    if (!enableSuggestions || !onGetSuggestions) return;

    if (value.length > 2) {
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current);
      }

      debouncedSearchRef.current = setTimeout(async () => {
        setIsSuggesting(true);
        try {
          // We only fetch if it doesn't look like they are done typing a sentence
          // A simple heuristic for names/keywords
          const results = await onGetSuggestions(value);
          setSuggestions(results);
        } catch (e) {
          console.error("Error fetching suggestions", e);
        } finally {
          setIsSuggesting(false);
        }
      }, 1000); // Wait 1s after typing stops
    } else {
        setSuggestions([]);
    }

    return () => {
        if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
    }
  }, [value, enableSuggestions, onGetSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    // Create a synthetic event to pass to parent onChange
    const event = {
      target: {
        value: suggestion,
        name: '' // The parent component assigns the correct name in onChange wrapper
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    setSuggestions([]); // Clear suggestions after selection
  };

  const isShortInput = enableSuggestions; // Assuming name input is short

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
            <div className={`
                absolute inset-0 rounded-2xl transition duration-300 pointer-events-none
                ${isShortInput ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10' : 'bg-transparent'}
            `}></div>

            {isShortInput ? (
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
                <textarea
                  rows={14}
                  className="block w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-lg leading-relaxed p-6 resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                ></textarea>
            )}
            
            <div className="mt-2 flex justify-end">
                 <span className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${value.length > 0 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {value.length} characters
                 </span>
            </div>

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
