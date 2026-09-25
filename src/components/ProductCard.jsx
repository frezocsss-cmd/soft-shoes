import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TELEGRAM_LINK } from "../data/config";
import { formatPrice } from "../data/productUtils";

export default function ProductCard({ product }) {
  const { lang } = useLanguage();
  const isRussian = lang === "ru";
  const name = product.name || (isRussian ? product.nameRu : product.nameUz);
  const badge = isRussian
    ? { new: "Новинка", bestseller: "Хит", limited: "Лимит", sale: "Скидка" }[product.badge]
    : { new: "Yangi", bestseller: "Hit", limited: "Limit", sale: "Aksiya" }[product.badge];
  const badgeStyle = product.badge === "sale" ? "bg-rose-100 text-rose-700" : "bg-white/90 text-ink";
  const stockText = product.stock != null && product.stock <= 3 ? (isRussian ? "Мало осталось" : "Oz qoldi") : null;

  return (
    <article className="group flex flex-col">
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden rounded-[1.35rem] bg-[#e9e5dc]">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.image_url}
            alt={name}
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {badge && <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${badgeStyle}`}>{badge}</span>}
          {stockText && <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-orange-700">{stockText}</span>}
        </div>
        <span className="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-card transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold">{product.category}</p>
            <h3 className="mt-2 text-base font-extrabold text-ink">{name}</h3>
          </div>
          <p className="shrink-0 text-sm font-extrabold text-ink">{formatPrice(product.price)} <span className="text-[11px] font-semibold text-muted">so'm</span></p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-ink/15 text-xs font-bold text-ink transition hover:border-ink hover:bg-ink hover:text-white"
          >
            {isRussian ? "Подробнее" : "Batafsil"}
          </Link>
          <a
            href={TELEGRAM_LINK}
            aria-label={`${name} — Telegram orqali buyurtma`}
            className="inline-flex size-10 items-center justify-center rounded-full bg-ink text-white transition hover:bg-olive"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
