import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Standard client for browser-side interactions
// Safe initialization for build-time static analysis
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

/**
 * Returns a Supabase client initialized with the Service Role Key.
 * This client bypasses RLS and should ONLY be used in server-side environments (API routes, Server Actions).
 * NEVER expose the Service Role Key to the client.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // If credentials are missing, we log a warning and return a client that will fail on use
    // to prevent build-time crashes if env vars are not yet in the environment.
    console.warn('[SUPABASE] Admin credentials missing. Operations will fail.');
    return createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseServiceRoleKey || 'placeholder-key'
    );
  }


  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

