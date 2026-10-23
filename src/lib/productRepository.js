import { getSupabase } from "./supabase";

const EXTENDED_COLUMNS = [
  "name_uz",
  "name_ru",
  "description_uz",
  "description_ru",
  "old_price",
  "category",
  "brand",
  "sizes",
  "stock",
  "badge",
  "featured",
  "gallery_urls",
  "created_at",
];

const getClient = async () => {
  const client = await getSupabase();
  if (!client) throw new Error("Supabase sozlanmagan");
  return client;
};

const requireAdminSession = async () => {
  const client = await getClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(`Auth sessionini olishda xatolik: ${error.message}`);
  if (!data.session) throw new Error("Admin login required");

  const { session } = data;
  if (!session.user?.email) throw new Error("Sessionda email yo'q, qayta kiring");

  const { data: isAdmin, error: adminError } = await client.rpc("is_store_admin");
  if (adminError) throw new Error(`Admin huquqni tekshirib bo'lmadi: ${adminError.message}`);
  if (!isAdmin) {
    throw new Error(`Bu session store_admins ro'yxatida yo'q. Session email: ${session.user.email}`);
  }

  return session;
};

const writeError = (action, error, email) => {
  if (error.code === "42501") {
    return new Error(
      `${action}: RLS policy rad etdi. Session email: ${email}. store_admins dagi email bilan solishtiring.`,
    );
  }
  if (error.code === "PGRST204" || error.code === "42703") {
    return new Error(
      `${action}: Ma'lumotlar bazasi sxemasi yangilanmagan. supabase/ecommerce_setup.sql faylini Supabase SQL Editor'da bajaring.`,
    );
  }
  return new Error(`${action}: ${error.message}`);
};

const parseSizes = (value) => {
  if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(Number).filter(Number.isFinite);
    } catch {
      return value
        .split(",")
        .map((size) => Number(size.trim()))
        .filter(Number.isFinite);
    }
  }
  return [];
};

const parseGallery = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item);
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const fromRow = (row) => {
  const galleryUrls = parseGallery(row.gallery_urls ?? row.galleryUrls);
  const image = row.image_url || row.image || galleryUrls[0] || "";
  const name = row.name_uz || row.name || row.Name || row.name_ru || "Yangi mahsulot";

  return {
    id: row.id,
    name,
    nameUz: row.name_uz || row.nameUz || row.Name || name,
    nameRu: row.name_ru || row.nameRu || row.Name || name,
    descriptionUz: row.description_uz || row.descriptionUz || "",
    descriptionRu: row.description_ru || row.descriptionRu || "",
    image,
    image_url: image,
    price: Math.max(0, Number(row.Price ?? row.price) || 0),
    oldPrice:
      row.old_price == null && row.oldPrice == null
        ? null
        : Math.max(0, Number(row.old_price ?? row.oldPrice) || 0) || null,
    category: row.category || "Unisex",
    brand: row.brand || "",
    sizes: parseSizes(row.sizes),
    stock: row.stock == null ? null : Math.max(0, Number(row.stock) || 0),
    badge: row.badge || null,
    featured: Boolean(row.featured),
    galleryUrls,
    createdAt: row.created_at || row.createdAt || null,
  };
};

let schemaPromise = null;

/**
 * The storefront currently also works with the older three-column products
 * table. Probe optional columns once so writes remain compatible until the
 * new migration is applied.
 */
export function getProductSchemaSupport() {
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    const client = await getClient();
    const entries = await Promise.all(
      EXTENDED_COLUMNS.map(async (column) => {
        const { error } = await client.from("products").select(column).limit(1);
        return [column, !error];
      }),
    );
    return new Set(entries.filter(([, supported]) => supported).map(([column]) => column));
  })();

  return schemaPromise;
}

export async function hasExtendedProductSchema() {
  try {
    const supported = await getProductSchemaSupport();
    return EXTENDED_COLUMNS.every((column) => supported.has(column));
  } catch {
    return false;
  }
}

