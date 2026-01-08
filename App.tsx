
import React, { useState, useEffect, useRef } from 'react';
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
import { TestimonialSubmissionPage } from './components/TestimonialSubmissionPage';
import { ContactPage } from './components/ContactPage';
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
  | 'checkout'
  | 'submit-testimonial'
  | 'contact';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const [currentView, setCurrentView] = useState<View>('landing');
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<number | string | null>(null);
  const [sharedPlanContent, setSharedPlanContent] = useState<string>('');
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);

  // Store details from checkout to pre-fill signup, including payment info
  const [pendingCheckoutData, setPendingCheckoutData] = useState<{name: string, email: string, payment?: any} | null>(null);
  
  // Refs to access latest state in callbacks/effects without re-triggering them
  const pendingCheckoutDataRef = useRef(pendingCheckoutData);
  const currentViewRef = useRef(currentView);

  useEffect(() => {
      pendingCheckoutDataRef.current = pendingCheckoutData;
  }, [pendingCheckoutData]);

  useEffect(() => {
      currentViewRef.current = currentView;
  }, [currentView]);

  // 1. Initialize Auth & View Persistence (Runs ONCE)
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
        try {
            // Restore last view from session storage
            const lastView = sessionStorage.getItem('jhaidify_last_view') as View;
            const lastBlogPostId = sessionStorage.getItem('jhaidify_last_blog_post_id');
            const validDashboardViews = ['planner', 'history', 'profile', 'billing'];
            const publicViews = [
              'landing', 'pricing', 'about', 'blog', 'blog-post', 'careers', 
              'help', 'api', 'privacy', 'terms', 'submit-testimonial', 'checkout', 'signup', 'login', 'contact'
            ];
            
            // PATH MAPPING: Parse URL path to set initial view (e.g. /signup -> 'signup')
            let path = window.location.pathname.replace(/^\/|\/$/g, '');
            if (path === '') path = 'landing';
            
            // Check if path is a valid view
            const initialViewFromPath = (validDashboardViews.includes(path) || publicViews.includes(path)) 
                ? (path as View) 
                : null;

            if (lastBlogPostId) setSelectedBlogPostId(lastBlogPostId);

            // Set initial view based on URL or Session Storage immediately
            // This prevents "flicker" to landing page while auth loads
            if (initialViewFromPath) {
                setCurrentView(initialViewFromPath);
            } else if (lastView && (validDashboardViews.includes(lastView) || publicViews.includes(lastView))) {
                setCurrentView(lastView);
            }

            const session = await db.auth.getSession();
            
            if (mounted) {
                if (session) {
                    setUser(session);
                    // If user is logged in, and current view is login/signup/landing, default to planner
                    // Otherwise keep the restored view (e.g. they refreshed on /billing)
                    if (currentView === 'landing' || currentView === 'login' || currentView === 'signup') {
                        // Only redirect if we didn't just set it from URL
                         if (!initialViewFromPath || initialViewFromPath === 'landing') {
                             setCurrentView('planner');
                         }
                    }
                } else {
                    // Not logged in
                    setUser(null);
                    // View remains what we set it to (e.g. 'planner'). 
                    // The render logic will handle showing the Login component for protected views.
                }
            }
        } catch (e) {
            console.error("Auth init error", e);
        } finally {
            if (mounted) setIsLoadingUser(false);
        }
    };
    initAuth();

    return () => {
        mounted = false;
    };
  }, []); // Dependency array must be empty to run only once

  // 2. Auth State Listener
  useEffect(() => {
    let mounted = true;
    const { data: subscription } = db.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
             // Re-fetch full profile data via db abstraction
             const fullProfile = await db.auth.getSession();
             if (mounted && fullProfile) {
                 setUser(fullProfile);
                 
                 // Access current state via refs to decide navigation
                 const isLoginView = currentViewRef.current === 'login';
                 const hasPendingData = !!pendingCheckoutDataRef.current;

                 if (isLoginView && !hasPendingData) {
                     setCurrentView('planner');
                 }
             }
        } else if (event === 'SIGNED_OUT') {
             if (mounted) {
                 setUser(null);
                 // Only redirect to landing if we are currently on a protected route
                 // Otherwise stay (e.g. if on Pricing)
                 const validDashboardViews = ['planner', 'history', 'profile', 'billing'];
                 if (validDashboardViews.includes(currentViewRef.current)) {
                     setCurrentView('landing');
                 }
             }
        }
    });

    return () => {
        mounted = false;
        subscription?.subscription.unsubscribe();
    };
  }, []); // Run once to set up listener

  // Save current view state
  useEffect(() => {
     // Persist view state regardless of login status (except for transient auth pages)
     if (currentView && currentView !== 'login' && currentView !== 'signup') {
         sessionStorage.setItem('jhaidify_last_view', currentView);
     }
     if (selectedBlogPostId) {
         sessionStorage.setItem('jhaidify_last_blog_post_id', String(selectedBlogPostId));
     }
  }, [currentView, selectedBlogPostId]);

  // Check for shared plan in URL and Paystack Redirects
  useEffect(() => {
    const checkUrlParams = async () => {
        const params = new URLSearchParams(window.location.search);
        
        // 1. Check for Shared Plan
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

        // 2. Check for Paystack Callback (Redirect Flow)
        const paymentReference = params.get('reference') || params.get('trxref');
        if (paymentReference) {
            // Retrieve pending data from session storage
            const pendingPlanId = sessionStorage.getItem('jhaidify_pending_plan_id');
            const pendingEmail = sessionStorage.getItem('jhaidify_pending_email');
            const pendingName = sessionStorage.getItem('jhaidify_pending_name');
            const pendingAmount = sessionStorage.getItem('jhaidify_pending_amount');

            if (pendingPlanId && pendingEmail && pendingName) {
                // Construct the pending data object
                const checkoutData = {
                    name: pendingName,
                    email: pendingEmail,
                    payment: {
                        reference: paymentReference,
                        status: 'success', // We assume success on callback return for this flow
                        amount: pendingAmount ? parseFloat(pendingAmount) : 0,
                        currency: 'GHS',
                        planId: pendingPlanId
                    }
                };
                
                // Set the pending data to trigger the signup/upgrade flow
                setPendingCheckoutData(checkoutData);
                setSelectedPlanId(pendingPlanId);
                
                // Clean up URL and Storage
                window.history.replaceState({}, '', window.location.pathname);
                sessionStorage.removeItem('jhaidify_pending_plan_id');
                sessionStorage.removeItem('jhaidify_pending_email');
                sessionStorage.removeItem('jhaidify_pending_name');
                sessionStorage.removeItem('jhaidify_pending_amount');

                // Explicitly switch to signup view to complete the process
                setCurrentView('signup');
            }
        }
    };
    checkUrlParams();
  }, []);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    
    // If they were trying to buy a plan but logged in instead
    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        setCurrentView('checkout');
    } else {
        setCurrentView('planner');
    }
  };
  
  const handleSignup = async (signedUpUser: UserProfile) => {
    setUser(signedUpUser);

    // If they came from checkout (Success Payment -> Signup), upgrade them now
    if (selectedPlanId && selectedPlanId !== 'tier-starter') {
        const planMap: Record<string, PlanType> = {
            'tier-pro': 'pro',
            'tier-enterprise': 'enterprise'
        };
        const newPlan = planMap[selectedPlanId] || 'starter';
        
        // Upgrade the newly created user
        const updatedUser = await db.auth.updatePlan(signedUpUser.id, newPlan);
        if (updatedUser) {
            setUser(updatedUser);
        } else {
            // Optimistic update if backend fails or falls back silently
            setUser({ ...signedUpUser, plan: newPlan });
        }
        
        // Record the transaction if payment data exists
        if (pendingCheckoutData?.payment) {
            await db.transactions.create(signedUpUser.id, pendingCheckoutData.payment);
        }

        // Clear pending data
        setSelectedPlanId(null);
        setPendingCheckoutData(null);
        
        // Go to dashboard
        setCurrentView('planner');
    } else if (selectedPlanId && selectedPlanId !== 'tier-starter') {
         // Fallback: If they somehow signed up without payment pending but had a plan selected
         // Redirect to checkout to pay
         setCurrentView('checkout');
    } else {
        // Starter/Free plan signup
        setCurrentView('planner');
    }
  };

  const handleLogout = async () => {
    await db.auth.logout();
    setUser(null);
    setCurrentView('landing');
    setSelectedPlanId(null);
    setPendingCheckoutData(null);
    sessionStorage.removeItem('jhaidify_last_view');
  };

  const handleNavigateToPost = (id: number | string) => {
    setSelectedBlogPostId(id);
    setCurrentView('blog-post');
  };

  const handleSelectPlan = (planId: string) => {
      setSelectedPlanId(planId);
      
      if (planId === 'tier-starter') {
          if (!user) {
              setCurrentView('signup');
          } else {
              setCurrentView('planner');
          }
      } else {
          // For paid plans, go directly to checkout regardless of auth status
          // We will handle account creation AFTER payment if they are guests
          setCurrentView('checkout');
      }
  };
  
  const handleUserUpdate = (updatedUser: UserProfile) => {
      setUser(updatedUser);
  };

  const handleCheckoutComplete = async (customerDetails?: {name: string, email: string, payment?: any}) => {
      // Logic:
      // 1. If user is logged in -> Record Transaction -> Upgrade Plan -> Go to Planner
      // 2. If user is Guest -> Save Details (inc. payment) -> Go to SignUp -> Create Account -> Upgrade Plan -> Record Transaction -> Go to Planner
      
      if (user) {
          const planMap: Record<string, PlanType> = {
              'tier-pro': 'pro',
              'tier-enterprise': 'enterprise'
          };
          
          // Get Plan ID from payment details OR selected state.
          // Prioritize payment details as it's the confirmed transaction.
          const confirmedPlanId = customerDetails?.payment?.planId || selectedPlanId;
          const newPlan = planMap[confirmedPlanId || ''] || 'starter';
          
          if (customerDetails?.payment) {
              await db.transactions.create(user.id, customerDetails.payment);
          }

          const updatedUser = await db.auth.updatePlan(user.id, newPlan);
          if (updatedUser) {
              setUser(updatedUser);
          } else {
              // Optimistic update for UI if backend update had issues but payment succeeded
              setUser({ ...user, plan: newPlan });
          }
          
          setSelectedPlanId(null);
          setCurrentView('planner');
      } else {
          // Guest User Flow
          if (customerDetails) {
              setPendingCheckoutData(customerDetails);
          }
          // Explicitly set view to signup
          setCurrentView('signup');
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
    // Dashboard Views (Protected)
    // Note: User can still be null if they refreshed on a dashboard view but session expired
    // The check below ensures we render DashboardLayout ONLY if user exists
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
        return <LandingPage onGetStarted={() => setCurrentView('pricing')} onNavigate={setCurrentView} />;
      case 'pricing':
        return <PricingPage onSelectPlan={handleSelectPlan} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setCurrentView('pricing')} />;
      case 'signup':
        return (
            <SignUpPage 
                onSignup={handleSignup} 
                onNavigateToLogin={() => setCurrentView('login')} 
                initialName={pendingCheckoutData?.name}
                initialEmail={pendingCheckoutData?.email}
            />
        );
      case 'checkout':
        return selectedPlanId ? (
            <CheckoutPage 
                planId={selectedPlanId} 
                onComplete={handleCheckoutComplete} 
                onCancel={() => {
                    // If they cancel, go back to pricing. No account created.
                    setSelectedPlanId(null);
                    setCurrentView('pricing');
                }} 
            /> 
        ) : <PricingPage onSelectPlan={handleSelectPlan} />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage onNavigateToPost={handleNavigateToPost} />;
      case 'blog-post':
        return selectedBlogPostId ? (
            <BlogPostPage 
                postId={selectedBlogPostId} 
                onBack={() => setCurrentView('blog')} 
                onNavigateToPost={handleNavigateToPost}
                onNavigate={setCurrentView}
            />
        ) : (
            <BlogPage onNavigateToPost={handleNavigateToPost} />
        );
      case 'careers':
        return <CareersPage />;
      case 'help':
        return <HelpCenterPage onNavigate={setCurrentView} />;
      case 'api':
        return <ApiDocsPage user={user} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'submit-testimonial':
        return <TestimonialSubmissionPage onNavigate={setCurrentView} />;
      case 'contact':
        return <ContactPage />;
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
      // Fallback: If view is protected but user is null, show login instead of landing
      case 'planner':
      case 'history':
      case 'profile':
      case 'billing':
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setCurrentView('pricing')} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView('pricing')} onNavigate={setCurrentView} />;
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
