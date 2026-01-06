
import React from 'react';

interface WelcomeStepProps {
    onNext: () => void;
    userName: string;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, userName }) => {
    const firstName = userName ? userName.split(' ')[0] : 'Founder';

    return (
        <div className="text-center animate-fade-in">
            <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Welcome, <span className="text-indigo-600">{firstName}</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Turn your brilliant idea into a professional business plan. Let's build your future, step by step.
            </p>
            <div className="mt-8">
                <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};
