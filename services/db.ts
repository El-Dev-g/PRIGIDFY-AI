
import { supabase } from './supabaseClient';
import type { UserProfile, SavedPlan, PlanType } from '../types';

const KEYS = {
  DRAFT: 'jhaidify_draft'
};

// Helper to map Supabase session/profile to UserProfile
const mapUser = (sessionUser: any, profile: any): UserProfile => ({
  id: sessionUser.id,
  email: sessionUser.email!,
  name: profile?.name || sessionUser.email?.split('@')[0] || 'User',
  plan: (profile?.plan as PlanType) || 'starter'
});

export const db = {
  auth: {
    async getSession(): Promise<UserProfile | null> {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return null;

      // Fetch profile data (plan, name)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return mapUser(session.user, profile);
    },

    async login(email: string): Promise<UserProfile> {
      // For this demo, we assume the user provides a password in a real form.
      // Since the existing UI only asks for email in the first step or simplistic login,
      // we will default to a standard password for the demo if you haven't built a password input yet,
      // OR we assume the UI passes the password. 
      // *Correction*: The LoginPage.tsx HAS a password field. We will use it.
      
      // Note: The UI calls this with just (email). We need to update LoginPage to pass password, 
      // but to keep interface compatible without changing every component immediately:
      // We will assume the UI has been updated or we throw an error if this was a real production app.
      // However, to make the existing 'LoginPage' work which passes (email) but gathers (password) internally...
      // Wait, the LoginPage component gathers password but `db.auth.login` signature in `App.tsx` and `LoginPage.tsx` 
      // needs to align.
      // The previous mock `login` only took email. We need to update the signature in `LoginPage` to pass both.
      // For now, to adhere to strict "changes" request, I will modify this file to accept (email, password).
      // If the UI calls it with one argument, this will fail. 
      // *Actually*, I will rely on the user updating the UI to pass the password, 
      // or strictly for this file, I will allow the interface change.
      
      // Since I can't change `LoginPage` signature in this file block, I will assume the prompt implies
      // I can change the signature here and I should provide the UI update if needed.
      // But looking at `LoginPage.tsx` provided in context:
      // `const handleSubmit ... await onLogin(email);` 
      // It ignores password! I need to update LoginPage.tsx as well.
      
      throw new Error("Please update Login Page to pass password"); 
    },

    // Extended login function to be compatible with updated UI
    async signInWithPassword(email: string, password: string): Promise<UserProfile> {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user found");

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return mapUser(data.user, profile);
    },

    async signup(name: string, email: string, password: string): Promise<UserProfile> {
      // 1. Sign up auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name } // Store metadata
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      // 2. Create profile entry (if not handled by Postgres Triggers)
      // We do it client side here for simplicity of setup, but Triggers are better.
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: data.user.id, name, email, plan: 'starter' }
        ]);

      // If profile creation fails (e.g. trigger already made it), ignore duplicate error
      if (profileError && profileError.code !== '23505') { 
         console.error("Profile creation error", profileError);
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        name,
        plan: 'starter'
      };
    },

    async updatePlan(userId: string, plan: 'starter' | 'pro' | 'enterprise') {
      const { data, error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      
      // Return updated user object structure
      const { data: { user } } = await supabase.auth.getUser();
      return user ? mapUser(user, data) : null;
    },

    async logout() {
      await supabase.auth.signOut();
      localStorage.removeItem(KEYS.DRAFT); // Optional: clear draft on logout
    }
  },

  plans: {
    async create(plan: SavedPlan) {
      // Transform frontend model to DB model
      const dbPlan = {
        user_id: plan.userId,
        title: plan.title,
        style: plan.style,
        content: plan.content,
        form_data: plan.formData, // Supabase handles JSONB
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('plans')
        .insert([dbPlan]);

      if (error) throw error;
    },

    async list(userId: string): Promise<SavedPlan[]> {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        date: p.created_at,
        title: p.title,
        style: p.style,
        content: p.content,
        formData: p.form_data
      }));
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Keep drafts in LocalStorage for performance/offline capability
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
      const { error } = await supabase
        .from('shares')
        .insert([{ id, content }]); // Ensure your table allows manual ID insertion or use UUID
      
      if (error) throw error;
    },

    async get(id: string): Promise<string | null> {
      const { data, error } = await supabase
        .from('shares')
        .select('content')
        .eq('id', id)
        .single();

      if (error) return null;
      return data?.content || null;
    }
  }
};
