
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
import { db } from './services/db';
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const [currentView, setCurrentView] = useState<View>('landing');
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number | null>(null);
  const [sharedPlanContent, setSharedPlanContent] = useState<string>('');
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
        try {
            const session = await db.auth.getSession();
            if (session) {
                setUser(session);
                setCurrentView('planner');
            }
        } catch (e) {
            console.error("Auth init error", e);
        } finally {
            setIsLoadingUser(false);
        }
    };
    initAuth();
  }, []);

  // Check for shared plan in URL
  useEffect(() => {
    const checkShare = async () => {
        const params = new URLSearchParams(window.location.search);
        const shareId = params.get('share');
        if (shareId) {
            const content = await db.shares.get(shareId);
            if (content) {
                setSharedPlanContent(content);
                setCurrentShareId(shareId);
                setCurrentView('shared-plan');
            } else {
                // Invalid or expired share link, remove it from URL
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    };
    checkShare();
  }, []);

  const handleLogin = async (email: string) => {
    const user = await db.auth.login(email);
    setUser(user);
    
    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        setCurrentView('checkout');
    } else {
        setCurrentView('planner');
    }
  };
  
  const handleSignup = async (name: string, email: string) => {
    const user = await db.auth.signup(name, email);
    setUser(user);

    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        setCurrentView('checkout');
    } else {
        setCurrentView('planner');
    }
  };

  const handleLogout = async () => {
    await db.auth.logout();
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
           // Downgrade logic if from Pricing Page (logged out)
           // If logged in, this usually comes from Dashboard now
           setCurrentView('planner');
      } else {
          setCurrentView('checkout');
      }
  };
  
  const handleUserUpdate = (updatedUser: UserProfile) => {
      setUser(updatedUser);
  };

  const handleCheckoutComplete = async () => {
      if (user && selectedPlanId) {
          const planMap: Record<string, PlanType> = {
              'tier-pro': 'pro',
              'tier-enterprise': 'enterprise'
          };
          const newPlan = planMap[selectedPlanId] || 'starter';
          
          const updatedUser = await db.auth.updatePlan(user.id, newPlan);
          if (updatedUser) setUser(updatedUser);
          
          setSelectedPlanId(null);
          setCurrentView('planner');
      }
  };

  if (isLoadingUser) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
      );
  }

  const renderView = () => {
    if (user && currentView === 'planner') {
        return (
            <DashboardLayout 
                user={user} 
                onLogout={handleLogout} 
                onSelectPlan={handleSelectPlan}
                onPlanUpdate={handleUserUpdate}
            />
        );
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
                onCancel={() => setCurrentView('planner')} 
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
                    userPlan={'starter'}
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
