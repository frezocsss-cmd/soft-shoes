import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, MessageCircle, PackageCheck, Ruler, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { formatPrice } from "../data/productUtils";
import { useProducts } from "../context/useProducts";
import { TELEGRAM_LINK } from "../data/config";
import { translations } from "../data/translations";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/motion/Reveal";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products } = useProducts();
  const [sizeState, setSizeState] = useState({ id: null, value: null });
  // Tanlangan o'lcham faqat joriy mahsulotga tegishli — mahsulot almashsa tozalanadi.
  const size = sizeState.id === productId ? sizeState.value : null;
  const selectSize = (value) => setSizeState({ id: productId, value });

  const product = products.find((item) => String(item.id) === String(productId));

  if (!product) {
    return (
      <section className="shell flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl font-extrabold tracking-tight text-line">404</p>
        <h1 className="h-section mt-4">{t.product.notFound}</h1>
        <Link to="/products" className="btn btn-primary mt-6">
          {t.nav.products}
        </Link>
      </section>
    );
  }

  const isRussian = lang === "ru";
  const name = product.name || (isRussian ? product.nameRu : product.nameUz);
  const description = isRussian ? product.descriptionRu : product.descriptionUz;
  const isAvailable = product.stock == null || product.stock > 0;
  const related = products.filter((item) => item.id !== product.id).slice(0, 4);

  // `new` — bazada badge ustuni yo'q paytdagi zaxira qiymat, real belgi emas.
  const badge = product.badge && product.badge !== "new"
    ? {
        uz: { sale: "Aksiya", new: "Yangi", bestseller: "Xit", limited: "Limit" },
        ru: { sale: "Скидка", new: "Новинка", bestseller: "Хит", limited: "Limit" },
      }[isRussian ? "ru" : "uz"][product.badge]
    : null;

  const perks = [
    { icon: PackageCheck, title: t.product.delivery, text: t.product.deliveryText },
    { icon: Ruler, title: t.common.sizes, text: t.product.helpText },
    { icon: ShieldCheck, title: t.nav.contact, text: t.product.helpText },
  ];

  const orderText = isRussian
    ? `Здравствуйте! Хочу заказать: ${name}${size ? `, размер ${size}` : ""}`
    : `Salom! Buyurtma bermoqchiman: ${name}${size ? `, ${size}-o'lcham` : ""}`;
  const orderLink = `${TELEGRAM_LINK}?text=${encodeURIComponent(orderText)}`;

  return (
    <div>
      <div className="shell pt-5">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors duration-200 hover:text-ink">
            {t.nav.home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className="transition-colors duration-200 hover:text-ink">
            {t.product.breadcrumb}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink">{name}</span>
        </nav>
      </div>

      <section className="shell grid gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        <Reveal from="up" className="media aspect-[4/5] rounded-3xl border border-line">
          <ProductImage
            product={product}
            alt={name}
            className="size-full"
            sizes="(min-width: 1024px) 48vw, 92vw"
            priority
            rootMargin="400px"
          />
          {badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink shadow-card">
              {badge}
            </span>
          ) : null}
        </Reveal>

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="h-display mt-3">{name}</h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-extrabold text-ink">
              {formatPrice(product.price)} <span className="text-sm font-semibold text-muted">so'm</span>
            </span>
            {product.oldPrice ? (
              <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)} so'm</span>
            ) : null}
          </div>

          {description ? <p className="lede mt-5">{description}</p> : null}

          <div className="mt-7 rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-ink">{t.product.availability}</span>
              <span className={`inline-flex items-center gap-2 text-xs font-bold ${isAvailable ? "text-olive" : "text-rose-600"}`}>
                <span className={`size-2 rounded-full ${isAvailable ? "bg-olive" : "bg-rose-500"}`} />
                {isAvailable ? t.common.inStock : t.common.outOfStock}
              </span>
            </div>

            {product.sizes?.length ? (
              <div className="mt-5 border-t border-line pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-ink">{t.common.sizes}</span>
                  {size ? (
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
                      {isRussian ? `Выбрано: ${size}` : `Tanlangan: ${size}`}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((item) => {
                    const active = size === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => selectSize(item)}
                        aria-pressed={active}
                        className={`min-w-11 rounded-xl border px-3 py-2 text-xs font-bold transition-colors duration-200 ${
                          active
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-ink hover:border-ink/40"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <a
            href={orderLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg btn-block mt-6"
          >
            <MessageCircle size={18} aria-hidden="true" />
            {t.product.orderHint}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <p className="mt-3 text-center text-xs text-muted">{t.product.orderText}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-line bg-white p-4">
                <Icon size={17} className="text-gold" aria-hidden="true" />
                <p className="mt-2.5 text-xs font-extrabold text-ink">{title}</p>
                <p className="mt-1 text-[11px] leading-5 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length ? (
        <section className="section border-t border-line bg-canvas">
          <div className="shell">
            <SectionHeading
              eyebrow={t.product.breadcrumb}
              title={isRussian ? "Вам понравится" : "Sizga yoqishi mumkin"}
              action={
                <Link to="/products" className="btn btn-outline btn-sm">
                  {t.common.viewAll}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              }
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
