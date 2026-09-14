import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";
import { TELEGRAM_LINK } from "../data/config";
import logo from "../assets/logo.jpg";

function Navbar() {
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = translations[lang];

  const links = [
    { label: t.nav.collection, href: "#collection" },
    { label: t.nav.partners, href: "#partners" },
    { label: t.nav.location, href: "#location" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const switchLang = (l) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="navbar__inner">
        <a href="#home" className="navbar__brand">
          <img src={logo} alt="Soft Shoes logo" className="navbar__logo" />
          <span className="navbar__name">{t.brand}</span>
        </a>

        <ul className="navbar__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="navbar__link" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <div className="lang-switch">
            <button
              className={`lang-switch__btn ${lang === "uz" ? "is-active" : ""}`}
              onClick={() => switchLang("uz")}
              aria-label="O'zbekcha"
            >
              O'z
            </button>
            <button
              className={`lang-switch__btn ${lang === "ru" ? "is-active" : ""}`}
              onClick={() => switchLang("ru")}
              aria-label="Русский"
            >
              Ru
            </button>
          </div>

          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn btn--gold navbar__order"
          >
            {t.nav.order}
          </a>

          <button
            className={`navbar__toggle ${open ? "is-open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Меню"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`navbar__mobile ${open ? "is-open" : ""}`}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="navbar__mobile-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noreferrer"
          className="btn btn--gold navbar__mobile-cta"
          onClick={() => setOpen(false)}
        >
          {t.nav.order}
        </a>
      </div>
    </header>
  );
}

export default Navbar;