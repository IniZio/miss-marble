import { createClient } from '@supabase/supabase-js';
import getConfig from 'next/config';

let supabase: ReturnType<typeof createClient>;
export const getSupabase = () => {
  if (!supabase) {
    const { publicRuntimeConfig } = getConfig()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    supabase = createClient(publicRuntimeConfig.SUPABASE_URL!, publicRuntimeConfig.SUPABASE_ANON_KEY!)
  }
  return supabase;
}