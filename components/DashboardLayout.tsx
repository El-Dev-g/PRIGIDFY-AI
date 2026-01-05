
import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { Planner } from './Planner';
import { HistoryView } from './HistoryView';
import { ProfileSettings } from './ProfileSettings';
import { BillingPage } from './BillingPage';
import type { UserProfile } from '../types';

interface DashboardLayoutProps {
  onLogout: () => void;
  user: UserProfile;
  onSelectPlan: (planId: string) => void;
  onPlanUpdate: (user: UserProfile) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, user, onSelectPlan, onPlanUpdate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'new-plan' | 'history' | 'profile' | 'billing'>('new-plan');

  const getTitle = () => {
    switch(currentView) {
        case 'new-plan': return 'New Business Plan';
        case 'history': return 'History';
        case 'profile': return 'Account Settings';
        case 'billing': return 'Billing & Plans';
        default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <DashboardSidebar 
        currentView={currentView}
        onChangeView={setCurrentView}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar 
            title={getTitle()} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onProfileClick={() => setCurrentView('profile')}
            user={user}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {currentView === 'new-plan' && <Planner user={user} />}
            {currentView === 'history' && <HistoryView user={user} />}
            {currentView === 'profile' && <ProfileSettings user={user} />}
            {currentView === 'billing' && (
                <BillingPage 
                    user={user} 
                    onSelectPlan={onSelectPlan} 
                    onPlanUpdate={onPlanUpdate}
                />
            )}
        </main>
      </div>
    </div>
  );
};
