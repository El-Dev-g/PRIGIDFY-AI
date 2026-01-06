
import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.VITE_SUPABASE_URL;
const envKey = process.env.VITE_SUPABASE_ANON_KEY;

// Robust check for valid configuration
export const isSupabaseConfigured = 
  !!envUrl && 
  !!envKey && 
  envUrl !== 'undefined' && 
  envKey !== 'undefined' &&
  envUrl.startsWith('http');

if (!isSupabaseConfigured) {
  console.warn("Supabase Config Missing. App defaulting to Offline Mode.");
  console.log("Debug URL:", envUrl);
}

const url = isSupabaseConfigured ? envUrl : 'https://placeholder.supabase.co';
const key = isSupabaseConfigured ? envKey : 'placeholder';

export const supabase = createClient(url, key);
