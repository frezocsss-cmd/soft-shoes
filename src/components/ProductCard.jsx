import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TELEGRAM_LINK } from "../data/config";
import { formatPrice } from "../data/productUtils";
import TiltCard from "./motion/TiltCard";
import Reveal from "./motion/Reveal";
import MagneticButton from "./motion/MagneticButton";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, index = 0 }) {
  const { lang } = useLanguage();

  const isRussian = lang === "ru";
  const name = product.name || (isRussian ? product.nameRu : product.nameUz);
  const badge = isRussian
    ? { new: "Новинка", bestseller: "Хит", limited: "Лимит", sale: "Скидка" }[product.badge]
    : { new: "Yangi", bestseller: "Hit", limited: "Limit", sale: "Aksiya" }[product.badge];
  const badgeStyle = product.badge === "sale" ? "bg-rose-100 text-rose-700" : "bg-white/90 text-ink";
  const stockText =
    product.stock != null && product.stock <= 3 ? (isRussian ? "Мало осталось" : "Oz qoldi") : null;

  return (
    <Reveal
      as="article"
      from="scale-up"
      delay={Math.min(index, 7) * 90}
      className="group flex flex-col"
    >
      <TiltCard
        as={Link}
        to={`/products/${product.id}`}
        max={8}
        scale={1.015}
        className="conic-ring group block overflow-hidden rounded-[1.35rem] bg-[#e9e5dc] shadow-card"
        style={{ "--ring-speed": `${9 + (index % 4) * 2}s` }}
      >
        <div className="fx-zoom aspect-[4/5] overflow-hidden">
          <ProductImage
            product={product}
            alt={name}
            className="sv-drift size-full"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 45vw"
          />
          {/* mobil'da ham ko'rinadigan sweep effekt */}
          <span className="pointer-events-none absolute inset-0 scanline opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {badge && (
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] shadow-sm transition-transform duration-500 group-hover:-translate-y-0.5 ${badgeStyle}`}
            >
              {badge}
            </span>
          )}
          {stockText && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-orange-700 shadow-sm">
              {stockText}
            </span>
          )}
        </div>

        <span
          className="orbit absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-ink text-white opacity-0 shadow-lift transition-opacity duration-500 group-hover:opacity-100"
          style={{ "--orbit-r": "0px" }}
          aria-hidden="true"
        >
          <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </TiltCard>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold">{product.category}</p>
            <h3 className="mt-2 text-base font-extrabold text-ink transition-colors duration-500 group-hover:text-gold">
              {name}
            </h3>
          </div>
          <p className="shrink-0 text-sm font-extrabold text-ink">
            {formatPrice(product.price)} <span className="text-[11px] font-semibold text-muted">so'm</span>
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <MagneticButton
            as={Link}
            to={`/products/${product.id}`}
            strength={0.12}
            className="beam h-10 flex-1 items-center justify-center rounded-full border border-ink/15 text-xs font-bold text-ink transition-all duration-500 hover:border-ink hover:bg-ink hover:text-white"
          >
            <span className="relative z-10">{isRussian ? "Подробнее" : "Batafsil"}</span>
          </MagneticButton>
          <MagneticButton
            href={TELEGRAM_LINK}
            strength={0.22}
            aria-label={`${name} — Telegram orqali buyurtma`}
            className="group/tg size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-all duration-500 hover:bg-olive"
          >
            <MessageCircle
              size={16}
              className="relative z-10 transition-transform duration-500 group-active:rotate-12 group-active:scale-110"
            />
          </MagneticButton>
        </div>
      </div>
    </Reveal>
  );
}
