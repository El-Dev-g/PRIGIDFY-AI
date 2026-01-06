
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserProfile, SavedPlan, PlanType, Testimonial } from '../types';

const KEYS = {
  DRAFT: 'jhaidify_draft',
  USER_SESSION: 'jhaidify_session',
  LOCAL_PLANS: 'jhaidify_local_plans',
  LOCAL_SHARES: 'jhaidify_local_shares',
  BLOG_POSTS: 'jhaidify_blog_posts_2026',
  LAST_BLOG_GEN: 'jhaidify_last_blog_gen',
  DAILY_BLOG_COUNT: 'jhaidify_daily_blog_count',
  LAST_RESET_DATE: 'jhaidify_last_reset_date',
  TESTIMONIALS: 'jhaidify_testimonials'
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
    date: 'Mar 16, 2026',
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
    date: 'Mar 10, 2026',
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
    date: 'Feb 28, 2026',
    category: 'Pitching',
    author: 'PRIGIDFY',
    isAi: true,
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    content: `<p>Your executive summary is the most important part of your business plan. It's the hook.</p><p>Instead of starting with dry statistics, start with a character—your target customer—and the conflict they face. Show how your solution resolves this conflict and creates a better future.</p>`
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    content: "JHAIDIFY AI helped me secure my first round of funding. The structured approach and AI suggestions turned my scattered notes into a professional document.",
    author: "Alex Rivera",
    role: "Founder, TechFlow",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    approved: true,
    date: '2025-01-15'
  },
  {
    id: 't2',
    content: "I was dreaded writing a business plan, but this tool made it actually enjoyable. The financial projection breakdown was incredibly helpful.",
    author: "Sarah Jenkins",
    role: "Owner, GreenLeaf Cafe",
    image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    approved: true,
    date: '2025-02-10'
  },
  {
    id: 't3',
    content: "As a solopreneur, I didn't have the budget for a consultant. JHAIDIFY AI acted as my co-founder, filling in the gaps in my strategy.",
    author: "Marcus Chen",
    role: "Freelance Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    approved: true,
    date: '2025-03-05'
  }
];

export const db = {
  auth: {
    async getSession(): Promise<UserProfile | null> {
      if (!isSupabaseConfigured) return getMockUser();

      try {
        // Add a timeout race condition to prevent indefinite hanging
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
        
        const sessionPromise = supabase.auth.getSession();
        const result: any = await Promise.race([sessionPromise, timeout]);
        
        const { data: { session }, error: sessionError } = result;
        
        if (sessionError) {
             console.warn("Session check failed, using mock if available:", sessionError.message);
             return getMockUser();
        }
        
        if (!session?.user) {
            const mock = getMockUser();
            return mock; 
        }

        // Try to get profile, but don't block if it fails/timeouts
        let profile = { name: session.user.user_metadata?.name };
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            if (!error && data) profile = data;
        } catch (err) {
            console.warn("Profile fetch error", err);
        }

        return mapUser(session.user, profile);
      } catch (e) {
        console.warn("Auth initialization failed or timed out, using offline mode.");
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
            console.warn("Supabase Login failed, falling back to offline mode for demo purposes.", e.message);
            // We allow fallback even on error for this demo application to ensure usability
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
    
    async updateProfile(userId: string, updates: { name?: string }) {
      if (isSupabaseConfigured) {
         try {
             // 1. Update Profile Table
             const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId);
                
             if (error) throw error;

             // 2. Update Auth Metadata (so getUser returns correct metadata)
             if (updates.name) {
                 await supabase.auth.updateUser({
                     data: { name: updates.name }
                 });
             }

             // 3. Return updated user object
             const { data: { user } } = await supabase.auth.getUser();
             
             // Re-fetch profile to ensure consistency
             const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
                
             return user ? mapUser(user, profile) : null;
         } catch(e) {
             console.error("Update profile failed", e);
             throw e;
         }
      }

      // Offline Fallback
      const user = getMockUser();
      if (user) {
          if (updates.name) user.name = updates.name;
          localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(user));
          return user;
      }
      return null;
    },

    async updatePassword(email: string, currentPassword: string, newPassword: string) {
      if (isSupabaseConfigured) {
        // 1. Verify current password by re-authenticating
        // This ensures the person trying to change the password actually knows it.
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: currentPassword
        });

        if (signInError) throw new Error("Current password is incorrect.");

        // 2. Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (updateError) throw updateError;
        return true;
      }
      
      // Offline mode simulation
      return true;
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
          fallback(); // Fallback on error
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
              // Seed the initial state with "AI generated" posts in 2026
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
  },

  testimonials: {
    async getAll(): Promise<Testimonial[]> {
      let remoteTests: Testimonial[] = [];
      
      if (isSupabaseConfigured) {
          try {
              const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('approved', true)
                .order('created_at', { ascending: false });
                
              if (!error && data) {
                  remoteTests = data.map((t: any) => ({
                      id: t.id,
                      author: t.author,
                      role: t.role,
                      content: t.content,
                      image: t.image,
                      approved: t.approved,
                      date: t.created_at || t.date
                  }));
              }
          } catch (e) {
              console.warn("Error fetching testimonials from DB", e);
          }
      }

      // Get local
      const stored = localStorage.getItem(KEYS.TESTIMONIALS);
      const localTests: Testimonial[] = stored ? JSON.parse(stored) : [];
      
      // Combine: Remote + Local + Default
      const all = [...remoteTests, ...localTests, ...DEFAULT_TESTIMONIALS];
      
      // Filter unique by ID (Map preserves insertion order of last set, but we want arrays)
      // We use a Map keyed by ID to ensure uniqueness
      const uniqueMap = new Map();
      all.forEach(item => {
          if (!uniqueMap.has(item.id)) {
              uniqueMap.set(item.id, item);
          }
      });
      
      return Array.from(uniqueMap.values()).filter(t => t.approved);
    },

    async submit(data: { name: string; role: string; content: string; approved: boolean }) {
        const newTestimonial: Testimonial = {
            id: `t-${Date.now()}`,
            author: data.name,
            role: data.role,
            content: data.content,
            approved: data.approved,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff`,
            date: new Date().toISOString()
        };

        // Always save to Local Storage as Backup/Immediate View
        const stored = localStorage.getItem(KEYS.TESTIMONIALS);
        const localTests: Testimonial[] = stored ? JSON.parse(stored) : [];
        localTests.unshift(newTestimonial);
        localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(localTests));

        if (isSupabaseConfigured) {
            try {
                // Actually insert into DB
                // Ensure you have a 'testimonials' table in Supabase
                await supabase.from('testimonials').insert([{
                    author: data.name,
                    role: data.role,
                    content: data.content,
                    approved: data.approved,
                    image: newTestimonial.image,
                    created_at: newTestimonial.date
                }]);
            } catch (e) {
                console.error("DB Insert failed", e);
            }
        }
    }
  }
};
