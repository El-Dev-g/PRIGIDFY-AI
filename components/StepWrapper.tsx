
import React from 'react';

interface StepWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const StepWrapper: React.FC<StepWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="animate-fade-in w-full">
      {title && (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            {description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
