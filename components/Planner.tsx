
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { Navigation } from './Navigation';
import { WelcomeStep } from './WelcomeStep';
import { InputStep } from './InputStep';
import { TemplateSelectionStep } from './TemplateSelectionStep';
import { ReviewStep } from './ReviewStep';
import { ResultStep } from './ResultStep';
import { LoadingSpinner } from './LoadingSpinner';
import { generateBusinessPlan, generateNameSuggestions } from '../services/geminiService';
import { db } from '../services/db';
import type { FormData, SavedPlan, UserProfile } from '../types';
import { STEPS } from '../types';

interface PlannerProps {
    user: UserProfile;
}

const initialFormData: FormData = {
  businessName: '',
  businessIdea: '',
  targetAudience: '',
  marketingSales: '',
  operations: '',
  financials: '',
  templateStyle: 'Standard Professional',
};

export const Planner: React.FC<PlannerProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessPlan, setBusinessPlan] = useState<string>('');
  
  const totalSteps = STEPS.length;

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
        try {
            const saved = await db.plans.getDraft(user.id);
            if (saved) {
                if (typeof saved.currentStep === 'number') setCurrentStep(saved.currentStep);
                if (saved.formData) setFormData({ ...initialFormData, ...saved.formData });
                if (saved.businessPlan) setBusinessPlan(saved.businessPlan);
            }
        } catch (e) {
            console.error('Failed to load draft', e);
        } finally {
            setIsInitializing(false);
        }
    };
    loadDraft();
  }, [user.id]);

  // Save draft on change
  useEffect(() => {
    if (isInitializing) return;
    
    const saveData = {
        currentStep,
        formData,
        businessPlan: currentStep === totalSteps - 1 ? businessPlan : '' // Don't save full plan in draft if done? Actually we should.
    };
    
    // Debounce save slightly
    const timer = setTimeout(() => {
        db.plans.saveDraft(user.id, saveData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentStep, formData, businessPlan, user.id, isInitializing, totalSteps]);

  // Function to save plan to history (DB)
  const saveToHistory = useCallback(async (planContent: string, data: FormData) => {
      try {
          const newPlan: SavedPlan = {
              id: crypto.randomUUID(),
              userId: user.id,
              date: new Date().toISOString(),
              title: data.businessName ? `${data.businessName} Plan` : (data.businessIdea.substring(0, 60) + (data.businessIdea.length > 60 ? '...' : '')),
              style: data.templateStyle,
              content: planContent,
              formData: data
          };
          
          await db.plans.create(newPlan);
      } catch (e) {
          console.error("Failed to save to history", e);
      }
  }, [user.id]);

  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps - 1) {
      if (currentStep === totalSteps - 2) { // Review step (now second to last)
        setError(null);
        setIsLoading(true);
        
        // Enforce Plan Limits
        if (user.plan === 'starter') {
            try {
                const plans = await db.plans.list(user.id);
                if (plans.length >= 15) {
                    setError("Starter plan limit reached (15 plans). Please upgrade to Pro for unlimited plans.");
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                console.error("Failed to check plan limit", e);
            }
        }

        try {
          // Pass user plan to service to select correct model
          const plan = await generateBusinessPlan(formData, user.plan);
          setBusinessPlan(plan);
          await saveToHistory(plan, formData); // Auto save to DB
          setCurrentStep(step => step + 1);
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentStep(step => step + 1);
      }
    }
  }, [currentStep, totalSteps, formData, saveToHistory, user.plan, user.id]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  }, [currentStep]);

  const handleEdit = useCallback(() => {
      // Go back to Review Step (index 8) to allow editing
      setCurrentStep(totalSteps - 2);
  }, [totalSteps]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleStyleSelect = useCallback((style: string) => {
    setFormData(prev => ({ ...prev, templateStyle: style }));
  }, []);

  const handleRestart = useCallback(async () => {
      setFormData({ ...initialFormData });
      setBusinessPlan('');
      setError(null);
      setCurrentStep(0);
      await db.plans.saveDraft(user.id, null); // Clear draft
  }, [user.id]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 0) return false;
    const currentStepFields = STEPS[currentStep]?.fields;
    if (!currentStepFields || currentStepFields.length === 0) {
      return false;
    }
    return currentStepFields.some(field => !formData[field as keyof FormData]);
  }, [currentStep, formData]);

  if (isInitializing) {
      return <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Generation Failed</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{error}</p>
             <button
              onClick={() => { setError(null); handleBack(); }}
              className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Go Back
            </button>
        </div>
      );
    }

    const stepData = STEPS[currentStep];

    if (stepData.id === '01') {
      return <WelcomeStep onNext={handleNext} userName={user.name} />;
    }
    
    // Plan Style Step (now index 7 in array, id 08)
    if (stepData.id === '08') {
      return <TemplateSelectionStep selectedStyle={formData.templateStyle} onSelect={handleStyleSelect} />;
    }
    
    // Review Step (now index 8, id 09)
    if (stepData.id === '09') {
      return <ReviewStep formData={formData} />;
    }

    // Result Step (now index 9, id 10)
    if (stepData.id === '10') {
       return <ResultStep businessPlan={businessPlan} onRestart={handleRestart} userPlan={user.plan} onEdit={handleEdit} />;
    }

    const fieldName = stepData.fields[0] as keyof FormData;
    return (
      <InputStep
        key={stepData.id}
        title={stepData.title || stepData.name}
        description={stepData.description || ''}
        value={formData[fieldName]}
        onChange={(e) => handleFormChange(Object.assign(e, { target: { name: fieldName, value: e.target.value } }))}
        placeholder={stepData.placeholder || ''}
        tips={stepData.tips}
        example={stepData.example}
        enableSuggestions={stepData.enableSuggestions}
        onGetSuggestions={stepData.enableSuggestions ? generateNameSuggestions : undefined}
      />
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden border border-slate-100 dark:border-slate-700">
          {/* Progress Bar Container */}
          {currentStep > 0 && currentStep < totalSteps - 1 && (
             <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                <ProgressBar currentStep={currentStep} />
             </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="min-h-[400px] flex flex-col">
              {renderContent()}
            </div>
            
            {currentStep > 0 && currentStep < totalSteps - 1 && !isLoading && !error && (
              <Navigation 
                currentStep={currentStep}
                totalSteps={totalSteps}
                onBack={handleBack}
                onNext={handleNext}
                isNextDisabled={isNextDisabled}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
    </div>
  );
}
