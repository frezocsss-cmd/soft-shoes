import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Loader2, LockKeyhole } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/10";

const readLinkError = () => {
  if (typeof window === "undefined") return "";
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const search = new URLSearchParams(window.location.search);
  const description = hash.get("error_description") || search.get("error_description");
  if (!description) return "";
  return "Tiklash havolasi yaroqsiz yoki muddati tugagan. Iltimos, qaytadan havola so'rang.";
};

const formatResetError = (resetError) => {
  const message = String(resetError?.message || "").trim();
  if (!message) return "Parolni yangilab bo'lmadi. Qayta urinib ko'ring.";
  if (/expired|invalid|token/i.test(message)) {
    return "Tiklash havolasi yaroqsiz yoki muddati tugagan. Iltimos, qaytadan havola so'rang.";
  }
  if (/security purposes|too many|rate limit/i.test(message)) {
    return "Juda ko'p urinish. Iltimos, bir necha daqiqadan so'ng qayta urinib ko'ring.";
  }
  return message;
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { session, loading, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [linkError] = useState(readLinkError);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Yangi parol kamida 6 belgidan iborat bo'lishi kerak.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kiritilgan parollar bir xil emas.");
      return;
    }

    setBusy(true);
    try {
      await updatePassword(password);
      await signOut();
      navigate("/admin", { replace: true, state: { passwordReset: true } });
    } catch (updateError) {
      setError(formatResetError(updateError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-12 text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <BrandLogo inverted />
        <span className="mt-10 grid size-14 place-items-center rounded-2xl bg-gold/15 text-gold-soft">
          <LockKeyhole size={24} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold">Yangi parol o'rnatish</h1>
        <p className="mt-3 text-sm leading-7 text-white/55">
          Hisobingiz uchun yangi parol kiriting. Kamida 6 belgidan foydalaning.
        </p>

        {loading ? (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-white/70">
            <Loader2 size={15} className="animate-spin" /> Tiklash sessiyasi tekshirilmoqda...
          </div>
        ) : linkError ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {linkError}
          </div>
        ) : !session ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
            Tiklash sessiyasi topilmadi. Iltimos, emailingizga yuborilgan havolani qaytadan oching yoki
            admin panelda parolni tiklashni qayta so'rang.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            <label className="block text-xs font-bold text-white/60">
              Yangi parol
              <div className="relative mt-2">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </label>

            <label className="block text-xs font-bold text-white/60">
              Yangi parolni tasdiqlang
              <div className="relative mt-2">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-extrabold text-ink transition hover:bg-white/90 disabled:opacity-50"
            >
              {busy ? "Saqlanmoqda..." : "Yangi parolni saqlash"}
            </button>
          </form>
        )}

        <Link
          to="/admin"
          className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-white/50 transition hover:text-white"
        >
          Admin panelga qaytish
        </Link>
      </div>
    </div>
  );
}
