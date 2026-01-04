
import React from 'react';
import type { FormData } from '../types';
import { StepWrapper } from './StepWrapper';
import { STEPS } from '../types';

interface ReviewStepProps {
  formData: FormData;
}

const ReviewItem: React.FC<{ label: string; value: string; stepId: number }> = ({ label, value, stepId }) => (
  <div className="relative pl-8 pb-8 border-l-2 border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
    <div className="absolute -left-[9px] top-0 bg-white dark:bg-slate-800 p-1">
      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
    </div>
    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-5 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Part {stepId - 1}: {label}
        </h3>
      </div>
      <p className="text-base text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
        {value || <span className="text-slate-400 italic">Not provided</span>}
      </p>
    </div>
  </div>
);

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  return (
    <StepWrapper>
      <div className="max-w-3xl mx-auto">
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
           {STEPS.slice(1, 6).map((step, index) => {
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
