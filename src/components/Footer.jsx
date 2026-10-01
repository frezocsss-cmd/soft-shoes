import { Link } from "react-router-dom";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { MAPS_LINK, PHONE_HREF, PHONE_NUMBER, TELEGRAM_LINK } from "../data/config";
import { translations } from "../data/translations";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";

const ADDRESS = {
  uz: "Toshkent, Mirobod tumani, Nukus ko'chasi, 3-uy",
  ru: "Ташкент, Мирабадский район, ул. Нукусская, 3",
};

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const address = ADDRESS[lang] ?? ADDRESS.uz;

  const navigation = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.products, to: "/products" },
    { label: t.nav.about, to: "/about" },
    { label: t.nav.contact, to: "/contact" },
  ];

  const help = [
    { label: t.contact.hoursText, to: "/contact" },
    { label: lang === "ru" ? "Размеры" : "O'lchamlar", to: "/products" },
    { label: lang === "ru" ? "Доставка" : "Yetkazib berish", to: "/contact" },
  ];

  return (
    <footer className="border-t border-line bg-white">
      <div className="shell py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">{t.footer.text}</p>
            <a href={TELEGRAM_LINK} className="link-quiet mt-5 text-sm">
              <MessageCircle size={16} aria-hidden="true" />
              {t.nav.order}
            </a>
          </div>

          <nav aria-label={t.footer.navigation}>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
              {t.footer.navigation}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition-colors duration-200 hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
              {t.footer.help}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {help.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors duration-200 hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
              {t.footer.contact}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="leading-6 transition-colors duration-200 hover:text-ink"
                >
                  {address}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <a href={PHONE_HREF} className="transition-colors duration-200 hover:text-ink">
                  {PHONE_NUMBER}
                </a>
              </li>
              <li className="flex gap-2.5">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href={TELEGRAM_LINK}
                  className="transition-colors duration-200 hover:text-ink"
                >
                  @soft_shoes_uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Soft Shoes. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-xs text-muted transition-colors duration-200 hover:text-ink">
              {t.footer.admin}
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
