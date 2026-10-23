import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, MapPin, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { MAPS_LINK, TELEGRAM_LINK } from "../data/config";
import { translations } from "../data/translations";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { pathname } = useLocation();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/catalog", label: t.nav.catalog },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ];

  const cartBadge = count > 0 ? (
    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[10px] font-extrabold leading-5 text-white">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

  return (
    <>
      <div className="bg-ink text-white">
        <div className="shell flex items-center justify-center gap-2 py-2 text-center text-[11px] sm:text-xs">
          <MapPin size={13} className="hidden shrink-0 text-gold sm:block" aria-hidden="true" />
          <span className="truncate font-medium">{t.home.announcement}</span>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="-my-1 inline-flex min-h-6 shrink-0 items-center gap-0.5 px-1 py-1 font-bold text-gold-soft underline-offset-4 hover:text-white hover:underline"
          >
            {t.home.announcementLink}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-4 lg:h-18">
          <BrandLogo onClick={() => setMenuOpen(false)} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.menu}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive ? "bg-canvas-deep text-ink" : "text-muted hover:bg-canvas hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <LanguageToggle />
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center rounded-full border border-line bg-white text-ink transition-colors duration-200 hover:border-ink/30"
              aria-label={`${t.nav.cart} (${count})`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {cartBadge}
            </button>
            <a href={TELEGRAM_LINK} className="btn btn-primary btn-sm">
              <MessageCircle size={15} aria-hidden="true" />
              {t.nav.order}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-11 place-items-center rounded-xl border border-line bg-white text-ink"
              aria-label={`${t.nav.cart} (${count})`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {cartBadge}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="grid size-11 place-items-center rounded-xl border border-line bg-white text-ink transition-colors duration-200 hover:border-ink/30"
              aria-label={t.nav.menu}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="animate-fade border-b border-line bg-white lg:hidden">
            <nav className="shell flex flex-col gap-1 py-3" aria-label={t.nav.menu}>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center justify-between rounded-xl px-3 text-[15px] font-bold transition-colors duration-200 ${
                      isActive ? "bg-canvas-deep text-ink" : "text-muted"
                    }`
                  }
                >
                  {link.label}
                  <ArrowUpRight size={16} className="opacity-40" aria-hidden="true" />
                </NavLink>
              ))}

              <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-3">
                <LanguageToggle />
                <a href={TELEGRAM_LINK} className="btn btn-primary btn-sm">
                  <MessageCircle size={15} aria-hidden="true" />
                  {t.nav.order}
                </a>
              </div>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
