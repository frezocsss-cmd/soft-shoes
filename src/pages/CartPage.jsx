import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/productUtils";
import { TELEGRAM_ADMIN_USERNAME } from "../data/config";
import { translations } from "../data/translations";
import { getTelegramAdminChatUrl, getTelegramMessageUrl } from "../lib/telegram";
import ProductImage from "../components/ProductImage";
import Reveal from "../components/motion/Reveal";

const initialCustomer = {
  name: "",
  phone: "",
  telegram: "",
  address: "",
  comment: "",
  fulfillment: "delivery",
};

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-gold";

function Field({ label, required, children }) {
  return (
    <label className="block text-xs font-bold text-ink">
      <span>
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

export default function CartPage() {
  const { lang } = useLanguage();
  const t = translations[lang] ?? translations.uz;
  const { items, subtotal, count, updateQuantity, removeItem, clearCart } = useCart();
  const [customer, setCustomer] = useState(initialCustomer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const isRussian = lang === "ru";
  const adminHandle = `@${TELEGRAM_ADMIN_USERNAME}`;

  if (placedOrder) {
    return (
      <section className="shell flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-olive/10 text-olive">
          <Check size={30} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">{t.cart.successTitle}</p>
        <h1 className="h-display mt-3">
          {t.cart.orderNumber}: #{placedOrder.orderNumber}
        </h1>
        <p className="lede mt-4 max-w-lg">{t.cart.successText}</p>

        <div className="mt-6 w-full max-w-md rounded-2xl border border-line bg-white p-5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{t.common.total}</span>
            <span className="text-lg font-extrabold text-ink">
              {formatPrice(placedOrder.total)} <span className="text-[11px] text-muted">so'm</span>
            </span>
          </div>
          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-xs text-muted">
            {placedOrder.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span>
                  {item.product.name}
                  {item.size ? ` · ${item.size}` : ""} × {item.quantity}
                </span>
                <span className="shrink-0 font-bold text-ink">
                  {formatPrice((Number(item.product?.price) || 0) * Number(item.quantity || 1))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 w-full max-w-2xl rounded-2xl border border-line bg-white p-5 text-left">
          <p className="text-xs font-bold text-ink">Buyurtma matni (nusxalash uchun)</p>
          <p className="mt-1 text-[11px] text-muted">
            Telegram orqali {adminHandle} ga yuborishingiz kerak. Buyurtma avtomatik yuborilmaydi.
          </p>
          <textarea
            readOnly
            value={placedOrder.message || ""}
            className="mt-3 h-64 w-full rounded-xl border border-line bg-canvas p-3 text-[11px] leading-5 text-ink"
          />
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(placedOrder.message || "");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
            className="btn btn-outline btn-sm mt-2"
          >
            {copied ? "Nusxalandi" : "Matnni nusxalash"}
          </button>
        </div>

        <div className="mt-6 flex w-full max-w-md flex-col gap-2.5">
          {placedOrder.telegramUrl ? (
            <a
              href={placedOrder.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-lg btn-block"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Telegramda ochish ({adminHandle})
            </a>
          ) : null}
          <p className="text-[11px] leading-5 text-muted">
            Telegram direkt havolasi orqali suhbatni oching va nusxalangan buyurtma matnini yuboring.
          </p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="shell flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-white text-gold shadow-card">
          <ShoppingBag size={28} aria-hidden="true" />
        </span>
        <h1 className="h-section mt-6">{t.cart.emptyTitle}</h1>
        <p className="lede mt-3 max-w-md">{t.cart.emptyText}</p>
        <Link to="/catalog" className="btn btn-primary mt-7">
          {t.cart.emptyCta}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFallbackUrl("");
    setCopied(false);

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError(t.cart.required);
      return;
    }
    if (customer.fulfillment === "delivery" && !customer.address.trim()) {
      setError(t.cart.required);
      return;
    }
    if (items.some((item) => item.product.stock != null && item.quantity > item.product.stock)) {
      setError(t.cart.stockChanged);
      return;
    }

    const orderId = `SS-${Date.now().toString().slice(-8)}`;
    const orderTime = new Date().toISOString();
    const dateTime = new Date(orderTime).toLocaleString("uz-UZ");

    const orderItems = items.map((item) => {
      const product = item.product;
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(product.price) || 0);
      return {
        product,
        size: item.size,
        quantity: qty,
        price,
        total: price * qty,
      };
    });

    const totalSum = orderItems.reduce((sum, item) => sum + item.total, 0);

    const messageLines = [
      "SOFT SHOES",
      "YANGI BUYURTMA",
      "",
      `Buyurtma raqami: ${orderId}`,
      `Sana: ${dateTime}`,
      "",
      "MAHSULOT MA'LUMOTLARI",
    ];

    orderItems.forEach((item, index) => {
      messageLines.push(
        `Mahsulot: ${item.product.name}`,
        `Mahsulot kodi: ${item.product.id}`,
      );
      if (item.product.color) messageLines.push(`Rang: ${item.product.color}`);
      if (item.size) messageLines.push(`O‘lcham: ${item.size}`);
      messageLines.push(
        `Miqdor: ${item.quantity}`,
        `Bir dona narxi: ${formatPrice(item.price)} so‘m`,
      );
      if (orderItems.length > 1) {
        messageLines.push(`Qator jami: ${formatPrice(item.total)} so‘m`);
      }
      if (index < orderItems.length - 1) messageLines.push("");
    });

    messageLines.push(`UMUMIY SUMMA: ${formatPrice(totalSum)} so‘m`, "", "MIJOZ MA'LUMOTLARI");
    messageLines.push(`F.I.Sh.: ${customer.name.trim()}`);
    messageLines.push(`Telefon: ${customer.phone.trim()}`);
    const deliveryAddress =
      customer.fulfillment === "delivery"
        ? customer.address.trim()
        : isRussian
          ? "Самовывоз из магазина"
          : "Do'kondan olib ketish";
    if (deliveryAddress) messageLines.push(`Manzil: ${deliveryAddress}`);
    if (customer.telegram?.trim()) messageLines.push(`Telegram: ${customer.telegram.trim()}`);
    if (customer.comment?.trim()) messageLines.push(`Izoh: ${customer.comment.trim()}`);
    messageLines.push("", "Holat: Yangi buyurtma", "Manba: Soft Shoes onlayn do‘koni");

    const message = messageLines.join("\n");
    const telegramChatUrl = getTelegramAdminChatUrl();
    const directUrl = getTelegramMessageUrl(message) || telegramChatUrl;

    setSubmitting(true);
    try {
      setPlacedOrder({
        orderNumber: orderId,
        total: totalSum,
        items: items,
        message,
        telegramUrl: directUrl,
      });
      clearCart();
      setCustomer(initialCustomer);
      setSubmitting(false);
      window.open(directUrl, "_blank", "noopener,noreferrer");
      setFallbackUrl(directUrl);
      return;
    } catch (submitError) {
      setError(submitError.message || t.cart.error);
      setFallbackUrl(directUrl);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="shell py-10 lg:py-12">
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-ink">
              {t.nav.home}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{t.cart.title}</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{count} {t.cart.itemCount}</p>
              <h1 className="h-display mt-3">{t.cart.title}</h1>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted transition-colors hover:text-rose-600"
            >
              <Trash2 size={14} aria-hidden="true" />
              {t.cart.clear}
            </button>
          </div>
        </div>
      </section>

      <section className="section bg-canvas">
        <div className="shell grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <Reveal from="up" className="overflow-hidden rounded-2xl border border-line bg-white">
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.key} className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="media aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl border border-line"
                  >
                    <ProductImage
                      product={item.product}
                      alt={item.product.name}
                      className="size-full"
                      sizes="96px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="line-clamp-2 text-sm font-extrabold leading-snug text-ink hover:text-gold"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-[11px] font-semibold text-muted">
                          {item.product.category}
                          {item.size ? ` · ${t.common.sizes}: ${item.size}` : ""}
                        </p>
                        {item.product.stock != null && item.product.stock > 0 && item.product.stock <= 3 ? (
                          <p className="mt-1 text-[11px] font-bold text-amber-700">
                            {t.product.lowStockNote}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`${item.product.name} — ${t.common.remove}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div className="inline-flex items-center rounded-full border border-line bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-40"
                          aria-label={isRussian ? "Уменьшить количество" : "Miqdorni kamaytirish"}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="min-w-8 text-center text-xs font-extrabold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          disabled={item.product.stock != null && item.quantity >= item.product.stock}
                          className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-ink disabled:opacity-40"
                          aria-label={isRussian ? "Увеличить количество" : "Miqdorni ko'paytirish"}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-ink">
                          {formatPrice(item.lineTotal)} <span className="text-[10px] text-muted">so'm</span>
                        </p>
                        <p className="text-[10px] text-muted">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line bg-canvas/60 px-5 py-4">
              <Link to="/catalog" className="link-quiet text-xs">
                <ArrowRight size={14} className="rotate-180" aria-hidden="true" />
                {t.cart.continue}
              </Link>
            </div>
          </Reveal>

          <Reveal from="up" delay={80} className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="text-base font-extrabold text-ink">{t.cart.checkoutTitle}</h2>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <Field label={t.cart.name} required>
                  <input
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className={inputClass}
                    placeholder={isRussian ? "Ваше имя" : "Ismingiz"}
                  />
                </Field>

                <Field label={t.cart.phone} required>
                  <input
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="+998 90 000 00 00"
                  />
                </Field>

                <Field label={t.cart.telegram}>
                  <input
                    name="telegram"
                    value={customer.telegram}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="@username"
                  />
                </Field>

                <fieldset>
                  <legend className="text-xs font-bold text-ink">{t.cart.fulfillment}</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { value: "delivery", label: t.cart.deliveryOption, icon: Truck },
                      { value: "pickup", label: t.cart.pickupOption, icon: MapPin },
                    ].map((option) => {
                      const active = customer.fulfillment === option.value;
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-bold transition-colors ${
                            active
                              ? "border-ink bg-ink text-white"
                              : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                          }`}
                        >
                          <input
                            type="radio"
                            name="fulfillment"
                            value={option.value}
                            checked={active}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <Icon size={14} aria-hidden="true" />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {customer.fulfillment === "delivery" ? (
                  <Field label={t.cart.address} required>
                    <input
                      name="address"
                      value={customer.address}
                      onChange={handleChange}
                      required
                      autoComplete="street-address"
                      className={inputClass}
                      placeholder={isRussian ? "Город, улица, дом" : "Shahar, ko'cha, uy"}
                    />
                  </Field>
                ) : (
                  <div className="rounded-xl bg-canvas px-3.5 py-3 text-[11px] leading-5 text-muted">
                    <MapPin size={13} className="mb-1 inline text-gold" aria-hidden="true" />{" "}
                    {t.home.storeAddress}
                  </div>
                )}

                <Field label={t.cart.comment}>
                  <textarea
                    name="comment"
                    value={customer.comment}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1.5 w-full resize-none rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-gold"
                    placeholder={isRussian ? "Комментарий к заказу" : "Buyurtmaga izoh"}
                  />
                </Field>

                <div className="rounded-xl bg-canvas px-3.5 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-muted">{t.common.total}</span>
                    <span className="text-lg font-extrabold text-ink">
                      {formatPrice(subtotal)} <span className="text-[11px] text-muted">so'm</span>
                    </span>
                  </div>
                </div>

                <div aria-live="polite">
                  {error ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[11px] font-semibold leading-5 text-rose-700">
                      {error}
                    </div>
                  ) : null}
                  {fallbackUrl ? (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-block"
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Telegramda ochish
                    </a>
                  ) : null}
                  <p className="text-center text-[10px] leading-5 text-muted">
                    Buyurtma matnini nusxalab {adminHandle} ga yuboring. Avtomatik yuborish mumkin emas.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg btn-block"
                >
                  {submitting ? "Yuborilmoqda..." : "Buyurtma berish"}
                  {!submitting ? <ArrowRight size={17} aria-hidden="true" /> : null}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
