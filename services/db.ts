
import type { UserProfile, SavedPlan } from '../types';

const KEYS = {
  USERS: 'jhaidify_users',
  SESSION: 'jhaidify_session',
  PLANS: 'jhaidify_plans',
  DRAFT: 'jhaidify_draft',
  SHARES: 'jhaidify_shares_'
};

// Simulate async database delay for realistic feel
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export const db = {
  auth: {
    async getSession(): Promise<UserProfile | null> {
      // Fast read for session
      const stored = localStorage.getItem(KEYS.SESSION);
      return stored ? JSON.parse(stored) : null;
    },
    async login(email: string): Promise<UserProfile> {
      await wait(800);
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      let user = users.find((u: UserProfile) => u.email === email);
      
      // For demo purposes, we auto-register if user not found, 
      // effectively combining login/signup for ease of use in prototype
      if (!user) {
         const newUser: UserProfile = {
             id: crypto.randomUUID(),
             name: email.split('@')[0], // Default name from email
             email,
             plan: 'starter'
         };
         users.push(newUser);
         localStorage.setItem(KEYS.USERS, JSON.stringify(users));
         user = newUser;
      }
      
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
      return user;
    },
    async signup(name: string, email: string): Promise<UserProfile> {
      await wait(800);
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      if (users.find((u: UserProfile) => u.email === email)) {
        throw new Error("User already exists");
      }
      
      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        name,
        email,
        plan: 'starter'
      };
      
      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(KEYS.SESSION, JSON.stringify(newUser));
      return newUser;
    },
    async updatePlan(userId: string, plan: 'starter' | 'pro' | 'enterprise') {
        await wait(500);
        const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
        const updatedUsers = users.map((u: UserProfile) => 
            u.id === userId ? { ...u, plan } : u
        );
        localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
        
        // Update session if it's current user
        const session = JSON.parse(localStorage.getItem(KEYS.SESSION) || '{}');
        if (session.id === userId) {
            session.plan = plan;
            localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
            return { ...session, plan };
        }
        return null;
    },
    async logout() {
      localStorage.removeItem(KEYS.SESSION);
    }
  },
  plans: {
    async create(plan: SavedPlan) {
        await wait(600);
        const plans = JSON.parse(localStorage.getItem(KEYS.PLANS) || '[]');
        plans.push(plan);
        try {
            localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
        } catch (e) {
            // Handle quota exceeded by removing old plans (FIFO)
            if (plans.length > 5) {
                const trimmed = plans.slice(-5);
                localStorage.setItem(KEYS.PLANS, JSON.stringify(trimmed));
            } else {
                throw e;
            }
        }
    },
    async list(userId: string): Promise<SavedPlan[]> {
        await wait(400);
        const plans = JSON.parse(localStorage.getItem(KEYS.PLANS) || '[]');
        // Filter by user ID
        return plans.filter((p: SavedPlan) => p.userId === userId).reverse();
    },
    async delete(id: string) {
        await wait(300);
        const plans = JSON.parse(localStorage.getItem(KEYS.PLANS) || '[]');
        const newPlans = plans.filter((p: SavedPlan) => p.id !== id);
        localStorage.setItem(KEYS.PLANS, JSON.stringify(newPlans));
    },
    // Drafts are local only (per browser), usually not synced in simple apps
    // but we can simulate cloud sync by keying it to user
    async saveDraft(userId: string, data: any) {
        // No wait for drafts to keep UI snappy
        localStorage.setItem(KEYS.DRAFT + '_' + userId, JSON.stringify(data));
    },
    async getDraft(userId: string) {
        const data = localStorage.getItem(KEYS.DRAFT + '_' + userId);
        return data ? JSON.parse(data) : null;
    }
  },
  shares: {
      async create(id: string, content: string) {
          await wait(500);
          localStorage.setItem(KEYS.SHARES + id, content);
      },
      async get(id: string): Promise<string | null> {
          await wait(300);
          return localStorage.getItem(KEYS.SHARES + id);
      }
  }
}
