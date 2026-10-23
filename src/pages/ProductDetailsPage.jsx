import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  MessageCircle,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/useProducts";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/productUtils";
import { translations } from "../data/translations";
import { buildProductOrderUrl, buildProductOrderMessage, getTelegramMessageUrl, sendOrderToTelegram } from "../lib/telegram";
import ProductCard from "../components/ProductCard";
import ProductGallery from "../components/ProductGallery";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/motion/Reveal";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { products, syncStatus, syncError, refreshProducts } = useProducts();
  const { addItem } = useCart();
  const [selection, setSelection] = useState({ id: null, size: null, quantity: 1 });
  const [feedback, setFeedback] = useState(null);
  const [added, setAdded] = useState(false);

  const product = products.find((item) => String(item.id) === String(productId));

  const size = selection.id === productId ? selection.size : null;
  const quantity = selection.id === productId ? selection.quantity : 1;

  const related = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(
      (item) => String(item.id) !== String(product.id) && item.category === product.category,
    );
    const others = products.filter(
      (item) =>
        String(item.id) !== String(product.id) && !sameCategory.some((match) => match.id === item.id),
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [product, products]);

  if (!product) {
    if (syncStatus === "loading") {
      return (
        <div className="shell py-12" aria-busy="true">
          <div className="skeleton h-3 w-32 rounded-full" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="skeleton aspect-[4/5] rounded-3xl" />
            <div>
              <div className="skeleton h-3 w-24 rounded-full" />
              <div className="skeleton mt-4 h-10 w-2/3 rounded-xl" />
              <div className="skeleton mt-5 h-4 w-1/3 rounded-full" />
              <div className="skeleton mt-8 h-32 rounded-2xl" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className="shell flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl font-extrabold tracking-tight text-line">404</p>
        <h1 className="h-section mt-4">{t.product.notFound}</h1>
        {syncError ? <p className="lede mt-3 max-w-md">{syncError}</p> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/catalog" className="btn btn-primary">
            {t.nav.catalog}
          </Link>
          {syncError ? (
            <button type="button" onClick={refreshProducts} className="btn btn-outline">
              {t.common.retry}
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  const isRussian = lang === "ru";
  const name = product.name || (isRussian ? product.nameRu : product.nameUz);
  const description = isRussian ? product.descriptionRu : product.descriptionUz;
  const isAvailable = product.stock == null || product.stock > 0;
  const requiresSize = Boolean(product.sizes?.length);
  const maxQuantity = product.stock == null ? 99 : Math.max(1, Math.min(99, product.stock));

  const selectSize = (value) => {
    setSelection((current) => ({
      id: productId,
      size: value,
      quantity: current.id === productId ? current.quantity : 1,
    }));
    setFeedback(null);
    setAdded(false);
  };

  const changeQuantity = (delta) => {
    setSelection((current) => {
      const base = current.id === productId ? current.quantity : 1;
      return {
        id: productId,
        size: current.id === productId ? current.size : null,
        quantity: Math.min(maxQuantity, Math.max(1, base + delta)),
      };
    });
  };

  const orderUrl = buildProductOrderUrl(product, { size, quantity });
  const canOrder = isAvailable && (!requiresSize || size !== null);
  const total = product.price * quantity;

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 3200);
  };

  const handleOrderClick = (event) => {
    if (canOrder) {
      void sendOrderToTelegram(buildProductOrderMessage(product, { size, quantity }));
      showFeedback(
        "success",
        isRussian
          ? "Сообщение готово — проверьте его в Telegram и отправьте."
          : "Xabar tayyor — Telegram'da tekshirib yuboring.",
      );
      return;
    }
    event.preventDefault();
    if (!isAvailable) {
      showFeedback("error", isRussian ? "Товара нет в наличии" : "Mahsulot tugagan");
      return;
    }
    showFeedback("error", t.product.chooseSize);
  };

  const handleAddToCart = () => {
    const result = addItem(product, { size, quantity });
    if (!result.ok) {
      showFeedback("error", result.message);
      return;
    }
    setAdded(true);
    showFeedback("success", isRussian ? "Добавлено в корзину" : "Savatga qo'shildi");
    window.setTimeout(() => setAdded(false), 2200);
  };

  const perkItems = [
    { icon: Truck, title: t.product.delivery, text: t.product.deliveryText },
    { icon: Ruler, title: t.common.sizes, text: t.product.helpText },
    { icon: ShieldCheck, title: t.product.help, text: t.product.helpText },
  ];

  return (
    <div>
      <div className="shell pt-5">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors duration-200 hover:text-ink">
            {t.nav.home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/catalog" className="transition-colors duration-200 hover:text-ink">
            {t.product.breadcrumb}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink">{name}</span>
        </nav>
      </div>

      <section className="shell grid gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        <Reveal from="scale">
          <ProductGallery product={product} alt={name} />
        </Reveal>

        <div className="lg:pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">{product.category}</p>
            {product.brand ? (
              <>
                <span className="text-line" aria-hidden="true">/</span>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{product.brand}</p>
              </>
            ) : null}
          </div>

          <h1 className="h-display mt-3">{name}</h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-extrabold text-ink">
              {formatPrice(product.price)} <span className="text-sm font-semibold text-muted">so'm</span>
            </span>
            {product.oldPrice ? (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.oldPrice)} so'm
              </span>
            ) : null}
            {product.oldPrice && product.oldPrice > product.price ? (
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold text-rose-600">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            ) : null}
          </div>

          {description ? <p className="lede mt-5">{description}</p> : null}

          <div className="mt-7 rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-ink">{t.product.availability}</span>
              <span
                className={`inline-flex items-center gap-2 text-xs font-bold ${
                  isAvailable ? "text-olive" : "text-rose-600"
                }`}
              >
                <span className={`size-2 rounded-full ${isAvailable ? "bg-olive" : "bg-rose-500"}`} />
                {isAvailable ? t.common.inStock : t.common.outOfStock}
                {product.stock != null && product.stock > 0 ? (
                  <span className="text-muted">
                    · {product.stock} {t.product.stockCount}
                  </span>
                ) : null}
              </span>
            </div>

            {requiresSize ? (
              <div className="mt-5 border-t border-line pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-ink">{t.common.sizes}</span>
                  {size ? (
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
                      {isRussian ? `Выбрано: ${size}` : `Tanlangan: ${size}`}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted">{t.product.chooseSize}</span>
                  )}
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
                        className={`size-chip min-w-11 rounded-xl border px-3 py-2 text-xs font-bold ${
                          active
                            ? "is-active border-ink bg-ink text-white"
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

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <span className="text-sm font-bold text-ink">{t.common.quantity}</span>
              <div className="inline-flex items-center rounded-full border border-line bg-white">
                <button
                  type="button"
                  onClick={() => changeQuantity(-1)}
                  disabled={quantity <= 1 || !isAvailable}
                  className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-40"
                  aria-label={isRussian ? "Уменьшить количество" : "Miqdorni kamaytirish"}
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-9 text-center text-sm font-extrabold text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => changeQuantity(1)}
                  disabled={quantity >= maxQuantity || !isAvailable}
                  className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-40"
                  aria-label={isRussian ? "Увеличить количество" : "Miqdorni ko'paytirish"}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-canvas px-3.5 py-3">
              <span className="text-xs font-bold text-muted">{t.common.total}</span>
              <span className="text-base font-extrabold text-ink">
                {formatPrice(total)} <span className="text-[11px] font-semibold text-muted">so'm</span>
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`btn btn-outline btn-lg transition-transform ${
                added ? "border-olive text-olive" : ""
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {added ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
              {added ? (isRussian ? "Добавлено" : "Qo'shildi") : t.product.addToCart}
            </button>

            <a
              href={canOrder ? orderUrl : undefined}
              target="_blank"
              rel="noreferrer"
              onClick={handleOrderClick}
              className={`btn btn-primary btn-lg ${!canOrder ? "opacity-60" : ""}`}
              aria-disabled={!canOrder}
            >
              <MessageCircle size={18} aria-hidden="true" />
              {t.product.orderNow}
            </a>
          </div>

          <p className="mt-3 text-center text-xs text-muted">{t.product.orderText}</p>

          <div aria-live="polite" className="min-h-6">
            {feedback ? (
              <p
                className={`mt-2 text-center text-xs font-bold ${
                  feedback.type === "error" ? "text-rose-600" : "text-olive"
                }`}
              >
                {feedback.message}
              </p>
            ) : null}
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {perkItems.map(({ icon: Icon, title, text }) => (
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
              title={t.product.related}
              action={
                <Link to="/catalog" className="btn btn-outline btn-sm">
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
