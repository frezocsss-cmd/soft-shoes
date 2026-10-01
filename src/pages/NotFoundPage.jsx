import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

export default function NotFoundPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;

  return (
    <section className="bg-white">
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-7xl font-extrabold tracking-tight text-line">{t.notFound.code}</p>
        <h1 className="h-section mt-5">{t.notFound.title}</h1>
        <p className="lede mt-3 max-w-md">{t.notFound.text}</p>
        <Link to="/" className="btn btn-primary mt-7">
          <ArrowLeft size={16} aria-hidden="true" />
          {t.common.backHome}
        </Link>
      </div>
    </section>
  );
}
