
import React from 'react';
import { View } from '../App';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
             <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">JHAIDIFY AI</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <button
              onClick={() => onNavigate('landing')}
              className={`${currentView === 'landing' ? 'border-indigo-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`${currentView === 'pricing' ? 'border-indigo-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full`}
            >
              Pricing
            </button>
          </div>
          <div className="flex items-center space-x-4">
             <button
              onClick={() => onNavigate('login')}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium"
            >
              Log in
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
