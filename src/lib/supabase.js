const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

let clientPromise = null;

/**
 * `supabase-js` bitta misol yaratish **shart** — ikkinchisi
 * `Multiple GoTrueClient instances detected` degan ogohlantirish
 * chiqaradi va auth holatida noaniqlik keltiradi. Storefront
 * (`lib/supabase.js`) va admin (`lib/supabaseAdmin.js`) alohida
 * chunk'larda yashaydi, shuning uchun ulashish `globalThis` orqali
 * amalga oshiriladi.
 */
const singleton = () => {
  globalThis.__softShoesSupabase ??= null;
  return globalThis.__softShoesSupabase;
};

/**
 * Supabase clientini **bo'sh qatlaydi** (bo'sh paytda) yaratadi.
 *
 * Nega? `supabase-js` — bosh sahifaga umuman kerak bo'lmagan og'ir
 * paket. Avval u `main` chunk'ga tushib, mobil'da dastlabki
 * yuklanishni sekinlashtirardi. Endi u faqat ma'lumot haqiqatan
 * kerak bo'lganda (birinchi fetch yoki admin panel) yuklanadi.
 */
export const getSupabase = async () => {
  if (!isSupabaseConfigured) return null;
  const existing = singleton();
  if (existing) return existing;

  clientPromise ??= import("@supabase/supabase-js")
    .then(({ createClient }) => {
      /* Yuklash paytida admin panel (`lib/supabaseAdmin.js`) clientni
         oldindan yaratib bo'lgan bo'lishi mumkin — qayta yaratmaslik
         uchun yana bir bor tekshiramiz. */
      const already = singleton();
      if (already) return already;

      const client = createClient(supabaseUrl, supabasePublishableKey, {
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
