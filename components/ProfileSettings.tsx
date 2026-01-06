
import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { db } from '../services/db';

interface ProfileSettingsProps {
    user: UserProfile;
    onUpdate: (user: UserProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile State
  const [name, setName] = useState(user.name);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
      setName(user.name);
  }, [user.name]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileMessage(null);
      setIsProfileLoading(true);
      
      try {
          const updatedUser = await db.auth.updateProfile(user.id, { name });
          if (updatedUser) {
              onUpdate(updatedUser);
              setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
          }
      } catch (err: any) {
          console.error(err);
          setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
      } finally {
          setIsProfileLoading(false);
      }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setIsPasswordLoading(true);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      setIsPasswordLoading(false);
      return;
    }

    if (!currentPassword) {
       setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
       setIsPasswordLoading(false);
       return;
    }

    try {
        await db.auth.updatePassword(user.email, currentPassword, newPassword);
        setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (err: any) {
        setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
        setIsPasswordLoading(false);
    }
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
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Profile Information</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your account details.</p>
             </div>
             {user.plan !== 'enterprise' && (
                 <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-md uppercase">
                     {user.plan} Plan
                 </span>
             )}
          </div>
          
          <form onSubmit={handleProfileUpdate}>
             {profileMessage && (
                <div className={`p-3 rounded-md mb-4 text-sm font-medium ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {profileMessage.text}
                </div>
             )}
             
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="fullName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                        />
                    </div>
                </div>
                
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="mt-1">
                        <input 
                            type="email" 
                            disabled 
                            value={user.email} 
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-not-allowed p-2.5 border"
                        />
                        <p className="mt-1.5 text-xs text-slate-500">Email cannot be changed directly for security reasons.</p>
                    </div>
                </div>
             </div>

             <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isProfileLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isProfileLoading ? 'Saving...' : 'Save Profile'}
                </button>
             </div>
          </form>
        </div>

        {/* Password Change */}
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Change Password</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your password to keep your account secure.</p>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
            {passwordMessage && (
                <div className={`p-3 rounded-md text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {passwordMessage.text}
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
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
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
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
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
                            className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isPasswordLoading ? 'Updating...' : 'Update Password'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
