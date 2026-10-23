const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

let clientPromise = null;

/**
 * One shared client instance avoids `Multiple GoTrueClient instances`
 * warnings when both the storefront and admin chunks are loaded.
 */
const singleton = () => {
  globalThis.__softShoesSupabase ??= null;
  return globalThis.__softShoesSupabase;
};

export const getSupabase = async () => {
  if (!isSupabaseConfigured) return null;
  const existing = singleton();
  if (existing) return existing;

  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) => {
    const already = singleton();
    if (already) return already;

    const client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    globalThis.__softShoesSupabase = client;
    return client;
  });

  return clientPromise;
};
