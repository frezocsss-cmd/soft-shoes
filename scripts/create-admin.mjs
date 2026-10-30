import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(import.meta.dirname, "..");

const readEnvFile = (name) => {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) return {};

  const values = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
};

const fileEnv = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
  ...readEnvFile(".env.admin"),
};
const env = { ...fileEnv, ...process.env };

const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const email = (env.ADMIN_EMAIL || env.VITE_ADMIN_LOGIN_EMAIL || "munira@softshoes.uz").trim();
const password = env.ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !password) {
  console.error(
    [
      "Admin yaratish uchun quyidagilar kerak:",
      "  SUPABASE_URL yoki VITE_SUPABASE_URL",
      "  SUPABASE_SERVICE_ROLE_KEY  (faqat lokal .env.local yoki .env.admin ichida)",
      "  ADMIN_PASSWORD             (parol; repoga yozilmaydi)",
      "",
      "Misol (PowerShell):",
      '  $env:ADMIN_PASSWORD="parolingiz"; npm run create-admin',
      "",
      "Service role kalitni hech qachon VITE_ prefiksi bilan yoki Vercel frontendga qo‘ymang.",
    ].join("\n"),
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const findUserByEmail = async (targetEmail) => {
  const perPage = 1000;
  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const match = users.find((user) => user.email?.toLowerCase() === targetEmail);
    if (match) return match;
    if (users.length < perPage) return null;
  }
};

try {
  const existing = await findUserByEmail(email.toLowerCase());
  let userId;

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Auth foydalanuvchi yangilandi: ${email}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Auth foydalanuvchi yaratildi: ${email}`);
  }

  const { error: membershipError } = await admin
    .from("store_admins")
    .upsert({ email }, { onConflict: "email" });
  if (membershipError) throw membershipError;

  console.log(`store_admins ga qo‘shildi: ${email}`);
  console.log(`Tayyor. Admin panelda "${env.VITE_ADMIN_LOGIN_USERNAME || "munira"}" bilan kiring.`);
  console.log(`User ID: ${userId}`);
} catch (error) {
  console.error(`Xato: ${error.message}`);
  process.exit(1);
}
