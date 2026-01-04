
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

const STORAGE_KEY = 'ai_business_plan_progress';
const HISTORY_KEY = 'ai_business_plan_history';

export const Planner: React.FC<PlannerProps> = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.currentStep === 'number' ? parsed.currentStep : 0;
      }
    } catch (e) {
      console.error('Failed to load progress from local storage', e);
    }
    return 0;
  });

  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialFormData, ...parsed.formData };
      }
    } catch (e) {
      console.error('Failed to load form data from local storage', e);
    }
    return initialFormData;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessPlan, setBusinessPlan] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.businessPlan || '';
      }
    } catch (e) {
      console.error('Failed to load business plan from local storage', e);
    }
    return '';
  });
  
  const totalSteps = STEPS.length;

  useEffect(() => {
    const stateToSave = {
      currentStep,
      formData,
      businessPlan
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save progress to local storage', e);
      // Fallback: If full plan is too big (likely due to images), save without it so user doesn't lose form data
      try {
          const stateToSaveLite = {
            currentStep,
            formData,
            businessPlan: '' // Sacrifice the generated result to save the inputs
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSaveLite));
      } catch (e2) {
          console.error('Failed to save even lite progress', e2);
      }
    }
  }, [currentStep, formData, businessPlan]);

  // Function to save plan to history
  const saveToHistory = useCallback((planContent: string, data: FormData) => {
      try {
          const historyJson = localStorage.getItem(HISTORY_KEY);
          let history: SavedPlan[] = historyJson ? JSON.parse(historyJson) : [];
          
          const newPlan: SavedPlan = {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              title: data.businessName ? `${data.businessName} Plan` : (data.businessIdea.substring(0, 60) + (data.businessIdea.length > 60 ? '...' : '')),
              style: data.templateStyle,
              content: planContent,
              formData: data
          };
          
          history.push(newPlan);
          
          try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
          } catch (e: any) {
             // If quota exceeded, try to make space by removing oldest entries
             if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                 // Keep only the 3 most recent plans
                 if (history.length > 3) {
                     const trimmedHistory = history.slice(-3);
                     localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
                 } else {
                     // If we only have a few but they are huge, keep just the new one
                     localStorage.setItem(HISTORY_KEY, JSON.stringify([newPlan]));
                 }
             } else {
                 throw e;
             }
          }
      } catch (e) {
          console.error("Failed to save to history", e);
      }
  }, []);

  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps - 1) {
      if (currentStep === totalSteps - 2) { // Review step (now second to last)
        setIsLoading(true);
        setError(null);
        try {
          // Pass user plan to service to select correct model
          const plan = await generateBusinessPlan(formData, user.plan);
          setBusinessPlan(plan);
          saveToHistory(plan, formData); // Auto save
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
  }, [currentStep, totalSteps, formData, saveToHistory, user.plan]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  }, [currentStep]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleStyleSelect = useCallback((style: string) => {
    setFormData(prev => ({ ...prev, templateStyle: style }));
  }, []);

  const handleRestart = useCallback(() => {
      setFormData(initialFormData);
      setBusinessPlan('');
      setError(null);
      setCurrentStep(0);
      localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 0) return false;
    const currentStepFields = STEPS[currentStep]?.fields;
    if (!currentStepFields || currentStepFields.length === 0) {
      return false;
    }
    return currentStepFields.some(field => !formData[field as keyof FormData]);
  }, [currentStep, formData]);

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
              onClick={handleBack}
              className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              Go Back and Edit
            </button>
        </div>
      );
    }

    const stepData = STEPS[currentStep];

    if (stepData.id === '01') {
      return <WelcomeStep onNext={handleNext} />;
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
       return <ResultStep businessPlan={businessPlan} onRestart={handleRestart} userPlan={user.plan}/>;
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
