import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;
export const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)
  }
  return supabase;
}