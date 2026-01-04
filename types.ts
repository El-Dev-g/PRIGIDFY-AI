
export interface FormData {
  businessName: string;
  businessIdea: string;
  targetAudience: string;
  marketingSales: string;
  operations: string;
  financials: string;
  templateStyle: string;
}

export interface SavedPlan {
  id: string;
  date: string;
  title: string;
  style: string;
  content: string;
  formData: FormData;
}

export type PlanType = 'starter' | 'pro' | 'enterprise';

export interface UserProfile {
  name: string;
  email: string;
  plan: PlanType;
}

export interface StepDefinition {
  id: string;
  name: string;
  fields: string[];
  title?: string;
  description?: string;
  placeholder?: string;
  tips?: string[];
  example?: string;
  enableSuggestions?: boolean; // New flag to enable AI suggestions
}

export const STEPS: StepDefinition[] = [
  { 
    id: '01', 
    name: 'Welcome', 
    fields: [] 
  },
  { 
    id: '02', 
    name: 'Business Name', 
    fields: ['businessName'],
    title: "Company Name",
    description: "What is the name of your business? If you don't have one, type a keyword related to your idea and we'll suggest some!",
    placeholder: "e.g., EcoPaws, TechNova, or type 'Coffee' for ideas...",
    tips: [
      "Keep it memorable and easy to spell.",
      "Make sure it reflects your brand identity.",
      "Check if the domain name is available (later)."
    ],
    example: "GreenLeaf Logistics",
    enableSuggestions: true
  },
  { 
    id: '03', 
    name: 'Business Idea', 
    fields: ['businessIdea'],
    title: "Core Business Idea",
    description: "What is the core problem you are solving and what is your unique solution?",
    placeholder: "e.g., I want to start a subscription box service for eco-friendly pet toys...",
    tips: [
      "Clearly define the problem you are addressing.",
      "Highlight what makes your approach unique.",
      "Explain your solution simply."
    ],
    example: "We provide a mobile platform that connects freelance graphic designers with non-profits needing affordable branding work. Unlike general marketplaces, we vet every designer for quality and mission-alignment."
  },
  { 
    id: '04', 
    name: 'Target Audience', 
    fields: ['targetAudience'],
    title: "Target Audience",
    description: "Who are your ideal customers? Be specific about demographics and behaviors.",
    placeholder: "e.g., Millennial dog owners in urban areas who prioritize sustainability...",
    tips: [
      "Think about demographics (age, location, gender).",
      "Consider psychographics (interests, values, lifestyle).",
      "Identify their specific pain points."
    ],
    example: "Urban professionals aged 25-40 who are health-conscious but time-poor. They value convenience and transparency in food sourcing. They typically shop at Whole Foods and use meal delivery apps."
  },
  { 
    id: '05', 
    name: 'Marketing & Sales', 
    fields: ['marketingSales'],
    title: "Marketing & Sales Strategy",
    description: "How will you reach your target audience and convert them into paying customers?",
    placeholder: "e.g., Social media marketing on Instagram, partnerships with pet influencers...",
    tips: [
      "Which channels will you use? (Social, SEO, Email, Direct Sales)",
      "How will you acquire your first 100 customers?",
      "What is your basic pricing strategy."
    ],
    example: "We will launch with an Instagram campaign targeting local foodies (#eatlocal). We will partner with gym owners for a referral program. Our pricing will be a tiered subscription model starting at $20/month."
  },
  { 
    id: '06', 
    name: 'Operations', 
    fields: ['operations'],
    title: "Operations Plan",
    description: "How will your business run day-to-day? Consider suppliers, technology, and location.",
    placeholder: "e.g., Source products from ethical suppliers, use Shopify for e-commerce...",
    tips: [
      "Will you operate online, offline, or both?",
      "Who are your key partners or suppliers?",
      "What technology or equipment do you need?"
    ],
    example: "We will operate as a remote-first company. We will use AWS for hosting, Stripe for payments, and Slack for internal communication. Customer support will be handled via Intercom."
  },
  { 
    id: '07', 
    name: 'Financials', 
    fields: ['financials'],
    title: "Financial Overview",
    description: "Estimate your startup costs, revenue streams, and major expenses.",
    placeholder: "e.g., Startup costs: $5000. Pricing: $29/month. Goal: 100 subscribers in Year 1...",
    tips: [
      "Estimate initial startup costs (licenses, equipment, dev).",
      "Project monthly operating expenses.",
      "Set a realistic revenue target for the first year."
    ],
    example: "Startup costs: $10k (Development + Legal). Monthly burn: $2k (Servers + Marketing). Revenue model: 10% commission on transactions. Projected Year 1 Revenue: $50k."
  },
  {
    id: '08',
    name: 'Plan Style',
    fields: ['templateStyle'],
    title: "Choose Your Style",
    description: "Select a format and tone that matches your business needs."
  },
  { 
    id: '09', 
    name: 'Review', 
    fields: [] 
  },
  { 
    id: '10', 
    name: 'Your Plan', 
    fields: [] 
  },
];
