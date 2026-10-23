import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, MessageCircle, ShoppingBag } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/productUtils";
import { useTilt } from "../hooks/useTilt";
import ProductImage from "./ProductImage";
import Reveal from "./motion/Reveal";

const BADGES = {
  uz: { new: "Yangi", bestseller: "Xit", limited: "Limit", sale: "Aksiya", details: "Batafsil", low: "Oz qoldi" },
  ru: { new: "Новинка", bestseller: "Хит", limited: "Лимит", sale: "Скидка", details: "Подробнее", low: "Мало" },
};

export default function ProductCard({ product, index = 0, sizes }) {
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const isRussian = lang === "ru";
  const copy = isRussian ? BADGES.ru : BADGES.uz;
  const tiltRef = useTilt();
  const timerRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const showNotice = (type, message) => {
    setNotice({ type, message });
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(null), 2600);
  };

  const name = product.name || (isRussian ? product.nameRu : product.nameUz);
  const badge = product.badge && product.badge !== "new" ? (copy[product.badge] ?? null) : null;
  const isSale = product.badge === "sale";
  const lowStock = product.stock != null && product.stock > 0 && product.stock <= 3;
  const outOfStock = product.stock != null && product.stock <= 0;
  const requiresSize = Boolean(product.sizes?.length);

  const requireSize = () => {
    showNotice("error", isRussian ? "Сначала выберите размер" : "Avval o'lchamni tanlang");
  };

  const handleAddToCart = () => {
    const result = addItem(product, { size: selectedSize, quantity: 1 });
    if (!result.ok) {
      showNotice("error", result.message);
      return;
    }
    showNotice("success", isRussian ? "Добавлено в корзину" : "Savatga qo'shildi");
  };

  return (
    <Reveal
      as="article"
      from="up"
      delay={Math.min(index, 7) * 55}
      className="h-full"
    >
      <div
        ref={tiltRef}
        data-tilting="false"
        className="tilt-card card group flex h-full flex-col overflow-hidden"
      >
        <span className="tilt-glow" aria-hidden="true" />

        <Link
          to={`/product/${product.id}`}
          className="tilt-media block"
          aria-label={`${name} — ${copy.details}`}
        >
          <div className="media aspect-[4/5]">
            <ProductImage
              product={product}
              alt={name}
              className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes={sizes ?? "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 40vw, 72vw"}
            />

            {badge || lowStock || outOfStock ? (
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
                {outOfStock ? (
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                    {isRussian ? "Нет в наличии" : "Tugagan"}
                  </span>
                ) : lowStock ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-amber-800">
                    {copy.low}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </Link>

        <div className="relative z-[2] flex flex-1 flex-col bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            {product.brand ? `${product.brand} · ${product.category}` : product.category}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-ink">
            <Link to={`/product/${product.id}`} className="transition-colors duration-200 hover:text-gold">
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
          </div>

          {requiresSize ? (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                {isRussian ? "Размер" : "O'lcham"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {product.sizes.map((size) => {
                  const active = selectedSize === size || selectedSize === String(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={active}
                      className={`min-w-8 rounded-lg border px-2 py-1 text-[11px] font-extrabold transition-all duration-200 ${
                        active
                          ? "scale-105 border-ink bg-ink text-white"
                          : "border-line bg-white text-muted hover:border-ink/40 hover:text-ink"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-auto pt-4">
            {notice ? (
              <p
                role="status"
                className={`mb-2 text-[11px] font-bold ${
                  notice.type === "error" ? "text-rose-600" : "text-olive"
                }`}
              >
                {notice.message}
              </p>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="btn btn-outline btn-sm flex-1 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {notice?.type === "success" ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <ShoppingBag size={15} aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{isRussian ? "В корзину" : "Savatga"}</span>
                <span className="sm:hidden">{isRussian ? "Корзина" : "Savat"}</span>
              </button>

              {requiresSize && !selectedSize ? (
                <button
                  type="button"
                  onClick={requireSize}
                  className="btn btn-primary btn-sm px-3"
                  aria-label={isRussian ? "Выберите размер" : "O'lcham tanlang"}
                >
                  <MessageCircle size={15} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const orderId = `SS-P-${product.id}-${Date.now().toString().slice(-6)}`;
                    const dateTime = new Date().toLocaleString("uz-UZ");
                    const price = Math.max(0, Number(product.price) || 0);
                    const messageLines = [
                      "SOFT SHOES",
                      "YANGI BUYURTMA",
                      "",
                      `Buyurtma raqami: ${orderId}`,
                      `Sana: ${dateTime}`,
                      "",
                      "MAHSULOT MA'LUMOTLARI",
                      `Mahsulot: ${product.name}`,
                      `Mahsulot kodi: ${product.id}`,
                    ];
                    if (product.color) messageLines.push(`Rang: ${product.color}`);
                    if (selectedSize) messageLines.push(`O‘lcham: ${selectedSize}`);
                    messageLines.push(
                      `Miqdor: 1`,
                      `Bir dona narxi: ${formatPrice(price)} so‘m`,
                      `UMUMIY SUMMA: ${formatPrice(price)} so‘m`,
                      "",
                      "MIJOZ MA'LUMOTLARI",
                      "F.I.Sh.: [to‘ldiriladi]",
                      "Telefon: [to‘ldiriladi]",
                      "Manzil: [to‘ldiriladi]",
                      "",
                      "Holat: Yangi buyurtma",
                      "Manba: Soft Shoes onlayn do‘koni",
                    );
                    const message = messageLines.join("\n");
                    const telegramChatUrl = "https://t.me/Muniradmsh";
                    const directUrl = `${telegramChatUrl}?text=${encodeURIComponent(message)}`;
                    void navigator.clipboard?.writeText(message).catch(() => {});
                    window.open(telegramChatUrl, "_blank", "noopener,noreferrer");
                    window.open(directUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="btn btn-primary btn-sm px-3"
                  aria-label={`${name} — ${isRussian ? "Заказ через Telegram" : "Telegram orqali buyurtma"}`}
                >
                  <MessageCircle size={15} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
