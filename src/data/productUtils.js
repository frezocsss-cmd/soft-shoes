export const PRODUCT_CATEGORIES = ["Erkaklar", "Ayollar", "Unisex"];
export const PRODUCT_BADGES = ["new", "bestseller", "limited", "sale"];

export const formatPrice = (value) =>
  new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(Number(value) || 0);
