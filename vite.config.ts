
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');

  // Priorities:
  // 1. process.env (Vercel System Env / CI)
  // 2. env object (Loaded from .env files by Vite)
  // Default to empty string to prevent build errors or undefined replacements

  const apiKey = process.env.API_KEY || env.API_KEY || '';

  const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const paystackPublicKey = process.env.VITE_PAYSTACK_PUBLIC_KEY || env.VITE_PAYSTACK_PUBLIC_KEY || '';
  const paystackPlanPro = process.env.VITE_PAYSTACK_PLAN_PRO || env.VITE_PAYSTACK_PLAN_PRO || '';

  return {
    plugins: [react()],
    define: {
      // Expose API keys to the client-side code via process.env polyfill
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
      'process.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify(paystackPublicKey),
      'process.env.VITE_PAYSTACK_PLAN_PRO': JSON.stringify(paystackPlanPro),
    },
  };
});