
import React from 'react';

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  isLoading?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentStep, totalSteps, onBack, onNext, isNextDisabled, isLoading = false }) => {
  return (
    <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700">
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 0 || isLoading}
          className="rounded-md bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Generating...' : currentStep === totalSteps - 2 ? 'Generate Plan' : 'Next'}
        </button>
      </div>
    </div>
  );
};
