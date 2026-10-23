import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useProducts } from "./useProducts";

const CartContext = createContext(null);
const STORAGE_KEY = "soft-shoes-cart-v1";
const MAX_QUANTITY = 99;

const readEntries = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && entry.productId != null)
      .map((entry) => ({
        productId: String(entry.productId),
        size: entry.size == null || entry.size === "" ? null : String(entry.size),
        quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(entry.quantity) || 1))),
      }));
  } catch {
    return [];
  }
};

const entryKey = (productId, size) => `${productId}::${size ?? ""}`;

const stockLimit = (product) => {
  if (!product || product.stock == null) return MAX_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(0, Math.floor(Number(product.stock) || 0)));
};

export function CartProvider({ children }) {
  const { products } = useProducts();
  const [entries, setEntries] = useState(readEntries);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* localStorage may be unavailable */
    }
  }, [entries]);

  const items = useMemo(
    () =>
      entries.map((entry) => {
        const product = products.find((item) => String(item.id) === entry.productId) ?? null;
        return {
          ...entry,
          key: entryKey(entry.productId, entry.size),
          product,
          lineTotal: product ? product.price * entry.quantity : 0,
        };
      }),
    [entries, products],
  );

  const activeItems = items.filter((item) => item.product);
  const subtotal = activeItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const count = activeItems.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback(
    (product, { size = null, quantity = 1 } = {}) => {
      if (!product) return { ok: false, message: "Mahsulot topilmadi" };
      if (product.stock != null && product.stock <= 0) {
        return { ok: false, message: "Bu mahsulot tugagan" };
      }
      if (product.sizes?.length && (size === null || size === "")) {
        return { ok: false, message: "Iltimos, o'lchamni tanlang" };
      }

      const normalizedSize = size == null || size === "" ? null : String(size);
      const requested = Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(quantity) || 1)));
      const limit = stockLimit(product);
      const key = entryKey(String(product.id), normalizedSize);
      const existing = entries.find((entry) => entryKey(entry.productId, entry.size) === key);
      const currentQuantity = existing?.quantity ?? 0;
      const nextQuantity = Math.min(MAX_QUANTITY, limit, currentQuantity + requested);
      const resolvedQuantity = Math.max(1, nextQuantity);

      setEntries((current) => {
        const found = current.find((entry) => entryKey(entry.productId, entry.size) === key);
        if (!found) {
          return [
            ...current,
            { productId: String(product.id), size: normalizedSize, quantity: resolvedQuantity },
          ];
        }
        return current.map((entry) =>
          entryKey(entry.productId, entry.size) === key
            ? { ...entry, quantity: resolvedQuantity }
            : entry,
        );
      });

      const didClamp = resolvedQuantity < currentQuantity + requested;
      return {
        ok: true,
        clamped: didClamp,
        message: didClamp ? "Ombordagi miqdor cheklangan" : "Savatga qo'shildi",
      };
    },
    [entries],
  );

  const updateQuantity = useCallback(
    (key, quantity) => {
      const match = entries.find((entry) => entryKey(entry.productId, entry.size) === key);
      if (!match) return;
      const product = products.find((item) => String(item.id) === match.productId);
      const nextQuantity = Math.min(
        MAX_QUANTITY,
        stockLimit(product),
        Math.max(1, Math.floor(Number(quantity) || 1)),
      );
      setEntries((current) =>
        current.map((entry) =>
          entryKey(entry.productId, entry.size) === key
            ? { ...entry, quantity: nextQuantity }
            : entry,
        ),
      );
    },
    [entries, products],
  );

  const removeItem = useCallback((key) => {
    setEntries((current) =>
      current.filter((entry) => entryKey(entry.productId, entry.size) !== key),
    );
  }, []);

  const clearCart = useCallback(() => setEntries([]), []);

  const value = useMemo(
    () => ({
      items: activeItems,
      allItems: items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [activeItems, addItem, clearCart, count, isOpen, items, removeItem, subtotal, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
