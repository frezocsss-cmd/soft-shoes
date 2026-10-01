import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { MAPS_LINK, TELEGRAM_LINK } from "../data/config";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";
import MagneticButton from "./motion/MagneticButton";
import { subscribeScroll } from "../lib/scrollEngine";

export default function Header() {
  const { lang } = useLanguage();
  const t = lang === "ru" ? "ru" : "uz";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const copy = {
    uz: {
      home: "Bosh sahifa",
      products: "Mahsulotlar",
      about: "Biz haqimizda",
      contact: "Bog'lanish",
      announcement: "Toshkentdagi do'konimizga tashrif buyuring",
      announcementLink: "Manzilni ko'rish",
      order: "Buyurtma berish",
      menu: "Menyu",
    },
    ru: {
      home: "Главная",
      products: "Товары",
      about: "О нас",
      contact: "Контакты",
      announcement: "Посетите наш магазин в Ташкенте",
      announcementLink: "Открыть адрес",
      order: "Заказать",
      menu: "Меню",
    },
  }[t];
  const links = [
    { to: "/", label: copy.home },
    { to: "/products", label: copy.products },
    { to: "/about", label: copy.about },
    { to: "/contact", label: copy.contact },
  ];

  useEffect(() => {
    let scrolledState = null;
    return subscribeScroll(({ y }) => {
      const next = y > 24;
      if (next === scrolledState) return;
      scrolledState = next;
      setScrolled(next);
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 grid-lines-dark opacity-60" aria-hidden="true" />
        <div
          className="blob pointer-events-none absolute -left-20 top-1/2 size-40 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(181,138,69,0.35), transparent 70%)", "--blob-speed": "14s" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center text-[11px] font-semibold tracking-wide sm:text-xs">
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
          </span>
          <span className="truncate">{copy.announcement}</span>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="fx-link group inline-flex shrink-0 items-center gap-1 text-gold transition hover:text-white"
          >
            {copy.announcementLink}
            <ArrowUpRight size={13} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-ink/10 bg-canvas/80 shadow-[0_10px_40px_-24px_rgba(25,26,22,0.5)] backdrop-blur-xl"
            : "border-transparent bg-canvas/60 backdrop-blur-md"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <BrandLogo onClick={() => setMenuOpen(false)} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Asosiy navigatsiya">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `group relative rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-400 after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-gold after:transition-all after:duration-500 hover:bg-ink/[0.04] ${
                    isActive ? "text-ink after:w-[calc(100%-0.5rem)]" : "text-muted hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <MagneticButton
              href={TELEGRAM_LINK}
              strength={0.16}
              className="beam group h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-olive hover:shadow-lift"
            >
              <MessageCircle size={17} className="relative z-10 transition-transform duration-500 group-hover:rotate-12" />
              <span className="relative z-10">{copy.order}</span>
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="conic-ring group relative grid size-11 place-items-center overflow-hidden rounded-full border border-ink/10 bg-white text-ink transition-all duration-500 hover:border-gold hover:text-gold lg:hidden"
            style={{ "--ring-speed": "8s" }}
            aria-label={copy.menu}
            aria-expanded={menuOpen}
          >
            <span className="absolute inset-0 scale-0 rounded-full bg-gold/10 transition-transform duration-500 group-hover:scale-100" />
            <span className="relative transition-transform duration-500">
              {menuOpen ? <X size={21} className="animate-pop" /> : <Menu size={21} />}
            </span>
          </button>
        </div>

        {menuOpen && (
          <div className="animate-slide-right overflow-hidden border-t border-ink/10 bg-canvas/95 px-4 py-5 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col" aria-label="Mobil navigatsiya">
              {links.map((link, index) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className={({ isActive }) =>
                    `reveal is-visible press flex items-center justify-between border-b border-ink/10 py-4 text-base font-semibold transition-colors ${
                      isActive ? "text-gold" : "text-ink"
                    }`
                  }
                >
                  {link.label}
                  <ArrowUpRight size={16} className="opacity-40" />
                </NavLink>
              ))}
              <div className="mt-5 flex items-center justify-between gap-4">
                <LanguageToggle />
                <MagneticButton
                  href={TELEGRAM_LINK}
                  strength={0.16}
                  className="h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:bg-olive"
                >
                  <MessageCircle size={17} className="relative z-10" />
                  <span className="relative z-10">{copy.order}</span>
                </MagneticButton>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
