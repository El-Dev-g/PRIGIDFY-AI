
import React from 'react';
import type { UserProfile } from '../types';

interface ApiDocsPageProps {
    user?: UserProfile | null;
}

export const ApiDocsPage: React.FC<ApiDocsPageProps> = ({ user }) => {
  const isEnterprise = user && user.plan === 'enterprise';

  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32 animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">API Documentation</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Integrate JHAIDIFY AI's generation engine directly into your own applications. Available for Enterprise customers.
          </p>
        </div>
        
        {!isEnterprise ? (
            <div className="mt-16 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12">
                <div className="mx-auto h-16 w-16 text-slate-400 mb-4">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Access Required</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                    The API documentation is locked. Please upgrade to the Enterprise plan to view endpoints, authentication methods, and integration guides.
                </p>
                <div className="mt-6">
                    <button disabled className="inline-flex items-center justify-center rounded-md border border-transparent bg-slate-300 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm cursor-not-allowed">
                        Upgrade to Enterprise
                    </button>
                    <p className="mt-2 text-xs text-slate-500">Contact sales for enterprise pricing.</p>
                </div>
            </div>
        ) : (
            <div className="mt-16">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Generate Plan Endpoint</h3>
                <div className="bg-slate-800 rounded-xl p-6 overflow-hidden shadow-xl">
                    <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
{`POST https://api.jhaidify.ai/v1/generate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "businessName": "MyStartup",
  "industry": "SaaS",
  "description": "An AI platform for...",
  "targetAudience": "Small businesses...",
  "style": "Professional"
}`}
                    </pre>
                </div>
                
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Authentication</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        All API requests must be authenticated using a Bearer token in the header. You can manage your API keys in the Enterprise dashboard.
                    </p>
                </div>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Rate Limits</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Standard limits are 100 requests per minute. Contact sales for higher limits.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
