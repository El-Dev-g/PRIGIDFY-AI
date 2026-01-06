
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserProfile, SavedPlan, PlanType } from '../types';

const KEYS = {
  DRAFT: 'jhaidify_draft',
  USER_SESSION: 'jhaidify_session',
  LOCAL_PLANS: 'jhaidify_local_plans',
  LOCAL_SHARES: 'jhaidify_local_shares',
  BLOG_POSTS: 'jhaidify_blog_posts',
  LAST_BLOG_GEN: 'jhaidify_last_blog_gen',
  DAILY_BLOG_COUNT: 'jhaidify_daily_blog_count',
  LAST_RESET_DATE: 'jhaidify_last_reset_date'
};

const mapUser = (sessionUser: any, profile: any): UserProfile => ({
  id: sessionUser.id,
  email: sessionUser.email!,
  name: profile?.name || sessionUser.email?.split('@')[0] || 'User',
  plan: (profile?.plan as PlanType) || 'starter'
});

// Mock user for offline mode
const getMockUser = (): UserProfile | null => {
  const stored = localStorage.getItem(KEYS.USER_SESSION);
  return stored ? JSON.parse(stored) : null;
};

// Helper to check if a string is a valid UUID
const isUUID = (str: string) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str);
};

export interface BlogPost {
    id: number | string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    author: string;
    image?: string;
    isAi?: boolean;
}

// Initial "Seeded" Posts - These act as the first batch of AI generations
const SEEDED_POSTS: BlogPost[] = [
  {
    id: 'seed-1',
    title: 'How to Validate Your Business Idea in 48 Hours',
    excerpt: 'Before writing a full plan, ensure your idea has legs. Here is a step-by-step guide to rapid market validation using low-code tools.',
    date: 'Mar 16, 2025',
    category: 'Startup Strategy',
    author: 'PRIGIDFY',
    isAi: true,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: `<p class="lead text-xl text-slate-600 dark:text-slate-300 mb-8">Before writing a full plan, ensure your idea has legs. Validation is the process of testing your core assumptions before investing significant time or money.</p><h2>1. The Problem Interview</h2><p>Start by talking to potential customers. Don't pitch your solution; ask about their problems.</p><h2>2. The Smoke Test</h2><p>Set up a simple landing page describing your value proposition. Drive traffic and measure sign-ups.</p>`
  },
  {
    id: 'seed-2',
    title: 'The 5 Most Common Mistakes in Financial Projections',
    excerpt: 'Investors spot these errors instantly. Learn how to balance optimism with realism when forecasting your revenue and expenses.',
    date: 'Mar 10, 2025',
    category: 'Finance',
    author: 'PRIGIDFY',
    isAi: true,
    image: 'https://images.unsplash.com/photo-1554224155-98406856d03a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
    content: `<p>Financial projections are a blend of art and science. Here are the top mistakes founders make:</p><ul><li><strong>Overestimating early revenue:</strong> Sales cycles are often longer than you think.</li><li><strong>Ignoring hidden costs:</strong> Don't forget insurance, software subscriptions, and transaction fees.</li><li><strong>Confusing cash flow with profit:</strong> You can be profitable on paper but run out of cash.</li></ul>`
  },
  {
    id: 'seed-3',
    title: 'Why Storytelling Matters in Your Executive Summary',
    excerpt: 'Facts tell, but stories sell. Discover how to weave a compelling narrative that hooks investors from the very first paragraph.',
    date: 'Feb 28, 2025',
    category: 'Pitching',
    author: 'PRIGIDFY',
    isAi: true,
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    content: `<p>Your executive summary is the most important part of your business plan. It's the hook.</p><p>Instead of starting with dry statistics, start with a character—your target customer—and the conflict they face. Show how your solution resolves this conflict and creates a better future.</p>`
  }
];

