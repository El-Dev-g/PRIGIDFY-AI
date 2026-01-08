
import { GoogleGenAI } from "@google/genai";
import type { FormData, PlanType } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper for delay to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateImage = async (prompt: string, retries = 1): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    // Retry on 429 (Too Many Requests) or 503 (Service Unavailable)
    if (retries > 0 && (error.status === 429 || error.status === 503 || error.message?.includes('429'))) {
        console.warn(`Rate limit hit for image. Retrying in 2s...`);
        await delay(2000);
        return generateImage(prompt, retries - 1);
    }
    
    console.warn("Failed to generate image for prompt:", prompt.substring(0, 50) + "...", error.message || error);
    return null;
  }
};

export const generateNameSuggestions = async (keyword: string): Promise<string[]> => {
  if (!keyword || keyword.length < 2) return [];

  const prompt = `
    Generate 5 creative, modern, and catchy business names based on the keyword or concept: "${keyword}".
    Return ONLY a comma-separated list of names. Do not include numbering or bullet points.
    Example output: AlphaTech, NovaSphere, GreenRoute, PureFlow, SkyLine
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const text = response.text || "";
    return text.split(',').map(name => name.trim()).filter(name => name.length > 0);
  } catch (error) {
    console.error("Failed to generate name suggestions", error);
    return [];
  }
};

export const moderateTestimonial = async (content: string, author: string): Promise<boolean> => {
    const prompt = `
      You are an AI Content Moderator for a business platform.
      Analyze the following testimonial submitted by user "${author}".
      
      Testimonial Content: "${content}"
      
      Your task is to approve or reject this content.
      
      Criteria for APPROVAL (return true):
      1. It is relevant to business, planning, entrepreneurship, or using software tools.
      2. It is constructive, positive, or neutral feedback.
      3. It contains NO profanity, hate speech, spam, or inappropriate language.
      
      Criteria for REJECTION (return false):
      1. Spam, gibberish, or irrelevant text.
      2. Profanity, insults, or unsafe content.
      
      Return JSON ONLY: { "approved": boolean }
    `;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const json = JSON.parse(response.text || "{}");
        return json.approved === true;
    } catch (error) {
        console.error("Testimonial moderation failed", error);
        // Default to false if AI fails for safety
        return false;
    }
};

export const generateAutoBlogPost = async (): Promise<{ title: string; excerpt: string; content: string; category: string }> => {
  const topics = [
      "The Future of AI in Entrepreneurship",
      "How PRIGIDFY AI is Changing Business Planning",
      "Startup Mistakes to Avoid in 2026",
      "Scaling Your Business with Artificial Intelligence",
      "From Idea to IPO: A Guide",
      "Understanding Financial Projections for Non-CFOs",
      "The Art of the Pitch Deck"
  ];
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `
    You are the lead content editor for "PRIGIDFY AI", a business planning platform.
    Write a professional, engaging blog post about: "${randomTopic}".
    
    The tone should be insightful, encouraging, and professional.
    
    Return the response in strict JSON format with the following keys:
    - title: A catchy headline.
    - excerpt: A 2-sentence summary of the post.
    - category: A short category name (e.g., "Strategy", "AI", "Finance").
    - content: The full blog post body in HTML format (use <p>, <h2>, <ul>, <li> tags). Do not use Markdown.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const json = JSON.parse(response.text || "{}");
    return json;
  } catch (error) {
      console.error("Blog generation failed", error);
      throw error;
  }
};

