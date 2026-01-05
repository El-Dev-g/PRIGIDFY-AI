
import { GoogleGenAI } from "@google/genai";
import type { FormData, PlanType } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const generateImage = async (prompt: string): Promise<string | null> => {
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
  } catch (error) {
    console.warn("Failed to generate image for prompt:", prompt, error);
    // Return null to gracefully degrade if image generation fails
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
    // Split by comma, trim whitespace, and filter empty strings
    return text.split(',').map(name => name.trim()).filter(name => name.length > 0);
  } catch (error) {
    console.error("Failed to generate name suggestions", error);
    return [];
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

  // Start all generations in parallel
  const ai = getAiClient();
  
  const textPromise = ai.models.generateContent({
    model: textModel,
    contents: textPrompt,
  });

  const conceptPrompt = `A high quality, professional, cinematic concept photo representing this business idea: ${formData.businessIdea} (Company Name: ${formData.businessName}). The image should visually communicate the core value proposition.`;
  const orgChartPrompt = `A clean, professional corporate organizational chart diagram structure for a ${formData.businessIdea} business named ${formData.businessName}. Infographic style, white background, minimalist design, showing hierarchy.`;
  const financialPrompt = `A professional business bar chart diagram showing projected positive revenue growth over 3 years. Clean 3D design, white background, blue and green colors, corporate style, upward trend.`;

  try {
    const [textResponse, conceptImage, orgImage, financialImage] = await Promise.all([
      textPromise,
      generateImage(conceptPrompt),
      generateImage(orgChartPrompt),
      generateImage(financialPrompt)
    ]);

    let planText = textResponse.text || "";

    // Replace placeholders with Markdown images
    if (conceptImage) {
      planText = planText.replace('{{CONCEPT_IMAGE}}', `\n\n![Business Concept Visualization](${conceptImage})\n\n`);
    } else {
      planText = planText.replace('{{CONCEPT_IMAGE}}', '');
    }

    if (orgImage) {
      planText = planText.replace('{{ORG_CHART_IMAGE}}', `\n\n![Proposed Organizational Structure](${orgImage})\n\n`);
    } else {
      planText = planText.replace('{{ORG_CHART_IMAGE}}', '');
    }

    if (financialImage) {
      planText = planText.replace('{{FINANCIAL_CHART_IMAGE}}', `\n\n![Projected Financial Growth](${financialImage})\n\n`);
    } else {
      planText = planText.replace('{{FINANCIAL_CHART_IMAGE}}', '');
    }

    return planText;

  } catch (error) {
    console.error("Error generating business plan:", error);
    throw new Error("Failed to generate business plan. Please check your API key and try again.");
  }
};
