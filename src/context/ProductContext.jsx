import { useCallback, useEffect, useMemo, useState } from "react";
import { products as seedProducts } from "../data/products";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  createRemoteProduct,
  deleteRemoteProduct,
  fetchRemoteProducts,
  updateRemoteProduct,
} from "../lib/productRepository";
import { ProductContext } from "./productContextValue";

const STORAGE_KEY = "soft-shoes-products-v1";

const makeLocalId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeProduct = (product) => {
  const name = product.name || product.nameUz || product.nameRu || "Yangi mahsulot";
  const imageUrl = product.image_url || product.image || "";

  return {
    ...product,
    id: product.id ?? null,
    name,
    nameUz: product.nameUz || name,
    nameRu: product.nameRu || name,
    descriptionUz: product.descriptionUz || "Soft Shoes kolleksiyasi",
    descriptionRu: product.descriptionRu || product.descriptionUz || "Коллекция Soft Shoes",
    image: imageUrl,
    image_url: imageUrl,
    price: Math.max(0, Number(product.price) || 0),
    oldPrice: product.oldPrice ? Math.max(0, Number(product.oldPrice)) : null,
    category: product.category || "Unisex",
    sizes: Array.isArray(product.sizes) ? product.sizes.map(Number).filter(Boolean) : [],
    stock: product.stock == null ? null : Math.max(0, Number(product.stock) || 0),
    badge: product.badge || "new",
    featured: Boolean(product.featured),
    createdAt: product.createdAt || new Date().toISOString(),
  };
};

const readLocalProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedProducts.map(normalizeProduct);
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : seedProducts.map(normalizeProduct);
  } catch {
    return seedProducts.map(normalizeProduct);
  }
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(readLocalProducts);
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? "loading" : "local");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;
    fetchRemoteProducts()
      .then((remoteProducts) => {
        if (!active) return;
        setProducts(remoteProducts.map(normalizeProduct));
        setSyncStatus("ready");
        setSyncError("");
      })
      .catch((error) => {
        if (!active) return;
        setSyncError(error.message || "Supabase bilan bog'lanib bo'lmadi");
        setSyncStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    const refreshFromCloud = async () => {
      try {
        const remoteProducts = await fetchRemoteProducts();
        setProducts(remoteProducts.map(normalizeProduct));
        setSyncError("");
        setSyncStatus("ready");
      } catch {
        return;
      }
    };
    const channel = supabase
      .channel("soft-shoes-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refreshFromCloud)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      return;
    }
  }, [products]);

  const refreshProducts = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setSyncStatus("loading");
    try {
      const remoteProducts = await fetchRemoteProducts();
      setProducts(remoteProducts.map(normalizeProduct));
      setSyncError("");
      setSyncStatus("ready");
    } catch (error) {
      setSyncError(error.message || "Supabase bilan bog'lanib bo'lmadi");
      setSyncStatus("error");
      throw error;
    }
  }, []);

  const addProduct = useCallback(async (product) => {
    const now = new Date().toISOString();
    const draft = normalizeProduct(
      isSupabaseConfigured ? { ...product, createdAt: now } : { ...product, id: makeLocalId(), createdAt: now },
    );
    if (isSupabaseConfigured) {
      const saved = await createRemoteProduct(draft);
      setProducts((current) => [normalizeProduct(saved), ...current]);
      return saved.id;
    }
    setProducts((current) => [draft, ...current]);
    return draft.id;
  }, []);

  const updateProduct = useCallback(async (id, changes) => {
    const currentProduct = products.find((product) => String(product.id) === String(id));
    if (!currentProduct) throw new Error("Mahsulot topilmadi");
    const nextProduct = normalizeProduct({ ...currentProduct, ...changes, id: currentProduct.id });
    if (isSupabaseConfigured) {
      const saved = await updateRemoteProduct(nextProduct);
      setProducts((current) =>
        current.map((product) => (String(product.id) === String(id) ? normalizeProduct(saved) : product)),
      );
      return;
    }
    setProducts((current) =>
      current.map((product) => (String(product.id) === String(id) ? nextProduct : product)),
    );
  }, [products]);

  const deleteProduct = useCallback(async (id) => {
    if (isSupabaseConfigured) await deleteRemoteProduct(id);
    setProducts((current) => current.filter((product) => String(product.id) !== String(id)));
  }, []);

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
      isCloudEnabled: isSupabaseConfigured,
      syncStatus,
      syncError,
    }),
    [products, addProduct, updateProduct, deleteProduct, refreshProducts, syncStatus, syncError],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
