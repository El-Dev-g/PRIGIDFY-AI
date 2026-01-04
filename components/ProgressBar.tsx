
import React from 'react';
import { STEPS } from '../types';

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {STEPS.slice(1, -1).map((step, index) => {
          const stepIndex = index + 1;
          const isCompleted = currentStep > stepIndex;
          const isActive = currentStep === stepIndex;

          return (
            <li key={step.name} className="md:flex-1">
              {isCompleted ? (
                <div className="group flex w-full flex-col border-l-4 border-indigo-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-indigo-600 transition-colors">{step.id}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{step.name}</span>
                </div>
              ) : isActive ? (
                <div className="flex w-full flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                  <span className="text-sm font-medium text-indigo-600">{step.id}</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 dark:border-gray-700 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">{step.id}</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{step.name}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
