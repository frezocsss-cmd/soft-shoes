import { ArrowRight, Phone, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { TELEGRAM_LINK, PHONE_NUMBER, PHONE_HREF } from "../data/config";
import logo from "../assets/logo.jpg";

function ProfileHeader() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="home" className="hero profile-header">
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />

      <div className="hero__inner profile-header__inner">
        <div className="hero__visual profile-header__visual">
          <div className="hero__ring" />
          <img src={logo} alt={t.brand} className="hero__img profile-header__logo" />
        </div>

        <div className="hero__copy profile-header__copy">
          <span className="hero__badge">{t.profile.badge}</span>

          <h1 className="hero__title">
            Soft <em>Shoes</em>
          </h1>

          <p className="hero__subtitle">{t.profile.subtitle}</p>

          <div className="lang-switch profile-header__lang">
            <button
              className={`lang-switch__btn ${lang === "uz" ? "is-active" : ""}`}
              onClick={() => setLang("uz")}
            >
              O'z
            </button>
            <button
              className={`lang-switch__btn ${lang === "ru" ? "is-active" : ""}`}
              onClick={() => setLang("ru")}
            >
              Ru
            </button>
          </div>

          <div className="profile-header__actions">
            <a href="#collection" className="btn btn--gold">
              {t.profile.order} <ArrowRight size={18} />
            </a>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn btn--telegram"
            >
              <Send size={18} /> {t.profile.telegram}
            </a>
            <a href={PHONE_HREF} className="btn btn--ghost">
              <Phone size={18} /> {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span>{t.profile.title}</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

export default ProfileHeader;