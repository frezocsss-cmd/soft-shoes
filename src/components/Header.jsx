import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { MAPS_LINK, TELEGRAM_LINK } from "../data/config";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { lang } = useLanguage();
  const t = lang === "ru" ? "ru" : "uz";
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <>
      <div className="bg-ink px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center text-[11px] font-semibold tracking-wide sm:text-xs">
          <span>{copy.announcement}</span>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-gold transition hover:text-white"
          >
            {copy.announcementLink}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLogo onClick={() => setMenuOpen(false)} />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Asosiy navigatsiya">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-semibold transition after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all ${
                    isActive
                      ? "text-ink after:w-full"
                      : "text-muted after:w-0 hover:text-ink hover:after:w-full"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <a
              href={TELEGRAM_LINK}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-olive"
            >
              <MessageCircle size={17} />
              {copy.order}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white text-ink lg:hidden"
            aria-label={copy.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-ink/10 bg-canvas px-4 py-5 lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col" aria-label="Mobil navigatsiya">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-ink/10 py-4 text-base font-semibold ${
                      isActive ? "text-gold" : "text-ink"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-5 flex items-center justify-between gap-4">
                <LanguageToggle />
                <a
                  href={TELEGRAM_LINK}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white"
                >
                  <MessageCircle size={17} />
                  {copy.order}
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
