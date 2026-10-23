import { getSupabase } from "./supabase";

const BUCKET = "product-images";

const getClient = async () => {
  const client = await getSupabase();
  if (!client) throw new Error("Supabase Storage sozlanmagan");
  return client;
};

export const isProductImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.includes("/storage/v1/object/public/product-images/");
};

export const getStoragePathFromUrl = (url) => {
  if (!isProductImageUrl(url)) return null;
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
};

const blobFromDataUrl = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

const extensionFromBlob = (blob) => {
  if (blob.type === "image/png") return "png";
  if (blob.type === "image/webp") return "webp";
  return "jpg";
};

export async function uploadProductImage(image, folder = "products") {
  if (!image || typeof image !== "string") throw new Error("Rasm manbai topilmadi");
  if (image.startsWith("http")) return image;
  if (!image.startsWith("data:")) return image;

  const blob = await blobFromDataUrl(image);
  if (blob.size > 5 * 1024 * 1024) throw new Error("Rasm hajmi 5 MB dan oshmasligi kerak");
  if (!blob.type.startsWith("image/")) throw new Error("Faqat rasm fayli qabul qilinadi");

  const client = await getClient();
  const ext = extensionFromBlob(blob);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await client.storage.from(BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType: blob.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function removeProductImage(url) {
  const path = getStoragePathFromUrl(url);
  if (!path) return false;
  const client = await getClient();
  const { error } = await client.storage.from(BUCKET).remove([path]);
  if (error) throw error;
  return true;
}