const uploadImageData = async (image, folder) => {
  if (!image || typeof image !== "string" || !image.startsWith("data:")) return image;
  const blob = await fetch(image).then((response) => response.blob());
  const extension = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;
  const client = await getClient();
  const { error } = await client.storage.from("product-images").upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type,
    upsert: false,
  });
  if (error) throw error;
  return client.storage.from("product-images").getPublicUrl(path).data.publicUrl;
};

const prepareImages = async (product) => {
  const folder = `${product.id ?? Date.now()}-${Math.random().toString(16).slice(2)}`;
  const primary = await uploadImageData(product.image_url || product.image, folder);
  const gallery = Array.isArray(product.galleryUrls) ? product.galleryUrls : [];
  const uploadedGallery = [];

  for (const image of gallery) {
    if (!image) continue;
    const uploaded = await uploadImageData(image, folder);
    if (uploaded && uploaded !== primary) uploadedGallery.push(uploaded);
  }

  return { primary, gallery: uploadedGallery };
};

const toRow = (product, schema, image, gallery) => {
  const name = product.name || product.nameUz || product.nameRu || "Yangi mahsulot";
  const row = {
    Name: name,
    Price: Math.max(0, Number(product.price) || 0),
    image_url: image || product.image_url || product.image || "",
  };

  if (schema.has("name_uz")) row.name_uz = product.nameUz || name;
  if (schema.has("name_ru")) row.name_ru = product.nameRu || name;
  if (schema.has("description_uz")) row.description_uz = product.descriptionUz || "";
  if (schema.has("description_ru")) row.description_ru = product.descriptionRu || "";
  if (schema.has("old_price")) row.old_price = product.oldPrice ? Number(product.oldPrice) : null;
  if (schema.has("category")) row.category = product.category || "Unisex";
  if (schema.has("brand")) row.brand = product.brand || null;
  if (schema.has("sizes")) row.sizes = Array.isArray(product.sizes) ? product.sizes : [];
  if (schema.has("stock")) {
    row.stock = product.stock === "" || product.stock == null ? null : Number(product.stock) || 0;
  }
  if (schema.has("badge")) row.badge = product.badge || null;
  if (schema.has("featured")) row.featured = Boolean(product.featured);
  if (schema.has("gallery_urls")) row.gallery_urls = gallery || [];
  if (schema.has("created_at") && product.createdAt) row.created_at = product.createdAt;

  return row;
};

export async function fetchRemoteProducts() {
  const client = await getClient();
  const { data, error } = await client.from("products").select("*");
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function createRemoteProduct(product) {
  const session = await requireAdminSession();
  const schema = await getProductSchemaSupport();

  let images;
  try {
    images = await prepareImages(product);
  } catch (error) {
    throw new Error(`Rasmni yuklash xatosi: ${error.message}`);
  }

  const client = await getClient();
  const { data, error } = await client
    .from("products")
    .insert(toRow(product, schema, images.primary, images.gallery))
    .select("*")
    .single();

  if (error) throw writeError("Product insert xatosi", error, session.user.email);
  return fromRow(data);
}

export async function updateRemoteProduct(product) {
  const session = await requireAdminSession();
  const schema = await getProductSchemaSupport();

  let images;
  try {
    images = await prepareImages(product);
  } catch (error) {
    throw new Error(`Rasmni yuklash xatosi: ${error.message}`);
  }

  const client = await getClient();
  const { data, error } = await client
    .from("products")
    .update(toRow(product, schema, images.primary, images.gallery))
    .eq("id", product.id)
    .select("*")
    .single();

  if (error) throw writeError("Product update xatosi", error, session.user.email);
  return fromRow(data);
}

export async function deleteRemoteProduct(id) {
  const session = await requireAdminSession();
  const client = await getClient();
  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw writeError("Product o'chirish xatosi", error, session.user.email);
}
