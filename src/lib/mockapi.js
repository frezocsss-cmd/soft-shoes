/**
 * MockAPI adapter with CRUD support.
 *
 * MockAPI stores all product information. Supabase Storage bucket
 * `product-images` stores image files only.
 */
const mockApiBaseUrl = import.meta.env.VITE_MOCKAPI_BASE_URL?.trim();

export const isMockApiConfigured = Boolean(mockApiBaseUrl);

const getUrl = () => {
  if (!mockApiBaseUrl) throw new Error("MockAPI manzili sozlanmagan");
  return mockApiBaseUrl.replace(/\/$/, "");
};

const parseSizes = (value) => {
  if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((size) => Number(size.trim()))
      .filter(Number.isFinite);
  }
  return [];
};

const parseGallery = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const normalizeMockProduct = (row, index) => {
  const images = parseGallery(row.images ?? row.gallery ?? row.gallery_urls);
  const image = row.image_url || row.image || images[0] || row.photo || row.img || "";
  const name = row.name || row.Name || row.name_uz || row.title || `Product ${index + 1}`;

  return {
    id: row.id,
    name,
    nameUz: row.name_uz || row.nameUz || name,
    nameRu: row.name_ru || row.nameRu || name,
    descriptionUz: row.description_uz || row.description || "",
    descriptionRu: row.description_ru || row.description || "",
    image,
    image_url: image,
    price: Math.max(0, Number(row.price ?? row.Price) || 0),
    oldPrice: row.old_price || row.oldPrice || null,
    category: row.category || "Unisex",
    brand: row.brand || "",
    sizes: parseSizes(row.sizes),
    stock: row.stock == null ? null : Math.max(0, Number(row.stock) || 0),
    badge: row.badge || null,
    featured: Boolean(row.featured),
    galleryUrls: images,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
};

const toMockPayload = (product) => {
  const payload = {
    name: product.name || product.nameUz || product.nameRu || "Mahsulot",
    name_uz: product.nameUz || product.name || product.nameRu || "",
    name_ru: product.nameRu || product.name || product.nameUz || "",
    description_uz: product.descriptionUz || "",
    description_ru: product.descriptionRu || "",
    price: Number(product.price) || 0,
    old_price: product.oldPrice ? Number(product.oldPrice) : null,
    category: product.category || "Unisex",
    brand: product.brand || "",
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    stock: product.stock === "" || product.stock == null ? null : Number(product.stock) || 0,
    badge: product.badge || null,
    featured: Boolean(product.featured),
    image_url: product.image_url || product.image || "",
    image: product.image_url || product.image || "",
    images: Array.isArray(product.galleryUrls) ? product.galleryUrls : [],
    gallery_urls: Array.isArray(product.galleryUrls) ? product.galleryUrls : [],
  };
  return payload;
};

export async function fetchMockProducts() {
  if (!isMockApiConfigured) throw new Error("MockAPI manzili sozlanmagan");

  const response = await fetch(getUrl(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`MockAPI javob bermadi (${response.status})`);
  }

  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(rows)) throw new Error("MockAPI noto'g'ri formatda javob qaytardi");

  return rows.map((row, index) => normalizeMockProduct(row, index));
}

export async function createMockProduct(product) {
  if (!isMockApiConfigured) throw new Error("MockAPI manzili sozlanmagan");

  const response = await fetch(getUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toMockPayload(product)),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`MockAPI yaratishda xatolik (${response.status}): ${text || response.statusText}`);
  }

  const row = await response.json();
  return normalizeMockProduct(row);
}

export async function updateMockProduct(product) {
  if (!isMockApiConfigured) throw new Error("MockAPI manzili sozlanmagan");
  if (!product?.id) throw new Error("Mahsulot ID topilmadi");

  const response = await fetch(`${getUrl()}/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toMockPayload(product)),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`MockAPI yangilashda xatolik (${response.status}): ${text || response.statusText}`);
  }

  const row = await response.json();
  return normalizeMockProduct(row);
}

export async function deleteMockProduct(id) {
  if (!isMockApiConfigured) throw new Error("MockAPI manzili sozlanmagan");

  const response = await fetch(`${getUrl()}/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok && response.status !== 404) {
    const text = await response.text().catch(() => "");
    throw new Error(`MockAPI o'chirishda xatolik (${response.status}): ${text || response.statusText}`);
  }
}
