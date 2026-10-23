import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, KeyRound, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../BrandLogo";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/10";

export default function AdminLogin() {
  const { signIn, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setLocalError("");
    clearError();
    try {
      await signIn(email.trim(), password);
    } catch (signInError) {
      setLocalError(signInError.message || "Kirishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  };

  const message = localError || error;

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <BrandLogo inverted />
        <div className="max-w-lg">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-gold-soft">
            Soft Shoes Store Manager
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
            Mahsulotlar, buyurtmalar va do'kon holati — bitta joyda.
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/50">
            Supabase autentifikatsiyasi va Row Level Security bilan himoyalangan boshqaruv paneli.
          </p>
        </div>
        <p className="text-xs text-white/30">Faqat ruxsat berilgan administratorlar uchun</p>
      </div>

      <div className="grid place-items-center px-4 py-12 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-[2rem] border border-line bg-white p-7 shadow-xl sm:p-10"
        >
          <div className="lg:hidden">
            <BrandLogo />
          </div>
          <span className="mt-9 grid size-12 place-items-center rounded-2xl bg-ink text-gold-soft lg:mt-0">
            <LockKeyhole size={21} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold text-ink">Admin panelga kirish</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Faqat <code className="rounded bg-canvas px-1 py-0.5 text-[11px]">store_admins</code>{" "}
            jadvalida ro'yxatdan o'tgan email kirish huquqiga ega.
          </p>

          {message ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {message}
            </div>
          ) : null}

          <label className="mt-6 block text-xs font-bold text-muted">
            Email
            <div className="relative mt-2">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="owner@example.com"
              />
            </div>
          </label>

          <label className="mt-4 block text-xs font-bold text-muted">
            Parol
            <div className="relative mt-2">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={busy || loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-extrabold text-white transition hover:bg-ink-soft disabled:opacity-50"
          >
            {busy || loading ? "Kiritilmoqda..." : "Admin panelga kirish"}
          </button>

          <Link
            to="/"
            className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-muted transition hover:text-ink"
          >
            <ExternalLink size={14} aria-hidden="true" />
            Saytga qaytish
          </Link>
        </form>
      </div>
    </div>
  );
}
