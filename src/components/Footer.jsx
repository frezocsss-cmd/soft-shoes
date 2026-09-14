import { Send, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { TELEGRAM_LINK, PHONE_NUMBER, PHONE_HREF } from "../data/config";
import logo from "../assets/logo.jpg";

const payMethods = ["Payme", "Click", "Uzum", "Naqd"];

function Footer() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const cols = [
    { title: t.footer.shop, links: t.footer.shopLinks },
    { title: t.footer.help, links: t.footer.helpLinks },
  ];

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <a href="#home" className="footer__logo-wrap">
            <img src={logo} alt="Soft Shoes" className="footer__logo" />
            <span>{t.brand}</span>
          </a>
          <p className="footer__tagline">{t.footer.tagline}</p>

          <div className="footer__lang">
            <button
              className={`lang-switch__btn ${lang === "uz" ? "is-active" : ""}`}
              onClick={() => setLang("uz")}
            >
              O'zbek
            </button>
            <button
              className={`lang-switch__btn ${lang === "ru" ? "is-active" : ""}`}
              onClick={() => setLang("ru")}
            >
              Русский
            </button>
          </div>

          <div className="footer__social">
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" aria-label="Telegram">
              <Send size={18} />
            </a>
            <a href={PHONE_HREF} aria-label="Телефон"><Phone size={18} /></a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title} className="footer__col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer__col">
          <h4>{t.footer.phoneLabel}</h4>
          <ul>
            <li><MapPin size={14} /> {t.footer.address}</li>
            <li><Phone size={14} /> {PHONE_NUMBER}</li>
          </ul>

          <p className="footer__pay-note">{t.footer.payNote}</p>
          <div className="footer__pay">
            {payMethods.map((m) => (
              <span key={m} className="footer__pay-item">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__divider" />

      <div className="footer__bottom">
        <span>&copy; 2026 Soft Shoes. {t.footer.rights}</span>
        <div className="footer__bottom-links">
          <a href="#">Soft Shoes</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;