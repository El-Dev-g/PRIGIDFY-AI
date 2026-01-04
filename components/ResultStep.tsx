
import React, { useState, useCallback, useEffect } from 'react';
import type { PlanType } from '../types';
import { db } from '../services/db';

interface ResultStepProps {
  businessPlan: string;
  onRestart: () => void;
  isReadOnly?: boolean;
  initialShareId?: string | null;
  userPlan?: PlanType;
}

// Helper to process inline styles like bold
const formatInlineStyles = (text: string) => {
  // Regex to match **bold** text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];

  const flushBuffer = (keyPrefix: number) => {
    if (paragraphBuffer.length > 0) {
      // Join with a space to form a continuous paragraph from wrapped lines
      const text = paragraphBuffer.join(' ');
      elements.push(
        <p key={`p-${keyPrefix}`} className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-7 tracking-wide">
          {formatInlineStyles(text)}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line triggers a flush of the current paragraph
    if (!trimmed) {
      flushBuffer(index);
      return;
    }

    // Images: ![Alt](Src)
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      flushBuffer(index);
      elements.push(
        <div key={`img-${index}`} className="my-8 flex flex-col items-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <img 
                    src={imageMatch[2]} 
                    alt={imageMatch[1]} 
                    className="w-full h-auto max-h-[500px] object-contain" 
                />
            </div>
            {imageMatch[1] && (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 italic text-center">
                    Figure: {imageMatch[1]}
                </p>
            )}
        </div>
      );
      return;
    }

    // Headers
    if (trimmed.startsWith('#')) {
      flushBuffer(index);
      let level = 0;
      while (trimmed[level] === '#') level++;
      
      const text = trimmed.substring(level).trim();
      
      if (level === 1) {
         elements.push(<h1 key={index} className="text-3xl font-extrabold text-slate-900 dark:text-white mt-10 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">{text}</h1>);
      } else if (level === 2) {
         elements.push(<h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{text}</h2>);
      } else {
         elements.push(<h3 key={index} className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mt-6 mb-3">{text}</h3>);
      }
      return;
    }

    // Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushBuffer(index);
      elements.push(
        <div key={index} className="flex items-start ml-4 mb-3">
            <span className="mr-3 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500"></span>
            <span className="text-base text-slate-700 dark:text-slate-300 leading-7">{formatInlineStyles(trimmed.substring(2))}</span>
        </div>
      );
      return;
    }

    // Otherwise, accumulate text for paragraph
    paragraphBuffer.push(trimmed);
  });
  
  // Flush any remaining text
  flushBuffer(lines.length);

  return <div>{elements}</div>;
};

export const ResultStep: React.FC<ResultStepProps> = ({ businessPlan, onRestart, isReadOnly = false, initialShareId, userPlan }) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(() => {
     if (initialShareId) {
         return `${window.location.origin}${window.location.pathname}?share=${initialShareId}`;
     }
     return null;
  });
  const [isSharing, setIsSharing] = useState(false);

  const canDownloadPDF = userPlan && userPlan !== 'starter';

  useEffect(() => {
     if (initialShareId) {
         setShareUrl(`${window.location.origin}${window.location.pathname}?share=${initialShareId}`);
     }
  }, [initialShareId]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(businessPlan).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [businessPlan]);

  const handleDownloadPDF = useCallback(() => {
    if (!canDownloadPDF) {
        alert("Please upgrade to Pro or Enterprise plan to download PDF.");
        return;
    }

    setIsGeneratingPdf(true);
    const element = document.getElementById('business-plan-container');
    
    // Basic options for html2pdf
    const opt = {
      margin:       0.5,
      filename:     'Business_Plan.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Check if library is available (loaded via CDN in index.html)
    // @ts-ignore
    if (window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save().then(() => {
            setIsGeneratingPdf(false);
        }).catch((err: any) => {
            console.error("PDF generation failed:", err);
            setIsGeneratingPdf(false);
            alert("Failed to generate PDF. Please try again.");
        });
    } else {
        alert("PDF generator library not loaded. Please refresh the page.");
        setIsGeneratingPdf(false);
    }
  }, [canDownloadPDF]);

  const handleShare = useCallback(async () => {
    if (shareUrl) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        });
        return;
    }

    setIsSharing(true);

    try {
        const shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await db.shares.create(shareId, businessPlan);
        
        const url = `${window.location.origin}${window.location.pathname}?share=${shareId}`;
        setShareUrl(url);
         
        navigator.clipboard.writeText(url).then(() => {
             setShareCopied(true);
             setTimeout(() => setShareCopied(false), 2000);
        });
    } catch (e: any) {
        console.error("Failed to share plan", e);
        alert("Could not create share link. Please try again.");
    } finally {
        setIsSharing(false);
    }
  }, [businessPlan, shareUrl]);

  return (
    <div className="animate-fade-in w-full">
        <div className="text-center mb-10">
            {isReadOnly ? (
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
            ) : (
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            )}
            
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {isReadOnly ? 'Shared Business Plan' : 'Your Business Plan is Ready!'}
            </h2>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                {isReadOnly 
                    ? 'You are viewing a business plan generated by PlanAI.' 
                    : 'Below is the comprehensive plan generated for you, including AI-generated visualizations.'}
            </p>
        </div>

      {/* Action Bar */}
      <div className="flex flex-col items-center mb-10 sticky top-4 z-10 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full">
              <button
                  onClick={handleCopy}
                  className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              >
                  <svg className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy Text'}
              </button>

              <div className="relative group">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf || !canDownloadPDF}
                    className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${
                        !canDownloadPDF 
                        ? 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                    {isGeneratingPdf ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    )}
                    {isGeneratingPdf ? 'Generating...' : !canDownloadPDF ? 'PDF (Pro Only)' : 'Download PDF'}
                </button>
                {/* Tooltip for free users */}
                {!canDownloadPDF && (
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                         Upgrade plan to enable
                     </div>
                )}
              </div>

              <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${
                      shareUrl 
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
              >
                  {isSharing ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  )}
                  {shareCopied ? 'Link Copied!' : shareUrl ? 'Copy Share Link' : 'Create Share Link'}
              </button>

              <button
                  onClick={onRestart}
                  className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              >
                  {isReadOnly ? (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your Own Plan
                      </>
                  ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        New Plan
                      </>
                  )}
              </button>
          </div>

          {/* Share URL Display */}
          {shareUrl && (
              <div className="mt-4 flex items-center gap-2 animate-fade-in w-full max-w-lg bg-white dark:bg-slate-800 p-2 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm">
                  <div className="flex-1 truncate text-xs text-slate-500 dark:text-slate-400 px-2 font-mono">
                      {shareUrl}
                  </div>
                  <a 
                      href={shareUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-none inline-flex items-center justify-center p-1.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                      title="Open in new tab"
                  >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                  </a>
              </div>
          )}
      </div>

      <div id="business-plan-container" className="bg-white dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-8 sm:p-12 lg:p-16 max-w-4xl mx-auto">
          <MarkdownRenderer content={businessPlan} />
        </div>
      </div>
      
      <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
              Disclaimer: This plan and images are generated by AI and should be reviewed by a professional advisor.
          </p>
      </div>
    </div>
  );
};
