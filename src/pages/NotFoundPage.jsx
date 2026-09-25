import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-semibold text-gold sm:text-8xl">{t.notFound.code}</p>
      <h1 className="mt-5 font-display text-4xl font-semibold text-ink">{t.notFound.title}</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">{t.notFound.text}</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-olive"><ArrowLeft size={16} /> {t.common.backHome}</Link>
    </section>
  );
}
