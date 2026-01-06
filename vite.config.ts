
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');

  // Priorities for loading variables:
  // 1. process.env.KEY (System/Vercel)
  // 2. env.KEY (Local .env file via loadEnv)
  // 3. process.env.NON_PREFIXED_KEY (System/Vercel)
  // 4. env.NON_PREFIXED_KEY (Local .env file)

  const apiKey = process.env.API_KEY || env.API_KEY || '';

  // Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Paystack: Check for VITE_ prefix first, then fallback to non-prefixed
  const paystackPublicKey = 
      process.env.VITE_PAYSTACK_PUBLIC_KEY || env.VITE_PAYSTACK_PUBLIC_KEY || 
      process.env.PAYSTACK_PUBLIC_KEY || env.PAYSTACK_PUBLIC_KEY || 
      '';
      
  const paystackPlanPro = 
      process.env.VITE_PAYSTACK_PLAN_PRO || env.VITE_PAYSTACK_PLAN_PRO || 
      process.env.PAYSTACK_PLAN_PRO || env.PAYSTACK_PLAN_PRO || 
      '';

  return {
    plugins: [react()],
    define: {
      // Expose API keys to the client-side code via process.env replacement
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
      // Expose Paystack keys with both prefixed and non-prefixed names for compatibility
      'process.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify(paystackPublicKey),
      'process.env.PAYSTACK_PUBLIC_KEY': JSON.stringify(paystackPublicKey),
      'process.env.VITE_PAYSTACK_PLAN_PRO': JSON.stringify(paystackPlanPro),
      'process.env.PAYSTACK_PLAN_PRO': JSON.stringify(paystackPlanPro),
    },
  };
});