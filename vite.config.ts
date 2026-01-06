
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');

  // PRIORITIZE PROVIDED KEYS
  const DEFAULT_URL = "https://pzrzixieohomaqcjlhos.supabase.co";
  const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cnppeGllb2hvbWFxY2psaG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjM2NzIsImV4cCI6MjA4MzIzOTY3Mn0.Foja2FVB7VdcH5FnZQq6BWvLPubbPepbXq_MQlAka_A";

  const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;
  
  // API Key for Gemini
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Expose API keys to the client-side code
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
    },
  };
});
