
import React from 'react';
import { StepWrapper } from './StepWrapper';

interface TemplateSelectionStepProps {
  selectedStyle: string;
  onSelect: (style: string) => void;
}

const styles = [
  {
    id: 'Standard Professional',
    name: 'Standard Professional',
    description: 'A formal, comprehensive structure suitable for banks, traditional investors, and grants.',
    features: ['Formal Tone', 'Comprehensive', 'Risk Mitigation'],
    snippet: `## 1. Executive Summary
[Company] is poised to capitalize on the growing market demand for...

## 2. Company Overview
Legal Structure: LLC
Location: New York, NY

## 3. Financial Plan
Projected Revenue (Year 1): $1.2M`,
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'Lean Startup',
    name: 'Lean Startup',
    description: 'Concise and action-oriented. Perfect for early-stage startups testing ideas quickly.',
    features: ['Bullet Points', 'MVP Focus', 'Key Metrics'],
    snippet: `## Problem & Solution
* **Problem:** Users struggle to find...
* **Solution:** An AI-powered app that...

## Key Metrics
* CAC: < $50
* LTV: > $500

## Unfair Advantage
Proprietary dataset of...`,
    icon: (
      <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16 8a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'Creative Storyteller',
    name: 'Creative Storyteller',
    description: 'Engaging and narrative-driven. Best for lifestyle brands and creative agencies.',
    features: ['Narrative Arc', 'Brand Voice', 'Visionary'],
    snippet: `## Our Origin Story
It started with a simple question: "What if...?" We aren't just selling coffee; we are curating a morning ritual.

## The Vision
Imagine a world where every sip connects you to...

## The Tribe
Our customers are dreamers who value...`,
    icon: (
      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({ selectedStyle, onSelect }) => {
  return (
    <StepWrapper title="Choose Your Plan Style" description="Select the format that best fits your goals and audience.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
        {styles.map((style) => (
          <div
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`relative flex flex-col rounded-2xl border transition-all cursor-pointer overflow-hidden group ${
              selectedStyle === style.id
                ? 'border-indigo-600 ring-1 ring-indigo-600 bg-white dark:bg-slate-800 shadow-lg scale-[1.02]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
            }`}
          >
            {/* Header Section */}
            <div className={`p-6 border-b border-slate-100 dark:border-slate-700 ${selectedStyle === style.id ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
               <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${selectedStyle === style.id ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {style.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{style.name}</h3>
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-h-[40px]">
                  {style.description}
               </p>
               
               {/* Feature Tags */}
               <div className="flex flex-wrap gap-2 mt-4">
                  {style.features.map(feature => (
                    <span key={feature} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {feature}
                    </span>
                  ))}
               </div>
            </div>

            {/* Preview Section */}
            <div className="flex-grow p-4 bg-slate-50 dark:bg-slate-900/50">
               <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-1">Preview Output</div>
               <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm h-full">
                  <pre className="font-mono text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-medium">
                    {style.snippet}
                  </pre>
                  <div className="mt-2 h-1 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                  <div className="mt-1 h-1 w-2/3 bg-slate-100 dark:bg-slate-700 rounded"></div>
               </div>
            </div>

            {/* Selection Indicator */}
            <div className={`p-4 flex items-center justify-center border-t border-slate-100 dark:border-slate-700 ${selectedStyle === style.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800'}`}>
               <div className="flex items-center gap-2">
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                      selectedStyle === style.id
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                    }`}
                  >
                    {selectedStyle === style.id && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="3" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${selectedStyle === style.id ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}>
                    {selectedStyle === style.id ? 'Selected' : 'Click to select'}
                  </span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </StepWrapper>
  );
};
