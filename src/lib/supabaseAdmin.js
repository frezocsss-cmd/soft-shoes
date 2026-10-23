import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * Synchronous client for the lazy-loaded admin chunk only. It shares the
 * same global instance as the storefront client to avoid duplicate GoTrue
 * clients.
 */
export const supabase = isSupabaseConfigured
  ? (globalThis.__softShoesSupabase ??=
      createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }))
  : null;
