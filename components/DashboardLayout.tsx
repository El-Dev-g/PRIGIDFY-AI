
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
  currentView: 'planner' | 'history' | 'profile' | 'billing';
  onChangeView: (view: 'planner' | 'history' | 'profile' | 'billing') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
    onLogout, 
    user, 
    onSelectPlan, 
    onPlanUpdate,
    currentView,
    onChangeView
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getTitle = () => {
    switch(currentView) {
        case 'planner': return 'New Business Plan';
        case 'history': return 'History';
        case 'profile': return 'Account Settings';
        case 'billing': return 'Billing & Plans';
        default: return 'Dashboard';
    }
  };

  // Map 'planner' to 'new-plan' for Sidebar compatibility if needed, or update Sidebar
  // Updating Sidebar Props below to match App structure better
  const sidebarView = currentView === 'planner' ? 'new-plan' : currentView;

  const handleSidebarChange = (view: 'new-plan' | 'history' | 'profile' | 'billing') => {
      if (view === 'new-plan') onChangeView('planner');
      else onChangeView(view);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <DashboardSidebar 
        currentView={sidebarView}
        onChangeView={handleSidebarChange}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNavbar 
            title={getTitle()} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onProfileClick={() => onChangeView('profile')}
            user={user}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {currentView === 'planner' && <Planner user={user} />}
            {currentView === 'history' && <HistoryView user={user} />}
            {currentView === 'profile' && <ProfileSettings user={user} onUpdate={onPlanUpdate} />}
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
