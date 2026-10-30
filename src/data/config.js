export const TELEGRAM_LINK = "https://t.me/soft_shoes_uz";
export const TELEGRAM_ADMIN_USERNAME =
  (import.meta.env.VITE_TELEGRAM_ADMIN_USERNAME || "Muniradmsh").replace(/^@/, "").trim();

export const TELEGRAM_ADMIN_LINK = `https://t.me/${TELEGRAM_ADMIN_USERNAME}`;

/**
 * Admin panelga login (username yoki email) bilan kirish uchun.
 * Supabase Auth email talab qiladi, shuning uchun `munira` kabi username
 * `VITE_ADMIN_LOGIN_EMAIL` manziliga aylantiriladi. Parol hech qachon
 * frontendga yozilmaydi — u Supabase Auth'da saqlanadi.
 */
export const ADMIN_LOGIN_USERNAME =
  (import.meta.env.VITE_ADMIN_LOGIN_USERNAME || "munira").replace(/^@/, "").trim();
export const ADMIN_LOGIN_EMAIL =
  (import.meta.env.VITE_ADMIN_LOGIN_EMAIL || "munira@softshoes.uz").trim();

export const resolveAdminLoginEmail = (identifier) => {
  const value = String(identifier ?? "").trim();
  if (!value) return value;
  if (value.includes("@")) return value;
  if (value.toLowerCase() === ADMIN_LOGIN_USERNAME.toLowerCase()) return ADMIN_LOGIN_EMAIL;
  return value;
};
export const PHONE_NUMBER = "+998977393912";
export const PHONE_HREF = `tel:${PHONE_NUMBER}`;
export const STORE_ADDRESS = "Toshkent, Mirobod tumani, Nukus ko'chasi, 3-uy";
export const MAPS_LAT = 41.283114;
export const MAPS_LNG = 69.222573;
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_LAT},${MAPS_LNG}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_LAT},${MAPS_LNG}&z=16&output=embed`;
