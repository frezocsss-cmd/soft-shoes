import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/productUtils";
import { translations } from "../data/translations";
import { buildCartOrderMessage, getTelegramMessageUrl } from "../lib/telegram";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { items, subtotal, count, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const { pathname } = useLocation();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeCart, isOpen]);

  useEffect(() => {
    closeCart();
  }, [closeCart, pathname]);

  const telegramUrl = useMemo(() => {
    if (!items.length) return null;
    return getTelegramMessageUrl(buildCartOrderMessage({ items }));
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <button
        type="button"
        onClick={closeCart}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade"
        aria-label={t.cart.close}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-drawer-in"
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-canvas text-ink">
              <ShoppingBag size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-ink">{t.cart.title}</h2>
              <p className="text-[11px] font-semibold text-muted">
                {count} {t.cart.itemCount}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink/30 hover:text-ink"
            aria-label={t.cart.close}
          >
            <X size={18} />
          </button>
        </header>

        {items.length ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="media aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl border border-line"
                    >
                      <ProductImage
                        product={item.product}
                        alt={item.product.name}
                        className="size-full"
                        sizes="80px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="line-clamp-2 text-sm font-extrabold leading-snug text-ink hover:text-gold"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-[11px] font-semibold text-muted">
                            {item.size ? `${t.common.sizes}: ${item.size}` : item.product.category}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`${item.product.name} — ${t.common.remove}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-full border border-line bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-40"
                            disabled={item.quantity <= 1}
                            aria-label={lang === "ru" ? "Уменьшить количество" : "Miqdorni kamaytirish"}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="min-w-7 text-center text-xs font-extrabold text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-40"
                            disabled={item.product.stock != null && item.quantity >= item.product.stock}
                            aria-label={lang === "ru" ? "Увеличить количество" : "Miqdorni ko'paytirish"}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-extrabold text-ink">
                          {formatPrice(item.lineTotal)} <span className="text-[10px] text-muted">so'm</span>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-line bg-canvas/60 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-muted">{t.common.total}</span>
                <span className="text-xl font-extrabold text-ink">
                  {formatPrice(subtotal)} <span className="text-xs text-muted">so'm</span>
                </span>
              </div>
              <Link to="/cart" className="btn btn-primary btn-block mt-4">
                {t.cart.checkout}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              {telegramUrl ? (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-block mt-2"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {t.cart.orderTelegram}
                </a>
              ) : null}
              <p className="mt-2 text-center text-[10px] leading-4 text-muted">
                {t.cart.telegramNote}
              </p>
            </footer>
          </>
        ) : (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-canvas text-gold">
                <ShoppingBag size={26} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-ink">{t.cart.emptyTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{t.cart.emptyText}</p>
              <Link to="/catalog" className="btn btn-primary mt-6">
                {t.cart.emptyCta}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
