
import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileSettingsProps {
    user: UserProfile;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setIsLoading(false);
      return;
    }

    if (!currentPassword) {
       setMessage({ type: 'error', text: 'Please enter your current password.' });
       setIsLoading(false);
       return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Account Settings
          </h2>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
        {/* Profile Info */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Profile Information</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your account details.</p>
             </div>
             {user.plan !== 'enterprise' && (
                 <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition">
                     Upgrade Plan
                 </button>
             )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                 <div className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 p-2 text-slate-500 dark:text-slate-400 sm:text-sm">
                    {user.name}
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Plan</label>
                 <div className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 p-2 text-slate-500 dark:text-slate-400 sm:text-sm capitalize">
                    {user.plan}
                 </div>
              </div>
          </div>
          
          <div className="mt-6">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
             <div className="mt-1">
                 <input 
                    type="email" 
                    disabled 
                    value={user.email} 
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-not-allowed p-2 border"
                 />
                 <p className="mt-2 text-xs text-slate-500">Contact support to change your email address.</p>
             </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Change Password</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your password to keep your account secure.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}
            
            <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                <div className="mt-1">
                    <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                    <div className="mt-1">
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                    <div className="mt-1">
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? 'Updating...' : 'Update Password'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
