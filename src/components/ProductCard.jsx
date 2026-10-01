import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TELEGRAM_LINK } from "../data/config";
import { formatPrice } from "../data/productUtils";
import ProductImage from "./ProductImage";
import Reveal from "./motion/Reveal";

const BADGES = {
  uz: { new: "Yangi", bestseller: "Xit", limited: "Limit", sale: "Aksiya", details: "Batafsil", low: "Oz qoldi" },
  ru: { new: "Новинка", bestseller: "Хит", limited: "Лимит", sale: "Скидка", details: "Подробнее", low: "Мало" },
};

export default function ProductCard({ product, index = 0, sizes }) {
  const { lang } = useLanguage();
  const isRussian = lang === "ru";
  const copy = isRussian ? BADGES.ru : BADGES.uz;

  const name = product.name || (isRussian ? product.nameRu : product.nameUz);
  // `new` — ma'lumot bazasi badge ustuni yo'q paytda ProductContext qo'yadigan
  // zaxira qiymat, shuning uchun u haqiqiy merchandising belgisi emas.
  const badge = product.badge && product.badge !== "new" ? (copy[product.badge] ?? null) : null;
  const isSale = product.badge === "sale";
  const lowStock = product.stock != null && product.stock > 0 && product.stock <= 3;
  const outOfStock = product.stock != null && product.stock <= 0;

  return (
    <Reveal
      as="article"
      from="up"
      delay={Math.min(index, 7) * 55}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <Link
        to={`/products/${product.id}`}
        className="block"
        aria-label={`${name} — ${copy.details}`}
      >
        <div className="media aspect-[4/5]">
          <ProductImage
            product={product}
            alt={name}
            className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes={sizes ?? "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 40vw, 72vw"}
          />

          {badge || lowStock ? (
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
              {badge ? (
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] ${
                    isSale ? "bg-rose-600 text-white" : "bg-white text-ink shadow-card"
                  }`}
                >
                  {badge}
                </span>
              ) : null}
              {lowStock ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-amber-800">
                  {copy.low}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-ink">
          <Link to={`/products/${product.id}`} className="transition-colors duration-200 hover:text-gold">
            {name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[17px] font-extrabold text-ink">
            {formatPrice(product.price)} <span className="text-[11px] font-semibold text-muted">so'm</span>
          </span>
          {product.oldPrice ? (
            <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>
          ) : null}
          {outOfStock ? (
            <span className="text-[11px] font-bold text-rose-600">
              {isRussian ? "Нет в наличии" : "Tugagan"}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm flex-1">
            {copy.details}
          </Link>
          <a
            href={TELEGRAM_LINK}
            aria-label={`${name} — Telegram orqali buyurtma`}
            className="btn btn-primary btn-sm px-3"
          >
            <MessageCircle size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
