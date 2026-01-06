
import React from 'react';
import type { UserProfile } from '../types';

interface DashboardNavbarProps {
  onToggleSidebar: () => void;
  title: string;
  onProfileClick: () => void;
  user: UserProfile;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ onToggleSidebar, title, onProfileClick, user }) => {
  const isOfflineUser = user.id.startsWith('offline-');

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {isOfflineUser && (
           <span className="hidden sm:inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 border border-yellow-200">
              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Demo Mode (Not Syncing)
           </span>
        )}
        
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            user.plan === 'enterprise' 
            ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
            : user.plan === 'pro'
            ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
            : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        }`}>
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
        </span>
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Account Settings"
        >
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-medium text-indigo-700 dark:text-indigo-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {user.name}
            </span>
        </button>
      </div>
    </header>
  );
};
