import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Phone, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PHONE_HREF, PHONE_NUMBER, STORE_ADDRESS, TELEGRAM_LINK } from "../data/config";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";

export default function Footer() {
  const { lang } = useLanguage();
  const isRussian = lang === "ru";
  const copy = isRussian
    ? {
        text: "Коллекция современной и комфортной обуви.",
        shop: "Магазин",
        help: "Помощь",
        navigation: "Навигация",
        contact: "Контакты",
        rights: "Все права защищены.",
        admin: "Админ-панель",
        home: "Главная",
        products: "Товары",
        about: "О нас",
        contacts: "Контакты",
        address: "Ташкент, Мирабадский район, ул. Нукусская, 3",
        order: "Написать в Telegram",
      }
    : {
        text: "Zamonaviy va qulay poyabzallar kolleksiyasi.",
        shop: "Do'kon",
        help: "Yordam",
        navigation: "Navigatsiya",
        contact: "Bog'lanish",
        rights: "Barcha huquqlar himoyalangan.",
        admin: "Admin panel",
        home: "Bosh sahifa",
        products: "Mahsulotlar",
        about: "Biz haqimizda",
        contacts: "Bog'lanish",
        address: STORE_ADDRESS,
        order: "Telegramda yozish",
      };
  const navigation = [
    { label: copy.home, to: "/" },
    { label: copy.products, to: "/products" },
    { label: copy.about, to: "/about" },
    { label: copy.contacts, to: "/contact" },
  ];
  const help = [
    { label: isRussian ? "Таблица размеров" : "O'lcham jadvali", to: "/products" },
    { label: isRussian ? "Доставка" : "Yetkazib berish", to: "/contact" },
    { label: isRussian ? "Частые вопросы" : "Tez-tez savollar", to: "/contact" },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <BrandLogo inverted />
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/55">{copy.text}</p>
            <a
              href={TELEGRAM_LINK}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold transition hover:text-white"
            >
              <MessageCircle size={17} />
              {copy.order}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/40">{copy.navigation}</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link className="transition hover:text-gold" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/40">{copy.help}</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              {help.map((item) => (
                <li key={item.label}>
                  <Link className="transition hover:text-gold" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/40">{copy.contact}</h3>
            <div className="mt-5 space-y-4 text-sm text-white/65">
              <p className="leading-6">{copy.address}</p>
              <a href={PHONE_HREF} className="flex items-center gap-3 transition hover:text-gold">
                <Phone size={16} />
                {PHONE_NUMBER}
              </a>
              <a href={TELEGRAM_LINK} className="flex items-center gap-3 transition hover:text-gold">
                <Send size={16} />
                @soft_shoes_uz
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Soft Shoes. {copy.rights}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="transition hover:text-gold">
              {copy.admin}
            </Link>
            <LanguageToggle inverted />
          </div>
        </div>
      </div>
    </footer>
  );
}