export const db = {
  auth: {
    async getSession(): Promise<UserProfile | null> {
      if (!isSupabaseConfigured) return getMockUser();

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
             console.warn("Session check failed, using mock if available:", sessionError.message);
             return getMockUser();
        }
        
        if (!session?.user) {
            const mock = getMockUser();
            return mock; 
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        if (profileError) {
             console.warn("Profile fetch failed:", profileError.message);
             return mapUser(session.user, { name: session.user.user_metadata?.name });
        }

        return mapUser(session.user, profile);
      } catch (e) {
        return getMockUser();
      }
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
        if (isSupabaseConfigured) {
            return supabase.auth.onAuthStateChange(callback);
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
    },

    async login(email: string) {
        throw new Error("Use signInWithPassword"); 
    },

    async signInWithPassword(email: string, password: string): Promise<UserProfile> {
      if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) throw error;

            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();
                
                return mapUser(data.user, profile);
            }
        } catch (e: any) {
            if (e.message !== "Invalid login credentials") {
                 console.warn("Supabase Login failed, falling back to offline mode.");
            } else {
                throw e; 
            }
        }
      }

      const mockUser: UserProfile = {
          id: 'offline-user-' + email.replace(/[^a-zA-Z0-9]/g, ''),
          email: email,
          name: email.split('@')[0],
          plan: 'starter'
      };
      localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(mockUser));
      return mockUser;
    },

    async signup(name: string, email: string, password: string): Promise<UserProfile> {
      if (isSupabaseConfigured) {
         try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name } }
            });

            if (error) throw error;

            if (data.user) {
                await supabase.from('profiles').insert([
                    { id: data.user.id, name, email, plan: 'starter' }
                ]).catch(err => console.warn("Profile creation failed (check RLS/Tables):", err.message));

                return {
                    id: data.user.id,
                    email: data.user.email!,
                    name,
                    plan: 'starter'
                };
            }
         } catch (e) {
             console.warn("Signup failed, falling back to offline:", e);
         }
      }

      const mockUser: UserProfile = {
          id: 'offline-user-' + email.replace(/[^a-zA-Z0-9]/g, ''),
          email: email,
          name: name,
          plan: 'starter'
      };
      localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(mockUser));
      return mockUser;
    },

    async updatePlan(userId: string, plan: 'starter' | 'pro' | 'enterprise') {
      const fallback = () => {
          const user = getMockUser();
          if (user && user.id === userId) {
              user.plan = plan;
              localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(user));
              return user;
          }
          return null;
      };

      if (!isSupabaseConfigured || !isUUID(userId)) return fallback();

      try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ plan })
            .eq('id', userId)
            .select()
            .single();
            
          if (error) throw error;
          
          const { data: { user } } = await supabase.auth.getUser();
          return user ? mapUser(user, data) : null;
      } catch (e) {
          return fallback();
      }
    },

    async logout() {
      if (isSupabaseConfigured) {
          await supabase.auth.signOut().catch(() => {});
      }
      localStorage.removeItem(KEYS.USER_SESSION);
    }
  },

  plans: {
    async create(plan: SavedPlan) {
      const fallback = () => {
          const plans = JSON.parse(localStorage.getItem(KEYS.LOCAL_PLANS) || '[]');
          plans.push(plan);
          localStorage.setItem(KEYS.LOCAL_PLANS, JSON.stringify(plans));
      };

      if (!isSupabaseConfigured || !isUUID(plan.userId)) {
          return fallback();
      }

      try {
          const dbPlan = {
            id: plan.id,
            user_id: plan.userId,
            title: plan.title,
            style: plan.style,
            content: plan.content,
            form_data: plan.formData,
            created_at: new Date().toISOString()
          };
          
          const { error } = await supabase.from('plans').insert([dbPlan]);
          
          if (error) {
              return fallback();
          }
      } catch (e) {
          console.error("Critical error saving plan:", e);
          throw e; 
      }
    },

    async list(userId: string): Promise<SavedPlan[]> {
      const fallback = () => {
          const plans = JSON.parse(localStorage.getItem(KEYS.LOCAL_PLANS) || '[]');
          return plans
            .filter((p: any) => p.userId === userId)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      };

      if (!isSupabaseConfigured || !isUUID(userId)) return fallback();

      try {
          const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
          if (error) {
               return fallback();
          }

          if (!data) return [];

          return data.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            date: p.created_at,
            title: p.title,
            style: p.style,
            content: p.content,
            formData: p.form_data
          }));
      } catch (e) {
          return fallback();
      }
    },

    async delete(id: string) {
       const fallback = () => {
          let plans = JSON.parse(localStorage.getItem(KEYS.LOCAL_PLANS) || '[]');
          plans = plans.filter((p: any) => p.id !== id);
          localStorage.setItem(KEYS.LOCAL_PLANS, JSON.stringify(plans));
       };

       if (!isSupabaseConfigured) return fallback();

       try {
           const { error } = await supabase.from('plans').delete().eq('id', id);
           if (error) throw error;
       } catch (e) {
           fallback();
       }
    },

    async saveDraft(userId: string, data: any) {
      localStorage.setItem(`${KEYS.DRAFT}_${userId}`, JSON.stringify(data));
    },

    async getDraft(userId: string) {
      const data = localStorage.getItem(`${KEYS.DRAFT}_${userId}`);
      return data ? JSON.parse(data) : null;
    }
  },

  shares: {
    async create(id: string, content: string) {
       const fallback = () => {
          const shares = JSON.parse(localStorage.getItem(KEYS.LOCAL_SHARES) || '{}');
          shares[id] = content;
          localStorage.setItem(KEYS.LOCAL_SHARES, JSON.stringify(shares));
       };

       if (!isSupabaseConfigured) return fallback();

       try {
           const { error } = await supabase.from('shares').insert([{ id, content }]);
           if (error) return fallback();
       } catch (e) {
           fallback();
       }
    },

    async get(id: string): Promise<string | null> {
       const fallback = () => {
          const shares = JSON.parse(localStorage.getItem(KEYS.LOCAL_SHARES) || '{}');
          return shares[id] || null;
       };

       if (!isSupabaseConfigured) return fallback();

       try {
           const { data, error } = await supabase
            .from('shares')
            .select('content')
            .eq('id', id)
            .single();
           if (error) return fallback();
           return data?.content || null;
       } catch (e) {
           return fallback();
       }
    }
  },

  blogs: {
      getAll(): BlogPost[] {
          // Initialize/Seed database if empty
          let localPosts: BlogPost[] = JSON.parse(localStorage.getItem(KEYS.BLOG_POSTS) || '[]');
          
          if (localPosts.length === 0) {
              // Seed the initial state with "AI generated" posts in 2025
              localPosts = SEEDED_POSTS;
              localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(localPosts));
          }
          
          return localPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      getById(id: string | number): BlogPost | undefined {
          const all = this.getAll();
          // loose equality for string/number id mix
          return all.find(p => p.id == id);
      },

      add(post: BlogPost) {
          const localPosts = JSON.parse(localStorage.getItem(KEYS.BLOG_POSTS) || '[]');
          localPosts.unshift(post);
          // Keep only last 20 generated posts to avoid bloat
          if (localPosts.length > 20) {
              localPosts.length = 20;
          }
          localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(localPosts));
      },

      shouldGenerateNew(): boolean {
          const now = Date.now();
          const lastGen = localStorage.getItem(KEYS.LAST_BLOG_GEN);
          const lastReset = localStorage.getItem(KEYS.LAST_RESET_DATE);
          const currentDay = new Date().toDateString();

          // 1. Reset daily counter if it's a new day
          if (lastReset !== currentDay) {
              localStorage.setItem(KEYS.DAILY_BLOG_COUNT, '0');
              localStorage.setItem(KEYS.LAST_RESET_DATE, currentDay);
          }

          // 2. Check Daily Limit (Max 5 blogs per day)
          const dailyCount = parseInt(localStorage.getItem(KEYS.DAILY_BLOG_COUNT) || '0');
          if (dailyCount >= 5) {
              return false; 
          }

          // 3. Check Frequency (Every 2 hours)
          if (!lastGen) return true;
          
          const diff = now - parseInt(lastGen);
          const TWO_HOURS = 2 * 60 * 60 * 1000;
          
          return diff > TWO_HOURS;
      },

      recordGeneration() {
          const dailyCount = parseInt(localStorage.getItem(KEYS.DAILY_BLOG_COUNT) || '0');
          localStorage.setItem(KEYS.DAILY_BLOG_COUNT, (dailyCount + 1).toString());
          localStorage.setItem(KEYS.LAST_BLOG_GEN, Date.now().toString());
      }
  }
};