export const generateBusinessPlan = async (formData: FormData, planType: PlanType): Promise<string> => {
  // Use Gemini 3 Pro for paid plans (Pro/Enterprise) for complex tasks, Flash for free tier
  const textModel = (planType === 'pro' || planType === 'enterprise') 
      ? 'gemini-3-pro-preview' 
      : 'gemini-3-flash-preview';

  const textPrompt = `
    Act as an expert business consultant. Based on the following user-provided information, generate a comprehensive and well-structured business plan. 
    
    **Tone and Style:**
    The user has requested the plan be written in the style of: **"${formData.templateStyle}"**.
    - If "Standard Professional": Use a formal, investor-ready tone with comprehensive paragraphs.
    - If "Lean Startup": Use a concise, action-oriented tone with bullet points and focus on MVP and validation.
    - If "Creative Storyteller": Use an engaging, narrative-driven tone that highlights brand voice and vision.

    **Business Plan Details:**

    **Business Name:** ${formData.businessName || "Untitled Venture"}

    **1. Core Business Idea:**
    ${formData.businessIdea}

    **2. Target Audience:**
    ${formData.targetAudience}

    **3. Marketing and Sales Strategy:**
    ${formData.marketingSales}
    
    **4. Operations Plan:**
    ${formData.operations}

    **5. Financial Overview:**
    ${formData.financials}

    **Instructions for Generation:**

    Please generate the following sections for the business plan using Markdown formatting.
    
    **CRITICAL STRUCTURE:**
    You must organize the plan into **Main Topics (H2 / ##)** and **Subtopics (H3 / ###)** for every major section.
    Under each subtopic, provide detailed content (paragraphs or bullet points).

    **CRITICAL PLACEHOLDERS:**
    - Insert "{{CONCEPT_IMAGE}}" immediately after the "Company Description" main section.
    - Insert "{{ORG_CHART_IMAGE}}" immediately after the "Organization and Management" main section.
    - Insert "{{FINANCIAL_CHART_IMAGE}}" immediately after the "Financial Projections" main section.

    **Required Structure:**
    - **# ${formData.businessName || "Business Plan"}** (Title)
    
    - **## 1. Executive Summary**
      - **### 1.1 Overview**
      - **### 1.2 Mission & Vision**
      - **### 1.3 Goals & Objectives**

    - **## 2. Company Description**
      - **### 2.1 Company Ownership**
      - **### 2.2 History & Current Status**
      - **### 2.3 Key Success Factors**
    
    - **{{CONCEPT_IMAGE}}**

    - **## 3. Market Analysis**
      - **### 3.1 Industry Analysis**
      - **### 3.2 Target Market Segment**
      - **### 3.3 Competitive Analysis**

    - **## 4. Organization and Management**
      - **### 4.1 Organizational Structure**
      - **### 4.2 Management Team**
      - **### 4.3 Personnel Plan**
    
    - **{{ORG_CHART_IMAGE}}**

    - **## 5. Products and Services**
      - **### 5.1 Product/Service Description**
      - **### 5.2 Unique Value Proposition**
      - **### 5.3 Future Development**

    - **## 6. Marketing and Sales Strategy**
      - **### 6.1 Marketing Strategy**
      - **### 6.2 Sales Strategy**
      - **### 6.3 Pricing Strategy**

    - **## 7. Operations Plan**
      - **### 7.1 Operational Workflow**
      - **### 7.2 Suppliers & Logistics**
      - **### 7.3 Technology & Equipment**

    - **## 8. Financial Projections**
      - **### 8.1 Key Assumptions**
      - **### 8.2 Revenue Forecast**
      - **### 8.3 Break-even Analysis**
    
    - **{{FINANCIAL_CHART_IMAGE}}**

    - **## 9. Conclusion**
      - **### 9.1 Implementation Roadmap**
      - **### 9.2 Summary of Opportunity**
      - **### 9.3 Closing Statement**
  `;

  try {
    const ai = getAiClient();
    
    // 1. Generate Text FIRST
    // We prioritize text generation to ensure the user gets the document even if images fail.
    // This also avoids the "4 concurrent requests" burst that often triggers rate limits.
    const textResponse = await ai.models.generateContent({
      model: textModel,
      contents: textPrompt,
    });

    let planText = textResponse.text || "";

    // 2. Image Generation Disabled
    // To re-enable, uncomment the code below and remove the placeholder stripping loop.
    
    const placeholders = ['{{CONCEPT_IMAGE}}', '{{ORG_CHART_IMAGE}}', '{{FINANCIAL_CHART_IMAGE}}'];
    for (const placeholder of placeholders) {
        planText = planText.replace(placeholder, '');
    }

    /* IMAGE GENERATION DISABLED
    const conceptPrompt = `A high quality, professional, cinematic concept photo representing this business idea: ${formData.businessIdea} (Company Name: ${formData.businessName}). The image should visually communicate the core value proposition.`;
    const orgChartPrompt = `A clean, professional corporate organizational chart diagram structure for a ${formData.businessIdea} business named ${formData.businessName}. Infographic style, white background, minimalist design, showing hierarchy.`;
    const financialPrompt = `A professional business bar chart diagram showing projected positive revenue growth over 3 years. Clean 3D design, white background, blue and green colors, corporate style, upward trend.`;

    const imageRequests = [
        { prompt: conceptPrompt, placeholder: '{{CONCEPT_IMAGE}}', caption: 'Business Concept Visualization' },
        { prompt: orgChartPrompt, placeholder: '{{ORG_CHART_IMAGE}}', caption: 'Proposed Organizational Structure' },
        { prompt: financialPrompt, placeholder: '{{FINANCIAL_CHART_IMAGE}}', caption: 'Projected Financial Growth' }
    ];

    for (const req of imageRequests) {
        // Wait 500ms between image requests to be gentle on the API
        await delay(500);
        const base64Image = await generateImage(req.prompt);
        
        if (base64Image) {
            planText = planText.replace(req.placeholder, `\n\n![${req.caption}](${base64Image})\n\n`);
        } else {
            planText = planText.replace(req.placeholder, '');
        }
    }
    */

    return planText;

  } catch (error: any) {
    console.error("Error generating business plan:", error);
    
    let errorMessage = "Failed to generate business plan.";
    if (error.message) {
        if (error.message.includes("API_KEY")) {
             errorMessage = "API Key is missing. Please check your configuration.";
        } else if (error.message.includes("429")) {
             errorMessage = "API Quota exceeded. Please try again later.";
        } else {
             errorMessage = `Generation failed: ${error.message}`;
        }
    }
    
    throw new Error(errorMessage);
  }
};
