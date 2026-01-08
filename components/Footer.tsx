
import React from 'react';
import { View } from '../App';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
             <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">JHAIDIFY AI</span>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Empowering entrepreneurs to turn their vision into reality with AI-driven business planning.
            </p>
            <div className="flex space-x-6">
                {/* Social placeholders */}
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Twitter</span>
                   <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><button onClick={() => onNavigate('landing')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Features</button></li>
                  <li><button onClick={() => onNavigate('pricing')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Pricing</button></li>
                  <li><button onClick={() => onNavigate('submit-testimonial')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Submit Review</button></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                   <li><button onClick={() => onNavigate('about')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">About</button></li>
                   <li><button onClick={() => onNavigate('blog')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</button></li>
                   <li><button onClick={() => onNavigate('contact')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Contact</button></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                   <li><button onClick={() => onNavigate('help')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Help Center</button></li>
                   <li><button onClick={() => onNavigate('contact')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Contact Us</button></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><button onClick={() => onNavigate('privacy')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Privacy</button></li>
                  <li><button onClick={() => onNavigate('terms')} className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Terms</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-slate-900/10 dark:border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">&copy; 2026 JHAIDIFY AI Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
