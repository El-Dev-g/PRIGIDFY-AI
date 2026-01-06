
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
  | 'history'
  | 'profile'
  | 'billing'
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
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number | string | null>(null);
  const [sharedPlanContent, setSharedPlanContent] = useState<string>('');
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);

  // Initialize Auth & View Persistence
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
        try {
            // Restore last view from session storage
            const lastView = sessionStorage.getItem('jhaidify_last_view') as View;
            const validDashboardViews = ['planner', 'history', 'profile', 'billing'];
            
            const session = await db.auth.getSession();
            
            if (mounted) {
                if (session) {
                    setUser(session);
                    // If user is logged in, restore their last dashboard view or default to planner
                    if (lastView && validDashboardViews.includes(lastView)) {
                         setCurrentView(lastView);
                    } else if (currentView === 'landing' || currentView === 'login' || currentView === 'signup') {
                         setCurrentView('planner');
                    }
                } else {
                    // Not logged in
                    setUser(null);
                }
            }
        } catch (e) {
            console.error("Auth init error", e);
        } finally {
            if (mounted) setIsLoadingUser(false);
        }
    };
    initAuth();

    // Setup Auth Listener
    const { data: subscription } = db.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
             // Re-fetch full profile data via db abstraction
             const fullProfile = await db.auth.getSession();
             if (mounted && fullProfile) {
                 setUser(fullProfile);
                 if (currentView === 'login' || currentView === 'signup') {
                     setCurrentView('planner');
                 }
             }
        } else if (event === 'SIGNED_OUT') {
             if (mounted) {
                 setUser(null);
                 setCurrentView('landing');
             }
        }
    });

    return () => {
        mounted = false;
        subscription?.subscription.unsubscribe();
    };
  }, []);

  // Save current view state
  useEffect(() => {
     if (user && currentView && currentView !== 'login' && currentView !== 'signup' && currentView !== 'landing') {
         sessionStorage.setItem('jhaidify_last_view', currentView);
     }
  }, [currentView, user]);

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

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    
    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        setCurrentView('checkout');
    } else {
        setCurrentView('planner');
    }
  };
  
  const handleSignup = (signedUpUser: UserProfile) => {
    setUser(signedUpUser);

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
    sessionStorage.removeItem('jhaidify_last_view');
  };

  const handleNavigateToPost = (id: number | string) => {
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
    // Dashboard Views
    if (user && ['planner', 'history', 'profile', 'billing'].includes(currentView)) {
        return (
            <DashboardLayout 
                user={user} 
                onLogout={handleLogout} 
                onSelectPlan={handleSelectPlan}
                onPlanUpdate={handleUserUpdate}
                currentView={currentView as any}
                onChangeView={(view) => setCurrentView(view)}
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
      // Fallback for planner/etc if user not logged in
      case 'planner':
      case 'history':
      case 'profile':
      case 'billing':
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setCurrentView('pricing')} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView('pricing')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white flex flex-col">
       {/* Only show public navbar if we aren't in dashboard mode or checkout */}
       {!user && currentView !== 'checkout' && (
         <Navbar
           currentView={currentView}
           onNavigate={setCurrentView}
         />
       )}
       <main className="flex-grow flex flex-col">
        {renderView()}
       </main>
       {/* Hide footer in dashboard or checkout */}
       {!user && currentView !== 'login' && currentView !== 'signup' && currentView !== 'checkout' && (
         <Footer onNavigate={setCurrentView} />
       )}
    </div>
  );
}
