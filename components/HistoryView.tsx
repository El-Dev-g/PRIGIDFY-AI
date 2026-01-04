
import React, { useState, useEffect } from 'react';
import type { SavedPlan, UserProfile } from '../types';
import { ResultStep } from './ResultStep';
import { db } from '../services/db';

interface HistoryViewProps {
  user: UserProfile;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ user }) => {
  const [history, setHistory] = useState<SavedPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
        try {
            const plans = await db.plans.list(user.id);
            setHistory(plans);
        } catch (e) {
            console.error('Failed to load history', e);
        } finally {
            setLoading(false);
        }
    };
    loadPlans();
  }, [user.id]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
        try {
            await db.plans.delete(id);
            const updated = history.filter(p => p.id !== id);
            setHistory(updated);
            
            if (selectedPlan?.id === id) {
                setSelectedPlan(null);
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }
  };

  if (selectedPlan) {
    return (
      <div className="animate-fade-in max-w-7xl mx-auto">
        <div className="mb-6 flex items-center">
            <button 
                onClick={() => setSelectedPlan(null)}
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            >
                <svg className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to History
            </button>
        </div>
        <ResultStep 
            businessPlan={selectedPlan.content} 
            onRestart={() => setSelectedPlan(null)} 
            isReadOnly={true}
            userPlan={user.plan}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Plans</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Manage and revisit your generated business strategies.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
           <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-20 text-center">
            <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 p-6 mb-4">
                 <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No plans generated yet</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm">
                Start a new session to create your first professional business plan with AI assistance.
            </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {history.map((plan) => (
            <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:-translate-y-1"
            >
                {/* Decorative top bar */}
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75"></div>
                
                <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${
                            plan.style === 'Lean Startup' ? 'bg-emerald-100 text-emerald-600' :
                            plan.style === 'Creative Storyteller' ? 'bg-purple-100 text-purple-600' :
                            'bg-indigo-100 text-indigo-600'
                        }`}>
                             {plan.style === 'Lean Startup' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                             ) : plan.style === 'Creative Storyteller' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                             ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             )}
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {plan.title || "Untitled Plan"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {plan.formData?.businessIdea || "No description provided."}
                    </p>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                        {new Date(plan.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                         <button 
                            onClick={(e) => handleDelete(plan.id, e)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Delete Plan"
                        >
                             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
