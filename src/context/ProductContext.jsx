import { useCallback, useEffect, useMemo, useState } from "react";
import { products as seedProducts } from "../data/products";
import { isSupabaseConfigured } from "../lib/supabase";
import { getImage } from "../lib/images";
import {
  createMockProduct,
  deleteMockProduct,
  fetchMockProducts,
  isMockApiConfigured,
  updateMockProduct,
} from "../lib/mockapi";
import { ProductContext } from "./productContextValue";

const STORAGE_KEY = "soft-shoes-products-v2";
const BADGES = new Set(["new", "bestseller", "limited", "sale"]);

const makeLocalId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeGallery = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item);
  return [];
};

const normalizeProduct = (product) => {
  const name = product.name || product.nameUz || product.nameRu || "Yangi mahsulot";
  const localImage = getImage(product.image);
  const imageName = localImage ? product.image : null;
  const galleryUrls = normalizeGallery(product.galleryUrls ?? product.gallery_urls);
  const imageUrl =
    (localImage ? localImage.src : null) || product.image_url || product.image || galleryUrls[0] || "";

  return {
    ...product,
    id: product.id ?? null,
    name,
    nameUz: product.nameUz || name,
    nameRu: product.nameRu || name,
    descriptionUz: product.descriptionUz || "",
    descriptionRu: product.descriptionRu || "",
    image: imageName ?? imageUrl,
    imageName,
    image_url: imageUrl,
    price: Math.max(0, Number(product.price) || 0),
    oldPrice: product.oldPrice ? Math.max(0, Number(product.oldPrice)) : null,
    category: product.category || "Unisex",
    brand: product.brand || "",
    sizes: Array.isArray(product.sizes) ? product.sizes.map(Number).filter(Number.isFinite) : [],
    stock: product.stock == null ? null : Math.max(0, Number(product.stock) || 0),
    badge: BADGES.has(product.badge) ? product.badge : null,
    featured: Boolean(product.featured),
    galleryUrls,
    createdAt: product.createdAt || null,
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

const dataSource = isMockApiConfigured ? "mockapi" : "local";

const loadRemoteProducts = () => fetchMockProducts();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(readLocalProducts);
  const [syncStatus, setSyncStatus] = useState(dataSource === "local" ? "local" : "loading");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    if (!isMockApiConfigured) return undefined;
    let active = true;

    loadRemoteProducts()
      .then((remoteProducts) => {
        if (!active) return;
        setProducts(remoteProducts.map(normalizeProduct));
        setSyncStatus("ready");
        setSyncError("");
      })
      .catch((error) => {
        if (!active) return;
        setSyncError(error.message || "Mahsulotlar bazasi bilan bog'lanib bo'lmadi");
        setSyncStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      /* no-op */
    }
  }, [products]);

  const refreshProducts = useCallback(async () => {
    if (dataSource === "local") return;
    setSyncStatus("loading");
    try {
      const remoteProducts = await loadRemoteProducts();
      setProducts(remoteProducts.map(normalizeProduct));
      setSyncError("");
      setSyncStatus("ready");
    } catch (error) {
      setSyncError(error.message || "Mahsulotlar bazasi bilan bog'lanib bo'lmadi");
      setSyncStatus("error");
      throw error;
    }
  }, []);

  const addProduct = useCallback(async (product) => {
    const now = new Date().toISOString();
    if (isMockApiConfigured) {
      const saved = await createMockProduct(product);
      const normalized = normalizeProduct(saved);
      setProducts((current) => [normalized, ...current]);
      return normalized.id;
    }
    const draft = normalizeProduct({ ...product, id: makeLocalId(), createdAt: now });
    setProducts((current) => [draft, ...current]);
    return draft.id;
  }, []);

  const updateProduct = useCallback(
    async (id, changes) => {
      const currentProduct = products.find((product) => String(product.id) === String(id));
      if (!currentProduct) throw new Error("Mahsulot topilmadi");
      const nextProduct = normalizeProduct({ ...currentProduct, ...changes, id: currentProduct.id });
      if (isMockApiConfigured) {
        const saved = await updateMockProduct(nextProduct);
        setProducts((current) =>
          current.map((product) =>
            String(product.id) === String(id) ? normalizeProduct(saved) : product,
          ),
        );
        return;
      }
      setProducts((current) =>
        current.map((product) => (String(product.id) === String(id) ? nextProduct : product)),
      );
    },
    [products],
  );

  const deleteProduct = useCallback(async (id) => {
    if (isMockApiConfigured) await deleteMockProduct(id);
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
      dataSource,
      syncStatus,
      syncError,
    }),
    [
      addProduct,
      deleteProduct,
      products,
      refreshProducts,
      syncError,
      syncStatus,
      updateProduct,
    ],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
