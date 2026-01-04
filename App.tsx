
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { DashboardLayout } from './components/DashboardLayout';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { CareersPage } from './components/CareersPage';
import { HelpCenterPage } from './components/HelpCenterPage';
import { ApiDocsPage } from './components/ApiDocsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { ResultStep } from './components/ResultStep';
import { CheckoutPage } from './components/CheckoutPage';
import type { UserProfile, PlanType } from './types';

export type View = 
  | 'landing' 
  | 'pricing' 
  | 'login' 
  | 'signup' 
  | 'planner'
  | 'about'
  | 'blog'
  | 'blog-post'
  | 'careers'
  | 'help'
  | 'api'
  | 'privacy'
  | 'terms'
  | 'shared-plan'
  | 'checkout';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('user_profile');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [currentView, setCurrentView] = useState<View>(() => {
     if (localStorage.getItem('user_profile')) {
         return 'planner';
     }
     return 'landing';
  });
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number | null>(null);
  const [sharedPlanContent, setSharedPlanContent] = useState<string>('');
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
        localStorage.setItem('user_profile', JSON.stringify(user));
    } else {
        localStorage.removeItem('user_profile');
    }
  }, [user]);

  useEffect(() => {
    // Check for shared plan in URL
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    if (shareId) {
        const content = localStorage.getItem(`share_${shareId}`);
        if (content) {
            setSharedPlanContent(content);
            setCurrentShareId(shareId);
            setCurrentView('shared-plan');
        } else {
            // Invalid or expired share link, remove it from URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }
  }, []);

  const handleLogin = () => {
    // Mock user data
    const mockUser: UserProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        plan: 'starter'
    };
    setUser(mockUser);
    
    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        setCurrentView('checkout');
    } else {
        setCurrentView('planner');
    }
  };
  
  const handleSignup = () => {
      // Mock signup
      const mockUser: UserProfile = {
        name: 'New User',
        email: 'user@example.com',
        plan: 'starter'
    };
    setUser(mockUser);

    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        setCurrentView('checkout');
    } else {
        setCurrentView('planner');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setSelectedPlanId(null);
  };

  const handleNavigateToPost = (id: number) => {
    setSelectedBlogPostId(id);
    setCurrentView('blog-post');
  };

  const handleSelectPlan = (planId: string) => {
      setSelectedPlanId(planId);
      
      if (!user) {
          setCurrentView('signup');
          return;
      }
      
      if (planId === 'tier-starter') {
           // Downgrade or stay on free
           const updatedUser = { ...user, plan: 'starter' as PlanType };
           setUser(updatedUser);
           setCurrentView('planner');
      } else {
          setCurrentView('checkout');
      }
  };

  const handleCheckoutComplete = () => {
      if (user && selectedPlanId) {
          const planMap: Record<string, PlanType> = {
              'tier-pro': 'pro',
              'tier-enterprise': 'enterprise'
          };
          const newPlan = planMap[selectedPlanId] || 'starter';
          setUser({ ...user, plan: newPlan });
          setSelectedPlanId(null);
          setCurrentView('planner');
      }
  };

  const renderView = () => {
    if (user && currentView === 'planner') {
        return <DashboardLayout user={user} onLogout={handleLogout} />;
    }
    
    switch (currentView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentView('pricing')} />;
      case 'pricing':
        return <PricingPage onSelectPlan={handleSelectPlan} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setCurrentView('pricing')} />;
      case 'signup':
        return <SignUpPage onSignup={handleSignup} onNavigateToLogin={() => setCurrentView('login')} />;
      case 'checkout':
        return selectedPlanId ? (
            <CheckoutPage 
                planId={selectedPlanId} 
                onComplete={handleCheckoutComplete} 
                onCancel={() => setCurrentView('pricing')} 
            /> 
        ) : <PricingPage onSelectPlan={handleSelectPlan} />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage onNavigateToPost={handleNavigateToPost} />;
      case 'blog-post':
        return selectedBlogPostId ? (
            <BlogPostPage postId={selectedBlogPostId} onBack={() => setCurrentView('blog')} />
        ) : (
            <BlogPage onNavigateToPost={handleNavigateToPost} />
        );
      case 'careers':
        return <CareersPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'api':
        return <ApiDocsPage user={user} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'shared-plan':
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                 <ResultStep 
                    businessPlan={sharedPlanContent} 
                    onRestart={() => {
                        setCurrentView('landing');
                        const newUrl = window.location.pathname;
                        window.history.pushState({}, '', newUrl);
                    }} 
                    isReadOnly={true} 
                    initialShareId={currentShareId}
                    userPlan={'starter'} // Read only view doesn't allow PDF anyway
                />
            </div>
        );
      case 'planner':
         // Fallback if trying to access planner without auth
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setCurrentView('pricing')} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView('pricing')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white flex flex-col">
       {!user && currentView !== 'checkout' && (
         <Navbar
           currentView={currentView}
           onNavigate={setCurrentView}
         />
       )}
       <main className="flex-grow flex flex-col">
        {renderView()}
       </main>
       {!user && currentView !== 'login' && currentView !== 'signup' && currentView !== 'checkout' && (
         <Footer onNavigate={setCurrentView} />
       )}
    </div>
  );
}
