
import React, { useState } from 'react';
import { db } from '../services/db';
import { moderateTestimonial } from '../services/geminiService';

interface TestimonialSubmissionPageProps {
  onNavigate: (view: any) => void;
}

export const TestimonialSubmissionPage: React.FC<TestimonialSubmissionPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', role: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'rejected' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const isApproved = await moderateTestimonial(formData.content, formData.name);
      
      if (isApproved) {
        await db.testimonials.submit({ ...formData, approved: true });
        setStatus('success');
        setFormData({ name: '', role: '', content: '' });
      } else {
        setStatus('rejected');
      }
    } catch (e) {
      console.error(e);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in text-center bg-white dark:bg-slate-900">
              <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
                  Your testimonial has been submitted and is live on our platform. We appreciate your feedback.
              </p>
              <div className="flex gap-4">
                  <button onClick={() => setStatus('idle')} className="text-indigo-600 font-medium hover:text-indigo-500">Submit Another</button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => onNavigate('landing')} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Return Home</button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
       <div className="max-w-xl w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
           <div className="text-center">
               <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Share Your Story</h2>
               <p className="mt-2 text-slate-600 dark:text-slate-400">
                   Tell us about your experience with JHAIDIFY AI. Your story inspires other entrepreneurs.
               </p>
           </div>

           {status === 'rejected' && (
               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-200">Submission Flagged</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            Our AI content moderator couldn't approve this testimonial. Please ensure it is relevant and appropriate, then try again.
                        </p>
                    </div>
               </div>
           )}

           {status === 'error' && (
               <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center text-red-600">
                   Something went wrong. Please try again later.
               </div>
           )}

           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <div className="space-y-4">
                   <div>
                       <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300">Full Name</label>
                       <div className="mt-2">
                           <input
                               id="name"
                               name="name"
                               type="text"
                               required
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               className="block w-full rounded-md border-0 py-1.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 dark:bg-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                               placeholder="e.g. Sarah Connor"
                           />
                       </div>
                   </div>
                   
                   <div>
                       <label htmlFor="role" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300">Role / Company</label>
                       <div className="mt-2">
                           <input
                               id="role"
                               name="role"
                               type="text"
                               required
                               value={formData.role}
                               onChange={(e) => setFormData({...formData, role: e.target.value})}
                               className="block w-full rounded-md border-0 py-1.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 dark:bg-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                               placeholder="e.g. Founder at Skynet"
                           />
                       </div>
                   </div>

                   <div>
                       <label htmlFor="content" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-300">Testimonial</label>
                       <div className="mt-2">
                           <textarea
                               id="content"
                               name="content"
                               rows={5}
                               required
                               value={formData.content}
                               onChange={(e) => setFormData({...formData, content: e.target.value})}
                               className="block w-full rounded-md border-0 py-1.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 dark:bg-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                               placeholder="How did JHAIDIFY help your business?"
                           />
                       </div>
                   </div>
               </div>

               <div>
                   <button
                       type="submit"
                       disabled={isSubmitting}
                       className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 transition-all"
                   >
                       {isSubmitting ? (
                           <span className="flex items-center gap-2">
                               <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                               AI Reviewing...
                           </span>
                       ) : 'Submit Testimonial'}
                   </button>
               </div>
           </form>
       </div>
    </div>
  );
};
