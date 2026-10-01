import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/**
 * **Faqat admin panel** uchun sinxron client.
 *
 * `supabase-js` qimmat paket, shuning uchun storefront sahifalarida
 * bo'sh qatlaydi yuklanadi (lib/supabase.js). Bu modul esa faqat
 * `AdminPage` import qiladi, u esa route-level `lazy()` bilan
 * alohida chunk'ga tushadi — ya'ni mijoz sayfasi bu paketni
 * hech qachon yuklamaydi.
 *
 * `globalThis` orqali storefront clienti bilan bitta mislondan
 * foydalaniladi (ikkinchi GoTrueClient ogohlantirishini oldini oladi).
 */
export const supabase = isSupabaseConfigured
  ? (globalThis.__softShoesSupabase ??=
      createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }))
  : null;
