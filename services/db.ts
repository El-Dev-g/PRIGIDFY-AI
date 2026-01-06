
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserProfile, SavedPlan, PlanType } from '../types';

const KEYS = {
  DRAFT: 'jhaidify_draft',
  USER_SESSION: 'jhaidify_session',
  LOCAL_PLANS: 'jhaidify_local_plans',
  LOCAL_SHARES: 'jhaidify_local_shares'
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
        if (!session?.user) return null;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        if (profileError) {
             // If table missing, we return basic user info so app doesn't crash
             console.warn("Profile fetch failed:", profileError.message);
             return mapUser(session.user, { name: session.user.user_metadata?.name });
        }

        return mapUser(session.user, profile);
      } catch (e) {
        return getMockUser();
      }
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
            // Only fallback to mock if connection error, not invalid auth
            if (e.message !== "Invalid login credentials") {
                 console.warn("Supabase Login failed, falling back to offline mode.");
            } else {
                throw e; 
            }
        }
      }

      // Offline Mock Fallback
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
          console.log("Saving plan to local storage (Offline)");
          const plans = JSON.parse(localStorage.getItem(KEYS.LOCAL_PLANS) || '[]');
          plans.push(plan);
          localStorage.setItem(KEYS.LOCAL_PLANS, JSON.stringify(plans));
      };

      // If offline user or config missing, use fallback without error
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
              console.error("Supabase Plan Insert Failed:", error);
              // Check for table missing
              if (error.code === '42P01') { 
                  alert("Error: Database tables missing. Please run the setup SQL.");
                  return fallback();
              }
              // Check for RLS policy violation
              if (error.code === '42501') {
                   alert("Error: Permission denied. Please check RLS policies.");
                   return fallback();
              }
              throw error;
          }
      } catch (e) {
          console.error("Critical error saving plan:", e);
          // We intentionally throw here so the UI knows something went wrong if we expected it to work
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
               console.warn("Fetch plans error:", error.message);
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
  }
};
