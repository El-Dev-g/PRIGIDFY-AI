
import React from 'react';
import type { FormData } from '../types';
import { StepWrapper } from './StepWrapper';
import { STEPS } from '../types';

interface ReviewStepProps {
  formData: FormData;
}

const renderStructuredValue = (val: string) => {
    try {
        const parsed = JSON.parse(val);
        if (typeof parsed === 'object' && parsed !== null) {
             return (
                 <div className="space-y-4">
                     {Object.entries(parsed).map(([k, v]) => {
                         if (!v || (Array.isArray(v) && v.length === 0)) return null;
                         return (
                            <div key={k}>
                                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                    {k.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <div className="text-slate-700 dark:text-slate-200">
                                    {Array.isArray(v) ? (
                                        <div className="flex flex-wrap gap-2">
                                            {v.map((item: string, idx: number) => (
                                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{v as string}</p>
                                    )}
                                </div>
                            </div>
                         );
                     })}
                 </div>
             )
        }
    } catch(e) {}
    // Fallback for simple strings or invalid JSON
    return <p className="text-base text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{val || <span className="text-slate-400 italic">Not provided</span>}</p>;
}

const ReviewItem: React.FC<{ label: string; value: string; stepId: number }> = ({ label, value, stepId }) => (
  <div className="relative pl-8 pb-8 border-l-2 border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
    <div className="absolute -left-[9px] top-0 bg-white dark:bg-slate-800 p-1">
      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
    </div>
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Part {stepId - 1}: {label}
        </h3>
      </div>
      {renderStructuredValue(value)}
    </div>
  </div>
);

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  return (
    <StepWrapper>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Review Your Plan</h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            You've built the foundation. Check your details before we let the AI work its magic.
          </p>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-10 text-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Selected Style</span>
            <div className="mt-1 text-xl font-bold text-indigo-700 dark:text-indigo-400">{formData.templateStyle}</div>
        </div>

        <div className="mt-8">
           {/* Map through STEPS to ensure order, we only want the text inputs which are indices 1-5 (Steps 2-6) */}
           {STEPS.slice(1, 7).map((step, index) => {
              const fieldName = step.fields[0] as keyof FormData;
              return (
                 <ReviewItem 
                    key={step.id} 
                    label={step.name} 
                    value={formData[fieldName]} 
                    stepId={index + 2} // offset for Welcome step
                 />
              )
           })}
        </div>
      </div>
    </StepWrapper>
  );
};
