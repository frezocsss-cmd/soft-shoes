import { TELEGRAM_ADMIN_USERNAME, TELEGRAM_LINK } from "../data/config";
import { formatPrice } from "../data/productUtils";

const safeQuantity = (value) => {
  const quantity = Math.floor(Number(value));
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
};

const siteOrigin = () =>
  typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";

const formatDateTime = () => {
  try {
    return new Intl.DateTimeFormat("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().replace("T", " ").slice(0, 16);
  }
};

export const productUrl = (productId) => `${siteOrigin()}/product/${encodeURIComponent(productId)}`;

export const getTelegramAdminChatUrl = () =>
  TELEGRAM_ADMIN_USERNAME ? `https://t.me/${TELEGRAM_ADMIN_USERNAME}` : TELEGRAM_LINK;

export function buildProductOrderMessage(product, { size = null, quantity = 1, customer = {} } = {}) {
  if (!product || product.id == null) return null;

  const qty = safeQuantity(quantity);
  const price = Math.max(0, Number(product.price) || 0);
  const total = price * qty;
  const lines = [
    "SOFT SHOES",
    "YANGI BUYURTMA KELIB TUSHDI",
    "",
    `Buyurtma №: ${product.id}`,
    `Sana: ${formatDateTime()}`,
    "",
    "1. MAHSULOT MA’LUMOTLARI",
    "",
    `Mahsulot nomi: ${product.name}`,
    `Mahsulot kodi: ${product.id}`,
  ];

  if (product.color) lines.push(`Rang: ${product.color}`);
  if (size !== null && size !== undefined && String(size).trim()) {
    lines.push(`O‘lcham: ${String(size).trim()}`);
  }
  lines.push(
    `Miqdor: ${qty} dona`,
    `Bir dona narxi: ${formatPrice(price)} so‘m`,
    "",
    `UMUMIY SUMMA: ${formatPrice(total)} so‘m`,
    "",
  );

  const hasCustomer =
    customer.name || customer.phone || customer.address || customer.telegram;
  if (hasCustomer) {
    lines.push("2. MIJOZ MA’LUMOTLARI", "");
    if (customer.name) lines.push(`Mijozning F.I.Sh.: ${customer.name}`);
    if (customer.phone) lines.push(`Bog‘lanish raqami: ${customer.phone}`);
    if (customer.telegram) lines.push(`Telegram: ${customer.telegram}`);
    if (customer.address) lines.push(`Yetkazib berish manzili: ${customer.address}`);
    if (customer.comment) lines.push(`Izoh: ${customer.comment}`);
    lines.push("");
  }

  lines.push(
    "3. BUYURTMA HOLATI",
    "",
    "Holat: Yangi",
    "Keyingi harakat: Buyurtmani tasdiqlash va yetkazib berishni tashkil etish.",
    "",
    "Ushbu bildirishnoma Soft Shoes onlayn do‘konidan avtomatik ravishda shakllantirildi.",
  );

  return lines.join("\n");
}

export function buildCartOrderMessage({ items = [], customer = {}, order = null } = {}) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + (Number(item.product?.price) || 0) * safeQuantity(item.quantity),
    0,
  );

  const orderNumber = order?.order_number || order?.id || "";
  const lines = [
    "SOFT SHOES",
    "YANGI BUYURTMA KELIB TUSHDI",
    "",
    `Buyurtma №: ${orderNumber || "-"}`,
    `Sana: ${formatDateTime()}`,
    "",
    "1. MAHSULOT MA’LUMOTLARI",
    "",
  ];

  items.forEach((item, index) => {
    const product = item.product;
    if (!product) return;
    const qty = safeQuantity(item.quantity);
    const price = Math.max(0, Number(product.price) || 0);
    const lineTotal = price * qty;
    lines.push(
      `Mahsulot #${index + 1}`,
      `Mahsulot nomi: ${product.name}`,
      `Mahsulot kodi: ${product.id}`,
    );
    if (product.color) lines.push(`Rang: ${product.color}`);
    if (item.size) lines.push(`O‘lcham: ${item.size}`);
    lines.push(
      `Miqdor: ${qty} dona`,
      `Bir dona narxi: ${formatPrice(price)} so‘m`,
      `Qator jami: ${formatPrice(lineTotal)} so‘m`,
      "",
    );
  });

  lines.push(`UMUMIY SUMMA: ${formatPrice(total)} so‘m`, "", "2. MIJOZ MA’LUMOTLARI", "");

  const hasCustomer = customer.name || customer.phone || customer.address || customer.telegram;
  if (hasCustomer) {
    if (customer.name) lines.push(`Mijozning F.I.Sh.: ${customer.name}`);
    if (customer.phone) lines.push(`Bog‘lanish raqami: ${customer.phone}`);
    if (customer.telegram) lines.push(`Telegram: ${customer.telegram}`);
    if (customer.address) lines.push(`Yetkazib berish manzili: ${customer.address}`);
    if (customer.comment) lines.push(`Izoh: ${customer.comment}`);
    lines.push("");
  } else {
    lines.push("Mijoz ma’lumotlari kiritilmagan.", "");
  }

  lines.push(
    "3. BUYURTMA HOLATI",
    "",
    "Holat: Yangi",
    "Keyingi harakat: Buyurtmani tasdiqlash va yetkazib berishni tashkil etish.",
    "",
    "Ushbu bildirishnoma Soft Shoes onlayn do‘konidan avtomatik ravishda shakllantirildi.",
  );

  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

/**
 * If an admin username is configured, open a direct chat with the prepared
 * message. Otherwise use Telegram's share chooser, where the customer must
 * review and press send.
 */
export function getTelegramMessageUrl(message) {
  if (!message) return null;

  if (TELEGRAM_ADMIN_USERNAME) {
    return `https://t.me/${TELEGRAM_ADMIN_USERNAME}?text=${encodeURIComponent(message)}`;
  }

  return `https://t.me/share/url?url=${encodeURIComponent(siteOrigin())}&text=${encodeURIComponent(message)}`;
}

export const isDirectTelegramOrder = Boolean(TELEGRAM_ADMIN_USERNAME);

export function buildProductOrderUrl(product, options) {
  return getTelegramMessageUrl(buildProductOrderMessage(product, options));
}

export function buildCartOrderUrl(cart) {
  return getTelegramMessageUrl(buildCartOrderMessage(cart));
}
