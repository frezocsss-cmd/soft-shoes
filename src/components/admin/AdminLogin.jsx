import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, KeyRound, LockKeyhole, Mail, UserRound } from "lucide-react";
import { ADMIN_LOGIN_USERNAME } from "../../data/config";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../BrandLogo";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/10";

const formatAuthError = (authError, fallback) => {
  const message = String(authError?.message || "").trim();
  if (!message) return fallback;
  if (/invalid login credentials/i.test(message)) return "Login yoki parol noto'g'ri.";
  if (/email not confirmed/i.test(message)) return "Email tasdiqlanmagan. Avval emailingizni tasdiqlang.";
  if (/security purposes|too many|rate limit/i.test(message)) {
    return "Juda ko'p urinish. Iltimos, bir necha daqiqadan so'ng qayta urinib ko'ring.";
  }
  return message;
};

export default function AdminLogin() {
  const location = useLocation();
  const { signIn, requestPasswordReset, error, clearError, loading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetNotice, setResetNotice] = useState("");

  const openReset = () => {
    setResetMode(true);
    setResetEmail(identifier.includes("@") ? identifier.trim() : "");
    setLocalError("");
    setResetError("");
    setResetNotice("");
    clearError();
  };

  const backToLogin = () => {
    setResetMode(false);
    setResetError("");
    setResetNotice("");
    setLocalError("");
    clearError();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (resetMode) {
      setResetBusy(true);
      setResetError("");
      setResetNotice("");
      try {
        await requestPasswordReset(resetEmail.trim());
        setResetNotice(
          "Parolni tiklash havolasi yuborildi. Emailingizni, jumladan spam papkasini ham tekshiring.",
        );
      } catch (resetRequestError) {
        setResetError(formatAuthError(resetRequestError, "Tiklash havolasini yuborib bo'lmadi."));
      } finally {
        setResetBusy(false);
      }
      return;
    }

    setBusy(true);
    setLocalError("");
    clearError();
    try {
      await signIn(identifier.trim(), password);
    } catch (signInError) {
      setLocalError(formatAuthError(signInError, "Kirishda xatolik yuz berdi"));
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
          <h1 className="mt-6 text-2xl font-extrabold text-ink">
            {resetMode ? "Parolni tiklash" : "Admin panelga kirish"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            {resetMode ? (
              "Email manzilingizni kiriting — parolni tiklash havolasi yuboriladi. Havola bir marta ishlaydi va tezda amal qiladi."
            ) : (
              <>
                <code className="rounded bg-canvas px-1 py-0.5 text-[11px]">munira</code> logini yoki{" "}
                <code className="rounded bg-canvas px-1 py-0.5 text-[11px]">store_admins</code> jadvalidagi email bilan kiring.
              </>
            )}
          </p>

          {location.state?.passwordReset ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
              Parol muvaffaqiyatli yangilandi. Yangi parol bilan kiring.
            </div>
          ) : null}

          {resetMode && resetNotice ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
              {resetNotice}
            </div>
          ) : null}

          {resetMode && (resetError || error) ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {resetError || formatAuthError({ message: error }, "Tiklash havolasini yuborib bo'lmadi.")}
            </div>
          ) : null}

          {!resetMode && message ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {message}
            </div>
          ) : null}

          {resetMode ? (
            <label className="mt-6 block text-xs font-bold text-muted">
              Email manzil
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="ravshanbekovrasul11@gmail.com"
                />
              </div>
            </label>
          ) : (
            <>
              <label className="mt-6 block text-xs font-bold text-muted">
                Login yoki email
                <div className="relative mt-2">
                  <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    required
                    autoComplete="username"
                    className={inputClass}
                    placeholder={ADMIN_LOGIN_USERNAME}
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
                type="button"
                onClick={openReset}
                className="mt-2 ml-auto block text-xs font-bold text-gold transition hover:text-gold-deep"
              >
                Parolni unutdingizmi?
              </button>
            </>
          )}

          <button
            type="submit"
            disabled={resetMode ? resetBusy : busy || loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-extrabold text-white transition hover:bg-ink-soft disabled:opacity-50"
          >
            {resetMode
              ? resetBusy
                ? "Yuborilmoqda..."
                : "Tiklash havolasini yuborish"
              : busy || loading
                ? "Kiritilmoqda..."
                : "Admin panelga kirish"}
          </button>

          {resetMode ? (
            <button
              type="button"
              onClick={backToLogin}
              className="mt-3 flex w-full items-center justify-center text-xs font-bold text-muted transition hover:text-ink"
            >
              Kirishga qaytish
            </button>
          ) : null}

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
